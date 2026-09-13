// Web Audio API planetary sound synthesizer
// Maps celestial orbital parameters to harmonic musical pitches

class CelestialAudio {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (!muted) {
      this.initContext();
    }
  }

  public playPlanetTone(planetId: string) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    // Harmonic musical pitches (Hz) calibrated to celestial characteristics
    const frequencyMap: Record<string, number> = {
      sun: 108.0, // Low warm cosmic drone (A2)
      mercury: 587.33, // High fast chime (D5)
      venus: 440.0, // Harmonious A4
      earth: 392.0, // G4
      mars: 329.63, // E4
      jupiter: 220.0, // A3 deep warm resonance
      saturn: 174.61, // F3 ring harmonic
      uranus: 146.83, // D3 cold ethereal
      neptune: 110.0, // A2 deep oceanic drone
      pluto: 261.63, // C4 distant bell
    };

    const freq = frequencyMap[planetId] || 220;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Soft sine wave for ethereal space sound
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Volume envelope with gentle attack and decay
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.25);
    } catch {
      // AudioContext might be blocked until user gesture
    }
  }
}

export const celestialAudio = new CelestialAudio();
