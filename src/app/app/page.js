"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Sidebar from "@/components/Sidebar";
import EditorWorkspace from "@/components/EditorWorkspace";
import VisualDispatchCenter from "@/components/VisualDispatchCenter";
import SunoMusicCenter from "@/components/SunoMusicCenter";
import NotebookLMCenter from "@/components/NotebookLMCenter";
import ContextualInspector from "@/components/ContextualInspector";
import AutoPipelineMatrix from "@/components/AutoPipelineMatrix";
import { WORKFLOW_STEPS } from "@/utils/promptConfigs";
import { logActivity } from "../../utils/activityLogger";
import IdentityModal from "../../components/IdentityModal";
import { Rocket, FileText, Play, Hand, Zap, User, Clock, ChevronRight, MoreVertical, Sun, Moon, KeyRound, X, Cloud, Palette, Music, BookOpen, Sparkles } from "lucide-react";
import ChangelogModal from "../../components/ChangelogModal";

const INSPIRATION_PILLS = [
  { icon: "💡", label: "隨機來點靈感", text: "未來十年的 AI 發展趨勢與職場衝擊" },
  { icon: "📈", label: "科技趨勢解說", text: "區塊鏈與 Web3 到底在紅什麼？給新手的白話文指南" },
  { icon: "☕", label: "質感生活 Vlog", text: "一個自由工作者的週末早晨：找回生活的主導權" },
];

export default function Home() {
  const { data: session } = useSession();
  const [isMounted, setIsMounted] = useState(false);
  
  // Project State
  const [projectId, setProjectId] = useState(null);
  const [theme, setTheme] = useState("");
  const [topTheme, setTopTheme] = useState("");
  const [currentStep, setCurrentStep] = useState(0); 
  const [stepData, setStepData] = useState({});
  const [completedSteps, setCompletedSteps] = useState([]);
  const [archivedUrl, setArchivedUrl] = useState(null);
  
  // App State
  const [projects, setProjects] = useState([]);
  const [teamProjects, setTeamProjects] = useState([]);
  const [isFetchingTeam, setIsFetchingTeam] = useState(false);
  const [isRefCollapsed, setIsRefCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("saved");
  const [notionStatus, setNotionStatus] = useState(null);
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);

  const [isDark, setIsDark] = useState(false);
  
  const [customApiKey, setCustomApiKey] = useState("");
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);
  const [activeInputMode, setActiveInputMode] = useState(null);
  const [activeTab, setActiveTab] = useState("planning");
  const [activeSubTab, setActiveSubTab] = useState(null);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'planning') setActiveSubTab(null);
    else if (tab === 'dispatch') setActiveSubTab('step6');
    else if (tab === 'suno') setActiveSubTab('step8');
    else if (tab === 'notebooklm') setActiveSubTab('step2');
  };
  const [workspaceMode, setWorkspaceMode] = useState("manual");
  const [logs, setLogs] = useState([
    { time: new Date().toLocaleTimeString('en-US', { hour12: false }), text: "[System] OmniScript OS 初始化完畢。", type: "info" }
  ]);
  const [aiStatus, setAiStatus] = useState("pro");

  // Fetch Team Projects from Notion on mount
  useEffect(() => {
    const fetchTeamProjects = async () => {
      setIsFetchingTeam(true);
      try {
        const res = await fetch("/api/notion/projects", { cache: 'no-store' });
        const data = await res.json();
        if (data.success && data.projects) {
          setTeamProjects(data.projects);
        }
      } catch (err) {
        console.error("Failed to fetch team projects", err);
      } finally {
        setIsFetchingTeam(false);
      }
    };
    fetchTeamProjects();
  }, []);
  
  // 初始化載入 LocalStorage 與主題
  useEffect(() => {
    setIsMounted(true);
    
    // 初始化主題
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
    try {
      const savedApiKey = localStorage.getItem("omniscript_api_key");
      if (savedApiKey) setCustomApiKey(savedApiKey);
      // 遷移舊版資料或載入新版專案列表
      let savedProjects = [];
      const projectsRaw = localStorage.getItem("omniscript_projects");
      
      if (projectsRaw) {
        savedProjects = JSON.parse(projectsRaw);
      } else {
        // 嘗試相容舊版單一狀態
        const oldState = localStorage.getItem("omniscript_state");
        if (oldState) {
          const parsed = JSON.parse(oldState);
          if (parsed.theme) {
            const migratedProject = {
              id: Date.now().toString(),
              theme: parsed.theme,
              currentStep: parsed.currentStep || 0,
              stepData: parsed.stepData || {},
              completedSteps: parsed.completedSteps || [],
              updatedAt: Date.now(),
              mode: "manual"
            };
            savedProjects = [migratedProject];
            localStorage.setItem("omniscript_projects", JSON.stringify(savedProjects));
            // 移除舊版
            localStorage.removeItem("omniscript_state");
          }
        }
      }
      
      // 根據 updatedAt 排序
      savedProjects.sort((a, b) => b.updatedAt - a.updatedAt);
      setProjects(savedProjects);

      // 檢查是否有活躍專案
      const activeId = localStorage.getItem("omniscript_active_project");
      if (activeId) {
        const activeProj = savedProjects.find(p => p.id === activeId);
        if (activeProj && activeProj.currentStep > 0) {
          setProjectId(activeProj.id);
          setTheme(activeProj.theme);
          setCurrentStep(activeProj.currentStep);
          setStepData(activeProj.stepData);
          setCompletedSteps(activeProj.completedSteps);
          setArchivedUrl(activeProj.archivedUrl || null);
        }
      }
    } catch (e) {
      console.error("Failed to load state from localStorage:", e);
    }
  }, []);

  // 防抖自動儲存至 Projects 陣列
  useEffect(() => {
    if (!isMounted || currentStep === 0 || !projectId) return;
    
    setSaveStatus("saving");
    const timeoutId = setTimeout(() => {
      try {
        setProjects(prev => {
          const updated = [...prev];
          const idx = updated.findIndex(p => p.id === projectId);
          const projectData = {
            id: projectId,
            theme,
            currentStep,
            stepData,
            completedSteps,
            archivedUrl,
            updatedAt: Date.now(),
            mode: isAutoRunning ? "auto" : "manual"
          };
          
          if (idx >= 0) {
            updated[idx] = projectData;
          } else {
            updated.unshift(projectData);
          }
          
          localStorage.setItem("omniscript_projects", JSON.stringify(updated));
          return updated;
        });
        setSaveStatus("saved");
      } catch (e) {
        console.error("Failed to save state:", e);
        setSaveStatus("error");
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [theme, currentStep, stepData, completedSteps, isMounted, projectId, isAutoRunning]);

  // 切換主題
  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // 建立新專案並設定為活躍
  const createNewProject = () => {
    const newId = Date.now().toString();
    setProjectId(newId);
    logActivity("建立了一個新專案");
    localStorage.setItem("omniscript_active_project", newId);
    return newId;
  };

  // 載入歷史專案
  const loadProject = (proj) => {
    setProjectId(proj.id);
    setTheme(proj.theme);
    setStepData(proj.stepData);
    setCompletedSteps(proj.completedSteps);
    setCurrentStep(proj.currentStep > 0 ? proj.currentStep : 1);
    setArchivedUrl(proj.archivedUrl || null);
    localStorage.setItem("omniscript_active_project", proj.id);
  };

  const loadNotionProject = async (proj) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/notion/page/${proj.id}?t=` + Date.now(), { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setProjectId(proj.id);
        setTheme(data.theme || proj.theme);
        setStepData(data.stepData || {});
        // Mock completed steps based on populated data
        const completed = Object.keys(data.stepData || {})
          .map(k => parseInt(k.replace('step', '')))
          .filter(n => !isNaN(n));
        setCompletedSteps(completed);
        setCurrentStep(1);
        setArchivedUrl(proj.url); // This will lock the save button
        setSaveStatus("saved");
      } else {
        alert("讀取專案失敗: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("讀取專案發生錯誤");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("確定要離開此專案並回到首頁嗎？")) {
      localStorage.removeItem("omniscript_active_project");
      setProjectId(null);
      setTheme("");
      setCurrentStep(0);
      setStepData({});
      setCompletedSteps([]);
      setIsAutoRunning(false);
      setNotionStatus(null);
      setArchivedUrl(null);
      setActiveTab('planning');
      
      // 重新整理 Projects 陣列
      const projectsRaw = localStorage.getItem("omniscript_projects");
      if (projectsRaw) {
        const parsed = JSON.parse(projectsRaw);
        parsed.sort((a, b) => b.updatedAt - a.updatedAt);
        setProjects(parsed);
      }
    }
  };

  // API 呼叫區塊
  const generateContent = async (stepId, context) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-gemini-api-key": customApiKey || ""
        },
        body: JSON.stringify({ stepId, context }),
      });
      
      const modelUsed = res.headers.get("x-fallback-model") || "pro";
      setAiStatus(modelUsed);
      setLogs(prev => [...prev, { time: new Date().toLocaleTimeString('en-US', { hour12: false }), text: `[API] Step ${stepId} generated using ${modelUsed === 'pro' ? 'Gemini 1.5 Pro' : modelUsed === 'flash' ? 'Flash' : 'Flash-Lite'}`, type: "success" }]);

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      
      setStepData((prev) => ({ ...prev, [`step${stepId}`]: data.result }));
      logActivity(`執行了 AI 智能產製 (Step ${stepId})`);
      return data.result;
    } catch (error) {
      alert("生成失敗: " + error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const exportToNotion = async (contextOverride) => {
    setIsLoading(true);
    try {
      const payloadContext = contextOverride || { theme, ...stepData };
      const identityStr = localStorage.getItem("omni_identity");
      const identity = identityStr ? JSON.parse(identityStr) : null;
      const creatorName = identity ? `${identity.role} ${identity.name}` : "未知使用者";

      const res = await fetch("/api/notion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context: payloadContext, creatorName }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.details || data.error || "Export failed");
      }
      
      setNotionStatus(data.url);
      setArchivedUrl(data.url);
      if (!isAutoRunning) alert("成功歸檔至 Notion!");
      logActivity("已將專案歸檔至 Notion");
      window.open(data.url, '_blank');
    } catch (error) {
      alert("歸檔失敗: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartManual = () => {
    if (!theme.trim()) return;
    createNewProject();
    setCurrentStep(1);
    generateContent(1, { theme });
  };

  const handleStartAuto = async (forcedTheme) => {
    const activeTheme = forcedTheme && typeof forcedTheme === 'string' ? forcedTheme : theme;
    if (!activeTheme.trim()) return;
    
    if (forcedTheme && typeof forcedTheme === 'string') setTheme(forcedTheme);

    setIsAutoRunning(true);
    setWorkspaceMode('auto');
    createNewProject();
    setStepData({});
    setCompletedSteps([]);
    setLogs(prev => [...prev, { time: new Date().toLocaleTimeString('en-US', { hour12: false }), text: `[System] Starting Auto Pipeline for: ${activeTheme}`, type: "info" }]);
    
    let currentContext = { theme: activeTheme };
    let currentCompleted = [];
    
    try {
      for (let i = 1; i <= 9; i++) {
        setCurrentStep(i); // 讓左側選單與畫面跟著移動
        
        // 使用現有的 generateContent 單步生成函數
        const result = await generateContent(i, currentContext);
        
        // 同步最新的 Context，供下一步參考
        currentContext = { ...currentContext, [`step${i}`]: result };
        
        // 標記此步驟已完成
        currentCompleted.push(i);
        setCompletedSteps([...currentCompleted]);
        
        // 稍作停頓讓畫面有切換的呼吸感
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      
      setCurrentStep(9);
      await exportToNotion(currentContext);
      
    } catch (error) {
      console.error("自動生成中斷:", error);
      alert("自動生成意外中斷！但不用擔心，已經為您保留了中斷前生成的所有卡片資料，您可以點選左側步驟查看或重新生成。");
    } finally {
      setIsAutoRunning(false);
      setIsLoading(false);
    }
  };

  const handleTopStartAuto = () => {
    if (!topTheme.trim()) return;
    if (currentStep > 0) {
      if (!window.confirm("這將會放棄當前進度並開啟全新主題，確定嗎？")) {
        return;
      }
    }
    const newTheme = topTheme;
    setTopTheme("");
    setActiveTab('planning');
    handleStartAuto(newTheme);
  };

  const handleResumeAuto = async () => {
    if (!theme.trim() || currentStep === 0) return;
    
    setIsAutoRunning(true);
    let currentContext = { theme, ...stepData };
    let currentCompleted = [...completedSteps];
    
    try {
      for (let i = currentStep; i <= 9; i++) {
        setCurrentStep(i);
        
        // Only generate if we are on the current step, or if it's the following steps
        // This ensures we start generating right from where they clicked "接續自動生成"
        const result = await generateContent(i, currentContext);
        
        currentContext = { ...currentContext, [`step${i}`]: result };
        if (!currentCompleted.includes(i)) {
          currentCompleted.push(i);
          setCompletedSteps([...currentCompleted]);
        }
        
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      
      setCurrentStep(9);
      await exportToNotion(currentContext);
      
    } catch (error) {
      console.error("自動接續中斷:", error);
      alert("自動接續意外中斷！但不用擔心，已經為您保留了中斷前生成的所有卡片資料。");
    } finally {
      setIsAutoRunning(false);
      setIsLoading(false);
    }
  };


  const handleNextStep = () => {
    if (currentStep === 9) {
      exportToNotion();
      return;
    }
    const nextStepId = currentStep + 1;
    setCompletedSteps((prev) => {
      if (!prev.includes(currentStep)) return [...prev, currentStep].sort((a, b) => a - b);
      return prev;
    });
    setCurrentStep(nextStepId);
    if (!stepData[`step${nextStepId}`]) {
      const contextForNext = { theme, ...stepData };
      generateContent(nextStepId, contextForNext);
    }
  };

  const handleRegenerate = () => {
    const contextForCurrent = { theme, ...stepData };
    generateContent(currentStep, contextForCurrent);
  };

  const currentStepConfig = WORKFLOW_STEPS.find((s) => s.id === currentStep);

  const renderApiModal = () => {
    if (!isApiKeyModalOpen) return null;
    return (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-indigo-500" /> Gemini API 金鑰管理
            </h3>
            <button onClick={() => setIsApiKeyModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 space-y-4 text-left">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">自訂 Gemini API Key</label>
              <input 
                type="password" 
                value={customApiKey}
                onChange={(e) => setCustomApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                您的金鑰僅會安全地儲存在本地瀏覽器中，不會上傳至任何伺服器。若留空，將使用系統預設金鑰。
              </p>
            </div>
            <button 
              onClick={() => {
                localStorage.setItem("omniscript_api_key", customApiKey);
                setIsApiKeyModalOpen(false);
              }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl transition-colors shadow-sm"
            >
              儲存設定
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 防止伺服器端渲染與客戶端不一致
  if (!isMounted) return <div className="h-screen bg-slate-50 dark:bg-slate-900" />;

  // -----------------------------------------------------
  // Step 0: Dashboard
  // -----------------------------------------------------
    const renderDashboardHero = () => (
    <div className="w-full h-full overflow-y-auto">
      <div className="flex-1 max-w-4xl w-full mx-auto p-6 pt-12 animate-in fade-in slide-in-from-bottom-4">

          
          {/* Central Card */}
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 md:p-12 text-center mb-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-cyan-400"></div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
              今天想創作什麼？
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-lg mx-auto">
              輸入你想探討的主題，AI 將為你生成從研究、長短影音腳本到社群貼文的全域企劃。
            </p>
            
            <div className="max-w-2xl mx-auto space-y-4">
              <input
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="例如：日本京阪神五日遊攻略"
                className="w-full px-6 py-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-lg text-slate-900 dark:text-white placeholder:text-slate-400"
                onKeyDown={(e) => e.key === "Enter" && handleStartAuto()}
              />
              
              <div className="grid grid-cols-1 gap-3 pt-4 min-h-[88px]">
                {activeInputMode === 'auto' ? (
                  <div className="flex flex-col justify-center gap-2 p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800/50 rounded-xl transition-all animate-in fade-in zoom-in-95">
                    <input 
                      type="password"
                      placeholder="請輸入 Gemini API Key..."
                      value={customApiKey}
                      onChange={e => setCustomApiKey(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white placeholder:text-slate-400"
                      autoFocus
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          localStorage.setItem("omniscript_api_key", customApiKey);
                          setActiveInputMode(null);
                          handleStartAuto();
                        }
                      }}
                    />
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          localStorage.setItem("omniscript_api_key", customApiKey);
                          setActiveInputMode(null);
                          handleStartAuto();
                        }} 
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 rounded-lg transition-colors shadow-sm shadow-indigo-500/20"
                      >
                        確認並開始
                      </button>
                      <button onClick={() => setActiveInputMode(null)} className="px-3 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 border border-indigo-200 dark:border-indigo-700/50 text-indigo-600 dark:text-indigo-400 text-xs rounded-lg transition-colors">
                        取消
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      if (!theme.trim()) return;
                      setActiveInputMode('auto');
                    }}
                    disabled={!theme.trim() || isAutoRunning}
                    className="group flex flex-col items-center justify-center gap-1.5 px-4 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white rounded-xl transition-all shadow-md shadow-indigo-200 dark:shadow-none hover:-translate-y-0.5 h-full"
                  >
                    <div className="flex items-center gap-2">
                      {isAutoRunning ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                      <span className="text-sm font-bold">一鍵全自動模式</span>
                    </div>
                    <span className="text-xs text-indigo-200">單次呼叫，自動化處理所有步驟與歸檔</span>
                  </button>
                )}
              </div>
            </div>

            {/* Notion Import Dropdown */}
            <div className="mt-12 bg-white dark:bg-slate-800/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4">
              <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold">
                  <Cloud className="w-5 h-5 text-sky-500" />
                  <span>從 Notion 載入已歸檔專案</span>
                </div>
                
                <div className="w-full max-w-md relative">
                  {isFetchingTeam ? (
                    <div className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-500 flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-sky-200 border-t-sky-500 rounded-full animate-spin"></div>
                      正在同步 Notion 資料...
                    </div>
                  ) : (
                    <select
                      onChange={(e) => {
                        const proj = teamProjects.find(p => p.id === e.target.value);
                        if (proj) loadNotionProject(proj);
                      }}
                      disabled={isLoading || teamProjects.length === 0}
                      className="w-full appearance-none bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:opacity-50 cursor-pointer"
                      defaultValue=""
                    >
                      <option value="" disabled>-- 點擊選擇團隊專案 --</option>
                      {teamProjects.map(proj => (
                        <option key={proj.id} value={proj.id}>
                          {proj.theme} (歸檔於 {new Date(proj.updatedAt).toLocaleDateString()})
                        </option>
                      ))}
                    </select>
                  )}
                  {/* Custom Arrow */}
                  {!isFetchingTeam && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  )}
                </div>
                
                {teamProjects.length === 0 && !isFetchingTeam && (
                  <p className="text-xs text-slate-500">目前尚無團隊歸檔專案</p>
                )}
              </div>
            </div>

            {/* Inspiration Pills */}
            <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800/60">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">缺乏靈感嗎？</p>
              <div className="flex flex-wrap justify-center gap-2">
                {INSPIRATION_PILLS.map((pill, idx) => (
                  <button
                    key={idx}
                    onClick={() => setTheme(pill.text)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-full transition-colors"
                  >
                    <span>{pill.icon}</span>
                    <span>{pill.label}</span>
                  </button>
                ))}
              </div>
            </div>


          {/* Team Projects (Notion) */}
          <div className="mt-12 mb-20 animate-in fade-in slide-in-from-bottom-4" style={{animationDelay: "100ms"}}>
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Cloud className="w-5 h-5 text-sky-500" />
                團隊近期專案 (來自 Notion)
              </h2>
              {isFetchingTeam ? (
                <span className="text-xs font-medium px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full border-2 border-slate-300 border-t-sky-500 animate-spin"></div>
                  同步中...
                </span>
              ) : (
                <span className="text-xs font-medium px-2.5 py-1 bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 rounded-full">
                  共 {teamProjects.length} 個
                </span>
              )}
            </div>
            
            <div className="grid gap-3">
              {teamProjects.map(proj => (
                <button
                  key={proj.id}
                  onClick={() => loadNotionProject(proj)}
                  disabled={isLoading}
                  className="group flex items-center justify-between p-4 bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl transition-all text-left disabled:opacity-50"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate mb-1 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      {proj.theme}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Cloud className="w-3 h-3" /> 雲端讀取
                      </span>
                      <span>•</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                        已歸檔
                      </span>
                      <span>•</span>
                      <span>{new Date(proj.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 group-hover:text-sky-500 group-hover:bg-sky-50 dark:group-hover:bg-sky-900/30 transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              ))}
              
              {teamProjects.length === 0 && !isFetchingTeam && (
                <div className="text-center py-8 text-sm text-slate-500 bg-white/50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                  目前尚無團隊歸檔專案
                </div>
              )}
            </div>
          </div>

          </div>
        </div>
    </div>
  );


  // -----------------------------------------------------
  // Step 1~9: Workspace
  // -----------------------------------------------------
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#0a0f1d]">
      <IdentityModal />
      {renderApiModal()}

      {/* 1. Left Navigation Rail */}
      <Sidebar
        steps={WORKFLOW_STEPS}
        currentStep={currentStep}
        theme={theme}
        completedSteps={completedSteps}
        onStepClick={(id) => {
          if (!isAutoRunning && workspaceMode === 'manual') setCurrentStep(id);
        }}
        onReset={handleReset}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        activeSubTab={activeSubTab}
        setActiveSubTab={setActiveSubTab}
        isDark={isDark}
        toggleTheme={toggleTheme}
      />

      {/* 2. Middle Main Stage */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-[#0f172a] relative z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.2)]">
        {/* Top Header */}
        <header className="h-14 shrink-0 px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            {/* Top Bar Quick Start */}
            <div className="flex items-center gap-2 w-full max-w-xl">
              <input
                type="text"
                placeholder="例如：日本寺廟抽籤攻略"
                value={topTheme}
                onChange={(e) => setTopTheme(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleTopStartAuto()}
                disabled={isAutoRunning}
                className="flex-1 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              />
              <button
                onClick={handleTopStartAuto}
                disabled={isAutoRunning || !topTheme.trim()}
                className="flex items-center gap-2 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg text-sm font-semibold transition-all shadow-sm"
              >
                <Zap className="w-4 h-4" />
                <span className="hidden sm:inline">一鍵全自動模式</span>
              </button>
            </div>
          </div>

          {/* Right Top Header Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-500 rounded-full font-medium text-sm border border-amber-200 dark:border-amber-800/30">
              <Zap className="w-4 h-4" />
              <span>125 點額度</span>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setIsAvatarOpen(!isAvatarOpen)}
                className={`w-9 h-9 rounded-full flex items-center justify-center hover:ring-2 transition-all ${
                  session?.user?.image 
                    ? "ring-indigo-500/30" 
                    : "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 ring-indigo-500/30"
                }`}
              >
                {session?.user?.image ? (
                  <img src={session.user.image} alt="Avatar" className="w-9 h-9 rounded-full object-cover" />
                ) : (
                  <User className="w-5 h-5" />
                )}
              </button>
              {isAvatarOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden py-1 z-50">
                  <button onClick={() => setIsApiKeyModalOpen(true)} className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2">
                    <KeyRound className="w-4 h-4" /> 設定 Gemini API
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Middle Stage Content */}
        <div className="flex-1 overflow-hidden relative">
          {currentStep === 0 ? renderDashboardHero() : (
            <>
              {activeTab === 'planning' ? (
                workspaceMode === 'auto' ? (
                  <AutoPipelineMatrix 
                    theme={theme}
                    activeStep={currentStep}
                    completedSteps={completedSteps}
                    isGenerating={isAutoRunning}
                    onReset={handleReset}
                    onSwitchToManual={(stepId) => {
                      setCurrentStep(stepId);
                      setWorkspaceMode('manual');
                    }}
                  />
                ) : (
                  currentStepConfig && (
                    <EditorWorkspace
                      step={currentStepConfig}
                      value={stepData[`step${currentStep}`] || ""}
                      onChange={(val) => setStepData({ ...stepData, [`step${currentStep}`]: val })}
                      isLoading={isLoading}
                      onSaveNext={() => handleNextStep()}
                      isLastStep={currentStep === 9}
                      saveStatus={saveStatus}
                      isAutoRunning={isAutoRunning}
                      isArchived={archivedUrl}
                      teamProjects={teamProjects}
                      isFetchingTeam={isFetchingTeam}
                      loadNotionProject={loadNotionProject}
                      activeProjectId={projectId}
                      contextData={{ theme, ...stepData }}
                      onResumeAuto={handleResumeAuto}
                    />
                  )
                )
              ) : activeTab === 'dispatch' ? (
                <VisualDispatchCenter 
                  stepData={stepData} 
                  teamProjects={teamProjects} 
                  isFetchingTeam={isFetchingTeam} 
                  loadNotionProject={loadNotionProject} 
                  isLoading={isLoading}
                  theme={theme}
                  activeProjectId={projectId}
                  activeSubTab={activeSubTab}
                />
              ) : activeTab === 'suno' ? (
                <SunoMusicCenter 
                  stepData={stepData} 
                  teamProjects={teamProjects} 
                  isFetchingTeam={isFetchingTeam} 
                  loadNotionProject={loadNotionProject} 
                  isLoading={isLoading}
                  theme={theme}
                  activeProjectId={projectId}
                  activeSubTab={activeSubTab}
                />
              ) : activeTab === 'notebooklm' ? (
                <NotebookLMCenter 
                  stepData={stepData} 
                  teamProjects={teamProjects} 
                  isFetchingTeam={isFetchingTeam} 
                  loadNotionProject={loadNotionProject} 
                  isLoading={isLoading}
                  theme={theme}
                  activeProjectId={projectId}
                  mode="creator"
                  activeSubTab={activeSubTab}
                />
              ) : null}
            </>
          )}
        </div>
      </div>

      {/* 3. Right Contextual Inspector */}
      {currentStep > 0 && (
        <ContextualInspector 
          aiStatus={aiStatus}
          logs={logs}
          notionStatus={notionStatus}
          onExportNotion={async () => {
            if (!isLoading) {
              setNotionStatus('saving');
              try {
                await exportToNotion();
                setNotionStatus('saved');
              } catch (e) {
                setNotionStatus('error');
              }
            }
          }}
          archivedUrl={archivedUrl}
          activeTab={activeTab}
        />
      )}

    </div>
  );
}
