-- Insert test transactions for admin dashboard
-- These transactions simulate successful Stripe payments

-- First, let's get a user ID (we'll use the first owner or any user)
-- You can run this query first to find a user ID:
-- SELECT id, email, name, role FROM user LIMIT 5;

-- Replace 'USER_ID_HERE' with an actual user ID from your database
-- For example: 'clm1234567890abcdefgh'

INSERT INTO payments (
  id,
  userId,
  subscriptionId,
  customerId,
  paymentIntentId,
  chargeId,
  invoiceId,
  amount,
  currency,
  paymentStatus,
  paymentMethod,
  last4,
  brand,
  description,
  receiptUrl,
  createdAt,
  updatedAt
) VALUES 
-- Transaction 1: Successful payment
(
  'test_payment_1_' || hex(randomblob(16)),
  (SELECT id FROM user WHERE role = 'owner' LIMIT 1),
  NULL,
  'cus_test_customer_1',
  'pi_test_intent_1',
  'ch_test_charge_1',
  NULL,
  1999,
  'gbp',
  'succeeded',
  'card',
  '4242',
  'Visa',
  'Premium Monthly Subscription',
  'https://pay.stripe.com/receipts/test_1',
  datetime('now'),
  datetime('now')
),
-- Transaction 2: Another successful payment
(
  'test_payment_2_' || hex(randomblob(16)),
  (SELECT id FROM user WHERE role = 'owner' LIMIT 1),
  NULL,
  'cus_test_customer_2',
  'pi_test_intent_2',
  'ch_test_charge_2',
  NULL,
  3999,
  'gbp',
  'succeeded',
  'card',
  '5555',
  'Mastercard',
  'Enterprise Yearly Subscription',
  'https://pay.stripe.com/receipts/test_2',
  datetime('now', '-1 day'),
  datetime('now', '-1 day')
),
-- Transaction 3: Pending payment
(
  'test_payment_3_' || hex(randomblob(16)),
  (SELECT id FROM user WHERE role = 'owner' LIMIT 1),
  NULL,
  'cus_test_customer_3',
  'pi_test_intent_3',
  NULL,
  NULL,
  2999,
  'gbp',
  'pending',
  'card',
  '4242',
  'Visa',
  'Basic Yearly Subscription',
  NULL,
  datetime('now'),
  datetime('now')
);

-- Verify the insertions
SELECT 
  id,
  amount / 100.0 as amount_gbp,
  currency,
  paymentStatus,
  brand,
  last4,
  description,
  createdAt
FROM payments 
WHERE id LIKE 'test_payment_%'
ORDER BY createdAt DESC;
