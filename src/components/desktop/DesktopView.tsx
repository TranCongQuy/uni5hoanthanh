import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Sparkles,
  Compass,
  Home,
  Radio,
  User,
  Search,
  Bell,
  Bot,
  Scale,
  GraduationCap,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Heart,
  ChevronRight,
  ChevronLeft,
  X,
  Star,
  Users,
  Send,
  Sliders,
  HelpCircle,
  ThumbsUp,
  Share2,
  CheckCircle2,
  GitCompare,
  Settings,
  Calendar,
  Crown,
  Trash2,
  LogIn,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import {
  QUIZ_QUESTIONS,
  HOLLAND_NAMES,
  HOLLAND_MAJORS,
  getHollandName,
} from '../../data/MockData';
import { getStatusMeta } from '../../types';
import type { HollandCode, MatchResult, EvaluationGroup } from '../../types';
import { UniversityAvatar, ImageSafe, Button } from '../common/UI';
import { SoundFX } from '../../utils/sound';
import { RadarChart } from '../charts/RadarChart';
import { DonutChart } from '../charts/DonutChart';
import { evaluateMatching } from '../../services/MatchingService';

const QUIZ_OPTIONS = [
  {
    title: 'Rất thích / Hoàn toàn đúng',
    sub: 'Mức độ hứng thú và phù hợp cao nhất (+3)',
    score: 3,
    icon: <Star size={18} color="#F59E0B" fill="#F59E0B" />,
  },
  {
    title: 'Khá thích / Đúng phần lớn',
    sub: 'Phù hợp với sở trường và thói quen (+2)',
    score: 2,
    icon: <Sparkles size={18} color="#2563EB" />,
  },
  {
    title: 'Phân vân / Bình thường',
    sub: 'Chưa rõ ràng hoặc không thường xuyên (+1)',
    score: 1,
    icon: <HelpCircle size={18} color="#0D9488" />,
  },
  {
    title: 'Không thích / Không đúng',
    sub: 'Hoàn toàn không phù hợp (+0)',
    score: 0,
    icon: <X size={18} color="#94A3B8" />,
  },
];

interface LiveMessage {
  id: string;
  author: string;
  avatar: string;
  time: string;
  text: string;
  isAdvisor?: boolean;
}

interface FloatingParticle {
  id: number;
  emoji: string;
  xOffset: number;
  rotation: number;
}

export const DesktopView: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    user,
    profile,
    isLoggedIn,
    isGuest,
    login,
    universitiesList,
    openNotifications,
    unreadNotificationCount,
    openChatBot,
    openUniDetail,
    openCompareModal,
    openCareerPath,
    openEditProfile,
    openSettings,
    openAuthModal,
    openBookConsultation,
    openApplicationDetail,
    openAllApplications,
    cancelApplication,
    upgradePremium,
    isCompared,
    toggleCompare,
    favoriteIds,
    toggleFavorite,
    searchKeyword,
    setSearchKeyword,
    compareIds,
    hollandResult,
    saveHollandResult,
    clearHollandResult,
    myApplications,
    myBookings,
    bookingStates,
    aiMatchState,
    saveAIMatchState,
    showToast,
    logout,
  } = useApp();

  // =========================================================================
  // TAB 0: HOME DESKTOP STATE
  // =========================================================================
  const [homeSlide, setHomeSlide] = useState(0);
  const [isHomeSlideHovered, setIsHomeSlideHovered] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string>('Tất cả');
  const [desktopVisibleCount, setDesktopVisibleCount] = useState<number>(12);
  const [desktopSearch, setDesktopSearch] = useState<string>(searchKeyword);

  // Auto rotate hero slides
  useEffect(() => {
    if (isHomeSlideHovered || activeTab !== 0) return;
    const timer = setInterval(() => {
      setHomeSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, [isHomeSlideHovered, activeTab]);

  // Sync search input
  useEffect(() => {
    setDesktopSearch(searchKeyword);
  }, [searchKeyword]);

  // Featured 8 universities
  const featuredUnis = useMemo(() => {
    return [
      universitiesList.find((u) => u.id === 1)!, // BKA
      universitiesList.find((u) => u.id === 2)!, // FTU
      universitiesList.find((u) => u.id === 3)!, // NEU
      universitiesList.find((u) => u.id === 11)!, // PXU
      universitiesList.find((u) => u.id === 12)!, // DUT
      universitiesList.find((u) => u.id === 21)!, // HCMUT
      universitiesList.find((u) => u.id === 23)!, // UEH
      universitiesList.find((u) => u.id === 24)!, // UIT
    ].filter(Boolean);
  }, [universitiesList]);

  const featuredScrollRef = useRef<HTMLDivElement>(null);

  // Filter universities by region and search
  const baseList =
    selectedRegion === 'Tất cả' ? universitiesList : universitiesList.filter((u) => u.region === selectedRegion);
  const filteredUnis = useMemo(() => {
    return baseList.filter((u) => {
      if (!desktopSearch.trim()) return true;
      const q = desktopSearch.toLowerCase().trim();
      return (
        u.name.toLowerCase().includes(q) ||
        u.code.toLowerCase().includes(q) ||
        u.loc.toLowerCase().includes(q) ||
        u.majors.some((m) => m.toLowerCase().includes(q))
      );
    });
  }, [baseList, desktopSearch]);

  // Live autocomplete matches
  const searchMatches = useMemo(() => {
    if (!desktopSearch.trim()) return [];
    const q = desktopSearch.toLowerCase().trim();
    return universitiesList.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.code.toLowerCase().includes(q) ||
        u.loc.toLowerCase().includes(q) ||
        u.majors.some((m) => m.toLowerCase().includes(q))
    ).slice(0, 5);
  }, [desktopSearch, universitiesList]);

  // =========================================================================
  // TAB 1: QUIZ (HOLLAND RIASEC) STATE
  // =========================================================================
  const [quizMode, setQuizMode] = useState<'intro' | 'taking' | 'result'>(() => {
    return hollandResult ? 'result' : 'intro';
  });
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>(new Array(12).fill(-1));

  useEffect(() => {
    if (!hollandResult) {
      setQuizMode('intro');
      setQuizIdx(0);
      setQuizAnswers(new Array(12).fill(-1));
    } else {
      setQuizMode('result');
    }
  }, [hollandResult]);

  const handleStartQuiz = () => {
    setQuizIdx(0);
    setQuizAnswers(new Array(12).fill(-1));
    setQuizMode('taking');
  };

  const handleSelectQuizOption = (optIdx: number) => {
    const next = [...quizAnswers];
    next[quizIdx] = optIdx;
    setQuizAnswers(next);
  };

  const handleNextQuiz = () => {
    if (quizAnswers[quizIdx] === -1) return;
    if (quizIdx < QUIZ_QUESTIONS.length - 1) {
      setQuizIdx((prev) => prev + 1);
    } else {
      // Calculate Holland Scores
      const scores: Record<HollandCode, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
      QUIZ_QUESTIONS.forEach((q, idx) => {
        const selected = quizAnswers[idx];
        if (selected >= 0 && selected < QUIZ_OPTIONS.length) {
          scores[q.category] += QUIZ_OPTIONS[selected].score;
        }
      });
      saveHollandResult(scores);
      setQuizMode('result');
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
    }
  };

  // =========================================================================
  // TAB 2: AI MATCHING 2026 STATE
  // =========================================================================
  interface EvaluatedMatchData {
    score: number;
    budget: number;
    region: string;
    time: string;
    evaluation: EvaluationGroup;
  }

  const [matchScore, setMatchScore] = useState<number>(aiMatchState.score ?? 15.0);
  const [matchBudget, setMatchBudget] = useState<number>(aiMatchState.budget ?? 10);
  const [matchRegion, setMatchRegion] = useState<string>(aiMatchState.region ?? 'Tất cả');
  const [matchSort, setMatchSort] = useState<'score' | 'budget' | 'location'>(aiMatchState.sortBy ?? 'score');
  const [hasMatchEvaluated, setHasMatchEvaluated] = useState<boolean>(aiMatchState.hasEvaluated ?? false);
  const [isMatchLoading, setIsMatchLoading] = useState<boolean>(false);
  const [lastMatchEvaluatedData, setLastMatchEvaluatedData] = useState<EvaluatedMatchData | null>(() => {
    if (aiMatchState.hasEvaluated) {
      return {
        score: aiMatchState.score,
        budget: aiMatchState.budget,
        region: aiMatchState.region,
        time: aiMatchState.analyzedAt || '10:30',
        evaluation: evaluateMatching(aiMatchState.score, aiMatchState.budget, hollandResult?.primaryCode || '', aiMatchState.region, universitiesList),
      };
    }
    return null;
  });

  useEffect(() => {
    setMatchScore(aiMatchState.score ?? 15.0);
    setMatchBudget(aiMatchState.budget ?? 10);
    setMatchRegion(aiMatchState.region ?? 'Tất cả');
    setMatchSort(aiMatchState.sortBy ?? 'score');
    setHasMatchEvaluated(aiMatchState.hasEvaluated ?? false);
    if (aiMatchState.hasEvaluated) {
      setLastMatchEvaluatedData({
        score: aiMatchState.score,
        budget: aiMatchState.budget,
        region: aiMatchState.region,
        time: aiMatchState.analyzedAt || '10:30',
        evaluation: evaluateMatching(aiMatchState.score, aiMatchState.budget, hollandResult?.primaryCode || '', aiMatchState.region, universitiesList),
      });
    } else {
      setLastMatchEvaluatedData(null);
    }
  }, [aiMatchState, hollandResult, universitiesList]);

  // Handlers that reset evaluation when sliders/parameters change
  const handleScoreChange = (val: number) => {
    setMatchScore(val);
    if (hasMatchEvaluated) {
      setHasMatchEvaluated(false);
      setLastMatchEvaluatedData(null);
    }
  };

  const handleBudgetChange = (val: number) => {
    setMatchBudget(val);
    if (hasMatchEvaluated) {
      setHasMatchEvaluated(false);
      setLastMatchEvaluatedData(null);
    }
  };

  const handleRegionChange = (val: string) => {
    setMatchRegion(val);
    if (hasMatchEvaluated) {
      setHasMatchEvaluated(false);
      setLastMatchEvaluatedData(null);
    }
  };

  const handleEvaluateMatching = () => {
    setIsMatchLoading(true);
    setTimeout(() => {
      const res = evaluateMatching(matchScore, matchBudget, hollandResult?.primaryCode || '', matchRegion, universitiesList);
      const timeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      setLastMatchEvaluatedData({
        score: matchScore,
        budget: matchBudget,
        region: matchRegion,
        time: timeStr,
        evaluation: res,
      });
      setHasMatchEvaluated(true);
      setIsMatchLoading(false);
      saveAIMatchState({
        hasEvaluated: true,
        score: matchScore,
        budget: matchBudget,
        region: matchRegion,
        sortBy: matchSort,
        analyzedAt: timeStr,
      });
      showToast('Đã hoàn tất phân tích cơ hội trúng tuyển 30 trường!');
    }, 600);
  };

  const sortResults = (list: MatchResult[]) => {
    return [...list].sort((a, b) => {
      if (matchSort === 'score') return b.matchingPercent - a.matchingPercent;
      if (matchSort === 'budget') return a.university.tuitionMin - b.university.tuitionMin;
      return a.university.region.localeCompare(b.university.region);
    });
  };

  // =========================================================================
  // TAB 3: LIVE STREAM (EDUFAIR) STATE
  // =========================================================================
  const [liveChatInput, setLiveChatInput] = useState('');
  const [liveReactions, setLiveReactions] = useState({ like: 342, heart: 518, clap: 189 });
  const [floatingReactions, setFloatingReactions] = useState<FloatingParticle[]>([]);
  const liveChatContainerRef = useRef<HTMLDivElement>(null);

  const triggerReaction = (type: 'like' | 'heart' | 'clap') => {
    // 1. Play sound & increment counter
    if (type === 'clap') {
      SoundFX.playClap();
      setLiveReactions((prev) => ({ ...prev, clap: prev.clap + 1 }));
    } else if (type === 'heart') {
      SoundFX.playHeart();
      setLiveReactions((prev) => ({ ...prev, heart: prev.heart + 1 }));
      confetti({ particleCount: 30, spread: 60, origin: { x: 0.35, y: 0.65 } });
    } else {
      SoundFX.playLike();
      setLiveReactions((prev) => ({ ...prev, like: prev.like + 1 }));
    }

    // 2. Spawn 4 floating emojis
    const emojisMap = {
      clap: ['👏', '👏', '🎉', '🙌'],
      heart: ['❤️', '💖', '🥰', '💕'],
      like: ['👍', '👍', '✨', '🔥'],
    };
    const list = emojisMap[type];
    const newParticles: FloatingParticle[] = list.map((emoji) => ({
      id: Date.now() + Math.random(),
      emoji,
      xOffset: (Math.random() - 0.5) * 80,
      rotation: (Math.random() - 0.5) * 36,
    }));

    setFloatingReactions((prev) => [...prev, ...newParticles]);

    // 3. Remove particles after animation finishes (1.25s)
    setTimeout(() => {
      const idsToRemove = new Set(newParticles.map((p) => p.id));
      setFloatingReactions((prev) => prev.filter((p) => !idsToRemove.has(p.id)));
    }, 1250);
  };
  const [liveMessages, setLiveMessages] = useState<LiveMessage[]>([
    {
      id: 'm1',
      author: 'TS. Lê Thành Trung',
      avatar: '/images/advisor_avatar.png',
      time: '14:28',
      text: 'Chào các em học sinh 2k8! Ban tư vấn tuyển sinh sẵn sàng giải đáp về chỉ tiêu xét tuyển học bạ đợt 1.',
      isAdvisor: true,
    },
    {
      id: 'm2',
      author: 'Ngọc Lan (Huế)',
      avatar: '/images/speaker_2.png',
      time: '14:30',
      text: 'Thầy cho em hỏi chính sách học bổng OJT và cam kết việc làm của Đại học Phú Xuân năm nay thế nào ạ?',
    },
    {
      id: 'm3',
      author: 'Ban Tuyển sinh PXU',
      avatar: '/images/advisor_avatar.png',
      time: '14:31',
      text: 'Chào Lan! PXU cam kết 100% sinh viên CNTT được thực tập doanh nghiệp có lương và học bổng 50-100%!',
      isAdvisor: true,
    },
    {
      id: 'm4',
      author: 'Quốc Huy (Đà Nẵng)',
      avatar: '/images/avatar_user.png',
      time: '14:32',
      text: 'Cho em hỏi điểm chuẩn ngành Trí tuệ nhân tạo dự kiến năm 2026 khoảng bao nhiêu điểm ạ?',
    },
  ]);

  // Rolling chat simulator
  useEffect(() => {
    if (activeTab !== 3) return;
    const pool = [
      { author: 'Trần Minh Quân (Đà Nẵng)', text: 'Em được 24.5đ khối A00 có cơ hội đỗ CNTT không ạ?' },
      { author: 'Ban Tư vấn Tuyển sinh', text: 'Chào Quân! 24.5đ em hoàn toàn yên tâm nộp nguyện vọng 1 nhé!', isAdvisor: true },
      { author: 'Lê Hoàng Yến (Quảng Trị)', text: 'Thầy cho em hỏi học phí ngành Kinh tế đối ngoại có tăng không ạ?' },
      { author: 'TS. Lê Thành Trung', text: 'Chào Yến! Học phí được giữ ổn định và cam kết không tăng quá 8%/năm!', isAdvisor: true },
      { author: 'Nguyễn Đăng Khoa (Hà Nội)', text: 'Có thể xét đồng thời kết quả thi ĐGNL và điểm thi tốt nghiệp không thầy?' },
      { author: 'Phạm Thu Trang (Nghệ An)', text: 'Hồ sơ xét tuyển sớm bao gồm những giấy tờ gì cần công chứng ạ?' },
    ];
    let poolIdx = 0;
    const interval = setInterval(() => {
      const item = pool[poolIdx % pool.length];
      poolIdx++;
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const newMsg: LiveMessage = {
        id: `m-${Date.now()}`,
        author: item.author,
        avatar: item.isAdvisor ? '/images/advisor_avatar.png' : '/images/avatar_user.png',
        time: timeStr,
        text: item.text,
        isAdvisor: item.isAdvisor,
      };
      setLiveMessages((prev) => [...prev.slice(-7), newMsg]);
      if (liveChatContainerRef.current) {
        liveChatContainerRef.current.scrollTop = liveChatContainerRef.current.scrollHeight;
      }
    }, 4500);
    return () => clearInterval(interval);
  }, [activeTab]);

  const handleSendLiveMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveChatInput.trim()) return;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const userMsg: LiveMessage = {
      id: `m-usr-${Date.now()}`,
      author: user.name || 'Trần Công Quý',
      avatar: '/images/avatar_user.png',
      time: timeStr,
      text: liveChatInput.trim(),
    };
    setLiveMessages((prev) => [...prev.slice(-7), userMsg]);
    setLiveChatInput('');
    showToast('Đã gửi bình luận vào phòng trực tiếp!');
    if (liveChatContainerRef.current) {
      setTimeout(() => {
        if (liveChatContainerRef.current) {
          liveChatContainerRef.current.scrollTop = liveChatContainerRef.current.scrollHeight;
        }
      }, 50);
    }
  };

  // =========================================================================
  // TAB 4: PROFILE & APPLICATIONS STATE
  // =========================================================================
  const [appFilterStatus, setAppFilterStatus] = useState<string>('Tất cả');
  const filteredApps = useMemo(() => {
    if (appFilterStatus === 'Tất cả') return myApplications;
    if (appFilterStatus === 'Đã bị hủy' || appFilterStatus === 'Đã hủy') {
      return myApplications.filter((app) => app.status === 'Đã bị hủy' || app.status === 'Đã hủy');
    }
    return myApplications.filter((app) => app.status === appFilterStatus);
  }, [myApplications, appFilterStatus]);

  const favoriteUnis = useMemo(
    () => universitiesList.filter((u) => favoriteIds.includes(u.id)),
    [universitiesList, favoriteIds]
  );

  const navLinks = [
    { id: 0, label: 'Trang chủ', icon: <Home size={16} /> },
    { id: 1, label: 'Trắc nghiệm', icon: <Compass size={16} /> },
    { id: 2, label: 'Gợi ý AI', icon: <Sparkles size={16} /> },
    { id: 3, label: 'EduFair', icon: <Radio size={16} /> },
    { id: 4, label: 'Hồ sơ', icon: <User size={16} /> },
  ];

  return (
    <div
      className="desktop-view-container"
      style={{
        minHeight: '100vh',
        backgroundColor: '#F8FAFC',
        color: '#0F172A',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ===================================================================== */}
      {/* 1. TOP STICKY HEADER & NAVIGATION BAR                                */}
      {/* ===================================================================== */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 90,
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div
          style={{
            maxWidth: '1380px',
            margin: '0 auto',
            padding: '10px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
          }}
        >
          {/* Brand Logo & Edition Badge */}
          <div
            onClick={() => {
              setActiveTab(0);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '9px',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <img
              src="/images/logo_unipath.png"
              alt="UniPath"
              style={{
                width: '36px',
                height: '36px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 6px rgba(37,99,235,0.25))',
              }}
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div>
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: 900,
                  letterSpacing: '-0.4px',
                  color: '#0F172A',
                  lineHeight: 1.1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>Uni<span style={{ color: '#2563EB' }}>Path</span></span>
              </div>
              <div
                style={{
                  fontSize: '9.5px',
                  fontWeight: 700,
                  color: '#64748B',
                  letterSpacing: '0.3px',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}
              >
                Tuyển Sinh 2.0
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links (with NEVER-WRAP & sleek spacing) */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              flexShrink: 0,
            }}
          >
            {navLinks.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 11px',
                    borderRadius: '10px',
                    border: active ? '1px solid #BFDBFE' : '1px solid transparent',
                    backgroundColor: active ? '#EFF6FF' : 'transparent',
                    color: active ? '#2563EB' : '#475569',
                    fontSize: '12.5px',
                    fontWeight: active ? 800 : 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = '#F8FAFC';
                      e.currentTarget.style.color = '#1E293B';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#475569';
                    }
                  }}
                >
                  {tab.icon}
                  <span style={{ whiteSpace: 'nowrap' }}>{tab.label}</span>
                  {tab.id === 2 && (
                    <span
                      style={{
                        backgroundColor: '#DBEAFE',
                        color: '#1D4ED8',
                        fontSize: '9.5px',
                        padding: '1px 5px',
                        borderRadius: '5px',
                        fontWeight: 800,
                        lineHeight: 1.2,
                      }}
                    >
                      AI
                    </span>
                  )}
                  {tab.id === 3 && (
                    <span
                      style={{
                        backgroundColor: '#FEE2E2',
                        color: '#DC2626',
                        fontSize: '9.5px',
                        padding: '1px 5px',
                        borderRadius: '5px',
                        fontWeight: 800,
                        lineHeight: 1.2,
                      }}
                    >
                      LIVE
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons: Notifications, AI Assistant, Settings, User Profile */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              flexShrink: 0,
              minWidth: 0,
            }}
          >
            {/* Notification Bell */}
            <button
              onClick={openNotifications}
              aria-label="Thông báo"
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '9px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#334155',
                position: 'relative',
                flexShrink: 0,
                transition: 'all 0.15s ease',
              }}
              title="Thông báo hệ thống"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F1F5F9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#F8FAFC';
              }}
            >
              <Bell size={16} />
              {unreadNotificationCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-3px',
                    right: '-3px',
                    minWidth: '16px',
                    height: '16px',
                    padding: '0 3px',
                    borderRadius: '999px',
                    backgroundColor: '#EF4444',
                    color: '#FFFFFF',
                    fontSize: '9.5px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1.5px solid #FFFFFF',
                  }}
                >
                  {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                </span>
              )}
            </button>

            {/* AI Assistant Chatbot */}
            <button
              onClick={openChatBot}
              aria-label="Trợ lý AI UniPath"
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '9px',
                backgroundColor: '#EFF6FF',
                border: '1px solid #BFDBFE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#2563EB',
                flexShrink: 0,
                transition: 'all 0.15s ease',
              }}
              title="Mở Trợ lý AI Tuyển sinh 24/7"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#DBEAFE';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#EFF6FF';
              }}
            >
              <Bot size={16} />
            </button>

            {/* Settings Button */}
            <button
              onClick={openSettings}
              aria-label="Cài đặt hệ thống"
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '9px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#475569',
                flexShrink: 0,
                transition: 'all 0.15s ease',
              }}
              title="Cài đặt & Tùy chọn"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F1F5F9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#F8FAFC';
              }}
            >
              <Settings size={16} />
            </button>

            {/* User Profile or Login */}
            {isLoggedIn && !isGuest ? (
              <div
                onClick={() => setActiveTab(4)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '3px 8px',
                  borderRadius: '9px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  cursor: 'pointer',
                  flexShrink: 0,
                  maxWidth: '165px',
                  transition: 'all 0.15s ease',
                }}
                title="Xem hồ sơ thí sinh"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#EFF6FF';
                  e.currentTarget.style.borderColor = '#BFDBFE';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#F8FAFC';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                <div
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '7px',
                    backgroundColor: '#2563EB',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '12px',
                    flexShrink: 0,
                  }}
                >
                  {(user.name || 'U').charAt(0)}
                </div>
                <div style={{ textAlign: 'left', lineHeight: 1.2, minWidth: 0, overflow: 'hidden' }}>
                  <div
                    style={{
                      fontSize: '11.5px',
                      fontWeight: 800,
                      color: '#1E293B',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {user.name}
                  </div>
                  <div
                    style={{
                      fontSize: '9.5px',
                      color: '#64748B',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {profile.school || 'Thí sinh UniPath'}
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                style={{
                  padding: '7px 13px',
                  borderRadius: '9px',
                  backgroundColor: '#2563EB',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  boxShadow: '0 2px 8px rgba(37,99,235,0.22)',
                }}
              >
                <LogIn size={14} />
                <span>Đăng nhập</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ===================================================================== */}
      {/* 2. MAIN DESKTOP BODY CONTAINER                                       */}
      {/* ===================================================================== */}
      <main
        style={{
          maxWidth: '1380px',
          margin: '0 auto',
          padding: '24px',
          width: '100%',
          boxSizing: 'border-box',
          flex: 1,
        }}
      >
        {/* =================================================================== */}
        {/* TAB 0: TRANG CHỦ DESKTOP                                            */}
        {/* =================================================================== */}
        {activeTab === 0 && (
          <div>
            {/* 1. HERO SLIDER BANNER (3 SLIDES - WIDESCREEN OPTIMIZED) */}
            <div
              onMouseEnter={() => setIsHomeSlideHovered(true)}
              onMouseLeave={() => setIsHomeSlideHovered(false)}
              style={{
                position: 'relative',
                height: '240px',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(15, 23, 42, 0.12)',
                marginBottom: '28px',
              }}
            >
              {/* Slide 1: AI Test */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(135deg, #0F2D59 0%, #1D4ED8 50%, #0284C7 100%)',
                  padding: '28px 44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '28px',
                  opacity: homeSlide === 0 ? 1 : 0,
                  pointerEvents: homeSlide === 0 ? 'auto' : 'none',
                  transition: 'opacity 0.5s ease',
                }}
              >
                <div style={{ flex: 1, maxWidth: '680px', zIndex: 2 }}>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(6px)',
                      color: '#FFFFFF',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 800,
                      marginBottom: '10px',
                      letterSpacing: '0.4px',
                    }}
                  >
                    <Sparkles size={13} />
                    <span>AI HƯỚNG NGHIỆP ĐỘT PHÁ 2026</span>
                  </div>
                  <h2
                    style={{
                      fontSize: '24px',
                      fontWeight: 900,
                      color: '#FFFFFF',
                      lineHeight: 1.25,
                      margin: '0 0 8px',
                      letterSpacing: '-0.3px',
                    }}
                  >
                    Khám phá Tiềm năng & Nguyện vọng Đại học cùng AI
                  </h2>
                  <p style={{ margin: '0 0 16px', fontSize: '13.5px', color: '#E0F2FE', lineHeight: 1.5 }}>
                    Hệ thống trắc nghiệm Holland RIASEC 12 câu tiêu chuẩn, đối soát điểm chuẩn và dự báo cơ hội trúng tuyển 30 trường đại học hàng đầu Việt Nam.
                  </p>
                  <button
                    onClick={() => setActiveTab(1)}
                    style={{
                      height: '40px',
                      padding: '0 20px',
                      borderRadius: '20px',
                      backgroundColor: '#FFFFFF',
                      color: '#1D4ED8',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                      transition: 'transform 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0px)';
                    }}
                  >
                    <span>Bắt đầu làm bài test RIASEC</span>
                    <ArrowRight size={15} />
                  </button>
                </div>

                <div
                  style={{
                    width: '260px',
                    height: '170px',
                    borderRadius: '18px',
                    overflow: 'hidden',
                    border: '2px solid rgba(255,255,255,0.4)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                    flexShrink: 0,
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '6px',
                  }}
                >
                  <img
                    src="/images/home_hero_art.png"
                    alt="AI Hướng nghiệp"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/quiz_intro_art.png';
                    }}
                  />
                </div>
              </div>

              {/* Slide 2: Virtual EduFair */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(135deg, #311042 0%, #6D28D9 50%, #9333EA 100%)',
                  padding: '28px 44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '28px',
                  opacity: homeSlide === 1 ? 1 : 0,
                  pointerEvents: homeSlide === 1 ? 'auto' : 'none',
                  transition: 'opacity 0.5s ease',
                }}
              >
                <div style={{ flex: 1, maxWidth: '680px', zIndex: 2 }}>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: '#EF4444',
                      color: '#FFFFFF',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 800,
                      marginBottom: '10px',
                      letterSpacing: '0.4px',
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FFFFFF' }} />
                    <span>TRỰC TIẾP HÔM NAY</span>
                  </div>
                  <h2
                    style={{
                      fontSize: '24px',
                      fontWeight: 900,
                      color: '#FFFFFF',
                      lineHeight: 1.25,
                      margin: '0 0 8px',
                      letterSpacing: '-0.3px',
                    }}
                  >
                    Virtual EduFair 2026: Trực tiếp Ngày hội Tuyển sinh Sớm
                  </h2>
                  <p style={{ margin: '0 0 16px', fontSize: '13.5px', color: '#F3E8FF', lineHeight: 1.5 }}>
                    Giao lưu ban tuyển sinh trực tuyến, hỏi đáp tiêu chí xét tuyển học bạ đợt 1 và tiếp cận hàng ngàn suất học bổng đại học giá trị.
                  </p>
                  <button
                    onClick={() => setActiveTab(3)}
                    style={{
                      height: '40px',
                      padding: '0 20px',
                      borderRadius: '20px',
                      backgroundColor: '#FFFFFF',
                      color: '#6D28D9',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                      transition: 'transform 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0px)';
                    }}
                  >
                    <span>Tham gia phòng Live ngay</span>
                    <ArrowRight size={15} />
                  </button>
                </div>

                <div
                  style={{
                    width: '280px',
                    height: '170px',
                    borderRadius: '18px',
                    overflow: 'hidden',
                    border: '2px solid rgba(255,255,255,0.4)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                    flexShrink: 0,
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '6px',
                  }}
                >
                  <img
                    src="/images/slide_edufair.png"
                    alt="Virtual EduFair"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/banner_edufair.png';
                    }}
                  />
                </div>
              </div>

              {/* Slide 3: VIP AI Assistant */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #312E81 100%)',
                  padding: '28px 44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '28px',
                  opacity: homeSlide === 2 ? 1 : 0,
                  pointerEvents: homeSlide === 2 ? 'auto' : 'none',
                  transition: 'opacity 0.5s ease',
                }}
              >
                <div style={{ flex: 1, maxWidth: '680px', zIndex: 2 }}>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: 'rgba(245, 158, 11, 0.25)',
                      border: '1px solid rgba(245, 158, 11, 0.4)',
                      backdropFilter: 'blur(6px)',
                      color: '#FDE68A',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 800,
                      marginBottom: '10px',
                      letterSpacing: '0.4px',
                    }}
                  >
                    <span>⭐ TRỢ LÝ AI ĐỘC QUYỀN 24/7</span>
                  </div>
                  <h2
                    style={{
                      fontSize: '24px',
                      fontWeight: 900,
                      color: '#FFFFFF',
                      lineHeight: 1.25,
                      margin: '0 0 8px',
                      letterSpacing: '-0.3px',
                    }}
                  >
                    Trợ lý Tuyển sinh AI UniPath: Đồng hành 24/7
                  </h2>
                  <p style={{ margin: '0 0 16px', fontSize: '13.5px', color: '#E2E8F0', lineHeight: 1.5 }}>
                    Phân tích điểm chuẩn, đối soát học phí, giải đáp phương thức xét tuyển và gợi ý nguyện vọng tối ưu theo năng lực cá nhân.
                  </p>
                  <button
                    onClick={openChatBot}
                    style={{
                      height: '40px',
                      padding: '0 20px',
                      borderRadius: '20px',
                      backgroundColor: '#FFFFFF',
                      color: '#1E1B4B',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                      transition: 'transform 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0px)';
                    }}
                  >
                    <span>Trò chuyện với AI Tuyển sinh</span>
                    <ArrowRight size={15} />
                  </button>
                </div>

                <div
                  style={{
                    width: '280px',
                    height: '170px',
                    borderRadius: '18px',
                    overflow: 'hidden',
                    border: '2px solid rgba(255,255,255,0.3)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                    flexShrink: 0,
                    backgroundColor: 'rgba(0,0,0,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '6px',
                  }}
                >
                  <img
                    src="/images/slide_premium.png"
                    alt="VIP AI"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/quiz_intro_art.png';
                    }}
                  />
                </div>
              </div>

              {/* Slider Left & Right Navigation Arrows */}
              <button
                onClick={() => setHomeSlide((prev) => (prev - 1 + 3) % 3)}
                aria-label="Slide trước"
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 10,
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.45)';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                }}
              >
                <ChevronLeft size={20} />
              </button>

              <button
                onClick={() => setHomeSlide((prev) => (prev + 1) % 3)}
                aria-label="Slide tiếp theo"
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 10,
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.45)';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                }}
              >
                <ChevronRight size={20} />
              </button>

              {/* Slider Dots */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  zIndex: 10,
                }}
              >
                {[0, 1, 2].map((idx) => (
                  <button
                    key={idx}
                    onClick={() => setHomeSlide(idx)}
                    aria-label={"Slide " + (idx + 1)}
                    style={{
                      width: homeSlide === idx ? '22px' : '7px',
                      height: '6px',
                      borderRadius: '3px',
                      backgroundColor: homeSlide === idx ? '#FFFFFF' : 'rgba(255,255,255,0.45)',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* 2. FOUR CORE FEATURE CARDS (4-COLUMN GRID) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '18px',
                marginBottom: '32px',
              }}
            >
              {/* Card 1: RIASEC */}
              <div
                onClick={() => setActiveTab(1)}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  padding: '22px',
                  border: '1.5px solid #E2E8F0',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(37,99,235,0.12)';
                  e.currentTarget.style.borderColor = '#93C5FD';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.03)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(37,99,235,0.12)' }}>
                      <Compass size={22} />
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#2563EB', backgroundColor: '#EFF6FF', padding: '3px 8px', borderRadius: '6px' }}>
                      HOT
                    </span>
                  </div>
                  <h3 style={{ fontSize: '16.5px', fontWeight: 800, color: '#1E293B', marginBottom: '6px' }}>
                    Trắc nghiệm RIASEC
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
                    Holland 6 nhóm tính cách & định hướng ngành học phù hợp
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 700, color: '#2563EB', marginTop: '16px' }}>
                  <span>Làm bài test</span>
                  <ArrowRight size={14} />
                </div>
              </div>

              {/* Card 2: AI Matching */}
              <div
                onClick={() => setActiveTab(2)}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  padding: '22px',
                  border: '1.5px solid #E2E8F0',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(16,185,129,0.14)';
                  e.currentTarget.style.borderColor = '#6EE7B7';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.03)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(16,185,129,0.12)' }}>
                      <Sparkles size={22} />
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#10B981', backgroundColor: '#ECFDF5', padding: '3px 8px', borderRadius: '6px' }}>
                      AI 2026
                    </span>
                  </div>
                  <h3 style={{ fontSize: '16.5px', fontWeight: 800, color: '#1E293B', marginBottom: '6px' }}>
                    AI Matching 2026
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
                    Dự đoán xác suất trúng tuyển 30 trường theo điểm & học phí
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 700, color: '#10B981', marginTop: '16px' }}>
                  <span>Đối soát điểm</span>
                  <ArrowRight size={14} />
                </div>
              </div>

              {/* Card 3: Unipath LIVE */}
              <div
                onClick={() => setActiveTab(3)}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  padding: '22px',
                  border: '1.5px solid #E2E8F0',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(239,68,68,0.12)';
                  e.currentTarget.style.borderColor = '#FCA5A5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.03)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#FEF2F2', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(239,68,68,0.12)' }}>
                      <Radio size={22} />
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#EF4444', backgroundColor: '#FEF2F2', padding: '3px 8px', borderRadius: '6px' }}>
                      LIVE NOW
                    </span>
                  </div>
                  <h3 style={{ fontSize: '16.5px', fontWeight: 800, color: '#1E293B', marginBottom: '6px' }}>
                    Unipath LIVE
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
                    Giao lưu ban tuyển sinh trực tuyến & hỏi đáp trực tiếp trong phòng phát sóng
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 700, color: '#EF4444', marginTop: '16px' }}>
                  <span>Vào phòng Live</span>
                  <ArrowRight size={14} />
                </div>
              </div>

              {/* Card 4: Lộ trình THPT */}
              <div
                onClick={() => openCareerPath()}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  padding: '22px',
                  border: '1.5px solid #E2E8F0',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(147,51,234,0.14)';
                  e.currentTarget.style.borderColor = '#D8B4FE';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.03)';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#FAF5FF', color: '#9333EA', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(147,51,234,0.12)' }}>
                      <GraduationCap size={22} />
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#9333EA', backgroundColor: '#FAF5FF', padding: '3px 8px', borderRadius: '6px' }}>
                      THPT 2026
                    </span>
                  </div>
                  <h3 style={{ fontSize: '16.5px', fontWeight: 800, color: '#1E293B', marginBottom: '6px' }}>
                    Lộ trình Phát triển THPT
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
                    Khung năng lực, kỹ năng nghề nghiệp và bản đồ 4 năm ĐH
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 700, color: '#9333EA', marginTop: '16px' }}>
                  <span>Xem chi tiết</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </div>

            {/* PROMINENT UNIVERSITY SEARCH EXPLORER (MOVED DOWN FROM HEADER FOR OPTIMAL ERGONOMICS) */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '20px 24px',
                border: '1.5px solid #E2E8F0',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                marginBottom: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, position: 'relative' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '14px',
                    backgroundColor: '#EFF6FF',
                    color: '#2563EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 2px 8px rgba(37,99,235,0.15)',
                  }}
                >
                  <Search size={22} />
                </div>
                <div style={{ flex: 1, position: 'relative' }}>
                  <input
                    type="text"
                    value={desktopSearch}
                    onChange={(e) => {
                      setDesktopSearch(e.target.value);
                      setSearchKeyword(e.target.value);
                    }}
                    placeholder="Tìm trường đại học theo tên (Bách Khoa, FTU, NEU...), mã trường, khu vực..."
                    style={{
                      width: '100%',
                      height: '46px',
                      paddingLeft: '16px',
                      paddingRight: desktopSearch ? '40px' : '16px',
                      borderRadius: '12px',
                      border: '1.5px solid #E2E8F0',
                      backgroundColor: '#F8FAFC',
                      fontSize: '14.5px',
                      fontWeight: 600,
                      color: '#0F172A',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#2563EB';
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                      e.currentTarget.style.boxShadow = '0 0 0 4px rgba(37, 99, 235, 0.12)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#E2E8F0';
                      e.currentTarget.style.backgroundColor = '#F8FAFC';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                  {desktopSearch && (
                    <button
                      onClick={() => {
                        setDesktopSearch('');
                        setSearchKeyword('');
                      }}
                      style={{
                        position: 'absolute',
                        right: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: '#94A3B8',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                      title="Xóa tìm kiếm"
                    >
                      <X size={18} />
                    </button>
                  )}

                  {/* Instant Autocomplete Suggestions */}
                  {searchMatches.length > 0 && desktopSearch.trim() && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '54px',
                        left: 0,
                        right: 0,
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        boxShadow: '0 14px 40px rgba(0,0,0,0.16)',
                        border: '1px solid #E2E8F0',
                        zIndex: 100,
                        overflow: 'hidden',
                        maxHeight: '380px',
                        overflowY: 'auto',
                      }}
                    >
                      <div
                        style={{
                          padding: '10px 18px',
                          backgroundColor: '#F8FAFC',
                          borderBottom: '1px solid #F1F5F9',
                          fontSize: '11.5px',
                          fontWeight: 800,
                          color: '#64748B',
                          letterSpacing: '0.4px',
                        }}
                      >
                        GỢI Ý TRƯỜNG ĐẠI HỌC PHÙ HỢP ({searchMatches.length} KẾT QUẢ)
                      </div>
                      {searchMatches.slice(0, 3).map((m) => (
                        <div
                          key={m.id}
                          onClick={() => {
                            openUniDetail(m.id);
                            setDesktopSearch('');
                            setSearchKeyword('');
                          }}
                          style={{
                            padding: '12px 18px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                            borderBottom: '1px solid #F8FAFC',
                            transition: 'background-color 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#EFF6FF';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#FFFFFF';
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <UniversityAvatar code={m.code} size={36} />
                            <div>
                              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
                                <span style={{ color: '#2563EB', marginRight: '6px' }}>[{m.code}]</span>
                                {m.name}
                              </div>
                              <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                                {m.loc} • Điểm chuẩn 2024: <strong style={{ color: '#2563EB' }}>{m.score2024}đ</strong> • Học phí: <strong style={{ color: '#059669' }}>{m.tuitionMin}tr/năm</strong>
                              </div>
                            </div>
                          </div>
                          <span style={{ fontSize: '12.5px', color: '#2563EB', fontWeight: 700 }}>Xem thông tin trường →</span>
                        </div>
                      ))}
                      {searchMatches.length > 3 && (
                        <div
                          onClick={() => {
                            setSearchKeyword(desktopSearch);
                          }}
                          style={{
                            padding: '11px 18px',
                            backgroundColor: '#F8FAFC',
                            textAlign: 'center',
                            fontSize: '12.5px',
                            fontWeight: 700,
                            color: '#2563EB',
                            cursor: 'pointer',
                            borderTop: '1px solid #E2E8F0',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#EFF6FF';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#F8FAFC';
                          }}
                        >
                          Xem tất cả {searchMatches.length} trường phù hợp bên dưới ({searchMatches.length - 3} trường khác) ↓
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Status pill or compare trigger */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                {desktopSearch && (
                  <span style={{ fontSize: '13px', color: '#1E293B', backgroundColor: '#F1F5F9', padding: '8px 14px', borderRadius: '10px', fontWeight: 600 }}>
                    Đang lọc: <strong style={{ color: '#2563EB' }}>"{desktopSearch}"</strong> ({filteredUnis.length} trường)
                  </span>
                )}
                {compareIds.length > 0 && (
                  <button
                    onClick={openCompareModal}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 18px',
                      borderRadius: '12px',
                      backgroundColor: '#2563EB',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(37,99,235,0.25)',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0px)';
                    }}
                  >
                    <Scale size={16} />
                    <span>So sánh ({compareIds.length})</span>
                  </button>
                )}
              </div>
            </div>

            {/* 3. "TRƯỜNG GỢI Ý CHO BẠN" SHOWCASE (HORIZONTAL CAROUSEL) */}
            <div style={{ marginBottom: '36px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>🔥</span>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    Trường gợi ý cho bạn
                  </h2>
                  <span style={{ fontSize: '12px', color: '#64748B', marginLeft: '6px' }}>
                    (Top 8 trường tiêu biểu 3 miền)
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => {
                      if (featuredScrollRef.current) {
                        featuredScrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
                      }
                    }}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => {
                      if (featuredScrollRef.current) {
                        featuredScrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
                      }
                    }}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Scrollable track */}
              <div
                ref={featuredScrollRef}
                style={{
                  display: 'flex',
                  gap: '16px',
                  overflowX: 'auto',
                  paddingBottom: '8px',
                  scrollbarWidth: 'none',
                }}
              >
                {featuredUnis.map((uni) => {
                  const compared = isCompared(uni.id);
                  return (
                    <div
                      key={uni.id}
                      style={{
                        minWidth: '290px',
                        width: '290px',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        border: '1px solid #E2E8F0',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        flexShrink: 0,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                        <UniversityAvatar code={uni.code} size={42} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '11px', color: '#2563EB', fontWeight: 800 }}>{uni.code} • {uni.region}</div>
                          <div style={{ fontSize: '14px', fontWeight: 800, color: '#1E293B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {uni.name}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', padding: '8px 10px', backgroundColor: '#F8FAFC', borderRadius: '10px', marginBottom: '12px' }}>
                        <div>
                          <span style={{ color: '#64748B' }}>Điểm chuẩn: </span>
                          <strong style={{ color: '#2563EB' }}>{uni.score2024}đ</strong>
                        </div>
                        <div>
                          <span style={{ color: '#64748B' }}>Đánh giá: </span>
                          <strong style={{ color: '#F59E0B' }}>⭐ {uni.rating}</strong>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button
                          variant="primary"
                          size="S"
                          fullWidth
                          onClick={() => openUniDetail(uni.id)}
                        >
                          Xem chi tiết
                        </Button>
                        <button
                          onClick={() => toggleCompare(uni.id)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            border: compared ? '1px solid #2563EB' : '1px solid #E2E8F0',
                            backgroundColor: compared ? '#EFF6FF' : '#FFFFFF',
                            color: compared ? '#2563EB' : '#475569',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          {compared ? 'Đã thêm' : 'So sánh'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. ALL 30 UNIVERSITIES DIRECTORY (WIDESCREEN 3-COLUMN GRID) */}
            <div>
              {/* Toolbar & Filters */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px',
                  marginBottom: '20px',
                  paddingBottom: '16px',
                  borderBottom: '1px solid #E2E8F0',
                }}
              >
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px' }}>
                    Danh sách 30 Trường Đại học tiêu biểu
                  </h2>
                  <p style={{ margin: 0, fontSize: '13.5px', color: '#64748B' }}>
                    Tìm thấy {filteredUnis.length} trường theo bộ lọc hiện tại
                  </p>
                </div>

                {/* Region Filter Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {[
                    { key: 'Tất cả', label: 'Toàn quốc (30)' },
                    { key: 'Bắc', label: 'Miền Bắc (10)' },
                    { key: 'Trung', label: 'Miền Trung (10)' },
                    { key: 'Nam', label: 'Miền Nam (10)' },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setSelectedRegion(tab.key)}
                      style={{
                        padding: '7px 16px',
                        borderRadius: '10px',
                        border: selectedRegion === tab.key ? '1px solid #2563EB' : '1px solid #E2E8F0',
                        backgroundColor: selectedRegion === tab.key ? '#2563EB' : '#FFFFFF',
                        color: selectedRegion === tab.key ? '#FFFFFF' : '#475569',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}

                  {compareIds.length > 0 && (
                    <button
                      onClick={openCompareModal}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '7px 16px',
                        borderRadius: '10px',
                        backgroundColor: '#EFF6FF',
                        border: '1px solid #BFDBFE',
                        color: '#2563EB',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      <Scale size={15} />
                      <span>So sánh ({compareIds.length})</span>
                    </button>
                  )}
                </div>
              </div>

              {/* University Cards Grid (3 Columns) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '20px',
                  marginBottom: '28px',
                }}
              >
                {filteredUnis.slice(0, desktopVisibleCount).map((uni) => {
                  const compared = isCompared(uni.id);
                  const isFav = favoriteIds.includes(uni.id);

                  return (
                    <div
                      key={uni.id}
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '20px',
                        border: '1px solid #E2E8F0',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.boxShadow = '0 10px 24px rgba(0,0,0,0.07)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0px)';
                        e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.03)';
                      }}
                    >
                      {/* Campus Cover Image */}
                      <div style={{ height: '140px', position: 'relative', backgroundColor: '#CBD5E1' }}>
                        <ImageSafe
                          src={`/images/campus_${uni.code.toLowerCase()}.jpg`}
                          fallbackSrc="/images/campus_default.png"
                          altText={uni.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        {/* Region & Code badge overlay */}
                        <div
                          style={{
                            position: 'absolute',
                            top: '12px',
                            left: '12px',
                            backgroundColor: 'rgba(15, 23, 42, 0.75)',
                            backdropFilter: 'blur(4px)',
                            color: '#FFFFFF',
                            fontSize: '11px',
                            fontWeight: 800,
                            padding: '3px 8px',
                            borderRadius: '6px',
                          }}
                        >
                          {uni.code} • Miền {uni.region}
                        </div>

                        {/* Favorite button */}
                        <button
                          onClick={() => toggleFavorite(uni.id)}
                          aria-label="Yêu thích"
                          style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: '#FFFFFF',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: isFav ? '#EF4444' : '#64748B',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                          }}
                        >
                          <Heart size={16} fill={isFav ? '#EF4444' : 'none'} />
                        </button>
                      </div>

                      {/* Content Info */}
                      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                          <UniversityAvatar code={uni.code} size={36} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h3
                              style={{
                                margin: 0,
                                fontSize: '15.5px',
                                fontWeight: 800,
                                color: '#0F172A',
                                lineHeight: 1.3,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {uni.name}
                            </h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#64748B' }}>
                              <MapPin size={12} color="#94A3B8" />
                              <span>{uni.loc}</span>
                            </div>
                          </div>
                        </div>

                        {/* Metric pills */}
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '6px',
                            backgroundColor: '#F8FAFC',
                            borderRadius: '12px',
                            padding: '8px',
                            textAlign: 'center',
                            margin: '10px 0 14px',
                            border: '1px solid #E2E8F0',
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: 800, color: '#2563EB' }}>
                              {uni.score2024}đ
                            </div>
                            <div style={{ fontSize: '10.5px', color: '#64748B' }}>Điểm chuẩn</div>
                          </div>
                          <div style={{ borderLeft: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0' }}>
                            <div style={{ fontSize: '14px', fontWeight: 800, color: '#059669' }}>
                              {uni.tuitionMin}tr
                            </div>
                            <div style={{ fontSize: '10.5px', color: '#64748B' }}>Học phí/năm</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: 800, color: '#F59E0B' }}>
                              ⭐ {uni.rating}
                            </div>
                            <div style={{ fontSize: '10.5px', color: '#64748B' }}>Đánh giá</div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                          <Button
                            variant="primary"
                            size="M"
                            fullWidth
                            onClick={() => openUniDetail(uni.id)}
                          >
                            Chi tiết trường
                          </Button>
                          <button
                            onClick={() => toggleCompare(uni.id)}
                            style={{
                              padding: '8px 14px',
                              borderRadius: '10px',
                              border: compared ? '1.5px solid #2563EB' : '1px solid #E2E8F0',
                              backgroundColor: compared ? '#EFF6FF' : '#FFFFFF',
                              color: compared ? '#2563EB' : '#475569',
                              fontSize: '12.5px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {compared ? 'Đã thêm' : 'So sánh'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination control */}
              {desktopVisibleCount < filteredUnis.length && (
                <div style={{ textAlign: 'center', margin: '20px 0 32px' }}>
                  <button
                    onClick={() => setDesktopVisibleCount((prev) => prev + 12)}
                    style={{
                      padding: '12px 28px',
                      borderRadius: '14px',
                      backgroundColor: '#FFFFFF',
                      border: '1.5px solid #CBD5E1',
                      color: '#1E293B',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                    }}
                  >
                    Xem thêm 12 trường tiếp theo ({filteredUnis.length - desktopVisibleCount} trường còn lại) ↓
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 1: KHẢO SÁT HOLLAND RIASEC DESKTOP                               */}
        {/* =================================================================== */}
        {activeTab === 1 && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              padding: '32px',
              minHeight: '70vh',
            }}
          >
            {/* Mode 1: Intro */}
            {quizMode === 'intro' && (
              <div style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'center' }}>
                <div
                  style={{
                    width: '180px',
                    height: '180px',
                    margin: '0 auto 20px',
                    borderRadius: '32px',
                    overflow: 'hidden',
                    boxShadow: '0 12px 28px rgba(37,99,235,0.18)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#EFF6FF',
                    border: '3px solid #DBEAFE',
                    padding: '8px',
                  }}
                >
                  <img
                    src="/images/quiz_intro_art.png"
                    alt="Holland RIASEC"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/onboarding_1.png';
                    }}
                  />
                </div>
                <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#0F172A', marginBottom: '8px' }}>
                  Khám phá Tính cách & Hướng nghiệp RIASEC
                </h1>
                <p style={{ fontSize: '15px', color: '#64748B', maxWidth: '640px', margin: '0 auto 28px', lineHeight: 1.6 }}>
                  Bài trắc nghiệm tâm lý học chuẩn Hoa Kỳ 12 câu hỏi giúp bạn xác định xu hướng nghề nghiệp nổi trội và tìm ra những ngành học, ngôi trường đại học phù hợp nhất.
                </p>

                {/* 3 Metric Pills */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '36px' }}>
                  <div style={{ backgroundColor: '#F8FAFC', padding: '16px 28px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '22px', fontWeight: 900, color: '#2563EB' }}>12</div>
                    <div style={{ fontSize: '13px', color: '#64748B' }}>Câu hỏi tiêu chuẩn</div>
                  </div>
                  <div style={{ backgroundColor: '#F8FAFC', padding: '16px 28px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '22px', fontWeight: 900, color: '#10B981' }}>5</div>
                    <div style={{ fontSize: '13px', color: '#64748B' }}>Phút hoàn thành</div>
                  </div>
                  <div style={{ backgroundColor: '#F8FAFC', padding: '16px 28px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '22px', fontWeight: 900, color: '#F59E0B' }}>6</div>
                    <div style={{ fontSize: '13px', color: '#64748B' }}>Nhóm RIASEC</div>
                  </div>
                </div>

                <button
                  onClick={handleStartQuiz}
                  style={{
                    padding: '14px 36px',
                    borderRadius: '16px',
                    backgroundColor: '#2563EB',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(37,99,235,0.3)',
                  }}
                >
                  Bắt đầu làm bài trắc nghiệm ngay →
                </button>
              </div>
            )}

            {/* Mode 2: Taking Quiz */}
            {quizMode === 'taking' && (
              <div style={{ maxWidth: '820px', margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <button
                    onClick={() => {
                      if (quizIdx > 0) setQuizIdx((prev) => prev - 1);
                      else setQuizMode('intro');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'none',
                      border: 'none',
                      color: '#64748B',
                      fontSize: '13.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <ArrowLeft size={16} />
                    <span>Quay lại</span>
                  </button>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#2563EB' }}>
                    Câu {quizIdx + 1} / {QUIZ_QUESTIONS.length}
                  </span>
                </div>

                {/* Progress bar */}
                <div style={{ height: '8px', backgroundColor: '#F1F5F9', borderRadius: '4px', overflow: 'hidden', marginBottom: '28px' }}>
                  <div
                    style={{
                      width: `${((quizIdx + 1) / QUIZ_QUESTIONS.length) * 100}%`,
                      height: '100%',
                      backgroundColor: '#2563EB',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>

                {/* Question */}
                <div style={{ backgroundColor: '#F8FAFC', borderRadius: '20px', padding: '24px 28px', border: '1px solid #E2E8F0', marginBottom: '24px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#2563EB', backgroundColor: '#EFF6FF', padding: '3px 10px', borderRadius: '6px' }}>
                    Nhóm Holland: {QUIZ_QUESTIONS[quizIdx].category}
                  </span>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginTop: '12px', lineHeight: 1.4 }}>
                    {QUIZ_QUESTIONS[quizIdx].question}
                  </h2>
                </div>

                {/* 4 Options Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '28px' }}>
                  {QUIZ_OPTIONS.map((opt, optIdx) => {
                    const isSelected = quizAnswers[quizIdx] === optIdx;
                    return (
                      <div
                        key={optIdx}
                        onClick={() => handleSelectQuizOption(optIdx)}
                        style={{
                          backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                          border: isSelected ? '2px solid #2563EB' : '1px solid #E2E8F0',
                          borderRadius: '16px',
                          padding: '16px 20px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div style={{ flexShrink: 0 }}>{opt.icon}</div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 700, color: isSelected ? '#1D4ED8' : '#1E293B' }}>
                            {opt.title}
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                            {opt.sub}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Action button */}
                <div style={{ textAlign: 'right' }}>
                  <button
                    disabled={quizAnswers[quizIdx] === -1}
                    onClick={handleNextQuiz}
                    style={{
                      padding: '12px 28px',
                      borderRadius: '12px',
                      backgroundColor: quizAnswers[quizIdx] === -1 ? '#CBD5E1' : '#2563EB',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '14px',
                      fontWeight: 800,
                      cursor: quizAnswers[quizIdx] === -1 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {quizIdx === QUIZ_QUESTIONS.length - 1 ? 'Hoàn thành bài khảo sát 🎉' : 'Câu tiếp theo →'}
                  </button>
                </div>
              </div>
            )}

            {/* Mode 3: Result */}
            {quizMode === 'result' && hollandResult && (
              <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '32px', alignItems: 'start' }}>
                {/* Left: Radar Chart */}
                <div style={{ backgroundColor: '#F8FAFC', borderRadius: '20px', padding: '24px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>
                    Biểu đồ Radar 6 nhóm tính cách
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                    <RadarChart scores={hollandResult.scores} size={300} />
                  </div>

                  <div style={{ backgroundColor: '#EFF6FF', borderRadius: '12px', padding: '12px', marginBottom: '16px' }}>
                    <div style={{ fontSize: '16px', fontWeight: 900, color: '#1D4ED8' }}>
                      Mã {hollandResult.primaryCode} — {getHollandName(hollandResult.primaryCode)}
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#64748B', marginTop: '4px' }}>
                      Top 3 nhóm nổi trội: {hollandResult.topCodes.join(' - ')}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <Button
                      variant="primary"
                      size="M"
                      fullWidth
                      onClick={() => openCareerPath(hollandResult.primaryCode)}
                    >
                      Xem lộ trình phát triển nghề nghiệp
                    </Button>
                    <button
                      onClick={clearHollandResult}
                      style={{
                        padding: '10px',
                        borderRadius: '10px',
                        border: '1px solid #E2E8F0',
                        backgroundColor: '#FFFFFF',
                        color: '#64748B',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Làm lại bài khảo sát
                    </button>
                  </div>
                </div>

                {/* Right: Scores breakdown & Recommended Majors */}
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>
                    Chi tiết điểm số 6 nhóm Holland
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
                    {(['R', 'I', 'A', 'S', 'E', 'C'] as HollandCode[]).map((code) => {
                      const score = hollandResult.scores[code];
                      const isTop = hollandResult.topCodes.includes(code);
                      return (
                        <div
                          key={code}
                          style={{
                            padding: '12px 16px',
                            borderRadius: '12px',
                            backgroundColor: isTop ? '#EFF6FF' : '#F8FAFC',
                            border: isTop ? '1.5px solid #93C5FD' : '1px solid #E2E8F0',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 800, color: isTop ? '#1D4ED8' : '#1E293B' }}>
                              {code} - {HOLLAND_NAMES[code]}
                            </span>
                            <strong style={{ fontSize: '13px', color: isTop ? '#1D4ED8' : '#64748B' }}>{score}/6 điểm</strong>
                          </div>
                          <div style={{ height: '6px', backgroundColor: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${(score / 6) * 100}%`, height: '100%', backgroundColor: isTop ? '#2563EB' : '#94A3B8' }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>
                    Chuyên ngành & Trường ĐH gợi ý cho bạn
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                    {HOLLAND_MAJORS[hollandResult.primaryCode]?.map((major, i) => (
                      <span
                        key={i}
                        style={{
                          backgroundColor: '#F1F5F9',
                          color: '#334155',
                          padding: '6px 14px',
                          borderRadius: '20px',
                          fontSize: '13px',
                          fontWeight: 600,
                          border: '1px solid #E2E8F0',
                        }}
                      >
                        {major}
                      </span>
                    ))}
                  </div>

                  <div style={{ padding: '16px 20px', borderRadius: '16px', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#166534' }}>
                        Khám phá ngay cơ hội trúng tuyển cùng AI
                      </div>
                      <div style={{ fontSize: '12.5px', color: '#15803D' }}>
                        Dùng kết quả tính cách này để phân loại 30 trường phù hợp với mức điểm của bạn
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab(2)}
                      style={{
                        padding: '8px 18px',
                        borderRadius: '10px',
                        backgroundColor: '#16A34A',
                        color: '#FFFFFF',
                        border: 'none',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Sang AI Match →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: AI MATCHING 2026 DESKTOP                                     */}
        {/* =================================================================== */}
        {activeTab === 2 && (
          <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '28px', alignItems: 'start' }}>
            {/* Left Column: Controls & Sliders */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid #E2E8F0',
                padding: '24px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                position: 'sticky',
                top: '80px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
                <Sliders size={20} color="#2563EB" />
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Thiết lập thông số phân tích
                </h3>
              </div>

              {/* Điểm thi dự kiến */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>Điểm thi THPT dự kiến</label>
                  <strong style={{ fontSize: '16px', fontWeight: 900, color: '#2563EB' }}>{matchScore.toFixed(1)} đ</strong>
                </div>
                <input
                  type="range"
                  min="15.0"
                  max="30.0"
                  step="0.25"
                  value={matchScore}
                  onChange={(e) => handleScoreChange(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: '#2563EB' }}
                />
                <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                  {[18, 21, 24, 27, 29].map((p) => (
                    <button
                      key={p}
                      onClick={() => handleScoreChange(p)}
                      style={{
                        flex: 1,
                        padding: '4px 0',
                        borderRadius: '6px',
                        border: matchScore === p ? '1px solid #2563EB' : '1px solid #E2E8F0',
                        backgroundColor: matchScore === p ? '#EFF6FF' : '#F8FAFC',
                        color: matchScore === p ? '#2563EB' : '#64748B',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {p}đ
                    </button>
                  ))}
                </div>
              </div>

              {/* Ngân sách học phí */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>Ngân sách học phí tối đa</label>
                  <strong style={{ fontSize: '16px', fontWeight: 900, color: '#059669' }}>{matchBudget} tr/năm</strong>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="5"
                  value={matchBudget}
                  onChange={(e) => handleBudgetChange(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: '#059669' }}
                />
                <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                  {[15, 25, 35, 50].map((b) => (
                    <button
                      key={b}
                      onClick={() => handleBudgetChange(b)}
                      style={{
                        flex: 1,
                        padding: '4px 0',
                        borderRadius: '6px',
                        border: matchBudget === b ? '1px solid #059669' : '1px solid #E2E8F0',
                        backgroundColor: matchBudget === b ? '#ECFDF5' : '#F8FAFC',
                        color: matchBudget === b ? '#059669' : '#64748B',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {b}tr
                    </button>
                  ))}
                </div>
              </div>

              {/* Khu vực ưu tiên */}
              <div style={{ marginBottom: '22px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '8px' }}>
                  Khu vực ưu tiên
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                  {['Tất cả', 'Bắc', 'Trung', 'Nam'].map((reg) => (
                    <button
                      key={reg}
                      onClick={() => handleRegionChange(reg)}
                      style={{
                        padding: '6px 0',
                        borderRadius: '8px',
                        border: matchRegion === reg ? '1px solid #2563EB' : '1px solid #E2E8F0',
                        backgroundColor: matchRegion === reg ? '#2563EB' : '#F8FAFC',
                        color: matchRegion === reg ? '#FFFFFF' : '#475569',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {reg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit analyze button */}
              <button
                disabled={isMatchLoading}
                onClick={handleEvaluateMatching}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  backgroundColor: '#2563EB',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: 800,
                  cursor: isMatchLoading ? 'wait' : 'pointer',
                  boxShadow: '0 4px 14px rgba(37,99,235,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <Sparkles size={16} />
                <span>{isMatchLoading ? 'Đang đối soát 30 trường...' : 'Phân tích cơ hội trúng tuyển ngay'}</span>
              </button>
            </div>

            {/* Right Column: AI Results Display */}
            <div>
              {!hasMatchEvaluated || !lastMatchEvaluatedData ? (
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '20px',
                    border: '1px solid #E2E8F0',
                    padding: '48px 32px',
                    textAlign: 'center',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                  }}
                >
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <Sparkles size={32} />
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                    Chưa có dữ liệu phân tích
                  </h3>
                  <p style={{ fontSize: '14px', color: '#64748B', maxWidth: '480px', margin: '0 auto 20px', lineHeight: 1.5 }}>
                    Vui lòng điều chỉnh mức điểm thi dự kiến và ngân sách học phí ở bảng bên trái, sau đó nhấn nút <strong>"Phân tích cơ hội trúng tuyển ngay"</strong>.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* 1. Confirmation summary card */}
                  <div
                    style={{
                      backgroundColor: '#F0FDF4',
                      border: '1.5px solid #86EFAC',
                      borderRadius: '16px',
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      boxShadow: '0 4px 14px rgba(16, 185, 129, 0.08)',
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#DCFCE7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#16A34A',
                        flexShrink: 0,
                      }}
                    >
                      <CheckCircle2 size={22} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#166534', marginBottom: '3px' }}>
                        ✅ Đã phân tích cơ hội trúng tuyển theo thông số của bạn!
                      </div>
                      <div style={{ fontSize: '13px', color: '#15803D', lineHeight: 1.5 }}>
                        Điểm thi THPT: <strong>{lastMatchEvaluatedData.score.toFixed(1)} điểm</strong> • Ngân sách học phí: <strong>≤ {lastMatchEvaluatedData.budget} tr/năm</strong> • Khu vực: <strong>{lastMatchEvaluatedData.region === 'Tất cả' ? 'Toàn quốc' : `Miền ${lastMatchEvaluatedData.region}`}</strong> (Phân tích lúc {lastMatchEvaluatedData.time})
                      </div>
                    </div>
                  </div>

                  {/* 2. Summary & Sort bar */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF', padding: '14px 20px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '14px', color: '#1E293B' }}>
                      Đối soát: <strong style={{ color: '#2563EB' }}>{lastMatchEvaluatedData.score.toFixed(1)}đ</strong> • Học phí: <strong style={{ color: '#059669' }}>≤ {lastMatchEvaluatedData.budget}tr/năm</strong> • Khu vực: <strong style={{ color: '#475569' }}>{lastMatchEvaluatedData.region === 'Tất cả' ? 'Toàn quốc' : `Miền ${lastMatchEvaluatedData.region}`}</strong>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '12px', color: '#64748B' }}>Sắp xếp:</span>
                      <select
                        value={matchSort}
                        onChange={(e) => setMatchSort(e.target.value as 'score' | 'budget' | 'location')}
                        style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12.5px' }}
                      >
                        <option value="score">Tỷ lệ trúng tuyển cao nhất</option>
                        <option value="budget">Học phí thấp nhất</option>
                        <option value="location">Khu vực</option>
                      </select>
                    </div>
                  </div>

                  {/* Group 1: An Toàn (>= 80%) */}
                  <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1.5px solid #BBF7D0', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                        <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#166534' }}>
                          🟢 Nhóm An Toàn (Tỷ lệ trúng tuyển ≥ 80%)
                        </h3>
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#166534', backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: '6px' }}>
                        {lastMatchEvaluatedData.evaluation.safeList.length} trường
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                      {sortResults(lastMatchEvaluatedData.evaluation.safeList).map((res) => (
                        <div key={res.university.id} style={{ padding: '14px', borderRadius: '14px', backgroundColor: '#F0FDF4', border: '1px solid #DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                            <DonutChart percent={res.matchingPercent} size={44} strokeWidth={4.5} />
                            <div style={{ minWidth: 0 }}>
                              <strong style={{ fontSize: '14px', color: '#14532D' }}>{res.university.code}</strong>
                              <div style={{ fontSize: '12px', color: '#166534', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                                {res.university.name}
                              </div>
                              <div style={{ fontSize: '11px', color: '#047857', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                                {res.matchedMajor} ({res.majorCutoff}đ)
                              </div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                            <button
                              onClick={() => openBookConsultation(res.university)}
                              style={{ padding: '6px 9px', borderRadius: '8px', border: '1px solid #A7F3D0', backgroundColor: '#FFFFFF', color: '#059669', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
                            >
                              Tư vấn 1-1
                            </button>
                            <Button variant="primary" size="S" onClick={() => openUniDetail(res.university.id)}>
                              Chi tiết
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Group 2: Vừa Sức (45% - 79%) */}
                  <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1.5px solid #FDE68A', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                        <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#92400E' }}>
                          🟡 Nhóm Vừa Sức (Tỷ lệ 45% – 79%)
                        </h3>
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#92400E', backgroundColor: '#FEF3C7', padding: '2px 8px', borderRadius: '6px' }}>
                        {lastMatchEvaluatedData.evaluation.moderateList.length} trường
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                      {sortResults(lastMatchEvaluatedData.evaluation.moderateList).map((res) => (
                        <div key={res.university.id} style={{ padding: '14px', borderRadius: '14px', backgroundColor: '#FFFBEB', border: '1px solid #FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                            <DonutChart percent={res.matchingPercent} size={44} strokeWidth={4.5} />
                            <div style={{ minWidth: 0 }}>
                              <strong style={{ fontSize: '14px', color: '#78350F' }}>{res.university.code}</strong>
                              <div style={{ fontSize: '12px', color: '#92400E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                                {res.university.name}
                              </div>
                              <div style={{ fontSize: '11px', color: '#B45309', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                                {res.matchedMajor} ({res.majorCutoff}đ)
                              </div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                            <button
                              onClick={() => openBookConsultation(res.university)}
                              style={{ padding: '6px 9px', borderRadius: '8px', border: '1px solid #FDE68A', backgroundColor: '#FFFFFF', color: '#B45309', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
                            >
                              Tư vấn 1-1
                            </button>
                            <Button variant="primary" size="S" onClick={() => openUniDetail(res.university.id)}>
                              Chi tiết
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Group 3: Thử Thách (< 45%) */}
                  <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1.5px solid #FECACA', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
                        <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#991B1B' }}>
                          🔴 Nhóm Thử Thách (Tỷ lệ &lt; 45%)
                        </h3>
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#991B1B', backgroundColor: '#FEE2E2', padding: '2px 8px', borderRadius: '6px' }}>
                        {lastMatchEvaluatedData.evaluation.challengingList.length} trường
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                      {sortResults(lastMatchEvaluatedData.evaluation.challengingList).map((res) => (
                        <div key={res.university.id} style={{ padding: '14px', borderRadius: '14px', backgroundColor: '#FEF2F2', border: '1px solid #FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                            <DonutChart percent={res.matchingPercent} size={44} strokeWidth={4.5} />
                            <div style={{ minWidth: 0 }}>
                              <strong style={{ fontSize: '14px', color: '#7F1D1D' }}>{res.university.code}</strong>
                              <div style={{ fontSize: '12px', color: '#991B1B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                                {res.university.name}
                              </div>
                              <div style={{ fontSize: '11px', color: '#B91C1C', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                                {res.matchedMajor} ({res.majorCutoff}đ)
                              </div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                            <button
                              onClick={() => openBookConsultation(res.university)}
                              style={{ padding: '6px 9px', borderRadius: '8px', border: '1px solid #FECACA', backgroundColor: '#FFFFFF', color: '#DC2626', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
                            >
                              Tư vấn 1-1
                            </button>
                            <Button variant="primary" size="S" onClick={() => openUniDetail(res.university.id)}>
                              Chi tiết
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: UNIPATH LIVE (EDUFAIR STREAM) DESKTOP                        */}
        {/* =================================================================== */}
        {activeTab === 3 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', alignItems: 'start' }}>
            {/* Left: Video Stage & Information */}
            <div>
              {/* 16:9 Video Canvas */}
              <div
                style={{
                  position: 'relative',
                  aspectRatio: '16/9',
                  backgroundColor: '#0F172A',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                  marginBottom: '18px',
                }}
              >
                <img
                  src="/images/advisor_live.png"
                  alt="Live Stage"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/slide_edufair.png';
                  }}
                />

                {/* Overlays */}
                <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#EF4444', color: '#FFFFFF', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 800 }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FFFFFF' }} />
                    <span>TRỰC TIẾP</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: 'rgba(0,0,0,0.6)', color: '#FFFFFF', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 700 }}>
                    <Users size={12} />
                    <span>2,480 người xem</span>
                  </div>
                </div>

                {/* Bottom title inside player */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px', background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', color: '#FFFFFF' }}>
                  <h2 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: 800 }}>
                    Virtual EduFair 2026: Giải mã Cơ hội Xét tuyển Sớm & Học bổng 30 Trường ĐH
                  </h2>
                  <div style={{ fontSize: '13px', opacity: 0.9 }}>
                    Diễn giả: TS. Lê Thành Trung • Đại diện Ban Tuyển sinh
                  </div>
                </div>
              </div>

              {/* Interaction bar */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '16px 20px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', position: 'relative' }}>
                <div style={{ display: 'flex', gap: '10px', position: 'relative' }}>
                  {/* Floating reaction particles */}
                  {floatingReactions.map((p) => (
                    <div
                      key={p.id}
                      style={{
                        position: 'absolute',
                        top: '-15px',
                        left: `calc(50% + ${p.xOffset}px)`,
                        fontSize: '28px',
                        pointerEvents: 'none',
                        zIndex: 99,
                        animation: 'floatReactionUp 1.25s cubic-bezier(0.22, 1, 0.36, 1) forwards',
                        transform: `rotate(${p.rotation}deg)`,
                      }}
                    >
                      {p.emoji}
                    </div>
                  ))}

                  <button
                    onClick={() => triggerReaction('like')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      borderRadius: '10px',
                      border: '1px solid #E2E8F0',
                      backgroundColor: '#F8FAFC',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 700,
                      transition: 'all 0.15s ease',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.transform = 'scale(0.93)';
                    }}
                    onMouseUp={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <ThumbsUp size={15} color="#2563EB" />
                    <span>Thích ({liveReactions.like})</span>
                  </button>

                  <button
                    onClick={() => triggerReaction('heart')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      borderRadius: '10px',
                      border: '1px solid #E2E8F0',
                      backgroundColor: '#F8FAFC',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 700,
                      transition: 'all 0.15s ease',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.transform = 'scale(0.93)';
                    }}
                    onMouseUp={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <span>❤️ Thả tim ({liveReactions.heart})</span>
                  </button>

                  <button
                    onClick={() => triggerReaction('clap')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      borderRadius: '10px',
                      border: '1px solid #E2E8F0',
                      backgroundColor: '#F8FAFC',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 700,
                      transition: 'all 0.15s ease',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.transform = 'scale(0.93)';
                    }}
                    onMouseUp={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <span>👏 Vỗ tay ({liveReactions.clap})</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    showToast('Đã sao chép liên kết phòng Live!');
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', color: '#475569', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
                >
                  <Share2 size={15} />
                  <span>Chia sẻ</span>
                </button>
              </div>

              {/* Participating Universities in EduFair */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '20px', border: '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginBottom: '14px' }}>
                  Gian hàng trực tuyến các trường tham gia hôm nay
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                  {universitiesList.slice(0, 8).map((u) => (
                    <div
                      key={u.id}
                      onClick={() => openUniDetail(u.id)}
                      style={{
                        padding: '10px',
                        borderRadius: '12px',
                        border: '1px solid #E2E8F0',
                        backgroundColor: '#F8FAFC',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <UniversityAvatar code={u.code} size={30} />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '12px', fontWeight: 800, color: '#1E293B' }}>
                            {u.code}
                          </div>
                          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '10.5px', color: '#64748B', maxWidth: '110px' }}>
                            {u.name}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openBookConsultation(u);
                        }}
                        style={{
                          width: '100%',
                          padding: '5px 8px',
                          borderRadius: '8px',
                          border: '1px solid #BFDBFE',
                          backgroundColor: '#EFF6FF',
                          color: '#2563EB',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                        }}
                      >
                        <Calendar size={11} /> Đặt lịch 1-1
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Real-time Live Comments Chat */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                border: '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                height: '620px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                overflow: 'hidden',
              }}
            >
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
                  Bình luận trực tiếp ({liveMessages.length})
                </div>
                <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 700 }}>● Đang kết nối</span>
              </div>

              {/* Messages container */}
              <div
                ref={liveChatContainerRef}
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {liveMessages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '12px',
                      backgroundColor: msg.isAdvisor ? '#EFF6FF' : '#F8FAFC',
                      border: msg.isAdvisor ? '1px solid #BFDBFE' : '1px solid #E2E8F0',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '12.5px', color: msg.isAdvisor ? '#1D4ED8' : '#1E293B' }}>
                        {msg.author}
                      </strong>
                      <span style={{ fontSize: '10.5px', color: '#94A3B8' }}>{msg.time}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '12.5px', color: '#334155', lineHeight: 1.4 }}>
                      {msg.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form
                onSubmit={handleSendLiveMessage}
                style={{
                  padding: '12px 16px',
                  borderTop: '1px solid #F1F5F9',
                  display: 'flex',
                  gap: '8px',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <input
                  type="text"
                  value={liveChatInput}
                  onChange={(e) => setLiveChatInput(e.target.value)}
                  placeholder="Đặt câu hỏi cho diễn giả..."
                  style={{
                    flex: 1,
                    height: '38px',
                    padding: '0 12px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: '#2563EB',
                    color: '#FFFFFF',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 4: HỒ SƠ XÉT TUYỂN & CÁ NHÂN DESKTOP                            */}
        {/* =================================================================== */}
        {activeTab === 4 && (
          !isLoggedIn || isGuest ? (
            <div
              style={{
                maxWidth: '720px',
                margin: '36px auto',
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                border: '1.5px solid #E2E8F0',
                padding: '44px 36px',
                textAlign: 'center',
                boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
              }}
            >
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '20px',
                  backgroundColor: '#EFF6FF',
                  color: '#2563EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  boxShadow: '0 4px 14px rgba(37,99,235,0.15)',
                }}
              >
                <User size={36} />
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A', marginBottom: '10px' }}>
                Cổng Hồ Sơ & Phân Quyền Hệ Sinh Thái UniPath 2.0
              </h2>
              <p style={{ fontSize: '14.5px', color: '#64748B', maxWidth: '540px', margin: '0 auto 24px', lineHeight: 1.6 }}>
                Đăng nhập tài khoản cá nhân để nộp hồ sơ xét tuyển trực tuyến, đặt lịch tư vấn 1-1 và theo dõi kết quả trúng tuyển — hoặc chuyển nhanh sang 3 vai trò Demo bên dưới:
              </p>

              <div style={{ marginBottom: '20px' }}>
                <Button variant="primary" size="L" icon={<LogIn size={18} />} onClick={openAuthModal}>
                  Đăng nhập / Tạo tài khoản mới
                </Button>
              </div>

              <div style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
                Đăng nhập nhanh tài khoản mẫu (Demo bảo vệ đồ án)
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => login('quy@unipath.vn', '123456')}
                  style={{
                    padding: '11px 18px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(245,158,11,0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Sparkles size={16} />
                  <span>⚡ Thí sinh (Trần Công Quý)</span>
                </button>
                <button
                  onClick={() => login('tuyensinh@pxu.edu.vn', 'pxu123')}
                  style={{
                    padding: '11px 18px',
                    borderRadius: '12px',
                    backgroundColor: '#059669',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(5,150,105,0.25)',
                  }}
                >
                  🏛️ ĐH Phú Xuân (PXU)
                </button>
                <button
                  onClick={() => login('admin@unipath.vn', 'admin123')}
                  style={{
                    padding: '11px 18px',
                    borderRadius: '12px',
                    backgroundColor: '#2563EB',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(37,99,235,0.25)',
                  }}
                >
                  👑 Admin Hệ Thống
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '28px', alignItems: 'start' }}>
                {/* Left Column: Candidate Card, VIP & Holland Career Path */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '20px',
                      border: '1px solid #E2E8F0',
                      padding: '24px',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                    }}
                  >
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                      <div
                        style={{
                          width: '80px',
                          height: '80px',
                          borderRadius: '50%',
                          overflow: 'hidden',
                          margin: '0 auto 12px',
                          border: profile.isPremium ? '3px solid #F59E0B' : '3px solid #2563EB',
                        }}
                      >
                        <img
                          src={profile.avatarPath || '/images/avatar_user.png'}
                          alt={user.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#0F172A' }}>
                          {user.name || 'Thí sinh UniPath'}
                        </h3>
                        {profile.isPremium && (
                          <span style={{ backgroundColor: '#FEF3C7', color: '#B45309', fontSize: '11px', fontWeight: 800, padding: '2px 7px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                            <Crown size={12} /> VIP
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '13px', color: '#64748B' }}>
                        {profile.grade} • {profile.school}
                      </div>
                      <div style={{ fontSize: '12px', color: '#94A3B8' }}>{profile.province}</div>
                      <div style={{ marginTop: '10px', padding: '8px 12px', borderRadius: '10px', backgroundColor: '#EFF6FF', color: '#1E40AF', fontSize: '12px', fontWeight: 600 }}>
                        Mục tiêu: {profile.targetMajor} — {profile.dreamUni}
                      </div>
                    </div>

                    {/* Stats */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '8px',
                        backgroundColor: '#F8FAFC',
                        borderRadius: '14px',
                        padding: '12px 8px',
                        textAlign: 'center',
                        marginBottom: '20px',
                        border: '1px solid #E2E8F0',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '18px', fontWeight: 900, color: '#2563EB' }}>
                          {myApplications.length}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Hồ sơ nộp</div>
                      </div>
                      <div style={{ borderLeft: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0' }}>
                        <div style={{ fontSize: '18px', fontWeight: 900, color: '#0D9488' }}>
                          {myBookings.length}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Lịch hẹn 1-1</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '18px', fontWeight: 900, color: '#F59E0B' }}>
                          {profile.expectedScore || 24.5}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Điểm dự kiến</div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <button
                        onClick={openEditProfile}
                        style={{
                          padding: '10px',
                          borderRadius: '10px',
                          backgroundColor: '#EFF6FF',
                          color: '#2563EB',
                          border: '1px solid #BFDBFE',
                          fontSize: '13px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Chỉnh sửa thông tin hồ sơ
                      </button>
                      <button
                        onClick={() => openBookConsultation()}
                        style={{
                          padding: '10px',
                          borderRadius: '10px',
                          backgroundColor: '#F0FDFA',
                          color: '#0D9488',
                          border: '1px solid #99F6E4',
                          fontSize: '13px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        + Đặt lịch tư vấn 1-1 trực tuyến
                      </button>
                      <button
                        onClick={openSettings}
                        style={{
                          padding: '10px',
                          borderRadius: '10px',
                          backgroundColor: '#F8FAFC',
                          color: '#334155',
                          border: '1px solid #E2E8F0',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Cài đặt & Bản quyền nhóm UP5
                      </button>
                      <button
                        onClick={logout}
                        style={{
                          padding: '10px',
                          borderRadius: '10px',
                          backgroundColor: '#FEF2F2',
                          color: '#DC2626',
                          border: '1px solid #FECACA',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Đăng xuất tài khoản
                      </button>
                    </div>
                  </div>

                  {/* Holland RIASEC Summary & Career Path Card */}
                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '20px',
                      border: '1px solid #E2E8F0',
                      padding: '20px',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <Compass size={18} color="#2563EB" />
                      <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
                        Định hướng Holland RIASEC
                      </h4>
                    </div>
                    {hollandResult ? (
                      <div>
                        <div style={{ backgroundColor: '#EFF6FF', borderRadius: '12px', padding: '12px', marginBottom: '12px' }}>
                          <div style={{ fontSize: '14px', fontWeight: 800, color: '#1D4ED8' }}>
                            Nhóm {hollandResult.primaryCode} — {getHollandName(hollandResult.primaryCode)}
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748B', marginTop: '3px' }}>
                            Tổ hợp nổi trội: {hollandResult.topCodes.join(' - ')}
                          </div>
                        </div>
                        <Button variant="tonal" size="M" fullWidth onClick={() => openCareerPath(hollandResult.primaryCode)}>
                          Xem lộ trình nghề nghiệp THPT
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <p style={{ margin: '0 0 12px', fontSize: '12.5px', color: '#64748B', lineHeight: 1.5 }}>
                          Hoàn thành 12 câu hỏi trắc nghiệm Holland để nhận phân tích ngành nghề và cộng điểm ưu tiên AI Matching.
                        </p>
                        <Button variant="tonal" size="M" fullWidth onClick={() => setActiveTab(1)}>
                          Làm trắc nghiệm Holland ngay
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* UniPath VIP Card */}
                  <div
                    style={{
                      background: profile.isPremium
                        ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)'
                        : 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                      borderRadius: '20px',
                      padding: '20px',
                      color: '#FFFFFF',
                      boxShadow: '0 6px 20px rgba(217,119,6,0.2)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <Crown size={20} color={profile.isPremium ? '#FBBF24' : '#FFFFFF'} />
                      <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800 }}>
                        {profile.isPremium ? 'Hội viên UniPath VIP Đã Kích Hoạt' : 'Nâng cấp Hội viên UniPath VIP'}
                      </h4>
                    </div>
                    <p style={{ margin: '0 0 14px', fontSize: '12.5px', opacity: 0.92, lineHeight: 1.5 }}>
                      {profile.isPremium
                        ? `Gói hiện tại: ${profile.premiumPlan || 'Gói Không Giới Hạn'}. Bạn được ưu tiên tư vấn 1-1 và mở khóa toàn bộ báo cáo sâu.`
                        : 'Mở khóa ưu tiên xếp lịch tư vấn 1-1 cùng chuyên gia và báo cáo phân tích chuyên sâu 30 trường đại học (Bản trải nghiệm Demo miễn phí).'}
                    </p>
                    {!profile.isPremium && (
                      <button
                        onClick={() => upgradePremium('Gói Không Giới Hạn')}
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '12px',
                          border: 'none',
                          backgroundColor: '#FFFFFF',
                          color: '#B45309',
                          fontSize: '13px',
                          fontWeight: 800,
                          cursor: 'pointer',
                        }}
                      >
                        Kích hoạt VIP miễn phí (Demo)
                      </button>
                    )}
                  </div>
                </div>

                {/* Right Column: Applications, 1-1 Bookings & Saved Universities */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* 1. Applications Manager */}
                  <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '24px', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', gap: '12px', flexWrap: 'wrap' }}>
                      <div>
                        <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
                          Hồ sơ xét tuyển trực tuyến của bạn ({myApplications.length})
                        </h3>
                        <div style={{ fontSize: '13px', color: '#64748B' }}>
                          Theo dõi tiến độ xét duyệt và kết quả trúng tuyển sớm năm 2026 theo thời gian thực
                        </div>
                      </div>

                      {myApplications.length > 0 && (
                        <button
                          onClick={openAllApplications}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '8px',
                            backgroundColor: '#EFF6FF',
                            color: '#2563EB',
                            border: '1px solid #BFDBFE',
                            fontSize: '12.5px',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Xem tất cả ({myApplications.length})
                        </button>
                      )}
                    </div>

                    {/* Status filter pills */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '18px', flexWrap: 'wrap' }}>
                      {['Tất cả', 'Đang xét duyệt', 'Hồ sơ hợp lệ', 'Đã trúng tuyển', 'Thiếu hồ sơ', 'Đã bị hủy'].map((st) => (
                        <button
                          key={st}
                          onClick={() => setAppFilterStatus(st)}
                          style={{
                            padding: '5px 12px',
                            borderRadius: '8px',
                            border: appFilterStatus === st ? '1px solid #2563EB' : '1px solid #E2E8F0',
                            backgroundColor: appFilterStatus === st ? '#2563EB' : '#F8FAFC',
                            color: appFilterStatus === st ? '#FFFFFF' : '#475569',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          {st}
                        </button>
                      ))}
                    </div>

                    {/* Applications list */}
                    {filteredApps.length === 0 ? (
                      <div style={{ padding: '28px', borderRadius: '16px', border: '1px dashed #CBD5E1', textAlign: 'center', backgroundColor: '#F8FAFC' }}>
                        <p style={{ margin: '0 0 12px', fontSize: '13.5px', color: '#64748B' }}>
                          {myApplications.length === 0
                            ? 'Bạn chưa nộp hồ sơ xét tuyển nào. Hãy chọn trường đại học phù hợp và nộp hồ sơ trực tuyến!'
                            : 'Không có hồ sơ nào thuộc trạng thái đang lọc.'}
                        </p>
                        {myApplications.length === 0 && (
                          <Button variant="primary" size="M" onClick={() => setActiveTab(0)}>
                            Khám phá 30 trường Đại học ngay
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {filteredApps.map((app) => {
                          const meta = getStatusMeta(app.status);
                          return (
                            <div
                              key={app.id}
                              style={{
                                padding: '16px',
                                borderRadius: '14px',
                                border: '1px solid #E2E8F0',
                                backgroundColor: '#F8FAFC',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '12px',
                                flexWrap: 'wrap',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                                <UniversityAvatar code={app.uniCode} size={42} />
                                <div style={{ minWidth: 0 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                    <strong style={{ fontSize: '14.5px', color: '#0F172A' }}>{app.uniName}</strong>
                                    <span style={{ fontSize: '11px', color: '#64748B', backgroundColor: '#FFFFFF', padding: '2px 6px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                                      Mã: {app.code}
                                    </span>
                                  </div>
                                  <div style={{ fontSize: '13px', color: '#2563EB', fontWeight: 600, marginTop: '2px' }}>
                                    Ngành: {app.major}
                                  </div>
                                  <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '2px' }}>
                                    Ngày nộp: {app.submittedAt}
                                  </div>
                                </div>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                                <span
                                  style={{
                                    fontSize: '12px',
                                    fontWeight: 800,
                                    padding: '4px 10px',
                                    borderRadius: '8px',
                                    backgroundColor: meta.bg,
                                    color: meta.color,
                                    border: `1px solid ${meta.border}`,
                                  }}
                                >
                                  {meta.label}
                                </span>

                                <Button
                                  variant="tonal"
                                  size="S"
                                  onClick={() => openApplicationDetail(app)}
                                >
                                  {app.status === 'Thiếu hồ sơ' ? 'Bổ sung hồ sơ' : 'Chi tiết'}
                                </Button>

                                {(app.status === 'Đang xét duyệt' || app.status === 'Thiếu hồ sơ') && (
                                  <button
                                    onClick={() => {
                                      if (window.confirm('Bạn có chắc chắn muốn rút / hủy hồ sơ xét tuyển này không?')) {
                                        cancelApplication(app.id);
                                      }
                                    }}
                                    style={{
                                      padding: '6px 10px',
                                      borderRadius: '8px',
                                      border: '1px solid #FECACA',
                                      backgroundColor: '#FEF2F2',
                                      color: '#DC2626',
                                      fontSize: '11.5px',
                                      fontWeight: 700,
                                      cursor: 'pointer',
                                    }}
                                  >
                                    Rút hồ sơ
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* 2. 1-1 Consultation Bookings Section */}
                  <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '24px', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', gap: '12px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar size={20} color="#0D9488" />
                        <div>
                          <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#0F172A' }}>
                            Lịch hẹn tư vấn tuyển sinh 1-1 ({myBookings.length})
                          </h3>
                          <div style={{ fontSize: '12.5px', color: '#64748B' }}>
                            Kết nối trực tiếp với Ban Tư vấn Tuyển sinh các trường đại học
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => openBookConsultation()}
                        style={{
                          padding: '7px 14px',
                          borderRadius: '10px',
                          backgroundColor: '#0D9488',
                          color: '#FFFFFF',
                          border: 'none',
                          fontSize: '12.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        + Đặt lịch tư vấn 1-1
                      </button>
                    </div>

                    {myBookings.length === 0 ? (
                      <div style={{ padding: '22px', borderRadius: '16px', border: '1px dashed #CBD5E1', textAlign: 'center', backgroundColor: '#F8FAFC', fontSize: '13px', color: '#64748B' }}>
                        Chưa có lịch hẹn tư vấn 1-1 nào. Bấm <strong>"+ Đặt lịch tư vấn 1-1"</strong> để chọn trường và khung giờ mong muốn.
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                        {myBookings.map((bk) => {
                          const st = bookingStates[bk.id] || 'pending';
                          const badge =
                            st === 'done'
                              ? { label: 'Hoàn thành', color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' }
                              : st === 'contacted'
                              ? { label: 'Đã liên hệ', color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' }
                              : { label: 'Chờ liên hệ', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' };
                          return (
                            <div
                              key={bk.id}
                              style={{
                                padding: '14px 16px',
                                borderRadius: '14px',
                                border: '1px solid #E2E8F0',
                                backgroundColor: '#F8FAFC',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', gap: '8px' }}>
                                <strong style={{ fontSize: '13.5px', color: '#0F172A' }}>
                                  {bk.uniName || `Trường ${bk.uniCode}`} ({bk.uniCode})
                                </strong>
                                <span
                                  style={{
                                    fontSize: '11px',
                                    fontWeight: 800,
                                    color: badge.color,
                                    backgroundColor: badge.bg,
                                    border: `1px solid ${badge.border}`,
                                    padding: '2px 8px',
                                    borderRadius: '8px',
                                    flexShrink: 0,
                                  }}
                                >
                                  {badge.label}
                                </span>
                              </div>
                              <div style={{ fontSize: '12.5px', color: '#2563EB', fontWeight: 700, marginBottom: '4px' }}>
                                Ngành: {bk.major}
                              </div>
                              <div style={{ fontSize: '12px', color: '#64748B' }}>
                                🕒 {bk.dateTime} {bk.channel ? `• ${bk.channel}` : ''}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* 3. Saved Wishlist Universities */}
                  <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '24px', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                      <Heart size={20} color="#EF4444" fill="#EF4444" />
                      <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#0F172A' }}>
                        Trường đại học đã lưu ({favoriteUnis.length})
                      </h3>
                    </div>

                    {favoriteUnis.length === 0 ? (
                      <div style={{ padding: '20px', borderRadius: '16px', border: '1px dashed #CBD5E1', textAlign: 'center', backgroundColor: '#F8FAFC', fontSize: '13px', color: '#64748B' }}>
                        Bạn chưa lưu trường đại học nào. Nhấn biểu tượng trái tim trên thẻ trường để lưu vào danh sách quan tâm.
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                        {favoriteUnis.map((uni) => (
                          <div
                            key={uni.id}
                            onClick={() => openUniDetail(uni.id)}
                            style={{
                              padding: '14px',
                              borderRadius: '14px',
                              border: '1px solid #E2E8F0',
                              backgroundColor: '#F8FAFC',
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '8px',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <UniversityAvatar code={uni.code} size={36} />
                              <div style={{ minWidth: 0 }}>
                                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {uni.name}
                                </div>
                                <div style={{ fontSize: '11px', color: '#64748B' }}>
                                  {uni.code} • {uni.region}
                                </div>
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', pt: '4px' } as React.CSSProperties}>
                              <span style={{ fontSize: '12px', fontWeight: 700, color: '#2563EB' }}>
                                {uni.tuitionMin}-{uni.tuitionMax}tr/năm
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(uni.id);
                                }}
                                style={{
                                  padding: '4px 8px',
                                  borderRadius: '8px',
                                  border: 'none',
                                  backgroundColor: '#FEE2E2',
                                  color: '#DC2626',
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '3px',
                                }}
                              >
                                <Trash2 size={11} /> Bỏ lưu
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </main>

      {/* ===================================================================== */}
      {/* 3. DESKTOP FOOTER                                                     */}
      {/* ===================================================================== */}
      <footer
        style={{
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #E2E8F0',
          padding: '24px 32px',
          marginTop: 'auto',
        }}
      >
        <div
          style={{
            maxWidth: '1380px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '13px',
            color: '#64748B',
          }}
        >
          <div>
            © 2026 <strong>UniPath Vietnam</strong>. Phát triển bởi <strong style={{ color: '#2563EB' }}>Trần Công Quý</strong> • Trưởng nhóm: <strong>Dương Đình Phát</strong> • Bản quyền thuộc <strong>Nhóm UP5 — Trường Đại học Phú Xuân (PXU)</strong>.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <span style={{ fontSize: '12.5px', color: '#64748B' }}>💻 Phiên bản Màn hình Rộng (Desktop Widescreen)</span>
          </div>
        </div>
      </footer>

      {/* Sticky Floating Compare Bar when universities are selected on Desktop */}
      {compareIds.length > 0 && (
        <aside
          aria-label="So sánh trường đại học"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9998,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'bounceIn 0.3s ease-out',
          }}
        >
          <button
            onClick={openCompareModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '999px',
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              color: '#FFFFFF',
              border: '2px solid rgba(255, 255, 255, 0.9)',
              boxShadow: '0 6px 24px rgba(37, 99, 235, 0.35)',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.06) translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1) translateY(0px)';
            }}
          >
            <GitCompare size={16} />
            <span>So sánh ({compareIds.length}/3)</span>
          </button>
        </aside>
      )}
    </div>
  );
};
