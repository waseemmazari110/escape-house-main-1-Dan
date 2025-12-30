-- Migration: Create comprehensive payments table
-- Date: 2025-12-27
-- Purpose: Track all Stripe payment transactions for complete payment history

CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  
  -- Stripe references
  stripe_customer_id TEXT,
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_charge_id TEXT,
  stripe_invoice_id TEXT,
  stripe_subscription_id TEXT,
  
  -- Payment details
  amount REAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'GBP',
  payment_status TEXT NOT NULL,
  payment_method TEXT,
  payment_method_brand TEXT,
  payment_method_last4 TEXT,
  
  -- Transaction details
  description TEXT,
  billing_reason TEXT,
  receipt_url TEXT,
  receipt_email TEXT,
  
  -- Refund information
  refund_amount REAL DEFAULT 0,
  refunded_at TEXT,
  refund_reason TEXT,
  
  -- Relations
  invoice_id INTEGER REFERENCES invoices(id) ON DELETE SET NULL,
  subscription_id INTEGER REFERENCES subscriptions(id) ON DELETE SET NULL,
  booking_id INTEGER REFERENCES bookings(id) ON DELETE SET NULL,
  
  -- Additional metadata
  failure_code TEXT,
  failure_message TEXT,
  network_status TEXT,
  risk_level TEXT,
  risk_score INTEGER,
  
  -- Metadata and timestamps
  metadata TEXT,
  stripe_event_id TEXT,
  processed_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_payment_intent_id ON payments(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_invoice_id ON payments(stripe_invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_subscription_id ON payments(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_status ON payments(payment_status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_event_id ON payments(stripe_event_id);

-- Add comment
-- This table provides comprehensive tracking of all payment transactions from Stripe
-- It complements the invoices table by capturing individual payment intents,
-- charges, refunds, and detailed payment metadata for complete audit trail
