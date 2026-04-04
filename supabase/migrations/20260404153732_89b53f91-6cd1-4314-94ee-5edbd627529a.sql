
-- Table for host-defined age ranges per experience
CREATE TABLE public.experience_age_ranges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  experience_id UUID NOT NULL REFERENCES public.experiences(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  min_age INTEGER NOT NULL DEFAULT 0,
  max_age INTEGER NOT NULL DEFAULT 99,
  price NUMERIC NOT NULL DEFAULT 0,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.experience_age_ranges ENABLE ROW LEVEL SECURITY;

-- Anyone can view age ranges of active experiences
CREATE POLICY "Anyone can view age ranges" ON public.experience_age_ranges
  FOR SELECT TO public
  USING (EXISTS (
    SELECT 1 FROM experiences e
    WHERE e.id = experience_age_ranges.experience_id
      AND (e.status = 'active' OR e.host_id = auth.uid())
  ));

-- Hosts can manage age ranges for own experiences
CREATE POLICY "Hosts can insert age ranges" ON public.experience_age_ranges
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM experiences e
    WHERE e.id = experience_age_ranges.experience_id AND e.host_id = auth.uid()
  ));

CREATE POLICY "Hosts can update age ranges" ON public.experience_age_ranges
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM experiences e
    WHERE e.id = experience_age_ranges.experience_id AND e.host_id = auth.uid()
  ));

CREATE POLICY "Hosts can delete age ranges" ON public.experience_age_ranges
  FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM experiences e
    WHERE e.id = experience_age_ranges.experience_id AND e.host_id = auth.uid()
  ));

-- Admins can view all
CREATE POLICY "Admins can view all age ranges" ON public.experience_age_ranges
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- Table for booking guest details per age range
CREATE TABLE public.booking_guests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  age_range_id UUID NOT NULL REFERENCES public.experience_age_ranges(id),
  label TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  unit_price NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.booking_guests ENABLE ROW LEVEL SECURITY;

-- Tourists can insert their own booking guests
CREATE POLICY "Tourists can insert booking guests" ON public.booking_guests
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM bookings b WHERE b.id = booking_guests.booking_id AND b.tourist_id = auth.uid()
  ));

-- Tourists can view own booking guests
CREATE POLICY "Tourists can view own booking guests" ON public.booking_guests
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM bookings b WHERE b.id = booking_guests.booking_id AND b.tourist_id = auth.uid()
  ));

-- Hosts can view booking guests for their experiences
CREATE POLICY "Hosts can view booking guests" ON public.booking_guests
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM bookings b
    JOIN experiences e ON e.id = b.experience_id
    WHERE b.id = booking_guests.booking_id AND e.host_id = auth.uid()
  ));

-- Admins can view all
CREATE POLICY "Admins can view all booking guests" ON public.booking_guests
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'));
