
-- Fix 1: Restrict profiles to authenticated users only
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
CREATE POLICY "Authenticated users can view profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

-- Fix 2: Add path ownership check to storage INSERT policy
DROP POLICY IF EXISTS "Authenticated users can upload experience photos" ON storage.objects;
CREATE POLICY "Hosts can upload to own folder"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'experience-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
