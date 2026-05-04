from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.db.session import get_db
from app.schemas.invoice import InvoiceCreate, InvoiceUpdate, InvoiceResponse, InvoiceWithDetails
from app.models import Invoice, InvoiceStatus, Client, Booking
from app.core.security import get_current_user
from app.models import Staff as StaffModel
from app.services.invoice_service import generate_invoice_number, calculate_invoice_amount

router = APIRouter()


@router.post("/", response_model=InvoiceResponse, status_code=status.HTTP_201_CREATED)
async def create_invoice(
    invoice_data: InvoiceCreate,
    current_user: StaffModel = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new invoice with auto-generated invoice number.
    Requires authentication.
    """
    # Verify client exists
    client = db.query(Client).filter(Client.id == invoice_data.client_id).first()
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    
    # Verify booking exists if provided
    if invoice_data.booking_id:
        booking = db.query(Booking).filter(Booking.id == invoice_data.booking_id).first()
        if not booking:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Booking not found"
            )
    
    # Generate invoice number
    invoice_number = generate_invoice_number(db)
    
    # Set default due date to 30 days from now if not provided
    due_at = invoice_data.due_at or (datetime.utcnow() + timedelta(days=30))
    
    new_invoice = Invoice(
        invoice_number=invoice_number,
        client_id=invoice_data.client_id,
        booking_id=invoice_data.booking_id,
        amount=invoice_data.amount,
        status=InvoiceStatus.DRAFT,
        template_used=invoice_data.template_used,
        issued_at=datetime.utcnow(),
        due_at=due_at
    )
    db.add(new_invoice)
    db.commit()
    db.refresh(new_invoice)
    
    return InvoiceResponse.model_validate(new_invoice)


@router.get("/{invoice_id}", response_model=InvoiceWithDetails)
async def get_invoice(
    invoice_id: int,
    current_user: StaffModel = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific invoice by ID with client details.
    Requires authentication.
    """
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invoice not found"
        )
    
    client = db.query(Client).filter(Client.id == invoice.client_id).first()
    
    return InvoiceWithDetails(
        id=invoice.id,
        invoice_number=invoice.invoice_number,
        client_id=invoice.client_id,
        booking_id=invoice.booking_id,
        amount=invoice.amount,
        status=invoice.status,
        template_used=invoice.template_used,
        issued_at=invoice.issued_at,
        due_at=invoice.due_at,
        paid_at=invoice.paid_at,
        created_at=invoice.created_at,
        client_name=f"{client.first_name} {client.last_name}" if client else "Unknown",
        client_email=client.email if client else ""
    )


@router.get("/", response_model=list[InvoiceWithDetails])
async def list_invoices(
    client_id: int = Query(None),
    status_filter: InvoiceStatus = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    current_user: StaffModel = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    List invoices with optional filters by client and status.
    Requires authentication.
    
    - **client_id**: Filter by specific client
    - **status_filter**: Filter by invoice status
    - **skip**: Number of records to skip (pagination)
    - **limit**: Maximum number of records to return
    """
    query = db.query(Invoice)
    
    if client_id:
        query = query.filter(Invoice.client_id == client_id)
    
    if status_filter:
        query = query.filter(Invoice.status == status_filter)
    
    invoices = query.order_by(Invoice.created_at.desc()).offset(skip).limit(limit).all()
    
    result = []
    for invoice in invoices:
        client = db.query(Client).filter(Client.id == invoice.client_id).first()
        
        result.append(InvoiceWithDetails(
            id=invoice.id,
            invoice_number=invoice.invoice_number,
            client_id=invoice.client_id,
            booking_id=invoice.booking_id,
            amount=invoice.amount,
            status=invoice.status,
            template_used=invoice.template_used,
            issued_at=invoice.issued_at,
            due_at=invoice.due_at,
            paid_at=invoice.paid_at,
            created_at=invoice.created_at,
            client_name=f"{client.first_name} {client.last_name}" if client else "Unknown",
            client_email=client.email if client else ""
        ))
    
    return result


@router.put("/{invoice_id}", response_model=InvoiceResponse)
async def update_invoice(
    invoice_id: int,
    invoice_data: InvoiceUpdate,
    current_user: StaffModel = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update an invoice (amount, status, template, due date).
    Requires authentication.
    """
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invoice not found"
        )
    
    update_data = invoice_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(invoice, field, value)
    
    # Auto-set issued_at when status changes to sent
    if invoice_data.status == InvoiceStatus.SENT and not invoice.issued_at:
        invoice.issued_at = datetime.utcnow()
    
    # Auto-set paid_at when status changes to paid
    if invoice_data.status == InvoiceStatus.PAID and not invoice.paid_at:
        invoice.paid_at = datetime.utcnow()
    
    db.commit()
    db.refresh(invoice)
    
    return InvoiceResponse.model_validate(invoice)


@router.post("/{invoice_id}/mark-paid", response_model=InvoiceResponse)
async def mark_invoice_paid(
    invoice_id: int,
    current_user: StaffModel = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Mark an invoice as paid.
    Requires authentication.
    """
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invoice not found"
        )
    
    if invoice.status == InvoiceStatus.PAID:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invoice is already paid"
        )
    
    invoice.status = InvoiceStatus.PAID
    invoice.paid_at = datetime.utcnow()
    db.commit()
    db.refresh(invoice)
    
    return InvoiceResponse.model_validate(invoice)


@router.post("/{invoice_id}/send", response_model=InvoiceResponse)
async def send_invoice(
    invoice_id: int,
    current_user: StaffModel = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Mark an invoice as sent (changes status to sent and sets issued_at).
    Requires authentication.
    """
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invoice not found"
        )
    
    if invoice.status == InvoiceStatus.SENT:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invoice is already sent"
        )
    
    invoice.status = InvoiceStatus.SENT
    invoice.issued_at = datetime.utcnow()
    db.commit()
    db.refresh(invoice)
    
    return InvoiceResponse.model_validate(invoice)


@router.delete("/{invoice_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_invoice(
    invoice_id: int,
    current_user: StaffModel = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete an invoice permanently.
    Requires authentication.
    """
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id).first()
    if not invoice:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invoice not found"
        )
    
    if invoice.status == InvoiceStatus.PAID:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete a paid invoice"
        )
    
    db.delete(invoice)
    db.commit()

