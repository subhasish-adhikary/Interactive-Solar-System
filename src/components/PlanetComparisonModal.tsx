import React from 'react';
import { CelestialBody } from '../types';
import { ALL_CELESTIAL_BODIES } from '../data/planets';
import { X, ArrowUpDown } from 'lucide-react';

interface PlanetComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlanet: (planet: CelestialBody) => void;
}

export const PlanetComparisonModal: React.FC<PlanetComparisonModalProps> = ({
  isOpen,
  onClose,
  onSelectPlanet,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="planet-comparison-modal-backdrop"
      className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        id="planet-comparison-modal"
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ArrowUpDown className="w-5 h-5 text-blue-400" />
              Comparative Planetary Data
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Side-by-side comparison of the Sun, planets, and dwarf planets in astronomical order
            </p>
          </div>
          <button
            id="close-comparison-modal-button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Table */}
        <div className="flex-1 overflow-x-auto overflow-y-auto p-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="pb-3 pl-2">Body</th>
                <th className="pb-3 px-3">Type</th>
                <th className="pb-3 px-3">Diameter</th>
                <th className="pb-3 px-3">Distance (Sun)</th>
                <th className="pb-3 px-3">Orbital Period</th>
                <th className="pb-3 px-3">Day Length</th>
                <th className="pb-3 px-3">Gravity</th>
                <th className="pb-3 px-3">Moons</th>
                <th className="pb-3 pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {ALL_CELESTIAL_BODIES.map((body) => (
                <tr
                  key={body.id}
                  className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                  onClick={() => {
                    onSelectPlanet(body);
                    onClose();
                  }}
                >
                  <td className="py-3 pl-2 font-sans font-semibold text-white flex items-center gap-2">
                    <div
                      className="w-3.5 h-3.5 rounded-full shrink-0"
                      style={{ backgroundColor: body.color }}
                    />
                    <span>{body.name}</span>
                  </td>
                  <td className="py-3 px-3 font-sans text-slate-300">{body.type}</td>
                  <td className="py-3 px-3 text-slate-200">
                    <div>{body.diameterKm.toLocaleString()} km</div>
                    <div className="text-[10px] text-slate-500 font-sans">
                      {body.id === 'sun' ? '109.2x Earth' : `${body.relativeSizeEarth}x Earth`}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-200">
                    <div>{body.id === 'sun' ? '0 AU' : `${body.distanceFromSunAU} AU`}</div>
                    <div className="text-[10px] text-slate-500 font-sans">
                      {body.id === 'sun' ? 'Center' : `${body.distanceFromSunMillionKm}M km`}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-amber-300">
                    <div>
                      {body.id === 'sun'
                        ? '—'
                        : body.orbitalPeriodDays < 365
                        ? `${body.orbitalPeriodDays} days`
                        : `${body.orbitalPeriodYears} yrs`}
                    </div>
                    <div className="text-[10px] text-slate-500 font-sans">
                      {body.id === 'sun' ? 'Galactic Center' : `${body.orbitalPeriodDays.toLocaleString()} Earth days`}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    {Math.abs(body.rotationPeriodHours) >= 24
                      ? `${(Math.abs(body.rotationPeriodHours) / 24).toFixed(1)}d`
                      : `${Math.abs(body.rotationPeriodHours).toFixed(1)}h`}
                  </td>
                  <td className="py-3 px-3 text-cyan-300">
                    <div>{body.surfaceGravityMs2} m/s²</div>
                    <div className="text-[10px] text-slate-500 font-sans">{body.relativeGravity}g</div>
                  </td>
                  <td className="py-3 px-3 text-slate-300">{body.moonsCount}</td>
                  <td className="py-3 pr-2 font-sans">
                    <button
                      className="px-2.5 py-1 rounded bg-blue-600/80 hover:bg-blue-600 text-white text-[11px] font-medium transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPlanet(body);
                        onClose();
                      }}
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>Click any celestial body row to focus the interactive simulation camera.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
