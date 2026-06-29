let audioCtx: AudioContext | null = null;
let isMuted = false;

// Custom Synth Waveform type
export type WaveformType = "sine" | "square" | "triangle" | "sawtooth";
let activeWaveform: WaveformType = "sine";

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  
  return audioCtx;
}

export const setAudioMuted = (muted: boolean) => {
  isMuted = muted;
};

export const isAudioMuted = () => {
  return isMuted;
};

export const setWaveformType = (type: WaveformType) => {
  activeWaveform = type;
};

export const getWaveformType = () => {
  return activeWaveform;
};

const playTone = (freq: number, type: OscillatorType, duration: number, delay = 0) => {
  if (isMuted) return;
  
  setTimeout(() => {
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      // Override oscillator type if custom waveform is selected, except for special hit/failures
      osc.type = activeWaveform;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Web Audio API failed to synthesize tone:", e);
    }
  }, delay * 1000);
};

export const playClickSound = () => {
  playTone(880, "sine", 0.04);
};

export const playCompileSound = () => {
  playTone(440, "square", 0.03);
};

export const playHitSound = () => {
  playTone(120, "triangle", 0.18);
};

export const playSuccessSound = () => {
  playTone(261.63, "triangle", 0.12, 0);    // C4
  playTone(329.63, "triangle", 0.12, 0.08); // E4
  playTone(392.00, "triangle", 0.12, 0.16); // G4
  playTone(523.25, "triangle", 0.25, 0.24); // C5
};

export const playFailureSound = () => {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = activeWaveform === "sine" ? "sawtooth" : activeWaveform;
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.45);

    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.45);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.45);
  } catch (e) {
    console.warn("Web Audio API failed to synthesize tone:", e);
  }
};
