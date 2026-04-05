-- Remove the permissive INSERT policy that lets any authenticated user create transaction records directly
DROP POLICY "System can insert transactions" ON transactions;