"use client";

import React, { useState, useEffect, useRef } from "react";
import { Code, FileCode, Play, Eye, RotateCw, ExternalLink, Smartphone, Monitor, Tablet, Check, PanelLeftClose, PanelLeftOpen, Columns } from "lucide-react";

export function CodeWorkbench({ projectName }: { projectName: string }) {
  const [activeFile, setActiveFile] = useState("index.html");
  const [codeContent, setCodeContent] = useState<string>(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Simple Test UI</title>
  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      margin: 0;
      padding: 0;
      background: #f5f5f5;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    header {
      width: 100%;
      background: #1db954;
      color: white;
      padding: 1rem 0;
      text-align: center;
      font-size: 1.5rem;
    }
    .container {
      background: white;
      margin: 2rem;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
      width: 300px;
    }
    input, button {
      padding: 0.5rem;
      margin: 0.5rem 0;
      width: 100%;
      box-sizing: border-box;
    }
    #result {
      margin-top: 1rem;
      font-weight: bold;
      color: #1db954;
    }
  </style>
</head>
<body>
  <header>My Test Page</header>

  <div class="container">
    <h2>Enter a number</h2>
    <input id="numInput" type="number" placeholder="e.g., 42">
    <button id="calcBtn">Calculate Square</button>
    <div id="result"></div>
  </div>

  <script>
    document.getElementById('calcBtn').addEventListener('click', () => {
      const val = document.getElementById('numInput').value;
      if (val === '') {
        document.getElementById('result').textContent = 'Please enter a number.';
        return;
      }
      const num = Number(val);
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

  // Toggle Hide & Resizable Files Panel State
  const [showFileTree, setShowFileTree] = useState(true);
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

    // Notify iframe securely using current window location origin
    const targetOrigin = typeof window !== "undefined" ? window.location.origin : "*";
    window.postMessage({ type: "AETHER_UPDATE_CODE", code: targetCode }, targetOrigin);

    setSynced(true);
    setTimeout(() => setSynced(false), 2000);
  };

  const handleCodeChange = (val: string) => {
    setCodeContent(val);

    // Debounced storage write (300ms) to eliminate keystroke lag
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      localStorage.setItem("aether_live_code", val);
      // Auto-notify preview iframe in real time
      const targetOrigin = typeof window !== "undefined" ? window.location.origin : "*";
      window.postMessage({ type: "AETHER_UPDATE_CODE", code: val }, targetOrigin);
    }, 300);
  };

  return (
    <div className="flex flex-col h-full bg-[#0D1117] border border-white/10 rounded-xl overflow-hidden glass-panel">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 border-b border-white/10 bg-[#080A0F] shrink-0">
        <div className="flex items-center gap-2.5">
          <Code className="w-4 h-4 text-white shrink-0" strokeWidth={1.75} />
          <div className="text-xs font-semibold text-white flex items-center gap-2 truncate">
            <span>Code Workbench</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-400 font-mono truncate">
              {activeTab === "split"
                ? "Split View (Side-by-Side)"
                : activeTab === "code"
                ? activeFile
                : "Live Web Preview"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Toggle Hide Project Files Panel (only in Editor & Split tab) */}
          {(activeTab === "code" || activeTab === "split") && (
            <button
              onClick={() => setShowFileTree((prev) => !prev)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-white/5 border border-white/10 hover:bg-white/15 text-zinc-300 transition-colors"
              title={showFileTree ? "Hide Project Files" : "Show Project Files"}
            >
              {showFileTree ? <PanelLeftClose className="w-3.5 h-3.5" /> : <PanelLeftOpen className="w-3.5 h-3.5" />}
              <span>{showFileTree ? "Hide Files" : "Show Files"}</span>
            </button>
          )}

          {/* Run & Render Button */}
          <button
            onClick={() => handleSyncPreview()}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs bg-emerald-500 hover:bg-emerald-600 text-black font-semibold shadow-md transition-all cursor-pointer"
            title="Render code into live preview"
          >
            {synced ? <Check className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{synced ? "Rendered!" : "Run Code"}</span>
          </button>

          {/* View Mode Switcher (Editor Only / Split Side-by-Side / Live Preview Only) */}
          <div className="flex items-center bg-[#05070B] p-0.5 rounded-lg border border-white/10">
            <button
              onClick={() => setActiveTab("code")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-colors ${
                activeTab === "code" ? "bg-white text-black font-semibold shadow-sm" : "text-zinc-400 hover:text-white"
              }`}
              title="Editor Only"
            >
              <FileCode className="w-3.5 h-3.5" strokeWidth={1.75} />
              Editor
            </button>
            <button
              onClick={() => {
                handleSyncPreview();
                setActiveTab("split");
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-colors ${
                activeTab === "split" ? "bg-white text-black font-semibold shadow-sm" : "text-zinc-400 hover:text-white"
              }`}
              title="Side-by-Side Code & Live Preview with Resizable Divider"
            >
              <Columns className="w-3.5 h-3.5" strokeWidth={1.75} />
              Split View
            </button>
            <button
              onClick={() => {
                handleSyncPreview();
                setActiveTab("preview");
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-colors ${
                activeTab === "preview" ? "bg-white text-black font-semibold shadow-sm" : "text-zinc-400 hover:text-white"
              }`}
              title="Live Preview Only"
            >
              <Eye className="w-3.5 h-3.5" strokeWidth={1.75} />
              Preview
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {/* File Tree Sidebar */}
        {(activeTab === "code" || activeTab === "split") && showFileTree && (
          <>
            <div
              style={{ width: `${fileTreeWidth}px` }}
              className="border-r border-white/10 p-2.5 space-y-2 bg-[#080A0F] font-mono text-xs shrink-0 overflow-y-auto select-none"
            >
              <div className="text-[10px] text-zinc-500 uppercase font-semibold tracking-wider px-2 flex items-center justify-between">
                <span>Project Files</span>
                <button
                  onClick={() => setShowFileTree(false)}
                  className="text-zinc-500 hover:text-white text-[10px]"
                  title="Hide Project Files"
                >
                  Hide ✕
                </button>
              </div>
              <div className="space-y-0.5">
                {[
                  "index.html",
                  "apps/web/app/page.tsx",
                  "apps/web/components/AIChatStudio.tsx",
                  "packages/shared/src/schemas/index.ts",
                ].map((filePath) => (
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
                    <span className="truncate text-[11px] font-mono">{filePath.split("/").pop()}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Draggable File Tree Resize Handle */}
            <div
              onMouseDown={(e) => {
                e.preventDefault();
                setIsResizingFileTree(true);
              }}
              className="w-1.5 h-full hover:bg-white/20 cursor-col-resize shrink-0 transition-colors z-20"
              title="Drag to resize Project Files panel"
            />
          </>
        )}

        {/* Dynamic Workspace Container */}
        <div id="split-workbench-container" className="flex-1 flex bg-[#05070B] overflow-hidden relative">
          {/* Invisible Overlay Shield during Dragging to prevent iframe mouse capture */}
          {isResizingSplit && (
            <div className="fixed inset-0 z-50 cursor-col-resize select-none" />
          )}

          {/* CODE EDITOR PANE */}
          {(activeTab === "code" || activeTab === "split") && (
            <div
              style={{
                width: activeTab === "split" ? `${splitEditorWidthPercent}%` : "100%",
              }}
              className="h-full flex flex-col bg-[#05070B] overflow-hidden border-r border-white/10"
            >
              <div className="flex items-center justify-between text-[11px] text-zinc-400 font-sans border-b border-white/10 px-3 py-1.5 bg-[#080A0F] shrink-0">
                <div className="flex items-center gap-2">
                  {!showFileTree && (
                    <button
                      onClick={() => setShowFileTree(true)}
                      className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white text-[10px] flex items-center gap-1 font-mono"
                    >
                      <PanelLeftOpen className="w-3 h-3" /> Show Files
                    </button>
                  )}
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
                className="w-full flex-1 p-4 bg-transparent text-zinc-100 focus:outline-none resize-none font-mono text-xs leading-relaxed"
              />
            </div>
          )}

          {/* DRAGGABLE RESIZABLE SPLIT HANDLE (Only in Split View mode) */}
          {activeTab === "split" && (
            <div
              onMouseDown={(e) => {
                e.preventDefault();
                setIsResizingSplit(true);
              }}
              className="w-3 h-full flex items-center justify-center hover:bg-white/30 cursor-col-resize group transition-colors shrink-0 z-30 select-none bg-[#080A0F]"
              title="Drag left/right to resize Editor & Live Preview panels"
            >
              <div className="w-1 h-12 bg-white/40 group-hover:bg-white rounded-full transition-colors" />
            </div>
          )}

          {/* LIVE PREVIEW PANE */}
          {(activeTab === "preview" || activeTab === "split") && (
            <div
              style={{
                width: activeTab === "split" ? `${100 - splitEditorWidthPercent}%` : "100%",
              }}
              className="h-full flex flex-col bg-[#080A0F] overflow-hidden"
            >
              {/* Sleek Top Mini Browser Address Bar */}
              <div className="h-9 border-b border-white/10 bg-[#05070B] px-3 flex items-center justify-between text-xs text-zinc-400 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <button
                    onClick={() => setPreviewKey((prev) => prev + 1)}
                    className="p-1 hover:bg-white/10 rounded text-zinc-400 hover:text-white transition-colors flex items-center gap-1 text-[11px]"
                    title="Reload Preview"
                  >
                    <RotateCw className="w-3 h-3" /> Refresh
                  </button>
                </div>

                {/* Viewport Switcher */}
                <div className="flex items-center bg-[#0D1117] p-0.5 rounded-md border border-white/10 text-[10px]">
                  <button
                    onClick={() => setViewport("desktop")}
                    className={`p-1 rounded ${viewport === "desktop" ? "bg-white text-black font-bold" : "text-zinc-400 hover:text-white"}`}
                    title="Desktop View"
                  >
                    <Monitor className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setViewport("tablet")}
                    className={`p-1 rounded ${viewport === "tablet" ? "bg-white text-black font-bold" : "text-zinc-400 hover:text-white"}`}
                    title="Tablet View"
                  >
                    <Tablet className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setViewport("mobile")}
                    className={`p-1 rounded ${viewport === "mobile" ? "bg-white text-black font-bold" : "text-zinc-400 hover:text-white"}`}
                    title="Mobile View"
                  >
                    <Smartphone className="w-3 h-3" />
                  </button>
                </div>

                <a
                  href="/preview-frame"
                  target="_blank"
                  rel="noreferrer"
                  className="p-1 hover:bg-white/10 rounded text-zinc-400 hover:text-white transition-colors flex items-center gap-1 text-[11px]"
                  title="Open in new browser tab"
                >
                  <ExternalLink className="w-3 h-3" /> Full
                </a>
              </div>

              {/* Embedded Interactive Scrollable Frame Container */}
              <div className="flex-1 w-full h-full bg-[#05070B] overflow-auto flex items-center justify-center p-2">
                <div
                  className={`h-full transition-all duration-300 ${
                    viewport === "desktop"
                      ? "w-full"
                      : viewport === "tablet"
                      ? "w-[768px] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                      : "w-[375px] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                  }`}
                >
                  <iframe
                    key={previewKey}
                    src="/preview-frame"
                    title="Aether Live Dynamic Code Preview"
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
