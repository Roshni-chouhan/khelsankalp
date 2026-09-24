import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";

export type Profile = {
  id: string;
  full_name: string;
  roll_number: string;
  email: string;
  branch: string | null;
  year: string | null;
  phone: string | null;
};

export type RoleRow = {
  id: string;
  user_id: string;
  role: "superadmin" | "sports_head" | "core_team" | "athlete";
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return { session, loading };
}

export function useMember() {
  const { session, loading } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [ready, setReady] = useState(false);

  const userId = session?.user.id;

  useEffect(() => {
    let cancelled = false;
    if (!userId) {
      setProfile(null);
      setRoles([]);
      setReady(!loading);
      return;
    }
    void (async () => {
      const [{ data: p }, { data: r }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
        supabase.from("user_roles").select("*").eq("user_id", userId),
      ]);
      if (cancelled) return;
      setProfile((p as Profile) ?? null);
      setRoles((r as RoleRow[]) ?? []);
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId, loading]);

  const approved = roles.filter((r) => r.status === "approved").map((r) => r.role);
  return {
    session,
    profile,
    roles,
    approved,
    ready: ready && !loading,
    isSuperAdmin: approved.includes("superadmin"),
    isSportsHead: approved.includes("sports_head"),
    isCoreTeam: approved.includes("core_team"),
    isStaff:
      approved.includes("superadmin") ||
      approved.includes("sports_head") ||
      approved.includes("core_team"),
  };
}
