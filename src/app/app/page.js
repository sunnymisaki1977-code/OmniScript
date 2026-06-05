"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import ReferenceContext from "@/components/ReferenceContext";
import EditorWorkspace from "@/components/EditorWorkspace";
import { WORKFLOW_STEPS } from "@/utils/promptConfigs";
import { Rocket, FileText, Play, Hand, Zap, User, Clock, ChevronRight, MoreVertical, Sun, Moon } from "lucide-react";

const INSPIRATION_PILLS = [
  { icon: "💡", label: "隨機來點靈感", text: "未來十年的 AI 發展趨勢與職場衝擊" },
  { icon: "📈", label: "科技趨勢解說", text: "區塊鏈與 Web3 到底在紅什麼？給新手的白話文指南" },
  { icon: "☕", label: "質感生活 Vlog", text: "一個自由工作者的週末早晨：找回生活的主導權" },
];

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  
  // Project State
  const [projectId, setProjectId] = useState(null);
  const [theme, setTheme] = useState("");
  const [currentStep, setCurrentStep] = useState(0); 
  const [stepData, setStepData] = useState({});
  const [completedSteps, setCompletedSteps] = useState([]);
  const [archivedUrl, setArchivedUrl] = useState(null);
  
  // App State
  const [projects, setProjects] = useState([]);
  const [isRefCollapsed, setIsRefCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("saved");
  const [notionStatus, setNotionStatus] = useState(null);
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);

  const [isDark, setIsDark] = useState(false);
  
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stepId, context }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      
      setStepData((prev) => ({ ...prev, [`step${stepId}`]: data.result }));
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
      const res = await fetch("/api/notion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context: payloadContext }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Export failed");
      
      setNotionStatus(data.url);
      setArchivedUrl(data.url);
      if (!isAutoRunning) alert("成功歸檔至 Notion!");
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

  const handleStartAuto = async () => {
    if (!theme.trim()) return;
    
    setIsAutoRunning(true);
    createNewProject();
    setStepData({});
    setCompletedSteps([]);
    
    try {
      setCurrentStep(1);
      setIsLoading(true);
      
      const res = await fetch("/api/gemini-batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Batch generation failed");
      
      const batchResult = data.result; 
      
      setIsLoading(false);
      let currentContext = { theme };
      let currentCompleted = [];
      
      for (let i = 1; i <= 9; i++) {
        setCurrentStep(i);
        const stepContent = batchResult[`step${i}`] || "無內容";
        
        currentContext = { ...currentContext, [`step${i}`]: stepContent };
        setStepData({...currentContext});
        
        currentCompleted.push(i);
        setCompletedSteps([...currentCompleted]);
        
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      
      setCurrentStep(9);
      await exportToNotion(currentContext);
      
    } catch (error) {
      console.error("自動生成中斷:", error);
      alert("自動生成失敗: " + error.message);
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

  // 防止伺服器端渲染與客戶端不一致
  if (!isMounted) return <div className="h-screen bg-slate-50 dark:bg-slate-900" />;

  // -----------------------------------------------------
  // Step 0: Dashboard
  // -----------------------------------------------------
  if (currentStep === 0) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0F172A] flex flex-col font-sans">
        
        {/* Global Header */}
        <header className="h-16 px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] flex items-center justify-between sticky top-0 z-50">
          <div className="flex items-center gap-2 cursor-pointer">
            <span className="text-2xl">✨</span>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              OmniScript
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-500 rounded-full font-medium text-sm border border-amber-200 dark:border-amber-800/30 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors cursor-pointer">
              <Zap className="w-4 h-4" />
              <span>125 點額度</span>
            </div>
            
            <div className="relative">
              <button 
                onClick={toggleTheme}
                className="w-9 h-9 mr-2 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-400 hover:ring-2 ring-slate-200 dark:ring-slate-700 transition-all"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setIsAvatarOpen(!isAvatarOpen)}
                className="w-9 h-9 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 hover:ring-2 ring-indigo-500/30 transition-all"
              >
                <User className="w-5 h-5" />
              </button>
              
              {isAvatarOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700 mb-2">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Alex Chen</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Pro Plan</p>
                  </div>
                  <button className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50">帳號設定</button>
                  <button className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50">API 金鑰管理</button>
                  <button className="w-full text-left px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 mt-1 border-t border-slate-100 dark:border-slate-700 pt-3">登出</button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-4xl w-full mx-auto p-6 pt-12">
          
          {/* Central Card */}
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 md:p-12 text-center mb-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
                <button
                  onClick={handleStartManual}
                  disabled={!theme.trim() || isAutoRunning}
                  className="group flex flex-col items-center justify-center gap-1.5 px-4 py-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-200 dark:border-slate-700 rounded-xl transition-all"
                >
                  <div className="flex items-center gap-2">
                    <Hand className="w-4 h-4 text-slate-500 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-300" />
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">手動協作模式</span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-500">逐一確認與編輯</span>
                </button>
                
                <button
                  onClick={handleStartAuto}
                  disabled={!theme.trim() || isAutoRunning}
                  className="group flex flex-col items-center justify-center gap-1.5 px-4 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white rounded-xl transition-all shadow-md shadow-indigo-200 dark:shadow-none hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-2">
                    {isAutoRunning ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                    <span className="text-sm font-bold">一鍵全自動模式</span>
                  </div>
                  <span className="text-xs text-indigo-200">單次呼叫，自動歸檔</span>
                </button>
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
          </div>

          {/* Recent Workspaces */}
          {projects.length > 0 && (
            <div className="mt-12 mb-20 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-500" />
                  近期專案
                </h2>
                <span className="text-xs font-medium px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full">
                  共 {projects.length} 個
                </span>
              </div>
              
              <div className="grid gap-3">
                {projects.slice(0, 5).map(proj => (
                  <button
                    key={proj.id}
                    onClick={() => loadProject(proj)}
                    className="group flex items-center justify-between p-4 bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl transition-all text-left"
                  >
                    <div className="flex-1 min-w-0 pr-4">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {proj.theme}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          {proj.mode === "auto" ? <Play className="w-3 h-3" /> : <Hand className="w-3 h-3" />}
                          {proj.mode === "auto" ? "全自動" : "手動"}
                        </span>
                        <span>•</span>
                        <span className={`px-2 py-0.5 rounded-full ${
                          proj.currentStep === 9 
                            ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                            : "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
                        }`}>
                          {proj.currentStep === 9 ? "已歸檔" : `進行至 Step ${proj.currentStep}`}
                        </span>
                        <span>•</span>
                        <span>{new Date(proj.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors shrink-0">
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>
    );
  }

  // -----------------------------------------------------
  // Step 1~9: Workspace
  // -----------------------------------------------------
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
      <Sidebar
        steps={WORKFLOW_STEPS}
        currentStep={currentStep}
        theme={theme}
        completedSteps={completedSteps}
        onStepClick={(id) => {
          if (!isAutoRunning) setCurrentStep(id);
        }}
        onReset={handleReset}
      />
      
      {currentStepConfig && (
        <ReferenceContext
          isCollapsed={isRefCollapsed}
          onToggleCollapse={() => setIsRefCollapsed(!isRefCollapsed)}
          contextData={{ theme, ...stepData }}
          dependencies={currentStepConfig.dependsOn}
        />
      )}
      
      {currentStepConfig && (
        <EditorWorkspace
          step={currentStepConfig}
          value={stepData[`step${currentStep}`]}
          onChange={(val) => setStepData((prev) => ({ ...prev, [`step${currentStep}`]: val }))}
          isLoading={isLoading}
          onRegenerate={handleRegenerate}
          onSaveNext={handleNextStep}
          isLastStep={currentStep === 9}
          saveStatus={saveStatus}
          isAutoRunning={isAutoRunning}
          isArchived={!!archivedUrl}
        />
      )}

      {notionStatus && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">歸檔成功！</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              您的全域腳本已成功同步至 Notion 資料庫。
            </p>
            <div className="pt-4 flex gap-3">
              <button
                onClick={() => setNotionStatus(null)}
                className="flex-1 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 rounded-lg transition-colors"
              >
                關閉
              </button>
              <a
                href={notionStatus}
                target="_blank"
                rel="noreferrer"
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center justify-center"
              >
                前往 Notion
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
