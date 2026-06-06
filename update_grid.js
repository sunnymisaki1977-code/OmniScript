const fs = require('fs');
let code = fs.readFileSync('src/app/page.js', 'utf8');

const startStr = '<div className="grid md:grid-cols-3 gap-6">';
const startIndex = code.indexOf(startStr);
if (startIndex === -1) {
  console.error('Could not find start index');
  process.exit(1);
}

// Find the first </section> after the start string
const sectionEndStr = '</section>';
const endSectionIndex = code.indexOf(sectionEndStr, startIndex);
if (endSectionIndex === -1) {
  console.error('Could not find end index');
  process.exit(1);
}
const endIndex = endSectionIndex + sectionEndStr.length;

const before = code.slice(0, startIndex);
const after = code.slice(endIndex);

const newGrid = `          <div className="grid md:grid-cols-2 gap-6">
            {roles.map((r) => {
              const isEditing = editingRoleId === r.id;
              const hasAssignee = !!r.assignee;
              const colorConfig = getColorClasses(r.color, hasAssignee);
              
              return (
                <div key={r.id} className={\`bg-slate-950 border p-8 rounded-2xl flex flex-col transition-all duration-300 relative \${hasAssignee ? colorConfig.active : 'border-slate-800 hover:border-slate-700'}\`}>
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-slate-500 mb-1 block">職位名稱</label>
                        <input value={editRoleForm.title} onChange={e => setEditRoleForm({...editRoleForm, title: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white text-sm focus:outline-none focus:border-indigo-500" />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500 mb-1 block">你的戰場 (說明)</label>
                        <textarea rows={3} value={editRoleForm.battlefield} onChange={e => setEditRoleForm({...editRoleForm, battlefield: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-300 text-sm" />
                      </div>
                      <div>
                        <label className="text-xs text-indigo-400 font-bold mb-1 block flex items-center gap-1"><UserCheck className="w-4 h-4" /> 當責 (負責人)</label>
                        <input placeholder="尚未指派..." value={editRoleForm.assignee} onChange={e => setEditRoleForm({...editRoleForm, assignee: e.target.value})} className="w-full bg-indigo-950/30 border border-indigo-500/50 rounded p-2 text-white font-bold focus:outline-none focus:border-indigo-500" />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button onClick={handleSaveRole} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-2 text-sm font-bold transition-colors">儲存修改</button>
                        <button onClick={() => setEditingRoleId(null)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-lg py-2 text-sm transition-colors">取消</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button onClick={() => startEditRole(r)} className="absolute top-6 right-6 text-slate-500 hover:text-white bg-slate-900 hover:bg-slate-800 p-2 rounded-lg transition-colors border border-slate-800 z-10">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <div className="mb-6 flex justify-between items-start">
                        <div className={\`w-12 h-12 rounded-xl flex items-center justify-center \${colorConfig.bg} \${colorConfig.text}\`}>
                          {getIcon(r.icon)}
                        </div>
                        {hasAssignee ? (
                          <div className={\`px-3 py-1 text-sm font-bold rounded-full border shadow-lg flex items-center gap-1.5 \${colorConfig.bg} \${colorConfig.text} border-current/30\`}>
                            <UserCheck className="w-4 h-4" /> {r.assignee}
                          </div>
                        ) : (
                          <span className="px-3 py-1 bg-slate-800 text-xs text-slate-400 rounded-full font-medium">徵求 1 名</span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 pr-8">{r.title}</h3>
                      <p className="text-slate-400 text-sm mb-6 flex-1">
                        {r.battlefield}
                      </p>
                      <div className="space-y-4">
                        <div>
                          <div className="text-xs text-slate-500 mb-2">技術棧</div>
                          <div className="flex flex-wrap gap-2">
                            {r.techStack.map((tech, idx) => {
                              const tColor = getColorClasses(tech.color);
                              return (
                                <span key={idx} className={\`px-2 py-1 text-xs rounded font-medium \${tColor.bg} \${tColor.text}\`}>
                                  {tech.label}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500 mb-2">加分項</div>
                          <ul className="text-xs text-slate-400 space-y-1">
                            {r.bonus.map((b, idx) => (
                              <li key={idx} className="flex gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0"/> {b}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>`;

code = before + newGrid + after;

// Replace the option in the form
if (code.includes('<option>UI/UX 設計師</option>')) {
  code = code.replace('<option>UI/UX 設計師</option>', '<option>UI 設計師</option>\n                  <option>UX 設計師</option>');
}

fs.writeFileSync('src/app/page.js', code);
console.log('REPLACEMENT SUCCESSFUL');
