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
  // B2 3 mandatory indicators:
  avgScore: number | null; // e.g. 24.7 for PXU, null if 0 apps
  qualifiedRate: number | null; // % (0-100) meeting cutoff for target major, null if 0 apps
  topMajor: string | null; // Most applied major, null if 0 apps
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
 * 6 Standard intervals: < 20, 20 – 22, 22 – 24, 24 – 26, 26 – 28, ≥ 28.
 * Convention: lower bound included [min, max), upper bound excluded, except final bucket [28, +inf).
 */
export function getScoreHistogram(applications: ApplicationRecord[]): ScoreBucket[] {
  const buckets: { range: string; min: number; max: number }[] = [
    { range: '< 20đ', min: 0, max: 20 },
    { range: '20 – 22đ', min: 20, max: 22 },
    { range: '22 – 24đ', min: 22, max: 24 },
    { range: '24 – 26đ', min: 24, max: 26 },
    { range: '26 – 28đ', min: 26, max: 28 },
    { range: '≥ 28đ', min: 28, max: 30 },
  ];

  const total = applications.length;

  return buckets.map((b, idx) => {
    const isFirst = idx === 0;
    const isLast = idx === buckets.length - 1;

    const count = applications.filter((a) => {
      const s = typeof a.score === 'number' ? a.score : 0;
      if (isFirst) {
        return s < 20;
      }
      if (isLast) {
        return s >= 28;
      }
      return s >= b.min && s < b.max;
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
  // Group applications by university code
  const appMap = new Map<string, ApplicationRecord[]>();

  for (const app of applications) {
    const list = appMap.get(app.uniCode) || [];
    list.push(app);
    appMap.set(app.uniCode, list);
  }

  return universities.map((u) => {
    const cutoffs = Object.values(u.cutoffScores || {});
    const cutoffMin = cutoffs.length > 0 ? Math.min(...cutoffs) : u.score2024;
    const cutoffMax = cutoffs.length > 0 ? Math.max(...cutoffs) : u.score2024;

    const uniApps = appMap.get(u.code) || [];
    const total = uniApps.length;
    const approvedCount = uniApps.filter((a) => a.status === 'Đã trúng tuyển').length;
    const approvalRate = total > 0 ? Math.round((approvedCount / total) * 100) : 0;

    let avgScore: number | null = null;
    let qualifiedRate: number | null = null;
    let topMajor: string | null = null;

    if (total > 0) {
      // 1. Điểm TB thí sinh (1 chữ số thập phân, e.g. PXU = 24.7)
      const totalScore = uniApps.reduce((acc, a) => acc + (typeof a.score === 'number' ? a.score : 0), 0);
      avgScore = Math.round((totalScore / total) * 10) / 10;

      // 2. % đạt chuẩn ngành (điểm >= điểm chuẩn của CHÍNH ngành thí sinh đăng ký)
      let qualifiedCount = 0;
      for (const app of uniApps) {
        let majorCutoff = u.cutoffScores?.[app.major];
        if (typeof majorCutoff !== 'number') {
          const found = Object.entries(u.cutoffScores || {}).find(
            ([m]) => m.toLowerCase().trim() === (app.major || '').toLowerCase().trim()
          );
          majorCutoff = found ? found[1] : u.score2024;
        }
        if (typeof app.score === 'number' && app.score >= majorCutoff) {
          qualifiedCount += 1;
        }
      }
      qualifiedRate = Math.round((qualifiedCount / total) * 100);

      // 3. Ngành được nộp nhiều nhất vào trường
      const majorCounts = new Map<string, number>();
      for (const app of uniApps) {
        if (app.major) {
          majorCounts.set(app.major, (majorCounts.get(app.major) || 0) + 1);
        }
      }
      let maxCnt = 0;
      for (const [major, cnt] of majorCounts.entries()) {
        if (cnt > maxCnt) {
          maxCnt = cnt;
          topMajor = major;
        }
      }
    }

    return {
      id: u.id,
      code: u.code,
      name: u.name,
      region: u.region,
      cutoffMin,
      cutoffMax,
      tuitionMin: u.tuitionMin,
      tuitionMax: u.tuitionMax,
      applicationCount: total,
      approvedCount,
      approvalRate,
      hasApplications: total > 0,
      avgScore,
      qualifiedRate,
      topMajor,
    };
  });
}
