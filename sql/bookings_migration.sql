-- =============================================
-- Bookings Migration for Rabotim.com
-- Run this in Supabase SQL Editor
-- =============================================

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Professional reference
  professional_id UUID NOT NULL,
  professional_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Client info
  client_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  client_name VARCHAR(100) NOT NULL,
  client_email VARCHAR(255) NOT NULL,
  client_phone VARCHAR(30),
  
  -- Service info
  service_id VARCHAR(50),
  service_name VARCHAR(150),
  
  -- Booking time
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME,
  duration_minutes INTEGER DEFAULT 60,
  
  -- Status: pending, confirmed, cancelled, completed, no_show
  status VARCHAR(20) DEFAULT 'pending',
  
  -- Notes
  client_notes TEXT,
  professional_notes TEXT,
  
  -- Price
  estimated_price DECIMAL(10, 2),
  final_price DECIMAL(10, 2),
  
  -- Notifications
  client_notified_at TIMESTAMP WITH TIME ZONE,
  professional_notified_at TIMESTAMP WITH TIME ZONE,
  reminder_sent_at TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Cancellation
  cancellation_reason TEXT,
  cancelled_by UUID REFERENCES auth.users(id),
  
  -- Constraints
  CONSTRAINT valid_status CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
  CONSTRAINT valid_duration CHECK (duration_minutes > 0 AND duration_minutes <= 480),
  CONSTRAINT valid_booking_date CHECK (booking_date >= CURRENT_DATE - INTERVAL '1 day')
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_professional_user_id ON bookings(professional_user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_client_user_id ON bookings(client_user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_professional_id ON bookings(professional_id);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_bookings_professional_date_status 
  ON bookings(professional_user_id, booking_date, status);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Professionals can view their own bookings
CREATE POLICY "Professionals can view their bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = professional_user_id);

-- Clients can view their own bookings
CREATE POLICY "Clients can view their bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = client_user_id);

-- Anyone can create a booking (clients booking professionals)
CREATE POLICY "Anyone can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (true);

-- Professionals can update their bookings (confirm, cancel, etc.)
CREATE POLICY "Professionals can update their bookings"
  ON bookings FOR UPDATE
  USING (auth.uid() = professional_user_id);

-- Clients can update their own bookings (cancel)
CREATE POLICY "Clients can update their bookings"
  ON bookings FOR UPDATE
  USING (auth.uid() = client_user_id AND status = 'pending');

-- Only professionals can delete bookings
CREATE POLICY "Professionals can delete their bookings"
  ON bookings FOR DELETE
  USING (auth.uid() = professional_user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_bookings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  
  -- Set confirmed_at when status changes to confirmed
  IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN
    NEW.confirmed_at = NOW();
  END IF;
  
  -- Set cancelled_at when status changes to cancelled
  IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
    NEW.cancelled_at = NOW();
  END IF;
  
  -- Set completed_at when status changes to completed
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    NEW.completed_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at and status timestamps
DROP TRIGGER IF EXISTS bookings_updated_at ON bookings;
CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_bookings_updated_at();

-- Success message
SELECT 'Bookings migration completed successfully!' as message;
