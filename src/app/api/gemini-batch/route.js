import { GoogleGenAI } from "@google/genai";
import { WORKFLOW_STEPS } from "@/utils/promptConfigs";
import { NextResponse } from "next/server";

export async function POST(req) {
  // 設定較長的 timeout 以免 Vercel 預設截斷 (如果有設定 maxDuration 的話)
  // export const maxDuration = 60; // Next.js App Router 設定 (可選)
  
  try {
    const body = await req.json();
    const { theme } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key is not configured in environment variables." },
        { status: 500 }
      );
    }

    // 建立一個給大師級提示詞用的「自我參考」上下文
    const selfReferenceContext = {
      theme: theme,
      step1: "【請基於你在 Step 1 產出的內容】",
      step2: "【請基於你在 Step 2 產出的內容】",
      step3: "【請基於你在 Step 3 產出的內容】",
      step4: "【請基於你在 Step 4 產出的內容】",
      step5: "【請基於你在 Step 5 產出的內容】",
    };

    let masterPrompt = `你現在是頂尖的全域企劃 AI 助理。請針對主題「${theme}」一次性產出 9 個步驟的完整企劃內容。
    
【絕對要求】：
1. 你必須在腦海中依序完成 Step 1 到 Step 9 的推演。當後面的步驟要求參考前面的步驟時，請直接使用你剛剛產出的內容。
2. 你「必須且只能」回傳一個純 JSON 格式的字串，絕對不要包含任何 markdown 區塊標記 (如 \`\`\`json)，也不要有任何前後問候語。
3. JSON 的 key 必須精準命名為 "step1", "step2", "step3", "step4", "step5", "step6", "step7", "step8", "step9"。
4. 每個 key 的 value 請填入該步驟生成的完整字串內容（若有換行請正確跳脫）。

以下是這 9 個步驟的詳細指令：\n\n`;

    for (const step of WORKFLOW_STEPS) {
      masterPrompt += `--- [步驟 ${step.id}：${step.title}] ---\n`;
      masterPrompt += step.prompt(selfReferenceContext) + "\n\n";
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });

    // 呼叫 Gemini，強制要求回應為 JSON 格式
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: masterPrompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const generatedText = response.text || "{}";
    
    // 解析 JSON
    let parsedResult;
    try {
      parsedResult = JSON.parse(generatedText);
    } catch (e) {
      console.error("JSON 解析失敗，原始回應:", generatedText);
      return NextResponse.json(
        { error: "AI 回傳的格式不正確，無法解析為 JSON。" },
        { status: 500 }
      );
    }

    return NextResponse.json({ result: parsedResult });
  } catch (error) {
    console.error("Gemini Batch API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate batch content", details: error.message },
      { status: 500 }
    );
  }
}
