-- Migration: Improve Task Completion Flow
-- 1. Notification when one party confirms completion
-- 2. Auto-complete after 7 days if other party doesn't confirm
-- 3. Helper function to auto-complete tasks

-- Function to notify when one party confirms completion
CREATE OR REPLACE FUNCTION public.notify_completion_confirmation()
RETURNS TRIGGER AS $$
DECLARE
  task_title text;
  task_owner_id uuid;
  confirmed_by_name text;
  other_party_id uuid;
  accepted_applicants uuid[];
  applicant_id uuid;
  is_poster_confirmed boolean;
  is_worker_confirmed boolean;
BEGIN
  -- Get task details
  SELECT title, user_id INTO task_title, task_owner_id
  FROM public.tasks
  WHERE id = NEW.id;

  is_poster_confirmed := COALESCE(NEW.completion_confirmed_by_poster, false);
  is_worker_confirmed := COALESCE(NEW.completion_confirmed_by_worker, false);

  -- Check if poster just confirmed
  IF (NOT COALESCE(OLD.completion_confirmed_by_poster, false) AND is_poster_confirmed) THEN
    -- Get poster name
    SELECT full_name INTO confirmed_by_name
    FROM public.users
    WHERE id = task_owner_id;

    -- Notify all accepted applicants (workers)
    SELECT array_agg(user_id) INTO accepted_applicants
    FROM public.task_applications
    WHERE task_id = NEW.id AND status = 'accepted';

    IF accepted_applicants IS NOT NULL THEN
      FOREACH applicant_id IN ARRAY accepted_applicants
      LOOP
        INSERT INTO public.notifications (user_id, type, title, message, data)
        VALUES (
          applicant_id,
          'completion_confirmed',
          'Работодателят потвърди завършването',
          confirmed_by_name || ' потвърди завършването на "' || task_title || '". Потвърдете и вие, за да завършите задачата.',
          jsonb_build_object(
            'task_id', NEW.id,
            'confirmed_by', 'poster',
            'auto_complete_date', (NEW.completion_confirmed_by_poster_at + INTERVAL '7 days')::text
          )
        );
      END LOOP;
    END IF;
  END IF;

  -- Check if worker just confirmed
  IF (NOT COALESCE(OLD.completion_confirmed_by_worker, false) AND is_worker_confirmed) THEN
    -- Get worker name (need to find which worker confirmed)
    SELECT full_name INTO confirmed_by_name
    FROM public.users u
    JOIN public.task_applications ta ON u.id = ta.user_id
    WHERE ta.task_id = NEW.id 
      AND ta.status = 'accepted'
      AND u.id IN (
        SELECT user_id FROM public.task_applications
        WHERE task_id = NEW.id AND status = 'accepted'
      )
    LIMIT 1;

    -- Notify task owner (poster)
    INSERT INTO public.notifications (user_id, type, title, message, data)
    VALUES (
      task_owner_id,
      'completion_confirmed',
      'Изпълнителят потвърди завършването',
      COALESCE(confirmed_by_name, 'Изпълнител') || ' потвърди завършването на "' || task_title || '". Потвърдете и вие, за да завършите задачата.',
      jsonb_build_object(
        'task_id', NEW.id,
        'confirmed_by', 'worker',
        'auto_complete_date', (NEW.completion_confirmed_by_worker_at + INTERVAL '7 days')::text
      )
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for completion confirmation notifications
DROP TRIGGER IF EXISTS trigger_notify_completion_confirmation ON public.tasks;
CREATE TRIGGER trigger_notify_completion_confirmation
  AFTER UPDATE OF completion_confirmed_by_poster, completion_confirmed_by_worker, 
                  completion_confirmed_by_poster_at, completion_confirmed_by_worker_at
  ON public.tasks
  FOR EACH ROW
  WHEN (
    (OLD.completion_confirmed_by_poster IS DISTINCT FROM NEW.completion_confirmed_by_poster) OR
    (OLD.completion_confirmed_by_worker IS DISTINCT FROM NEW.completion_confirmed_by_worker)
  )
  EXECUTE FUNCTION public.notify_completion_confirmation();

-- Function to auto-complete tasks after 7 days
-- This function can be called periodically (e.g., via cron job or scheduled task)
CREATE OR REPLACE FUNCTION public.auto_complete_tasks_after_7_days()
RETURNS TABLE(
  task_id uuid,
  task_title text,
  completed_count integer
) AS $$
DECLARE
  task_rec RECORD;
  completed_count_var integer := 0;
BEGIN
  -- Find tasks that should be auto-completed:
  -- 1. Status is 'in_progress'
  -- 2. One party confirmed but other didn't
  -- 3. 7 days have passed since confirmation
  FOR task_rec IN
    SELECT 
      t.id,
      t.title,
      t.completion_confirmed_by_poster,
      t.completion_confirmed_by_poster_at,
      t.completion_confirmed_by_worker,
      t.completion_confirmed_by_worker_at,
      t.status
    FROM public.tasks t
    WHERE t.status = 'in_progress'
      AND (
        -- Poster confirmed 7+ days ago, worker didn't
        (t.completion_confirmed_by_poster = true 
         AND t.completion_confirmed_by_poster_at IS NOT NULL
         AND (t.completion_confirmed_by_poster_at + INTERVAL '7 days') <= NOW()
         AND (t.completion_confirmed_by_worker IS NULL OR t.completion_confirmed_by_worker = false))
        OR
        -- Worker confirmed 7+ days ago, poster didn't
        (t.completion_confirmed_by_worker = true
         AND t.completion_confirmed_by_worker_at IS NOT NULL
         AND (t.completion_confirmed_by_worker_at + INTERVAL '7 days') <= NOW()
         AND (t.completion_confirmed_by_poster IS NULL OR t.completion_confirmed_by_poster = false))
      )
  LOOP
    -- Auto-complete the task
    UPDATE public.tasks
    SET 
      status = 'completed',
      -- If one party didn't confirm, mark it as confirmed automatically
      completion_confirmed_by_poster = CASE 
        WHEN task_rec.completion_confirmed_by_poster IS NULL OR task_rec.completion_confirmed_by_poster = false 
        THEN true 
        ELSE task_rec.completion_confirmed_by_poster 
      END,
      completion_confirmed_by_worker = CASE 
        WHEN task_rec.completion_confirmed_by_worker IS NULL OR task_rec.completion_confirmed_by_worker = false 
        THEN true 
        ELSE task_rec.completion_confirmed_by_worker 
      END,
      completion_confirmed_by_poster_at = CASE 
        WHEN task_rec.completion_confirmed_by_poster_at IS NULL 
        THEN NOW() 
        ELSE task_rec.completion_confirmed_by_poster_at 
      END,
      completion_confirmed_by_worker_at = CASE 
        WHEN task_rec.completion_confirmed_by_worker_at IS NULL 
        THEN NOW() 
        ELSE task_rec.completion_confirmed_by_worker_at 
      END,
      updated_at = NOW()
    WHERE id = task_rec.id;

    completed_count_var := completed_count_var + 1;
    
    -- Return info about completed task
    task_id := task_rec.id;
    task_title := task_rec.title;
    completed_count := completed_count_var;
    
    RETURN NEXT;
  END LOOP;

  RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check and auto-complete a specific task (can be called from API)
CREATE OR REPLACE FUNCTION public.check_and_auto_complete_task(task_id_param uuid)
RETURNS boolean AS $$
DECLARE
  task_rec RECORD;
  should_complete boolean := false;
BEGIN
  SELECT 
    id,
    status,
    completion_confirmed_by_poster,
    completion_confirmed_by_poster_at,
    completion_confirmed_by_worker,
    completion_confirmed_by_worker_at
  INTO task_rec
  FROM public.tasks
  WHERE id = task_id_param;

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  -- Check if should auto-complete
  IF task_rec.status = 'in_progress' THEN
    -- Poster confirmed 7+ days ago, worker didn't
    IF (task_rec.completion_confirmed_by_poster = true 
        AND task_rec.completion_confirmed_by_poster_at IS NOT NULL
        AND (task_rec.completion_confirmed_by_poster_at + INTERVAL '7 days') <= NOW()
        AND (task_rec.completion_confirmed_by_worker IS NULL OR task_rec.completion_confirmed_by_worker = false)) THEN
      should_complete := true;
    -- Worker confirmed 7+ days ago, poster didn't
    ELSIF (task_rec.completion_confirmed_by_worker = true
           AND task_rec.completion_confirmed_by_worker_at IS NOT NULL
           AND (task_rec.completion_confirmed_by_worker_at + INTERVAL '7 days') <= NOW()
           AND (task_rec.completion_confirmed_by_poster IS NULL OR task_rec.completion_confirmed_by_poster = false)) THEN
      should_complete := true;
    END IF;
  END IF;

  IF should_complete THEN
    -- Auto-complete the task
    UPDATE public.tasks
    SET 
      status = 'completed',
      completion_confirmed_by_poster = CASE 
        WHEN task_rec.completion_confirmed_by_poster IS NULL OR task_rec.completion_confirmed_by_poster = false 
        THEN true 
        ELSE task_rec.completion_confirmed_by_poster 
      END,
      completion_confirmed_by_worker = CASE 
        WHEN task_rec.completion_confirmed_by_worker IS NULL OR task_rec.completion_confirmed_by_worker = false 
        THEN true 
        ELSE task_rec.completion_confirmed_by_worker 
      END,
      completion_confirmed_by_poster_at = CASE 
        WHEN task_rec.completion_confirmed_by_poster_at IS NULL 
        THEN NOW() 
        ELSE task_rec.completion_confirmed_by_poster_at 
      END,
      completion_confirmed_by_worker_at = CASE 
        WHEN task_rec.completion_confirmed_by_worker_at IS NULL 
        THEN NOW() 
        ELSE task_rec.completion_confirmed_by_worker_at 
      END,
      updated_at = NOW()
    WHERE id = task_id_param;

    RETURN true;
  END IF;

  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.auto_complete_tasks_after_7_days() TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_and_auto_complete_task(uuid) TO authenticated;

