import { createFileRoute } from "@tanstack/react-router";
import {
  CalendarDays,
  CircleDot,
  Trophy,
} from "lucide-react";

import { FeatureAccessGate } from "@/components/access/FeatureAccessGate";

export const Route = createFileRoute("/calendar")({
  component: CalendarPage,
});

const events = [
  {
    date: "26",
    month: "SEP",
    title: "Inter-Department Cricket",
    type: "Tournament",
  },
  {
    date: "28",
    month: "SEP",
    title: "Inter-Branch Basketball",
    type: "Match",
  },
];

function CalendarPage() {
  return (
    <FeatureAccessGate
      feature="calendar"
      title="Sports Calendar"
      description="View the central calendar of tournaments, fixtures, registrations and sports activities."
    >
      <main className="ks-page">
        <div className="ks-container">
          <div className="ks-page-header">
            <div>
              <p className="ks-eyebrow">SPORTS EVENTS</p>
              <h1 className="ks-page-title">Sports Calendar</h1>
              <p className="ks-page-description">
                One calendar for all important sports activities.
              </p>
            </div>

            <CalendarDays size={38} className="text-primary" />
          </div>

          <div className="ks-card overflow-hidden">
            <div className="border-b p-5">
              <h2 className="font-bold">September 2026</h2>
            </div>

            <div className="divide-y">
              {events.map((event) => (
                <div
                  key={event.title}
                  className="flex items-center gap-5 p-5"
                >
                  <div className="flex h-16 w-16 flex-col items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <span className="text-xl font-bold">
                      {event.date}
                    </span>
                    <span className="text-[10px] font-semibold">
                      {event.month}
                    </span>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold">
                      {event.title}
                    </h3>

                    <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                      {event.type === "Tournament" ? (
                        <Trophy size={14} />
                      ) : (
                        <CircleDot size={14} />
                      )}

                      {event.type}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </FeatureAccessGate>
  );
}