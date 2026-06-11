"use client";

import React, { useState, useEffect, useRef } from "react";
import { Copy, ExternalLink, CheckCircle2, FileText, ChevronRight, Cloud } from "lucide-react";

export default function NotebookLMCenter({ stepData, teamProjects = [], isFetchingTeam = false, loadNotionProject = () => {}, isLoading = false, theme = "未命名專案", activeProjectId = null, mode = "creator" }) {
  const [activeTab, setActiveTab] = useState("step1");
  const [toastMessage, setToastMessage] = useState(null);
  const textContainerRef = useRef(null);

  // 取得選取文字或全文的輔助函數
  const getTextToCopy = () => {
    const selection = window.getSelection().toString();
    if (selection.trim()) {
      return selection;
    }
    // 如果沒有選取，回傳整篇 step1
    return stepData.step1 || "";
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
            onClick={() => setActiveTab("step1")}
            className={`w-full text-left px-4 py-4 rounded-xl flex items-center gap-3 transition-colors ${
              activeTab === "step1" 
                ? mode === "ecommerce" ? "bg-amber-50 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-800" : "bg-indigo-50 dark:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-800" 
                : "hover:bg-slate-100 dark:hover:bg-slate-700/50 border border-transparent"
            }`}
          >
            <div className={`p-2 rounded-lg ${activeTab === "step1" ? (mode === "ecommerce" ? "bg-amber-100 dark:bg-amber-800 text-amber-600 dark:text-amber-400" : "bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-400") : "bg-slate-100 dark:bg-slate-700 text-slate-500"}`}>
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className={`font-semibold ${activeTab === "step1" ? (mode === "ecommerce" ? "text-amber-900 dark:text-amber-300" : "text-indigo-900 dark:text-indigo-300") : "text-slate-700 dark:text-slate-300"}`}>
                Step 1
              </div>
              <div className="text-xs text-slate-500">
                基礎背景研究
              </div>
            </div>
          </button>
          
          {/* Team Projects (Notion) */}
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4" style={{animationDelay: "100ms"}}>
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Cloud className="w-4 h-4 text-sky-500" />
                切換雲端專案
              </h2>
            </div>
            
            <div className="grid gap-2">
              {teamProjects.map(proj => (
                <button
                  key={proj.id}
                  onClick={() => loadNotionProject(proj)}
                  disabled={isLoading}
                  className={`group flex items-center justify-between p-3 rounded-xl transition-all text-left disabled:opacity-50 ${
                    activeProjectId === proj.id
                      ? "bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800"
                      : "bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80"
                  }`}
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <h3 className={`text-sm truncate mb-0.5 transition-colors ${
                      activeProjectId === proj.id
                        ? "font-bold text-sky-700 dark:text-sky-300"
                        : "font-semibold text-slate-900 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400"
                    }`}>
                      {proj.theme}
                    </h3>
                  </div>
                </button>
              ))}
              
              {teamProjects.length === 0 && !isFetchingTeam && (
                <div className="text-center py-4 text-xs text-slate-500 bg-white/50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                  目前尚無專案
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 右側主內容區 */}
      <div className="flex-1 flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-4xl mx-auto">
            
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Step 1 基礎背景研究
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                  請框選下方文字，或直接點擊複製完整內容前往 NotebookLM。
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-700 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-medium rounded-xl transition-all shadow-md shadow-slate-200 dark:shadow-none hover:-translate-y-0.5"
                >
                  <Copy className="w-4 h-4" />
                  複製框選文字
                </button>
                <button
                  onClick={handleCopyAndGo}
                  className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-all shadow-md shadow-amber-200 dark:shadow-none hover:-translate-y-0.5"
                >
                  <ExternalLink className="w-4 h-4" />
                  複製並前往
                </button>
              </div>
            </div>

            {/* 大卡片顯示內容 */}
            <div 
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 min-h-[500px]"
            >
              {!stepData.step1 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 py-20">
                  <FileText className="w-12 h-12 mb-4 opacity-20" />
                  <p>尚未產生或載入 Step 1 的內容</p>
                </div>
              ) : (
                <div 
                  ref={textContainerRef}
                  className="prose prose-slate dark:prose-invert max-w-none whitespace-pre-wrap selection:bg-indigo-200 selection:text-indigo-900 dark:selection:bg-indigo-900 dark:selection:text-indigo-200 text-[15px] leading-relaxed"
                >
                  {stepData.step1}
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
