
-- Booking status enum
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- Bookings table
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id uuid NOT NULL REFERENCES public.experiences(id) ON DELETE CASCADE,
  tourist_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_date date NOT NULL,
  guests integer NOT NULL DEFAULT 1,
  total_price numeric(10,2) NOT NULL,
  status booking_status NOT NULL DEFAULT 'pending',
  message text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Auto-update updated_at
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Tourists can view their own bookings
CREATE POLICY "Tourists can view own bookings"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = tourist_id);

-- Hosts can view bookings for their experiences
CREATE POLICY "Hosts can view bookings for own experiences"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.experiences e
      WHERE e.id = experience_id AND e.host_id = auth.uid()
    )
  );

-- Tourists can create bookings
CREATE POLICY "Tourists can create bookings"
  ON public.bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = tourist_id);

-- Tourists can cancel their own bookings
CREATE POLICY "Tourists can update own bookings"
  ON public.bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = tourist_id)
  WITH CHECK (auth.uid() = tourist_id);

-- Hosts can update booking status for their experiences
CREATE POLICY "Hosts can update bookings for own experiences"
  ON public.bookings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.experiences e
      WHERE e.id = experience_id AND e.host_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.experiences e
      WHERE e.id = experience_id AND e.host_id = auth.uid()
    )
  );
