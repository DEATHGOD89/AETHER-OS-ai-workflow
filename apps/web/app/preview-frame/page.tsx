"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, ArrowRight, Terminal } from "lucide-react";

export default function DynamicLivePreviewPage() {
  const [liveCode, setLiveCode] = useState<string>("");

  useEffect(() => {
    // Initial load from localStorage
    const savedCode = localStorage.getItem("aether_live_code");
    if (savedCode) {
      setLiveCode(savedCode);
    }

    // Listen for live postMessage updates from parent editor
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === "AETHER_UPDATE_CODE") {
        setLiveCode(e.data.code);
        localStorage.setItem("aether_live_code", e.data.code);
      }
    };

    // Listen for storage events across tabs
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "aether_live_code" && e.newValue) {
        setLiveCode(e.newValue);
      }
    };

    window.addEventListener("message", handleMessage);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("message", handleMessage);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  // If user provided HTML/JS code, render it in dynamic live sandbox
  if (liveCode && liveCode.trim().length > 0) {
    return (
      <iframe
        srcDoc={liveCode}
        title="Live Interactive Render Canvas"
        className="w-full h-screen border-0 bg-white"
        sandbox="allow-scripts allow-forms allow-same-origin allow-modals allow-popups"
      />
    );
  }

  // Fallback Clean Slate Onboarding View
  return (
    <div className="w-full min-h-screen bg-[#05070B] text-zinc-100 p-8 font-sans flex flex-col items-center justify-center selection:bg-white selection:text-black">
      <div className="max-w-md w-full text-center space-y-6 animate-in fade-in duration-300">
        <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white mx-auto shadow-xl">
          <Sparkles className="w-8 h-8" strokeWidth={1.75} />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white tracking-tight">Empty Canvas — Ready to Build</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            No default data loaded. Paste code into **Code Editor** or ask **AI Chat Studio** on the left to generate your interactive app live!
          </p>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="pt-2 space-y-2">
          <div className="text-[10px] uppercase tracking-wider font-mono text-zinc-500 font-semibold">
            Example Prompts You Can Try
          </div>
          <div className="flex flex-col gap-2 text-left">
            {[
              "Build a sleek dark-mode portfolio for a software engineer",
              "Create a SaaS pricing calculator with monthly/yearly toggle",
              "Design a square calculator HTML app with inputs and buttons",
            ].map((prompt, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-[#0D1117] border border-white/10 hover:border-white/40 text-xs text-zinc-300 transition-all font-mono flex items-center justify-between group cursor-pointer"
              >
                <span className="truncate">"{prompt}"</span>
                <ArrowRight className="w-3.5 h-3.5 text-white shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-zinc-500 pt-4">
          <Terminal className="w-3.5 h-3.5 text-white" />
          <span>Aether OS • Dynamic Live HTML/JS Sandbox Active</span>
        </div>
      </div>
    </div>
  );
}
