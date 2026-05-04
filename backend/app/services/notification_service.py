"""
Notification service for sending email and WhatsApp notifications.
This is a placeholder implementation that can be extended with actual
email/WhatsApp integration (e.g., SendGrid, Twilio, etc.).
"""

from typing import Optional, Dict, Any
from app.core.config import settings


async def send_email(
    to_email: str,
    subject: str,
    body: str,
    html_body: Optional[str] = None
) -> bool:
    """
    Send an email notification.
    
    Args:
        to_email: Recipient email address
        subject: Email subject
        body: Plain text email body
        html_body: Optional HTML email body
    
    Returns:
        True if sent successfully, False otherwise
    
    Note:
        This is a placeholder implementation. Integrate with your email
        service provider (e.g., SendGrid, AWS SES, Mailgun) here.
    """
    # TODO: Implement actual email sending logic
    # Example integration with SendGrid:
    # from sendgrid import SendGridAPIClient
    # from sendgrid.helpers.mail import Mail
    # 
    # message = Mail(
    #     from_email='noreply@innerserenity.com',
    #     to_emails=to_email,
    #     subject=subject,
    #     plain_text_content=body,
    #     html_content=html_body
    # )
    # 
    # try:
    #     sg = SendGridAPIClient(settings.SENDGRID_API_KEY)
    #     response = sg.send(message)
    #     return response.status_code == 202
    # except Exception as e:
    #     print(f"Failed to send email: {e}")
    #     return False
    
    print(f"[EMAIL] To: {to_email}, Subject: {subject}")
    print(f"[EMAIL] Body: {body[:100]}...")
    return True


async def send_whatsapp(
    to_phone: str,
    message: str
) -> bool:
    """
    Send a WhatsApp message notification.
    
    Args:
        to_phone: Recipient phone number (with country code)
        message: Message content
    
    Returns:
        True if sent successfully, False otherwise
    
    Note:
        This is a placeholder implementation. Integrate with your WhatsApp
        service provider (e.g., Twilio, WhatsApp Business API) here.
    """
    # TODO: Implement actual WhatsApp sending logic
    # Example integration with Twilio:
    # from twilio.rest import Client
    # 
    # client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    # 
    # try:
    #     message = client.messages.create(
    #         body=message,
    #         from_=f'whatsapp:{settings.WHATSAPP_NUMBER}',
    #         to=f'whatsapp:{to_phone}'
    #     )
    #     return message.status == 'queued'
    # except Exception as e:
    #     print(f"Failed to send WhatsApp: {e}")
    #     return False
    
    print(f"[WHATSAPP] To: {to_phone}, Message: {message[:100]}...")
    return True


async def send_booking_confirmation(
    client_email: str,
    client_phone: Optional[str],
    client_name: str,
    booking_date: str,
    booking_time: str,
    counsellor_name: str
) -> Dict[str, bool]:
    """
    Send booking confirmation notifications via email and WhatsApp.
    
    Args:
        client_email: Client's email address
        client_phone: Optional client's phone number
        client_name: Client's name
        booking_date: Date of the booking
        booking_time: Time of the booking
        counsellor_name: Name of the counsellor
    
    Returns:
        Dictionary with success status for each channel
    """
    subject = f"Booking Confirmation - {booking_date} at {booking_time}"
    body = f"""
Dear {client_name},

Your booking has been confirmed.

Date: {booking_date}
Time: {booking_time}
Counsellor: {counsellor_name}

Please arrive 10 minutes early for your session.

If you need to reschedule or cancel, please contact us at least 24 hours in advance.

Best regards,
Inner Serenity Counselling Center
    """.strip()
    
    email_sent = await send_email(client_email, subject, body)
    
    whatsapp_sent = False
    if client_phone and settings.WHATSAPP_NUMBER:
        whatsapp_message = f"Hi {client_name}, your booking is confirmed for {booking_date} at {booking_time} with {counsellor_name}. See you there!"
        whatsapp_sent = await send_whatsapp(client_phone, whatsapp_message)
    
    return {"email": email_sent, "whatsapp": whatsapp_sent}


async def send_invoice_notification(
    client_email: str,
    client_phone: Optional[str],
    client_name: str,
    invoice_number: str,
    amount: str,
    due_date: str
) -> Dict[str, bool]:
    """
    Send invoice notifications via email and WhatsApp.
    
    Args:
        client_email: Client's email address
        client_phone: Optional client's phone number
        client_name: Client's name
        invoice_number: Invoice number
        amount: Invoice amount
        due_date: Invoice due date
    
    Returns:
        Dictionary with success status for each channel
    """
    subject = f"Invoice #{invoice_number} - Inner Serenity Counselling Center"
    body = f"""
Dear {client_name},

Please find attached invoice #{invoice_number} for your recent services.

Amount: {amount}
Due Date: {due_date}

Payment can be made via:
- Bank Transfer
- Mobile Money
- In-person at our office

If you have any questions, please don't hesitate to contact us.

Best regards,
Inner Serenity Counselling Center
    """.strip()
    
    email_sent = await send_email(client_email, subject, body)
    
    whatsapp_sent = False
    if client_phone and settings.WHATSAPP_NUMBER:
        whatsapp_message = f"Hi {client_name}, invoice #{invoice_number} for {amount} is now available. Due date: {due_date}."
        whatsapp_sent = await send_whatsapp(client_phone, whatsapp_message)
    
    return {"email": email_sent, "whatsapp": whatsapp_sent}


async def send_session_reminder(
    client_email: str,
    client_phone: Optional[str],
    client_name: str,
    session_date: str,
    session_time: str,
    counsellor_name: str
) -> Dict[str, bool]:
    """
    Send session reminder notifications via email and WhatsApp.
    
    Args:
        client_email: Client's email address
        client_phone: Optional client's phone number
        client_name: Client's name
        session_date: Date of the session
        session_time: Time of the session
        counsellor_name: Name of the counsellor
    
    Returns:
        Dictionary with success status for each channel
    """
    subject = f"Reminder: Session Tomorrow - {session_date} at {session_time}"
    body = f"""
Dear {client_name},

This is a friendly reminder about your upcoming session.

Date: {session_date}
Time: {session_time}
Counsellor: {counsellor_name}

Please arrive 10 minutes early for your session.

If you need to reschedule or cancel, please contact us at least 24 hours in advance.

Best regards,
Inner Serenity Counselling Center
    """.strip()
    
    email_sent = await send_email(client_email, subject, body)
    
    whatsapp_sent = False
    if client_phone and settings.WHATSAPP_NUMBER:
        whatsapp_message = f"Reminder: Your session with {counsellor_name} is tomorrow at {session_time}. See you there!"
        whatsapp_sent = await send_whatsapp(client_phone, whatsapp_message)
    
    return {"email": email_sent, "whatsapp": whatsapp_sent}
