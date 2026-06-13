"use client";

import React, { useState, useEffect, useRef } from "react";
import { Copy, ExternalLink, Image as ImageIcon, Smartphone, AlertCircle, CheckCircle2, Cloud, Upload, LayoutTemplate } from "lucide-react";

// 解析 Markdown 資料
const parseVisualData = (text, type) => {
  if (!text) return [];
  
  if (type === "step9") {
    const cards = [];
    const parts = text.split(/\*\s*\*\*/).filter(b => b.trim().length > 0);
    
    parts.forEach((part) => {
      const titleMatch = part.match(/^(.*?)\*\*/);
      if (!titleMatch) return;
      const rawTitle = titleMatch[1].trim();
      
      if (!rawTitle.includes("張") && !rawTitle.includes("提案")) return;
      
      const content = part.replace(/^(.*?)\*\*/, '').trim();
      const ratioStr = rawTitle.includes("提案") ? "FB 爆款單圖 (1:1 或 4:5)" : "IG 懶人包 (4:5)";
      const compiledText = `[請幫我生成一張 ${ratioStr} 圖像]\n\n卡片主題：${rawTitle}\n\n設計與文字需求：\n${content}`;
      
      cards.push({
        id: cards.length,
        title: rawTitle,
        compiledText
      });
    });
    return cards;
  }
  
  const blocks = text.split(/###\s+/).filter(b => b.trim().length > 0);
  
  return blocks.map((block, index) => {
    const extractLine = (keywordRegex) => {
      const match = block.match(keywordRegex);
      return match ? match[1].trim() : "";
    };
    
    const lines = block.split('\n');
    const title = lines[0].trim() || `提案 ${index + 1}`;
    
    const mainTitle = extractLine(/\*?(?:主標|高點擊文案)\*?[：:]\s*(.*?)(?=\n|$)/i);
    const subTitle = extractLine(/\*?副標\*?[：:]\s*(.*?)(?=\n|$)/i);
    const zhPrompt = extractLine(/\*?中文(?:指令)?\*?[：:]\s*(.*?)(?=\n|$)/i);
    const enPrompt = extractLine(/\*?English(?: Prompt)?\*?[：:]\s*(.*?)(?=\n|$)/i);
    
    const ratioStr = type === "step6" ? "16:9" : "9:16";
    let compiledText = `[請幫我生成一張 ${ratioStr} 圖像]\nPrompt:\n${enPrompt || zhPrompt}\n\n文字排版參考：\n主標：${mainTitle}`;
    if (subTitle) {
      compiledText += `\n副標：${subTitle}`;
    }
    if (!enPrompt && !zhPrompt) {
      compiledText = `[請幫我生成一張 ${ratioStr} 圖像]\n\n${block}`;
    }
    
    return {
      id: index,
      title: title.replace(/^第[一二三]組[：:]\s*/, ''),
      compiledText
    };
  });
};

export default function VisualDispatchCenter({ stepData, teamProjects = [], isFetchingTeam = false, loadNotionProject = () => {}, isLoading = false, theme = "未命名專案", activeProjectId = null }) {
  const [activeTab, setActiveTab] = useState("step6");
  const [bubbles, setBubbles] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);
  
  const [uploadState, setUploadState] = useState({});

  useEffect(() => {
    const rawData = stepData[activeTab];
    if (rawData) {
      setBubbles(parseVisualData(rawData, activeTab));
    } else {
      setBubbles([]);
    }
  }, [activeTab, stepData]);

  // 切換分頁時清空上傳狀態與預覽圖
  useEffect(() => {
    setUploadState({});
  }, [activeTab]);

  const handleTextChange = (index, newText) => {
    const newBubbles = [...bubbles];
    newBubbles[index].compiledText = newText;
    setBubbles(newBubbles);
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setToastMessage("✅ 指令已複製！");
      setTimeout(() => setToastMessage(null), 2000);
    } catch (err) {
      console.error("複製失敗", err);
      alert("複製失敗，請手動複製！");
    }
  };

  const handleCopyAndGo = async (text) => {
    await handleCopy(text);
    setTimeout(() => {
      window.open('https://gemini.google.com/app', '_blank');
    }, 500);
  };

  const handleFileChange = async (e, bubbleIndex) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!activeProjectId || activeProjectId.length < 20) {
      alert("尚未載入或儲存至 Notion 專案，無法上傳圖片。\n\n請先確認這個專案已經匯出至 Notion，或是從上方的下拉選單中選擇一個已經歸檔的團隊專案。");
      return;
    }

    setUploadState(prev => ({
      ...prev,
      [bubbleIndex]: { ...prev[bubbleIndex], isUploading: true, progress: "上傳中..." }
    }));
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("pageId", activeProjectId); // activeProjectId 為 Notion 的 page ID
      formData.append("stepId", activeTab.replace("step", "")); // 傳遞這是哪個步驟，以便精準插入

      const res = await fetch("/api/notion/upload", {
        method: "POST",
        body: formData
      });
      
      const data = await res.json();
      if (data.success) {
        setUploadState(prev => ({
          ...prev,
          [bubbleIndex]: { isUploading: false, progress: "上傳成功！", previewUrl: URL.createObjectURL(file) }
        }));
        setTimeout(() => {
          setUploadState(prev => ({
            ...prev,
            [bubbleIndex]: { ...prev[bubbleIndex], progress: "" }
          }));
        }, 3000);
      } else {
        setUploadState(prev => ({
          ...prev,
          [bubbleIndex]: { ...prev[bubbleIndex], isUploading: false, progress: "上傳失敗" }
        }));
        console.error(data.error);
        alert("上傳失敗: " + data.error);
      }
    } catch (err) {
      console.error("Upload error", err);
      setUploadState(prev => ({
        ...prev,
        [bubbleIndex]: { ...prev[bubbleIndex], isUploading: false, progress: "發生錯誤" }
      }));
      alert("發生錯誤，請稍後再試");
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
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">視覺發控中心</h2>
          <p className="text-sm text-slate-500 mt-1">點擊區塊產生獨立的對話指令，並派發至 Gemini。</p>
        </div>
        
        <div className="p-4 space-y-2 flex-1 overflow-y-auto">
          <button
            onClick={() => setActiveTab("step6")}
            className={`w-full text-left px-4 py-4 rounded-xl flex items-center gap-3 transition-colors ${
              activeTab === "step6" 
                ? "bg-indigo-50 dark:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-800" 
                : "hover:bg-slate-100 dark:hover:bg-slate-700/50 border border-transparent"
            }`}
          >
            <div className={`p-2 rounded-lg ${activeTab === "step6" ? "bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-400" : "bg-slate-100 dark:bg-slate-700 text-slate-500"}`}>
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <div className={`font-semibold ${activeTab === "step6" ? "text-indigo-900 dark:text-indigo-300" : "text-slate-700 dark:text-slate-300"}`}>
                Step 6
              </div>
              <div className="text-xs text-slate-500">長影音縮圖 (16:9)</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("step7")}
            className={`w-full text-left px-4 py-4 rounded-xl flex items-center gap-3 transition-colors ${
              activeTab === "step7" 
                ? "bg-indigo-50 dark:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-800" 
                : "hover:bg-slate-100 dark:hover:bg-slate-700/50 border border-transparent"
            }`}
          >
            <div className={`p-2 rounded-lg ${activeTab === "step7" ? "bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-400" : "bg-slate-100 dark:bg-slate-700 text-slate-500"}`}>
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className={`font-semibold ${activeTab === "step7" ? "text-indigo-900 dark:text-indigo-300" : "text-slate-700 dark:text-slate-300"}`}>
                Step 7
              </div>
              <div className="text-xs text-slate-500">短影音縮圖 (9:16)</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("step9")}
            className={`w-full text-left px-4 py-4 rounded-xl flex items-center gap-3 transition-colors ${
              activeTab === "step9" 
                ? "bg-indigo-50 dark:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-800" 
                : "hover:bg-slate-100 dark:hover:bg-slate-700/50 border border-transparent"
            }`}
          >
            <div className={`p-2 rounded-lg ${activeTab === "step9" ? "bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-400" : "bg-slate-100 dark:bg-slate-700 text-slate-500"}`}>
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <div>
              <div className={`font-semibold ${activeTab === "step9" ? "text-indigo-900 dark:text-indigo-300" : "text-slate-700 dark:text-slate-300"}`}>
                Step 9
              </div>
              <div className="text-xs text-slate-500">社群圖文企劃</div>
            </div>
          </button>
        </div>
      </div>

      {/* 右側主畫面 */}
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

          {bubbles.length === 0 ? (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 p-8 rounded-2xl flex flex-col items-center justify-center text-center flex-1">
              <AlertCircle className="w-12 h-12 text-amber-500 mb-4" />
              <h3 className="text-xl font-bold text-amber-700 dark:text-amber-500 mb-2">
                尚未產生視覺指令
              </h3>
              <p className="text-amber-600/80 dark:text-amber-400/80 max-w-md">
                目前專案尚未包含 {activeTab === "step6" ? "Step 6" : "Step 7"} 的資料，請透過上方選單載入既有的 Notion 專案，或回到企劃工作區進行產製。
              </p>
            </div>
          ) : (
            /* 大卡片框架 (左深右淺) */
            <div className="flex flex-col lg:flex-row bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden flex-1 min-h-0">
              
              {/* 左側深色區塊 (Dark Panel) */}
              <div className="w-full lg:w-[320px] shrink-0 bg-slate-900 text-white p-8 flex flex-col justify-between">
                <div>
                  <div className="text-amber-400 text-sm font-bold tracking-wider mb-2">
                    {activeTab === "step6" ? "長影音縮圖 (16:9)" : activeTab === "step9" ? "IG, FaceBook 圖文" : "短影音縮圖 (9:16)"}
                  </div>
                  <h3 className="text-3xl font-extrabold mb-8 leading-tight">
                    {theme}
                  </h3>
                  
                  <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
                    <p>每張卡片皆分為三個獨立小組。</p>
                    <p>請在右側文字框中反白選取您需要的段落，然後點擊小卡下方的按鈕進行複製。</p>
                    <p>未框選則預設複製該小卡的全部內容。</p>
                  </div>
                </div>

                {/* Removed Notion Upload block from Dark Panel */}
              </div>

              {/* 右側淺色區塊 (Light Panel - Grid of Cards) */}
              <div className="flex-1 bg-slate-50 dark:bg-slate-900 p-6 lg:p-8">
                <div className="grid gap-6">
                  {bubbles.map((bubble, index) => {
                    const uState = uploadState[index] || {};
                    return (
                    <div key={index} className="flex flex-col md:flex-row gap-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 animate-in fade-in slide-in-from-right-4" style={{ animationDelay: `${index * 100}ms` }}>
                      
                      <div className="flex-1 flex flex-col">
                        {/* 小卡標題 */}
                        <div className="flex items-center gap-2 mb-4">
                          <span className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </span>
                          <h4 className="font-bold text-slate-800 dark:text-slate-200">
                            {bubble.title}
                          </h4>
                        </div>

                        {/* 文字輸入區 */}
                        <textarea
                          value={bubble.compiledText}
                          onChange={(e) => handleTextChange(index, e.target.value)}
                          className="w-full min-h-[140px] p-4 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-y leading-relaxed text-sm mb-4 font-mono"
                        />

                        {/* 按鈕列 */}
                        <div className="flex items-center justify-end gap-3 mt-auto">
                          <button
                            onClick={() => {
                              const selection = window.getSelection().toString();
                              handleCopy(selection || bubble.compiledText);
                            }}
                            className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                          >
                            <Copy className="w-4 h-4" />
                            複製框選文字
                          </button>
                          <button
                            onClick={() => {
                              const selection = window.getSelection().toString();
                              handleCopyAndGo(selection || bubble.compiledText);
                            }}
                            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-white text-sm font-bold transition-colors flex items-center gap-2 shadow-sm shadow-amber-500/20"
                          >
                            <ExternalLink className="w-4 h-4" />
                            複製並前往
                          </button>
                        </div>
                      </div>

                      {/* 上傳區塊 (Right side per card) */}
                      <div className="w-full md:w-[180px] shrink-0 flex flex-col border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700 pt-6 md:pt-0 md:pl-6">
                        <div className="text-xs font-bold text-slate-400 mb-3 flex items-center justify-between">
                          <span>匯入生成圖像至 Notion</span>
                          {uState.progress && (
                            <span className="text-[10px] text-amber-400">{uState.progress}</span>
                          )}
                        </div>
                        <label className={`flex-1 w-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 relative overflow-hidden min-h-[140px] bg-slate-900/20 transition-colors ${
                          !activeProjectId || uState.isUploading 
                            ? "border-slate-700 opacity-50 cursor-not-allowed" 
                            : "border-slate-600 hover:border-slate-400 hover:bg-slate-700/50 cursor-pointer group"
                        }`}>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => handleFileChange(e, index)}
                            disabled={!activeProjectId || uState.isUploading}
                          />
                          {uState.previewUrl ? (
                            <>
                              <img src={uState.previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
                              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-xs font-bold bg-slate-900/80 px-2 py-1 rounded-md">重新上傳</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <ImageIcon className="w-6 h-6 text-slate-500 group-hover:text-slate-300 transition-colors" />
                              <span className="text-xs text-slate-400 group-hover:text-slate-300 font-medium z-10 text-center px-2">
                                {uState.isUploading ? "上傳中..." : "點擊上傳圖檔"}
                              </span>
                            </>
                          )}
                        </label>
                      </div>
                    </div>
                  );})}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
