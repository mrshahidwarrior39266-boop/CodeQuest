// Web Audio API sound synthesizer for sorting sounds
// Generates dynamic harmonic pitches mapped to array values (200Hz - 880Hz)

class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public toggle(): boolean {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  // Maps value from 1..maxValue to a pleasant pentatonic musical frequency
  private getFreq(value: number, maxVal: number): number {
    const minFreq = 220; // A3
    const maxFreq = 784; // G5
    const ratio = Math.max(0, Math.min(1, (value - 1) / Math.max(1, maxVal - 1)));
    return minFreq + ratio * (maxFreq - minFreq);
  }

  // Play a soft comparison tone
  public playCompare(val1: number, val2: number, maxVal: number) {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const f1 = this.getFreq(val1, maxVal);
    const f2 = this.getFreq(val2, maxVal);

    this.playTone(f1, 0.08, 'sine', 0.12);
    setTimeout(() => {
      this.playTone(f2, 0.08, 'sine', 0.12);
    }, 40);
  }

  // Play a richer chord/ping for a swap
  public playSwap(val1: number, val2: number, maxVal: number) {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const f1 = this.getFreq(val1, maxVal);
    const f2 = this.getFreq(val2, maxVal);

    this.playTone(f1, 0.15, 'triangle', 0.18);
    this.playTone(f2, 0.15, 'triangle', 0.18);
  }

  // Play ascending victory arpeggio
  public playVictory() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // C major pentatonic
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 0.25, 'sine', 0.2);
      }, idx * 70);
    });
  }

  // Play quiz correct sound
  public playCorrect() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    this.playTone(523.25, 0.12, 'sine', 0.2); // C5
    setTimeout(() => {
      this.playTone(659.25, 0.2, 'sine', 0.2); // E5
    }, 90);
  }

  // Play quiz wrong sound
  public playWrong() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    this.playTone(330, 0.15, 'sawtooth', 0.1);
    setTimeout(() => {
      this.playTone(293.66, 0.2, 'sawtooth', 0.1);
    }, 120);
  }

  private playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.15) {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio autoplay policy catch
    }
  }
}

export const soundEngine = new SoundEngine();
