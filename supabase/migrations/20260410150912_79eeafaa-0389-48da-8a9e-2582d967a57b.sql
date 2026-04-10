
-- 1. experience_availability table
CREATE TABLE public.experience_availability (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  experience_id UUID NOT NULL REFERENCES public.experiences(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  available_slots INTEGER NOT NULL DEFAULT 1,
  blocked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(experience_id, date)
);

ALTER TABLE public.experience_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view availability of active experiences"
ON public.experience_availability FOR SELECT
USING (EXISTS (
  SELECT 1 FROM experiences e
  WHERE e.id = experience_availability.experience_id
  AND (e.status = 'active' OR e.host_id = auth.uid())
));

CREATE POLICY "Hosts can insert availability"
ON public.experience_availability FOR INSERT
TO authenticated
WITH CHECK (EXISTS (
  SELECT 1 FROM experiences e
  WHERE e.id = experience_availability.experience_id AND e.host_id = auth.uid()
));

CREATE POLICY "Hosts can update availability"
ON public.experience_availability FOR UPDATE
TO authenticated
USING (EXISTS (
  SELECT 1 FROM experiences e
  WHERE e.id = experience_availability.experience_id AND e.host_id = auth.uid()
));

CREATE POLICY "Hosts can delete availability"
ON public.experience_availability FOR DELETE
TO authenticated
USING (EXISTS (
  SELECT 1 FROM experiences e
  WHERE e.id = experience_availability.experience_id AND e.host_id = auth.uid()
));

CREATE POLICY "Admins can view all availability"
ON public.experience_availability FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- 2. host_benefits table
CREATE TABLE public.host_benefits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  host_id UUID NOT NULL UNIQUE,
  free_until TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.host_benefits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hosts can view own benefits"
ON public.host_benefits FOR SELECT
TO authenticated
USING (auth.uid() = host_id);

CREATE POLICY "Admins can view all benefits"
ON public.host_benefits FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- 3. Update become_host to auto-insert 90-day free period
CREATE OR REPLACE FUNCTION public.become_host(_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, 'hospedeiro')
  ON CONFLICT (user_id, role) DO NOTHING;

  INSERT INTO public.host_benefits (host_id, free_until)
  VALUES (_user_id, now() + interval '90 days')
  ON CONFLICT (host_id) DO NOTHING;
END;
$$;

-- 4. Update booking confirmed trigger to check free period (0% during free, 5% after)
CREATE OR REPLACE FUNCTION public.handle_booking_confirmed()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_host_id UUID;
  v_commission_rate NUMERIC;
  v_commission NUMERIC;
  v_payout NUMERIC;
  v_free_until TIMESTAMPTZ;
BEGIN
  IF NEW.status = 'confirmed' AND (OLD.status IS NULL OR OLD.status != 'confirmed') THEN
    SELECT host_id INTO v_host_id FROM experiences WHERE id = NEW.experience_id;

    -- Check host free period
    SELECT free_until INTO v_free_until FROM host_benefits WHERE host_id = v_host_id;

    IF v_free_until IS NOT NULL AND now() < v_free_until THEN
      v_commission_rate := 0;
    ELSE
      v_commission_rate := 0.05;
    END IF;

    v_commission := NEW.total_price * v_commission_rate;
    v_payout := NEW.total_price - v_commission;

    -- Tourist payment
    INSERT INTO transactions (user_id, booking_id, type, amount, description, status)
    VALUES (NEW.tourist_id, NEW.id, 'payment', NEW.total_price, 'Pagamento de reserva', 'completed');

    -- Host payout
    INSERT INTO transactions (user_id, booking_id, type, amount, description, status)
    VALUES (v_host_id, NEW.id, 'payout', v_payout, 
      CASE WHEN v_commission_rate = 0 THEN 'Repasse de reserva (taxa zero - período gratuito)' 
      ELSE 'Repasse de reserva (95%)' END, 'pending');

    -- Platform commission (only if > 0)
    IF v_commission > 0 THEN
      INSERT INTO transactions (user_id, booking_id, type, amount, description, status)
      VALUES (v_host_id, NEW.id, 'commission', v_commission, 'Comissão plataforma (5%)', 'completed');
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- 5. Enable realtime on bookings
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
