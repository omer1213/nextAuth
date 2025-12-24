-- ================================================
-- REMOVE UNUSED TABLES (accounts and sessions)
-- ================================================
-- These tables are not needed because:
-- 1. We're using JWT sessions (not database sessions)
-- 2. We removed OAuth (no accounts table needed)
--
-- Only users and verification_tokens are actually used
-- ================================================

-- Drop the unused tables
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;

-- ================================================
-- DONE! Only users and verification_tokens remain
-- ================================================
-- Your authentication system now uses:
-- - users: User data and credentials
-- - verification_tokens: Email verification and password reset
-- ================================================
