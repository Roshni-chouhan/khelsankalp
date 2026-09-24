export type SportId =
  | "cricket"
  | "football"
  | "basketball"
  | "volleyball"
  | "badminton"
  | "table-tennis"
  | "athletics"
  | "tennis"
  | "chess";

export type TournamentFormat = "knockout" | "league" | "round-robin";
export type TournamentStatus = "upcoming" | "registration-open" | "ongoing" | "completed";
export type MatchStatus = "scheduled" | "live" | "completed";

export interface Sport {
  id: SportId;
  name: string;
  icon: string;
  athletes: number;
  teams: number;
  tournaments: number;
  venue: string;
  season: string;
  description: string;
}

export interface Department {
  code: string;
  name: string;
  gold: number;
  silver: number;
  bronze: number;
  points: number;
}

export interface Team {
  id: string;
  name: string;
  sport: SportId;
  department: string;
  captain: string;
  coach: string;
  played: number;
  won: number;
  lost: number;
  drawn: number;
  points: number;
  roster: string[];
  founded: string;
}

export interface Athlete {
  id: string;
  name: string;
  enrollment: string;
  department: string;
  year: string;
  sport: SportId;
  secondarySport?: SportId;
  position: string;
  teamId: string;
  matches: number;
  wins: number;
  points: number;
  rating: number;
  medals: { gold: number; silver: number; bronze: number };
  achievements: string[];
  form: { label: string; value: number }[];
  attendance: number;
  certificates: string[];
}

export interface MatchEvent {
  minute: string;
  type: string;
  text: string;
}

export interface Match {
  id: string;
  tournamentId: string;
  sport: SportId;
  round: string;
  status: MatchStatus;
  date: string;
  time: string;
  venue: string;
  teamA: string;
  teamB: string;
  scoreA: string;
  scoreB: string;
  detail?: string;
  events: MatchEvent[];
  commentary: string[];
}

export interface PointsRow {
  team: string;
  played: number;
  won: number;
  lost: number;
  drawn: number;
  nrr: string;
  points: number;
}

export interface Tournament {
  id: string;
  name: string;
  sport: SportId;
  format: TournamentFormat;
  status: TournamentStatus;
  startDate: string;
  endDate: string;
  venue: string;
  organizer: string;
  teamsCount: number;
  matchesCount: number;
  prize: string;
  registrationDeadline: string;
  description: string;
  teams: string[];
  pointsTable: PointsRow[];
}

export interface Facility {
  id: string;
  name: string;
  type: string;
  capacity: number;
  location: string;
  status: "available" | "booked" | "maintenance";
  openHours: string;
  sports: SportId[];
  slots: { time: string; booked: boolean; by?: string }[];
  x: number;
  y: number;
}

export interface Equipment {
  id: string;
  name: string;
  sport: SportId;
  total: number;
  issued: number;
  condition: "excellent" | "good" | "needs repair";
  store: string;
}

export interface Certificate {
  id: string;
  athlete: string;
  title: string;
  tournament: string;
  issuedOn: string;
  code: string;
  type: "winner" | "runner-up" | "participation" | "merit";
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  date: string;
  category: string;
}

export interface TrainingSession {
  id: string;
  team: string;
  sport: SportId;
  coach: string;
  date: string;
  time: string;
  venue: string;
  focus: string;
  attendance: number;
}
