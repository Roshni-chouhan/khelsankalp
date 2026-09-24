import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { ROLE_LABELS } from "@/lib/auth.functions";
import type { RoleRow } from "@/hooks/useSession";

type Row = RoleRow & {
  name?: string | undefined;
  email?: string | undefined;
  roll?: string | undefined;
};

export function ApprovalsPanel({
  allowedRoles,
  approverId,
}: {
  allowedRoles: RoleRow["role"][];
  approverId: string | undefined;
}) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("user_roles")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: true });
    const pending = ((data as RoleRow[]) ?? []).filter((r) => allowedRoles.includes(r.role));
    if (pending.length === 0) {
      setRows([]);
      setLoading(false);
      return;
    }
    const { data: people } = await supabase
      .from("profiles")
      .select("id, full_name, email, roll_number")
      .in(
        "id",
        pending.map((r) => r.user_id),
      );
    const map = new Map((people ?? []).map((p) => [p.id, p]));
    setRows(
      pending.map((r) => ({
        ...r,
        name: map.get(r.user_id)?.full_name,
        email: map.get(r.user_id)?.email,
        roll: map.get(r.user_id)?.roll_number,
      })),
    );
    setLoading(false);
  }, [allowedRoles]);

  useEffect(() => {
    void load();
  }, [load]);

  async function decide(row: Row, status: "approved" | "rejected") {
    const { error } = await supabase
      .from("user_roles")
      .update({ status, approved_by: approverId ?? null })
      .eq("id", row.id);
    if (error) {
      toast.error("You do not have permission to change this request.");
      return;
    }
    toast.success(status === "approved" ? "Access approved." : "Request rejected.");
    void load();
  }

  return (
    <Card className="glass-card overflow-hidden p-0">
      <div className="flex items-center justify-between bg-gold/20 px-6 py-4">
        <div>
          <h2 className="text-base font-semibold">Pending access requests</h2>
          <p className="text-xs text-muted-foreground">
            Approve members so they can use their KhelSankalp desk.
          </p>
        </div>
        <Badge variant="outline">{rows.length}</Badge>
      </div>
      <div className="divide-y">
        {loading ? (
          <p className="p-6 text-sm text-muted-foreground">Loading requests…</p>
        ) : rows.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">No requests waiting right now.</p>
        ) : (
          rows.map((r) => (
            <div key={r.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="font-medium">{r.name ?? "Unnamed member"}</p>
                <p className="text-xs text-muted-foreground">
                  {r.roll} · {r.email}
                </p>
                <Badge className="mt-2" variant="secondary">
                  {ROLE_LABELS[r.role] ?? r.role}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => decide(r, "approved")}>
                  Approve
                </Button>
                <Button size="sm" variant="outline" onClick={() => decide(r, "rejected")}>
                  Reject
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
