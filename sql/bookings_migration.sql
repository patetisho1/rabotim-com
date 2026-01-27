-- =====================================================
-- Bookings/Reservations System Migration
-- =====================================================
-- Run this in Supabase SQL Editor

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Who is being booked
  professional_id UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
  professional_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Who is making the booking
  client_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  client_name VARCHAR(100) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  client_phone VARCHAR(30),
  
  -- Booking details
  service_name VARCHAR(200),
  service_id VARCHAR(50), -- Reference to service in professional's services array
  
  -- Date and time
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME,
  duration_minutes INTEGER DEFAULT 60,
  
  -- Status: pending, confirmed, cancelled, completed, no_show
  status VARCHAR(20) DEFAULT 'pending',
  
  -- Notes
  client_notes TEXT,
  professional_notes TEXT,
  
  -- Pricing (optional)
  estimated_price DECIMAL(10, 2),
  currency VARCHAR(3) DEFAULT 'EUR',
  
  -- Calendar sync
  google_event_id VARCHAR(255),
  outlook_event_id VARCHAR(255),
  
  -- Notifications tracking
  client_notified_at TIMESTAMP WITH TIME ZONE,
  professional_notified_at TIMESTAMP WITH TIME ZONE,
  reminder_sent_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Constraints
  CONSTRAINT valid_status CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
  CONSTRAINT valid_booking_date CHECK (booking_date >= CURRENT_DATE)
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_bookings_professional_id ON public.bookings(professional_id);
CREATE INDEX IF NOT EXISTS idx_bookings_professional_user_id ON public.bookings(professional_user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_client_user_id ON public.bookings(client_user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings(created_at);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Professionals can view their own bookings
CREATE POLICY "Professionals can view own bookings"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (professional_user_id = auth.uid());

-- Clients can view their own bookings
CREATE POLICY "Clients can view own bookings"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (client_user_id = auth.uid());

-- Anyone can create a booking (for non-logged in clients too)
CREATE POLICY "Anyone can create bookings"
  ON public.bookings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Professionals can update their bookings
CREATE POLICY "Professionals can update own bookings"
  ON public.bookings FOR UPDATE
  TO authenticated
  USING (professional_user_id = auth.uid());

-- Clients can update their own bookings (cancel)
CREATE POLICY "Clients can update own bookings"
  ON public.bookings FOR UPDATE
  TO authenticated
  USING (client_user_id = auth.uid());

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_bookings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS update_bookings_updated_at ON public.bookings;
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_bookings_updated_at();

-- =====================================================
-- Availability slots table (optional - for working hours)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.availability_slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
  
  -- Day of week (0=Sunday, 1=Monday, etc.) or specific date
  day_of_week INTEGER, -- 0-6 for recurring
  specific_date DATE, -- For one-time availability
  
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  
  is_available BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_day_of_week CHECK (day_of_week IS NULL OR (day_of_week >= 0 AND day_of_week <= 6)),
  CONSTRAINT either_day_or_date CHECK (
    (day_of_week IS NOT NULL AND specific_date IS NULL) OR
    (day_of_week IS NULL AND specific_date IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS idx_availability_professional ON public.availability_slots(professional_id);
CREATE INDEX IF NOT EXISTS idx_availability_day ON public.availability_slots(day_of_week);
CREATE INDEX IF NOT EXISTS idx_availability_date ON public.availability_slots(specific_date);

-- Enable RLS
ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;

-- RLS Policies for availability
CREATE POLICY "Anyone can view availability"
  ON public.availability_slots FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Professionals can manage own availability"
  ON public.availability_slots FOR ALL
  TO authenticated
  USING (
    professional_id IN (
      SELECT id FROM public.professional_profiles WHERE user_id = auth.uid()
    )
  );

-- =====================================================
-- Grant permissions
-- =====================================================

GRANT SELECT, INSERT, UPDATE ON public.bookings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT SELECT ON public.availability_slots TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.availability_slots TO authenticated;

SELECT 'Bookings migration completed successfully!' as status;

