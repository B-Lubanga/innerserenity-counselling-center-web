from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from jinja2 import Environment, FileSystemLoader
from app.core.config import settings
import os
from typing import Dict, Any, Optional
from datetime import datetime

# FastAPI Mail configuration
conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_FROM_NAME=settings.MAIL_FROM_NAME,
    MAIL_STARTTLS=settings.MAIL_STARTTLS,
    MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

# Jinja2 environment for templates
template_env = Environment(
    loader=FileSystemLoader(os.path.join(os.path.dirname(__file__), '../templates/emails')),
    autoescape=True
)

async def send_email(
    to: str,
    subject: str,
    template_name: str,
    template_data: Dict[str, Any],
    is_html: bool = True
) -> bool:
    """
    Send email using FastAPI Mail with Jinja2 templates
    
    Args:
        to: Recipient email address
        subject: Email subject
        template_name: Name of the template file (without .html)
        template_data: Data to pass to the template
        is_html: Whether to send as HTML (default: True)
    
    Returns:
        bool: True if email sent successfully, False otherwise
    """
    try:
        # Check if email configuration is set up
        if not settings.MAIL_USERNAME or not settings.MAIL_PASSWORD:
            # Development mode: log email content instead of sending
            print(f"[DEV EMAIL] To: {to}")
            print(f"[DEV EMAIL] Subject: {subject}")
            print(f"[DEV EMAIL] Template: {template_name}")
            
            template = template_env.get_template(f"{template_name}.html")
            email_content = template.render(template_data)
            print(f"[DEV EMAIL] Content:")
            print("=" * 50)
            print(email_content)
            print("=" * 50)
            return True
        
        # Render template
        template = template_env.get_template(f"{template_name}.html")
        email_content = template.render(template_data)
        
        # Create message
        message = MessageSchema(
            subject=subject,
            recipients=[to],
            body=email_content,
            subtype="html" if is_html else "plain"
        )
        
        # Send email
        fm = FastMail(conf)
        await fm.send_message(message)
        
        print(f"Email sent successfully to {to}")
        return True
        
    except Exception as e:
        print(f"Failed to send email to {to}: {str(e)}")
        return False

async def send_booking_confirmation(
    booking: Any,
    client: Any,
    service_type: str,
    counsellor: str = "Caroline",
    office_address: str = "123 Serenity Lane, Nairobi, Kenya"
) -> bool:
    """
    Send booking confirmation email
    
    Args:
        booking: Booking object/session
        client: Client object
        service_type: "online" or "in-person"
        counsellor: Counsellor name
        office_address: Office address for in-person sessions
    
    Returns:
        bool: True if email sent successfully
    """
    # Format date and time
    session_date = booking.session_date.strftime("%A, %d %B %Y")
    session_time = booking.session_time.strftime("%I:%M %p")
    
    # Determine template based on service type
    template_name = "booking_confirmation_inperson" if service_type == "in-person" else "booking_confirmation_virtual"
    
    # Prepare template data
    template_data = {
        "client_name": f"{client.first_name} {client.last_name}",
        "service_type": service_type.title(),
        "session_date": session_date,
        "session_time": session_time,
        "duration": booking.duration_minutes,
        "counsellor": counsellor,
        "booking_reference": f"#{booking.id:06d}",
        "office_address": office_address,
        "meeting_url": getattr(booking, 'meeting_url', ''),
        "logo_url": "https://innerserenity.co.ke/logo.png",  # Will be replaced with base64
        "logo_base64": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgMjAwIDYwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjNDI0NTMwIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMzUiIGZvbnQtZmFtaWx5PSJQbGF5ZmFpciBEaXNwbGF5IiBmb250LXNpemU9IjI0IiBmaWxsPSIjRkZGRkZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Jbm5lciBTZXJlbml0eTwvdGV4dD4KPHRleHQgeD0iMTAwIiB5PSI0NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjRkZGRkZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Db3Vuc2VsbGluZyBDZW50cmU8L3RleHQ+Cjwvc3ZnPg=="  # Base64 encoded SVG logo
    }
    
    # Add meeting URL for virtual sessions
    if service_type == "online":
        template_data["meeting_url"] = getattr(booking, 'meeting_url', 'https://meet.innerserenity.co.ke/session/' + str(booking.id))
    
    subject = f"Booking Confirmed – Inner Serenity Counselling Centre"
    
    return await send_email(
        to=client.email,
        subject=subject,
        template_name=template_name,
        template_data=template_data
    )

async def send_password_reset_email(
    client: Any,
    reset_url: str
) -> bool:
    """
    Send password reset email
    
    Args:
        client: Client object
        reset_url: Password reset URL
    
    Returns:
        bool: True if email sent successfully
    """
    template_data = {
        "first_name": client.first_name,
        "reset_url": reset_url,
        "logo_base64": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgMjAwIDYwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjNDI0NTMwIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMzUiIGZvbnQtZmFtaWx5PSJQbGF5ZmFpciBEaXNwbGF5IiBmb250LXNpemU9IjI0IiBmaWxsPSIjRkZGRkZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Jbm5lciBTZXJlbml0eTwvdGV4dD4KPHRleHQgeD0iMTAwIiB5PSI0NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjRkZGRkZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Db3Vuc2VsbGluZyBDZW50cmU8L3RleHQ+Cjwvc3ZnPg=="
    }
    
    subject = "Reset Your Password – Inner Serenity"
    
    return await send_email(
        to=client.email,
        subject=subject,
        template_name="password_reset",
        template_data=template_data
    )

async def send_email_verification(
    client: Any,
    verify_url: str
) -> bool:
    """
    Send email verification email
    
    Args:
        client: Client object
        verify_url: Email verification URL
    
    Returns:
        bool: True if email sent successfully
    """
    template_data = {
        "first_name": client.first_name,
        "verify_url": verify_url,
        "logo_base64": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgMjAwIDYwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjNDI0NTMwIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMzUiIGZvbnQtZmFtaWx5PSJQbGF5ZmFpciBEaXNwbGF5IiBmb250LXNpemU9IjI0IiBmaWxsPSIjRkZGRkZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Jbm5lciBTZXJlbml0eTwvdGV4dD4KPHRleHQgeD0iMTAwIiB5PSI0NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjRkZGRkZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Db3Vuc2VsbGluZyBDZW50cmU8L3RleHQ+Cjwvc3ZnPg=="
    }
    
    subject = "Verify Your Email – Inner Serenity"
    
    return await send_email(
        to=client.email,
        subject=subject,
        template_name="email_verification",
        template_data=template_data
    )

async def send_booking_reminder(
    booking: Any,
    client: Any,
    service_type: str,
    counsellor: str = "Caroline",
    office_address: str = "123 Serenity Lane, Nairobi, Kenya"
) -> bool:
    """
    Send booking reminder email (24 hours before session)
    
    Args:
        booking: Booking object/session
        client: Client object
        service_type: "online" or "in-person"
        counsellor: Counsellor name
        office_address: Office address for in-person sessions
    
    Returns:
        bool: True if email sent successfully
    """
    # Format date and time
    session_date = booking.session_date.strftime("%A, %d %B %Y")
    session_time = booking.session_time.strftime("%I:%M %p")
    
    # Determine template based on service type
    template_name = "booking_reminder_inperson" if service_type == "in-person" else "booking_reminder_virtual"
    
    # Prepare template data
    template_data = {
        "client_name": f"{client.first_name} {client.last_name}",
        "service_type": service_type.title(),
        "session_date": session_date,
        "session_time": session_time,
        "duration": booking.duration_minutes,
        "counsellor": counsellor,
        "booking_reference": f"#{booking.id:06d}",
        "office_address": office_address,
        "meeting_url": getattr(booking, 'meeting_url', ''),
        "logo_base64": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgMjAwIDYwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjNDI0NTMwIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMzUiIGZvbnQtZmFtaWx5PSJQbGF5ZmFpciBEaXNwbGF5IiBmb250LXNpemU9IjI0IiBmaWxsPSIjRkZGRkZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Jbm5lciBTZXJlbml0eTwvdGV4dD4KPHRleHQgeD0iMTAwIiB5PSI0NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjRkZGRkZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Db3Vuc2VsbGluZyBDZW50cmU8L3RleHQ+Cjwvc3ZnPg=="
    }
    
    # Add meeting URL for virtual sessions
    if service_type == "online":
        template_data["meeting_url"] = getattr(booking, 'meeting_url', 'https://meet.innerserenity.co.ke/session/' + str(booking.id))
    
    subject = f"Reminder: Your Session Tomorrow – Inner Serenity Counselling Centre"
    
    return await send_email(
        to=client.email,
        subject=subject,
        template_name=template_name,
        template_data=template_data
    )
