/**
 * Web Audio API synthesizer for cartoon sound effects
 * Zero external audio files required!
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public playCardDraw() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // White noise swoosh
    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, t);
    filter.frequency.exponentialRampToValueAtTime(2400, t + 0.12);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(t);
  }

  public playCardPlay() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(260, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.12);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.15);
  }

  public playSlap() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // Slap whip
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(480, t);
    osc.frequency.exponentialRampToValueAtTime(90, t + 0.15);

    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.18);
  }

  public playDefuse() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // Pleasant futuristic chirp
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const startTime = t + idx * 0.06;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.1);
    });
  }

  public playShuffle() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // Multiple quick clicks
    for (let i = 0; i < 6; i++) {
      const clickTime = t + i * 0.04;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(300 + Math.random() * 400, clickTime);
      gain.gain.setValueAtTime(0.12, clickTime);
      gain.gain.exponentialRampToValueAtTime(0.001, clickTime + 0.025);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(clickTime);
      osc.stop(clickTime + 0.03);
    }
  }

  public playFuture() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, t); // D5
    osc.frequency.linearRampToValueAtTime(880, t + 0.3); // A5
    osc.frequency.linearRampToValueAtTime(1174.66, t + 0.6); // D6

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.75);
  }

  public playExplosion() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // 1. Noise blast
    const bufferSize = this.ctx.sampleRate * 0.8;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.2));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, t);
    filter.frequency.exponentialRampToValueAtTime(120, t + 0.6);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.7, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.8);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start(t);

    // 2. Sub-bass boom
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(150, t);
    subOsc.frequency.exponentialRampToValueAtTime(30, t + 0.5);

    subGain.gain.setValueAtTime(0.8, t);
    subGain.gain.exponentialRampToValueAtTime(0.01, t + 0.6);

    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(t);
    subOsc.stop(t + 0.6);
  }

  public playVictory() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C E G C
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const startTime = t + idx * 0.12;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.45);
    });
  }

  /**
   * Subtle, pleasant rising chime (D5 -> A5 with soft bell overtone)
   * to notify the local player that their turn has started.
   */
  public playLocalTurn() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const dest = this.ctx.destination;

    // Upbeat, warm rising chime (D5 -> A5)
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, t); // D5
    gain1.gain.setValueAtTime(0.18, t);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    osc1.connect(gain1);
    gain1.connect(dest);
    osc1.start(t);
    osc1.stop(t + 0.19);

    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(880, t + 0.05); // A5
    gain2.gain.setValueAtTime(0.20, t + 0.05);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
    osc2.connect(gain2);
    gain2.connect(dest);
    osc2.start(t + 0.05);
    osc2.stop(t + 0.29);

    // Subtle high-frequency bell sparkle
    const osc3 = this.ctx.createOscillator();
    const gain3 = this.ctx.createGain();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(1760, t + 0.05); // A6
    gain3.gain.setValueAtTime(0.04, t + 0.05);
    gain3.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
    osc3.connect(gain3);
    gain3.connect(dest);
    osc3.start(t + 0.05);
    osc3.stop(t + 0.23);
  }

  /**
   * Subtle, gentle synthetic blip / robotic computation pip
   * to indicate an AI player's turn has begun.
   */
  public playAiTurn() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const dest = this.ctx.destination;

    // Subtle, filtered electronic tech blip
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, t);

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(370, t); // F#4
    osc1.frequency.exponentialRampToValueAtTime(440, t + 0.04);
    gain1.gain.setValueAtTime(0.12, t);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

    osc1.connect(filter);
    filter.connect(gain1);
    gain1.connect(dest);
    osc1.start(t);
    osc1.stop(t + 0.08);

    // Second softer micro-pip
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    const filter2 = this.ctx.createBiquadFilter();
    filter2.type = 'lowpass';
    filter2.frequency.setValueAtTime(1200, t + 0.04);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(520, t + 0.04);
    osc2.frequency.exponentialRampToValueAtTime(480, t + 0.09);
    gain2.gain.setValueAtTime(0.09, t + 0.04);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.11);

    osc2.connect(filter2);
    filter2.connect(gain2);
    gain2.connect(dest);
    osc2.start(t + 0.04);
    osc2.stop(t + 0.12);
  }

  /**
   * Turn begin signal router providing distinct sound for local versus AI players.
   */
  public playTurnStart(isLocal: boolean = true, isAi: boolean = !isLocal) {
    if (isLocal) {
      this.playLocalTurn();
    } else {
      this.playAiTurn();
    }
  }

  public turnStart(isLocal: boolean = true, isAi: boolean = !isLocal) {
    this.playTurnStart(isLocal, isAi);
  }

  /**
   * Urgent low time warning sound effect triggered when the turn timer countdown reaches 5 seconds.
   * Produces an alert dual-pitch tone followed by an escalating urgency warning pulse.
   */
  public lowTimeWarning(secondsLeft: number = 5) {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const dest = this.ctx.destination;

      // Escalating frequency scale based on urgency (5s down to 1s)
      const baseFreq = 880 + (5 - Math.max(1, secondsLeft)) * 75;

      // Pulse 1: Alert attack pip
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(baseFreq, t);
      osc1.frequency.exponentialRampToValueAtTime(baseFreq * 1.15, t + 0.05);
      gain1.gain.setValueAtTime(0.24, t);
      gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
      osc1.connect(gain1);
      gain1.connect(dest);
      osc1.start(t);
      osc1.stop(t + 0.08);

      // Pulse 2: Resonant high warning echo (double-beep alert)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(baseFreq * 1.25, t + 0.06);
      osc2.frequency.exponentialRampToValueAtTime(baseFreq * 1.38, t + 0.13);
      gain2.gain.setValueAtTime(0.22, t + 0.06);
      gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
      osc2.connect(gain2);
      gain2.connect(dest);
      osc2.start(t + 0.06);
      osc2.stop(t + 0.17);
    } catch (e) {}
  }

  public playLowTimeWarning(secondsLeft: number = 5) {
    this.lowTimeWarning(secondsLeft);
  }

  public timerWarning(secondsLeft: number = 5) {
    this.lowTimeWarning(secondsLeft);
  }

  public playTimerWarning(secondsLeft: number = 5) {
    this.lowTimeWarning(secondsLeft);
  }
}

export const sounds = new SoundEngine();


