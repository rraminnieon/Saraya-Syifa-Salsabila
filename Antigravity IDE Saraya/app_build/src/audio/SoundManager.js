import { Storage } from '../utils/Storage.js';

class SoundManagerClass {
  constructor() {
    this.ctx = null;
    this.bgmTimer = null;
    this.currentTrack = null;
    this.isMuted = false;
    this.bgmVolume = 0.4;
    this.sfxVolume = 0.6;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
        const settings = Storage.getSettings();
        this.bgmVolume = settings.bgmVolume ?? 0.4;
        this.sfxVolume = settings.sfxVolume ?? 0.6;
        this.initialized = true;
      }
    } catch (e) {
      console.warn('Web Audio not supported:', e);
    }
  }

  ensureContext() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setBgmVolume(val) {
    this.bgmVolume = Math.max(0, Math.min(1, val));
  }

  setSfxVolume(val) {
    this.sfxVolume = Math.max(0, Math.min(1, val));
  }

  // --- SOUND EFFECTS SYNTHESIS ---

  playTone(freq, type, duration, startVol = 0.3, endVol = 0.001) {
    this.ensureContext();
    if (!this.ctx || this.sfxVolume <= 0) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const vol = startVol * this.sfxVolume;
      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(endVol, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }

  playJump() {
    this.ensureContext();
    if (!this.ctx || this.sfxVolume <= 0) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(450, this.ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.25 * this.sfxVolume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch (e) {}
  }

  playDoubleJump() {
    this.ensureContext();
    if (!this.ctx || this.sfxVolume <= 0) return;
    try {
      const now = this.ctx.currentTime;
      [350, 520, 700].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);
        gain.gain.setValueAtTime(0.2 * this.sfxVolume, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.1);
      });
    } catch (e) {}
  }

  playCoin() {
    this.ensureContext();
    if (!this.ctx || this.sfxVolume <= 0) return;
    try {
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(987.77, now); // B5
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1318.51, now + 0.08); // E6

      gain.gain.setValueAtTime(0.25 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.08);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.35);
    } catch (e) {}
  }

  playAttack() {
    this.ensureContext();
    if (!this.ctx || this.sfxVolume <= 0) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.3 * this.sfxVolume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch (e) {}
  }

  playEnemyHit() {
    this.ensureContext();
    if (!this.ctx || this.sfxVolume <= 0) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(250, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.18);

      gain.gain.setValueAtTime(0.4 * this.sfxVolume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.18);
    } catch (e) {}
  }

  playHurt() {
    this.ensureContext();
    if (!this.ctx || this.sfxVolume <= 0) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(60, this.ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.35 * this.sfxVolume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch (e) {}
  }

  playPowerup() {
    this.ensureContext();
    if (!this.ctx || this.sfxVolume <= 0) return;
    try {
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25];
      const now = this.ctx.currentTime;
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0.25 * this.sfxVolume, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.15);
      });
    } catch (e) {}
  }

  playLaser() {
    this.ensureContext();
    if (!this.ctx || this.sfxVolume <= 0) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.25 * this.sfxVolume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch (e) {}
  }

  playCheckpoint() {
    this.ensureContext();
    if (!this.ctx || this.sfxVolume <= 0) return;
    try {
      const now = this.ctx.currentTime;
      [440, 554.37, 659.25, 880].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.25 * this.sfxVolume, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.2);
      });
    } catch (e) {}
  }

  playBossHit() {
    this.ensureContext();
    if (!this.ctx || this.sfxVolume <= 0) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.4);

      gain.gain.setValueAtTime(0.5 * this.sfxVolume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.4);
    } catch (e) {}
  }

  playVictory() {
    this.ensureContext();
    if (!this.ctx || this.sfxVolume <= 0) return;
    try {
      const notes = [
        { f: 523.25, d: 0.15 }, // C5
        { f: 523.25, d: 0.15 }, // C5
        { f: 523.25, d: 0.15 }, // C5
        { f: 659.25, d: 0.35 }, // E5
        { f: 783.99, d: 0.25 }, // G5
        { f: 1046.50, d: 0.6 }  // C6
      ];
      let t = this.ctx.currentTime;
      notes.forEach((n) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, t);
        gain.gain.setValueAtTime(0.3 * this.sfxVolume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + n.d);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + n.d);
        t += n.d + 0.03;
      });
    } catch (e) {}
  }

  playGameOver() {
    this.ensureContext();
    if (!this.ctx || this.sfxVolume <= 0) return;
    try {
      const notes = [392.00, 369.99, 349.23, 311.13]; // G4 -> F#4 -> F4 -> Eb4
      let t = this.ctx.currentTime;
      notes.forEach((f) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, t);
        gain.gain.setValueAtTime(0.25 * this.sfxVolume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.35);
        t += 0.35;
      });
    } catch (e) {}
  }

  // --- PROCEDURAL BACKGROUND MUSIC SYNTHESIZER ---

  playBgm(trackName) {
    if (this.currentTrack === trackName && this.bgmTimer) return;
    this.stopBgm();
    this.currentTrack = trackName;
    this.ensureContext();
    if (!this.ctx) return;

    // Track melody definitions (frequencies and note durations)
    let sequence = [];
    let tempo = 140; // ms per 16th note

    if (trackName === 'beach' || trackName === 'menu') {
      // Upbeat Hawaiian ukulele groove: C - Am - F - G
      tempo = 160;
      sequence = [
        261.63, 329.63, 392.00, 523.25, 261.63, 329.63, 392.00, 523.25, // C
        220.00, 261.63, 329.63, 440.00, 220.00, 261.63, 329.63, 440.00, // Am
        174.61, 261.63, 349.23, 440.00, 174.61, 261.63, 349.23, 440.00, // F
        196.00, 246.94, 293.66, 392.00, 196.00, 293.66, 392.00, 493.88  // G
      ];
    } else if (trackName === 'jungle') {
      // Tropical jungle marimba rhythm
      tempo = 140;
      sequence = [
        196.00, 0, 246.94, 293.66, 0, 392.00, 349.23, 0,
        220.00, 0, 261.63, 329.63, 0, 440.00, 392.00, 0,
        174.61, 0, 220.00, 261.63, 0, 349.23, 329.63, 0,
        164.81, 0, 196.00, 246.94, 293.66, 329.63, 246.94, 196.00
      ];
    } else if (trackName === 'volcano') {
      // Minor dramatic lava pulse
      tempo = 120;
      sequence = [
        130.81, 164.81, 196.00, 261.63, 123.47, 155.56, 185.00, 246.94,
        110.00, 138.59, 164.81, 220.00, 103.83, 130.81, 155.56, 207.65
      ];
    } else if (trackName === 'alien') {
      // Space synth arpeggios
      tempo = 130;
      sequence = [
        329.63, 392.00, 493.88, 659.25, 587.33, 493.88, 392.00, 440.00,
        293.66, 349.23, 440.00, 587.33, 523.25, 440.00, 349.23, 392.00
      ];
    } else if (trackName === 'boss') {
      // Fast paced frantic boss techno cadence
      tempo = 100;
      sequence = [
        110.00, 110.00, 220.00, 110.00, 130.81, 110.00, 164.81, 110.00,
        123.47, 123.47, 246.94, 123.47, 146.83, 123.47, 185.00, 123.47,
        98.00,  98.00,  196.00, 98.00,  116.54, 98.00,  146.83, 98.00,
        82.41,  82.41,  164.81, 82.41,  123.47, 164.81, 220.00, 246.94
      ];
    }

    let noteIdx = 0;
    const playNext = () => {
      if (!this.ctx || this.bgmVolume <= 0) return;
      const freq = sequence[noteIdx % sequence.length];
      if (freq > 0) {
        try {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = trackName === 'boss' ? 'sawtooth' : (trackName === 'beach' ? 'triangle' : 'sine');
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

          const vol = (trackName === 'boss' ? 0.08 : 0.12) * this.bgmVolume;
          gain.gain.setValueAtTime(vol, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (tempo / 1000) * 0.9);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start();
          osc.stop(this.ctx.currentTime + (tempo / 1000) * 0.9);
        } catch (e) {}
      }
      noteIdx++;
    };

    this.bgmTimer = setInterval(playNext, tempo);
  }

  stopBgm() {
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
    this.currentTrack = null;
  }
}

export const SoundManager = new SoundManagerClass();
