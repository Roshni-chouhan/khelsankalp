import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

import type { Database } from "@/integrations/supabase/types";

export const REGISTRABLE_ROLES = ["athlete", "core_team", "sports_head", "superadmin"] as const;
export type RegistrableRole = (typeof REGISTRABLE_ROLES)[number];

export const ROLE_LABELS: Record<string, string> = {
  athlete: "Athlete",
  core_team: "Sports Core Team",
  sports_head: "Institute Sports Head",
  superadmin: "Super Admin",
};

const rollSchema = z
  .string()
  .trim()
  .min(3, "Roll number is too short")
  .max(30, "Roll number is too long")
  .regex(/^[A-Za-z0-9/-]+$/, "Roll number can use letters, numbers, - and / only");

const registerSchema = z.object({
  fullName: z.string().trim().min(2).max(80),
  rollNumber: rollSchema,
  email: z.string().trim().email().max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
  branch: z.string().trim().max(80).optional(),
  year: z.string().trim().max(20).optional(),
  phone: z.string().trim().max(20).optional(),
  role: z.enum(REGISTRABLE_ROLES),
});

const signInSchema = z.object({
  identifier: z.string().trim().min(3).max(255),
  password: z.string().min(1).max(72),
});

const resetSchema = z.object({
  identifier: z.string().trim().min(3).max(255),
  origin: z.string().trim().url().max(300),
});

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`)
          h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const registerMember = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => registerSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const roll = data.rollNumber.toUpperCase();

    const { data: existing } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("roll_number", roll)
      .maybeSingle();
    if (existing) return { ok: false as const, error: "That roll number is already registered." };

    const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { full_name: data.fullName, roll_number: roll },
    });
    if (createError || !created.user) {
      return {
        ok: false as const,
        error: createError?.message.includes("already")
          ? "An account with this email already exists."
          : "Could not create the account. Please try again.",
      };
    }

    const userId = created.user.id;
    const { error: profileError } = await supabaseAdmin.from("profiles").insert({
      id: userId,
      full_name: data.fullName,
      roll_number: roll,
      email: data.email,
      branch: data.branch ?? null,
      year: data.year ?? null,
      phone: data.phone ?? null,
    });
    if (profileError) {
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return { ok: false as const, error: "Could not save the profile. Please try again." };
    }

    let status: "approved" | "pending" = data.role === "athlete" ? "approved" : "pending";
    if (data.role === "superadmin") {
      const { count } = await supabaseAdmin
        .from("user_roles")
        .select("id", { count: "exact", head: true })
        .eq("role", "superadmin")
        .eq("status", "approved");
      status = (count ?? 0) === 0 ? "approved" : "pending";
    }

    await supabaseAdmin.from("user_roles").insert({ user_id: userId, role: data.role, status });

    return { ok: true as const, status, role: data.role };
  });

export const signInWithIdentifier = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => signInSchema.parse(data))
  .handler(async ({ data }) => {
    let email = data.identifier;
    if (!email.includes("@")) {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("email")
        .eq("roll_number", data.identifier.toUpperCase())
        .maybeSingle();
      if (!profile) return { ok: false as const, error: "Invalid roll number or password." };
      email = profile.email;
    }

    const { data: session, error } = await publicClient().auth.signInWithPassword({
      email,
      password: data.password,
    });
    if (error || !session.session) {
      return { ok: false as const, error: "Invalid credentials. Please check and try again." };
    }
    return {
      ok: true as const,
      accessToken: session.session.access_token,
      refreshToken: session.session.refresh_token,
    };
  });

export const requestPasswordReset = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => resetSchema.parse(data))
  .handler(async ({ data }) => {
    let email = data.identifier;
    if (!email.includes("@")) {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("email")
        .eq("roll_number", data.identifier.toUpperCase())
        .maybeSingle();
      if (!profile) return { ok: true as const };
      email = profile.email;
    }
    await publicClient().auth.resetPasswordForEmail(email, {
      redirectTo: `${data.origin}/reset-password`,
    });
    return { ok: true as const };
  });
