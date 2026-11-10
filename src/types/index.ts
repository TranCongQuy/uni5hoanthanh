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

export type ApplicationStatus =
  | 'Đang xét duyệt'
  | 'Hồ sơ hợp lệ'
  | 'Thiếu hồ sơ'
  | 'Đã trúng tuyển'
  | 'Đã hủy'
  | 'Đã bị hủy';

export interface ApplicationRecord {
  id: string;
  code: string;
  uniId: number;
  uniName: string;
  uniCode: string;
  major: string;
  candidateName: string;
  phone: string;
  email: string;
  score: number;
  submittedAt: string;
  status: ApplicationStatus;
  statusColor: string;
  notes?: string;
  cancelReason?: string;
}

export interface AIMatchState {
  hasEvaluated: boolean;
  score: number;
  budget: number;
  region: string;
  sortBy: 'score' | 'budget' | 'location';
  analyzedAt?: string;
}

export type UserRole = 'student' | 'admin' | 'university_pxu';

export interface CurrentUser {
  email: string;
  name: string;
  role: UserRole;
  organization?: string;
  avatar?: string;
  title?: string;
}

export const ACCOUNT_STUDENT: CurrentUser = {
  email: 'quy@unipath.vn',
  name: 'Trần Công Quý',
  role: 'student',
  title: 'Thí sinh 2k8 — THPT Chuyên Quốc Học Huế',
  organization: 'THPT Chuyên Quốc Học Huế',
  avatar: '/images/avatar_user.png',
};

export const ACCOUNT_ADMIN: CurrentUser = {
  email: 'admin@unipath.vn',
  name: 'Admin Hệ Thống UniPath',
  role: 'admin',
  title: 'Quản trị viên Cấp cao UniPath 2.0',
  organization: 'Hệ Thống Tuyển Sinh Quốc Gia UniPath',
  avatar: '/images/advisor_avatar.png',
};

export const ACCOUNT_PXU: CurrentUser = {
  email: 'tuyensinh@pxu.edu.vn',
  name: 'Ban Tuyển sinh ĐH Phú Xuân',
  role: 'university_pxu',
  title: 'Đại diện Tuyển sinh — ĐH Phú Xuân (PXU)',
  organization: 'Trường Đại học Phú Xuân (PXU)',
  avatar: '/images/logo_pxu.png',
};

export type ViewMode = 'mobile' | 'desktop';


