import { GoogleGenAI } from "@google/genai";
import { WORKFLOW_STEPS } from "@/utils/promptConfigs";
import { NextResponse } from "next/server";

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

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: finalPrompt,
    });

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
