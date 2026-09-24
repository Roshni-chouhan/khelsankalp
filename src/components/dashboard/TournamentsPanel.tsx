import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

type TournamentRow = {
  id: string;
  name: string;
  sport: string;
  format: string;
  start_date: string | null;
  end_date: string | null;
  venue: string | null;
};

const SPORTS = [
  "Cricket",
  "Football",
  "Basketball",
  "Volleyball",
  "Badminton",
  "Table Tennis",
  "Athletics",
  "Tennis",
  "Chess",
];

export function TournamentsPanel({ userId }: { userId: string | undefined }) {
  const [rows, setRows] = useState<TournamentRow[]>([]);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("tournaments")
      .select("id, name, sport, format, start_date, end_date, venue")
      .order("created_at", { ascending: false });
    setRows((data as TournamentRow[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    const form = new FormData(e.target as HTMLFormElement);
    const name = String(form.get("name") ?? "").trim();
    if (name.length < 3) {
      toast.error("Enter a tournament name.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("tournaments").insert({
      name: name.slice(0, 120),
      sport: String(form.get("sport") ?? "Cricket"),
      format: String(form.get("format") ?? "league"),
      start_date: String(form.get("start") ?? "") || null,
      end_date: String(form.get("end") ?? "") || null,
      venue: String(form.get("venue") ?? "").slice(0, 120) || null,
      created_by: userId,
    });
    setBusy(false);
    if (error) {
      toast.error("Only approved staff can create tournaments.");
      return;
    }
    toast.success("Tournament created.");
    (e.target as HTMLFormElement).reset();
    void load();
  }

  async function remove(id: string) {
    const { error } = await supabase.from("tournaments").delete().eq("id", id);
    if (error) {
      toast.error("Could not remove that tournament.");
      return;
    }
    toast.success("Tournament removed.");
    void load();
  }

  return (
    <Card className="glass-card overflow-hidden p-0">
      <div className="bg-success/15 px-6 py-4">
        <h2 className="text-base font-semibold">Tournament management</h2>
        <p className="text-xs text-muted-foreground">
          Create and manage SGSITS tournaments for the sports calendar.
        </p>
      </div>

      <form className="grid gap-4 border-b p-6 sm:grid-cols-2" onSubmit={create}>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="t-name">Tournament name</Label>
          <Input id="t-name" name="name" required maxLength={120} placeholder="Eklavya Inter-Branch Cricket Cup" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="t-sport">Sport</Label>
          <select
            id="t-sport"
            name="sport"
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          >
            {SPORTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="t-format">Format</Label>
          <select
            id="t-format"
            name="format"
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          >
            <option value="league">League</option>
            <option value="knockout">Knockout</option>
            <option value="round_robin">Round robin</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="t-start">Start date</Label>
          <Input id="t-start" name="start" type="date" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="t-end">End date</Label>
          <Input id="t-end" name="end" type="date" />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="t-venue">Venue</Label>
          <Input id="t-venue" name="venue" maxLength={120} placeholder="SGSITS Main Ground" />
        </div>
        <div className="sm:col-span-2">
          <Button type="submit" disabled={busy}>
            {busy ? "Creating…" : "Create tournament"}
          </Button>
        </div>
      </form>

      <div className="divide-y">
        {loading ? (
          <p className="p-6 text-sm text-muted-foreground">Loading tournaments…</p>
        ) : rows.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">No tournaments created yet.</p>
        ) : (
          rows.map((t) => (
            <div key={t.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="font-medium">{t.name}</p>
                <p className="text-xs text-muted-foreground">
                  {t.venue ?? "Venue TBA"}
                  {t.start_date ? ` · from ${t.start_date}` : ""}
                  {t.end_date ? ` to ${t.end_date}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{t.sport}</Badge>
                <Badge variant="outline">{t.format}</Badge>
                <Button size="sm" variant="outline" onClick={() => remove(t.id)}>
                  Remove
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
