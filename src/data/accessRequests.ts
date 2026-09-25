import type { ControlledFeature } from "@/lib/accessControl";

export interface ControlledFeatureInfo {
  id: ControlledFeature;
  title: string;
  description: string;
  icon: string;
  purpose: string;
}

export const controlledFeatures: ControlledFeatureInfo[] = [
  {
    id: "gallery",
    title: "Tournament Gallery",
    description:
      "Upload and manage tournament photographs through approved Google Drive galleries.",
    icon: "📸",
    purpose:
      "Maintain a digital visual record of tournaments, athletes and events.",
  },
  {
    id: "schedule",
    title: "Tournament Schedule",
    description:
      "Publish tournament dates, timings, venues and important event schedules.",
    icon: "📅",
    purpose:
      "Keep athletes and organisers informed about upcoming tournament activities.",
  },
  {
    id: "fixtures",
    title: "Fixtures",
    description:
      "Create and publish match fixtures, rounds, teams and match timings.",
    icon: "🏆",
    purpose:
      "Digitally maintain match structure and reduce manual fixture management.",
  },
  {
    id: "calendar",
    title: "Sports Calendar",
    description:
      "Maintain a central calendar of tournaments, matches, registrations and sports events.",
    icon: "🗓️",
    purpose:
      "Give athletes and organisers one place to track important sports dates.",
  },
];