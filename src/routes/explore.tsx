import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Radio } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { AthleteCard, MatchCard, SportCard, TeamCard, TournamentCard } from "@/components/cards/EntityCards";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { athletes, facilities, matches, sports, teams, tournaments } from "@/data/mock";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore & Live Scores — KhelSankalp SGSITS" },
      {
        name: "description",
        content:
          "Search every tournament, athlete, team, sport and facility at SGSITS Indore, and follow live scores in real time.",
      },
      { property: "og:title", content: "Explore & Live Scores — KhelSankalp SGSITS" },
      { property: "og:description", content: "One search across the whole SGSITS sports ecosystem." },
    ],
  }),
  component: ExplorePage,
});

function ExplorePage() {
  const [q, setQ] = useState("");
  const k = q.toLowerCase();

  const results = useMemo(
    () => ({
      tournaments: tournaments.filter((t) => t.name.toLowerCase().includes(k)),
      athletes: athletes.filter((a) => a.name.toLowerCase().includes(k) || a.department.toLowerCase().includes(k)),
      teams: teams.filter((t) => t.name.toLowerCase().includes(k)),
      sports: sports.filter((s) => s.name.toLowerCase().includes(k)),
      facilities: facilities.filter((f) => f.name.toLowerCase().includes(k)),
    }),
    [k],
  );

  const live = matches.filter((m) => m.status === "live");
  const upcoming = matches.filter((m) => m.status === "scheduled");
  const results_ = matches.filter((m) => m.status === "completed");

  return (
    <div>
      <PageHeader
        eyebrow="Search everything"
        title="Explore KhelSankalp"
        description="Live scores, fixtures, results and one search bar across athletes, teams, tournaments, sports and facilities."
      />
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Try 'Ekalavya', 'CSE', 'badminton', 'Ananya'…"
            className="h-14 rounded-2xl pl-11 text-base"
          />
        </div>

        {q ? (
          <div className="mt-8 space-y-10">
            <ResultGroup title="Tournaments" count={results.tournaments.length}>
              {results.tournaments.map((t) => <TournamentCard key={t.id} tournament={t} />)}
            </ResultGroup>
            <ResultGroup title="Athletes" count={results.athletes.length}>
              {results.athletes.map((a) => <AthleteCard key={a.id} athlete={a} />)}
            </ResultGroup>
            <ResultGroup title="Teams" count={results.teams.length}>
              {results.teams.map((t) => <TeamCard key={t.id} team={t} />)}
            </ResultGroup>
            <ResultGroup title="Sports" count={results.sports.length}>
              {results.sports.map((s) => <SportCard key={s.id} sport={s} />)}
            </ResultGroup>
            <ResultGroup title="Facilities" count={results.facilities.length}>
              {results.facilities.map((f) => (
                <Link key={f.id} to="/facilities">
                  <Card className="glass-card card-hover gap-1 p-5">
                    <p className="font-semibold text-primary">{f.name}</p>
                    <p className="text-sm text-muted-foreground">{f.type} · {f.location}</p>
                  </Card>
                </Link>
              ))}
            </ResultGroup>
          </div>
        ) : (
          <Tabs defaultValue="live" className="mt-8">
            <TabsList>
              <TabsTrigger value="live">
                <Radio className="mr-1.5 h-4 w-4" /> Live ({live.length})
              </TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>
            <TabsContent value="live" className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {live.map((m) => <MatchCard key={m.id} match={m} />)}
            </TabsContent>
            <TabsContent value="upcoming" className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((m) => <MatchCard key={m.id} match={m} />)}
            </TabsContent>
            <TabsContent value="results" className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {results_.map((m) => <MatchCard key={m.id} match={m} />)}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}

function ResultGroup({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  if (!count) return null;
  return (
    <section>
      <h2 className="flex items-center gap-2 text-xl font-bold text-primary">
        {title} <Badge variant="secondary">{count}</Badge>
      </h2>
      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </section>
  );
}
