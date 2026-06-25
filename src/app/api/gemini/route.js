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

    // Generate the actual prompt using the config and provided context
    // 這裡我們不直接打 Gemini API，而是將組合好的 Prompt 回傳給前端
    const finalPrompt = stepConfig.prompt(context);

    return NextResponse.json({ prompt: finalPrompt }, { status: 200, headers: corsHeaders });

  } catch (error) {
    console.error("Vercel Prompt Generator Error:", error);
    return NextResponse.json(
      { error: "Failed to generate prompt", details: error.message || "" },
      { status: 500, headers: corsHeaders }
    );
  }
}
