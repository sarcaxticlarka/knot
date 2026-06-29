"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, Play, Pause, RotateCcw, ArrowRight, CornerDownRight } from "lucide-react";

interface AlgoVisualizerProps {
  nodeId: string;
}

export default function AlgoVisualizer({ nodeId }: AlgoVisualizerProps) {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Define steps datasets for each node simulation
  const getSimData = () => {
    switch (nodeId) {
      case "node-1": // Array Inversions [2, 4, 1, 3, 5]
        return {
          title: "Array Inversion Matrix Simulation",
          array: [2, 4, 1, 3, 5],
          steps: [
            { i: 0, j: 1, count: 0, text: "Compare A[0]=2 with A[1]=4. In order (2 < 4). No inversion." },
            { i: 0, j: 2, count: 1, text: "Compare A[0]=2 with A[2]=1. Inversion found! (2 > 1). Total: 1." },
            { i: 0, j: 3, count: 1, text: "Compare A[0]=2 with A[3]=3. In order (2 < 3)." },
            { i: 1, j: 2, count: 2, text: "Compare A[1]=4 with A[2]=1. Inversion found! (4 > 1). Total: 2." },
            { i: 1, j: 3, count: 3, text: "Compare A[1]=4 with A[3]=3. Inversion found! (4 > 3). Total: 3." },
            { i: 1, j: 4, count: 3, text: "Compare A[1]=4 with A[4]=5. In order (4 < 5)." },
            { i: 2, j: 3, count: 3, text: "Compare A[2]=1 with A[3]=3. In order (1 < 3)." },
            { i: 3, j: 4, count: 3, text: "Compare A[3]=3 with A[4]=5. In order (3 < 5). Simulation complete! Total Inversions: 3." }
          ]
        };

      case "node-2": // Two Pointer [2, 7, 11, 15], Target = 9
        return {
          title: "Two Pointer Search Simulator",
          array: [2, 7, 11, 15],
          target: 9,
          steps: [
            { L: 0, R: 3, sum: 17, text: "Init: L points to index 1 (2), R points to index 4 (15). Sum = 17. Target = 9. Since 17 > 9, decrement R." },
            { L: 0, R: 2, sum: 13, text: "L=1 (2), R=3 (11). Sum = 13. Since 13 > 9, decrement R." },
            { L: 0, R: 1, sum: 9, text: "L=1 (2), R=2 (7). Sum = 9. Target matches! Return 1-based indices [1, 2]." }
          ]
        };

      case "node-3": // Sliding Window [1, 1, 1, 0, 0, 0, 1], K = 2
        return {
          title: "Sliding Window Nexus Simulator",
          array: [1, 1, 1, 0, 0, 0, 1],
          k: 2,
          steps: [
            { L: 0, R: 0, zeros: 0, max: 1, text: "Init: Window [1]. Zero count = 0 (<= 2). Max length: 1." },
            { L: 0, R: 2, zeros: 0, max: 3, text: "Expand Right: Window [1, 1, 1]. Zero count = 0 (<= 2). Max length: 3." },
            { L: 0, R: 3, zeros: 1, max: 4, text: "Expand Right: Window [1, 1, 1, 0]. Zero count = 1 (<= 2). Max length: 4." },
            { L: 0, R: 4, zeros: 2, max: 5, text: "Expand Right: Window [1, 1, 1, 0, 0]. Zero count = 2 (<= 2). Max length: 5." },
            { L: 0, R: 5, zeros: 3, max: 5, text: "Expand Right: Window [1,1,1,0,0,0]. Zero count = 3. (Exceeds k=2). Window must shrink!" },
            { L: 4, R: 5, zeros: 2, max: 5, text: "Shrink Left: Move left pointer to index 4. Window is now [0, 0]. Zero count = 2 (<= 2)." },
            { L: 4, R: 6, zeros: 2, max: 5, text: "Expand Right: Window [0, 0, 1]. Zero count = 2 (<= 2). Max length stays 5." }
          ]
        };

      case "node-4": // Trees
        return {
          title: "Height-Balanced Tree Simulator",
          tree: [
            { id: "A", val: 3, lh: 1, rh: 2, bal: true },
            { id: "B", val: 9, lh: 0, rh: 0, bal: true },
            { id: "C", val: 20, lh: 1, rh: 1, bal: true },
            { id: "D", val: 15, lh: 0, rh: 0, bal: true },
            { id: "E", val: 7, lh: 0, rh: 0, bal: true }
          ],
          steps: [
            { node: "D", text: "Evaluate leaf node D (15). Left height = 0, right height = 0. Balanced. Height = 1." },
            { node: "E", text: "Evaluate leaf node E (7). Left height = 0, right height = 0. Balanced. Height = 1." },
            { node: "C", text: "Evaluate node C (20). Left child D (height 1), right child E (height 1). Balance diff = 0. Balanced. Height = 2." },
            { node: "B", text: "Evaluate node B (9). Leaf node. Balanced. Height = 1." },
            { node: "A", text: "Evaluate root node A (3). Left child B (height 1), right child C (height 2). Height difference |1 - 2| = 1. Balanced! Tree is height-balanced." }
          ]
        };

      case "node-5": // Graphs DFS
        return {
          title: "Directed Loop Cycle Simulator",
          nodes: ["0", "1", "2", "3"],
          edges: [[0, 1], [1, 2], [2, 3], [3, 1]],
          steps: [
            { visiting: "0", visited: [], text: "Start DFS at Node 0. Mark 0 as VISITING (Yellow)." },
            { visiting: "1", visited: ["0"], text: "Traverse edge 0 -> 1. Mark Node 1 as VISITING (Yellow)." },
            { visiting: "2", visited: ["0", "1"], text: "Traverse edge 1 -> 2. Mark Node 2 as VISITING (Yellow)." },
            { visiting: "3", visited: ["0", "1", "2"], text: "Traverse edge 2 -> 3. Mark Node 3 as VISITING (Yellow)." },
            { conflict: "1", text: "Traverse edge 3 -> 1. Target node 1 is currently in VISITING state! Back-edge detected! Cycle loop verified." }
          ]
        };

      case "node-6": // DP Grid
      default:
        return {
          title: "Citadel DP Min-Cost Path Grid",
          grid: [
            [1, 3, 1],
            [1, 5, 1],
            [4, 2, 1]
          ],
          steps: [
            { r: 0, c: 0, val: 1, dp: [[1, 0, 0], [0, 0, 0], [0, 0, 0]], text: "Init start cell DP[0][0] = grid[0][0] = 1." },
            { r: 1, c: 0, val: 1, dp: [[1, 0, 0], [2, 0, 0], [0, 0, 0]], text: "Fill first column: DP[1][0] = DP[0][0] + grid[1][0] = 1 + 1 = 2." },
            { r: 2, c: 0, val: 4, dp: [[1, 0, 0], [2, 0, 0], [6, 0, 0]], text: "Fill first column: DP[2][0] = DP[1][0] + grid[2][0] = 2 + 4 = 6." },
            { r: 0, c: 1, val: 3, dp: [[1, 4, 0], [2, 0, 0], [6, 0, 0]], text: "Fill first row: DP[0][1] = DP[0][0] + grid[0][1] = 1 + 3 = 4." },
            { r: 0, c: 2, val: 1, dp: [[1, 4, 5], [2, 0, 0], [6, 0, 0]], text: "Fill first row: DP[0][2] = DP[0][1] + grid[0][2] = 4 + 1 = 5." },
            { r: 1, c: 1, val: 5, dp: [[1, 4, 5], [2, 7, 0], [6, 0, 0]], text: "Fill cell (1,1): min(DP[0][1], DP[1][0]) + grid[1][1] = min(4, 2) + 5 = 7." },
            { r: 1, c: 2, val: 1, dp: [[1, 4, 5], [2, 7, 6], [6, 0, 0]], text: "Fill cell (1,2): min(DP[0][2], DP[1][1]) + grid[1][2] = min(5, 7) + 1 = 6." },
            { r: 2, c: 1, val: 2, dp: [[1, 4, 5], [2, 7, 6], [6, 8, 0]], text: "Fill cell (2,1): min(DP[1][1], DP[2][0]) + grid[2][1] = min(7, 6) + 2 = 8." },
            { r: 2, c: 2, val: 1, dp: [[1, 4, 5], [2, 7, 6], [6, 8, 7]], text: "Final Citadel cell (2,2): min(DP[1][2], DP[2][1]) + grid[2][2] = min(6, 8) + 1 = 7. Solution = 7!" }
          ]
        };
    }
  };

  const sim = getSimData();
  const maxSteps = sim.steps.length;

  // Auto-play timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setStep((prev) => {
          if (prev >= maxSteps - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, maxSteps]);

  // Reset steps on node change
  useEffect(() => {
    setStep(0);
    setIsPlaying(false);
  }, [nodeId]);

  const stepForward = () => setStep((prev) => Math.min(prev + 1, maxSteps - 1));
  const stepBackward = () => setStep((prev) => Math.max(prev - 1, 0));
  const resetSim = () => {
    setStep(0);
    setIsPlaying(false);
  };

  const activeStep = sim.steps[step];

  // Specific simulation render methods
  const renderSimVisual = () => {
    if (nodeId === "node-1") {
      // Array Inversions
      const data = sim as any;
      const s = activeStep as any;
      
      return (
        <div className="flex flex-col items-center gap-4 py-2 w-full">
          <div className="flex gap-2">
            {data.array.map((val: number, idx: number) => {
              const isI = idx === s.i;
              const isJ = idx === s.j;
              
              return (
                <div
                  key={idx}
                  className={`w-10 h-10 rounded-lg border flex flex-col items-center justify-center font-bold text-xs relative ${
                    isI
                      ? "border-cyan-neon bg-cyan-950/40 text-cyan-neon shadow-[0_0_10px_rgba(0,240,255,0.4)]"
                      : isJ
                      ? "border-red-500 bg-red-950/40 text-red-400"
                      : "border-white/5 bg-zinc-950 text-zinc-400"
                  }`}
                >
                  <span>{val}</span>
                  <span className="text-[7px] text-zinc-650 absolute -bottom-4 font-normal">idx {idx}</span>
                </div>
              );
            })}
          </div>
          <div className="text-[10px] text-purple-400 font-bold uppercase mt-2">
            Inversions Counted: <span className="text-white bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/30">{s.count}</span>
          </div>
        </div>
      );
    }

    if (nodeId === "node-2") {
      // Two Pointer
      const data = sim as any;
      const s = activeStep as any;
      
      return (
        <div className="flex flex-col items-center gap-4 py-2 w-full">
          <div className="flex gap-2 relative">
            {data.array.map((val: number, idx: number) => {
              const isL = idx === s.L;
              const isR = idx === s.R;
              
              return (
                <div
                  key={idx}
                  className={`w-11 h-11 rounded-lg border flex flex-col items-center justify-center font-bold text-xs relative ${
                    isL
                      ? "border-cyan-neon bg-cyan-950/30 text-cyan-neon shadow-[0_0_10px_rgba(0,240,255,0.4)]"
                      : isR
                      ? "border-purple-400 bg-purple-950/30 text-purple-300"
                      : "border-white/5 bg-zinc-950 text-zinc-500"
                  }`}
                >
                  <span>{val}</span>
                  {isL && (
                    <div className="absolute -bottom-5 text-cyan-neon font-black text-[9px] animate-pointer-bounce flex flex-col items-center">
                      <span>▲</span>
                      <span>L</span>
                    </div>
                  )}
                  {isR && (
                    <div className="absolute -bottom-5 text-purple-300 font-black text-[9px] animate-pointer-bounce flex flex-col items-center">
                      <span>▲</span>
                      <span>R</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 mt-3 text-[10px] uppercase font-bold text-zinc-400">
            <div>Current Sum: <span className="text-white">{s.sum}</span></div>
            <div>Target: <span className="text-cyan-neon">{data.target}</span></div>
          </div>
        </div>
      );
    }

    if (nodeId === "node-3") {
      // Sliding Window
      const data = sim as any;
      const s = activeStep as any;
      
      return (
        <div className="flex flex-col items-center gap-4 py-2 w-full">
          <div className="flex gap-1.5 relative py-1.5">
            {data.array.map((val: number, idx: number) => {
              const inWindow = idx >= s.L && idx <= s.R;
              
              return (
                <div
                  key={idx}
                  className={`w-9 h-9 rounded border flex flex-col items-center justify-center font-bold text-xs relative ${
                    inWindow
                      ? "border-cyan-neon bg-cyan-950/20 text-cyan-neon shadow-[0_0_8px_rgba(0,240,255,0.3)]"
                      : "border-white/5 bg-zinc-950 text-zinc-650 opacity-40"
                  }`}
                >
                  <span>{val}</span>
                  {idx === s.L && inWindow && (
                    <span className="absolute -top-4 text-[7px] text-cyan-400 font-bold">L</span>
                  )}
                  {idx === s.R && inWindow && (
                    <span className="absolute -top-4 text-[7px] text-purple-400 font-bold">R</span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 mt-1 text-[9px] uppercase font-bold text-zinc-400 font-mono">
            <div>Flipped Zeros: <span className={s.zeros > data.k ? "text-red-500 font-black" : "text-white"}>{s.zeros}/{data.k}</span></div>
            <div>Max Window: <span className="text-purple-400">{s.max}</span></div>
          </div>
        </div>
      );
    }

    if (nodeId === "node-4") {
      // Trees
      const data = sim as any;
      const s = activeStep as any;

      return (
        <div className="flex flex-col items-center gap-3 py-1 w-full font-mono text-2xs">
          {/* Visualizing simple balanced tree */}
          <div className="flex flex-col items-center gap-1.5 relative w-full">
            {/* Root */}
            <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold ${s.node === "A" ? "border-cyan-neon bg-cyan-950/40 text-cyan-neon" : "border-white/10 bg-zinc-950"}`}>3</div>
            
            {/* Mid row */}
            <div className="flex justify-between w-40 mt-1 border-t border-white/5 pt-1 relative">
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold ${s.node === "B" ? "border-cyan-neon bg-cyan-950/40 text-cyan-neon" : "border-white/10 bg-zinc-950"}`}>9</div>
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold ${s.node === "C" ? "border-cyan-neon bg-cyan-950/40 text-cyan-neon" : "border-white/10 bg-zinc-950"}`}>20</div>
            </div>
            
            {/* Leaves */}
            <div className="flex justify-end w-44 mt-1 border-t border-white/5 pt-1 relative gap-2">
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold ${s.node === "D" ? "border-cyan-neon bg-cyan-950/40 text-cyan-neon" : "border-white/10 bg-zinc-950"}`}>15</div>
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold ${s.node === "E" ? "border-cyan-neon bg-cyan-950/40 text-cyan-neon" : "border-white/10 bg-zinc-950"}`}>7</div>
            </div>
          </div>
        </div>
      );
    }

    if (nodeId === "node-5") {
      // Graphs DFS
      const data = sim as any;
      const s = activeStep as any;

      return (
        <div className="flex flex-col items-center gap-4 py-2 w-full">
          <div className="flex items-center gap-3">
            {data.nodes.map((nodeVal: string) => {
              const isVisiting = s.visiting === nodeVal;
              const isVisited = s.visited?.includes(nodeVal);
              const isConflict = s.conflict === nodeVal;

              return (
                <div
                  key={nodeVal}
                  className={`w-9 h-9 rounded-full border flex items-center justify-center font-bold text-xs ${
                    isConflict
                      ? "border-red-500 bg-red-950/40 text-red-500 animate-ping"
                      : isVisiting
                      ? "border-amber-400 bg-amber-950/30 text-amber-300"
                      : isVisited
                      ? "border-cyan-neon bg-cyan-950/30 text-cyan-neon"
                      : "border-white/5 bg-zinc-950 text-zinc-500"
                  }`}
                >
                  {nodeVal}
                </div>
              );
            })}
          </div>
          {/* Render directed path */}
          <div className="flex items-center gap-1 text-[9px] text-zinc-500 font-bold uppercase">
            <span>Path: 0</span>
            <ArrowRight className="w-3 h-3" />
            <span className={s.visited?.includes("1") || s.visiting === "1" ? "text-cyan-neon" : ""}>1</span>
            <ArrowRight className="w-3 h-3" />
            <span className={s.visited?.includes("2") || s.visiting === "2" ? "text-cyan-neon" : ""}>2</span>
            <ArrowRight className="w-3 h-3" />
            <span className={s.visited?.includes("3") || s.visiting === "3" ? "text-cyan-neon" : ""}>3</span>
            <ArrowRight className="w-3 h-3 animate-pulse" />
            <span className={s.conflict ? "text-red-500 animate-ping" : "text-zinc-650"}>1 (Loop!)</span>
          </div>
        </div>
      );
    }

    if (nodeId === "node-6") {
      // DP Grid
      const data = sim as any;
      const s = activeStep as any;

      return (
        <div className="flex flex-col items-center gap-2 py-1 w-full font-mono text-[10px]">
          <div className="grid grid-cols-3 gap-1 bg-zinc-950/80 p-2 border border-white/5 rounded-xl">
            {data.grid.map((row: number[], rIdx: number) => {
              return row.map((val: number, cIdx: number) => {
                const isActive = s.r === rIdx && s.c === cIdx;
                const dpVal = s.dp[rIdx][cIdx];
                
                return (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    className={`w-12 h-10 border rounded flex flex-col items-center justify-center relative font-bold ${
                      isActive
                        ? "border-cyan-neon bg-cyan-950/40 text-cyan-neon shadow-[0_0_8px_rgba(0,240,255,0.4)]"
                        : dpVal > 0
                        ? "border-purple-500/30 bg-purple-950/10 text-purple-400"
                        : "border-white/5 text-zinc-600 opacity-40"
                    }`}
                  >
                    <span className="text-[7px] text-zinc-550 absolute top-0.5 left-1 select-none">
                      {val}
                    </span>
                    <span className="text-xs mt-1">{dpVal > 0 ? dpVal : "-"}</span>
                  </div>
                );
              });
            })}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="w-full bg-[#03060c] border border-white/5 rounded-xl p-4 flex flex-col gap-3 font-mono">
      {/* Visualizer header controls */}
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <span className="text-[9px] uppercase tracking-wider text-cyan-neon font-black font-mono">
          {sim.title}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={resetSim}
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/5 border border-white/5"
            title="Reset Simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/5 border border-white/5"
            title={isPlaying ? "Pause Autoplay" : "Start Autoplay"}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-cyan-neon" />}
          </button>
        </div>
      </div>

      {/* Visual Simulation playground */}
      <div className="h-28 flex items-center justify-center bg-black/40 border border-white/5 rounded-lg py-2">
        {renderSimVisual()}
      </div>

      {/* Explanation text log */}
      <div className="text-[10px] leading-relaxed text-zinc-400 font-sans flex items-start gap-2 bg-[#05070e] p-3 rounded-lg border border-white/5 shadow-inner">
        <CornerDownRight className="w-4 h-4 shrink-0 text-purple-400 mt-0.5 animate-pulse" />
        <span className="select-text">{activeStep.text}</span>
      </div>

      {/* Step slider indices */}
      <div className="flex items-center justify-between text-[9px] text-zinc-500 font-bold border-t border-white/5 pt-2">
        <button
          onClick={stepBackward}
          disabled={step === 0}
          className="flex items-center gap-1 hover:text-zinc-300 disabled:opacity-30 disabled:hover:text-zinc-500"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>PREV STEP</span>
        </button>
        <span>
          STEP {step + 1} / {maxSteps}
        </span>
        <button
          onClick={stepForward}
          disabled={step === maxSteps - 1}
          className="flex items-center gap-1 hover:text-zinc-300 disabled:opacity-30 disabled:hover:text-zinc-500"
        >
          <span>NEXT STEP</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
