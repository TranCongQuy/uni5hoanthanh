import { describe, expect, it } from 'vitest';
import { UNIVERSITIES } from '../data/MockData';
import {
  MAX_ACTIVE_APPLICATIONS,
  canStudentCancelApplication,
  computeHollandAssessment,
  getMajorCutoffForApp,
  isTerminalStatus,
  validateNewApplicationSubmission,
  validateReviewerStatusChange,
} from '../services/ApplicationWorkflow';
import { calculateSingleMatch, evaluateMatching, resolveAdmissionScore, explainMatchResult } from '../services/MatchingService';
import { sendChatMessageToAssistant } from '../services/AiChatService';
import type { ApplicationRecord } from '../types';
import {
  applicationSubmissionSchema,
  authLoginSchema,
  authRegisterSchema,
} from '../utils/schemas';
import {
  SYSTEM_RESERVED_EMAILS,
  canActivateDemoSandbox,
  hashPassword,
  verifySystemAccountPassword,
} from '../utils/security';
import {
  formatCleanDecimal,
  formatTuitionRange,
  isPastDateISO,
  parseDecimalInput,
  parseViDateTimeToMs,
  sanitizeCsvCell,
  validateCutoffScore,
  validateStudentScore,
  validateTuitionMin,
  validateVietnamPhone,
} from '../utils/validation';

const makeApp = (overrides: Partial<ApplicationRecord> = {}): ApplicationRecord => ({
  id: 'app-test-1',
  code: 'HS-2026-BKA02',
  uniId: 1,
  uniCode: 'BKA',
  uniName: 'ĐH Bách Khoa Hà Nội',
  major: 'Khoa học Máy tính',
  admissionMethod: 'Xét điểm thi THPT 2026',
  candidateName: 'Trần Công Quý',
  phone: '0912345678',
  email: 'quy@unipath.vn',
  score: 28.5,
  submittedAt: '24/10/2026 09:30',
  status: 'Hồ sơ hợp lệ',
  statusColor: '#0EA5E9',
  ...overrides,
});

describe('A.2 — Chặn nộp trùng hồ sơ & Giới hạn nguyện vọng tối đa', () => {
  it('chặn nộp trùng (email + trường + ngành) khi hồ sơ cũ đang hoạt động', () => {
    const existing = [makeApp({ id: 'a1', uniId: 1, major: 'Khoa học Máy tính', status: 'Hồ sơ hợp lệ' })];
    const res = validateNewApplicationSubmission(existing, 'quy@unipath.vn', 1, 'Khoa học Máy tính');
    expect(res.ok).toBe(false);
    expect(res.error).toContain('HS-2026-BKA02');
  });

  it('cho phép nộp lại nếu nguyện vọng cũ đã rút (Đã hủy)', () => {
    const existing = [makeApp({ id: 'a1', uniId: 1, major: 'Khoa học Máy tính', status: 'Đã hủy' })];
    const res = validateNewApplicationSubmission(existing, 'quy@unipath.vn', 1, 'Khoa học Máy tính');
    expect(res.ok).toBe(true);
  });

  it(`chặn nộp vượt quá giới hạn ${MAX_ACTIVE_APPLICATIONS} nguyện vọng đang hoạt động`, () => {
    const existing = Array.from({ length: MAX_ACTIVE_APPLICATIONS }, (_, idx) =>
      makeApp({
        id: `a-${idx}`,
        code: `HS-2026-PXU0${idx + 1}`,
        uniId: idx + 1,
        major: `Ngành ${idx + 1}`,
        status: 'Đang xét duyệt',
      })
    );
    const res = validateNewApplicationSubmission(existing, 'quy@unipath.vn', 11, 'Công nghệ thông tin');
    expect(res.ok).toBe(false);
    expect(res.error).toContain(`${MAX_ACTIVE_APPLICATIONS}`);
  });
});

describe('A.3 — Máy trạng thái hồ sơ (FSM) & Ràng buộc giải trình dưới chuẩn ngành', () => {
  const bka = UNIVERSITIES.find((u) => u.id === 1)!;
  const pxu = UNIVERSITIES.find((u) => u.id === 11)!;
  const bkaCutoff = getMajorCutoffForApp(bka, 'Khoa học Máy tính');
  const pxuCnttCutoff = getMajorCutoffForApp(pxu, 'Công nghệ thông tin');

  it('không cho phép "hồi sinh" hồ sơ ở trạng thái kết thúc (Đã hủy / Đã bị hủy / Đã trúng tuyển)', () => {
    for (const terminal of ['Đã hủy', 'Đã bị hủy', 'Đã trúng tuyển'] as const) {
      expect(isTerminalStatus(terminal)).toBe(true);
      const app = makeApp({ status: terminal, score: 29.8 });
      const check = validateReviewerStatusChange(app, 'Đã trúng tuyển', bkaCutoff, 'Ghi chú đầy đủ hợp lệ');
      expect(check.ok).toBe(false);
    }
  });

  it('không cho phép nhảy cóc từ "Đang xét duyệt" thẳng sang "Đã trúng tuyển"', () => {
    const app = makeApp({ status: 'Đang xét duyệt', score: 29.8 });
    const check = validateReviewerStatusChange(app, 'Đã trúng tuyển', bkaCutoff, 'Đủ điều kiện');
    expect(check.ok).toBe(false);
  });

  it('bắt buộc nhập căn cứ giải trình (>= 8 ký tự) khi duyệt hồ sơ thấp hơn điểm chuẩn NGÀNH', () => {
    const belowCutoffApp = makeApp({
      uniId: 11,
      uniCode: 'PXU',
      uniName: pxu.name,
      major: 'Công nghệ thông tin',
      score: 23.8, // Chuẩn ngành CNTT PXU = 24.5 (-0.7đ)
      status: 'Đang xét duyệt',
    });

    const withoutNote = validateReviewerStatusChange(belowCutoffApp, 'Hồ sơ hợp lệ', pxuCnttCutoff, '');
    expect(withoutNote.ok).toBe(false);
    expect(withoutNote.error).toContain('24.5');

    const withValidNote = validateReviewerStatusChange(
      belowCutoffApp,
      'Hồ sơ hợp lệ',
      pxuCnttCutoff,
      'Xét học bạ THPT đạt giải Nhất Tin học cấp Tỉnh (+1.5đ ưu tiên)'
    );
    expect(withValidNote.ok).toBe(true);
    if (withValidNote.ok) {
      expect(withValidNote.isBelowCutoffOverride).toBe(true);
    }
  });

  it('bắt buộc ghi rõ lý do khi chuyển sang "Thiếu hồ sơ" hoặc "Đã bị hủy"', () => {
    const app = makeApp({ status: 'Đang xét duyệt', score: 29.8 });
    expect(validateReviewerStatusChange(app, 'Thiếu hồ sơ', bkaCutoff, '').ok).toBe(false);
    expect(validateReviewerStatusChange(app, 'Thiếu hồ sơ', bkaCutoff, 'Thiếu bản sao học bạ HK2 lớp 12').ok).toBe(true);
  });
});

describe('A.4 — Cô lập chủ sở hữu hồ sơ (Owner Isolation)', () => {
  it('chặn Khách (chưa đăng nhập) và thí sinh khác rút hồ sơ không phải của mình', () => {
    const app = makeApp({ email: 'quy@unipath.vn', status: 'Đang xét duyệt' });
    expect(canStudentCancelApplication(app, '', true).ok).toBe(false);
    expect(canStudentCancelApplication(app, 'guest@unipath.vn', true).ok).toBe(false);
    expect(canStudentCancelApplication(app, 'hacker@unipath.vn', false).ok).toBe(false);
    expect(canStudentCancelApplication(app, 'QUY@unipath.vn', false).ok).toBe(true);
  });
});

describe('A.5, A.7, B.5, B.9, C.4 — Xử lý số thập phân, Ngày quá khứ, Sắp xếp thời gian & Chống CSV Injection', () => {
  it('parse đúng cả dấu chấm "25.7" và dấu phẩy "25,7", loại bỏ sai số float', () => {
    expect(parseDecimalInput('25.7')).toBe(25.7);
    expect(parseDecimalInput('25,7')).toBe(25.7);
    expect(formatCleanDecimal(25.200000762939453, 2)).toBe('25.2');

    const validCutoff = validateCutoffScore('25.7');
    expect(validCutoff.ok).toBe(true);
    if (validCutoff.ok) expect(validCutoff.value).toBe(25.7);

    expect(validateCutoffScore('100').ok).toBe(false);
    expect(validateCutoffScore('-5').ok).toBe(false);
    expect(validateTuitionMin('-10').ok).toBe(false);
    expect(validateTuitionMin('18').ok).toBe(true);
  });

  it('validate điểm thí sinh và SĐT Việt Nam chặt chẽ, không fallback ngầm về 24.5', () => {
    expect(validateStudentScore('abc').ok).toBe(false);
    expect(validateStudentScore('100').ok).toBe(false);
    expect(validateStudentScore('-5').ok).toBe(false);
    expect(validateStudentScore('26,75')).toEqual({ ok: true, value: 26.75 });
    expect(validateVietnamPhone('0912 345 678').ok).toBe(true);
    expect(validateVietnamPhone('12345').ok).toBe(false);
  });

  it('chặn ngày đặt lịch tư vấn trong quá khứ', () => {
    expect(isPastDateISO('2026-11-10', '2026-11-14')).toBe(true);
    expect(isPastDateISO('2026-11-14', '2026-11-14')).toBe(false);
    expect(isPastDateISO('2026-11-20', '2026-11-14')).toBe(false);
  });

  it('sắp xếp "Mới nộp gần nhất" đúng thứ tự thời gian thực (04/11 > 02/11 > 01/11 > 24/10)', () => {
    const dates = [
      { id: 'PXU01', at: '24/10/2026 09:30' },
      { id: 'PXU06', at: '02/11/2026 15:10' },
      { id: 'PXU07', at: '04/11/2026 11:20' },
      { id: 'PXU08', at: '01/11/2026 16:45' },
    ];
    const sorted = [...dates].sort((a, b) => parseViDateTimeToMs(b.at) - parseViDateTimeToMs(a.at));
    expect(sorted.map((d) => d.id)).toEqual(['PXU07', 'PXU06', 'PXU08', 'PXU01']);
  });

  it('vô hiệu hóa công thức độc hại khi xuất CSV (CSV Formula Injection)', () => {
    expect(sanitizeCsvCell('=CMD|"/C calc"!A0').startsWith('"\'=')).toBe(true);
    expect(sanitizeCsvCell('+SUM(A1:A2)').startsWith('"\'+')).toBe(true);
    expect(sanitizeCsvCell('Trần Công Quý')).toBe('"Trần Công Quý"');
  });
});

describe('B.1, B.2, B.3, B.12 — Đồng bộ điểm chuẩn ngành, Công thức AI Matching & Bộ lọc Ngân sách/Khối thi', () => {
  it('chuẩn hóa điểm PXU không còn mâu thuẫn 25.2 vs 24.5 và hiển thị rõ khoảng học phí', () => {
    const pxu = UNIVERSITIES.find((u) => u.code === 'PXU')!;
    expect(pxu.score2024).toBe(24.5);
    expect(getMajorCutoffForApp(pxu, 'Công nghệ thông tin')).toBe(24.5);
    expect(formatTuitionRange(25, 45)).toBe('25–45 tr/năm');
    expect(formatTuitionRange(25, 45, true)).toBe('25–45tr');
  });

  it('công thức % trúng tuyển thống nhất, mượt và trần <= 98% (không nhảy vọt 100%)', () => {
    const pxu = UNIVERSITIES.find((u) => u.code === 'PXU')!;
    const single = calculateSingleMatch(pxu, 26.5, 'E');
    expect(single.matchingPercent).toBeLessThanOrEqual(98);

    const evalRes = evaluateMatching(26.5, 60, 'E', 'Tất cả', UNIVERSITIES, 'Tất cả');
    const allMatched = [...evalRes.safeList, ...evalRes.moderateList, ...evalRes.challengingList];
    const pxuEval = allMatched.find((m) => m.university.code === 'PXU')!;
    expect(pxuEval.matchingPercent).toBe(single.matchingPercent);
  });

  it('bộ lọc Ngân sách <= 25tr thực sự loại các trường có học phí tối thiểu > 25tr (UET/UIT 28tr, UEH 26tr)', () => {
    const res = evaluateMatching(26.0, 25, '', 'Tất cả', UNIVERSITIES, 'Tất cả');
    const allReturned = [...res.safeList, ...res.moderateList, ...res.challengingList];
    expect(res.filteredOutByBudgetCount).toBeGreaterThan(0);
    expect(allReturned.every((m) => m.university.tuitionMin <= 25)).toBe(true);
    expect(allReturned.some((m) => m.university.code === 'UET')).toBe(false);
    expect(allReturned.some((m) => m.university.code === 'UIT')).toBe(false);
    expect(allReturned.some((m) => m.university.code === 'UEH')).toBe(false);
  });

  it('bộ lọc Khối thi (ví dụ B00) chỉ giữ lại các trường có xét tổ hợp tương ứng', () => {
    const res = evaluateMatching(26.0, 60, '', 'Tất cả', UNIVERSITIES, 'B00');
    expect(res.filteredOutByBlockCount).toBeGreaterThan(0);
    const codes = [...res.safeList, ...res.moderateList, ...res.challengingList].map((m) => m.university.code);
    expect(codes).toContain('HMU');
    expect(codes).not.toContain('FTU');
  });
});

describe('B.7 — Trắc nghiệm Holland xử lý hòa điểm & loại bỏ nhóm 0 điểm khỏi Top', () => {
  it('khi R=6, I=6, A=S=E=C=0 chỉ trả về [R, I] và ghi nhận đồng điểm, không đưa nhóm 0đ vào Top 3', () => {
    const res = computeHollandAssessment({ R: 6, I: 6, A: 0, S: 0, E: 0, C: 0 });
    expect(res.topCodes).toEqual(['R', 'I']);
    expect(res.tiedTopCodes).toEqual(['R', 'I']);
    expect(res.topCodes).not.toContain('A');
  });
});

describe('A.1, C.1, C.2 — Băm mật khẩu Salted SHA-256 & Chặn mạo danh email hệ thống', () => {
  it('xác thực mật khẩu tài khoản hệ thống bằng SHA-256 và từ chối mật khẩu sai', () => {
    expect(verifySystemAccountPassword('admin@unipath.vn', 'sai-mat-khau')).toBe(false);
    expect(verifySystemAccountPassword('tuyensinh@pxu.edu.vn', '123456')).toBe(false);
    expect(SYSTEM_RESERVED_EMAILS.has('admin@unipath.vn')).toBe(true);
    expect(SYSTEM_RESERVED_EMAILS.has('tuyensinh@pxu.edu.vn')).toBe(true);
  });

  it('băm mật khẩu người dùng mới kèm salt theo email (không lưu plaintext)', () => {
    const digest = hashPassword('sinhvien@unipath.vn', 'MatKhauAnToan2026!');
    expect(digest).not.toBe('MatKhauAnToan2026!');
    expect(digest).toHaveLength(64);
    expect(hashPassword('sinhvien@unipath.vn', 'MatKhauAnToan2026!')).toBe(digest);
    expect(hashPassword('sinhvien@unipath.vn', 'MatKhauSai')).not.toBe(digest);
    expect(hashPassword('khac@unipath.vn', 'MatKhauAnToan2026!')).not.toBe(digest);
  });
});

describe('Hạng mục 6 — Khóa lỗ hổng Demo Sandbox (RBAC + Environment Flag)', () => {
  it('từ chối kích hoạt khi biến môi trường VITE_ENABLE_DEMO_MODE tắt (false)', () => {
    const res = canActivateDemoSandbox(false, true, 'admin');
    expect(res.allowed).toBe(false);
    expect(res.reason).toContain('vô hiệu hóa');
  });

  it('khách chưa đăng nhập không thể kích hoạt demo mode kể cả khi cờ môi trường bật', () => {
    const res = canActivateDemoSandbox(true, false, undefined);
    expect(res.allowed).toBe(false);
    expect(res.reason).toContain('Chỉ Quản trị viên (Admin)');
  });

  it('thí sinh đã đăng nhập (role student) không thể kích hoạt demo mode', () => {
    const res = canActivateDemoSandbox(true, true, 'student');
    expect(res.allowed).toBe(false);
    expect(res.reason).toContain('Chỉ Quản trị viên (Admin)');
  });

  it('tuyển sinh trường (role pxu) không thể kích hoạt demo mode', () => {
    const res = canActivateDemoSandbox(true, true, 'pxu');
    expect(res.allowed).toBe(false);
    expect(res.reason).toContain('Chỉ Quản trị viên (Admin)');
  });

  it('chỉ Quản trị viên (role admin) đã đăng nhập mới được phép kích hoạt demo mode khi cờ môi trường bật', () => {
    const res = canActivateDemoSandbox(true, true, 'admin');
    expect(res.allowed).toBe(true);
    expect(res.reason).toBeUndefined();
  });
});

describe('Hạng mục 7 — AI Thật Qua Backend & Offline Fallback', () => {
  it('tự động fallback về chế độ ngoại tuyến khi không có URL/Key Supabase mà không gây crash', async () => {
    const fallbackFn = (q: string) => `Trả lời mẫu cho: ${q}`;
    const res = await sendChatMessageToAssistant('Học phí Bách Khoa thế nào?', UNIVERSITIES, 25.0, fallbackFn);
    expect(res.isOfflineFallback).toBe(true);
    expect(res.reply).toBe('Trả lời mẫu cho: Học phí Bách Khoa thế nào?');
    expect(Array.isArray(res.suggestedUniversities)).toBe(true);
  });
});

describe('Hạng mục 8 — Validation Schema Zod & Form Validation', () => {
  it('applicationSubmissionSchema chấp nhận dữ liệu hợp lệ (tên, SĐT VN 10 số, điểm 0-30)', () => {
    const res = applicationSubmissionSchema.safeParse({
      candidateName: 'Trần Công Quý',
      phone: '0912345678',
      score: 25.5,
    });
    expect(res.success).toBe(true);
  });

  it('applicationSubmissionSchema từ chối số điện thoại sai định dạng (thiếu số, sai đầu số)', () => {
    const wrongLength = applicationSubmissionSchema.safeParse({
      candidateName: 'Trần Công Quý',
      phone: '091234567', // 9 digits
      score: 25.5,
    });
    expect(wrongLength.success).toBe(false);

    const wrongPrefix = applicationSubmissionSchema.safeParse({
      candidateName: 'Trần Công Quý',
      phone: '0123456789', // đầu số cũ
      score: 25.5,
    });
    expect(wrongPrefix.success).toBe(false);
  });

  it('applicationSubmissionSchema từ chối điểm xét tuyển âm hoặc vượt quá 30 điểm', () => {
    const negative = applicationSubmissionSchema.safeParse({
      candidateName: 'Trần Công Quý',
      phone: '0912345678',
      score: -0.5,
    });
    expect(negative.success).toBe(false);

    const over30 = applicationSubmissionSchema.safeParse({
      candidateName: 'Trần Công Quý',
      phone: '0912345678',
      score: 30.25,
    });
    expect(over30.success).toBe(false);
  });

  it('authLoginSchema và authRegisterSchema từ chối mật khẩu quá ngắn (< 6 ký tự)', () => {
    const loginShort = authLoginSchema.safeParse({
      email: 'test@unipath.vn',
      password: '123',
    });
    expect(loginShort.success).toBe(false);
    if (!loginShort.success) {
      expect(loginShort.error.issues[0]?.message).toContain('ít nhất 6 ký tự');
    }

    const regShort = authRegisterSchema.safeParse({
      fullName: 'Thí sinh mới',
      email: 'test@unipath.vn',
      password: '12345',
      confirmPassword: '12345',
      agreedTerms: true,
    });
    expect(regShort.success).toBe(false);
  });

  it('authLoginSchema từ chối địa chỉ email sai cú pháp', () => {
    const res = authLoginSchema.safeParse({
      email: 'sai-dinh-dang-email',
      password: 'password123',
    });
    expect(res.success).toBe(false);
  });

  it('authRegisterSchema từ chối khi mật khẩu xác nhận không khớp', () => {
    const mismatch = authRegisterSchema.safeParse({
      fullName: 'Thí sinh mới',
      email: 'test@unipath.vn',
      password: 'password123',
      confirmPassword: 'passwordKhac',
      agreedTerms: true,
    });
    expect(mismatch.success).toBe(false);
    if (!mismatch.success) {
      expect(mismatch.error.issues[0]?.message).toContain('không khớp');
    }
  });
});

describe('Hạng mục 6 — Đồng bộ điểm AI Matching sang Modal Chi tiết trường', () => {
  it('ưu tiên điểm vừa nhập ở AI Matching (ví dụ 26.5đ) thay vì lùi về điểm mặc định hồ sơ (24.5đ)', () => {
    const profileScore = 24.5;
    const matchingScore = 26.5;
    const resolved = resolveAdmissionScore(profileScore, matchingScore);

    expect(resolved.score).toBe(26.5);
    expect(resolved.source).toBe('matching');
    expect(resolved.sourceLabel).toContain('Tính theo điểm bạn vừa nhập 26.5 điểm tại AI Matching');

    // Điểm profile gốc không bị thay đổi / ô nhiễm
    expect(profileScore).toBe(24.5);
  });

  it('fallback về điểm dự kiến trong hồ sơ khi chưa từng nhập điểm ở Matching', () => {
    const profileScore = 25.0;
    const resolved = resolveAdmissionScore(profileScore, null);

    expect(resolved.score).toBe(25.0);
    expect(resolved.source).toBe('profile');
    expect(resolved.sourceLabel).toContain('Tính theo điểm dự kiến trong hồ sơ (25.0 điểm)');
  });
});

describe('Hạng mục 7 — Giải thích % trúng tuyển Vì sao X%? (Explainable Matching Breakdown)', () => {
  it('bóc tách đúng ngành tham chiếu, chênh lệch delta, % cơ bản, thưởng Holland và ngân sách', () => {
    const uni = UNIVERSITIES.find((u) => u.code === 'PXU') || UNIVERSITIES[0];
    const match = calculateSingleMatch(uni, 20.0, 'R', undefined, 20);
    const exp = explainMatchResult(match, 20.0, 20);

    expect(exp.matchedMajor).toBe(match.matchedMajor);
    expect(exp.majorCutoff).toBe(match.majorCutoff);
    expect(exp.userScore).toBe(20.0);
    expect(exp.diffScore).toBe(match.diffScore);
    expect(exp.basePercent).toBe(match.basePercent);
    expect(exp.matchingPercent).toBe(match.matchingPercent);
    expect(exp.isBudgetMatched).toBe(match.isBudgetMatched);
    expect(exp.budgetExplanation).toBeTruthy();
    if (match.hollandBonus > 0) {
      expect(exp.hollandExplanation).toContain('Holland');
    }
  });

  it('báo vượt ngân sách học phí khi mức học phí tối thiểu lớn hơn ngân sách người dùng', () => {
    const uni = UNIVERSITIES.find((u) => u.tuitionMin > 20) || UNIVERSITIES[0];
    const match = calculateSingleMatch(uni, 25.0, undefined, undefined, 10);
    const exp = explainMatchResult(match, 25.0, 10);

    expect(exp.isBudgetMatched).toBe(false);
    expect(exp.budgetExplanation).toContain('vượt ngân sách');
  });
});
