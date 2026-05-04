"""Add meeting_url column to bookings table

Revision ID: 002
Revises: 001
Create Date: 2026-05-04 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '002'
down_revision = '001'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('bookings', sa.Column('meeting_url', sa.String(length=500), nullable=True))


def downgrade() -> None:
    op.drop_column('bookings', 'meeting_url')
