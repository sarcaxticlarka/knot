"use client";

import React from "react";
import { Activity, Swords } from "lucide-react";
import { SyntaxKnightAvatar, BossAvatar } from "./CyberAvatars";

interface BossFightProps {
  nodeId: string;
  bossName: string;
  bossHp: number;
  bossMaxHp: number;
  playerHp: number;
  playerMaxHp: number;
  activeAttack: "player" | "boss" | null;
  damageText: { amount: number; isPlayer: boolean } | null;
  combatStatus: "idle" | "compiling" | "success" | "failure";
}

export default function BossFight({
  nodeId,
  bossName,
  bossHp,
  bossMaxHp,
  playerHp,
  playerMaxHp,
  activeAttack,
  damageText,
  combatStatus,
}: BossFightProps) {
  const isPlayerAttacking = activeAttack === "player";
  const isBossAttacking = activeAttack === "boss";

  // Procedural segment bar rendering
  const renderPowerCell = (current: number, max: number, isPlayer: boolean) => {
    const totalCells = 10;
    const filledCells = Math.round((current / max) * totalCells);
    
    return (
      <div className="flex gap-0.5 w-full">
        {Array.from({ length: totalCells }).map((_, idx) => {
          const filled = idx < filledCells;
          return (
            <div
              key={idx}
              className={`h-2.5 flex-1 rounded-sm border border-black/30 transition-all duration-300 ${
                filled
                  ? isPlayer
                    ? "bg-gradient-to-t from-cyan-600 to-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                    : "bg-gradient-to-t from-red-600 to-red-400 shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                  : "bg-zinc-900/60"
              }`}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div
      className={`relative w-full h-[180px] bg-[#03060c] border rounded-xl overflow-hidden flex flex-col justify-between p-4 transition-all duration-500 ${
        combatStatus === "compiling"
          ? "border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.15),inset_0_0_10px_rgba(239,68,68,0.1)]"
          : combatStatus === "success"
          ? "border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.15)]"
          : "border-white/5 shadow-inner"
      }`}
    >
      {/* Laser overlay scan lines */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[size:100%_4px] pointer-events-none" />

      {/* Arena header status */}
      <div className="flex items-center justify-between text-[8px] text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-1.5 font-bold">
        <span className="flex items-center gap-1.5">
          <Activity className={`w-3.5 h-3.5 ${combatStatus === "compiling" ? "text-red-500 animate-pulse" : "text-cyan-neon"}`} />
          <span>CYBERNETIC FIREWALL BATTLE</span>
        </span>
        <span className={combatStatus === "success" ? "text-purple-400" : combatStatus === "failure" ? "text-red-400" : "text-zinc-400"}>
          {combatStatus === "idle" && "LINK READY"}
          {combatStatus === "compiling" && "THREAT ENGAGED"}
          {combatStatus === "success" && "CORE DETONATED"}
          {combatStatus === "failure" && "LINK CRITICAL"}
        </span>
      </div>

      {/* Battle Scene */}
      <div className="flex-1 flex items-center justify-between relative py-2">
        {/* PLAYER: Syntax Knight */}
        <div
          className={`flex flex-col items-center w-28 gap-1.5 transition-all ${
            isBossAttacking ? "animate-player-hurt scale-95" : ""
          } ${isPlayerAttacking ? "scale-105" : ""}`}
        >
          {/* Avatar frame */}
          <div
            className={`w-14 h-14 rounded-xl flex items-center justify-center border transition-all duration-300 relative ${
              combatStatus === "failure"
                ? "bg-red-950/20 border-red-500/30 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                : "bg-cyan-950/20 border-cyan-500/30 text-cyan-neon shadow-[0_0_15px_rgba(6,182,212,0.15)]"
            }`}
          >
            <SyntaxKnightAvatar />
            {/* Active glow tag */}
            {isPlayerAttacking && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            )}
          </div>
          <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">
            Syntax Knight
          </span>
          {/* HP bar */}
          <div className="w-full flex flex-col gap-0.5">
            {renderPowerCell(playerHp, playerMaxHp, true)}
            <div className="flex justify-between text-[7px] text-zinc-500 font-bold">
              <span>SHIELD POWER</span>
              <span>
                {playerHp}/{playerMaxHp}
              </span>
            </div>
          </div>
        </div>

        {/* COMBAT LASER CORRIDOR */}
        <div className="flex-1 relative h-full flex items-center justify-center mx-4 pointer-events-none">
          {/* Neon laser sword clash vectors */}
          {isPlayerAttacking && (
            <div className="absolute left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-cyan-neon to-purple-500 animate-laser drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          )}
          {isBossAttacking && (
            <div className="absolute right-0 w-full h-1 bg-gradient-to-l from-red-500 via-rose-600 to-amber-500 animate-laser drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
          )}

          {/* Floating Damage number text */}
          {damageText && (
            <div
              className={`absolute top-2 left-1/2 -translate-x-1/2 text-sm font-black italic tracking-wider animate-float-damage z-30 ${
                damageText.isPlayer ? "text-red-500" : "text-cyan-neon glow-text-cyan"
              }`}
            >
              -{damageText.amount} HP
            </div>
          )}

          {/* Core Clashing Icon */}
          {!isPlayerAttacking && !isBossAttacking && (
            <div className="w-8 h-8 rounded-full bg-[#070a13] border border-white/10 flex items-center justify-center">
              <Swords className="w-4 h-4 text-zinc-600" />
            </div>
          )}
        </div>

        {/* BOSS: AI Daemon */}
        <div
          className={`flex flex-col items-center w-28 gap-1.5 transition-all ${
            isPlayerAttacking ? "animate-boss-shake scale-95" : ""
          } ${isBossAttacking ? "scale-105" : ""}`}
        >
          {/* Avatar frame */}
          <div
            className={`w-14 h-14 rounded-xl flex items-center justify-center border transition-all duration-300 relative ${
              combatStatus === "success"
                ? "bg-purple-950/20 border-purple-500/10 opacity-30 scale-90"
                : "bg-red-950/20 border-red-500/30 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.15)]"
            }`}
          >
            <BossAvatar nodeId={nodeId} />
            {isBossAttacking && (
              <span className="absolute -top-1 -left-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            )}
          </div>
          <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider truncate max-w-full">
            {bossName}
          </span>
          {/* HP bar */}
          <div className="w-full flex flex-col gap-0.5">
            {renderPowerCell(bossHp, bossMaxHp, false)}
            <div className="flex justify-between text-[7px] text-zinc-500 font-bold">
              <span>CORE LOAD</span>
              <span>
                {bossHp}/{bossMaxHp}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action status text */}
      <div className="text-[7.5px] text-zinc-500 text-center uppercase tracking-wider bg-zinc-900/40 py-1 rounded border border-white/5 font-semibold">
        {combatStatus === "idle" && "NEURAL GATEWAY ONLINE. SUBMIT ALGORITHM MATRIX."}
        {combatStatus === "compiling" && "THREAT DECRYPTION IN PROGRESS. KEEP LINK SECURE."}
        {combatStatus === "success" && "NODE TERMINATED. PARALLEL DECRYPTION GATEWAYS OPENED."}
        {combatStatus === "failure" && "THREAT PROTECTED. RE-ALIGN PARAMETERS."}
      </div>
    </div>
  );
}
