ALTER TABLE public.experiences ALTER COLUMN rating SET DEFAULT 5.0;
UPDATE public.experiences SET rating = 5.0 WHERE rating = 0;