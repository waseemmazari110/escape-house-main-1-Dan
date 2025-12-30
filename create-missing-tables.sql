-- Create missing tables for Milestone 10 & Subscription System
-- Run this SQL directly in your Turso database

-- Property Reviews table
CREATE TABLE IF NOT EXISTS property_reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  property_id INTEGER NOT NULL,
  booking_id INTEGER,
  guest_name TEXT NOT NULL,
  guest_email TEXT,
  rating INTEGER NOT NULL,
  title TEXT,
  review TEXT NOT NULL,
  cleanliness INTEGER,
  accuracy INTEGER,
  communication INTEGER,
  location INTEGER,
  value INTEGER,
  is_verified INTEGER DEFAULT 0,
  is_published INTEGER DEFAULT 1,
  owner_response TEXT,
  responded_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL
);

-- Availability Calendar table
CREATE TABLE IF NOT EXISTS availability_calendar (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  property_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  is_available INTEGER DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'available',
  price REAL,
  minimum_stay INTEGER DEFAULT 1,
  booking_id INTEGER,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL,
  UNIQUE(property_id, date)
);

-- Orchards Payments table
CREATE TABLE IF NOT EXISTS orchards_payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  booking_id INTEGER NOT NULL,
  orchards_transaction_id TEXT UNIQUE,
  orchards_payment_url TEXT,
  payment_type TEXT NOT NULL,
  amount REAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'GBP',
  status TEXT NOT NULL DEFAULT 'pending',
  paid_at TEXT,
  refunded_at TEXT,
  failure_reason TEXT,
  metadata TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT,
  stripe_customer_id TEXT,
  plan_name TEXT NOT NULL,
  plan_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  current_period_start TEXT NOT NULL,
  current_period_end TEXT NOT NULL,
  cancel_at_period_end INTEGER DEFAULT 0,
  cancelled_at TEXT,
  trial_start TEXT,
  trial_end TEXT,
  amount REAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'GBP',
  interval TEXT NOT NULL,
  interval_count INTEGER DEFAULT 1,
  metadata TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  subscription_id INTEGER,
  stripe_invoice_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  invoice_number TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'draft',
  description TEXT,
  amount_due REAL NOT NULL,
  amount_paid REAL DEFAULT 0,
  amount_remaining REAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'GBP',
  tax_amount REAL DEFAULT 0,
  subtotal REAL NOT NULL,
  total REAL NOT NULL,
  due_date TEXT,
  paid_at TEXT,
  invoice_date TEXT NOT NULL,
  period_start TEXT,
  period_end TEXT,
  billing_reason TEXT,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  invoice_pdf TEXT,
  hosted_invoice_url TEXT,
  metadata TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE SET NULL
);

-- Media table
CREATE TABLE IF NOT EXISTS media (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL UNIQUE,
  file_type TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  width INTEGER,
  height INTEGER,
  duration INTEGER,
  alt_text TEXT,
  caption TEXT,
  description TEXT,
  title TEXT,
  entity_type TEXT,
  entity_id TEXT,
  uploaded_by TEXT,
  folder TEXT DEFAULT 'general',
  tags TEXT,
  is_public INTEGER DEFAULT 1,
  thumbnail_url TEXT,
  metadata TEXT,
  storage_provider TEXT DEFAULT 'supabase',
  storage_key TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (uploaded_by) REFERENCES user(id) ON DELETE SET NULL
);

-- Enquiries table (if not exists)
CREATE TABLE IF NOT EXISTS enquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  enquiry_type TEXT NOT NULL DEFAULT 'general',
  source TEXT DEFAULT 'website',
  status TEXT NOT NULL DEFAULT 'new',
  priority TEXT DEFAULT 'medium',
  assigned_to TEXT,
  property_id INTEGER,
  check_in_date TEXT,
  check_out_date TEXT,
  number_of_guests INTEGER,
  occasion TEXT,
  budget REAL,
  preferred_locations TEXT,
  special_requests TEXT,
  referral_source TEXT,
  marketing_consent INTEGER DEFAULT 0,
  ip_address TEXT,
  user_agent TEXT,
  admin_notes TEXT,
  internal_notes TEXT,
  response_template TEXT,
  responded_at TEXT,
  responded_by TEXT,
  resolved_at TEXT,
  metadata TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL
);

-- Seasonal Pricing table (if not exists)
CREATE TABLE IF NOT EXISTS seasonal_pricing (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  property_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  season_type TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  price_per_night REAL NOT NULL,
  minimum_stay INTEGER,
  day_type TEXT NOT NULL DEFAULT 'any',
  is_active INTEGER DEFAULT 1,
  priority INTEGER DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- Special Date Pricing table (if not exists)
CREATE TABLE IF NOT EXISTS special_date_pricing (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  property_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  date TEXT NOT NULL,
  end_date TEXT,
  price_per_night REAL NOT NULL,
  minimum_stay INTEGER,
  is_available INTEGER DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- Performance Stats table (if not exists)
CREATE TABLE IF NOT EXISTS performance_stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  period TEXT NOT NULL,
  period_start TEXT NOT NULL,
  period_end TEXT NOT NULL,
  page_views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  avg_session_duration INTEGER DEFAULT 0,
  bounce_rate REAL DEFAULT 0,
  total_enquiries INTEGER DEFAULT 0,
  new_enquiries INTEGER DEFAULT 0,
  in_progress_enquiries INTEGER DEFAULT 0,
  resolved_enquiries INTEGER DEFAULT 0,
  avg_response_time INTEGER DEFAULT 0,
  conversion_rate REAL DEFAULT 0,
  total_bookings INTEGER DEFAULT 0,
  confirmed_bookings INTEGER DEFAULT 0,
  cancelled_bookings INTEGER DEFAULT 0,
  pending_bookings INTEGER DEFAULT 0,
  total_revenue REAL DEFAULT 0,
  avg_booking_value REAL DEFAULT 0,
  occupancy_rate REAL DEFAULT 0,
  total_guests INTEGER DEFAULT 0,
  returning_guests INTEGER DEFAULT 0,
  avg_guests_per_booking REAL DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  avg_rating REAL DEFAULT 0,
  five_star_reviews INTEGER DEFAULT 0,
  four_star_reviews INTEGER DEFAULT 0,
  three_star_reviews INTEGER DEFAULT 0,
  two_star_reviews INTEGER DEFAULT 0,
  one_star_reviews INTEGER DEFAULT 0,
  deposits_paid REAL DEFAULT 0,
  balances_paid REAL DEFAULT 0,
  pending_payments REAL DEFAULT 0,
  refunds_issued REAL DEFAULT 0,
  email_sent INTEGER DEFAULT 0,
  email_opened INTEGER DEFAULT 0,
  email_clicked INTEGER DEFAULT 0,
  email_open_rate REAL DEFAULT 0,
  email_click_rate REAL DEFAULT 0,
  metadata TEXT,
  calculated_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_property_reviews_property ON property_reviews(property_id);
CREATE INDEX IF NOT EXISTS idx_property_reviews_published ON property_reviews(is_published);
CREATE INDEX IF NOT EXISTS idx_availability_calendar_property_date ON availability_calendar(property_id, date);
CREATE INDEX IF NOT EXISTS idx_availability_calendar_status ON availability_calendar(status);
CREATE INDEX IF NOT EXISTS idx_orchards_payments_booking ON orchards_payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_orchards_payments_transaction ON orchards_payments(orchards_transaction_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_invoices_user ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_subscription ON invoices(subscription_id);
