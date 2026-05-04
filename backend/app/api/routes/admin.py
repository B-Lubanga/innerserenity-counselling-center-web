from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from datetime import datetime, timedelta
from decimal import Decimal
from app.db.session import get_db
from app.schemas.admin import (
    StaffLoginRequest, StaffLoginResponse, StaffCreate,
    StaffUpdate, StaffResponse, DashboardStats
)
from app.models import Staff, Client, Booking, BookingStatus, SessionReport, Invoice, InvoiceStatus
from app.core.security import verify_password, create_access_token, get_current_user, require_admin
from app.services.email_service import send_email
from app.services.logo_service import get_email_logo_data

router = APIRouter()


@router.post("/login", response_model=StaffLoginResponse)
async def staff_login(
    credentials: StaffLoginRequest,
    db: Session = Depends(get_db)
):
    """
    Authenticate staff member and return JWT token.
    
    - **email**: Staff member's email address
    - **password**: Staff member's password
    """
    staff = db.query(Staff).filter(Staff.email == credentials.email).first()
    
    if not staff or not verify_password(credentials.password, staff.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": str(staff.id)})
    
    return StaffLoginResponse(
        access_token=access_token,
        token_type="bearer",
        user=StaffResponse.model_validate(staff)
    )


@router.get("/staff", response_model=list[StaffResponse])
async def list_staff(
    current_user: Staff = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    List all staff members.
    Requires admin privileges.
    """
    staff = db.query(Staff).all()
    return [StaffResponse.model_validate(s) for s in staff]


@router.post("/staff", response_model=StaffResponse, status_code=status.HTTP_201_CREATED)
async def create_staff(
    staff_data: StaffCreate,
    current_user: Staff = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    Create a new staff member.
    Requires admin privileges.
    """
    # Check if email already exists
    existing = db.query(Staff).filter(Staff.email == staff_data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    from app.core.security import get_password_hash
    
    new_staff = Staff(
        name=staff_data.name,
        email=staff_data.email,
        hashed_password=get_password_hash(staff_data.password),
        role=staff_data.role
    )
    
    db.add(new_staff)
    db.commit()
    db.refresh(new_staff)
    
    return StaffResponse.model_validate(new_staff)


@router.get("/staff/{staff_id}", response_model=StaffResponse)
async def get_staff(
    staff_id: int,
    current_user: Staff = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    Get a specific staff member by ID.
    Requires admin privileges.
    """
    staff = db.query(Staff).filter(Staff.id == staff_id).first()
    if not staff:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Staff member not found"
        )
    
    return StaffResponse.model_validate(staff)


@router.put("/staff/{staff_id}", response_model=StaffResponse)
async def update_staff(
    staff_id: int,
    staff_data: StaffUpdate,
    current_user: Staff = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    Update a staff member.
    Requires admin privileges.
    """
    staff = db.query(Staff).filter(Staff.id == staff_id).first()
    if not staff:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Staff member not found"
        )
    
    # Check email uniqueness if email is being updated
    if staff_data.email and staff_data.email != staff.email:
        existing = db.query(Staff).filter(Staff.email == staff_data.email).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        staff.email = staff_data.email
    
    if staff_data.name:
        staff.name = staff_data.name
    
    if staff_data.password:
        from app.core.security import get_password_hash
        staff.hashed_password = get_password_hash(staff_data.password)
    
    if staff_data.role:
        staff.role = staff_data.role
    
    db.commit()
    db.refresh(staff)
    
    return StaffResponse.model_validate(staff)


@router.delete("/staff/{staff_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_staff(
    staff_id: int,
    current_user: Staff = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    Delete a staff member.
    Requires admin privileges.
    """
    staff = db.query(Staff).filter(Staff.id == staff_id).first()
    if not staff:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Staff member not found"
        )
    
    # Prevent deleting the last admin
    if staff.role == "admin":
        admin_count = db.query(Staff).filter(Staff.role == "admin").count()
        if admin_count <= 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot delete the last admin user"
            )
    
    db.delete(staff)
    db.commit()


@router.get("/dashboard", response_model=DashboardStats)
async def get_dashboard_stats(
    current_user: Staff = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get dashboard statistics.
    Available to all authenticated staff.
    """
    # Total clients
    total_clients = db.query(Client).filter(Client.is_active == True).count()
    
    # Total staff
    total_staff = db.query(Staff).count()
    
    # Active bookings (confirmed and scheduled in future)
    now = datetime.utcnow()
    active_bookings = db.query(Booking).filter(
        and_(
            Booking.status == BookingStatus.CONFIRMED,
            Booking.scheduled_at > now
        )
    ).count()
    
    # Pending bookings
    pending_bookings = db.query(Booking).filter(
        Booking.status == BookingStatus.PENDING
    ).count()
    
    # Completed sessions this month
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    completed_sessions = db.query(SessionReport).filter(
        SessionReport.session_date >= month_start
    ).count()
    
    # Revenue this month (paid invoices)
    revenue_this_month = db.query(func.sum(Invoice.amount)).filter(
        and_(
            Invoice.status == InvoiceStatus.PAID,
            Invoice.paid_at >= month_start
        )
    ).scalar() or Decimal("0.00")
    
    return DashboardStats(
        total_clients=total_clients,
        total_staff=total_staff,
        active_bookings=active_bookings,
        pending_bookings=pending_bookings,
        completed_sessions=completed_sessions,
        revenue_this_month=revenue_this_month
    )


@router.get("/email-preview/{template_name}", response_class=HTMLResponse)
async def preview_email_template(
    template_name: str,
    current_user: Staff = Depends(require_admin)
):
    """
    Preview email templates with sample data.
    Only accessible by admin users.
    
    Available templates:
    - booking_inperson
    - booking_virtual
    - password_reset
    - email_verification
    """
    
    # Sample data for templates
    sample_data = {
        "booking_inperson": {
            "client_name": "Jane Smith",
            "service_type": "In-Person",
            "session_date": "Monday, 5 May 2025",
            "session_time": "2:00 PM",
            "duration": 60,
            "counsellor": "Caroline",
            "booking_reference": "#000123",
            "office_address": "123 Serenity Lane, Nairobi, Kenya",
            "logo_base64": get_email_logo_data()["logo_base64"]
        },
        "booking_virtual": {
            "client_name": "John Doe",
            "service_type": "Online",
            "session_date": "Tuesday, 6 May 2025",
            "session_time": "3:00 PM",
            "duration": 60,
            "counsellor": "Caroline",
            "booking_reference": "#000124",
            "office_address": "123 Serenity Lane, Nairobi, Kenya",
            "meeting_url": "https://meet.jit.si/innerserenity-124-abc12345",
            "logo_base64": get_email_logo_data()["logo_base64"]
        },
        "password_reset": {
            "first_name": "Sarah",
            "reset_url": "http://localhost:3000/auth/reset-password?token=abc123",
            "logo_base64": get_email_logo_data()["logo_base64"]
        },
        "email_verification": {
            "first_name": "Michael",
            "verify_url": "http://localhost:3000/auth/verify-email?token=def456",
            "logo_base64": get_email_logo_data()["logo_base64"]
        }
    }
    
    # Map template names to actual template files
    template_mapping = {
        "booking_inperson": "booking_confirmation_inperson",
        "booking_virtual": "booking_confirmation_virtual",
        "password_reset": "password_reset",
        "email_verification": "email_verification"
    }
    
    if template_name not in template_mapping:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Template '{template_name}' not found. Available templates: {list(template_mapping.keys())}"
        )
    
    # Get sample data for this template
    data = sample_data.get(template_name, {})
    
    # Render the template
    try:
        html_content = await send_email(
            to="preview@example.com",
            subject=f"Preview: {template_name}",
            template_name=template_mapping[template_name],
            template_data=data,
            is_html=True
        )
        
        # For preview, we'll return the rendered HTML directly
        # Note: send_email logs to console in dev mode, so we need to render manually
        from jinja2 import Environment, FileSystemLoader
        import os
        
        template_env = Environment(
            loader=FileSystemLoader(os.path.join(os.path.dirname(__file__), '../templates/emails')),
            autoescape=True
        )
        
        template = template_env.get_template(f"{template_mapping[template_name]}.html")
        rendered_html = template.render(data)
        
        return HTMLResponse(content=rendered_html)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error rendering template: {str(e)}"
        )

