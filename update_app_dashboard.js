const fs = require('fs');

let code = fs.readFileSync('src/app/app/page.js', 'utf8');

// 1. Add states
if (!code.includes('const [teamProjects, setTeamProjects] = useState([]);')) {
  code = code.replace(
    'const [projects, setProjects] = useState([]);',
    'const [projects, setProjects] = useState([]);\n  const [teamProjects, setTeamProjects] = useState([]);\n  const [isFetchingTeam, setIsFetchingTeam] = useState(false);'
  );
}

// 2. Add useEffect to fetch team projects
const fetchEffect = `
  useEffect(() => {
    if (isMounted && currentStep === 0) {
      setIsFetchingTeam(true);
      fetch('/api/notion/projects')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setTeamProjects(data.projects);
          }
        })
        .catch(err => console.error(err))
        .finally(() => setIsFetchingTeam(false));
    }
  }, [isMounted, currentStep]);
`;

if (!code.includes("fetch('/api/notion/projects')")) {
  // Insert after the existing useEffects
  const searchStr = '  // Auto-save logic';
  if (code.includes(searchStr)) {
    code = code.replace(searchStr, fetchEffect.trim() + '\n\n' + searchStr);
  }
}

// 3. Add loadNotionProject function
const loadNotionProjectFn = `
  const loadNotionProject = async (proj) => {
    setIsLoading(true);
    try {
      const res = await fetch(\`/api/notion/page/\${proj.id}\`);
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
`;

if (!code.includes('const loadNotionProject')) {
  const searchStr = 'const handleReset = () => {';
  if (code.includes(searchStr)) {
    code = code.replace(searchStr, loadNotionProjectFn.trim() + '\n\n  ' + searchStr);
  }
}

// 4. Update the Dashboard UI rendering
// I will replace the "近期專案" heading and map with two lists: Local and Team.

const teamSection = `
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
`;

if (!code.includes('團隊近期專案 (來自 Notion)')) {
  // Replace the title of "近期專案" to "🧑‍💻 我的草稿 (本機)"
  code = code.replace(
    '<Clock className="w-5 h-5 text-indigo-500" />\n                  近期專案',
    '<Clock className="w-5 h-5 text-indigo-500" />\n                  🧑‍💻 我的草稿 (本機)'
  );
  
  // Insert Team Projects after Local Projects
  // Find the end of Local Projects block. It ends with the </div> of the grid, followed by </div> of the section.
  
  const endOfLocalProjStr = `                  </button>\n                ))}\n              </div>\n            </div>`;
  
  if (code.includes(endOfLocalProjStr)) {
    code = code.replace(endOfLocalProjStr, endOfLocalProjStr + '\n\n' + teamSection);
  }
}

fs.writeFileSync('src/app/app/page.js', code);
console.log('Successfully updated app/page.js');
