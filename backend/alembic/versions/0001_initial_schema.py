"""Initial schema creation

Revision ID: 001
Revises: 
Create Date: 2026-04-30 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create staff table
    op.create_table(
        'staff',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('hashed_password', sa.String(length=255), nullable=False),
        sa.Column('role', sa.Enum('admin', 'counsellor', name='role'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
    )
    op.create_index('idx_staff_email', 'staff', ['email'])
    op.create_index('idx_staff_role', 'staff', ['role'])

    # Create clients table
    op.create_table(
        'clients',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('first_name', sa.String(length=255), nullable=False),
        sa.Column('last_name', sa.String(length=255), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('phone', sa.String(length=50), nullable=True),
        sa.Column('date_of_birth', sa.DateTime(timezone=True), nullable=True),
        sa.Column('emergency_contact', sa.String(length=255), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True, server_default='true'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
    )
    op.create_index('idx_clients_email', 'clients', ['email'])
    op.create_index('idx_clients_active', 'clients', ['is_active'])

    # Create service_types table
    op.create_table(
        'service_types',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('duration_minutes', sa.Integer(), nullable=False),
        sa.Column('base_price', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name')
    )

    # Create availability table
    op.create_table(
        'availability',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('counsellor_id', sa.Integer(), nullable=False),
        sa.Column('day_of_week', sa.String(length=20), nullable=False),
        sa.Column('start_time', sa.String(length=10), nullable=False),
        sa.Column('end_time', sa.String(length=10), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=True, server_default='true'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
        sa.ForeignKeyConstraint(['counsellor_id'], ['staff.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_availability_counsellor', 'availability', ['counsellor_id'])
    op.create_index('idx_availability_day', 'availability', ['day_of_week'])

    # Create bookings table
    op.create_table(
        'bookings',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('client_id', sa.Integer(), nullable=False),
        sa.Column('counsellor_id', sa.Integer(), nullable=False),
        sa.Column('service_type_id', sa.Integer(), nullable=False),
        sa.Column('scheduled_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('status', sa.Enum('pending', 'confirmed', 'cancelled', 'completed', name='bookingstatus'), nullable=False),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
        sa.ForeignKeyConstraint(['client_id'], ['clients.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['counsellor_id'], ['staff.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['service_type_id'], ['service_types.id'], ondelete='RESTRICT'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_bookings_client', 'bookings', ['client_id'])
    op.create_index('idx_bookings_counsellor', 'bookings', ['counsellor_id'])
    op.create_index('idx_bookings_scheduled', 'bookings', ['scheduled_at'])
    op.create_index('idx_bookings_status', 'bookings', ['status'])

    # Create session_reports table
    op.create_table(
        'session_reports',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('booking_id', sa.Integer(), nullable=False),
        sa.Column('counsellor_id', sa.Integer(), nullable=False),
        sa.Column('client_id', sa.Integer(), nullable=False),
        sa.Column('session_date', sa.DateTime(timezone=True), nullable=False),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('goals', sa.Text(), nullable=True),
        sa.Column('progress', sa.Text(), nullable=True),
        sa.Column('next_steps', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
        sa.ForeignKeyConstraint(['booking_id'], ['bookings.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['counsellor_id'], ['staff.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['client_id'], ['clients.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_session_reports_booking', 'session_reports', ['booking_id'])
    op.create_index('idx_session_reports_client', 'session_reports', ['client_id'])
    op.create_index('idx_session_reports_date', 'session_reports', ['session_date'])

    # Create invoice_templates table
    op.create_table(
        'invoice_templates',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('content', sa.Text(), nullable=True),
        sa.Column('is_default', sa.Boolean(), nullable=True, server_default='false'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )

    # Create invoices table
    op.create_table(
        'invoices',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('invoice_number', sa.String(length=20), nullable=False),
        sa.Column('client_id', sa.Integer(), nullable=False),
        sa.Column('booking_id', sa.Integer(), nullable=True),
        sa.Column('amount', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column('status', sa.Enum('draft', 'sent', 'paid', 'overdue', name='invoicestatus'), nullable=False),
        sa.Column('template_used', sa.String(length=255), nullable=True),
        sa.Column('issued_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('due_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('paid_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
        sa.ForeignKeyConstraint(['booking_id'], ['bookings.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['client_id'], ['clients.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('invoice_number')
    )
    op.create_index('idx_invoices_number', 'invoices', ['invoice_number'])
    op.create_index('idx_invoices_client', 'invoices', ['client_id'])
    op.create_index('idx_invoices_status', 'invoices', ['status'])
    op.create_index('idx_invoices_due', 'invoices', ['due_at'])

    # Create quotes table
    op.create_table(
        'quotes',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('client_id', sa.Integer(), nullable=True),
        sa.Column('service_type_id', sa.Integer(), nullable=False),
        sa.Column('details', sa.Text(), nullable=True),
        sa.Column('estimated_price', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column('status', sa.Enum('draft', 'sent', 'accepted', 'declined', 'expired', name='quotestatus'), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
        sa.ForeignKeyConstraint(['client_id'], ['clients.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['service_type_id'], ['service_types.id'], ondelete='RESTRICT'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_quotes_client', 'quotes', ['client_id'])
    op.create_index('idx_quotes_status', 'quotes', ['status'])

    # Create messages table
    op.create_table(
        'messages',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('client_id', sa.Integer(), nullable=True),
        sa.Column('sender_type', sa.Enum('client', 'bot', 'admin', name='sendertype'), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('timestamp', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
        sa.Column('session_id', sa.String(length=255), nullable=True),
        sa.ForeignKeyConstraint(['client_id'], ['clients.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_messages_client', 'messages', ['client_id'])
    op.create_index('idx_messages_session', 'messages', ['session_id'])
    op.create_index('idx_messages_timestamp', 'messages', ['timestamp'])


def downgrade() -> None:
    op.drop_index('idx_messages_timestamp', table_name='messages')
    op.drop_index('idx_messages_session', table_name='messages')
    op.drop_index('idx_messages_client', table_name='messages')
    op.drop_table('messages')
    
    op.drop_index('idx_quotes_status', table_name='quotes')
    op.drop_index('idx_quotes_client', table_name='quotes')
    op.drop_table('quotes')
    
    op.drop_index('idx_invoices_due', table_name='invoices')
    op.drop_index('idx_invoices_status', table_name='invoices')
    op.drop_index('idx_invoices_client', table_name='invoices')
    op.drop_index('idx_invoices_number', table_name='invoices')
    op.drop_table('invoices')
    
    op.drop_table('invoice_templates')
    
    op.drop_index('idx_session_reports_date', table_name='session_reports')
    op.drop_index('idx_session_reports_client', table_name='session_reports')
    op.drop_index('idx_session_reports_booking', table_name='session_reports')
    op.drop_table('session_reports')
    
    op.drop_index('idx_bookings_status', table_name='bookings')
    op.drop_index('idx_bookings_scheduled', table_name='bookings')
    op.drop_index('idx_bookings_counsellor', table_name='bookings')
    op.drop_index('idx_bookings_client', table_name='bookings')
    op.drop_table('bookings')
    
    op.drop_index('idx_availability_day', table_name='availability')
    op.drop_index('idx_availability_counsellor', table_name='availability')
    op.drop_table('availability')
    
    op.drop_table('service_types')
    
    op.drop_index('idx_clients_active', table_name='clients')
    op.drop_index('idx_clients_email', table_name='clients')
    op.drop_table('clients')
    
    op.drop_index('idx_staff_role', table_name='staff')
    op.drop_index('idx_staff_email', table_name='staff')
    op.drop_table('staff')
