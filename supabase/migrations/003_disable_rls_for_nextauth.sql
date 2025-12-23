-- ================================================
-- DISABLE RLS FOR NEXTAUTH TABLES (TEMPORARY FIX)
-- ================================================
-- This completely disables RLS on NextAuth tables
-- so the adapter can work without restrictions
--
-- IMPORTANT: Run this in Supabase SQL Editor NOW!
-- ================================================

-- Disable RLS on all NextAuth tables
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE accounts DISABLE ROW LEVEL SECURITY;
ALTER TABLE sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE verification_tokens DISABLE ROW LEVEL SECURITY;

-- ================================================
-- DONE! RLS is now disabled for NextAuth tables
-- ================================================
-- Google OAuth should now work correctly!
-- You can re-enable RLS later with proper policies if needed
-- ================================================
