"use client";

import React, { useEffect } from "react";
import { X, Rocket, Bug, Layout, Zap, Star } from "lucide-react";

export const changelogs = [
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

export default function ChangelogModal({ isOpen, onClose }) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/95 backdrop-blur z-10">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-indigo-500">✨</span> 更新日誌 (Changelog)
            </h2>
            <p className="text-sm text-slate-400 mt-1">追蹤 OmniScript 的最新功能與系統升級</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <div className="relative">
            {/* Timeline Spine */}
            <div className="absolute top-0 bottom-0 left-[15px] md:left-[27px] w-px bg-slate-800" />

            <div className="space-y-12">
              {changelogs.map((log) => (
                <div key={log.version} className="relative pl-12 md:pl-20">
                  {/* Timeline Dot */}
                  <div className="absolute left-[8px] md:left-[20px] top-1.5 w-4 h-4 rounded-full bg-slate-900 border-[3px] border-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.5)] z-10" />
                  
                  {/* Date Tag */}
                  <div className="absolute left-0 top-1.5 hidden md:block w-12 text-right opacity-0">
                    {/* Placeholder for spine alignment */}
                  </div>

                  <div className="bg-slate-950/50 border border-slate-800/80 rounded-2xl p-5 md:p-6 hover:border-indigo-500/30 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="inline-block px-2.5 py-1 bg-indigo-500/10 text-indigo-400 font-mono text-xs font-bold rounded-md border border-indigo-500/20">
                        {log.version}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">{log.date}</span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-2 tracking-tight">
                      {log.title}
                    </h3>
                    <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                      {log.description}
                    </p>

                    <div className="space-y-3">
                      {log.updates.map((update, i) => {
                        const tagConfig = getTagConfig(update.type);
                        return (
                          <div key={i} className="flex gap-3 items-start">
                            <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border shrink-0 mt-0.5 ${tagConfig.color}`}>
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
        </div>

      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(51, 65, 85, 0.8);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(71, 85, 105, 1);
        }
      `}} />
    </div>
  );
}
