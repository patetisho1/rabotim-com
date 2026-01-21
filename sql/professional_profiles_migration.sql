-- =============================================
-- Professional Profiles Migration for Rabotim.com
-- Run this in Supabase SQL Editor
-- =============================================

-- Create professional_profiles table
CREATE TABLE IF NOT EXISTS professional_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- URL & Identity
  username VARCHAR(30) UNIQUE NOT NULL,
  display_name VARCHAR(100),
  tagline VARCHAR(150),
  
  -- Profession
  profession VARCHAR(50) DEFAULT 'other',
  profession_title VARCHAR(100),
  
  -- Template & Design
  template VARCHAR(30) DEFAULT 'modern',
  primary_color VARCHAR(10),
  cover_image TEXT,
  
  -- Content
  about_me TEXT,
  services JSONB DEFAULT '[]'::jsonb,
  gallery JSONB DEFAULT '[]'::jsonb,
  certifications JSONB DEFAULT '[]'::jsonb,
  
  -- Contact Info
  contact_email VARCHAR(255),
  contact_phone VARCHAR(30),
  whatsapp VARCHAR(30),
  address TEXT,
  city VARCHAR(100),
  neighborhood VARCHAR(100),
  service_area TEXT[] DEFAULT '{}',
  
  -- Schedule
  working_hours JSONB DEFAULT '[]'::jsonb,
  
  -- Social
  social_links JSONB DEFAULT '[]'::jsonb,
  
  -- SEO
  meta_title VARCHAR(70),
  meta_description VARCHAR(160),
  
  -- Stats
  view_count INTEGER DEFAULT 0,
  contact_requests INTEGER DEFAULT 0,
  
  -- Settings
  is_published BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,
  show_prices BOOLEAN DEFAULT true,
  show_phone BOOLEAN DEFAULT true,
  show_email BOOLEAN DEFAULT true,
  accept_online_booking BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_username CHECK (username ~ '^[a-zA-Z0-9_-]{3,30}$'),
  CONSTRAINT valid_profession CHECK (profession IN ('fitness', 'beauty', 'repairs', 'cleaning', 'teaching', 'it', 'design', 'photography', 'music', 'transport', 'legal', 'accounting', 'medical', 'other')),
  CONSTRAINT valid_template CHECK (template IN ('modern', 'classic', 'bold', 'elegant', 'creative', 'fitness', 'beauty', 'tech', 'craft', 'professional'))
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_professional_profiles_user_id ON professional_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_professional_profiles_username ON professional_profiles(username);
CREATE INDEX IF NOT EXISTS idx_professional_profiles_profession ON professional_profiles(profession);
CREATE INDEX IF NOT EXISTS idx_professional_profiles_city ON professional_profiles(city);
CREATE INDEX IF NOT EXISTS idx_professional_profiles_is_published ON professional_profiles(is_published);
CREATE INDEX IF NOT EXISTS idx_professional_profiles_view_count ON professional_profiles(view_count DESC);

-- Enable RLS
ALTER TABLE professional_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Anyone can view published profiles
CREATE POLICY "Published profiles are viewable by everyone"
  ON professional_profiles FOR SELECT
  USING (is_published = true);

-- Users can view their own unpublished profiles
CREATE POLICY "Users can view their own profile"
  ON professional_profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own profile (one per user)
CREATE POLICY "Users can create their own profile"
  ON professional_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON professional_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own profile
CREATE POLICY "Users can delete their own profile"
  ON professional_profiles FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_professional_profile_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS professional_profiles_updated_at ON professional_profiles;
CREATE TRIGGER professional_profiles_updated_at
  BEFORE UPDATE ON professional_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_professional_profile_updated_at();

-- =============================================
-- Add is_premium column to users table if not exists
-- =============================================
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS premium_until TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS premium_type VARCHAR(30);

-- Index for premium users
CREATE INDEX IF NOT EXISTS idx_users_is_premium ON users(is_premium);

-- =============================================
-- Sample data for testing (optional)
-- =============================================
-- Uncomment and modify user_id to test
/*
INSERT INTO professional_profiles (
  user_id,
  username,
  display_name,
  tagline,
  profession,
  profession_title,
  template,
  primary_color,
  about_me,
  services,
  city,
  is_published
) VALUES (
  'YOUR_USER_ID_HERE',
  'demo-fitness',
  'Демо Треньор',
  'Персонален фитнес треньор с 10+ години опит',
  'fitness',
  'Персонален треньор',
  'fitness',
  '#10B981',
  'Здравейте! Аз съм сертифициран персонален треньор с богат опит.',
  '[{"id":"1","name":"Персонална тренировка","description":"Индивидуална тренировка","price":50,"priceType":"fixed","duration":"60 мин","popular":true}]',
  'София',
  true
);
*/

SELECT 'Professional profiles migration completed successfully!' as message;

