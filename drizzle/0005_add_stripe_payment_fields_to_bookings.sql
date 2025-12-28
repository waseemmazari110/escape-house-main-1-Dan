-- Migration: Add Stripe Payment Fields to Bookings Table
-- Date: 2025-12-17
-- STEP 2.2 - Stripe Integration for Bookings

-- Add Stripe customer and payment tracking fields
ALTER TABLE bookings ADD COLUMN stripe_customer_id TEXT;
ALTER TABLE bookings ADD COLUMN stripe_deposit_payment_intent_id TEXT;
ALTER TABLE bookings ADD COLUMN stripe_balance_payment_intent_id TEXT;
ALTER TABLE bookings ADD COLUMN stripe_deposit_charge_id TEXT;
ALTER TABLE bookings ADD COLUMN stripe_balance_charge_id TEXT;
ALTER TABLE bookings ADD COLUMN stripe_refund_id TEXT;
ALTER TABLE bookings ADD COLUMN payment_metadata TEXT; -- JSON field for additional payment info
