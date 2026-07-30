"use client";

import React, { useState } from "react";
import { Cpu, Upload, FileText, Database, Trash2, CheckCircle, HardDrive } from "lucide-react";

export function RAGKnowledgeStudio({ projectName }: { projectName: string }) {
  const [docs, setDocs] = useState([
    {
      id: "doc-1",
      name: "architecture_blueprint.md",
      type: "Markdown",
      size: "42 KB",
      chunks: 28,
      status: "Indexed",
      updated: "10 mins ago",
    },
    {
      id: "doc-2",
      name: "brand_voice_guidelines.pdf",
      type: "PDF Document",
      size: "1.2 MB",
      chunks: 142,
      status: "Indexed",
      updated: "Yesterday",
    },
  ]);

  return (
    <div className="flex flex-col h-full bg-[#0D1117]/80 border border-white/10 rounded-xl overflow-hidden glass-panel w-full">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 sm:px-4 py-2.5 sm:py-3 border-b border-white/10 bg-[#080A0F] shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0">
            <Cpu className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs sm:text-sm font-semibold text-zinc-100 flex items-center gap-1.5 truncate">
              <span className="truncate">Project Knowledge (Qdrant RAG)</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono hidden sm:inline-block truncate">
                {projectName}
              </span>
            </div>
            <div className="text-[11px] text-zinc-400 truncate">Upload docs & code to feed context directly to AI</div>
          </div>
        </div>

        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-all shadow-md shrink-0 cursor-pointer">
          <Upload className="w-3.5 h-3.5" />
          <span>Ingest Document</span>
        </button>
      </div>

      {/* RAG Stats Banner */}
      <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 border-b border-white/10 bg-black/40 font-mono text-xs">
        <div className="p-3 rounded-lg border border-white/10 bg-[#080A0F]/60 flex items-center gap-3">
          <Database className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="min-w-0">
            <div className="text-[10px] text-zinc-400 uppercase font-mono">Vector Collection</div>
            <div className="text-xs font-bold text-zinc-200 truncate">qdrant_proj_{projectName.toLowerCase().replace(/\s+/g, '_')}</div>
          </div>
        </div>

        <div className="p-3 rounded-lg border border-white/10 bg-[#080A0F]/60 flex items-center gap-3">
          <FileText className="w-5 h-5 text-cyan-400 shrink-0" />
          <div className="min-w-0">
            <div className="text-[10px] text-zinc-400 uppercase font-mono">Total Chunks</div>
            <div className="text-xs font-bold text-zinc-200 truncate">170 Embedded Chunks</div>
          </div>
        </div>

        <div className="p-3 rounded-lg border border-white/10 bg-[#080A0F]/60 flex items-center gap-3">
          <HardDrive className="w-5 h-5 text-amber-400 shrink-0" />
          <div className="min-w-0">
            <div className="text-[10px] text-zinc-400 uppercase font-mono">Embedding Model</div>
            <div className="text-xs font-bold text-zinc-200 truncate">text-embedding-3-small</div>
          </div>
        </div>
      </div>

      {/* Document List */}
      <div className="flex-1 p-3.5 sm:p-6 space-y-3 overflow-y-auto">
        <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Ingested Documents ({docs.length})
        </div>

        {docs.map((doc) => (
          <div key={doc.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-xl border border-white/10 bg-[#080A0F]/50 gap-2 font-mono text-xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-lg bg-[#05070B] border border-white/10 text-zinc-300 shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium text-zinc-200 truncate">{doc.name}</div>
                <div className="text-[10px] text-zinc-400 truncate">
                  {doc.type} · {doc.size} · {doc.chunks} vector chunks
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                <CheckCircle className="w-3.5 h-3.5" />
                {doc.status}
              </span>
              <button className="p-1.5 rounded text-zinc-500 hover:text-rose-400 hover:bg-white/10 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
