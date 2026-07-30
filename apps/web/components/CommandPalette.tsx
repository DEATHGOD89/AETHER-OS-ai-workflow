"use client";

import React, { useState, useEffect } from "react";
import { Search, Sparkles, Code, Image as ImageIcon, Video, Workflow, Cpu, Zap, Folder, X } from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tabId: string) => void;
}

export function CommandPalette({ isOpen, onClose, onSelectTab }: CommandPaletteProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commands = [
    { id: "chat", title: "Open AI Studio Chat", icon: Sparkles, category: "Studio", desc: "Interact with Claude 3.5, DeepSeek, or Ollama" },
    { id: "code", title: "Open Code Workbench", icon: Code, category: "Developer", desc: "Edit source code, view preview, & manage files" },
    { id: "creative", title: "Generate Images & Videos", icon: ImageIcon, category: "Creative", desc: "FLUX, ComfyUI, Veo, & Runway generation" },
    { id: "automation", title: "Open Workflow Automations", icon: Workflow, category: "Automation", desc: "n8n background job flows & social schedule" },
    { id: "rag", title: "Manage Knowledge & RAG", icon: Cpu, category: "Memory", desc: "Qdrant vector embeddings & project context" },
  ];

  const filtered = commands.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-24 p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-[95vw] max-w-xl max-h-[85dvh] flex flex-col bg-[#0D1117] border border-white/10 rounded-xl shadow-2xl overflow-hidden glass-panel">
        <div className="flex items-center px-4 py-3 border-b border-white/10 bg-[#080A0F] shrink-0">
          <Search className="w-4 h-4 text-emerald-400 mr-3 shrink-0" strokeWidth={1.75} />
          <input
            type="text"
            placeholder="Search actions, open studio, ask AI... (Esc to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none"
          />
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded text-zinc-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-[60dvh] overflow-y-auto p-2 flex-1">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-zinc-500">No matching commands found.</div>
          ) : (
            filtered.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  onClick={() => {
                    onSelectTab(cmd.id);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-white/5 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-md bg-[#05070B] border border-white/10 text-emerald-400">
                      <Icon className="w-4 h-4" strokeWidth={1.75} />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-zinc-200 group-hover:text-white">
                        {cmd.title}
                      </div>
                      <div className="text-[11px] text-zinc-500">{cmd.desc}</div>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-zinc-400 font-mono">
                    {cmd.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-2 bg-[#080A0F] border-t border-white/10 text-[10px] text-zinc-500 font-mono shrink-0">
          <span>Tip: Press <kbd className="px-1 bg-zinc-800 rounded text-zinc-300">Esc</kbd> to exit</span>
          <span>Aether OS v1.0</span>
        </div>
      </div>
    </div>
  );
}
