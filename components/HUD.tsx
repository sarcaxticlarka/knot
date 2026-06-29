"use client";

import React from "react";
import { Award, Trophy, Sparkles, RefreshCw, Layers, Volume2, VolumeX, Terminal } from "lucide-react";
import { playClickSound } from "../utils/audio";

interface HUDProps {
  totalXp: number;
  solvedCount: number;
  totalCount: number;
  theme: "neon" | "matrix" | "solar" | "cobalt";
  onThemeChange: (theme: "neon" | "matrix" | "solar" | "cobalt") => void;
  onReset: () => void;
  isMuted: boolean;
  onMuteToggle: () => void;
  onOpenLeaderboard: () => void;
  onOpenAchievements: () => void;
  unlockedAchievementsCount: number;
  waveform: "sine" | "square" | "triangle" | "sawtooth";
  onWaveformChange: (val: "sine" | "square" | "triangle" | "sawtooth") => void;
  onOpenLogs: () => void;
}

export default function HUD({
  totalXp,
  solvedCount,
  totalCount,
  theme,
  onThemeChange,
  onReset,
  isMuted,
  onMuteToggle,
  onOpenLeaderboard,
  onOpenAchievements,
  unlockedAchievementsCount,
  waveform,
  onWaveformChange,
  onOpenLogs,
}: HUDProps) {
  // Dynamically calculate user level: Level = Math.floor(XP / 500) + 1
  const level = Math.floor(totalXp / 500) + 1;
  const currentLevelXp = totalXp % 500;
  const xpNeededForNextLevel = 500;
  const progressPercent = Math.min((currentLevelXp / xpNeededForNextLevel) * 100, 100);

  // Evolving Rank Badge String
  let rankBadge = "Syntax Novice";
  let rankColor = "text-emerald-400";
  if (totalXp > 1000) {
    rankBadge = "Grandmaster Optimizer";
    rankColor = "text-red-400";
  } else if (totalXp > 300) {
    rankBadge = "Pointer Specialist";
    rankColor = "text-amber-400";
  }

  const themes: { id: "neon" | "matrix" | "solar" | "cobalt"; label: string }[] = [
    { id: "neon", label: "Neon Cyber" },
    { id: "matrix", label: "Matrix" },
    { id: "solar", label: "Solar Flare" },
    { id: "cobalt", label: "Deep Cobalt" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#05070e]/70 border-b border-white/5 backdrop-blur-md px-6 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4 select-none">
      {/* Decorative top cyber line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-neon/30 via-purple-500/20 to-indigo-500/30" />

      {/* Brand Logo & Name */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl overflow-hidden bg-cyan-950/40 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
          <img src="/logo.png" alt="Knot Arena Logo" className="w-full h-full object-cover scale-105" />
          <div className="absolute -inset-0.5 border border-cyan-500/10 rounded-xl animate-ping" style={{ animationDuration: "3s" }} />
        </div>
        <div>
          <h1 className="text-lg font-black tracking-widest bg-gradient-to-r from-white via-cyan-100 to-cyan-neon bg-clip-text text-transparent glow-text-cyan font-mono uppercase">
            KNOT ARENA
          </h1>
          <p className="text-[8.5px] text-zinc-500 uppercase tracking-widest font-mono font-bold">
            Tactical Skill Grid v2.1
          </p>
        </div>
      </div>

      {/* Dynamic XP Progression Panel */}
      <div className="flex-1 max-w-xl w-full flex flex-col md:flex-row items-center gap-4 bg-zinc-950/60 border border-white/5 rounded-xl px-4 py-2 hover:border-cyan-500/10 transition-colors duration-300">
        <div className="flex items-center gap-2.5 font-mono">
          {/* Futuristic Level Badge Circle */}
          <div className="w-8 h-8 rounded-lg bg-cyan-950/30 border border-cyan-500/40 flex items-center justify-center font-black text-cyan-neon text-sm shadow-[0_0_10px_rgba(6,182,212,0.2)]">
            {level}
          </div>
          <div className="text-left leading-tight">
            <span className="text-[8px] text-zinc-500 uppercase tracking-wider block font-bold">Level Core</span>
            <span className={`text-[11px] font-bold uppercase tracking-wide ${rankColor}`}>{rankBadge}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex-1 w-full">
          <div className="flex justify-between text-[9px] text-zinc-400 font-mono mb-1 font-bold">
            <span className="flex items-center gap-1">XP <span className="text-zinc-500">{totalXp}</span></span>
            <span>{currentLevelXp} / 500 XP</span>
          </div>
          <div className="w-full h-2 bg-zinc-900 rounded-full border border-white/5 overflow-hidden p-[1px] relative">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 shadow-[0_0_10px_rgba(6,182,212,0.6)] transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4 border-l border-white/5 pl-4 font-mono text-center shrink-0">
          <div>
            <span className="text-[8px] text-zinc-500 block uppercase font-bold">NODES</span>
            <span className="text-xs font-black text-purple-400 glow-text-purple">
              {solvedCount}/{totalCount}
            </span>
          </div>
        </div>
      </div>

      {/* Controls & Theme Switcher */}
      <div className="flex items-center gap-3">
        {/* Achievements Badge trigger */}
        <button
          onClick={() => {
            playClickSound();
            onOpenAchievements();
          }}
          className="relative p-2 text-purple-400 hover:text-purple-300 hover:bg-purple-950/20 border border-purple-500/20 hover:border-purple-500/40 rounded-xl active:scale-95 duration-75 transition-all flex items-center gap-1.5 text-xs font-mono font-bold shadow-sm shadow-purple-500/5 hover:shadow-purple-500/10"
          title="View Achievement Badges"
        >
          <Award className="w-4 h-4 animate-pulse" />
          <span className="hidden sm:inline tracking-wider">MEDALS</span>
          <span className="px-1.5 py-0.5 rounded bg-purple-500/20 border border-purple-500/30 text-[9px] font-black text-purple-300 leading-none">
            {unlockedAchievementsCount}
          </span>
        </button>

        {/* Leaderboard trigger */}
        <button
          onClick={() => {
            playClickSound();
            onOpenLeaderboard();
          }}
          className="p-2 text-yellow-500 hover:text-yellow-400 hover:bg-yellow-950/20 border border-yellow-500/20 hover:border-yellow-500/40 rounded-xl active:scale-95 duration-75 transition-all flex items-center gap-1.5 text-xs font-mono font-bold shadow-sm shadow-yellow-500/5 hover:shadow-yellow-500/10"
          title="View Leaderboards"
        >
          <Trophy className="w-4 h-4" />
          <span className="hidden sm:inline tracking-wider">RANK</span>
        </button>

        {/* Mission Logs trigger */}
        <button
          onClick={() => {
            playClickSound();
            onOpenLogs();
          }}
          className="p-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/20 border border-cyan-500/20 hover:border-cyan-500/40 rounded-xl active:scale-95 duration-75 transition-all flex items-center gap-1.5 text-xs font-mono font-bold shadow-sm shadow-cyan-500/5 hover:shadow-cyan-500/10"
          title="View Mission Logs Timeline"
        >
          <Terminal className="w-4 h-4 text-cyan-neon" />
          <span className="hidden sm:inline tracking-wider">LOGS</span>
        </button>

        {/* Audio Speaker & Waveform controls */}
        <div className="flex items-center gap-1.5 bg-zinc-950/80 border border-white/5 p-1 rounded-xl">
          <button
            onClick={() => {
              onMuteToggle();
              if (isMuted) {
                setTimeout(() => playClickSound(), 50);
              }
            }}
            className="p-1.5 text-zinc-400 hover:text-cyan-neon hover:bg-zinc-900 border border-white/5 rounded-lg transition-all active:scale-95 duration-75"
            title={isMuted ? "Unmute sound synthesis" : "Mute sound synthesis"}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-500" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-neon" />}
          </button>
          {!isMuted && (
            <select
              value={waveform}
              onChange={(e) => {
                const val = e.target.value as any;
                onWaveformChange(val);
                setTimeout(() => playClickSound(), 50);
              }}
              className="bg-transparent text-zinc-500 hover:text-zinc-300 text-[9px] font-mono font-bold outline-none cursor-pointer border-none pr-1.5"
              title="Change Synth Waveform"
            >
              <option value="sine" className="bg-[#05070e]">SINE</option>
              <option value="square" className="bg-[#05070e]">SQUARE</option>
              <option value="triangle" className="bg-[#05070e]">TRIANGLE</option>
              <option value="sawtooth" className="bg-[#05070e]">SAWTOOTH</option>
            </select>
          )}
        </div>

        {/* Theme select controls */}
        <div className="flex items-center gap-1 bg-zinc-950/80 border border-white/5 p-1 rounded-xl">
          <Layers className="w-3.5 h-3.5 text-zinc-650 ml-1.5" />
          <div className="flex gap-0.5">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  playClickSound();
                  onThemeChange(t.id);
                }}
                className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded-lg transition-all duration-200 uppercase ${
                  theme === t.id
                    ? "bg-cyan-500/10 text-cyan-neon border border-cyan-500/30 shadow-[0_0_8px_rgba(6,182,212,0.15)]"
                    : "text-zinc-600 hover:text-zinc-400 border border-transparent"
                }`}
                title={`Switch to ${t.label} theme`}
              >
                {t.id}
              </button>
            ))}
          </div>
        </div>

        {/* Hard Reset progression */}
        <button
          onClick={() => {
            playClickSound();
            onReset();
          }}
          className="flex items-center justify-center p-2.5 text-red-400 hover:text-red-300 bg-red-950/10 hover:bg-red-950/20 border border-red-500/20 hover:border-red-500/40 rounded-xl active:scale-95 duration-75 transition-all"
          title="Reset Arena Progress"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
}
