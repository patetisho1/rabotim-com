-- Add promotion fields to tasks table
ALTER TABLE public.tasks 
ADD COLUMN IF NOT EXISTS is_promoted boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_top boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS promoted_until timestamp with time zone,
ADD COLUMN IF NOT EXISTS featured_until timestamp with time zone,
ADD COLUMN IF NOT EXISTS top_until timestamp with time zone,
ADD COLUMN IF NOT EXISTS promotion_level integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS boost_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_boosted_at timestamp with time zone;

-- Create index for promoted tasks
CREATE INDEX IF NOT EXISTS idx_tasks_promoted ON public.tasks(is_promoted, promoted_until) WHERE is_promoted = true;
CREATE INDEX IF NOT EXISTS idx_tasks_featured ON public.tasks(is_featured, featured_until) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_tasks_top ON public.tasks(is_top, top_until) WHERE is_top = true;
CREATE INDEX IF NOT EXISTS idx_tasks_promotion_level ON public.tasks(promotion_level DESC);

-- Function to automatically expire promotions
CREATE OR REPLACE FUNCTION expire_task_promotions()
RETURNS void AS $$
BEGIN
  UPDATE public.tasks
  SET is_promoted = false
  WHERE is_promoted = true 
    AND promoted_until IS NOT NULL 
    AND promoted_until < NOW();
    
  UPDATE public.tasks
  SET is_featured = false
  WHERE is_featured = true 
    AND featured_until IS NOT NULL 
    AND featured_until < NOW();
    
  UPDATE public.tasks
  SET is_top = false
  WHERE is_top = true 
    AND top_until IS NOT NULL 
    AND top_until < NOW();
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to run the expiration function
-- Note: This requires pg_cron extension which may need to be enabled separately
-- For now, we'll just create the function and it can be called manually or via a cron job

-- Add archive field to tasks table
ALTER TABLE public.tasks 
ADD COLUMN IF NOT EXISTS is_archived boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS archived_at timestamp with time zone;

-- Create index for archived tasks
CREATE INDEX IF NOT EXISTS idx_tasks_archived ON public.tasks(is_archived) WHERE is_archived = true;

