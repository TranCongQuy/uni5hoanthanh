import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type {
  AIMatchState,
  ApplicationRecord,
  ApplicationStatus,
  ConsultationBooking,
  CurrentUser,
  HollandCode,
  NotificationItem,
  University,
  UserProfile,
  UserRole,
  ViewMode,
} from '../types';
import { ACCOUNT_STUDENT, ACCOUNT_ADMIN, ACCOUNT_PXU, getStatusMeta } from '../types';
import { UNIVERSITIES } from '../data/MockData';
import {
  formatNowViDateTime,
  getLocalOffsetDateISO,
  getLocalTodayISO,
  isPastDateISO,
  parseViDateTimeToMs,
  roundScore2,
  validateCutoffScore,
  validateEmail,
  validateStudentScore,
  validateTuitionMin,
  validateVietnamPhone,
} from '../utils/validation';
import {
  hashPassword,
  migrateStoredAccounts,
  nextUniqueId,
  SYSTEM_RESERVED_EMAILS,
  verifySystemAccountPassword,
  type StoredUserAccount,
} from '../utils/security';
import {
  canStudentCancelApplication,
  computeHollandAssessment,
  getMajorCutoffForApp,
  validateNewApplicationSubmission,
  validateReviewerStatusChange,
} from '../services/ApplicationWorkflow';
import { syncApplicationToCloud, syncBookingToCloud } from '../lib/supabase';

export interface HollandResult {
  primaryCode: HollandCode;
  topCodes: HollandCode[];
  tiedTopCodes?: HollandCode[];
  scores: Record<HollandCode, number>;
  completedAt: string;
}

export type BookingState = 'pending' | 'contacted' | 'done';

export interface ProcessingLogEntry {
  id: string;
  appCode: string;
  candidateName: string;
  uniCode: string;
  fromStatus: string;
  toStatus: string;
  actorName: string;
  actorRole: UserRole;
  time: string;
  note?: string;
}

export interface RegisteredUserSummary {
  name: string;
  email: string;
  createdAt?: string;
}

interface PerUserPersonalStore {
  profile: UserProfile;
  favoriteIds: number[];
  compareIds: number[];
  hollandResult: HollandResult | null;
  aiMatchState: AIMatchState;
}

interface StoredSession {
  isLoggedIn: boolean;
  isGuest: boolean;
  user: CurrentUser;
}

interface AppContextType {
  // Auth, RBAC & Demo Sandbox Guard
  isLoggedIn: boolean;
  isGuest: boolean;
  user: CurrentUser;
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  demoQuickSwitch: (target: 'student' | 'admin' | 'pxu') => void;
  authPrefillEmail: string;
  registeredUsers: RegisteredUserSummary[];
  login: (email: string, pass: string) => boolean;
  loginAsGuest: () => void;
  register: (fullName: string, email: string, pass: string) => { ok: boolean; error?: string };
  logout: () => void;

  // Profile & Consultation Bookings
  profile: UserProfile;
  updateProfile: (updated: Partial<UserProfile>) => boolean;
  bookings: ConsultationBooking[];
  myBookings: ConsultationBooking[];
  addBooking: (booking: Omit<ConsultationBooking, 'id'>) => boolean;
  bookingStates: Record<string, BookingState>;
  updateBookingState: (bookingId: string, state: BookingState, note?: string) => void;
  upgradePremium: (planName: string) => void;

  // Wishlist
  favoriteIds: number[];
  toggleFavorite: (id: number) => boolean;
  isFavorite: (id: number) => boolean;

  // Compare
  compareIds: number[];
  toggleCompare: (id: number) => 1 | 0 | -1;
  isCompared: (id: number) => boolean;
  removeCompare: (id: number) => void;
  clearCompare: () => void;

  // Holland Quiz Result
  hollandResult: HollandResult | null;
  saveHollandResult: (scores: Record<HollandCode, number>) => HollandResult;
  clearHollandResult: () => void;

  // Settings & Dynamic Notifications
  reduceMotion: boolean;
  notifications: boolean;
  toggleReduceMotion: () => void;
  toggleNotifications: () => void;
  resetPersonalData: () => void;
  resetAllData: () => void;
  visibleNotifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Navigation & Modals
  activeTab: number;
  setActiveTab: (tab: number) => void;
  selectedUniIdForDetail: number | null;
  openUniDetail: (id: number) => void;
  closeUniDetail: () => void;
  isCompareModalOpen: boolean;
  openCompareModal: () => void;
  closeCompareModal: () => void;
  isChatBotOpen: boolean;
  openChatBot: () => void;
  closeChatBot: () => void;
  aiQueryCount: number;
  incrementAiQueryCount: () => void;
  isCareerPathOpen: boolean;
  selectedCareerCode: HollandCode | null;
  openCareerPath: (code?: HollandCode) => void;
  closeCareerPath: () => void;
  isEditProfileOpen: boolean;
  openEditProfile: () => void;
  closeEditProfile: () => void;
  isSettingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  isNotificationsOpen: boolean;
  openNotifications: () => void;
  closeNotifications: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: (prefillEmail?: string | React.SyntheticEvent) => void;
  closeAuthModal: () => void;
  isBookConsultationOpen: boolean;
  consultationTargetUni: University | null;
  openBookConsultation: (uni?: University) => void;
  closeBookConsultation: () => void;
  isApplyDemoOpen: boolean;
  applyDemoTargetUni: University | null;
  openApplyDemo: (uni: University) => void;
  closeApplyDemo: () => void;

  // Applications
  applications: ApplicationRecord[];
  myApplications: ApplicationRecord[];
  addApplication: (
    app: Omit<ApplicationRecord, 'id' | 'submittedAt' | 'status' | 'statusColor' | 'code'>
  ) => ApplicationRecord | null;
  cancelApplication: (appId: string, reason?: string) => boolean;
  resubmitApplicationSupplement: (appId: string, supplementNote: string) => boolean;
  updateApplicationStatus: (id: string, status: ApplicationStatus, notes?: string) => boolean;
  batchUpdateApplicationStatus: (ids: string[], status: ApplicationStatus, notes?: string) => boolean;
  processingLog: ProcessingLogEntry[];
  selectedAppForDetail: ApplicationRecord | null;
  openApplicationDetail: (app: ApplicationRecord) => void;
  closeApplicationDetail: () => void;
  isAllApplicationsOpen: boolean;
  openAllApplications: () => void;
  closeAllApplications: () => void;

  // Universities database management
  universitiesList: University[];
  updateUniversityMetrics: (
    id: number,
    score2024: number | string,
    tuitionMin: number | string
  ) => boolean;

  // Toast & Search
  toastMessage: string | null;
  showToast: (msg: string) => void;
  searchKeyword: string;
  setSearchKeyword: (kw: string) => void;

  // AI Match persistence
  aiMatchState: AIMatchState;
  saveAIMatchState: (state: Partial<AIMatchState>) => void;

  // Automatic View mode (Mobile < 1024px vs Desktop >= 1024px)
  viewMode: ViewMode;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEMO_EMAIL = 'quy@unipath.vn';
const DEMO_NAME = 'Trần Công Quý';

const STORAGE_KEYS = {
  SESSION: 'unipath_v2_auth_session',
  DEMO_MODE: 'unipath_v2_demo_mode',
  REGISTERED_USERS: 'unipath_registered_users',
  SHARED_APPS: 'unipath_v2_shared_applications',
  APP_SEQ: 'unipath_v2_app_seq',
  SHARED_BOOKINGS: 'unipath_v2_shared_bookings',
  SHARED_BOOKING_STATES: 'unipath_v2_shared_booking_states',
  SHARED_UNIS: 'unipath_v2_shared_universities',
  SHARED_LOGS: 'unipath_v2_shared_processing_log',
  SHARED_NOTIFICATIONS: 'unipath_v2_shared_notifications',
  AI_QUERY_COUNT: 'unipath_v2_ai_query_count',
  REDUCE_MOTION: 'unipath_reduce_motion',
  NOTIFICATIONS_ENABLED: 'unipath_notifications',
  USER_PREFIX: 'unipath_v2_user_',
};

const GUEST_USER: CurrentUser = {
  email: 'guest@unipath.vn',
  name: 'Khách trải nghiệm',
  role: 'student',
  title: 'Khách vãng lai (Chưa đăng nhập)',
  organization: 'Trải nghiệm tự do',
  avatar: '/images/avatar_user.png',
};

const DEFAULT_AI_MATCH: AIMatchState = {
  hasEvaluated: false,
  score: 24.0,
  budget: 25,
  region: 'Tất cả',
  examBlock: 'Tất cả',
  sortBy: 'score',
};

const DEMO_STUDENT_PROFILE: UserProfile = {
  name: DEMO_NAME,
  email: DEMO_EMAIL,
  phone: '0912 345 678',
  dob: '15/08/2008',
  gender: 'Nam',
  grade: 'Lớp 12',
  school: 'THPT Chuyên Quốc Học Huế',
  province: 'Thừa Thiên Huế',
  targetMajor: 'Công nghệ Thông tin',
  dreamUni: 'PXU - Đại học Phú Xuân',
  expectedScore: 24.5,
  isPremium: false,
  premiumPlan: 'Gói Tiêu Chuẩn',
  avatarPath: '/images/avatar_user.png',
};

const createCleanStudentProfile = (name: string, email: string): UserProfile => ({
  name,
  email,
  phone: '',
  dob: '01/01/2008',
  gender: 'Nam',
  grade: 'Lớp 12',
  school: 'Trường THPT',
  province: 'Thừa Thiên Huế',
  targetMajor: 'Công nghệ Thông tin',
  dreamUni: 'PXU - Đại học Phú Xuân',
  expectedScore: 24.0,
  isPremium: false,
  premiumPlan: 'Gói Tiêu Chuẩn',
  avatarPath: '/images/avatar_user.png',
});

const GUEST_PROFILE: UserProfile = {
  ...createCleanStudentProfile('Khách trải nghiệm', 'guest@unipath.vn'),
  school: 'Khách khám phá hệ thống',
};

const INITIAL_APPLICATIONS: ApplicationRecord[] = [
  {
    id: 'app-1',
    code: 'HS-2026-PXU01',
    uniId: 11,
    uniName: 'Đại học Phú Xuân',
    uniCode: 'PXU',
    major: 'Công nghệ Thông tin',
    candidateName: 'Trần Công Quý',
    phone: '0912 345 678',
    email: 'quy@unipath.vn',
    score: 24.5,
    submittedAt: '24/10/2026 09:30',
    submittedAtISO: '2026-10-24T09:30:00+07:00',
    status: 'Đang xét duyệt',
    statusColor: getStatusMeta('Đang xét duyệt').dot,
    notes:
      'Đăng ký xét tuyển sớm đợt 1 bằng kết quả học bạ THPT và chứng chỉ tin học quốc tế. Đăng ký xét học bổng OJT doanh nghiệp.',
  },
  {
    id: 'app-2',
    code: 'HS-2026-BKA02',
    uniId: 1,
    uniName: 'Đại học Bách Khoa Hà Nội',
    uniCode: 'BKA',
    major: 'Khoa học Máy tính',
    candidateName: 'Trần Công Quý',
    phone: '0912 345 678',
    email: 'quy@unipath.vn',
    score: 28.5,
    submittedAt: '22/10/2026 15:45',
    submittedAtISO: '2026-10-22T15:45:00+07:00',
    status: 'Hồ sơ hợp lệ',
    statusColor: getStatusMeta('Hồ sơ hợp lệ').dot,
    notes: 'Đã hoàn tất đối chiếu CCCD, Học bạ 5 học kỳ và Phiếu điểm kỳ thi Đánh giá tư duy.',
  },
  {
    id: 'app-3',
    code: 'HS-2026-FTU03',
    uniId: 2,
    uniName: 'Đại học Ngoại Thương (Cơ sở Hà Nội)',
    uniCode: 'FTU',
    major: 'Kinh tế Quốc tế',
    candidateName: 'Trần Công Quý',
    phone: '0912 345 678',
    email: 'quy@unipath.vn',
    score: 28.2,
    submittedAt: '20/10/2026 11:15',
    submittedAtISO: '2026-10-20T11:15:00+07:00',
    status: 'Thiếu hồ sơ',
    statusColor: getStatusMeta('Thiếu hồ sơ').dot,
    notes:
      'Cần bổ sung bản scan học bạ học kỳ 1 lớp 12 có dấu mộc đỏ và chứng chỉ ngoại ngữ quốc tế trước ngày 25/11.',
  },
  {
    id: 'app-4',
    code: 'HS-2026-NEU04',
    uniId: 3,
    uniName: 'Đại học Kinh Tế Quốc Dân',
    uniCode: 'NEU',
    major: 'Marketing',
    candidateName: 'Trần Công Quý',
    phone: '0912 345 678',
    email: 'quy@unipath.vn',
    score: 27.5,
    submittedAt: '18/10/2026 14:20',
    submittedAtISO: '2026-10-18T14:20:00+07:00',
    status: 'Đã hủy',
    statusColor: getStatusMeta('Đã hủy').dot,
    notes: 'Thí sinh chủ động rút hồ sơ xét tuyển để điều chỉnh thứ tự nguyện vọng ưu tiên.',
    cancelReason: 'Thí sinh chủ động rút hồ sơ',
  },
  {
    id: 'app-5',
    code: 'HS-2026-HMU05',
    uniId: 5,
    uniName: 'Đại học Y Hà Nội',
    uniCode: 'HMU',
    major: 'Kỹ thuật Xét nghiệm Y học',
    candidateName: 'Trần Công Quý',
    phone: '0912 345 678',
    email: 'quy@unipath.vn',
    score: 22.0,
    submittedAt: '15/10/2026 10:00',
    submittedAtISO: '2026-10-15T10:00:00+07:00',
    status: 'Đã bị hủy',
    statusColor: getStatusMeta('Đã bị hủy').dot,
    notes:
      'Hội đồng tuyển sinh từ chối hồ sơ do tổng điểm tổ hợp chưa đạt ngưỡng đảm bảo chất lượng đầu vào khối sức khỏe.',
    cancelReason: 'Không đạt ngưỡng điểm sàn nhận hồ sơ khối ngành Sức khỏe',
  },
  {
    id: 'app-6',
    code: 'HS-2026-PXU06',
    uniId: 11,
    uniName: 'Đại học Phú Xuân',
    uniCode: 'PXU',
    major: 'Quản trị Kinh doanh',
    candidateName: 'Nguyễn Văn An',
    phone: '0988 776 655',
    email: 'an.nguyen@thpt.edu.vn',
    score: 23.5,
    submittedAt: '02/11/2026 14:10',
    submittedAtISO: '2026-11-02T14:10:00+07:00',
    status: 'Đang xét duyệt',
    statusColor: getStatusMeta('Đang xét duyệt').dot,
    notes: 'Đăng ký xét tuyển học bạ THPT 3 học kỳ (ĐTB 8.2) kèm nguyện vọng học bổng OJT doanh nghiệp.',
  },
  {
    id: 'app-7',
    code: 'HS-2026-PXU07',
    uniId: 11,
    uniName: 'Đại học Phú Xuân',
    uniCode: 'PXU',
    major: 'Thiết kế Đồ họa',
    candidateName: 'Lê Thị Thảo Vy',
    phone: '0935 123 789',
    email: 'thaovy.le@gmail.com',
    score: 25.0,
    submittedAt: '04/11/2026 16:30',
    submittedAtISO: '2026-11-04T16:30:00+07:00',
    status: 'Thiếu hồ sơ',
    statusColor: getStatusMeta('Thiếu hồ sơ').dot,
    notes:
      'Cần nộp bổ sung bản sao công chứng CCCD và Portfolio sản phẩm sáng tạo cá nhân trước ngày 25/11.',
  },
  {
    id: 'app-8',
    code: 'HS-2026-PXU08',
    uniId: 11,
    uniName: 'Đại học Phú Xuân',
    uniCode: 'PXU',
    major: 'Ngôn ngữ Anh',
    candidateName: 'Trần Minh Khôi',
    phone: '0905 678 234',
    email: 'minhkhoi.tran@thpt.edu.vn',
    score: 25.8,
    submittedAt: '01/11/2026 08:45',
    submittedAtISO: '2026-11-01T08:45:00+07:00',
    status: 'Đã trúng tuyển',
    statusColor: getStatusMeta('Đã trúng tuyển').dot,
    notes: 'Đủ điều kiện trúng tuyển sớm đợt 1 và đạt học bổng Tài năng Trẻ PXU 30% học phí toàn khóa.',
  },
];

function buildInitialBookings(): ConsultationBooking[] {
  const d1 = getLocalOffsetDateISO(2);
  const d2 = getLocalOffsetDateISO(3);
  const d3 = getLocalOffsetDateISO(4);
  const toVi = (iso: string) => iso.split('-').reverse().join('/');
  return [
    {
      id: 'bk-1',
      name: DEMO_NAME,
      email: DEMO_EMAIL,
      phone: '0912 345 678',
      scheduledDateISO: d1,
      timeSlot: '14:30 - 15:00',
      dateTime: `14:30 - 15:00 · ${toVi(d1)}`,
      channel: 'Google Meet 1-1',
      uniId: 11,
      uniName: 'Đại học Phú Xuân',
      uniCode: 'PXU',
      major: 'Công nghệ Thông tin',
      notes: 'Muốn tìm hiểu kỹ hơn về lộ trình thực tập OJT từ năm nhất và học bổng doanh nghiệp tại Huế.',
    },
    {
      id: 'bk-2',
      name: 'Nguyễn Văn An',
      email: 'an.nguyen@thpt.edu.vn',
      phone: '0988 776 655',
      scheduledDateISO: d2,
      timeSlot: '09:00 - 09:30',
      dateTime: `09:00 - 09:30 · ${toVi(d2)}`,
      channel: 'Gọi điện / Zalo',
      uniId: 11,
      uniName: 'Đại học Phú Xuân',
      uniCode: 'PXU',
      major: 'Quản trị Kinh doanh',
      notes: 'Cần tư vấn phương thức xét tuyển học bạ 3 học kỳ và thông tin ký túc xá sinh viên.',
    },
    {
      id: 'bk-3',
      name: 'Lê Hoàng Nam',
      email: 'hoangnam@thpt.edu.vn',
      phone: '0905 246 810',
      scheduledDateISO: d3,
      timeSlot: '16:00 - 16:30',
      dateTime: `16:00 - 16:30 · ${toVi(d3)}`,
      channel: 'Google Meet 1-1',
      uniId: 12,
      uniName: 'Đại học Bách Khoa - ĐH Đà Nẵng',
      uniCode: 'DUT',
      major: 'Kỹ thuật Ô tô',
      notes: 'Hỏi về chỉ tiêu xét điểm thi ĐGNL và chương trình kỹ sư chất lượng cao.',
    },
  ];
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-init-1',
    title: 'Khai mạc Virtual EduFair 2026',
    body: 'Ngày hội tuyển sinh số quy tụ 30 trường Đại học Bắc – Trung – Nam chính thức mở cổng tư vấn trực tuyến.',
    time: '15 phút trước',
    read: false,
    type: 'promo',
    targetRole: 'student',
    targetTab: 3,
  },
  {
    id: 'notif-init-2',
    title: 'Học bổng OJT Đại học Phú Xuân (PXU)',
    body: 'Công bố quỹ học bổng doanh nghiệp 30% – 100% học phí cho thí sinh xét tuyển sớm khối Công nghệ, Kinh doanh & Thiết kế.',
    time: '1 giờ trước',
    read: false,
    type: 'deadline',
    targetRole: 'student',
  },
  {
    id: 'notif-init-3',
    title: 'Nhắc bổ sung minh chứng hồ sơ HS-2026-FTU03',
    body: 'Hồ sơ Kinh tế Quốc tế (FTU) của bạn đang chờ bổ sung bản scan học bạ HK1 lớp 12 trước ngày 25/11.',
    time: '3 giờ trước',
    read: false,
    type: 'application',
    targetRole: 'student',
    targetEmail: DEMO_EMAIL,
    targetTab: 4,
  },
  {
    id: 'notif-init-pxu',
    title: 'Có 2 hồ sơ xét tuyển sớm mới gửi về ĐH Phú Xuân',
    body: 'Thí sinh Trần Công Quý (CNTT) và Nguyễn Văn An (QTKD) đang chờ Ban Tuyển sinh PXU thẩm định.',
    time: 'Hôm nay',
    read: false,
    type: 'application',
    targetRole: 'university_pxu',
  },
  {
    id: 'notif-init-admin',
    title: 'Hệ thống UniPath 2.0 vận hành ổn định',
    body: 'Đồng bộ thành công dữ liệu 30 trường đại học và phễu xét tuyển sớm đợt 1 năm 2026.',
    time: 'Hôm nay',
    read: false,
    type: 'system',
    targetRole: 'admin',
  },
];

function readJsonStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJsonStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage quota errors
  }
}

function sanitizeLoadedUniversities(list: University[]): University[] {
  if (!Array.isArray(list) || list.length === 0) return UNIVERSITIES;
  return list.map((u) => {
    const cleanedCutoffs: Record<string, number> = {};
    for (const [m, c] of Object.entries(u.cutoffScores || {})) {
      cleanedCutoffs[m] = Math.min(30, Math.max(12, roundScore2(Number(c) || 24)));
    }
    let cleanScore2024 = Math.min(30, Math.max(12, roundScore2(Number(u.score2024) || 24)));
    // Normalize legacy PXU 25.2 reference score if all majors are <= 24.5
    if (u.code === 'PXU' && cleanScore2024 === 25.2) {
      const maxMajor = Math.max(...Object.values(cleanedCutoffs), 24.5);
      if (maxMajor <= 24.5) {
        cleanScore2024 = 24.5;
      }
    }
    const cleanMin = Math.min(200, Math.max(0, roundScore2(Number(u.tuitionMin) || 0)));
    const cleanMax = Math.max(cleanMin, roundScore2(Number(u.tuitionMax) || cleanMin));
    return {
      ...u,
      score2024: cleanScore2024,
      tuitionMin: cleanMin,
      tuitionMax: cleanMax,
      cutoffScores: cleanedCutoffs,
    };
  });
}

function sanitizeLoadedApplications(list: ApplicationRecord[]): ApplicationRecord[] {
  if (!Array.isArray(list) || list.length === 0) return INITIAL_APPLICATIONS;
  return list.map((app) => {
    if (app.submittedAtISO) return app;
    const ms = parseViDateTimeToMs(app.submittedAt);
    return {
      ...app,
      score: roundScore2(Number(app.score) || 24.0),
      submittedAtISO: ms > 0 ? new Date(ms).toISOString() : '2026-10-20T09:00:00+07:00',
    };
  });
}

function getDefaultPersonalStore(email: string, name: string): PerUserPersonalStore {
  const clean = email.trim().toLowerCase();
  if (clean === DEMO_EMAIL) {
    return {
      profile: { ...DEMO_STUDENT_PROFILE },
      favoriteIds: [11, 1, 21],
      compareIds: [11, 12],
      hollandResult: null,
      aiMatchState: { ...DEFAULT_AI_MATCH, score: 24.5 },
    };
  }
  return {
    profile: createCleanStudentProfile(name, clean),
    favoriteIds: [],
    compareIds: [],
    hollandResult: null,
    aiMatchState: { ...DEFAULT_AI_MATCH },
  };
}

function loadPersonalStore(email: string, name: string): PerUserPersonalStore {
  const clean = email.trim().toLowerCase();
  const fallback = getDefaultPersonalStore(clean, name);
  const loaded = readJsonStorage<PerUserPersonalStore>(`${STORAGE_KEYS.USER_PREFIX}${clean}`, fallback);
  return {
    profile: {
      ...fallback.profile,
      ...loaded.profile,
      email: clean,
      expectedScore:
        typeof loaded.profile?.expectedScore === 'number' &&
        Number.isFinite(loaded.profile.expectedScore) &&
        loaded.profile.expectedScore >= 10 &&
        loaded.profile.expectedScore <= 30
          ? roundScore2(loaded.profile.expectedScore)
          : fallback.profile.expectedScore,
    },
    favoriteIds: Array.isArray(loaded.favoriteIds) ? loaded.favoriteIds : fallback.favoriteIds,
    compareIds: Array.isArray(loaded.compareIds) ? loaded.compareIds.slice(0, 3) : fallback.compareIds,
    hollandResult: loaded.hollandResult || null,
    aiMatchState: { ...DEFAULT_AI_MATCH, ...(loaded.aiMatchState || {}) },
  };
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- Initial Session Recovery ---
  const initialSession = useMemo<StoredSession>(() => {
    const saved = readJsonStorage<StoredSession | null>(STORAGE_KEYS.SESSION, null);
    if (saved && saved.isLoggedIn && saved.user) {
      return saved;
    }
    return {
      isLoggedIn: false,
      isGuest: false,
      user: GUEST_USER,
    };
  }, []);

  const initialPersonal = useMemo<PerUserPersonalStore>(() => {
    if (
      initialSession.isLoggedIn &&
      !initialSession.isGuest &&
      initialSession.user.role === 'student'
    ) {
      return loadPersonalStore(initialSession.user.email, initialSession.user.name);
    }
    return {
      profile: { ...GUEST_PROFILE },
      favoriteIds: [],
      compareIds: [],
      hollandResult: null,
      aiMatchState: { ...DEFAULT_AI_MATCH },
    };
  }, [initialSession]);

  // --- Auth, RBAC & Demo Sandbox State ---
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(initialSession.isLoggedIn);
  const [isGuest, setIsGuest] = useState<boolean>(initialSession.isGuest);
  const [user, setUser] = useState<CurrentUser>(initialSession.user);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.DEMO_MODE) === 'true';
    } catch {
      return false;
    }
  });
  const [authPrefillEmail, setAuthPrefillEmail] = useState<string>('');

  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUserSummary[]>(() => {
    const raw = readJsonStorage<unknown>(STORAGE_KEYS.REGISTERED_USERS, []);
    const { accounts, migrated } = migrateStoredAccounts(raw);
    if (migrated) {
      writeJsonStorage(STORAGE_KEYS.REGISTERED_USERS, accounts);
    }
    return accounts.map(({ name, email, createdAtISO }) => ({
      name,
      email,
      createdAt: createdAtISO,
    }));
  });

  // --- Per-User Personal State ---
  const [profile, setProfile] = useState<UserProfile>(initialPersonal.profile);
  const [favoriteIds, setFavoriteIds] = useState<number[]>(initialPersonal.favoriteIds);
  const [compareIds, setCompareIds] = useState<number[]>(initialPersonal.compareIds);
  const [hollandResult, setHollandResult] = useState<HollandResult | null>(
    initialPersonal.hollandResult
  );
  const [aiMatchState, setAIMatchState] = useState<AIMatchState>(initialPersonal.aiMatchState);

  // --- Shared Institutional State ---
  const [universitiesList, setUniversitiesList] = useState<University[]>(() =>
    sanitizeLoadedUniversities(readJsonStorage<University[]>(STORAGE_KEYS.SHARED_UNIS, UNIVERSITIES))
  );
  const [applications, setApplications] = useState<ApplicationRecord[]>(() =>
    sanitizeLoadedApplications(
      readJsonStorage<ApplicationRecord[]>(STORAGE_KEYS.SHARED_APPS, INITIAL_APPLICATIONS)
    )
  );
  const [bookings, setBookings] = useState<ConsultationBooking[]>(() =>
    readJsonStorage<ConsultationBooking[]>(STORAGE_KEYS.SHARED_BOOKINGS, buildInitialBookings())
  );
  const [bookingStates, setBookingStates] = useState<Record<string, BookingState>>(() =>
    readJsonStorage<Record<string, BookingState>>(STORAGE_KEYS.SHARED_BOOKING_STATES, {})
  );
  const [processingLog, setProcessingLog] = useState<ProcessingLogEntry[]>(() =>
    readJsonStorage<ProcessingLogEntry[]>(STORAGE_KEYS.SHARED_LOGS, [])
  );
  const [allNotifications, setAllNotifications] = useState<NotificationItem[]>(() =>
    readJsonStorage<NotificationItem[]>(STORAGE_KEYS.SHARED_NOTIFICATIONS, INITIAL_NOTIFICATIONS)
  );
  const [aiQueryCount, setAiQueryCount] = useState<number>(() => {
    const saved = Number(localStorage.getItem(STORAGE_KEYS.AI_QUERY_COUNT));
    return Number.isFinite(saved) && saved >= 0 ? saved : 12;
  });

  // --- Settings ---
  const [reduceMotion, setReduceMotion] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.REDUCE_MOTION) === 'true';
  });
  const [notifications, setNotifications] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED) !== 'false';
  });

  // --- Modals & Navigation ---
  const [activeTab, setActiveTab] = useState<number>(0);
  const [selectedUniIdForDetail, setSelectedUniIdForDetail] = useState<number | null>(null);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);
  const [isCareerPathOpen, setIsCareerPathOpen] = useState(false);
  const [selectedCareerCode, setSelectedCareerCode] = useState<HollandCode | null>(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isBookConsultationOpen, setIsBookConsultationOpen] = useState(false);
  const [consultationTargetUni, setConsultationTargetUni] = useState<University | null>(null);
  const [isApplyDemoOpen, setIsApplyDemoOpen] = useState(false);
  const [applyDemoTargetUni, setApplyDemoTargetUni] = useState<University | null>(null);
  const [selectedAppForDetail, setSelectedAppForDetail] = useState<ApplicationRecord | null>(null);
  const [isAllApplicationsOpen, setIsAllApplicationsOpen] = useState<boolean>(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // --- Automatic View Mode Detection (< 1024px Mobile vs >= 1024px Desktop) ---
  const [viewMode, setViewModeState] = useState<ViewMode>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024 ? 'desktop' : 'mobile';
    }
    return 'mobile';
  });

  useEffect(() => {
    const handleResize = () => {
      setViewModeState(window.innerWidth >= 1024 ? 'desktop' : 'mobile');
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const root = document.getElementById('root');
    if (viewMode === 'desktop') {
      document.body.classList.add('mode-desktop');
      document.body.classList.remove('mode-mobile');
      root?.classList.add('mode-desktop');
      root?.classList.remove('mode-mobile');
    } else {
      document.body.classList.add('mode-mobile');
      document.body.classList.remove('mode-desktop');
      root?.classList.add('mode-mobile');
      root?.classList.remove('mode-desktop');
    }
  }, [viewMode]);

  // --- Cross-Tab Synchronization (Storage Event Listener) ---
  useEffect(() => {
    const onStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.SHARED_APPS && e.newValue) {
        try {
          setApplications(sanitizeLoadedApplications(JSON.parse(e.newValue)));
        } catch {
          // ignore
        }
      } else if (e.key === STORAGE_KEYS.SHARED_BOOKINGS && e.newValue) {
        try {
          setBookings(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      } else if (e.key === STORAGE_KEYS.SHARED_BOOKING_STATES && e.newValue) {
        try {
          setBookingStates(JSON.parse(e.newValue));
        } catch {
          // ignore
        }
      } else if (e.key === STORAGE_KEYS.SHARED_UNIS && e.newValue) {
        try {
          setUniversitiesList(sanitizeLoadedUniversities(JSON.parse(e.newValue)));
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('storage', onStorageChange);
    return () => window.removeEventListener('storage', onStorageChange);
  }, []);

  // --- Toast Helper ---
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3400);
  };

  // --- Persist Session ---
  useEffect(() => {
    if (isLoggedIn) {
      writeJsonStorage<StoredSession>(STORAGE_KEYS.SESSION, {
        isLoggedIn,
        isGuest,
        user,
      });
    } else {
      try {
        localStorage.removeItem(STORAGE_KEYS.SESSION);
      } catch {
        // ignore
      }
    }
  }, [isLoggedIn, isGuest, user]);

  // --- Persist Shared Institutional Data ---
  useEffect(() => {
    writeJsonStorage(STORAGE_KEYS.SHARED_UNIS, universitiesList);
  }, [universitiesList]);

  useEffect(() => {
    writeJsonStorage(STORAGE_KEYS.SHARED_APPS, applications);
  }, [applications]);

  useEffect(() => {
    writeJsonStorage(STORAGE_KEYS.SHARED_BOOKINGS, bookings);
  }, [bookings]);

  useEffect(() => {
    writeJsonStorage(STORAGE_KEYS.SHARED_BOOKING_STATES, bookingStates);
  }, [bookingStates]);

  useEffect(() => {
    writeJsonStorage(STORAGE_KEYS.SHARED_LOGS, processingLog);
  }, [processingLog]);

  useEffect(() => {
    writeJsonStorage(STORAGE_KEYS.SHARED_NOTIFICATIONS, allNotifications);
  }, [allNotifications]);

  // --- Persist Per-User Personal Store (strictly authenticated non-guest students) ---
  useEffect(() => {
    if (!isLoggedIn || isGuest || user.role !== 'student') return;
    const clean = user.email.trim().toLowerCase();
    if (SYSTEM_RESERVED_EMAILS.has(clean) && clean !== DEMO_EMAIL) return;
    writeJsonStorage<PerUserPersonalStore>(`${STORAGE_KEYS.USER_PREFIX}${clean}`, {
      profile,
      favoriteIds,
      compareIds,
      hollandResult,
      aiMatchState,
    });
  }, [isLoggedIn, isGuest, user, profile, favoriteIds, compareIds, hollandResult, aiMatchState]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REDUCE_MOTION, reduceMotion.toString());
    } catch {
      // ignore
    }
  }, [reduceMotion]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED, notifications.toString());
    } catch {
      // ignore
    }
  }, [notifications]);

  const incrementAiQueryCount = () => {
    setAiQueryCount((prev) => {
      const next = prev + 1;
      try {
        localStorage.setItem(STORAGE_KEYS.AI_QUERY_COUNT, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const toggleDemoMode = () => {
    setIsDemoMode((prev) => {
      const next = !prev;
      try {
        sessionStorage.setItem(STORAGE_KEYS.DEMO_MODE, String(next));
      } catch {
        // ignore
      }
      showToast(
        next
          ? '🧪 Đã bật Chế độ Kiểm thử Hội đồng (Demo Sandbox): Cho phép chuyển nhanh vai trò.'
          : '🔒 Đã tắt Chế độ Demo: Mọi tài khoản bắt buộc xác thực mật khẩu!'
      );
      return next;
    });
  };

  // --- Helper: Push Dynamic Notification ---
  const pushNotification = (item: Omit<NotificationItem, 'id' | 'time' | 'read'>) => {
    const { vi } = formatNowViDateTime();
    const newNotif: NotificationItem = {
      ...item,
      id: nextUniqueId('notif'),
      time: vi,
      read: false,
    };
    setAllNotifications((prev) => [newNotif, ...prev].slice(0, 60));
  };

  // --- Scoped Selectors for Privacy & RBAC ---
  const myApplications = useMemo<ApplicationRecord[]>(() => {
    if (!isLoggedIn || isGuest || user.role !== 'student') return [];
    const targetEmail = user.email.trim().toLowerCase();
    return applications.filter((a) => a.email.trim().toLowerCase() === targetEmail);
  }, [applications, isLoggedIn, isGuest, user]);

  const myBookings = useMemo<ConsultationBooking[]>(() => {
    if (!isLoggedIn || isGuest || user.role !== 'student') return [];
    const targetEmail = user.email.trim().toLowerCase();
    return bookings.filter((b) => b.email && b.email.trim().toLowerCase() === targetEmail);
  }, [bookings, isLoggedIn, isGuest, user]);

  const visibleNotifications = useMemo<NotificationItem[]>(() => {
    // Clean session for Guest / logged-out visitors: zero personal notification badge leakage
    if (!isLoggedIn || isGuest) return [];
    const currentEmail = user.email.trim().toLowerCase();
    return allNotifications.filter((n) => {
      if (n.targetEmail) {
        return n.targetEmail.trim().toLowerCase() === currentEmail;
      }
      if (!n.targetRole || n.targetRole === 'all') return true;
      return n.targetRole === user.role;
    });
  }, [allNotifications, isLoggedIn, isGuest, user]);

  const unreadNotificationCount = useMemo<number>(() => {
    if (!notifications || !isLoggedIn || isGuest) return 0;
    return visibleNotifications.filter((n) => !n.read).length;
  }, [visibleNotifications, notifications, isLoggedIn, isGuest]);

  const markNotificationRead = (id: string) => {
    setAllNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    const visibleIds = new Set(visibleNotifications.map((n) => n.id));
    setAllNotifications((prev) => prev.map((n) => (visibleIds.has(n.id) ? { ...n, read: true } : n)));
  };

  // --- RBAC Auth Guard for Student-Only Write Actions ---
  const requireStudentAuth = (actionLabel: string): boolean => {
    if (!isLoggedIn || isGuest) {
      setIsAuthModalOpen(true);
      showToast(`🔒 Vui lòng đăng nhập tài khoản Thí sinh để ${actionLabel}!`);
      return false;
    }
    if (user.role !== 'student') {
      showToast(`⛔ Chức năng ${actionLabel} chỉ dành cho tài khoản Thí sinh.`);
      return false;
    }
    return true;
  };

  // --- Auth & RBAC Handlers ---
  const applyStudentSession = (studentUser: CurrentUser) => {
    const personal = loadPersonalStore(studentUser.email, studentUser.name);
    setIsLoggedIn(true);
    setIsGuest(false);
    setUser(studentUser);
    setProfile(personal.profile);
    setFavoriteIds(personal.favoriteIds);
    setCompareIds(personal.compareIds);
    setHollandResult(personal.hollandResult);
    setAIMatchState(personal.aiMatchState);
    setActiveTab(0);
    setIsAuthModalOpen(false);
    setAuthPrefillEmail('');
  };

  const activateAdminSession = (viaDemo = false) => {
    setIsLoggedIn(true);
    setIsGuest(false);
    setUser(ACCOUNT_ADMIN);
    setSelectedAppForDetail(null);
    setIsAuthModalOpen(false);
    setAuthPrefillEmail('');
    showToast(
      viaDemo
        ? '🧪 [DEMO SANDBOX] Đã chuyển sang cổng Admin Hệ Thống'
        : 'Đăng nhập thành công: Quản trị viên Hệ Thống UniPath 2.0'
    );
  };

  const activatePxuSession = (viaDemo = false) => {
    setIsLoggedIn(true);
    setIsGuest(false);
    setUser(ACCOUNT_PXU);
    setSelectedAppForDetail(null);
    setIsAuthModalOpen(false);
    setAuthPrefillEmail('');
    showToast(
      viaDemo
        ? '🧪 [DEMO SANDBOX] Đã chuyển sang cổng Tuyển sinh ĐH Phú Xuân (PXU)'
        : 'Đăng nhập thành công: Cổng Tuyển sinh ĐH Phú Xuân (PXU)'
    );
  };

  const demoQuickSwitch = (target: 'student' | 'admin' | 'pxu') => {
    if (!isDemoMode) {
      const targetEmail =
        target === 'admin'
          ? ACCOUNT_ADMIN.email
          : target === 'pxu'
          ? ACCOUNT_PXU.email
          : ACCOUNT_STUDENT.email;
      setAuthPrefillEmail(targetEmail);
      setIsAuthModalOpen(true);
      showToast('🔒 Vui lòng nhập mật khẩu xác thực vai trò (hoặc bật Chế độ Kiểm thử Demo).');
      return;
    }
    if (target === 'admin') {
      activateAdminSession(true);
    } else if (target === 'pxu') {
      activatePxuSession(true);
    } else {
      applyStudentSession(ACCOUNT_STUDENT);
      showToast(`🧪 [DEMO SANDBOX] Đã chuyển sang tài khoản thí sinh ${ACCOUNT_STUDENT.name}`);
    }
  };

  const login = (email: string, pass: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !pass) return false;

    if (cleanEmail === 'admin@unipath.vn') {
      if (verifySystemAccountPassword(cleanEmail, pass)) {
        activateAdminSession(false);
        return true;
      }
      return false;
    }

    if (cleanEmail === 'tuyensinh@pxu.edu.vn') {
      if (verifySystemAccountPassword(cleanEmail, pass)) {
        activatePxuSession(false);
        return true;
      }
      return false;
    }

    if (cleanEmail === DEMO_EMAIL) {
      if (verifySystemAccountPassword(cleanEmail, pass)) {
        applyStudentSession(ACCOUNT_STUDENT);
        showToast(`Xin chào ${ACCOUNT_STUDENT.name}! Đã tải dữ liệu hồ sơ của bạn.`);
        return true;
      }
      return false;
    }

    const rawUsers = readJsonStorage<unknown>(STORAGE_KEYS.REGISTERED_USERS, []);
    const { accounts, migrated } = migrateStoredAccounts(rawUsers);
    if (migrated) {
      writeJsonStorage(STORAGE_KEYS.REGISTERED_USERS, accounts);
    }

    const candidateHash = hashPassword(cleanEmail, pass);
    const match = accounts.find((u) => u.email === cleanEmail && u.passHash === candidateHash);
    if (match) {
      applyStudentSession({
        email: match.email,
        name: match.name,
        role: 'student',
        title: 'Thí sinh THPT 2026',
        organization: 'Thí sinh đăng ký trực tuyến',
        avatar: '/images/avatar_user.png',
      });
      showToast(`Đăng nhập thành công! Xin chào ${match.name}`);
      return true;
    }
    return false;
  };

  const loginAsGuest = () => {
    setIsLoggedIn(true);
    setIsGuest(true);
    setUser(GUEST_USER);
    setProfile({ ...GUEST_PROFILE });
    setFavoriteIds([]);
    setCompareIds([]);
    setHollandResult(null);
    setAIMatchState({ ...DEFAULT_AI_MATCH });
    setActiveTab(0);
    setIsAuthModalOpen(false);
    setAuthPrefillEmail('');
    showToast('Đang khám phá với chế độ Khách trải nghiệm (Dữ liệu cá nhân tách biệt)');
  };

  const register = (
    fullName: string,
    email: string,
    pass: string
  ): { ok: boolean; error?: string } => {
    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (cleanName.length < 2) {
      return { ok: false, error: 'Vui lòng nhập họ và tên hợp lệ (tối thiểu 2 ký tự)!' };
    }
    if (!validateEmail(cleanEmail)) {
      return { ok: false, error: 'Địa chỉ Email không đúng định dạng!' };
    }
    if (pass.length < 6) {
      return { ok: false, error: 'Mật khẩu phải có tối thiểu 6 ký tự!' };
    }
    if (SYSTEM_RESERVED_EMAILS.has(cleanEmail) || cleanEmail === 'khach@unipath.vn') {
      return {
        ok: false,
        error: 'Email này thuộc tài khoản quản trị/hệ thống nội bộ, không thể đăng ký mới!',
      };
    }

    const rawUsers = readJsonStorage<unknown>(STORAGE_KEYS.REGISTERED_USERS, []);
    const { accounts } = migrateStoredAccounts(rawUsers);
    if (accounts.some((u) => u.email === cleanEmail)) {
      return {
        ok: false,
        error: 'Email này đã được đăng ký! Vui lòng chuyển sang tab Đăng nhập.',
      };
    }

    const { vi, iso } = formatNowViDateTime();
    const newUser: StoredUserAccount = {
      name: cleanName,
      email: cleanEmail,
      passHash: hashPassword(cleanEmail, pass),
      createdAtISO: vi || iso,
    };

    const nextUsers = [...accounts, newUser];
    writeJsonStorage(STORAGE_KEYS.REGISTERED_USERS, nextUsers);
    setRegisteredUsers(
      nextUsers.map(({ name, email: em, createdAtISO }) => ({
        name,
        email: em,
        createdAt: createdAtISO,
      }))
    );

    const freshPersonal = getDefaultPersonalStore(cleanEmail, cleanName);
    writeJsonStorage(`${STORAGE_KEYS.USER_PREFIX}${cleanEmail}`, freshPersonal);

    applyStudentSession({
      email: newUser.email,
      name: newUser.name,
      role: 'student',
      title: 'Thí sinh THPT 2026',
      organization: 'Thí sinh đăng ký trực tuyến',
      avatar: '/images/avatar_user.png',
    });

    pushNotification({
      title: `Chào mừng ${cleanName} đến với UniPath 2.0!`,
      body: 'Hãy bắt đầu với bài Trắc nghiệm Holland 12 câu hoặc AI Gợi ý Trường để tìm lộ trình đại học phù hợp nhất.',
      type: 'system',
      targetRole: 'student',
      targetEmail: cleanEmail,
      targetTab: 1,
    });

    showToast(`Tạo tài khoản thành công! Xin chào ${cleanName}`);
    return { ok: true };
  };

  const logout = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    } catch {
      // ignore
    }
    setIsLoggedIn(false);
    setIsGuest(false);
    setUser(GUEST_USER);
    setProfile({ ...GUEST_PROFILE });
    setFavoriteIds([]);
    setCompareIds([]);
    setHollandResult(null);
    setAIMatchState({ ...DEFAULT_AI_MATCH });
    setSelectedAppForDetail(null);
    setIsAllApplicationsOpen(false);
    setIsEditProfileOpen(false);
    setIsApplyDemoOpen(false);
    setIsBookConsultationOpen(false);
    setIsNotificationsOpen(false);
    setIsCompareModalOpen(false);
    setActiveTab(0);
    showToast('Đã đăng xuất và dọn sạch phiên cá nhân an toàn');
  };

  // --- Universities Database Management ---
  const updateUniversityMetrics = (
    id: number,
    rawScore2024: number | string,
    rawTuitionMin: number | string
  ): boolean => {
    const targetUni = universitiesList.find((u) => u.id === id);
    if (!targetUni) return false;

    if (user.role === 'university_pxu') {
      if (targetUni.code !== 'PXU') {
        showToast('⛔ Tài khoản ĐH Phú Xuân chỉ được cập nhật chỉ số của trường ĐH Phú Xuân (PXU).');
        return false;
      }
    } else if (user.role !== 'admin') {
      showToast('⛔ Chỉ Quản trị viên hoặc Ban Tuyển sinh trường sở tại mới có quyền cập nhật.');
      return false;
    }

    const scoreCheck = validateCutoffScore(rawScore2024);
    if (!scoreCheck.ok) {
      showToast(`⛔ ${scoreCheck.error}`);
      return false;
    }

    const tuitionCheck = validateTuitionMin(rawTuitionMin);
    if (!tuitionCheck.ok) {
      showToast(`⛔ ${tuitionCheck.error}`);
      return false;
    }

    const cleanScore = scoreCheck.value;
    const cleanTuitionMin = tuitionCheck.value;
    const delta = roundScore2(cleanScore - targetUni.score2024);

    setUniversitiesList((prev) => {
      const next = prev.map((u) => {
        if (u.id !== id) return u;
        const updatedCutoffs: Record<string, number> = {};
        for (const [majorName, oldCutoff] of Object.entries(u.cutoffScores)) {
          updatedCutoffs[majorName] = Math.min(30, Math.max(12, roundScore2(oldCutoff + delta)));
        }
        return {
          ...u,
          score2024: cleanScore,
          tuitionMin: cleanTuitionMin,
          tuitionMax: Math.max(roundScore2(u.tuitionMax), cleanTuitionMin),
          cutoffScores: updatedCutoffs,
        };
      });
      writeJsonStorage(STORAGE_KEYS.SHARED_UNIS, next);
      return next;
    });

    pushNotification({
      title: `Cập nhật điểm chuẩn & học phí ${targetUni.code}`,
      body: `${targetUni.name} vừa cập nhật điểm chuẩn tham chiếu ${cleanScore} điểm, học phí từ ${cleanTuitionMin} triệu/năm.`,
      type: 'deadline',
      targetRole: 'student',
    });

    showToast(
      `Đã lưu ${targetUni.code}: Chuẩn ${cleanScore}đ · Học phí từ ${cleanTuitionMin}tr/năm (Đồng bộ AI Matching)!`
    );
    return true;
  };

  // --- Profile & Booking Handlers ---
  const updateProfile = (updated: Partial<UserProfile>): boolean => {
    if (!requireStudentAuth('cập nhật hồ sơ cá nhân')) return false;

    if (updated.name !== undefined && updated.name.trim().length < 2) {
      showToast('⛔ Họ và tên phải có từ 2 ký tự trở lên!');
      return false;
    }

    if (updated.phone !== undefined && updated.phone.trim().length > 0) {
      const phoneCheck = validateVietnamPhone(updated.phone);
      if (!phoneCheck.ok) {
        showToast(`⛔ ${phoneCheck.error}`);
        return false;
      }
      updated = { ...updated, phone: phoneCheck.formatted };
    }

    if (updated.expectedScore !== undefined) {
      const scoreCheck = validateStudentScore(updated.expectedScore);
      if (!scoreCheck.ok) {
        showToast(`⛔ ${scoreCheck.error}`);
        return false;
      }
      updated = { ...updated, expectedScore: scoreCheck.value };
    }

    setProfile((prev) => {
      const next = { ...prev, ...updated, email: user.email };
      if (updated.name && updated.name.trim()) {
        setUser((u) => ({ ...u, name: updated.name!.trim() }));
      }
      return next;
    });
    showToast('Đã lưu thông tin hồ sơ cá nhân!');
    return true;
  };

  const addBooking = (bookingData: Omit<ConsultationBooking, 'id'>): boolean => {
    if (!requireStudentAuth('đặt lịch tư vấn 1-1')) return false;

    if (!bookingData.name || bookingData.name.trim().length < 2) {
      showToast('⛔ Vui lòng nhập họ và tên thí sinh (tối thiểu 2 ký tự)!');
      return false;
    }

    const phoneCheck = validateVietnamPhone(bookingData.phone);
    if (!phoneCheck.ok) {
      showToast(`⛔ ${phoneCheck.error}`);
      return false;
    }

    const dateISO = bookingData.scheduledDateISO || getLocalTodayISO();
    if (isPastDateISO(dateISO)) {
      showToast('⛔ Ngày hẹn tư vấn không được nằm trong quá khứ! Vui lòng chọn từ hôm nay trở đi.');
      return false;
    }

    const ownerEmail = (bookingData.email || user.email).trim().toLowerCase();
    const slotKey = (bookingData.timeSlot || bookingData.dateTime).trim().toLowerCase();
    const duplicateBooking = bookings.find(
      (b) =>
        (b.email || '').trim().toLowerCase() === ownerEmail &&
        b.uniCode === bookingData.uniCode &&
        b.scheduledDateISO === dateISO &&
        (b.timeSlot || b.dateTime).trim().toLowerCase() === slotKey
    );

    if (duplicateBooking) {
      showToast(
        `⛔ Bạn đã đặt lịch tư vấn với ${bookingData.uniCode} vào đúng khung giờ này rồi!`
      );
      return false;
    }

    const newBooking: ConsultationBooking = {
      ...bookingData,
      name: bookingData.name.trim(),
      phone: phoneCheck.formatted,
      email: ownerEmail,
      scheduledDateISO: dateISO,
      id: nextUniqueId('bk'),
    };

    setBookings((prev) => {
      const next = [newBooking, ...prev];
      writeJsonStorage(STORAGE_KEYS.SHARED_BOOKINGS, next);
      return next;
    });
    syncBookingToCloud(newBooking, 'pending');

    pushNotification({
      title: `Đã ghi nhận lịch tư vấn 1-1 cùng ${newBooking.uniCode}`,
      body: `Khung giờ: ${newBooking.dateTime} (${newBooking.channel || 'Trực tuyến'}) — Ngành ${newBooking.major}.`,
      type: 'booking',
      targetRole: 'student',
      targetEmail: ownerEmail,
      targetTab: 4,
    });

    if (newBooking.uniCode === 'PXU') {
      pushNotification({
        title: `Lịch hẹn tư vấn 1-1 mới: ${newBooking.name}`,
        body: `Thí sinh đăng ký tư vấn ngành ${newBooking.major} vào khung giờ ${newBooking.dateTime}.`,
        type: 'booking',
        targetRole: 'university_pxu',
      });
    }

    pushNotification({
      title: `[${newBooking.uniCode}] Lịch tư vấn mới từ ${newBooking.name}`,
      body: `Ngành ${newBooking.major} · ${newBooking.dateTime} · SĐT ${newBooking.phone}.`,
      type: 'booking',
      targetRole: 'admin',
    });

    showToast(`Đặt lịch tư vấn 1-1 với ${newBooking.uniName || newBooking.uniCode} thành công!`);
    return true;
  };

  const updateBookingState = (bookingId: string, state: BookingState, note?: string) => {
    const target = bookings.find((b) => b.id === bookingId);
    if (!target) return;
    if (user.role === 'student') {
      showToast('⛔ Chỉ Admin hoặc Ban Tuyển sinh trường mới cập nhật trạng thái xử lý lịch tư vấn.');
      return;
    }
    if (user.role === 'university_pxu' && target.uniCode !== 'PXU') {
      showToast('⛔ Cổng ĐH Phú Xuân chỉ xử lý lịch tư vấn đặt với PXU.');
      return;
    }

    const prevState: BookingState = bookingStates[bookingId] || 'pending';
    if (prevState === state) return;

    const labelOf = (s: BookingState) =>
      s === 'contacted' ? 'Đã liên hệ' : s === 'done' ? 'Hoàn thành tư vấn' : 'Chờ liên hệ';

    setBookingStates((prev) => {
      const next = { ...prev, [bookingId]: state };
      writeJsonStorage(STORAGE_KEYS.SHARED_BOOKING_STATES, next);
      return next;
    });
    syncBookingToCloud(target, state);

    const { vi } = formatNowViDateTime();
    const logNote =
      note?.trim() ||
      (prevState === 'done' && state === 'pending'
        ? 'Mở lại lịch tư vấn để liên hệ bổ sung với thí sinh'
        : `Cập nhật trạng thái lịch hẹn (${target.dateTime})`);

    setProcessingLog((prev) =>
      [
        {
          id: nextUniqueId('log'),
          appCode: `LỊCH-${target.uniCode}`,
          candidateName: target.name,
          uniCode: target.uniCode,
          fromStatus: labelOf(prevState),
          toStatus: labelOf(state),
          actorName: user.name,
          actorRole: user.role,
          time: vi,
          note: logNote,
        },
        ...prev,
      ].slice(0, 60)
    );

    const label = labelOf(state);
    if (target.email) {
      pushNotification({
        title: `Cập nhật lịch tư vấn 1-1 (${target.uniCode}): ${label}`,
        body:
          state === 'contacted'
            ? `Ban Tuyển sinh ${target.uniName || target.uniCode} đã xác nhận lịch hẹn ngành ${target.major} (${target.dateTime}).`
            : state === 'done'
            ? `Buổi tư vấn 1-1 ngành ${target.major} cùng ${target.uniName || target.uniCode} đã hoàn thành.`
            : `Lịch tư vấn ngành ${target.major} đã được mở lại sang trạng thái chờ liên hệ.`,
        type: 'booking',
        targetRole: 'student',
        targetEmail: target.email,
        targetTab: 4,
      });
    }

    showToast(`Đã cập nhật lịch tư vấn của ${target.name}: ${label}`);
  };

  const upgradePremium = (planName: string) => {
    if (!requireStudentAuth('nâng cấp gói hội viên VIP')) return;
    setProfile((prev) => ({
      ...prev,
      isPremium: true,
      premiumPlan: planName,
    }));
    pushNotification({
      title: `Kích hoạt thành công ${planName}`,
      body: 'Bạn đã mở khóa đặc quyền tư vấn chuyên sâu 1-1 ưu tiên và kho tài liệu ĐGNL nâng cao.',
      type: 'promo',
      targetRole: 'student',
      targetEmail: user.email,
      targetTab: 4,
    });
    showToast(`Chúc mừng! Bạn đã trở thành hội viên ${planName}`);
  };

  // --- Wishlist Handlers ---
  const toggleFavorite = (id: number): boolean => {
    let isNowFav = false;
    setFavoriteIds((prev) => {
      if (prev.includes(id)) {
        isNowFav = false;
        return prev.filter((item) => item !== id);
      } else {
        isNowFav = true;
        return [...prev, id];
      }
    });
    return isNowFav;
  };

  const isFavorite = (id: number) => favoriteIds.includes(id);

  // --- Compare Handlers ---
  const toggleCompare = (id: number): 1 | 0 | -1 => {
    if (compareIds.includes(id)) {
      setCompareIds((prev) => prev.filter((item) => item !== id));
      showToast('Đã gỡ khỏi danh sách so sánh');
      return 0;
    }
    if (compareIds.length >= 3) {
      showToast('Tối đa so sánh 3 trường! Hãy gỡ bớt 1 trường.');
      return -1;
    }
    setCompareIds((prev) => [...prev, id]);
    showToast('Đã thêm vào danh sách so sánh');
    return 1;
  };

  const isCompared = (id: number) => compareIds.includes(id);

  const removeCompare = (id: number) => {
    setCompareIds((prev) => prev.filter((item) => item !== id));
    showToast('Đã gỡ trường khỏi so sánh');
  };

  const clearCompare = () => {
    setCompareIds([]);
    showToast('Đã làm trống danh sách so sánh');
  };

  // --- Holland Handlers (with proper Tie-Breaking & zero 0-point noise) ---
  const saveHollandResult = (scores: Record<HollandCode, number>): HollandResult => {
    const computed = computeHollandAssessment(scores, new Date().toLocaleDateString('vi-VN'));
    const newResult: HollandResult = {
      primaryCode: computed.primaryCode,
      topCodes: computed.topCodes,
      tiedTopCodes: computed.tiedTopCodes,
      scores: computed.scores,
      completedAt: computed.completedAt,
    };
    setHollandResult(newResult);
    if (isLoggedIn && !isGuest && user.role === 'student') {
      const tieNote =
        computed.tiedTopCodes.length >= 2
          ? ` (Đồng điểm cao nhất: ${computed.tiedTopCodes.join(' & ')})`
          : '';
      pushNotification({
        title: `Hoàn thành Trắc nghiệm Holland — Nhóm ${computed.primaryCode}${tieNote}`,
        body: `Nhóm nổi trội của bạn: ${computed.topCodes.join(' - ')}. Hệ thống AI Gợi ý Trường đã tự động đồng bộ sở thích!`,
        type: 'quiz',
        targetRole: 'student',
        targetEmail: user.email,
        targetTab: 2,
      });
    }
    return newResult;
  };

  const clearHollandResult = () => {
    setHollandResult(null);
    showToast('Đã xóa kết quả trắc nghiệm. Bạn có thể làm lại!');
  };

  // --- Settings & Scoped Reset Handlers ---
  const toggleReduceMotion = () => {
    setReduceMotion((prev) => !prev);
    showToast(reduceMotion ? 'Đã bật hiệu ứng chuyển động' : 'Đã giảm hiệu ứng chuyển động');
  };

  const toggleNotifications = () => {
    setNotifications((prev) => !prev);
    showToast(notifications ? 'Đã tắt thông báo hệ thống' : 'Đã bật thông báo hệ thống');
  };

  const resetPersonalData = () => {
    try {
      localStorage.removeItem('unipath_chat_history');
      if (isLoggedIn && !isGuest && user.role === 'student') {
        const clean = user.email.trim().toLowerCase();
        const defaults = getDefaultPersonalStore(clean, user.name);
        writeJsonStorage(`${STORAGE_KEYS.USER_PREFIX}${clean}`, defaults);
        setProfile(defaults.profile);
        setFavoriteIds(defaults.favoriteIds);
        setCompareIds(defaults.compareIds);
        setHollandResult(null);
        setAIMatchState(defaults.aiMatchState);
        showToast('Đã đặt lại dữ liệu học tập cá nhân của bạn về mặc định!');
        return;
      }
    } catch {
      // ignore
    }
    setFavoriteIds([]);
    setCompareIds([]);
    setHollandResult(null);
    setAIMatchState({ ...DEFAULT_AI_MATCH });
    showToast('Đã xóa dữ liệu tạm phiên trải nghiệm!');
  };

  const resetAllData = () => {
    // Non-admin users without Demo Mode cannot wipe shared institutional data or other users!
    if (user.role !== 'admin' && !isDemoMode) {
      resetPersonalData();
      return;
    }

    try {
      // Preserve registered user accounts while resetting demo institutional tables
      const keysToRemove = [
        STORAGE_KEYS.SHARED_APPS,
        STORAGE_KEYS.APP_SEQ,
        STORAGE_KEYS.SHARED_BOOKINGS,
        STORAGE_KEYS.SHARED_BOOKING_STATES,
        STORAGE_KEYS.SHARED_UNIS,
        STORAGE_KEYS.SHARED_LOGS,
        STORAGE_KEYS.SHARED_NOTIFICATIONS,
        `${STORAGE_KEYS.USER_PREFIX}${DEMO_EMAIL}`,
        'unipath_chat_history',
      ];
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch {
      // ignore
    }

    setUniversitiesList(UNIVERSITIES);
    setApplications([...INITIAL_APPLICATIONS]);
    setBookings(buildInitialBookings());
    setBookingStates({});
    setProcessingLog([]);
    setAllNotifications([...INITIAL_NOTIFICATIONS]);
    setSelectedAppForDetail(null);
    setIsAllApplicationsOpen(false);
    showToast('Đã khôi phục dữ liệu mẫu hệ thống về trạng thái chuẩn (Bảo toàn tài khoản đã đăng ký)!');
  };

  // --- Navigation & Modal Triggers ---
  const openUniDetail = (id: number) => setSelectedUniIdForDetail(id);
  const closeUniDetail = () => setSelectedUniIdForDetail(null);

  const openCompareModal = () => setIsCompareModalOpen(true);
  const closeCompareModal = () => setIsCompareModalOpen(false);

  const openChatBot = () => setIsChatBotOpen(true);
  const closeChatBot = () => setIsChatBotOpen(false);

  const openCareerPath = (code?: HollandCode) => {
    setSelectedCareerCode(code || hollandResult?.primaryCode || 'E');
    setIsCareerPathOpen(true);
  };
  const closeCareerPath = () => setIsCareerPathOpen(false);

  const openEditProfile = () => {
    if (!requireStudentAuth('chỉnh sửa hồ sơ học tập')) return;
    setIsEditProfileOpen(true);
  };
  const closeEditProfile = () => setIsEditProfileOpen(false);

  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);

  const openNotifications = () => setIsNotificationsOpen(true);
  const closeNotifications = () => setIsNotificationsOpen(false);

  const openAuthModal = (prefillEmail?: string) => {
    if (typeof prefillEmail === 'string') {
      setAuthPrefillEmail(prefillEmail);
    }
    setIsAuthModalOpen(true);
  };
  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthPrefillEmail('');
  };

  const openBookConsultation = (uni?: University) => {
    if (!requireStudentAuth('đặt lịch tư vấn 1-1')) return;
    const defaultPxu = universitiesList.find((u) => u.code === 'PXU') || universitiesList[0] || null;
    setConsultationTargetUni(uni || defaultPxu);
    setIsBookConsultationOpen(true);
  };
  const closeBookConsultation = () => setIsBookConsultationOpen(false);

  const openApplyDemo = (uni: University) => {
    if (!requireStudentAuth('nộp hồ sơ xét tuyển sớm')) return;
    setApplyDemoTargetUni(uni);
    setIsApplyDemoOpen(true);
  };
  const closeApplyDemo = () => setIsApplyDemoOpen(false);

  // --- Sequential Application Code Helper ---
  const nextSequentialAppCode = (uniCode: string): string => {
    let currentSeq = Math.max(8, applications.length);
    try {
      const stored = Number(localStorage.getItem(STORAGE_KEYS.APP_SEQ));
      if (Number.isFinite(stored) && stored > currentSeq) {
        currentSeq = stored;
      }
    } catch {
      // ignore
    }
    const nextSeq = currentSeq + 1;
    try {
      localStorage.setItem(STORAGE_KEYS.APP_SEQ, String(nextSeq));
    } catch {
      // ignore
    }
    return `HS-2026-${(uniCode || 'UNI').toUpperCase()}${String(nextSeq).padStart(2, '0')}`;
  };

  // --- Application Lifecycle Handlers ---
  const addApplication = (
    appData: Omit<ApplicationRecord, 'id' | 'submittedAt' | 'status' | 'statusColor' | 'code'>
  ): ApplicationRecord | null => {
    if (!requireStudentAuth('nộp hồ sơ xét tuyển')) return null;

    const targetUni = universitiesList.find((u) => u.id === appData.uniId);
    if (!targetUni) {
      showToast('⛔ Không tìm thấy trường đại học đăng ký xét tuyển!');
      return null;
    }

    if (!targetUni.majors.includes(appData.major)) {
      showToast(`⛔ Ngành "${appData.major}" không thuộc danh mục tuyển sinh của ${targetUni.code}!`);
      return null;
    }

    const cleanCandidateName = (appData.candidateName || '').trim();
    if (cleanCandidateName.length < 2) {
      showToast('⛔ Vui lòng nhập đầy đủ họ và tên thí sinh!');
      return null;
    }

    const phoneCheck = validateVietnamPhone(appData.phone);
    if (!phoneCheck.ok) {
      showToast(`⛔ ${phoneCheck.error}`);
      return null;
    }

    const scoreCheck = validateStudentScore(appData.score);
    if (!scoreCheck.ok) {
      showToast(`⛔ ${scoreCheck.error}`);
      return null;
    }

    const ownerEmail = user.email.trim().toLowerCase();
    const submissionCheck = validateNewApplicationSubmission(
      applications,
      ownerEmail,
      targetUni.id,
      appData.major
    );
    if (!submissionCheck.ok) {
      showToast(`⛔ ${submissionCheck.error}`);
      return null;
    }

    const { vi, iso } = formatNowViDateTime();
    const newRecord: ApplicationRecord = {
      ...appData,
      uniId: targetUni.id,
      uniName: targetUni.name,
      uniCode: targetUni.code,
      candidateName: cleanCandidateName,
      phone: phoneCheck.formatted,
      email: ownerEmail,
      score: scoreCheck.value,
      id: nextUniqueId('app'),
      code: nextSequentialAppCode(targetUni.code),
      submittedAt: vi,
      submittedAtISO: iso,
      status: 'Đang xét duyệt',
      statusColor: getStatusMeta('Đang xét duyệt').dot,
    };

    setApplications((prev) => {
      const next = [newRecord, ...prev];
      writeJsonStorage(STORAGE_KEYS.SHARED_APPS, next);
      return next;
    });
    syncApplicationToCloud(newRecord);

    pushNotification({
      title: `Nộp hồ sơ thành công: ${newRecord.code}`,
      body: `Hồ sơ xét tuyển ngành ${newRecord.major} vào ${newRecord.uniName} đã được chuyển tới Hội đồng tuyển sinh.`,
      type: 'application',
      targetRole: 'student',
      targetEmail: ownerEmail,
      targetTab: 4,
    });

    if (newRecord.uniCode === 'PXU') {
      pushNotification({
        title: `Hồ sơ xét tuyển mới: ${newRecord.code}`,
        body: `Thí sinh ${newRecord.candidateName} (${newRecord.score}đ) vừa nộp hồ sơ ngành ${newRecord.major}.`,
        type: 'application',
        targetRole: 'university_pxu',
      });
    }

    pushNotification({
      title: `[${newRecord.uniCode}] Hồ sơ mới ${newRecord.code}`,
      body: `${newRecord.candidateName} đăng ký ngành ${newRecord.major} (${newRecord.score}đ).`,
      type: 'application',
      targetRole: 'admin',
    });

    showToast(`Nộp hồ sơ xét tuyển thành công! Mã hồ sơ: ${newRecord.code}`);
    return newRecord;
  };

  const cancelApplication = (appId: string, reason?: string): boolean => {
    const target = applications.find((a) => a.id === appId);
    if (!target) return false;

    const check = canStudentCancelApplication(
      target,
      user.email,
      !isLoggedIn || isGuest || user.role !== 'student'
    );
    if (!check.allowed) {
      showToast(`⛔ ${check.error}`);
      return false;
    }

    const cleanReason =
      (reason || '').trim() || 'Thí sinh chủ động rút hồ sơ để điều chỉnh nguyện vọng';
    const updated: ApplicationRecord = {
      ...target,
      status: 'Đã hủy',
      statusColor: getStatusMeta('Đã hủy').dot,
      cancelReason: cleanReason,
    };

    setApplications((prev) => {
      const next = prev.map((app) => (app.id === appId ? updated : app));
      writeJsonStorage(STORAGE_KEYS.SHARED_APPS, next);
      return next;
    });
    syncApplicationToCloud(updated);

    if (selectedAppForDetail?.id === appId) {
      setSelectedAppForDetail(updated);
    }

    const { vi } = formatNowViDateTime();
    setProcessingLog((prev) => {
      const nextLogs: ProcessingLogEntry[] = [
        {
          id: nextUniqueId('log'),
          appCode: target.code,
          candidateName: target.candidateName,
          uniCode: target.uniCode,
          fromStatus: target.status,
          toStatus: 'Đã hủy',
          actorName: user.name,
          actorRole: user.role,
          time: vi,
          note: cleanReason,
        },
        ...prev,
      ].slice(0, 60);
      writeJsonStorage(STORAGE_KEYS.SHARED_LOGS, nextLogs);
      return nextLogs;
    });

    showToast(`Đã rút hồ sơ ${target.code} thành công.`);
    return true;
  };

  const resubmitApplicationSupplement = (appId: string, supplementNote: string): boolean => {
    if (!isLoggedIn || isGuest || user.role !== 'student') {
      showToast('⛔ Chỉ thí sinh chủ sở hữu mới có thể gửi bổ sung hồ sơ.');
      return false;
    }
    const target = applications.find((a) => a.id === appId);
    if (!target) return false;
    if (target.email.trim().toLowerCase() !== user.email.trim().toLowerCase()) {
      showToast('⛔ Không thể chỉnh sửa hồ sơ của thí sinh khác!');
      return false;
    }
    if (target.status !== 'Thiếu hồ sơ') {
      showToast('⛔ Hồ sơ này hiện không ở trạng thái chờ bổ sung.');
      return false;
    }

    const cleanSupplement =
      supplementNote.trim() || 'Đã cập nhật đầy đủ minh chứng học bạ & CCCD.';
    const { vi } = formatNowViDateTime();
    const updatedNotes = `[Thí sinh đã bổ sung ${vi}]: ${cleanSupplement}`;

    const updated: ApplicationRecord = {
      ...target,
      status: 'Đang xét duyệt',
      statusColor: getStatusMeta('Đang xét duyệt').dot,
      notes: updatedNotes,
    };

    setApplications((prev) => {
      const next = prev.map((app) => (app.id === appId ? updated : app));
      writeJsonStorage(STORAGE_KEYS.SHARED_APPS, next);
      return next;
    });
    syncApplicationToCloud(updated);

    if (selectedAppForDetail?.id === appId) {
      setSelectedAppForDetail(updated);
    }

    const supplementLogEntry: ProcessingLogEntry = {
      id: nextUniqueId('log'),
      appCode: target.code,
      candidateName: target.candidateName,
      uniCode: target.uniCode,
      fromStatus: 'Thiếu hồ sơ',
      toStatus: 'Đang xét duyệt',
      actorName: user.name,
      actorRole: 'student',
      time: vi,
      note: cleanSupplement,
    };

    setProcessingLog((prev) => {
      const next = [supplementLogEntry, ...prev].slice(0, 60);
      writeJsonStorage(STORAGE_KEYS.SHARED_LOGS, next);
      return next;
    });

    if (target.uniCode === 'PXU') {
      pushNotification({
        title: `Thí sinh đã bổ sung hồ sơ ${target.code}`,
        body: `${target.candidateName} vừa gửi bổ sung minh chứng: "${cleanSupplement}"`,
        type: 'application',
        targetRole: 'university_pxu',
      });
    }

    pushNotification({
      title: `[${target.uniCode}] Đã bổ sung minh chứng ${target.code}`,
      body: `${target.candidateName} đã gửi lại hồ sơ xét duyệt: "${cleanSupplement}"`,
      type: 'application',
      targetRole: 'admin',
    });

    showToast(`Đã gửi bổ sung minh chứng cho hồ sơ ${target.code}!`);
    return true;
  };

  const applyInstitutionalStatusChange = (
    ids: string[],
    status: ApplicationStatus,
    customNotes?: string
  ): boolean => {
    if (!isLoggedIn || isGuest || user.role === 'student') {
      showToast('⛔ Chỉ Admin hoặc Ban Tuyển sinh trường mới có quyền thẩm định hồ sơ.');
      return false;
    }

    const scopeTargets = applications.filter((a) => {
      if (!ids.includes(a.id)) return false;
      if (user.role === 'university_pxu' && a.uniCode !== 'PXU') return false;
      return true;
    });

    if (scopeTargets.length === 0) {
      if (user.role === 'university_pxu') {
        showToast('⛔ Cổng ĐH Phú Xuân chỉ được xử lý hồ sơ nộp vào PXU.');
      }
      return false;
    }

    const eligibleTargets: {
      app: ApplicationRecord;
      normalizedNote?: string;
      isBelowCutoffOverride: boolean;
      majorCutoff: number;
    }[] = [];
    const errors: string[] = [];

    for (const app of scopeTargets) {
      const uni = universitiesList.find((u) => u.id === app.uniId || u.code === app.uniCode);
      const majorCutoff = getMajorCutoffForApp(uni, app.major);
      const check = validateReviewerStatusChange(app, status, majorCutoff, customNotes);
      if (check.ok) {
        eligibleTargets.push({
          app,
          normalizedNote: check.normalizedNote,
          isBelowCutoffOverride: check.isBelowCutoffOverride,
          majorCutoff,
        });
      } else {
        errors.push(check.error);
      }
    }

    if (eligibleTargets.length === 0) {
      showToast(`⛔ ${errors[0] || 'Không thể chuyển trạng thái cho hồ sơ đã chọn.'}`);
      return false;
    }

    const eligibleMap = new Map(eligibleTargets.map((item) => [item.app.id, item]));
    const statusDot = getStatusMeta(status).dot;

    const defaultFeedbackByStatus: Record<ApplicationStatus, string> = {
      'Đã trúng tuyển':
        'Hội đồng tuyển sinh xác nhận thí sinh ĐỦ ĐIỀU KIỆN TRÚNG TUYỂN SỚM. Vui lòng theo dõi hướng dẫn xác nhận nhập học.',
      'Hồ sơ hợp lệ':
        'Đã thẩm định đầy đủ minh chứng CCCD & Học bạ hợp lệ. Hồ sơ đủ điều kiện trình Hội đồng phê duyệt trúng tuyển.',
      'Thiếu hồ sơ':
        'Đề nghị thí sinh kiểm tra và gửi bổ sung bản chụp rõ nét Học bạ THPT / Chứng chỉ ưu tiên để tiếp tục xét duyệt.',
      'Đã bị hủy':
        'Hồ sơ chưa đáp ứng điều kiện ngưỡng đảm bảo chất lượng đầu vào của ngành đăng ký trong đợt xét tuyển này.',
      'Đang xét duyệt': 'Hồ sơ đang trong quá trình thẩm định bởi Hội đồng tuyển sinh.',
      'Đã hủy': 'Hồ sơ đã dừng xét tuyển.',
    };

    setApplications((prev) => {
      const next = prev.map((app) => {
        const entry = eligibleMap.get(app.id);
        if (!entry) return app;
        const baseNote = entry.normalizedNote || defaultFeedbackByStatus[status] || app.notes;
        const formattedNote = entry.isBelowCutoffOverride
          ? `[Giải trình duyệt dưới chuẩn ngành ${entry.majorCutoff}đ]: ${entry.normalizedNote}`
          : baseNote;

        const updated: ApplicationRecord = {
          ...app,
          status,
          statusColor: statusDot,
          notes: formattedNote,
          cancelReason:
            status === 'Đã bị hủy'
              ? entry.normalizedNote || 'Hội đồng tuyển sinh từ chối xét duyệt'
              : app.cancelReason,
        };
        syncApplicationToCloud(updated);
        if (selectedAppForDetail?.id === app.id) {
          setSelectedAppForDetail(updated);
        }
        return updated;
      });
      writeJsonStorage(STORAGE_KEYS.SHARED_APPS, next);
      return next;
    });

    const { vi: timeNow } = formatNowViDateTime();
    const newLogs: ProcessingLogEntry[] = eligibleTargets.map((entry) => ({
      id: nextUniqueId('log'),
      appCode: entry.app.code,
      candidateName: entry.app.candidateName,
      uniCode: entry.app.uniCode,
      fromStatus: entry.app.status,
      toStatus: status,
      actorName: user.name,
      actorRole: user.role,
      time: timeNow,
      note: entry.isBelowCutoffOverride
        ? `[Dưới chuẩn ${entry.majorCutoff}đ] ${entry.normalizedNote}`
        : entry.normalizedNote,
    }));

    setProcessingLog((prev) => {
      const next = [...newLogs, ...prev].slice(0, 60);
      writeJsonStorage(STORAGE_KEYS.SHARED_LOGS, next);
      return next;
    });

    const newStudentNotifs: NotificationItem[] = eligibleTargets.map(({ app: target, normalizedNote }) => {
      const noteText = normalizedNote || defaultFeedbackByStatus[status];
      const titleMap: Record<ApplicationStatus, string> = {
        'Đã trúng tuyển': `🎉 Chúc mừng! Hồ sơ ${target.code} ĐÃ TRÚNG TUYỂN SỚM`,
        'Hồ sơ hợp lệ': `✅ Hồ sơ ${target.code} (${target.uniCode}) đã được xác nhận hợp lệ`,
        'Thiếu hồ sơ': `📎 Yêu cầu bổ sung minh chứng hồ sơ ${target.code} (${target.uniCode})`,
        'Đã bị hủy': `⚠️ Từ chối xét duyệt hồ sơ ${target.code} (${target.uniCode})`,
        'Đang xét duyệt': `🔄 Hồ sơ ${target.code} đang được xét duyệt`,
        'Đã hủy': `Hồ sơ ${target.code} đã rút`,
      };
      return {
        id: nextUniqueId('notif'),
        title: titleMap[status],
        body: `${target.uniName} — Ngành ${target.major}: ${noteText}`,
        time: timeNow,
        read: false,
        type: 'application',
        targetRole: 'student',
        targetEmail: target.email,
        targetTab: 4,
      };
    });

    setAllNotifications((prev) => [...newStudentNotifs, ...prev].slice(0, 60));

    const skippedCount = scopeTargets.length - eligibleTargets.length;
    if (scopeTargets.length === 1) {
      showToast(`Đã cập nhật hồ sơ ${eligibleTargets[0].app.code} → "${status}"`);
    } else if (skippedCount > 0) {
      showToast(
        `Đã cập nhật ${eligibleTargets.length} hồ sơ → "${status}" (Bỏ qua ${skippedCount} hồ sơ đã kết thúc/sai quy trình)`
      );
    } else {
      showToast(`Đã cập nhật hàng loạt ${eligibleTargets.length} hồ sơ → "${status}"`);
    }
    return true;
  };

  const updateApplicationStatus = (id: string, status: ApplicationStatus, notes?: string): boolean => {
    return applyInstitutionalStatusChange([id], status, notes);
  };

  const batchUpdateApplicationStatus = (
    ids: string[],
    status: ApplicationStatus,
    notes?: string
  ): boolean => {
    return applyInstitutionalStatusChange(ids, status, notes);
  };

  const openApplicationDetail = (app: ApplicationRecord) => {
    setSelectedAppForDetail(app);
  };

  const closeApplicationDetail = () => {
    setSelectedAppForDetail(null);
  };

  const openAllApplications = () => setIsAllApplicationsOpen(true);
  const closeAllApplications = () => setIsAllApplicationsOpen(false);

  const saveAIMatchState = (partial: Partial<AIMatchState>) => {
    setAIMatchState((prev) => ({ ...prev, ...partial }));
  };

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        isGuest,
        user,
        isDemoMode,
        toggleDemoMode,
        demoQuickSwitch,
        authPrefillEmail,
        registeredUsers,
        login,
        loginAsGuest,
        register,
        logout,
        profile,
        updateProfile,
        bookings,
        myBookings,
        addBooking,
        bookingStates,
        updateBookingState,
        upgradePremium,
        favoriteIds,
        toggleFavorite,
        isFavorite,
        compareIds,
        toggleCompare,
        isCompared,
        removeCompare,
        clearCompare,
        hollandResult,
        saveHollandResult,
        clearHollandResult,
        reduceMotion,
        notifications,
        toggleReduceMotion,
        toggleNotifications,
        resetPersonalData,
        resetAllData,
        visibleNotifications,
        unreadNotificationCount,
        markNotificationRead,
        markAllNotificationsRead,
        activeTab,
        setActiveTab,
        selectedUniIdForDetail,
        openUniDetail,
        closeUniDetail,
        isCompareModalOpen,
        openCompareModal,
        closeCompareModal,
        isChatBotOpen,
        openChatBot,
        closeChatBot,
        aiQueryCount,
        incrementAiQueryCount,
        isCareerPathOpen,
        selectedCareerCode,
        openCareerPath,
        closeCareerPath,
        isEditProfileOpen,
        openEditProfile,
        closeEditProfile,
        isSettingsOpen,
        openSettings,
        closeSettings,
        isNotificationsOpen,
        openNotifications,
        closeNotifications,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        isBookConsultationOpen,
        consultationTargetUni,
        openBookConsultation,
        closeBookConsultation,
        isApplyDemoOpen,
        applyDemoTargetUni,
        openApplyDemo,
        closeApplyDemo,
        applications,
        myApplications,
        addApplication,
        cancelApplication,
        resubmitApplicationSupplement,
        updateApplicationStatus,
        batchUpdateApplicationStatus,
        processingLog,
        selectedAppForDetail,
        openApplicationDetail,
        closeApplicationDetail,
        isAllApplicationsOpen,
        openAllApplications,
        closeAllApplications,
        universitiesList,
        updateUniversityMetrics,
        toastMessage,
        showToast,
        searchKeyword,
        setSearchKeyword,
        aiMatchState,
        saveAIMatchState,
        viewMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
