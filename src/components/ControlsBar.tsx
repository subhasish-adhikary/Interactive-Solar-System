import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Eye,
  EyeOff,
  Sparkles,
  Gauge,
  Calendar,
  Volume2,
  VolumeX,
  Scale,
  Sliders,
  Compass,
  Rocket,
  Flame,
  SunMedium,
} from 'lucide-react';
import { SimulationState } from '../types';

interface ControlsBarProps {
  simulationState: SimulationState;
  onTogglePlay: () => void;
  onSetSpeed: (speed: number) => void;
  onResetSimulation: () => void;
  onUpdateElapsedDays: (days: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetCamera: () => void;
  onSetViewPreset: (preset: 'all' | 'inner' | 'outer' | 'center') => void;
  onToggleOrbits: () => void;
  onToggleLabels: () => void;
  onToggleTrails: () => void;
  onToggleAsteroidBelt: () => void;
  onToggleKuiperBelt: () => void;
  onToggleSpacecraft: () => void;
  onToggleSound: () => void;
  onOpenGravityModal: () => void;
  onOpenCompareModal: () => void;
  onSpawnShootingStar: () => void;
  onTriggerStarBirth: () => void;
  onSpawnSolarFlare: () => void;
}

const SPEED_PRESETS = [0.25, 0.5, 1, 2, 5, 10];

export const ControlsBar: React.FC<ControlsBarProps> = ({
  simulationState,
  onTogglePlay,
  onSetSpeed,
  onResetSimulation,
  onUpdateElapsedDays,
  onZoomIn,
  onZoomOut,
  onResetCamera,
  onSetViewPreset,
  onToggleOrbits,
  onToggleLabels,
  onToggleTrails,
  onToggleAsteroidBelt,
  onToggleKuiperBelt,
  onToggleSpacecraft,
  onToggleSound,
  onOpenGravityModal,
  onOpenCompareModal,
  onSpawnShootingStar,
  onTriggerStarBirth,
  onSpawnSolarFlare,
}) => {
  const elapsedYears = (simulationState.elapsedDays / 365.25).toFixed(2);
  const elapsedDaysInt = Math.floor(simulationState.elapsedDays);

  return (
    <div
      id="simulation-controls-bar"
      className="absolute top-4 left-4 z-20 flex flex-col gap-2 max-w-[calc(100vw-2rem)] sm:max-w-md"
    >
      {/* Top Header & Simulation Controls */}
      <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/70 rounded-2xl p-3.5 shadow-xl text-white">
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <h1 className="text-sm sm:text-base font-bold tracking-tight">Interactive Solar System</h1>
          </div>

          {/* Time Counter Badge */}
          <div
            id="elapsed-time-counter"
            className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-950/70 border border-slate-800 rounded-lg text-xs font-mono text-cyan-300"
            title="Simulated orbital time elapsed"
          >
            <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Day {elapsedDaysInt}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">{elapsedYears} Yrs</span>
          </div>
        </div>

        {/* Play/Pause & Speed Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/90">
          {/* Play/Pause Button */}
          <button
            id="play-pause-toggle-button"
            onClick={onTogglePlay}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-md transition-all active:scale-95 ${
              simulationState.isPlaying
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
            title={simulationState.isPlaying ? 'Pause Simulation (Space)' : 'Play Simulation (Space)'}
          >
            {simulationState.isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play</span>
              </>
            )}
          </button>

          {/* Speed Preset Chips */}
          <div
            id="speed-control-group"
            className="flex items-center gap-0.5 bg-slate-950/80 p-0.5 rounded-xl border border-slate-800"
          >
            <div className="px-1.5 text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Gauge className="w-3 h-3 text-slate-400" />
            </div>
            {SPEED_PRESETS.map((spd) => {
              const isActive = simulationState.speedMultiplier === spd;
              return (
                <button
                  key={spd}
                  id={`speed-btn-${spd}x`}
                  onClick={() => onSetSpeed(spd)}
                  className={`px-2 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                  title={`Set orbital speed to ${spd}x`}
                >
                  {spd}x
                </button>
              );
            })}
          </div>

          {/* Reset Time Button */}
          <button
            id="reset-simulation-button"
            onClick={onResetSimulation}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors"
            title="Reset simulation time and planet positions"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Sound Toggle Button */}
          <button
            id="toggle-sound-button"
            onClick={onToggleSound}
            className={`p-1.5 rounded-xl border transition-colors ${
              simulationState.soundEnabled
                ? 'bg-blue-950/50 border-blue-500/60 text-blue-400'
                : 'text-slate-400 hover:text-white border-slate-800 hover:bg-slate-800'
            }`}
            title={simulationState.soundEnabled ? 'Mute celestial orbital harmonics' : 'Enable orbital audio sonification'}
          >
            {simulationState.soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Interactive Time Scrubber Slider */}
        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center gap-2">
          <Sliders className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <input
            id="simulation-time-scrubber"
            type="range"
            min="0"
            max="7300" // 20 years range
            step="1"
            value={simulationState.elapsedDays % 7300}
            onChange={(e) => onUpdateElapsedDays(Number(e.target.value))}
            className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            title="Drag to manually scrub orbital time forward or backward"
          />
          <span className="text-[10px] font-mono text-slate-400 shrink-0 w-12 text-right">
            {(simulationState.elapsedDays % 365.25).toFixed(0)}d / yr
          </span>
        </div>
      </div>

      {/* Camera Presets & Zoom Row */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-2 shadow-lg flex flex-wrap items-center justify-between gap-1.5 text-xs text-slate-300">
        {/* Preset View Zoom Buttons */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-slate-400 font-semibold px-1">Views:</span>
          <button
            id="view-preset-all"
            onClick={() => onSetViewPreset('all')}
            className="px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1 text-[11px]"
            title="Zoom out completely to fit all planets & Kuiper Belt"
          >
            <Compass className="w-3 h-3 text-cyan-400" />
            <span>All System</span>
          </button>
          <button
            id="view-preset-inner"
            onClick={() => onSetViewPreset('inner')}
            className="px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors text-[11px]"
            title="Zoom into inner terrestrial planets (Mercury to Mars)"
          >
            Inner
          </button>
          <button
            id="view-preset-outer"
            onClick={() => onSetViewPreset('outer')}
            className="px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors text-[11px]"
            title="Zoom into outer gas and ice giants"
          >
            Outer
          </button>
        </div>

        {/* Zoom In/Out & Reset buttons */}
        <div className="flex items-center gap-0.5 border-l border-slate-800 pl-1">
          <button
            id="zoom-out-button"
            onClick={onZoomOut}
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
            title="Zoom out (0.15x – 6.0x)"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-mono text-slate-400 px-1">
            {simulationState.zoom.toFixed(1)}x
          </span>
          <button
            id="zoom-in-button"
            onClick={onZoomIn}
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            id="reset-camera-button"
            onClick={onResetCamera}
            className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
            title="Reset to center (1.0x)"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Cosmic Animations & Interactive Fun Row */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-amber-500/30 rounded-xl p-2 shadow-lg flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-[10px] uppercase font-bold text-amber-400 px-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          Cosmic Events:
        </span>

        {/* Shoot Meteor / Shooting Star */}
        <button
          id="shoot-star-button"
          onClick={onSpawnShootingStar}
          className="px-2.5 py-1 rounded-lg bg-sky-950/60 hover:bg-sky-900/80 border border-sky-600/40 text-sky-200 text-[11px] font-medium flex items-center gap-1 transition-all active:scale-95"
          title="Launch a glowing shooting star across the cosmos"
        >
          <span>🌠 Shoot Star</span>
        </button>

        {/* Trigger Star Birth */}
        <button
          id="star-birth-button"
          onClick={onTriggerStarBirth}
          className="px-2.5 py-1 rounded-lg bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/50 text-purple-200 text-[11px] font-medium flex items-center gap-1 transition-all active:scale-95"
          title="Ignite an interstellar star birth & protostar collapse sequence (or double-click anywhere on space)"
        >
          <Flame className="w-3 h-3 text-purple-400" />
          <span>✨ Star Birth</span>
        </button>

        {/* Erupt Solar Flare */}
        <button
          id="solar-flare-button"
          onClick={onSpawnSolarFlare}
          className="px-2.5 py-1 rounded-lg bg-amber-950/60 hover:bg-amber-900/80 border border-amber-600/50 text-amber-200 text-[11px] font-medium flex items-center gap-1 transition-all active:scale-95"
          title="Erupt a coronal mass plasma flare from the Sun"
        >
          <SunMedium className="w-3 h-3 text-amber-400" />
          <span>Solar Flare</span>
        </button>

        {/* Toggle Spacecraft */}
        <button
          id="toggle-spacecraft-button"
          onClick={onToggleSpacecraft}
          className={`px-2 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1 transition-colors ${
            simulationState.showSpacecraft
              ? 'bg-blue-900/80 border border-blue-500/60 text-cyan-200'
              : 'bg-slate-800 text-slate-400 hover:text-slate-200'
          }`}
          title="Toggle Voyager 1 & Artemis deep space probes and Halley's comet"
        >
          <Rocket className="w-3 h-3 text-cyan-400" />
          <span>Probes & Comet</span>
        </button>
      </div>

      {/* Feature Display Toggles & Modals */}
      <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-xl p-1.5 shadow-lg text-slate-300 w-fit">
        {/* Toggle Orbits */}
        <button
          id="toggle-orbits-button"
          onClick={onToggleOrbits}
          className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
            simulationState.showOrbits ? 'bg-slate-800 text-blue-300' : 'text-slate-500 hover:text-slate-300'
          }`}
          title="Toggle orbital path rings"
        >
          {simulationState.showOrbits ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          <span>Orbits</span>
        </button>

        {/* Toggle Labels */}
        <button
          id="toggle-labels-button"
          onClick={onToggleLabels}
          className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
            simulationState.showLabels ? 'bg-slate-800 text-blue-300' : 'text-slate-500 hover:text-slate-300'
          }`}
          title="Toggle planet name labels"
        >
          <span>Labels</span>
        </button>

        {/* Toggle Trails */}
        <button
          id="toggle-trails-button"
          onClick={onToggleTrails}
          className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
            simulationState.showTrails ? 'bg-slate-800 text-amber-300' : 'text-slate-500 hover:text-slate-300'
          }`}
          title="Toggle motion trails"
        >
          <Sparkles className="w-3 h-3" />
          <span className="hidden sm:inline">Trails</span>
        </button>

        {/* Toggle Asteroid Belt */}
        <button
          id="toggle-asteroids-button"
          onClick={onToggleAsteroidBelt}
          className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
            simulationState.showAsteroidBelt ? 'bg-slate-800 text-slate-200' : 'text-slate-500 hover:text-slate-300'
          }`}
          title="Toggle Asteroid Belt & Ceres"
        >
          Asteroids
        </button>

        {/* Toggle Kuiper Belt */}
        <button
          id="toggle-kuiper-button"
          onClick={onToggleKuiperBelt}
          className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
            simulationState.showKuiperBelt ? 'bg-slate-800 text-cyan-300' : 'text-slate-500 hover:text-slate-300'
          }`}
          title="Toggle Kuiper Belt"
        >
          Kuiper
        </button>

        <div className="w-[1px] h-4 bg-slate-700 mx-0.5" />

        {/* Gravity Playground Button */}
        <button
          id="open-gravity-playground-button"
          onClick={onOpenGravityModal}
          className="px-2.5 py-1 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          title="Open Gravity & Weight Simulator"
        >
          <Scale className="w-3.5 h-3.5" />
          <span>Gravity Playground</span>
        </button>

        {/* Compare Planets Button */}
        <button
          id="open-compare-planets-button"
          onClick={onOpenCompareModal}
          className="px-2.5 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          title="Compare all planet data side by side"
        >
          <span>Compare</span>
        </button>
      </div>
    </div>
  );
};
