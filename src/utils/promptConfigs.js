/**
 * utils/promptConfigs.js
 * 通用型 AI 內容自動化工作流設定檔 (共 9 步)
 */

const FORMAT_LOCK_PREFACE = `

【格式鎖定指令】
請直接輸出正文內容，不可包含任何開場確認語（如：好的、沒問題、了解、收到）或結尾總結/客套語（如：總而言之、希望這份內容對您有幫助、如有需要請告知）。
第一個字必須是正文本身的第一個字，最後一個字必須是正文本身的最後一個字，前後不得有任何附加文字。
開頭可以保留簡短的身分／角色語氣（例如：「身為資深內容企劃」），但不可使用「我將/我已經/現在就為您...」這類描述自己即將完成動作的宣告句型，改用平實、口語化的敘述句，直接描述「這份內容涵蓋什麼」。`;

export const WORKFLOW_STEPS = [
  {
    id: 1,
    title: "基礎背景研究",
    description: "針對主題進行全面的資料彙整、受眾痛點分析與核心知識萃取。",
    type: "text",
    dependsOn: ["theme"],
    prompt: (ctx) => `你是一位資深的內容企劃與領域專家，請針對主題「${ctx.theme}」進行深度的背景研究。
內容需包含：核心定義、發展背景或趨勢、以及受眾的痛點與需求。
請以結構化、易讀的段落撰寫。

【最高指導原則】：
1. 確保資訊的客觀性與正確性，若是專業領域（如醫療、金融、科技），請基於公認的事實與主流觀點論述。
2. 深入挖掘目標受眾（TA）為什麼會對這個主題感興趣，他們想解決什麼問題。
3. 提煉出 3 到 5 個與此主題相關的「必備核心知識點」或「爆點」。
4. 語氣保持專業、清晰且具啟發性。${FORMAT_LOCK_PREFACE}`
  },
  {
    id: 2,
    title: "長影音腳本撰寫",
    description: "根據基礎背景，產出 5-10 分鐘的高留存率 YouTube 長影片文案。",
    type: "text",
    dependsOn: ["theme", "step1"],
    prompt: (ctx) => `請根據以下背景資料，為「${ctx.theme}」撰寫一份 5-10 分鐘的 YouTube 長影片腳本。

背景資料：
${ctx.step1}
 
【腳本需求與結構】：
1. 黃金開場 (Hook)：前 30 秒必須點出痛點或製造強烈懸念，告訴觀眾看完能獲得什麼價值。
2. 核心內容：將背景資料轉化為口語化、具備故事性或邏輯遞進的解說，段落之間需有流暢的轉折語。
3. 結尾呼籲 (CTA)：總結重點，並自然引導觀眾訂閱、按讚與留言互動。
4. 輸出格式：純旁白逐字稿，不需加入複雜的鏡頭語言或運鏡指示，語氣需自然、有溫度，適合真人朗讀。${FORMAT_LOCK_PREFACE}`
  },
  {
    id: 3,
    title: "長影音 SEO 優化",
    description: "生成標題、標籤與說明欄內容。",
    type: "text",
    dependsOn: ["theme", "step2"],
    prompt: (ctx) => `請根據以下長影音腳本，為主題「${ctx.theme}」生成 YouTube 專用的 SEO 優化內容。

腳本內容：
${ctx.step2}
 
請嚴格依照以下格式輸出：
【高點擊標題】：(提供 5 個不同切入點的標題，包含痛點型、揭秘型、教學型等，字數 60 字元內)
【關鍵字標籤】：(提供 15 個高搜尋量的關聯 Tags，以半形逗號分隔)
【影片說明欄】：(包含 3 句話的影片簡介、3-5 個章節時間軸建議，以及行動呼籲連結預留區塊)${FORMAT_LOCK_PREFACE}`
  },
  {
    id: 4,
    title: "短影音腳本撰寫",
    description: "產出 60 秒內的精簡爆款短影片文案 (Shorts/TikTok)。",
    type: "text",
    dependsOn: ["theme", "step1"],
    prompt: (ctx) => `請根據以下背景資料，為「${ctx.theme}」撰寫一份 60 秒內的 YouTube Shorts / TikTok / IG Reels 短影片腳本。

背景資料：
${ctx.step1}
 
【腳本需求】：
1. 破題 Hook (前 3 秒)：直接打破常規認知或提出強烈疑問，抓住眼球。
2. 緊湊敘事 (3~40 秒)：提煉出「單一最強烈的觀點」或「最高密度的知識」，不拖泥帶水。
3. 暴力 CTA (最後 5 秒)：一句話快速引導訂閱或留言。
4. 限制：字數嚴格控制在 200-250 字之間，純旁白逐字稿。${FORMAT_LOCK_PREFACE}`
  },
  {
    id: 5,
    title: "短影音 SEO 優化",
    description: "生成短影片標題與熱門標籤。",
    type: "text",
    dependsOn: ["theme", "step4"],
    prompt: (ctx) => `請根據以下短影音腳本，產出適合發布的 SEO 內容。

腳本內容：
${ctx.step4}
 
請嚴格依照以下格式輸出：
【Shorts 標題】：(提供 3 個衝擊力強、製造好奇心的標題，40 字元內)
【描述與標籤】：(簡短 1-2 句話總結，並附上 10 個與主題高度相關的熱門 Hashtags)${FORMAT_LOCK_PREFACE}`
  },
  {
    id: 6,
    title: "長影音縮圖設計",
    description: "生成 3 組 16:9 YouTube 縮圖文案與 AI 繪圖指令。",
    type: "code",
    language: "markdown",
    dependsOn: ["theme", "step3"],
    prompt: (ctx) => `請針對主題「${ctx.theme}」生成 3 組長影音 YouTube 縮圖設計 (16:9)。
參考背景：${ctx.step3}
 
【格式絕對鎖定指令】：
你現在是一個自動化資料轉換 API。禁止任何開場白、問候語、解釋或結語。
請【完全且嚴格】拷貝下方的 Markdown 模板進行填寫，不可新增任何標籤、不可改變欄位名稱、不可隨意加上粗體符號。
AI Prompt (中文) 必須依據主題生成最適合的視覺風格（如科技感、商業攝影、極簡插畫等），並包含：high contrast, vibrant colors, clear subject, highly detailed, YouTube thumbnail style, cinematic lighting。
AI Prompt (English) 結尾必須包含：--ar 16:9
 
請直接輸出以下格式，重複三次（第一組、第二組、第三組）：
 
### 第一組：[請填入縮圖設計概念]
主標：[請填入超大字體的主標文案，極度精簡]
副標：[請填入輔助小字的副標文案]
中文：[請填入中文 Prompt]
English：[請填入英文 Prompt]`
  },
  {
    id: 7,
    title: "短影音縮圖設計",
    description: "生成 3 組 9:16 短影音封面文案與 AI 繪圖指令。",
    type: "code",
    language: "markdown",
    dependsOn: ["theme", "step5"],
    prompt: (ctx) => `請針對主題「${ctx.theme}」生成 3 組短影音封面設計 (9:16)。
參考背景：${ctx.step5}
 
【格式絕對鎖定指令】：
你現在是一個自動化資料轉換 API。禁止任何開場白、問候語、解釋或結語。
請【完全且嚴格】拷貝下方的 Markdown 模板進行填寫，不可新增任何標籤、不可改變欄位名稱、不可隨意加上粗體符號。
AI Prompt (中文) 必須依據主題生成最適合的視覺風格，畫面佈局需適合直式手機螢幕（主體置中），並包含：eye-catching, highly detailed, vibrant colors, mobile screen framing。
AI Prompt (English) 結尾必須包含：--ar 9:16
 
請直接輸出以下格式，重複三次（第一組、第二組、第三組）：
 
### 第一組：[請填入封面設計概念]
高點擊文案：[請填入適合放在畫面中央的精簡文案]
中文：[請填入中文 Prompt]
English：[請填入英文 Prompt]`
  },
  {
    id: 8,
    title: "Suno AI 配樂設計",
    description: "生成 3 組符合主題氛圍的音樂生成指令。",
    type: "code",
    language: "markdown",
    dependsOn: ["theme", "step1"],
    prompt: (ctx) => `請針對主題「${ctx.theme}」生成 3 組 Suno AI 音樂生成 Prompt。
請根據主題的調性（如：科技感需電子樂、生活 VLOG 需輕鬆 Lofi、財經需緊湊節奏），自動判斷並設計 3 種不同階段的配樂：1. 開場吸引力 (Hook)、2. 核心沉浸感 (Deep Focus)、3. 結尾行動力 (Energetic Outro)。
 
【格式絕對鎖定指令】：
你現在是一個自動化資料轉換 API。禁止任何開場白、問候語、解釋或結語。
請【完全且嚴格】拷貝下方的 Markdown 模板進行填寫，不可新增任何標籤、不可改變欄位名稱、不可隨意加上粗體符號。
Suno AI Prompt 必須包含 Music Style, Instruments, Tempo, Mood 等英文參數，並標註 [Instrumental] 確保為純配樂。
 
請直接輸出以下格式，依照三種場景順序生成：
 
### 第一組：開場吸引力
適用場景：[請說明為何此曲風適合該主題的開場]
Suno AI Prompt：[請填入包含參數的英文 Prompt 內容，例如: [Instrumental], upbeat synthwave, fast tempo, catchy...]
 
### 第二組：核心沉浸感
適用場景：[請說明為何此曲風適合該主題的深度解說]
Suno AI Prompt：[請填入包含參數的英文 Prompt 內容]
 
### 第三組：結尾行動力
適用場景：[請說明為何此曲風適合引導觀眾行動]
Suno AI Prompt：[請填入包含參數的英文 Prompt 內容]`
  },
  {
    id: 9,
    title: "社群知識圖文企劃",
    description: "產出適合 IG 懶人包與 FB 爆款圖文的視覺規劃與貼文文案。",
    type: "code", 
    language: "markdown",
    dependsOn: ["theme", "step1", "step4"],
    prompt: (ctx) => `你是一位頂尖的知識型社群總監。請根據以下背景資料，為主題「${ctx.theme}」規劃一套「專業、易懂、具備高分享率」的社群圖文企劃。

背景參考：${ctx.step1}
短片精華：${ctx.step4}

【格式絕對鎖定指令】：
你現在是一個自動化資料轉換 API。禁止任何開場白、問候語、解釋或結語。
請【完全且嚴格】拷貝下方的 Markdown 模板進行填寫，不可新增任何標籤、不可改變欄位名稱、不可隨意加上粗體符號。
AI Prompt (中文) 必須依據主題生成最適合的視覺風格，畫面包含：eye-catching, highly detailed, vibrant colors。
AI Prompt (English) 是一段可直接餵給 Midjourney 的咒語，結尾必須包含比例參數。

### 📱 第一部分：IG 知識懶人包企劃 (多圖滑動)
請規劃 5 張圖的內容架構。
* **第 1 張 (封面破題)**
  - 畫面大標題：[15字以內，製造強烈好奇心]
  - 視覺建議：[例如：深色背景，中央放一個發光的問號 3D 圖標]
  - AI Prompt (中文)：[描述此畫面的繪圖提示詞]
  - AI Prompt (English)：[英文繪圖提示詞, 結尾加上 --ar 1:1]
* **第 2 張 (痛點共鳴)**
  - 畫面文字：[點出 2 個受眾常犯的錯誤或痛點]
  - 視覺建議：[例如：左右對比圖，左邊打叉，右邊打勾]
  - AI Prompt (中文)：[描述此畫面的繪圖提示詞]
  - AI Prompt (English)：[英文繪圖提示詞, 結尾加上 --ar 1:1]
* **第 3 張 (核心知識拆解)**
  - 畫面文字：[將最核心的觀念條列出 3 點]
  - 視覺建議：[例如：金字塔圖、樹狀圖或清楚的條列排版]
  - AI Prompt (中文)：[描述此畫面的繪圖提示詞]
  - AI Prompt (English)：[英文繪圖提示詞, 結尾加上 --ar 1:1]
* **第 4 張 (實戰應用)**
  - 畫面文字：[給出一個馬上能用的具體案例]
  - 視覺建議：[例如：模擬對話框或操作步驟截圖風格]
  - AI Prompt (中文)：[描述此畫面的繪圖提示詞]
  - AI Prompt (English)：[英文繪圖提示詞, 結尾加上 --ar 1:1]
* **第 5 張 (互動 CTA)**
  - 畫面文字：[引導收藏與留言的行動呼籲]
  - 視覺建議：[創作者頭像 + 醒目的「點擊收藏」圖標]
  - AI Prompt (中文)：[描述此畫面的繪圖提示詞]
  - AI Prompt (English)：[英文繪圖提示詞, 結尾加上 --ar 1:1]

---

### 📘 第二部分：Facebook 爆款單圖企劃
請針對 FB 受眾習慣，規劃 2 種不同風格的單圖。
* **提案 A：一張圖秒懂 (知識圖解)**
  - 圖文大標題：[吸引眼球的總結性標題]
  - 視覺構成說明：[詳細描述這張圖該怎麼畫]
  - AI Prompt (中文)：[描述此畫面的繪圖提示詞]
  - AI Prompt (English)：[英文繪圖提示詞, 結尾加上 --ar 4:5]
* **提案 B：衝擊力金句 (語錄圖)**
  - 金句文字：[從背景資料中提煉一句最有啟發性的話，20字內]
  - 視覺構成說明：[例如：極簡留白背景，採用引號「」設計]
  - AI Prompt (中文)：[描述此畫面的繪圖提示詞]
  - AI Prompt (English)：[英文繪圖提示詞, 結尾加上 --ar 4:5]

---

### ✍️ 第三部分：通用社群貼文文案 (適用於 IG/FB 內文)
* **破題首段**：[用一句話直擊痛點或打破常規迷思]
* **知識精華**：[以口語化、具共鳴感的文字重新包裝核心觀點，300字內]
* **留言引導**：[設計一個能引發讀者回答的簡單問題]
* **Hashtags**：[5-7 個精準知識標籤]`
  }
];
