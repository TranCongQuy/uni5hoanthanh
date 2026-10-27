import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  ApplicationRecord,
  ConsultationBooking,
  HollandCode,
  University,
  UserProfile,
} from '../types';

interface HollandResult {
  primaryCode: HollandCode;
  topCodes: HollandCode[];
  scores: Record<HollandCode, number>;
  completedAt: string;
}

interface AppContextType {
  // Auth
  isLoggedIn: boolean;
  isGuest: boolean;
  user: { email: string; name: string };
  login: (email: string, pass: string) => boolean;
  loginDemo: () => void;
  loginAsGuest: () => void;
  register: (fullName: string, email: string, pass: string) => boolean;
  logout: () => void;

  // Profile
  profile: UserProfile;
  updateProfile: (updated: Partial<UserProfile>) => void;
  bookings: ConsultationBooking[];
  addBooking: (booking: Omit<ConsultationBooking, 'id'>) => void;
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

  // Settings
  reduceMotion: boolean;
  notifications: boolean;
  toggleReduceMotion: () => void;
  toggleNotifications: () => void;
  resetAllData: () => void;

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
  addApplication: (app: Omit<ApplicationRecord, 'id' | 'submittedAt' | 'status' | 'statusColor' | 'code'>) => void;
  cancelApplication: (appId: string) => void;
  selectedAppForDetail: ApplicationRecord | null;
  openApplicationDetail: (app: ApplicationRecord) => void;
  closeApplicationDetail: () => void;
  isAllApplicationsOpen: boolean;
  openAllApplications: () => void;
  closeAllApplications: () => void;

  // Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Search keyword sync
  searchKeyword: string;
  setSearchKeyword: (kw: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEMO_EMAIL = 'quy@unipath.vn';
const DEMO_PASS = '123456';
const DEMO_NAME = 'Trần Công Quý';

const INITIAL_APPLICATIONS: ApplicationRecord[] = [
  {
    id: 'app-1',
    code: 'HS-2026-PXU01',
    uniId: 11,
    uniName: 'Đại học Phú Xuân',
    uniCode: 'PXU',
    major: 'Công nghệ thông tin (AI & Cloud)',
    candidateName: 'Trần Công Quý',
    phone: '0912 345 678',
    email: 'quy@unipath.vn',
    score: 24.5,
    submittedAt: '24/10/2026 09:30',
    status: 'Đang xét duyệt',
    statusColor: '#F59E0B',
    notes: 'Đăng ký xét tuyển sớm đợt 1 bằng kết quả học bạ THPT và chứng chỉ tin học quốc tế.',
  },
  {
    id: 'app-2',
    code: 'HS-2026-BKA02',
    uniId: 1,
    uniName: 'Đại học Bách Khoa Hà Nội',
    uniCode: 'BKA',
    major: 'Khoa học Máy tính (IT1)',
    candidateName: 'Trần Công Quý',
    phone: '0912 345 678',
    email: 'quy@unipath.vn',
    score: 28.5,
    submittedAt: '22/10/2026 15:45',
    status: 'Hồ sơ hợp lệ',
    statusColor: '#10B981',
    notes: 'Đã hoàn tất tải lên CCCD, Học bạ và Phiếu điểm kỳ thi đánh giá tư duy.',
  },
  {
    id: 'app-3',
    code: 'HS-2026-FTU03',
    uniId: 2,
    uniName: 'Đại học Ngoại Thương',
    uniCode: 'FTU',
    major: 'Kinh tế Quốc tế',
    candidateName: 'Trần Công Quý',
    phone: '0912 345 678',
    email: 'quy@unipath.vn',
    score: 28.2,
    submittedAt: '20/10/2026 11:15',
    status: 'Thiếu hồ sơ',
    statusColor: '#2563EB',
    notes: 'Cần bổ sung bản scan học bạ kỳ 2 lớp 12 và chứng chỉ tiếng Anh IELTS trước ngày 15/11.',
  },
  {
    id: 'app-4',
    code: 'HS-2026-NEU04',
    uniId: 3,
    uniName: 'Đại học Kinh tế Quốc dân',
    uniCode: 'NEU',
    major: 'Marketing Số & Thương mại',
    candidateName: 'Trần Công Quý',
    phone: '0912 345 678',
    email: 'quy@unipath.vn',
    score: 27.5,
    submittedAt: '18/10/2026 14:20',
    status: 'Đã hủy',
    statusColor: '#64748B',
    notes: 'Thí sinh chủ động hủy hồ sơ xét tuyển để đăng ký đổi sang nguyện vọng khác.',
    cancelReason: 'Thí sinh tự hủy hồ sơ',
  },
  {
    id: 'app-5',
    code: 'HS-2026-HMU05',
    uniId: 4,
    uniName: 'Đại học Y Hà Nội',
    uniCode: 'HMU',
    major: 'Kỹ thuật Xét nghiệm Y học',
    candidateName: 'Trần Công Quý',
    phone: '0912 345 678',
    email: 'quy@unipath.vn',
    score: 22.0,
    submittedAt: '15/10/2026 10:00',
    status: 'Đã bị hủy',
    statusColor: '#EF4444',
    notes: 'Hồ sơ đã bị hội đồng tuyển sinh từ chối/hủy do không đạt điểm sàn nhận hồ sơ tối thiểu.',
    cancelReason: 'Nhà trường từ chối do không đủ điều kiện ngưỡng điểm sàn',
  },
];

const DEFAULT_PROFILE: UserProfile = {
  name: DEMO_NAME,
  email: DEMO_EMAIL,
  phone: '0912 345 678',
  dob: '15/08/2007',
  gender: 'Nam',
  grade: 'Lớp 12',
  school: 'THPT Chuyên Quốc Học Huế',
  province: 'Thừa Thiên Huế',
  targetMajor: 'Công nghệ thông tin (AI & Data)',
  dreamUni: 'PXU - Đại học Phú Xuân',
  expectedScore: 24.5,
  isPremium: false,
  premiumPlan: 'Gói Tiêu Chuẩn',
  avatarPath: '/images/avatar_user.png',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // --- Auth State ---
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('unipath_logged_in') === 'true';
  });

  const [isGuest, setIsGuest] = useState<boolean>(() => {
    return localStorage.getItem('unipath_is_guest') === 'true';
  });

  const [user, setUser] = useState<{ email: string; name: string }>(() => {
    const email = localStorage.getItem('unipath_current_email') || DEMO_EMAIL;
    const name = localStorage.getItem('unipath_current_name') || DEMO_NAME;
    return { email, name };
  });

  // --- Profile State ---
  const [profile, setProfile] = useState<UserProfile>(() => {
    const raw = localStorage.getItem('unipath_user_profile');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // fallback
      }
    }
    return DEFAULT_PROFILE;
  });

  const [bookings, setBookings] = useState<ConsultationBooking[]>(() => {
    const raw = localStorage.getItem('unipath_bookings');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // fallback
      }
    }
    return [
      {
        id: 'bk-1',
        name: DEMO_NAME,
        phone: '0912 345 678',
        dateTime: '14:30 15/11/2026',
        uniCode: 'PXU',
        major: 'Công nghệ Thông tin',
        notes: 'Muốn tìm hiểu kỹ hơn về học bổng OJT và cam kết việc làm',
      },
    ];
  });

  // --- Applications State ---
  const [applications, setApplications] = useState<ApplicationRecord[]>(() => {
    const raw = localStorage.getItem('unipath_applications');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // fallback
      }
    }
    return INITIAL_APPLICATIONS;
  });

  const [selectedAppForDetail, setSelectedAppForDetail] = useState<ApplicationRecord | null>(null);
  const [isAllApplicationsOpen, setIsAllApplicationsOpen] = useState<boolean>(false);

  // --- Wishlist State ---
  const [favoriteIds, setFavoriteIds] = useState<number[]>(() => {
    const raw = localStorage.getItem('unipath_wishlist');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // fallback
      }
    }
    return [11, 1, 21]; // Default: PXU, BKA, HCMUT
  });

  // --- Compare State ---
  const [compareIds, setCompareIds] = useState<number[]>(() => {
    const raw = localStorage.getItem('unipath_compare');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // fallback
      }
    }
    return [11, 12]; // Default: PXU, DUT
  });

  // --- Holland Quiz Result ---
  const [hollandResult, setHollandResult] = useState<HollandResult | null>(() => {
    const raw = localStorage.getItem('unipath_holland_result');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // fallback
      }
    }
    return null;
  });

  // --- Settings ---
  const [reduceMotion, setReduceMotion] = useState<boolean>(() => {
    return localStorage.getItem('unipath_reduce_motion') === 'true';
  });

  const [notifications, setNotifications] = useState<boolean>(() => {
    return localStorage.getItem('unipath_notifications') !== 'false';
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
  const [consultationTargetUni] = useState<University | null>(null);
  const [isApplyDemoOpen, setIsApplyDemoOpen] = useState(false);
  const [applyDemoTargetUni, setApplyDemoTargetUni] = useState<University | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // --- Toast Helper ---
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  // --- Sync Effects to LocalStorage ---
  useEffect(() => {
    localStorage.setItem('unipath_logged_in', isLoggedIn.toString());
    localStorage.setItem('unipath_is_guest', isGuest.toString());
    localStorage.setItem('unipath_current_email', user.email);
    localStorage.setItem('unipath_current_name', user.name);
  }, [isLoggedIn, isGuest, user]);

  useEffect(() => {
    localStorage.setItem('unipath_user_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('unipath_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('unipath_wishlist', JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  useEffect(() => {
    localStorage.setItem('unipath_compare', JSON.stringify(compareIds));
  }, [compareIds]);

  useEffect(() => {
    localStorage.setItem('unipath_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    if (hollandResult) {
      localStorage.setItem('unipath_holland_result', JSON.stringify(hollandResult));
    } else {
      localStorage.removeItem('unipath_holland_result');
    }
  }, [hollandResult]);

  useEffect(() => {
    localStorage.setItem('unipath_reduce_motion', reduceMotion.toString());
  }, [reduceMotion]);

  useEffect(() => {
    localStorage.setItem('unipath_notifications', notifications.toString());
  }, [notifications]);

  // --- Auth Handlers ---
  const login = (email: string, pass: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail === DEMO_EMAIL && pass === DEMO_PASS) {
      setIsLoggedIn(true);
      setIsGuest(false);
      setUser({ email: DEMO_EMAIL, name: DEMO_NAME });
      setProfile((prev) => ({ ...prev, name: DEMO_NAME, email: DEMO_EMAIL }));
      showToast(`Chào mừng bạn trở lại, ${DEMO_NAME}!`);
      setIsAuthModalOpen(false);
      return true;
    }

    const storedUsersRaw = localStorage.getItem('unipath_registered_users');
    if (storedUsersRaw) {
      try {
        const users = JSON.parse(storedUsersRaw);
        const match = users.find((u: { email: string; pass: string; name: string }) => u.email === cleanEmail && u.pass === pass);
        if (match) {
          setIsLoggedIn(true);
          setIsGuest(false);
          setUser({ email: match.email, name: match.name });
          setProfile((prev) => ({ ...prev, name: match.name, email: match.email }));
          showToast(`Đăng nhập thành công! Xin chào ${match.name}`);
          setIsAuthModalOpen(false);
          return true;
        }
      } catch {
        // ignore
      }
    }
    return false;
  };

  const loginDemo = () => {
    setIsLoggedIn(true);
    setIsGuest(false);
    setUser({ email: DEMO_EMAIL, name: DEMO_NAME });
    setProfile((prev) => ({ ...prev, name: DEMO_NAME, email: DEMO_EMAIL }));
    showToast('Đã đăng nhập bằng tài khoản Demo!');
    setIsAuthModalOpen(false);
  };

  const loginAsGuest = () => {
    setIsLoggedIn(true);
    setIsGuest(true);
    setUser({ email: 'khach@unipath.vn', name: 'Khách trải nghiệm' });
    showToast('Tiếp tục với chế độ Khách');
    setIsAuthModalOpen(false);
  };

  const register = (fullName: string, email: string, pass: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || pass.length < 6) return false;

    let users: Array<{ name: string; email: string; pass: string }> = [];
    const storedUsersRaw = localStorage.getItem('unipath_registered_users');
    if (storedUsersRaw) {
      try {
        users = JSON.parse(storedUsersRaw);
      } catch {
        users = [];
      }
    }

    if (users.some((u) => u.email === cleanEmail) || cleanEmail === DEMO_EMAIL) {
      return false; // Email already exists
    }

    const newUser = {
      name: fullName.trim() || 'Học sinh Unipath',
      email: cleanEmail,
      pass,
    };
    users.push(newUser);
    localStorage.setItem('unipath_registered_users', JSON.stringify(users));

    setIsLoggedIn(true);
    setIsGuest(false);
    setUser({ email: newUser.email, name: newUser.name });
    setProfile((prev) => ({ ...prev, name: newUser.name, email: newUser.email }));
    showToast('Tạo tài khoản thành công!');
    setIsAuthModalOpen(false);
    return true;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsGuest(false);
    setUser({ email: '', name: '' });
    showToast('Đã đăng xuất tài khoản');
  };

  // --- Profile Handlers ---
  const updateProfile = (updated: Partial<UserProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updated };
      if (updated.name) {
        setUser((u) => ({ ...u, name: updated.name! }));
      }
      return next;
    });
    showToast('Đã lưu thông tin hồ sơ!');
  };

  const addBooking = (bookingData: Omit<ConsultationBooking, 'id'>) => {
    const newBooking: ConsultationBooking = {
      ...bookingData,
      id: `bk-${Date.now()}`,
    };
    setBookings((prev) => [newBooking, ...prev]);
    showToast('Đặt lịch tư vấn 1-1 thành công!');
  };

  const upgradePremium = (planName: string) => {
    setProfile((prev) => ({
      ...prev,
      isPremium: true,
      premiumPlan: planName,
    }));
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
    showToast(notifications ? 'Đã tắt thông báo' : 'Đã bật thông báo');
  };

  const resetAllData = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setIsGuest(false);
    setUser({ email: DEMO_EMAIL, name: DEMO_NAME });
    setProfile(DEFAULT_PROFILE);
    setBookings([]);
    setFavoriteIds([]);
    setCompareIds([]);
    setHollandResult(null);
    showToast('Đã xóa toàn bộ dữ liệu ứng dụng!');
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

  const openEditProfile = () => setIsEditProfileOpen(true);
  const closeEditProfile = () => setIsEditProfileOpen(false);

  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);

  const openNotifications = () => setIsNotificationsOpen(true);
  const closeNotifications = () => setIsNotificationsOpen(false);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const openBookConsultation = () => {
    setIsChatBotOpen(true);
  };
  const closeBookConsultation = () => {
    setIsBookConsultationOpen(false);
  };

  const openApplyDemo = (uni: University) => {
    setApplyDemoTargetUni(uni);
    setIsApplyDemoOpen(true);
  };
  const closeApplyDemo = () => setIsApplyDemoOpen(false);

  // --- Application Handlers ---
  const addApplication = (appData: Omit<ApplicationRecord, 'id' | 'submittedAt' | 'status' | 'statusColor' | 'code'>) => {
    const now = new Date();
    const dateStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const codeNum = Math.floor(1000 + Math.random() * 9000);
    const newRecord: ApplicationRecord = {
      ...appData,
      id: `app-${Date.now()}`,
      code: `HS-2026-${appData.uniCode || 'UNI'}${codeNum}`,
      submittedAt: dateStr,
      status: 'Đang xét duyệt',
      statusColor: '#F59E0B',
    };
    setApplications((prev) => [newRecord, ...prev]);
    showToast(`Nộp hồ sơ xét tuyển thành công! Mã hồ sơ: ${newRecord.code}`);
  };

  const cancelApplication = (appId: string) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          const updated: ApplicationRecord = {
            ...app,
            status: 'Đã hủy',
            statusColor: '#64748B',
            cancelReason: 'Thí sinh chủ động yêu cầu hủy hồ sơ',
          };
          if (selectedAppForDetail?.id === appId) {
            setSelectedAppForDetail(updated);
          }
          return updated;
        }
        return app;
      })
    );
    showToast('Đã hủy hồ sơ xét tuyển thành công.');
  };

  const openApplicationDetail = (app: ApplicationRecord) => {
    setSelectedAppForDetail(app);
  };

  const closeApplicationDetail = () => {
    setSelectedAppForDetail(null);
  };

  const openAllApplications = () => setIsAllApplicationsOpen(true);
  const closeAllApplications = () => setIsAllApplicationsOpen(false);

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        isGuest,
        user,
        login,
        loginDemo,
        loginAsGuest,
        register,
        logout,
        profile,
        updateProfile,
        bookings,
        addBooking,
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
        addApplication,
        cancelApplication,
        selectedAppForDetail,
        openApplicationDetail,
        closeApplicationDetail,
        isAllApplicationsOpen,
        openAllApplications,
        closeAllApplications,
        toastMessage,
        showToast,
        searchKeyword,
        setSearchKeyword,
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
