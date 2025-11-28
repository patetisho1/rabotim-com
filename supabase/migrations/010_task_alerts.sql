-- Task Alerts System
-- Allows users to subscribe to notifications for new tasks matching their criteria

-- Create task_alerts table
CREATE TABLE IF NOT EXISTS public.task_alerts (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Filter criteria
  name varchar(100), -- Optional name for the alert (e.g., "Почистване в София")
  categories text[] DEFAULT '{}', -- Array of category slugs
  locations text[] DEFAULT '{}', -- Array of location names
  min_budget integer DEFAULT 0,
  max_budget integer DEFAULT 999999,
  keywords text[] DEFAULT '{}', -- Search keywords
  
  -- Notification settings
  email_enabled boolean DEFAULT true,
  push_enabled boolean DEFAULT false,
  frequency varchar(20) DEFAULT 'immediate' CHECK (frequency IN ('immediate', 'daily', 'weekly')),
  
  -- Status
  is_active boolean DEFAULT true,
  last_notified_at timestamp with time zone,
  matches_count integer DEFAULT 0, -- How many tasks matched this alert
  
  -- Timestamps
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes
CREATE INDEX idx_task_alerts_user_id ON public.task_alerts(user_id);
CREATE INDEX idx_task_alerts_active ON public.task_alerts(is_active) WHERE is_active = true;
CREATE INDEX idx_task_alerts_categories ON public.task_alerts USING GIN (categories);
CREATE INDEX idx_task_alerts_locations ON public.task_alerts USING GIN (locations);

-- Enable RLS
ALTER TABLE public.task_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own task alerts"
  ON public.task_alerts
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own task alerts"
  ON public.task_alerts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own task alerts"
  ON public.task_alerts
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own task alerts"
  ON public.task_alerts
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to check if a task matches an alert
CREATE OR REPLACE FUNCTION public.task_matches_alert(
  task_category text,
  task_location text,
  task_budget integer,
  task_title text,
  alert_categories text[],
  alert_locations text[],
  alert_min_budget integer,
  alert_max_budget integer,
  alert_keywords text[]
) RETURNS boolean AS $$
BEGIN
  -- Check category (empty array means all categories)
  IF array_length(alert_categories, 1) > 0 AND NOT task_category = ANY(alert_categories) THEN
    RETURN false;
  END IF;
  
  -- Check location (empty array means all locations)
  IF array_length(alert_locations, 1) > 0 AND NOT task_location = ANY(alert_locations) THEN
    RETURN false;
  END IF;
  
  -- Check budget range
  IF task_budget < alert_min_budget OR task_budget > alert_max_budget THEN
    RETURN false;
  END IF;
  
  -- Check keywords (empty array means no keyword filter)
  IF array_length(alert_keywords, 1) > 0 THEN
    DECLARE
      keyword text;
      found boolean := false;
    BEGIN
      FOREACH keyword IN ARRAY alert_keywords LOOP
        IF lower(task_title) LIKE '%' || lower(keyword) || '%' THEN
          found := true;
          EXIT;
        END IF;
      END LOOP;
      IF NOT found THEN
        RETURN false;
      END IF;
    END;
  END IF;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Function to get matching alerts for a new task
CREATE OR REPLACE FUNCTION public.get_matching_alerts_for_task(
  p_category text,
  p_location text,
  p_budget integer,
  p_title text
) RETURNS TABLE (
  alert_id uuid,
  user_id uuid,
  email_enabled boolean,
  push_enabled boolean
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ta.id as alert_id,
    ta.user_id,
    ta.email_enabled,
    ta.push_enabled
  FROM public.task_alerts ta
  WHERE ta.is_active = true
    AND ta.frequency = 'immediate'
    AND public.task_matches_alert(
      p_category,
      p_location,
      p_budget,
      p_title,
      ta.categories,
      ta.locations,
      ta.min_budget,
      ta.max_budget,
      ta.keywords
    );
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION public.update_task_alerts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_task_alerts_updated_at
  BEFORE UPDATE ON public.task_alerts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_task_alerts_updated_at();

-- Comment
COMMENT ON TABLE public.task_alerts IS 'Stores user subscriptions for new task notifications based on category, location, and budget filters';

