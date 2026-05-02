-- Allow admins to delete any experience
CREATE POLICY "Admins can delete all experiences"
ON public.experiences
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Allow admins to delete storage objects (for cleanup)
CREATE POLICY "Admins can delete experience photos storage"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'experience-photos'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);