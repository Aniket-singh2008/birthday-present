/**
 * Audio manager with mp3 support and synthesized romantic music-box fallback
 */

class RomanticAudioManager {
  private audioEl: HTMLAudioElement | null = null;
  private audioCtx: AudioContext | null = null;
  private isPlaying = false;
  private isSynthesizing = false;
  private timer: number | null = null;
  private listeners: Set<(playing: boolean) => void> = new Set();
  private step = 0;

  // Romantic music box melody note frequencies (Happy Birthday + Romantic Variations)
  // C4, D4, E4, F4, G4, A4, Bb4, B4, C5, D5, E5, F5
  private melodyNotes: number[] = [
    261.63, 261.63, 293.66, 261.63, 349.23, 329.63, // Happy birthday to you
    261.63, 261.63, 293.66, 261.63, 392.00, 349.23, // Happy birthday to you
    261.63, 261.63, 523.25, 440.00, 349.23, 329.63, 293.66, // Happy birthday dear love
    466.16, 466.16, 440.00, 349.23, 392.00, 349.23, // Happy birthday to you
    // Romantic arpeggio interlude
    349.23, 440.00, 523.25, 659.25, 523.25, 440.00,
    329.63, 392.00, 493.88, 587.33, 493.88, 392.00,
    293.66, 349.23, 440.00, 523.25, 440.00, 349.23,
    261.63, 329.63, 392.00, 523.25, 392.00, 329.63
  ];

  constructor(private audioUrl = '/music/song.mp3') {
    if (typeof window !== 'undefined') {
      this.initAudio();
    }
  }

  private initAudio() {
    this.audioEl = new Audio();
    this.audioEl.src = this.audioUrl;
    this.audioEl.loop = true;
    this.audioEl.preload = 'auto';

    this.audioEl.addEventListener('error', () => {
      // If MP3 fails to load, gracefully fall back to web audio synth
      if (this.isPlaying && !this.isSynthesizing) {
        this.startSynth();
      }
    });
  }

  public subscribe(listener: (playing: boolean) => void): () => void {
    this.listeners.add(listener);
    listener(this.isPlaying);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) => fn(this.isPlaying));
  }

  public async toggle(): Promise<boolean> {
    if (this.isPlaying) {
      this.pause();
    } else {
      await this.play();
    }
    return this.isPlaying;
  }

  public async play(): Promise<void> {
    this.isPlaying = true;
    this.notify();

    if (this.audioEl) {
      try {
        await this.audioEl.play();
        return;
      } catch (err) {
        // Fallback to web audio synth
        this.startSynth();
      }
    } else {
      this.startSynth();
    }
  }

  public pause(): void {
    this.isPlaying = false;
    this.notify();

    if (this.audioEl) {
      this.audioEl.pause();
    }
    this.stopSynth();
  }

  private initSynthContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  private startSynth() {
    this.initSynthContext();
    if (!this.audioCtx) return;

    this.isSynthesizing = true;
    this.step = 0;

    const playNextNote = () => {
      if (!this.isPlaying || !this.isSynthesizing || !this.audioCtx) return;

      const freq = this.melodyNotes[this.step % this.melodyNotes.length];
      this.playChimeNote(freq);
      this.step++;

      // Soft music box tempo
      this.timer = window.setTimeout(playNextNote, 420);
    };

    playNextNote();
  }

  private playChimeNote(frequency: number) {
    if (!this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;

      // Primary bell oscillator
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      // Soft sine + gentle triangle for music box timbre
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, now);

      // Delicate envelope
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.14, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      // Overtone chime
      const overtone = this.audioCtx.createOscillator();
      const overGain = this.audioCtx.createGain();
      overtone.type = 'triangle';
      overtone.frequency.setValueAtTime(frequency * 2, now);
      overGain.gain.setValueAtTime(0.001, now);
      overGain.gain.linearRampToValueAtTime(0.04, now + 0.015);
      overGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

      osc.connect(gain);
      overtone.connect(overGain);
      gain.connect(this.audioCtx.destination);
      overGain.connect(this.audioCtx.destination);

      osc.start(now);
      overtone.start(now);
      osc.stop(now + 1.3);
      overtone.stop(now + 0.7);
    } catch {}
  }

  private stopSynth() {
    this.isSynthesizing = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const romanticAudio = new RomanticAudioManager();
