import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  Award,
  BarChart3,
  CalendarCheck,
  ClipboardList,
  Medal,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { DepartmentLeaderboard } from "@/components/common/LeaderboardTable";
import { MatchCard } from "@/components/cards/EntityCards";
import {
  MedalPieChart,
  ParticipationChart,
  SportBarChart,
} from "@/components/charts/AnalyticsCharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  announcements,
  athletes,
  certificates,
  departments,
  equipment,
  institutionStats,
  matches,
  participationTrend,
  sportPopularity,
  teams,
  tournaments,
  trainingSessions,
} from "@/data/mock";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Role Portals — SGSITS KhelSankalp Dashboard" },
      {
        name: "description",
        content:
          "Athlete, coach, organizer and admin portals for SGSITS Indore sports: teams, training, live scoring, registrations, certificates and analytics.",
      },
      { property: "og:title", content: "Role Portals — SGSITS KhelSankalp Dashboard" },
      {
        property: "og:description",
        content:
          "Manage SGSITS tournaments, athletes, training, facilities and analytics from one campus sports dashboard.",
      },
    ],
  }),
  component: DashboardPage,
});

const sectionTitle = "font-display text-xl font-bold text-primary";

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="glass-card p-6">
      <h3 className={sectionTitle}>{title}</h3>
      <div className="mt-4">{children}</div>
    </Card>
  );
}

function DashboardPage() {
  const athlete = athletes[0]!;
  const live = matches.filter((m) => m.status === "live");
  const upcoming = matches.filter((m) => m.status === "scheduled").slice(0, 3);
  const medalData = [
    { name: "Gold", value: departments.reduce((s, d) => s + d.gold, 0) },
    { name: "Silver", value: departments.reduce((s, d) => s + d.silver, 0) },
    { name: "Bronze", value: departments.reduce((s, d) => s + d.bronze, 0) },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="SGSITS Sports Council"
        title="Role Portals"
        description="One workspace for athletes, coaches, organizers and the sports administration of SGSITS Indore."
      />

      <div className="mx-auto max-w-7xl px-4 py-10">
        <Tabs defaultValue="athlete">
          <TabsList className="flex-wrap">
            <TabsTrigger value="athlete">Athlete</TabsTrigger>
            <TabsTrigger value="coach">Coach</TabsTrigger>
            <TabsTrigger value="organizer">Organizer</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>

          {/* ATHLETE */}
          <TabsContent value="athlete" className="mt-8 space-y-8">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-royal/10 text-royal">Signed in as {athlete.name}</Badge>
              <span className="text-sm text-muted-foreground">
                {athlete.enrollment} · {athlete.department} · {athlete.year}
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard icon={Activity} label="Matches played" value={athlete.matches} />
              <StatCard icon={Trophy} label="Wins" value={athlete.wins} accent="primary" />
              <StatCard
                icon={Medal}
                label="Medals"
                value={athlete.medals.gold + athlete.medals.silver + athlete.medals.bronze}
                accent="gold"
              />
              <StatCard
                icon={CalendarCheck}
                label="Training attendance"
                value={`${athlete.attendance}%`}
                accent="live"
              />
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <Panel title="My upcoming matches">
                <div className="grid gap-4">
                  {upcoming.map((m) => (
                    <MatchCard key={m.id} match={m} />
                  ))}
                </div>
              </Panel>
              <div className="space-y-6">
                <Panel title="Achievements">
                  <ul className="space-y-3 text-sm">
                    {athlete.achievements.map((a) => (
                      <li key={a} className="flex gap-2">
                        <Award className="mt-0.5 h-4 w-4 shrink-0 text-gold-foreground" />
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </Panel>
                <Panel title="My certificates">
                  <div className="space-y-3">
                    {certificates
                      .filter((c) => c.athlete === athlete.name)
                      .map((c) => (
                        <div
                          key={c.id}
                          className="flex items-center justify-between gap-3 rounded-xl border border-border p-3"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">{c.title}</p>
                            <p className="truncate text-xs text-muted-foreground">{c.code}</p>
                          </div>
                          <Button asChild size="sm" variant="outline">
                            <Link to="/certificates">Verify</Link>
                          </Button>
                        </div>
                      ))}
                  </div>
                </Panel>
                <Button asChild className="w-full">
                  <Link to="/athletes/$athleteId" params={{ athleteId: athlete.id }}>
                    Open full athlete profile
                  </Link>
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* COACH */}
          <TabsContent value="coach" className="mt-8 space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard icon={Users} label="Teams coached" value={3} />
              <StatCard icon={Activity} label="Athletes" value={64} accent="primary" />
              <StatCard
                icon={CalendarCheck}
                label="Sessions this week"
                value={trainingSessions.length}
                accent="gold"
              />
              <StatCard icon={Trophy} label="Season win rate" value="68%" accent="live" />
            </div>
            <Panel title="Training schedule & attendance">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Team</TableHead>
                      <TableHead>Focus</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Venue</TableHead>
                      <TableHead className="w-40">Attendance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trainingSessions.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell className="font-medium">{s.team}</TableCell>
                        <TableCell>{s.focus}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          {s.date} · {s.time}
                        </TableCell>
                        <TableCell>{s.venue}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={s.attendance} className="h-2" />
                            <span className="text-xs text-muted-foreground">{s.attendance}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Panel>
            <Panel title="Squad performance">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Athlete</TableHead>
                      <TableHead>Dept</TableHead>
                      <TableHead>Matches</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {athletes.slice(0, 6).map((a) => (
                      <TableRow key={a.id}>
                        <TableCell className="font-medium">{a.name}</TableCell>
                        <TableCell>{a.department}</TableCell>
                        <TableCell>{a.matches}</TableCell>
                        <TableCell>{a.rating}</TableCell>
                        <TableCell className="text-right">
                          <Button asChild size="sm" variant="ghost">
                            <Link to="/athletes/$athleteId" params={{ athleteId: a.id }}>
                              View
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Panel>
          </TabsContent>

          {/* ORGANIZER */}
          <TabsContent value="organizer" className="mt-8 space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard icon={Trophy} label="Tournaments" value={tournaments.length} />
              <StatCard icon={Users} label="Registered teams" value={teams.length} accent="primary" />
              <StatCard icon={Activity} label="Live now" value={live.length} accent="live" />
              <StatCard icon={ClipboardList} label="Fixtures" value={matches.length} accent="gold" />
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <Panel title="Live scoring console">
                <div className="grid gap-4">
                  {live.map((m) => (
                    <div key={m.id} className="rounded-xl border border-border p-4">
                      <p className="text-sm font-semibold">
                        {m.teamA} vs {m.teamB}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">{m.detail}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button asChild size="sm">
                          <Link to="/tournaments/$tournamentId" params={{ tournamentId: m.tournamentId }}>
                            Open scoring
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline">
                          Add event
                        </Button>
                        <Button size="sm" variant="outline">
                          Post commentary
                        </Button>
                      </div>
                    </div>
                  ))}
                  {live.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No live matches right now.</p>
                  ) : null}
                </div>
              </Panel>
              <Panel title="Tournament pipeline">
                <div className="space-y-3">
                  {tournaments.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-border p-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{t.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {t.format} · {t.teamsCount} teams · closes {t.registrationDeadline}
                        </p>
                      </div>
                      <Button asChild size="sm" variant="outline">
                        <Link to="/tournaments/$tournamentId" params={{ tournamentId: t.id }}>
                          Manage
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>
          </TabsContent>

          {/* ADMIN */}
          <TabsContent value="admin" className="mt-8 space-y-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard icon={Users} label="Athletes" value={institutionStats.athletes} />
              <StatCard icon={ShieldCheck} label="Teams" value={institutionStats.teams} accent="primary" />
              <StatCard icon={Trophy} label="Tournaments" value={institutionStats.tournaments} accent="gold" />
              <StatCard
                icon={BarChart3}
                label="Certificates issued"
                value={certificates.length}
                accent="live"
              />
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <Panel title="Participation trend">
                <ParticipationChart data={participationTrend} />
              </Panel>
              <Panel title="Medals awarded">
                <MedalPieChart data={medalData} />
              </Panel>
            </div>
            <Panel title="Athletes by sport">
              <SportBarChart data={sportPopularity} />
            </Panel>
            <div className="grid gap-6 lg:grid-cols-2">
              <Panel title="Equipment inventory">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Issued / Total</TableHead>
                        <TableHead>Condition</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {equipment.map((e) => (
                        <TableRow key={e.id}>
                          <TableCell className="font-medium">{e.name}</TableCell>
                          <TableCell>
                            {e.issued} / {e.total}
                          </TableCell>
                          <TableCell className="capitalize">{e.condition}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Panel>
              <Panel title="Announcements & notifications">
                <div className="space-y-3">
                  {announcements.map((a) => (
                    <div key={a.id} className="rounded-xl border border-border p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold">{a.title}</p>
                        <Badge variant="secondary">{a.category}</Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{a.body}</p>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>
            <Panel title="Department-wise leaderboard">
              <DepartmentLeaderboard rows={departments} />
            </Panel>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
