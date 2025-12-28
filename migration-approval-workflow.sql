-- ============================================
-- Property Approval Workflow Migration
-- ============================================
-- 
-- This migration adds approval workflow fields to the properties table.
-- Run this script to enable admin approval functionality.
--
-- Date: 17/12/2025
-- Version: 1.0
-- ============================================

-- Step 1: Add status column (default: pending)
ALTER TABLE properties 
ADD COLUMN status TEXT NOT NULL DEFAULT 'pending';

-- Step 2: Add rejection reason column
ALTER TABLE properties 
ADD COLUMN rejection_reason TEXT;

-- Step 3: Add approved by column (references admin user)
ALTER TABLE properties 
ADD COLUMN approved_by TEXT;

-- Step 4: Add approved at timestamp column
ALTER TABLE properties 
ADD COLUMN approved_at TEXT;

-- Step 5: Set existing published properties to approved
-- This ensures no disruption to currently live properties
UPDATE properties 
SET status = 'approved',
    approved_at = datetime('now', 'localtime')
WHERE is_published = 1;

-- Step 6: Verify migration
-- Check status distribution
SELECT 
    status,
    COUNT(*) as count
FROM properties
GROUP BY status;

-- ============================================
-- Migration Complete
-- ============================================
-- 
-- Expected results:
-- - All existing published properties: status = 'approved'
-- - All unpublished properties: status = 'pending'
-- - New properties will default to: status = 'pending'
--
-- Next steps:
-- 1. Test admin approval endpoints
-- 2. Test owner property creation
-- 3. Verify public APIs filter correctly
-- ============================================
