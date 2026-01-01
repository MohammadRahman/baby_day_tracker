// Sleep tracking
export interface SleepEntry {
  id: string;
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  duration: number; // in seconds
  notes?: string;
}

// Bottle feeding
export type BottleType = 'formula' | 'breastmilk' | 'other';

export interface BottleEntry {
  id: string;
  type: BottleType;
  amount: number; // in ml
  time: string; // ISO date string
  notes?: string;
}

// Diaper changes
export type DiaperType = 'pee' | 'poop' | 'both';
export type PoopColor = 'yellow' | 'brown' | 'green' | 'black' | 'red' | 'white';
export type PoopConsistency = 'watery' | 'soft' | 'formed' | 'hard';

export interface DiaperEntry {
  id: string;
  type: DiaperType;
  poopColor?: PoopColor;
  poopConsistency?: PoopConsistency;
  time: string; // ISO date string
  notes?: string;
}

// Breastfeeding / Nursing
export type BreastSide = 'left' | 'right';

export interface NursingEntry {
  id: string;
  leftDuration: number; // in seconds
  rightDuration: number; // in seconds
  startTime: string; // ISO date string
  lastSide: BreastSide;
  notes?: string;
}

// Pumping
export interface PumpingEntry {
  id: string;
  side: BreastSide | 'both';
  duration: number; // in seconds
  amount: number; // in ml
  time: string; // ISO date string
  notes?: string;
}

// Doctor visits
export interface DoctorEntry {
  id: string;
  date: string; // ISO date string
  weight?: number; // in kg
  height?: number; // in cm
  headCircumference?: number; // in cm
  medications?: string;
  feedback?: string;
  notes?: string;
}

// Timer state
export interface TimerState {
  isRunning: boolean;
  startTime: number | null;
  elapsed: number;
}

// Nursing timer state (dual timer)
export interface NursingTimerState {
  isRunning: boolean;
  activeSide: BreastSide | null;
  leftElapsed: number;
  rightElapsed: number;
  startTime: number | null;
  lastSide: BreastSide | null;
}
