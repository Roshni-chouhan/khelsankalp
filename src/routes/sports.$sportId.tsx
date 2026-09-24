import { createFileRoute, notFound } from "@tanstack/react-router";
import { Users, Trophy, MapPin, CalendarDays } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { AthleteCard, MatchCard, TeamCard, TournamentCard } from "@/components/cards/EntityCards";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { athletes, getSport, matches, sports, teams, tournaments } from "@/data/mock";

export const Route = createFileRoute("/sports/$sportId")({
  loader: ({ params }) => {
    const sport = getSport(params.sportId);
    if (!sport) throw notFound();
    return { sport };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Sport not found — KhelSankalp" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.sport.name} at SGSITS — KhelSankalp`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.sport.description },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.sport.description },
      ],
    };
  },
  component: SportDetail,
});

function SportDetail() {
  const { sport } = Route.useLoaderData();
  const sportTeams = teams.filter((t) => t.sport === sport.id);
  const sportAthletes = athletes.filter((a) => a.sport === sport.id || a.secondarySport === sport.id);
  const sportTournaments = tournaments.filter((t) => t.sport === sport.id);
  const sportMatches = matches.filter((m) => m.sport === sport.id);

  return (
    <div>
      <PageHeader
        eyebrow={`${sport.icon} Sport`}
        title={sport.name}
        description={sport.description}
      />
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Users} label="Athletes" value={sport.athletes} />
          <StatCard icon={Trophy} label="Teams" value={sport.teams} accent="gold" />
          <StatCard icon={CalendarDays} label="Season" value={sport.season} accent="primary" />
          <StatCard icon={MapPin} label="Home venue" value={sport.venue.split(",")[0] ?? sport.venue} accent="royal" />
        </div>

        <Tabs defaultValue="tournaments" className="mt-10">
          <TabsList className="flex-wrap">
            <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="athletes">Athletes</TabsTrigger>
            <TabsTrigger value="matches">Matches</TabsTrigger>
          </TabsList>
          <TabsContent value="tournaments" className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {sportTournaments.length ? (
              sportTournaments.map((t) => <TournamentCard key={t.id} tournament={t} />)
            ) : (
              <p className="text-sm text-muted-foreground">No tournaments scheduled yet this session.</p>
            )}
          </TabsContent>
          <TabsContent value="teams" className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {sportTeams.length ? (
              sportTeams.map((t) => <TeamCard key={t.id} team={t} />)
            ) : (
              <p className="text-sm text-muted-foreground">Squad lists are being finalised.</p>
            )}
          </TabsContent>
          <TabsContent value="athletes" className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {sportAthletes.length ? (
              sportAthletes.map((a) => <AthleteCard key={a.id} athlete={a} />)
            ) : (
              <p className="text-sm text-muted-foreground">No athletes registered yet.</p>
            )}
          </TabsContent>
          <TabsContent value="matches" className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {sportMatches.length ? (
              sportMatches.map((m) => <MatchCard key={m.id} match={m} />)
            ) : (
              <p className="text-sm text-muted-foreground">Fixtures will be published shortly.</p>
            )}
          </TabsContent>
        </Tabs>

        <h2 className="mt-14 text-xl font-bold text-primary">Other sports</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {sports
            .filter((s) => s.id !== sport.id)
            .map((s) => (
              <a
                key={s.id}
                href={`/sports/${s.id}`}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm transition-colors hover:border-royal hover:text-royal"
              >
                {s.icon} {s.name}
              </a>
            ))}
        </div>
      </div>
    </div>
  );
}
