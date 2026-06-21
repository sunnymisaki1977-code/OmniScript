import React from 'react';
import { Circle, Check, Sparkles, FastForward, Search, Video, FileText, Smartphone, Image as ImageIcon, Music, Share2 } from 'lucide-react';
import { WORKFLOW_STEPS } from '@/utils/promptConfigs';

const STEP_ICONS = {
  1: Search,
  2: Video,
  3: FileText,
  4: Smartphone,
  5: FileText,
  6: ImageIcon,
  7: ImageIcon,
  8: Music,
  9: Share2
};

export default function AutoPipelineMatrix({ 
  theme,
  activeStep, 
  completedSteps, 
  isGenerating, 
  onReset,
  onSwitchToManual
}) {
  return (
    <div className="flex-1 h-full flex flex-col items-center justify-center p-8 relative overflow-hidden bg-slate-50 dark:bg-[#0a0f1d]">
      {/* 裝飾背景發光 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
      
      <div className="z-10 w-full max-w-4xl flex flex-col h-full justify-center py-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            A.I. Content Factory 工作流引擎
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">全自動多平台內容矩陣</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">一鍵將核心創意主題「<span className="font-bold text-indigo-500">{theme}</span>」自動編排、優化並推演為 9 大行銷資產</p>
        </div>

        {/* 9 步驟卡片生成矩陣 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-auto overflow-y-auto max-h-[60vh] p-2 custom-scrollbar">
          {WORKFLOW_STEPS.map((step) => {
            const isActive = activeStep === step.id && isGenerating;
            const isDone = completedSteps.includes(step.id);
            const Icon = STEP_ICONS[step.id] || Circle;
            
            return (
              <div 
                key={step.id} 
                onClick={() => {
                  if (!isGenerating) {
                    onSwitchToManual(step.id);
                  }
                }}
                className={`
                  relative p-5 rounded-2xl border transition-all duration-300 ${!isGenerating ? 'cursor-pointer' : ''}
                  ${isActive ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-400 dark:border-indigo-500 shadow-[0_0_25px_rgba(99,102,241,0.2)] scale-[1.02] z-10' : ''}
                  ${isDone ? 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700' : ''}
                  ${!isActive && !isDone ? 'bg-slate-50 dark:bg-slate-950/20 border-slate-200 dark:border-slate-900/60 opacity-60' : ''}
                `}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-xl ${isActive ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 animate-pulse' : isDone ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300' : 'bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-700'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {isDone ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-500/50 flex items-center justify-center">
                      <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  ) : isActive ? (
                    <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 dark:text-slate-800" />
                  )}
                </div>
                <h3 className={`font-bold text-sm ${isActive ? 'text-indigo-700 dark:text-indigo-200' : isDone ? 'text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-600'}`}>
                  {step.title}
                </h3>
                <p className="text-[10px] text-slate-500 mt-1">Step 0{step.id} • {step.description.substring(0, 15)}...</p>
                
                {isActive && (
                  <div className="absolute bottom-0 left-0 h-1 bg-indigo-500 w-full rounded-b-2xl overflow-hidden">
                    <div className="h-full bg-indigo-400 w-1/2 animate-[translateX_1s_infinite]"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 全自動運行時的快捷重置/中斷鈕 */}
        <div className="flex justify-center gap-3 mt-8">
          <button 
            onClick={onReset}
            className="px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:border-slate-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 transition-colors"
          >
            重置工作流
          </button>
          <button 
            onClick={() => onSwitchToManual(activeStep)}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-bold text-white shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-transform hover:-translate-y-0.5"
          >
            切換到手動精修
          </button>
        </div>
      </div>
    </div>
  );
}
