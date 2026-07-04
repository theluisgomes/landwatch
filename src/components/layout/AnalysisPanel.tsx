import { useState } from 'react';
import { X, MapPin, Maximize2, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { PropertyData } from '../../lib/mockData';
import { ProductivityScore } from '../analysis/ProductivityScore';
import { TemporalChart } from '../analysis/TemporalChart';
import { RecoveryRecommendations } from '../analysis/RecoveryRecommendations';
import { AlertBanner } from '../ui/AlertBanner';
import { useStore, closeAnalysis } from '../../lib/store';

interface AnalysisPanelProps {
  property: PropertyData;
}

export function AnalysisPanel({ property }: AnalysisPanelProps) {
  const { selectedYear, selectedIndex } = useStore();
  const [section, setSection] = useState<'overview' | 'history' | 'recommendations'>('overview');
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  const yearData = property.scores.find(s => s.year === selectedYear) || property.scores[property.scores.length - 1];
  const activeAlerts = property.alerts.filter(a => !dismissedAlerts.has(a.id));

  const dismissAlert = (id: string) => {
    setDismissedAlerts(prev => new Set([...prev, id]));
  };

  return (
    <div className="panel-enter w-80 h-full flex flex-col glass-light border-l border-forest-700/40 overflow-hidden">
      {/* Header */}
      <div className="flex items-start gap-3 p-4 border-b border-forest-700/40">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <MapPin size={12} className="text-green-400 flex-shrink-0" />
            <span className="text-xs text-forest-400">{property.municipality}, {property.state}</span>
          </div>
          <h2 className="font-display font-bold text-white text-sm leading-tight truncate">
            {property.name}
          </h2>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-forest-400">
              {property.area_ha.toLocaleString('pt-BR')} ha
            </span>
            <span className="text-xs text-forest-500">·</span>
            <span className="text-xs text-forest-400">{property.biome}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="w-7 h-7 rounded-lg hover:bg-forest-700/50 flex items-center justify-center transition-colors">
            <Maximize2 size={13} className="text-forest-400" />
          </button>
          <button
            onClick={closeAnalysis}
            className="w-7 h-7 rounded-lg hover:bg-forest-700/50 flex items-center justify-center transition-colors"
          >
            <X size={13} className="text-forest-400" />
          </button>
        </div>
      </div>

      {/* Score + Year info */}
      <div className="p-4 border-b border-forest-700/40 flex items-center gap-4">
        <ProductivityScore property={property} size="md" />
        <div className="flex-1">
          <div className="text-xs text-forest-400 mb-1">Ano em análise</div>
          <div className="text-2xl font-display font-bold text-white">{selectedYear}</div>
          {yearData && (
            <div className="mt-1">
              <div className="text-xs text-forest-400">{yearData.label}</div>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span className="text-xs font-mono text-blue-300">
                  {(selectedIndex === 'score' ? 'ndvi' : selectedIndex).toUpperCase()} {(selectedIndex === 'osavi' ? yearData.osavi_proxy : yearData.ndvi_proxy).toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span className="text-xs font-mono text-cyan-300">Umidade Solo {yearData.soil_moisture.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <span className="text-xs font-mono text-purple-300">Δ sim {yearData.embedding_change.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Alerts */}
      {activeAlerts.length > 0 && (
        <div className="p-3 border-b border-forest-700/40">
          <AlertBanner alerts={activeAlerts} onDismiss={dismissAlert} />
        </div>
      )}

      {/* Tab navigation */}
      <div className="flex border-b border-forest-700/40">
        {(['overview', 'history', 'recommendations'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setSection(tab)}
            className={`flex-1 text-xs py-2.5 font-medium transition-all ${
              section === tab
                ? 'text-green-400 border-b-2 border-green-400'
                : 'text-forest-400 hover:text-forest-200'
            }`}
          >
            {tab === 'overview' ? 'Visão Geral' : tab === 'history' ? 'Histórico' : 'Recomendações'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {section === 'overview' && (
          <div className="space-y-4 animate-fade-in">
            {/* Key metrics */}
            <div>
              <h4 className="text-xs font-semibold text-forest-300 uppercase tracking-wider mb-2">Indicadores</h4>
              <div className="grid grid-cols-2 gap-2">
                <MetricCard
                  label="Proprietário"
                  value={property.owner}
                  small
                />
                <MetricCard
                  label="CAR"
                  value={property.car_number.slice(-8) + '...'}
                  small
                />
                <MetricCard
                  label="Umidade do Solo"
                  value={yearData ? `${Math.round(yearData.soil_moisture * 100)}` : 'N/A'}
                  suffix="%"
                  color={yearData ? (yearData.soil_moisture >= 0.5 ? 'text-blue-400' : yearData.soil_moisture >= 0.35 ? 'text-amber-400' : 'text-red-400') : 'text-white'}
                />
                <MetricCard
                  label="Status Hídrico"
                  value={yearData ? (yearData.soil_moisture >= 0.5 ? 'Adequado' : yearData.soil_moisture >= 0.35 ? 'Atenção' : 'Crítico') : 'N/A'}
                  color={yearData ? (yearData.soil_moisture >= 0.5 ? 'text-green-400' : yearData.soil_moisture >= 0.35 ? 'text-amber-400' : 'text-red-400') : 'text-white'}
                  small
                />
                <MetricCard
                  label="Máximo histórico"
                  value={`${Math.max(...property.scores.map(s => s.score))}`}
                  suffix="/100"
                  color="text-green-400"
                />
                <MetricCard
                  label="Mínimo histórico"
                  value={`${Math.min(...property.scores.map(s => s.score))}`}
                  suffix="/100"
                  color="text-red-400"
                />
                <MetricCard
                  label="Variação total"
                  value={`${property.scores[property.scores.length - 1].score - property.scores[0].score > 0 ? '+' : ''}${property.scores[property.scores.length - 1].score - property.scores[0].score}`}
                  suffix=" pts"
                  color={property.scores[property.scores.length - 1].score >= property.scores[0].score ? 'text-green-400' : 'text-red-400'}
                />
                <MetricCard
                  label="Alertas ativos"
                  value={`${activeAlerts.filter(a => a.level !== 'ok').length}`}
                  color={activeAlerts.some(a => a.level === 'critical') ? 'text-red-400' : 'text-amber-400'}
                />
              </div>
            </div>

            {/* AlphaEarth info */}
            <div className="rounded-lg border border-forest-700/50 bg-forest-900/30 p-3">
              <div className="flex items-start gap-2">
                <Info size={13} className="text-forest-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-forest-300 mb-1">AlphaEarth Foundations</div>
                  <div className="text-xs text-forest-500 leading-relaxed">
                    Dados de embeddings 64D · 10m/pixel · Sentinel-1, Sentinel-2, Landsat · {property.scores.length} anos analisados
                  </div>
                  <div className="text-xs text-forest-600 mt-1">
                    © Google & Google DeepMind (CC-BY 4.0)
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {section === 'history' && (
          <div className="animate-fade-in">
            <TemporalChart property={property} />
          </div>
        )}

        {section === 'recommendations' && (
          <div className="animate-fade-in">
            <RecoveryRecommendations recommendations={property.recommendations} />
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({ label, value, suffix = '', color = 'text-white', small = false }: {
  label: string;
  value: string;
  suffix?: string;
  color?: string;
  small?: boolean;
}) {
  return (
    <div className="rounded-lg border border-forest-700/50 bg-forest-900/40 p-2.5">
      <div className="text-xs text-forest-400 mb-0.5">{label}</div>
      <div className={`font-semibold ${small ? 'text-xs' : 'text-sm'} ${color} leading-tight`}>
        {value}<span className="text-forest-500 text-xs font-normal">{suffix}</span>
      </div>
    </div>
  );
}
