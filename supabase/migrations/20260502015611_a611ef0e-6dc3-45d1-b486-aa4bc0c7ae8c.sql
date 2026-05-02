CREATE POLICY "Admins can upload experience photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'experience-photos'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Admins can delete experience photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'experience-photos'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);