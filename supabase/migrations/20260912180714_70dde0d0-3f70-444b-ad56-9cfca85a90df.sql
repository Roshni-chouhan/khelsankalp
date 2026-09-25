REVOKE ALL ON FUNCTION public.enforce_role_status() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS designation TEXT;