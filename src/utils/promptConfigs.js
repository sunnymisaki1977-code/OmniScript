/**
 * utils/promptConfigs.js
 * 雙軌系統 AI 工作流設定檔
 */

// 引擎 1：通用型內容企劃 (知識創作者模式)
export const CONTENT_CREATOR_STEPS = [
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
4. 語氣保持專業、清晰且具啟發性。`
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
4. 輸出格式：純旁白逐字稿，不需加入複雜的鏡頭語言或運鏡指示，語氣需自然、有溫度，適合真人朗讀。`
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
【影片說明欄】：(包含 3 句話的影片簡介、3-5 個章節時間軸建議，以及行動呼籲連結預留區塊)`
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
4. 限制：字數嚴格控制在 200-250 字之間，純旁白逐字稿。`
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
【描述與標籤】：(簡短 1-2 句話總結，並附上 10 個與主題高度相關的熱門 Hashtags)`
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
    title: "社群貼文撰寫",
    description: "根據背景資料與短影音內容，產出適合 Facebook/Instagram 的圖文排版貼文。",
    type: "text",
    dependsOn: ["theme", "step1", "step4"],
    prompt: (ctx) => `請根據以下背景資料與短影音精華，為主題「${ctx.theme}」撰寫一篇高互動率的 Facebook / Instagram 社群貼文。

背景參考：
${ctx.step1}

短片核心重點：
${ctx.step4}
 
【撰寫要求】：
1. 破題：第一句話必須用提問、製造懸念或點出強烈痛點來吸引受眾目光（如：「你是不是也常常...？」或「破解...的最大迷思！」）。
2. 內文：將核心知識以「口語化、具共鳴感」的文字重新包裝，字數控制在 250 - 350 字之間，易於手機滑動閱讀。
3. 排版：段落必須分明（善用換行與空白行），並根據主題性質適當加入符合情境的 Emoji（例如科技主題用 🚀💻、生活主題用 ☕✨ 等），不可過度濫用導致視覺混亂。
4. 互動引導 (CTA)：結尾必須明確引導粉絲互動（例如：「留言告訴我你的看法」、「Tag 一個需要看到這篇的朋友」或「點擊首頁連結看完整影片」）。
5. 標籤：在文末附上 5 到 7 個精準且熱門的 Hashtags。`
  }
];

// 引擎 2：電商帶貨銷售 (電商模式)
export const ECOMMERCE_STEPS = [
  {
    id: 1,
    title: "產品賣點與痛點分析",
    description: "深度挖掘產品 USP（獨特銷售主張）、競品差異化與消費者購買抗拒點。",
    type: "text",
    dependsOn: ["theme"],
    prompt: (ctx) => `你是一位頂尖的電商行銷操盤手，請針對產品/服務「${ctx.theme}」進行深度的市場與受眾分析。
內容需包含：
1. 目標受眾 (TA) 畫像：精準描述會買這項產品的人是誰？他們生活中的具體痛點是什麼？
2. 核心賣點 (USP)：提煉出 3 個最具說服力的產品優勢，並將「功能 (Feature)」轉化為「好處 (Benefit)」。
3. 購買抗拒點突破：列出 2 個消費者猶豫不決的原因（如價格、信任度），並給出破除疑慮的說法。
請以結構化、條理分明的段落撰寫，語氣需具備敏銳的商業洞察力。`
  },
  {
    id: 2,
    title: "直播帶貨/長影音銷售腳本",
    description: "產出高轉換率的 5-10 分鐘直播講稿或產品深度介紹影片。",
    type: "text",
    dependsOn: ["theme", "step1"],
    prompt: (ctx) => `請根據以下產品分析，為「${ctx.theme}」撰寫一份 5-10 分鐘的直播帶貨/長影音銷售腳本。

產品分析資料：
${ctx.step1}
 
【腳本需求與結構】：
1. 痛點暴擊開場 (Hook)：前 30 秒直接點出觀眾最煩惱的問題，讓他們覺得「你懂我」。
2. 產品展示與信任背書：帶出產品如何解決問題，並設計一個「眼見為憑」的使用情境或實驗設計建議。
3. 價格錨點與優惠釋出：設計一套話術，先塑造高價值，再給出令人無法拒絕的當下限時優惠（如加碼贈品、限時折扣）。
4. 逼單行動呼籲 (CTA)：製造 FOMO (錯失恐懼)，強烈引導觀眾點擊購物車或連結下單。
輸出格式：口語化、充滿熱情與渲染力的講稿，適合直播主或購物專家直接朗讀。`
  },
  {
    id: 3,
    title: "一頁式銷售頁 (Landing Page) 文案",
    description: "生成高轉化的商品詳情頁標題與分層敘述。",
    type: "text",
    dependsOn: ["theme", "step2"],
    prompt: (ctx) => `請根據以下腳本邏輯，為「${ctx.theme}」生成一頁式銷售網頁 (Landing Page) 的結構化文案。

參考腳本：
${ctx.step2}
 
請嚴格依照以下結構輸出：
【黃金主視覺大標】：(15 字以內，極具吸引力的購買理由)
【副標題】：(補充說明，引發興趣)
【三大痛點共鳴】：(以 3 個問句直擊消費者內心)
【產品解方與利益】：(條列 3-4 點，說明產品如何改變他的生活)
【限時優惠 CTA 按鈕】：(提供 3 個高點擊率的按鈕文案建議，例如：立即搶購省 $500)`
  },
  {
    id: 4,
    title: "短影音廣告腳本 (短影片投放)",
    description: "產出 30-60 秒專攻 FB/IG/TikTok 廣告投放的爆款短影音。",
    type: "text",
    dependsOn: ["theme", "step1"],
    prompt: (ctx) => `請根據以下產品分析，為「${ctx.theme}」撰寫一份 60 秒內的短影音廣告腳本 (適用於 TikTok / Reels / FB Ads)。

產品分析資料：
${ctx.step1}
 
【腳本需求】：
1. 視覺衝擊 Hook (前 3 秒)：直接展示驚人效果對比，或用一句反直覺的問句留住滑手機的手指。
2. 情境帶入 (3-30 秒)：以「使用者真實體驗 (UGC)」的視角，展現使用產品的痛快感與便利性。
3. 優惠與 CTA (最後 5 秒)：明確告知「點擊左下角連結」獲取限時優惠。
4. 限制：字數嚴格控制在 150-200 字之間，純旁白逐字稿，語氣需自然像朋友推薦，不要像生硬的電視廣告。`
  },
  {
    id: 5,
    title: "廣告投放文案與受眾設定",
    description: "生成社群廣告 (Meta/Google) 的主文案與受眾標籤建議。",
    type: "text",
    dependsOn: ["theme", "step4"],
    prompt: (ctx) => `請根據以下短影音廣告腳本，產出適合在 Meta (FB/IG) 投放廣告的配套設定。

廣告腳本內容：
${ctx.step4}
 
請嚴格依照以下格式輸出：
【廣告吸睛主標】：(提供 3 個不同角度的廣告標題，如：折扣導向、痛點導向、好奇導向)
【動態消息主文案】：(包含表情符號，前三行必須能吸引人點擊「查看更多」，附註優惠碼與連結預留位置)
【精準受眾 (Targeting) 建議】：(列出 5-8 個在廣告後台建議鎖定的興趣/行為標籤)`
  },
  {
    id: 6,
    title: "電商主圖/橫幅視覺設計",
    description: "生成 3 組 16:9 電商 Banner 或產品情境圖的 AI 繪圖指令。",
    type: "code",
    language: "markdown",
    dependsOn: ["theme", "step3"],
    prompt: (ctx) => `請針對產品「${ctx.theme}」生成 3 組電商宣傳橫幅 (Banner) / 產品情境圖 (16:9) 的 AI 繪圖設計。
參考文案：${ctx.step3}
 
【格式絕對鎖定指令】：
你現在是一個自動化資料轉換 API。禁止任何開場白、問候語或結語。
請【完全且嚴格】拷貝下方的 Markdown 模板進行填寫。
AI Prompt (中文) 必須專注於「商品攝影 (commercial product photography)」、「高端質感」、「光影對比 (studio lighting)」。
AI Prompt (English) 結尾必須包含：--ar 16:9
 
請直接輸出以下格式，重複三次：
 
### 第一組：[請填入視覺設計概念，如：極簡高級感/生活情境帶入]
主圖廣告文案：[請填入適合壓在圖片上的極短促銷大字]
中文：[請填入中文 Prompt]
English：[請填入英文 Prompt]`
  },
  {
    id: 7,
    title: "短影音廣告封面設計",
    description: "生成 3 組 9:16 短影音廣告的吸睛封面設計。",
    type: "code",
    language: "markdown",
    dependsOn: ["theme", "step5"],
    prompt: (ctx) => `請針對產品「${ctx.theme}」生成 3 組 9:16 的短影音廣告封面設計。
參考文案：${ctx.step5}
 
【格式絕對鎖定指令】：
你現在是一個自動化資料轉換 API。禁止開場白與結語。
請【完全且嚴格】拷貝下方的 Markdown 模板。
AI Prompt (中文) 畫面佈局需具備高衝擊力，適合手機直屏，主體必須大且清晰，帶有景深 (depth of field)。
AI Prompt (English) 結尾必須包含：--ar 9:16
 
請直接輸出以下格式，重複三次：
 
### 第一組：[請填入封面視覺概念]
秒殺點擊文案：[請填入像大字報一樣、能瞬間引發好奇的標題字]
中文：[請填入中文 Prompt]
English：[請填入英文 Prompt]`
  },
  {
    id: 8,
    title: "Suno AI 廣告配樂設計",
    description: "生成 3 組適合商業促銷與帶貨短片的音樂生成指令。",
    type: "code",
    language: "markdown",
    dependsOn: ["theme", "step1"],
    prompt: (ctx) => `請針對產品「${ctx.theme}」生成 3 組 Suno AI 商業廣告音樂生成 Prompt。
請判斷產品屬性（如：美妝需時尚 House、3C 需動感 Cyberpunk、食品需輕快 Acoustic），設計 3 種商業場景配樂：1. 品牌質感 (Premium)、2. 節慶大促 (Sale Event)、3. 開箱 Vlog (Unboxing)。
 
【格式絕對鎖定指令】：
你現在是一個自動化資料轉換 API。禁止任何解釋或結語。
請【完全且嚴格】拷貝下方的 Markdown 模板。
Suno AI Prompt 必須包含英文參數，並標註 [Instrumental]。
 
請直接輸出以下格式，依照三種場景生成：
 
### 第一組：品牌質感 (Premium)
適用產品情境：[請說明為何此曲風能提升該產品價值]
Suno AI Prompt：[請填入英文 Prompt 內容，例如: [Instrumental], deep house, lo-fi beats, luxury, slow tempo...]
 
### 第二組：節慶大促 (Sale Event)
適用產品情境：[請說明為何此曲風能營造搶購氛圍]
Suno AI Prompt：[請填入英文 Prompt 內容，強調 upbeat, fast tempo, energetic]
 
### 第三組：開箱 Vlog (Unboxing)
適用產品情境：[請說明為何此曲風適合開箱評測展示]
Suno AI Prompt：[請填入英文 Prompt 內容]`
  },
  {
    id: 9,
    title: "社群促銷與導購貼文",
    description: "產出適合 Facebook/Instagram 的圖文促銷貼文與限時動態腳本。",
    type: "text",
    dependsOn: ["theme", "step1", "step3"],
    prompt: (ctx) => `請根據以下產品分析與銷售頁文案，為「${ctx.theme}」撰寫一篇高轉換率的社群導購貼文 (FB/IG) 及一則限時動態 (IG Story) 企劃。

產品分析：${ctx.step1}
銷售賣點：${ctx.step3}
 
【撰寫要求】：
1. 貼文破題：用受眾最在乎的痛點或限時優惠直接開場。
2. 貼文內文：將產品優勢條列化，加上表情符號，字數 300 字內，強調「現在買最划算」。
3. 貼文 CTA：明確指示「點擊留言區連結」或「首頁連結」下單。
4. 限時動態 (IG Story) 企劃：設計 3 頁式的連貫動態。第一頁拋問題，第二頁秀解方/產品，第三頁放「連結貼紙」與倒數計時。
5. 標籤：附上 5 個精準的商業與產品 Hashtags。`
  }
];

// 導出統一入口
export const WORKFLOW_REGISTRY = {
  creator: CONTENT_CREATOR_STEPS,
  ecommerce: ECOMMERCE_STEPS
};

// 為了相容原本的程式碼，仍導出 WORKFLOW_STEPS，指向 creator (可選擇之後全數改用 REGISTRY)
export const WORKFLOW_STEPS = CONTENT_CREATOR_STEPS;
