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

    it('satisfies invariant: sum of funnel stage counts equals total applications', () => {
      const result = getAdmissionFunnel(INITIAL_APPLICATIONS);
      const sum = result.reduce((acc, curr) => acc + curr.count, 0);
      expect(sum).toBe(INITIAL_APPLICATIONS.length);
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

    it('returns exactly 6 standard score intervals', () => {
      const result = getScoreHistogram(INITIAL_APPLICATIONS);
      expect(result).toHaveLength(6);
      expect(result.map((b) => b.range)).toEqual([
        '< 20đ',
        '20 – 22đ',
        '22 – 24đ',
        '24 – 26đ',
        '26 – 28đ',
        '≥ 28đ',
      ]);
    });

    it('handles empty applications array with all zero counts across 6 buckets', () => {
      const result = getScoreHistogram([]);
      expect(result).toHaveLength(6);
      for (const b of result) {
        expect(b.count).toBe(0);
        expect(b.percentage).toBe(0);
      }
    });

    it('verifies exact score counts on INITIAL_APPLICATIONS (0, 0, 2, 3, 1, 2)', () => {
      const result = getScoreHistogram(INITIAL_APPLICATIONS);
      const counts = result.map((b) => b.count);
      expect(counts).toEqual([0, 0, 2, 3, 1, 2]);
    });

    it('places scores accurately into defined boundaries [min, max) and [28, inf)', () => {
      const sample = [
        { ...INITIAL_APPLICATIONS[0], score: 19.5 },
        { ...INITIAL_APPLICATIONS[0], score: 20.0 },
        { ...INITIAL_APPLICATIONS[0], score: 22.0 },
        { ...INITIAL_APPLICATIONS[0], score: 24.0 },
        { ...INITIAL_APPLICATIONS[0], score: 26.0 },
        { ...INITIAL_APPLICATIONS[0], score: 28.0 },
      ];
      const result = getScoreHistogram(sample);
      expect(result.find((b) => b.range === '< 20đ')?.count).toBe(1);
      expect(result.find((b) => b.range === '20 – 22đ')?.count).toBe(1);
      expect(result.find((b) => b.range === '22 – 24đ')?.count).toBe(1);
      expect(result.find((b) => b.range === '24 – 26đ')?.count).toBe(1);
      expect(result.find((b) => b.range === '26 – 28đ')?.count).toBe(1);
      expect(result.find((b) => b.range === '≥ 28đ')?.count).toBe(1);
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

    it('verifies demo dataset: PXU has 4 applications, avgScore = 24.7, qualifiedRate = 100%, topMajor = Công nghệ Thông tin', () => {
      const result = getUniversityBenchmarkTable(UNIVERSITIES, INITIAL_APPLICATIONS);
      const pxuRow = result.find((r) => r.code === 'PXU');
      expect(pxuRow).toBeDefined();
      expect(pxuRow?.applicationCount).toBe(4);
      expect(pxuRow?.avgScore).toBe(24.7);
      expect(pxuRow?.qualifiedRate).toBe(100);
      expect(pxuRow?.topMajor).toBe('Công nghệ Thông tin');

      // Verify the IDs in raw demo dataset
      const pxuAppIds = INITIAL_APPLICATIONS.filter((a) => a.uniCode === 'PXU').map((a) => a.id);
      expect(pxuAppIds).toEqual(['app-1', 'app-6', 'app-7', 'app-8']);
    });

    it('handles empty applications with zero counts, empty flags, and null indicators', () => {
      const result = getUniversityBenchmarkTable(UNIVERSITIES, []);
      expect(result).toHaveLength(30);
      for (const row of result) {
        expect(row.applicationCount).toBe(0);
        expect(row.approvedCount).toBe(0);
        expect(row.approvalRate).toBe(0);
        expect(row.hasApplications).toBe(false);
        expect(row.avgScore).toBeNull();
        expect(row.qualifiedRate).toBeNull();
        expect(row.topMajor).toBeNull();
      }
    });
  });
});
