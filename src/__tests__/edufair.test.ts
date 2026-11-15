import { describe, it, expect } from 'vitest';
import { getEventPhase, computeCountdownParts, EDUFAIR_TARGET_TS } from '../utils/edufair';

describe('EduFair getEventPhase', () => {
  it('returns "upcoming" for any timestamp before the target event', () => {
    // 1 millisecond before
    const justBefore = new Date(EDUFAIR_TARGET_TS - 1);
    expect(getEventPhase(justBefore)).toBe('upcoming');

    // 1 day before
    const oneDayBefore = new Date(EDUFAIR_TARGET_TS - 86400 * 1000);
    expect(getEventPhase(oneDayBefore)).toBe('upcoming');

    // Present day (e.g. November 2026)
    const currentTestDate = new Date('2026-11-15T12:00:00+07:00');
    expect(getEventPhase(currentTestDate)).toBe('upcoming');
  });

  it('returns "live" exactly at the target timestamp', () => {
    const exactMoment = new Date(EDUFAIR_TARGET_TS);
    expect(getEventPhase(exactMoment)).toBe('live');
  });

  it('returns "live" for any timestamp after the target event', () => {
    // 1 millisecond after
    const justAfter = new Date(EDUFAIR_TARGET_TS + 1);
    expect(getEventPhase(justAfter)).toBe('live');

    // 2 hours after
    const twoHoursAfter = new Date(EDUFAIR_TARGET_TS + 2 * 3600 * 1000);
    expect(getEventPhase(twoHoursAfter)).toBe('live');

    // 1 day after
    const oneDayAfter = new Date(EDUFAIR_TARGET_TS + 86400 * 1000);
    expect(getEventPhase(oneDayAfter)).toBe('live');
  });

  it('computes countdown parts accurately before and at event', () => {
    const twoHoursBefore = new Date(EDUFAIR_TARGET_TS - (2 * 3600 + 15 * 60 + 30) * 1000);
    const parts = computeCountdownParts(twoHoursBefore);
    expect(parts.days).toBe(0);
    expect(parts.hours).toBe(2);
    expect(parts.minutes).toBe(15);
    expect(parts.seconds).toBe(30);

    const afterEvent = new Date(EDUFAIR_TARGET_TS + 1000);
    const partsAfter = computeCountdownParts(afterEvent);
    expect(partsAfter.totalDiffSec).toBe(0);
    expect(partsAfter.days).toBe(0);
  });
});
