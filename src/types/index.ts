export interface University {
  id: number;
  name: string;
  code: string;
  loc: string;
  region: 'Bắc' | 'Trung' | 'Nam';
  tuitionMin: number; // Triệu VNĐ / năm
  tuitionMax: number; // Triệu VNĐ / năm
  majors: string[];
  cutoffScores: Record<string, number>;
  emoji?: string;
  rating: number;
  desc: string;
  employmentRate: number; // %
  score2022: number;
  score2023: number;
  score2024: number;
}

export type HollandCode = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

export interface QuizQuestion {
  question: string;
  category: HollandCode;
}

export interface PathInfo {
  hollandCode: HollandCode;
  title: string;
  subtitle: string;
  coreSkills: string[];
  grade10Milestones: string[];
  grade11Milestones: string[];
  grade12Milestones: string[];
  recommendedCerts: string[];
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  grade: string;
  school: string;
  province: string;
  targetMajor: string;
  dreamUni: string;
  expectedScore: number;
  isPremium: boolean;
  premiumPlan: string;
  avatarPath?: string;
}

export interface ConsultationBooking {
  id: string;
  name: string;
  phone: string;
  dateTime: string;
  uniCode: string;
  major: string;
  notes: string;
}

export type GroupType = 'SAFE' | 'MODERATE' | 'CHALLENGING';

export interface MatchResult {
  university: University;
  matchingPercent: number; // 0 - 100%
  group: GroupType;
  matchedMajor: string;
  majorCutoff: number;
  diffScore: number;
  isBudgetMatched: boolean;
  isHollandMatched: boolean;
}

export interface EvaluationGroup {
  safeList: MatchResult[];
  moderateList: MatchResult[];
  challengingList: MatchResult[];
  totalCount: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

