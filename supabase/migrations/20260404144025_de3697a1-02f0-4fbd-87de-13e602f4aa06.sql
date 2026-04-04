INSERT INTO public.user_roles (user_id, role) VALUES 
  ('68d91bde-6e11-4dd9-ad86-fc90957abe8b', 'hospedeiro'),
  ('75d1ad65-9db2-4820-896d-2b47fc9a40d3', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;