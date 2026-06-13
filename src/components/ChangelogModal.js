"use client";

import React, { useEffect } from "react";
import { X, Rocket, Bug, Layout, Zap, Star } from "lucide-react";

export const changelogs = [
  {
    version: "v1.3.0",
    date: "2026/06/14",
    title: "企劃工作區介面重構與 AI 容錯引擎升級",
    description: "重新設計了主要企劃工作區的卡片式視覺佈局，帶來極致的跨視窗整合體驗；並且深度強化了後端 AI 處理能力，全面導入 5 次指數退避重試與嚴格的 JSON 防呆機制。",
    updates: [
      { type: "UI/UX", content: "企劃工作區介面翻新：引入「左側深色大標面板、右側淺色編輯區」的精緻圓角卡片設計，並將「參考資料」無縫融合至深色面板，大幅提升螢幕空間利用率與閱讀質感。" },
      { type: "UI/UX", content: "全域視覺與 Logo 升級：更換代表魔法的星芒 (Sparkles) Logo，並精準修正頂部導覽列對齊問題，讓全站介面結構與發控中心完美統一。" },
      { type: "Feature", content: "發控中心擴充 Step 9：視覺發控中心現在完整支援解析「社群圖文企劃」，能自動將長文精準切分為 5 張 IG 懶人包與 2 張 FB 爆款單圖，實現單張卡片一鍵複製發送。" },
      { type: "Feature", content: "AI 三階段智能退避 (Fallback)：大幅強化 Gemini API 呼叫韌性，新增 5 次自動重試，並在遇到 429 限流時，自動按照 pro -> flash -> flash-lite 的順序無縫降級生成。" },
      { type: "Fix", content: "終極防 JSON 破圖防禦：現在若 AI API 意外返回截斷或非標準的內容 (SyntaxError)，後端會主動攔截並觸發重試機制；同時加入深層資料防呆轉換，徹底杜絕 React 渲染報錯崩潰。" }
    ]
  },
  {
    version: "v1.2.0",
    date: "2026/06/09",
    title: "團隊協作體驗升級與 Vercel 佈署修復",
    description: "全面翻新團隊名單與 Notion 實名歸檔機制，並徹底解決 Vercel 環境下的圖片上傳與預覽問題，同時導入更具沉浸感的生成動畫。",
    updates: [
      { type: "Feature", content: "Notion 實名歸檔：將專案歸檔至 Notion 時，會自動在文件最頂端印出執行歸檔的「團隊成員名稱」與「時間」，權責更清晰。" },
      { type: "Feature", content: "跨區域 Notion 傳送門：在系統各處（企劃工作區、視覺發控中心、首頁團隊軌跡）新增「🔗 在 Notion 開啟」的一鍵跳轉按鈕。" },
      { type: "Fix", content: "修復 Vercel 500 錯誤：重寫圖片上傳機制，全面捨棄本機暫存，改採記憶體 Blob 串接 Notion File Upload API，解決伺服器路徑錯誤。" },
      { type: "Feature", content: "圖片上傳即時預覽：在視覺發控中心上傳圖片至 Notion 後，畫面上會立刻載入該圖片的縮圖預覽，不用再兩邊切換確認。" },
      { type: "UI/UX", content: "沉浸式等待動畫：AI 生成的等待時間中加入專屬有聲科技動畫，大幅減輕使用者的等待焦慮感。" },
      { type: "UI/UX", content: "團隊名單更新：全面換上最新的團隊職稱與成員名單（Frontend 林亞欣、Backend 蘇之苓、UI 王瑞鐘、UX 白采鑫、PM 江世銘），並固定首頁看板為唯讀狀態。" }
    ]
  },
  {
    version: "v1.1.1",
    date: "2026/06/06",
    title: "全域版面流暢度與即時動態修復",
    description: "徹底解決了各個工作區的版面高度裁切問題，並修復了 Notion API 的相容性問題以確保團隊即時軌跡的運作。",
    updates: [
      { type: "UI/UX", content: "版面捲動優化：修正了編輯工作區、側邊欄、參考資料及視覺發控中心高度被強制裁切的「雙重捲軸 (Double Scrollbar)」問題，全面提供自然順暢的滿版捲動體驗。" },
      { type: "Fix", content: "修復後端呼叫 Notion API 時因版本相容性所導致的隱形 500 錯誤，現在首頁的「團隊活動軌跡」已能精準且即時地同步成員動態。" },
      { type: "UI/UX", content: "首頁動線升級：將「體驗 Demo」與「更新日誌」按鈕完美無縫融入開發時程與專案管理區塊，提升視覺連貫性。" }
    ]
  },
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
