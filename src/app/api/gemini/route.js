import { GoogleGenAI } from "@google/genai";
import { WORKFLOW_STEPS } from "@/utils/promptConfigs";
import { NextResponse } from "next/server";

export const maxDuration = 60; // Next.js App Router 設定，延長 Vercel 預設截斷時間

export async function POST(req) {
  try {
    const body = await req.json();
    const { stepId, context } = body;

    const stepConfig = WORKFLOW_STEPS.find((s) => s.id === stepId);
    if (!stepConfig) {
      return NextResponse.json({ error: "Invalid step ID" }, { status: 400 });
    }

    const customApiKey = req.headers.get("x-gemini-api-key");
    const apiKey = customApiKey || process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key is not configured or provided." },
        { status: 500 }
      );
    }

    // Generate the actual prompt using the config and provided context
    const finalPrompt = stepConfig.prompt(context);

    // Initialize the Gemini client
    // Note: The new @google/genai SDK is used here
    const ai = new GoogleGenAI({ apiKey: apiKey });

    // 自動重試機制 (最高 3 次) 處理 503/429 錯誤
    let response;
    let retries = 3;
    let delay = 2000;
    while (retries > 0) {
      try {
        response = await ai.models.generateContent({
          model: "gemini-1.5-flash", // 切換為 1.5-flash 避免 2.0 quota limit 0 問題
          contents: finalPrompt,
        });
        break; // 成功則跳出迴圈
      } catch (err) {
        if (err.message && (err.message.includes("503") || err.message.includes("429")) && retries > 1) {
          console.warn(`Model busy or rate limited, retrying in ${delay/1000}s... (${retries-1} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, delay));
          retries--;
          delay *= 2; // 指數退避 (Exponential backoff)
        } else {
          throw err; // 其他錯誤或重試耗盡，直接往外拋
        }
      }
    }

    const generatedText = response.text || "";

    return NextResponse.json({ result: generatedText });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate content", details: error.message },
      { status: 500 }
    );
  }
}
