-- Enhanced Rating System Migration
-- This migration adds comprehensive rating and review functionality

-- Add missing columns to ratings table
DO $$
BEGIN
    -- Add category column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ratings' AND column_name = 'category') THEN
        ALTER TABLE public.ratings ADD COLUMN category VARCHAR(20) DEFAULT 'overall';
    END IF;
    
    -- Add is_verified column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ratings' AND column_name = 'is_verified') THEN
        ALTER TABLE public.ratings ADD COLUMN is_verified BOOLEAN DEFAULT false;
    END IF;
    
    -- Add helpful_count column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ratings' AND column_name = 'helpful_count') THEN
        ALTER TABLE public.ratings ADD COLUMN helpful_count INTEGER DEFAULT 0;
    END IF;
    
    -- Add reported_count column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ratings' AND column_name = 'reported_count') THEN
        ALTER TABLE public.ratings ADD COLUMN reported_count INTEGER DEFAULT 0;
    END IF;
END $$;

-- Create reviews table for detailed reviews
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE NOT NULL,
    reviewer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    reviewed_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    title VARCHAR(200) NOT NULL,
    comment TEXT NOT NULL,
    pros TEXT[], -- Array of positive aspects
    cons TEXT[], -- Array of negative aspects
    tags TEXT[], -- Array of tags like 'professional', 'reliable', etc.
    is_verified BOOLEAN DEFAULT false,
    helpful_count INTEGER DEFAULT 0,
    reported_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one review per user per task
    UNIQUE(task_id, reviewer_id)
);

-- Create user_ratings_summary table for aggregated data
CREATE TABLE IF NOT EXISTS public.user_ratings_summary (
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
    average_rating DECIMAL(3,2) DEFAULT 0.0,
    total_reviews INTEGER DEFAULT 0,
    rating_distribution JSONB DEFAULT '{"1": 0, "2": 0, "3": 0, "4": 0, "5": 0}'::jsonb,
    category_ratings JSONB DEFAULT '{"quality": 0, "communication": 0, "punctuality": 0, "overall": 0}'::jsonb,
    badges TEXT[] DEFAULT '{}',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reviews_reviewed_user_id ON public.reviews(reviewed_user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_id ON public.reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_task_id ON public.reviews(task_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews(created_at);
CREATE INDEX IF NOT EXISTS idx_reviews_is_verified ON public.reviews(is_verified);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_ratings_summary ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reviews
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;
DROP POLICY IF EXISTS "Authenticated users can create reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON public.reviews;

CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);
CREATE POLICY "Users can update their own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = reviewer_id);

-- RLS Policies for user_ratings_summary
DROP POLICY IF EXISTS "Anyone can view user ratings summary" ON public.user_ratings_summary;
CREATE POLICY "Anyone can view user ratings summary" ON public.user_ratings_summary FOR SELECT USING (true);

-- Function to update user ratings summary
CREATE OR REPLACE FUNCTION update_user_ratings_summary()
RETURNS TRIGGER AS $$
BEGIN
    -- Update summary for the reviewed user
    INSERT INTO public.user_ratings_summary (user_id, average_rating, total_reviews, rating_distribution, category_ratings, badges, last_updated)
    SELECT 
        NEW.reviewed_user_id,
        COALESCE(AVG(rating::decimal), 0),
        COUNT(*),
        jsonb_build_object(
            '1', COUNT(*) FILTER (WHERE rating = 1),
            '2', COUNT(*) FILTER (WHERE rating = 2),
            '3', COUNT(*) FILTER (WHERE rating = 3),
            '4', COUNT(*) FILTER (WHERE rating = 4),
            '5', COUNT(*) FILTER (WHERE rating = 5)
        ),
        jsonb_build_object(
            'quality', COALESCE(AVG(rating::decimal) FILTER (WHERE category = 'quality'), 0),
            'communication', COALESCE(AVG(rating::decimal) FILTER (WHERE category = 'communication'), 0),
            'punctuality', COALESCE(AVG(rating::decimal) FILTER (WHERE category = 'punctuality'), 0),
            'overall', COALESCE(AVG(rating::decimal), 0)
        ),
        CASE 
            WHEN COUNT(*) >= 5 AND AVG(rating::decimal) >= 4.5 THEN ARRAY['Топ изпълнител']
            WHEN COUNT(*) >= 10 AND AVG(rating::decimal) >= 4.0 THEN ARRAY['Надежден']
            WHEN AVG(rating::decimal) FILTER (WHERE category = 'punctuality') >= 4.5 THEN ARRAY['Пунктуален']
            WHEN AVG(rating::decimal) FILTER (WHERE category = 'communication') >= 4.5 THEN ARRAY['Комуникативен']
            ELSE ARRAY[]::TEXT[]
        END,
        NOW()
    FROM public.reviews 
    WHERE reviewed_user_id = NEW.reviewed_user_id AND is_verified = true
    ON CONFLICT (user_id) DO UPDATE SET
        average_rating = EXCLUDED.average_rating,
        total_reviews = EXCLUDED.total_reviews,
        rating_distribution = EXCLUDED.rating_distribution,
        category_ratings = EXCLUDED.category_ratings,
        badges = EXCLUDED.badges,
        last_updated = EXCLUDED.last_updated;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to verify ratings for completed tasks
CREATE OR REPLACE FUNCTION verify_task_ratings()
RETURNS TRIGGER AS $$
BEGIN
    -- When a task is marked as completed, verify all ratings for that task
    UPDATE public.reviews 
    SET is_verified = true 
    WHERE task_id = NEW.id AND is_verified = false;
    
    UPDATE public.ratings 
    SET is_verified = true 
    WHERE task_id = NEW.id AND is_verified = false;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
DROP TRIGGER IF EXISTS trigger_update_user_ratings_summary ON public.reviews;
CREATE TRIGGER trigger_update_user_ratings_summary
    AFTER INSERT OR UPDATE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION update_user_ratings_summary();

DROP TRIGGER IF EXISTS trigger_verify_task_ratings ON public.tasks;
CREATE TRIGGER trigger_verify_task_ratings
    AFTER UPDATE ON public.tasks
    FOR EACH ROW 
    WHEN (NEW.status = 'completed' AND OLD.status != 'completed')
    EXECUTE FUNCTION verify_task_ratings();

-- Add constraint to ensure rating values are valid
ALTER TABLE public.ratings ADD CONSTRAINT check_rating_range CHECK (rating >= 1 AND rating <= 5);
ALTER TABLE public.reviews ADD CONSTRAINT check_review_rating_range CHECK (rating >= 1 AND rating <= 5);

-- Add constraint to ensure category values are valid
ALTER TABLE public.ratings ADD CONSTRAINT check_category_values 
    CHECK (category IN ('quality', 'communication', 'punctuality', 'overall'));

-- Update existing ratings to have category 'overall' if null
UPDATE public.ratings SET category = 'overall' WHERE category IS NULL;


