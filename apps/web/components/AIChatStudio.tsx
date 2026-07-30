"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Paperclip, Cpu, MessageSquareCode, CheckCircle2, RefreshCw, Edit2, Check, Folder, Square, AlertTriangle, X, Plus, Sparkles, ShieldCheck, Layers3, Eye, FileText, Zap, Lightbulb } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  model?: string;
  latencyMs?: number;
  tokens?: number;
}

export function AIChatStudio({
  projectName,
  onRenameProject,
  onNewProject,
}: {
  projectName: string;
  onRenameProject?: (newName: string) => void;
  onNewProject?: () => void;
}) {
  const [selectedModel, setSelectedModel] = useState("openrouter/free");
  const [provider, setProvider] = useState<"cloud" | "local">("cloud");
  const [inputPrompt, setInputPrompt] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [enableRAG, setEnableRAG] = useState(true);
  const [fallbackTriggered, setFallbackTriggered] = useState(false);
  const [lastLatency, setLastLatency] = useState<number | null>(null);

  // Proactive Context-Aware Suggestions State
  const [proactiveNudges, setProactiveNudges] = useState([
    { id: "1", text: "Add pricing comparison cards to boost conversions", action: "Add pricing section" },
    { id: "2", text: "Generate missing SEO metadata & OpenGraph tags", action: "Generate SEO tags" },
    { id: "3", text: "Add customer testimonials carousel for social proof", action: "Add testimonials" },
  ]);

  // Active Memory Layer Tab in Modal
  const [activeMemoryLayer, setActiveMemoryLayer] = useState<"global" | "workspace" | "project">("global");

  // 3-Layer Memory Architecture
  const [memoryHierarchy, setMemoryHierarchy] = useState({
    global: {
      profile: "SaaS Startup",
      theme: "Dark Obsidian / Pure White",
      font: "Inter & JetBrains Mono",
      framework: "Next.js 15 & Tailwind CSS",
      tone: "Concise & Technical",
    },
    workspace: {
      companyName: "Acme Creator Studio",
      primaryColor: "#FFFFFF",
      brandVoice: "Modern & Minimal",
    },
    projectBrain: {
      auth: "NextAuth / Clerk",
      database: "Prisma & PostgreSQL",
      currentSprint: "MVP Launch Readiness",
    },
  });

  // Lightweight Project Brief State
  const [projectBrief, setProjectBrief] = useState({
    targetAudience: "Indie Developers & SaaS Creators",
    goal: "Launch high-performance AI Web Applications",
    stage: "Build Stage",
    constraints: "Strict TypeScript & Zero Lag UI",
  });

  // Temporary Override Input State
  const [tempOverride, setTempOverride] = useState("");

  // Inspect Injected AI Context Modal State with Source Attribution & Intent Confidence
  const [showInjectedContextModal, setShowInjectedContextModal] = useState(false);
  const [lastInjectedInfo, setLastInjectedInfo] = useState({
    intent: "UI Design & Component Layout",
    confidence: "High (94%)",
    whyReason: "Your prompt contained 'dashboard', 'layout', or 'button', so UI preferences were injected.",
    sourceTable: [
      { context: "Next.js 15 & Tailwind", source: "Global Creator Vault" },
      { context: "Dark Obsidian Theme", source: "Global Creator Vault" },
      { context: "Acme Brand Voice", source: "Workspace Vault" },
      { context: "Prisma & PostgreSQL", source: "Project Brain" },
      { context: "Indie Developers", source: "Project Brief" },
    ] as { context: string; source: string }[],
  });

  const [showVaultModal, setShowVaultModal] = useState(false);
  const [showBriefModal, setShowBriefModal] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Editable Project Name State
  const [isEditingName, setIsEditingName] = useState(false);
  const [currentName, setCurrentName] = useState(projectName);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `Welcome to **${currentName}**! I am your AI co-pilot powered by OpenRouter Free Auto-Router.\n\n📋 **Lightweight Brief**: Target: *${projectBrief.targetAudience}* | Goal: *${projectBrief.goal}*\n🧠 **Context Attributed**: Next.js 15, Tailwind, Inter, Dark Obsidian.`,
      timestamp: "Just now",
      model: "OpenRouter Auto-Free Router",
    },
  ]);

  // Load 3-Layer Memory & Project Brief from localStorage
  useEffect(() => {
    const savedHierarchy = localStorage.getItem("aether_memory_hierarchy");
    if (savedHierarchy) {
      try {
        setMemoryHierarchy(JSON.parse(savedHierarchy));
      } catch {}
    }
    const savedBrief = localStorage.getItem(`aether_project_brief_${currentName}`);
    if (savedBrief) {
      try {
        setProjectBrief(JSON.parse(savedBrief));
      } catch {}
    }
  }, [currentName]);

  const handleSaveMemory = (updated: typeof memoryHierarchy) => {
    setMemoryHierarchy(updated);
    localStorage.setItem("aether_memory_hierarchy", JSON.stringify(updated));
    setShowVaultModal(false);
  };

  const handleSaveBrief = (updatedBrief: typeof projectBrief) => {
    setProjectBrief(updatedBrief);
    localStorage.setItem(`aether_project_brief_${currentName}`, JSON.stringify(updatedBrief));
    setShowBriefModal(false);
  };

  const applyProfilePreset = (profileName: string) => {
    let updatedGlobal = { ...memoryHierarchy.global, profile: profileName };
    if (profileName === "SaaS Startup") {
      updatedGlobal = { ...updatedGlobal, theme: "Dark Obsidian / Pure White", font: "Inter & JetBrains Mono", framework: "Next.js 15 & Tailwind" };
    } else if (profileName === "Indie Portfolio") {
      updatedGlobal = { ...updatedGlobal, theme: "Pitch Black & Emerald Accent", font: "Outfit & Fira Code", framework: "Vite & React" };
    } else if (profileName === "Minimal Landing Page") {
      updatedGlobal = { ...updatedGlobal, theme: "Pure Monochrome White", font: "Geist & Geist Mono", framework: "HTML5 & Vanilla CSS" };
    }
    const full = { ...memoryHierarchy, global: updatedGlobal };
    handleSaveMemory(full);
  };

  const handleSaveName = () => {
    setIsEditingName(false);
    if (currentName.trim() && onRenameProject) {
      onRenameProject(currentName);
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
    }
  };

  const handleNudgeClick = (promptText: string) => {
    setInputPrompt(promptText);
    setProactiveNudges((prev) => prev.filter((n) => n.action !== promptText));
  };

  const handleSend = async () => {
    if (!inputPrompt.trim() || isStreaming) return;

    if (inputPrompt.length > 20000) {
      alert("Prompt exceeds maximum length limit of 20,000 characters.");
      return;
    }

    const userMsgText = inputPrompt;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt("");
    setIsStreaming(true);
    setFallbackTriggered(false);

    const assistantMsgId = (Date.now() + 1).toString();
    const startTime = Date.now();

    // Add placeholder assistant message for streaming
    setMessages((prev) => [
      ...prev,
      {
        id: assistantMsgId,
        role: "assistant",
        content: "",
        timestamp: "Generating...",
        model: selectedModel,
      },
    ]);

    abortControllerRef.current = new AbortController();

    try {
      // Intent & Confidence Detection Logic
      const isUIQuery = /ui|page|component|css|design|button|theme|layout|color|font|dashboard/i.test(userMsgText);
      const isBackendQuery = /backend|api|database|prisma|auth|server|sql/i.test(userMsgText);

      let intent = "General Intent";
      let confidence = "High (90%)";
      let whyReason = `Prompt processed for general software development context.`;

      const sourceTable: { context: string; source: string }[] = [
        { context: `Target: "${projectBrief.targetAudience}"`, source: "Project Brief" },
        { context: `Goal: "${projectBrief.goal}"`, source: "Project Brief" },
      ];

      let contextDirectives = `Project Brief: Name "${currentName}", Target: "${projectBrief.targetAudience}", Goal: "${projectBrief.goal}". `;

      if (isUIQuery) {
        intent = "UI Design & Component Layout";
        confidence = "High (96%)";
        whyReason = `Prompt contained UI keywords ('dashboard', 'component', 'theme', or 'button'), so UI preferences were injected.`;
        sourceTable.push(
          { context: `Theme: ${memoryHierarchy.global.theme}`, source: "Global Creator Vault" },
          { context: `Font: ${memoryHierarchy.global.font}`, source: "Global Creator Vault" },
          { context: `Brand Voice: ${memoryHierarchy.workspace.brandVoice}`, source: "Workspace Vault" }
        );
        contextDirectives += `UI PREFERENCES: Theme: ${memoryHierarchy.global.theme}, Font: ${memoryHierarchy.global.font}, Brand: ${memoryHierarchy.workspace.brandVoice}. `;
      } else if (isBackendQuery) {
        intent = "Backend & Database Architecture";
        confidence = "High (92%)";
        whyReason = `Prompt contained backend keywords ('api', 'database', or 'server'), so DB & Auth preferences were injected.`;
        sourceTable.push(
          { context: `Framework: ${memoryHierarchy.global.framework}`, source: "Global Creator Vault" },
          { context: `Auth: ${memoryHierarchy.projectBrain.auth}`, source: "Project Brain" },
          { context: `Database: ${memoryHierarchy.projectBrain.database}`, source: "Project Brain" }
        );
        contextDirectives += `BACKEND PREFERENCES: Tech: ${memoryHierarchy.global.framework}, Auth: ${memoryHierarchy.projectBrain.auth}, DB: ${memoryHierarchy.projectBrain.database}. `;
      } else {
        sourceTable.push(
          { context: `Framework: ${memoryHierarchy.global.framework}`, source: "Global Creator Vault" }
        );
      }

      // Append Temporary Override if specified by user
      if (tempOverride.trim()) {
        sourceTable.push({ context: tempOverride.trim(), source: "Temporary Override" });
        contextDirectives += `TEMPORARY OVERRIDE (Current Request Only): ${tempOverride.trim()}. `;
        whyReason += ` Includes active Temporary Override: "${tempOverride.trim()}".`;
      }

      setLastInjectedInfo({
        intent,
        confidence,
        whyReason,
        sourceTable,
      });

      const historyPayload = [
        {
          role: "system",
          content: `You are Aether AI Co-pilot. ${contextDirectives} Tone: ${memoryHierarchy.global.tone}. Be concise, clean, and helpful.`,
        },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content: userMsgText },
      ];

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: selectedModel,
          messages: historyPayload,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      if (!response.body) {
        throw new Error("ReadableStream not supported by browser.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter((l) => l.trim().startsWith("data: "));

        for (const line of lines) {
          const jsonStr = line.replace(/^data:\s*/, "").trim();
          if (jsonStr === "[DONE]") continue;

          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content || "";
            fullContent += delta;

            setMessages((prev) => {
              if (prev.length === 0) return prev;
              const copy = [...prev];
              const lastIdx = copy.length - 1;
              if (copy[lastIdx].id === assistantMsgId) {
                copy[lastIdx] = {
                  ...copy[lastIdx],
                  content: fullContent,
                  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  model: parsed.model || selectedModel,
                };
              }
              return copy;
            });
          } catch {
            // Ignore non-JSON chunk noise
          }
        }
      }

      const elapsed = Date.now() - startTime;
      setLastLatency(elapsed);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId
            ? {
                ...msg,
                latencyMs: elapsed,
                tokens: Math.round(fullContent.length / 4),
              }
            : msg
        )
      );
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Generation stopped by user.");
      } else {
        console.warn("OpenRouter server API failed:", err.message);
        setFallbackTriggered(true);

        const elapsed = Date.now() - startTime;
        setLastLatency(elapsed);

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId
              ? {
                  ...msg,
                  content: `Selected model is unavailable.\n\nReason: ${err.message}\n\nSuggestion: Switch to OpenRouter Auto-Free Router in the dropdown.`,
                  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  latencyMs: elapsed,
                }
              : msg
          )
        );
      }
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0D1117] border border-white/10 rounded-xl overflow-hidden glass-panel relative">
      {/* Lightweight Project Brief Modal */}
      {showBriefModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#0D1117] border border-white/10 rounded-xl p-6 space-y-4 os-panel relative shadow-2xl">
            <button onClick={() => setShowBriefModal(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 text-white font-medium text-xs uppercase tracking-wider">
              <FileText className="w-4 h-4 text-emerald-400" /> Lightweight Project Brief
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 font-medium mb-1 block">Audience</label>
                <input
                  type="text"
                  value={projectBrief.targetAudience}
                  onChange={(e) => setProjectBrief({ ...projectBrief, targetAudience: e.target.value })}
                  className="w-full bg-[#05070B] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-zinc-400 font-medium mb-1 block">Goal</label>
                <input
                  type="text"
                  value={projectBrief.goal}
                  onChange={(e) => setProjectBrief({ ...projectBrief, goal: e.target.value })}
                  className="w-full bg-[#05070B] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-zinc-400 font-medium mb-1 block">Current Stage</label>
                <input
                  type="text"
                  value={projectBrief.stage}
                  onChange={(e) => setProjectBrief({ ...projectBrief, stage: e.target.value })}
                  className="w-full bg-[#05070B] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={() => setShowBriefModal(false)} className="btn-secondary">
                Cancel
              </button>
              <button onClick={() => handleSaveBrief(projectBrief)} className="btn-primary">
                Save Project Brief
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inspect Injected AI Context Modal */}
      {showInjectedContextModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[#0D1117] border border-white/10 rounded-xl p-6 space-y-4 os-panel relative shadow-2xl">
            <button onClick={() => setShowInjectedContextModal(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 text-white font-medium text-xs uppercase tracking-wider">
              <Eye className="w-4 h-4 text-emerald-400" /> Injected AI Context & Source Attribution
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between bg-[#05070B] p-3 rounded-lg border border-white/10 font-mono">
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase">Detected Intent</div>
                  <div className="text-white font-semibold">{lastInjectedInfo.intent}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-zinc-500 uppercase">Confidence</div>
                  <div className="text-emerald-400 font-semibold">{lastInjectedInfo.confidence}</div>
                </div>
              </div>

              <div className="bg-[#05070B] p-3 rounded-lg border border-white/10 space-y-1 font-mono">
                <div className="text-[10px] text-zinc-500 uppercase font-semibold">Why?</div>
                <div className="text-zinc-300 text-[11px] leading-relaxed">{lastInjectedInfo.whyReason}</div>
              </div>

              <div className="bg-[#05070B] rounded-lg border border-white/10 overflow-x-auto font-mono text-[11px]">
                <table className="w-full text-left">
                  <thead className="bg-white/5 border-b border-white/10 text-zinc-400 text-[10px] uppercase">
                    <tr>
                      <th className="p-2">Context Directive</th>
                      <th className="p-2">Source Origin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-zinc-300">
                    {lastInjectedInfo.sourceTable.map((item, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.02]">
                        <td className="p-2 text-white font-medium">{item.context}</td>
                        <td className="p-2 text-emerald-400 font-semibold">{item.source}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <button onClick={() => setShowInjectedContextModal(false)} className="btn-secondary w-full">
              Close Context Inspector
            </button>
          </div>
        </div>
      )}

      {/* 3-Layer Creator Memory Vault Modal */}
      {showVaultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[#0D1117] border border-white/10 rounded-xl p-6 space-y-4 os-panel relative shadow-2xl">
            <button onClick={() => setShowVaultModal(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-white font-medium text-xs uppercase tracking-wider">
                <Layers3 className="w-4 h-4 text-emerald-400" /> 3-Layer Creator Memory Hierarchy
              </div>
              <span className="text-[10px] font-mono text-zinc-500">Active Profile: {memoryHierarchy.global.profile}</span>
            </div>

            {/* Profile Presets */}
            <div>
              <div className="text-[10px] uppercase font-mono text-zinc-500 mb-1.5 font-semibold">One-Click Presets</div>
              <div className="flex gap-2">
                {["SaaS Startup", "Indie Portfolio", "Minimal Landing Page"].map((prof) => (
                  <button
                    key={prof}
                    onClick={() => applyProfilePreset(prof)}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all border ${
                      memoryHierarchy.global.profile === prof
                        ? "bg-white text-black font-semibold border-white"
                        : "bg-white/5 border-white/10 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {prof}
                  </button>
                ))}
              </div>
            </div>

            {/* Layer Tabs */}
            <div className="flex border-b border-white/10 text-xs">
              <button
                onClick={() => setActiveMemoryLayer("global")}
                className={`px-3 py-1.5 font-medium transition-colors ${
                  activeMemoryLayer === "global" ? "border-b-2 border-white text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                1. Global Creator Vault
              </button>
              <button
                onClick={() => setActiveMemoryLayer("workspace")}
                className={`px-3 py-1.5 font-medium transition-colors ${
                  activeMemoryLayer === "workspace" ? "border-b-2 border-white text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                2. Workspace Vault
              </button>
              <button
                onClick={() => setActiveMemoryLayer("project")}
                className={`px-3 py-1.5 font-medium transition-colors ${
                  activeMemoryLayer === "project" ? "border-b-2 border-white text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                3. Project Brain
              </button>
            </div>

            {/* Layer 1: Global */}
            {activeMemoryLayer === "global" && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-zinc-400 font-medium mb-1 block">Theme Preference</label>
                  <input
                    type="text"
                    value={memoryHierarchy.global.theme}
                    onChange={(e) => setMemoryHierarchy({ ...memoryHierarchy, global: { ...memoryHierarchy.global, theme: e.target.value } })}
                    className="w-full bg-[#05070B] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 font-medium mb-1 block">Primary Fonts</label>
                  <input
                    type="text"
                    value={memoryHierarchy.global.font}
                    onChange={(e) => setMemoryHierarchy({ ...memoryHierarchy, global: { ...memoryHierarchy.global, font: e.target.value } })}
                    className="w-full bg-[#05070B] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 font-medium mb-1 block">Framework Stack</label>
                  <input
                    type="text"
                    value={memoryHierarchy.global.framework}
                    onChange={(e) => setMemoryHierarchy({ ...memoryHierarchy, global: { ...memoryHierarchy.global, framework: e.target.value } })}
                    className="w-full bg-[#05070B] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Layer 2: Workspace */}
            {activeMemoryLayer === "workspace" && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-zinc-400 font-medium mb-1 block">Company / Client Name</label>
                  <input
                    type="text"
                    value={memoryHierarchy.workspace.companyName}
                    onChange={(e) => setMemoryHierarchy({ ...memoryHierarchy, workspace: { ...memoryHierarchy.workspace, companyName: e.target.value } })}
                    className="w-full bg-[#05070B] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 font-medium mb-1 block">Brand Voice & Style</label>
                  <input
                    type="text"
                    value={memoryHierarchy.workspace.brandVoice}
                    onChange={(e) => setMemoryHierarchy({ ...memoryHierarchy, workspace: { ...memoryHierarchy.workspace, brandVoice: e.target.value } })}
                    className="w-full bg-[#05070B] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Layer 3: Project Brain */}
            {activeMemoryLayer === "project" && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-zinc-400 font-medium mb-1 block">Project Authentication</label>
                  <input
                    type="text"
                    value={memoryHierarchy.projectBrain.auth}
                    onChange={(e) => setMemoryHierarchy({ ...memoryHierarchy, projectBrain: { ...memoryHierarchy.projectBrain, auth: e.target.value } })}
                    className="w-full bg-[#05070B] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 font-medium mb-1 block">Database Stack</label>
                  <input
                    type="text"
                    value={memoryHierarchy.projectBrain.database}
                    onChange={(e) => setMemoryHierarchy({ ...memoryHierarchy, projectBrain: { ...memoryHierarchy.projectBrain, database: e.target.value } })}
                    className="w-full bg-[#05070B] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button onClick={() => setShowVaultModal(false)} className="btn-secondary">
                Cancel
              </button>
              <button onClick={() => handleSaveMemory(memoryHierarchy)} className="btn-primary">
                Save 3-Layer Memory Vault
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Professional Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 border-b border-white/10 bg-[#080A0F] shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <MessageSquareCode className="w-4 h-4 text-white shrink-0" strokeWidth={1.75} />
          <span className="text-xs font-semibold text-white shrink-0">AI Studio</span>

          {/* Editable Project Badge */}
          {isEditingName ? (
            <div className="flex items-center gap-1 bg-[#05070B] border border-white rounded px-1.5 py-0.5">
              <Folder className="w-3 h-3 text-white" strokeWidth={1.75} />
              <input
                type="text"
                value={currentName}
                onChange={(e) => setCurrentName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveName();
                }}
                autoFocus
                className="bg-transparent text-xs text-white focus:outline-none w-28 font-sans"
              />
              <button onClick={handleSaveName} className="p-0.5 text-emerald-400 hover:text-white">
                <Check className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingName(true)}
              title="Click to edit project name"
              className="flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 hover:border-white/40 text-zinc-200 hover:text-white transition-all font-mono group truncate max-w-[140px]"
            >
              <Folder className="w-3 h-3 text-white shrink-0" strokeWidth={1.75} />
              <span className="truncate">{currentName}</span>
              <Edit2 className="w-2.5 h-2.5 opacity-40 group-hover:opacity-100 text-white shrink-0" />
            </button>
          )}

          {/* Lightweight Project Brief Trigger */}
          <button
            onClick={() => setShowBriefModal(true)}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 border border-white/20 text-white hover:bg-white hover:text-black transition-all text-[10px] font-mono cursor-pointer"
            title="Configure Lightweight Project Brief"
          >
            <FileText className="w-3 h-3 text-emerald-400" />
            <span>Brief</span>
          </button>

          {/* Creator Style Vault Trigger */}
          <button
            onClick={() => setShowVaultModal(true)}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 border border-white/20 text-white hover:bg-white hover:text-black transition-all text-[10px] font-mono cursor-pointer"
            title="Configure 3-Layer Creator Memory & Style Vault"
          >
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Vault</span>
          </button>

          {onNewProject && (
            <button
              onClick={onNewProject}
              className="p-1 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              title="New Project"
            >
              <Plus className="w-3.5 h-3.5 text-white" />
            </button>
          )}
        </div>

        {/* Model Switcher & Provider Selector */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center bg-[#05070B] p-0.5 rounded-lg border border-white/10 text-xs">
            <button
              onClick={() => {
                setProvider("cloud");
                setSelectedModel("openrouter/free");
              }}
              className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                provider === "cloud"
                  ? "bg-white text-black font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Cloud
            </button>
            <button
              onClick={() => {
                setProvider("local");
                setSelectedModel("ollama/qwen2.5-coder");
              }}
              className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                provider === "local"
                  ? "bg-white text-black font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Local
            </button>
          </div>

          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="bg-[#05070B] border border-white/10 text-[11px] text-zinc-200 rounded-lg px-2 py-1 focus:outline-none focus:border-white/50"
          >
            {provider === "cloud" ? (
              <>
                <option value="openrouter/free">OpenRouter Auto-Free Router (Recommended)</option>
                <option value="deepseek/deepseek-r1:free">DeepSeek R1 (Free)</option>
                <option value="qwen/qwen-2.5-coder-32b-instruct:free">Qwen 2.5 Coder (Free)</option>
                <option value="meta-llama/llama-3.3-70b-instruct">Llama 3.3 70B</option>
              </>
            ) : (
              <>
                <option value="ollama/qwen2.5-coder">Ollama - Qwen 2.5</option>
                <option value="ollama/deepseek-r1-7b">Ollama - DeepSeek 7B</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* Transparent Active Preference Pills & Inspect Injected AI Context Trigger */}
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#05070B] border-b border-white/10 overflow-x-auto text-[10px] font-mono text-zinc-400 shrink-0 gap-2">
        <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto">
          <span className="text-zinc-500 uppercase font-semibold shrink-0">Active Memory:</span>
          <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
            ✓ {memoryHierarchy.global.profile}
          </span>
          <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-300 shrink-0">
            ✓ Next.js 15
          </span>
          <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-300 shrink-0">
            ✓ Tailwind
          </span>
          <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-300 shrink-0">
            ✓ Inter
          </span>
        </div>

        <button
          onClick={() => setShowInjectedContextModal(true)}
          className="flex items-center gap-1 text-[10px] text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded border border-white/10 shrink-0 cursor-pointer"
          title="Inspect exact context & source attribution sent to AI"
        >
          <Eye className="w-3 h-3 text-emerald-400" /> View AI Context
        </button>
      </div>

      {/* Proactive Context-Aware AI Nudges Bar */}
      {proactiveNudges.length > 0 && (
        <div className="px-3 py-1.5 bg-emerald-500/5 border-b border-emerald-500/10 flex items-center gap-2 text-xs overflow-x-auto shrink-0">
          <div className="flex items-center gap-1 text-emerald-400 font-mono text-[10px] font-semibold shrink-0">
            <Lightbulb className="w-3 h-3" /> Proactive AI Nudges:
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {proactiveNudges.map((nudge) => (
              <button
                key={nudge.id}
                onClick={() => handleNudgeClick(nudge.action)}
                className="px-2 py-0.5 rounded bg-white/5 border border-white/10 hover:bg-white hover:text-black text-zinc-300 text-[10px] font-mono transition-all shrink-0 cursor-pointer"
              >
                + {nudge.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Temporary Override Input Bar */}
      {tempOverride && (
        <div className="px-3.5 py-1 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between text-[11px] text-amber-300">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Temp Override Active: <strong>"{tempOverride}"</strong></span>
          </div>
          <button onClick={() => setTempOverride("")} className="text-amber-400 hover:text-white text-[10px]">
            Clear ✕
          </button>
        </div>
      )}

      {/* Fallback Warning Banner */}
      {fallbackTriggered && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-3 py-1.5 flex items-center justify-between text-xs text-amber-300">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Selected model unavailable. Auto-routing via openrouter/free.</span>
          </div>
          <button onClick={() => setFallbackTriggered(false)} className="text-amber-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0 shadow-md">
                <Bot className="w-4 h-4" strokeWidth={1.75} />
              </div>
            )}

            <div
              className={`max-w-2xl rounded-xl p-3 text-xs leading-relaxed ${
                msg.role === "user"
                  ? "bg-white text-black shadow-md font-semibold"
                  : "bg-white/[0.03] border border-white/10 text-zinc-200"
              }`}
            >
              <div className="whitespace-pre-wrap font-sans">{msg.content || (isStreaming ? "Thinking..." : "...")}</div>

              {msg.role === "assistant" && (
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[10px] text-zinc-400">
                  <span className="flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3 h-3 text-[#10B981]" strokeWidth={1.75} />
                    {msg.model || "OpenRouter Auto-Free"}
                  </span>
                  {msg.latencyMs && <span className="font-mono">{msg.latencyMs}ms</span>}
                </div>
              )}
            </div>

            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-lg bg-white text-black flex items-center justify-center shrink-0 font-bold">
                <User className="w-4 h-4" strokeWidth={1.75} />
              </div>
            )}
          </div>
        ))}

        {isStreaming && (
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" strokeWidth={1.75} />
              <span>AI Co-pilot is streaming tokens...</span>
            </div>
            <button
              onClick={handleStop}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all text-[11px] font-medium cursor-pointer"
            >
              <Square className="w-3 h-3 fill-current" />
              Stop Streaming
            </button>
          </div>
        )}
      </div>

      {/* Input Bar with Temporary Override Row */}
      <div className="p-3 border-t border-white/10 bg-[#080A0F] shrink-0 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-1.5 px-1 text-[11px] text-zinc-400">
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-zinc-200">
            <input
              type="checkbox"
              checked={enableRAG}
              onChange={(e) => setEnableRAG(e.target.checked)}
              className="rounded bg-[#05070B] border-white/20 text-white focus:ring-0"
            />
            <Cpu className="w-3.5 h-3.5 text-white" strokeWidth={1.75} />
            <span>Vector Memory (RAG)</span>
          </label>

          <div className="flex items-center gap-2 font-mono text-[10px] w-full sm:w-auto">
            <input
              type="text"
              placeholder="Temp override (e.g. Use Vue)"
              value={tempOverride}
              onChange={(e) => setTempOverride(e.target.value)}
              className="bg-[#05070B] border border-white/10 rounded px-2 py-0.5 text-white placeholder-zinc-500 w-full sm:w-52 focus:outline-none focus:border-amber-500/50 text-[10px]"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#05070B] border border-white/10 rounded-xl p-2 focus-within:border-white/40">
          <button className="p-1.5 hover:bg-white/10 rounded-lg text-zinc-400 transition-colors">
            <Paperclip className="w-4 h-4" strokeWidth={1.75} />
          </button>

          <input
            type="text"
            placeholder={`Ask AI co-pilot or build ${currentName}...`}
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="flex-1 bg-transparent text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none"
          />

          {isStreaming ? (
            <button
              onClick={handleStop}
              className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all shadow-md cursor-pointer"
              title="Stop Generation"
            >
              <Square className="w-4 h-4 fill-current" />
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={!inputPrompt.trim()}
              className="p-2 rounded-lg bg-white hover:bg-zinc-200 disabled:opacity-50 text-black transition-all shadow-md cursor-pointer"
            >
              <Send className="w-4 h-4" strokeWidth={1.75} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
