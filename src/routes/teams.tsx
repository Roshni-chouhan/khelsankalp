import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { TeamCard } from "@/components/cards/EntityCards";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { departments, sports, teams } from "@/data/mock";

export const Route = createFileRoute("/teams")({
  head: () => ({
    meta: [
      { title: "Teams — KhelSankalp SGSITS" },
      {
        name: "description",
        content: "Departmental and hostel squads competing across SGSITS Indore tournaments.",
      },
      { property: "og:title", content: "Teams — KhelSankalp SGSITS" },
      { property: "og:description", content: "Squads, captains, coaches and season records." },
    ],
  }),
  component: TeamsPage,
});

function TeamsPage() {
  const [q, setQ] = useState("");
  const [sport, setSport] = useState("all");
  const [dept, setDept] = useState("all");

  const list = useMemo(
    () =>
      teams
        .filter(
          (t) =>
            t.name.toLowerCase().includes(q.toLowerCase()) &&
            (sport === "all" || t.sport === sport) &&
            (dept === "all" || t.department === dept),
        )
        .sort((a, b) => b.points - a.points),
    [q, sport, dept],
  );

  return (
    <div>
      <PageHeader
        eyebrow="Squads"
        title="Teams"
        description="Departmental sides representing SGSITS across
         sports, with live season records."
      />
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-3 md:grid-cols-3">
          <Input placeholder="Search teams…" value={q} onChange={(e) => setQ(e.target.value)} />
          <Select value={sport} onValueChange={setSport}>
            <SelectTrigger><SelectValue placeholder="Sport" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sports</SelectItem>
              {sports.map((s) => (
                <SelectItem key={s.id} value={s.id}>{s.icon} {s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={dept} onValueChange={setDept}>
            <SelectTrigger><SelectValue placeholder="Department" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All departments</SelectItem>
              {departments.map((d) => (
                <SelectItem key={d.code} value={d.code}>{d.code}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">{list.length} team(s)</p>
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((t) => (
            <TeamCard key={t.id} team={t} />
          ))}
        </div>
      </div>
    </div>
  );
}
