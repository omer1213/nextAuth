-- ================================================
-- Add Account Lockout Fields
-- Created: December 22, 2025
-- Purpose: Track failed login attempts and lock accounts
-- ================================================

-- Add failed login attempts tracking
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP WITH TIME ZONE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS users_locked_until_idx ON users(locked_until) 
WHERE locked_until IS NOT NULL;

-- ================================================
-- COMPLETED!
-- ================================================
-- Account lockout fields added successfully
