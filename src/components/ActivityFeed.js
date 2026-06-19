"use client";

import React, { useState, useEffect } from "react";
import { Activity, RefreshCw, ExternalLink } from "lucide-react";

export default function ActivityFeed() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/notion/activity");
      const data = await res.json();
      if (data.logs) {
        setLogs(data.logs);
      }
    } catch (error) {
      console.error("Failed to fetch activities", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchActivities, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center">
        <h3 className="text-white font-bold flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-400" /> 
          團隊活動軌跡 (即時同步)
        </h3>
        <div className="flex items-center gap-3">

          <button 
            onClick={fetchActivities}
            className={`text-slate-500 hover:text-indigo-400 transition-colors ${loading ? 'animate-spin' : ''}`}
            title="手動重新整理"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="p-4 max-h-[300px] overflow-y-auto">
        {loading && logs.length === 0 ? (
          <div className="text-center text-slate-500 py-8 text-sm">載入中...</div>
        ) : logs.length === 0 ? (
          <div className="text-center text-slate-500 py-8 text-sm">目前尚無活動紀錄</div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => {
              // The text format from API is expected to be "[10:30] 角色 小明 做了某件事"
              // We can split it to style the timestamp and the message separately if we want,
              // or just render it directly.
              const match = log.text.match(/^(\[\d{2}:\d{2}\])\s(.+)$/);
              
              if (match) {
                return (
                  <div key={log.id} className="flex gap-3 text-sm animate-in fade-in slide-in-from-bottom-2">
                    <span className="text-emerald-400 shrink-0 font-mono">{match[1]}</span>
                    <span className="text-slate-300">{match[2]}</span>
                  </div>
                );
              }

              return (
                <div key={log.id} className="flex gap-3 text-sm animate-in fade-in slide-in-from-bottom-2">
                  <span className="text-slate-300">{log.text}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
