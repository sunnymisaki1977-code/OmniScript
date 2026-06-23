"use client";

import React, { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { UserCircle, ShieldAlert } from "lucide-react";

const EMAIL_IDENTITY_MAP = {
  "wrc0315@gmail.com": { name: "林亞欣", role: "前端工程師" },
  "toyear520@gmail.com": { name: "蘇之苓", role: "後端工程師" },
  "dada95712@gmail.com": { name: "王瑞鐘", role: "UI 設計師" },
  "pai9067113@gmail.com": { name: "白采鑫", role: "UX 設計師" },
  "sunnymisaki1977@gmail.com": { name: "江世銘", role: "專案經理 PM" }
};

export default function GoogleLoginModal() {
  const { data: session, status } = useSession();
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsMounted(true);
    
    // Check URL for error from NextAuth
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get('error');
    if (errorParam === 'AccessDenied') {
      setError("拒絕存取：您不在專案受邀名單內。");
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      const email = session.user.email.toLowerCase();
      const identity = EMAIL_IDENTITY_MAP[email];
      
      if (identity) {
        localStorage.setItem("omni_identity", JSON.stringify(identity));
        setError(""); // Clear error on successful auth
      } else {
        // Fallback for edge cases where unauthorized user slipped through
        localStorage.removeItem("omni_identity");
        setError("拒絕存取：您不在專案受邀名單內。");
      }
    } else if (status === "unauthenticated") {
      localStorage.removeItem("omni_identity");
    }
  }, [session, status]);

  if (!isMounted) return null;

  // 如果已登入且有身分，就不顯示 Modal
  if (status === "authenticated" && !error) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl p-8 animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-indigo-900/30 text-indigo-400 rounded-2xl flex items-center justify-center mb-6 mx-auto">
          <UserCircle className="w-8 h-8" />
        </div>
        
        <h2 className="text-2xl font-bold text-white text-center mb-2">OmniScript 安全登入</h2>
        <p className="text-slate-400 text-center text-sm mb-8">
          系統已啟用嚴格存取控制，請使用指定的 Google 帳號登入以進入工作區。
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-xl flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={() => {
              setError("");
              signIn("google", { callbackUrl: window.location.pathname });
            }}
            disabled={status === "loading"}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-900 font-bold py-3 px-4 rounded-xl transition-all disabled:opacity-50"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            {status === "loading" ? "處理中..." : "使用 Google 帳號登入"}
          </button>
        </div>
      </div>
    </div>
  );
}
