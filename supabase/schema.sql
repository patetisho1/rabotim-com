-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable Row Level Security
CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claim.sub', true),
    (current_setting('request.jwt.claims', true)::jsonb ->> 'sub')
  )::uuid
$$ LANGUAGE sql STABLE;

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  avatar_url text,
  phone text,
  location text,
  bio text,
  rating decimal(3,2) DEFAULT 0.0,
  total_reviews integer DEFAULT 0,
  verified boolean DEFAULT false,
  is_task_giver boolean DEFAULT true,
  is_task_executor boolean DEFAULT false,
  is_premium boolean DEFAULT false,
  premium_expiry timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tasks table
CREATE TABLE public.tasks (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  location text NOT NULL,
  price decimal(10,2) NOT NULL,
  price_type text CHECK (price_type IN ('hourly', 'fixed')) NOT NULL,
  urgent boolean DEFAULT false,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  status text CHECK (status IN ('active', 'in_progress', 'completed', 'cancelled')) DEFAULT 'active',
  applications_count integer DEFAULT 0,
  views_count integer DEFAULT 0,
  deadline timestamp with time zone,
  attachments text[],
  images text[],
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Task applications table
CREATE TABLE public.task_applications (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  task_id uuid REFERENCES public.tasks(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  message text,
  proposed_price decimal(10,2),
  status text CHECK (status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(task_id, user_id)
);

-- Ratings table
CREATE TABLE public.ratings (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  task_id uuid REFERENCES public.tasks(id) ON DELETE CASCADE NOT NULL,
  reviewer_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  reviewed_user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment text NOT NULL,
  category text CHECK (category IN ('quality', 'communication', 'punctuality', 'overall')) NOT NULL,
  is_verified boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Messages table
CREATE TABLE public.messages (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  conversation_id uuid NOT NULL,
  sender_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  receiver_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  attachments text[],
  read_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Notifications table
CREATE TABLE public.notifications (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  data jsonb,
  read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for better performance
CREATE INDEX idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX idx_tasks_category ON public.tasks(category);
CREATE INDEX idx_tasks_location ON public.tasks(location);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_created_at ON public.tasks(created_at);

CREATE INDEX idx_task_applications_task_id ON public.task_applications(task_id);
CREATE INDEX idx_task_applications_user_id ON public.task_applications(user_id);

CREATE INDEX idx_ratings_reviewed_user_id ON public.ratings(reviewed_user_id);
CREATE INDEX idx_ratings_reviewer_id ON public.ratings(reviewer_id);
CREATE INDEX idx_ratings_task_id ON public.ratings(task_id);

CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON public.messages(receiver_id);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);

-- Row Level Security Policies

-- Users can view all profiles but only update their own
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" ON public.users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Tasks policies
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tasks are viewable by everyone" ON public.tasks
  FOR SELECT USING (true);

CREATE POLICY "Users can create their own tasks" ON public.tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks" ON public.tasks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks" ON public.tasks
  FOR DELETE USING (auth.uid() = user_id);

-- Task applications policies
ALTER TABLE public.task_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Applications viewable by task owner and applicant" ON public.task_applications
  FOR SELECT USING (
    auth.uid() = user_id OR 
    auth.uid() = (SELECT user_id FROM public.tasks WHERE id = task_id)
  );

CREATE POLICY "Users can create applications" ON public.task_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Ratings policies
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ratings are viewable by everyone" ON public.ratings
  FOR SELECT USING (true);

CREATE POLICY "Users can create ratings" ON public.ratings
  FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Messages policies
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own messages" ON public.messages
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Notifications policies
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Functions and Triggers

-- Update user rating when new rating is added
CREATE OR REPLACE FUNCTION update_user_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users 
  SET 
    rating = (
      SELECT AVG(rating::decimal) 
      FROM public.ratings 
      WHERE reviewed_user_id = NEW.reviewed_user_id
    ),
    total_reviews = (
      SELECT COUNT(*) 
      FROM public.ratings 
      WHERE reviewed_user_id = NEW.reviewed_user_id
    ),
    updated_at = timezone('utc'::text, now())
  WHERE id = NEW.reviewed_user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_rating
  AFTER INSERT ON public.ratings
  FOR EACH ROW EXECUTE FUNCTION update_user_rating();

-- Update task applications count
CREATE OR REPLACE FUNCTION update_task_applications_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.tasks 
  SET 
    applications_count = (
      SELECT COUNT(*) 
      FROM public.task_applications 
      WHERE task_id = COALESCE(NEW.task_id, OLD.task_id)
    ),
    updated_at = timezone('utc'::text, now())
  WHERE id = COALESCE(NEW.task_id, OLD.task_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_applications_count
  AFTER INSERT OR DELETE ON public.task_applications
  FOR EACH ROW EXECUTE FUNCTION update_task_applications_count();

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment task views
CREATE OR REPLACE FUNCTION increment_task_views(task_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.tasks 
  SET views_count = views_count + 1
  WHERE id = task_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger function to create user profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
