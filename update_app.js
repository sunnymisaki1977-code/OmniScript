const fs = require('fs');

let code = fs.readFileSync('src/app/app/page.js', 'utf8');

// 1. Imports
if (!code.includes('logActivity')) {
  code = code.replace(
    'import { Rocket, FileText,',
    'import { logActivity } from "../../utils/activityLogger";\nimport IdentityModal from "../../components/IdentityModal";\nimport { Rocket, FileText,'
  );
}

// 2. createNewProject
if (!code.includes('logActivity("建立了一個新專案");')) {
  code = code.replace(
    'const newId = Date.now().toString();\n    setProjectId(newId);',
    'const newId = Date.now().toString();\n    setProjectId(newId);\n    logActivity("建立了一個新專案");'
  );
}

// 3. generateContent
if (!code.includes('logActivity(`執行了 AI 智能產製 (Step ${stepId})`);')) {
  code = code.replace(
    'setStepData((prev) => ({ ...prev, [`step${stepId}`]: data.result }));\n      return data.result;',
    'setStepData((prev) => ({ ...prev, [`step${stepId}`]: data.result }));\n      logActivity(`執行了 AI 智能產製 (Step ${stepId})`);\n      return data.result;'
  );
}

// 4. exportToNotion
if (!code.includes('logActivity("已將專案歸檔至 Notion");')) {
  code = code.replace(
    'setArchivedUrl(data.url);\n      if (!isAutoRunning) alert("成功歸檔至 Notion!");',
    'setArchivedUrl(data.url);\n      if (!isAutoRunning) alert("成功歸檔至 Notion!");\n      logActivity("已將專案歸檔至 Notion");'
  );
}

// 5. IdentityModal in Dashboard return
if (!code.includes('<IdentityModal />')) {
  code = code.replace(
    '<div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0F172A] flex flex-col font-sans">',
    '<div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0F172A] flex flex-col font-sans">\n        <IdentityModal />'
  );
  
  code = code.replace(
    '<div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">',
    '<div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">\n      <IdentityModal />'
  );
}

fs.writeFileSync('src/app/app/page.js', code);
console.log('Successfully injected logs and modal into app/page.js');
