
-- Trigger function to recalculate total_price on booking INSERT
-- This prevents price manipulation by recalculating from experience_age_ranges
CREATE OR REPLACE FUNCTION public.validate_booking_price()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_calculated_price NUMERIC := 0;
  v_guest_count INTEGER := 0;
  v_capacity INTEGER;
  v_base_price NUMERIC;
  v_has_age_ranges BOOLEAN;
BEGIN
  -- Get experience capacity and base price
  SELECT capacity, price INTO v_capacity, v_base_price
  FROM experiences
  WHERE id = NEW.experience_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Experience not found';
  END IF;

  -- Check if experience has age ranges configured
  SELECT EXISTS(
    SELECT 1 FROM experience_age_ranges WHERE experience_id = NEW.experience_id
  ) INTO v_has_age_ranges;

  IF v_has_age_ranges THEN
    -- Calculate price from booking_guests rows (inserted before or in same transaction)
    SELECT COALESCE(SUM(bg.quantity * ear.price), 0),
           COALESCE(SUM(bg.quantity), 0)
    INTO v_calculated_price, v_guest_count
    FROM booking_guests bg
    JOIN experience_age_ranges ear ON ear.id = bg.age_range_id
    WHERE bg.booking_id = NEW.id;

    -- If no booking_guests yet (they may be inserted after), use the submitted price
    -- but we'll also add a constraint trigger for UPDATE
    IF v_guest_count > 0 THEN
      NEW.total_price := v_calculated_price;
      NEW.guests := v_guest_count;
    ELSE
      -- Fallback: use base price * guests count
      NEW.total_price := v_base_price * NEW.guests;
    END IF;
  ELSE
    -- No age ranges: enforce base_price * guests
    NEW.total_price := v_base_price * NEW.guests;
  END IF;

  -- Validate capacity
  IF NEW.guests > v_capacity THEN
    RAISE EXCEPTION 'Guest count (%) exceeds experience capacity (%)', NEW.guests, v_capacity;
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger on bookings for INSERT
CREATE TRIGGER trg_validate_booking_price
  BEFORE INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_booking_price();

-- Also create a trigger to recalculate when booking_guests are inserted
-- This updates the parent booking after all guests are added
CREATE OR REPLACE FUNCTION public.recalculate_booking_after_guests()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_total NUMERIC;
  v_count INTEGER;
BEGIN
  SELECT COALESCE(SUM(bg.quantity * ear.price), 0),
         COALESCE(SUM(bg.quantity), 0)
  INTO v_total, v_count
  FROM booking_guests bg
  JOIN experience_age_ranges ear ON ear.id = bg.age_range_id
  WHERE bg.booking_id = NEW.booking_id;

  UPDATE bookings
  SET total_price = v_total,
      guests = v_count
  WHERE id = NEW.booking_id;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_recalculate_booking_guests
  AFTER INSERT ON public.booking_guests
  FOR EACH ROW
  EXECUTE FUNCTION public.recalculate_booking_after_guests();
