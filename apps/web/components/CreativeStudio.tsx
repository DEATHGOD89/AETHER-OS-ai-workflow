"use client";

import React, { useState } from "react";
import { Image as ImageIcon, Video, Sparkles, Sliders, Download, Layers, Play, Wand2 } from "lucide-react";

export function CreativeStudio({ projectName }: { projectName: string }) {
  const [activeMode, setActiveMode] = useState<"image" | "video">("image");
  const [backend, setBackend] = useState("FLUX");
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [isGenerating, setIsGenerating] = useState(false);

  const [gallery, setGallery] = useState([
    {
      id: "1",
      type: "image",
      url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
      prompt: "Futuristic dark neon cyberpunk OS workspace UI, 8k render",
      backend: "FLUX.1 Pro",
      aspect: "16:9",
    },
    {
      id: "2",
      type: "image",
      url: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80",
      prompt: "Abstract 3D iridescent metallic fluid glass artwork",
      backend: "ComfyUI (SDXL)",
      aspect: "1:1",
    },
  ]);

  const handleGenerate = () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);

    setTimeout(() => {
      setGallery((prev) => [
        {
          id: Date.now().toString(),
          type: activeMode,
          url:
            activeMode === "image"
              ? "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"
              : "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80",
          prompt: prompt,
          backend: backend,
          aspect: aspectRatio,
        },
        ...prev,
      ]);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-[#0D1117]/80 border border-white/10 rounded-xl overflow-hidden glass-panel w-full">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 sm:px-4 py-2.5 sm:py-3 border-b border-white/10 bg-[#080A0F] shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0">
            <ImageIcon className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs sm:text-sm font-semibold text-zinc-100 flex items-center gap-1.5 truncate">
              <span className="truncate">Visual Creation Studio</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono hidden sm:inline-block truncate">
                {projectName}
              </span>
            </div>
            <div className="text-[11px] text-zinc-400 truncate">Generate high-grade visual assets</div>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center bg-[#05070B] p-0.5 rounded-lg border border-white/10 text-xs">
          <button
            onClick={() => setActiveMode("image")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
              activeMode === "image"
                ? "bg-white text-black font-semibold shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            Image Studio
          </button>
          <button
            onClick={() => setActiveMode("video")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
              activeMode === "video"
                ? "bg-white text-black font-semibold shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            Video Studio
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden w-full">
        {/* Left Generation Controls Panel */}
        <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-white/10 p-3.5 sm:p-4 space-y-4 overflow-y-auto bg-[#080A0F]/30 shrink-0">
          <div>
            <label className="text-xs font-medium text-zinc-300 mb-1 block">Generation Engine</label>
            <select
              value={backend}
              onChange={(e) => setBackend(e.target.value)}
              className="w-full bg-[#05070B] border border-white/10 text-xs text-zinc-200 rounded-lg p-2 focus:outline-none focus:border-white/40"
            >
              {activeMode === "image" ? (
                <>
                  <option value="FLUX">FLUX.1 Schnell / Pro</option>
                  <option value="COMFYUI">ComfyUI (Local / Cloud Workflow)</option>
                  <option value="A1111">Automatic1111 SDXL</option>
                  <option value="REPLICATE">Replicate API</option>
                </>
              ) : (
                <>
                  <option value="VEO">Google Veo 2</option>
                  <option value="KLING">Kling AI Video</option>
                  <option value="RUNWAY">Runway Gen-3 Alpha</option>
                  <option value="PIKA">Pika Labs</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-300 mb-1 block">Aspect Ratio</label>
            <div className="grid grid-cols-4 gap-1.5">
              {["1:1", "16:9", "9:16", "4:3"].map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className={`py-1.5 text-[11px] font-mono rounded border transition-colors ${
                    aspectRatio === ratio
                      ? "bg-white/20 border-white text-white font-semibold"
                      : "bg-[#05070B] border-white/10 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-300 mb-1 flex items-center justify-between">
              <span>Prompt Instruction</span>
              <button className="text-[10px] text-emerald-400 flex items-center gap-1 hover:underline">
                <Wand2 className="w-3 h-3" /> Enhance
              </button>
            </label>
            <textarea
              rows={3}
              placeholder={`Describe the ${activeMode} you want to create...`}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-[#05070B] border border-white/10 rounded-lg p-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-white/40 resize-none"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="w-full py-2.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            {isGenerating ? `Generating ${activeMode}...` : `Generate ${activeMode}`}
          </button>
        </div>

        {/* Right Asset Gallery Grid */}
        <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              Project Asset Gallery ({gallery.length})
            </h3>
            <span className="text-[10px] font-mono text-zinc-500">Auto-saved to Cloud Storage</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {gallery.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-xl border border-white/10 bg-[#080A0F]/60 overflow-hidden glass-card"
              >
                <div className="aspect-video relative overflow-hidden bg-black">
                  <img
                    src={item.url}
                    alt={item.prompt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {item.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <div className="p-2.5 rounded-full bg-white text-black shadow-lg">
                        <Play className="w-4 h-4 fill-current" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-3 space-y-1.5">
                  <div className="text-xs text-zinc-200 font-medium line-clamp-2">{item.prompt}</div>
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1 border-t border-white/10">
                    <span className="px-2 py-0.5 rounded bg-[#05070B] border border-white/10 font-mono">
                      {item.backend}
                    </span>
                    <span className="font-mono">{item.aspect}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
