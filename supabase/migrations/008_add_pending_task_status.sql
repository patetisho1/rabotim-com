-- Allow pending status for tasks moderation
ALTER TABLE public.tasks
  DROP CONSTRAINT IF EXISTS tasks_status_check;

ALTER TABLE public.tasks
  ADD CONSTRAINT tasks_status_check
  CHECK (status IN ('pending', 'active', 'in_progress', 'completed', 'cancelled'));

