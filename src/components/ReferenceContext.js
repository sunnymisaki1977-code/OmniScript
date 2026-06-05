import { ChevronLeft, ChevronRight, Info } from "lucide-react";

export default function ReferenceContext({ isCollapsed, onToggleCollapse, contextData, dependencies }) {
  if (isCollapsed) {
    return (
      <div className="w-12 h-screen shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col items-center py-4">
        <button
          onClick={onToggleCollapse}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors"
          title="展開參考資料"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-[40%] max-w-[500px] min-w-[300px] h-screen shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col transition-all">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Info className="w-4 h-4 text-slate-400" />
          參考資料
        </h2>
        <button
          onClick={onToggleCollapse}
          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-500 transition-colors"
          title="收合參考資料"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-slate-900/50">
        {dependencies.length === 0 ? (
          <div className="text-sm text-slate-500 dark:text-slate-400 text-center mt-10">
            無依賴的參考資料
          </div>
        ) : (
          <div className="space-y-6">
            {dependencies.map((dep) => {
              if (dep === "theme") return null; // 主題通常不需特別顯示大塊內容
              
              const stepId = dep.replace("step", "");
              const content = contextData[dep];
              
              if (!content) return null;

              return (
                <div key={dep} className="space-y-2">
                  <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    來源: 步驟 {stepId}
                  </h3>
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed shadow-sm">
                    {content}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
