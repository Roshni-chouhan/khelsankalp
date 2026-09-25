import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Trophy,
  Users,
  CalendarDays,
  Radio,
  Medal,
  MapPin,
  ArrowRight,
  Sparkles,
  UserPlus,
  CalendarCheck,
  ShieldCheck,
  ClipboardList,
  Camera,
} from "lucide-react";

import hero from "@/assets/campus-hero.jpg";
import action from "@/assets/sports-action.jpg";
import logo from "@/assets/unisports-logo.png";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/common/StatCard";
import { DepartmentLeaderboard } from "@/components/common/LeaderboardTable";
import {
  AthleteCard,
  MatchCard,
  SportCard,
  TournamentCard,
} from "@/components/cards/EntityCards";

import {
  COLLEGE,
  announcements,
  athletes,
  departments,
  institutionStats,
  matches,
  sports,
  tournaments,
} from "@/data/mock";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "KhelSankalp SGSITS — College Sports Tournaments",
      },
      {
        name: "description",
        content:
          "Live scores, tournaments, athletes, teams and facility booking for Shri Govindram Seksaria Institute of Technology and Science, Indore.",
      },
      {
        property: "og:title",
        content: "KhelSankalp — SGSITS Indore",
      },
      {
        property: "og:description",
        content:
          "The official SGSITS Indore sports tournament ecosystem — live and in one place.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const live = matches.filter((m) => m.status === "live");

  const featured = tournaments
    .filter((t) => t.status !== "completed")
    .slice(0, 3);

  const topAthletes = [...athletes]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  return (
    <div>
      {/* =========================================================
          IMMERSIVE HOME PORTAL
          ========================================================= */}
      <section className="relative isolate min-h-[720px] overflow-hidden bg-primary sm:min-h-[760px]">
        <img
          src={hero}
          alt="SGSITS Indore campus building at golden hour"
          width={1920}
          height={1088}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <div className="absolute inset-0 gradient-hero" />

        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,var(--color-primary)_100%)] opacity-80" />

        <div className="relative mx-auto flex min-h-[720px] max-w-7xl flex-col px-4 pb-6 pt-16 sm:min-h-[760px] sm:pt-24">
          <div className="max-w-2xl">
            <Badge className="border border-primary-foreground/20 bg-primary/40 text-primary-foreground backdrop-blur-md">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              The official SGSITS sports ecosystem
            </Badge>

            <p className="mt-7 text-sm font-semibold uppercase tracking-[0.18em] text-gold">
              {COLLEGE.sanskrit}
            </p>

            <h1 className="mt-3 max-w-xl font-display text-5xl leading-[0.95] text-primary-foreground sm:text-7xl">
              KhelSankalp

              <span className="mt-3 block font-sans text-lg font-semibold uppercase tracking-[0.12em] text-primary-foreground/80 sm:text-xl">
                Sports Tournament Management
              </span>
            </h1>

            <p className="mt-5 max-w-lg text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
              {COLLEGE.tagline}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-gold text-gold-foreground hover:bg-gold/90"
              >
                <Link to="/tournaments">
                  <Trophy className="mr-2 h-4 w-4" />
                  Explore tournaments
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/40 bg-primary-foreground/10 text-primary-foreground backdrop-blur hover:bg-primary-foreground/20 hover:text-primary-foreground"
              >
                <Link to="/explore">
                  <Radio className="mr-2 h-4 w-4" />
                  Live scores
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-auto grid gap-3 pt-12 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Trophy,
                title: "Upcoming tournaments",
                copy: "Fixtures, draws and registrations",
                to: "/tournaments" as const,
              },
              {
                icon: UserPlus,
                title: "Athlete profiles",
                copy: "Stats, medals and achievements",
                to: "/athletes" as const,
              },
              {
                icon: ShieldCheck,
                title: "Team management",
                copy: "Squads, coaches and performance",
                to: "/teams" as const,
              },
              {
                icon: CalendarCheck,
                title: "Facility booking",
                copy: "Courts, grounds and time slots",
                to: "/facilities" as const,
              },
            ].map((item) => (
              <Link
                key={item.title}
                to={item.to}
                className="group min-h-32 border border-primary-foreground/15 bg-primary/55 p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:border-gold/60 hover:bg-primary/70"
              >
                <div className="flex items-start justify-between gap-4">
                  <item.icon className="h-7 w-7 text-gold" />

                  <ArrowRight className="h-4 w-4 text-primary-foreground/50 transition group-hover:translate-x-1 group-hover:text-gold" />
                </div>

                <p className="mt-5 font-semibold text-primary-foreground">
                  {item.title}
                </p>

                <p className="mt-1 text-xs text-primary-foreground/60">
                  {item.copy}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          STATS
          ========================================================= */}
      <section className="mx-auto mt-8 max-w-7xl px-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Users}
            label="Registered athletes"
            value={`${institutionStats.athletes}+`}
            hint="Across 9 sports"
          />

          <StatCard
            icon={Trophy}
            label="Tournaments"
            value={institutionStats.tournaments}
            hint="This academic session"
            accent="gold"
          />

          <StatCard
            icon={Radio}
            label="Live right now"
            value={institutionStats.liveMatches}
            hint="Ball-by-ball updates"
            accent="live"
          />

          <StatCard
            icon={Medal}
            label="Medals awarded"
            value={institutionStats.medalsAwarded}
            hint="Department championship"
            accent="primary"
          />
        </div>
      </section>

      {/* =========================================================
          LIVE
          ========================================================= */}
      <section className="mx-auto mt-20 max-w-7xl px-4">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-live">
              <span className="h-2 w-2 rounded-full bg-live live-dot" />
              Live now
            </p>

            <h2 className="mt-2 text-2xl font-bold text-primary sm:text-3xl">
              Match centre
            </h2>
          </div>

          <Button asChild variant="ghost">
            <Link to="/explore">
              All matches
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {live.map((m) => (
            <MatchCard key={m.id} match={m} />
          ))}

          {matches
            .filter((m) => m.status === "scheduled")
            .slice(0, 1)
            .map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
        </div>
      </section>

      {/* =========================================================
          TOURNAMENTS
          ========================================================= */}
      <section className="mx-auto mt-20 max-w-7xl px-4">
        <h2 className="text-2xl font-bold text-primary sm:text-3xl">
          Featured tournaments
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Registration, fixtures, live scoring, points tables and results —
          end to end.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((t) => (
            <TournamentCard key={t.id} tournament={t} />
          ))}
        </div>
      </section>

      {/* =========================================================
          SPORTS
          ========================================================= */}
      <section className="mx-auto mt-20 max-w-7xl px-4">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
          <h2 className="min-w-0 text-2xl font-bold text-primary sm:text-3xl">
            campus sports
          </h2>

          <Button asChild variant="ghost">
            <Link to="/sports">
              View all
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sports.slice(0, 6).map((s) => (
            <SportCard key={s.id} sport={s} />
          ))}
        </div>
      </section>

      {/* =========================================================
          NEW SPORTS MANAGEMENT MODULES
          ========================================================= */}
      <section className="ks-home-tools mt-20">
        <div className="ks-container">
          <div className="ks-section-heading">
            <div>
              <p className="ks-eyebrow">SPORTS MANAGEMENT</p>

              <h2 className="ks-section-title">
                Everything athletes and organisers need
              </h2>

              <p className="ks-section-description">
                Discover tournaments, follow fixtures, track schedules,
                explore galleries and stay updated with important sports
                activities.
              </p>
            </div>
          </div>

          <div className="ks-feature-grid">
            <HomeFeature
              icon={<Trophy size={24} />}
              title="Tournaments"
              description="Discover current and upcoming tournaments."
              href="/tournaments"
            />

            <HomeFeature
              icon={<ClipboardList size={24} />}
              title="Fixtures"
              description="Follow approved tournament fixtures and matches."
              href="/fixtures"
            />

            <HomeFeature
              icon={<CalendarDays size={24} />}
              title="Schedule"
              description="Track tournament dates, timings and venues."
              href="/schedule"
            />

            <HomeFeature
              icon={<Camera size={24} />}
              title="Gallery"
              description="Explore approved tournament photo galleries."
              href="/gallery"
            />
          </div>
        </div>
      </section>

      {/* =========================================================
          CALENDAR QUICK ACCESS
          ========================================================= */}
      <section className="mx-auto mt-20 max-w-7xl px-4">
        <Card className="glass-card overflow-hidden">
          <div className="flex flex-col gap-6 p-7 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-royal">
                Sports events
              </p>

              <h2 className="mt-2 text-2xl font-bold text-primary sm:text-3xl">
                Never miss an important sports date
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                View the central sports calendar for tournaments, fixtures,
                registrations and upcoming activities.
              </p>
            </div>

            <Button asChild className="gradient-royal text-primary-foreground">
              <Link to="/calendar">
                <CalendarDays className="mr-2 h-4 w-4" />
                Open calendar
              </Link>
            </Button>
          </div>
        </Card>
      </section>

      {/* =========================================================
          SPLIT BANNER
          ========================================================= */}
      <section className="mx-auto mt-20 max-w-7xl px-4">
        <Card className="glass-card overflow-hidden p-0 md:grid md:grid-cols-2">
          <img
            src={action}
            alt="SGSITS students competing in cricket and basketball"
            width={1600}
            height={912}
            loading="lazy"
            className="h-64 w-full object-cover md:h-full"
          />

          <div className="p-8 sm:p-10">
            <img
              src={logo}
              alt=""
              aria-hidden
              loading="lazy"
              width={56}
              height={56}
              className="h-14 w-14"
            />

            <h2 className="mt-5 text-2xl font-bold text-primary sm:text-3xl">
              One ecosystem for every athlete on campus
            </h2>

            <p className="mt-3 text-sm text-muted-foreground">
              From your first departmental trial to a digitally verifiable
              championship certificate, KhelSankalp tracks every match, stat,
              medal and achievement of your SGSITS career.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                asChild
                className="gradient-royal text-primary-foreground"
              >
                <Link to="/athletes">Browse athletes</Link>
              </Button>

              <Button asChild variant="outline">
                <Link to="/certificates">Verify a certificate</Link>
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* =========================================================
          LEADERBOARD + ANNOUNCEMENTS
          ========================================================= */}
      <section className="mx-auto mt-20 max-w-7xl px-4">
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="min-w-0">
            <h2 className="text-2xl font-bold text-primary sm:text-3xl">
              Department championship standings
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Points aggregated across all sports for the 2026-27 session.
            </p>

            <div className="mt-5">
              <DepartmentLeaderboard rows={departments} />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-primary sm:text-3xl">
              Announcements
            </h2>

            <div className="mt-5 space-y-4">
              {announcements.map((a) => (
                <Card key={a.id} className="glass-card gap-1 p-5">
                  <Badge variant="secondary" className="w-fit">
                    {a.category}
                  </Badge>

                  <p className="mt-1 font-semibold text-primary">
                    {a.title}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {a.body}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {a.date}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          TOP ATHLETES
          ========================================================= */}
      <section className="mx-auto mt-20 max-w-7xl px-4">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
          <h2 className="min-w-0 text-2xl font-bold text-primary sm:text-3xl">
            Top rated athletes
          </h2>

          <Button asChild variant="ghost">
            <Link to="/athletes">
              Full roster
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {topAthletes.map((a) => (
            <AthleteCard key={a.id} athlete={a} />
          ))}
        </div>
      </section>

      {/* =========================================================
          CTA
          ========================================================= */}
      <section className="mx-auto mt-20 max-w-7xl px-4">
        <Card className="relative overflow-hidden border-0 gradient-royal p-10 text-center">
          <h2 className="relative text-2xl font-bold text-primary-foreground sm:text-3xl">
            Ready to represent your department?
          </h2>

          <p className="relative mx-auto mt-3 max-w-xl text-sm text-primary-foreground/85">
            Registrations for the SGSITS Hoops League and Aavartan Badminton
            Open are open now.
          </p>

          <div className="relative mt-7 flex flex-wrap justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="gradient-gold text-gold-foreground"
            >
              <Link to="/tournaments">Register a team</Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/40 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"
            >
              <Link to="/campus-map">
                <MapPin className="mr-2 h-4 w-4" />
                Campus sports map
              </Link>
            </Button>
          </div>
        </Card>
      </section>

      {/* =========================================================
          COLLEGE INFO
          ========================================================= */}
      <section className="mx-auto mt-20 max-w-7xl px-4">
        <div className="flex flex-wrap items-center justify-center gap-6 rounded-2xl border border-border bg-surface px-6 py-8 text-center text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-royal" />
            Est. {COLLEGE.established}
          </span>

          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-royal" />
            {COLLEGE.city}
          </span>

          <span className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-royal" />
            {institutionStats.teams} active teams
          </span>
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   HOME FEATURE CARD
   ========================================================= */

function HomeFeature({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      to={href}
      className="ks-home-feature group"
    >
      <div>
        <div className="ks-home-feature-icon">
          {icon}
        </div>

        <h3 className="mt-5 text-lg font-bold">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="flex items-center gap-2 text-sm font-semibold text-primary">
        Explore

        <ArrowRight
          size={16}
          className="transition-transform group-hover:translate-x-1"
        />
      </div>
    </Link>
  );
}