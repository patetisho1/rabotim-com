-- Artist Premium: extend professional profiles + orders for artists (e.g. paintings by photo)
-- Revolut: optional barcode for payment (artist can enable/disable)

-- Add artist and Revolut fields to professional_profiles
ALTER TABLE public.professional_profiles
  ADD COLUMN IF NOT EXISTS is_artist BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS revolut_enabled BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS revolut_barcode_url TEXT;

COMMENT ON COLUMN public.professional_profiles.is_artist IS 'Premium artist profile: gallery + accept orders (portrait/painting, size, reference photo)';
COMMENT ON COLUMN public.professional_profiles.revolut_enabled IS 'Show Revolut barcode on order flow for payment';
COMMENT ON COLUMN public.professional_profiles.revolut_barcode_url IS 'Public URL of uploaded Revolut barcode image';

-- Artist orders: type (portrait/painting), size, reference photo, customer info
CREATE TABLE IF NOT EXISTS public.artist_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_profile_id UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
  -- Customer (can be unauthenticated; we store contact for the artist)
  customer_name VARCHAR(200),
  customer_email VARCHAR(255),
  customer_phone VARCHAR(50),
  -- Order details
  order_type VARCHAR(20) NOT NULL CHECK (order_type IN ('portrait', 'painting')),
  size VARCHAR(50) NOT NULL,
  reference_photo_url TEXT NOT NULL,
  notes TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_artist_orders_profile ON public.artist_orders(professional_profile_id);
CREATE INDEX IF NOT EXISTS idx_artist_orders_status ON public.artist_orders(status);
CREATE INDEX IF NOT EXISTS idx_artist_orders_created ON public.artist_orders(created_at DESC);

ALTER TABLE public.artist_orders ENABLE ROW LEVEL SECURITY;

-- Artist (profile owner) can view/update their orders
CREATE POLICY "Artist can view own orders"
  ON public.artist_orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.professional_profiles pp
      WHERE pp.id = artist_orders.professional_profile_id AND pp.user_id = auth.uid()
    )
  );

CREATE POLICY "Artist can update own orders"
  ON public.artist_orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.professional_profiles pp
      WHERE pp.id = artist_orders.professional_profile_id AND pp.user_id = auth.uid()
    )
  );

-- Anyone can create an order (public order form) – we rely on profile being published + is_artist
CREATE POLICY "Anyone can create artist order"
  ON public.artist_orders FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.professional_profiles pp
      WHERE pp.id = artist_orders.professional_profile_id
        AND pp.is_published = true
        AND pp.is_artist = true
    )
  );

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_artist_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_artist_orders_updated_at ON public.artist_orders;
CREATE TRIGGER trigger_artist_orders_updated_at
  BEFORE UPDATE ON public.artist_orders
  FOR EACH ROW
  EXECUTE PROCEDURE update_artist_orders_updated_at();

GRANT ALL ON public.artist_orders TO authenticated;
GRANT SELECT, INSERT ON public.artist_orders TO anon;

COMMENT ON TABLE public.artist_orders IS 'Orders for artist profiles: portrait/painting, size, reference photo, customer contact';
