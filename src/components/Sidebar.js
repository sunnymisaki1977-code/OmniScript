import { useState, useEffect } from "react";
import { CheckCircle2, CircleDot, Lock, Moon, Sun, Sparkles, FileText, Palette, Music, BookOpen, Smartphone, LayoutTemplate, Film } from "lucide-react";

export default function Sidebar({ 
  steps, currentStep, theme, onStepClick, completedSteps, onReset, 
  activeTab, setActiveTab, activeSubTab, setActiveSubTab, isDark, toggleTheme 
}) {

  // Helper component to render sub-items for centers
  const SubItem = ({ id, label, description, icon: Icon }) => {
    const isActive = activeSubTab === id;
    return (
      <button
        onClick={() => setActiveSubTab(id)}
        className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 transition-colors mb-1.5 ${
          isActive 
            ? "bg-indigo-50 dark:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-800" 
            : "hover:bg-slate-100 dark:hover:bg-slate-700/50 border border-transparent"
        }`}
      >
        <div className={`p-1.5 rounded-lg ${isActive ? "bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-400" : "bg-slate-100 dark:bg-slate-700 text-slate-500"}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className={`text-sm font-semibold truncate ${isActive ? "text-indigo-900 dark:text-indigo-300" : "text-slate-700 dark:text-slate-300"}`}>
            {label}
          </div>
          {description && <div className="text-[10px] text-slate-500 truncate">{description}</div>}
        </div>
      </button>
    );
  };

  return (
    <aside className="w-64 h-full shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#030712] flex flex-col z-20">
      {/* Header / Logo */}
      <div className="h-14 px-6 border-b border-slate-200 dark:border-slate-800 flex items-center shrink-0 cursor-pointer" onClick={onReset}>
        <Sparkles className="w-5 h-5 text-indigo-500 mr-2" />
        <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white truncate">OmniScript</span>
      </div>

      {/* Tab Navigation (Accordion) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        
        {/* 1. 內容創作中心 */}
        <div className="space-y-1">
          <button onClick={() => setActiveTab('planning')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeTab === 'planning' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
            <FileText className="w-4 h-4" /> 內容創作中心
          </button>
          
          {activeTab === 'planning' && currentStep > 0 && (
            <div className="pl-6 pr-2 py-2 mt-1 border-l-2 border-slate-100 dark:border-slate-800 ml-4">
              <ul className="space-y-1.5">
                {steps.map((step) => {
                  const isCompleted = completedSteps.includes(step.id);
                  const isActive = currentStep === step.id;
                  const isLocked = !isActive && !isCompleted && step.id > (Math.max(0, ...completedSteps) + 1);

                  return (
                    <li key={step.id}>
                      <button
                        onClick={() => !isLocked && onStepClick(step.id)}
                        disabled={isLocked}
                        className={`w-full text-left flex items-start gap-2.5 px-2 py-2 rounded-xl transition-all relative border
                          ${
                            isActive
                              ? "bg-indigo-50 dark:bg-indigo-900/40 text-indigo-900 dark:text-indigo-300 font-bold border-indigo-200 dark:border-indigo-800 shadow-sm"
                              : isLocked
                              ? "text-slate-400 dark:text-slate-600 cursor-not-allowed border-transparent opacity-60"
                              : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border-transparent"
                          }
                        `}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isCompleted && !isActive ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          ) : isActive ? (
                            <CircleDot className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                          ) : isLocked ? (
                            <Lock className="w-3.5 h-3.5" />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 dark:border-slate-700" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[11px] truncate leading-tight">
                            Step {step.id}: {step.title}
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        {/* 2. 視覺發控中心 */}
        <div className="space-y-1">
          <button onClick={() => setActiveTab('dispatch')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeTab === 'dispatch' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
            <Palette className="w-4 h-4" /> 視覺發控中心
          </button>
          
          {activeTab === 'dispatch' && (
            <div className="pl-5 pr-2 py-2 mt-1 border-l-2 border-slate-100 dark:border-slate-800 ml-4">
              <SubItem id="step6" label="Step 6" description="長影音縮圖 (16:9)" icon={Film} />
              <SubItem id="step7" label="Step 7" description="短影音縮圖 (9:16)" icon={Smartphone} />
              <SubItem id="step9" label="Step 9" description="社群圖文企劃" icon={LayoutTemplate} />
            </div>
          )}
        </div>

        {/* 3. Suno 配樂中心 */}
        <div className="space-y-1">
          <button onClick={() => setActiveTab('suno')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeTab === 'suno' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
            <Music className="w-4 h-4" /> Suno 配樂中心
          </button>
          
          {activeTab === 'suno' && (
            <div className="pl-5 pr-2 py-2 mt-1 border-l-2 border-slate-100 dark:border-slate-800 ml-4">
              <SubItem id="step8" label="Step 8" description="Suno AI 配樂" icon={Music} />
            </div>
          )}
        </div>

        {/* 4. NotebookLM 影片中心 */}
        <div className="space-y-1">
          <button onClick={() => setActiveTab('notebooklm')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeTab === 'notebooklm' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
            <BookOpen className="w-4 h-4" /> NotebookLM 影片中心
          </button>
          
          {activeTab === 'notebooklm' && (
            <div className="pl-5 pr-2 py-2 mt-1 border-l-2 border-slate-100 dark:border-slate-800 ml-4">
              <SubItem id="step2" label="Step 2" description="長影音腳本撰寫" icon={FileText} />
              <SubItem id="step4" label="Step 4" description="短影音腳本撰寫" icon={Smartphone} />
            </div>
          )}
        </div>

      </div>

      {/* Bottom Controls */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2 shrink-0">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {isDark ? "淺色模式" : "深色模式"}
        </button>
      </div>
    </aside>
  );
}
