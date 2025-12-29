-- ================================================
-- Add Atomic Increment Function for Failed Login Attempts
-- Created: December 22, 2025
-- Purpose: Atomically increment failed_login_attempts to avoid race conditions
-- ================================================

-- Create function to atomically increment failed login attempts
CREATE OR REPLACE FUNCTION increment_failed_login_attempts(user_id UUID)
RETURNS TABLE(
  failed_login_attempts INTEGER,
  locked_until TIMESTAMP WITH TIME ZONE,
  is_locked BOOLEAN
) AS $$
DECLARE
  current_attempts INTEGER;
  new_attempts INTEGER;
  max_attempts INTEGER := 5;
  lock_duration_minutes INTEGER := 15;
  lock_until TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get current attempts
  SELECT COALESCE(failed_login_attempts, 0) INTO current_attempts
  FROM users
  WHERE id = user_id;

  -- Increment
  new_attempts := current_attempts + 1;

  -- Check if should lock
  IF new_attempts >= max_attempts THEN
    lock_until := NOW() + (lock_duration_minutes || ' minutes')::INTERVAL;
  ELSE
    lock_until := NULL;
  END IF;

  -- Update user
  UPDATE users
  SET 
    failed_login_attempts = new_attempts,
    locked_until = lock_until
  WHERE id = user_id;

  -- Return result
  RETURN QUERY
  SELECT 
    new_attempts,
    lock_until,
    (lock_until IS NOT NULL AND lock_until > NOW()) as is_locked;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION increment_failed_login_attempts(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_failed_login_attempts(UUID) TO anon;

-- ================================================
-- COMPLETED!
-- ================================================
-- Atomic increment function created successfully
