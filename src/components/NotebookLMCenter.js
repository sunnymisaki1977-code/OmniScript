"use client";

import React, { useState, useRef } from "react";
import { Copy, ExternalLink, CheckCircle2, FileText, Smartphone, AlertCircle, Cloud } from "lucide-react";

export default function NotebookLMCenter({ stepData, teamProjects = [], isFetchingTeam = false, loadNotionProject = () => {}, isLoading = false, theme = "未命名專案", activeProjectId = null, mode = "creator", activeSubTab = "step2" }) {
  const activeTab = activeSubTab;
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

      {/* 主畫面 */}
      <div className="flex-1 h-full overflow-y-auto bg-slate-100 dark:bg-slate-900/50 p-6 lg:p-10">
        <div className="max-w-5xl mx-auto flex flex-col min-h-full space-y-6">

          {/* 選擇歸檔主題下拉選單 */}
          <div className="w-full bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center gap-4 shrink-0">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap flex items-center gap-2">
              <Cloud className="w-4 h-4 text-sky-500" />
              選擇歸檔主題
            </span>
            <div className="relative flex-1 flex items-center gap-3">
              {isFetchingTeam ? (
                <div className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-500 flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-sky-200 border-t-sky-500 rounded-full animate-spin"></div>
                  同步資料中...
                </div>
              ) : (
                <div className="relative flex-1">
                  <select
                    onChange={(e) => {
                      const proj = teamProjects.find(p => p.id === e.target.value);
                      if (proj) loadNotionProject(proj);
                    }}
                    disabled={isLoading || teamProjects.length === 0}
                    className="w-full appearance-none bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 cursor-pointer"
                    value={activeProjectId || ""}
                  >
                    <option value="" disabled>-- 點擊選擇團隊專案 --</option>
                    {teamProjects.map(proj => (
                      <option key={proj.id} value={proj.id}>
                        【{proj.theme}】歸檔於 {new Date(proj.updatedAt).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
              )}
              {activeProjectId && teamProjects.find(p => p.id === activeProjectId)?.url && (
                <a
                  href={teamProjects.find(p => p.id === activeProjectId).url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-800/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
                >
                  <ExternalLink className="w-4 h-4" />
                  在 Notion 開啟
                </a>
              )}
            </div>
          </div>

          {!stepData[activeTab] ? (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 p-8 rounded-2xl flex flex-col items-center justify-center text-center flex-1">
              <AlertCircle className="w-12 h-12 text-amber-500 mb-4" />
              <h3 className="text-xl font-bold text-amber-700 dark:text-amber-500 mb-2">
                尚未產生內容
              </h3>
              <p className="text-amber-600/80 dark:text-amber-400/80 max-w-md">
                目前專案尚未包含 {activeTab === "step2" ? "Step 2" : "Step 4"} 的資料，請透過上方選單載入既有的 Notion 專案，或回到企劃工作區進行產製。
              </p>
            </div>
          ) : (
            /* 大卡片框架 (左深右淺) */
            <div className="flex flex-col lg:flex-row bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden flex-1 min-h-0">

              {/* 左側深色區塊 (Dark Panel) */}
              <div className="w-full lg:w-[320px] shrink-0 bg-slate-900 text-white p-8 flex flex-col justify-between">
                <div>
                  <div className="text-amber-400 text-sm font-bold tracking-wider mb-2">
                    {activeTab === "step2" ? "長影音腳本撰寫" : "短影音腳本撰寫"}
                  </div>
                  <h3 className="text-3xl font-extrabold mb-8 leading-tight">
                    {theme}
                  </h3>

                  <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
                    <p>將基礎背景研究匯入 NotebookLM 進行深度分析與整理。</p>
                    <p>請在右側文字框中反白選取您需要的段落，然後點擊下方按鈕進行複製。</p>
                    <p>未框選則預設複製全部內容。</p>
                  </div>
                </div>
              </div>

              {/* 右側淺色區塊 (Light Panel) */}
              <div className="flex-1 bg-slate-50 dark:bg-slate-900 p-6 lg:p-8 overflow-y-auto">
                <div className="grid gap-6">
                  <div className="flex flex-col bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 animate-in fade-in slide-in-from-right-4">

                    {/* 小卡標題 */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 flex items-center justify-center text-xs font-bold">
                        {activeTab === "step2" ? "2" : "4"}
                      </span>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200">
                        {activeTab === "step2" ? "長影音腳本撰寫" : "短影音腳本撰寫"}
                      </h4>
                    </div>

                    {/* 文字顯示區 */}
                    <div
                      ref={textContainerRef}
                      className="w-full min-h-[300px] p-4 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 leading-relaxed text-sm mb-4 whitespace-pre-wrap selection:bg-indigo-100 dark:selection:bg-indigo-900 selection:text-indigo-900 dark:selection:text-indigo-200 overflow-y-auto"
                    >
                      {stepData[activeTab]}
                    </div>

                    {/* 按鈕列 */}
                    <div className="flex items-center justify-end gap-3 mt-auto">
                      <button
                        onClick={handleCopy}
                        className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                      >
                        <Copy className="w-4 h-4" />
                        複製框選文字
                      </button>
                      <button
                        onClick={handleCopyAndGo}
                        className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-white text-sm font-bold transition-colors flex items-center gap-2 shadow-sm shadow-amber-500/20"
                      >
                        <ExternalLink className="w-4 h-4" />
                        複製並前往
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
