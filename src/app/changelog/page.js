"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Rocket, Bug, Layout, Zap, Star } from "lucide-react";

const changelogs = [
  {
    version: "v1.1.0",
    date: "2026/06/05",
    title: "自動化流程與系統穩定性大升級",
    description: "全面優化了一鍵自動生成模式的底層架構，帶來更直覺的視覺回饋，並修復了高負載下的匯出崩潰問題。",
    updates: [
      { type: "Feature", content: "全新動態生成介面：現在自動生成時，左側選單會即時亮起進度，並能安全保存中斷前的所有資料。" },
      { type: "Feature", content: "模型降級容錯機制：若遇到 Google API 塞車 (503) 或配額耗盡 (429)，系統會自動切換至 Gemini Lite 版本，確保生成不斷線。" },
      { type: "Fix", content: "修復了長影音腳本 (Code Block) 超過 2000 字元時，遭 Notion API 拒絕而引發的 500 Server Error 問題。" },
      { type: "Fix", content: "升級前端錯誤攔截機制，現在能精準顯示 Notion 官方的真實報錯原因。" },
      { type: "UI/UX", content: "資料保護機制：專案歸檔至 Notion 後，自動鎖定所有步驟的「儲存並進行下一步」按鈕，防止意外覆寫。" },
      { type: "UI/UX", content: "Landing Page 版面優化：移除裝飾用 Mockup，直接展示「開發時程 Kanban」，動線更加強烈流暢。" }
    ]
  },
  {
    version: "v1.0.0",
    date: "2026/06/01",
    title: "OmniScript 初版正式上線",
    description: "為內容創作者量身打造的全域企劃生成器，將大腦的靈感瞬間轉化為結構化的落地企劃。",
    updates: [
      { type: "Feature", content: "導入 9 大核心企劃步驟工作流，從專案目標、受眾輪廓到詳細腳本一氣呵成。" },
      { type: "Feature", content: "雙軌並行模式：支援「手動協作」逐步調整，與「一鍵全自動」高速產出模式。" },
      { type: "Feature", content: "深度整合 Notion API，支援一鍵將整份千字企劃精美歸檔至專屬資料庫。" },
      { type: "UI/UX", content: "採用極簡暗色系 Modern Minimalist 介面設計，提供沉浸式的創作體驗。" }
    ]
  }
];

const getTagConfig = (type) => {
  switch (type) {
    case "Feature":
      return { icon: <Star className="w-3.5 h-3.5" />, color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" };
    case "Fix":
      return { icon: <Bug className="w-3.5 h-3.5" />, color: "bg-rose-500/10 text-rose-400 border-rose-500/20" };
    case "UI/UX":
      return { icon: <Layout className="w-3.5 h-3.5" />, color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" };
    case "Perf":
      return { icon: <Zap className="w-3.5 h-3.5" />, color: "bg-amber-500/10 text-amber-400 border-amber-500/20" };
    default:
      return { icon: <Rocket className="w-3.5 h-3.5" />, color: "bg-slate-500/10 text-slate-400 border-slate-500/20" };
  }
};

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-300 font-sans selection:bg-indigo-500/30">
      {/* Background blur */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0F172A]/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">返回首頁</span>
          </Link>
          <div className="text-sm font-bold text-white flex items-center gap-2">
            <span className="text-indigo-500">✨</span> OmniScript
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-20 relative z-10">
        <div className="mb-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
            更新日誌
          </h1>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            我們不斷傾聽回饋，持續打磨 OmniScript 的每一個細節。<br className="hidden md:block" />
            在這裡追蹤我們最新的功能與系統升級。
          </p>
        </div>

        <div className="relative">
          {/* Timeline Spine */}
          <div className="absolute top-0 bottom-0 left-[27px] md:left-[39px] w-px bg-slate-800" />

          <div className="space-y-16 md:space-y-24">
            {changelogs.map((log, index) => (
              <div key={log.version} className="relative pl-16 md:pl-28">
                {/* Timeline Dot */}
                <div className="absolute left-[20px] md:left-[32px] top-1.5 w-4 h-4 rounded-full bg-slate-900 border-[3px] border-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.5)] z-10" />
                
                {/* Date Tag */}
                <div className="absolute left-0 top-1.5 hidden md:block w-20 text-right">
                  <span className="text-sm font-medium text-slate-500">{log.date}</span>
                </div>

                <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 md:p-8 hover:border-indigo-500/30 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                    <span className="inline-block px-3 py-1 bg-indigo-500/10 text-indigo-400 font-mono text-sm font-bold rounded-lg border border-indigo-500/20 w-fit">
                      {log.version}
                    </span>
                    <span className="md:hidden text-sm text-slate-500">{log.date}</span>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">
                    {log.title}
                  </h2>
                  <p className="text-slate-400 mb-8 leading-relaxed">
                    {log.description}
                  </p>

                  <div className="space-y-4">
                    {log.updates.map((update, i) => {
                      const tagConfig = getTagConfig(update.type);
                      return (
                        <div key={i} className="flex gap-4 items-start">
                          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border shrink-0 mt-0.5 ${tagConfig.color}`}>
                            {tagConfig.icon}
                            {update.type}
                          </div>
                          <p className="text-slate-300 text-sm leading-relaxed">
                            {update.content}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer CTA */}
      <div className="max-w-3xl mx-auto px-6 py-20 text-center relative z-10">
        <h3 className="text-2xl font-bold text-white mb-6">想親自體驗最新的功能嗎？</h3>
        <Link 
          href="/app"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-[0_0_30px_-10px_rgba(79,70,229,0.5)] hover:shadow-[0_0_40px_-10px_rgba(79,70,229,0.7)] hover:-translate-y-1"
        >
          立即開啟 Workspace <Rocket className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
