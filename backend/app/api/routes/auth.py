from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from jose import JWTError

from app.core.security import (
    create_access_token, 
    create_refresh_token, 
    verify_token,
    get_password_hash, 
    verify_password,
    get_current_client
)
from app.core.config import settings
from app.db.session import get_db
from app.models import Client
from app.schemas.auth import (
    UserRegister, 
    UserLogin, 
    GoogleAuthRequest,
    PasswordResetRequest,
    PasswordResetConfirm,
    EmailVerifyRequest,
    TokenResponse,
    UserResponse
)
from app.services.email import send_verification_email, send_password_reset_email
import secrets
import google.oauth2.credentials
import google.auth.transport.requests
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from google.auth import exceptions as google_exceptions

router = APIRouter()

@router.post("/register", response_model=dict)
async def register(
    user_data: UserRegister,
    db: Session = Depends(get_db)
):
    """Register a new user"""
    # Check if user already exists
    existing_user = db.query(Client).filter(Client.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    verification_token = secrets.urlsafe_b32encode(secrets.token_bytes(32)).decode()
    
    new_user = Client(
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        email=user_data.email,
        phone=user_data.phone,
        hashed_password=hashed_password,
        auth_provider="local",
        verification_token=verification_token,
        is_verified=False
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Send verification email
    try:
        await send_verification_email(
            email=new_user.email,
            first_name=new_user.first_name,
            verification_token=verification_token
        )
    except Exception as e:
        print(f"Failed to send verification email: {e}")
    
    return {
        "message": "Registration successful. Check your email.",
        "user": {
            "id": new_user.id,
            "name": new_user.full_name,
            "email": new_user.email
        }
    }

@router.post("/login", response_model=TokenResponse)
async def login(
    user_data: UserLogin,
    db: Session = Depends(get_db)
):
    """Login user with email and password"""
    # Find user by email
    user = db.query(Client).filter(Client.email == user_data.email).first()
    if not user or not user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Verify password
    if not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Update last login
    user.last_login = datetime.utcnow()
    db.commit()
    
    # Create tokens
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    refresh_token_expires = timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    
    access_token = create_access_token(
        data={"sub": str(user.id), "user_type": "client"},
        expires_delta=access_token_expires
    )
    refresh_token = create_refresh_token(
        data={"sub": str(user.id), "user_type": "client"},
        expires_delta=refresh_token_expires
    )
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        user=UserResponse(
            id=user.id,
            first_name=user.first_name,
            last_name=user.last_name,
            email=user.email,
            auth_provider=user.auth_provider,
            is_verified=user.is_verified
        )
    )

@router.post("/google", response_model=TokenResponse)
async def google_auth(
    google_data: GoogleAuthRequest,
    db: Session = Depends(get_db)
):
    """Authenticate with Google OAuth"""
    try:
        # Verify Google ID token
        idinfo = id_token.verify_oauth2_token(
            google_data.google_token,
            google_requests.Request(),
            settings.GOOGLE_CLIENT_ID
        )
        
        email = idinfo.get('email')
        google_id = idinfo.get('sub')
        first_name = idinfo.get('given_name', '')
        last_name = idinfo.get('family_name', '')
        
        if not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid Google token"
            )
        
        # Check if user exists with Google ID
        user = db.query(Client).filter(Client.google_id == google_id).first()
        
        if user:
            # User exists with Google ID, login
            user.last_login = datetime.utcnow()
            db.commit()
        else:
            # Check if user exists with email but no Google ID
            user = db.query(Client).filter(Client.email == email).first()
            
            if user:
                # Link Google account to existing user
                user.google_id = google_id
                user.auth_provider = "google"
                user.is_verified = True  # Google accounts are pre-verified
                user.last_login = datetime.utcnow()
                db.commit()
            else:
                # Create new user from Google data
                new_user = Client(
                    first_name=first_name,
                    last_name=last_name,
                    email=email,
                    google_id=google_id,
                    auth_provider="google",
                    is_verified=True,
                    last_login=datetime.utcnow()
                )
                
                db.add(new_user)
                db.commit()
                user = new_user
        
        # Create tokens
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        refresh_token_expires = timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        
        access_token = create_access_token(
            data={"sub": str(user.id), "user_type": "client"},
            expires_delta=access_token_expires
        )
        refresh_token = create_refresh_token(
            data={"sub": str(user.id), "user_type": "client"},
            expires_delta=refresh_token_expires
        )
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            user=UserResponse(
                id=user.id,
                first_name=user.first_name,
                last_name=user.last_name,
                email=user.email,
                auth_provider=user.auth_provider,
                is_verified=user.is_verified
            )
        )
        
    except google_exceptions.GoogleAuthError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Google authentication failed: {str(e)}"
        )

@router.post("/forgot-password")
async def forgot_password(
    request: PasswordResetRequest,
    db: Session = Depends(get_db)
):
    """Send password reset email"""
    user = db.query(Client).filter(Client.email == request.email).first()
    
    if user:
        # Generate reset token
        reset_token = secrets.urlsafe_b32encode(secrets.token_bytes(32)).decode()
        reset_token_expires = datetime.utcnow() + timedelta(hours=2)
        
        user.reset_token = reset_token
        user.reset_token_expires = reset_token_expires
        db.commit()
        
        # Send reset email
        try:
            await send_password_reset_email(
                email=user.email,
                first_name=user.first_name,
                reset_token=reset_token
            )
        except Exception as e:
            print(f"Failed to send password reset email: {e}")
    
    # Always return success message
    return {"message": "If that email is registered, you'll receive reset instructions shortly."}

@router.post("/reset-password")
async def reset_password(
    request: PasswordResetConfirm,
    db: Session = Depends(get_db)
):
    """Reset password with token"""
    user = db.query(Client).filter(Client.reset_token == request.token).first()
    
    if not user or not user.reset_token_expires or user.reset_token_expires < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )
    
    # Update password
    user.hashed_password = get_password_hash(request.new_password)
    user.reset_token = None
    user.reset_token_expires = None
    db.commit()
    
    return {"message": "Password reset successfully"}

@router.post("/verify-email")
async def verify_email(
    request: EmailVerifyRequest,
    db: Session = Depends(get_db)
):
    """Verify email with token"""
    user = db.query(Client).filter(Client.verification_token == request.token).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification token"
        )
    
    user.is_verified = True
    user.verification_token = None
    db.commit()
    
    return {"message": "Email verified successfully"}

@router.post("/refresh", response_model=dict)
async def refresh_token(
    refresh_token: str,
    db: Session = Depends(get_db)
):
    """Refresh access token"""
    try:
        payload = verify_token(refresh_token)
        if not payload or payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )
        
        user_id = payload.get("sub")
        user_type = payload.get("user_type")
        
        if user_type != "client":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        
        user = db.query(Client).filter(Client.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        
        # Create new access token
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        new_access_token = create_access_token(
            data={"sub": str(user.id), "user_type": "client"},
            expires_delta=access_token_expires
        )
        
        return {"access_token": new_access_token}
        
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

@router.post("/logout")
async def logout():
    """Logout user (client should clear tokens)"""
    return {"message": "Logged out successfully"}

@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user: Client = Depends(get_current_client)
):
    """Get current user profile"""
    return UserResponse(
        id=current_user.id,
        first_name=current_user.first_name,
        last_name=current_user.last_name,
        email=current_user.email,
        auth_provider=current_user.auth_provider,
        is_verified=current_user.is_verified
    )


@router.patch("/me")
async def update_profile(
    profile_data: dict,
    current_client: Client = Depends(get_current_client),
    db: Session = Depends(get_db)
):
    """Update current user profile"""
    try:
        # Update allowed fields
        if "first_name" in profile_data:
            current_client.first_name = profile_data["first_name"]
        if "last_name" in profile_data:
            current_client.last_name = profile_data["last_name"]
        if "phone" in profile_data:
            current_client.phone = profile_data["phone"]
        if "emergency_contact" in profile_data:
            current_client.emergency_contact = profile_data["emergency_contact"]
        
        db.commit()
        db.refresh(current_client)
        
        return {
            "message": "Profile updated successfully",
            "user": UserResponse(
                id=current_client.id,
                first_name=current_client.first_name,
                last_name=current_client.last_name,
                email=current_client.email,
                auth_provider=current_client.auth_provider,
                is_verified=current_client.is_verified
            )
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to update profile: {str(e)}"
        )


@router.post("/change-password")
async def change_password(
    password_data: dict,
    current_client: Client = Depends(get_current_client),
    db: Session = Depends(get_db)
):
    """Change user password"""
    try:
        current_password = password_data.get("current_password")
        new_password = password_data.get("new_password")
        
        if not current_password or not new_password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Current password and new password are required"
            )
        
        # Verify current password
        if not verify_password(current_password, current_client.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Current password is incorrect"
            )
        
        # Update password
        current_client.hashed_password = hash_password(new_password)
        db.commit()
        
        return {"message": "Password changed successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to change password: {str(e)}"
        )


@router.delete("/delete-account")
async def delete_account(
    current_client: Client = Depends(get_current_client),
    db: Session = Depends(get_db)
):
    """Delete user account"""
    try:
        # Delete user's bookings first (or handle cascade)
        from app.models import Booking
        db.query(Booking).filter(Booking.client_id == current_client.id).delete()
        
        # Delete the client
        db.delete(current_client)
        db.commit()
        
        return {"message": "Account deleted successfully"}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to delete account: {str(e)}"
        )
