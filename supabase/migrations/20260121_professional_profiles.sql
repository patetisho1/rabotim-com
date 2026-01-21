-- Professional Profiles Table Migration
-- This table stores professional profile data for users who want a "mini-website"
-- URL pattern: /p/{username}

-- Create the professional_profiles table
CREATE TABLE IF NOT EXISTS public.professional_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- URL and Identity
    username VARCHAR(30) UNIQUE, -- URL slug: /p/username
    display_name VARCHAR(100),
    tagline VARCHAR(150),
    
    -- Profession
    profession VARCHAR(50) DEFAULT 'other', -- fitness, beauty, repairs, etc.
    profession_title VARCHAR(100), -- Custom title like "Персонален треньор"
    
    -- Template & Design
    template VARCHAR(30) DEFAULT 'modern',
    primary_color VARCHAR(7), -- Hex color like #3B82F6
    cover_image TEXT, -- URL to cover image
    
    -- Content
    about_me TEXT,
    services JSONB DEFAULT '[]'::jsonb, -- Array of ServiceItem
    gallery JSONB DEFAULT '[]'::jsonb, -- Array of GalleryItem
    certifications JSONB DEFAULT '[]'::jsonb, -- Array of Certification
    
    -- Contact
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    whatsapp VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    neighborhood VARCHAR(100),
    service_area JSONB DEFAULT '[]'::jsonb, -- Array of city names
    
    -- Schedule
    working_hours JSONB DEFAULT '[]'::jsonb, -- Array of WorkingHours
    
    -- Social
    social_links JSONB DEFAULT '[]'::jsonb, -- Array of SocialLink
    
    -- SEO
    meta_title VARCHAR(100),
    meta_description VARCHAR(200),
    
    -- Stats (auto-calculated)
    view_count INTEGER DEFAULT 0,
    contact_requests INTEGER DEFAULT 0,
    
    -- Settings
    is_published BOOLEAN DEFAULT false,
    show_prices BOOLEAN DEFAULT true,
    show_phone BOOLEAN DEFAULT true,
    show_email BOOLEAN DEFAULT true,
    accept_online_booking BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_professional_profiles_user_id ON public.professional_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_professional_profiles_username ON public.professional_profiles(username);
CREATE INDEX IF NOT EXISTS idx_professional_profiles_profession ON public.professional_profiles(profession);
CREATE INDEX IF NOT EXISTS idx_professional_profiles_city ON public.professional_profiles(city);
CREATE INDEX IF NOT EXISTS idx_professional_profiles_is_published ON public.professional_profiles(is_published);

-- Create unique constraint to ensure one profile per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_professional_profiles_user_unique ON public.professional_profiles(user_id);

-- Enable Row Level Security
ALTER TABLE public.professional_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view published profiles
CREATE POLICY "Published profiles are viewable by everyone"
    ON public.professional_profiles
    FOR SELECT
    USING (is_published = true);

-- Policy: Users can view their own profiles (even unpublished)
CREATE POLICY "Users can view own profile"
    ON public.professional_profiles
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can create their own profile
CREATE POLICY "Users can create own profile"
    ON public.professional_profiles
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON public.professional_profiles
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own profile
CREATE POLICY "Users can delete own profile"
    ON public.professional_profiles
    FOR DELETE
    USING (auth.uid() = user_id);

-- Add username column to users table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'users' 
                   AND column_name = 'username') THEN
        ALTER TABLE public.users ADD COLUMN username VARCHAR(30) UNIQUE;
    END IF;
END $$;

-- Add is_premium column to users table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'users' 
                   AND column_name = 'is_premium') THEN
        ALTER TABLE public.users ADD COLUMN is_premium BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Add premium_until column to users table if it doesn't exist (for subscription expiry)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'users' 
                   AND column_name = 'premium_until') THEN
        ALTER TABLE public.users ADD COLUMN premium_until TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_professional_profile_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update the updated_at column
DROP TRIGGER IF EXISTS trigger_update_professional_profile_updated_at ON public.professional_profiles;
CREATE TRIGGER trigger_update_professional_profile_updated_at
    BEFORE UPDATE ON public.professional_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_professional_profile_updated_at();

-- Grant necessary permissions
GRANT ALL ON public.professional_profiles TO authenticated;
GRANT SELECT ON public.professional_profiles TO anon;

COMMENT ON TABLE public.professional_profiles IS 'Professional profiles for users - allows them to create a mini-website with services, gallery, and contact info';
COMMENT ON COLUMN public.professional_profiles.username IS 'URL slug for the profile - accessible at /p/{username}';
COMMENT ON COLUMN public.professional_profiles.services IS 'JSON array of services offered with prices';
COMMENT ON COLUMN public.professional_profiles.gallery IS 'JSON array of gallery images/videos';
COMMENT ON COLUMN public.professional_profiles.working_hours IS 'JSON array of working hours per day';

