-- Function to let a user become a hospedeiro (self-service for MVP)
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
END;
$$;