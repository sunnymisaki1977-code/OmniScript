import React, { useEffect, useRef } from 'react';
import { Database, Terminal, CheckCircle2, AlertCircle, RefreshCw, Box, Layers, Globe } from 'lucide-react';

export default function ContextualInspector({ 
  aiStatus = 'pro', // 'pro' | 'flash' | 'lite'
  logs = [], 
  notionStatus = null, // null | 'saving' | 'saved' | 'error'
  onExportNotion,
  archivedUrl = null,
  activeTab = 'workspace'
}) {
  const logsEndRef = useRef(null);

  // Auto scroll to bottom of logs
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  return (
    <aside className="w-80 h-full bg-slate-950 border-l border-slate-800 flex flex-col shrink-0 overflow-hidden z-10">
      
      {/* 1. AI 引擎監控面板 */}
      <div className="p-5 border-b border-slate-800 shrink-0">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Globe className="w-4 h-4" /> AI 狀態監控
        </h3>
        
        <div className="space-y-3">
          {/* 狀態燈號卡片 */}
          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/10 blur-xl rounded-full pointer-events-none"></div>
            <div className="flex items-center gap-3">
              {aiStatus === 'pro' && (
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                </div>
              )}
              {aiStatus === 'flash' && (
                <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></div>
                </div>
              )}
              {aiStatus === 'lite' && (
                <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div>
                </div>
              )}
              
              <div>
                <div className="text-[10px] text-slate-500 font-mono mb-0.5">ACTIVE ENGINE</div>
                <div className="text-sm font-bold text-slate-200">
                  {aiStatus === 'pro' && 'Gemini 1.5 Pro'}
                  {aiStatus === 'flash' && 'Gemini Flash'}
                  {aiStatus === 'lite' && 'Gemini Flash-Lite'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between text-[10px] text-slate-500 px-1 font-mono">
            <span>Uptime: 99.99%</span>
            <span>Latency: {aiStatus === 'pro' ? '1.2s' : aiStatus === 'flash' ? '0.6s' : '0.3s'}</span>
          </div>
        </div>
      </div>

      {/* 2. 微型終端日誌 (Mini Code Terminal) */}
      <div className="flex-1 flex flex-col min-h-0 border-b border-slate-800">
        <div className="px-5 py-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between shrink-0">
          <h3 className="text-xs font-bold text-slate-400 flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5" /> 系統與日誌
          </h3>
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
            <div className="w-2 h-2 rounded-full bg-amber-500/50"></div>
            <div className="w-2 h-2 rounded-full bg-emerald-500/50"></div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 bg-slate-950 font-mono text-[10px] leading-relaxed custom-scrollbar">
          {logs.length === 0 ? (
            <div className="text-slate-600 italic">Waiting for events...</div>
          ) : (
            <div className="space-y-2">
              {logs.map((log, i) => (
                <div key={i} className={`flex items-start gap-2 ${
                  log.type === 'error' ? 'text-red-400' :
                  log.type === 'warning' ? 'text-amber-400' :
                  log.type === 'success' ? 'text-emerald-400' :
                  log.type === 'info' ? 'text-indigo-400' : 'text-slate-400'
                }`}>
                  <span className="text-slate-600 shrink-0">[{log.time}]</span>
                  <span className="break-all">{log.text}</span>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* 3. Notion 同步面板 */}
      <div className="p-5 bg-slate-900/30 shrink-0">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Database className="w-4 h-4" /> Notion 同步中心
        </h3>
        
        <div className="space-y-3">
          {archivedUrl ? (
            <div className="p-3 bg-emerald-900/10 border border-emerald-500/20 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold text-emerald-400">已歸檔成功</span>
              </div>
              <a 
                href={archivedUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-lg transition-colors"
              >
                🔗 在 Notion 開啟
              </a>
            </div>
          ) : (
            <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-400">尚未歸檔</span>
                {notionStatus === 'saving' && (
                  <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                )}
              </div>
              <button 
                onClick={onExportNotion}
                disabled={notionStatus === 'saving'}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 hover:border-slate-600 transition-all shadow-md"
              >
                {notionStatus === 'saving' ? '同步中...' : '一鍵匯出 Notion'}
              </button>
            </div>
          )}
        </div>
      </div>

    </aside>
  );
}
