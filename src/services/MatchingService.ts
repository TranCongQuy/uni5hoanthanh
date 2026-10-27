import type { EvaluationGroup, GroupType, MatchResult } from '../types';
import { getUniversitiesByRegion, getHollandMajors, getAverageCutoffScore } from '../data/MockData';

export const GROUP_META: Record<GroupType, { title: string; description: string; color: string; bgColor: string }> = {
  SAFE: {
    title: 'An toàn',
    description: 'Khả năng trúng tuyển cao (>80%)',
    color: '#10B981',
    bgColor: '#ECFDF5',
  },
  MODERATE: {
    title: 'Vừa sức',
    description: 'Cơ hội cạnh tranh tốt (45% - 80%)',
    color: '#F59E0B',
    bgColor: '#FFFBEB',
  },
  CHALLENGING: {
    title: 'Thách thức',
    description: 'Thử thách cần bứt phá (<45%)',
    color: '#EF4444',
    bgColor: '#FEF2F2',
  },
};

export function evaluateMatching(
  userScore: number,
  maxBudget: number,
  hollandCode: string,
  regionFilter: string
): EvaluationGroup {
  const result: EvaluationGroup = {
    safeList: [],
    moderateList: [],
    challengingList: [],
    totalCount: 0,
  };

  const list = getUniversitiesByRegion(regionFilter);
  const hollandMajors = getHollandMajors(hollandCode);

  for (const u of list) {
    let bestMajor = '';
    let bestCutoff = getAverageCutoffScore(u);
    let isHolland = false;

    const cutoffScores = u.cutoffScores;
    const entries = Object.entries(cutoffScores);

    if (entries.length > 0) {
      // 1. Thử tìm ngành trùng với mã Holland
      for (const [major, score] of entries) {
        for (const hm of hollandMajors) {
          if (
            major.toLowerCase().includes(hm.toLowerCase()) ||
            hm.toLowerCase().includes(major.toLowerCase())
          ) {
            bestMajor = major;
            bestCutoff = score;
            isHolland = true;
            break;
          }
        }
        if (isHolland) break;
      }

      // 2. Nếu không có ngành Holland khớp, chọn ngành có điểm chuẩn gần với điểm của user nhất
      if (!isHolland) {
        let minDiff = Number.MAX_VALUE;
        for (const [major, score] of entries) {
          const diff = Math.abs(userScore - score);
          if (diff < minDiff) {
            minDiff = diff;
            bestMajor = major;
            bestCutoff = score;
          }
        }
      }
    } else {
      bestMajor = u.majors[0] || 'Ngành đào tạo trọng điểm';
    }

    const diffScore = Number((userScore - bestCutoff).toFixed(2));
    const isBudgetMatched = u.tuitionMin <= maxBudget;

    let percent: number;
    if (diffScore >= 2.0) {
      percent = 95;
    } else if (diffScore >= 1.0) {
      percent = 88;
    } else if (diffScore >= 0.0) {
      percent = 75;
    } else if (diffScore >= -0.5) {
      percent = 60;
    } else if (diffScore >= -1.0) {
      percent = 50;
    } else if (diffScore >= -2.0) {
      percent = 35;
    } else {
      percent = 20;
    }

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
