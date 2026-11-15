// Supabase Edge Function: chat/index.ts
// Secure backend proxy for Google Gemini 2.5 API with UniPath Admission Grounding & Multi-turn Memory

interface RequestBody {
  message: string;
  history?: Array<{
    role: 'user' | 'model';
    text: string;
  }>;
  universities?: Array<{
    code: string;
    name: string;
    score2023?: number;
    score2024?: number;
    score2025?: number;
    score2026?: number;
    tuitionMin?: number;
    tuitionMax?: number;
    major?: string;
    city?: string;
    rating?: number;
    employmentRate?: number;
    desc?: string;
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

  // Build enriched knowledge base context for Grounding
  const contextSnippet = universitiesContext
    .map((u) => {
      let line = `- [${u.code}] ${u.name} (TP: ${u.city || 'Chưa rõ'}): Ngành & Điểm chuẩn: ${u.major || 'Đa ngành'}.`;
      if (u.score2024 !== undefined || u.score2023 !== undefined) {
        line += ` Điểm chuẩn chung (2024: ${u.score2024 ?? 'N/A'}, 2023: ${u.score2023 ?? 'N/A'}).`;
      }
      line += ` Học phí: ${u.tuitionMin ?? 'N/A'} - ${u.tuitionMax ?? 'N/A'} triệu VNĐ/năm.`;
      if (u.employmentRate !== undefined) {
        line += ` Tỷ lệ việc làm: ${u.employmentRate}%.`;
      }
      if (u.rating !== undefined) {
        line += ` Đánh giá: ${u.rating}/5.`;
      }
      if (u.desc) {
        line += ` Giới thiệu: ${u.desc}.`;
      }
      return line;
    })
    .join('\n');

  // Grounding System Instruction with relaxed tone, strict official figures, general guidance allowed
  const systemInstruction = `
Bạn là Trợ lý AI Chuyên gia Tư vấn Tuyển sinh & Hướng nghiệp Đại học UniPath 2026.
Nhiệm vụ của bạn là đồng hành, giải đáp và tư vấn nhiệt tình cho thí sinh về chọn trường, chọn ngành, phương thức xét tuyển và học phí năm 2026.

QUY TẮC BẮT BUỘC VỀ SỐ LIỆU & PHONG CÁCH TƯ VẤN:
1. SỐ LIỆU CHÍNH THỨC: Điểm chuẩn từng ngành, điểm chuẩn chung, học phí, tỷ lệ việc làm và xếp hạng CHỈ được lấy từ CƠ SỞ DỮ LIỆU ĐỐI SOÁT UNIPATH được cấp bên dưới. Tuyệt đối không tự bịa ra bất kỳ con số cụ thể nào.
2. TƯ VẤN CHUYÊN MÔN & TRƯỜNG NGOÀI DANH SÁCH:
   - Bạn ĐƯỢC PHÉP tư vấn chung về định hướng nghề nghiệp, kỹ năng cần thiết, xu hướng thị trường lao động, phương pháp học tập, giải thích các khái niệm tuyển sinh và so sánh định tính giữa các khối ngành.
   - Khi thí sinh hỏi về trường ĐẠI HỌC NGOÀI DANH SÁCH đối tác của UniPath: bạn ĐƯỢC PHÉP chia sẻ thông tin tổng quan, lịch sử, thế mạnh đào tạo chung của trường đó, NHƯNG BẮT BUỘC mở đầu phần đó bằng câu:
     "UniPath chưa có dữ liệu chính thức về trường này — thông tin tham khảo chung:"
     và TUYỆT ĐỐI KHÔNG đưa ra bất kỳ con số cụ thể nào (không nêu điểm chuẩn cụ thể, không nêu số tiền học phí cụ thể) cho trường ngoài danh sách.
3. CẤU TRÚC TRẢ LỜI: Trả lời tự nhiên, thân thiện, rõ ràng, có cấu trúc mạch lạc (kết hợp đoạn văn ngắn và các gạch đầu dòng). Khi gợi ý trường/ngành học cho thí sinh, hãy giải thích rõ lý do dựa trên so sánh giữa điểm thi của thí sinh và điểm chuẩn CỦA TỪNG NGÀNH CỤ THỂ.
4. ĐỊNH DẠNG ĐẦU RA BẮT BUỘC: Bạn PHẢI trả về duy nhất một chuỗi JSON hợp lệ tuân thủ schema sau:
{
  "reply": "Nội dung trả lời tư vấn cho thí sinh bằng tiếng Việt (định dạng Markdown nhẹ, rõ ràng)",
  "suggestedUniversities": ["MÃ_TRƯỜNG_1", "MÃ_TRƯỜNG_2"]
}
(Lưu ý: suggestedUniversities là mảng các mã trường - code - viết hoa như ["PXU", "BKA"] trong cơ sở dữ liệu UniPath được gợi ý hoặc xuất hiện trong câu trả lời).

CƠ SỞ DỮ LIỆU CÁC TRƯỜNG ĐỐI SOÁT CỦA UNIPATH:
${contextSnippet || 'Dữ liệu trường đang được đồng bộ.'}

${candidateScoreInfo}
`.trim();

  // Validate server-side multi-turn history: max 6 items, valid role, truncated text
  const rawHistory = Array.isArray(body.history) ? body.history : [];
  const sanitizedHistory = rawHistory
    .filter(
      (h) =>
        h &&
        (h.role === 'user' || h.role === 'model') &&
        typeof h.text === 'string' &&
        h.text.trim().length > 0
    )
    .slice(-6)
    .map((h) => ({
      role: h.role,
      text: h.text.trim().slice(0, 500),
    }));

  // Build alternating contents for Gemini:
  // Must alternate user -> model -> user -> model, and the current message is the final 'user' turn.
  const validHistory: Array<{ role: 'user' | 'model'; parts: [{ text: string }] }> = [];
  let expectedRole: 'user' | 'model' = 'user';
  for (const item of sanitizedHistory) {
    if (item.role === expectedRole) {
      validHistory.push({
        role: item.role,
        parts: [{ text: item.text }],
      });
      expectedRole = expectedRole === 'user' ? 'model' : 'user';
    }
  }

  // If the last history turn is 'user', drop it so that history ends with 'model' before appending the current user query
  if (validHistory.length > 0 && validHistory[validHistory.length - 1].role === 'user') {
    validHistory.pop();
  }

  const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`;

  const payload = {
    system_instruction: {
      parts: [{ text: systemInstruction }],
    },
    contents: [
      ...validHistory,
      {
        role: 'user',
        parts: [{ text: userQuery }],
      },
    ],
    generationConfig: {
      temperature: 0.55,
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
