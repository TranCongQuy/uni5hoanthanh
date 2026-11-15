import { isCancelledStatus } from '../types';
import type { ApplicationRecord, University } from '../types';

/**
 * ADMIN ANALYTICS SELECTORS (PURE FUNCTIONS)
 * Strictly immutable, zero side-effects, fully testable.
 */

export interface RegionDistribution {
  region: 'Bắc' | 'Trung' | 'Nam';
  count: number;
  percentage: number;
}

export interface FunnelStage {
  stage: string;
  status: string;
  count: number;
  dropRate: number; // % drop from previous stage
}

export interface ScoreBucket {
  range: string;
  min: number;
  max: number;
  count: number;
  percentage: number;
}

export interface DailyPoint {
  date: string; // YYYY-MM-DD
  label: string; // DD/MM
  count: number;
}

export interface UniversityBenchmarkRow {
  id: number;
  code: string;
  name: string;
  region: 'Bắc' | 'Trung' | 'Nam';
  cutoffMin: number;
  cutoffMax: number;
  tuitionMin: number;
  tuitionMax: number;
  applicationCount: number;
  approvedCount: number;
  approvalRate: number; // %
  hasApplications: boolean;
}

/**
 * 1. Region Distribution
 * Groups applications by the target university's geographic region (Bắc / Trung / Nam).
 */
export function getApplicationsByRegion(
  applications: ApplicationRecord[],
  universities: University[]
): RegionDistribution[] {
  const uniRegionMap = new Map<string, 'Bắc' | 'Trung' | 'Nam'>();
  for (const u of universities) {
    uniRegionMap.set(u.code, u.region);
  }

  const counts: Record<'Bắc' | 'Trung' | 'Nam', number> = {
    Bắc: 0,
    Trung: 0,
    Nam: 0,
  };

  for (const app of applications) {
    const reg = uniRegionMap.get(app.uniCode) || 'Trung';
    counts[reg] = (counts[reg] || 0) + 1;
  }

  const total = applications.length;

  return [
    {
      region: 'Bắc',
      count: counts.Bắc,
      percentage: total > 0 ? Math.round((counts.Bắc / total) * 100) : 0,
    },
    {
      region: 'Trung',
      count: counts.Trung,
      percentage: total > 0 ? Math.round((counts.Trung / total) * 100) : 0,
    },
    {
      region: 'Nam',
      count: counts.Nam,
      percentage: total > 0 ? Math.round((counts.Nam / total) * 100) : 0,
    },
  ];
}

/**
 * 2. 5-Stage Admission Funnel
 * 100% reconciled across: Đang xét duyệt -> Hồ sơ hợp lệ -> Đã trúng tuyển -> Thiếu hồ sơ -> Rút/Hủy
 */
export function getAdmissionFunnel(applications: ApplicationRecord[]): FunnelStage[] {
  const total = applications.length;

  const countPending = applications.filter((a) => a.status === 'Đang xét duyệt').length;
  const countValid = applications.filter((a) => a.status === 'Hồ sơ hợp lệ').length;
  const countAdmitted = applications.filter((a) => a.status === 'Đã trúng tuyển').length;
  const countMissing = applications.filter((a) => a.status === 'Thiếu hồ sơ').length;
  const countCancelled = applications.filter((a) => isCancelledStatus(a.status)).length;

  const stages: FunnelStage[] = [
    {
      stage: 'Nộp mới / Đang xét',
      status: 'Đang xét duyệt',
      count: countPending,
      dropRate: 0,
    },
    {
      stage: 'Hồ sơ Hợp lệ',
      status: 'Hồ sơ hợp lệ',
      count: countValid,
      dropRate: total > 0 ? Math.round(((total - countValid) / total) * 100) : 0,
    },
    {
      stage: 'Trúng tuyển Sớm',
      status: 'Đã trúng tuyển',
      count: countAdmitted,
      dropRate: countValid > 0 ? Math.round(((countValid - countAdmitted) / countValid) * 100) : 0,
    },
    {
      stage: 'Chờ Bổ sung',
      status: 'Thiếu hồ sơ',
      count: countMissing,
      dropRate: 0,
    },
    {
      stage: 'Rút / Đã hủy',
      status: 'Rút hồ sơ / Từ chối',
      count: countCancelled,
      dropRate: 0,
    },
  ];

  return stages;
}

/**
 * 3. Candidate Score Histogram
 * Buckets candidate expected/submitted scores into standard Vietnamese university entrance ranges.
 */
export function getScoreHistogram(applications: ApplicationRecord[]): ScoreBucket[] {
  const buckets: { range: string; min: number; max: number }[] = [
    { range: '< 18đ', min: 0, max: 17.99 },
    { range: '18 – 21đ', min: 18, max: 20.99 },
    { range: '21 – 24đ', min: 21, max: 23.99 },
    { range: '24 – 27đ', min: 24, max: 26.99 },
    { range: '≥ 27đ', min: 27, max: 30 },
  ];

  const total = applications.length;

  return buckets.map((b) => {
    const count = applications.filter((a) => {
      const s = typeof a.score === 'number' ? a.score : 0;
      return s >= b.min && s <= b.max;
    }).length;

    return {
      range: b.range,
      min: b.min,
      max: b.max,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    };
  });
}

/**
 * 4. Daily Submission Timeline (Last 14 days or dynamic range)
 */
export function getDailySubmissionTimeline(
  applications: ApplicationRecord[],
  maxDays = 14
): DailyPoint[] {
  const dayMap = new Map<string, number>();

  for (const app of applications) {
    let dateStr = '';
    if (app.submittedAtISO && app.submittedAtISO.length >= 10) {
      dateStr = app.submittedAtISO.slice(0, 10);
    } else if (app.submittedAt) {
      const datePart = app.submittedAt.split(' ')[0] || '';
      if (datePart.includes('/')) {
        const parts = datePart.split('/');
        if (parts.length === 3) {
          dateStr = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
      } else if (datePart.includes('-')) {
        dateStr = datePart;
      }
    }

    if (dateStr) {
      dayMap.set(dateStr, (dayMap.get(dateStr) || 0) + 1);
    }
  }

  // Generate sorted array
  const sortedKeys = Array.from(dayMap.keys()).sort();
  const recentKeys = sortedKeys.slice(-maxDays);

  if (recentKeys.length === 0) {
    return [];
  }

  return recentKeys.map((k) => {
    const parts = k.split('-');
    const label = parts.length === 3 ? `${parts[2]}/${parts[1]}` : k;
    return {
      date: k,
      label,
      count: dayMap.get(k) || 0,
    };
  });
}

/**
 * 5. University Benchmark Table (30 Universities)
 */
export function getUniversityBenchmarkTable(
  universities: University[],
  applications: ApplicationRecord[]
): UniversityBenchmarkRow[] {
  // Count apps per university code
  const appMap = new Map<string, { total: number; approved: number }>();

  for (const app of applications) {
    const entry = appMap.get(app.uniCode) || { total: 0, approved: 0 };
    entry.total += 1;
    if (app.status === 'Đã trúng tuyển') {
      entry.approved += 1;
    }
    appMap.set(app.uniCode, entry);
  }

  return universities.map((u) => {
    const cutoffs = Object.values(u.cutoffScores || {});
    const cutoffMin = cutoffs.length > 0 ? Math.min(...cutoffs) : u.score2024;
    const cutoffMax = cutoffs.length > 0 ? Math.max(...cutoffs) : u.score2024;

    const stats = appMap.get(u.code) || { total: 0, approved: 0 };
    const approvalRate = stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0;

    return {
      id: u.id,
      code: u.code,
      name: u.name,
      region: u.region,
      cutoffMin,
      cutoffMax,
      tuitionMin: u.tuitionMin,
      tuitionMax: u.tuitionMax,
      applicationCount: stats.total,
      approvedCount: stats.approved,
      approvalRate,
      hasApplications: stats.total > 0,
    };
  });
}
