import React, { useState } from 'react';
import { CelestialBody } from '../types';
import { ALL_CELESTIAL_BODIES } from '../data/planets';
import {
  X,
  Compass,
  Ruler,
  Clock,
  Thermometer,
  Moon,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  Crosshair,
  Rocket,
  Scale,
  Maximize,
  Volume2,
} from 'lucide-react';
import { celestialAudio } from '../utils/audio';

interface PlanetCardProps {
  body: CelestialBody | null;
  onClose: () => void;
  onSelectBody: (body: CelestialBody) => void;
  onToggleFocus: (bodyId: string) => void;
  isFocused: boolean;
  onOpenGravityModal: () => void;
}

type TabType = 'overview' | 'structure' | 'missions' | 'scale';

export const PlanetCard: React.FC<PlanetCardProps> = ({
  body,
  onClose,
  onSelectBody,
  onToggleFocus,
  isFocused,
  onOpenGravityModal,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  if (!body) return null;

  const currentIndex = ALL_CELESTIAL_BODIES.findIndex((b) => b.id === body.id);
  const prevBody = ALL_CELESTIAL_BODIES[(currentIndex - 1 + ALL_CELESTIAL_BODIES.length) % ALL_CELESTIAL_BODIES.length];
  const nextBody = ALL_CELESTIAL_BODIES[(currentIndex + 1) % ALL_CELESTIAL_BODIES.length];

  const isSun = body.id === 'sun';

  const playSound = () => {
    celestialAudio.playPlanetTone(body.id);
  };

  return (
    <aside
      id="planet-details-card"
      aria-label={`${body.name} details`}
      className="absolute top-4 right-4 z-20 w-full max-w-sm sm:max-w-md bg-slate-900/95 backdrop-blur-md border border-slate-700/70 rounded-2xl shadow-2xl text-slate-100 flex flex-col max-h-[calc(100vh-2rem)] overflow-hidden animate-in fade-in slide-in-from-right-4 duration-200"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div
            className="w-4 h-4 rounded-full shadow-sm"
            style={{ backgroundColor: body.color, boxShadow: `0 0 10px ${body.glowColor}` }}
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-white">{body.name}</h2>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {body.type}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Sound Preview */}
          <button
            onClick={playSound}
            title={`Listen to ${body.name}'s orbital frequency`}
            className="p-2 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          {/* Track camera button */}
          <button
            id="track-body-button"
            onClick={() => onToggleFocus(body.id)}
            title={isFocused ? 'Tracking this celestial body' : 'Lock camera onto this body'}
            className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              isFocused
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Crosshair className={`w-4 h-4 ${isFocused ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isFocused ? 'Tracking' : 'Track'}</span>
          </button>

          <button
            id="close-planet-card-button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close details"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs (Overview, Internal Layers, Missions, Size Scale) */}
      <div className="flex border-b border-slate-800 bg-slate-950/60 text-xs px-3 gap-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-2.5 px-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'overview'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('structure')}
          className={`py-2.5 px-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'structure'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Structure
        </button>
        <button
          onClick={() => setActiveTab('missions')}
          className={`py-2.5 px-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'missions'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Missions
        </button>
        <button
          onClick={() => setActiveTab('scale')}
          className={`py-2.5 px-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'scale'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Scale
        </button>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <>
            {/* Visual preview & description */}
            <div className="flex items-center gap-4 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
              <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                <div
                  className="absolute inset-0 rounded-full blur-md opacity-60"
                  style={{ backgroundColor: body.color }}
                />
                <div
                  className="relative w-12 h-12 rounded-full shadow-inner flex items-center justify-center overflow-hidden"
                  style={{
                    background: `radial-gradient(circle at 35% 35%, ${body.accentColor} 0%, ${body.color} 65%, #05070D 100%)`,
                    boxShadow: `inset -4px -4px 8px rgba(0,0,0,0.7), 0 0 12px ${body.glowColor}`,
                  }}
                >
                  {body.rings && (
                    <div
                      className="absolute w-20 h-4 border-2 border-amber-200/50 rounded-full -rotate-12"
                      style={{ borderColor: body.rings.color }}
                    />
                  )}
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{body.overview}</p>
            </div>

            {/* Primary Metrics Grid (Name, Size, Distance, Orbital Period) */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Metric 1: Size / Diameter */}
              <div id="metric-planet-size" className="p-3 rounded-xl bg-slate-800/60 border border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
                  <Ruler className="w-3.5 h-3.5 text-blue-400" />
                  <span>Diameter (Size)</span>
                </div>
                <div className="text-base font-bold text-white tracking-tight">
                  {body.diameterKm.toLocaleString()} <span className="text-xs font-normal text-slate-400">km</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {isSun ? '109.2x Earth' : `${body.relativeSizeEarth}x Earth's size`}
                </div>
              </div>

              {/* Metric 2: Distance from Sun */}
              <div id="metric-planet-distance" className="p-3 rounded-xl bg-slate-800/60 border border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
                  <Compass className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Distance from Sun</span>
                </div>
                <div className="text-base font-bold text-white tracking-tight">
                  {isSun ? (
                    'Center'
                  ) : (
                    <>
                      {body.distanceFromSunAU}{' '}
                      <span className="text-xs font-normal text-slate-400">AU</span>
                    </>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {isSun ? 'Center of System' : `${body.distanceFromSunMillionKm.toLocaleString()} Million km`}
                </div>
              </div>

              {/* Metric 3: Orbital Period */}
              <div id="metric-planet-orbital-period" className="p-3 rounded-xl bg-slate-800/60 border border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Orbital Period</span>
                </div>
                <div className="text-base font-bold text-white tracking-tight">
                  {isSun ? (
                    '—'
                  ) : body.orbitalPeriodDays < 365 ? (
                    <>
                      {body.orbitalPeriodDays}{' '}
                      <span className="text-xs font-normal text-slate-400">Days</span>
                    </>
                  ) : (
                    <>
                      {body.orbitalPeriodYears}{' '}
                      <span className="text-xs font-normal text-slate-400">Years</span>
                    </>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {isSun
                    ? 'Orbits galactic center'
                    : `${body.orbitalPeriodDays.toLocaleString()} Earth Days`}
                </div>
              </div>

              {/* Metric 4: Rotation Period / Day Length */}
              <div id="metric-planet-rotation" className="p-3 rounded-xl bg-slate-800/60 border border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                  <span>Day Length</span>
                </div>
                <div className="text-base font-bold text-white tracking-tight">
                  {Math.abs(body.rotationPeriodHours) >= 24 ? (
                    <>
                      {(Math.abs(body.rotationPeriodHours) / 24).toFixed(1)}{' '}
                      <span className="text-xs font-normal text-slate-400">Earth Days</span>
                    </>
                  ) : (
                    <>
                      {Math.abs(body.rotationPeriodHours).toFixed(1)}{' '}
                      <span className="text-xs font-normal text-slate-400">Hours</span>
                    </>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {body.rotationPeriodHours < 0 ? 'Retrograde (backwards spin)' : 'Prograde rotation'}
                </div>
              </div>
            </div>

            {/* Gravity & Moons */}
            <div className="grid grid-cols-2 gap-2.5">
              <div
                onClick={onOpenGravityModal}
                className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800/90 border border-slate-800 cursor-pointer transition-colors group"
              >
                <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
                  <div className="flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-blue-400" />
                    <span>Surface Gravity</span>
                  </div>
                  <span className="text-[10px] text-blue-400 group-hover:underline">Test ➔</span>
                </div>
                <div className="text-base font-bold text-white">
                  {body.surfaceGravityMs2} <span className="text-xs font-normal text-slate-400">m/s²</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {body.relativeGravity}x Earth gravity
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800/80">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
                  <Moon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Moons</span>
                </div>
                <div className="text-base font-bold text-slate-200">
                  {body.moonsCount === 0 ? '0' : body.moonsCount}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {body.moonsCount === 0 ? 'No natural satellites' : 'Confirmed moons'}
                </div>
              </div>
            </div>

            {/* Temperature & Atmosphere */}
            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800/80">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
                <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                <span>Surface Temperature</span>
              </div>
              <div className="text-sm font-semibold text-slate-200">
                {body.avgTempCelsius > 0 ? `+${body.avgTempCelsius}°C` : `${body.avgTempCelsius}°C`}{' '}
                <span className="text-xs text-slate-400 font-normal">({body.temperatureRange || 'Average'})</span>
              </div>
            </div>

            {/* Atmosphere Composition */}
            {body.atmosphereComposition && body.atmosphereComposition.length > 0 && (
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800/80">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-2">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Atmospheric Composition</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {body.atmosphereComposition.map((gas, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-700/60"
                    >
                      {gas}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Fun Fact */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200/90 text-xs leading-relaxed flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 font-semibold block mb-0.5">Astronomical Fact:</strong>
                {body.funFact}
              </div>
            </div>
          </>
        )}

        {/* TAB 2: INTERNAL STRUCTURE */}
        {activeTab === 'structure' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-400">
              Cross-section composition and interior planetary layers:
            </p>
            {body.internalStructure && body.internalStructure.length > 0 ? (
              <div className="space-y-2.5">
                {body.internalStructure.map((layer, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                          style={{ backgroundColor: layer.color }}
                        />
                        <span className="font-bold text-white text-xs">{layer.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-cyan-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {layer.depth}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{layer.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">Internal structure data unavailable.</p>
            )}
          </div>
        )}

        {/* TAB 3: MISSIONS */}
        {activeTab === 'missions' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-400">
              Key robotic explorers and spacecraft that visited {body.name}:
            </p>
            {body.notableMissions && body.notableMissions.length > 0 ? (
              <div className="space-y-2.5">
                {body.notableMissions.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Rocket className="w-3.5 h-3.5 text-amber-400" />
                        <span className="font-bold text-white text-xs">{m.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">{m.year}</span>
                    </div>
                    <div className="text-[11px] font-semibold text-blue-400">{m.agency}</div>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{m.highlight}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No major dedicated space probes listed.</p>
            )}
          </div>
        )}

        {/* TAB 4: SCALE COMPARISON */}
        {activeTab === 'scale' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-400">
              Visual physical scale comparing {body.name} directly with Earth (12,742 km):
            </p>

            <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800 flex flex-col items-center justify-center min-h-[160px]">
              <div className="flex items-center justify-around w-full">
                {/* Earth */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-blue-500 shadow-md border border-blue-400 flex items-center justify-center text-[10px] font-bold text-white">
                    1x
                  </div>
                  <div className="text-xs font-semibold text-white">Earth</div>
                  <div className="text-[10px] text-slate-400 font-mono">12,742 km</div>
                </div>

                <div className="text-slate-600 font-bold text-sm">vs</div>

                {/* Selected Body scaled */}
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="rounded-full shadow-lg flex items-center justify-center text-white font-bold"
                    style={{
                      backgroundColor: body.color,
                      width: `${Math.min(Math.max(body.relativeSizeEarth * 20, 10), 100)}px`,
                      height: `${Math.min(Math.max(body.relativeSizeEarth * 20, 10), 100)}px`,
                      boxShadow: `0 0 15px ${body.glowColor}`,
                    }}
                  >
                    <span className="text-[10px] drop-shadow-sm font-mono">
                      {isSun ? '109x' : `${body.relativeSizeEarth}x`}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-white">{body.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{body.diameterKm.toLocaleString()} km</div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 text-xs text-slate-300">
              {isSun ? (
                <span>Over 1,300,000 Earths could fit inside the Sun!</span>
              ) : body.relativeSizeEarth > 1 ? (
                <span>
                  {body.name} has a volume capable of holding approximately{' '}
                  <strong>{Math.round(Math.pow(body.relativeSizeEarth, 3)).toLocaleString()} Earths</strong> inside it!
                </span>
              ) : (
                <span>
                  Earth is roughly{' '}
                  <strong>{(1 / body.relativeSizeEarth).toFixed(1)} times larger</strong> than {body.name}.
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation (Prev / Next Planet) */}
      <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
        <button
          id="prev-planet-button"
          onClick={() => onSelectBody(prevBody)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>{prevBody.name}</span>
        </button>

        <span className="text-[11px] text-slate-500 font-mono">
          {currentIndex + 1} / {ALL_CELESTIAL_BODIES.length}
        </span>

        <button
          id="next-planet-button"
          onClick={() => onSelectBody(nextBody)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <span>{nextBody.name}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
