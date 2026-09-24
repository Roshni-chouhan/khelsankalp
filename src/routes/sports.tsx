import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { SportCard } from "@/components/cards/EntityCards";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sports } from "@/data/mock";

export const Route = createFileRoute("/sports")({
  head: () => ({
    meta: [
      { title: "Sports at SGSITS — KhelSankalp" },
      {
        name: "description",
        content:
          "Cricket, football, basketball, volleyball, badminton, table tennis, athletics, tennis and chess at SGSITS Indore.",
      },
      { property: "og:title", content: "Sports at SGSITS — KhelSankalp" },
      { property: "og:description", content: "competitive sports across the SGSITS Indore campus." },
    ],
  }),
  component: SportsPage,
});

function SportsPage() {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("athletes");

  const list = useMemo(() => {
    const filtered = sports.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()));
    return [...filtered].sort((a, b) =>
      sort === "name" ? a.name.localeCompare(b.name) : b[sort as "athletes" | "teams" | "tournaments"] - a[sort as "athletes" | "teams" | "tournaments"],
    );
  }, [q, sort]);

  return (
    <div>
      <PageHeader
        eyebrow="Discipline"
        title="Sports at SGSITS"
        description=" competitive sports run by the Board of Physical Education, each with its own leagues, squads and season calendar."
      />
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_200px]">
          <Input placeholder="Search sports…" value={q} onChange={(e) => setQ(e.target.value)} />
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="athletes">Most athletes</SelectItem>
              <SelectItem value="teams">Most teams</SelectItem>
              <SelectItem value="tournaments">Most tournaments</SelectItem>
              <SelectItem value="name">Name (A–Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((s) => (
            <SportCard key={s.id} sport={s} />
          ))}
        </div>
      </div>
    </div>
  );
}
