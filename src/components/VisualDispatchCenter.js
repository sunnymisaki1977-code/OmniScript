"use client";

import React, { useState, useEffect } from "react";
import { Copy, ExternalLink, Image as ImageIcon, Smartphone, AlertCircle, CheckCircle2 } from "lucide-react";

// 解析 Markdown 資料
const parseVisualData = (text, type) => {
  if (!text) return [];
  
  // 以 ### 作為區塊分割點
  const blocks = text.split(/###\s+/).filter(b => b.trim().length > 0);
  
  return blocks.map((block, index) => {
    // 嘗試提取欄位，支援帶有或沒有粗體的格式
    const extractLine = (keywordRegex) => {
      const match = block.match(keywordRegex);
      return match ? match[1].trim() : "";
    };
    
    // 取得第一行作為標題
    const lines = block.split('\n');
    const title = lines[0].trim() || `提案 ${index + 1}`;
    
    const mainTitle = extractLine(/\*?(?:主標|高點擊文案)\*?[：:]\s*(.*?)(?=\n|$)/i);
    const subTitle = extractLine(/\*?副標\*?[：:]\s*(.*?)(?=\n|$)/i);
    const zhPrompt = extractLine(/\*?中文(?:指令)?\*?[：:]\s*(.*?)(?=\n|$)/i);
    const enPrompt = extractLine(/\*?English(?: Prompt)?\*?[：:]\s*(.*?)(?=\n|$)/i);
    
    // 組合最終字串
    const ratioStr = type === "step6" ? "16:9" : "9:16";
    let compiledText = `[請幫我生成一張 ${ratioStr} 圖像]\nPrompt:\n${enPrompt || zhPrompt}\n\n文字排版參考：\n主標：${mainTitle}`;
    if (subTitle) {
      compiledText += `\n副標：${subTitle}`;
    }
    if (!enPrompt && !zhPrompt) {
      // 找不到明確欄位，就丟原始字串
      compiledText = `[請幫我生成一張 ${ratioStr} 圖像]\n\n${block}`;
    }
    
    return {
      id: index,
      title: title.replace(/^第[一二三]組[：:]\s*/, ''), // 移除前面的「第一組：」
      compiledText
    };
  });
};

export default function VisualDispatchCenter({ stepData }) {
  const [activeTab, setActiveTab] = useState("step6");
  const [bubbles, setBubbles] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  // 當切換 Tab 或資料變動時，重新解析
  useEffect(() => {
    const rawData = stepData[activeTab];
    if (rawData) {
      setBubbles(parseVisualData(rawData, activeTab));
    } else {
      setBubbles([]);
    }
  }, [activeTab, stepData]);

  const handleTextChange = (index, newText) => {
    const newBubbles = [...bubbles];
    newBubbles[index].compiledText = newText;
    setBubbles(newBubbles);
  };

  const handleCopyAndGo = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setToastMessage("✅ 指令已複製！正在開啟 Gemini...");
      
      // 1.5 秒後消失
      setTimeout(() => {
        setToastMessage(null);
      }, 2000);

      // 開新分頁
      window.open('https://gemini.google.com/app', '_blank');
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
        </div>
      </div>

      {/* 右側主畫面 */}
      <div className="flex-1 h-full overflow-y-auto bg-slate-50 dark:bg-slate-900 p-8 lg:p-12">
        <div className="max-w-4xl mx-auto space-y-10">
          
          {bubbles.length === 0 ? (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 p-8 rounded-2xl flex flex-col items-center justify-center text-center">
              <AlertCircle className="w-12 h-12 text-amber-500 mb-4" />
              <h3 className="text-xl font-bold text-amber-700 dark:text-amber-500 mb-2">
                尚未產生視覺指令
              </h3>
              <p className="text-amber-600/80 dark:text-amber-400/80 max-w-md">
                目前專案尚未包含 {activeTab === "step6" ? "Step 6" : "Step 7"} 的資料，請先回到企劃工作區完成該步驟的 AI 產製。
              </p>
            </div>
          ) : (
            bubbles.map((bubble, index) => (
              <div key={index} className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex flex-col items-end w-full">
                  
                  {/* Chat Bubble Header */}
                  <div className="flex items-center gap-2 mb-2 mr-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Option {index + 1}
                    </span>
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      {bubble.title}
                    </span>
                  </div>

                  {/* Editable Bubble */}
                  <div className="w-[85%] relative group">
                    <textarea
                      value={bubble.compiledText}
                      onChange={(e) => handleTextChange(index, e.target.value)}
                      className="w-full min-h-[150px] p-5 rounded-2xl rounded-tr-sm bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-md border-none focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none leading-relaxed transition-all"
                      style={{ 
                        height: 'auto',
                        overflow: 'hidden'
                      }}
                      onInput={(e) => {
                        e.target.style.height = 'auto';
                        e.target.style.height = e.target.scrollHeight + 'px';
                      }}
                      ref={el => {
                        if (el) {
                          el.style.height = 'auto';
                          el.style.height = el.scrollHeight + 'px';
                        }
                      }}
                    />
                    
                    {/* Action Button (Attached to bubble) */}
                    <div className="absolute -bottom-5 right-0 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                      <button
                        onClick={() => handleCopyAndGo(bubble.compiledText)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg flex items-center gap-2 px-5 py-3 rounded-full font-bold text-sm transition-all hover:scale-105"
                      >
                        <Copy className="w-4 h-4" />
                        🚀 複製指令並開啟 Gemini
                        <ExternalLink className="w-4 h-4 ml-1 opacity-70" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Invisible spacer for the absolute button */}
                  <div className="h-8"></div>
                </div>
              </div>
            ))
          )}
          
        </div>
      </div>
    </div>
  );
}
