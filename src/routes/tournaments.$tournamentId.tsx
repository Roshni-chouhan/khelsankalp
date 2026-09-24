import { createFileRoute, notFound } from "@tanstack/react-router";
import { CalendarDays, MapPin, Trophy, Users, Radio, ClipboardList } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { PointsTable } from "@/components/common/LeaderboardTable";
import { MatchCard, StatusBadge } from "@/components/cards/EntityCards";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { athletes, getTournament, matchesByTournament } from "@/data/mock";

export const Route = createFileRoute("/tournaments/$tournamentId")({
  loader: ({ params }) => {
    const tournament = getTournament(params.tournamentId);
    if (!tournament) throw notFound();
    return { tournament };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Tournament not found — KhelSankalp" }, { name: "robots", content: "noindex" }] };
    }
    const t = loaderData.tournament;
    return {
      meta: [
        { title: `${t.name} — KhelSankalp SGSITS` },
        { name: "description", content: t.description },
        { property: "og:title", content: `${t.name} — KhelSankalp SGSITS` },
        { property: "og:description", content: t.description },
      ],
    };
  },
  component: TournamentDetail,
});

function TournamentDetail() {
  const { tournament } = Route.useLoaderData();
  const fixtures = matchesByTournament(tournament.id);
  const live = fixtures.filter((m) => m.status === "live");
  const topScorers = [...athletes]
    .filter((a) => a.sport === tournament.sport)
    .sort((a, b) => b.points - a.points);

  return (
    <div>
      <PageHeader
        eyebrow={`${tournament.format} · ${tournament.organizer}`}
        title={tournament.name}
        description={tournament.description}
        actions={<StatusBadge status={tournament.status} />}
      />

      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Users} label="Teams" value={tournament.teamsCount} />
          <StatCard icon={Trophy} label="Matches" value={tournament.matchesCount} accent="gold" />
          <StatCard icon={CalendarDays} label="Dates" value={`${tournament.startDate.slice(5)} → ${tournament.endDate.slice(5)}`} accent="primary" />
          <StatCard icon={Radio} label="Live now" value={live.length} accent="live" />
        </div>

        <Card className="glass-card mt-6 grid gap-3 p-6 sm:grid-cols-3">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-royal" /> {tournament.venue}
          </p>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <ClipboardList className="h-4 w-4 text-royal" /> Registration closes {tournament.registrationDeadline}
          </p>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Trophy className="h-4 w-4 text-gold" /> {tournament.prize}
          </p>
        </Card>

        <Tabs defaultValue="live" className="mt-10">
          <TabsList className="flex-wrap">
            <TabsTrigger value="live">Live & fixtures</TabsTrigger>
            <TabsTrigger value="points">Points table</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="stats">Player stats</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="live" className="mt-6 space-y-8">
            {live.map((m) => (
              <Card key={m.id} className="glass-card gap-4 p-6">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between">
                  <h3 className="min-w-0 truncate text-lg font-bold text-primary">{m.round}</h3>
                  <StatusBadge status={m.status} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-surface p-4">
                    <p className="text-sm text-muted-foreground">{m.teamA}</p>
                    <p className="font-display text-3xl font-bold text-primary">{m.scoreA}</p>
                  </div>
                  <div className="rounded-xl bg-surface p-4">
                    <p className="text-sm text-muted-foreground">{m.teamB}</p>
                    <p className="font-display text-3xl font-bold text-primary">{m.scoreB}</p>
                  </div>
                </div>
                {m.detail ? <p className="text-sm font-semibold text-live">{m.detail}</p> : null}
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Match events
                    </h4>
                    <ul className="mt-3 space-y-2">
                      {m.events.map((e, i) => (
                        <li key={i} className="flex gap-3 text-sm">
                          <Badge variant="secondary" className="shrink-0">{e.minute}</Badge>
                          <span className="text-muted-foreground">{e.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      Live commentary
                    </h4>
                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                      {m.commentary.map((c, i) => (
                        <li key={i} className="rounded-lg bg-surface px-3 py-2">{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {fixtures
                .filter((m) => m.status !== "live")
                .map((m) => (
                  <MatchCard key={m.id} match={m} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="points" className="mt-6">
            <PointsTable rows={tournament.pointsTable} />
          </TabsContent>

          <TabsContent value="teams" className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tournament.teams.map((t) => (
              <Card key={t} className="glass-card card-hover items-center gap-2 p-6 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-2xl gradient-royal font-display text-lg font-bold text-primary-foreground">
                  {t.slice(0, 2).toUpperCase()}
                </span>
                <p className="font-semibold text-primary">{t}</p>
                <p className="text-xs text-muted-foreground">Registered & verified</p>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="stats" className="mt-6">
            <div className="overflow-x-auto rounded-2xl border border-border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Athlete</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead className="text-center">Matches</TableHead>
                    <TableHead className="text-center">Wins</TableHead>
                    <TableHead className="text-right">Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topScorers.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium">{a.name}</TableCell>
                      <TableCell><Badge variant="secondary">{a.department}</Badge></TableCell>
                      <TableCell className="text-center">{a.matches}</TableCell>
                      <TableCell className="text-center">{a.wins}</TableCell>
                      <TableCell className="text-right font-display font-bold text-primary">{a.points}</TableCell>
                    </TableRow>
                  ))}
                  {topScorers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        Player statistics publish after the first round.
                      </TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="results" className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {fixtures.filter((m) => m.status === "completed").length ? (
              fixtures
                .filter((m) => m.status === "completed")
                .map((m) => <MatchCard key={m.id} match={m} />)
            ) : (
              <p className="text-sm text-muted-foreground">No results declared yet.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
