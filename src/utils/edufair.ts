/**
 * EDUFAIR EVENT TIMING & PHASE UTILITIES
 * Target: EduFair Finale 20/12/2026 08:00 GMT+7 (Asia/Ho_Chi_Minh)
 */

export const EDUFAIR_TARGET_ISO = '2026-12-20T08:00:00+07:00';
export const EDUFAIR_TARGET_TS = new Date(EDUFAIR_TARGET_ISO).getTime();

export type EventPhase = 'upcoming' | 'live';

/**
 * Returns single source of truth for EduFair event phase.
 * Before target timestamp -> 'upcoming'
 * Target timestamp and later -> 'live'
 */
export function getEventPhase(now: Date = new Date()): EventPhase {
  return now.getTime() < EDUFAIR_TARGET_TS ? 'upcoming' : 'live';
}

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDiffSec: number;
}

export function computeCountdownParts(now: Date = new Date()): CountdownParts {
  const diffSec = Math.max(0, Math.floor((EDUFAIR_TARGET_TS - now.getTime()) / 1000));
  const days = Math.floor(diffSec / 86400);
  const hours = Math.floor((diffSec % 86400) / 3600);
  const minutes = Math.floor((diffSec % 3600) / 60);
  const seconds = diffSec % 60;
  return { days, hours, minutes, seconds, totalDiffSec: diffSec };
}
