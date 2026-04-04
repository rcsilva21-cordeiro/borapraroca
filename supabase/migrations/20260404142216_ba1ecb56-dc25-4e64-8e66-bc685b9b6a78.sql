
-- Transaction types enum
CREATE TYPE public.transaction_type AS ENUM ('payment', 'commission', 'payout');
CREATE TYPE public.transaction_status AS ENUM ('pending', 'completed', 'failed');

-- Financial transactions table
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  user_id UUID NOT NULL,
  type transaction_type NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  description TEXT NOT NULL DEFAULT '',
  status transaction_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Users can view own transactions
CREATE POLICY "Users can view own transactions"
  ON public.transactions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Admins can view all transactions
CREATE POLICY "Admins can view all transactions"
  ON public.transactions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- System inserts (via trigger)
CREATE POLICY "System can insert transactions"
  ON public.transactions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Auto-create transactions when booking is confirmed
CREATE OR REPLACE FUNCTION public.handle_booking_confirmed()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_host_id UUID;
  v_commission NUMERIC;
  v_payout NUMERIC;
BEGIN
  IF NEW.status = 'confirmed' AND (OLD.status IS NULL OR OLD.status != 'confirmed') THEN
    -- Get host_id
    SELECT host_id INTO v_host_id FROM experiences WHERE id = NEW.experience_id;
    
    -- Platform commission 15%
    v_commission := NEW.total_price * 0.15;
    v_payout := NEW.total_price - v_commission;
    
    -- Tourist payment record
    INSERT INTO transactions (user_id, booking_id, type, amount, description, status)
    VALUES (NEW.tourist_id, NEW.id, 'payment', NEW.total_price, 'Pagamento de reserva', 'completed');
    
    -- Host payout record
    INSERT INTO transactions (user_id, booking_id, type, amount, description, status)
    VALUES (v_host_id, NEW.id, 'payout', v_payout, 'Repasse de reserva (85%)', 'pending');
    
    -- Platform commission record
    INSERT INTO transactions (user_id, booking_id, type, amount, description, status)
    VALUES (v_host_id, NEW.id, 'commission', v_commission, 'Comissão plataforma (15%)', 'completed');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_booking_confirmed
  AFTER UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_booking_confirmed();

-- Admin policy: allow admins to view ALL experiences (including non-active)
CREATE POLICY "Admins can view all experiences"
  ON public.experiences FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admin policy: allow admins to update any experience (approve/reject)
CREATE POLICY "Admins can update all experiences"
  ON public.experiences FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admin can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admin can view all roles
CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admin can view all bookings
CREATE POLICY "Admins can view all bookings"
  ON public.bookings FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
