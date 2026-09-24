import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Trophy, Users, TrendingUp, CalendarDays } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { MatchCard } from "@/components/cards/EntityCards";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  athletes,
  getTeam,
  matches,
  sportIcon,
  sportName,
  trainingSessions,
} from "@/data/mock";

export const Route = createFileRoute("/teams/$teamId")({
  loader: ({ params }) => {
    const team = getTeam(params.teamId);
    if (!team) throw notFound();
    return { team };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Team not found — KhelSankalp" }, { name: "robots", content: "noindex" }] };
    }
    const t = loaderData.team;
    const desc = `${t.name} (${t.department}) — captained by ${t.captain}, coached by ${t.coach}. ${t.won} wins from ${t.played} matches.`;
    return {
      meta: [
        { title: `${t.name} — Team Profile | KhelSankalp SGSITS` },
        { name: "description", content: desc },
        { property: "og:title", content: `${t.name} — KhelSankalp SGSITS` },
        { property: "og:description", content: desc },
      ],
    };
  },
  component: TeamProfile,
});

function TeamProfile() {
  const { team } = Route.useLoaderData();
  const squad = athletes.filter((a) => a.teamId === team.id);
  const teamMatches = matches.filter((m) => m.teamA === team.name || m.teamB === team.name);
  const sessions = trainingSessions.filter((s) => s.team === team.name);

  return (
    <div>
      <PageHeader
        eyebrow={`${sportIcon(team.sport)} ${sportName(team.sport)} · ${team.department}`}
        title={team.name}
        description={`Captain ${team.captain} · ${team.coach} · Established ${team.founded}`}
        actions={<Badge className="border-0 gradient-royal text-primary-foreground">{team.points} points</Badge>}
      />
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={CalendarDays} label="Played" value={team.played} />
          <StatCard icon={Trophy} label="Won" value={team.won} accent="gold" />
          <StatCard icon={TrendingUp} label="Win rate" value={`${Math.round((team.won / team.played) * 100)}%`} accent="primary" />
          <StatCard icon={Users} label="Squad size" value={team.roster.length} accent="royal" />
        </div>

        <Tabs defaultValue="squad" className="mt-10">
          <TabsList className="flex-wrap">
            <TabsTrigger value="squad">Squad</TabsTrigger>
            <TabsTrigger value="matches">Matches</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
          </TabsList>

          <TabsContent value="squad" className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {team.roster.map((player) => {
              const profile = squad.find((a) => a.name === player);
              const inner = (
                <Card className="glass-card card-hover flex-row items-center gap-3 p-5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent font-semibold text-primary">
                    {player.split(" ").map((n) => n[0]).join("")}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-primary">{player}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {profile ? profile.position : "Squad member"}
                    </span>
                  </span>
                </Card>
              );
              return profile ? (
                <Link key={player} to="/athletes/$athleteId" params={{ athleteId: profile.id }}>
                  {inner}
                </Link>
              ) : (
                <div key={player}>{inner}</div>
              );
            })}
          </TabsContent>

          <TabsContent value="matches" className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {teamMatches.length ? (
              teamMatches.map((m) => <MatchCard key={m.id} match={m} />)
            ) : (
              <p className="text-sm text-muted-foreground">No fixtures published for this team yet.</p>
            )}
          </TabsContent>

          <TabsContent value="training" className="mt-6 space-y-3">
            {sessions.length ? (
              sessions.map((s) => (
                <Card key={s.id} className="glass-card flex-row flex-wrap items-center justify-between gap-3 p-5">
                  <span className="min-w-0">
                    <span className="block font-semibold text-primary">{s.focus}</span>
                    <span className="block text-xs text-muted-foreground">
                      {s.date} · {s.time} · {s.venue}
                    </span>
                  </span>
                  <Badge variant="secondary">{s.attendance}% attendance</Badge>
                </Card>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No training sessions scheduled this week.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
