import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "OmniScript — AI 內容生成引擎",
  description:
    "OmniScript 是一套九步式 AI 內容生成工作流，從靈感到成稿一氣呵成。加入我們，打造下一代創作引擎。",
};

export const viewport = {
  themeColor: "#020617",
  colorScheme: "dark",
};

import AuthProvider from "@/components/AuthProvider";

export default function RootLayout({ children }) {
  return (
    <html
      lang="zh-Hant"
      className={`dark bg-background ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
