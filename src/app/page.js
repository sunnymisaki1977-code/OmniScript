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
  Clock,
  Pencil,
  Palette,
  Waypoints,
  UserCheck,
  Hourglass,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import ChangelogModal from "../components/ChangelogModal";
import IdentityModal from "../components/IdentityModal";
import ActivityFeed from "../components/ActivityFeed";

const INITIAL_ROLES = [
  {
    id: "frontend",
    title: "前端工程師 (Frontend)",
    battlefield:
      "實作高互動性的 SaaS Dashboard、複雜的九步驟 Stepper、以及跨專案的全域狀態管理。",
    color: "blue",
    icon: "Terminal",
    techStack: [
      { label: "React / Next.js", color: "blue" },
      { label: "Tailwind CSS", color: "cyan" },
      { label: "Zustand", color: "yellow" },
    ],
    bonus: ["微互動 (Micro-interactions)", "防抖 (Debounce) 儲存機制"],
    assignee: "林亞欣",
  },
  {
    id: "backend",
    title: "後端工程師 (Backend)",
    battlefield:
      "設計穩定的 RESTful API、串接第三方 AI 服務 (Gemini/Notion)、處理會員認證與資料庫設計。",
    color: "green",
    icon: "Database",
    techStack: [
      { label: "Node.js / Python", color: "green" },
      { label: "SQL / NoSQL", color: "slate" },
      { label: "JWT", color: "slate" },
    ],
    bonus: ["高併發 API 處理經驗", "非同步隊列 (Queue) 架構"],
    assignee: "蘇之苓",
  },
  {
    id: "ui",
    title: "UI 設計師 (User Interface)",
    battlefield:
      "負責 OmniScript 的視覺靈魂。將 Wireframe 轉化為具備 SaaS 商業高級感的高保真 Prototype，並從零打造具備擴充性的 Design System（包含色彩計畫、字體層級與共用元件庫）。",
    color: "pink",
    icon: "Palette",
    techStack: [
      { label: "Figma", color: "pink" },
      { label: "Design System", color: "blue" },
      { label: "Auto Layout", color: "slate" },
    ],
    bonus: [
      "熟練掌握深/淺色模式轉換的設計規範",
      "具備微互動 (Micro-interactions) 與動態視覺設計概念",
      "了解前端切版邏輯，設計出「工程師寫得出來」的畫面",
    ],
    assignee: "王瑞鐘",
  },
  {
    id: "ux",
    title: "UX 設計師 (User Experience)",
    battlefield:
      "負責 OmniScript 的操作大腦。與 PM 密切合作，繪製 9 步工作流的 Wireframe 與 User Flow。解決複雜的「狀態流轉」與「錯誤防呆」問題，確保使用者在生成過程中不迷失。",
    color: "emerald",
    icon: "Waypoints",
    techStack: [
      { label: "Wireframing", color: "emerald" },
      { label: "User Flow", color: "blue" },
      { label: "Information Architecture", color: "slate" },
    ],
    bonus: [
      "具備強烈的 SaaS 產品設計思維，理解多步驟表單的痛點",
      "能設計友善的錯誤狀態 (Error States) 與極端情況",
      "具備可用性測試 (Usability Testing) 概念",
    ],
    assignee: "白采鑫 Jasmine",
  },
];

const MILESTONES = [
  {
    id: 1,
    status: "done",
    title: "M1: 基石與架構搭建",
    label: "INFRASTRUCTURE",
    goal: "PRD 確認、Figma 完稿、資料庫 Schema 建立、前端 Component 共用庫搭建。",
    condition: "確保前後端底層架構穩固，團隊對技術堆疊與資料流向達成共識。",
  },
  {
    id: 2,
    status: "done",
    title: "M2: 核心工作流串接",
    label: "CORE INTEGRATION",
    goal: "完成 9 步核心 Prompt 的 API 串接與前端狀態連動（完成手動協作模式）。",
    condition: "確保「鏈式記憶」資料傳遞無誤，API 串接穩定不報錯。",
  },
  {
    id: 3,
    status: "in-progress",
    title: "M3: 進階自動化與歸檔",
    label: "AUTOMATION",
    goal: "挑戰高難度的一鍵全自動模式、Notion API 匯出防護機制、完整的 Error Handling。",
    condition: "複雜的非同步邏輯能順暢運行，極端操作下的防呆機制測試通過。",
  },
  {
    id: 4,
    status: "todo",
    title: "M4: 體驗打磨與發表",
    label: "LAUNCH & POLISH",
    goal: "全面 Debug、UI 微互動與載入狀態優化、首頁 Dashboard 完善、製作專題 Demo。",
    condition: "介面達到 SaaS 商業級質感，準備在結訓發表會上驚豔全場。",
  },
];

export default function JoinPage() {
  const [milestones, setMilestones] = useState(MILESTONES);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    const savedMilestones = localStorage.getItem("omni_milestones");
    if (savedMilestones) {
      const parsed = JSON.parse(savedMilestones);
      // 自動補齊舊版資料缺少的 status 欄位
      const migrated = parsed.map((m) => {
        if (!m.status) {
          const defaultStatus =
            MILESTONES.find((dm) => dm.id === m.id)?.status || "todo";
          return { ...m, status: defaultStatus };
        }
        return m;
      });
      setMilestones(migrated);
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
    const updated = milestones.map((m) => (m.id === editingId ? editForm : m));
    setMilestones(updated);
    localStorage.setItem("omni_milestones", JSON.stringify(updated));
    setEditingId(null);
  };

  const getIcon = (iconName) => {
    if (iconName === "Terminal") return <Terminal className="w-6 h-6" />;
    if (iconName === "Database") return <Database className="w-6 h-6" />;
    if (iconName === "Palette") return <Palette className="w-6 h-6" />;
    if (iconName === "Waypoints") return <Waypoints className="w-6 h-6" />;
    return <PenTool className="w-6 h-6" />;
  };

  // 角色 / 技術標籤的識別色（深色基底上的柔和色票）
  const getColorClasses = (color, isActive) => {
    const map = {
      blue: {
        bg: "bg-blue-500/10",
        text: "text-blue-300",
        active: "border-blue-500/60 shadow-[0_0_24px_-6px_rgba(59,130,246,0.45)]",
      },
      green: {
        bg: "bg-emerald-500/10",
        text: "text-emerald-300",
        active:
          "border-emerald-500/60 shadow-[0_0_24px_-6px_rgba(16,185,129,0.45)]",
      },
      pink: {
        bg: "bg-pink-500/10",
        text: "text-pink-300",
        active: "border-pink-500/60 shadow-[0_0_24px_-6px_rgba(236,72,153,0.45)]",
      },
      emerald: {
        bg: "bg-accent/10",
        text: "text-accent",
        active:
          "border-accent/60 shadow-[0_0_24px_-6px_rgba(16,185,129,0.45)]",
      },
      cyan: { bg: "bg-cyan-500/10", text: "text-cyan-300" },
      yellow: { bg: "bg-amber-500/10", text: "text-amber-300" },
      slate: { bg: "bg-secondary", text: "text-secondary-foreground" },
    };
    return map[color] || map.slate;
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      <IdentityModal />

      {/* Hero */}
      <header className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-[-10%] h-[420px] w-[640px] -translate-x-1/2 rounded-full bg-primary/20 blur-[140px]"
        />
        <div className="relative max-w-5xl mx-auto px-6 pt-28 pb-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur">
            <Sparkles className="w-4 h-4 text-primary" />
            主題不可知的 AI 內容產製引擎
          </div>

          <h1 className="mt-8 text-balance text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
            從一個靈感，
            <span className="text-gradient-primary">自動產出整套內容</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg md:text-xl text-muted-foreground leading-relaxed">
            OmniScript 透過九道鏈式工作流，將你的點子轉化為 YouTube 腳本、SEO
            標籤、視覺 Prompt 與社群貼文。這是一個能在面試中說滿故事的實戰專題。
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {status === "loading" ? (
              <button
                disabled
                className="group inline-flex items-center gap-2 rounded-full bg-primary/50 px-8 py-4 text-lg font-bold text-primary-foreground transition-all cursor-not-allowed"
              >
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                載入中...
              </button>
            ) : session ? (
              <a
                href="/app"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-bold text-primary-foreground transition-all hover:bg-primary-hover hover:-translate-y-0.5 glow-primary"
              >
                <Terminal className="w-5 h-5" />
                進入工作區
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </a>
            ) : (
              <button
                onClick={() => signIn("google", { callbackUrl: "/app" })}
                className="group inline-flex items-center gap-2 rounded-full bg-white text-slate-900 px-8 py-4 text-lg font-bold transition-all hover:bg-slate-100 hover:-translate-y-0.5 shadow-lg shadow-white/10"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google 帳號登入
              </button>
            )}
            <button
              onClick={() => setIsChangelogOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-6 py-4 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:border-primary/50"
            >
              <Sparkles className="w-4 h-4" /> 更新日誌 v1.1.1
            </button>
          </div>
        </div>
      </header>

      {/* Section 4: Milestone Roadmap */}
      <section className="py-24 px-6 relative bg-card border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              開發時程與專案管理
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
              我們捨棄傳統死板的日曆，採用「里程碑解鎖」模式。團隊進度由實際的開發品質決定，而不是為了趕上死線而妥協。
            </p>
          </div>

          {/* Kanban / Milestone Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 relative">
            {/* 連接線 (Desktop) */}
            <div className="hidden lg:block absolute top-12 left-0 w-full h-px bg-border z-0" />

            {milestones.map((m) => {
              const isActive = m.status === "in-progress";
              const isPast = m.status === "done";
              const isEditing = editingId === m.id;

              return (
                <div
                  key={m.id}
                  onClick={() => handleMilestoneClick(m.id)}
                  className={`p-6 rounded-2xl relative z-10 transition-all duration-300 ${
                    isActive
                      ? "bg-primary/10 border-2 border-primary md:-translate-y-2 glow-primary"
                      : "bg-background border border-border opacity-80 hover:opacity-100"
                  }`}
                >
                  {/* Status Badges */}
                  {!isEditing && (
                    <div className="absolute -top-3 left-6 flex gap-2">
                      {m.status === "todo" && (
                        <span className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-border">
                          <Hourglass className="w-3 h-3" /> 待辦
                        </span>
                      )}
                      {m.status === "in-progress" && (
                        <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full animate-pulse shadow-lg shadow-primary/40 flex items-center gap-1">
                          <Rocket className="w-3 h-3" /> 進行中
                        </span>
                      )}
                      {m.status === "done" && (
                        <span className="inline-flex items-center gap-1 bg-accent/15 text-accent border border-accent/30 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                          <CheckCircle2 className="w-3 h-3" /> 完成
                        </span>
                      )}
                    </div>
                  )}

                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 mt-2 border-4 border-card mx-auto lg:mx-0 ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-[0_0_20px_-2px_var(--primary)]"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {isActive ? (
                      <div className="w-3 h-3 bg-primary-foreground rounded-full" />
                    ) : isPast ? (
                      <CheckCircle2 className="w-6 h-6 text-accent" />
                    ) : (
                      <div className="w-3 h-3 bg-muted-foreground/50 rounded-full" />
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
                      <div>
                        <label className="text-[10px] text-muted-foreground">狀態</label>
                        <select
                          value={editForm.status}
                          onChange={(e) =>
                            setEditForm({ ...editForm, status: e.target.value })
                          }
                          className="w-full bg-background border border-input rounded-lg p-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                          <option value="todo">待辦</option>
                          <option value="in-progress">進行中</option>
                          <option value="done">完成</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground">標題</label>
                        <input
                          value={editForm.title}
                          onChange={(e) =>
                            setEditForm({ ...editForm, title: e.target.value })
                          }
                          className="w-full bg-background border border-input rounded-lg p-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground">英文小標</label>
                        <input
                          value={editForm.label}
                          onChange={(e) =>
                            setEditForm({ ...editForm, label: e.target.value })
                          }
                          className="w-full bg-background border border-input rounded-lg p-2 text-primary text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-primary">解鎖目標</label>
                        <textarea
                          rows={2}
                          value={editForm.goal}
                          onChange={(e) =>
                            setEditForm({ ...editForm, goal: e.target.value })
                          }
                          className="w-full bg-background border border-primary/30 rounded-lg p-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-accent">推進條件</label>
                        <textarea
                          rows={2}
                          value={editForm.condition}
                          onChange={(e) =>
                            setEditForm({ ...editForm, condition: e.target.value })
                          }
                          className="w-full bg-background border border-accent/30 rounded-lg p-2 text-muted-foreground text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={handleSave}
                          className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground rounded-lg py-2 text-sm font-bold transition-colors"
                        >
                          儲存修改
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="flex-1 bg-secondary hover:bg-muted text-secondary-foreground border border-border rounded-lg py-2 text-sm transition-colors"
                        >
                          取消
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEdit(m);
                        }}
                        className="absolute top-4 right-4 text-muted-foreground hover:text-foreground bg-secondary hover:bg-muted p-2 rounded-lg transition-colors border border-border"
                        title="編輯此卡片"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <h3 className="text-lg font-bold text-foreground mb-1 pr-8">
                        {m.title}
                      </h3>
                      <p
                        className={`text-xs mb-4 font-medium tracking-wider ${
                          isActive ? "text-primary" : "text-muted-foreground"
                        }`}
                      >
                        {m.label}
                      </p>

                      <div className="space-y-3">
                        <div
                          className={`p-3 rounded-lg ${
                            isActive
                              ? "bg-primary/10 border border-primary/30"
                              : "bg-secondary/50"
                          }`}
                        >
                          <div className="text-xs text-primary mb-1 font-bold">
                            解鎖目標
                          </div>
                          <p className="text-sm leading-relaxed text-foreground/90">
                            {m.goal}
                          </p>
                        </div>
                        <div
                          className={`p-3 rounded-lg border-l-2 ${
                            isActive
                              ? "bg-background/50 border-primary"
                              : "bg-secondary/50 border-accent/50"
                          }`}
                        >
                          <div className="text-xs text-accent mb-1 font-bold">
                            推進條件
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {m.condition}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* PM Manifesto */}
          <div className="bg-primary/5 border border-primary/20 p-8 rounded-2xl max-w-4xl mx-auto flex gap-6 items-start shadow-xl">
            <div className="text-5xl text-primary/40 font-serif leading-none pt-2">
              {'"'}
            </div>
            <div>
              <h4 className="text-primary font-bold mb-3 text-lg tracking-wide">
                PM 專案管理宣言
              </h4>
              <p className="text-foreground/90 leading-relaxed text-lg italic">
                我們採用「里程碑導向」的敏捷開發。進度是由團隊實際的開發品質來決定，而不是死板的日曆。卡關了我們就一起解決，穩紮穩打，確保每個人都能在專案中留下扎實的技術足跡！
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Activity Feed */}
      <section className="py-12 bg-background px-6">
        <div className="max-w-4xl mx-auto">
          <ActivityFeed />
        </div>
      </section>

      {/* Section 1: Value Proposition */}
      <section className="py-24 bg-card px-6 relative z-10 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              為什麼你該加入這個專題？
            </h2>
            <p className="text-muted-foreground">
              這不是圖書管理系統，這是能為你面試帶來絕對優勢的實戰舞台
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background border border-border p-8 rounded-2xl hover:border-primary/50 transition-colors group">
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Rocket className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                告別「玩具型專案」
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                你將接觸到真實業界正在渴求的技術：AI API
                串接（Gemini/Suno）、多模態內容生成、以及 SaaS
                等級的多租戶狀態管理。
              </p>
            </div>

            <div className="bg-background border border-border p-8 rounded-2xl hover:border-primary/50 transition-colors group">
              <div className="w-14 h-14 bg-accent/10 text-accent rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <GitMerge className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                體驗正規的敏捷開發
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                由 PM 控管需求規格 (PRD)、UI/UX Guideline
                與開發時程。帶你體驗真實的 Sprint
                衝刺與版控流程，面試時有說不完的協作故事。
              </p>
            </div>

            <div className="bg-background border border-border p-8 rounded-2xl hover:border-primary/50 transition-colors group">
              <div className="w-14 h-14 bg-accent-alt/10 text-accent-alt rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <LayoutTemplate className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                打造高顏值的技術火力展示
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                你的程式碼不會被醜陋的介面埋沒。我們採用現代極簡風格 (Modern
                Minimalist)，讓面試官一眼就覺得「這是一個成熟的產品」。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: The Product */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2">
            <div className="inline-block px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium mb-6">
              The Product: OmniScript
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight text-balance">
              一個主題不可知的
              <br />
              AI 內容產製引擎
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed text-pretty">
              只要輸入一個靈感，系統會自動跑完 9 道工作流，產出 YouTube
              腳本、SEO 標籤、視覺 Prompt 與社群貼文。
            </p>
          </div>

          <div className="lg:w-1/2 space-y-6">
            <div className="bg-card border border-border p-6 rounded-2xl flex gap-6">
              <div className="shrink-0 w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-foreground font-bold text-lg mb-2">
                  模組 1：鏈式記憶引擎 (Chained Context)
                </h4>
                <p className="text-muted-foreground text-sm">
                  挑戰複雜的前端狀態管理，實作步驟之間的資料連動，前一步驟的產出自動成為下一步驟的
                  Prompt 背景。
                </p>
              </div>
            </div>

            <div className="bg-card border border-border p-6 rounded-2xl flex gap-6 ml-0 md:ml-6">
              <div className="shrink-0 w-12 h-12 bg-accent-alt/10 text-accent-alt rounded-lg flex items-center justify-center">
                <Code2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-foreground font-bold text-lg mb-2">
                  模組 2：雙軌執行模式 (Dual Execution)
                </h4>
                <p className="text-muted-foreground text-sm">
                  同時開發「手動協作（單步控制）」與「一鍵全自動（非同步隊列 Batch
                  API）」的複雜商業邏輯。
                </p>
              </div>
            </div>

            <div className="bg-card border border-border p-6 rounded-2xl flex gap-6 ml-0 md:ml-12">
              <div className="shrink-0 w-12 h-12 bg-accent/10 text-accent rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-foreground font-bold text-lg mb-2">
                  模組 3：Notion API 防護寫入
                </h4>
                <p className="text-muted-foreground text-sm">
                  實作大文本切割演算法 (Chunking)，突破 API
                  限制，完成資料的雲端結構化歸檔。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Open Roles */}
      <section className="py-24 bg-card px-6 border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              招募職缺與技術棧
            </h2>
            <p className="text-muted-foreground">
              不用等到技術完美才敢來，我們一起在專案中變強
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {INITIAL_ROLES.map((r) => {
              const hasAssignee = !!r.assignee;
              const colorConfig = getColorClasses(r.color, hasAssignee);

              return (
                <div
                  key={r.id}
                  className={`bg-background border p-8 rounded-2xl flex flex-col transition-all duration-300 relative ${
                    hasAssignee
                      ? colorConfig.active
                      : "border-border hover:border-muted-foreground/40"
                  }`}
                >
                  <div className="mb-6 flex justify-between items-start">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorConfig.bg} ${colorConfig.text}`}
                    >
                      {getIcon(r.icon)}
                    </div>
                    {hasAssignee ? (
                      <div
                        className={`px-3 py-1 text-sm font-bold rounded-full border border-current/30 shadow-lg flex items-center gap-1.5 ${colorConfig.bg} ${colorConfig.text}`}
                      >
                        <UserCheck className="w-4 h-4" /> {r.assignee}
                      </div>
                    ) : (
                      <span className="px-3 py-1 bg-secondary text-xs text-muted-foreground rounded-full font-medium">
                        徵求 1 名
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2 pr-8">
                    {r.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6 flex-1">
                    {r.battlefield}
                  </p>
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs text-muted-foreground mb-2">
                        技術棧
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {r.techStack.map((tech, idx) => {
                          const tColor = getColorClasses(tech.color);
                          return (
                            <span
                              key={idx}
                              className={`px-2 py-1 text-xs rounded font-medium ${tColor.bg} ${tColor.text}`}
                            >
                              {tech.label}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-2">
                        加分項
                      </div>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {r.bonus.map((b, idx) => (
                          <li key={idx} className="flex gap-2">
                            <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />{" "}
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <ChangelogModal
        isOpen={isChangelogOpen}
        onClose={() => setIsChangelogOpen(false)}
      />
    </div>
  );
}
