import { useState, useEffect, useRef } from "react";
import { Sparkles, Save, Copy, Check, Cloud, CloudOff, ExternalLink, Info, Zap } from "lucide-react";

export default function EditorWorkspace({ 
  step, 
  value, 
  onChange, 
  isLoading, 
  onSaveNext, 
  isLastStep,
  saveStatus, // "saved", "saving", "error"
  isAutoRunning,
  isArchived,
  teamProjects,
  isFetchingTeam,
  loadNotionProject,
  activeProjectId,
  contextData,
  onResumeAuto
}) {
  const textareaRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const videos = [
    "https://res.cloudinary.com/dhvzfeo7p/video/upload/q_auto/f_auto/v1780920395/_%E5%9C%96%E7%94%9F%E5%8B%95%E7%95%AB%E8%A6%8F%E5%8A%83_Animation_Planning__o5hw6k.mp4",
    "https://res.cloudinary.com/dhvzfeo7p/video/upload/q_auto/f_auto/v1780920477/_%E5%9C%96%E7%94%9F%E5%8B%95%E7%95%AB%E8%A6%8F%E5%8A%83_Animation_Planning__1_umfge3.mp4"
  ];

  const loadingMessages = [
    "正在讀取背景資料...",
    "正在分析受眾痛點...",
    "正在萃取關鍵字...",
    "正在施展魔法...",
    "即將完成...",
  ];

  useEffect(() => {
    if (isLoading) {
      let i = 0;
      setLoadingText(loadingMessages[0]);
      setVideoUrl(videos[Math.floor(Math.random() * videos.length)]);
      const interval = setInterval(() => {
        i = (i + 1) % loadingMessages.length;
        setLoadingText(loadingMessages[i]);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  // Auto-resize
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.max(textareaRef.current.scrollHeight, 300)}px`;
    }
  }, [value, isLoading]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const isCodeType = step.type === "code";

  return (
    <div className="flex-1 h-full overflow-y-auto bg-slate-100 dark:bg-slate-900/50 p-6 lg:p-10">
      <div className="max-w-5xl mx-auto flex flex-col min-h-full space-y-6">
        
        {/* Notion Dropdown */}
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
                  disabled={isLoading || !teamProjects || teamProjects.length === 0}
                  className="w-full appearance-none bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 cursor-pointer"
                  value={activeProjectId || ""}
                >
                  <option value="" disabled>-- 點擊選擇團隊專案 --</option>
                  {teamProjects?.map(proj => (
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
            {activeProjectId && teamProjects?.find(p => p.id === activeProjectId)?.url && (
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

        {/* 卡片本體 (左深右淺) */}
        <div className="flex flex-col lg:flex-row bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden flex-1 min-h-0">
          
          {/* 左側深色區塊 (Title & Reference) */}
          <div className="w-full lg:w-[320px] shrink-0 bg-slate-900 text-white p-8 flex flex-col">
            <h3 className="text-3xl font-extrabold mb-8 leading-tight">{step.title}</h3>
            
            {/* Reference Context */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-400 mb-4">
                <Info className="w-4 h-4" />
                參考資料
              </div>
              
              {(!step.dependsOn || step.dependsOn.length === 0) ? (
                <div className="text-sm text-slate-500 text-center mt-10">
                  無依賴的參考資料
                </div>
              ) : (
                <div className="space-y-6 pb-6">
                  {step.dependsOn.map((dep) => {
                    if (dep === "theme") return null;
                    const stepId = dep.replace("step", "");
                    const content = contextData?.[dep];
                    if (!content) return null;
                    
                    return (
                      <div key={dep} className="space-y-2">
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          來源: 步驟 {stepId}
                        </h4>
                        <div className="bg-slate-800/80 rounded-lg p-4 text-sm text-slate-300 whitespace-pre-wrap leading-relaxed shadow-inner border border-slate-700/50 max-h-[300px] overflow-y-auto custom-scrollbar">
                          {content}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* 右側淺色區塊 (Editor) */}
          <div className="flex-1 bg-slate-50 dark:bg-slate-900 p-6 lg:p-10 relative flex flex-col">
            
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                {isCodeType && (
                  <button
                    onClick={handleCopy}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors backdrop-blur-sm
                      ${copied 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow-sm'}
                    `}
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "已複製" : "複製"}
                  </button>
                )}
              </div>
              
              <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-medium">
                {saveStatus === "saved" && <><Cloud className="w-4 h-4 text-emerald-500" /> 已儲存</>}
                {saveStatus === "saving" && <><Cloud className="w-4 h-4 animate-pulse" /> 儲存中...</>}
                {saveStatus === "error" && <><CloudOff className="w-4 h-4 text-rose-500" /> 儲存失敗</>}
              </div>
            </div>

            {/* Textarea Area */}
            <div className="flex-1 relative pb-20 overflow-y-auto custom-scrollbar pr-2">
              {isLoading ? (
                <div className="flex flex-col h-full space-y-4">
                  <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 font-medium text-lg mb-2">
                    <Sparkles className="w-6 h-6 animate-spin" />
                    <span className="typewriter">{loadingText}</span>
                  </div>
                  <div className="flex-1 w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 relative bg-slate-900 shadow-xl min-h-[300px]">
                    {videoUrl && (
                      <video 
                        src={videoUrl}
                        autoPlay 
                        loop
                        playsInline
                        className="w-full h-full object-cover opacity-90"
                      />
                    )}
                  </div>
                </div>
              ) : (
                <textarea
                  ref={textareaRef}
                  value={value || ""}
                  onChange={(e) => onChange(e.target.value)}
                  readOnly={isArchived}
                  placeholder="AI 生成的內容會顯示在這裡，您可以直接編輯..."
                  className={`w-full min-h-[400px] h-full bg-transparent outline-none resize-none leading-relaxed
                    ${isCodeType 
                      ? 'font-mono text-sm p-6 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl focus:ring-1 focus:ring-indigo-500 border border-slate-200 dark:border-slate-700 shadow-sm' 
                      : 'text-lg text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600'}
                    ${isArchived ? 'opacity-70 cursor-not-allowed' : ''}
                  `}
                />
              )}
            </div>

            {/* Action Buttons (Save/Next) */}
            <div className="absolute bottom-6 right-6 lg:bottom-10 lg:right-10 z-20 flex gap-4">
              {isAutoRunning ? (
                <div className="flex items-center gap-3 px-6 py-3 text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                  <div className="w-5 h-5 border-2 border-indigo-600/30 border-t-indigo-600 dark:border-indigo-400/30 dark:border-t-indigo-400 rounded-full animate-spin" />
                  自動生成中，請稍候...
                </div>
              ) : (
                !isArchived && (
                  <div className="flex items-center gap-3">
                    {!isLastStep && (
                      <button
                        onClick={onResumeAuto}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800/50 rounded-xl transition-all hover:bg-indigo-50 dark:hover:bg-indigo-900/30 shadow-sm hover:-translate-y-0.5 disabled:opacity-50"
                      >
                        <Zap className="w-4 h-4" />
                        自動接續完成
                      </button>
                    )}
                    <button
                      onClick={onSaveNext}
                      disabled={isLoading || !value?.trim()}
                      className="flex items-center gap-2 px-8 py-3 text-sm font-bold text-white rounded-xl transition-all bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : isLastStep ? (
                        <Save className="w-4 h-4" />
                      ) : null}
                      {isLastStep ? "確認並歸檔至 Notion" : "儲存並進行下一步 ➔"}
                    </button>
                  </div>
                )
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
