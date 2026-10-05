-- ============================================================
-- Landlord listings migration
-- Run this once in the Supabase SQL editor
-- (Dashboard → SQL Editor → New query → paste → Run)
-- ============================================================

-- 1. Track which landlord owns each storage unit.
alter table public.storage_units
  add column if not exists landlord_id uuid references public.profiles(id) on delete set null;

-- 2. Allow the 'landlord' role. The profiles.role column has a CHECK
--    constraint that currently only permits 'student' and 'admin', so we
--    replace it to include 'landlord'.
alter table public.profiles
  drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check check (role in ('student', 'landlord', 'admin'));
alter table public.profiles
  alter column role set default 'student';

-- 3. Helpful index for "my listings" lookups.
create index if not exists idx_storage_units_landlord on public.storage_units (landlord_id);
