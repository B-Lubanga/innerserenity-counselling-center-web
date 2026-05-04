from pydantic import BaseModel, EmailStr
from typing import Optional

class UserRegister(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class GoogleAuthRequest(BaseModel):
    google_token: str

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str

class EmailVerifyRequest(BaseModel):
    token: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
    user: "UserResponse"

class UserResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    auth_provider: str
    is_verified: bool

class TokenData(BaseModel):
    sub: Optional[str] = None
    user_type: Optional[str] = None
