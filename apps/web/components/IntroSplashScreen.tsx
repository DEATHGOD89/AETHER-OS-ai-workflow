"use client";

import React, { useState, useRef, useEffect } from "react";
import { ArrowRight, Volume2, VolumeX, Play, Pause } from "lucide-react";

export function IntroSplashScreen({ onComplete }: { onComplete: () => void }) {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.warn("Autoplay prevented by browser policy:", err);
        setIsPlaying(false);
      });
    }
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => setHasError(true));
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black text-white flex flex-col items-center justify-between p-6 overflow-hidden font-sans selection:bg-white selection:text-black">
      {/* Top Header Bar with Large Prominent Edited Brand Logo */}
      <div className="w-full max-w-6xl z-20 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-3 bg-black/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15 shadow-xl">
          <img src="/logo.png?v=2" alt="Aether OS Logo" className="h-10 w-auto max-w-[220px] object-contain" />
          <span className="font-extrabold text-sm text-white tracking-widest uppercase font-sans">AETHER OS</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-2.5 rounded-xl bg-black/90 backdrop-blur-md border border-white/15 hover:bg-white/20 text-white transition-all cursor-pointer shadow-lg"
            title={isMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            onClick={togglePlay}
            className="p-2.5 rounded-xl bg-black/90 backdrop-blur-md border border-white/15 hover:bg-white/20 text-white transition-all cursor-pointer shadow-lg"
            title={isPlaying ? "Pause Video" : "Play Video"}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2x Zoomed Out Crisp Video Canvas Container */}
      <div className="relative w-[680px] max-w-[90vw] aspect-video rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-black my-auto z-10 flex items-center justify-center">
        {hasError ? (
          <div className="text-center p-6 space-y-3">
            <p className="text-xs text-zinc-400">Intro video preview unavailable.</p>
            <button onClick={onComplete} className="btn-primary">
              Skip Intro & Launch Workspace →
            </button>
          </div>
        ) : (
          <video
            ref={videoRef}
            src="/intro.mp4"
            autoPlay
            playsInline
            muted={isMuted}
            onEnded={onComplete}
            onError={() => setHasError(true)}
            className="w-full h-full object-contain bg-black"
          />
        )}
      </div>

      {/* Bottom Center Launch Control */}
      <div className="w-full z-20 text-center space-y-2 pointer-events-auto pb-2">
        <button
          onClick={onComplete}
          className="px-8 py-3.5 rounded-xl bg-white text-black font-extrabold text-xs hover:bg-zinc-200 transition-all shadow-2xl flex items-center gap-2.5 mx-auto group cursor-pointer"
        >
          <span>ENTER AETHER OS WORKSPACE</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="text-[11px] font-mono text-zinc-400">
          Click button or wait for video to complete
        </p>
      </div>
    </div>
  );
}
