// Cosmic dynamic animations engine: shooting stars, cruising spacecraft, star formation & comets

export interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export interface SpaceProbe {
  id: string;
  name: string;
  type: string;
  speedText: string;
  destination: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  heading: number;
  progress: number; // 0 to 1
  pathType: 'interstellar' | 'orbit';
  thrusterPulse: number;
}

export interface StarBirthEvent {
  active: boolean;
  x: number;
  y: number;
  startTime: number;
  progress: number; // 0 to 1 over 6 seconds
  particles: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    radius: number;
    alpha: number;
  }>;
}

export interface SolarFlare {
  angle: number; // Angle around the Sun
  height: number;
  maxHeight: number;
  baseWidth: number;
  alpha: number;
  speed: number;
  life: number;
  maxLife: number;
}

export class CosmicAnimationManager {
  public shootingStars: ShootingStar[] = [];
  public nextMeteorSpawnTime: number = 0;
  public probes: SpaceProbe[] = [];
  public starBirth: StarBirthEvent = {
    active: false,
    x: 0,
    y: 0,
    startTime: 0,
    progress: 0,
    particles: [],
  };
  public solarFlares: SolarFlare[] = [];
  public cometProgress: number = 0.25; // Halley's comet orbit progress

  constructor() {
    this.initProbes();
  }

  private initProbes() {
    // 1. Voyager 1: Traveling outward past Neptune into interstellar space
    // 2. Artemis III / Orion: Traveling between Earth and Mars / Moon
    this.probes = [
      {
        id: 'voyager1',
        name: 'Voyager 1',
        type: 'Interstellar Probe',
        speedText: '61,200 km/h (17 km/s)',
        destination: 'Oort Cloud / Interstellar Space',
        x: 480,
        y: -220,
        vx: 0.18,
        vy: -0.09,
        heading: Math.atan2(-0.09, 0.18),
        progress: 0.75,
        pathType: 'interstellar',
        thrusterPulse: 0,
      },
      {
        id: 'artemis',
        name: 'Artemis Deep Space Explorer',
        type: 'Crewed Interplanetary Vessel',
        speedText: '39,000 km/h',
        destination: 'Mars Transit Trajectory',
        x: 180,
        y: 80,
        vx: 0.25,
        vy: 0.18,
        heading: Math.atan2(0.18, 0.25),
        progress: 0.35,
        pathType: 'orbit',
        thrusterPulse: 0,
      },
    ];
  }

  public spawnShootingStar(customOrigin?: { x: number; y: number }) {
    const angle = (Math.PI * 0.2) + (Math.random() - 0.5) * 0.8; // generally diagonal
    const speed = 12 + Math.random() * 10;
    const colors = ['#E0F2FE', '#BAE6FD', '#FEF08A', '#FBCFE8', '#FFFFFF'];

    const startX = customOrigin ? customOrigin.x : (Math.random() - 0.5) * 1200 - 300;
    const startY = customOrigin ? customOrigin.y : -600 + (Math.random() - 0.5) * 300;

    this.shootingStars.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      length: 60 + Math.random() * 80,
      life: 0,
      maxLife: 45 + Math.random() * 30, // frames
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 1.5 + Math.random() * 1.5,
    });
  }

  public triggerStarBirth(x: number, y: number) {
    const particleCount = 180;
    const particles = [];
    const colors = ['#38BDF8', '#818CF8', '#C084FC', '#F472B6', '#FDE047', '#FFFFFF'];

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 60 + Math.random() * 140;
      particles.push({
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        vx: -Math.cos(angle) * (1.2 + Math.random() * 1.5),
        vy: -Math.sin(angle) * (1.2 + Math.random() * 1.5),
        color: colors[Math.floor(Math.random() * colors.length)],
        radius: 1.2 + Math.random() * 2.4,
        alpha: 0.8 + Math.random() * 0.2,
      });
    }

    this.starBirth = {
      active: true,
      x,
      y,
      startTime: performance.now(),
      progress: 0,
      particles,
    };
  }

  public spawnSolarFlare() {
    const angle = Math.random() * Math.PI * 2;
    this.solarFlares.push({
      angle,
      height: 2,
      maxHeight: 14 + Math.random() * 18,
      baseWidth: 0.15 + Math.random() * 0.2,
      alpha: 0.9,
      speed: 0.4 + Math.random() * 0.5,
      life: 0,
      maxLife: 90 + Math.random() * 60,
    });
  }

  public update(dt: number, currentTime: number, isPlaying: boolean, speedMultiplier: number) {
    // 1. Random shooting stars
    if (currentTime > this.nextMeteorSpawnTime) {
      this.spawnShootingStar();
      // Next meteor in 5 to 11 seconds
      this.nextMeteorSpawnTime = currentTime + (5000 + Math.random() * 6000);
    }

    // 2. Random solar prominence / flare eruption
    if (Math.random() < 0.015 && this.solarFlares.length < 4) {
      this.spawnSolarFlare();
    }

    // Update shooting stars
    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const s = this.shootingStars[i];
      s.x += s.vx;
      s.y += s.vy;
      s.life++;
      if (s.life >= s.maxLife) {
        this.shootingStars.splice(i, 1);
      }
    }

    // Update solar flares
    for (let i = this.solarFlares.length - 1; i >= 0; i--) {
      const f = this.solarFlares[i];
      f.life++;
      const halfLife = f.maxLife / 2;
      if (f.life < halfLife) {
        f.height += (f.maxHeight - f.height) * 0.08;
      } else {
        f.alpha *= 0.95;
      }
      if (f.life >= f.maxLife || f.alpha < 0.02) {
        this.solarFlares.splice(i, 1);
      }
    }

    // Update Halley's comet
    if (isPlaying) {
      this.cometProgress += (dt * 0.008 * speedMultiplier) % 1;
    }

    // Update Probes
    this.probes.forEach((probe) => {
      probe.thrusterPulse = Math.sin(currentTime * 0.01) * 0.5 + 0.5;

      if (isPlaying) {
        if (probe.pathType === 'interstellar') {
          // Continuous drift outwards into deep space
          probe.x += probe.vx * speedMultiplier;
          probe.y += probe.vy * speedMultiplier;

          // If too far out, loop back gracefully
          const dist = Math.hypot(probe.x, probe.y);
          if (dist > 850) {
            probe.x = 240;
            probe.y = -100;
          }
        } else {
          // Curved Mars transit route
          probe.progress += dt * 0.02 * speedMultiplier;
          if (probe.progress > 1) probe.progress = 0;

          // Elliptical transit curve between Earth (~165px) and Mars (~215px)
          const angle = probe.progress * Math.PI * 2;
          const r = 165 + (probe.progress) * 50;
          probe.x = Math.cos(angle) * r;
          probe.y = Math.sin(angle) * r;
          probe.heading = angle + Math.PI / 2;
        }
      }
    });

    // Update Star Birth Event
    if (this.starBirth.active) {
      const elapsedMs = currentTime - this.starBirth.startTime;
      const durationMs = 7000;
      this.starBirth.progress = Math.min(elapsedMs / durationMs, 1);

      if (this.starBirth.progress < 0.5) {
        // Inward collapse towards center
        this.starBirth.particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 1.02;
          p.vy *= 1.02;
        });
      } else {
        // Outward stellar shockwave & stellar wind
        this.starBirth.particles.forEach((p) => {
          p.x -= p.vx * 1.5;
          p.y -= p.vy * 1.5;
          p.alpha *= 0.985;
        });
      }

      if (this.starBirth.progress >= 1) {
        this.starBirth.active = false;
      }
    }
  }

  // Draw Shooting Stars
  public drawShootingStars(ctx: CanvasRenderingContext2D, zoom: number) {
    ctx.save();
    this.shootingStars.forEach((s) => {
      const progress = s.life / s.maxLife;
      const alpha = Math.sin(progress * Math.PI); // fade in and out

      // Head position
      const hx = s.x;
      const hy = s.y;
      // Tail position
      const dir = Math.atan2(s.vy, s.vx);
      const tx = hx - Math.cos(dir) * (s.length / zoom);
      const ty = hy - Math.sin(dir) * (s.length / zoom);

      const grad = ctx.createLinearGradient(hx, hy, tx, ty);
      grad.addColorStop(0, '#FFFFFF');
      grad.addColorStop(0.2, s.color);
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.strokeStyle = grad;
      ctx.lineWidth = (s.size * 1.5) / zoom;
      ctx.lineCap = 'round';
      ctx.globalAlpha = alpha;

      ctx.beginPath();
      ctx.moveTo(hx, hy);
      ctx.lineTo(tx, ty);
      ctx.stroke();

      // Bright head spark
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(hx, hy, (s.size * 2.2) / zoom, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  // Draw Spacecraft Probes
  public drawProbes(ctx: CanvasRenderingContext2D, zoom: number, showLabels: boolean, onProbeHover?: (probe: SpaceProbe | null) => void) {
    ctx.save();
    this.probes.forEach((probe) => {
      ctx.save();
      ctx.translate(probe.x, probe.y);
      ctx.rotate(probe.heading);

      const scale = 1 / zoom;

      // Thruster exhaust trail
      ctx.beginPath();
      const exhaustLen = (12 + probe.thrusterPulse * 8) * scale;
      const exGrad = ctx.createLinearGradient(0, 0, -exhaustLen, 0);
      exGrad.addColorStop(0, 'rgba(56, 189, 248, 0.9)');
      exGrad.addColorStop(0.5, 'rgba(147, 197, 253, 0.4)');
      exGrad.addColorStop(1, 'rgba(59, 130, 246, 0)');

      ctx.fillStyle = exGrad;
      ctx.beginPath();
      ctx.moveTo(-6 * scale, -2.5 * scale);
      ctx.lineTo(-exhaustLen, 0);
      ctx.lineTo(-6 * scale, 2.5 * scale);
      ctx.closePath();
      ctx.fill();

      // Spacecraft Body (Voyager vs Artemis)
      if (probe.id === 'voyager1') {
        // High gain dish (parabolic antenna)
        ctx.fillStyle = '#E2E8F0';
        ctx.beginPath();
        ctx.arc(4 * scale, 0, 7 * scale, -Math.PI / 2.2, Math.PI / 2.2);
        ctx.lineWidth = 1.5 * scale;
        ctx.strokeStyle = '#94A3B8';
        ctx.stroke();
        ctx.fill();

        // Feed horn in center of dish
        ctx.fillStyle = '#F59E0B';
        ctx.fillRect(7 * scale, -0.8 * scale, 3 * scale, 1.6 * scale);

        // Probe central bus & generator
        ctx.fillStyle = '#475569';
        ctx.fillRect(-4 * scale, -3 * scale, 8 * scale, 6 * scale);

        // Science magnetometer boom
        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 1 * scale;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-14 * scale, 8 * scale);
        ctx.stroke();
      } else {
        // Artemis Crew Module & Service Module with Solar Panels
        ctx.fillStyle = '#E2E8F0';
        ctx.beginPath();
        ctx.moveTo(6 * scale, 0);
        ctx.lineTo(-2 * scale, -4 * scale);
        ctx.lineTo(-2 * scale, 4 * scale);
        ctx.closePath();
        ctx.fill();

        // Blue Solar Arrays
        ctx.fillStyle = '#1E3A8A';
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 0.8 * scale;
        ctx.strokeRect(-5 * scale, -12 * scale, 3 * scale, 7 * scale);
        ctx.fillRect(-5 * scale, -12 * scale, 3 * scale, 7 * scale);

        ctx.strokeRect(-5 * scale, 5 * scale, 3 * scale, 7 * scale);
        ctx.fillRect(-5 * scale, 5 * scale, 3 * scale, 7 * scale);
      }

      ctx.restore();

      // Spacecraft Labels
      if (showLabels) {
        ctx.font = `600 ${9.5 / zoom}px system-ui, sans-serif`;
        ctx.fillStyle = '#38BDF8';
        ctx.textAlign = 'center';
        ctx.fillText(`🚀 ${probe.name}`, probe.x, probe.y + 12 / zoom);

        ctx.font = `400 ${8 / zoom}px system-ui, sans-serif`;
        ctx.fillStyle = 'rgba(224, 242, 254, 0.75)';
        ctx.fillText(`${probe.destination}`, probe.x, probe.y + 22 / zoom);
      }
    });
    ctx.restore();
  }

  // Draw Halley's Comet with realistic Solar Wind Ion & Dust Tails
  public drawComet(ctx: CanvasRenderingContext2D, zoom: number, showLabels: boolean) {
    // Highly eccentric Keplerian orbit: Perihelion near Venus (~90px), Aphelion beyond Neptune (~580px)
    const a = 330; // semi-major axis
    const e = 0.74; // eccentricity
    const b = a * Math.sqrt(1 - e * e); // semi-minor axis
    const c = a * e; // focal distance (Sun is at focus = 0, 0)

    const trueAnomaly = this.cometProgress * Math.PI * 2;
    // Comet position relative to Sun at (0, 0)
    const r = (a * (1 - e * e)) / (1 + e * Math.cos(trueAnomaly));
    const cx = Math.cos(trueAnomaly + 0.6) * r;
    const cy = Math.sin(trueAnomaly + 0.6) * r;

    // Tail always points directly AWAY from the Sun due to solar radiation pressure!
    const sunAngle = Math.atan2(cy, cx);
    const tailAngle = sunAngle; // away from sun

    // Tail grows dramatically when close to the Sun
    const proximityToSun = Math.max(0, 1 - r / 450);
    const tailLength = (40 + proximityToSun * 140) / zoom;

    ctx.save();

    // 1. Faint curved dust tail (golden)
    const dustTailEnd = {
      x: cx + Math.cos(tailAngle + 0.25) * tailLength * 0.9,
      y: cy + Math.sin(tailAngle + 0.25) * tailLength * 0.9,
    };
    const dustGrad = ctx.createLinearGradient(cx, cy, dustTailEnd.x, dustTailEnd.y);
    dustGrad.addColorStop(0, 'rgba(253, 230, 138, 0.7)');
    dustGrad.addColorStop(0.4, 'rgba(245, 158, 11, 0.3)');
    dustGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');

    ctx.strokeStyle = dustGrad;
    ctx.lineWidth = (6 + proximityToSun * 12) / zoom;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.quadraticCurveTo(
      cx + Math.cos(tailAngle + 0.12) * tailLength * 0.5,
      cy + Math.sin(tailAngle + 0.12) * tailLength * 0.5,
      dustTailEnd.x,
      dustTailEnd.y
    );
    ctx.stroke();

    // 2. Straight cyan ion tail (fluorescing carbon monoxide & water ions)
    const ionTailEnd = {
      x: cx + Math.cos(tailAngle) * tailLength * 1.3,
      y: cy + Math.sin(tailAngle) * tailLength * 1.3,
    };
    const ionGrad = ctx.createLinearGradient(cx, cy, ionTailEnd.x, ionTailEnd.y);
    ionGrad.addColorStop(0, '#FFFFFF');
    ionGrad.addColorStop(0.2, 'rgba(56, 189, 248, 0.85)');
    ionGrad.addColorStop(0.7, 'rgba(3, 105, 161, 0.3)');
    ionGrad.addColorStop(1, 'rgba(3, 105, 161, 0)');

    ctx.strokeStyle = ionGrad;
    ctx.lineWidth = (3 + proximityToSun * 4) / zoom;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(ionTailEnd.x, ionTailEnd.y);
    ctx.stroke();

    // 3. Glowing Coma and Nucleus
    const comaGrad = ctx.createRadialGradient(cx, cy, 1, cx, cy, (6 + proximityToSun * 8) / zoom);
    comaGrad.addColorStop(0, '#FFFFFF');
    comaGrad.addColorStop(0.4, '#38BDF8');
    comaGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.fillStyle = comaGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, (6 + proximityToSun * 8) / zoom, 0, Math.PI * 2);
    ctx.fill();

    // 4. Comet Label
    if (showLabels) {
      ctx.font = `600 ${9.5 / zoom}px system-ui, sans-serif`;
      ctx.fillStyle = '#7DD3FC';
      ctx.textAlign = 'center';
      ctx.fillText("Halley's Comet", cx, cy + 12 / zoom);
    }

    ctx.restore();
  }

  // Draw Solar Prominences & Flares
  public drawSolarFlares(ctx: CanvasRenderingContext2D, sunRadius: number, zoom: number) {
    ctx.save();
    this.solarFlares.forEach((flare) => {
      ctx.save();
      ctx.rotate(flare.angle);

      // Loop prominence
      ctx.beginPath();
      const p1 = { x: sunRadius, y: -flare.baseWidth * sunRadius };
      const p2 = { x: sunRadius + flare.height, y: 0 };
      const p3 = { x: sunRadius, y: flare.baseWidth * sunRadius };

      ctx.moveTo(p1.x, p1.y);
      ctx.bezierCurveTo(p1.x + flare.height * 1.1, p1.y, p2.x, p2.y, p2.x, p2.y);
      ctx.bezierCurveTo(p2.x, p2.y, p3.x + flare.height * 1.1, p3.y, p3.x, p3.y);

      ctx.strokeStyle = `rgba(255, 100, 20, ${flare.alpha})`;
      ctx.lineWidth = 3 / zoom;
      ctx.stroke();

      // Plasma glow fill
      ctx.fillStyle = `rgba(255, 200, 50, ${flare.alpha * 0.4})`;
      ctx.fill();

      ctx.restore();
    });
    ctx.restore();
  }

  // Draw Interactive Star Birth Sequence
  public drawStarBirth(ctx: CanvasRenderingContext2D, zoom: number) {
    if (!this.starBirth.active) return;

    ctx.save();
    ctx.translate(this.starBirth.x, this.starBirth.y);

    const p = this.starBirth.progress;

    // Stage 1: Collapsing Nebula Cloud (progress 0 -> 0.45)
    if (p < 0.45) {
      const nebGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 140 / zoom);
      nebGrad.addColorStop(0, 'rgba(192, 132, 252, 0.4)');
      nebGrad.addColorStop(0.4, 'rgba(56, 189, 248, 0.25)');
      nebGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = nebGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 140 / zoom, 0, Math.PI * 2);
      ctx.fill();
    }

    // Spinning accretion particles
    this.starBirth.particles.forEach((part) => {
      ctx.fillStyle = part.color;
      ctx.globalAlpha = part.alpha;
      ctx.beginPath();
      ctx.arc(part.x / zoom, part.y / zoom, part.radius / zoom, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1.0;

    // Stage 2: Nuclear Fusion Flash & Protostar Ignition (progress 0.45 -> 0.7)
    if (p >= 0.42) {
      const flashIntensity = Math.sin((p - 0.42) * (Math.PI / 0.58));
      const starRadius = (16 + p * 12) / zoom;

      // Fusion shockwave ring expanding outwards
      const shockRadius = ((p - 0.42) * 350) / zoom;
      ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(0, 1 - (p - 0.42) * 2)})`;
      ctx.lineWidth = 3 / zoom;
      ctx.beginPath();
      ctx.arc(0, 0, shockRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Bipolar Astrophysical Jets (polar plasma beams)
      const jetLength = (120 * flashIntensity) / zoom;
      const jetGrad = ctx.createLinearGradient(0, -jetLength, 0, jetLength);
      jetGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
      jetGrad.addColorStop(0.5, '#FFFFFF');
      jetGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');

      ctx.strokeStyle = jetGrad;
      ctx.lineWidth = (5 * flashIntensity) / zoom;
      ctx.beginPath();
      ctx.moveTo(0, -jetLength);
      ctx.lineTo(0, jetLength);
      ctx.stroke();

      // Baby Star Corona
      const starGrad = ctx.createRadialGradient(0, 0, starRadius * 0.2, 0, 0, starRadius * 2.5);
      starGrad.addColorStop(0, '#FFFFFF');
      starGrad.addColorStop(0.3, '#38BDF8');
      starGrad.addColorStop(0.7, '#818CF8');
      starGrad.addColorStop(1, 'rgba(129, 140, 248, 0)');
      ctx.fillStyle = starGrad;
      ctx.beginPath();
      ctx.arc(0, 0, starRadius * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Star core
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(0, 0, starRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Caption
    ctx.font = `700 ${11 / zoom}px system-ui, sans-serif`;
    ctx.fillStyle = '#E0F2FE';
    ctx.textAlign = 'center';
    const statusText = p < 0.42 ? '✨ Nebula Gravitational Collapse' : '🌟 Protostar Nuclear Ignition!';
    ctx.fillText(statusText, 0, -50 / zoom);

    ctx.restore();
  }
}

export const cosmicAnimations = new CosmicAnimationManager();
