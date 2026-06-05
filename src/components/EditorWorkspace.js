import { useState, useEffect, useRef } from "react";
import { Sparkles, Save, Copy, Check, Cloud, CloudOff } from "lucide-react";

export default function EditorWorkspace({ 
  step, 
  value, 
  onChange, 
  isLoading, 
  onRegenerate, 
  onSaveNext, 
  isLastStep,
  saveStatus, // "saved", "saving", "error"
  isAutoRunning,
  isArchived
}) {
  const textareaRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [loadingText, setLoadingText] = useState("");

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
    <div className="flex-1 h-screen flex flex-col bg-white dark:bg-[#0F172A] relative">
      <div className="px-10 py-8 max-w-4xl mx-auto w-full flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            {step.title}
          </h2>
          
          {/* Auto-save Status */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-medium">
            {saveStatus === "saved" && (
              <><Cloud className="w-4 h-4 text-emerald-500" /> 已儲存</>
            )}
            {saveStatus === "saving" && (
              <><Cloud className="w-4 h-4 animate-pulse" /> 儲存中...</>
            )}
            {saveStatus === "error" && (
              <><CloudOff className="w-4 h-4 text-rose-500" /> 儲存失敗</>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative pb-32">
          {isLoading ? (
            <div className="animate-pulse space-y-6">
              <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 font-medium text-lg mb-6">
                <Sparkles className="w-6 h-6 animate-spin" />
                <span className="typewriter">{loadingText}</span>
              </div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
              <div className="h-32 mt-8 bg-slate-100 dark:bg-slate-800/50 rounded-xl"></div>
            </div>
          ) : (
            <div className={`relative ${isCodeType ? 'rounded-xl overflow-hidden shadow-sm' : ''}`}>
              {isCodeType && (
                <div className="absolute top-4 right-4 z-10">
                  <button
                    onClick={handleCopy}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors backdrop-blur-sm
                      ${copied 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                        : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800 border border-slate-700/50'}
                    `}
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "已複製" : "複製"}
                  </button>
                </div>
              )}
              <textarea
                ref={textareaRef}
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                placeholder="AI 生成的內容會顯示在這裡，您可以直接編輯..."
                className={`w-full min-h-[300px] bg-transparent outline-none resize-none leading-relaxed
                  ${isCodeType 
                    ? 'font-mono text-sm p-6 bg-[#1E293B] text-slate-300 rounded-xl focus:ring-1 focus:ring-slate-700 border border-slate-700' 
                    : 'text-lg text-slate-800 dark:text-slate-200 placeholder-slate-300 dark:placeholder-slate-700'}
                `}
              />
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white dark:bg-slate-800 p-2 pl-4 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-slate-700 z-20 transition-all">
        {isAutoRunning ? (
          <div className="flex items-center gap-3 px-6 py-3 text-sm font-bold text-indigo-600 dark:text-indigo-400">
            <div className="w-5 h-5 border-2 border-indigo-600/30 border-t-indigo-600 dark:border-indigo-400/30 dark:border-t-indigo-400 rounded-full animate-spin" />
            自動生成中，請稍候...
          </div>
        ) : (
          <>
            <button
              onClick={onRegenerate}
              disabled={isLoading || isArchived}
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 dark:text-amber-500 rounded-xl transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              重新生成 (消耗 1 點)
            </button>
            
            <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
            
            <button
              onClick={onSaveNext}
              disabled={isLoading || !value?.trim() || (isLastStep && isArchived)}
              className={`flex items-center gap-2 px-8 py-3 text-sm font-bold text-white rounded-xl transition-all ${
                isLastStep && isArchived
                  ? "bg-emerald-500 dark:bg-emerald-600 cursor-not-allowed shadow-none hover:translate-y-0"
                  : "bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 dark:shadow-none hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isLastStep ? (
                isArchived ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />
              ) : null}
              {isLastStep ? (isArchived ? "已歸檔至 Notion" : "確認並歸檔至 Notion") : "儲存並進行下一步 ➔"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
