import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Clock3, MapPin } from "lucide-react";

import { FeatureAccessGate } from "@/components/access/FeatureAccessGate";

export const Route = createFileRoute("/schedule")({
  component: SchedulePage,
});

function SchedulePage() {
  return (
    <FeatureAccessGate
      feature="schedule"
      title="Tournament Schedule"
      description="View approved tournament schedules, timings, venues and event activities."
    >
      <main className="ks-page">
        <div className="ks-container">
          <div className="ks-page-header">
            <div>
              <p className="ks-eyebrow">UPCOMING EVENTS</p>
              <h1 className="ks-page-title">Tournament Schedule</h1>
              <p className="ks-page-description">
                Current tournament activities and important timings.
              </p>
            </div>

            <CalendarDays size={36} className="text-primary" />
          </div>

          <div className="space-y-4">
            <ScheduleItem
              tournament="SGSITS Inter-Department Cricket"
              date="26 September 2026"
              time="9:00 AM"
              venue="Main Cricket Ground"
            />

            <ScheduleItem
              tournament="Inter-Branch Basketball"
              date="28 September 2026"
              time="4:00 PM"
              venue="Basketball Court"
            />
          </div>
        </div>
      </main>
    </FeatureAccessGate>
  );
}

function ScheduleItem({
  tournament,
  date,
  time,
  venue,
}: {
  tournament: string;
  date: string;
  time: string;
  venue: string;
}) {
  return (
    <div className="ks-card flex flex-wrap items-center gap-5 p-6">
      <div className="rounded-xl bg-primary/10 p-4 text-primary">
        <CalendarDays size={25} />
      </div>

      <div className="min-w-[220px] flex-1">
        <h3 className="font-bold">{tournament}</h3>

        <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CalendarDays size={15} />
            {date}
          </span>

          <span className="flex items-center gap-1.5">
            <Clock3 size={15} />
            {time}
          </span>

          <span className="flex items-center gap-1.5">
            <MapPin size={15} />
            {venue}
          </span>
        </div>
      </div>
    </div>
  );
}