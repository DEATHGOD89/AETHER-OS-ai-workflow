"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Code,
  FileCode,
  Eye,
  RefreshCw,
  Columns,
  Smartphone,
  Tablet,
  Monitor,
  Check,
  Play,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

export function CodeWorkbench({ projectName }: { projectName?: string }) {
  const [codeContent, setCodeContent] = useState<string>(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aether Live App</title>
  <style>
    body {
      font-family: 'Inter', system-ui, sans-serif;
      margin: 0;
      padding: 0;
      background: #05070B;
      color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    header {
      width: 100%;
      background: #0D1117;
      border-b: 1px solid rgba(255,255,255,0.1);
      color: white;
      padding: 1rem 2rem;
      text-align: center;
      font-weight: 700;
      font-size: 1.25rem;
    }
    .card {
      background: #0D1117;
      border: 1px solid rgba(255,255,255,0.1);
      padding: 2rem;
      border-radius: 12px;
      margin: 2rem;
      max-width: 450px;
      width: 90%;
      box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5);
    }
    input {
      width: 100%;
      padding: 0.75rem;
      border-radius: 8px;
      border: 1px solid rgba(255,255,255,0.2);
      background: #05070B;
      color: #fff;
      font-size: 1rem;
      margin-top: 0.5rem;
      margin-bottom: 1rem;
      box-sizing: border-box;
    }
    button {
      width: 100%;
      padding: 0.75rem;
      border-radius: 8px;
      border: none;
      background: #10B981;
      color: #000;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    button:hover {
      background: #34D399;
      transform: translateY(-1px);
    }
    .result {
      margin-top: 1rem;
      font-weight: 600;
      color: #10B981;
      text-align: center;
    }
  </style>
</head>
<body>
  <header>✨ ${projectName || "My New Project"}</header>
  <div class="card">
    <h2 style="margin-top: 0;">Interactive Demo Calculator</h2>
    <p style="color: #a1a1aa; font-size: 0.9rem;">Type a number to test real-time square calculation:</p>
    <input type="number" id="numInput" placeholder="Enter number..." value="8" />
    <button id="calcBtn">Calculate Square</button>
    <div id="result" class="result">The square of 8 is 64.</div>
  </div>

  <script>
    document.getElementById('calcBtn').addEventListener('click', () => {
      const num = parseFloat(document.getElementById('numInput').value) || 0;
      const square = num * num;
      document.getElementById('result').textContent = \`The square of \${num} is \${square}.\`;
    });
  </script>
</body>
</html>`);

  // Active Tab View Mode: 'code' (Editor Only), 'preview' (Live Preview Only), or 'split' (Side-by-Side Code & Preview)
  const [activeTab, setActiveTab] = useState<"code" | "preview" | "split">("split");
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [previewKey, setPreviewKey] = useState(0);
  const [synced, setSynced] = useState(false);
  const [activeFile, setActiveFile] = useState("index.html");

  // Toggle Hide & Resizable Files Panel State
  const [showFileTree, setShowFileTree] = useState(false);
  const [fileTreeWidth, setFileTreeWidth] = useState(180);
  const [isResizingFileTree, setIsResizingFileTree] = useState(false);

  // Split View Resizable Drag Pane Handle State (% of editor width in split view)
  const [splitEditorWidthPercent, setSplitEditorWidthPercent] = useState(50);
  const [isResizingSplit, setIsResizingSplit] = useState(false);

  // Debounce ref for localStorage writes to avoid UI jank
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync initial code to localStorage
  useEffect(() => {
    const existing = localStorage.getItem("aether_live_code");
    if (existing) {
      setCodeContent(existing);
    } else {
      localStorage.setItem("aether_live_code", codeContent);
    }
  }, []);

  // Global mouse listeners for file tree resizing handle & split view handle
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingFileTree) {
        const newWidth = Math.min(Math.max(e.clientX - 450, 100), 350);
        setFileTreeWidth(newWidth);
      } else if (isResizingSplit) {
        const container = document.getElementById("split-workbench-container");
        if (container) {
          const rect = container.getBoundingClientRect();
          const relativeX = e.clientX - rect.left;
          const newPercent = Math.min(Math.max((relativeX / rect.width) * 100, 20), 80);
          setSplitEditorWidthPercent(newPercent);
        }
      }
    };

    const handleMouseUp = () => {
      if (isResizingFileTree) setIsResizingFileTree(false);
      if (isResizingSplit) setIsResizingSplit(false);
    };

    if (isResizingFileTree || isResizingSplit) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizingFileTree, isResizingSplit]);

  const handleSyncPreview = (newCode?: string) => {
    const targetCode = newCode !== undefined ? newCode : codeContent;
    localStorage.setItem("aether_live_code", targetCode);
    setPreviewKey((prev) => prev + 1);
    setSynced(true);
    setTimeout(() => setSynced(false), 2000);

    const targetOrigin = typeof window !== "undefined" ? window.location.origin : "*";
    window.postMessage({ type: "AETHER_UPDATE_CODE", code: targetCode }, targetOrigin);
  };

  const handleCodeChange = (val: string) => {
    setCodeContent(val);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      localStorage.setItem("aether_live_code", val);
      const targetOrigin = typeof window !== "undefined" ? window.location.origin : "*";
      window.postMessage({ type: "AETHER_UPDATE_CODE", code: val }, targetOrigin);
    }, 300);
  };

  return (
    <div className="flex flex-col h-full bg-[#0D1117] border border-white/10 rounded-xl overflow-hidden glass-panel w-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 border-b border-white/10 bg-[#080A0F] shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <Code className="w-4 h-4 text-white shrink-0" strokeWidth={1.75} />
          <div className="text-xs font-semibold text-white flex items-center gap-1.5 truncate">
            <span className="truncate">Workbench</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-400 font-mono truncate hidden sm:inline-block">
              {activeTab === "split"
                ? "Split View"
                : activeTab === "code"
                ? activeFile
                : "Live Web Preview"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {/* Toggle Hide Project Files Panel */}
          {(activeTab === "code" || activeTab === "split") && (
            <button
              onClick={() => setShowFileTree((prev) => !prev)}
              className="hidden md:flex items-center gap-1 px-2 py-1 rounded-md text-[11px] sm:text-xs bg-white/5 border border-white/10 hover:bg-white/15 text-zinc-300 transition-colors"
              title={showFileTree ? "Hide Project Files" : "Show Project Files"}
            >
              {showFileTree ? <PanelLeftClose className="w-3.5 h-3.5" /> : <PanelLeftOpen className="w-3.5 h-3.5" />}
              <span className="hidden lg:inline">{showFileTree ? "Hide Files" : "Show Files"}</span>
            </button>
          )}

          {/* Run & Render Button */}
          <button
            onClick={() => handleSyncPreview()}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-md text-[11px] sm:text-xs bg-emerald-500 hover:bg-emerald-600 text-black font-bold shadow-md transition-all cursor-pointer shrink-0"
            title="Render code into live preview"
          >
            {synced ? <Check className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{synced ? "Rendered!" : "Run Code"}</span>
          </button>

          {/* View Mode Switcher */}
          <div className="flex items-center bg-[#05070B] p-0.5 rounded-lg border border-white/10">
            <button
              onClick={() => setActiveTab("code")}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md text-[11px] sm:text-xs transition-colors ${
                activeTab === "code" ? "bg-white text-black font-semibold shadow-sm" : "text-zinc-400 hover:text-white"
              }`}
            >
              <FileCode className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span className="hidden sm:inline">Editor</span>
            </button>
            <button
              onClick={() => {
                handleSyncPreview();
                setActiveTab("split");
              }}
              className={`hidden md:flex items-center gap-1 px-2.5 py-1 rounded-md text-xs transition-colors ${
                activeTab === "split" ? "bg-white text-black font-semibold shadow-sm" : "text-zinc-400 hover:text-white"
              }`}
            >
              <Columns className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>Split View</span>
            </button>
            <button
              onClick={() => {
                handleSyncPreview();
                setActiveTab("preview");
              }}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md text-[11px] sm:text-xs transition-colors ${
                activeTab === "preview" ? "bg-white text-black font-semibold shadow-sm" : "text-zinc-400 hover:text-white"
              }`}
            >
              <Eye className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span className="hidden sm:inline">Preview</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Workbench Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Project Files Panel */}
        {showFileTree && (activeTab === "code" || activeTab === "split") && (
          <div
            style={{ width: `${fileTreeWidth}px` }}
            className="hidden md:flex flex-col bg-[#080A0F] border-r border-white/10 p-2 shrink-0 select-none overflow-y-auto"
          >
            <div className="text-[10px] font-mono uppercase text-zinc-500 mb-2 font-semibold px-2">
              Project Files
            </div>
            <div className="space-y-0.5 text-xs font-mono">
              {["index.html", "page.tsx", "globals.css", "schema.prisma"].map((filePath) => (
                <button
                  key={filePath}
                  onClick={() => setActiveFile(filePath)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left truncate transition-colors ${
                    activeFile === filePath
                      ? "bg-white/10 border border-white/30 text-white font-medium"
                      : "text-zinc-400 hover:text-white hover:bg-white/[0.03]"
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 shrink-0 text-zinc-400" strokeWidth={1.75} />
                  <span className="truncate text-[11px] font-mono">{filePath}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Workspace Container */}
        <div id="split-workbench-container" className="flex-1 flex flex-col md:flex-row bg-[#05070B] overflow-hidden relative w-full">
          {/* Invisible Overlay Shield during Dragging */}
          {isResizingSplit && (
            <div className="fixed inset-0 z-50 cursor-col-resize select-none" />
          )}

          {/* CODE EDITOR PANE */}
          {(activeTab === "code" || activeTab === "split") && (
            <div
              style={{
                width: activeTab === "split" ? `${splitEditorWidthPercent}%` : "100%",
              }}
              className="h-full flex flex-col bg-[#05070B] overflow-hidden border-r border-white/10 w-full md:w-auto"
            >
              <div className="flex items-center justify-between text-[11px] text-zinc-400 font-sans border-b border-white/10 px-3 py-1.5 bg-[#080A0F] shrink-0">
                <div className="flex items-center gap-2">
                  <span>Live Code Editor ({activeFile})</span>
                </div>
                <button
                  onClick={() => handleSyncPreview()}
                  className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500 hover:text-black font-mono text-[10px] transition-all font-semibold"
                >
                  Save & Sync →
                </button>
              </div>

              <textarea
                value={codeContent}
                onChange={(e) => handleCodeChange(e.target.value)}
                placeholder="Paste or write your HTML/CSS/JS code here..."
                className="w-full flex-1 p-3 sm:p-4 bg-transparent text-zinc-100 focus:outline-none resize-none font-mono text-xs leading-relaxed"
              />
            </div>
          )}

          {/* DRAGGABLE RESIZABLE SPLIT HANDLE */}
          {activeTab === "split" && (
            <div
              onMouseDown={(e) => {
                e.preventDefault();
                setIsResizingSplit(true);
              }}
              onTouchStart={() => {
                setIsResizingSplit(true);
              }}
              className="flex w-3.5 h-full items-center justify-center hover:bg-emerald-500/20 active:bg-emerald-500/40 cursor-col-resize group transition-colors shrink-0 z-30 select-none bg-[#080A0F]/60 border-x border-white/10"
              title="Drag left/right to resize Editor & Live Preview panels"
            >
              <div className="w-1 h-12 bg-white/40 group-hover:bg-emerald-400 group-active:bg-emerald-400 rounded-full transition-colors" />
            </div>
          )}

          {/* LIVE PREVIEW PANE */}
          {(activeTab === "preview" || activeTab === "split") && (
            <div
              style={{
                width: activeTab === "split" ? `${100 - splitEditorWidthPercent}%` : "100%",
              }}
              className="h-full flex flex-col bg-[#05070B] overflow-hidden w-full md:w-auto"
            >
              {/* Responsive Device Viewport Controls Header */}
              <div className="flex items-center justify-between text-[11px] text-zinc-400 border-b border-white/10 px-3 py-1.5 bg-[#080A0F] shrink-0 flex-wrap gap-1">
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-1.5 items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                  </div>
                  <button
                    onClick={() => handleSyncPreview()}
                    className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                    title="Reload Preview Frame"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </button>
                  <span className="font-mono text-[10px] text-zinc-500 hidden sm:inline">Live Sandbox</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setViewport("desktop")}
                    className={`p-1 rounded transition-colors ${
                      viewport === "desktop" ? "bg-white/20 text-white" : "text-zinc-500 hover:text-zinc-300"
                    }`}
                    title="Desktop View (100%)"
                  >
                    <Monitor className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewport("tablet")}
                    className={`p-1 rounded transition-colors ${
                      viewport === "tablet" ? "bg-white/20 text-white" : "text-zinc-500 hover:text-zinc-300"
                    }`}
                    title="Tablet View (768px)"
                  >
                    <Tablet className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewport("mobile")}
                    className={`p-1 rounded transition-colors ${
                      viewport === "mobile" ? "bg-white/20 text-white" : "text-zinc-500 hover:text-zinc-300"
                    }`}
                    title="Mobile View (375px)"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Dynamic Sandbox Frame */}
              <div className="flex-1 bg-white/5 flex items-center justify-center p-0 overflow-auto">
                <div
                  className={`h-full transition-all duration-300 ${
                    viewport === "mobile"
                      ? "w-[375px] max-w-full border-x border-white/20 shadow-2xl my-auto"
                      : viewport === "tablet"
                      ? "w-[768px] max-w-full border-x border-white/20 shadow-2xl my-auto"
                      : "w-full"
                  }`}
                >
                  <iframe
                    key={previewKey}
                    srcDoc={codeContent}
                    title="Aether Live Sandbox Frame"
                    className="w-full h-full border-0 bg-white"
                    sandbox="allow-scripts allow-forms allow-same-origin allow-modals allow-popups"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
