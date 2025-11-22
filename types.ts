export interface AnalysisResult {
  vibe: string;
  score: number; // 1-100
  bio: string;
  suggestions: string[];
}

export type NameStyle = 'CALM' | 'EXTREME' | 'GAMING' | 'VLOG' | 'TECH' | 'RANDOM';

export enum DiceState {
  IDLE = 'IDLE',
  ROLLING = 'ROLLING',
  SETTLED = 'SETTLED',
}