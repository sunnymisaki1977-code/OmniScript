const fs = require('fs');

let code = fs.readFileSync('src/app/app/page.js', 'utf8');

// 1. We need to remove the rendering of Local Projects and Team Projects lists.
// In the current file, these are at the bottom of the Dashboard container.
// Let's find the "Recent Workspaces" container and "Team Projects" container and remove them.
// A simpler way: we can just find the start of {/* Recent Workspaces */} or similar,
// and remove everything until the end of the dashboard div.
const dashboardEndIdx = code.indexOf('{/* Recent Workspaces */}');
const teamEndIdx = code.indexOf('{/* Team Projects (Notion) */}');

// The dashboard div ends right before `// -----------------------------------------------------`
// `// Step 1~9: Workspace`
const workspaceSectionStart = code.indexOf('// -----------------------------------------------------', dashboardEndIdx > -1 ? dashboardEndIdx : 0);

if (dashboardEndIdx > -1 && workspaceSectionStart > -1) {
  // Wait, we still need to keep the closing tags of the Dashboard view.
  // The structure is:
  //         {/* Inspiration Pills */} ... </div>
  //       </div>
  //       {/* Recent Workspaces */} ...
  //       {/* Team Projects (Notion) */} ...
  //     </main>
  //     {renderApiModal()}
  //   </div>
  // );
  
  // So let's replace everything from `{/* Recent Workspaces */}` to `</main>` with just `</main>`
  const mainClosingIdx = code.indexOf('</main>', dashboardEndIdx);
  if (mainClosingIdx > -1) {
    const toRemove = code.substring(dashboardEndIdx, mainClosingIdx);
    code = code.replace(toRemove, '');
  }
} else if (teamEndIdx > -1) {
    const mainClosingIdx = code.indexOf('</main>', teamEndIdx);
    if (mainClosingIdx > -1) {
        const toRemove = code.substring(teamEndIdx, mainClosingIdx);
        code = code.replace(toRemove, '');
    }
}

// 2. Add the dropdown inside the Hero Section, perhaps after the Action buttons.
// Let's locate the Action Buttons container.
const actionButtonsEnd = code.indexOf('</div>\n            </div>\n\n            {/* Inspiration Pills */}');
if (actionButtonsEnd > -1) {
  const dropdownUI = `
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
`;
  
  // Insert the dropdown UI after the action buttons container.
  code = code.replace('</div>\n            </div>\n\n            {/* Inspiration Pills */}', '</div>\n            </div>\n' + dropdownUI + '\n            {/* Inspiration Pills */}');
}

fs.writeFileSync('src/app/app/page.js', code);
console.log('Successfully updated app/page.js with dropdown');
