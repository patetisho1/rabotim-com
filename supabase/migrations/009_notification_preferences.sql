-- Create notification_preferences table
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email boolean DEFAULT true NOT NULL,
  push boolean DEFAULT false NOT NULL,
  in_app boolean DEFAULT true NOT NULL,
  sound_enabled boolean DEFAULT true NOT NULL,
  quiet_hours_enabled boolean DEFAULT false NOT NULL,
  quiet_hours_start time DEFAULT '22:00:00',
  quiet_hours_end time DEFAULT '08:00:00',
  quiet_hours_timezone text DEFAULT 'Europe/Sofia',
  frequency text DEFAULT 'immediate' CHECK (frequency IN ('immediate', 'hourly', 'daily', 'weekly')),
  category_settings jsonb DEFAULT '{
    "communication": {"email": true, "push": false, "inApp": true},
    "tasks": {"email": true, "push": false, "inApp": true},
    "payments": {"email": true, "push": false, "inApp": true},
    "system": {"email": false, "push": false, "inApp": true},
    "security": {"email": true, "push": true, "inApp": true},
    "achievements": {"email": false, "push": false, "inApp": true}
  }'::jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for user_id
CREATE INDEX idx_notification_preferences_user_id ON public.notification_preferences(user_id);

-- Enable RLS
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own notification preferences"
  ON public.notification_preferences
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notification preferences"
  ON public.notification_preferences
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notification preferences"
  ON public.notification_preferences
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create function to automatically create preferences for new users
CREATE OR REPLACE FUNCTION public.handle_new_user_notification_preferences()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.notification_preferences (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-create preferences when user is created
DROP TRIGGER IF EXISTS on_user_created_create_notification_preferences ON public.users;
CREATE TRIGGER on_user_created_create_notification_preferences
  AFTER INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_notification_preferences();

