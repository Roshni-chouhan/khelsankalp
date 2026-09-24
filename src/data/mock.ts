import type {
  Announcement,
  Athlete,
  Certificate,
  Department,
  Equipment,
  Facility,
  Match,
  Sport,
  Team,
  Tournament,
  TrainingSession,
} from "@/types";

export const COLLEGE = {
  name: "Shri Govindram Seksaria Institute of Technology and Science",
  short: "SGSITS",
  city: "Indore, Madhya Pradesh",
  established: 1952,
  sanskrit: "योगः कर्मसु कौशलम्।",
  tagline: "Excellence in action. Every sport. Every athlete. Every achievement.",
  sportsCouncil: "Eklavya Sports Competition Forum & SGSITS Students Union",
};

export const sports: Sport[] = [
  {
    id: "cricket",
    name: "Cricket",
    icon: "🏏",
    athletes: 0,
    teams: 0,
    tournaments: 0,
    venue: "SGSITS Main Cricket Ground",
    season: "Aug – Nov",
    description:
      "Inter-department T20 and 40-over cricket played on the main ground behind the Mechanical block.",
  },
  {
    id: "football",
    name: "Football",
    icon: "⚽",
    athletes: 0,
    teams: 0,
    tournaments: 0,
    venue: "Institute Football Field",
    season: "Sep – Dec",
    description:
      "11-a-side departmental league plus a knockout Ekalavya Cup every winter.",
  },
  {
    id: "basketball",
    name: "Basketball",
    icon: "🏀",
    athletes: 0,
    teams: 0,
    tournaments: 0,
    venue: "Open Air Basketball Court, Block C",
    season: "Jul – Oct",
    description:
      "Fast 5v5 league under floodlights with a dedicated women's division.",
  },
  {
    id: "volleyball",
    name: "Volleyball",
    icon: "🏐",
    athletes: 0,
    teams: 0,
    tournaments: 0,
    venue: "Volleyball Court, Hostel Zone",
    season: "Aug – Oct",
    description:
      "Best-of-five sets league contested by hostels and departments.",
  },
  {
    id: "badminton",
    name: "Badminton",
    icon: "🏸",
    athletes: 0,
    teams: 0,
    tournaments: 0,
    venue: "Indoor Sports Hall — Court 1 & 2",
    season: "Year round",
    description:
      "Singles, doubles and mixed doubles ladders run through the academic year.",
  },
  {
    id: "table-tennis",
    name: "Table Tennis",
    icon: "🏓",
    athletes: 0,
    teams: 0,
    tournaments: 0,
    venue: "Indoor Sports Hall — TT Arena",
    season: "Year round",
    description:
      "Six tables, rapid knockout brackets and a departmental team championship.",
  },
  {
    id: "athletics",
    name: "Athletics",
    icon: "🏃",
    athletes: 0,
    teams: 0,
    tournaments: 0,
    venue: "400m Institute Track",
    season: "Jan – Mar",
    description:
      "Annual Athletic Meet: sprints, relays, long jump, shot put and cross country.",
  },
  {
    id: "tennis",
    name: "Tennis",
    icon: "🎾",
    athletes: 0,
    teams: 0,
    tournaments: 0,
    venue: "Institute Tennis Court",
    season: "Oct – Feb",
    description:
      "Hard-court singles and doubles with faculty-versus-students exhibition ties.",
  },
  {
    id: "chess",
    name: "Chess",
    icon: "♟️",
    athletes: 0,
    teams: 0,
    tournaments: 0,
    venue: "Seminar Hall, Student Activity Centre",
    season: "Year round",
    description:
      "Swiss-system rated tournaments and a blitz league during Aavartan.",
  },
];

export const departments: Department[] = [
  {
    code: "CSE",
    name: "Computer Engineering",
    gold: 0,
    silver: 0,
    bronze: 0,
    points: 0,
  },
  {
    code: "MECH",
    name: "Mechanical Engineering",
    gold: 0,
    silver: 0,
    bronze: 0,
    points: 0,
  },
  {
    code: "ETC",
    name: "Electronics & Telecommunication Engineering",
    gold: 0,
    silver: 0,
    bronze: 0,
    points: 0,
  },
];

/*
 * Demo teams removed.
 * Keep the export so existing imports do not break.
 */
export const teams: Team[] = [];

/*
 * Demo athletes removed.
 */
export const athletes: Athlete[] = [];

/*
 * Demo tournaments removed.
 */
export const tournaments: Tournament[] = [
  {
    id: "tr-demo-cricket",
    name: "Varchasva Inter-Branch Cricket Championship",
    sport: "cricket",
    format: "league",
    status: "upcoming",
    startDate: "2026-09-20",
    endDate: "2026-09-30",
    venue: "SGSITS Main Cricket Ground",
    organizer: "Eklavya Sports Competition Forum",
    teamsCount: 2,
    matchesCount: 1,
    prize: "Eklavya Rolling Trophy",
    registrationDeadline: "2026-09-18",
    description:
      "A demo inter-department cricket tournament for SGSITS, demonstrating registration, fixtures, live scoring, points tables and results.",
    teams: ["CSE Coders XI", "Mech Titans"],
    pointsTable: [
      {
        team: "CSE Coders XI",
        played: 0,
        won: 0,
        lost: 0,
        drawn: 0,
        nrr: "0.00",
        points: 0,
      },
      {
        team: "Mech Titans",
        played: 0,
        won: 0,
        lost: 0,
        drawn: 0,
        nrr: "0.00",
        points: 0,
      },
    ],
  },
];

 
export const matches: Match[] = [];

/*
 * Facilities are kept because these are master/reference data
 * used by the existing system.
 */
export const facilities: Facility[] = [
  {
    id: "f-01",
    name: "SGSITS Main Cricket Ground",
    type: "Outdoor Ground",
    capacity: 2500,
    location: "Behind Mechanical Block",
    status: "available",
    openHours: "06:00 – 19:00",
    sports: ["cricket", "athletics"],
    slots: [
      { time: "06:00 – 08:00", booked: false },
      { time: "08:00 – 10:00", booked: false },
      { time: "15:30 – 19:00", booked: false },
    ],
    x: 24,
    y: 32,
  },
  {
    id: "f-02",
    name: "Institute Football Field",
    type: "Outdoor Ground",
    capacity: 1800,
    location: "North Campus, near Hostel 3",
    status: "available",
    openHours: "06:00 – 20:00",
    sports: ["football", "athletics"],
    slots: [
      { time: "06:00 – 08:00", booked: false },
      { time: "16:00 – 18:00", booked: false },
      { time: "18:00 – 20:00", booked: false },
    ],
    x: 62,
    y: 20,
  },
  {
    id: "f-03",
    name: "Indoor Sports Hall",
    type: "Indoor Complex",
    capacity: 600,
    location: "Student Activity Centre",
    status: "available",
    openHours: "07:00 – 21:00",
    sports: ["badminton", "table-tennis", "chess"],
    slots: [
      { time: "07:00 – 09:00", booked: false },
      { time: "17:00 – 19:00", booked: false },
      { time: "19:00 – 21:00", booked: false },
    ],
    x: 48,
    y: 58,
  },
  {
    id: "f-04",
    name: "Open Air Basketball Court",
    type: "Court",
    capacity: 400,
    location: "Block C Quadrangle",
    status: "available",
    openHours: "06:00 – 22:00",
    sports: ["basketball"],
    slots: [
      { time: "06:00 – 08:00", booked: false },
      { time: "18:00 – 20:00", booked: false },
    ],
    x: 74,
    y: 52,
  },
  {
    id: "f-05",
    name: "Volleyball Court",
    type: "Court",
    capacity: 300,
    location: "Hostel Zone",
    status: "maintenance",
    openHours: "Closed for net replacement",
    sports: ["volleyball"],
    slots: [],
    x: 30,
    y: 74,
  },
  {
    id: "f-07",
    name: "Institute Tennis Court",
    type: "Court",
    capacity: 200,
    location: "Near Faculty Housing",
    status: "available",
    openHours: "06:00 – 20:00",
    sports: ["tennis"],
    slots: [
      { time: "06:00 – 08:00", booked: false },
      { time: "17:00 – 19:00", booked: false },
    ],
    x: 86,
    y: 74,
  },
  {
    id: "f-08",
    name: "Fitness & Strength Centre",
    type: "Gymnasium",
    capacity: 120,
    location: "Ground Floor, SAC",
    status: "available",
    openHours: "06:00 – 21:00",
    sports: ["athletics", "basketball", "football"],
    slots: [
      { time: "06:00 – 09:00", booked: false },
      { time: "18:00 – 21:00", booked: false },
    ],
    x: 55,
    y: 82,
  },
];

/*
 * Equipment is kept as master/reference data.
 */
export const equipment: Equipment[] = [
  {
    id: "e-01",
    name: "Cricket Kit (full)",
    sport: "cricket",
    total: 18,
    issued: 0,
    condition: "good",
    store: "Sports Store A",
  },
  {
    id: "e-02",
    name: "Match Footballs",
    sport: "football",
    total: 30,
    issued: 0,
    condition: "excellent",
    store: "Sports Store A",
  },
  {
    id: "e-03",
    name: "Basketballs",
    sport: "basketball",
    total: 24,
    issued: 0,
    condition: "good",
    store: "Sports Store B",
  },
  {
    id: "e-04",
    name: "Volleyball Nets",
    sport: "volleyball",
    total: 6,
    issued: 0,
    condition: "needs repair",
    store: "Sports Store B",
  },
  {
    id: "e-05",
    name: "Badminton Racquets",
    sport: "badminton",
    total: 40,
    issued: 0,
    condition: "good",
    store: "Indoor Hall Desk",
  },
  {
    id: "e-06",
    name: "TT Tables",
    sport: "table-tennis",
    total: 6,
    issued: 0,
    condition: "excellent",
    store: "Indoor Hall Desk",
  },
  {
    id: "e-07",
    name: "Starting Blocks",
    sport: "athletics",
    total: 8,
    issued: 0,
    condition: "good",
    store: "Track Pavilion",
  },
  {
    id: "e-08",
    name: "Tennis Ball Cartons",
    sport: "tennis",
    total: 25,
    issued: 0,
    condition: "excellent",
    store: "Sports Store B",
  },
  {
    id: "e-09",
    name: "Tournament Chess Sets",
    sport: "chess",
    total: 20,
    issued: 0,
    condition: "good",
    store: "SAC Store",
  },
];

/*
 * Demo certificates removed.
 * Export retained so existing imports continue working.
 */
export const certificates: Certificate[] = [];

/*
 * Demo announcements removed.
 */
export const announcements: Announcement[] = [];

/*
 * Demo training sessions removed.
 */
export const trainingSessions: TrainingSession[] = [];

/*
 * Demo chart data removed.
 * Export retained for dashboard compatibility.
 */
export const participationTrend: {
  month: string;
  athletes: number;
  matches: number;
}[] = [];

/*
 * Derived from the master sports list.
 * No hardcoded demo athlete counts.
 */
export const sportPopularity = sports.map((s) => ({
  name: s.name,
  value: s.athletes,
}));

/*
 * Dashboard statistics now reflect the actual cleaned data.
 * No hardcoded demo totals.
 */
export const institutionStats = {
  athletes: athletes.length,
  teams: teams.length,
  tournaments: tournaments.length,
  facilities: facilities.length,
  liveMatches: matches.filter((m) => m.status === "live").length,
  medalsAwarded: departments.reduce(
    (total, department) =>
      total + department.gold + department.silver + department.bronze,
    0,
  ),
};

/*
 * Existing helper functions preserved.
 */
export const getSport = (id: string) =>
  sports.find((s) => s.id === id);

export const getTeam = (id: string) =>
  teams.find((t) => t.id === id);

export const getAthlete = (id: string) =>
  athletes.find((a) => a.id === id);

export const getTournament = (id: string) =>
  tournaments.find((t) => t.id === id);

export const matchesByTournament = (id: string) =>
  matches.filter((m) => m.tournamentId === id);

export const liveMatches = () =>
  matches.filter((m) => m.status === "live");

export const sportName = (id: string) =>
  getSport(id)?.name ?? id;

export const sportIcon = (id: string) =>
  getSport(id)?.icon ?? "🏅";