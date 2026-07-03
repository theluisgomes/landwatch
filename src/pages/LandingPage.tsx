import { useState, useEffect } from 'react';
import {
  Sprout, Satellite, TrendingUp, TrendingDown,
  AlertTriangle, ChevronRight, Globe, Sun, Moon,
} from 'lucide-react';
import { setView, toggleTheme, useStore } from '../lib/store';
import { DASHBOARD_STATS, MOCK_PROPERTIES, STATUS_COLORS } from '../lib/mockData';

function CountUp({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const steps = 60;
    const increment = target / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const current = Math.min(Math.round(increment * step), target);
      setCount(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target, duration]);

  return <>{count.toLocaleString('pt-BR')}</>;
}

export function LandingPage() {
  const { theme } = useStore();
  const [started, setStarted] = useState(false);

  const handleStart = () => {
    setStarted(true);
    setTimeout(() => setView('dashboard'), 300);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-forest-950 text-gray-900 dark:text-white transition-colors duration-200">

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-gray-100 dark:border-forest-800 bg-white/95 dark:bg-forest-950/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center flex-shrink-0">
              <Sprout size={15} className="text-white" />
            </div>
            <span className="font-display font-bold text-base">LandWatch</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a
              href="https://deepmind.google/blog/alphaearth-foundations-helps-map-our-planet-in-unprecedented-detail/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-forest-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <Globe size={11} />
              AlphaEarth
            </a>
            <a
              href="https://developers.google.com/earth-engine/datasets/catalog/GOOGLE_SATELLITE_EMBEDDING_V1_ANNUAL"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 dark:text-forest-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Dataset GEE
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 dark:text-forest-400 hover:bg-gray-100 dark:hover:bg-forest-800 transition-colors"
              title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button
              onClick={handleStart}
              className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Acessar Mapa
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        {/* Left */}
        <div>
          <div className="inline-flex items-center gap-2 border border-green-200 dark:border-green-500/30 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 rounded-full px-3 py-1 text-xs font-medium mb-8">
            <Satellite size={11} />
            AlphaEarth Foundations · Google DeepMind · 10m/pixel
          </div>

          <h1 className="font-display font-bold text-4xl md:text-5xl leading-tight mb-5 text-gray-900 dark:text-white">
            Cada hectare conta.<br />
            Veja sua terra<br />
            do espaço.
          </h1>

          <p className="text-base text-gray-500 dark:text-forest-400 leading-relaxed mb-8 max-w-lg">
            Identificamos, rastreamos e apoiamos a recuperação de{' '}
            <span className="text-gray-900 dark:text-forest-100 font-medium">terras agrícolas improdutivas</span>{' '}
            usando embeddings geoespaciais de IA com resolução de{' '}
            <span className="text-green-700 dark:text-green-400 font-medium">10 metros por pixel</span>.
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={handleStart}
              disabled={started}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold text-sm px-6 py-3 rounded-lg transition-colors"
            >
              Explorar o Mapa
              <ChevronRight size={16} />
            </button>
            <a
              href="https://developers.google.com/earth-engine/datasets/catalog/GOOGLE_SATELLITE_EMBEDDING_V1_ANNUAL"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-gray-200 dark:border-forest-700 text-gray-700 dark:text-forest-300 hover:border-gray-400 dark:hover:border-forest-500 text-sm px-6 py-3 rounded-lg transition-colors"
            >
              <Satellite size={14} />
              Dataset GEE
            </a>
          </div>
        </div>

        {/* Right – live property preview */}
        <div className="border border-gray-200 dark:border-forest-700/40 rounded-2xl overflow-hidden">
          <div className="border-b border-gray-200 dark:border-forest-700/40 px-4 py-3 flex items-center justify-between bg-gray-50 dark:bg-forest-900/60">
            <span className="text-xs font-semibold text-gray-600 dark:text-forest-300 uppercase tracking-wider">
              Propriedades Monitoradas
            </span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Ao vivo</span>
            </div>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-forest-700/40 bg-white dark:bg-forest-900/30">
            {MOCK_PROPERTIES.slice(0, 6).map(p => {
              const delta = p.scores[p.scores.length - 1].score - p.scores[0].score;
              const colors = STATUS_COLORS[p.status];
              return (
                <div key={p.id} className="px-4 py-3 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: colors.stroke }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-900 dark:text-forest-100 truncate">{p.name}</div>
                    <div className="text-xs text-gray-400 dark:text-forest-500">{p.municipality}, {p.state} · {p.area_ha.toLocaleString('pt-BR')} ha</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`text-sm font-mono font-bold ${
                      p.current_score >= 70 ? 'text-green-600 dark:text-green-400'
                      : p.current_score >= 50 ? 'text-amber-600 dark:text-amber-400'
                      : 'text-red-600 dark:text-red-400'
                    }`}>
                      {p.current_score}
                    </div>
                    <div className={`text-xs flex items-center justify-end gap-0.5 ${
                      delta >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {delta >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      {delta > 0 ? '+' : ''}{delta}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <div className="border-y border-gray-100 dark:border-forest-800 bg-gray-50 dark:bg-forest-900/30">
        <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatItem
            value={<><CountUp target={DASHBOARD_STATS.total_area_ha} duration={2500} /> ha</>}
            label="Área Monitorada"
          />
          <StatItem
            value={<><CountUp target={DASHBOARD_STATS.total_properties} /> fazendas</>}
            label="Cadastradas"
          />
          <StatItem
            value={<><CountUp target={DASHBOARD_STATS.critical_alerts} /> alertas</>}
            label="Críticos ativos"
            accent
          />
          <StatItem
            value={<><CountUp target={8} /> anos</>}
            label="Histórico temporal"
          />
        </div>
      </div>

      {/* ── Features ── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="mb-10">
          <h2 className="font-display font-bold text-2xl text-gray-900 dark:text-white mb-2">
            Por que o LandWatch?
          </h2>
          <p className="text-sm text-gray-500 dark:text-forest-400">
            Inteligência geoespacial aplicada à gestão agrícola.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          <FeatureCard
            icon={<Satellite size={18} />}
            title="Dados de Satélite Reais"
            desc="AlphaEarth Foundations analisa Sentinel-1, Sentinel-2, Landsat e dados climáticos em embeddings 64D de 10m de resolução."
          />
          <FeatureCard
            icon={<TrendingUp size={18} />}
            title="Histórico 2017–2024"
            desc="Acompanhe a trajetória de produtividade de cada talhão, detectando quedas antes que se tornem irreversíveis."
          />
          <FeatureCard
            icon={<AlertTriangle size={18} />}
            title="Recomendações por Bioma"
            desc="Receba orientações específicas por bioma — Cerrado, Amazônia, Pantanal — baseadas no histórico real da sua terra."
          />
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 dark:border-forest-800 py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-green-600 flex items-center justify-center">
              <Sprout size={11} className="text-white" />
            </div>
            <span className="text-xs text-gray-400 dark:text-forest-500">LandWatch · MVP v1.0</span>
          </div>
          <p className="text-xs text-gray-400 dark:text-forest-600 max-w-md">
            "The AlphaEarth Foundations Satellite Embedding dataset is produced by Google and Google DeepMind." — CC-BY 4.0
          </p>
        </div>
      </footer>
    </div>
  );
}

function StatItem({ value, label, accent = false }: {
  value: React.ReactNode;
  label: string;
  accent?: boolean;
}) {
  return (
    <div>
      <div className={`font-display font-bold text-2xl stat-value ${
        accent ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'
      }`}>
        {value}
      </div>
      <div className="text-xs text-gray-500 dark:text-forest-400 mt-1">{label}</div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="border border-gray-200 dark:border-forest-700/40 rounded-xl p-5 hover:border-green-300 dark:hover:border-green-500/30 transition-colors bg-white dark:bg-transparent">
      <div className="text-green-600 dark:text-green-400 mb-4">{icon}</div>
      <h3 className="font-display font-semibold text-gray-900 dark:text-white text-sm mb-2">{title}</h3>
      <p className="text-xs text-gray-500 dark:text-forest-400 leading-relaxed">{desc}</p>
    </div>
  );
}
