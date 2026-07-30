"use client";

import React, { useState } from "react";
import { Cpu, Upload, FileText, Database, Trash2, CheckCircle, RefreshCw, HardDrive } from "lucide-react";

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
    <div className="flex flex-col h-full bg-surface/50 border border-border rounded-xl overflow-hidden glass-panel">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
              Project Knowledge & Vector Memory (Qdrant RAG)
              <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">
                Project: {projectName}
              </span>
            </div>
            <div className="text-xs text-zinc-400">Upload docs & code to feed context directly to AI co-pilot</div>
          </div>
        </div>

        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-500 transition-colors shadow-md">
          <Upload className="w-3.5 h-3.5" />
          Ingest New Document
        </button>
      </div>

      {/* RAG Stats Banner */}
      <div className="p-4 grid grid-cols-3 gap-4 border-b border-border bg-zinc-950/40">
        <div className="p-3 rounded-lg border border-zinc-800 bg-surface/60 flex items-center gap-3">
          <Database className="w-5 h-5 text-accent" />
          <div>
            <div className="text-[10px] text-zinc-400 uppercase font-mono">Vector Collection</div>
            <div className="text-xs font-bold text-zinc-200">qdrant_proj_{projectName.toLowerCase().replace(/\s+/g, '_')}</div>
          </div>
        </div>

        <div className="p-3 rounded-lg border border-zinc-800 bg-surface/60 flex items-center gap-3">
          <FileText className="w-5 h-5 text-accentCyan" />
          <div>
            <div className="text-[10px] text-zinc-400 uppercase font-mono">Total Chunks Indexed</div>
            <div className="text-xs font-bold text-zinc-200">170 Embedded Chunks</div>
          </div>
        </div>

        <div className="p-3 rounded-lg border border-zinc-800 bg-surface/60 flex items-center gap-3">
          <HardDrive className="w-5 h-5 text-emerald-400" />
          <div>
            <div className="text-[10px] text-zinc-400 uppercase font-mono">Embedding Model</div>
            <div className="text-xs font-bold text-zinc-200">text-embedding-3-small (1536d)</div>
          </div>
        </div>
      </div>

      {/* Document List */}
      <div className="flex-1 p-6 space-y-3 overflow-y-auto">
        <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Ingested Documents ({docs.length})
        </div>

        {docs.map((doc) => (
          <div key={doc.id} className="flex items-center justify-between p-3 rounded-xl border border-zinc-800 bg-surfaceLight/40 glass-card">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-medium text-zinc-200">{doc.name}</div>
                <div className="text-[10px] text-zinc-400">
                  {doc.type} · {doc.size} · {doc.chunks} vector chunks
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                <CheckCircle className="w-3.5 h-3.5" />
                {doc.status}
              </span>
              <button className="p-1.5 rounded text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
