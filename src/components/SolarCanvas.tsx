import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CelestialBody, SimulationState } from '../types';
import { SUN_DATA, PLANETS_DATA } from '../data/planets';
import { celestialAudio } from '../utils/audio';
import { cosmicAnimations, SpaceProbe } from '../utils/cosmicAnimations';

interface SolarCanvasProps {
  simulationState: SimulationState;
  onUpdateElapsedDays: (days: number) => void;
  onSelectBody: (body: CelestialBody) => void;
  onResetView: () => void;
  onSetZoom: (zoom: number) => void;
  onSetPan: (pan: { x: number; y: number }) => void;
}

interface Star {
  x: number;
  y: number;
  size: number;
  alpha: number;
  twinkleSpeed: number;
  color: string;
}

interface BeltParticle {
  radius: number;
  baseAngle: number;
  speed: number;
  size: number;
  color: string;
  alpha: number;
}

export const SolarCanvas: React.FC<SolarCanvasProps> = ({
  simulationState,
  onUpdateElapsedDays,
  onSelectBody,
  onResetView,
  onSetZoom,
  onSetPan,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [hoveredBody, setHoveredBody] = useState<CelestialBody | null>(null);
  const [hoveredProbe, setHoveredProbe] = useState<SpaceProbe | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [isScrubbingPlanet, setIsScrubbingPlanet] = useState<boolean>(false);

  const isDraggingCanvasRef = useRef(false);
  const draggedPlanetRef = useRef<CelestialBody | null>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0 });
  const starsRef = useRef<Star[]>([]);
  const asteroidBeltRef = useRef<BeltParticle[]>([]);
  const kuiperBeltRef = useRef<BeltParticle[]>([]);
  const trailHistoryRef = useRef<Record<string, Array<{ x: number; y: number }>>>({});

  // Fixed initial orbit angles so planets start nicely distributed
  const initialAngles = useRef<Record<string, number>>({
    mercury: 0.8,
    venus: 2.1,
    earth: 3.7,
    mars: 0.4,
    jupiter: 4.8,
    saturn: 1.5,
    uranus: 5.5,
    neptune: 3.1,
    pluto: 4.2,
  });

  // Generate background stars & Belt particles once
  useEffect(() => {
    // 1. Stars
    const starCount = 450;
    const newStars: Star[] = [];
    const starColors = ['#FFFFFF', '#E0E7FF', '#FEF3C7', '#FCE7F3', '#CFFAFE'];
    for (let i = 0; i < starCount; i++) {
      newStars.push({
        x: (Math.random() - 0.5) * 5000,
        y: (Math.random() - 0.5) * 5000,
        size: Math.random() * 1.8 + 0.4,
        alpha: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        color: starColors[Math.floor(Math.random() * starColors.length)],
      });
    }
    starsRef.current = newStars;

    // 2. Asteroid Belt (Between Mars 215 and Jupiter 285 -> radius ~242 to 264)
    const asteroids: BeltParticle[] = [];
    const asteroidColors = ['#9CA3AF', '#D1D5DB', '#6B7280', '#A3A3A3', '#E5E7EB'];
    for (let i = 0; i < 240; i++) {
      asteroids.push({
        radius: 242 + Math.random() * 22,
        baseAngle: Math.random() * Math.PI * 2,
        speed: 0.22 + Math.random() * 0.06,
        size: Math.random() * 1.5 + 0.6,
        color: asteroidColors[Math.floor(Math.random() * asteroidColors.length)],
        alpha: Math.random() * 0.5 + 0.3,
      });
    }
    asteroidBeltRef.current = asteroids;

    // 3. Kuiper Belt (Beyond Neptune 505 -> radius ~540 to 630)
    const kuiper: BeltParticle[] = [];
    const kuiperColors = ['#93C5FD', '#BAE6FD', '#E0F2FE', '#CBD5E1', '#F8FAFC'];
    for (let i = 0; i < 300; i++) {
      kuiper.push({
        radius: 540 + Math.random() * 85,
        baseAngle: Math.random() * Math.PI * 2,
        speed: 0.008 + Math.random() * 0.004,
        size: Math.random() * 1.6 + 0.5,
        color: kuiperColors[Math.floor(Math.random() * kuiperColors.length)],
        alpha: Math.random() * 0.45 + 0.2,
      });
    }
    kuiperBeltRef.current = kuiper;
  }, []);

  // Container resize observer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setDimensions({ width, height });
        }
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Compute planet coordinates in simulation space (Sun at 0, 0)
  const getPlanetPos = useCallback((planet: CelestialBody, elapsedDays: number) => {
    const init = initialAngles.current[planet.id] || 0;
    const angle = init + (2 * Math.PI * elapsedDays) / planet.orbitalPeriodDays;
    return {
      x: Math.cos(angle) * planet.orbitRadius,
      y: Math.sin(angle) * planet.orbitRadius,
      angle,
    };
  }, []);

  // Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      // Update simulation time if playing and not manually dragging a planet
      if (simulationState.isPlaying && !draggedPlanetRef.current && dt < 0.2) {
        const daysToAdd = dt * 14 * simulationState.speedMultiplier;
        onUpdateElapsedDays(simulationState.elapsedDays + daysToAdd);
      }

      // Update cosmic dynamic animations (shooting stars, spacecraft, solar flares, star formation)
      cosmicAnimations.update(dt, time, simulationState.isPlaying, simulationState.speedMultiplier);

      // Handle DPI scaling
      const dpr = window.devicePixelRatio || 1;
      const width = dimensions.width;
      const height = dimensions.height;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // Deep space background gradient
      const bgGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        50,
        width / 2,
        height / 2,
        Math.max(width, height)
      );
      bgGrad.addColorStop(0, '#0a0d1d');
      bgGrad.addColorStop(0.5, '#050711');
      bgGrad.addColorStop(1, '#020205');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Camera transformation
      const centerX = width / 2;
      const centerY = height / 2;

      let currentPanX = simulationState.pan.x;
      let currentPanY = simulationState.pan.y;

      // If a body is focused, track it smoothly
      if (simulationState.focusedBodyId) {
        if (simulationState.focusedBodyId === 'sun') {
          currentPanX = 0;
          currentPanY = 0;
        } else {
          const focusedPlanet = PLANETS_DATA.find((p) => p.id === simulationState.focusedBodyId);
          if (focusedPlanet) {
            const pPos = getPlanetPos(focusedPlanet, simulationState.elapsedDays);
            currentPanX = -pPos.x * simulationState.zoom;
            currentPanY = -pPos.y * simulationState.zoom;
          }
        }
      }

      ctx.save();
      ctx.translate(centerX + currentPanX, centerY + currentPanY);
      ctx.scale(simulationState.zoom, simulationState.zoom);

      // 1. Render Starfield
      starsRef.current.forEach((star) => {
        const twinkle = Math.sin(time * 0.002 * star.twinkleSpeed * 50 + star.x) * 0.35 + 0.65;
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.alpha * twinkle;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size / simulationState.zoom, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // 2. Render Shooting Stars / Meteors across the cosmos
      cosmicAnimations.drawShootingStars(ctx, simulationState.zoom);

      // 3. Deep Zoom Scale Markers (When zoomed out < 0.45x)
      if (simulationState.zoom < 0.45) {
        ctx.font = `500 ${10 / simulationState.zoom}px system-ui, sans-serif`;
        ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
        ctx.textAlign = 'left';
        ctx.fillText('INNER TERRESTRIAL ZONE', 80, -10);
        ctx.fillText('ASTEROID BELT', 245, -10);
        ctx.fillText('GAS & ICE GIANTS', 360, -10);
        ctx.fillText('KUIPER BELT (TRANS-NEPTUNIAN)', 550, -10);
      }

      // 4. Render Asteroid Belt
      if (simulationState.showAsteroidBelt) {
        ctx.save();
        asteroidBeltRef.current.forEach((ast) => {
          const angle = ast.baseAngle + (ast.speed * simulationState.elapsedDays * Math.PI * 2) / 365.25;
          const ax = Math.cos(angle) * ast.radius;
          const ay = Math.sin(angle) * ast.radius;
          ctx.fillStyle = ast.color;
          ctx.globalAlpha = ast.alpha;
          ctx.beginPath();
          ctx.arc(ax, ay, ast.size / Math.max(simulationState.zoom * 0.8, 0.8), 0, Math.PI * 2);
          ctx.fill();
        });

        // Label Ceres in asteroid belt
        const ceresAngle = 1.2 + (0.21 * simulationState.elapsedDays * Math.PI * 2) / 365.25;
        const cx = Math.cos(ceresAngle) * 253;
        const cy = Math.sin(ceresAngle) * 253;
        ctx.fillStyle = '#E2E8F0';
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.arc(cx, cy, 2.5 / simulationState.zoom, 0, Math.PI * 2);
        ctx.fill();

        if (simulationState.showLabels) {
          ctx.font = `600 ${9 / simulationState.zoom}px system-ui, sans-serif`;
          ctx.fillStyle = 'rgba(203, 213, 225, 0.8)';
          ctx.textAlign = 'center';
          ctx.fillText('Ceres (Dwarf)', cx, cy + 6 / simulationState.zoom);
        }
        ctx.restore();
      }

      // 5. Render Kuiper Belt
      if (simulationState.showKuiperBelt) {
        ctx.save();
        kuiperBeltRef.current.forEach((kp) => {
          const angle = kp.baseAngle + (kp.speed * simulationState.elapsedDays * Math.PI * 2) / 365.25;
          const kx = Math.cos(angle) * kp.radius;
          const ky = Math.sin(angle) * kp.radius;
          ctx.fillStyle = kp.color;
          ctx.globalAlpha = kp.alpha;
          ctx.beginPath();
          ctx.arc(kx, ky, kp.size / Math.max(simulationState.zoom * 0.8, 0.8), 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();
      }

      // 6. Render Orbit Lines
      if (simulationState.showOrbits) {
        PLANETS_DATA.forEach((planet) => {
          const isSelected = simulationState.selectedBodyId === planet.id;
          const isHovered = hoveredBody?.id === planet.id;

          ctx.beginPath();
          ctx.arc(0, 0, planet.orbitRadius, 0, Math.PI * 2);

          if (isSelected) {
            ctx.strokeStyle = planet.accentColor;
            ctx.lineWidth = 2.2 / simulationState.zoom;
            ctx.shadowColor = planet.accentColor;
            ctx.shadowBlur = 10;
            ctx.stroke();
            ctx.shadowBlur = 0;
          } else if (isHovered) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
            ctx.lineWidth = 1.8 / simulationState.zoom;
            ctx.stroke();
          } else {
            ctx.strokeStyle = planet.type === 'Dwarf Planet' ? 'rgba(210, 180, 140, 0.2)' : 'rgba(255, 255, 255, 0.12)';
            ctx.lineWidth = 1 / simulationState.zoom;
            ctx.setLineDash([4 / simulationState.zoom, 6 / simulationState.zoom]);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        });
      }

      // 7. Render Orbit Trails
      if (simulationState.showTrails) {
        PLANETS_DATA.forEach((planet) => {
          const pos = getPlanetPos(planet, simulationState.elapsedDays);
          if (!trailHistoryRef.current[planet.id]) {
            trailHistoryRef.current[planet.id] = [];
          }
          const history = trailHistoryRef.current[planet.id];
          history.push({ x: pos.x, y: pos.y });
          if (history.length > 40) history.shift();

          if (history.length > 1) {
            ctx.beginPath();
            ctx.moveTo(history[0].x, history[0].y);
            for (let i = 1; i < history.length; i++) {
              ctx.lineTo(history[i].x, history[i].y);
            }
            ctx.strokeStyle = planet.glowColor;
            ctx.lineWidth = 1.8 / simulationState.zoom;
            ctx.stroke();
          }
        });
      }

      // 8. RENDER THE SUN
      const sunSelected = simulationState.selectedBodyId === 'sun';
      const sunHovered = hoveredBody?.id === 'sun';
      const sunRadius = SUN_DATA.visualRadius;

      // Outer animated corona
      const coronaPulse = Math.sin(time * 0.003) * 3;
      const coronaGrad = ctx.createRadialGradient(
        0,
        0,
        sunRadius * 0.7,
        0,
        0,
        sunRadius * 2.2 + coronaPulse
      );
      coronaGrad.addColorStop(0, 'rgba(255, 170, 0, 0.85)');
      coronaGrad.addColorStop(0.35, 'rgba(255, 100, 0, 0.45)');
      coronaGrad.addColorStop(0.7, 'rgba(255, 50, 0, 0.15)');
      coronaGrad.addColorStop(1, 'rgba(255, 0, 0, 0)');
      ctx.fillStyle = coronaGrad;
      ctx.beginPath();
      ctx.arc(0, 0, sunRadius * 2.2 + coronaPulse, 0, Math.PI * 2);
      ctx.fill();

      // Dynamic Solar Prominences / Flares erupting from Sun limb
      cosmicAnimations.drawSolarFlares(ctx, sunRadius, simulationState.zoom);

      // Sun body gradient
      const sunBodyGrad = ctx.createRadialGradient(
        -sunRadius * 0.25,
        -sunRadius * 0.25,
        sunRadius * 0.1,
        0,
        0,
        sunRadius
      );
      sunBodyGrad.addColorStop(0, '#FFFFFF');
      sunBodyGrad.addColorStop(0.3, '#FFF275');
      sunBodyGrad.addColorStop(0.65, '#FF8C00');
      sunBodyGrad.addColorStop(1, '#FF4500');
      ctx.fillStyle = sunBodyGrad;
      ctx.beginPath();
      ctx.arc(0, 0, sunRadius, 0, Math.PI * 2);
      ctx.fill();

      // Sun Selection / Hover Indicator
      if (sunSelected || sunHovered) {
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2.5 / simulationState.zoom;
        ctx.beginPath();
        ctx.arc(0, 0, sunRadius + 6 / simulationState.zoom, 0, Math.PI * 2);
        ctx.stroke();
      }

      if (simulationState.showLabels) {
        ctx.font = `700 ${13 / simulationState.zoom}px system-ui, -apple-system, sans-serif`;
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText('Sun', 0, sunRadius + 10 / simulationState.zoom);
      }

      // 9. RENDER ALL PLANETS
      PLANETS_DATA.forEach((planet) => {
        const { x, y, angle } = getPlanetPos(planet, simulationState.elapsedDays);
        const isSelected = simulationState.selectedBodyId === planet.id;
        const isHovered = hoveredBody?.id === planet.id;
        const isDragged = draggedPlanetRef.current?.id === planet.id;
        const radius = planet.visualRadius;

        ctx.save();
        ctx.translate(x, y);

        // Back half of rings (for Saturn / Uranus)
        if (planet.rings) {
          ctx.save();
          ctx.rotate(planet.rings.tiltAngle);
          ctx.scale(1, 0.35);
          ctx.beginPath();
          ctx.arc(0, 0, planet.rings.outerRadius, Math.PI, Math.PI * 2);
          ctx.arc(0, 0, planet.rings.innerRadius, Math.PI * 2, Math.PI, true);
          ctx.fillStyle = planet.rings.color;
          ctx.fill();
          ctx.restore();
        }

        // Selection / Hover / Drag Halo
        if (isSelected || isHovered || isDragged) {
          const glowSize = radius + 6 / simulationState.zoom;
          ctx.strokeStyle = isDragged ? '#38BDF8' : isSelected ? planet.accentColor : 'rgba(255, 255, 255, 0.7)';
          ctx.lineWidth = (isDragged ? 2.8 : 2.2) / simulationState.zoom;
          ctx.beginPath();
          ctx.arc(0, 0, glowSize, 0, Math.PI * 2);
          ctx.stroke();

          if (isHovered && !isDragged) {
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
            ctx.lineWidth = 1 / simulationState.zoom;
            ctx.setLineDash([2 / simulationState.zoom, 2 / simulationState.zoom]);
            ctx.beginPath();
            ctx.arc(0, 0, glowSize + 4 / simulationState.zoom, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }

        // Atmospheric / Planetary Glow
        const planetGlow = ctx.createRadialGradient(0, 0, radius * 0.8, 0, 0, radius * 1.6);
        planetGlow.addColorStop(0, planet.glowColor);
        planetGlow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = planetGlow;
        ctx.beginPath();
        ctx.arc(0, 0, radius * 1.6, 0, Math.PI * 2);
        ctx.fill();

        // 3D Shading: Light vector points directly from Sun (0, 0)
        const lightAngle = angle + Math.PI;
        const lightX = Math.cos(lightAngle) * radius * 0.4;
        const lightY = Math.sin(lightAngle) * radius * 0.4;

        const sphereGrad = ctx.createRadialGradient(
          lightX,
          lightY,
          radius * 0.05,
          0,
          0,
          radius
        );
        sphereGrad.addColorStop(0, planet.accentColor);
        sphereGrad.addColorStop(0.5, planet.color);
        sphereGrad.addColorStop(0.9, '#070A12');
        sphereGrad.addColorStop(1, '#020306');

        ctx.fillStyle = sphereGrad;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();

        // Planet-specific surface details
        if (planet.id === 'earth') {
          ctx.fillStyle = 'rgba(34, 197, 94, 0.55)';
          ctx.beginPath();
          ctx.arc(lightX * 0.6, lightY * 0.6, radius * 0.4, 0, Math.PI);
          ctx.fill();

          // Orbiting Moon
          const moonAngle = angle * 13.3;
          const moonDist = radius + 9 / simulationState.zoom;
          const mx = Math.cos(moonAngle) * moonDist;
          const my = Math.sin(moonAngle) * moonDist;
          ctx.fillStyle = '#E2E8F0';
          ctx.beginPath();
          ctx.arc(mx, my, 2 / simulationState.zoom, 0, Math.PI * 2);
          ctx.fill();
        } else if (planet.id === 'jupiter') {
          ctx.strokeStyle = 'rgba(100, 50, 20, 0.35)';
          ctx.lineWidth = 2 / simulationState.zoom;
          ctx.beginPath();
          ctx.moveTo(-radius * 0.8, -radius * 0.25);
          ctx.lineTo(radius * 0.8, -radius * 0.25);
          ctx.moveTo(-radius * 0.85, radius * 0.2);
          ctx.lineTo(radius * 0.85, radius * 0.2);
          ctx.stroke();

          ctx.fillStyle = '#B91C1C';
          ctx.beginPath();
          ctx.ellipse(radius * 0.3, radius * 0.25, 4, 2.5, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (planet.id === 'mars') {
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(0, -radius * 0.8, radius * 0.28, 0, Math.PI * 2);
          ctx.fill();
        }

        // Front half of rings (Saturn)
        if (planet.rings && planet.id === 'saturn') {
          ctx.save();
          ctx.rotate(planet.rings.tiltAngle);
          ctx.scale(1, 0.35);
          ctx.beginPath();
          ctx.arc(0, 0, planet.rings.outerRadius, 0, Math.PI);
          ctx.arc(0, 0, planet.rings.innerRadius, 0, Math.PI, true);
          ctx.fillStyle = planet.rings.color;
          ctx.fill();
          ctx.restore();
        }

        // Planet Label
        if (simulationState.showLabels) {
          ctx.font = `${isSelected ? '700' : '500'} ${11 / simulationState.zoom}px system-ui, -apple-system, sans-serif`;
          ctx.fillStyle = isSelected ? '#FFFFFF' : 'rgba(255, 255, 255, 0.8)';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';

          const labelOffset = radius + (planet.rings ? planet.rings.outerRadius * 0.4 : 5) + 4 / simulationState.zoom;
          ctx.fillText(planet.name, 0, labelOffset);

          if (isSelected) {
            ctx.font = `400 ${9.5 / simulationState.zoom}px system-ui, -apple-system, sans-serif`;
            ctx.fillStyle = planet.accentColor;
            ctx.fillText(`${planet.distanceFromSunAU} AU`, 0, labelOffset + 13 / simulationState.zoom);
          }
        }

        ctx.restore();
      });

      // 10. RENDER SPACECRAFT PROBES & HALLEY'S COMET (if enabled)
      if (simulationState.showSpacecraft !== false) {
        cosmicAnimations.drawProbes(ctx, simulationState.zoom, simulationState.showLabels);
        cosmicAnimations.drawComet(ctx, simulationState.zoom, simulationState.showLabels);
      }

      // 11. RENDER INTERACTIVE STAR BIRTH / PROTOSTAR FORMATION (if triggered)
      if (cosmicAnimations.starBirth.active) {
        cosmicAnimations.drawStarBirth(ctx, simulationState.zoom);
      }

      ctx.restore(); // restore camera transform
      ctx.restore(); // restore DPR transform

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [
    dimensions,
    simulationState,
    hoveredBody,
    onUpdateElapsedDays,
    getPlanetPos,
  ]);

  // Transform canvas mouse coordinates to simulation space (center = 0, 0)
  const getSimCoordinates = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;

    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;

    const simX = (mouseX - (centerX + simulationState.pan.x)) / simulationState.zoom;
    const simY = (mouseY - (centerY + simulationState.pan.y)) / simulationState.zoom;

    return { x: simX, y: simY };
  };

  // Find body at mouse coordinate
  const findBodyAtPoint = (simX: number, simY: number): CelestialBody | null => {
    // Check Sun
    const sunDist = Math.hypot(simX, simY);
    if (sunDist <= SUN_DATA.visualRadius + 10) {
      return SUN_DATA;
    }

    // Check Planets (reverse order for outer/inner stacking)
    for (let i = PLANETS_DATA.length - 1; i >= 0; i--) {
      const planet = PLANETS_DATA[i];
      const pPos = getPlanetPos(planet, simulationState.elapsedDays);
      const dist = Math.hypot(simX - pPos.x, simY - pPos.y);
      const hitRadius = Math.max(planet.visualRadius + 10, 20 / simulationState.zoom);
      if (dist <= hitRadius) {
        return planet;
      }
    }

    return null;
  };

  // Find spacecraft probe at mouse coordinate
  const findProbeAtPoint = (simX: number, simY: number): SpaceProbe | null => {
    if (!simulationState.showSpacecraft) return null;
    for (const probe of cosmicAnimations.probes) {
      const dist = Math.hypot(simX - probe.x, simY - probe.y);
      if (dist <= 25 / simulationState.zoom) {
        return probe;
      }
    }
    return null;
  };

  // Pointer Down: Check if user clicks a planet to scrub it, or canvas to pan
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const { x, y } = getSimCoordinates(e.clientX, e.clientY);
    const hit = findBodyAtPoint(x, y);

    if (hit && hit.id !== 'sun') {
      // User is grabbing a planet to interactively rotate / scrub time!
      draggedPlanetRef.current = hit;
      setIsScrubbingPlanet(true);
      dragStartRef.current = { x: e.clientX, y: e.clientY };
      celestialAudio.playPlanetTone(hit.id);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } else {
      // Pan canvas
      isDraggingCanvasRef.current = true;
      dragStartRef.current = { x: e.clientX, y: e.clientY };
      panStartRef.current = { ...simulationState.pan };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }
  };

  // Pointer Move: Update planet scrubbing angle OR update pan offset
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const { x, y } = getSimCoordinates(e.clientX, e.clientY);

    if (draggedPlanetRef.current) {
      // Scrub planet along its orbit
      const planet = draggedPlanetRef.current;
      const targetAngle = Math.atan2(y, x);
      const normalizedAngle = (targetAngle + Math.PI * 2) % (Math.PI * 2);
      const init = initialAngles.current[planet.id] || 0;

      let deltaAngle = (normalizedAngle - init) % (Math.PI * 2);
      if (deltaAngle < 0) deltaAngle += Math.PI * 2;

      const currentFullCycles = Math.floor(simulationState.elapsedDays / planet.orbitalPeriodDays);
      const newDays = (currentFullCycles * planet.orbitalPeriodDays) + (deltaAngle * planet.orbitalPeriodDays) / (Math.PI * 2);

      onUpdateElapsedDays(Math.max(0, newDays));
    } else if (isDraggingCanvasRef.current) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      onSetPan({
        x: panStartRef.current.x + dx,
        y: panStartRef.current.y + dy,
      });
    } else {
      // Hover hit detection & position tooltip
      const hit = findBodyAtPoint(x, y);
      const probeHit = !hit ? findProbeAtPoint(x, y) : null;

      setHoveredBody(hit);
      setHoveredProbe(probeHit);

      if (hit || probeHit) {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
          setHoverPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }
      } else {
        setHoverPos(null);
      }
    }
  };

  // Pointer Up: Handle selection clicks and release captures
  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const dx = Math.abs(e.clientX - dragStartRef.current.x);
    const dy = Math.abs(e.clientY - dragStartRef.current.y);

    if (draggedPlanetRef.current) {
      if (dx < 6 && dy < 6) {
        onSelectBody(draggedPlanetRef.current);
      }
      draggedPlanetRef.current = null;
      setIsScrubbingPlanet(false);
    } else if (isDraggingCanvasRef.current) {
      if (dx < 6 && dy < 6) {
        const { x, y } = getSimCoordinates(e.clientX, e.clientY);
        const hit = findBodyAtPoint(x, y);
        if (hit) {
          onSelectBody(hit);
          celestialAudio.playPlanetTone(hit.id);
        }
      }
      isDraggingCanvasRef.current = false;
    }

    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  // Wheel zoom handler: Expand zoom range to 0.15x to 6.0x
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
    const newZoom = Math.min(Math.max(simulationState.zoom * zoomFactor, 0.15), 6.0);
    onSetZoom(newZoom);
  };

  // Double click canvas to spawn a shooting star or birth a star where clicked!
  const handleDoubleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getSimCoordinates(e.clientX, e.clientY);
    cosmicAnimations.triggerStarBirth(x, y);
    celestialAudio.playPlanetTone('sun');
  };

  return (
    <div
      ref={containerRef}
      id="solar-canvas-container"
      className="relative w-full h-full select-none overflow-hidden bg-slate-950"
    >
      <canvas
        ref={canvasRef}
        id="solar-system-canvas"
        className={`w-full h-full block ${
          isScrubbingPlanet
            ? 'cursor-grabbing'
            : hoveredBody || hoveredProbe
            ? 'cursor-grab active:cursor-grabbing'
            : 'cursor-move active:cursor-grabbing'
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onDoubleClick={handleDoubleClick}
        onWheel={handleWheel}
      />

      {/* Floating Interactive Hover Tooltip for Planets */}
      {hoveredBody && hoverPos && !isScrubbingPlanet && !isDraggingCanvasRef.current && (
        <div
          id="canvas-hover-tooltip"
          className="absolute z-30 pointer-events-none -translate-x-1/2 -translate-y-full mb-3 px-3 py-2 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-xl text-left"
          style={{ left: `${hoverPos.x}px`, top: `${hoverPos.y - 12}px` }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: hoveredBody.color }}
            />
            <span className="font-bold text-white text-xs">{hoveredBody.name}</span>
            <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
              {hoveredBody.type}
            </span>
          </div>
          <div className="text-[11px] text-slate-300 mt-1 flex items-center gap-2">
            <span>{hoveredBody.id === 'sun' ? 'Center of System' : `${hoveredBody.distanceFromSunAU} AU from Sun`}</span>
            <span className="text-blue-400 font-mono">
              {hoveredBody.id === 'sun' ? '' : `• Orbit: ${hoveredBody.orbitalPeriodDays}d`}
            </span>
          </div>
          <div className="text-[10px] text-cyan-400/90 font-medium mt-1 flex items-center gap-1">
            <span>💡 Click to inspect • Drag to spin orbit</span>
          </div>
        </div>
      )}

      {/* Floating Interactive Hover Tooltip for Spacecraft */}
      {hoveredProbe && hoverPos && !isScrubbingPlanet && (
        <div
          id="spacecraft-hover-tooltip"
          className="absolute z-30 pointer-events-none -translate-x-1/2 -translate-y-full mb-3 px-3.5 py-2.5 bg-slate-900/95 backdrop-blur-md border border-cyan-500/60 rounded-xl shadow-xl text-left"
          style={{ left: `${hoverPos.x}px`, top: `${hoverPos.y - 12}px` }}
        >
          <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs">
            <span>🚀 {hoveredProbe.name}</span>
            <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800 px-1.5 py-0.5 rounded">
              {hoveredProbe.type}
            </span>
          </div>
          <div className="text-[11px] text-slate-300 mt-1">
            Speed: <span className="font-mono text-amber-300">{hoveredProbe.speedText}</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Mission: {hoveredProbe.destination}
          </div>
        </div>
      )}

      {/* Star Birth Active Banner */}
      {cosmicAnimations.starBirth.active && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 bg-purple-600/90 backdrop-blur-md text-white text-xs font-semibold rounded-full shadow-lg border border-purple-400 animate-pulse flex items-center gap-2">
          <span>✨ Star Birth Sequence: Gravitational Collapse & Protostar Ignition Active!</span>
        </div>
      )}

      {/* Scrubbing HUD Banner */}
      {isScrubbingPlanet && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 bg-blue-600/90 backdrop-blur-md text-white text-xs font-semibold rounded-full shadow-lg border border-blue-400 animate-pulse flex items-center gap-2">
          <span>🪐 Orbit Scrubbing Active — Dragging planet synchronizes all orbits</span>
        </div>
      )}
    </div>
  );
};
