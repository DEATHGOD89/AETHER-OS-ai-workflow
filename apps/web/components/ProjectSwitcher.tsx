"use client";

import React, { useState } from "react";
import { Folder, ChevronDown, Plus, Check, Layers } from "lucide-react";

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  filesCount: number;
  assetsCount: number;
}

interface ProjectSwitcherProps {
  currentProject: ProjectItem;
  projects: ProjectItem[];
  onSelectProject: (p: ProjectItem) => void;
  onCreateProject: () => void;
}

export function ProjectSwitcher({
  currentProject,
  projects,
  onSelectProject,
  onCreateProject,
}: ProjectSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surfaceLight/60 hover:bg-surfaceLight border border-border text-sm font-medium transition-all"
      >
        <div className="w-6 h-6 rounded bg-gradient-to-tr from-accent to-accentCyan flex items-center justify-center text-white text-xs font-bold shadow-sm">
          {currentProject.name.slice(0, 2).toUpperCase()}
        </div>
        <div className="text-left">
          <div className="text-xs font-semibold text-zinc-100 leading-tight">
            {currentProject.name}
          </div>
          <div className="text-[10px] text-zinc-400">Project Context</div>
        </div>
        <ChevronDown className="w-4 h-4 text-zinc-400 ml-1" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-surface border border-border rounded-xl shadow-2xl p-2 z-40 glass-panel">
          <div className="text-[11px] font-semibold text-zinc-400 px-2 py-1 uppercase tracking-wider">
            Active Projects
          </div>
          <div className="space-y-1 my-1">
            {projects.map((proj) => (
              <button
                key={proj.id}
                onClick={() => {
                  onSelectProject(proj);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left text-xs transition-colors ${
                  proj.id === currentProject.id
                    ? "bg-accent/20 border border-accent/40 text-accent font-medium"
                    : "hover:bg-surfaceLight text-zinc-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Folder className="w-3.5 h-3.5 text-zinc-400" />
                  <div>
                    <div>{proj.name}</div>
                    <div className="text-[10px] text-zinc-500">{proj.filesCount} files · {proj.assetsCount} assets</div>
                  </div>
                </div>
                {proj.id === currentProject.id && <Check className="w-3.5 h-3.5 text-accent" />}
              </button>
            ))}
          </div>
          <div className="border-t border-border pt-1 mt-1">
            <button
              onClick={() => {
                onCreateProject();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-accent hover:bg-accent/10 transition-colors font-medium"
            >
              <Plus className="w-3.5 h-3.5" />
              New Project
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
