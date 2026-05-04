from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.db.session import get_db
from app.schemas.client import (
    ClientCreate, ClientUpdate, ClientResponse, 
    ClientHistory, SessionHistoryItem, InvoiceHistoryItem
)
from app.models import Client, SessionReport, Invoice
from app.core.security import get_current_user
from app.models import Staff

router = APIRouter()


@router.post("/", response_model=ClientResponse, status_code=status.HTTP_201_CREATED)
async def create_client(
    client_data: ClientCreate,
    current_user: Staff = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new client.
    Requires authentication.
    """
    # Check if email already exists
    existing = db.query(Client).filter(Client.email == client_data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    new_client = Client(**client_data.model_dump())
    db.add(new_client)
    db.commit()
    db.refresh(new_client)
    
    return ClientResponse.model_validate(new_client)


@router.get("/{client_id}", response_model=ClientResponse)
async def get_client(
    client_id: int,
    current_user: Staff = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific client by ID.
    Requires authentication.
    """
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    
    return ClientResponse.model_validate(client)


@router.get("/", response_model=list[ClientResponse])
async def list_clients(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    search: str = Query(None),
    current_user: Staff = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    List all clients with optional search by name or email.
    Requires authentication.
    
    - **skip**: Number of records to skip (pagination)
    - **limit**: Maximum number of records to return
    - **search**: Search term to filter by first name, last name, or email
    """
    query = db.query(Client).filter(Client.is_active == True)
    
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                Client.first_name.ilike(search_pattern),
                Client.last_name.ilike(search_pattern),
                Client.email.ilike(search_pattern)
            )
        )
    
    clients = query.offset(skip).limit(limit).all()
    return [ClientResponse.model_validate(c) for c in clients]


@router.put("/{client_id}", response_model=ClientResponse)
async def update_client(
    client_id: int,
    client_data: ClientUpdate,
    current_user: Staff = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a client.
    Requires authentication.
    """
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    
    # Check email uniqueness if email is being updated
    if client_data.email and client_data.email != client.email:
        existing = db.query(Client).filter(Client.email == client_data.email).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        client.email = client_data.email
    
    update_data = client_data.model_dump(exclude_unset=True, exclude={"email"})
    for field, value in update_data.items():
        setattr(client, field, value)
    
    db.commit()
    db.refresh(client)
    
    return ClientResponse.model_validate(client)


@router.delete("/{client_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_client(
    client_id: int,
    current_user: Staff = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Soft delete a client (set is_active to False).
    Requires authentication.
    """
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    
    # Soft delete
    client.is_active = False
    db.commit()


@router.get("/{client_id}/history", response_model=ClientHistory)
async def get_client_history(
    client_id: int,
    current_user: Staff = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a client's complete history including all sessions and invoices.
    Requires authentication.
    """
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found"
        )
    
    # Get session reports
    session_reports = db.query(SessionReport).filter(
        SessionReport.client_id == client_id
    ).order_by(SessionReport.session_date.desc()).all()
    
    sessions = [
        SessionHistoryItem(
            id=s.id,
            session_date=s.session_date,
            goals=s.goals,
            progress=s.progress,
            next_steps=s.next_steps
        )
        for s in session_reports
    ]
    
    # Get invoices
    invoices = db.query(Invoice).filter(
        Invoice.client_id == client_id
    ).order_by(Invoice.created_at.desc()).all()
    
    invoice_history = [
        InvoiceHistoryItem(
            id=i.id,
            invoice_number=i.invoice_number,
            amount=i.amount,
            status=i.status.value,
            issued_at=i.issued_at,
            due_at=i.due_at,
            paid_at=i.paid_at
        )
        for i in invoices
    ]
    
    return ClientHistory(
        client=ClientResponse.model_validate(client),
        sessions=sessions,
        invoices=invoice_history
    )

