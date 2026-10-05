-- =============================================================
-- UNIVAULT — Storage Units & Bookings tables
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- Requires: profiles table to exist (see profiles.sql)
-- =============================================================

-- =============================================================
-- 1. STORAGE UNITS TABLE
-- =============================================================
CREATE TABLE IF NOT EXISTS storage_units (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_number     TEXT NOT NULL UNIQUE,
  size            TEXT NOT NULL CHECK (size IN ('small', 'medium', 'large')),
  location        TEXT NOT NULL,
  building        TEXT,
  floor           INTEGER,
  price_per_month DECIMAL(10,2) NOT NULL,
  is_available    BOOLEAN DEFAULT true,
  description     TEXT,
  dimensions      TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================
-- 2. BOOKINGS TABLE
-- =============================================================
CREATE TABLE IF NOT EXISTS bookings (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  storage_unit_id  UUID NOT NULL REFERENCES storage_units(id) ON DELETE CASCADE,
  start_date       DATE NOT NULL,
  end_date         DATE NOT NULL,
  status           TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled')),
  total_price      DECIMAL(10,2) NOT NULL,
  notes            TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_dates CHECK (end_date > start_date)
);

-- =============================================================
-- 3. ENABLE ROW LEVEL SECURITY
-- =============================================================
ALTER TABLE storage_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- =============================================================
-- 4. RLS POLICIES — storage_units
-- =============================================================

-- Anyone can view storage units (public catalogue)
CREATE POLICY "Anyone can view storage units"
  ON storage_units
  FOR SELECT
  USING (true);

-- Only the service role (backend) can insert/update/delete units
CREATE POLICY "Service role can manage storage units"
  ON storage_units
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- =============================================================
-- 5. RLS POLICIES — bookings
-- =============================================================

-- Users can view their own bookings
CREATE POLICY "Users can view own bookings"
  ON bookings
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own bookings
CREATE POLICY "Users can create own bookings"
  ON bookings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own bookings (e.g., cancel)
CREATE POLICY "Users can update own bookings"
  ON bookings
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Service role can manage all bookings (backend operations)
CREATE POLICY "Service role can manage all bookings"
  ON bookings
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- =============================================================
-- 6. AUTO-UPDATE updated_at TRIGGERS
-- =============================================================

-- Reuse update_updated_at() function from profiles.sql if it exists,
-- otherwise create it.
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_storage_units_updated_at
  BEFORE UPDATE ON storage_units
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- =============================================================
-- 7. SEED DATA — 6 sample storage units (2 small, 2 medium, 2 large)
-- =============================================================
INSERT INTO storage_units (unit_number, size, location, building, floor, price_per_month, is_available, description, dimensions)
VALUES
  ('SU-101', 'small',  'JKUAT Main Gate', 'Juja Square Mall', 1, 1500.00, true,
   'Compact locker-style unit, perfect for textbooks and personal items. Walking distance from JKUAT main gate.',
   '3ft × 3ft × 4ft'),

  ('SU-102', 'small',  'JKUAT Main Gate', 'Juja Square Mall', 1, 2000.00, true,
   'Small shelved unit near the entrance — easy grab-and-go access for students between classes.',
   '3ft × 4ft × 5ft'),

  ('SU-201', 'medium', 'Gachororo Road',  'Gachororo Plaza', 2, 3500.00, true,
   'Mid-size room suitable for sports equipment, instruments, or multiple boxes. Near Gachororo stage.',
   '5ft × 5ft × 6ft'),

  ('SU-202', 'medium', 'Gachororo Road',  'Gachororo Plaza', 2, 4000.00, true,
   'Climate-controlled medium unit — ideal for electronics and documents. Perfect for semester breaks.',
   '5ft × 6ft × 7ft'),

  ('SU-301', 'large',  'Juja Town Centre', 'Juja Storage Hub', 1, 6000.00, true,
   'Walk-in unit with shelving. Great for semester-long bulk storage. Located in Juja town centre.',
   '8ft × 8ft × 8ft'),

  ('SU-302', 'large',  'Juja Town Centre', 'Juja Storage Hub', 1, 7500.00, true,
   'Premium large unit with 24/7 keycard access and built-in lighting. Ideal for furniture and appliances.',
   '10ft × 8ft × 8ft')
ON CONFLICT (unit_number) DO NOTHING;
