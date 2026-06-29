"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import { Check, Lock, Play, ZoomIn, ZoomOut, Maximize2, Compass } from "lucide-react";
import { ArenaNode } from "../app/arenaData";
import { playClickSound } from "../utils/audio";

interface MapCanvasProps {
  nodes: ArenaNode[];
  activeNodeId: string | null;
  onNodeSelect: (nodeId: string) => void;
}

export default function MapCanvas({ nodes, activeNodeId, onNodeSelect }: MapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track pan & zoom state
  const [scale, setScale] = useState(1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const zoomIn = () => {
    playClickSound();
    setScale((prev) => Math.min(prev + 0.15, 1.5));
  };
  const zoomOut = () => {
    playClickSound();
    setScale((prev) => Math.max(prev - 0.15, 0.65));
  };
  const resetView = () => {
    playClickSound();
    setScale(1);
    x.set(0);
    y.set(0);
  };

  // Helper to render connection paths between nodes
  const renderPaths = () => {
    return nodes.map((node) => {
      return node.prerequisites.map((prereqId) => {
        const parentNode = nodes.find((n) => n.id === prereqId);
        if (!parentNode) return null;

        const sx = parentNode.coordinates.x;
        const sy = parentNode.coordinates.y;
        const tx = node.coordinates.x;
        const ty = node.coordinates.y;

        // Draw bezier curves connecting nodes
        const pathData = `M ${sx} ${sy} C ${(sx + tx) / 2} ${sy}, ${(sx + tx) / 2} ${ty}, ${tx} ${ty}`;

        // Path is unlocked if parent is completed, and child is unlocked or completed
        const isPathUnlocked =
          parentNode.status === "completed" &&
          (node.status === "unlocked" || node.status === "completed");

        return (
          <g key={`${parentNode.id}-${node.id}`}>
            {/* Background trace line for deep neon glow (broad blur) */}
            {isPathUnlocked && (
              <motion.path
                d={pathData}
                fill="none"
                stroke="var(--neon-cyan)"
                strokeWidth={10}
                opacity={0.08}
                className="blur-[6px]"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              />
            )}
            
            {/* Secondary glow path (medium blur) */}
            {isPathUnlocked && (
              <motion.path
                d={pathData}
                fill="none"
                stroke="var(--neon-cyan)"
                strokeWidth={4}
                opacity={0.25}
                className="blur-[2px]"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              />
            )}

            {/* Primary connection line */}
            <motion.path
              d={pathData}
              fill="none"
              stroke={isPathUnlocked ? "var(--neon-cyan)" : "#1e293b"}
              strokeWidth={1.5}
              strokeDasharray={!isPathUnlocked ? "4,4" : "none"}
              className="transition-colors duration-500"
              opacity={isPathUnlocked ? 0.85 : 0.4}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />

            {/* Continuous data packet nodes flow */}
            {isPathUnlocked && (
              <motion.path
                d={pathData}
                fill="none"
                stroke="url(#packetGradient)"
                strokeWidth={3}
                strokeLinecap="round"
                strokeDasharray="8 80"
                animate={{ strokeDashoffset: [-160, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              />
            )}
          </g>
        );
      });
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[calc(100vh-80px)] overflow-hidden arena-grid cursor-grab active:cursor-grabbing select-none"
      onDoubleClick={resetView}
    >
      {/* Moving space backdrop nebulae */}
      <div className="nebula-container">
        <div className="nebula-pink" />
        <div className="nebula-blue" />
        <div className="nebula-indigo" />
      </div>

      {/* Grid scanline overlay filter */}
      <div className="scanline-overlay" />

      {/* Interactive Drag Canvas */}
      <motion.div
        drag
        dragElastic={0.06}
        dragTransition={{ power: 0.1, timeConstant: 220 }}
        style={{ x, y, scale }}
        className="absolute w-[1300px] h-[650px] z-10 origin-center flex items-center justify-center"
      >
        {/* SVG connection canvas */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <linearGradient id="packetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--neon-cyan)" stopOpacity="0" />
              <stop offset="50%" stopColor="var(--neon-cyan)" stopOpacity="1" />
              <stop offset="100%" stopColor="var(--neon-purple)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {renderPaths()}
        </svg>

        {/* Nodes Layer */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {nodes.map((node) => {
            const isCompleted = node.status === "completed";
            const isUnlocked = node.status === "unlocked";
            const isLocked = node.status === "locked";
            const isActive = activeNodeId === node.id;

            // Difficulty styles (muted if locked)
            let diffBadge = isLocked
              ? "text-zinc-600 border-zinc-900/30 bg-zinc-900/10"
              : node.difficulty === "Grandmaster"
              ? "text-red-400 border-red-500/20 bg-red-500/10"
              : node.difficulty === "Specialist"
              ? "text-amber-400 border-amber-500/20 bg-amber-500/10"
              : "text-emerald-400 border-emerald-500/20 bg-emerald-500/10";

            return (
              <motion.div
                key={node.id}
                style={{
                  position: "absolute",
                  left: node.coordinates.x,
                  top: node.coordinates.y,
                  x: "-50%",
                  y: "-50%",
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="pointer-events-auto relative"
              >
                {/* 1. Orbit dashed rings */}
                {isCompleted && (
                  <div className="absolute -inset-4 border border-dashed border-purple-500/20 rounded-full animate-orbit-ccw pointer-events-none" />
                )}
                {isUnlocked && (
                  <div className="absolute -inset-4 border border-dashed border-cyan-500/30 rounded-full animate-orbit pointer-events-none" />
                )}

                {/* 2. Interactive node capsule */}
                <button
                  onClick={() => {
                    if (!isLocked) {
                      playClickSound();
                      onNodeSelect(node.id);
                    }
                  }}
                  disabled={isLocked}
                  className={`relative w-52 p-4 rounded-xl border flex flex-col items-start gap-1 font-mono transition-all duration-300 text-left outline-none hover:-translate-y-1.5 hover:shadow-xl ${
                    isCompleted
                      ? "bg-zinc-950/80 border-purple-500/40 text-purple-200 hover:border-purple-400 hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] cursor-pointer"
                      : isUnlocked
                      ? `bg-zinc-950/90 text-zinc-100 cursor-pointer ${
                          isActive
                            ? "border-cyan-neon scale-105 shadow-[0_0_30px_rgba(6,182,212,0.6)]"
                            : "border-cyan-500/40 hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] animate-neon-pulse"
                        }`
                      : "bg-zinc-950/60 border-zinc-900/40 text-zinc-500 cursor-not-allowed opacity-60"
                  }`}
                >
                  {/* Glowing light bars for active nodes */}
                  {isUnlocked && !isCompleted && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-[2px] bg-cyan-neon shadow-[0_0_6px_var(--neon-cyan)] animate-pulse" />
                  )}
                  {isCompleted && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-[2px] bg-purple-500 shadow-[0_0_6px_#a855f7]" />
                  )}

                  {/* Category Pill & XP */}
                  <div className="flex justify-between items-center w-full text-[9px] uppercase tracking-wider text-zinc-500 font-black">
                    <span>{node.category}</span>
                    <span className={isCompleted ? "text-purple-400" : isUnlocked ? "text-cyan-400" : "text-zinc-550"}>
                      +{node.xpReward} XP
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className={`text-xs font-bold tracking-tight mt-1 line-clamp-1 ${
                      isCompleted
                        ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300 font-sans"
                        : isUnlocked
                        ? "text-cyan-neon font-sans"
                        : "text-zinc-400 font-sans"
                    }`}
                  >
                    {node.title}
                  </h3>

                  {/* Row: Difficulty badge & Status */}
                  <div className="flex items-center justify-between w-full mt-3 pt-2 border-t border-white/5">
                    <span className={`px-2 py-0.5 rounded text-[8px] border font-bold ${diffBadge}`}>
                      {node.difficulty.toUpperCase()}
                    </span>

                    {/* Status Badge */}
                    <div className="flex items-center gap-1">
                      {isCompleted ? (
                        <div className="w-5 h-5 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-[0_0_6px_rgba(168,85,247,0.3)]">
                          <Check className="w-3 h-3" />
                        </div>
                      ) : isUnlocked ? (
                        <div className="flex items-center gap-1.5">
                          {/* Blinking ONLINE lamp */}
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-neon animate-ping" />
                          <div className="w-5 h-5 rounded-full bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-neon shadow-[0_0_6px_rgba(6,182,212,0.3)]">
                            <Play className="w-2 h-2 fill-cyan-400" />
                          </div>
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600">
                          <Lock className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Extra highlight border */}
                  {isActive && (
                    <div className="absolute -inset-[2px] rounded-xl border border-cyan-neon opacity-80 pointer-events-none" />
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Floating View Controls */}
      <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-2 bg-zinc-950/80 border border-white/10 p-2 rounded-xl backdrop-blur-md shadow-xl">
        <button
          onClick={zoomIn}
          className="p-2 text-zinc-400 hover:text-cyan-neon hover:bg-zinc-900 border border-white/5 hover:border-cyan-500/30 rounded-lg transition-all"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={zoomOut}
          className="p-2 text-zinc-400 hover:text-cyan-neon hover:bg-zinc-900 border border-white/5 hover:border-cyan-500/30 rounded-lg transition-all"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={resetView}
          className="p-2 text-zinc-400 hover:text-cyan-neon hover:bg-zinc-900 border border-white/5 hover:border-cyan-500/30 rounded-lg transition-all"
          title="Center View"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Mini Hint Overlay */}
      <div className="absolute bottom-6 left-16 z-20 pointer-events-none font-mono text-[9px] text-zinc-500 flex items-center gap-2">
        <Compass className="w-4 h-4 text-zinc-600 animate-spin" style={{ animationDuration: "12s" }} />
        <span>PAN CANVASES TO NAVIGATE MAP. DOUBLE-CLICK MAP TO CENTER VIEW.</span>
      </div>
    </div>
  );
}
