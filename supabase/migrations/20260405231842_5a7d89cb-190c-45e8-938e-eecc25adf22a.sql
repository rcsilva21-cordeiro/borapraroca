
-- Drop the overly permissive SELECT policy
DROP POLICY "Authenticated users can view profiles" ON profiles;

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Allow viewing host profiles for active experiences (needed to show host names)
CREATE POLICY "Anyone can view host profiles" ON profiles
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM experiences e
      WHERE e.host_id = profiles.user_id
        AND e.status = 'active'::experience_status
    )
  );

-- Allow viewing profiles involved in your bookings (tourist sees host, host sees tourist)
CREATE POLICY "Booking participants can view each other" ON profiles
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings b
      JOIN experiences e ON e.id = b.experience_id
      WHERE (b.tourist_id = auth.uid() AND e.host_id = profiles.user_id)
         OR (e.host_id = auth.uid() AND b.tourist_id = profiles.user_id)
    )
  );
