import type { EvaluationGroup, GroupType, MatchResult, University } from '../types';
import { getHollandMajors, getAverageCutoffScore } from '../data/MockData';

export const GROUP_META: Record<GroupType, { title: string; description: string; color: string; bgColor: string }> = {
  SAFE: {
    title: 'An toàn',
    description: 'Khả năng trúng tuyển cao (≥ 80%)',
    color: '#10B981',
    bgColor: '#ECFDF5',
  },
  MODERATE: {
    title: 'Vừa sức',
    description: 'Cơ hội cạnh tranh tốt (45% – 79%)',
    color: '#F59E0B',
    bgColor: '#FFFBEB',
  },
  CHALLENGING: {
    title: 'Thách thức',
    description: 'Thử thách cần bứt phá (< 45%)',
    color: '#EF4444',
    bgColor: '#FEF2F2',
  },
};

// Chọn ngành tham chiếu để tính % trúng tuyển: ưu tiên ngành khớp mã Holland của
// thí sinh; nếu không có, chọn ngành có điểm chuẩn gần điểm của thí sinh nhất.
export function pickReferenceCutoff(
  uni: University,
  userScore: number,
  hollandCode?: string
): { major: string; cutoff: number; isHolland: boolean } {
  const entries = Object.entries(uni.cutoffScores);
  if (entries.length === 0) {
    return { major: uni.majors[0] || 'Ngành đào tạo trọng điểm', cutoff: getAverageCutoffScore(uni), isHolland: false };
  }
  const hollandMajors = hollandCode ? getHollandMajors(hollandCode) : [];
  for (const [major, score] of entries) {
    for (const hm of hollandMajors) {
      if (major.toLowerCase().includes(hm.toLowerCase()) || hm.toLowerCase().includes(major.toLowerCase())) {
        return { major, cutoff: score, isHolland: true };
      }
    }
  }
  let bestMajor = entries[0][0];
  let bestCutoff = entries[0][1];
  let minDiff = Number.MAX_VALUE;
  for (const [major, score] of entries) {
    const diff = Math.abs(userScore - score);
    if (diff < minDiff) {
      minDiff = diff;
      bestMajor = major;
      bestCutoff = score;
    }
  }
  return { major: bestMajor, cutoff: bestCutoff, isHolland: false };
}

// Bảng bậc % trúng tuyển theo chênh lệch điểm — NGUỒN CÔNG THỨC DUY NHẤT của
// toàn hệ thống (AI Matching, chi tiết trường, thẻ trường đều dùng bảng này).
export function admissionPercent(diffScore: number): number {
  if (diffScore >= 2.0) return 95;
  if (diffScore >= 1.0) return 88;
  if (diffScore >= 0.0) return 75;
  if (diffScore >= -0.5) return 60;
  if (diffScore >= -1.0) return 50;
  if (diffScore >= -2.0) return 35;
  return 20;
}

export function evaluateMatching(
  userScore: number,
  maxBudget: number,
  hollandCode: string,
  regionFilter: string,
  universities: University[]
): EvaluationGroup {
  const result: EvaluationGroup = {
    safeList: [],
    moderateList: [],
    challengingList: [],
    totalCount: 0,
  };

  const list =
    !regionFilter || regionFilter.trim().toLowerCase() === 'tất cả'
      ? universities
      : universities.filter((u) => u.region.toLowerCase() === regionFilter.trim().toLowerCase());

  for (const u of list) {
    const pick = pickReferenceCutoff(u, userScore, hollandCode);
    const bestMajor = pick.major;
    const bestCutoff = pick.cutoff;
    const isHolland = pick.isHolland;

    const diffScore = Number((userScore - bestCutoff).toFixed(2));
    const isBudgetMatched = u.tuitionMin <= maxBudget;

    let percent = admissionPercent(diffScore);

    // Điểm thưởng Holland (+5%)
    if (isHolland) {
      percent = Math.min(100, percent + 5);
    }

    // Phạt học phí vượt ngân sách (-25%)
    if (!isBudgetMatched) {
      percent = Math.max(10, percent - 25);
    }

    let group: GroupType;
    if (percent >= 80) {
      group = 'SAFE';
    } else if (percent >= 45) {
      group = 'MODERATE';
    } else {
      group = 'CHALLENGING';
    }

    const matchItem: MatchResult = {
      university: u,
      matchingPercent: percent,
      group,
      matchedMajor: bestMajor,
      majorCutoff: bestCutoff,
      diffScore,
      isBudgetMatched,
      isHollandMatched: isHolland,
    };

    if (group === 'SAFE') {
      result.safeList.push(matchItem);
    } else if (group === 'MODERATE') {
      result.moderateList.push(matchItem);
    } else {
      result.challengingList.push(matchItem);
    }
  }

  // Sắp xếp giảm dần theo matchingPercent
  result.safeList.sort((a, b) => b.matchingPercent - a.matchingPercent);
  result.moderateList.sort((a, b) => b.matchingPercent - a.matchingPercent);
  result.challengingList.sort((a, b) => b.matchingPercent - a.matchingPercent);
  result.totalCount = result.safeList.length + result.moderateList.length + result.challengingList.length;

  return result;
}
