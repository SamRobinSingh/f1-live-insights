export interface DriverData {
  x: (number | null)[];
  y: (number | null)[];
  speed: number[];
  color: string;
  name: string;
  team: string;
  compound: string;
}

export interface TrackMap {
  x: number[];
  y: number[];
}

export interface RaceData {
  event_name: string;
  track_map: TrackMap;
  timeline: number[];
  drivers: Record<string, DriverData>;
}

export interface RaceRequest {
  year: number;
  circuit: string;
}

export interface CommentaryRequest {
  time_val: number;
  leader_name: string;
  leader_team: string;
  leader_compound: string;
  leader_speed: number;
  chaser_name: string;
  gap: number;
}

export interface DriverPosition {
  id: string;
  name: string;
  team: string;
  color: string;
  compound: string;
  x: number | null;
  y: number | null;
  speed: number;
  position: number;
}

export interface Circuit {
  name: string;
  id: string;
}

export const CIRCUITS: Circuit[] = [
  { name: "Bahrain", id: "Bahrain" },
  { name: "Saudi Arabia", id: "Saudi Arabia" },
  { name: "Australia", id: "Australia" },
  { name: "Japan", id: "Japan" },
  { name: "China", id: "China" },
  { name: "Miami", id: "Miami" },
  { name: "Emilia Romagna", id: "Emilia Romagna" },
  { name: "Monaco", id: "Monaco" },
  { name: "Canada", id: "Canada" },
  { name: "Spain", id: "Spain" },
  { name: "Austria", id: "Austria" },
  { name: "Great Britain", id: "Great Britain" },
  { name: "Hungary", id: "Hungary" },
  { name: "Belgium", id: "Belgium" },
  { name: "Netherlands", id: "Netherlands" },
  { name: "Italy", id: "Italy" },
  { name: "Azerbaijan", id: "Azerbaijan" },
  { name: "Singapore", id: "Singapore" },
  { name: "United States", id: "United States" },
  { name: "Mexico", id: "Mexico" },
  { name: "Brazil", id: "Brazil" },
  { name: "Las Vegas", id: "Las Vegas" },
  { name: "Qatar", id: "Qatar" },
  { name: "Abu Dhabi", id: "Abu Dhabi" },
];

export const YEARS = [2024, 2023, 2022, 2021, 2020, 2019];
