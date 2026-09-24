import { createFileRoute } from "@tanstack/react-router";
import { Target, HeartHandshake, Trophy, Building2 } from "lucide-react";
import campus from "@/assets/campus-hero.jpg";
import logo from "@/assets/unisports-logo.png";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { COLLEGE, institutionStats, sports } from "@/data/mock";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About KhelSankalp — SGSITS Indore Sports Council" },
      {
        name: "description",
        content:
          "KhelSankalp is the official digital sports ecosystem of Shri Govindram Seksaria Institute of Technology and Science, Indore.",
      },
      { property: "og:title", content: "About KhelSankalp — SGSITS Indore" },
      {
        property: "og:description",
        content: "The story, mission and structure of sport at SGSITS Indore.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div>
      <PageHeader
        eyebrow={COLLEGE.sportsCouncil}
        title="About KhelSankalp"
        description={`The official digital sports ecosystem of ${COLLEGE.name}, ${COLLEGE.city}.`}
      />
      <div className="mx-auto max-w-7xl px-4 py-10">
        <Card className="glass-card overflow-hidden p-0 md:grid md:grid-cols-2">
          <img
            src={campus}
            alt="SGSITS Indore campus"
            width={1920}
            height={1088}
            loading="lazy"
            className="h-64 w-full object-cover md:h-full"
          />
          <div className="p-8 sm:p-10">
            <img src={logo} alt="" aria-hidden loading="lazy" width={56} height={56} className="h-14 w-14" />
            <p className="mt-5 font-display text-2xl text-primary">{COLLEGE.sanskrit}</p>
            <p className="mt-2 text-sm text-muted-foreground">{COLLEGE.tagline}</p>
            <p className="mt-5 text-sm text-muted-foreground">
              Founded in {COLLEGE.established}, SGSITS has grown into one of central India's leading
              engineering institutes. KhelSankalp brings the same rigour to campus sport: a single
              platform where the Sports Council runs tournaments, coaches manage squads, and every
              athlete owns a verified record of their achievements.
            </p>
          </div>
        </Card>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            {
              icon: Target,
              title: "Our mission",
              text: "Give every SGSITS student a fair, transparent and well-organised path to compete — from departmental trials to inter-college championships.",
            },
            {
              icon: HeartHandshake,
              title: "Who runs it",
              text: "The Board of Physical Education with the student Sports Council, supported by department coaches and organiser volunteers.",
            },
            {
              icon: Trophy,
              title: "What we track",
              text: "Tournaments, live scoring, player statistics, medals, department standings, facilities, equipment and digital certificates.",
            },
          ].map((b) => (
            <Card key={b.title} className="glass-card gap-3 p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-primary">
                <b.icon className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-bold text-primary">{b.title}</h3>
              <p className="text-sm text-muted-foreground">{b.text}</p>
            </Card>
          ))}
        </div>

        <Card className="glass-card mt-10 grid gap-6 p-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { k: "Athletes", v: `${institutionStats.athletes}+` },
            { k: "Active teams", v: institutionStats.teams },
            { k: "Tournaments / year", v: institutionStats.tournaments },
            { k: "Venues", v: institutionStats.facilities },
          ].map((s) => (
            <div key={s.k}>
              <p className="font-display text-3xl font-bold text-primary">{s.v}</p>
              <p className="text-sm text-muted-foreground">{s.k}</p>
            </div>
          ))}
        </Card>

        <h2 className="mt-12 flex items-center gap-2 text-xl font-bold text-primary">
          <Building2 className="h-5 w-5 text-royal" /> Sports we govern
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {sports.map((s) => (
            <Badge key={s.id} variant="secondary" className="px-3 py-1.5 text-sm">
              {s.icon} {s.name}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
