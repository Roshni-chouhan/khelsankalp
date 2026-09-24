CREATE TYPE public.app_role AS ENUM ('superadmin','sports_head','core_team','athlete');
CREATE TYPE public.role_status AS ENUM ('pending','approved','rejected');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  roll_number text NOT NULL UNIQUE,
  email text NOT NULL,
  branch text,
  year text,
  phone text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_read_all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  status public.role_status NOT NULL DEFAULT 'pending',
  approved_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT, INSERT, UPDATE ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role AND status = 'approved')
$$;

CREATE OR REPLACE FUNCTION public.enforce_role_status()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'superadmin') THEN
    NEW.status := CASE WHEN NEW.role = 'athlete' THEN 'approved'::public.role_status ELSE 'pending'::public.role_status END;
    NEW.approved_by := NULL;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER enforce_role_status_trg BEFORE INSERT ON public.user_roles
FOR EACH ROW EXECUTE FUNCTION public.enforce_role_status();

CREATE POLICY "roles_read_own_or_staff" ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(),'superadmin') OR public.has_role(auth.uid(),'sports_head'));
CREATE POLICY "roles_insert_own" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "roles_update_superadmin" ON public.user_roles FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(),'superadmin')) WITH CHECK (public.has_role(auth.uid(),'superadmin'));
CREATE POLICY "roles_update_sports_head_core" ON public.user_roles FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(),'sports_head') AND role = 'core_team')
WITH CHECK (public.has_role(auth.uid(),'sports_head') AND role = 'core_team');

CREATE TABLE public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  caption text NOT NULL DEFAULT '',
  media_path text,
  media_type text NOT NULL DEFAULT 'image',
  sport text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.posts TO authenticated;
GRANT SELECT ON public.posts TO anon;
GRANT ALL ON public.posts TO service_role;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "posts_read_all" ON public.posts FOR SELECT USING (true);
CREATE POLICY "posts_insert_own" ON public.posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "posts_update_own" ON public.posts FOR UPDATE TO authenticated USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);
CREATE POLICY "posts_delete_own_or_admin" ON public.posts FOR DELETE TO authenticated
USING (auth.uid() = author_id OR public.has_role(auth.uid(),'superadmin') OR public.has_role(auth.uid(),'sports_head'));

CREATE TABLE public.tournaments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sport text NOT NULL,
  format text NOT NULL DEFAULT 'league',
  start_date date,
  end_date date,
  venue text,
  description text,
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tournaments TO authenticated;
GRANT SELECT ON public.tournaments TO anon;
GRANT ALL ON public.tournaments TO service_role;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tournaments_read_all" ON public.tournaments FOR SELECT USING (true);
CREATE POLICY "tournaments_staff_write" ON public.tournaments FOR ALL TO authenticated
USING (public.has_role(auth.uid(),'core_team') OR public.has_role(auth.uid(),'sports_head') OR public.has_role(auth.uid(),'superadmin'))
WITH CHECK (public.has_role(auth.uid(),'core_team') OR public.has_role(auth.uid(),'sports_head') OR public.has_role(auth.uid(),'superadmin'));

CREATE TABLE public.tournament_teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  branch text NOT NULL,
  team_name text NOT NULL,
  captain text,
  players text[] NOT NULL DEFAULT '{}',
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tournament_teams TO authenticated;
GRANT SELECT ON public.tournament_teams TO anon;
GRANT ALL ON public.tournament_teams TO service_role;
ALTER TABLE public.tournament_teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tteams_read_all" ON public.tournament_teams FOR SELECT USING (true);
CREATE POLICY "tteams_staff_write" ON public.tournament_teams FOR ALL TO authenticated
USING (public.has_role(auth.uid(),'core_team') OR public.has_role(auth.uid(),'sports_head') OR public.has_role(auth.uid(),'superadmin'))
WITH CHECK (public.has_role(auth.uid(),'core_team') OR public.has_role(auth.uid(),'sports_head') OR public.has_role(auth.uid(),'superadmin'));

CREATE POLICY "shorts_read_authenticated" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'shorts');
CREATE POLICY "shorts_insert_own" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'shorts' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "shorts_delete_own" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'shorts' AND auth.uid()::text = (storage.foldername(name))[1]);