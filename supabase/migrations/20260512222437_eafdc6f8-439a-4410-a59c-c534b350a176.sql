
-- Notifications table
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  message text NOT NULL DEFAULT '',
  link text,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user_created ON public.notifications(user_id, created_at DESC);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users update own notifications"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own notifications"
  ON public.notifications FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;

-- Trigger function: notify all tourists when experience becomes active
CREATE OR REPLACE FUNCTION public.notify_tourists_new_experience()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'active' AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'active') THEN
    INSERT INTO public.notifications (user_id, title, message, link)
    SELECT ur.user_id,
           'Nova experiência disponível! 🌿',
           NEW.title || ' em ' || NEW.location,
           '/experiencia/' || NEW.id
    FROM public.user_roles ur
    WHERE ur.role = 'turista'
      AND ur.user_id <> NEW.host_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_notify_tourists_new_experience
AFTER INSERT OR UPDATE OF status ON public.experiences
FOR EACH ROW
EXECUTE FUNCTION public.notify_tourists_new_experience();
