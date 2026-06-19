import { useState, useEffect } from "react";
import { CheckCircle2, CircleDot, Lock, RotateCcw, Moon, Sun, Sparkles, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function Sidebar({ steps, currentStep, theme, onStepClick, completedSteps, onReset }) {
  const { data: session } = useSession();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // 初始化主題
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="w-72 h-full shrink-0 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-col">
      <div className="h-14 px-6 border-b border-slate-200 dark:border-slate-800 flex items-center shrink-0">
        <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" /> OmniScript
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {steps.map((step) => {
            const isCompleted = completedSteps.includes(step.id);
            const isActive = currentStep === step.id;
            // 解鎖條件：前面的步驟都完成了，或是當前步驟（如果是第一步或之前已解鎖過）
            // 這裡簡單判定：如果是第1步則解鎖，如果它的依賴都完成則解鎖。
            // 為了簡化，我們假設只要在 completedSteps 中，或者是 completedSteps.length + 1，就解鎖。
            const isLocked = !isActive && !isCompleted && step.id > (Math.max(0, ...completedSteps) + 1);

            return (
              <li key={step.id}>
                <button
                  onClick={() => !isLocked && onStepClick(step.id)}
                  disabled={isLocked}
                  className={`w-full text-left flex items-start gap-3 px-4 py-3 rounded-xl transition-colors relative border
                    ${
                      isActive
                        ? "bg-indigo-50 dark:bg-indigo-900/40 text-indigo-900 dark:text-indigo-300 font-semibold border-indigo-200 dark:border-indigo-800"
                        : isLocked
                        ? "text-slate-400 dark:text-slate-600 cursor-not-allowed border-transparent"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 border-transparent"
                    }
                  `}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-r-md" />
                  )}
                  
                  <div className="mt-0.5 shrink-0">
                    {isCompleted && !isActive ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : isActive ? (
                      <CircleDot className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    ) : isLocked ? (
                      <Lock className="w-5 h-5 opacity-50" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-700" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate">
                      Step {step.id}: {step.title}
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Bottom Controls */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {isDark ? "切換至淺色模式" : "切換至深色模式"}
        </button>

        <button
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          清除資料並重新開始
        </button>

        {session && session.user && (
          <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 px-2 py-2">
              <img 
                src={session.user.image} 
                alt="Avatar" 
                className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700" 
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {session.user.name}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {session.user.email}
                </p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                title="登出"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
