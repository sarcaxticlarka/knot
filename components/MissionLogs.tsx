"use client";

import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Terminal, ChevronDown, RefreshCw } from "lucide-react";
import { playClickSound } from "../utils/audio";

interface MissionLogsProps {
  isOpen: boolean;
  onClose: () => void;
  logs: string[];
  onClearLogs: () => void;
}

export default function MissionLogs({ isOpen, onClose, logs, onClearLogs }: MissionLogsProps) {
  const containerEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs, isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 250 }}
          className="fixed bottom-0 left-0 md:left-6 w-full md:w-[480px] h-[320px] bg-[#03050c]/98 border border-white/15 md:border-b-0 rounded-t-2xl z-40 flex flex-col shadow-[0_-15px_40px_rgba(0,0,0,0.85)] backdrop-blur-md overflow-hidden crt-monitor"
        >
          {/* Top border strip */}
          <div className="absolute top-0 left-0 w-full h-[2.5px] bg-gradient-to-r from-cyan-neon via-purple-500 to-indigo-500 z-35" />

          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between z-30 bg-zinc-950/70">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-neon animate-pulse" />
              <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-white crt-text-glow-cyan">
                Cognitive Sync History Timeline
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  playClickSound();
                  onClearLogs();
                }}
                className="p-1 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 rounded-md transition-all active:scale-95 duration-75"
                title="Flush Log Buffers"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  playClickSound();
                  onClose();
                }}
                className="p-1 rounded-md border border-white/5 text-zinc-500 hover:text-white hover:bg-white/5 hover:border-cyan-500/30 transition-all active:scale-95 duration-75"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* CRT Logs feed */}
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-1.5 font-mono text-[10px] leading-relaxed text-zinc-400 select-text z-20 animate-crt-flicker bg-black/10">
            {logs.map((log, idx) => {
              let textClass = "crt-text-glow-cyan";
              if (log.includes("SECURED") || log.includes("GATEWAY")) {
                textClass = "crt-text-glow-green font-bold";
              } else if (log.includes("MEDAL") || log.includes("UNLOCKED")) {
                textClass = "crt-text-glow-purple font-black";
              } else if (log.includes("THEME") || log.includes("SYNTH")) {
                textClass = "text-amber-400";
              } else if (log.includes("INIT") || log.includes("SYSTEM")) {
                textClass = "text-zinc-500 font-bold";
              }

              return (
                <div key={idx} className={`${textClass} whitespace-pre-wrap`}>
                  {log}
                </div>
              );
            })}
            <div ref={containerEndRef} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
