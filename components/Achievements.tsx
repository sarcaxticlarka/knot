"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Award, Lock, Sparkles, Zap, Shield, Flame, BookOpen } from "lucide-react";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: "book" | "shield" | "zap" | "flame" | "sparkles";
  xpReward: number;
}

export const LIST_ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_bytes",
    title: "First Bytes",
    description: "Initialize the Arena and solve the default Inversion Array.",
    iconName: "book",
    xpReward: 50,
  },
  {
    id: "pointer_path",
    title: "Pointer Master",
    description: "Navigate the sorted energies array and unlock Node 2.",
    iconName: "shield",
    xpReward: 100,
  },
  {
    id: "python_poly",
    title: "Python Polyglot",
    description: "Compile and pass any coding node challenge using Python syntax.",
    iconName: "zap",
    xpReward: 150,
  },
  {
    id: "speed_demon",
    title: "Speed Daemon",
    description: "Execute a solution sandbox that runs in under 3 milliseconds.",
    iconName: "flame",
    xpReward: 150,
  },
  {
    id: "citadel_slayer",
    title: "Citadel Slayer",
    description: "Defeat the Citadel Core AI Boss and complete the skill tree.",
    iconName: "sparkles",
    xpReward: 300,
  },
];

interface AchievementsProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedIds: string[];
}

export default function Achievements({ isOpen, onClose, unlockedIds }: AchievementsProps) {
  const renderIcon = (name: string, unlocked: boolean) => {
    const className = `w-6 h-6 ${unlocked ? "text-cyan-neon" : "text-zinc-650 opacity-40"}`;
    switch (name) {
      case "book":
        return <BookOpen className={className} />;
      case "shield":
        return <Shield className={className} />;
      case "zap":
        return <Zap className={className} />;
      case "flame":
        return <Flame className={className} />;
      case "sparkles":
      default:
        return <Sparkles className={className} />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="relative w-full max-w-lg bg-[#070a13] border border-white/10 p-6 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] z-10 font-mono"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.4)]" />
                <h3 className="text-sm font-bold text-white tracking-widest uppercase">
                  neural achievements
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded border border-white/5 text-zinc-400 hover:text-white hover:bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto max-h-[340px] pr-1">
              {LIST_ACHIEVEMENTS.map((a) => {
                const isUnlocked = unlockedIds.includes(a.id);

                return (
                  <div
                    key={a.id}
                    className={`relative p-4 rounded-xl border flex gap-3 transition-all ${
                      isUnlocked
                        ? "bg-purple-950/10 border-purple-500/30 shadow-[0_0_12px_rgba(168,85,247,0.15)]"
                        : "bg-zinc-950/30 border-white/5 opacity-55"
                    }`}
                  >
                    {/* Icon Column */}
                    <div className="flex flex-col items-center shrink-0 justify-center">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
                          isUnlocked
                            ? "bg-cyan-950/30 border-cyan-500/40 text-cyan-neon"
                            : "bg-zinc-900 border-zinc-800 text-zinc-600"
                        }`}
                      >
                        {renderIcon(a.iconName, isUnlocked)}
                      </div>
                    </div>

                    {/* Text Details Column */}
                    <div className="flex-1 flex flex-col gap-0.5 select-text">
                      <span className={`text-2xs font-black uppercase ${isUnlocked ? "text-purple-300" : "text-zinc-500"}`}>
                        {a.title}
                      </span>
                      <p className="text-[9px] text-zinc-400 leading-normal">
                        {a.description}
                      </p>
                      {isUnlocked ? (
                        <span className="text-[8px] font-bold text-cyan-400 mt-1 uppercase">
                          UNLOCKED (+{a.xpReward} XP)
                        </span>
                      ) : (
                        <span className="text-[8px] font-bold text-zinc-600 mt-1 flex items-center gap-1 uppercase">
                          <Lock className="w-2.5 h-2.5" />
                          <span>LOCKED</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Achievement progression footer */}
            <div className="mt-4 pt-3 border-t border-white/5 text-[9px] text-center text-zinc-500 flex justify-between uppercase">
              <span>progression</span>
              <span className="font-bold text-cyan-neon">
                {unlockedIds.filter(id => LIST_ACHIEVEMENTS.some(a => a.id === id)).length} / {LIST_ACHIEVEMENTS.length} unlocked
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
