-- Supabase Schema for OrderFlow App (UPDATED 2)
-- This version uses double quotes for column names (camelCase)
-- to perfectly match the existing React application state.
-- Please run this in the Supabase SQL Editor to replace the previous tables.

-- Reload schema cache to prevent PGRST errors
NOTIFY pgrst, 'reload schema';

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Drop existing tables if they exist to start fresh
DROP TABLE IF EXISTS branch_audit CASCADE;
DROP TABLE IF EXISTS order_audit CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS settings CASCADE;

-----------------------------------------
-- 1. EMPLOYEES
-----------------------------------------
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT,
    "employeeNumber" TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('manager', 'employee', 'seller')),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-----------------------------------------
-- 2. CUSTOMERS
-----------------------------------------
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "idNumber" TEXT UNIQUE, 
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-----------------------------------------
-- 3. ORDERS
-----------------------------------------
CREATE TABLE orders (
    id TEXT PRIMARY KEY,
    "customerId" UUID REFERENCES customers(id) ON DELETE SET NULL,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT,
    "customerEmail" TEXT,
    "customerIdNumber" TEXT,
    items TEXT,
    "orderDate" DATE,
    "dueTime" TEXT,
    "receiptNumber" TEXT,
    status TEXT DEFAULT 'in_progress' CHECK (status IN ('ready', 'in_progress', 'awaiting_update', 'delivered')),
    "paymentStatus" TEXT DEFAULT 'unpaid' CHECK ("paymentStatus" IN ('paid_full', 'paid_deposit', 'unpaid')),
    location TEXT DEFAULT 'in_store' CHECK (location IN ('in_store', 'on_the_way')),
    "sourceBranch" TEXT,
    "internalNotes" TEXT,
    "createdByEmployeeName" TEXT,
    "createdByEmployeeNumber" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    logs JSONB DEFAULT '[]'::jsonb
);

-----------------------------------------
-- 4. ORDER AUDIT 
-----------------------------------------
CREATE TABLE order_audit (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "orderId" TEXT REFERENCES orders(id) ON DELETE CASCADE,
    "userName" TEXT NOT NULL,
    "userNumber" TEXT,
    action TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-----------------------------------------
-- 5. BRANCH AUDIT
-----------------------------------------
CREATE TABLE branch_audit (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userName" TEXT NOT NULL,
    "userNumber" TEXT,
    "actionType" TEXT NOT NULL, 
    "actionDetails" TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-----------------------------------------
-- 6. SETTINGS
-----------------------------------------
CREATE TABLE settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    "whatsappTemplate" TEXT,
    "emailTemplate" TEXT,
    -- Ensure only one row exists for global settings
    CONSTRAINT single_row CHECK (id = 1)
);

-----------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-----------------------------------------
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE branch_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to employees" ON employees FOR ALL USING (true);
CREATE POLICY "Allow public access to customers" ON customers FOR ALL USING (true);
CREATE POLICY "Allow public access to orders" ON orders FOR ALL USING (true);
CREATE POLICY "Allow public access to order_audit" ON order_audit FOR ALL USING (true);
CREATE POLICY "Allow public access to branch_audit" ON branch_audit FOR ALL USING (true);
CREATE POLICY "Allow public access to settings" ON settings FOR ALL USING (true);

NOTIFY pgrst, 'reload schema';
