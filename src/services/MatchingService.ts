import type { EvaluationGroup, GroupType, MatchResult, University } from '../types';
import { getHollandMajors, getAverageCutoffScore, getMajorExamBlocks } from '../data/MockData';
import { roundScore2 } from '../utils/validation';

export const GROUP_META: Record<GroupType, { title: string; description: string; color: string; bgColor: string }> = {
  SAFE: {
    title: 'An toàn',
    description: 'Khả năng trúng tuyển cao (≥ 80%)',
    color: '#10B981',
    bgColor: '#ECFDF5',
  },
  MODERATE: {
    title: 'Vừa sức',
    description: 'Cơ hội cạnh tranh tốt (50% – 79%)',
    color: '#F59E0B',
    bgColor: '#FFFBEB',
  },
  CHALLENGING: {
    title: 'Thách thức',
    description: 'Cần bứt phá điểm số (< 50%)',
    color: '#EF4444',
    bgColor: '#FEF2F2',
  },
};

export function classifyMatchGroup(percent: number): GroupType {
  if (percent >= 80) return 'SAFE';
  if (percent >= 50) return 'MODERATE';
  return 'CHALLENGING';
}

/**
 * Picks the reference major for admission matching:
 * 1) Filters to majors compatible with `examBlock` if specified (and not 'Tất cả').
 * 2) Prioritizes a major matching the student's Holland primary code (picking the one closest to `userScore` if multiple).
 * 3) Otherwise picks the major whose cutoff is closest to `userScore`.
 */
export function pickReferenceCutoff(
  uni: University,
  userScore: number,
  hollandCode?: string,
  examBlock?: string
): { major: string; cutoff: number; isHolland: boolean; examBlocks: string[] } {
  const allEntries = Object.entries(uni.cutoffScores);
  if (allEntries.length === 0) {
    const fallbackMajor = uni.majors[0] || 'Ngành đào tạo trọng điểm';
    return {
      major: fallbackMajor,
      cutoff: getAverageCutoffScore(uni),
      isHolland: false,
      examBlocks: getMajorExamBlocks(fallbackMajor),
    };
  }

  const normalizedBlock = (examBlock || '').trim().toUpperCase();
  const blockFiltered =
    normalizedBlock && normalizedBlock !== 'TẤT CẢ'
      ? allEntries.filter(([major]) => getMajorExamBlocks(major).includes(normalizedBlock))
      : allEntries;

  const entries = blockFiltered.length > 0 ? blockFiltered : allEntries;
  const hollandMajors = hollandCode ? getHollandMajors(hollandCode) : [];

  const hollandMatches = entries.filter(([major]) =>
    hollandMajors.some(
      (hm) =>
        major.toLowerCase().includes(hm.toLowerCase()) ||
        hm.toLowerCase().includes(major.toLowerCase())
    )
  );

  const pool = hollandMatches.length > 0 ? hollandMatches : entries;
  let bestMajor = pool[0][0];
  let bestCutoff = roundScore2(pool[0][1]);
  let minDiff = Number.MAX_VALUE;

  for (const [major, score] of pool) {
    const cleanScore = roundScore2(score);
    const diff = Math.abs(userScore - cleanScore);
    if (diff < minDiff) {
      minDiff = diff;
      bestMajor = major;
      bestCutoff = cleanScore;
    }
  }

  return {
    major: bestMajor,
    cutoff: bestCutoff,
    isHolland: hollandMatches.length > 0,
    examBlocks: getMajorExamBlocks(bestMajor),
  };
}

/**
 * Smooth, strictly monotonic piecewise-linear probability curve.
 * Never jumps to 100% at +2.0 points (caps base at 94% and total with Holland bonus at 98%).
 */
export function admissionPercent(diffScore: number): number {
  if (!Number.isFinite(diffScore)) return 20;
  if (diffScore >= 4.0) return 94;
  if (diffScore >= 2.0) return 86 + Math.round(((diffScore - 2.0) / 2.0) * 8); // 86..94
  if (diffScore >= 1.0) return 80 + Math.round((diffScore - 1.0) * 6); // 80..86
  if (diffScore >= 0.0) return 68 + Math.round(diffScore * 12); // 68..80
  if (diffScore >= -1.0) return 50 + Math.round((diffScore + 1.0) * 18); // 50..68
  if (diffScore >= -2.5) return 28 + Math.round(((diffScore + 2.5) / 1.5) * 22); // 28..50
  return Math.max(12, Math.round(28 + (diffScore + 2.5) * 6)); // 12..28
}

/**
 * SINGLE UNIFIED FORMULA used identically across:
 * - AI Matching (Mobile & Desktop)
 * - Home / University Cards
 * - University Detail Modal
 */
export function calculateSingleMatch(
  uni: University,
  userScore: number,
  hollandCode?: string,
  examBlock?: string,
  maxBudget = 999
): MatchResult {
  const safeScore = Number.isFinite(userScore) ? roundScore2(userScore) : 24.5;
  const pick = pickReferenceCutoff(uni, safeScore, hollandCode, examBlock);
  const diffScore = roundScore2(safeScore - pick.cutoff);
  const basePercent = admissionPercent(diffScore);
  const hollandBonus = pick.isHolland ? 4 : 0;
  const matchingPercent = Math.min(98, basePercent + hollandBonus);
  const group = classifyMatchGroup(matchingPercent);

  return {
    university: uni,
    matchingPercent,
    basePercent,
    hollandBonus,
    group,
    matchedMajor: pick.major,
    majorCutoff: pick.cutoff,
    diffScore,
    isBudgetMatched: uni.tuitionMin <= maxBudget,
    isHollandMatched: pick.isHolland,
    matchedExamBlocks: pick.examBlocks,
  };
}

export function evaluateMatching(
  userScore: number,
  maxBudget: number,
  hollandCode: string,
  regionFilter: string,
  universities: University[],
  examBlock = 'Tất cả'
): EvaluationGroup {
  const result: EvaluationGroup = {
    safeList: [],
    moderateList: [],
    challengingList: [],
    totalCount: 0,
    totalScopedCount: 0,
    filteredOutByBudgetCount: 0,
    filteredOutByBlockCount: 0,
    examBlockUsed: examBlock,
  };

  // 1. Region filter
  const regionList =
    !regionFilter || regionFilter.trim().toLowerCase() === 'tất cả'
      ? universities
      : universities.filter((u) => u.region.toLowerCase() === regionFilter.trim().toLowerCase());
  result.totalScopedCount = regionList.length;

  // 2. Exam block filter ('A00' | 'A01' | 'D01' | 'B00' | 'C00')
  const normalizedBlock = (examBlock || '').trim().toUpperCase();
  const blockList =
    !normalizedBlock || normalizedBlock === 'TẤT CẢ'
      ? regionList
      : regionList.filter((u) =>
          u.majors.some((m) => getMajorExamBlocks(m).includes(normalizedBlock))
        );
  result.filteredOutByBlockCount = regionList.length - blockList.length;

  // 3. True Budget filter (excludes universities whose minimum tuition exceeds maxBudget)
  const budgetList = blockList.filter((u) => u.tuitionMin <= maxBudget);
  result.filteredOutByBudgetCount = blockList.length - budgetList.length;

  for (const u of budgetList) {
    const matchItem = calculateSingleMatch(u, userScore, hollandCode, examBlock, maxBudget);
    if (matchItem.group === 'SAFE') {
      result.safeList.push(matchItem);
    } else if (matchItem.group === 'MODERATE') {
      result.moderateList.push(matchItem);
    } else {
      result.challengingList.push(matchItem);
    }
  }

  const sortFn = (a: MatchResult, b: MatchResult) =>
    b.matchingPercent - a.matchingPercent || b.diffScore - a.diffScore;

  result.safeList.sort(sortFn);
  result.moderateList.sort(sortFn);
  result.challengingList.sort(sortFn);
  result.totalCount =
    result.safeList.length + result.moderateList.length + result.challengingList.length;

  return result;
}
