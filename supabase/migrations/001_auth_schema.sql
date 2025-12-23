-- ================================================
-- NextAuth.js Database Schema for Supabase
-- Created: December 22, 2025
-- Purpose: Authentication system with email/password and OAuth
-- ================================================

-- ================================================
-- 1. USERS TABLE
-- ================================================
-- Stores main user account information
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    email_verified TIMESTAMP WITH TIME ZONE,
    image TEXT,
    password_hash VARCHAR(255), -- For credentials login
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster email lookups
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);

-- ================================================
-- 2. ACCOUNTS TABLE
-- ================================================
-- Stores OAuth provider information (Google, etc.)
CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(255) NOT NULL, -- 'oauth' or 'credentials'
    provider VARCHAR(255) NOT NULL, -- 'google', 'credentials', etc.
    provider_account_id VARCHAR(255) NOT NULL, -- Provider's user ID
    refresh_token TEXT,
    access_token TEXT,
    expires_at BIGINT,
    token_type VARCHAR(255),
    scope TEXT,
    id_token TEXT,
    session_state TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(provider, provider_account_id)
);

-- Index for faster user lookups
CREATE INDEX IF NOT EXISTS accounts_user_id_idx ON accounts(user_id);

-- ================================================
-- 3. SESSIONS TABLE
-- ================================================
-- Stores active user sessions (optional with JWT strategy)
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster session lookups
CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);
CREATE INDEX IF NOT EXISTS sessions_session_token_idx ON sessions(session_token);

-- ================================================
-- 4. VERIFICATION_TOKENS TABLE
-- ================================================
-- Stores tokens for email verification and password reset
CREATE TABLE IF NOT EXISTS verification_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identifier VARCHAR(255) NOT NULL, -- Email or user ID
    token VARCHAR(255) UNIQUE NOT NULL,
    expires TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster token lookups
CREATE INDEX IF NOT EXISTS verification_tokens_token_idx ON verification_tokens(token);
CREATE INDEX IF NOT EXISTS verification_tokens_identifier_idx ON verification_tokens(identifier);

-- ================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_tokens ENABLE ROW LEVEL SECURITY;

-- ================================================
-- USERS TABLE POLICIES
-- ================================================

-- Allow users to read their own data
CREATE POLICY "Users can view own profile"
    ON users
    FOR SELECT
    USING (auth.uid()::text = id::text);

-- Allow users to update their own data
CREATE POLICY "Users can update own profile"
    ON users
    FOR UPDATE
    USING (auth.uid()::text = id::text);

-- Allow service role to insert users (for signup)
CREATE POLICY "Service role can insert users"
    ON users
    FOR INSERT
    WITH CHECK (true);

-- Allow service role full access (for NextAuth operations)
CREATE POLICY "Service role has full access to users"
    ON users
    USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- ================================================
-- ACCOUNTS TABLE POLICIES
-- ================================================

-- Allow users to view their own accounts
CREATE POLICY "Users can view own accounts"
    ON accounts
    FOR SELECT
    USING (auth.uid()::text = user_id::text);

-- Allow service role full access
CREATE POLICY "Service role has full access to accounts"
    ON accounts
    USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- ================================================
-- SESSIONS TABLE POLICIES
-- ================================================

-- Allow service role full access to sessions
CREATE POLICY "Service role has full access to sessions"
    ON sessions
    USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- ================================================
-- VERIFICATION_TOKENS TABLE POLICIES
-- ================================================

-- Allow service role full access to verification tokens
CREATE POLICY "Service role has full access to verification_tokens"
    ON verification_tokens
    USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

-- ================================================
-- FUNCTIONS AND TRIGGERS
-- ================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for accounts table
CREATE TRIGGER update_accounts_updated_at
    BEFORE UPDATE ON accounts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- COMPLETED!
-- ================================================
-- All tables, indexes, policies, and triggers created successfully
-- You can now use this schema with NextAuth.js
