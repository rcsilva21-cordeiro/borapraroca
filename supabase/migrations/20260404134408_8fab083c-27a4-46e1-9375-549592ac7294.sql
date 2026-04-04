
-- Experience status enum
CREATE TYPE public.experience_status AS ENUM ('draft', 'pending', 'active', 'inactive');

-- Experience category enum matching frontend
CREATE TYPE public.experience_category AS ENUM (
  'Hospedagem', 'Trilhas', 'Gastronomia', 'Bike Tour', 'Ecoturismo', 'Camping', 'Cavalgada'
);

-- Experience duration enum
CREATE TYPE public.experience_duration AS ENUM (
  'meio-dia', 'dia-inteiro', 'diaria', 'fim-de-semana', 'personalizado'
);

-- Experiences table
CREATE TABLE public.experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  category experience_category NOT NULL,
  price numeric(10,2) NOT NULL DEFAULT 0,
  capacity integer NOT NULL DEFAULT 1,
  duration experience_duration NOT NULL DEFAULT 'dia-inteiro',
  includes text[] DEFAULT '{}',
  status experience_status NOT NULL DEFAULT 'draft',
  rating numeric(2,1) DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Auto-update updated_at
CREATE TRIGGER update_experiences_updated_at
  BEFORE UPDATE ON public.experiences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

-- Everyone can see active experiences
CREATE POLICY "Anyone can view active experiences"
  ON public.experiences FOR SELECT
  USING (status = 'active');

-- Hosts can see all their own experiences
CREATE POLICY "Hosts can view own experiences"
  ON public.experiences FOR SELECT
  TO authenticated
  USING (auth.uid() = host_id);

-- Hosts can insert their own experiences
CREATE POLICY "Hosts can create experiences"
  ON public.experiences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = host_id AND public.has_role(auth.uid(), 'hospedeiro'));

-- Hosts can update their own experiences
CREATE POLICY "Hosts can update own experiences"
  ON public.experiences FOR UPDATE
  TO authenticated
  USING (auth.uid() = host_id)
  WITH CHECK (auth.uid() = host_id);

-- Hosts can delete their own experiences
CREATE POLICY "Hosts can delete own experiences"
  ON public.experiences FOR DELETE
  TO authenticated
  USING (auth.uid() = host_id);

-- Experience photos table
CREATE TABLE public.experience_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id uuid NOT NULL REFERENCES public.experiences(id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.experience_photos ENABLE ROW LEVEL SECURITY;

-- Anyone can view photos of active experiences
CREATE POLICY "Anyone can view photos of active experiences"
  ON public.experience_photos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.experiences e
      WHERE e.id = experience_id AND (e.status = 'active' OR e.host_id = auth.uid())
    )
  );

-- Hosts can manage photos of their experiences
CREATE POLICY "Hosts can insert photos"
  ON public.experience_photos FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.experiences e
      WHERE e.id = experience_id AND e.host_id = auth.uid()
    )
  );

CREATE POLICY "Hosts can delete photos"
  ON public.experience_photos FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.experiences e
      WHERE e.id = experience_id AND e.host_id = auth.uid()
    )
  );

-- Storage bucket for experience photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'experience-photos',
  'experience-photos',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- Storage policies
CREATE POLICY "Anyone can view experience photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'experience-photos');

CREATE POLICY "Authenticated users can upload experience photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'experience-photos');

CREATE POLICY "Users can delete own experience photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'experience-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
