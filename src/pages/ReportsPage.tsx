import { useState } from 'react';
import {
  ArrowLeft, TrendingUp, TrendingDown, AlertTriangle,
  CheckCircle, XCircle, Info, BarChart2, HelpCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart, Area,
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ReferenceLine,
} from 'recharts';
import { MOCK_PROPERTIES, DASHBOARD_STATS, STATUS_COLORS, PropertyData, PropertyStatus } from '../lib/mockData';
import { setView } from '../lib/store';
import { Sprout } from 'lucide-react';

type ReportTab = 'summary' | 'properties' | 'alerts' | 'comparison';

const STATUS_LABEL: Record<PropertyStatus, string> = {
  productive: 'Produtivo',
  declining: 'Em queda',
  degraded: 'Degradado',
  recovering: 'Recuperando',
};

const STATUS_COLOR_MAP: Record<PropertyStatus, string> = {
  productive: '#22c55e',
  declining: '#f59e0b',
  degraded: '#ef4444',
  recovering: '#60a5fa',
};

// Shared recharts tooltip style
const tooltipStyle = {
  backgroundColor: 'rgba(10, 26, 15, 0.97)',
  border: '1px solid rgba(45, 106, 79, 0.5)',
  borderRadius: '10px',
  padding: '8px 12px',
  fontSize: '11px',
  color: '#d8f3dc',
  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
};

function InfoTooltip({ text }: { text: string }) {
  return (
    <span title={text} className="ml-1.5 text-forest-600 hover:text-forest-300 cursor-help inline-flex items-center align-middle transition-colors">
      <HelpCircle size={11} />
    </span>
  );
}

function SectionTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={`text-xs font-semibold text-forest-300 uppercase tracking-wider mb-3 flex items-center ${className}`}>
      {children}
    </h3>
  );
}

export function ReportsPage() {
  const [tab, setTab] = useState<ReportTab>('summary');
  const [selectedProperty, setSelectedProperty] = useState<PropertyData>(MOCK_PROPERTIES[0]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-forest-950">
      {/* Sidebar estreita */}
      <div className="w-14 flex-shrink-0 flex flex-col glass-light border-r border-forest-700/40">
        <div className="flex items-center justify-center p-3 border-b border-forest-700/40">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
            <Sprout size={16} className="text-white" />
          </div>
        </div>
        <button
          onClick={() => setView('dashboard')}
          className="flex items-center justify-center p-3 mt-2 text-forest-400 hover:text-forest-200 hover:bg-forest-800/50 transition-all rounded-lg mx-1"
          title="Voltar ao mapa"
        >
          <ArrowLeft size={16} />
        </button>
        <button
          className="flex items-center justify-center p-3 mt-1 bg-green-500/15 text-green-400 rounded-lg mx-1"
          title="Relatórios"
        >
          <BarChart2 size={16} />
        </button>
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <div className="flex items-center gap-4 px-6 py-4 border-b border-forest-700/40 glass-light flex-shrink-0">
          <div>
            <h1 className="font-display font-bold text-white text-lg leading-tight">Relatórios</h1>
            <p className="text-xs text-forest-400">
              {DASHBOARD_STATS.total_properties} propriedades · {DASHBOARD_STATS.total_area_ha.toLocaleString('pt-BR')} ha monitorados
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-forest-700/40 glass-light flex-shrink-0 px-6">
          {(
            [
              { id: 'summary', label: 'Resumo Geral' },
              { id: 'properties', label: 'Por Propriedade' },
              { id: 'alerts', label: 'Alertas' },
              { id: 'comparison', label: 'Comparativo Anual' },
            ] as { id: ReportTab; label: string }[]
          ).map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`px-4 py-3 text-xs font-medium transition-all border-b-2 -mb-px ${
                tab === id
                  ? 'text-green-400 border-green-400'
                  : 'text-forest-400 border-transparent hover:text-forest-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-6">
          {tab === 'summary' && <SummaryTab />}
          {tab === 'properties' && (
            <PropertiesTab selected={selectedProperty} onSelect={setSelectedProperty} />
          )}
          {tab === 'alerts' && <AlertsTab />}
          {tab === 'comparison' && <ComparisonTab />}
        </div>
      </div>
    </div>
  );
}

// ── ABA: Resumo Geral ──────────────────────────────────────────
function SummaryTab() {
  const statusGroups = (['productive', 'declining', 'recovering', 'degraded'] as PropertyStatus[]).map(s => ({
    status: s,
    label: STATUS_LABEL[s],
    color: STATUS_COLOR_MAP[s],
    count: MOCK_PROPERTIES.filter(p => p.status === s).length,
    totalArea: MOCK_PROPERTIES.filter(p => p.status === s).reduce((sum, p) => sum + p.area_ha, 0),
    avgScore: Math.round(
      MOCK_PROPERTIES.filter(p => p.status === s).reduce((sum, p) => sum + p.current_score, 0) /
        Math.max(1, MOCK_PROPERTIES.filter(p => p.status === s).length)
    ),
  }));

  // Portfolio trend 2017–2024
  const years = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];
  const trendData = years.map(year => {
    const scores = MOCK_PROPERTIES.map(p => p.scores.find(s => s.year === year)?.score ?? p.current_score);
    const avg = parseFloat((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1));
    const ndviAvg = parseFloat(
      (MOCK_PROPERTIES.map(p => p.scores.find(s => s.year === year)?.ndvi_proxy ?? 0)
        .reduce((a, b) => a + b, 0) / MOCK_PROPERTIES.length).toFixed(3)
    );
    return { year, avg, ndvi: ndviAvg };
  });

  const bestProperty = [...MOCK_PROPERTIES].sort((a, b) => b.current_score - a.current_score)[0];
  const worstDeltaProperty = [...MOCK_PROPERTIES].sort((a, b) =>
    (a.scores[a.scores.length - 1].score - a.scores[0].score) -
    (b.scores[b.scores.length - 1].score - b.scores[0].score)
  )[0];
  const largestProperty = [...MOCK_PROPERTIES].sort((a, b) => b.area_ha - a.area_ha)[0];
  const bestRecovery = [...MOCK_PROPERTIES]
    .filter(p => p.status === 'recovering')
    .sort((a, b) =>
      (b.scores[b.scores.length - 1].score - (b.scores[b.scores.length - 4]?.score ?? b.scores[0].score)) -
      (a.scores[a.scores.length - 1].score - (a.scores[a.scores.length - 4]?.score ?? a.scores[0].score))
    )[0] ?? MOCK_PROPERTIES[0];

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total de Propriedades"
          value={DASHBOARD_STATS.total_properties}
          unit="fazendas"
          color="text-white"
          tooltip="Número de propriedades rurais cadastradas e monitoradas na plataforma."
        />
        <KpiCard
          label="Área Total Monitorada"
          value={DASHBOARD_STATS.total_area_ha.toLocaleString('pt-BR')}
          unit="hectares"
          color="text-white"
          tooltip="Soma das áreas de todas as propriedades cadastradas, em hectares."
        />
        <KpiCard
          label="Score Médio do Portfolio"
          value={DASHBOARD_STATS.avg_score}
          unit="/ 100"
          color={DASHBOARD_STATS.avg_score >= 70 ? 'text-green-400' : DASHBOARD_STATS.avg_score >= 50 ? 'text-amber-400' : 'text-red-400'}
          tooltip="Média ponderada do índice de produtividade (0–100) de todas as propriedades. Acima de 70 = produtivo, 50–70 = atenção, abaixo de 50 = risco."
        />
        <KpiCard
          label="Alertas Críticos"
          value={DASHBOARD_STATS.critical_alerts}
          unit="ativos"
          color={DASHBOARD_STATS.critical_alerts > 0 ? 'text-red-400' : 'text-green-400'}
          tooltip="Número de alertas de nível crítico em propriedades do portfolio. Alertas críticos indicam queda severa de produtividade ou desmatamento detectado."
        />
      </div>

      {/* Gráficos principais */}
      <div className="flex flex-col lg:flex-row gap-4 w-full">
        {/* Distribuição por status — Pie */}
        <div className="glass rounded-xl p-4 border border-forest-700/40 lg:w-[320px] flex-shrink-0">
          <SectionTitle>
            Distribuição por Status
            <InfoTooltip text="Proporção de propriedades por status de produtividade. Produtivo ≥70, Em queda 50–69, Recuperando 35–49, Degradado <35." />
          </SectionTitle>
          <div className="flex items-center gap-2">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={statusGroups}
                  cx="50%"
                  cy="50%"
                  innerRadius={42}
                  outerRadius={72}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="label"
                >
                  {statusGroups.map(g => (
                    <Cell key={g.status} fill={g.color} opacity={0.85} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value: number, name: string) => [value + ' propriedades', name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-1 space-y-1.5">
            {statusGroups.map(g => (
              <div key={g.status} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: g.color }} />
                  <span className="text-forest-300">{g.label}</span>
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-forest-500">{g.totalArea.toLocaleString('pt-BR')} ha</span>
                  <span className="font-bold w-4 text-right" style={{ color: g.color }}>{g.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tendência do portfolio — AreaChart */}
        <div className="glass rounded-xl p-4 border border-forest-700/40 flex-1 min-w-0">
          <SectionTitle>
            Tendência do Portfolio (2017–2024)
            <InfoTooltip text="Score médio de produtividade de todas as propriedades ao longo dos anos. A linha tracejada mostra a média do índice NDVI (vegetação) escalada para 0–100." />
          </SectionTitle>
          <ResponsiveContainer width="100%" height={190}>
            <AreaChart data={trendData} margin={{ top: 8, right: 12, left: -22, bottom: 0 }}>
              <defs>
                <linearGradient id="portfolioScoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="portfolioNdviGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(45,106,79,0.2)" vertical={false} />
              <XAxis dataKey="year" tick={{ fill: '#74c69d', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: '#74c69d', fontSize: 10 }} axisLine={false} tickLine={false} ticks={[0, 35, 50, 70, 100]} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value: number, name: string) =>
                  name === 'NDVI ×100'
                    ? [(value).toFixed(1), name]
                    : [value + ' pts', name]
                }
              />
              <ReferenceLine y={70} stroke="rgba(34,197,94,0.35)" strokeDasharray="4 4" />
              <ReferenceLine y={50} stroke="rgba(245,158,11,0.3)" strokeDasharray="4 4" />
              <ReferenceLine y={35} stroke="rgba(239,68,68,0.25)" strokeDasharray="4 4" />
              <Area
                type="monotone"
                dataKey={d => +(d.ndvi * 100).toFixed(1)}
                name="NDVI ×100"
                stroke="#60a5fa"
                strokeWidth={1.5}
                strokeDasharray="4 3"
                fill="url(#portfolioNdviGrad)"
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="avg"
                name="Score médio"
                stroke="#22c55e"
                strokeWidth={2.5}
                fill="url(#portfolioScoreGrad)"
                dot={{ r: 3, fill: '#22c55e', stroke: '#0a1a0f', strokeWidth: 1.5 }}
                activeDot={{ r: 5, fill: '#22c55e', stroke: '#0a1a0f', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-1 text-xs text-forest-500">
            <span className="flex items-center gap-1.5"><span className="inline-block w-4 h-0.5 bg-green-400 rounded" />Score médio</span>
            <span className="flex items-center gap-1.5"><span className="inline-block w-4 h-0" style={{ borderTop: '1.5px dashed #60a5fa' }} />NDVI ×100</span>
            <span className="flex items-center gap-1.5 ml-auto"><span className="inline-block w-3 h-px bg-green-400/40" style={{ borderTop: '1px dashed' }} />limiares: 70 · 50 · 35</span>
          </div>
        </div>
      </div>

      {/* Score médio por status */}
      <div className="glass rounded-xl p-4 border border-forest-700/40 w-full">
        <SectionTitle>
          Score Médio vs. Área por Status
          <InfoTooltip text="Comparação entre o score médio de produtividade e a área total de cada status. Barras verdes indicam scores mais altos; o eixo esquerdo mostra score (pts), o tamanho da barra representa o score médio." />
        </SectionTitle>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={statusGroups} margin={{ top: 4, right: 16, left: -20, bottom: 0 }} barGap={8}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(45,106,79,0.2)" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: '#74c69d', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fill: '#74c69d', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value: number, name: string) => [
                name === 'Score médio' ? value + ' pts' : value.toLocaleString('pt-BR') + ' ha',
                name,
              ]}
            />
            <Bar dataKey="avgScore" name="Score médio" radius={[4, 4, 0, 0]}>
              {statusGroups.map(g => (
                <Cell key={g.status} fill={g.color} opacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Destaques */}
      <div>
        <SectionTitle>
          Destaques do Portfolio
          <InfoTooltip text="Propriedades com maior score atual, maior queda acumulada, maior área e melhor recuperação recente." />
        </SectionTitle>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          <HighlightCard label="Melhor desempenho" property={bestProperty} icon={<TrendingUp size={13} className="text-green-400" />} color="text-green-400" />
          <HighlightCard label="Maior queda acumulada" property={worstDeltaProperty} icon={<TrendingDown size={13} className="text-red-400" />} color="text-red-400" />
          <HighlightCard label="Maior área" property={largestProperty} icon={<Info size={13} className="text-blue-400" />} color="text-blue-400" extra={p => `${p.area_ha.toLocaleString('pt-BR')} ha`} />
          <HighlightCard label="Melhor recuperação" property={bestRecovery} icon={<TrendingUp size={13} className="text-blue-400" />} color="text-blue-400" />
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, unit, color, tooltip }: {
  label: string; value: string | number; unit: string; color: string; tooltip?: string;
}) {
  return (
    <div className="glass rounded-xl p-4 border border-forest-700/40">
      <div className="text-xs text-forest-400 mb-1 flex items-center">
        {label}
        {tooltip && <InfoTooltip text={tooltip} />}
      </div>
      <div className={`text-2xl font-display font-bold leading-none ${color}`}>{value}</div>
      <div className="text-xs text-forest-500 mt-0.5">{unit}</div>
    </div>
  );
}

function HighlightCard({ label, property, icon, color, extra }: {
  label: string; property: PropertyData; icon: React.ReactNode; color: string; extra?: (p: PropertyData) => string;
}) {
  if (!property) return null;
  return (
    <div className="glass rounded-xl p-3 border border-forest-700/40">
      <div className="flex items-center gap-1.5 mb-2">
        {icon}
        <span className="text-xs text-forest-400">{label}</span>
      </div>
      <div className="text-sm font-semibold text-white truncate">{property.name}</div>
      <div className="text-xs text-forest-400">{property.municipality}, {property.state}</div>
      <div className={`text-xs font-mono font-bold mt-1 ${color}`}>
        {extra ? extra(property) : `Score: ${property.current_score}`}
      </div>
    </div>
  );
}

// ── ABA: Por Propriedade ───────────────────────────────────────
function PropertiesTab({ selected, onSelect }: { selected: PropertyData; onSelect: (p: PropertyData) => void }) {
  const delta = selected.scores[selected.scores.length - 1].score - selected.scores[0].score;
  const colors = STATUS_COLORS[selected.status];

  // Data for BarChart
  const scoreData = selected.scores.map(s => ({
    year: String(s.year),
    score: s.score,
    ndvi: parseFloat((s.ndvi_proxy * 100).toFixed(1)),
    fill: s.score >= 70 ? '#22c55e' : s.score >= 50 ? '#f59e0b' : s.score >= 35 ? '#60a5fa' : '#ef4444',
  }));

  // Radar data for current year
  const radarData = [
    { metric: 'Score', value: selected.current_score, fullMark: 100 },
    { metric: 'NDVI ×100', value: parseFloat((selected.scores[selected.scores.length - 1].ndvi_proxy * 100).toFixed(1)), fullMark: 100 },
    {
      metric: 'Estabilidade',
      value: parseFloat((selected.scores[selected.scores.length - 1].embedding_change * 100).toFixed(1)),
      fullMark: 100,
    },
    {
      metric: 'Tendência',
      value: Math.min(100, Math.max(0, 50 + delta * 2)),
      fullMark: 100,
    },
    {
      metric: 'Área (norm.)',
      value: Math.min(100, Math.round((selected.area_ha / 7500) * 100)),
      fullMark: 100,
    },
  ];

  return (
    <div className="flex flex-col xl:flex-row gap-4 h-full w-full">
      {/* Lista */}
      <div className="xl:w-56 flex-shrink-0 space-y-1">
        {MOCK_PROPERTIES.map(p => {
          const isSelected = p.id === selected.id;
          const c = STATUS_COLORS[p.status];
          return (
            <button
              key={p.id}
              onClick={() => onSelect(p)}
              className={`w-full text-left rounded-lg p-2.5 transition-all border ${
                isSelected ? 'bg-green-500/10 border-green-500/30' : 'border-transparent hover:bg-forest-800/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.stroke }} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-forest-100 truncate">{p.name}</div>
                  <div className="text-xs text-forest-500">{p.municipality}, {p.state}</div>
                </div>
                <span className={`text-xs font-mono font-bold ${p.current_score >= 70 ? 'text-green-400' : p.current_score >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                  {p.current_score}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detalhe */}
      <div className="flex-1 min-w-0 space-y-4 overflow-y-auto">
        {/* Header */}
        <div className="glass rounded-xl p-4 border border-forest-700/40">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="font-display font-bold text-white text-base">{selected.name}</h2>
              <div className="text-xs text-forest-400 mt-0.5">{selected.municipality}, {selected.state} · {selected.biome}</div>
              <div className="text-xs text-forest-500 mt-0.5">CAR: {selected.car_number}</div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-3xl font-display font-bold" style={{ color: colors.stroke }}>{selected.current_score}</div>
              <div className="text-xs" style={{ color: colors.stroke }}>{STATUS_LABEL[selected.status]}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            <div className="text-xs">
              <div className="text-forest-500">Proprietário</div>
              <div className="text-forest-200 font-medium truncate">{selected.owner}</div>
            </div>
            <div className="text-xs">
              <div className="text-forest-500">Área</div>
              <div className="text-forest-200 font-medium">{selected.area_ha.toLocaleString('pt-BR')} ha</div>
            </div>
            <div className="text-xs">
              <div className="text-forest-500">Variação 7 anos</div>
              <div className={`font-medium ${delta >= 0 ? 'text-green-400' : 'text-red-400'}`}>{delta > 0 ? '+' : ''}{delta} pts</div>
            </div>
            <div className="text-xs">
              <div className="text-forest-500">NDVI atual</div>
              <div className="text-blue-300 font-mono font-medium">{selected.scores[selected.scores.length - 1].ndvi_proxy.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* Charts row */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Score history BarChart */}
          <div className="glass rounded-xl p-4 border border-forest-700/40 flex-1 min-w-0">
            <SectionTitle>
              Histórico de Score (2017–2024)
              <InfoTooltip text="Score de produtividade por ano. Verde ≥70, Âmbar 50–69, Azul 35–49, Vermelho <35. A linha pontilhada representa o NDVI×100." />
            </SectionTitle>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={scoreData} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(45,106,79,0.2)" vertical={false} />
                <XAxis dataKey="year" tick={{ fill: '#74c69d', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: '#74c69d', fontSize: 10 }} axisLine={false} tickLine={false} ticks={[0, 35, 50, 70, 100]} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload;
                    const color = d.score >= 70 ? '#22c55e' : d.score >= 50 ? '#f59e0b' : d.score >= 35 ? '#60a5fa' : '#ef4444';
                    const s = selected.scores.find(s => String(s.year) === label);
                    return (
                      <div style={tooltipStyle}>
                        <div className="font-semibold text-forest-100 mb-1">{label}</div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                          <span className="text-forest-300">Score:</span>
                          <span className="text-white font-bold">{d.score}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <div className="w-2 h-2 rounded-full bg-blue-400" />
                          <span className="text-forest-300">NDVI:</span>
                          <span className="text-blue-300 font-mono">{(d.ndvi / 100).toFixed(2)}</span>
                        </div>
                        {s && <div className="text-forest-500 italic mt-1">{s.label}</div>}
                      </div>
                    );
                  }}
                />
                <ReferenceLine y={70} stroke="rgba(34,197,94,0.4)" strokeDasharray="4 4" />
                <ReferenceLine y={50} stroke="rgba(245,158,11,0.3)" strokeDasharray="4 4" />
                <ReferenceLine y={35} stroke="rgba(239,68,68,0.25)" strokeDasharray="4 4" />
                <Bar dataKey="score" name="Score" radius={[3, 3, 0, 0]} maxBarSize={36}>
                  {scoreData.map((d, i) => <Cell key={i} fill={d.fill} opacity={0.85} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Radar chart */}
          <div className="glass rounded-xl p-4 border border-forest-700/40 lg:w-[220px] flex-shrink-0">
            <SectionTitle>
              Perfil Atual
              <InfoTooltip text="Radar com 5 dimensões: Score (produtividade 0–100), NDVI×100 (vegetação), Estabilidade (similaridade espectral com o ano anterior ×100), Tendência (50 = estável, >50 = subindo, <50 = caindo), Área normalizada pelo maior imóvel do portfolio." />
            </SectionTitle>
            <ResponsiveContainer width="100%" height={180}>
              <RadarChart data={radarData} margin={{ top: 0, right: 16, bottom: 0, left: 16 }}>
                <PolarGrid stroke="rgba(45,106,79,0.35)" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: '#74c69d', fontSize: 9 }} />
                <Radar
                  dataKey="value"
                  stroke={colors.stroke}
                  fill={colors.stroke}
                  fillOpacity={0.2}
                  strokeWidth={1.5}
                />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [v.toFixed(1), '']} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alertas */}
        {selected.alerts.length > 0 && (
          <div className="glass rounded-xl p-4 border border-forest-700/40">
            <SectionTitle>Alertas</SectionTitle>
            <div className="space-y-2">
              {selected.alerts.map(a => (
                <AlertRow key={a.id} alert={a} />
              ))}
            </div>
          </div>
        )}

        {/* Recomendações */}
        {selected.recommendations.length > 0 && (
          <div className="glass rounded-xl p-4 border border-forest-700/40">
            <SectionTitle>
              Recomendações
              <InfoTooltip text="Ações sugeridas com base no histórico de produtividade, alertas e práticas agronômicas adequadas para o bioma." />
            </SectionTitle>
            <div className="space-y-2">
              {selected.recommendations.map(r => (
                <div key={r.id} className="rounded-lg border border-forest-700/50 bg-forest-900/30 p-3">
                  <div className="flex items-start gap-2">
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${
                      r.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                      r.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-forest-700/50 text-forest-400'
                    }`}>
                      {r.priority === 'high' ? 'Alta' : r.priority === 'medium' ? 'Média' : 'Baixa'}
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-forest-200">{r.title}</div>
                      <div className="text-xs text-forest-500 mt-0.5">{r.description}</div>
                      <div className="text-xs text-green-400 mt-1 font-medium">{r.estimated_impact}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── ABA: Alertas ───────────────────────────────────────────────
function AlertsTab() {
  const allAlerts = MOCK_PROPERTIES.flatMap(p =>
    p.alerts.map(a => ({ ...a, propertyName: p.name, propertyId: p.id, municipality: p.municipality, state: p.state }))
  ).sort((a, b) => {
    const order: Record<string, number> = { critical: 0, warning: 1, info: 2, ok: 3 };
    return order[a.level] - order[b.level];
  });

  const counts = {
    critical: allAlerts.filter(a => a.level === 'critical').length,
    warning: allAlerts.filter(a => a.level === 'warning').length,
    info: allAlerts.filter(a => a.level === 'info').length,
    ok: allAlerts.filter(a => a.level === 'ok').length,
  };

  // Alertas por propriedade para o BarChart
  const alertsByProperty = MOCK_PROPERTIES
    .map(p => ({
      name: p.name.replace('Fazenda ', 'Faz. ').replace('Sítio ', 'Sít. '),
      critical: p.alerts.filter(a => a.level === 'critical').length,
      warning: p.alerts.filter(a => a.level === 'warning').length,
      info: p.alerts.filter(a => a.level === 'info').length,
      ok: p.alerts.filter(a => a.level === 'ok').length,
    }))
    .filter(p => p.critical + p.warning + p.info + p.ok > 0);

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Contagens */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <AlertCountCard level="critical" count={counts.critical} label="Críticos"
          tooltip="Situações que requerem intervenção imediata: queda severa de produtividade, desmatamento ou embargo iminente." />
        <AlertCountCard level="warning" count={counts.warning} label="Avisos"
          tooltip="Situações de atenção: quedas acumuladas, scores abaixo do potencial da região ou vulnerabilidade climática." />
        <AlertCountCard level="info" count={counts.info} label="Informativos"
          tooltip="Eventos contextuais relevantes: El Niño, tendências positivas, correlações climáticas detectadas." />
        <AlertCountCard level="ok" count={counts.ok} label="OK"
          tooltip="Propriedades estáveis e produtivas, com boas práticas de manejo sustentável detectadas." />
      </div>

      {/* Charts + lista */}
      <div className="flex flex-col lg:flex-row gap-5">
        {/* BarChart por propriedade */}
        <div className="glass rounded-xl p-4 border border-forest-700/40 flex-1 min-w-0">
          <SectionTitle>
            Alertas por Propriedade
            <InfoTooltip text="Quantidade de alertas por nível em cada propriedade. Barras empilhadas mostram a composição de alertas: vermelho = crítico, âmbar = aviso, azul = informativo, verde = ok." />
          </SectionTitle>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={alertsByProperty} layout="vertical" margin={{ top: 0, right: 12, left: 8, bottom: 0 }} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(45,106,79,0.2)" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#74c69d', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#a7c4b5', fontSize: 10 }} axisLine={false} tickLine={false} width={90} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v: number, name: string) => [v, name.charAt(0).toUpperCase() + name.slice(1)]}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 11, color: '#74c69d', paddingTop: 8 }}
              />
              <Bar dataKey="critical" name="Crítico" stackId="a" fill="#ef4444" opacity={0.85} radius={[0, 0, 0, 0]} />
              <Bar dataKey="warning" name="Aviso" stackId="a" fill="#f59e0b" opacity={0.85} />
              <Bar dataKey="info" name="Informativo" stackId="a" fill="#60a5fa" opacity={0.85} />
              <Bar dataKey="ok" name="OK" stackId="a" fill="#22c55e" opacity={0.85} radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Lista de alertas */}
        <div className="lg:w-[340px] flex-shrink-0 flex flex-col gap-3 min-w-0">
          <SectionTitle>Todos os Alertas</SectionTitle>
          <div className="space-y-2 overflow-y-auto max-h-[300px] lg:max-h-none">
            {allAlerts.map(a => (
              <div key={a.id} className="glass rounded-xl p-3 border border-forest-700/40">
                <div className="flex items-start gap-3">
                  <AlertIcon level={a.level} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-xs font-semibold text-forest-200 leading-tight">{a.title}</div>
                      <span className="text-xs text-forest-500 font-mono flex-shrink-0">{a.year}</span>
                    </div>
                    <div className="text-xs text-forest-500 mt-0.5">{a.description}</div>
                    <div className="text-xs text-forest-400 mt-1">{a.propertyName} · {a.municipality}, {a.state}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AlertCountCard({ level, count, label, tooltip }: { level: string; count: number; label: string; tooltip?: string }) {
  const styles: Record<string, string> = {
    critical: 'text-red-400 border-red-500/30 bg-red-500/5',
    warning: 'text-amber-400 border-amber-500/30 bg-amber-500/5',
    info: 'text-blue-400 border-blue-500/30 bg-blue-500/5',
    ok: 'text-green-400 border-green-500/30 bg-green-500/5',
  };
  return (
    <div className={`rounded-xl p-4 border ${styles[level]}`}>
      <div className="text-2xl font-display font-bold">{count}</div>
      <div className="text-xs mt-0.5 opacity-80 flex items-center">
        {label}
        {tooltip && <InfoTooltip text={tooltip} />}
      </div>
    </div>
  );
}

function AlertIcon({ level }: { level: string }) {
  if (level === 'critical') return <XCircle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />;
  if (level === 'warning') return <AlertTriangle size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />;
  if (level === 'ok') return <CheckCircle size={14} className="text-green-400 mt-0.5 flex-shrink-0" />;
  return <Info size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />;
}

function AlertRow({ alert }: { alert: { level: string; title: string; description: string; year: number } }) {
  return (
    <div className="flex items-start gap-2">
      <AlertIcon level={alert.level} />
      <div>
        <div className="text-xs font-semibold text-forest-200">{alert.title}</div>
        <div className="text-xs text-forest-500">{alert.description}</div>
      </div>
    </div>
  );
}

// ── ABA: Comparativo Anual ─────────────────────────────────────
function ComparisonTab() {
  const years = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

  const yearStats = years.map(year => {
    const scores = MOCK_PROPERTIES.map(p => p.scores.find(s => s.year === year)?.score ?? p.current_score);
    const avg = parseFloat((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1));
    const productive = scores.filter(s => s >= 70).length;
    const declining = scores.filter(s => s >= 50 && s < 70).length;
    const recovering = scores.filter(s => s >= 35 && s < 50).length;
    const degraded = scores.filter(s => s < 35).length;
    return { year, avg, productive, declining, recovering, degraded };
  });

  const rankingData = [...MOCK_PROPERTIES]
    .map(p => ({ p, delta: p.scores[p.scores.length - 1].score - p.scores[0].score }))
    .sort((a, b) => b.delta - a.delta);

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Score médio — LineChart */}
      <div className="glass rounded-xl p-4 border border-forest-700/40 w-full">
        <SectionTitle>
          Evolução do Score Médio do Portfolio (2017–2024)
          <InfoTooltip text="Média aritmética do score de produtividade de todas as propriedades em cada ano. Linhas de referência: verde=70 (produtivo), âmbar=50 (atenção), vermelho=35 (degradado)." />
        </SectionTitle>
        <ResponsiveContainer width="100%" height={190}>
          <LineChart data={yearStats} margin={{ top: 8, right: 16, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(45,106,79,0.2)" vertical={false} />
            <XAxis dataKey="year" tick={{ fill: '#74c69d', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fill: '#74c69d', fontSize: 10 }} axisLine={false} tickLine={false} ticks={[0, 35, 50, 70, 100]} />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(v: number) => [v + ' pts', 'Score médio']}
            />
            <ReferenceLine y={70} stroke="rgba(34,197,94,0.4)" strokeDasharray="4 4" label={{ value: '70', fill: '#22c55e', fontSize: 9, position: 'right' }} />
            <ReferenceLine y={50} stroke="rgba(245,158,11,0.3)" strokeDasharray="4 4" label={{ value: '50', fill: '#f59e0b', fontSize: 9, position: 'right' }} />
            <ReferenceLine y={35} stroke="rgba(239,68,68,0.25)" strokeDasharray="4 4" label={{ value: '35', fill: '#ef4444', fontSize: 9, position: 'right' }} />
            <Line
              type="monotone"
              dataKey="avg"
              name="Score médio"
              stroke="#22c55e"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#22c55e', stroke: '#0a1a0f', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#22c55e', stroke: '#0a1a0f', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Distribuição de status por ano + Ranking */}
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Stacked BarChart */}
        <div className="glass rounded-xl p-4 border border-forest-700/40 flex-1 min-w-0">
          <SectionTitle>
            Composição do Portfolio por Ano
            <InfoTooltip text="Número de propriedades em cada status produtivo por ano. Verde = produtivo (≥70), âmbar = em queda (50–69), azul = recuperando (35–49), vermelho = degradado (<35)." />
          </SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={yearStats} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(45,106,79,0.2)" vertical={false} />
              <XAxis dataKey="year" tick={{ fill: '#74c69d', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fill: '#74c69d', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v: number, name: string) => [v + ' propriedades', name]}
              />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#74c69d', paddingTop: 6 }} />
              <Bar dataKey="productive" name="Produtivo" stackId="a" fill="#22c55e" opacity={0.85} radius={[0, 0, 0, 0]} />
              <Bar dataKey="declining" name="Em queda" stackId="a" fill="#f59e0b" opacity={0.85} />
              <Bar dataKey="recovering" name="Recuperando" stackId="a" fill="#60a5fa" opacity={0.85} />
              <Bar dataKey="degraded" name="Degradado" stackId="a" fill="#ef4444" opacity={0.85} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Ranking */}
        <div className="glass rounded-xl p-4 border border-forest-700/40 lg:w-[320px] flex-shrink-0">
          <SectionTitle>
            Variação de Score (2017 → 2024)
            <InfoTooltip text="Diferença entre o score de 2024 e o de 2017 para cada propriedade. Verde = melhora, vermelho = queda. Ordenado do melhor para o pior desempenho." />
          </SectionTitle>
          <div className="space-y-2">
            {rankingData.map(({ p, delta }) => {
              const barWidth = Math.min(100, Math.abs(delta) * 3.5);
              const barColor = delta >= 0 ? '#22c55e' : '#ef4444';
              return (
                <div key={p.id}>
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: STATUS_COLORS[p.status].stroke }} />
                    <span className="text-xs text-forest-200 flex-1 truncate">{p.name}</span>
                    <span className="text-xs text-forest-500 font-mono flex-shrink-0">{p.scores[0].score}→{p.scores[p.scores.length - 1].score}</span>
                    <span className={`text-xs font-mono font-bold w-8 text-right flex-shrink-0 ${delta >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {delta > 0 ? '+' : ''}{delta}
                    </span>
                  </div>
                  <div className="h-1 bg-forest-800 rounded-full overflow-hidden ml-4">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${barWidth}%`, background: barColor, opacity: 0.7 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
