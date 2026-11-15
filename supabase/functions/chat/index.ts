// Supabase Edge Function: chat/index.ts
// Secure backend proxy for Google Gemini 2.5 API with UniPath Admission Grounding

interface RequestBody {
  message: string;
  universities?: Array<{
    code: string;
    name: string;
    score2024?: number;
    score2025?: number;
    score2026?: number;
    tuitionMin?: number;
    tuitionMax?: number;
    major?: string;
    city?: string;
  }>;
  candidateScore?: number;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Deno type declaration for non-Deno IDE linters
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
  serve(handler: (req: Request) => Promise<Response>): void;
};

async function callGeminiWithRetry(
  url: string,
  payload: unknown,
  maxRetries = 2
): Promise<Response> {
  let attempt = 0;
  let delayMs = 600;

  while (attempt <= maxRetries) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // If rate limited (429) or transient server error (5xx), retry with exponential backoff
      if ((response.status === 429 || response.status >= 500) && attempt < maxRetries) {
        attempt++;
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        delayMs *= 2;
        continue;
      }

      return response;
    } catch (err) {
      if (attempt < maxRetries) {
        attempt++;
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        delayMs *= 2;
        continue;
      }
      throw err;
    }
  }

  throw new Error('Đã vượt quá số lần thử lại tối đa khi kết nối với Gemini API');
}

Deno.serve(async (req: Request): Promise<Response> => {
  // Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Phương thức không được hỗ trợ' }), {
      status: 405,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
  const geminiModel = Deno.env.get('GEMINI_MODEL') || 'gemini-2.5-flash-lite';

  if (!geminiApiKey) {
    return new Response(
      JSON.stringify({
        error: 'Chưa cấu hình GEMINI_API_KEY trong Supabase Secrets',
        isOfflineFallback: true,
      }),
      {
        status: 500,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      }
    );
  }

  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Dữ liệu yêu cầu không đúng định dạng JSON' }),
      {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      }
    );
  }

  const userQuery = (body.message || '').trim();
  if (!userQuery) {
    return new Response(
      JSON.stringify({ error: 'Nội dung tin nhắn không được để trống' }),
      {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      }
    );
  }

  const universitiesContext = body.universities || [];
  const candidateScoreInfo = body.candidateScore
    ? `Điểm thi dự kiến/thực tế của thí sinh: ${body.candidateScore} điểm.`
    : 'Thí sinh chưa cung cấp điểm dự kiến.';

  // Build compact knowledge base context for Grounding
  const contextSnippet = universitiesContext
    .map(
      (u) =>
        `- [${u.code}] ${u.name} (TP: ${u.city || 'Chưa rõ'}): Ngành thế mạnh: ${u.major || 'Đa ngành'}. Điểm chuẩn 2024: ${u.score2024 || 'N/A'}, 2025: ${u.score2025 || 'N/A'}, 2026: ${u.score2026 || 'N/A'}. Học phí: ${u.tuitionMin ?? 'N/A'} - ${u.tuitionMax ?? 'N/A'} triệu VNĐ/năm.`
    )
    .join('\n');

  const systemInstruction = `
Bạn là Trợ lý AI Chuyên gia Tư vấn Tuyển sinh & Hướng nghiệp Đại học UniPath 2026.
Nhiệm vụ của bạn là giải đáp câu hỏi của thí sinh về chọn trường, chọn ngành, cơ hội trúng tuyển và học phí năm 2026.

NGUYÊN TẮC BẮT BUỘC (GROUNDING & AN TOÀN):
1. DỮ LIỆU ĐƯỢC PHÉP DÙNG: Bạn chỉ được sử dụng dữ liệu từ danh sách các trường đại học đối tác của UniPath được cung cấp bên dưới.
2. TUYỆT ĐỐI KHÔNG ẢO GIÁC: Nếu người dùng hỏi về trường không có trong danh sách 30 trường dưới đây, hoặc thông tin nằm ngoài phạm vi được cung cấp, bạn PHẢI trả lời rõ: "Hệ thống UniPath hiện chưa có dữ liệu chính thức về trường này." Không được tự bịa ra điểm chuẩn hay học phí.
3. PHONG CÁCH: Thân thiện, khích lệ, khách quan, súc tích, giải thích rõ ràng và có căn cứ điểm số.
4. ĐỊNH DẠNG ĐẦU RA BẮT BUỘC: Bạn PHẢI trả về duy nhất một chuỗi JSON hợp lệ tuân thủ schema sau:
{
  "reply": "Nội dung trả lời tư vấn cho thí sinh bằng tiếng Việt (có thể dùng bullet points ngắn gọn)",
  "suggestedUniversities": ["MÃ_TRƯỜNG_1", "MÃ_TRƯỜNG_2"]
}
(Lưu ý: suggestedUniversities là mảng các mã trường - code - viết hoa như ["PXU", "BKA"] xuất hiện hoặc được gợi ý trực tiếp trong câu trả lời).

CƠ SỞ DỮ LIỆU 30 TRƯỜNG ĐỐI SOÁT CỦA UNIPATH:
${contextSnippet || 'Dữ liệu trường đang được đồng bộ.'}

${candidateScoreInfo}
`.trim();

  const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`;

  const payload = {
    system_instruction: {
      parts: [{ text: systemInstruction }],
    },
    contents: [
      {
        role: 'user',
        parts: [{ text: userQuery }],
      },
    ],
    generationConfig: {
      temperature: 0.3,
      response_mime_type: 'application/json',
    },
  };

  try {
    const geminiRes = await callGeminiWithRetry(geminiEndpoint, payload, 2);

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      return new Response(
        JSON.stringify({
          error: `Gemini API lỗi (${geminiRes.status}): ${errText}`,
          isOfflineFallback: true,
        }),
        {
          status: geminiRes.status,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        }
      );
    }

    const geminiData = await geminiRes.json();
    const rawReply =
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';

    let parsedOutput: { reply: string; suggestedUniversities?: string[] };
    try {
      parsedOutput = JSON.parse(rawReply);
    } catch {
      // Fallback in case Gemini returns JSON wrapped in markdown ticks
      const cleaned = rawReply.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
      try {
        parsedOutput = JSON.parse(cleaned);
      } catch {
        parsedOutput = {
          reply: rawReply || 'Cảm ơn bạn đã đặt câu hỏi. UniPath đã ghi nhận.',
          suggestedUniversities: [],
        };
      }
    }

    return new Response(
      JSON.stringify({
        reply: parsedOutput.reply,
        suggestedUniversities: Array.isArray(parsedOutput.suggestedUniversities)
          ? parsedOutput.suggestedUniversities
          : [],
        isOfflineFallback: false,
      }),
      {
        status: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(
      JSON.stringify({
        error: `Lỗi kết nối Gemini: ${message}`,
        isOfflineFallback: true,
      }),
      {
        status: 502,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      }
    );
  }
});
