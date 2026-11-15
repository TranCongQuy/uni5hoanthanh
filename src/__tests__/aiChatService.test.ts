import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  createCompactUniversityContext,
  sendChatMessageToAssistant,
  type ChatHistoryItem,
} from '../services/AiChatService';
import type { University } from '../types';

const MOCK_UNIVERSITIES: University[] = [
  {
    id: 11,
    code: 'PXU',
    name: 'Trường Đại học Phú Xuân',
    loc: 'Huế',
    region: 'Trung',
    tuitionMin: 18,
    tuitionMax: 22,
    majors: ['Công nghệ thông tin', 'Quản trị kinh doanh', 'Ngôn ngữ Anh'],
    cutoffScores: {
      'Công nghệ thông tin': 18.5,
      'Quản trị kinh doanh': 17.0,
      'Ngôn ngữ Anh': 16.5,
    },
    rating: 4.8,
    desc: 'Đại học Phú Xuân là trường đại học tiên phong áp dụng mô hình đào tạo thực chiến kết hợp doanh nghiệp tại Thừa Thiên Huế, cam kết việc làm sau tốt nghiệp.',
    employmentRate: 92,
    score2022: 16.0,
    score2023: 17.0,
    score2024: 18.0,
  },
  {
    id: 1,
    code: 'BKA',
    name: 'Đại học Bách Khoa Hà Nội',
    loc: 'Hà Nội',
    region: 'Bắc',
    tuitionMin: 24,
    tuitionMax: 35,
    majors: ['Khoa học máy tính', 'Kỹ thuật điều khiển'],
    cutoffScores: {
      'Khoa học máy tính': 28.5,
      'Kỹ thuật điều khiển': 26.5,
    },
    rating: 4.9,
    desc: 'Trường kỹ thuật trọng điểm hàng đầu Việt Nam đào tạo chuyên sâu về kỹ nghệ công nghệ.',
    employmentRate: 98,
    score2022: 27.5,
    score2023: 28.0,
    score2024: 28.5,
  },
];

interface CapturedRequestBody {
  message: string;
  history?: ChatHistoryItem[];
  universities: Array<{
    code: string;
    name: string;
    major?: string;
    rating?: number;
    employmentRate?: number;
    [key: string]: unknown;
  }>;
  candidateScore?: number;
}

describe('AiChatService - Enhanced Context and Multi-turn History (B2)', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co');
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'mock-anon-key');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('createCompactUniversityContext: maps all majors with cutoffs, rating, employmentRate, score2023, and truncated desc', () => {
    const compact = createCompactUniversityContext(MOCK_UNIVERSITIES);

    expect(compact).toHaveLength(2);

    const pxu = compact[0];
    expect(pxu.code).toBe('PXU');
    expect(pxu.name).toBe('Trường Đại học Phú Xuân');
    expect(pxu.city).toBe('Huế');
    expect(pxu.score2023).toBe(17.0);
    expect(pxu.score2024).toBe(18.0);
    expect(pxu.tuitionMin).toBe(18);
    expect(pxu.tuitionMax).toBe(22);
    expect(pxu.rating).toBe(4.8);
    expect(pxu.employmentRate).toBe(92);
    // Format "Tên ngành: điểm" for all cutoffs
    expect(pxu.major).toContain('Công nghệ thông tin: 18.5');
    expect(pxu.major).toContain('Quản trị kinh doanh: 17');
    expect(pxu.major).toContain('Ngôn ngữ Anh: 16.5');
    // desc must be <= 160 characters
    expect(pxu.desc).toBeDefined();
    expect(pxu.desc!.length).toBeLessThanOrEqual(160);
  });

  it('sendChatMessageToAssistant: dispatches request payload with history and rich context to Edge Function', async () => {
    let capturedBody: CapturedRequestBody | null = null;

    vi.spyOn(globalThis, 'fetch').mockImplementation(async (_url, init) => {
      if (init && init.body) {
        capturedBody = JSON.parse(init.body as string);
      }
      return new Response(
        JSON.stringify({
          reply: 'Chào bạn! Với điểm thi 24.5, ngành CNTT tại PXU là lựa chọn rất an toàn.',
          suggestedUniversities: ['PXU'],
          isOfflineFallback: false,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    });

    const mockHistory: ChatHistoryItem[] = [
      { role: 'user', text: 'Chào trợ lý AI' },
      { role: 'model', text: 'Chào bạn! Mình có thể hỗ trợ gì cho bạn?' },
      { role: 'user', text: 'Em đang phân vân ngành CNTT tại miền Trung' },
    ];

    const result = await sendChatMessageToAssistant(
      'Học phí và cơ hội việc làm tại ĐH Phú Xuân thế nào?',
      MOCK_UNIVERSITIES,
      24.5,
      undefined,
      mockHistory
    );

    expect(result.reply).toContain('Chào bạn! Với điểm thi 24.5');
    expect(result.suggestedUniversities).toEqual(['PXU']);
    expect(result.isOfflineFallback).toBe(false);

    expect(capturedBody).not.toBeNull();
    expect(capturedBody.message).toBe('Học phí và cơ hội việc làm tại ĐH Phú Xuân thế nào?');
    expect(capturedBody.candidateScore).toBe(24.5);
    expect(capturedBody.history).toHaveLength(3);
    expect(capturedBody.history[0]).toEqual({ role: 'user', text: 'Chào trợ lý AI' });
    expect(capturedBody.history[1]).toEqual({ role: 'model', text: 'Chào bạn! Mình có thể hỗ trợ gì cho bạn?' });
    expect(capturedBody.universities[0].major).toContain('Công nghệ thông tin: 18.5');
    expect(capturedBody.universities[0].rating).toBe(4.8);
    expect(capturedBody.universities[0].employmentRate).toBe(92);
  });

  it('sendChatMessageToAssistant: limits history to 6 most recent turns and truncates each turn to 500 chars', async () => {
    let capturedBody: CapturedRequestBody | null = null;

    vi.spyOn(globalThis, 'fetch').mockImplementation(async (_url, init) => {
      if (init && init.body) {
        capturedBody = JSON.parse(init.body as string);
      }
      return new Response(
        JSON.stringify({ reply: 'Trả lời test', suggestedUniversities: [] }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    });

    const longText = 'A'.repeat(800);
    const mockHistory8Items: ChatHistoryItem[] = [
      { role: 'user', text: 'Item 1' },
      { role: 'model', text: 'Item 2' },
      { role: 'user', text: 'Item 3' },
      { role: 'model', text: 'Item 4' },
      { role: 'user', text: 'Item 5' },
      { role: 'model', text: 'Item 6' },
      { role: 'user', text: 'Item 7' },
      { role: 'model', text: longText },
    ];

    await sendChatMessageToAssistant(
      'Câu hỏi số 9',
      MOCK_UNIVERSITIES,
      undefined,
      undefined,
      mockHistory8Items
    );

    expect(capturedBody.history).toHaveLength(6);
    // Should take the last 6 items (Item 3 to Item 8)
    expect(capturedBody.history[0].text).toBe('Item 3');
    // Long text must be truncated to 500 characters
    expect(capturedBody.history[5].text.length).toBe(500);
  });

  it('sendChatMessageToAssistant: backwards compatibility when history is omitted', async () => {
    let capturedBody: CapturedRequestBody | null = null;

    vi.spyOn(globalThis, 'fetch').mockImplementation(async (_url, init) => {
      if (init && init.body) {
        capturedBody = JSON.parse(init.body as string);
      }
      return new Response(
        JSON.stringify({ reply: 'Phản hồi đơn lẻ', suggestedUniversities: ['BKA'] }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    });

    const result = await sendChatMessageToAssistant(
      'Điểm chuẩn BKA năm 2024?',
      MOCK_UNIVERSITIES
    );

    expect(result.reply).toBe('Phản hồi đơn lẻ');
    expect(result.suggestedUniversities).toEqual(['BKA']);
    expect(capturedBody.history).toBeUndefined();
  });

  it('sendChatMessageToAssistant: falls back to offline handler on network error without crashing', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'));

    const offlineHandler = vi.fn((q: string) => `Ngoại tuyến: ${q}`);

    const result = await sendChatMessageToAssistant(
      'Học phí PXU?',
      MOCK_UNIVERSITIES,
      undefined,
      offlineHandler
    );

    expect(result.isOfflineFallback).toBe(true);
    expect(result.reply).toBe('Ngoại tuyến: Học phí PXU?');
    expect(offlineHandler).toHaveBeenCalledWith('Học phí PXU?');
  });
});
