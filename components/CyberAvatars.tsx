"use client";

import React from "react";

export function SyntaxKnightAvatar() {
  return (
    <svg className="w-10 h-10 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]" viewBox="0 0 100 100" fill="none">
      {/* Cyberspace Helmet outline */}
      <rect x="25" y="20" width="50" height="50" rx="10" stroke="var(--neon-cyan)" strokeWidth="3" fill="#0c1824" />
      {/* Glowing Neon Visor */}
      <rect x="30" y="32" width="40" height="10" rx="3" fill="var(--neon-cyan)" className="animate-pulse" />
      <line x1="30" y1="37" x2="70" y2="37" stroke="#ffffff" strokeWidth="1.5" opacity="0.7" />
      {/* Shoulder Armor Pauldrons */}
      <path d="M15 75 L30 65 L45 75 Z" fill="#1e293b" stroke="var(--neon-cyan)" strokeWidth="2" />
      <path d="M85 75 L70 65 L55 75 Z" fill="#1e293b" stroke="var(--neon-cyan)" strokeWidth="2" />
      {/* Sword Overlay */}
      <path d="M50 60 L50 90" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" className="animate-pulse" />
      <path d="M45 80 L55 80" stroke="#ffffff" strokeWidth="2" />
      {/* Crest */}
      <path d="M50 8 L50 20" stroke="var(--neon-cyan)" strokeWidth="3" />
      <circle cx="50" cy="8" r="4" fill="var(--neon-cyan)" className="animate-ping" />
    </svg>
  );
}

interface BossAvatarProps {
  nodeId: string;
}

export function BossAvatar({ nodeId }: BossAvatarProps) {
  // Return different SVG nodes based on challenge ID
  switch (nodeId) {
    case "node-1": // Inversion Core
      return (
        <svg className="w-10 h-10 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]" viewBox="0 0 100 100">
          {/* Rotating Prism Core */}
          <polygon
            points="50,15 85,50 50,85 15,50"
            stroke="#f43f5e"
            strokeWidth="3"
            fill="#1e0c0e"
            className="origin-center animate-spin"
            style={{ transformOrigin: "50px 50px", animationDuration: "12s" }}
          />
          <polygon
            points="50,25 75,50 50,75 25,50"
            stroke="#f43f5e"
            strokeWidth="1.5"
            fill="none"
            className="origin-center animate-spin"
            style={{ transformOrigin: "50px 50px", animationDuration: "6s" }}
          />
          <circle cx="50" cy="50" r="6" fill="#f43f5e" className="animate-ping" />
        </svg>
      );

    case "node-2": // Pointer Leviathan
      return (
        <svg className="w-10 h-10 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]" viewBox="0 0 100 100">
          {/* Leviathan Core Eye */}
          <circle cx="50" cy="50" r="30" stroke="#ef4444" strokeWidth="2" fill="#180507" />
          <circle cx="50" cy="50" r="18" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 2" />
          {/* Visor / Lens scan */}
          <line x1="20" y1="50" x2="80" y2="50" stroke="#ef4444" strokeWidth="3" />
          <circle cx="50" cy="50" r="4" fill="#ffffff" className="animate-ping" />
          {/* Orbital nodes */}
          <circle cx="50" cy="15" r="4" fill="#f43f5e" className="origin-center animate-spin" style={{ transformOrigin: "50px 50px", animationDuration: "4s" }} />
          <circle cx="50" cy="85" r="4" fill="#f43f5e" className="origin-center animate-spin" style={{ transformOrigin: "50px 50px", animationDuration: "4s" }} />
        </svg>
      );

    case "node-3": // Sliding Window Nexus
      return (
        <svg className="w-10 h-10 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]" viewBox="0 0 100 100">
          {/* Double sliding gates */}
          <rect x="15" y="25" width="30" height="50" rx="3" stroke="#f43f5e" strokeWidth="2.5" fill="#1a0406" />
          <rect x="55" y="25" width="30" height="50" rx="3" stroke="#f43f5e" strokeWidth="2.5" fill="#1a0406" />
          {/* Connector Beam */}
          <line x1="30" y1="50" x2="70" y2="50" stroke="#ffffff" strokeWidth="2" strokeDasharray="3 3" className="animate-pulse" />
          <circle cx="50" cy="50" r="8" fill="#ef4444" className="animate-ping" />
        </svg>
      );

    case "node-4": // Balanced Arborist
      return (
        <svg className="w-10 h-10 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]" viewBox="0 0 100 100">
          {/* Circuit-tree network */}
          <line x1="50" y1="15" x2="50" y2="75" stroke="#ef4444" strokeWidth="2" />
          <line x1="50" y1="40" x2="25" y2="60" stroke="#ef4444" strokeWidth="2" />
          <line x1="50" y1="55" x2="75" y2="70" stroke="#ef4444" strokeWidth="2" />
          
          <circle cx="50" cy="15" r="6" fill="#f43f5e" className="animate-pulse" />
          <circle cx="25" cy="60" r="5" fill="#f43f5e" />
          <circle cx="75" cy="70" r="5" fill="#f43f5e" />
          <circle cx="50" cy="75" r="5" fill="#f43f5e" />
        </svg>
      );

    case "node-5": // Graph Loop Daemon
      return (
        <svg className="w-10 h-10 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]" viewBox="0 0 100 100">
          {/* Cyclic loop vectors */}
          <circle cx="50" cy="50" r="28" stroke="#ef4444" strokeWidth="2" strokeDasharray="15 5" fill="none" className="origin-center animate-spin" style={{ transformOrigin: "50px 50px", animationDuration: "8s" }} />
          {/* Core loop arrows */}
          <path d="M 30,30 C 40,15 60,15 70,30" fill="none" stroke="#ef4444" strokeWidth="2.5" />
          <path d="M 70,70 C 60,85 40,85 30,70" fill="none" stroke="#ef4444" strokeWidth="2.5" />
          {/* Centroid AI node */}
          <polygon points="50,38 60,58 40,58" fill="#ef4444" className="animate-bounce" />
        </svg>
      );

    case "node-6": // Final Boss: DP Citadel
    default:
      return (
        <svg className="w-12 h-12 drop-shadow-[0_0_12px_rgba(239,68,68,0.8)]" viewBox="0 0 100 100">
          {/* Citadel outer octagonal ring */}
          <polygon
            points="50,5 82,18 95,50 82,82 50,95 18,82 5,50 18,18"
            stroke="#ef4444"
            strokeWidth="3.5"
            fill="#1f0306"
            className="origin-center animate-spin"
            style={{ transformOrigin: "50px 50px", animationDuration: "25s" }}
          />
          {/* Inner defensive hex shield */}
          <polygon
            points="50,22 74,36 74,64 50,78 26,64 26,36"
            stroke="#f43f5e"
            strokeWidth="2.5"
            fill="#2c060a"
            className="origin-center animate-spin"
            style={{ transformOrigin: "50px 50px", animationDuration: "10s" }}
          />
          {/* Glowing central core */}
          <circle cx="50" cy="50" r="12" fill="#ffffff" className="animate-pulse" />
          <circle cx="50" cy="50" r="6" fill="#ef4444" className="animate-ping" />
        </svg>
      );
  }
}
