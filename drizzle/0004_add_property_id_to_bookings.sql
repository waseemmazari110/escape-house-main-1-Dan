-- Add property_id column to bookings table
ALTER TABLE bookings ADD COLUMN property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE;
