import type { University } from '../types';

export interface AiChatResult {
  reply: string;
  suggestedUniversities: string[];
  isOfflineFallback: boolean;
}

/**
 * Compact context representation of University to send over network
 */
function createCompactUniversityContext(unis: University[]) {
  return unis.slice(0, 30).map((u) => ({
    code: u.code,
    name: u.name,
    score2024: u.score2024,
    tuitionMin: u.tuitionMin,
    tuitionMax: u.tuitionMax,
    major: Array.isArray(u.majors) ? u.majors.slice(0, 3).join(', ') : '',
    city: u.loc,
  }));
}

/**
 * Dispatches query to Supabase Edge Function running Gemini 2.5 with Grounding.
 * Gracefully falls back to offline keyword responder if environment variables are missing,
 * network is unreachable, or Gemini service responds with an error.
 */
export async function sendChatMessageToAssistant(
  query: string,
  universities: University[],
  candidateScore?: number,
  offlineFallbackHandler?: (q: string) => string
): Promise<AiChatResult> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  // 1. If backend credentials are not set, immediately use offline fallback
  if (!supabaseUrl || !supabaseAnonKey) {
    const fallbackText = offlineFallbackHandler
      ? offlineFallbackHandler(query)
      : 'Cảm ơn câu hỏi của bạn. Hệ thống đang hoạt động ở chế độ ngoại tuyến.';
    return {
      reply: fallbackText,
      suggestedUniversities: [],
      isOfflineFallback: true,
    };
  }

  const endpoint = `${supabaseUrl.replace(/\/+$/, '')}/functions/v1/chat`;
  const compactUnis = createCompactUniversityContext(universities);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 14000);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${supabaseAnonKey}`,
        apikey: supabaseAnonKey,
      },
      body: JSON.stringify({
        message: query,
        universities: compactUnis,
        candidateScore,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Edge Function trả về mã lỗi HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!data || typeof data.reply !== 'string' || !data.reply.trim()) {
      throw new Error('Dữ liệu phản hồi từ AI không đúng định dạng');
    }

    return {
      reply: data.reply.trim(),
      suggestedUniversities: Array.isArray(data.suggestedUniversities)
        ? data.suggestedUniversities
        : [],
      isOfflineFallback: Boolean(data.isOfflineFallback),
    };
  } catch {
    clearTimeout(timeoutId);

    // Safe offline fallback: the user gets a working answer without app crashing
    const fallbackText = offlineFallbackHandler
      ? offlineFallbackHandler(query)
      : 'Cảm ơn câu hỏi của bạn! Trợ lý UniPath đã ghi nhận. Bạn muốn tìm hiểu sâu hơn về ngành học hay trường nào?';

    return {
      reply: fallbackText,
      suggestedUniversities: [],
      isOfflineFallback: true,
    };
  }
}
