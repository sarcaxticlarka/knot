# 🌌 KNOT ARENA: Cyberpunk Coding Map & Algorithm RPG Dashboard

> **Winner-tier Hackathon Project**: A gamified skill-tree map where developers hack firewalls, run microsecond performance benchmark tests, customize synthesizer audio waveforms, and simulate algorithm solutions in real-time.

---

## 🚀 Pitch & Introduction

**Knot Arena** turns DSA practice into an immersive hacking simulation. Players traverse an interactive skill grid, facing defensive firewall systems (Boss Daemons) built on classic algorithmic structures. Instead of dry inputs, players write solutions in JS or Python, compiling code to attack bosses and unlock achievements. 

Featuring custom Web Audio synthesis, resizable console viewports, multi-theme editor interfaces, and high-performance benchmarking profiles, Knot Arena blends gaming aesthetics with real development tools to create a premium, state-of-the-art interactive coding playground.

---

## 💎 Key Features

### 1. Interactive Cybernetic Skill Map
- **Parallax Space Background**: Drifting radial-gradient space nebulae float and scale dynamically in response to map dragging.
- **Dynamic Theme Sync**: Changing color themes (Neon Cyber, Matrix, Solar Flare, Cobalt) automatically transitions the nebulae background colors to match the active theme.
- **Orbital Holograms**: Dash-ring concentric paths spin around completed (Purple) and active (Cyan) nodes.
- **Flowing Data Packets**: Neon data particles travel down path links using SVG dash-offset animations.

### 2. Boss Daemons RPG Combat
- **Procedural SVG Bosses**: Custom-drawn, animated vectors for the player (Syntax Knight) and 6 Boss Daemons (rotating nodes, floating AI eyes, prisms).
- **Segmented HP Meters**: Retro power-cell health meters that deplete block-by-block on hits.
- **Screen Shake & Flashing**: Damage flashes and screen shake reactions on both sides.

### 3. High-Precision Performance Benchmark Suite
- **1,000x Loop Profiler**: Runs user code 1,000 times inside a secure client sandbox.
- **Advanced Metrics**: Outputs total elapsed time, average latency (to nanoseconds), operations/sec (Hz), and assigns ratings:
  - **S-Tier** (Avg Latency < 0.001ms) - Neural Optimal
  - **A-Tier** (< 0.005ms) - Excellent
  - **B-Tier** (< 0.02ms) - Stable
  - **C-Tier** - Unoptimized

### 4. Step-by-Step Algorithm Simulator
- **Visual Playgrounds**: Located in the briefing tab for each node:
  - **Array Inversions (Node 1)**: Visualizes compares and traces inversion increments.
  - **Two Pointer Search (Node 2)**: Animates `L` and `R` pointers traversing blocks.
  - **Sliding Window (Node 3)**: Highlights expanding window borders dynamically.
  - **Binary Trees (Node 4)**: Calculates leaf-to-root heights node-by-node.
  - **Graph DFS (Node 5)**: Colors nodes (Yellow/Green) and reports loop conflicts (Red).
  - **DP Grid (Node 6)**: Fills a cost matrix cell-by-cell showing transitions.
- **Autoplay & Manual Controls**: Features speed play/pause and manual step sliders.

### 5. Resizable Console IDE
- **Draggable Viewport Width**: Drag the left border of the slide-out panel to resize the editor width dynamically between `360px` and `800px`.
- **4 Syntax Themes**: Switch between Cyberpunk Neon, Classic Monokai, Moonlight, and Obsidian.
- **Dual-Language support**: Supports compiling Javascript (ES6) and Python 3.

### 6. Interactive Synth Waveform Customizer
- **Synth Engine**: Custom Web Audio API synthesizer.
- **Custom Oscillators**: Choose wave oscillator types: **SINE** (Smooth Sci-fi), **SQUARE** (8-Bit chip-tune), **TRIANGLE** (Mellow Lo-Fi), or **SAWTOOTH** (Raw Industrial).

### 7. Cognitive Sync Timeline (Mission Feed)
- **Persistent Timeline**: A slide-up terminal console in the lower-left corner displaying historic logs.
- **Local Storage Cache**: Persists log items across sessions.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16.2 (Turbopack compiler)
- **Library**: React 19.2 & TypeScript
- **Animations**: Framer Motion & CSS custom keyframes
- **Styling**: Vanilla CSS with Tailwind CSS v4 variables
- **Audio**: Web Audio API Soundwave Synthesizer
- **Assets**: Inline custom SVG assets and procedurally generated logo asset

---

## 📦 Installation & Local Run

1. Clone the repository and navigate into the workspace:
   ```bash
   cd knot
   ```
2. Install all node dependencies:
   ```bash
   npm install
   ```
3. Boot up the local Next.js development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to:
   ```url
   http://localhost:3000
   ```

---

## 📚 Coding Challenge Overview

| Node ID | Problem Name | Algorithm / Patterns | Difficulty |
| --- | --- | --- | --- |
| **Node 1** | Array Inversion Matrix | Divide and Conquer / Merge Sort | Specialist |
| **Node 2** | Quantum Pointer Search | Two Pointer / Two Sum II Sorted | Specialist |
| **Node 3** | Sliding Window Nexus | Sliding Window / Max Consecutive Ones III | Specialist |
| **Node 4** | Binary Tree Sanctum | DFS Recursive / Balanced Tree Checker | Specialist |
| **Node 5** | Graph Reconnaissance | DFS Cycle Detection / Course Schedule | Grandmaster |
| **Node 6** | DP Citadel Core | Dynamic Programming / Minimum Path Sum | Grandmaster |
