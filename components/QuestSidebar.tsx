"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Terminal, Code2, AlertTriangle, HelpCircle, Laptop, Gauge, CheckCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { ArenaNode } from "../app/arenaData";
import { transpilePythonToJS } from "../utils/transpiler";
import {
  playClickSound,
  playCompileSound,
  playHitSound,
  playSuccessSound,
  playFailureSound,
} from "../utils/audio";
import BossFight from "./BossFight";
import AlgoVisualizer from "./AlgoVisualizer";

interface QuestSidebarProps {
  node: ArenaNode | null;
  isOpen: boolean;
  onClose: () => void;
  onQuestComplete: (nodeId: string, xpReward: number, isPython: boolean, runtimeMs: number) => void;
}

export default function QuestSidebar({
  node,
  isOpen,
  onClose,
  onQuestComplete,
}: QuestSidebarProps) {
  const [activeTab, setActiveTab] = useState<"details" | "editor">("details");
  const [language, setLanguage] = useState<"js" | "python">("js");
  const [editorTheme, setEditorTheme] = useState<"cyberpunk" | "monokai" | "moonlight" | "obsidian">("cyberpunk");
  const [userCode, setUserCode] = useState("");
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [isCompiling, setIsCompiling] = useState(false);
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Combat RPG states
  const [bossHp, setBossHp] = useState(1000);
  const [bossMaxHp] = useState(1000);
  const [playerHp, setPlayerHp] = useState(100);
  const [playerMaxHp] = useState(100);
  const [activeAttack, setActiveAttack] = useState<"player" | "boss" | null>(null);
  const [damageText, setDamageText] = useState<{ amount: number; isPlayer: boolean } | null>(null);
  const [combatStatus, setCombatStatus] = useState<"idle" | "compiling" | "success" | "failure">("idle");

  // Dynamic width resize states
  const [width, setWidth] = useState(480);
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth >= 360 && newWidth <= 800) {
        setWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  // Sync templates on node or language change
  useEffect(() => {
    if (node) {
      setUserCode(language === "js" ? node.questDetails.codeTemplate : node.questDetails.pythonTemplate);
      setTerminalLogs([
        `> Cognitive link secure with node [${node.title}]`,
        `> Active compiler port: ${language.toUpperCase()}`,
        `> Awaiting solver instructions...`,
      ]);
      setCombatStatus("idle");
      setBossHp(1000);
      setPlayerHp(100);
      setActiveAttack(null);
      setDamageText(null);
    }
  }, [node, language]);

  // Scroll terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalLogs]);

  if (!node) return null;

  const runBenchmark = async () => {
    if (isCompiling || isBenchmarking) return;
    setIsBenchmarking(true);
    setTerminalLogs([]);

    const logDelay = (msg: string, ms: number) =>
      new Promise<void>((resolve) =>
        setTimeout(() => {
          setTerminalLogs((prev) => [...prev, msg]);
          playCompileSound();
          resolve();
        }, ms)
      );

    await logDelay(`> [BENCHMARK] Initializing performance profiler sandbox...`, 200);

    let executableJS = userCode;
    if (language === "python") {
      try {
        executableJS = transpilePythonToJS(userCode);
      } catch (err: any) {
        await logDelay(`❌ TRANSPILER ERROR: ${err.message}`, 100);
        setIsBenchmarking(false);
        playFailureSound();
        return;
      }
    }

    try {
      const sandboxCode = `${executableJS}; return ${node.questDetails.validatorName};`;
      const testFunc = new Function(sandboxCode)();

      if (typeof testFunc !== "function") {
        throw new Error(`Target function '${node.questDetails.validatorName}' is not defined.`);
      }

      await logDelay(`> [BENCHMARK] Executing function 1,000 times in loop...`, 400);

      const tc = node.questDetails.testCases[0];
      const t0 = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        if (node.id === "node-2") {
          testFunc(tc.input.energies, tc.input.target);
        } else if (node.id === "node-3") {
          testFunc(tc.input.packets, tc.input.k);
        } else if (node.id === "node-5") {
          testFunc(tc.input.n, tc.input.channels);
        } else {
          testFunc(tc.input);
        }
      }

      const t1 = performance.now();
      const totalMs = t1 - t0;
      const avgMs = totalMs / 1000;
      const opsPerSec = Math.round(1000 / (totalMs / 1000));

      let tier = "C-TIER (UNOPTIMIZED)";
      let tierColor = "crt-text-glow-red";
      if (avgMs < 0.001) {
        tier = "S-TIER (NEURAL OPTIMAL)";
        tierColor = "crt-text-glow-purple";
      } else if (avgMs < 0.005) {
        tier = "A-TIER (EXCELLENT)";
        tierColor = "crt-text-glow-cyan";
      } else if (avgMs < 0.02) {
        tier = "B-TIER (STABLE)";
        tierColor = "crt-text-glow-green";
      }

      await logDelay(`> [BENCHMARK] Profiling Results:`, 200);
      await logDelay(`  - Total Elapsed Time: ${totalMs.toFixed(3)} ms`, 100);
      await logDelay(`  - Average Latency: ${avgMs.toFixed(5)} ms`, 100);
      await logDelay(`  - Operations/Sec: ${opsPerSec.toLocaleString()} Hz`, 100);
      await logDelay(`\n> [BENCHMARK] PERFORMANCE RATING: ${tier}`, 300);

      playSuccessSound();
    } catch (err: any) {
      await logDelay(`  ❌ BENCHMARK CRASH EXCEPTION:`, 150);
      await logDelay(`     ${err.message || err}`, 100);
      playFailureSound();
    } finally {
      setIsBenchmarking(false);
    }
  };

  const runCompiler = async () => {
    if (isCompiling || isBenchmarking) return;
    setIsCompiling(true);
    setCombatStatus("compiling");
    setTerminalLogs([]);
    setBossHp(1000);
    setPlayerHp(100);

    const logDelay = (msg: string, ms: number) =>
      new Promise<void>((resolve) =>
        setTimeout(() => {
          setTerminalLogs((prev) => [...prev, msg]);
          playCompileSound();
          resolve();
        }, ms)
      );

    await logDelay(`> Initializing sandbox interpreter...`, 250);
    let executableJS = userCode;

    // Transpile if Python
    if (language === "python") {
      await logDelay(`> Executing Python-to-JS transpiler...`, 300);
      try {
        executableJS = transpilePythonToJS(userCode);
        await logDelay(`> Compiled: AST tree generated successfully.`, 200);
      } catch (err: any) {
        await logDelay(`❌ TRANSPILER SYNTAX ERROR: ${err.message}`, 100);
        setCombatStatus("failure");
        setIsCompiling(false);
        playFailureSound();
        return;
      }
    }

    await logDelay(`> Extracting target block [${node.questDetails.validatorName}]...`, 200);

    try {
      // Evaluate code
      const sandboxCode = `${executableJS}; return ${node.questDetails.validatorName};`;
      const testFunc = new Function(sandboxCode)();

      if (typeof testFunc !== "function") {
        throw new Error(`Target function '${node.questDetails.validatorName}' is not defined.`);
      }

      await logDelay(`> Link established. Executing firewall test pipeline...`, 300);

      let allPassed = true;
      const testCases = node.questDetails.testCases;
      let totalRuntime = 0;

      // Calculate HP damage chunks per test case
      const damagePerPass = Math.ceil(1000 / testCases.length);

      for (let i = 0; i < testCases.length; i++) {
        const tc = testCases[i];
        const displayNum = i + 1;
        const isHidden = !!tc.hidden;

        if (isHidden) {
          await logDelay(`> Running Encrypted Test Case #${displayNum}...`, 300);
        } else {
          await logDelay(`> Running Test Case #${displayNum}: ${tc.description}...`, 300);
        }

        const t0 = performance.now();
        let result;

        if (node.id === "node-2") {
          result = testFunc(tc.input.energies, tc.input.target);
        } else if (node.id === "node-3") {
          result = testFunc(tc.input.packets, tc.input.k);
        } else if (node.id === "node-5") {
          result = testFunc(tc.input.n, tc.input.channels);
        } else {
          result = testFunc(tc.input);
        }

        const t1 = performance.now();
        const testRuntime = t1 - t0;
        totalRuntime += testRuntime;

        const passed = JSON.stringify(result) === JSON.stringify(tc.expected);

        if (!passed) {
          allPassed = false;
          // Boss attacks player
          setDamageText({ amount: 50, isPlayer: true });
          setActiveAttack("boss");
          setPlayerHp((prev) => Math.max(prev - 50, 0));
          playHitSound();

          await logDelay(`  ❌ TEST CASE ${displayNum} FAILED`, 200);
          if (!isHidden) {
            await logDelay(`     Input:    ${JSON.stringify(tc.input)}`, 100);
            await logDelay(`     Expected: ${JSON.stringify(tc.expected)}`, 100);
            await logDelay(`     Returned: ${JSON.stringify(result)}`, 100);
          } else {
            await logDelay(`     [Hidden details are encrypted to prevent reverse-engineering]`, 100);
          }

          // Delay for damage flash animation
          await new Promise((r) => setTimeout(r, 600));
          setActiveAttack(null);
          setDamageText(null);
          break;
        } else {
          // Player attacks boss
          setDamageText({ amount: damagePerPass, isPlayer: false });
          setActiveAttack("player");
          setBossHp((prev) => Math.max(prev - damagePerPass, 0));
          playHitSound();

          if (isHidden) {
            await logDelay(`  ✅ Hidden Test Case ${displayNum} Passed!`, 200);
          } else {
            await logDelay(`  ✅ Test Case ${displayNum} Passed!`, 200);
          }

          // Delay for damage flash animation
          await new Promise((r) => setTimeout(r, 600));
          setActiveAttack(null);
          setDamageText(null);
        }
      }

      if (allPassed) {
        setBossHp(0);
        setCombatStatus("success");
        playSuccessSound();

        const avgSpeed = totalRuntime / testCases.length;
        await logDelay(`\n> 🏆 SOLUTION ACCEPTED!`, 250);
        await logDelay(`> Execution benchmark latency: ${avgSpeed.toFixed(4)}ms`, 100);
        await logDelay(`> Synchronizing skill tree neural gateways...`, 200);

        // Confetti effect
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { x: 0.85, y: 0.4 },
          colors: ["#06b6d4", "#a855f7", "#6366f1"],
        });

        // Trigger quest completion callback to parent page
        setTimeout(() => {
          onQuestComplete(node.id, node.xpReward, language === "python", avgSpeed);
        }, 1500);
      } else {
        setCombatStatus("failure");
        playFailureSound();
        await logDelay(`\n> ⚠️ STATUS: VALIDATION ERROR`, 250);
        await logDelay(`> Solution rejected by compiler matrix. Re-verify code structure.`, 100);
      }
    } catch (err: any) {
      // Syntax execution crash
      setDamageText({ amount: 100, isPlayer: true });
      setActiveAttack("boss");
      setPlayerHp(0);
      playFailureSound();
      setCombatStatus("failure");

      await logDelay(`  ❌ SANDBOX CRASH EXCEPTION:`, 150);
      await logDelay(`     ${err.message || err}`, 100);
      await logDelay(`\n> ⚠️ STATUS: EXECUTION CRASH`, 250);

      await new Promise((r) => setTimeout(r, 600));
      setActiveAttack(null);
      setDamageText(null);
    } finally {
      setIsCompiling(false);
    }
  };

  const isCompleted = node.status === "completed";

  // Difficulty styling
  let diffBadge = "text-emerald-400 border-emerald-500/20 bg-emerald-500/10";
  if (node.difficulty === "Grandmaster") {
    diffBadge = "text-red-400 border-red-500/20 bg-red-500/10";
  } else if (node.difficulty === "Specialist") {
    diffBadge = "text-amber-400 border-amber-500/20 bg-amber-500/10";
  }

  // Get Boss Name
  let bossName = "Code Daemon";
  if (node.id === "node-1") bossName = "Inversion Core";
  else if (node.id === "node-2") bossName = "Pointer Leviathan";
  else if (node.id === "node-3") bossName = "Sliding Window Nexus";
  else if (node.id === "node-4") bossName = "Balanced Arborist";
  else if (node.id === "node-5") bossName = "Graph Loop Daemon";
  else if (node.id === "node-6") bossName = "DP Citadel Core AI";

  const lines = userCode.split("\n");

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%", opacity: 0.9 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0.9 }}
          transition={{ type: "spring", damping: 25, stiffness: 220 }}
          style={{ width: typeof window !== "undefined" && window.innerWidth < 768 ? "100%" : `${width}px` }}
          className={`fixed right-0 top-0 h-full bg-[#05070e]/95 border-l border-white/10 z-50 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.85)] backdrop-blur-md ${
            isResizing ? "select-none" : ""
          }`}
        >
          {/* Draggable resize handle edge */}
          <div
            onMouseDown={startResizing}
            className={`absolute left-0 top-0 w-1.5 h-full cursor-col-resize z-50 hover:bg-cyan-neon/30 transition-all ${
              isResizing ? "bg-cyan-neon/50 w-2 shadow-[0_0_10px_rgba(0,240,255,0.4)]" : "bg-transparent"
            }`}
          />

          {/* Top Header decorative cyber notch */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-cyan-neon via-purple-500 to-indigo-500" />

          {/* Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between mt-[3px]">
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] uppercase font-mono tracking-widest text-zinc-500 font-bold flex items-center gap-1">
                <Laptop className="w-3 h-3 text-cyan-neon" />
                <span>{node.category}</span>
              </span>
              <h2 className="text-md font-black text-white font-mono tracking-wider glow-text-cyan uppercase">
                {node.title}
              </h2>
            </div>
            <button
              onClick={() => {
                playClickSound();
                onClose();
              }}
              className="p-1.5 rounded-lg border border-white/5 text-zinc-500 hover:text-white hover:bg-white/5 hover:border-cyan-500/30 transition-all active:scale-95 duration-75"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tab controllers & selectors */}
          <div className="flex items-center justify-between border-b border-white/5 px-6">
            <div className="flex">
              <button
                onClick={() => {
                  playClickSound();
                  setActiveTab("details");
                }}
                className={`flex items-center gap-2 py-3 px-4 text-2xs font-mono border-b-2 transition-all outline-none uppercase font-bold tracking-wider ${
                  activeTab === "details"
                    ? "border-cyan-neon text-cyan-neon font-black"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Briefing</span>
              </button>
              <button
                onClick={() => {
                  playClickSound();
                  setActiveTab("editor");
                }}
                className={`flex items-center gap-2 py-3 px-4 text-2xs font-mono border-b-2 transition-all outline-none uppercase font-bold tracking-wider ${
                  activeTab === "editor"
                    ? "border-cyan-neon text-cyan-neon font-black"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Console IDE</span>
              </button>
            </div>

            {/* Language & Theme Selectors */}
            {activeTab === "editor" && (
              <div className="flex items-center gap-1 bg-zinc-950/80 border border-white/5 px-2 py-1 rounded-md">
                <select
                  value={language}
                  onChange={(e) => {
                    playClickSound();
                    setLanguage(e.target.value as "js" | "python");
                  }}
                  disabled={isCompiling}
                  className="bg-transparent text-zinc-400 hover:text-zinc-200 text-[9px] font-mono font-bold outline-none cursor-pointer border-none"
                >
                  <option value="js" className="bg-[#05070e]">JS (ES6)</option>
                  <option value="python" className="bg-[#05070e]">PYTHON 3</option>
                </select>
                <select
                  value={editorTheme}
                  onChange={(e) => {
                    playClickSound();
                    setEditorTheme(e.target.value as any);
                  }}
                  className="bg-transparent text-zinc-500 hover:text-zinc-300 text-[9px] font-mono font-bold outline-none cursor-pointer border-none border-l border-white/10 pl-1 ml-1"
                >
                  <option value="cyberpunk" className="bg-[#05070e]">CYBERPUNK</option>
                  <option value="monokai" className="bg-[#05070e]">MONOKAI</option>
                  <option value="moonlight" className="bg-[#05070e]">MOONLIGHT</option>
                  <option value="obsidian" className="bg-[#05070e]">OBSIDIAN</option>
                </select>
              </div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            {activeTab === "details" ? (
              /* Briefing view with simulator */
              <div className="flex flex-col gap-5 font-mono h-full">
                <div className="flex gap-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[8px] text-zinc-500 uppercase font-bold">Difficulty</span>
                    <span className={`px-2.5 py-1 text-[9px] font-bold border rounded ${diffBadge}`}>
                      {node.difficulty.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[8px] text-zinc-500 uppercase font-bold">Reward</span>
                    <span className="px-2.5 py-1 text-[9px] font-bold bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded">
                      +{node.xpReward} XP
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[8px] text-zinc-500 uppercase font-bold">Link Status</span>
                    <span
                      className={`px-2.5 py-1 text-[9px] font-bold border rounded ${
                        isCompleted
                          ? "bg-purple-950/20 border-purple-500/30 text-purple-300"
                          : "bg-cyan-950/20 border-cyan-500/30 text-cyan-300 animate-pulse"
                      }`}
                    >
                      {node.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Objective details */}
                <div className="flex flex-col gap-2">
                  <h4 className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                    Mission Objective
                  </h4>
                  <p className="text-xs text-zinc-300 leading-relaxed bg-[#03060c] border border-white/5 p-4 rounded-xl shadow-inner font-sans">
                    {node.questDetails.problem}
                  </p>
                </div>

                {/* Input / Output */}
                <div className="grid grid-cols-2 gap-4 text-xs font-bold">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[8px] uppercase tracking-wider text-zinc-500">Sample Input</span>
                    <div className="p-3 bg-zinc-950/80 border border-white/5 rounded-lg text-cyan-400 overflow-x-auto select-all shadow-inner font-mono text-[10px]">
                      {node.questDetails.inputSample}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[8px] uppercase tracking-wider text-zinc-500">Sample Output</span>
                    <div className="p-3 bg-zinc-950/80 border border-white/5 rounded-lg text-purple-400 overflow-x-auto select-all shadow-inner font-mono text-[10px]">
                      {node.questDetails.outputSample}
                    </div>
                  </div>
                </div>

                {/* Interactive Algorithm Simulator */}
                <div className="flex flex-col gap-2">
                  <h4 className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                    Interactive Neural Sandbox simulation
                  </h4>
                  <AlgoVisualizer nodeId={node.id} />
                </div>

                {/* Trigger Button */}
                <button
                  onClick={() => {
                    playClickSound();
                    setActiveTab("editor");
                  }}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-mono text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all duration-300 active:scale-95"
                >
                  <Code2 className="w-4 h-4" />
                  <span>INITIALIZE SOLUTION CONSOLE</span>
                </button>
              </div>
            ) : (
              /* IDE & RPG Battle View */
              <div className="flex-1 flex flex-col gap-4 font-mono">
                {/* Boss Fight RPG panel */}
                <BossFight
                  nodeId={node.id}
                  bossName={bossName}
                  bossHp={bossHp}
                  bossMaxHp={bossMaxHp}
                  playerHp={playerHp}
                  playerMaxHp={playerMaxHp}
                  activeAttack={activeAttack}
                  damageText={damageText}
                  combatStatus={combatStatus}
                />

                {/* Editor textarea console */}
                <div className={`flex-1 min-h-[160px] relative border rounded-xl overflow-hidden flex editor-theme-${editorTheme} transition-all duration-300`}>
                  {/* IDE header circles */}
                  <div className="absolute top-2.5 left-3 flex gap-1 z-20">
                    <span className="w-2 h-2 rounded-full bg-red-500/70" />
                    <span className="w-2 h-2 rounded-full bg-yellow-500/70" />
                    <span className="w-2 h-2 rounded-full bg-green-500/70" />
                  </div>

                  {/* Line numbers */}
                  <div className="w-10 bg-black/20 text-zinc-500/50 border-r border-white/5 py-8 text-right pr-2.5 text-[10px] select-none leading-[1.625rem] font-bold">
                    {lines.map((_, idx) => (
                      <div key={idx}>{idx + 1}</div>
                    ))}
                  </div>

                  {/* Monospace Code input */}
                  <textarea
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    disabled={isCompiling || isBenchmarking}
                    className="flex-1 bg-transparent py-8 px-4 font-mono text-xs leading-[1.625rem] outline-none resize-none overflow-y-auto selection:bg-white/10"
                    spellCheck="false"
                  />
                </div>

                {/* Diagnostics CRT Terminal Monitor logs */}
                <div className="h-[140px] crt-monitor rounded-xl flex flex-col p-4 overflow-hidden">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2 z-10">
                    <div className="flex items-center gap-1.5 text-zinc-400 text-[9px] font-bold uppercase tracking-wider">
                      <Terminal className="w-3.5 h-3.5 text-cyan-neon" />
                      <span className="crt-text-glow-cyan">Diagnostics CRT Console</span>
                    </div>
                    {(isCompiling || isBenchmarking) && (
                      <div className="flex items-center gap-1.5 z-10">
                        <span className="w-2 h-2 rounded-full bg-cyan-neon animate-ping" />
                        <span className="text-[9px] text-cyan-400 animate-pulse uppercase tracking-wider font-bold">LINK ACTIVE</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 overflow-y-auto flex flex-col gap-1 text-[10px] leading-relaxed text-zinc-400 select-text z-10 animate-crt-flicker">
                    {terminalLogs.map((log, idx) => {
                      let colorClass = "crt-text-glow-cyan";
                      if (log.includes("✅") || log.includes("Rating")) colorClass = "crt-text-glow-green";
                      else if (log.includes("❌") || log.includes("Exception") || log.includes("Rating: C")) colorClass = "crt-text-glow-red";
                      else if (log.includes("🏆") || log.includes("Rating: S")) colorClass = "crt-text-glow-purple";
                      else if (log.includes("⚠️")) colorClass = "text-amber-400 font-bold";

                      return (
                        <div key={idx} className={`${colorClass} font-mono`}>
                          {log}
                        </div>
                      );
                    })}
                    <div ref={terminalEndRef} />
                  </div>
                </div>

                {/* Actions Tray: Benchmark & Submit */}
                <div className="flex gap-3">
                  <button
                    onClick={runBenchmark}
                    disabled={isCompiling || isBenchmarking}
                    className={`py-3 flex-1 font-bold font-mono text-xs rounded-xl flex items-center justify-center gap-2 border active:scale-95 duration-75 transition-all ${
                      isCompiling || isBenchmarking
                        ? "bg-zinc-950/80 border-white/5 text-zinc-650 cursor-not-allowed"
                        : "bg-zinc-950/40 border-white/5 text-zinc-400 hover:text-white hover:bg-zinc-900/60 hover:border-white/20"
                    }`}
                  >
                    <Gauge className="w-3.5 h-3.5" />
                    <span>RUN BENCHMARK</span>
                  </button>

                  <button
                    onClick={runCompiler}
                    disabled={isCompiling || isBenchmarking}
                    className={`py-3 flex-1 font-bold font-mono text-xs rounded-xl flex items-center justify-center gap-2 border active:scale-95 duration-75 transition-all ${
                      isCompiling || isBenchmarking
                        ? "bg-zinc-950/80 border-white/5 text-zinc-650 cursor-not-allowed"
                        : "bg-cyan-500/10 border-cyan-neon/30 text-cyan-neon hover:bg-cyan-500/20 hover:border-cyan-neon hover:shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                    }`}
                  >
                    <Play className={`w-3.5 h-3.5 ${isCompiling ? "" : "fill-cyan-400"}`} />
                    <span>COMPILE & ATTACK</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
