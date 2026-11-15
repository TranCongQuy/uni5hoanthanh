import { describe, it, expect } from 'vitest';
import {
  getApplicationsByRegion,
  getAdmissionFunnel,
  getScoreHistogram,
  getDailySubmissionTimeline,
  getUniversityBenchmarkTable,
} from '../services/AdminAnalyticsService';
import { UNIVERSITIES } from '../data/MockData';
import { INITIAL_APPLICATIONS } from '../data/mockApplications';

describe('AdminAnalyticsService Pure Selectors', () => {
  describe('getApplicationsByRegion', () => {
    it('satisfies invariant: sum of region counts equals total applications', () => {
      const result = getApplicationsByRegion(INITIAL_APPLICATIONS, UNIVERSITIES);
      const sum = result.reduce((acc, curr) => acc + curr.count, 0);
      expect(sum).toBe(INITIAL_APPLICATIONS.length);
    });

    it('handles empty applications array without crashing or NaN', () => {
      const result = getApplicationsByRegion([], UNIVERSITIES);
      expect(result).toHaveLength(3);
      for (const r of result) {
        expect(r.count).toBe(0);
        expect(r.percentage).toBe(0);
      }
    });

    it('correctly maps university code to region', () => {
      const sample = [
        { ...INITIAL_APPLICATIONS[0], uniCode: 'BKA' }, // Bắc
        { ...INITIAL_APPLICATIONS[0], uniCode: 'PXU' }, // Trung
        { ...INITIAL_APPLICATIONS[0], uniCode: 'HCMUT' }, // Nam
      ];
      const result = getApplicationsByRegion(sample, UNIVERSITIES);
      const bac = result.find((r) => r.region === 'Bắc');
      const trung = result.find((r) => r.region === 'Trung');
      const nam = result.find((r) => r.region === 'Nam');

      expect(bac?.count).toBe(1);
      expect(trung?.count).toBe(1);
      expect(nam?.count).toBe(1);
    });
  });

  describe('getAdmissionFunnel', () => {
    it('returns exactly 5 pipeline stages', () => {
      const result = getAdmissionFunnel(INITIAL_APPLICATIONS);
      expect(result).toHaveLength(5);
      expect(result[0].stage).toContain('Đang xét');
      expect(result[1].stage).toContain('Hợp lệ');
      expect(result[2].stage).toContain('Trúng tuyển');
    });

    it('handles empty applications array gracefully', () => {
      const result = getAdmissionFunnel([]);
      expect(result).toHaveLength(5);
      for (const s of result) {
        expect(s.count).toBe(0);
        expect(s.dropRate).toBe(0);
      }
    });
  });

  describe('getScoreHistogram', () => {
    it('satisfies invariant: sum of histogram bucket counts equals total applications', () => {
      const result = getScoreHistogram(INITIAL_APPLICATIONS);
      const sum = result.reduce((acc, curr) => acc + curr.count, 0);
      expect(sum).toBe(INITIAL_APPLICATIONS.length);
    });

    it('handles empty applications array with all zero counts', () => {
      const result = getScoreHistogram([]);
      expect(result).toHaveLength(5);
      for (const b of result) {
        expect(b.count).toBe(0);
        expect(b.percentage).toBe(0);
      }
    });

    it('places scores accurately into defined boundaries', () => {
      const sample = [
        { ...INITIAL_APPLICATIONS[0], score: 17.5 },
        { ...INITIAL_APPLICATIONS[0], score: 18.0 },
        { ...INITIAL_APPLICATIONS[0], score: 23.5 },
        { ...INITIAL_APPLICATIONS[0], score: 25.0 },
        { ...INITIAL_APPLICATIONS[0], score: 28.5 },
      ];
      const result = getScoreHistogram(sample);
      expect(result.find((b) => b.range === '< 18đ')?.count).toBe(1);
      expect(result.find((b) => b.range === '18 – 21đ')?.count).toBe(1);
      expect(result.find((b) => b.range === '21 – 24đ')?.count).toBe(1);
      expect(result.find((b) => b.range === '24 – 27đ')?.count).toBe(1);
      expect(result.find((b) => b.range === '≥ 27đ')?.count).toBe(1);
    });
  });

  describe('getDailySubmissionTimeline', () => {
    it('returns empty array when applications array is empty', () => {
      const result = getDailySubmissionTimeline([]);
      expect(result).toEqual([]);
    });

    it('produces formatted DD/MM labels and chronological order', () => {
      const result = getDailySubmissionTimeline(INITIAL_APPLICATIONS);
      expect(result.length).toBeGreaterThan(0);
      for (const point of result) {
        expect(point.label).toMatch(/^\d{2}\/\d{2}$/);
        expect(point.count).toBeGreaterThan(0);
      }
    });
  });

  describe('getUniversityBenchmarkTable', () => {
    it('returns benchmark rows for all 30 partner universities', () => {
      const result = getUniversityBenchmarkTable(UNIVERSITIES, INITIAL_APPLICATIONS);
      expect(result).toHaveLength(30);
    });

    it('verifies demo dataset: PXU has exactly 4 applications (app-1, app-6, app-7, app-8)', () => {
      const result = getUniversityBenchmarkTable(UNIVERSITIES, INITIAL_APPLICATIONS);
      const pxuRow = result.find((r) => r.code === 'PXU');
      expect(pxuRow).toBeDefined();
      expect(pxuRow?.applicationCount).toBe(4);

      // Verify the IDs in raw demo dataset
      const pxuAppIds = INITIAL_APPLICATIONS.filter((a) => a.uniCode === 'PXU').map((a) => a.id);
      expect(pxuAppIds).toEqual(['app-1', 'app-6', 'app-7', 'app-8']);
    });

    it('handles empty applications with zero counts and empty flags', () => {
      const result = getUniversityBenchmarkTable(UNIVERSITIES, []);
      expect(result).toHaveLength(30);
      for (const row of result) {
        expect(row.applicationCount).toBe(0);
        expect(row.approvedCount).toBe(0);
        expect(row.approvalRate).toBe(0);
        expect(row.hasApplications).toBe(false);
      }
    });
  });
});
