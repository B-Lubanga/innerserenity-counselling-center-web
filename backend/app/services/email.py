from datetime import datetime
from typing import Dict, Any
from app.core.config import settings
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

async def send_verification_email(email: str, first_name: str, verification_token: str):
    """Send email verification email"""
    if not settings.FRONTEND_URL:
        print("FRONTEND_URL not configured, skipping email")
        return
    
    verification_url = f"{settings.FRONTEND_URL}/auth/verify-email?token={verification_token}"
    
    subject = "Verify your Inner Serenity account"
    body = f"""
    Hi {first_name},
    
    Thank you for registering with Inner Serenity Counselling Centre!
    
    Please click the link below to verify your email address:
    {verification_url}
    
    This link will expire in 24 hours.
    
    If you didn't create an account, please ignore this email.
    
    Best regards,
    Inner Serenity Counselling Centre
    """
    
    await send_email(email, subject, body)

async def send_password_reset_email(email: str, first_name: str, reset_token: str):
    """Send password reset email"""
    if not settings.FRONTEND_URL:
        print("FRONTEND_URL not configured, skipping email")
        return
    
    reset_url = f"{settings.FRONTEND_URL}/auth/reset-password?token={reset_token}"
    
    subject = "Reset your Inner Serenity password"
    body = f"""
    Hi {first_name},
    
    We received a request to reset your password for your Inner Serenity account.
    
    Click the link below to reset your password:
    {reset_url}
    
    This link will expire in 2 hours.
    
    If you didn't request a password reset, please ignore this email.
    
    Best regards,
    Inner Serenity Counselling Centre
    """
    
    await send_email(email, subject, body)

async def send_email(to_email: str, subject: str, body: str):
    """Send email using SMTP"""
    try:
        # Get email configuration from environment
        smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        smtp_port = int(os.getenv("SMTP_PORT", "587"))
        smtp_username = os.getenv("SMTP_USERNAME")
        smtp_password = os.getenv("SMTP_PASSWORD")
        from_email = os.getenv("FROM_EMAIL", smtp_username)
        
        if not smtp_username or not smtp_password:
            print("SMTP credentials not configured, skipping email")
            return
        
        # Create message
        msg = MIMEMultipart()
        msg['From'] = from_email
        msg['To'] = to_email
        msg['Subject'] = subject
        
        # Add body
        msg.attach(MIMEText(body, 'plain'))
        
        # Send email
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(smtp_username, smtp_password)
        text = msg.as_string()
        server.sendmail(from_email, to_email, text)
        server.quit()
        
        print(f"Email sent successfully to {to_email}")
        
    except Exception as e:
        print(f"Failed to send email to {to_email}: {str(e)}")
        raise
