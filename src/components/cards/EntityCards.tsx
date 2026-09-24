import { Link } from "@tanstack/react-router";
import { CalendarDays, MapPin, Trophy, Users, Medal, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { sportIcon, sportName } from "@/data/mock";
import type { Athlete, Match, Sport, Team, Tournament } from "@/types";

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    live: "bg-live text-live-foreground",
    ongoing: "bg-live text-live-foreground",
    "registration-open": "bg-success text-success-foreground",
    upcoming: "bg-royal/12 text-royal",
    scheduled: "bg-royal/12 text-royal",
    completed: "bg-muted text-muted-foreground",
    available: "bg-success/15 text-success",
    booked: "bg-gold/25 text-gold-foreground",
    maintenance: "bg-destructive/12 text-destructive",
  };
  const label = status.replace("-", " ");
  const isLive = status === "live" || status === "ongoing";
  return (
    <Badge className={`${map[status] ?? "bg-muted text-muted-foreground"} border-0 capitalize`}>
      {isLive ? <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current live-dot" /> : null}
      {label}
    </Badge>
  );
}

export function SportCard({ sport }: { sport: Sport }) {
  return (
    <Link to="/sports/$sportId" params={{ sportId: sport.id }}>
      <Card className="glass-card card-hover h-full gap-3 p-6">
        <div className="flex items-center justify-between">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-accent text-3xl">
            {sport.icon}
          </span>
          <Badge variant="secondary" className="text-xs">{sport.season}</Badge>
        </div>
        <h3 className="mt-2 text-xl font-bold text-primary">{sport.name}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{sport.description}</p>
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{sport.athletes} athletes</span>
          <span className="flex items-center gap-1"><Trophy className="h-3.5 w-3.5" />{sport.tournaments} events</span>
        </div>
      </Card>
    </Link>
  );
}

export function TournamentCard({ tournament }: { tournament: Tournament }) {
  return (
    <Link to="/tournaments/$tournamentId" params={{ tournamentId: tournament.id }}>
      <Card className="glass-card card-hover h-full gap-3 p-6">
        <div className="flex items-start justify-between gap-3">
          <span className="text-3xl">{sportIcon(tournament.sport)}</span>
          <StatusBadge status={tournament.status} />
        </div>
        <h3 className="text-lg font-bold leading-snug text-primary">{tournament.name}</h3>
        <div className="space-y-1.5 text-sm text-muted-foreground">
          <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 shrink-0" />{tournament.startDate} → {tournament.endDate}</p>
          <p className="flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0" /><span className="truncate">{tournament.venue}</span></p>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          <Badge variant="secondary" className="capitalize">{tournament.format}</Badge>
          <Badge variant="secondary">{tournament.teamsCount} teams</Badge>
          <Badge variant="secondary">{tournament.matchesCount} matches</Badge>
        </div>
        <p className="mt-2 flex items-center gap-1 text-sm font-semibold text-royal">
          View tournament <ArrowRight className="h-4 w-4" />
        </p>
      </Card>
    </Link>
  );
}

export function AthleteCard({ athlete }: { athlete: Athlete }) {
  const initials = athlete.name.split(" ").map((n) => n[0]).join("");
  return (
    <Link to="/athletes/$athleteId" params={{ athleteId: athlete.id }}>
      <Card className="glass-card card-hover h-full gap-3 p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl gradient-royal font-display text-lg font-bold text-primary-foreground">
            {initials}
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-lg font-bold text-primary">{athlete.name}</h3>
            <p className="truncate text-xs text-muted-foreground">
              {athlete.department} · {athlete.year}
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {sportIcon(athlete.sport)} {sportName(athlete.sport)} — {athlete.position}
        </p>
        <div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Performance rating</span>
            <span className="font-semibold text-primary">{athlete.rating}</span>
          </div>
          <Progress value={athlete.rating} className="mt-1.5 h-1.5" />
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Medal className="h-3.5 w-3.5 text-gold" />{athlete.medals.gold}G</span>
          <span>{athlete.medals.silver}S</span>
          <span>{athlete.medals.bronze}B</span>
          <span className="ml-auto">{athlete.matches} matches</span>
        </div>
      </Card>
    </Link>
  );
}

export function TeamCard({ team }: { team: Team }) {
  return (
    <Link to="/teams/$teamId" params={{ teamId: team.id }}>
      <Card className="glass-card card-hover h-full gap-3 p-6">
        <div className="flex items-start justify-between">
          <span className="text-3xl">{sportIcon(team.sport)}</span>
          <Badge variant="secondary">{team.department}</Badge>
        </div>
        <h3 className="text-lg font-bold text-primary">{team.name}</h3>
        <p className="text-sm text-muted-foreground">
          Captain {team.captain} · {team.coach}
        </p>
        <div className="mt-1 grid grid-cols-4 gap-2 text-center">
          {[
            { k: "P", v: team.played },
            { k: "W", v: team.won },
            { k: "L", v: team.lost },
            { k: "Pts", v: team.points },
          ].map((s) => (
            <div key={s.k} className="rounded-lg bg-surface py-2">
              <p className="font-display text-base font-bold text-primary">{s.v}</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.k}</p>
            </div>
          ))}
        </div>
      </Card>
    </Link>
  );
}

export function MatchCard({ match }: { match: Match }) {
  return (
    <Card className="glass-card gap-3 p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {sportIcon(match.sport)} {match.round}
        </p>
        <StatusBadge status={match.status} />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <span className="min-w-0 truncate font-semibold text-foreground">{match.teamA}</span>
          <span className="shrink-0 font-display text-lg font-bold text-primary">{match.scoreA}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="min-w-0 truncate font-semibold text-foreground">{match.teamB}</span>
          <span className="shrink-0 font-display text-lg font-bold text-primary">{match.scoreB}</span>
        </div>
      </div>
      {match.detail ? (
        <p className="rounded-lg bg-surface px-3 py-2 text-xs font-medium text-royal">{match.detail}</p>
      ) : null}
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{match.date} · {match.time}</span>
        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{match.venue}</span>
      </div>
      <Link
        to="/tournaments/$tournamentId"
        params={{ tournamentId: match.tournamentId }}
        className="text-sm font-semibold text-royal hover:underline"
      >
        Match centre & commentary →
      </Link>
    </Card>
  );
}
