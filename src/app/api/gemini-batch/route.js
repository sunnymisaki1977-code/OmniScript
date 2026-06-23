import { GoogleGenAI } from "@google/genai";
import { WORKFLOW_STEPS } from "@/utils/promptConfigs";
import { NextResponse } from "next/server";

export const maxDuration = 60; // Next.js App Router 設定，延長 Vercel 預設截斷時間

export async function POST(req) {
  try {
    const body = await req.json();
    const { theme } = body;

    const customApiKey = req.headers.get("x-gemini-api-key");
    const apiKey = customApiKey;

    if (!apiKey) {
      return NextResponse.json(
        { error: "請先設定您的 Gemini API Key" },
        { status: 401 }
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
          contents: masterPrompt,
          config: {
            responseMimeType: "application/json",
            maxOutputTokens: 8192,
          }
        });

        const generatedText = response.text || "{}";
        let cleanText = generatedText.trim();
        
        // 去除可能的 markdown 區塊標記
        if (cleanText.startsWith("```json")) {
          cleanText = cleanText.replace(/^```json\s*/, "");
        } else if (cleanText.startsWith("```")) {
          cleanText = cleanText.replace(/^```\s*/, "");
        }
        if (cleanText.endsWith("```")) {
          cleanText = cleanText.replace(/\s*```$/, "");
        }
        cleanText = cleanText.trim();

        // 嘗試解析 JSON (若失敗會直接拋出 SyntaxError，觸發重試機制)
        const parsedData = JSON.parse(cleanText);

        // 確保所有的值都被轉為字串，避免前端 React 渲染 Error
        for (const key in parsedData) {
          if (typeof parsedData[key] === "object" && parsedData[key] !== null) {
            parsedData[key] = JSON.stringify(parsedData[key], null, 2);
          } else {
            parsedData[key] = String(parsedData[key]);
          }
        }

        return NextResponse.json({ result: parsedData, modelUsed: modelUsed });

      } catch (err) {
        const errorMsg = err.message || "";
        const isSyntaxError = err instanceof SyntaxError || err.name === 'SyntaxError';
        const isRateLimitOrUnavailable = err.status === 429 || err.status === 503 || errorMsg.includes("503") || errorMsg.includes("429") || errorMsg.includes("quota") || errorMsg.includes("not found");
        
        const shouldRetry = isRateLimitOrUnavailable || isSyntaxError;

        if (shouldRetry && attempt < MAX_RETRIES) {
          console.warn(`[Gemini API] Error (${isSyntaxError ? 'JSON Parsing Error' : errorMsg}) with model ${modelUsed}. Retrying attempt ${attempt + 1}...`);
          const delay = Math.pow(2, attempt) * 1500; // 指數退避: 3s, 6s, 12s, 24s
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        throw err;
      }
    }
  } catch (error) {
    console.error("Gemini Batch API Error:", error);
    const errorMsg = error.message || "";
    if (errorMsg.includes("429") || errorMsg.includes("quota")) {
      return NextResponse.json({ error: "Google API 免費額度已達上限 (429 Too Many Requests)。請等待約 1 分鐘後再重新嘗試！" }, { status: 429 });
    }
    return NextResponse.json(
      { error: `API 錯誤: ${errorMsg || "Failed to generate batch content"}` },
      { status: 500 }
    );
  }
}
