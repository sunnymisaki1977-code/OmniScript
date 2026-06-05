"use client";

import { 
  Rocket, 
  Terminal, 
  PenTool, 
  GitMerge, 
  Layers, 
  LayoutTemplate, 
  Database,
  ArrowRight,
  Code2,
  CheckCircle2,
  Sparkles,
  Zap
} from "lucide-react";

export default function JoinPage() {
  const handleScrollToForm = () => {
    const element = document.getElementById("join-form");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-indigo-500/30">
      
      {/* 🚀 Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden px-6">
        {/* 背景光暈效果 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            <span>2024 結訓專題戰隊招募中</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-8 leading-tight">
            不只是結訓專題，我們正在打造<br className="hidden md:block"/>
            下一個具商業潛力的 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">AI SaaS 產品</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            加入 OmniScript 戰隊，與具備實戰思維的 PM 一起，從 0 到 1 打造「全域內容自動化工作流」。這將是你履歷上最亮眼的一筆！
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={handleScrollToForm}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)] hover:shadow-[0_0_60px_-15px_rgba(79,70,229,0.7)] hover:-translate-y-1"
            >
              🔥 我要加入戰隊
              <ArrowRight className="w-5 h-5" />
            </button>

            <a 
              href="/app"
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all border border-slate-700 hover:border-slate-600 hover:-translate-y-1"
            >
              💻 體驗 OmniScript Demo
            </a>
          </div>
        </div>

        {/* 具象化 CSS Dashboard Mockup */}
        <div className="max-w-5xl mx-auto mt-24 relative z-10 perspective-1000">
          <div className="rounded-2xl border border-slate-800 bg-[#0F172A] shadow-2xl overflow-hidden flex h-[400px] md:h-[500px] transform rotate-x-2 translate-y-4">
            {/* 模擬 Sidebar */}
            <div className="w-[240px] border-r border-slate-800 bg-slate-900/50 flex flex-col hidden md:flex">
              <div className="p-5 border-b border-slate-800">
                <div className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="text-indigo-500">✨</span> OmniScript
                </div>
              </div>
              <div className="p-3 space-y-1">
                {[
                  "1. 專案目標",
                  "2. 受眾輪廓",
                  "3. 核心觀點",
                  "4. 大綱結構",
                  "5. 詳細腳本"
                ].map((step, i) => (
                  <div key={i} className={`flex items-center gap-3 p-2 rounded-lg text-sm ${i === 0 ? 'bg-indigo-900/30 text-indigo-300' : 'text-slate-500'}`}>
                    <div className={`w-4 h-4 rounded-full border-2 ${i === 0 ? 'border-indigo-500' : 'border-slate-700'}`}></div>
                    Step {step}
                  </div>
                ))}
              </div>
            </div>
            {/* 模擬主畫面 */}
            <div className="flex-1 flex flex-col relative bg-[#0F172A]">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
              {/* Global Header */}
              <div className="h-14 border-b border-slate-800 flex justify-end items-center px-4 gap-4">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-900/20 text-amber-500 text-xs rounded-full border border-amber-800/30">
                  <Zap className="w-3 h-3" /> 125 點額度
                </div>
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs text-white font-bold">U</div>
              </div>
              {/* Dashboard Content */}
              <div className="flex-1 flex flex-col items-center justify-center p-8">
                <div className="w-full max-w-xl">
                  <h2 className="text-2xl font-bold text-white text-center mb-2">開始新的 OmniScript 專案</h2>
                  <p className="text-sm text-slate-400 text-center mb-6">輸入一個靈感，我們為你自動生成全套企劃</p>
                  
                  <div className="bg-slate-900 border border-slate-700 rounded-xl p-2 flex items-center gap-2 mb-4 shadow-inner">
                    <span className="text-xl pl-2">✨</span>
                    <div className="flex-1 text-slate-300 text-sm py-2">未來十年的 AI 發展趨勢與職場衝擊...</div>
                  </div>
                  
                  <div className="flex justify-center gap-2 mb-8">
                    <div className="px-3 py-1 bg-slate-800 text-slate-300 text-xs rounded-full border border-slate-700">💡 隨機來點靈感</div>
                    <div className="px-3 py-1 bg-slate-800 text-slate-300 text-xs rounded-full border border-slate-700">📈 科技趨勢解說</div>
                  </div>
                  
                  <div className="flex justify-center gap-3">
                    <div className="px-6 py-2.5 bg-slate-800 text-slate-300 rounded-lg text-sm font-medium border border-slate-700">手動協作模式</div>
                    <div className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-indigo-900/50">一鍵全自動模式 ✨</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🎯 Section 1: Value Proposition */}
      <section className="py-24 bg-slate-900 px-6 relative z-10 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">為什麼你該加入這個專題？</h2>
            <p className="text-slate-400">這不是圖書管理系統，這是能為你面試帶來絕對優勢的實戰舞台</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-950/50 border border-slate-800 p-8 rounded-2xl hover:border-indigo-500/50 transition-colors group">
              <div className="w-14 h-14 bg-indigo-900/30 text-indigo-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Rocket className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">告別「玩具型專案」</h3>
              <p className="text-slate-400 leading-relaxed">
                你將接觸到真實業界正在渴求的技術：AI API 串接（Gemini/Suno）、多模態內容生成、以及 SaaS 等級的多租戶狀態管理。
              </p>
            </div>
            
            <div className="bg-slate-950/50 border border-slate-800 p-8 rounded-2xl hover:border-indigo-500/50 transition-colors group">
              <div className="w-14 h-14 bg-emerald-900/30 text-emerald-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <GitMerge className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">體驗正規的敏捷開發</h3>
              <p className="text-slate-400 leading-relaxed">
                由 PM 控管需求規格 (PRD)、UI/UX Guideline 與開發時程。帶你體驗真實的 Sprint 衝刺與版控流程，面試時有說不完的協作故事。
              </p>
            </div>

            <div className="bg-slate-950/50 border border-slate-800 p-8 rounded-2xl hover:border-indigo-500/50 transition-colors group">
              <div className="w-14 h-14 bg-purple-900/30 text-purple-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <LayoutTemplate className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">打造高顏值的技術火力展示</h3>
              <p className="text-slate-400 leading-relaxed">
                你的程式碼不會被醜陋的介面埋沒。我們採用現代極簡風格 (Modern Minimalist)，讓面試官一眼就覺得「這是一個成熟的產品」。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 💡 Section 2: The Product */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2">
            <div className="inline-block px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm font-medium mb-6">
              The Product: OmniScript
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              一個主題不可知的<br/>AI 內容產製引擎
            </h2>
            <p className="text-xl text-slate-400 mb-8 leading-relaxed">
              只要輸入一個靈感，系統會自動跑完 9 道工作流，產出 YouTube 腳本、SEO 標籤、視覺 Prompt 與社群貼文。
            </p>
          </div>
          
          <div className="lg:w-1/2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex gap-6">
              <div className="shrink-0 w-12 h-12 bg-indigo-900/50 text-indigo-400 rounded-lg flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg mb-2">模組 1：鏈式記憶引擎 (Chained Context)</h4>
                <p className="text-slate-400 text-sm">挑戰複雜的前端狀態管理，實作步驟之間的資料連動，前一步驟的產出自動成為下一步驟的 Prompt 背景。</p>
              </div>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex gap-6 ml-0 md:ml-6">
              <div className="shrink-0 w-12 h-12 bg-cyan-900/50 text-cyan-400 rounded-lg flex items-center justify-center">
                <Code2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg mb-2">模組 2：雙軌執行模式 (Dual Execution)</h4>
                <p className="text-slate-400 text-sm">同時開發「手動協作（單步控制）」與「一鍵全自動（非同步隊列 Batch API）」的複雜商業邏輯。</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex gap-6 ml-0 md:ml-12">
              <div className="shrink-0 w-12 h-12 bg-emerald-900/50 text-emerald-400 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg mb-2">模組 3：Notion API 防護寫入</h4>
                <p className="text-slate-400 text-sm">實作大文本切割演算法 (Chunking)，突破 API 限制，完成資料的雲端結構化歸檔。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🧑‍💻 Section 3: Open Roles */}
      <section className="py-24 bg-slate-900 px-6 border-y border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">招募職缺與技術棧</h2>
            <p className="text-slate-400">不用等到技術完美才敢來，我們一起在專案中變強</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Frontend */}
            <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl flex flex-col">
              <div className="mb-6 flex justify-between items-start">
                <div className="w-12 h-12 bg-blue-900/30 text-blue-400 rounded-xl flex items-center justify-center">
                  <Terminal className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 bg-slate-800 text-xs rounded-full">徵求 2-3 名</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">前端工程師 (Frontend)</h3>
              <p className="text-slate-400 text-sm mb-6 flex-1">
                你的戰場：實作高互動性的 SaaS Dashboard、複雜的九步驟 Stepper、以及跨專案的全域狀態管理。
              </p>
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-slate-500 mb-2">技術棧</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-blue-900/20 text-blue-400 text-xs rounded">React / Next.js</span>
                    <span className="px-2 py-1 bg-cyan-900/20 text-cyan-400 text-xs rounded">Tailwind CSS</span>
                    <span className="px-2 py-1 bg-yellow-900/20 text-yellow-400 text-xs rounded">Zustand</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-2">加分項</div>
                  <ul className="text-xs text-slate-400 space-y-1">
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0"/> 微互動 (Micro-interactions)</li>
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0"/> 防抖 (Debounce) 儲存機制</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Backend */}
            <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl flex flex-col">
              <div className="mb-6 flex justify-between items-start">
                <div className="w-12 h-12 bg-green-900/30 text-green-400 rounded-xl flex items-center justify-center">
                  <Database className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 bg-slate-800 text-xs rounded-full">徵求 1-2 名</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">後端工程師 (Backend)</h3>
              <p className="text-slate-400 text-sm mb-6 flex-1">
                你的戰場：設計穩定的 RESTful API、串接第三方 AI 服務 (Gemini/Notion)、處理會員認證與資料庫設計。
              </p>
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-slate-500 mb-2">技術棧</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-green-900/20 text-green-400 text-xs rounded">Node.js / Python</span>
                    <span className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded">SQL / NoSQL</span>
                    <span className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded">JWT</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-2">加分項</div>
                  <ul className="text-xs text-slate-400 space-y-1">
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0"/> 高併發 API 處理經驗</li>
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0"/> 非同步隊列 (Queue) 架構</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* UI/UX */}
            <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl flex flex-col">
              <div className="mb-6 flex justify-between items-start">
                <div className="w-12 h-12 bg-pink-900/30 text-pink-400 rounded-xl flex items-center justify-center">
                  <PenTool className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 bg-slate-800 text-xs rounded-full">徵求 1 名</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">UI/UX 設計師</h3>
              <p className="text-slate-400 text-sm mb-6 flex-1">
                你的戰場：將 PM 的 Wireframe 轉化為高保真 Prototype，制定 Design System（色彩、字體、元件庫）。
              </p>
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-slate-500 mb-2">技術棧</div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-pink-900/20 text-pink-400 text-xs rounded">Figma</span>
                    <span className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded">Design System</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-2">加分項</div>
                  <ul className="text-xs text-slate-400 space-y-1">
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0"/> SaaS 產品設計思維</li>
                    <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0"/> 深/淺色模式設計規範</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 📅 Section 4: Roadmap */}
      <section className="py-24 px-6 relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">開發時程與專案管理</h2>
            <p className="text-slate-400">完整的規劃，確保這個團隊絕不爛尾</p>
          </div>
          
          <div className="relative border-l border-slate-800 ml-4 md:ml-0 md:pl-0">
            {/* Timeline Item 1 */}
            <div className="mb-12 relative md:flex items-center">
              <div className="hidden md:block w-1/2 pr-8 text-right">
                <h4 className="text-lg font-bold text-white">Sprint 1 (Week 1-2)</h4>
                <p className="text-sm text-slate-400">基石與架構</p>
              </div>
              <div className="absolute left-[-5px] md:left-1/2 md:-ml-[5px] w-3 h-3 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>
              <div className="pl-8 md:w-1/2 md:pl-8">
                <div className="md:hidden mb-2">
                  <h4 className="text-lg font-bold text-white">Sprint 1 (Week 1-2)</h4>
                  <p className="text-sm text-indigo-400">基石與架構</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                  <p className="text-slate-400 text-sm">PRD 確認、Figma 完稿、資料庫 Schema 建立、前端 Component 共用庫搭建。</p>
                </div>
              </div>
            </div>

            {/* Timeline Item 2 */}
            <div className="mb-12 relative md:flex items-center">
              <div className="hidden md:block w-1/2 pr-8 text-right">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                  <p className="text-slate-400 text-sm">完成 9 步核心 Prompt 的 API 串接與前端狀態連動（手動模式）。</p>
                </div>
              </div>
              <div className="absolute left-[-5px] md:left-1/2 md:-ml-[5px] w-3 h-3 bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
              <div className="pl-8 md:w-1/2 md:pl-8">
                <div className="md:hidden mb-2">
                  <h4 className="text-lg font-bold text-white">Sprint 2 (Week 3-4)</h4>
                  <p className="text-sm text-cyan-400">核心 AI 工作流串接</p>
                </div>
                <div className="md:hidden bg-slate-900 border border-slate-800 p-4 rounded-xl">
                  <p className="text-slate-400 text-sm">完成 9 步核心 Prompt 的 API 串接與前端狀態連動（手動模式）。</p>
                </div>
                <div className="hidden md:block">
                  <h4 className="text-lg font-bold text-white">Sprint 2 (Week 3-4)</h4>
                  <p className="text-sm text-slate-400">核心 AI 工作流串接</p>
                </div>
              </div>
            </div>

            {/* Timeline Item 3 */}
            <div className="mb-12 relative md:flex items-center">
              <div className="hidden md:block w-1/2 pr-8 text-right">
                <h4 className="text-lg font-bold text-white">Sprint 3 (Week 5-6)</h4>
                <p className="text-sm text-slate-400">自動化與 Notion 歸檔</p>
              </div>
              <div className="absolute left-[-5px] md:left-1/2 md:-ml-[5px] w-3 h-3 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.8)]"></div>
              <div className="pl-8 md:w-1/2 md:pl-8">
                <div className="md:hidden mb-2">
                  <h4 className="text-lg font-bold text-white">Sprint 3 (Week 5-6)</h4>
                  <p className="text-sm text-purple-400">自動化與 Notion 歸檔</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                  <p className="text-slate-400 text-sm">實作一鍵全自動模式、Notion API 匯出、防呆與 Error Handling。</p>
                </div>
              </div>
            </div>

            {/* Timeline Item 4 */}
            <div className="relative md:flex items-center">
              <div className="hidden md:block w-1/2 pr-8 text-right">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                  <p className="text-slate-400 text-sm">Debug、效能優化、首頁 Dashboard 完善、製作專題發表 Demo 影片。</p>
                </div>
              </div>
              <div className="absolute left-[-5px] md:left-1/2 md:-ml-[5px] w-3 h-3 bg-pink-500 rounded-full shadow-[0_0_10px_rgba(236,72,153,0.8)]"></div>
              <div className="pl-8 md:w-1/2 md:pl-8">
                <div className="md:hidden mb-2">
                  <h4 className="text-lg font-bold text-white">Sprint 4 (Week 7-8)</h4>
                  <p className="text-sm text-pink-400">UI 打磨與發表準備</p>
                </div>
                <div className="md:hidden bg-slate-900 border border-slate-800 p-4 rounded-xl">
                  <p className="text-slate-400 text-sm">Debug、效能優化、首頁 Dashboard 完善、製作專題發表 Demo 影片。</p>
                </div>
                <div className="hidden md:block">
                  <h4 className="text-lg font-bold text-white">Sprint 4 (Week 7-8)</h4>
                  <p className="text-sm text-slate-400">UI 打磨與發表準備</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ✉️ Final CTA */}
      <section id="join-form" className="py-24 px-6 bg-gradient-to-b from-slate-950 to-indigo-950 border-t border-slate-800 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">準備好打造你的代表作了嗎？</h2>
          <p className="text-xl text-indigo-200 mb-12">
            只要你有實作的熱情與解決問題的決心，我們一起在專案中變強！
          </p>
          
          <form 
            className="bg-slate-900/50 backdrop-blur-md border border-slate-700/50 p-8 rounded-2xl max-w-xl mx-auto text-left"
            onSubmit={(e) => { e.preventDefault(); alert('感謝您的報名！PM 會盡快與您聯繫！'); }}
          >
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">您的稱呼</label>
                <input type="text" required className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" placeholder="王小明" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">想應徵的角色</label>
                <select className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500">
                  <option>前端工程師 (Frontend)</option>
                  <option>後端工程師 (Backend)</option>
                  <option>UI/UX 設計師</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Github 或作品集連結</label>
                <input type="url" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" placeholder="https://github.com/..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">簡單說說為什麼想加入？</label>
                <textarea rows="3" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" placeholder="我想挑戰..."></textarea>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl transition-colors">
                送出報名表單
              </button>
              <a href="/app" className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold py-3 px-4 rounded-xl transition-colors text-center">
                先去玩玩看 Demo
              </a>
            </div>
          </form>
        </div>
      </section>

    </div>
  );
}
