export type CelestialType = 'Star' | 'Terrestrial Planet' | 'Gas Giant' | 'Ice Giant' | 'Dwarf Planet';

export interface InternalLayer {
  name: string;
  depth: string;
  description: string;
  color: string;
}

export interface SpaceMission {
  name: string;
  year: string;
  agency: string;
  highlight: string;
}

export interface CelestialBody {
  id: string;
  name: string;
  type: CelestialType;
  diameterKm: number;
  relativeSizeEarth: number; // e.g. 1.0 for Earth, 11.0 for Jupiter
  distanceFromSunAU: number; // 0 for Sun
  distanceFromSunMillionKm: number;
  orbitalPeriodDays: number; // 0 for Sun
  orbitalPeriodYears: number; // 0 for Sun
  rotationPeriodHours: number; // negative if retrograde (Venus)
  moonsCount: number;
  avgTempCelsius: number;
  temperatureRange?: string;
  surfaceGravityMs2: number; // e.g. 9.8 for Earth, 24.79 for Jupiter, 274 for Sun
  relativeGravity: number; // relative to Earth = 1.0
  color: string;
  accentColor: string;
  glowColor: string;
  orbitRadius: number; // visual orbit radius in base simulation pixels
  visualRadius: number; // visual rendering radius in base pixels
  speedFactor: number; // relative angular speed for balanced animation
  rings?: {
    innerRadius: number;
    outerRadius: number;
    color: string;
    tiltAngle: number;
  };
  overview: string;
  funFact: string;
  atmosphereComposition: string[];
  internalStructure?: InternalLayer[];
  notableMissions?: SpaceMission[];
}

export interface SimulationState {
  isPlaying: boolean;
  speedMultiplier: number; // 0.1, 0.25, 0.5, 1, 2, 5, 10, 20
  elapsedDays: number;
  zoom: number;
  pan: { x: number; y: number };
  selectedBodyId: string | null;
  focusedBodyId: string | null; // camera centers on this body
  showOrbits: boolean;
  showLabels: boolean;
  showTrails: boolean;
  showAsteroidBelt: boolean;
  showKuiperBelt: boolean;
  showSpacecraft: boolean;
  showCosmicEvents: boolean;
  soundEnabled: boolean;
}
