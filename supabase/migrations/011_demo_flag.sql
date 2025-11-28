-- Add is_demo flag to tasks table
-- Demo tasks are shown only when there aren't enough real tasks

ALTER TABLE public.tasks 
ADD COLUMN IF NOT EXISTS is_demo boolean DEFAULT false;

-- Index for faster filtering
CREATE INDEX IF NOT EXISTS idx_tasks_is_demo ON public.tasks(is_demo);

-- Combined index for efficient queries
CREATE INDEX IF NOT EXISTS idx_tasks_status_demo ON public.tasks(status, is_demo);

COMMENT ON COLUMN public.tasks.is_demo IS 'Demo tasks are placeholder content shown when there are few real tasks';

