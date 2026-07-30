"use client";

import React, { useState } from "react";
import { Workflow, Play, Plus, ArrowRight, Zap, CheckCircle2, Clock, Settings, Sparkles } from "lucide-react";

export function AutomationStudio({ projectName }: { projectName: string }) {
  const [workflows, setWorkflows] = useState([
    {
      id: "wf-1",
      name: "YouTube to Blog & Social Cross-post",
      nodes: ["YouTube Video", "AI Blog Generation", "Translate (ES/FR)", "Generate Tweet", "Schedule Buffer"],
      status: "Active",
      lastRun: "10 mins ago",
      trigger: "Webhook",
    },
    {
      id: "wf-2",
      name: "Daily SEO Keyword Analyzer & Content Brief",
      nodes: ["Meilisearch Scraper", "DeepSeek R1 SEO Analysis", "Notion Brief Sync", "Slack Alert"],
      status: "Scheduled (Daily)",
      lastRun: "Yesterday at 09:00",
      trigger: "Cron",
    },
  ]);

  return (
    <div className="flex flex-col h-full bg-surface/50 border border-border rounded-xl overflow-hidden glass-panel">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accentCyan/10 border border-accentCyan/30 text-accentCyan">
            <Workflow className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
              Workflow Automations (n8n + BullMQ Engine)
              <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">
                Project: {projectName}
              </span>
            </div>
            <div className="text-xs text-zinc-400">Automate multi-step content & social pipelines</div>
          </div>
        </div>

        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent text-white text-xs font-medium hover:bg-accent/90 transition-colors shadow-md">
          <Plus className="w-3.5 h-3.5" />
          Create New Workflow
        </button>
      </div>

      {/* Main Workflow Builder Grid */}
      <div className="flex-1 p-6 space-y-4 overflow-y-auto">
        <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Active Project Pipelines ({workflows.length})
        </div>

        {workflows.map((wf) => (
          <div key={wf.id} className="p-4 rounded-xl border border-zinc-800 bg-surfaceLight/40 space-y-3 glass-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h4 className="text-sm font-semibold text-zinc-100">{wf.name}</h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono">
                  Trigger: {wf.trigger}
                </span>
                <button className="flex items-center gap-1 px-3 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-emerald-400 font-medium transition-colors">
                  <Play className="w-3 h-3 fill-current" />
                  Run Now
                </button>
              </div>
            </div>

            {/* Visual Node Flow Sequence */}
            <div className="flex items-center gap-2 py-2 overflow-x-auto">
              {wf.nodes.map((node, idx) => (
                <React.Fragment key={idx}>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-200 shrink-0">
                    <Zap className="w-3 h-3 text-accent" />
                    {node}
                  </div>
                  {idx < wf.nodes.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-zinc-600 shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>

            <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-2 border-t border-zinc-800/60">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-zinc-500" />
                Last execution: {wf.lastRun}
              </span>
              <span className="text-emerald-400 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3 h-3" /> Status: {wf.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
