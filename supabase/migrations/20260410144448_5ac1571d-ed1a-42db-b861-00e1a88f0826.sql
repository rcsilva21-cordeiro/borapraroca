-- Add INSERT policy restricted to service_role only
CREATE POLICY "Service role can insert transactions"
ON public.transactions
FOR INSERT
TO service_role
WITH CHECK (true);

-- Also split the admin ALL policy into specific commands (SELECT, UPDATE, DELETE) to remove admin INSERT from client
DROP POLICY IF EXISTS "Admins can view all transactions" ON public.transactions;

CREATE POLICY "Admins can view all transactions"
ON public.transactions
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update all transactions"
ON public.transactions
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete all transactions"
ON public.transactions
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));