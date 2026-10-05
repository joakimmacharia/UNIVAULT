-- =============================================================
-- UNIVAULT Phase 2: Admin & Smart Locker Upgrades
-- Run this in your Supabase SQL Editor
-- =============================================================

-- 1. Add access_pin column to bookings (for Smart Locker PIN system)
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS access_pin TEXT;

-- 2. Add role column to profiles (for RBAC / Admin Dashboard)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'student';

-- 3. Set yourself as admin (replace with your actual email)
UPDATE profiles SET role = 'admin' WHERE email = 'YOUR_EMAIL_HERE';

-- Verify: Check that the columns were added
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name = 'role';

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'bookings' AND column_name = 'access_pin';
