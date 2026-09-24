import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { facilities, sportName } from "@/data/mock";

export const Route = createFileRoute("/campus-map")({
  head: () => ({
    meta: [
      { title: "Campus Sports Map — KhelSankalp SGSITS" },
      {
        name: "description",
        content:
          "Interactive map of sports facilities on the SGSITS Indore campus.",
      },
      { property: "og:title", content: "Campus Sports Map — KhelSankalp SGSITS" },
      {
        property: "og:description",
        content: "Locate sports facilities on the SGSITS Indore campus.",
      },
    ],
  }),
  component: CampusMapPage,
});

function CampusMapPage() {
  const [active, setActive] = useState(facilities[0]!.id);
  const current = facilities.find((f) => f.id === active)!;

  return (
    <div>
      <PageHeader
        eyebrow="Wayfinding"
        title="Campus Sports Map"
        description="Tap a marker to see details about each sports facility."
      />

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[1.5fr_1fr]">
        <Card className="glass-card overflow-hidden p-0">
          <div className="relative aspect-4/3 w-full bg-surface">
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 100 75"
              aria-hidden
            >
              <rect
                x="0"
                y="0"
                width="100"
                height="75"
                fill="var(--color-surface)"
              />

              <path
                d="M0 40 H100"
                stroke="var(--color-border)"
                strokeWidth="2.5"
              />

              <path
                d="M45 0 V75"
                stroke="var(--color-border)"
                strokeWidth="2.5"
              />

              <rect
                x="6"
                y="6"
                width="26"
                height="16"
                rx="2"
                fill="var(--color-accent)"
              />

              <rect
                x="52"
                y="8"
                width="22"
                height="14"
                rx="2"
                fill="var(--color-accent)"
              />

              <rect
                x="60"
                y="56"
                width="30"
                height="14"
                rx="2"
                fill="var(--color-accent)"
              />

              <rect
                x="8"
                y="60"
                width="24"
                height="10"
                rx="2"
                fill="var(--color-accent)"
              />
            </svg>

            <span className="absolute left-4 top-4 rounded-full bg-card px-3 py-1 text-xs font-semibold text-muted-foreground shadow-sm">
              SGSITS Indore · Park Road campus
            </span>

            {facilities.map((f) => (
              <button
                key={f.id}
                onClick={() => setActive(f.id)}
                style={{ left: `${f.x}%`, top: `${f.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-full rounded-full p-1 transition-transform hover:scale-110 ${
                  f.id === active ? "scale-110" : ""
                }`}
                aria-label={f.name}
              >
                <span
                  className={`grid h-9 w-9 place-items-center rounded-full shadow-md ${
                    f.id === active
                      ? "gradient-gold text-gold-foreground"
                      : "gradient-royal text-primary-foreground"
                  }`}
                >
                  <MapPin className="h-4.5 w-4.5" />
                </span>
              </button>
            ))}
          </div>
        </Card>

        <div>
          {/* Selected facility */}
          <Card className="glass-card gap-3 p-6">
            <h2 className="min-w-0 text-xl font-bold text-primary">
              {current.name}
            </h2>

            <p className="text-sm text-muted-foreground">
              {current.type} · {current.location}
            </p>

            <p className="text-sm text-muted-foreground">
              Open: {current.openHours}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {current.sports.map((s) => (
                <Badge key={s} variant="secondary">
                  {sportName(s)}
                </Badge>
              ))}
            </div>

            <Button
              asChild
              className="mt-2 gradient-royal text-primary-foreground"
            >
              <Link to="/facilities">View facility</Link>
            </Button>
          </Card>

          {/* Facility names */}
          <div className="mt-5 space-y-2">
            {facilities.map((f) => (
              <button
                key={f.id}
                onClick={() => setActive(f.id)}
                className={`flex w-full items-center rounded-xl border px-4 py-3 text-left transition-colors ${
                  f.id === active
                    ? "border-royal bg-accent"
                    : "border-border bg-card hover:border-royal/50"
                }`}
              >
                <span className="min-w-0 truncate text-sm font-medium">
                  {f.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}