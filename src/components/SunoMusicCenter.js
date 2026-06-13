"use client";

import React, { useState, useEffect, useRef } from "react";
import { Copy, ExternalLink, Music, AlertCircle, CheckCircle2, Cloud, Upload } from "lucide-react";

// 解析 Markdown 資料
const parseSunoData = (text) => {
  if (!text) return [];
  
  const blocks = text.split(/###\s+/).filter(b => b.trim().length > 0);
  
  return blocks.map((block, index) => {
    const extractLine = (keywordRegex) => {
      const match = block.match(keywordRegex);
      return match ? match[1].trim() : "";
    };
    
    const lines = block.split('\n');
    const title = lines[0].trim() || `配樂 ${index + 1}`;
    
    const scene = extractLine(/\*?適用場景\*?[：:]\s*(.*?)(?=\n|$)/i);
    const sunoPrompt = extractLine(/\*?Suno AI Prompt\*?[：:]\s*(.*?)(?=\n|$)/i);
    
    let compiledText = `Prompt:\n${sunoPrompt}\n\n適用場景：\n${scene}`;
    
    if (!sunoPrompt && !scene) {
      compiledText = block;
    }
    
    return {
      id: index,
      title: title.replace(/^第[一二三]組[：:]\s*/, ''),
      compiledText
    };
  });
};

export default function SunoMusicCenter({ stepData, teamProjects = [], isFetchingTeam = false, loadNotionProject = () => {}, isLoading = false, theme = "未命名專案", activeProjectId = null }) {
  const activeTab = "step8"; // Suno配樂固定為 Step 8
  const [bubbles, setBubbles] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);
  
  // 上傳相關狀態
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const rawData = stepData[activeTab];
    if (rawData) {
      setBubbles(parseSunoData(rawData));
    } else {
      setBubbles([]);
    }
  }, [activeTab, stepData]);

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
      window.open('https://suno.com', '_blank');
    }, 500);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!activeProjectId || activeProjectId.length < 20) {
      alert("尚未載入或儲存至 Notion 專案，無法上傳音檔。\n\n請先確認這個專案已經匯出至 Notion，或是從上方的下拉選單中選擇一個已經歸檔的團隊專案。");
      return;
    }

    setIsUploading(true);
    setUploadProgress("上傳中...");
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("pageId", activeProjectId); // activeProjectId 為 Notion 的 page ID
      formData.append("stepId", "8"); // 傳遞這是哪個步驟，以便精準插入

      const res = await fetch("/api/notion/upload", {
        method: "POST",
        body: formData
      });
      
      const data = await res.json();
      if (data.success) {
        setUploadProgress("上傳成功！");
        setPreviewUrl(URL.createObjectURL(file));
        setTimeout(() => setUploadProgress(""), 3000);
      } else {
        setUploadProgress("上傳失敗");
        console.error(data.error);
        alert("上傳失敗: " + data.error);
      }
    } catch (err) {
      console.error("Upload error", err);
      setUploadProgress("發生錯誤");
      alert("發生錯誤，請稍後再試");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Suno 配樂中心</h2>
          <p className="text-sm text-slate-500 mt-1">點擊區塊產生獨立的對話指令，並派發至 Suno AI。</p>
        </div>
        
        <div className="p-4 space-y-2 flex-1 overflow-y-auto">
          <button
            className="w-full text-left px-4 py-4 rounded-xl flex items-center gap-3 transition-colors bg-indigo-50 dark:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-800"
          >
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-400">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-indigo-900 dark:text-indigo-300">
                Step 8
              </div>
              <div className="text-xs text-slate-500">Suno AI 配樂設計</div>
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
                尚未產生配樂指令
              </h3>
              <p className="text-amber-600/80 dark:text-amber-400/80 max-w-md">
                目前專案尚未包含 Step 8 的資料，請透過上方選單載入既有的 Notion 專案，或回到企劃工作區進行產製。
              </p>
            </div>
          ) : (
            /* 大卡片框架 (左深右淺) */
            <div className="flex flex-col lg:flex-row bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden flex-1 min-h-0">
              
              {/* 左側深色區塊 (Dark Panel) */}
              <div className="w-full lg:w-[320px] shrink-0 bg-slate-900 text-white p-8 flex flex-col justify-between">
                <div>
                  <div className="text-amber-400 text-sm font-bold tracking-wider mb-2">
                    PROMPT DISPATCHER
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{theme}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    一鍵複製為 Suno AI 量身打造的配樂指令，並快速開啟 Suno.com 進行生成。
                  </p>
                  
                  {/* 小提示區塊 */}
                  <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                    <div className="flex items-start gap-3">
                      <Music className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <span className="font-bold text-indigo-300 block mb-1">配樂小提示</span>
                        <span className="text-slate-400 leading-relaxed">
                          將指令貼上至 Suno 的 Custom Mode (自訂模式) 的 Style of Music 欄位中。
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notion 上傳區塊 */}
                <div className="mt-8 border-t border-slate-800 pt-6">
                  <div className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                    <Cloud className="w-4 h-4" /> 歸檔至 Notion
                  </div>
                  <p className="text-xs text-slate-500 mb-4">
                    將生成的音檔 (MP3/MP4) 直接上傳附加到目前的專案中。
                  </p>
                  
                  <div className="space-y-3">
                    <input 
                      type="file"
                      accept="audio/*,video/mp4"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                    
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading || !activeProjectId}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 hover:border-slate-500 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUploading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
                          上傳中...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          上傳本機音檔
                        </>
                      )}
                    </button>
                    
                    {uploadProgress && !isUploading && (
                      <div className="text-xs text-emerald-400 text-center flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {uploadProgress}
                      </div>
                    )}

                    {previewUrl && (
                      <div className="mt-4 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 p-2">
                        <div className="text-xs text-slate-500 mb-2 flex items-center gap-1 px-1">
                          上傳成功
                        </div>
                        <audio src={previewUrl} controls className="w-full h-10" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 右側明亮區塊 (Light Panel) */}
              <div className="flex-1 bg-white dark:bg-slate-800 p-8 overflow-y-auto">
                <div className="max-w-2xl mx-auto space-y-8">
                  {bubbles.map((bubble, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                      {/* 卡片標題列 */}
                      <div className="bg-slate-100 dark:bg-slate-800/80 px-5 py-3 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {bubble.title}
                        </span>
                      </div>
                      
                      {/* 文字編輯區 */}
                      <div className="p-5">
                        <textarea
                          value={bubble.compiledText}
                          onChange={(e) => handleTextChange(idx, e.target.value)}
                          className="w-full min-h-[140px] p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-sm leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow font-mono"
                          spellCheck="false"
                        />
                      </div>

                      {/* 動作按鈕列 */}
                      <div className="px-5 py-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
                        <button
                          onClick={() => handleCopy(bubble.compiledText)}
                          className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg flex items-center gap-2 transition-all shadow-sm"
                        >
                          <Copy className="w-4 h-4" /> 複製指令
                        </button>
                        <button
                          onClick={() => handleCopyAndGo(bubble.compiledText)}
                          className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-2 transition-all shadow-sm shadow-indigo-200 dark:shadow-none"
                        >
                          <ExternalLink className="w-4 h-4" /> 複製並前往 Suno
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
