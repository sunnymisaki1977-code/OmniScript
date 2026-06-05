import { GoogleGenAI } from "@google/genai";
import { WORKFLOW_STEPS } from "@/utils/promptConfigs";
import { NextResponse } from "next/server";

export const maxDuration = 60; // Next.js App Router 設定，延長 Vercel 預設截斷時間

export async function POST(req) {
  try {
    const body = await req.json();
    const { theme } = body;

    const customApiKey = req.headers.get("x-gemini-api-key");
    const apiKey = customApiKey || process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key is not configured or provided." },
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

    // 自動重試機制 (最高 3 次) 處理 503/429 錯誤
    let response;
    let retries = 3;
    let delay = 2000;
    while (retries > 0) {
      try {
        // 如果重試最後一次，降級為 lite 版本以提高成功率
        const modelName = retries === 1 ? "gemini-2.5-flash-lite" : "gemini-2.5-flash";
        response = await ai.models.generateContent({
          model: modelName,
          contents: masterPrompt,
          config: {
            responseMimeType: "application/json",
          }
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

    const generatedText = response.text || "{}";
    
    // 去除可能的 markdown 區塊標記 (例如 ```json 和 ```)
    let cleanText = generatedText.trim();
    if (cleanText.startsWith("```json")) {
      cleanText = cleanText.replace(/^```json\s*/, "");
    } else if (cleanText.startsWith("```")) {
      cleanText = cleanText.replace(/^```\s*/, "");
    }
    if (cleanText.endsWith("```")) {
      cleanText = cleanText.replace(/\s*```$/, "");
    }
    cleanText = cleanText.trim();

    // 解析 JSON
    let parsedResult;
    try {
      parsedResult = JSON.parse(cleanText);
    } catch (e) {
      console.error("JSON 解析失敗，原始回應:", generatedText);
      return NextResponse.json(
        { error: "AI 回傳的格式不正確，無法解析為 JSON。內容可能過大被截斷，或包含非預期的符號。" },
        { status: 500 }
      );
    }

    return NextResponse.json({ result: parsedResult });
  } catch (error) {
    console.error("Gemini Batch API Error:", error);
    return NextResponse.json(
      { error: `API 錯誤: ${error.message || "Failed to generate batch content"}` },
      { status: 500 }
    );
  }
}
