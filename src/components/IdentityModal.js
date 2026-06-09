"use client";

import React, { useState, useEffect } from "react";
import { UserCircle, Shield, CheckCircle2 } from "lucide-react";

const MEMBERS = ["林亞欣", "蘇之苓", "王瑞鐘", "白采鑫", "江世銘"];
const ROLES = ["前端工程師 (Frontend)", "後端工程師 (Backend)", "UI 設計師 (User Interface)", "UX 設計師 (User Experience)", "專案經理 PM", "行銷/營運", "訪客"];

export default function IdentityModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ name: "", role: "" });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const existingIdentity = localStorage.getItem("omni_identity");
    if (!existingIdentity) {
      setIsOpen(true);
    }
  }, []);

  const handleSave = () => {
    if (!form.name || !form.role) {
      alert("請選擇您的名稱與角色！");
      return;
    }
    localStorage.setItem("omni_identity", JSON.stringify(form));
    setIsOpen(false);
  };

  if (!isMounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl p-8 animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-indigo-900/30 text-indigo-400 rounded-2xl flex items-center justify-center mb-6 mx-auto">
          <UserCircle className="w-8 h-8" />
        </div>
        
        <h2 className="text-2xl font-bold text-white text-center mb-2">歡迎登入 OmniScript</h2>
        <p className="text-slate-400 text-center text-sm mb-8">
          為了在「團隊動態牆」上留下您的活動軌跡，請先設定您的身份。
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2 flex items-center gap-2">
              <UserCircle className="w-4 h-4 text-indigo-400" /> 選擇名稱
            </label>
            <div className="grid grid-cols-3 gap-2">
              {MEMBERS.map((m) => (
                <button
                  key={m}
                  onClick={() => setForm({ ...form, name: m })}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors border ${
                    form.name === m
                      ? "bg-indigo-600 border-indigo-500 text-white"
                      : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-slate-600"
                  }`}
                >
                  {m}
                </button>
              ))}
              <button
                onClick={() => setForm({ ...form, name: "訪客" })}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors border ${
                  form.name === "訪客"
                    ? "bg-slate-700 border-slate-500 text-white"
                    : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:border-slate-600"
                }`}
              >
                訪客
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" /> 選擇主要職務
            </label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="" disabled>請選擇您的角色...</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mt-4"
          >
            <CheckCircle2 className="w-5 h-5" />
            完成設定，進入系統
          </button>
        </div>
      </div>
    </div>
  );
}
