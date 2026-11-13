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

export interface HollandResult {
  primaryCode: HollandCode;
  topCodes: HollandCode[];
  scores: Record<HollandCode, number>;
  completedAt: string;
}

// Trạng thái xử lý lịch tư vấn 1-1: chờ liên hệ -> đã liên hệ -> hoàn thành
export type BookingState = 'pending' | 'contacted' | 'done';

// Nhật ký xử lý hồ sơ liên vai trò
export interface ProcessingLogEntry {
  id: string;
  appCode: string;
  candidateName: string;
  uniCode: string;
  fromStatus: ApplicationStatus;
  toStatus: ApplicationStatus;
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

interface StoredRegisteredUser extends RegisteredUserSummary {
  pass: string;
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
  // Auth & RBAC
  isLoggedIn: boolean;
  isGuest: boolean;
  user: CurrentUser;
  registeredUsers: RegisteredUserSummary[];
  login: (email: string, pass: string) => boolean;
  loginAsGuest: () => void;
  register: (fullName: string, email: string, pass: string) => boolean;
  logout: () => void;

  // Profile & Consultation Bookings
  profile: UserProfile;
  updateProfile: (updated: Partial<UserProfile>) => void;
  bookings: ConsultationBooking[];
  myBookings: ConsultationBooking[];
  addBooking: (booking: Omit<ConsultationBooking, 'id'>) => void;
  bookingStates: Record<string, BookingState>;
  updateBookingState: (bookingId: string, state: BookingState) => void;
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
  openAuthModal: () => void;
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
  addApplication: (app: Omit<ApplicationRecord, 'id' | 'submittedAt' | 'status' | 'statusColor' | 'code'>) => void;
  cancelApplication: (appId: string) => void;
  resubmitApplicationSupplement: (appId: string, supplementNote: string) => void;
  updateApplicationStatus: (id: string, status: ApplicationStatus, notes?: string) => void;
  batchUpdateApplicationStatus: (ids: string[], status: ApplicationStatus, notes?: string) => void;
  processingLog: ProcessingLogEntry[];
  selectedAppForDetail: ApplicationRecord | null;
  openApplicationDetail: (app: ApplicationRecord) => void;
  closeApplicationDetail: () => void;
  isAllApplicationsOpen: boolean;
  openAllApplications: () => void;
  closeAllApplications: () => void;

  // Universities database management
  universitiesList: University[];
  updateUniversityMetrics: (id: number, score2024: number, tuitionMin: number) => void;

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
const DEMO_PASS = '123456';
const DEMO_NAME = 'Trần Công Quý';
const SYSTEM_RESERVED_EMAILS = [
  DEMO_EMAIL,
  ACCOUNT_ADMIN.email.toLowerCase(),
  ACCOUNT_PXU.email.toLowerCase(),
  'khach@unipath.vn',
];

const STORAGE_KEYS = {
  SESSION: 'unipath_v2_auth_session',
  REGISTERED_USERS: 'unipath_registered_users',
  SHARED_APPS: 'unipath_v2_shared_applications',
  SHARED_BOOKINGS: 'unipath_v2_shared_bookings',
  SHARED_BOOKING_STATES: 'unipath_v2_shared_booking_states',
  SHARED_UNIS: 'unipath_v2_shared_universities',
  SHARED_LOGS: 'unipath_v2_shared_processing_log',
  SHARED_NOTIFICATIONS: 'unipath_v2_shared_notifications',
  REDUCE_MOTION: 'unipath_reduce_motion',
  NOTIFICATIONS_ENABLED: 'unipath_notifications',
  USER_PREFIX: 'unipath_v2_user_',
};

const GUEST_USER: CurrentUser = {
  email: 'khach@unipath.vn',
  name: 'Khách trải nghiệm',
  role: 'student',
  title: 'Khách vãng lai',
  organization: 'Trải nghiệm tự do',
  avatar: '/images/avatar_user.png',
};

const DEFAULT_AI_MATCH: AIMatchState = {
  hasEvaluated: false,
  score: 24.0,
  budget: 25,
  region: 'Tất cả',
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
  ...createCleanStudentProfile('Khách trải nghiệm', 'khach@unipath.vn'),
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
    status: 'Đang xét duyệt',
    statusColor: getStatusMeta('Đang xét duyệt').dot,
    notes: 'Đăng ký xét tuyển sớm đợt 1 bằng kết quả học bạ THPT và chứng chỉ tin học quốc tế. Đăng ký xét học bổng OJT doanh nghiệp.',
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
    status: 'Thiếu hồ sơ',
    statusColor: getStatusMeta('Thiếu hồ sơ').dot,
    notes: 'Cần bổ sung bản scan học bạ học kỳ 1 lớp 12 có dấu mộc đỏ và chứng chỉ ngoại ngữ quốc tế trước ngày 25/11.',
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
    status: 'Đã hủy',
    statusColor: getStatusMeta('Đã hủy').dot,
    notes: 'Thí sinh chủ động hủy hồ sơ xét tuyển để điều chỉnh thứ tự nguyện vọng ưu tiên.',
    cancelReason: 'Thí sinh tự hủy hồ sơ',
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
    status: 'Đã bị hủy',
    statusColor: getStatusMeta('Đã bị hủy').dot,
    notes: 'Hội đồng tuyển sinh từ chối hồ sơ do tổng điểm tổ hợp chưa đạt ngưỡng đảm bảo chất lượng đầu vào khối sức khỏe.',
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
    status: 'Thiếu hồ sơ',
    statusColor: getStatusMeta('Thiếu hồ sơ').dot,
    notes: 'Cần nộp bổ sung bản sao công chứng CCCD và Portfolio sản phẩm sáng tạo cá nhân trước ngày 25/11.',
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
    status: 'Đã trúng tuyển',
    statusColor: getStatusMeta('Đã trúng tuyển').dot,
    notes: 'Đủ điều kiện trúng tuyển sớm đợt 1 và đạt học bổng Tài năng Trẻ PXU 30% học phí toàn khóa.',
  },
];

const INITIAL_BOOKINGS: ConsultationBooking[] = [
  {
    id: 'bk-1',
    name: DEMO_NAME,
    email: DEMO_EMAIL,
    phone: '0912 345 678',
    dateTime: '14:30 - 15/11/2026',
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
    dateTime: '09:00 - 16/11/2026',
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
    dateTime: '16:00 - 17/11/2026',
    channel: 'Google Meet 1-1',
    uniId: 12,
    uniName: 'Đại học Bách Khoa - ĐH Đà Nẵng',
    uniCode: 'DUT',
    major: 'Kỹ thuật Ô tô',
    notes: 'Hỏi về chỉ tiêu xét điểm thi ĐGNL và chương trình kỹ sư chất lượng cao.',
  },
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-init-1',
    title: 'Khai mạc Virtual EduFair 2026',
    body: 'Ngày hội tuyển sinh số quy tụ 30 trường Đại học Bắc – Trung – Nam chính thức mở cổng tư vấn trực tuyến.',
    time: '15 phút trước',
    read: false,
    type: 'promo',
    targetRole: 'all',
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

function formatNowVi(): string {
  const now = new Date();
  const d = now.getDate().toString().padStart(2, '0');
  const m = (now.getMonth() + 1).toString().padStart(2, '0');
  const y = now.getFullYear();
  const hh = now.getHours().toString().padStart(2, '0');
  const mm = now.getMinutes().toString().padStart(2, '0');
  return `${d}/${m}/${y} ${hh}:${mm}`;
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
    favoriteIds: [11],
    compareIds: [],
    hollandResult: null,
    aiMatchState: { ...DEFAULT_AI_MATCH },
  };
}

function loadPersonalStore(email: string, name: string): PerUserPersonalStore {
  const clean = email.trim().toLowerCase();
  const fallback = getDefaultPersonalStore(clean, name);
  return readJsonStorage<PerUserPersonalStore>(`${STORAGE_KEYS.USER_PREFIX}${clean}`, fallback);
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
      favoriteIds: [11, 1, 21],
      compareIds: [11, 12],
      hollandResult: null,
      aiMatchState: { ...DEFAULT_AI_MATCH },
    };
  }, [initialSession]);

  // --- Auth & RBAC State ---
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(initialSession.isLoggedIn);
  const [isGuest, setIsGuest] = useState<boolean>(initialSession.isGuest);
  const [user, setUser] = useState<CurrentUser>(initialSession.user);

  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUserSummary[]>(() => {
    const list = readJsonStorage<StoredRegisteredUser[]>(STORAGE_KEYS.REGISTERED_USERS, []);
    return list.map(({ name, email, createdAt }) => ({ name, email, createdAt }));
  });

  // --- Per-User Personal State ---
  const [profile, setProfile] = useState<UserProfile>(initialPersonal.profile);
  const [favoriteIds, setFavoriteIds] = useState<number[]>(initialPersonal.favoriteIds);
  const [compareIds, setCompareIds] = useState<number[]>(initialPersonal.compareIds);
  const [hollandResult, setHollandResult] = useState<HollandResult | null>(
    initialPersonal.hollandResult
  );
  const [aiMatchState, setAIMatchState] = useState<AIMatchState>(initialPersonal.aiMatchState);

  // --- Shared Institutional State (Persisted across role switches!) ---
  const [universitiesList, setUniversitiesList] = useState<University[]>(() =>
    readJsonStorage<University[]>(STORAGE_KEYS.SHARED_UNIS, UNIVERSITIES)
  );
  const [applications, setApplications] = useState<ApplicationRecord[]>(() =>
    readJsonStorage<ApplicationRecord[]>(STORAGE_KEYS.SHARED_APPS, INITIAL_APPLICATIONS)
  );
  const [bookings, setBookings] = useState<ConsultationBooking[]>(() =>
    readJsonStorage<ConsultationBooking[]>(STORAGE_KEYS.SHARED_BOOKINGS, INITIAL_BOOKINGS)
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

  // --- Automatic View Mode Detection (100% Responsive, zero manual toggles, zero toasts) ---
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

  // --- Toast Helper ---
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3000);
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

  // --- Persist Per-User Personal Store (for authenticated non-guest students) ---
  useEffect(() => {
    if (!isLoggedIn || isGuest || user.role !== 'student') return;
    const clean = user.email.trim().toLowerCase();
    writeJsonStorage<PerUserPersonalStore>(`${STORAGE_KEYS.USER_PREFIX}${clean}`, {
      profile,
      favoriteIds,
      compareIds,
      hollandResult,
      aiMatchState,
    });
  }, [isLoggedIn, isGuest, user, profile, favoriteIds, compareIds, hollandResult, aiMatchState]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REDUCE_MOTION, reduceMotion.toString());
  }, [reduceMotion]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED, notifications.toString());
  }, [notifications]);

  // --- Helper: Push Dynamic Notification ---
  const pushNotification = (item: Omit<NotificationItem, 'id' | 'time' | 'read'>) => {
    const newNotif: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      time: formatNowVi(),
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
    return bookings.filter(
      (b) =>
        (b.email && b.email.trim().toLowerCase() === targetEmail) ||
        (!b.email && b.name.trim().toLowerCase() === user.name.trim().toLowerCase())
    );
  }, [bookings, isLoggedIn, isGuest, user]);

  const visibleNotifications = useMemo<NotificationItem[]>(() => {
    const currentEmail = user.email.trim().toLowerCase();
    return allNotifications.filter((n) => {
      if (n.targetEmail) {
        if (!isLoggedIn || isGuest) return false;
        return n.targetEmail.trim().toLowerCase() === currentEmail;
      }
      if (!n.targetRole || n.targetRole === 'all') return true;
      return n.targetRole === user.role;
    });
  }, [allNotifications, isLoggedIn, isGuest, user]);

  const unreadNotificationCount = useMemo<number>(() => {
    if (!notifications) return 0;
    return visibleNotifications.filter((n) => !n.read).length;
  }, [visibleNotifications, notifications]);

  const markNotificationRead = (id: string) => {
    setAllNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    const visibleIds = new Set(visibleNotifications.map((n) => n.id));
    setAllNotifications((prev) =>
      prev.map((n) => (visibleIds.has(n.id) ? { ...n, read: true } : n))
    );
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
  };

  const loginAdmin = () => {
    setIsLoggedIn(true);
    setIsGuest(false);
    setUser(ACCOUNT_ADMIN);
    setSelectedAppForDetail(null);
    setIsAuthModalOpen(false);
    showToast('Đăng nhập Quản trị viên Hệ Thống UniPath 2.0');
  };

  const loginPXU = () => {
    setIsLoggedIn(true);
    setIsGuest(false);
    setUser(ACCOUNT_PXU);
    setSelectedAppForDetail(null);
    setIsAuthModalOpen(false);
    showToast('Đăng nhập Cổng Tuyển sinh ĐH Phú Xuân (PXU)');
  };

  const login = (email: string, pass: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail === 'admin@unipath.vn') {
      if (pass === 'admin123') {
        loginAdmin();
        return true;
      }
      return false;
    }
    if (cleanEmail === 'tuyensinh@pxu.edu.vn') {
      if (pass === 'pxu123') {
        loginPXU();
        return true;
      }
      return false;
    }
    if (cleanEmail === DEMO_EMAIL) {
      if (pass === DEMO_PASS) {
        applyStudentSession(ACCOUNT_STUDENT);
        showToast(`Xin chào ${ACCOUNT_STUDENT.name}! Đã tải dữ liệu hồ sơ của bạn.`);
        return true;
      }
      return false;
    }

    const storedUsers = readJsonStorage<StoredRegisteredUser[]>(STORAGE_KEYS.REGISTERED_USERS, []);
    const match = storedUsers.find((u) => u.email === cleanEmail && u.pass === pass);
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
    setFavoriteIds([11, 1, 21]);
    setCompareIds([11, 12]);
    setHollandResult(null);
    setAIMatchState({ ...DEFAULT_AI_MATCH });
    setActiveTab(0);
    setIsAuthModalOpen(false);
    showToast('Đang khám phá với chế độ Khách trải nghiệm');
  };

  const register = (fullName: string, email: string, pass: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || pass.length < 6) return false;
    if (SYSTEM_RESERVED_EMAILS.includes(cleanEmail)) {
      return false;
    }

    const users = readJsonStorage<StoredRegisteredUser[]>(STORAGE_KEYS.REGISTERED_USERS, []);
    if (users.some((u) => u.email === cleanEmail)) {
      return false;
    }

    const cleanName = fullName.trim() || 'Thí sinh UniPath';
    const createdAt = formatNowVi();
    const newUser: StoredRegisteredUser = {
      name: cleanName,
      email: cleanEmail,
      pass,
      createdAt,
    };
    const nextUsers = [...users, newUser];
    writeJsonStorage(STORAGE_KEYS.REGISTERED_USERS, nextUsers);
    setRegisteredUsers(nextUsers.map(({ name, email: em, createdAt: ca }) => ({ name, email: em, createdAt: ca })));

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
    return true;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsGuest(false);
    setUser(GUEST_USER);
    setProfile({ ...GUEST_PROFILE });
    setFavoriteIds([11, 1, 21]);
    setCompareIds([11, 12]);
    setHollandResult(null);
    setAIMatchState({ ...DEFAULT_AI_MATCH });
    setSelectedAppForDetail(null);
    setIsAllApplicationsOpen(false);
    setIsEditProfileOpen(false);
    setIsApplyDemoOpen(false);
    setIsBookConsultationOpen(false);
    setActiveTab(0);
    showToast('Đã đăng xuất tài khoản an toàn');
  };

  // --- Universities Database Management (Admin all 30 unis; PXU only uniId === 11) ---
  const updateUniversityMetrics = (id: number, score2024: number, tuitionMin: number) => {
    const targetUni = universitiesList.find((u) => u.id === id);
    if (!targetUni) return;

    if (user.role === 'university_pxu') {
      if (targetUni.code !== 'PXU') {
        showToast('⛔ Tài khoản ĐH Phú Xuân chỉ được cập nhật chỉ số của trường ĐH Phú Xuân (PXU).');
        return;
      }
    } else if (user.role !== 'admin') {
      showToast('⛔ Chỉ Quản trị viên hoặc Ban Tuyển sinh trường sở tại mới có quyền cập nhật.');
      return;
    }

    const clampedScore = Math.min(30, Math.max(12, Number(score2024.toFixed(2))));
    const clampedTuitionMin = Math.max(0, Math.round(tuitionMin));
    const delta = Number((clampedScore - targetUni.score2024).toFixed(2));

    setUniversitiesList((prev) =>
      prev.map((u) => {
        if (u.id !== id) return u;
        const updatedCutoffs: Record<string, number> = {};
        for (const [majorName, oldCutoff] of Object.entries(u.cutoffScores)) {
          updatedCutoffs[majorName] = Math.min(
            30,
            Math.max(12, Number((oldCutoff + delta).toFixed(2)))
          );
        }
        return {
          ...u,
          score2024: clampedScore,
          tuitionMin: clampedTuitionMin,
          tuitionMax: Math.max(u.tuitionMax, clampedTuitionMin),
          cutoffScores: updatedCutoffs,
        };
      })
    );

    pushNotification({
      title: `Cập nhật điểm chuẩn & học phí ${targetUni.code}`,
      body: `${targetUni.name} vừa cập nhật điểm chuẩn tham chiếu ${clampedScore} điểm, học phí từ ${clampedTuitionMin} triệu/năm.`,
      type: 'deadline',
      targetRole: 'student',
    });

    showToast(`Đã đồng bộ điểm chuẩn & học phí ${targetUni.code} sang hệ thống AI Matching!`);
  };

  // --- Profile & Booking Handlers ---
  const updateProfile = (updated: Partial<UserProfile>) => {
    if (!requireStudentAuth('cập nhật hồ sơ cá nhân')) return;
    setProfile((prev) => {
      const next = { ...prev, ...updated, email: user.email };
      if (updated.name && updated.name.trim()) {
        setUser((u) => ({ ...u, name: updated.name!.trim() }));
      }
      return next;
    });
    showToast('Đã lưu thông tin hồ sơ cá nhân!');
  };

  const addBooking = (bookingData: Omit<ConsultationBooking, 'id'>) => {
    if (!requireStudentAuth('đặt lịch tư vấn 1-1')) return;
    const newBooking: ConsultationBooking = {
      ...bookingData,
      email: bookingData.email || user.email,
      id: `bk-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    };
    setBookings((prev) => [newBooking, ...prev]);

    pushNotification({
      title: `Đã ghi nhận lịch tư vấn 1-1 cùng ${newBooking.uniCode}`,
      body: `Khung giờ: ${newBooking.dateTime} (${newBooking.channel || 'Trực tuyến'}) — Ngành ${newBooking.major}.`,
      type: 'booking',
      targetRole: 'student',
      targetEmail: user.email,
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
  };

  const updateBookingState = (bookingId: string, state: BookingState) => {
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
    setBookingStates((prev) => ({ ...prev, [bookingId]: state }));
    const label =
      state === 'contacted' ? 'Đã liên hệ' : state === 'done' ? 'Hoàn thành tư vấn' : 'Chờ liên hệ';

    if (target.email) {
      pushNotification({
        title: `Cập nhật lịch tư vấn 1-1 (${target.uniCode}): ${label}`,
        body:
          state === 'contacted'
            ? `Ban Tuyển sinh ${target.uniName || target.uniCode} đã xác nhận lịch hẹn ngành ${target.major} (${target.dateTime}).`
            : state === 'done'
            ? `Buổi tư vấn 1-1 ngành ${target.major} cùng ${target.uniName || target.uniCode} đã hoàn thành.`
            : `Lịch tư vấn ngành ${target.major} đang ở trạng thái chờ liên hệ.`,
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

  // --- Holland Handlers ---
  const saveHollandResult = (scores: Record<HollandCode, number>): HollandResult => {
    const sorted = (Object.entries(scores) as [HollandCode, number][]).sort(
      (a, b) => b[1] - a[1]
    );
    const primaryCode = sorted[0][0];
    const topCodes = [sorted[0][0], sorted[1][0], sorted[2][0]];
    const newResult: HollandResult = {
      primaryCode,
      topCodes,
      scores,
      completedAt: new Date().toLocaleDateString('vi-VN'),
    };
    setHollandResult(newResult);
    if (isLoggedIn && !isGuest && user.role === 'student') {
      pushNotification({
        title: `Hoàn thành Trắc nghiệm Holland — Nhóm ${primaryCode}`,
        body: `Tổ hợp nổi trội của bạn là ${topCodes.join(' - ')}. Hệ thống AI Gợi ý Trường đã tự động cộng điểm ưu tiên sở thích!`,
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

  // --- Settings Handlers ---
  const toggleReduceMotion = () => {
    setReduceMotion((prev) => !prev);
    showToast(reduceMotion ? 'Đã bật hiệu ứng chuyển động' : 'Đã giảm hiệu ứng chuyển động');
  };

  const toggleNotifications = () => {
    setNotifications((prev) => !prev);
    showToast(notifications ? 'Đã tắt thông báo hệ thống' : 'Đã bật thông báo hệ thống');
  };

  const resetAllData = () => {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('unipath_')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch {
      // ignore
    }

    setRegisteredUsers([]);
    setUniversitiesList(UNIVERSITIES);
    setApplications([...INITIAL_APPLICATIONS]);
    setBookings([...INITIAL_BOOKINGS]);
    setBookingStates({});
    setProcessingLog([]);
    setAllNotifications([...INITIAL_NOTIFICATIONS]);

    setIsLoggedIn(false);
    setIsGuest(false);
    setUser(GUEST_USER);
    setProfile({ ...GUEST_PROFILE });
    setFavoriteIds([11, 1, 21]);
    setCompareIds([11, 12]);
    setHollandResult(null);
    setAIMatchState({ ...DEFAULT_AI_MATCH });
    setSelectedAppForDetail(null);
    setIsAllApplicationsOpen(false);
    setActiveTab(0);
    showToast('Đã khôi phục toàn bộ dữ liệu hệ thống về trạng thái gốc Demo!');
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

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

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

  // --- Application Lifecycle Handlers ---
  const addApplication = (
    appData: Omit<ApplicationRecord, 'id' | 'submittedAt' | 'status' | 'statusColor' | 'code'>
  ) => {
    if (!requireStudentAuth('nộp hồ sơ xét tuyển')) return;
    const dateStr = formatNowVi();
    const codeNum = Math.floor(1000 + Math.random() * 9000);
    const newRecord: ApplicationRecord = {
      ...appData,
      email: user.email,
      id: `app-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      code: `HS-2026-${appData.uniCode || 'UNI'}${codeNum}`,
      submittedAt: dateStr,
      status: 'Đang xét duyệt',
      statusColor: getStatusMeta('Đang xét duyệt').dot,
    };
    setApplications((prev) => [newRecord, ...prev]);

    pushNotification({
      title: `Nộp hồ sơ thành công: ${newRecord.code}`,
      body: `Hồ sơ xét tuyển ngành ${newRecord.major} vào ${newRecord.uniName} đã được chuyển tới Hội đồng tuyển sinh.`,
      type: 'application',
      targetRole: 'student',
      targetEmail: user.email,
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
  };

  const cancelApplication = (appId: string) => {
    if (!isLoggedIn || isGuest || user.role !== 'student') {
      showToast('⛔ Chỉ thí sinh chủ sở hữu hồ sơ mới có quyền rút/hủy hồ sơ xét tuyển.');
      return;
    }
    const target = applications.find((a) => a.id === appId);
    if (!target) return;
    if (target.email.trim().toLowerCase() !== user.email.trim().toLowerCase()) {
      showToast('⛔ Bạn không có quyền thao tác trên hồ sơ của thí sinh khác!');
      return;
    }
    if (target.status !== 'Đang xét duyệt') {
      showToast('⛔ Chỉ có thể rút hồ sơ khi đang ở trạng thái "Đang xét duyệt".');
      return;
    }

    const updated: ApplicationRecord = {
      ...target,
      status: 'Đã hủy',
      statusColor: getStatusMeta('Đã hủy').dot,
      cancelReason: 'Thí sinh chủ động yêu cầu rút hồ sơ xét tuyển',
    };

    setApplications((prev) => prev.map((app) => (app.id === appId ? updated : app)));
    if (selectedAppForDetail?.id === appId) {
      setSelectedAppForDetail(updated);
    }

    setProcessingLog((prev) =>
      [
        {
          id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          appCode: target.code,
          candidateName: target.candidateName,
          uniCode: target.uniCode,
          fromStatus: target.status,
          toStatus: 'Đã hủy' as ApplicationStatus,
          actorName: user.name,
          actorRole: user.role,
          time: formatNowVi(),
          note: 'Thí sinh tự rút hồ sơ',
        },
        ...prev,
      ].slice(0, 50)
    );

    showToast(`Đã rút hồ sơ ${target.code} thành công.`);
  };

  const resubmitApplicationSupplement = (appId: string, supplementNote: string) => {
    if (!isLoggedIn || isGuest || user.role !== 'student') {
      showToast('⛔ Chỉ thí sinh chủ sở hữu mới có thể gửi bổ sung hồ sơ.');
      return;
    }
    const target = applications.find((a) => a.id === appId);
    if (!target) return;
    if (target.email.trim().toLowerCase() !== user.email.trim().toLowerCase()) {
      showToast('⛔ Không thể chỉnh sửa hồ sơ của thí sinh khác!');
      return;
    }
    if (target.status !== 'Thiếu hồ sơ') {
      showToast('Hồ sơ này hiện không ở trạng thái chờ bổ sung.');
      return;
    }

    const cleanSupplement = supplementNote.trim() || 'Đã cập nhật đầy đủ minh chứng học bạ & CCCD.';
    const updatedNotes = `[Thí sinh đã bổ sung ${formatNowVi()}]: ${cleanSupplement}`;

    const updated: ApplicationRecord = {
      ...target,
      status: 'Đang xét duyệt',
      statusColor: getStatusMeta('Đang xét duyệt').dot,
      notes: updatedNotes,
    };

    setApplications((prev) => prev.map((app) => (app.id === appId ? updated : app)));
    if (selectedAppForDetail?.id === appId) {
      setSelectedAppForDetail(updated);
    }

    const supplementLogEntry: ProcessingLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      appCode: target.code,
      candidateName: target.candidateName,
      uniCode: target.uniCode,
      fromStatus: 'Thiếu hồ sơ',
      toStatus: 'Đang xét duyệt',
      actorName: user.name,
      actorRole: 'student',
      time: formatNowVi(),
      note: cleanSupplement,
    };

    setProcessingLog((prev) => [supplementLogEntry, ...prev].slice(0, 50));

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
  };

  const applyInstitutionalStatusChange = (
    ids: string[],
    status: ApplicationStatus,
    customNotes?: string
  ) => {
    if (user.role === 'student') {
      showToast('⛔ Chỉ Admin hoặc Ban Tuyển sinh trường mới có quyền thẩm định hồ sơ.');
      return;
    }

    const validTargets = applications.filter((a) => {
      if (!ids.includes(a.id)) return false;
      if (user.role === 'university_pxu' && a.uniCode !== 'PXU') return false;
      return true;
    });

    if (validTargets.length === 0) {
      if (user.role === 'university_pxu') {
        showToast('⛔ Cổng ĐH Phú Xuân chỉ được xử lý hồ sơ nộp vào PXU.');
      }
      return;
    }

    const validSet = new Set(validTargets.map((t) => t.id));
    const statusDot = getStatusMeta(status).dot;
    const trimmedCustomNote = customNotes?.trim();

    const defaultFeedbackByStatus: Record<ApplicationStatus, string> = {
      'Đã trúng tuyển':
        'Hội đồng tuyển sinh xác nhận thí sinh ĐỦ ĐIỀU KIỆN TRÚNG TUYỂN SỚM. Vui lòng theo dõi hướng dẫn xác nhận nhập học.',
      'Hồ sơ hợp lệ':
        'Đã thẩm định đầy đủ minh chứng CCCD & Học bạ hợp lệ. Hồ sơ đang được trình Hội đồng xét duyệt trúng tuyển.',
      'Thiếu hồ sơ':
        'Đề nghị thí sinh kiểm tra và gửi bổ sung bản chụp rõ nét Học bạ THPT / Chứng chỉ ưu tiên để tiếp tục xét duyệt.',
      'Đã bị hủy':
        'Hồ sơ chưa đáp ứng điều kiện ngưỡng đảm bảo chất lượng đầu vào của ngành đăng ký trong đợt xét tuyển này.',
      'Đang xét duyệt': 'Hồ sơ đang trong quá trình thẩm định bởi Hội đồng tuyển sinh.',
      'Đã hủy': 'Hồ sơ đã dừng xét tuyển.',
    };

    setApplications((prev) =>
      prev.map((app) => {
        if (!validSet.has(app.id)) return app;
        const nextNote = trimmedCustomNote || defaultFeedbackByStatus[status] || app.notes;
        const updated: ApplicationRecord = {
          ...app,
          status,
          statusColor: statusDot,
          notes: nextNote,
          cancelReason:
            status === 'Đã bị hủy'
              ? trimmedCustomNote || 'Hội đồng tuyển sinh từ chối xét duyệt'
              : app.cancelReason,
        };
        if (selectedAppForDetail?.id === app.id) {
          setSelectedAppForDetail(updated);
        }
        return updated;
      })
    );

    const timeNow = formatNowVi();
    const newLogs: ProcessingLogEntry[] = validTargets.map((target, idx) => ({
      id: `log-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
      appCode: target.code,
      candidateName: target.candidateName,
      uniCode: target.uniCode,
      fromStatus: target.status,
      toStatus: status,
      actorName: user.name,
      actorRole: user.role,
      time: timeNow,
      note: trimmedCustomNote,
    }));

    setProcessingLog((prev) => [...newLogs, ...prev].slice(0, 50));

    // Push notifications to each affected student
    const newStudentNotifs: NotificationItem[] = validTargets.map((target, idx) => {
      const noteText = trimmedCustomNote || defaultFeedbackByStatus[status];
      const titleMap: Record<ApplicationStatus, string> = {
        'Đã trúng tuyển': `🎉 Chúc mừng! Hồ sơ ${target.code} ĐÃ TRÚNG TUYỂN SỚM`,
        'Hồ sơ hợp lệ': `✅ Hồ sơ ${target.code} (${target.uniCode}) đã được xác nhận hợp lệ`,
        'Thiếu hồ sơ': `📎 Yêu cầu bổ sung minh chứng hồ sơ ${target.code} (${target.uniCode})`,
        'Đã bị hủy': `⚠️ Kết quả thẩm định hồ sơ ${target.code} (${target.uniCode})`,
        'Đang xét duyệt': `🔄 Hồ sơ ${target.code} đang được xét duyệt`,
        'Đã hủy': `Hồ sơ ${target.code} đã hủy`,
      };
      return {
        id: `notif-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
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

    if (validTargets.length === 1) {
      showToast(`Đã cập nhật hồ sơ ${validTargets[0].code} → "${status}"`);
    } else {
      showToast(`Đã cập nhật hàng loạt ${validTargets.length} hồ sơ → "${status}"`);
    }
  };

  const updateApplicationStatus = (id: string, status: ApplicationStatus, notes?: string) => {
    applyInstitutionalStatusChange([id], status, notes);
  };

  const batchUpdateApplicationStatus = (
    ids: string[],
    status: ApplicationStatus,
    notes?: string
  ) => {
    applyInstitutionalStatusChange(ids, status, notes);
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
