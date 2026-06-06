const fs = require('fs');

let code = fs.readFileSync('src/app/app/page.js', 'utf8');

// 1. Import VisualDispatchCenter
if (!code.includes('import VisualDispatchCenter')) {
  code = code.replace(
    'import EditorWorkspace from "@/components/EditorWorkspace";',
    'import EditorWorkspace from "@/components/EditorWorkspace";\nimport VisualDispatchCenter from "@/components/VisualDispatchCenter";'
  );
}

// 2. Add activeTab state
if (!code.includes('const [activeTab, setActiveTab] = useState("planning");')) {
  code = code.replace(
    'const [activeInputMode, setActiveInputMode] = useState(null);',
    'const [activeInputMode, setActiveInputMode] = useState(null);\n  const [activeTab, setActiveTab] = useState("planning");'
  );
}

// 3. Extract the right side of the global header to reuse
const headerRightSide = `
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
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden py-1 z-50">
                  <button onClick={() => setIsApiKeyModalOpen(true)} className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2">
                    <KeyRound className="w-4 h-4" /> 設定 API 金鑰
                  </button>
                </div>
              )}
            </div>
          </div>
`;

// 4. Update Workspace return block
// We need to find the Workspace return block and wrap it with a Flex Col container + Header.
const workspaceReturnOriginal = `
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
      <IdentityModal />
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
          step={currentStepConfig}
        />
      )}
      
      {currentStepConfig && (
        <EditorWorkspace
          step={currentStepConfig}
          value={stepData[\`step\${currentStep}\`] || ""}
          onChange={(val) => setStepData({ ...stepData, [\`step\${currentStep}\`]: val })}
          isLoading={isLoading}
          onRegenerate={() => handleRunStep(currentStep)}
          onSaveNext={() => handleSaveAndNext(currentStep)}
          isLastStep={currentStep === 9}
          saveStatus={saveStatus}
          isAutoRunning={isAutoRunning}
          isArchived={!!archivedUrl}
        />
      )}
    </div>
  );
`;

const workspaceReturnNew = `
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
      <IdentityModal />
      
      {/* Global Header inside Workspace */}
      <header className="h-14 shrink-0 px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1E293B] flex items-center justify-between z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
            <span className="text-xl">✨</span>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white truncate max-w-[150px]">
              {theme || "OmniScript"}
            </span>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('planning')}
              className={\`px-4 py-1.5 rounded-md text-sm font-medium transition-colors \${activeTab === 'planning' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}\`}
            >
              📝 企劃工作區
            </button>
            <button 
              onClick={() => setActiveTab('dispatch')}
              className={\`px-4 py-1.5 rounded-md text-sm font-medium transition-colors \${activeTab === 'dispatch' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}\`}
            >
              🎨 視覺發控中心
            </button>
          </div>
        </div>

${headerRightSide}
      </header>

      <div className="flex flex-1 overflow-hidden">
        {activeTab === 'planning' ? (
          <>
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
                step={currentStepConfig}
              />
            )}
            
            {currentStepConfig && (
              <EditorWorkspace
                step={currentStepConfig}
                value={stepData[\`step\${currentStep}\`] || ""}
                onChange={(val) => setStepData({ ...stepData, [\`step\${currentStep}\`]: val })}
                isLoading={isLoading}
                onRegenerate={() => handleRunStep(currentStep)}
                onSaveNext={() => handleSaveAndNext(currentStep)}
                isLastStep={currentStep === 9}
                saveStatus={saveStatus}
                isAutoRunning={isAutoRunning}
                isArchived={!!archivedUrl}
              />
            )}
          </>
        ) : (
          <VisualDispatchCenter stepData={stepData} />
        )}
      </div>
    </div>
  );
`;

// It's safer to locate the block dynamically because line numbers might shift.
const startIndex = code.indexOf('return (\n    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">\n      <IdentityModal />');

if (startIndex !== -1 && !code.includes('📝 企劃工作區')) {
  // Use a targeted slice replace
  const endIndex = code.lastIndexOf('  );\n}');
  if (endIndex !== -1) {
    const before = code.substring(0, startIndex);
    const after = code.substring(endIndex);
    code = before + workspaceReturnNew.trim() + '\n' + after;
  }
} else {
  console.log("Could not find the workspace block or it's already updated.");
}

fs.writeFileSync('src/app/app/page.js', code);
console.log('Successfully updated app/page.js');
