import React from 'react';
import { CelestialBody } from '../types';
import { ALL_CELESTIAL_BODIES } from '../data/planets';

interface PlanetSelectorDockProps {
  selectedBodyId: string | null;
  onSelectBody: (body: CelestialBody) => void;
}

export const PlanetSelectorDock: React.FC<PlanetSelectorDockProps> = ({
  selectedBodyId,
  onSelectBody,
}) => {
  return (
    <nav
      id="planet-selector-dock"
      aria-label="Celestial bodies quick navigation"
      className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 max-w-[95vw] overflow-x-auto no-scrollbar"
    >
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-700/70 rounded-2xl shadow-2xl">
        {ALL_CELESTIAL_BODIES.map((body) => {
          const isSelected = selectedBodyId === body.id;
          const isSun = body.id === 'sun';

          return (
            <button
              key={body.id}
              id={`dock-planet-btn-${body.id}`}
              onClick={() => onSelectBody(body)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-slate-800 text-white shadow-md border border-slate-600 scale-105'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
              title={`View ${body.name} (${body.type})`}
            >
              {/* Mini visual sphere */}
              <div
                className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                style={{
                  backgroundColor: body.color,
                  boxShadow: isSelected ? `0 0 8px ${body.glowColor}` : undefined,
                }}
              />
              <span className={isSelected ? 'font-bold' : 'font-medium'}>{body.name}</span>
              {isSun && (
                <span className="text-[9px] uppercase px-1 py-0.2 bg-amber-500/20 text-amber-300 rounded font-bold">
                  Star
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
