"use client";

import React, { useState, useEffect } from "react";
import { ARENA_NODES, ArenaNode } from "./arenaData";
import HUD from "../components/HUD";
import MapCanvas from "../components/MapCanvas";
import QuestSidebar from "../components/QuestSidebar";
import Leaderboard from "../components/Leaderboard";
import Achievements, { LIST_ACHIEVEMENTS } from "../components/Achievements";
import MissionLogs from "../components/MissionLogs";
import { setAudioMuted, isAudioMuted, playSuccessSound, setWaveformType, WaveformType } from "../utils/audio";
import { Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [xp, setXp] = useState(150);
  const [completedNodeIds, setCompletedNodeIds] = useState<string[]>(["node-1"]);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<"neon" | "matrix" | "solar" | "cobalt">("neon");
  const [isMounted, setIsMounted] = useState(false);

  // Gamification overlay states
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>(["first_bytes"]);
  const [isMuted, setIsMuted] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [toast, setToast] = useState<{ title: string; reward: number } | null>(null);

  // Custom Synth Waveform state
  const [waveform, setWaveform] = useState<WaveformType>("sine");

  // Dynamic Cognitive Timeline Logs
  const [missionLogs, setMissionLogs] = useState<string[]>([]);

  const addMissionLog = (message: string) => {
    setMissionLogs((prev) => {
      const time = new Date().toLocaleTimeString();
      const nextLogs = [...prev, `[${time}] > ${message}`];
      if (typeof window !== "undefined") {
        localStorage.setItem("knot-arena-logs", JSON.stringify(nextLogs));
      }
      return nextLogs;
    });
  };

  // Mount check and localStorage loading
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      const savedXp = localStorage.getItem("knot-arena-xp");
      const savedCompleted = localStorage.getItem("knot-arena-completed");
      const savedTheme = localStorage.getItem("knot-arena-theme");
      const savedMute = localStorage.getItem("knot-arena-mute");
      const savedAchievements = localStorage.getItem("knot-arena-achievements");
      const savedWaveform = localStorage.getItem("knot-arena-waveform");
      const savedLogs = localStorage.getItem("knot-arena-logs");

      if (savedXp) setXp(Number(savedXp));
      if (savedCompleted) setCompletedNodeIds(JSON.parse(savedCompleted));
      if (savedTheme) setTheme(savedTheme as any);
      if (savedMute) {
        const muted = savedMute === "true";
        setIsMuted(muted);
        setAudioMuted(muted);
      }
      if (savedAchievements) setUnlockedAchievements(JSON.parse(savedAchievements));
      if (savedWaveform) {
        setWaveform(savedWaveform as WaveformType);
        setWaveformType(savedWaveform as WaveformType);
      }
      
      if (savedLogs) {
        setMissionLogs(JSON.parse(savedLogs));
      } else {
        const initialLogs = [
          `[${new Date().toLocaleTimeString()}] > [SYSTEM INIT] Neural bridge calibrated. Arena online.`,
          `[${new Date().toLocaleTimeString()}] > [DIAGNOSTICS] 6 target gateway firewalls detected.`
        ];
        setMissionLogs(initialLogs);
        localStorage.setItem("knot-arena-logs", JSON.stringify(initialLogs));
      }
    }
  }, []);

  // Save state to localStorage
  const saveState = (newXp: number, newCompleted: string[], newAchievements: string[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("knot-arena-xp", String(newXp));
      localStorage.setItem("knot-arena-completed", JSON.stringify(newCompleted));
      localStorage.setItem("knot-arena-achievements", JSON.stringify(newAchievements));
    }
  };

  const handleThemeChange = (newTheme: "neon" | "matrix" | "solar" | "cobalt") => {
    setTheme(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("knot-arena-theme", newTheme);
    }
    addMissionLog(`THEME SHIFTED: Color overlay re-calibrated to ${newTheme.toUpperCase()}.`);
  };

  const handleMuteToggle = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    setAudioMuted(nextMute);
    if (typeof window !== "undefined") {
      localStorage.setItem("knot-arena-mute", String(nextMute));
    }
    addMissionLog(`AUDIO FEED: Sound synthesis channel ${nextMute ? "OFFLINE" : "ONLINE"}.`);
  };

  const handleWaveformChange = (newWave: WaveformType) => {
    setWaveform(newWave);
    setWaveformType(newWave);
    if (typeof window !== "undefined") {
      localStorage.setItem("knot-arena-waveform", newWave);
    }
    addMissionLog(`SYNTH CALIBRATION: Waveform oscillator set to ${newWave.toUpperCase()}.`);
  };

  const handleReset = () => {
    setXp(150);
    setCompletedNodeIds(["node-1"]);
    setUnlockedAchievements(["first_bytes"]);
    setActiveNodeId(null);
    setSidebarOpen(false);
    const resetLogs = [
      `[${new Date().toLocaleTimeString()}] > [SYSTEM INIT] Neuro-bridge reset. Progress flushed.`,
      `[${new Date().toLocaleTimeString()}] > [DIAGNOSTICS] Ready to decrypt firewalls.`
    ];
    setMissionLogs(resetLogs);
    if (typeof window !== "undefined") {
      localStorage.setItem("knot-arena-completed", JSON.stringify(["node-1"]));
      localStorage.setItem("knot-arena-achievements", JSON.stringify(["first_bytes"]));
      localStorage.setItem("knot-arena-xp", "150");
      localStorage.setItem("knot-arena-logs", JSON.stringify(resetLogs));
    }
  };

  const handleNodeSelect = (nodeId: string) => {
    setActiveNodeId(nodeId);
    setSidebarOpen(true);
  };

  const triggerAchievementUnlock = (achievementId: string, currentCompleted: string[], currentXP: number) => {
    if (unlockedAchievements.includes(achievementId)) return { nextAchievements: unlockedAchievements, nextXP: currentXP };
    
    const achievement = LIST_ACHIEVEMENTS.find((a) => a.id === achievementId);
    if (!achievement) return { nextAchievements: unlockedAchievements, nextXP: currentXP };

    const nextAchievements = [...unlockedAchievements, achievementId];
    const nextXP = currentXP + achievement.xpReward;
    
    setUnlockedAchievements(nextAchievements);
    setXp(nextXP);
    setToast({ title: achievement.title, reward: achievement.xpReward });
    playSuccessSound();

    addMissionLog(`NEURAL MEDAL EARNED: Unlocked achievements database block [${achievement.title}] (+${achievement.xpReward} XP).`);

    // Clear toast notification after delay
    setTimeout(() => {
      setToast(null);
    }, 4000);

    return { nextAchievements, nextXP };
  };

  const handleQuestComplete = (nodeId: string, xpReward: number, isPython: boolean, runtimeMs: number) => {
    if (completedNodeIds.includes(nodeId)) return;
    
    const targetNode = ARENA_NODES.find((n) => n.id === nodeId);
    const nodeTitle = targetNode ? targetNode.title : nodeId;
    const langLabel = isPython ? "Python" : "JS";
    addMissionLog(`FIREWALL DECRYPTED: Linked target "${nodeTitle}" in ${runtimeMs.toFixed(4)}ms via ${langLabel} (+${xpReward} XP).`);

    const newCompleted = [...completedNodeIds, nodeId];
    let workingXp = xp + xpReward;
    let workingAchievements = [...unlockedAchievements];

    setCompletedNodeIds(newCompleted);
    setXp(workingXp);

    // 1. Evaluate achievements: Pointer Master (Node 2 completed)
    if (nodeId === "node-2") {
      const res = triggerAchievementUnlock("pointer_path", newCompleted, workingXp);
      workingAchievements = res.nextAchievements;
      workingXp = res.nextXP;
    }

    // 2. Evaluate achievements: Python Polyglot (Code submitted in Python)
    if (isPython) {
      const res = triggerAchievementUnlock("python_poly", newCompleted, workingXp);
      workingAchievements = res.nextAchievements;
      workingXp = res.nextXP;
    }

    // 3. Evaluate achievements: Speed Daemon (Execution under 3ms)
    if (runtimeMs < 3) {
      const res = triggerAchievementUnlock("speed_demon", newCompleted, workingXp);
      workingAchievements = res.nextAchievements;
      workingXp = res.nextXP;
    }

    // 4. Evaluate achievements: Citadel Slayer (Node 6 completed)
    if (nodeId === "node-6") {
      const res = triggerAchievementUnlock("citadel_slayer", newCompleted, workingXp);
      workingAchievements = res.nextAchievements;
      workingXp = res.nextXP;
    }

    saveState(workingXp, newCompleted, workingAchievements);
    
    setSidebarOpen(false);
    setActiveNodeId(null);
  };

  // Compute live node status
  const computedNodes = ARENA_NODES.map((node) => {
    let status: "locked" | "unlocked" | "completed" = "locked";
    if (completedNodeIds.includes(node.id)) {
      status = "completed";
    } else if (
      node.prerequisites.length === 0 ||
      node.prerequisites.every((p) => completedNodeIds.includes(p))
    ) {
      status = "unlocked";
    }
    return { ...node, status };
  });

  const activeNode = computedNodes.find((n) => n.id === activeNodeId) || null;

  if (!isMounted) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#070a13] font-mono text-cyan-neon">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-cyan-neon border-t-transparent rounded-full animate-spin" />
          <span className="animate-pulse">LOADING COGNITIVE ENGINES...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col flex-1 h-full min-h-screen theme-${theme} bg-background transition-colors duration-500 overflow-hidden`}>
      {/* HUD Header */}
      <HUD
        totalXp={xp}
        solvedCount={completedNodeIds.length}
        totalCount={ARENA_NODES.length}
        theme={theme}
        onThemeChange={handleThemeChange}
        onReset={handleReset}
        isMuted={isMuted}
        onMuteToggle={handleMuteToggle}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onOpenAchievements={() => setIsAchievementsOpen(true)}
        unlockedAchievementsCount={unlockedAchievements.filter(id => LIST_ACHIEVEMENTS.some(a => a.id === id)).length}
        waveform={waveform}
        onWaveformChange={handleWaveformChange}
        onOpenLogs={() => setIsLogsOpen(true)}
      />

      {/* Main Drag Map Playground */}
      <main className="flex-1 relative">
        <MapCanvas
          nodes={computedNodes}
          activeNodeId={activeNodeId}
          onNodeSelect={handleNodeSelect}
        />

        {/* Slide Quest panel */}
        <QuestSidebar
          node={activeNode}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onQuestComplete={handleQuestComplete}
        />
      </main>

      {/* Modal overlays */}
      <Leaderboard
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        userXp={xp}
      />

      <Achievements
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        unlockedIds={unlockedAchievements}
      />

      <MissionLogs
        isOpen={isLogsOpen}
        onClose={() => setIsLogsOpen(false)}
        logs={missionLogs}
        onClearLogs={() => {
          setMissionLogs([]);
          localStorage.setItem("knot-arena-logs", JSON.stringify([]));
        }}
      />

      {/* Toast Notification for Achievement Unlock */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 50, opacity: 0, x: "-50%" }}
            animate={{ y: 0, opacity: 1, x: "-50%" }}
            exit={{ y: 50, opacity: 0, x: "-50%" }}
            className="fixed bottom-8 left-1/2 z-50 glass-panel-purple border border-purple-500/50 p-4 rounded-xl shadow-2xl flex items-center gap-3 font-mono text-xs text-white"
          >
            <Award className="w-5 h-5 text-purple-400 animate-bounce" />
            <div>
              <span className="text-[10px] text-purple-300 block uppercase tracking-widest font-bold">
                Achievement Unlocked
              </span>
              <span className="font-bold text-white font-sans">
                {toast.title} (+{toast.reward} XP)
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
