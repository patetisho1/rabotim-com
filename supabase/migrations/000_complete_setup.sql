-- =====================================================
-- RABOTIM.COM - ПЪЛНА БАЗА ДАННИ
-- Изпълни този скрипт в Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.users (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  phone text,
  bio text,
  location text,
  skills text[],
  rating numeric(3,2) DEFAULT 0,
  rating_count integer DEFAULT 0,
  is_verified boolean DEFAULT false,
  is_professional boolean DEFAULT false,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- 2. TASKS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.tasks (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  location text NOT NULL,
  price numeric(10,2),
  price_type text DEFAULT 'fixed' CHECK (price_type IN ('fixed', 'hourly', 'negotiable')),
  status text DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled', 'pending')),
  urgent boolean DEFAULT false,
  images text[],
  deadline timestamp with time zone,
  views integer DEFAULT 0,
  is_promoted boolean DEFAULT false,
  promotion_type text,
  promotion_expires_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- 3. APPLICATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.applications (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  task_id uuid REFERENCES public.tasks(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  message text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(task_id, user_id)
);

-- =====================================================
-- 4. MESSAGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  conversation_id uuid NOT NULL,
  sender_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  receiver_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  attachments text[],
  read_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- 5. NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  data jsonb,
  read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- 6. RATINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.ratings (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  task_id uuid REFERENCES public.tasks(id) ON DELETE CASCADE NOT NULL,
  rater_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  rated_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(task_id, rater_id, rated_id)
);

-- =====================================================
-- 7. REVIEWS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  reviewer_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  task_id uuid REFERENCES public.tasks(id) ON DELETE SET NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  is_verified boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- 8. REPORTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.reports (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  reporter_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  reported_type text NOT NULL CHECK (reported_type IN ('task', 'user', 'message')),
  reported_id uuid NOT NULL,
  reason text NOT NULL CHECK (reason IN ('spam', 'inappropriate', 'scam', 'harassment', 'fake', 'other')),
  description text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  admin_notes text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- 9. USER_BLOCKS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_blocks (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  blocker_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  blocked_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(blocker_id, blocked_id)
);

-- =====================================================
-- 10. FCM_TOKENS TABLE (Push Notifications)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.fcm_tokens (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  token text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- 11. FAVORITES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.favorites (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  task_id uuid REFERENCES public.tasks(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, task_id)
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_category ON public.tasks(category);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_location ON public.tasks(location);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON public.tasks(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_applications_task_id ON public.applications(task_id);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON public.applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON public.messages(receiver_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);

CREATE INDEX IF NOT EXISTS idx_ratings_task_id ON public.ratings(task_id);
CREATE INDEX IF NOT EXISTS idx_ratings_rated_id ON public.ratings(rated_id);

CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);

CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_reporter ON public.reports(reporter_id);

CREATE INDEX IF NOT EXISTS idx_user_blocks_blocker ON public.user_blocks(blocker_id);
CREATE INDEX IF NOT EXISTS idx_user_blocks_blocked ON public.user_blocks(blocked_id);

CREATE INDEX IF NOT EXISTS idx_fcm_tokens_user ON public.fcm_tokens(user_id);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_task_id ON public.favorites(task_id);

-- =====================================================
-- ROW LEVEL SECURITY (Simplified - no subqueries)
-- =====================================================

-- Users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public profiles viewable" ON public.users;
DROP POLICY IF EXISTS "Users update own profile" ON public.users;
CREATE POLICY "Public profiles viewable" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- Tasks
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Tasks viewable by all" ON public.tasks;
DROP POLICY IF EXISTS "Users create own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users update own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users delete own tasks" ON public.tasks;
CREATE POLICY "Tasks viewable by all" ON public.tasks FOR SELECT USING (true);
CREATE POLICY "Users create own tasks" ON public.tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own tasks" ON public.tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own tasks" ON public.tasks FOR DELETE USING (auth.uid() = user_id);

-- Applications (simplified - view all for now, can restrict later)
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "View applications" ON public.applications;
DROP POLICY IF EXISTS "Create applications" ON public.applications;
DROP POLICY IF EXISTS "Update applications" ON public.applications;
CREATE POLICY "View applications" ON public.applications FOR SELECT USING (true);
CREATE POLICY "Create applications" ON public.applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Update applications" ON public.applications FOR UPDATE USING (auth.uid() = user_id);

-- Messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "View own messages" ON public.messages;
DROP POLICY IF EXISTS "Send messages" ON public.messages;
CREATE POLICY "View own messages" ON public.messages FOR SELECT 
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Send messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "View own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Update own notifications" ON public.notifications;
CREATE POLICY "View own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Insert notifications" ON public.notifications FOR INSERT WITH CHECK (true);

-- Ratings
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "View all ratings" ON public.ratings;
DROP POLICY IF EXISTS "Create own ratings" ON public.ratings;
CREATE POLICY "View all ratings" ON public.ratings FOR SELECT USING (true);
CREATE POLICY "Create own ratings" ON public.ratings FOR INSERT WITH CHECK (auth.uid() = rater_id);

-- Reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "View all reviews" ON public.reviews;
DROP POLICY IF EXISTS "Create own reviews" ON public.reviews;
CREATE POLICY "View all reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Create own reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Reports
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Create reports" ON public.reports;
DROP POLICY IF EXISTS "View own reports" ON public.reports;
CREATE POLICY "Create reports" ON public.reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "View own reports" ON public.reports FOR SELECT USING (auth.uid() = reporter_id);

-- User Blocks
ALTER TABLE public.user_blocks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Manage own blocks" ON public.user_blocks;
CREATE POLICY "Manage own blocks" ON public.user_blocks FOR ALL USING (auth.uid() = blocker_id);

-- FCM Tokens
ALTER TABLE public.fcm_tokens ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Manage own token" ON public.fcm_tokens;
CREATE POLICY "Manage own token" ON public.fcm_tokens FOR ALL USING (auth.uid() = user_id);

-- Favorites
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Manage own favorites" ON public.favorites;
CREATE POLICY "Manage own favorites" ON public.favorites FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS users_updated_at ON public.users;
DROP TRIGGER IF EXISTS tasks_updated_at ON public.tasks;
DROP TRIGGER IF EXISTS applications_updated_at ON public.applications;
DROP TRIGGER IF EXISTS reports_updated_at ON public.reports;
DROP TRIGGER IF EXISTS fcm_tokens_updated_at ON public.fcm_tokens;

-- Create triggers for updated_at
CREATE TRIGGER users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER applications_updated_at BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER reports_updated_at BEFORE UPDATE ON public.reports FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER fcm_tokens_updated_at BEFORE UPDATE ON public.fcm_tokens FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Update user rating function
CREATE OR REPLACE FUNCTION update_user_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users SET
    rating = (SELECT COALESCE(AVG(rating), 0) FROM public.ratings WHERE rated_id = NEW.rated_id),
    rating_count = (SELECT COUNT(*) FROM public.ratings WHERE rated_id = NEW.rated_id)
  WHERE id = NEW.rated_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_rating_change ON public.ratings;
CREATE TRIGGER on_rating_change
  AFTER INSERT OR UPDATE ON public.ratings
  FOR EACH ROW EXECUTE FUNCTION update_user_rating();

-- =====================================================
-- DONE!
-- =====================================================
SELECT 'Database setup complete! All 11 tables created.' as status;
