"use client";

import React, { useState, useEffect, useRef } from "react";
import { Copy, ExternalLink, CheckCircle2, FileText, ChevronRight, Cloud } from "lucide-react";

export default function NotebookLMCenter({ stepData, teamProjects = [], isFetchingTeam = false, loadNotionProject = () => {}, isLoading = false, theme = "未命名專案", activeProjectId = null, mode = "creator" }) {
  const [activeTab, setActiveTab] = useState("step2");
  const [toastMessage, setToastMessage] = useState(null);
  const textContainerRef = useRef(null);

  // 取得選取文字或全文的輔助函數
  const getTextToCopy = () => {
    const selection = window.getSelection().toString();
    if (selection.trim()) {
      return selection;
    }
    return stepData[activeTab] || "";
  };

  const handleCopy = async () => {
    const text = getTextToCopy();
    if (!text.trim()) {
      alert("目前沒有內容可供複製！");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setToastMessage("✅ 文字已複製！");
      setTimeout(() => setToastMessage(null), 2000);
    } catch (err) {
      console.error("複製失敗", err);
      alert("複製失敗，請手動複製！");
    }
  };

  const handleCopyAndGo = async () => {
    const text = getTextToCopy();
    if (!text.trim()) {
      alert("目前沒有內容可供複製！");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setToastMessage("✅ 文字已複製，正在前往 NotebookLM...");
      setTimeout(() => {
        setToastMessage(null);
        window.open('https://notebooklm.google.com/', '_blank');
      }, 1000);
    } catch (err) {
      console.error("複製失敗", err);
      alert("複製失敗，請手動複製！");
    }
  };

  return (
    <div className="flex h-full w-full bg-slate-50 dark:bg-slate-900 overflow-hidden relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="bg-emerald-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-5 h-5" />
            {toastMessage}
          </div>
        </div>
      )}

      {/* 左側選單 */}
      <div className="w-72 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col h-full shrink-0">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">NotebookLM 影片中心</h2>
          <p className="text-sm text-slate-500 mt-1">將基礎背景研究匯入 NotebookLM 進行深度分析與整理。</p>
        </div>
        
        <div className="p-4 space-y-2 flex-1 overflow-y-auto">
          <button
            onClick={() => setActiveTab("step2")}
            className={`w-full text-left px-4 py-4 rounded-xl flex items-center gap-3 transition-colors ${
              activeTab === "step2" 
                ? "bg-indigo-50 dark:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-800" 
                : "hover:bg-slate-100 dark:hover:bg-slate-700/50 border border-transparent"
            }`}
          >
            <div>
              <div className={`font-semibold text-lg ${activeTab === "step2" ? "text-indigo-900 dark:text-indigo-300" : "text-slate-700 dark:text-slate-300"}`}>
                Step 2: 長影音腳本撰寫
              </div>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab("step4")}
            className={`w-full text-left px-4 py-4 rounded-xl flex items-center gap-3 transition-colors ${
              activeTab === "step4" 
                ? "bg-indigo-50 dark:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-800" 
                : "hover:bg-slate-100 dark:hover:bg-slate-700/50 border border-transparent"
            }`}
          >
            <div>
              <div className={`font-semibold text-lg ${activeTab === "step4" ? "text-indigo-900 dark:text-indigo-300" : "text-slate-700 dark:text-slate-300"}`}>
                Step 4: 短影音腳本撰寫
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* 右側主內容區 */}
      <div className="flex-1 flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-5xl mx-auto">
            
            {/* 橫向專案選擇器 */}
            <div className="flex items-center justify-between bg-slate-800 rounded-2xl p-3 mb-8 shadow-sm">
              <div className="flex items-center gap-3 flex-1 min-w-0 px-3">
                <Cloud className="w-5 h-5 text-sky-400 shrink-0" />
                <span className="text-sm font-bold text-slate-300 shrink-0">選擇歸檔主題</span>
                <select
                  value={activeProjectId || ""}
                  onChange={(e) => {
                    const proj = teamProjects.find(p => p.id === e.target.value);
                    if (proj) loadNotionProject(proj);
                  }}
                  className="bg-transparent border-none text-white font-medium focus:outline-none flex-1 truncate cursor-pointer"
                >
                  <option value="" disabled className="bg-slate-800 text-slate-300">-- 請選擇歸檔專案 --</option>
                  {teamProjects.map(proj => (
                    <option key={proj.id} value={proj.id} className="bg-slate-800 text-white">
                      【{proj.theme}】歸檔於 {new Date(proj.updatedAt).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>
              <button 
                onClick={() => {
                  const activeProj = teamProjects.find(p => p.id === activeProjectId);
                  if (activeProj && activeProj.archivedUrl) {
                    window.open(activeProj.archivedUrl, '_blank');
                  } else {
                    alert("目前專案尚未歸檔或找不到 Notion 連結。");
                  }
                }}
                disabled={!activeProjectId}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
              >
                <ExternalLink className="w-4 h-4" />
                在 Notion 開啟
              </button>
            </div>

            {/* 大卡片顯示內容 */}
            <div 
              className="bg-slate-800 rounded-2xl shadow-sm border border-slate-700 flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-700">
                <h2 className="text-xl font-bold text-white pl-2">
                  {activeTab === "step2" ? "2. 長影音腳本撰寫" : "4. 短影音腳本撰寫"}
                </h2>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors shadow-sm"
                  >
                    <Copy className="w-4 h-4" />
                    複製框選文字
                  </button>
                  <button
                    onClick={handleCopyAndGo}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-colors shadow-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    複製並前往
                  </button>
                </div>
              </div>
              
              <div className="p-8 min-h-[500px]">
                {!stepData[activeTab] ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 py-20">
                    <FileText className="w-12 h-12 mb-4 opacity-20" />
                    <p>尚未產生或載入內容</p>
                  </div>
                ) : (
                  <div 
                    ref={textContainerRef}
                    className="prose prose-invert max-w-none whitespace-pre-wrap selection:bg-indigo-900 selection:text-indigo-200 text-slate-300 text-[15px] leading-relaxed"
                  >
                    {stepData[activeTab]}
                  </div>
                )}
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
