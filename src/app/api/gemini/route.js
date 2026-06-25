import { GoogleGenAI } from "@google/genai";
import { getThemePrompts } from "@/utils/promptConfigs";
import { NextResponse } from "next/server";

export const maxDuration = 60; // Next.js App Router 設定，延長 Vercel 預設截斷時間

export async function POST(req) {
  try {
    const body = await req.json();
    const { stepId, context } = body;

    const audienceTheme = context.audienceTheme || 'creator';
    const workflowSteps = getThemePrompts(audienceTheme);
    const stepConfig = workflowSteps.find((s) => s.id === stepId);
    if (!stepConfig) {
      return NextResponse.json({ error: "Invalid step ID" }, { status: 400 });
    }

    const customApiKey = req.headers.get("x-gemini-api-key");
    const apiKey = customApiKey;

    if (!apiKey) {
      return NextResponse.json(
        { error: "請先設定您的 Gemini API Key" },
        { status: 401 }
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

    let text = "";
    let modelUsed = "";
    const MAX_RETRIES = 5;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      modelUsed = MODELS[attempt - 1] || MODELS[MODELS.length - 1];

      try {
        const response = await ai.models.generateContent({
          model: modelUsed,
          contents: finalPrompt,
        });

        text = response.text || "";
        return NextResponse.json({ result: text, modelUsed: modelUsed });
        
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
      return NextResponse.json({ error: "Google API 免費額度已達上限 (429 Too Many Requests)。請稍後再重新嘗試！" }, { status: 429 });
    }
    return NextResponse.json(
      { error: "Failed to generate content", details: errorMsg },
      { status: 500 }
    );
  }
}
