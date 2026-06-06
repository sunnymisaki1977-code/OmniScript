"use client";

import { 
  Rocket, 
  Terminal, 
  PenTool, 
  GitMerge, 
  Layers, 
  LayoutTemplate, 
  Database,
  ArrowRight,
  Code2,
  CheckCircle2,
  Sparkles,
  Zap,
  Pencil,
  Palette,
  Waypoints,
  UserCheck
} from "lucide-react";
import { useState, useEffect } from "react";
import ChangelogModal from "../components/ChangelogModal";
import IdentityModal from "../components/IdentityModal";
import ActivityFeed from "../components/ActivityFeed";

const INITIAL_ROLES = [
  {
    id: "frontend",
    title: "前端工程師 (Frontend)",
    battlefield: "實作高互動性的 SaaS Dashboard、複雜的九步驟 Stepper、以及跨專案的全域狀態管理。",
    color: "blue",
    icon: "Terminal",
    techStack: [
      { label: "React / Next.js", color: "blue" },
      { label: "Tailwind CSS", color: "cyan" },
      { label: "Zustand", color: "yellow" }
    ],
    bonus: [
      "微互動 (Micro-interactions)",
      "防抖 (Debounce) 儲存機制"
    ],
    assignee: ""
  },
  {
    id: "backend",
    title: "後端工程師 (Backend)",
    battlefield: "設計穩定的 RESTful API、串接第三方 AI 服務 (Gemini/Notion)、處理會員認證與資料庫設計。",
    color: "green",
    icon: "Database",
    techStack: [
      { label: "Node.js / Python", color: "green" },
      { label: "SQL / NoSQL", color: "slate" },
      { label: "JWT", color: "slate" }
    ],
    bonus: [
      "高併發 API 處理經驗",
      "非同步隊列 (Queue) 架構"
    ],
    assignee: ""
  },
  {
    id: "ui",
    title: "UI 設計師 (User Interface)",
    battlefield: "負責 OmniScript 的視覺靈魂。將 Wireframe 轉化為具備 SaaS 商業高級感的高保真 Prototype，並從零打造具備擴充性的 Design System（包含色彩計畫、字體層級與共用元件庫）。",
    color: "pink",
    icon: "Palette",
    techStack: [
      { label: "Figma", color: "pink" },
      { label: "Design System", color: "blue" },
      { label: "Auto Layout", color: "slate" }
    ],
    bonus: [
      "熟練掌握深/淺色模式轉換的設計規範",
      "具備微互動 (Micro-interactions) 與動態視覺設計概念",
      "了解前端切版邏輯，設計出「工程師寫得出來」的畫面"
    ],
    assignee: ""
  },
  {
    id: "ux",
    title: "UX 設計師 (User Experience)",
    battlefield: "負責 OmniScript 的操作大腦。與 PM 密切合作，繪製 9 步工作流的 Wireframe 與 User Flow。解決複雜的「狀態流轉」與「錯誤防呆」問題，確保使用者在生成過程中不迷失。",
    color: "emerald",
    icon: "Waypoints",
    techStack: [
      { label: "Wireframing", color: "emerald" },
      { label: "User Flow", color: "blue" },
      { label: "Information Architecture", color: "slate" }
    ],
    bonus: [
      "具備強烈的 SaaS 產品設計思維，理解多步驟表單的痛點",
      "能設計友善的錯誤狀態 (Error States) 與極端情況",
      "具備可用性測試 (Usability Testing) 概念"
    ],
    assignee: ""
  }
];

const MILESTONES = [
  {
    id: 1,
    status: "done",
    title: "M1: 基石與架構搭建",
    label: "INFRASTRUCTURE",
    goal: "PRD 確認、Figma 完稿、資料庫 Schema 建立、前端 Component 共用庫搭建。",
    condition: "確保前後端底層架構穩固，團隊對技術堆疊與資料流向達成共識。"
  },
  {
    id: 2,
    status: "done",
    title: "M2: 核心工作流串接",
    label: "CORE INTEGRATION",
    goal: "完成 9 步核心 Prompt 的 API 串接與前端狀態連動（完成手動協作模式）。",
    condition: "確保「鏈式記憶」資料傳遞無誤，API 串接穩定不報錯。"
  },
  {
    id: 3,
    status: "in-progress",
    title: "M3: 進階自動化與歸檔",
    label: "AUTOMATION",
    goal: "挑戰高難度的一鍵全自動模式、Notion API 匯出防護機制、完整的 Error Handling。",
    condition: "複雜的非同步邏輯能順暢運行，極端操作下的防呆機制測試通過。"
  },
  {
    id: 4,
    status: "todo",
    title: "M4: 體驗打磨與發表",
    label: "LAUNCH & POLISH",
    goal: "全面 Debug、UI 微互動與載入狀態優化、首頁 Dashboard 完善、製作專題 Demo。",
    condition: "介面達到 SaaS 商業級質感，準備在結訓發表會上驚豔全場。"
  }
];

export default function JoinPage() {
  const [milestones, setMilestones] = useState(MILESTONES);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);
  
  const [roles, setRoles] = useState(INITIAL_ROLES);
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [editRoleForm, setEditRoleForm] = useState({});

  useEffect(() => {
    const savedMilestones = localStorage.getItem('omni_milestones');
    if (savedMilestones) {
      const parsed = JSON.parse(savedMilestones);
      // 自動補齊舊版資料缺少的 status 欄位
      const migrated = parsed.map(m => {
        if (!m.status) {
          const defaultStatus = MILESTONES.find(dm => dm.id === m.id)?.status || 'todo';
          return { ...m, status: defaultStatus };
        }
        return m;
      });
      setMilestones(migrated);
    }
    
    const savedRoles = localStorage.getItem('omni_roles');
    if (savedRoles) {
      setRoles(JSON.parse(savedRoles));
    }
  }, []);

  const handleMilestoneClick = (id) => {
    if (editingId) return; // 編輯中不切換
    // 單擊卡片不再自動變成當前進度，改由編輯模式修改狀態
  };

  const startEdit = (m) => {
    setEditingId(m.id);
    setEditForm(m);
  };

  const handleSave = () => {
    const updated = milestones.map(m => m.id === editingId ? editForm : m);
    setMilestones(updated);
    localStorage.setItem('omni_milestones', JSON.stringify(updated));
    setEditingId(null);
  };

  const startEditRole = (r) => {
    setEditingRoleId(r.id);
    setEditRoleForm(r);
  };

  const handleSaveRole = () => {
    const updated = roles.map(r => r.id === editingRoleId ? editRoleForm : r);
    setRoles(updated);
    localStorage.setItem('omni_roles', JSON.stringify(updated));
    setEditingRoleId(null);
  };

  const getIcon = (iconName) => {
    if (iconName === 'Terminal') return <Terminal className="w-6 h-6" />;
    if (iconName === 'Database') return <Database className="w-6 h-6" />;
    if (iconName === 'Palette') return <Palette className="w-6 h-6" />;
    if (iconName === 'Waypoints') return <Waypoints className="w-6 h-6" />;
    return <PenTool className="w-6 h-6" />;
  };

  const getColorClasses = (color, isActive) => {
    const map = {
      blue: { bg: 'bg-blue-900/30', text: 'text-blue-400', active: 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]' },
      green: { bg: 'bg-green-900/30', text: 'text-green-400', active: 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]' },
      pink: { bg: 'bg-pink-900/30', text: 'text-pink-400', active: 'border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.3)]' },
      emerald: { bg: 'bg-emerald-900/30', text: 'text-emerald-400', active: 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]' },
      cyan: { bg: 'bg-cyan-900/20', text: 'text-cyan-400' },
      yellow: { bg: 'bg-yellow-900/20', text: 'text-yellow-400' },
      slate: { bg: 'bg-slate-800', text: 'text-slate-300' }
    };
    return map[color] || map.slate;
  };

  const handleScrollToForm = () => {
    const element = document.getElementById("join-form");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-indigo-500/30">
      <IdentityModal />
      
      {/* 📍 Section 4: Milestone Roadmap */}
      <section className="py-24 px-6 relative bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">開發時程與專案管理</h2>
            <p className="text-slate-400 max-w-2xl mx-auto mb-8">
              我們捨棄傳統死板的日曆，採用「里程碑解鎖」模式。<br/>團隊進度是由實際的開發品質來決定，而不是為了趕上死線而妥協。
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="/app"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all border border-indigo-500 hover:border-indigo-400 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:-translate-y-1"
              >
                💻 體驗 OmniScript Demo
              </a>
            </div>
            
            <div className="mt-8">
              <button onClick={() => setIsChangelogOpen(true)} className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-400 font-medium text-sm transition-colors border-b border-transparent hover:border-indigo-400 pb-0.5">
                <Sparkles className="w-4 h-4" /> 查看最新更新日誌 (v1.1.1)
              </button>
            </div>
          </div>

          {/* Kanban / Milestone Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 relative">
            {/* 連接線 (Desktop) */}
            <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-slate-800 z-0"></div>

            {milestones.map((m) => {
              const isActive = m.status === 'in-progress';
              const isPast = m.status === 'done';
              const isEditing = editingId === m.id;
              
              return (
                <div 
                  key={m.id}
                  onClick={() => handleMilestoneClick(m.id)}
                  className={`p-6 rounded-2xl relative z-10 transition-all duration-300 ${
                    isActive 
                      ? 'bg-indigo-950/40 border-2 border-indigo-500 transform md:-translate-y-2 shadow-[0_0_30px_rgba(79,70,229,0.2)]' 
                      : 'bg-slate-900 border border-slate-700 opacity-70'
                  }`}
                >
                  {/* Status Badges */}
                  {!isEditing && (
                    <div className="absolute -top-3 left-6 flex gap-2">
                      {m.status === 'todo' && <span className="bg-slate-800 text-slate-400 text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-slate-700">⏳ 待辦</span>}
                      {m.status === 'in-progress' && <span className="bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse shadow-lg shadow-indigo-500/50 flex items-center gap-1"><Rocket className="w-3 h-3" /> 進行中</span>}
                      {m.status === 'done' && <span className="bg-emerald-600/20 text-emerald-500 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-full shadow-lg">✅ 完成</span>}
                    </div>
                  )}
                  
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 mt-2 border-4 border-slate-900 mx-auto lg:mx-0 ${
                    isActive ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.6)]' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isActive ? (
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    ) : isPast ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    ) : (
                      <div className="w-3 h-3 bg-slate-700 rounded-full"></div>
                    )}
                  </div>
                  
                  {isEditing ? (
                    <div className="space-y-3" onClick={e => e.stopPropagation()}>
                      <div>
                        <label className="text-[10px] text-slate-500">狀態</label>
                        <select 
                          value={editForm.status} 
                          onChange={e => setEditForm({...editForm, status: e.target.value})} 
                          className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-sm focus:outline-none focus:border-indigo-500"
                        >
                          <option value="todo">⏳ 待辦</option>
                          <option value="in-progress">🚀 進行中</option>
                          <option value="done">✅ 完成</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500">標題</label>
                        <input value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white text-sm" />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500">英文小標</label>
                        <input value={editForm.label} onChange={e => setEditForm({...editForm, label: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-indigo-300 text-xs" />
                      </div>
                      <div>
                        <label className="text-[10px] text-indigo-400">解鎖目標</label>
                        <textarea rows={2} value={editForm.goal} onChange={e => setEditForm({...editForm, goal: e.target.value})} className="w-full bg-slate-950 border border-indigo-900/50 rounded p-2 text-slate-200 text-sm" />
                      </div>
                      <div>
                        <label className="text-[10px] text-emerald-400">推進條件</label>
                        <textarea rows={2} value={editForm.condition} onChange={e => setEditForm({...editForm, condition: e.target.value})} className="w-full bg-slate-950 border border-emerald-900/50 rounded p-2 text-slate-300 text-xs" />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button onClick={handleSave} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-2 text-sm font-bold transition-colors">儲存修改</button>
                        <button onClick={() => setEditingId(null)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-lg py-2 text-sm transition-colors">取消</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button 
                        onClick={(e) => { e.stopPropagation(); startEdit(m); }}
                        className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-2 rounded-lg transition-colors border border-slate-700 shadow-sm"
                        title="編輯此卡片"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <h3 className="text-lg font-bold text-white mb-1 pr-8">{m.title}</h3>
                      <p className={`text-xs mb-4 font-medium tracking-wider ${isActive ? 'text-indigo-300' : 'text-slate-500'}`}>{m.label}</p>
                      
                      <div className="space-y-3">
                        <div className={`p-3 rounded-lg ${isActive ? 'bg-indigo-900/30 border border-indigo-500/30' : 'bg-slate-800/50'}`}>
                          <div className="text-xs text-indigo-400 mb-1 font-bold">解鎖目標</div>
                          <p className={`text-sm leading-relaxed ${isActive ? 'text-slate-200' : 'text-slate-300'}`}>{m.goal}</p>
                        </div>
                        <div className={`p-3 rounded-lg border-l-2 ${isActive ? 'bg-slate-900/50 border-indigo-500' : 'bg-slate-800/50 border-emerald-500/50'}`}>
                          <div className="text-xs text-emerald-400 mb-1 font-bold">推進條件</div>
                          <p className={`text-xs ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>{m.condition}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* PM Manifesto */}
          <div className="bg-gradient-to-r from-indigo-900/40 to-slate-900 border border-indigo-500/20 p-8 rounded-2xl max-w-4xl mx-auto flex gap-6 items-start shadow-xl">
            <div className="text-5xl text-indigo-500/40 font-serif leading-none pt-2">"</div>
            <div>
              <h4 className="text-indigo-400 font-bold mb-3 text-lg tracking-wide">PM 專案管理宣言</h4>
              <p className="text-slate-300 leading-relaxed text-lg italic">
                我們採用「里程碑導向」的敏捷開發。進度是由團隊實際的開發品質來決定，而不是死板的日曆。卡關了我們就一起解決，穩紮穩打，確保每個人都能在專案中留下扎實的技術足跡！

              </p>
            </div>
          </div>
        </div>
      </section>

      

      {/* 🚀 Section: Activity Feed */}
      <section className="py-12 bg-slate-950 px-6">
        <div className="max-w-4xl mx-auto">
          <ActivityFeed />
        </div>
      </section>

      

      {/* 🎯 Section 1: Value Proposition */}
      <section className="py-24 bg-slate-900 px-6 relative z-10 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">為什麼你該加入這個專題？</h2>
            <p className="text-slate-400">這不是圖書管理系統，這是能為你面試帶來絕對優勢的實戰舞台</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-950/50 border border-slate-800 p-8 rounded-2xl hover:border-indigo-500/50 transition-colors group">
              <div className="w-14 h-14 bg-indigo-900/30 text-indigo-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Rocket className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">告別「玩具型專案」</h3>
              <p className="text-slate-400 leading-relaxed">
                你將接觸到真實業界正在渴求的技術：AI API 串接（Gemini/Suno）、多模態內容生成、以及 SaaS 等級的多租戶狀態管理。
              </p>
            </div>
            
            <div className="bg-slate-950/50 border border-slate-800 p-8 rounded-2xl hover:border-indigo-500/50 transition-colors group">
              <div className="w-14 h-14 bg-emerald-900/30 text-emerald-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <GitMerge className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">體驗正規的敏捷開發</h3>
              <p className="text-slate-400 leading-relaxed">
                由 PM 控管需求規格 (PRD)、UI/UX Guideline 與開發時程。帶你體驗真實的 Sprint 衝刺與版控流程，面試時有說不完的協作故事。
              </p>
            </div>

            <div className="bg-slate-950/50 border border-slate-800 p-8 rounded-2xl hover:border-indigo-500/50 transition-colors group">
              <div className="w-14 h-14 bg-purple-900/30 text-purple-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <LayoutTemplate className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">打造高顏值的技術火力展示</h3>
              <p className="text-slate-400 leading-relaxed">
                你的程式碼不會被醜陋的介面埋沒。我們採用現代極簡風格 (Modern Minimalist)，讓面試官一眼就覺得「這是一個成熟的產品」。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 💡 Section 2: The Product */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2">
            <div className="inline-block px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm font-medium mb-6">
              The Product: OmniScript
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              一個主題不可知的<br/>AI 內容產製引擎
            </h2>
            <p className="text-xl text-slate-400 mb-8 leading-relaxed">
              只要輸入一個靈感，系統會自動跑完 9 道工作流，產出 YouTube 腳本、SEO 標籤、視覺 Prompt 與社群貼文。
            </p>
          </div>
          
          <div className="lg:w-1/2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex gap-6">
              <div className="shrink-0 w-12 h-12 bg-indigo-900/50 text-indigo-400 rounded-lg flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg mb-2">模組 1：鏈式記憶引擎 (Chained Context)</h4>
                <p className="text-slate-400 text-sm">挑戰複雜的前端狀態管理，實作步驟之間的資料連動，前一步驟的產出自動成為下一步驟的 Prompt 背景。</p>
              </div>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex gap-6 ml-0 md:ml-6">
              <div className="shrink-0 w-12 h-12 bg-cyan-900/50 text-cyan-400 rounded-lg flex items-center justify-center">
                <Code2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg mb-2">模組 2：雙軌執行模式 (Dual Execution)</h4>
                <p className="text-slate-400 text-sm">同時開發「手動協作（單步控制）」與「一鍵全自動（非同步隊列 Batch API）」的複雜商業邏輯。</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex gap-6 ml-0 md:ml-12">
              <div className="shrink-0 w-12 h-12 bg-emerald-900/50 text-emerald-400 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg mb-2">模組 3：Notion API 防護寫入</h4>
                <p className="text-slate-400 text-sm">實作大文本切割演算法 (Chunking)，突破 API 限制，完成資料的雲端結構化歸檔。</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🧑‍💻 Section 3: Open Roles */}
      <section className="py-24 bg-slate-900 px-6 border-y border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">招募職缺與技術棧</h2>
            <p className="text-slate-400">不用等到技術完美才敢來，我們一起在專案中變強</p>
          </div>
          
                    <div className="grid md:grid-cols-2 gap-6">
            {roles.map((r) => {
              const isEditing = editingRoleId === r.id;
              const hasAssignee = !!r.assignee;
              const colorConfig = getColorClasses(r.color, hasAssignee);
              
              return (
                <div key={r.id} className={`bg-slate-950 border p-8 rounded-2xl flex flex-col transition-all duration-300 relative ${hasAssignee ? colorConfig.active : 'border-slate-800 hover:border-slate-700'}`}>
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-slate-500 mb-1 block">職位名稱</label>
                        <input value={editRoleForm.title} onChange={e => setEditRoleForm({...editRoleForm, title: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm focus:outline-none focus:border-indigo-500" />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500 mb-1 block">你的戰場 (說明)</label>
                        <textarea rows={3} value={editRoleForm.battlefield} onChange={e => setEditRoleForm({...editRoleForm, battlefield: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-300 text-sm" />
                      </div>
                      <div>
                        <label className="text-xs text-indigo-400 font-bold mb-1 block flex items-center gap-1"><UserCheck className="w-4 h-4" /> 當責 (負責人)</label>
                        <input placeholder="尚未指派..." value={editRoleForm.assignee} onChange={e => setEditRoleForm({...editRoleForm, assignee: e.target.value})} className="w-full bg-indigo-950/30 border border-indigo-500/50 rounded p-2 text-white font-bold focus:outline-none focus:border-indigo-500" />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button onClick={handleSaveRole} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-2 text-sm font-bold transition-colors">儲存修改</button>
                        <button onClick={() => setEditingRoleId(null)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-lg py-2 text-sm transition-colors">取消</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button onClick={() => startEditRole(r)} className="absolute top-6 right-6 text-slate-500 hover:text-white bg-slate-900 hover:bg-slate-800 p-2 rounded-lg transition-colors border border-slate-800 z-10">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <div className="mb-6 flex justify-between items-start">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorConfig.bg} ${colorConfig.text}`}>
                          {getIcon(r.icon)}
                        </div>
                        {hasAssignee ? (
                          <div className={`px-3 py-1 text-sm font-bold rounded-full border shadow-lg flex items-center gap-1.5 ${colorConfig.bg} ${colorConfig.text} border-current/30`}>
                            <UserCheck className="w-4 h-4" /> {r.assignee}
                          </div>
                        ) : (
                          <span className="px-3 py-1 bg-slate-800 text-xs text-slate-400 rounded-full font-medium">徵求 1 名</span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 pr-8">{r.title}</h3>
                      <p className="text-slate-400 text-sm mb-6 flex-1">
                        {r.battlefield}
                      </p>
                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-slate-500 mb-2">技術棧</div>
                          <div className="flex flex-wrap gap-2">
                            {r.techStack.map((tech, idx) => {
                              const tColor = getColorClasses(tech.color);
                              return (
                                <span key={idx} className={`px-2 py-1 text-xs rounded font-medium ${tColor.bg} ${tColor.text}`}>
                                  {tech.label}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500 mb-2">加分項</div>
                          <ul className="text-xs text-slate-400 space-y-1">
                            {r.bonus.map((b, idx) => (
                              <li key={idx} className="flex gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0"/> {b}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      

      

      <ChangelogModal isOpen={isChangelogOpen} onClose={() => setIsChangelogOpen(false)} />

    </div>
  );
}
