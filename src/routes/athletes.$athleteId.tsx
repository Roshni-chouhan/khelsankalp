import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Award, Medal, Target, TrendingUp, QrCode } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { FormLineChart } from "@/components/charts/AnalyticsCharts";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  certificates,
  getAthlete,
  getTeam,
  matches,
  sportIcon,
  sportName,
  tournaments,
} from "@/data/mock";

export const Route = createFileRoute("/athletes/$athleteId")({
  loader: ({ params }) => {
    const athlete = getAthlete(params.athleteId);
    if (!athlete) throw notFound();
    return { athlete };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Athlete not found — KhelSankalp" }, { name: "robots", content: "noindex" }] };
    }
    const a = loaderData.athlete;
    const desc = `${a.name}, ${a.department} — ${a.position}. ${a.matches} matches, ${a.medals.gold} gold medals at SGSITS Indore.`;
    return {
      meta: [
        { title: `${a.name} — Athlete Profile | KhelSankalp SGSITS` },
        { name: "description", content: desc },
        { property: "og:title", content: `${a.name} — KhelSankalp SGSITS` },
        { property: "og:description", content: desc },
      ],
    };
  },
  component: AthleteProfile,
});

function AthleteProfile() {
  const { athlete } = Route.useLoaderData();
  const team = getTeam(athlete.teamId);
  const athleteCerts = certificates.filter((c) => c.athlete === athlete.name);
  const relatedTournaments = tournaments.filter((t) => t.sport === athlete.sport);
  const relatedMatches = matches.filter((m) => m.sport === athlete.sport);

  return (
    <div>
      <PageHeader
        eyebrow={`${sportIcon(athlete.sport)} ${sportName(athlete.sport)} · ${athlete.year}`}
        title={athlete.name}
        description={`${athlete.position} · ${athlete.department} · Enrollment ${athlete.enrollment}`}
        actions={<Badge className="border-0 gradient-gold text-gold-foreground">Rating {athlete.rating}</Badge>}
      />
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Target} label="Matches played" value={athlete.matches} />
          <StatCard icon={TrendingUp} label="Wins" value={athlete.wins} accent="primary" />
          <StatCard icon={Award} label="Career points" value={athlete.points} accent="royal" />
          <StatCard
            icon={Medal}
            label="Medals"
            value={`${athlete.medals.gold}G ${athlete.medals.silver}S ${athlete.medals.bronze}B`}
            accent="gold"
          />
        </div>

        <Tabs defaultValue="overview" className="mt-10">
          <TabsList className="flex-wrap">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <Card className="glass-card p-6">
              <h3 className="text-lg font-bold text-primary">Recent form</h3>
              <p className="text-sm text-muted-foreground">Last six competitive outings</p>
              <div className="mt-4">
                <FormLineChart data={athlete.form} />
              </div>
            </Card>
            <Card className="glass-card gap-4 p-6">
              <h3 className="text-lg font-bold text-primary">Training & discipline</h3>
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Training attendance</span>
                  <span className="font-semibold text-primary">{athlete.attendance}%</span>
                </div>
                <Progress value={athlete.attendance} className="mt-2 h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Win rate</span>
                  <span className="font-semibold text-primary">
                    {Math.round((athlete.wins / athlete.matches) * 100)}%
                  </span>
                </div>
                <Progress value={(athlete.wins / athlete.matches) * 100} className="mt-2 h-2" />
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="secondary">{sportName(athlete.sport)}</Badge>
                {athlete.secondarySport ? (
                  <Badge variant="secondary">{sportName(athlete.secondarySport)}</Badge>
                ) : null}
                <Badge variant="secondary">{athlete.department}</Badge>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="mt-6">
            {team ? (
              <Card className="glass-card gap-3 p-6">
                <h3 className="text-lg font-bold text-primary">{team.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Captain {team.captain} · {team.coach} · Founded {team.founded}
                </p>
                <div className="grid grid-cols-4 gap-3 text-center">
                  {[
                    { k: "Played", v: team.played },
                    { k: "Won", v: team.won },
                    { k: "Lost", v: team.lost },
                    { k: "Points", v: team.points },
                  ].map((s) => (
                    <div key={s.k} className="rounded-xl bg-surface py-3">
                      <p className="font-display text-xl font-bold text-primary">{s.v}</p>
                      <p className="text-xs text-muted-foreground">{s.k}</p>
                    </div>
                  ))}
                </div>
                <Link
                  to="/teams/$teamId"
                  params={{ teamId: team.id }}
                  className="text-sm font-semibold text-royal hover:underline"
                >
                  Open team profile →
                </Link>
              </Card>
            ) : null}
            <h3 className="mt-8 text-lg font-bold text-primary">Recent matches in this sport</h3>
            <ul className="mt-3 space-y-2">
              {relatedMatches.map((m) => (
                <li key={m.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm">
                  <span className="font-medium">{m.teamA} vs {m.teamB}</span>
                  <span className="text-muted-foreground">{m.round} · {m.date}</span>
                </li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="tournaments" className="mt-6 space-y-3">
            {relatedTournaments.map((t) => (
              <Link key={t.id} to="/tournaments/$tournamentId" params={{ tournamentId: t.id }}>
                <Card className="glass-card card-hover flex-row items-center justify-between gap-3 p-5">
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-primary">{t.name}</span>
                    <span className="block text-xs text-muted-foreground">{t.startDate} · {t.venue}</span>
                  </span>
                  <Badge variant="secondary" className="shrink-0 capitalize">{t.status.replace("-", " ")}</Badge>
                </Card>
              </Link>
            ))}
          </TabsContent>

          <TabsContent value="achievements" className="mt-6 grid gap-4 md:grid-cols-2">
            {athlete.achievements.map((a) => (
              <Card key={a} className="glass-card flex-row items-start gap-3 p-5">
                <Award className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <p className="text-sm text-foreground">{a}</p>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="certificates" className="mt-6 grid gap-4 md:grid-cols-2">
            {athleteCerts.length ? (
              athleteCerts.map((c) => (
                <Card key={c.id} className="glass-card gap-2 p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-primary">{c.title}</p>
                      <p className="text-sm text-muted-foreground">{c.tournament}</p>
                    </div>
                    <QrCode className="h-10 w-10 shrink-0 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">Issued {c.issuedOn} · Code {c.code}</p>
                  <Link to="/certificates" className="text-sm font-semibold text-royal hover:underline">
                    Verify certificate →
                  </Link>
                </Card>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No certificates issued yet.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
