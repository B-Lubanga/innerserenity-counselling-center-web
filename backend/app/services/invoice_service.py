"""
Invoice service for business logic related to invoices.
Handles invoice number generation and template merging.
"""

from sqlalchemy.orm import Session
from typing import Optional
from app.models import Invoice, InvoiceTemplate, Booking, ServiceType, Client
from decimal import Decimal


def generate_invoice_number(db: Session) -> str:
    """
    Generate the next invoice number in the format 001, 002, etc.
    Finds the highest existing invoice number and increments it.
    """
    # Get the highest invoice number
    last_invoice = db.query(Invoice).order_by(Invoice.id.desc()).first()
    
    if last_invoice and last_invoice.invoice_number:
        # Extract numeric part and increment
        try:
            last_num = int(last_invoice.invoice_number)
            next_num = last_num + 1
        except ValueError:
            next_num = 1
    else:
        next_num = 1
    
    return f"{next_num:03d}"


def apply_invoice_template(db: Session, template_name: str, data: dict) -> str:
    """
    Apply an invoice template to generate invoice content.
    
    Args:
        db: Database session
        template_name: Name of the template to use
        data: Dictionary with invoice data (client, booking, amount, etc.)
    
    Returns:
        Merged template content as string
    """
    template = db.query(InvoiceTemplate).filter(
        InvoiceTemplate.name == template_name
    ).first()
    
    if not template:
        # Return default template if specified template not found
        return generate_default_invoice_content(data)
    
    if not template.content:
        return generate_default_invoice_content(data)
    
    # Simple template replacement
    content = template.content
    for key, value in data.items():
        placeholder = f"{{{{{key}}}}}"
        content = content.replace(placeholder, str(value))
    
    return content


def generate_default_invoice_content(data: dict) -> str:
    """
    Generate default invoice content when no template is available.
    """
    client = data.get("client_name", "Client")
    amount = data.get("amount", "0.00")
    invoice_number = data.get("invoice_number", "001")
    due_date = data.get("due_date", "N/A")
    
    return f"""
INVOICE #{invoice_number}

Bill To: {client}
Amount Due: ${amount}
Due Date: {due_date}

Thank you for your payment.
    """.strip()


def calculate_invoice_amount(db: Session, booking_id: Optional[int] = None, service_type_id: Optional[int] = None) -> Decimal:
    """
    Calculate invoice amount based on booking or service type.
    
    Args:
        db: Database session
        booking_id: Optional booking ID to base amount on
        service_type_id: Optional service type ID to base amount on
    
    Returns:
        Calculated amount as Decimal
    """
    if booking_id:
        booking = db.query(Booking).filter(Booking.id == booking_id).first()
        if booking and booking.service_type_id:
            service_type = db.query(ServiceType).filter(
                ServiceType.id == booking.service_type_id
            ).first()
            if service_type:
                return service_type.base_price
    
    if service_type_id:
        service_type = db.query(ServiceType).filter(
            ServiceType.id == service_type_id
        ).first()
        if service_type:
            return service_type.base_price
    
    return Decimal("0.00")
