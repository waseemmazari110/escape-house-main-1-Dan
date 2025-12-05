-- Migration: Add CRM Integration Support
-- Generated: 2025-01-05
-- Description: Adds CRM sync fields to existing tables and creates new CRM-related tables

-- Add CRM fields to user table
ALTER TABLE user ADD COLUMN crm_id TEXT;
ALTER TABLE user ADD COLUMN crm_sync_status TEXT DEFAULT 'pending';
ALTER TABLE user ADD COLUMN crm_last_synced_at INTEGER;
ALTER TABLE user ADD COLUMN membership_status TEXT DEFAULT 'pending';

-- Add CRM fields to properties table
ALTER TABLE properties ADD COLUMN crm_id TEXT;
ALTER TABLE properties ADD COLUMN crm_sync_status TEXT DEFAULT 'pending';
ALTER TABLE properties ADD COLUMN crm_last_synced_at INTEGER;

-- Add CRM fields to bookings table
ALTER TABLE bookings ADD COLUMN crm_id TEXT;
ALTER TABLE bookings ADD COLUMN crm_sync_status TEXT DEFAULT 'pending';
ALTER TABLE bookings ADD COLUMN crm_last_synced_at INTEGER;

-- Create CRM sync logs table
CREATE TABLE IF NOT EXISTS crm_sync_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  crm_id TEXT,
  action TEXT NOT NULL,
  status TEXT NOT NULL,
  request_data TEXT,
  response_data TEXT,
  error_message TEXT,
  created_at TEXT NOT NULL
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_crm_sync_logs_entity ON crm_sync_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_crm_sync_logs_status ON crm_sync_logs(status);

-- Create enquiries table
CREATE TABLE IF NOT EXISTS enquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT REFERENCES user(id) ON DELETE CASCADE,
  property_id INTEGER REFERENCES properties(id) ON DELETE SET NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  source TEXT DEFAULT 'website',
  crm_id TEXT,
  crm_sync_status TEXT DEFAULT 'pending',
  crm_last_synced_at INTEGER,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Create index for enquiries
CREATE INDEX IF NOT EXISTS idx_enquiries_user ON enquiries(user_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_property ON enquiries(property_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);

-- Create owner memberships table
CREATE TABLE IF NOT EXISTS owner_memberships (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  membership_tier TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  start_date TEXT NOT NULL,
  end_date TEXT,
  auto_renew INTEGER DEFAULT 1,
  payment_status TEXT DEFAULT 'pending',
  crm_id TEXT,
  crm_sync_status TEXT DEFAULT 'pending',
  crm_last_synced_at INTEGER,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Create index for memberships
CREATE INDEX IF NOT EXISTS idx_owner_memberships_user ON owner_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_owner_memberships_status ON owner_memberships(status);
