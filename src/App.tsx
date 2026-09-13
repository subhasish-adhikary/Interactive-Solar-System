import React, { useState, useEffect, useCallback } from 'react';
import { CelestialBody, SimulationState } from './types';
import { ALL_CELESTIAL_BODIES, PLANETS_DATA, SUN_DATA, getBodyById } from './data/planets';
import { SolarCanvas } from './components/SolarCanvas';
import { PlanetCard } from './components/PlanetCard';
import { ControlsBar } from './components/ControlsBar';
import { PlanetSelectorDock } from './components/PlanetSelectorDock';
import { PlanetComparisonModal } from './components/PlanetComparisonModal';
import { GravityPlaygroundModal } from './components/GravityPlaygroundModal';
import { Table, Keyboard, HelpCircle, Scale, Sparkles } from 'lucide-react';
import { celestialAudio } from './utils/audio';
import { cosmicAnimations } from './utils/cosmicAnimations';

export default function App() {
  const [simulationState, setSimulationState] = useState<SimulationState>({
    isPlaying: true,
    speedMultiplier: 1,
    elapsedDays: 0,
    zoom: 1.0,
    pan: { x: 0, y: 0 },
    selectedBodyId: 'earth', // Start with Earth selected as an engaging learning anchor
    focusedBodyId: null,
    showOrbits: true,
    showLabels: true,
    showTrails: false,
    showAsteroidBelt: true,
    showKuiperBelt: true,
    showSpacecraft: true,
    showCosmicEvents: true,
    soundEnabled: false,
  });

  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [isGravityOpen, setIsGravityOpen] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  // Selected body object
  const selectedBody = getBodyById(simulationState.selectedBodyId);

  // Handlers for simulation state updates
  const handleUpdateElapsedDays = useCallback((days: number) => {
    setSimulationState((prev) => ({ ...prev, elapsedDays: days }));
  }, []);

  const handleTogglePlay = useCallback(() => {
    setSimulationState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, []);

  const handleSetSpeed = useCallback((speed: number) => {
    setSimulationState((prev) => ({ ...prev, speedMultiplier: speed }));
  }, []);

  const handleResetSimulation = useCallback(() => {
    setSimulationState((prev) => ({ ...prev, elapsedDays: 0 }));
  }, []);

  const handleZoomIn = useCallback(() => {
    setSimulationState((prev) => ({ ...prev, zoom: Math.min(prev.zoom * 1.25, 6.0) }));
  }, []);

  const handleZoomOut = useCallback(() => {
    setSimulationState((prev) => ({ ...prev, zoom: Math.max(prev.zoom * 0.8, 0.15) }));
  }, []);

  const handleResetCamera = useCallback(() => {
    setSimulationState((prev) => ({
      ...prev,
      zoom: 1.0,
      pan: { x: 0, y: 0 },
      focusedBodyId: null,
    }));
  }, []);

  const handleSetViewPreset = useCallback((preset: 'all' | 'inner' | 'outer' | 'center') => {
    setSimulationState((prev) => {
      if (preset === 'all') {
        return { ...prev, zoom: 0.22, pan: { x: 0, y: 0 }, focusedBodyId: null };
      } else if (preset === 'inner') {
        return { ...prev, zoom: 2.1, pan: { x: 0, y: 0 }, focusedBodyId: null };
      } else if (preset === 'outer') {
        return { ...prev, zoom: 0.65, pan: { x: 0, y: 0 }, focusedBodyId: null };
      } else {
        return { ...prev, zoom: 1.0, pan: { x: 0, y: 0 }, focusedBodyId: null };
      }
    });
  }, []);

  const handleSetZoom = useCallback((zoom: number) => {
    setSimulationState((prev) => ({ ...prev, zoom }));
  }, []);

  const handleSetPan = useCallback((pan: { x: number; y: number }) => {
    setSimulationState((prev) => ({
      ...prev,
      pan,
      focusedBodyId: null, // Clear locked focus when manually dragging canvas
    }));
  }, []);

  const handleSelectBody = useCallback((body: CelestialBody) => {
    setSimulationState((prev) => ({
      ...prev,
      selectedBodyId: body.id,
    }));
    celestialAudio.playPlanetTone(body.id);
  }, []);

  const handleCloseCard = useCallback(() => {
    setSimulationState((prev) => ({
      ...prev,
      selectedBodyId: null,
      focusedBodyId: null,
    }));
  }, []);

  const handleToggleFocus = useCallback((bodyId: string) => {
    setSimulationState((prev) => ({
      ...prev,
      focusedBodyId: prev.focusedBodyId === bodyId ? null : bodyId,
      pan: { x: 0, y: 0 },
    }));
  }, []);

  const handleToggleOrbits = useCallback(() => {
    setSimulationState((prev) => ({ ...prev, showOrbits: !prev.showOrbits }));
  }, []);

  const handleToggleLabels = useCallback(() => {
    setSimulationState((prev) => ({ ...prev, showLabels: !prev.showLabels }));
  }, []);

  const handleToggleTrails = useCallback(() => {
    setSimulationState((prev) => ({ ...prev, showTrails: !prev.showTrails }));
  }, []);

  const handleToggleAsteroidBelt = useCallback(() => {
    setSimulationState((prev) => ({ ...prev, showAsteroidBelt: !prev.showAsteroidBelt }));
  }, []);

  const handleToggleKuiperBelt = useCallback(() => {
    setSimulationState((prev) => ({ ...prev, showKuiperBelt: !prev.showKuiperBelt }));
  }, []);

  const handleToggleSpacecraft = useCallback(() => {
    setSimulationState((prev) => ({ ...prev, showSpacecraft: !prev.showSpacecraft }));
  }, []);

  const handleToggleSound = useCallback(() => {
    setSimulationState((prev) => {
      const next = !prev.soundEnabled;
      celestialAudio.setMuted(!next);
      return { ...prev, soundEnabled: next };
    });
  }, []);

  // Cosmic Event Actions
  const handleSpawnShootingStar = useCallback(() => {
    cosmicAnimations.spawnShootingStar();
    celestialAudio.playPlanetTone('earth');
  }, []);

  const handleTriggerStarBirth = useCallback(() => {
    // Trigger in an aesthetic upper quadrant of space
    cosmicAnimations.triggerStarBirth(-220, -140);
    celestialAudio.playPlanetTone('sun');
  }, []);

  const handleSpawnSolarFlare = useCallback(() => {
    cosmicAnimations.spawnSolarFlare();
    celestialAudio.playPlanetTone('sun');
  }, []);

  // Keyboard navigation & controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.key === 'Escape') {
        handleCloseCard();
        setIsComparisonOpen(false);
        setIsGravityOpen(false);
        setShowKeyboardHelp(false);
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-' || e.key === '_') {
        handleZoomOut();
      } else if (e.key === '0') {
        handleSelectBody(SUN_DATA);
      } else if (e.key >= '1' && e.key <= '9') {
        const planetIndex = parseInt(e.key, 10) - 1;
        if (PLANETS_DATA[planetIndex]) {
          handleSelectBody(PLANETS_DATA[planetIndex]);
        }
      } else if (e.key.toLowerCase() === 'm') {
        handleSpawnShootingStar();
      } else if (e.key.toLowerCase() === 'b') {
        handleTriggerStarBirth();
      } else if (e.key.toLowerCase() === 'f') {
        handleSpawnSolarFlare();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleTogglePlay,
    handleCloseCard,
    handleZoomIn,
    handleZoomOut,
    handleSelectBody,
    handleSpawnShootingStar,
    handleTriggerStarBirth,
    handleSpawnSolarFlare,
  ]);

  return (
    <main
      id="solar-system-app"
      className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans text-slate-100 flex flex-col select-none"
    >
      {/* Simulation Canvas */}
      <div className="absolute inset-0 z-0">
        <SolarCanvas
          simulationState={simulationState}
          onUpdateElapsedDays={handleUpdateElapsedDays}
          onSelectBody={handleSelectBody}
          onResetView={handleResetCamera}
          onSetZoom={handleSetZoom}
          onSetPan={handleSetPan}
        />
      </div>

      {/* Top Left: Controls Bar (Play, Pause, Speed, Zoom, Presets, Cosmic Events, Toggles, Scrubber) */}
      <ControlsBar
        simulationState={simulationState}
        onTogglePlay={handleTogglePlay}
        onSetSpeed={handleSetSpeed}
        onResetSimulation={handleResetSimulation}
        onUpdateElapsedDays={handleUpdateElapsedDays}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetCamera={handleResetCamera}
        onSetViewPreset={handleSetViewPreset}
        onToggleOrbits={handleToggleOrbits}
        onToggleLabels={handleToggleLabels}
        onToggleTrails={handleToggleTrails}
        onToggleAsteroidBelt={handleToggleAsteroidBelt}
        onToggleKuiperBelt={handleToggleKuiperBelt}
        onToggleSpacecraft={handleToggleSpacecraft}
        onToggleSound={handleToggleSound}
        onOpenGravityModal={() => setIsGravityOpen(true)}
        onOpenCompareModal={() => setIsComparisonOpen(true)}
        onSpawnShootingStar={handleSpawnShootingStar}
        onTriggerStarBirth={handleTriggerStarBirth}
        onSpawnSolarFlare={handleSpawnSolarFlare}
      />

      {/* Top Right Quick Actions: Gravity, Compare & Help Buttons */}
      <div className="absolute top-4 right-4 z-10 hidden sm:flex items-center gap-2">
        <button
          id="top-open-gravity-button"
          onClick={() => setIsGravityOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/70 text-slate-200 hover:text-white hover:bg-slate-800 text-xs font-semibold shadow-lg transition-colors"
          title="Open Planetary Gravity & Weight Playground"
        >
          <Scale className="w-4 h-4 text-blue-400" />
          <span>Gravity Playground</span>
        </button>

        <button
          id="top-open-comparison-button"
          onClick={() => setIsComparisonOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/70 text-slate-200 hover:text-white hover:bg-slate-800 text-xs font-semibold shadow-lg transition-colors"
          title="Compare all planetary data"
        >
          <Table className="w-4 h-4 text-purple-400" />
          <span>Data Table</span>
        </button>

        <button
          id="toggle-help-button"
          onClick={() => setShowKeyboardHelp((prev) => !prev)}
          className="p-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/70 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shadow-lg"
          title="Keyboard shortcuts & interactive guides"
        >
          <Keyboard className="w-4 h-4" />
        </button>
      </div>

      {/* Planet Inspector Card (when a planet or Sun is selected) */}
      {selectedBody && (
        <PlanetCard
          body={selectedBody}
          onClose={handleCloseCard}
          onSelectBody={handleSelectBody}
          onToggleFocus={handleToggleFocus}
          isFocused={simulationState.focusedBodyId === selectedBody.id}
          onOpenGravityModal={() => setIsGravityOpen(true)}
        />
      )}

      {/* Bottom Planet Navigation Dock */}
      <PlanetSelectorDock
        selectedBodyId={simulationState.selectedBodyId}
        onSelectBody={handleSelectBody}
      />

      {/* Keyboard Shortcuts & Interactive Guide Overlay */}
      {showKeyboardHelp && (
        <div
          id="keyboard-shortcuts-overlay"
          className="fixed inset-0 z-40 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowKeyboardHelp(false)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-3.5 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-sm text-white flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                Interactivity & Animations Guide
              </span>
              <button
                onClick={() => setShowKeyboardHelp(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-2.5 bg-blue-950/40 border border-blue-800/40 rounded-xl text-blue-200 leading-relaxed">
              💡 <strong>Interactive Animation Play:</strong>
              <div className="mt-1 text-[11px] text-slate-300 space-y-1">
                <div>• Click & drag any planet directly around its orbit to spin time!</div>
                <div>• Double click anywhere in deep space to ignite a <strong>Star Birth</strong>!</div>
                <div>• Hover over <strong>Voyager 1</strong>, <strong>Artemis</strong>, or <strong>Halley's Comet</strong> to view live mission telemetry!</div>
              </div>
            </div>

            <ul className="space-y-2 text-slate-300">
              <li className="flex justify-between items-center">
                <span>Play / Pause</span>
                <kbd className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded font-mono text-slate-200">
                  Space
                </kbd>
              </li>
              <li className="flex justify-between items-center">
                <span>Spawn Shooting Star</span>
                <kbd className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded font-mono text-cyan-300 font-bold">
                  M
                </kbd>
              </li>
              <li className="flex justify-between items-center">
                <span>Ignite Star Formation</span>
                <kbd className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded font-mono text-purple-300 font-bold">
                  B or Double Click
                </kbd>
              </li>
              <li className="flex justify-between items-center">
                <span>Erupt Solar Flare</span>
                <kbd className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded font-mono text-amber-300 font-bold">
                  F
                </kbd>
              </li>
              <li className="flex justify-between items-center">
                <span>Direct Planet Scrubbing</span>
                <span className="text-slate-400">Click & Drag any planet</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Select Planets (1–9)</span>
                <kbd className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded font-mono text-slate-200">
                  1 to 9 (Pluto)
                </kbd>
              </li>
              <li className="flex justify-between items-center">
                <span>Select Sun</span>
                <kbd className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded font-mono text-slate-200">
                  0
                </kbd>
              </li>
              <li className="flex justify-between items-center">
                <span>Deep Zoom Out / In</span>
                <kbd className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded font-mono text-slate-200">
                  + / - or Scroll (0.15x – 6x)
                </kbd>
              </li>
              <li className="flex justify-between items-center">
                <span>Pan Camera</span>
                <span className="text-slate-400">Click & Drag empty space</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Close Card / Dialogs</span>
                <kbd className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded font-mono text-slate-200">
                  Esc
                </kbd>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Planetary Comparison Table Modal */}
      <PlanetComparisonModal
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        onSelectPlanet={handleSelectBody}
      />

      {/* Planetary Gravity & Weight Simulator Modal */}
      <GravityPlaygroundModal
        isOpen={isGravityOpen}
        onClose={() => setIsGravityOpen(false)}
        onSelectBody={handleSelectBody}
      />
    </main>
  );
}
