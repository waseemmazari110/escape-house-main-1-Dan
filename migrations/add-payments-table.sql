-- Create payments table for comprehensive Stripe payment tracking
-- This table stores all payment transactions from Stripe (subscriptions, one-time, refunds)

CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES account(id) ON DELETE CASCADE,
  
  -- Stripe identifiers
  stripe_customer_id TEXT NOT NULL,
  payment_intent_id TEXT,
  invoice_id TEXT,
  subscription_id TEXT,
  charge_id TEXT,
  
  -- Payment details
  amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT NOT NULL DEFAULT 'usd',
  payment_status TEXT NOT NULL, -- succeeded, failed, refunded, pending
  billing_reason TEXT, -- subscription_create, subscription_cycle, manual, etc.
  payment_method TEXT, -- card, bank_transfer, etc.
  
  -- Invoice/Receipt info
  receipt_url TEXT,
  invoice_url TEXT,
  invoice_pdf TEXT,
  
  -- Metadata
  description TEXT,
  metadata JSONB,
  
  -- Timestamps
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  
  -- Stripe timestamp (when payment actually occurred)
  stripe_created_at TIMESTAMP NOT NULL
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_customer_id ON payments(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_intent_id ON payments(payment_intent_id) WHERE payment_intent_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON payments(invoice_id) WHERE invoice_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_payments_subscription_id ON payments(subscription_id) WHERE subscription_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(payment_status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(stripe_created_at DESC);

-- Unique constraint to prevent duplicate payment records
CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_unique_payment_intent 
  ON payments(payment_intent_id) 
  WHERE payment_intent_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_unique_charge 
  ON payments(charge_id) 
  WHERE charge_id IS NOT NULL AND payment_intent_id IS NULL;

-- Add comments
COMMENT ON TABLE payments IS 'Stores all Stripe payment transactions including subscriptions, invoices, and one-time payments';
COMMENT ON COLUMN payments.amount IS 'Payment amount in smallest currency unit (cents for USD)';
COMMENT ON COLUMN payments.billing_reason IS 'Reason for the invoice: subscription_create, subscription_cycle, manual, etc.';
COMMENT ON COLUMN payments.payment_status IS 'Current payment status: succeeded, failed, refunded, pending';
