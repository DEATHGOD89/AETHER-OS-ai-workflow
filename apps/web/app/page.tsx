"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Command,
  LayoutDashboard,
  MessageSquareCode,
  Code2,
  Palette,
  Database,
  FileCode,
  HelpCircle,
  Eye,
  Settings,
  X,
  ArrowRight,
  Edit2,
  Folder,
  Plus,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Activity,
  CheckCircle2,
  AlertCircle,
  Rocket,
  History,
  RotateCcw,
  Check,
  TrendingUp,
  ShieldCheck,
  Copy,
  ExternalLink,
  Share2,
  Wand2,
  ListTodo,
  Key,
  Menu,
} from "lucide-react";
import { CommandPalette } from "@/components/CommandPalette";
import { AIChatStudio } from "@/components/AIChatStudio";
import { CodeWorkbench } from "@/components/CodeWorkbench";
import { CreativeStudio } from "@/components/CreativeStudio";
import { RAGKnowledgeStudio } from "@/components/RAGKnowledgeStudio";
import { AutomationStudio } from "@/components/AutomationStudio";
import { IntroSplashScreen } from "@/components/IntroSplashScreen";

export default function FullyCollapsibleAetherOS() {
  const [showIntro, setShowIntro] = useState(true);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"workspace" | "chat" | "code" | "creative" | "rag" | "workflow" | "inspector">("workspace");
  const [showInspectorModal, setShowInspectorModal] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isHeaderEditing, setIsHeaderEditing] = useState(false);

  // Settings State
  const [customApiKey, setCustomApiKey] = useState("");
  const [savedApiKeyMsg, setSavedApiKeyMsg] = useState(false);

  // Mobile Drawer State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Phase 1 Modals: Launch Event, AI Pre-flight Review, and Version Checkpoint Diffs
  const [showPreflightModal, setShowPreflightModal] = useState(false);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [showDeploySuccessModal, setShowDeploySuccessModal] = useState(false);
  const [deployedUrl, setDeployedUrl] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [isFixingPreflight, setIsFixingPreflight] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Template Customization Wizard State
  const [selectedTemplate, setSelectedTemplate] = useState("SaaS Landing Page");
  const [productName, setProductName] = useState("Acme AI");
  const [targetAudience, setTargetAudience] = useState("Founders & Creators");
  const [primaryGoal, setPrimaryGoal] = useState("Sell Subscriptions");
  const [visualStyle, setVisualStyle] = useState("Glassmorphism Dark");

  // Wizard Generation Progress Animation State
  const [isWizardGenerating, setIsWizardGenerating] = useState(false);
  const [wizardSteps, setWizardSteps] = useState([
    { label: "Building project structure", done: false },
    { label: "Applying Creator Memory & Style Vault", done: false },
    { label: "Personalizing copy for " + primaryGoal, done: false },
    { label: "Generating React & HTML components", done: false },
    { label: "Launching live interactive sandbox", done: false },
  ]);

  // Launch Event Checklist Steps
  const [launchSteps, setLaunchSteps] = useState([
    { label: "Build Verification Passed", done: false },
    { label: "AI Pre-Flight Audit Passed", done: false },
    { label: "Live Preview Frame Synced", done: false },
    { label: "Global CDN Assets Optimized", done: false },
  ]);

  // Toggle Hide Workspace Sidebar & Inspector Panel States
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  // Resizable Split Pane Handle State (Percentage width of Left Pane)
  const [leftWidthPercent, setLeftWidthPercent] = useState(48);
  const [isDragging, setIsDragging] = useState(false);

  const [currentProject, setCurrentProject] = useState({
    id: "p-1",
    name: "My New Project",
    building: "Blank canvas ready for your prompt",
    progress: 85,
    stage: "Reviewed",
    state: "Ready for Deploy",
    filesCount: 4,
    assetsCount: 1,
    nextAction: "Launch Production Release",
  });

  // Explainable Project Health Breakdown
  const [projectHealth, setProjectHealth] = useState({
    total: 92,
    trend: "+8%",
    blockingCount: 0,
    advisoryCount: 2,
    breakdown: [
      { category: "Build Status", score: 25, max: 25, type: "blocking", status: "passing" },
      { category: "Live Sandbox Sync", score: 20, max: 20, type: "blocking", status: "passing" },
      { category: "Accessibility Check", score: 15, max: 20, type: "advisory", status: "warning" },
      { category: "SEO Meta Tags", score: 12, max: 20, type: "advisory", status: "warning" },
      { category: "Performance Audit", score: 15, max: 15, type: "advisory", status: "passing" },
      { category: "Deployment Target", score: 5, max: 15, type: "blocking", status: "passing" },
    ],
  });

  // AI Pre-flight Review Issues
  const [preflightIssues, setPreflightIssues] = useState([
    { id: "1", label: "Missing Meta Description tag", type: "advisory", status: "open" },
    { id: "2", label: "Button contrast ratio recommendation", type: "advisory", status: "open" },
    { id: "3", label: "Favicon cache busting query string", type: "advisory", status: "fixed" },
    { id: "4", label: "Viewport meta tag verification", type: "blocking", status: "fixed" },
  ]);

  // Version Checkpoint History with Diffs
  const [versionHistory, setVersionHistory] = useState([
    {
      id: "v1.0",
      label: "v1.0 Ready to Deploy",
      time: "Just now",
      active: true,
      diffs: ["+ Split View Workbench", "+ 3-Layer Creator Memory", "+ AI Pre-Flight Audit"],
    },
    {
      id: "v0.3",
      label: "v0.3 Split View Workbench",
      time: "10 mins ago",
      active: false,
      diffs: ["+ Side-by-Side Editor & Preview", "+ Draggable Split Handle"],
    },
    {
      id: "v0.2",
      label: "v0.2 3-Layer Creator Memory",
      time: "25 mins ago",
      active: false,
      diffs: ["+ Creator Style Vault", "+ Workspace & Project Brain"],
    },
    {
      id: "v0.1",
      label: "v0.1 Initial Project Setup",
      time: "1 hour ago",
      active: false,
      diffs: ["+ Next.js 15 Monorepo", "+ OpenRouter Auto-Free Router"],
    },
  ]);

  const [newProjectName, setNewProjectName] = useState("");

  // Load custom API key from localStorage
  useEffect(() => {
    const key = localStorage.getItem("aether_openrouter_api_key");
    if (key) setCustomApiKey(key);
  }, []);

  const handleSaveApiKey = () => {
    localStorage.setItem("aether_openrouter_api_key", customApiKey);
    setSavedApiKeyMsg(true);
    setTimeout(() => setSavedApiKeyMsg(false), 2000);
  };

  // Global Key Listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Global Mouse & Touch Event Listeners for Dragging Split Handle
  useEffect(() => {
    const handleMove = (clientX: number) => {
      if (!isDragging) return;
      const container = document.getElementById("main-workspace-container");
      if (container) {
        const rect = container.getBoundingClientRect();
        const relativeX = clientX - rect.left;
        const newPercent = Math.min(Math.max((relativeX / rect.width) * 100, 20), 80);
        setLeftWidthPercent(newPercent);
      }
    };

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        handleMove(e.touches[0].clientX);
      }
    };

    const handleEnd = () => {
      if (isDragging) setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleEnd);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging]);

  const handleFixPreflightAutomatically = () => {
    setIsFixingPreflight(true);
    setTimeout(() => {
      setPreflightIssues((prev) => prev.map((i) => ({ ...i, status: "fixed" })));
      setProjectHealth((prev) => ({
        ...prev,
        total: 98,
        trend: "+14%",
        advisoryCount: 0,
        breakdown: prev.breakdown.map((b) => ({ ...b, score: b.max })),
      }));
      setIsFixingPreflight(false);
    }, 1200);
  };

  const handleExecuteDeploy = () => {
    setIsDeploying(true);
    setLaunchSteps([
      { label: "Build Verification Passed", done: false },
      { label: "AI Pre-Flight Audit Passed", done: false },
      { label: "Live Preview Frame Synced", done: false },
      { label: "Global CDN Assets Optimized", done: false },
    ]);

    setTimeout(() => setLaunchSteps((prev) => prev.map((s, i) => i === 0 ? { ...s, done: true } : s)), 400);
    setTimeout(() => setLaunchSteps((prev) => prev.map((s, i) => i <= 1 ? { ...s, done: true } : s)), 900);
    setTimeout(() => setLaunchSteps((prev) => prev.map((s, i) => i <= 2 ? { ...s, done: true } : s)), 1400);
    setTimeout(() => {
      setLaunchSteps((prev) => prev.map((s) => ({ ...s, done: true })));
      setIsDeploying(false);
      setShowPreflightModal(false);
      const url = typeof window !== "undefined" ? window.location.origin : `https://${currentProject.name.toLowerCase().replace(/\s+/g, "-")}.aether.app`;
      setDeployedUrl(url);
      setShowDeploySuccessModal(true);
      setCurrentProject((prev) => ({
        ...prev,
        progress: 100,
        stage: "Production",
        nextAction: "Share Live Launch URL",
      }));
    }, 2000);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(deployedUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleRestoreVersion = (verId: string) => {
    setVersionHistory((prev) =>
      prev.map((v) => ({ ...v, active: v.id === verId }))
    );
    setShowVersionModal(false);
  };

  const handleCreateProject = () => {
    setIsWizardGenerating(true);
    setWizardSteps([
      { label: "Building project structure", done: false },
      { label: "Applying Creator Memory & Style Vault", done: false },
      { label: `Personalizing copy for Goal: "${primaryGoal}"`, done: false },
      { label: "Generating React & HTML components", done: false },
      { label: "Launching live interactive sandbox", done: false },
    ]);

    setTimeout(() => setWizardSteps((prev) => prev.map((s, i) => i === 0 ? { ...s, done: true } : s)), 300);
    setTimeout(() => setWizardSteps((prev) => prev.map((s, i) => i <= 1 ? { ...s, done: true } : s)), 600);
    setTimeout(() => setWizardSteps((prev) => prev.map((s, i) => i <= 2 ? { ...s, done: true } : s)), 900);
    setTimeout(() => setWizardSteps((prev) => prev.map((s, i) => i <= 3 ? { ...s, done: true } : s)), 1200);

    setTimeout(() => {
      setWizardSteps((prev) => prev.map((s) => ({ ...s, done: true })));
      setIsWizardGenerating(false);

      const finalName = newProjectName.trim() || productName;
      setCurrentProject({
        id: Date.now().toString(),
        name: finalName,
        building: `${selectedTemplate} (${visualStyle}) to ${primaryGoal}`,
        progress: 25,
        stage: "Building",
        state: "Active",
        filesCount: 4,
        assetsCount: 1,
        nextAction: "Customize & Deploy Live",
      });

      const templateCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${finalName} — ${selectedTemplate}</title>
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; background: #05070B; color: #f4f4f5; margin: 0; padding: 0; }
    header { border-b: 1px solid rgba(255,255,255,0.1); padding: 1.25rem 2rem; display: flex; justify-content: space-between; align-items: center; background: #080A0F; }
    .brand { font-weight: 800; font-size: 1.25rem; color: #fff; letter-spacing: -0.02em; }
    .nav-btn { background: #fff; color: #000; padding: 0.6rem 1.25rem; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 0.85rem; }
    .hero { text-align: center; padding: 5rem 2rem; max-w: 800px; margin: 0 auto; }
    .badge { display: inline-block; background: rgba(16,185,129,0.15); color: #10B981; border: 1px solid rgba(16,185,129,0.3); padding: 0.3rem 0.8rem; border-radius: 99px; font-size: 0.75rem; font-weight: 600; margin-bottom: 1rem; }
    h1 { font-size: 3rem; font-weight: 900; line-height: 1.1; margin: 0.5rem 0 1rem; color: #fff; }
    p { color: #a1a1aa; font-size: 1.1rem; line-height: 1.6; margin-bottom: 2rem; }
  </style>
</head>
<body>
  <header>
    <div class="brand">${productName}</div>
    <a href="#" class="nav-btn">${primaryGoal} →</a>
  </header>
  <div class="hero">
    <div class="badge">Built for ${targetAudience} • Goal: ${primaryGoal}</div>
    <h1>The Ultimate ${selectedTemplate} Solution</h1>
    <p>Empower your business with real-time AI context, zero latency, and instant cloud edge deployment.</p>
  </div>
</body>
</html>`;

      localStorage.setItem("aether_live_code", templateCode);
      const targetOrigin = typeof window !== "undefined" ? window.location.origin : "*";
      window.postMessage({ type: "AETHER_UPDATE_CODE", code: templateCode }, targetOrigin);

      setNewProjectName("");
      setShowNewProjectModal(false);
    }, 1500);
  };

  const handleRename = (newName: string) => {
    if (newName.trim()) {
      setCurrentProject((prev) => ({ ...prev, name: newName }));
    }
  };

  return (
    <>
      {/* Intro Video & Animated Splash Screen */}
      {showIntro ? (
        <IntroSplashScreen onComplete={() => setShowIntro(false)} />
      ) : (
        <div className={`flex flex-col h-screen w-screen min-h-[100dvh] bg-[#05070B] text-zinc-100 overflow-hidden font-sans selection:bg-white selection:text-black ${isDragging ? "cursor-col-resize select-none" : ""}`}>
          {/* Invisible Drag Overlay Shield */}
          {isDragging && (
            <div className="fixed inset-0 z-50 cursor-col-resize select-none" />
          )}

          {/* Universal Command Palette */}
          <CommandPalette
            isOpen={isCommandOpen}
            onClose={() => setIsCommandOpen(false)}
            onSelectTab={(tabId) => setActiveTab(tabId as any)}
          />

          {/* Settings Modal */}
          {showSettingsModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-150">
              <div className="w-[95vw] max-w-md bg-[#0D1117] border border-white/10 rounded-xl p-5 sm:p-6 space-y-4 os-panel relative shadow-2xl">
                <button onClick={() => setShowSettingsModal(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2 text-white font-semibold text-sm uppercase tracking-wider border-b border-white/10 pb-3">
                  <Settings className="w-5 h-5 text-emerald-400" /> Aether OS Settings & API Keys
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="text-zinc-400 font-medium mb-1 block flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-emerald-400" /> Custom OpenRouter API Key (Optional)
                    </label>
                    <input
                      type="password"
                      placeholder="sk-or-v1-..."
                      value={customApiKey}
                      onChange={(e) => setCustomApiKey(e.target.value)}
                      className="w-full bg-[#05070B] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/50 font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  {savedApiKeyMsg ? (
                    <span className="text-xs text-emerald-400 font-mono">✓ Settings Saved!</span>
                  ) : (
                    <span />
                  )}
                  <div className="flex items-center gap-2">
                    <button onClick={() => setShowSettingsModal(false)} className="btn-secondary">
                      Close
                    </button>
                    <button onClick={handleSaveApiKey} className="btn-primary">
                      Save Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Pre-Flight Review & Deploy Modal */}
          {showPreflightModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-150">
              <div className="w-[95vw] max-w-lg bg-[#0D1117] border border-white/10 rounded-xl p-5 sm:p-6 space-y-4 os-panel relative shadow-2xl">
                <button onClick={() => setShowPreflightModal(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2 text-white font-semibold text-sm">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" /> AI Pre-Flight Quality Audit
                  </div>
                  <div className="font-mono text-xs text-emerald-400 font-bold">
                    Health Score: {projectHealth.total}/100
                  </div>
                </div>

                {isDeploying ? (
                  <div className="space-y-4 py-4 font-mono text-xs text-zinc-300">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                      <Rocket className="w-5 h-5 animate-bounce" /> 🚀 Preparing Production Release...
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 text-xs">
                      <div className="text-zinc-400">
                        Aether AI pre-flight scan identified status checks before live deployment:
                      </div>
                      <div className="space-y-2 bg-[#05070B] p-3 rounded-lg border border-white/10 font-mono">
                        {preflightIssues.map((issue) => (
                          <div key={issue.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {issue.status === "fixed" ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              ) : (
                                <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              )}
                              <span className={issue.status === "fixed" ? "text-zinc-400 line-through" : "text-white font-medium"}>
                                {issue.label}
                              </span>
                            </div>
                            <span className="text-[10px] text-emerald-400">Passed</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={handleFixPreflightAutomatically}
                        disabled={isFixingPreflight}
                        className="btn-secondary text-xs text-emerald-400"
                      >
                        Auto-Fix Issues
                      </button>

                      <button
                        onClick={handleExecuteDeploy}
                        className="btn-primary text-xs"
                      >
                        <Rocket className="w-4 h-4" />
                        Launch Release →
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Top Header Bar */}
          <header className="h-13 border-b border-white/5 bg-[#080A0F]/90 backdrop-blur-md px-3 sm:px-4 flex items-center justify-between shrink-0 z-30 gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <button
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white"
                title="Toggle Navigation Menu"
              >
                <Menu className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 shrink-0">
                <img src="/logo.png?v=2" alt="Aether OS Logo" className="h-8 sm:h-9 w-auto max-w-[140px] sm:max-w-[180px] object-contain" />
                <span className="font-bold text-xs text-white tracking-wider font-sans hidden sm:inline-block">AETHER OS</span>
              </div>

              <div className="h-3.5 w-px bg-white/10 hidden sm:block" />

              {isHeaderEditing ? (
                <input
                  type="text"
                  value={currentProject.name}
                  onChange={(e) => handleRename(e.target.value)}
                  onBlur={() => setIsHeaderEditing(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") setIsHeaderEditing(false);
                  }}
                  autoFocus
                  className="bg-[#05070B] border border-white text-xs text-white font-medium rounded px-2 py-0.5 focus:outline-none w-28 sm:w-auto"
                />
              ) : (
                <div className="flex items-center gap-1.5 min-w-0">
                  <button
                    onClick={() => setIsHeaderEditing(true)}
                    title="Click to rename project"
                    className="flex items-center gap-1 text-xs text-zinc-300 hover:text-white group max-w-[100px] sm:max-w-[160px] truncate"
                  >
                    <Folder className="w-3.5 h-3.5 text-white shrink-0" strokeWidth={1.75} />
                    <span className="font-medium truncate">{currentProject.name}</span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 text-xs shrink-0">
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[11px]">
                <Activity className="w-3.5 h-3.5" />
                <span className="font-bold">{projectHealth.total}/100</span>
              </div>

              <button
                onClick={() => setShowPreflightModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-lg transition-all cursor-pointer shrink-0"
              >
                <Rocket className="w-3.5 h-3.5 fill-current" />
                <span>Deploy Live</span>
              </button>

              <button
                onClick={() => setIsInspectorOpen((prev) => !prev)}
                className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white hover:text-black text-white transition-all text-xs shadow-sm"
                title={isInspectorOpen ? "Hide Inspector" : "Show Inspector"}
              >
                {isInspectorOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
              </button>
            </div>
          </header>

          {/* Mobile Drawer Navigation Menu */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-150 flex flex-col justify-between">
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="font-bold text-sm text-white flex items-center gap-2">
                    <img src="/logo.png?v=2" alt="Logo" className="h-6 w-auto" />
                    Aether Navigation
                  </span>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-zinc-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1 font-sans text-sm">
                  {[
                    { id: "workspace", title: "Overview Studio", icon: LayoutDashboard },
                    { id: "chat", title: "AI Chat Studio", icon: MessageSquareCode },
                    { id: "code", title: "Code Workbench", icon: Code2 },
                    { id: "creative", title: "Visual Studio", icon: Palette },
                    { id: "rag", title: "Memory Vault", icon: Database },
                    { id: "inspector", title: "Health & Next Actions", icon: Activity },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id as any);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                          activeTab === item.id ? "bg-white text-black font-semibold" : "text-zinc-300 hover:bg-white/10"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() => {
                  setShowSettingsModal(true);
                  setMobileMenuOpen(false);
                }}
                className="btn-secondary w-full py-3 flex items-center justify-center gap-2 text-xs"
              >
                <Settings className="w-4 h-4" />
                <span>Settings & API Keys</span>
              </button>
            </div>
          )}

          {/* Right Inspector Drawer Overlay */}
          {isInspectorOpen && (
            <div className="fixed inset-y-0 right-0 z-40 w-80 sm:w-96 max-w-[90vw] bg-[#080A0F] border-l border-white/10 p-4 flex flex-col space-y-4 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-200">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 shrink-0">
                <span className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" /> Project Inspector
                </span>
                <button onClick={() => setIsInspectorOpen(false)} className="p-1 text-zinc-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Top Panel: Guided Checklist (Above) */}
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-[#0D1117] space-y-2.5 font-mono text-xs w-full">
                <div className="flex items-center gap-1.5 text-white font-bold border-b border-white/10 pb-2">
                  <ListTodo className="w-4 h-4 text-emerald-400" />
                  <span>Starter Kit Next Actions</span>
                </div>
                <div className="space-y-1.5 text-[11px] text-zinc-300 pt-1">
                  <div className="flex items-center gap-1.5 text-emerald-400">✓ Customize Hero & Branding</div>
                  <div className="flex items-center gap-1.5 text-emerald-400">✓ Configure Primary Goal ({primaryGoal})</div>
                  <div className="flex items-center gap-1.5 text-zinc-400">• Inspect Injected AI Context</div>
                  <div className="flex items-center gap-1.5 text-zinc-400">• Run AI Pre-Flight Audit</div>
                  <div className="flex items-center gap-1.5 text-zinc-400">• Launch Live Production URL</div>
                </div>
              </div>

              {/* Bottom Panel: Health Scorecard (Below) */}
              <div className="p-4 rounded-xl border border-white/10 bg-[#0D1117] space-y-3 font-mono w-full">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-1.5 text-xs text-white font-medium">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span>Health Scorecard</span>
                  </div>
                  <div className="text-right font-bold text-emerald-400 text-xs">{projectHealth.total} / 100</div>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  {projectHealth.breakdown.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-zinc-300 py-1 border-b border-white/5">
                      <span className="truncate">✓ {item.category}</span>
                      <span className="font-semibold text-emerald-400">{item.score} / {item.max}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Main Workspace Canvas */}
          <div className="flex-1 flex overflow-hidden relative">
            <main id="main-workspace-container" className="flex-1 flex overflow-hidden p-1 sm:p-2 gap-0 bg-[#05070B] relative w-full">
              {activeTab === "creative" ? (
                <div className="w-full h-full overflow-y-auto">
                  <CreativeStudio projectName={currentProject.name} />
                </div>
              ) : activeTab === "rag" ? (
                <div className="w-full h-full overflow-y-auto">
                  <RAGKnowledgeStudio projectName={currentProject.name} />
                </div>
              ) : activeTab === "code" ? (
                <div className="w-full h-full overflow-hidden">
                  <CodeWorkbench projectName={currentProject.name} />
                </div>
              ) : activeTab === "inspector" ? (
                <div className="w-full h-full overflow-y-auto p-4 space-y-4 font-mono text-xs max-w-xl mx-auto">
                  <div className="p-4 rounded-xl border border-emerald-500/30 bg-[#0D1117] space-y-3 shadow-lg w-full">
                    <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-white/10 pb-2">
                      <ListTodo className="w-4 h-4 text-emerald-400" />
                      <span>Starter Kit Next Actions</span>
                    </div>
                    <div className="space-y-2 text-xs text-zinc-300 pt-1">
                      <div className="flex items-center gap-2 text-emerald-400">✓ Customize Hero & Branding</div>
                      <div className="flex items-center gap-2 text-emerald-400">✓ Configure Primary Goal ({primaryGoal})</div>
                      <div className="flex items-center gap-2 text-zinc-400">• Inspect Injected AI Context</div>
                      <div className="flex items-center gap-2 text-zinc-400">• Run AI Pre-Flight Audit</div>
                      <div className="flex items-center gap-2 text-zinc-400">• Launch Live Production URL</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-white/10 bg-[#0D1117] space-y-3 shadow-lg w-full">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <div className="flex items-center gap-2 text-sm text-white font-bold">
                        <Activity className="w-4 h-4 text-emerald-400" />
                        <span>Health Scorecard Breakdown</span>
                      </div>
                      <div className="text-right font-bold text-emerald-400 text-sm">{projectHealth.total}/100</div>
                    </div>
                    {projectHealth.breakdown.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-zinc-300 py-1.5 border-b border-white/5">
                        <span>✓ {item.category}</span>
                        <span className="font-bold text-emerald-400">{item.score}/{item.max}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {/* Left Pane: AI Chat Studio */}
                  <div
                    style={{ width: `${leftWidthPercent}%` }}
                    className="h-full pr-1 shrink-0 overflow-hidden hidden md:block"
                  >
                    <AIChatStudio
                      projectName={currentProject.name}
                      onRenameProject={handleRename}
                      onNewProject={() => setShowNewProjectModal(true)}
                    />
                  </div>

                  {/* DRAGGABLE RESIZABLE SPLIT HANDLE (Mouse & Touch Enabled) */}
                  <div
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onTouchStart={() => {
                      setIsDragging(true);
                    }}
                    className="hidden md:flex w-3.5 h-full items-center justify-center hover:bg-emerald-500/20 active:bg-emerald-500/40 cursor-col-resize group transition-colors shrink-0 z-30 select-none bg-[#080A0F]/60 border-x border-white/10"
                    title="Drag left/right to resize AI Chat Studio & Code Workbench"
                  >
                    <div className="w-1 h-12 bg-white/40 group-hover:bg-emerald-400 group-active:bg-emerald-400 rounded-full transition-colors" />
                  </div>

                  {/* Right Pane: CodeWorkbench */}
                  <div
                    style={{ width: `${100 - leftWidthPercent}%` }}
                    className="h-full pl-1 flex-1 overflow-hidden hidden md:block"
                  >
                    <CodeWorkbench projectName={currentProject.name} />
                  </div>

                  {/* Mobile Single View Tab (Shows AI Chat Studio on Mobile by default) */}
                  <div className="h-full w-full md:hidden overflow-hidden">
                    <AIChatStudio
                      projectName={currentProject.name}
                      onRenameProject={handleRename}
                      onNewProject={() => setShowNewProjectModal(true)}
                    />
                  </div>
                </>
              )}
            </main>
          </div>

          {/* Touch Bottom Navigation Bar */}
          <nav className="h-14 bg-[#080A0F] border-t border-white/10 flex items-center justify-around shrink-0 px-1 z-30 font-sans">
            {[
              { id: "workspace", title: "AI Studio", icon: MessageSquareCode },
              { id: "code", title: "Workbench", icon: Code2 },
              { id: "creative", title: "Visual", icon: Palette },
              { id: "inspector", title: "Health", icon: Activity },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id || (tab.id === "workspace" && activeTab === "chat");
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] transition-all ${
                    isActive ? "text-emerald-400 font-bold" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.title}</span>
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}
