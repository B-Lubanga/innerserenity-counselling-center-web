"""
Seed data for Inner Serenity Counselling Centre database.
Run this script to populate the database with realistic development data.
"""

import sys
import os
from datetime import datetime, timedelta
from decimal import Decimal

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from sqlalchemy.orm import Session
from app.db.session import engine
from app.models import (
    Staff, Role, Client, ServiceType, Availability,
    Booking, BookingStatus, SessionReport, Invoice,
    InvoiceStatus, InvoiceTemplate, Quote, QuoteStatus,
    Message, SenderType
)


def seed_service_types(session: Session):
    """Create service types."""
    service_types_data = [
        {
            "name": "individual",
            "description": "One-on-one counselling session",
            "duration_minutes": 60,
            "base_price": Decimal("3500.00")
        },
        {
            "name": "couples",
            "description": "Couples therapy session",
            "duration_minutes": 90,
            "base_price": Decimal("5000.00")
        },
        {
            "name": "group",
            "description": "Group therapy session",
            "duration_minutes": 60,
            "base_price": Decimal("1500.00")
        },
        {
            "name": "online",
            "description": "Video/online counselling session",
            "duration_minutes": 60,
            "base_price": Decimal("3000.00")
        },
    ]
    
    for data in service_types_data:
        existing = session.query(ServiceType).filter(ServiceType.name == data["name"]).first()
        if not existing:
            service_type = ServiceType(**data)
            session.add(service_type)
    
    session.commit()
    print("✓ Service types seeded")


def seed_staff(session: Session):
    """Create admin and counsellor accounts."""
    from app.core.security import get_password_hash
    
    staff_data = [
        {
            "name": "Admin User",
            "email": "admin@innerserenity.com",
            "hashed_password": get_password_hash("admin123"),
            "role": Role.ADMIN
        },
        {
            "name": "Dr. Sarah Johnson",
            "email": "sarah.johnson@innerserenity.com",
            "hashed_password": get_password_hash("counsellor123"),
            "role": Role.COUNSELLOR
        },
    ]
    
    staff = []
    for data in staff_data:
        existing = session.query(Staff).filter(Staff.email == data["email"]).first()
        if existing:
            staff.append(existing)
        else:
            new_staff = Staff(**data)
            session.add(new_staff)
            session.flush()
            staff.append(new_staff)
    
    session.commit()
    print("✓ Staff seeded")
    return staff


def seed_clients(session: Session):
    """Create client accounts."""
    clients_data = [
        {
            "first_name": "John",
            "last_name": "Kamau",
            "email": "john.kamau@example.com",
            "phone": "+254-712-345-678",
            "date_of_birth": datetime(1985, 5, 15),
            "emergency_contact": "Jane Kamau - +254-712-345-679",
            "notes": "Prefers morning sessions",
            "is_active": True
        },
        {
            "first_name": "Grace",
            "last_name": "Wanjiku",
            "email": "grace.wanjiku@example.com",
            "phone": "+254-723-456-789",
            "date_of_birth": datetime(1990, 8, 22),
            "emergency_contact": "James Wanjiku - +254-723-456-790",
            "notes": "Interested in couples therapy",
            "is_active": True
        },
        {
            "first_name": "Peter",
            "last_name": "Ochieng",
            "email": "peter.ochieng@example.com",
            "phone": "+254-734-567-890",
            "date_of_birth": datetime(1988, 3, 10),
            "emergency_contact": "Mary Ochieng - +254-734-567-891",
            "notes": "First-time client",
            "is_active": True
        },
        {
            "first_name": "Elizabeth",
            "last_name": "Muthoni",
            "email": "elizabeth.muthoni@example.com",
            "phone": "+254-745-678-901",
            "date_of_birth": datetime(1975, 11, 30),
            "emergency_contact": "David Muthoni - +254-745-678-902",
            "notes": "Prefers online sessions",
            "is_active": True
        },
        {
            "first_name": "Samuel",
            "last_name": "Omondi",
            "email": "samuel.omondi@example.com",
            "phone": "+254-756-789-012",
            "date_of_birth": datetime(1992, 7, 18),
            "emergency_contact": "Ruth Omondi - +254-756-789-013",
            "notes": "Dealing with anxiety",
            "is_active": True
        },
    ]
    
    clients = []
    for data in clients_data:
        existing = session.query(Client).filter(Client.email == data["email"]).first()
        if existing:
            clients.append(existing)
        else:
            new_client = Client(**data)
            session.add(new_client)
            session.flush()
            clients.append(new_client)
    
    session.commit()
    print("✓ Clients seeded")
    return clients


def seed_availability(session: Session, staff: list):
    """Create availability slots for counsellors."""
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    
    for staff_member in staff:
        if staff_member.role == Role.COUNSELLOR:
            for day in days:
                existing = session.query(Availability).filter(
                    Availability.counsellor_id == staff_member.id,
                    Availability.day_of_week == day
                ).first()
                if not existing:
                    availability = Availability(
                        counsellor_id=staff_member.id,
                        day_of_week=day,
                        start_time="09:00",
                        end_time="17:00",
                        is_active=True
                    )
                    session.add(availability)
    
    session.commit()
    print("✓ Availability seeded")


def seed_bookings(session: Session, clients: list, staff: list, service_types: list):
    """Create sample bookings."""
    bookings = []
    now = datetime.now()
    
    # Get counsellors
    counsellors = [s for s in staff if s.role == Role.COUNSELLOR]
    individual_service = next(s for s in service_types if s.name == "individual")
    
    bookings_data = [
        {
            "client": clients[0],
            "counsellor": counsellors[0],
            "service": individual_service,
            "scheduled": now + timedelta(days=2),
            "status": BookingStatus.CONFIRMED,
            "notes": "Initial consultation"
        },
        {
            "client": clients[1],
            "counsellor": counsellors[0],
            "service": next(s for s in service_types if s.name == "couples"),
            "scheduled": now + timedelta(days=3),
            "status": BookingStatus.PENDING,
            "notes": "Couples therapy - first session"
        },
        {
            "client": clients[2],
            "counsellor": counsellors[0],
            "service": individual_service,
            "scheduled": now - timedelta(days=1),
            "status": BookingStatus.COMPLETED,
            "notes": "Completed session"
        },
    ]
    
    for data in bookings_data:
        booking = Booking(
            client_id=data["client"].id,
            counsellor_id=data["counsellor"].id,
            service_type_id=data["service"].id,
            scheduled_at=data["scheduled"],
            status=data["status"],
            notes=data["notes"]
        )
        bookings.append(booking)
    
    session.add_all(bookings)
    session.commit()
    print("✓ Bookings seeded")
    return bookings


def seed_session_reports(session: Session, bookings: list, staff: list, clients: list):
    """Create sample session reports."""
    # Only create reports for completed bookings
    completed_bookings = [b for b in bookings if b.status == BookingStatus.COMPLETED]
    
    if completed_bookings:
        booking = completed_bookings[0]
        report = SessionReport(
            booking_id=booking.id,
            counsellor_id=booking.counsellor_id,
            client_id=booking.client_id,
            session_date=booking.scheduled_at,
            notes="Client showed good progress. Discussed anxiety management techniques.",
            goals="Reduce anxiety symptoms, improve sleep quality",
            progress="Client reports 30% improvement in anxiety levels",
            next_steps="Continue CBT exercises, schedule follow-up in 2 weeks"
        )
        session.add(report)
        session.commit()
        print("✓ Session reports seeded")


def seed_invoice_templates(session: Session):
    """Create default invoice template."""
    existing = session.query(InvoiceTemplate).filter(InvoiceTemplate.name == "Standard Invoice").first()
    if not existing:
        template = InvoiceTemplate(
            name="Standard Invoice",
            content='{"header": "Inner Serenity Counselling Centre", "footer": "Thank you for your payment"}',
            is_default=True
        )
        session.add(template)
        session.commit()
    print("✓ Invoice templates seeded")


def seed_invoices(session: Session, clients: list, bookings: list):
    """Create sample invoices."""
    now = datetime.now()
    
    invoices_data = [
        {
            "invoice_number": "001",
            "client": clients[0],
            "booking": bookings[0],
            "amount": Decimal("3500.00"),
            "status": InvoiceStatus.SENT,
            "issued": now - timedelta(days=1),
            "due": now + timedelta(days=14)
        },
        {
            "invoice_number": "002",
            "client": clients[2],
            "booking": bookings[2],
            "amount": Decimal("3500.00"),
            "status": InvoiceStatus.PAID,
            "issued": now - timedelta(days=7),
            "due": now - timedelta(days=1),
            "paid": now - timedelta(days=5)
        },
    ]
    
    for data in invoices_data:
        existing = session.query(Invoice).filter(Invoice.invoice_number == data["invoice_number"]).first()
        if not existing:
            invoice = Invoice(
                invoice_number=data["invoice_number"],
                client_id=data["client"].id,
                booking_id=data["booking"].id,
                amount=data["amount"],
                status=data["status"],
                template_used="Standard Invoice",
                issued_at=data["issued"],
                due_at=data["due"],
                paid_at=data.get("paid")
            )
            session.add(invoice)
    
    session.commit()
    print("✓ Invoices seeded")


def seed_quotes(session: Session, clients: list, service_types: list):
    """Create sample quotes."""
    individual_service = next(s for s in service_types if s.name == "individual")
    
    quotes_data = [
        {
            "client": clients[3],
            "service": individual_service,
            "price": Decimal("3000.00"),
            "status": QuoteStatus.SENT,
            "details": '{"sessions": 5, "discount": "10%"}'
        },
        {
            "client": None,  # Anonymous quote
            "service": next(s for s in service_types if s.name == "couples"),
            "price": Decimal("5000.00"),
            "status": QuoteStatus.DRAFT,
            "details": '{"sessions": 1, "inquiry": true}'
        },
    ]
    
    for data in quotes_data:
        quote = Quote(
            client_id=data["client"].id if data["client"] else None,
            service_type_id=data["service"].id,
            details=data["details"],
            estimated_price=data["price"],
            status=data["status"]
        )
        session.add(quote)
    
    session.commit()
    print("✓ Quotes seeded")


def seed_messages(session: Session, clients: list):
    """Create sample messages."""
    now = datetime.now()
    
    # Create a conversation thread
    session_id = "session_001"
    
    messages_data = [
        {
            "client": clients[0],
            "sender": SenderType.CLIENT,
            "content": "Hi, I'd like to book a session for next week.",
            "timestamp": now - timedelta(hours=2),
            "session_id": session_id
        },
        {
            "client": clients[0],
            "sender": SenderType.BOT,
            "content": "Hello! I'd be happy to help you book a session. Please visit our booking page to select a time that works for you.",
            "timestamp": now - timedelta(hours=1, minutes=55),
            "session_id": session_id
        },
        {
            "client": clients[0],
            "sender": SenderType.CLIENT,
            "content": "Thank you, I'll check the availability now.",
            "timestamp": now - timedelta(hours=1, minutes=50),
            "session_id": session_id
        },
    ]
    
    for data in messages_data:
        message = Message(
            client_id=data["client"].id,
            sender_type=data["sender"],
            content=data["content"],
            timestamp=data["timestamp"],
            session_id=data["session_id"]
        )
        session.add(message)
    
    session.commit()
    print("✓ Messages seeded")


def main():
    """Run all seed functions."""
    print("Starting database seeding...")
    
    with Session(engine) as session:
        # Seed data with upsert logic (safe to run multiple times)
        service_types = seed_service_types(session)
        staff = seed_staff(session)
        clients = seed_clients(session)
        seed_availability(session, staff)
        bookings = seed_bookings(session, clients, staff, service_types)
        seed_session_reports(session, bookings, staff, clients)
        seed_invoice_templates(session)
        seed_invoices(session, clients, bookings)
        seed_quotes(session, clients, service_types)
        seed_messages(session, clients)
    
    print("\n✅ Database seeding completed successfully!")


if __name__ == "__main__":
    main()
