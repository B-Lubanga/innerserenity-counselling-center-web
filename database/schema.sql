-- Inner Serenity Counselling Center Database Schema
-- PostgreSQL schema for counselling centre management platform
-- Last updated: 2026-04-30

-- Enable UUID extension if needed
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Staff table (Admins and Counsellors)
CREATE TABLE IF NOT EXISTS staff (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'counsellor')) DEFAULT 'counsellor',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_staff_email ON staff(email);
CREATE INDEX idx_staff_role ON staff(role);

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    date_of_birth TIMESTAMP WITH TIME ZONE,
    emergency_contact VARCHAR(255),
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_active ON clients(is_active);

-- Service Types table
CREATE TABLE IF NOT EXISTS service_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL, -- individual, couples, group, online
    description TEXT,
    duration_minutes INTEGER NOT NULL,
    base_price DECIMAL(10, 2) NOT NULL
);

-- Availability table
CREATE TABLE IF NOT EXISTS availability (
    id SERIAL PRIMARY KEY,
    counsellor_id INTEGER NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    day_of_week VARCHAR(20) NOT NULL, -- Monday, Tuesday, etc.
    start_time VARCHAR(10) NOT NULL, -- HH:MM format
    end_time VARCHAR(10) NOT NULL, -- HH:MM format
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_availability_counsellor ON availability(counsellor_id);
CREATE INDEX idx_availability_day ON availability(day_of_week);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    counsellor_id INTEGER NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    service_type_id INTEGER NOT NULL REFERENCES service_types(id) ON DELETE RESTRICT,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bookings_client ON bookings(client_id);
CREATE INDEX idx_bookings_counsellor ON bookings(counsellor_id);
CREATE INDEX idx_bookings_scheduled ON bookings(scheduled_at);
CREATE INDEX idx_bookings_status ON bookings(status);

-- Session Reports table
CREATE TABLE IF NOT EXISTS session_reports (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    counsellor_id INTEGER NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    session_date TIMESTAMP WITH TIME ZONE NOT NULL,
    notes TEXT, -- Encrypted in production
    goals TEXT,
    progress TEXT,
    next_steps TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_session_reports_booking ON session_reports(booking_id);
CREATE INDEX idx_session_reports_client ON session_reports(client_id);
CREATE INDEX idx_session_reports_date ON session_reports(session_date);

-- Invoice Templates table
CREATE TABLE IF NOT EXISTS invoice_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    content TEXT, -- JSON structure
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
    id SERIAL PRIMARY KEY,
    invoice_number VARCHAR(20) UNIQUE NOT NULL, -- 001, 002, etc.
    client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    booking_id INTEGER REFERENCES bookings(id) ON DELETE SET NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('draft', 'sent', 'paid', 'overdue')) DEFAULT 'draft',
    template_used VARCHAR(255),
    issued_at TIMESTAMP WITH TIME ZONE,
    due_at TIMESTAMP WITH TIME ZONE,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_invoices_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_client ON invoices(client_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due ON invoices(due_at);

-- Quotes table
CREATE TABLE IF NOT EXISTS quotes (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id) ON DELETE SET NULL, -- Nullable for anonymous quotes
    service_type_id INTEGER NOT NULL REFERENCES service_types(id) ON DELETE RESTRICT,
    details JSONB, -- Flexible JSON structure for quote details
    estimated_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('draft', 'sent', 'accepted', 'declined', 'expired')) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quotes_client ON quotes(client_id);
CREATE INDEX idx_quotes_status ON quotes(status);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id) ON DELETE SET NULL, -- Nullable for anonymous
    sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('client', 'bot', 'admin')),
    content TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    session_id VARCHAR(255) -- For threading messages
);

CREATE INDEX idx_messages_client ON messages(client_id);
CREATE INDEX idx_messages_session ON messages(session_id);
CREATE INDEX idx_messages_timestamp ON messages(timestamp);

