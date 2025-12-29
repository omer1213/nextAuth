-- ================================================
-- Remove Account Lockout System
-- Created: December 22, 2025
-- Purpose: Revert database to state before account lockout implementation
-- ================================================

-- Drop the increment function if it exists
DROP FUNCTION IF EXISTS increment_failed_login_attempts(UUID);

-- Drop the index if it exists
DROP INDEX IF EXISTS users_locked_until_idx;

-- Remove lockout columns from users table
ALTER TABLE users 
DROP COLUMN IF EXISTS failed_login_attempts,
DROP COLUMN IF EXISTS locked_until;

-- ================================================
-- COMPLETED!
-- ================================================
-- Account lockout system removed from database
-- Note: You may also want to remove the lockout logic from auth.ts
