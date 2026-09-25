import { createFileRoute } from "@tanstack/react-router";
import {
  CalendarDays,
  MapPin,
  Trophy,
  Users,
} from "lucide-react";

import { FeatureAccessGate } from "@/components/access/FeatureAccessGate";

export const Route = createFileRoute("/fixture")({
  component: FixturesPage,
});

const fixtures = [
  {
    round: "Semi Final",
    sport: "Cricket",
    tournament: "SGSITS Inter-Department Cricket",
    teamA: "Computer Engineering",
    teamB: "Mechanical Engineering",
    date: "26 Sep 2026",
    time: "9:00 AM",
    venue: "Main Cricket Ground",
  },
  {
    round: "Final",
    sport: "Basketball",
    tournament: "Inter-Branch Basketball",
    teamA: "CSE",
    teamB: "ECE",
    date: "28 Sep 2026",
    time: "4:00 PM",
    venue: "Basketball Court",
  },
];

function FixturesPage() {
  return (
    <FeatureAccessGate
      feature="fixtures"
      title="Tournament Fixtures"
      description="View approved match fixtures, participating teams, rounds and venues."
    >
      <main className="ks-page">
        <div className="ks-container">
          <div className="ks-page-header">
            <div>
              <p className="ks-eyebrow">MATCH MANAGEMENT</p>
              <h1 className="ks-page-title">Fixtures</h1>
              <p className="ks-page-description">
                Current tournament fixtures and upcoming matches.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {fixtures.map((fixture) => (
              <div
                key={`${fixture.tournament}-${fixture.teamA}`}
                className="ks-card p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="ks-badge">
                      {fixture.round}
                    </span>

                    <h2 className="mt-3 text-xl font-bold">
                      {fixture.tournament}
                    </h2>
                  </div>

                  <Trophy className="text-primary" />
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <TeamBox name={fixture.teamA} />
                  <TeamBox name={fixture.teamB} />
                </div>

                <div className="mt-5 flex flex-wrap gap-5 border-t pt-5 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <CalendarDays size={16} />
                    {fixture.date}
                  </span>

                  <span className="flex items-center gap-2">
                    🕘 {fixture.time}
                  </span>

                  <span className="flex items-center gap-2">
                    <MapPin size={16} />
                    {fixture.venue}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </FeatureAccessGate>
  );
}

function TeamBox({ name }: { name: string }) {
  return (
    <div className="rounded-xl border bg-muted/30 p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2 text-primary">
          <Users size={20} />
        </div>

        <div>
          <p className="text-xs text-muted-foreground">TEAM</p>
          <p className="font-semibold">{name}</p>
        </div>
      </div>
    </div>
  );
}