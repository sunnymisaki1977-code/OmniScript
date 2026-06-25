import { GoogleGenAI } from "@google/genai";
import { getThemePrompts } from "@/utils/promptConfigs";
import { NextResponse } from "next/server";

export const maxDuration = 60; // Next.js App Router 設定，延長 Vercel 預設截斷時間

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-gemini-api-key",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { stepId, context } = body;

    const audienceTheme = context.audienceTheme || 'creator';
    const workflowSteps = getThemePrompts(audienceTheme);
    const stepConfig = workflowSteps.find((s) => s.id === stepId);
    if (!stepConfig) {
      return NextResponse.json({ error: "Invalid step ID" }, { status: 400, headers: corsHeaders });
    }

    const customApiKey = req.headers.get("x-gemini-api-key");
    // 改為優先使用前端傳來的 Key，如果沒有則使用 Vercel 環境變數中的 Key
    const apiKey = customApiKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "請先設定您的 Gemini API Key" },
        { status: 401, headers: corsHeaders }
      );
    }

    // Generate the actual prompt using the config and provided context
    const finalPrompt = stepConfig.prompt(context);

    // Initialize the Gemini client
    // Note: The new @google/genai SDK is used here
    const ai = new GoogleGenAI({ apiKey: apiKey });

    // 自動重試機制與模型降級
    const MODELS = [
      "gemini-2.5-pro",
      "gemini-2.5-flash",
      "gemini-2.5-flash-lite"
    ];

    const MAX_RETRIES = 5;
    let attempt = 0;

    for (let modelIndex = 0; modelIndex < MODELS.length; modelIndex++) {
      const modelUsed = MODELS[modelIndex];
      attempt++;
      try {
        console.log(`[Gemini API] Attempt ${attempt} with model ${modelUsed} for Step ${stepId}`);
        const response = await ai.models.generateContent({
          model: modelUsed,
          contents: finalPrompt,
        });

        // 成功取得結果
        return NextResponse.json({ result: response.text, modelUsed: modelUsed }, { status: 200, headers: corsHeaders });
        
      } catch (err) {
        const errorMsg = err.message || "";
        const isRateLimitOrUnavailable = err.status === 429 || err.status === 503 || errorMsg.includes("503") || errorMsg.includes("429") || errorMsg.includes("quota") || errorMsg.includes("not found");
        
        if (isRateLimitOrUnavailable && attempt < MAX_RETRIES) {
          console.warn(`[Gemini API] Error (${errorMsg || err.status}) with model ${modelUsed}. Retrying attempt ${attempt + 1}...`);
          const delay = Math.pow(2, attempt) * 1500; // 指數退避: 3s, 6s, 12s, 24s
          await new Promise(res => setTimeout(res, delay));
          continue;
        }
        throw err; // 如果已經是最後一次或非限流錯誤，就直接拋出
      }
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    const errorMsg = error.message || "";
    if (errorMsg.includes("429") || errorMsg.includes("quota")) {
      return NextResponse.json({ error: "Google API 免費額度已達上限 (429 Too Many Requests)。請稍後再重新嘗試！" }, { status: 429, headers: corsHeaders });
    }
    return NextResponse.json(
      { error: "Failed to generate content", details: errorMsg },
      { status: 500, headers: corsHeaders }
    );
  }
}
