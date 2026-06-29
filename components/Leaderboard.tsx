"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, Award, Flame } from "lucide-react";

interface LeaderboardProps {
  isOpen: boolean;
  onClose: () => void;
  userXp: number;
}

interface LeaderboardPlayer {
  name: string;
  xp: number;
  level: number;
  title: string;
  isPlayer: boolean;
}

export default function Leaderboard({ isOpen, onClose, userXp }: LeaderboardProps) {
  // Static rankings dataset + dynamic insertion of player
  const basePlayers: LeaderboardPlayer[] = [
    { name: "algo_god", xp: 2650, level: 6, title: "Grandmaster Optimizer", isPlayer: false },
    { name: "compiler_queen", xp: 2150, level: 5, title: "Pointer Specialist", isPlayer: false },
    { name: "byte_slayer", xp: 1750, level: 4, title: "Pointer Specialist", isPlayer: false },
    { name: "syntax_error", xp: 950, level: 2, title: "Syntax Novice", isPlayer: false },
    { name: "binary_baron", xp: 550, level: 2, title: "Syntax Novice", isPlayer: false },
  ];

  // Insert player and sort
  const player: LeaderboardPlayer = {
    name: "Syntax Knight (You)",
    xp: userXp,
    level: Math.floor(userXp / 500) + 1,
    title: userXp > 1000 ? "Grandmaster Optimizer" : userXp > 300 ? "Pointer Specialist" : "Syntax Novice",
    isPlayer: true,
  };

  const allPlayers = [...basePlayers, player].sort((a, b) => b.xp - a.xp);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal Box */}
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="relative w-full max-w-md bg-[#070a13] border border-white/10 p-6 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] z-10 font-mono"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
                <h3 className="text-sm font-bold text-white tracking-widest uppercase">
                  Arena Leaderboard
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded border border-white/5 text-zinc-400 hover:text-white hover:bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List */}
            <div className="flex flex-col gap-2 overflow-y-auto max-h-[300px] pr-1">
              {allPlayers.map((p, idx) => {
                const isUser = p.isPlayer;
                const rank = idx + 1;

                let medalColor = "text-zinc-500";
                if (rank === 1) medalColor = "text-yellow-500";
                else if (rank === 2) medalColor = "text-slate-300";
                else if (rank === 3) medalColor = "text-amber-600";

                return (
                  <div
                    key={p.name}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      isUser
                        ? "bg-cyan-500/10 border-cyan-neon shadow-[0_0_15px_rgba(6,182,212,0.2)] animate-pulse"
                        : "bg-zinc-950/40 border-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Rank Icon / Number */}
                      <span className="w-6 text-center font-bold text-xs flex items-center justify-center">
                        {rank <= 3 ? (
                          <Award className={`w-4 h-4 ${medalColor}`} />
                        ) : (
                          <span className="text-zinc-500">{rank}</span>
                        )}
                      </span>

                      {/* Name & Title */}
                      <div className="flex flex-col">
                        <span className={`text-xs font-bold ${isUser ? "text-cyan-neon" : "text-zinc-300"}`}>
                          {p.name}
                        </span>
                        <span className="text-[8px] text-zinc-500 uppercase">{p.title}</span>
                      </div>
                    </div>

                    {/* Level & XP */}
                    <div className="flex items-center gap-4 text-right">
                      <div className="flex flex-col">
                        <span className="text-2xs font-bold text-indigo-neon">LVL {p.level}</span>
                        <span className="text-[10px] text-zinc-400 font-bold">{p.xp} XP</span>
                      </div>
                      {rank === 1 && (
                        <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* User status footer */}
            <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-center text-zinc-500">
              Complete more challenges to claim the top rank!
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
