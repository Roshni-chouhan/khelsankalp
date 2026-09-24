import { useCallback, useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { ROLE_LABELS } from "@/lib/auth.functions";
import type { RoleRow } from "@/hooks/useSession";

type Member = {
  id: string;
  full_name: string;
  roll_number: string;
  email: string;
  branch: string | null;
  year: string | null;
  phone: string | null;
  roles: { role: RoleRow["role"]; status: RoleRow["status"] }[];
};

export function MembersPanel() {
  const [members, setMembers] = useState<Member[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [{ data: people }, { data: roles }] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, full_name, roll_number, email, branch, year, phone")
        .order("full_name"),
      supabase.from("user_roles").select("user_id, role, status"),
    ]);
    const byUser = new Map<string, { role: RoleRow["role"]; status: RoleRow["status"] }[]>();
    for (const r of roles ?? []) {
      const list = byUser.get(r.user_id) ?? [];
      list.push({ role: r.role, status: r.status });
      byUser.set(r.user_id, list);
    }
    setMembers(
      (people ?? []).map((p) => ({ ...p, roles: byUser.get(p.id) ?? [] })) as Member[],
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? members.filter((m) =>
        [m.full_name, m.roll_number, m.email, m.branch ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(q),
      )
    : members;

  return (
    <Card className="glass-card overflow-hidden p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-royal/15 px-6 py-4">
        <div>
          <h2 className="text-base font-semibold">Registered members</h2>
          <p className="text-xs text-muted-foreground">
            Everyone signed up on KhelSankalp with their role status.
          </p>
        </div>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, roll number, branch"
          className="max-w-xs"
          maxLength={60}
        />
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <p className="p-6 text-sm text-muted-foreground">Loading members…</p>
        ) : filtered.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">No members match that search.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Branch</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Roles</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((m) => (
                <tr key={m.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium">{m.full_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {m.roll_number} · {m.email}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {m.branch ?? "—"}
                    {m.year ? ` · ${m.year}` : ""}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{m.phone ?? "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {m.roles.length === 0 ? (
                        <Badge variant="outline">None</Badge>
                      ) : (
                        m.roles.map((r) => (
                          <Badge
                            key={r.role}
                            variant={r.status === "approved" ? "default" : "secondary"}
                          >
                            {ROLE_LABELS[r.role] ?? r.role}
                            {r.status !== "approved" ? ` · ${r.status}` : ""}
                          </Badge>
                        ))
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Card>
  );
}
