import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { AthleteCard } from "@/components/cards/EntityCards";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { athletes, departments, sports } from "@/data/mock";

export const Route = createFileRoute("/athletes")({
  head: () => ({
    meta: [
      { title: "Athletes — KhelSankalp SGSITS" },
      {
        name: "description",
        content: "Search SGSITS Indore student athletes by sport, department and performance rating.",
      },
      { property: "og:title", content: "Athletes — KhelSankalp SGSITS" },
      { property: "og:description", content: "Profiles, stats, medals and achievements of SGSITS athletes." },
    ],
  }),
  component: AthletesPage,
});

function AthletesPage() {
  const [q, setQ] = useState("");
  const [sport, setSport] = useState("all");
  const [dept, setDept] = useState("all");
  const [sort, setSort] = useState("rating");

  const list = useMemo(() => {
    const filtered = athletes.filter(
      (a) =>
        (a.name.toLowerCase().includes(q.toLowerCase()) || a.enrollment.includes(q)) &&
        (sport === "all" || a.sport === sport || a.secondarySport === sport) &&
        (dept === "all" || a.department === dept),
    );
    return [...filtered].sort((a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name)
        : sort === "medals"
          ? b.medals.gold - a.medals.gold
          : b.rating - a.rating,
    );
  }, [q, sport, dept, sort]);

  return (
    <div>
      <PageHeader
        eyebrow="Roster"
        title="Athletes"
        description="Every registered SGSITS athlete with their teams, statistics, medals and digital certificates."
      />
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-3 md:grid-cols-4">
          <Input placeholder="Name or enrollment no…" value={q} onChange={(e) => setQ(e.target.value)} />
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
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Top rated</SelectItem>
              <SelectItem value="medals">Most gold medals</SelectItem>
              <SelectItem value="name">Name (A–Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">{list.length} athlete(s)</p>
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((a) => (
            <AthleteCard key={a.id} athlete={a} />
          ))}
        </div>
      </div>
    </div>
  );
}
