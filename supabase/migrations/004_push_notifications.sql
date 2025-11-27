-- Push Notifications - FCM Tokens Table
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS fcm_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  token TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_fcm_tokens_user ON fcm_tokens(user_id);

-- RLS Policies
ALTER TABLE fcm_tokens ENABLE ROW LEVEL SECURITY;

-- Users can manage their own tokens
CREATE POLICY "Users can insert own token" ON fcm_tokens
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own token" ON fcm_tokens
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own token" ON fcm_tokens
  FOR DELETE USING (auth.uid() = user_id);

-- Update timestamp trigger
CREATE TRIGGER fcm_tokens_updated_at
  BEFORE UPDATE ON fcm_tokens
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

COMMENT ON TABLE fcm_tokens IS 'Firebase Cloud Messaging tokens for push notifications';

