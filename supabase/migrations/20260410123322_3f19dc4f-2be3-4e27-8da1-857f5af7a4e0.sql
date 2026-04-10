
-- Reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  experience_id UUID NOT NULL REFERENCES public.experiences(id) ON DELETE CASCADE,
  tourist_id UUID NOT NULL,
  tourist_name TEXT NOT NULL DEFAULT '',
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Unique constraint: one review per tourist per experience
CREATE UNIQUE INDEX idx_reviews_tourist_experience ON public.reviews (tourist_id, experience_id);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Tourists can insert own review" ON public.reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = tourist_id);
CREATE POLICY "Tourists can update own review" ON public.reviews FOR UPDATE TO authenticated USING (auth.uid() = tourist_id);
CREATE POLICY "Tourists can delete own review" ON public.reviews FOR DELETE TO authenticated USING (auth.uid() = tourist_id);

-- Favorites table
CREATE TABLE public.favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tourist_id UUID NOT NULL,
  experience_id UUID NOT NULL REFERENCES public.experiences(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_favorites_tourist_experience ON public.favorites (tourist_id, experience_id);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites" ON public.favorites FOR SELECT TO authenticated USING (auth.uid() = tourist_id);
CREATE POLICY "Users can insert own favorites" ON public.favorites FOR INSERT TO authenticated WITH CHECK (auth.uid() = tourist_id);
CREATE POLICY "Users can delete own favorites" ON public.favorites FOR DELETE TO authenticated USING (auth.uid() = tourist_id);
