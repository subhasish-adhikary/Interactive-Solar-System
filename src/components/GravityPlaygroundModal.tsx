import React, { useState } from 'react';
import { ALL_CELESTIAL_BODIES } from '../data/planets';
import { CelestialBody } from '../types';
import { X, Scale, ArrowUp, Activity } from 'lucide-react';

interface GravityPlaygroundModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBody: (body: CelestialBody) => void;
}

export const GravityPlaygroundModal: React.FC<GravityPlaygroundModalProps> = ({
  isOpen,
  onClose,
  onSelectBody,
}) => {
  const [earthWeight, setEarthWeight] = useState<number>(70);
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');
  const [selectedPlanetId, setSelectedPlanetId] = useState<string>('mars');

  if (!isOpen) return null;

  const currentPlanet = ALL_CELESTIAL_BODIES.find((b) => b.id === selectedPlanetId) || ALL_CELESTIAL_BODIES[3];

  // Baseline jump height on Earth: 0.5 meters (50 cm)
  const earthJumpCm = 50;
  const planetJumpCm = Math.round(earthJumpCm / (currentPlanet.relativeGravity || 1));
  const planetJumpMeters = (planetJumpCm / 100).toFixed(2);
  const planetWeight = (earthWeight * (currentPlanet.relativeGravity || 1)).toFixed(1);

  return (
    <div
      id="gravity-playground-modal-backdrop"
      className="fixed inset-0 z-40 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5"
      onClick={onClose}
    >
      <div
        id="gravity-playground-modal"
        className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Planetary Gravity & Weight Playground
              </h2>
              <p className="text-xs text-slate-400">
                Discover what you would weigh and how high you could jump across the Solar System!
              </p>
            </div>
          </div>
          <button
            id="close-gravity-modal-button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Controls: Weight Input & Unit selector */}
          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <label htmlFor="earth-weight-input" className="text-xs font-semibold text-slate-300">
                Your Earth Weight:
              </label>
              <div className="flex items-center">
                <input
                  id="earth-weight-input"
                  type="number"
                  min="5"
                  max="500"
                  value={earthWeight}
                  onChange={(e) => setEarthWeight(Math.max(1, Number(e.target.value) || 1))}
                  className="w-20 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-l-lg text-white font-mono text-sm focus:outline-hidden focus:border-blue-500"
                />
                <button
                  onClick={() => setUnit(unit === 'kg' ? 'lbs' : 'kg')}
                  className="px-3 py-1.5 bg-slate-800 border border-l-0 border-slate-700 rounded-r-lg text-xs font-bold text-blue-400 hover:bg-slate-700 transition-colors"
                >
                  {unit}
                </button>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Presets:</span>
              {[
                { label: 'Kid (30)', w: 30 },
                { label: 'Adult (70)', w: 70 },
                { label: 'Adult (90)', w: 90 },
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setEarthWeight(preset.w)}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Comparison Card (Interactive Jump & Scale) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: Selected Planet Interactive Stage */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: currentPlanet.color }}
                    />
                    <h3 className="font-bold text-white text-base">{currentPlanet.name}</h3>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {currentPlanet.type}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-amber-400">
                    Gravity: {currentPlanet.surfaceGravityMs2} m/s² ({currentPlanet.relativeGravity}g)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-400 mb-1">Your Weight Here</div>
                    <div className="text-2xl font-black text-white font-mono">
                      {planetWeight}{' '}
                      <span className="text-xs font-normal text-slate-400">{unit}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      {currentPlanet.relativeGravity > 1
                        ? `${((currentPlanet.relativeGravity - 1) * 100).toFixed(0)}% heavier`
                        : currentPlanet.relativeGravity === 1
                        ? 'Same as Earth'
                        : `${((1 - currentPlanet.relativeGravity) * 100).toFixed(0)}% lighter`}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                    <div className="text-xs text-slate-400 mb-1">Max Jump Height</div>
                    <div className="text-2xl font-black text-cyan-300 font-mono">
                      {planetJumpMeters} <span className="text-xs font-normal text-slate-400">meters</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Earth baseline: 0.50 m ({planetJumpCm} cm)
                    </div>
                  </div>
                </div>
              </div>

              {/* Jump Animation Visualizer */}
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 relative overflow-hidden h-32 flex flex-col justify-end">
                <div className="absolute top-2 left-3 text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Vertical Jump Scale (Earth vs {currentPlanet.name})
                </div>

                {/* Ground */}
                <div className="w-full h-1 bg-slate-700 absolute bottom-4 left-0" />

                <div className="flex items-end justify-around relative z-10 pb-4">
                  {/* Earth jumper */}
                  <div className="flex flex-col items-center">
                    <div
                      className="w-4 h-6 bg-blue-500 rounded-sm mb-1 transition-all duration-700"
                      style={{ transform: 'translateY(-20px)' }}
                    />
                    <div className="text-[10px] text-slate-400 font-mono">Earth: 0.5m</div>
                  </div>

                  {/* Planet jumper */}
                  <div className="flex flex-col items-center">
                    <div
                      className="w-4 h-6 rounded-sm mb-1 transition-all duration-700 shadow-md"
                      style={{
                        backgroundColor: currentPlanet.color,
                        transform: `translateY(-${Math.min(Math.max(planetJumpCm * 0.4, 2), 65)}px)`,
                      }}
                    />
                    <div className="text-[10px] font-mono font-bold text-white">
                      {currentPlanet.name}: {planetJumpMeters}m
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: All Planets Weight Grid */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
                Select Planet to Test:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 max-h-[290px] overflow-y-auto pr-1">
                {ALL_CELESTIAL_BODIES.map((body) => {
                  const isSelected = body.id === currentPlanet.id;
                  const calculatedWeight = (earthWeight * (body.relativeGravity || 1)).toFixed(1);

                  return (
                    <button
                      key={body.id}
                      onClick={() => setSelectedPlanetId(body.id)}
                      className={`p-2.5 rounded-xl text-left border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-blue-900/40 border-blue-500 shadow-md'
                          : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/50 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: body.color }}
                        />
                        <div>
                          <div className="font-semibold text-xs text-white">{body.name}</div>
                          <div className="text-[10px] text-slate-400">{body.relativeGravity}g</div>
                        </div>
                      </div>
                      <div className="text-right font-mono">
                        <div className="text-xs font-bold text-amber-300">
                          {calculatedWeight} {unit}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>*Calculated based on surface gravity derived from mass and radius (g = GM/r²).</span>
          <button
            onClick={() => {
              onSelectBody(currentPlanet);
              onClose();
            }}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
          >
            Inspect {currentPlanet.name} in 3D View
          </button>
        </div>
      </div>
    </div>
  );
};
