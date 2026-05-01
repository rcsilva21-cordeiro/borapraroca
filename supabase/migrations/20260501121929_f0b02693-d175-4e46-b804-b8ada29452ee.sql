
-- Admin can insert experiences on behalf of any host
CREATE POLICY "Admins can insert experiences"
ON public.experiences
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admin can insert experience photos
CREATE POLICY "Admins can insert photos"
ON public.experience_photos
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admin can insert age ranges
CREATE POLICY "Admins can insert age ranges"
ON public.experience_age_ranges
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admin can update age ranges
CREATE POLICY "Admins can update age ranges"
ON public.experience_age_ranges
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin can delete age ranges
CREATE POLICY "Admins can delete age ranges"
ON public.experience_age_ranges
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin can delete photos
CREATE POLICY "Admins can delete photos"
ON public.experience_photos
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin can view all photos
CREATE POLICY "Admins can view all photos"
ON public.experience_photos
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
