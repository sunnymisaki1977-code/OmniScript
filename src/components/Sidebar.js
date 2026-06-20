import { useState, useEffect } from "react";
import { CheckCircle2, CircleDot, Lock, Moon, Sun, Sparkles, FileText, Palette, Music, BookOpen } from "lucide-react";

export default function Sidebar({ 
  steps, currentStep, theme, onStepClick, completedSteps, onReset, 
  activeTab, setActiveTab, isDark, toggleTheme 
}) {
  return (
    <aside className="w-64 h-full shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#030712] flex flex-col z-20">
      {/* Header / Logo */}
      <div className="h-14 px-6 border-b border-slate-200 dark:border-slate-800 flex items-center shrink-0 cursor-pointer" onClick={onReset}>
        <Sparkles className="w-5 h-5 text-indigo-500 mr-2" />
        <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white truncate">OmniScript</span>
      </div>

      {/* Tab Navigation */}
      <div className="p-4 space-y-1.5 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <button onClick={() => setActiveTab('planning')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeTab === 'planning' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
          <FileText className="w-4 h-4" /> 9-Step 內容工廠
        </button>
        <button onClick={() => setActiveTab('dispatch')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeTab === 'dispatch' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
          <Palette className="w-4 h-4" /> 視覺發控中心
        </button>
        <button onClick={() => setActiveTab('suno')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeTab === 'suno' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
          <Music className="w-4 h-4" /> Suno 配樂中心
        </button>
        <button onClick={() => setActiveTab('notebooklm')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeTab === 'notebooklm' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
          <BookOpen className="w-4 h-4" /> NotebookLM 影片中心
        </button>
      </div>

      {/* 9-Step Progress (Only in planning mode) */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {activeTab === 'planning' && currentStep > 0 && (
          <ul className="space-y-1.5">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-3">Workflow Progress</div>
            {steps.map((step) => {
              const isCompleted = completedSteps.includes(step.id);
              const isActive = currentStep === step.id;
              const isLocked = !isActive && !isCompleted && step.id > (Math.max(0, ...completedSteps) + 1);

              return (
                <li key={step.id}>
                  <button
                    onClick={() => !isLocked && onStepClick(step.id)}
                    disabled={isLocked}
                    className={`w-full text-left flex items-start gap-3 px-3 py-2.5 rounded-xl transition-all relative border
                      ${
                        isActive
                          ? "bg-indigo-50 dark:bg-indigo-900/40 text-indigo-900 dark:text-indigo-300 font-bold border-indigo-200 dark:border-indigo-800 shadow-sm"
                          : isLocked
                          ? "text-slate-400 dark:text-slate-600 cursor-not-allowed border-transparent opacity-60"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border-transparent"
                      }
                    `}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-r-md" />
                    )}
                    
                    <div className="mt-0.5 shrink-0">
                      {isCompleted && !isActive ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : isActive ? (
                        <CircleDot className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      ) : isLocked ? (
                        <Lock className="w-4 h-4" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-700" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="text-xs truncate">
                        Step {step.id}: {step.title}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
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
