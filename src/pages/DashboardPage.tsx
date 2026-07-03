import { useState } from 'react';
import { Satellite, Plus, Minus, RotateCcw, Filter, Calendar, Layers as LayersIcon } from 'lucide-react';
import { LandWatchMap } from '../components/map/LandWatchMap';
import { Sidebar } from '../components/layout/Sidebar';
import { AnalysisPanel } from '../components/layout/AnalysisPanel';
import { useStore, setYear } from '../lib/store';
import { DASHBOARD_STATS, STATUS_COLORS } from '../lib/mockData';

export function DashboardPage() {
  const { selectedProperty, analysisOpen, selectedYear } = useStore();
  const [showLegend, setShowLegend] = useState(true);

  const years = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];
  const progress = ((selectedYear - 2017) / (2024 - 2017)) * 100;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-forest-950">
      {/* Sidebar */}
      <Sidebar />

      {/* Main map area */}
      <div className="flex-1 relative overflow-hidden">
        <LandWatchMap />

        {/* Top stats bar */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          <div className="glass rounded-xl p-3 min-w-[200px]">
            <div className="text-xs text-forest-400 mb-2 font-semibold uppercase tracking-wider">Resumo</div>
            <div className="grid grid-cols-2 gap-2">
              <MiniStat
                count={DASHBOARD_STATS.productive_count}
                label="Produtivos"
                color="#22c55e"
              />
              <MiniStat
                count={DASHBOARD_STATS.declining_count}
                label="Em queda"
                color="#f59e0b"
              />
              <MiniStat
                count={DASHBOARD_STATS.degraded_count}
                label="Degradados"
                color="#ef4444"
              />
              <MiniStat
                count={DASHBOARD_STATS.recovering_count}
                label="Recuperando"
                color="#60a5fa"
              />
            </div>
          </div>

          {/* Map controls */}
          <div className="glass rounded-xl p-2 flex flex-col gap-1">
            <button
              onClick={() => setShowLegend(v => !v)}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-all ${
                showLegend ? 'bg-green-500/15 text-green-400' : 'text-forest-400 hover:text-forest-200'
              }`}
            >
              <LayersIcon size={13} />
              Legenda
            </button>
          </div>
        </div>

        {/* Year timeline slider */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 glass rounded-xl px-5 py-3 w-[420px]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Calendar size={13} className="text-green-400" />
              <span className="text-xs font-semibold text-forest-200">Linha do Tempo</span>
            </div>
            <span className="text-sm font-display font-bold text-white">{selectedYear}</span>
          </div>
          <div className="relative">
            <input
              type="range"
              min={2017}
              max={2024}
              step={1}
              value={selectedYear}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full"
              style={{ '--progress': `${progress}%` } as any}
            />
            <div className="flex justify-between mt-1">
              {years.map(y => (
                <span key={y} className={`text-xs font-mono ${y === selectedYear ? 'text-green-400 font-bold' : 'text-forest-600'}`}>
                  {y}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        {showLegend && (
          <div className="absolute bottom-8 right-4 z-10 glass rounded-xl p-3">
            <div className="text-xs text-forest-400 mb-2 font-semibold uppercase tracking-wider">Score</div>
            <div className="space-y-1.5">
              {Object.entries(STATUS_COLORS).map(([status, colors]) => (
                <div key={status} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: colors.stroke, boxShadow: `0 0 4px ${colors.stroke}60` }}
                  />
                  <span className="text-xs text-forest-300">{colors.label}</span>
                  <span className="text-xs text-forest-500 ml-auto pl-3">
                    {status === 'productive' ? '≥ 70' : status === 'declining' ? '50–69' : status === 'recovering' ? '35–49' : '< 35'}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-2 pt-2 border-t border-forest-700/50 text-xs text-forest-600">
              Clique numa fazenda para análise
            </div>
          </div>
        )}

        {/* Attribution */}
        <div className="absolute bottom-2 right-2 z-5 text-xs text-forest-700">
          AlphaEarth Foundations · Google DeepMind (CC-BY 4.0) · © ESRI
        </div>
      </div>

      {/* Analysis panel */}
      {analysisOpen && selectedProperty && (
        <AnalysisPanel property={selectedProperty} />
      )}
    </div>
  );
}

function MiniStat({ count, label, color }: { count: number; label: string; color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ background: color }}
      />
      <div>
        <div className="text-xs font-bold text-white leading-none">{count}</div>
        <div className="text-xs text-forest-500 leading-none">{label}</div>
      </div>
    </div>
  );
}
