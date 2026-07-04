import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Dot,
} from 'recharts';
import { PropertyData } from '../../lib/mockData';
import { useStore } from '../../lib/store';

interface TemporalChartProps {
  property: PropertyData;
}

const CustomTooltip = ({ active, payload, label, selectedIndex }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const score = data.score;
    let color = '#22c55e';
    if (score < 50) color = '#ef4444';
    else if (score < 70) color = '#f59e0b';

    const activeIndexVal = selectedIndex === 'osavi' ? data.osavi_proxy : data.ndvi_proxy;
    const activeIndexName = selectedIndex === 'score' ? 'NDVI' : selectedIndex.toUpperCase();

    return (
      <div className="glass rounded-lg p-3 text-xs min-w-[170px]">
        <div className="font-semibold text-forest-100 mb-1">{label}</div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ background: color }} />
          <span className="text-forest-300">Score:</span>
          <span className="text-white font-bold">{score}</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-blue-400" />
          <span className="text-forest-300">{activeIndexName}:</span>
          <span className="text-blue-300 font-mono">{activeIndexVal.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="text-forest-300">Umidade Solo:</span>
          <span className="text-cyan-300 font-mono">{data.soil_moisture.toFixed(2)}</span>
        </div>
        <div className="text-forest-400 mt-1 italic">{data.label}</div>
      </div>
    );
  }
  return null;
};

const CustomDot = ({ cx, cy, payload, selectedYear }: any) => {
  if (payload.year === selectedYear) {
    return (
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill="#22c55e"
        stroke="#0a1a0f"
        strokeWidth={2}
        style={{ filter: 'drop-shadow(0 0 6px rgba(34,197,94,0.8))' }}
      />
    );
  }
  return (
    <circle
      cx={cx}
      cy={cy}
      r={3}
      fill="rgba(116, 198, 157, 0.6)"
      stroke="#1b4332"
      strokeWidth={1}
    />
  );
};

export function TemporalChart({ property }: TemporalChartProps) {
  const { selectedYear, setYear, selectedIndex } = useStore();
  
  const chartData = property.scores.map(s => ({
    ...s,
    ndvi_scaled: s.ndvi_proxy * 100,
    osavi_scaled: s.osavi_proxy * 100,
    soil_moisture_scaled: s.soil_moisture * 100,
  }));

  // Score categories for background zones
  const minScore = Math.min(...property.scores.map(d => d.score));
  const maxScore = Math.max(...property.scores.map(d => d.score));
  const trend = property.scores[property.scores.length - 1].score - property.scores[0].score;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-sm font-semibold text-forest-100">Histórico de Produtividade</h4>
          <p className="text-xs text-forest-400">AlphaEarth Foundations · 2017–2024</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-mono px-2 py-0.5 rounded ${
            trend >= 0 
              ? 'text-green-400 bg-green-400/10 border border-green-400/20' 
              : 'text-red-400 bg-red-400/10 border border-red-400/20'
          }`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)} pts
          </span>
          <span className="text-xs text-forest-400">vs 2017</span>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          onClick={(e) => {
            if (e && e.activePayload && e.activePayload[0]) {
              setYear(e.activePayload[0].payload.year);
            }
          }}
        >
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="ndviGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="soilMoistureGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(45, 106, 79, 0.3)"
            vertical={false}
          />

          <XAxis
            dataKey="year"
            tick={{ fill: '#74c69d', fontSize: 11, fontFamily: 'JetBrains Mono' }}
            axisLine={{ stroke: 'rgba(45,106,79,0.4)' }}
            tickLine={false}
          />

          <YAxis
            domain={[0, 100]}
            tick={{ fill: '#74c69d', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            ticks={[0, 30, 50, 70, 100]}
          />

          <Tooltip content={<CustomTooltip selectedIndex={selectedIndex} />} />

          {/* Risk threshold lines */}
          <ReferenceLine y={70} stroke="rgba(34,197,94,0.4)" strokeDasharray="4 4" />
          <ReferenceLine y={50} stroke="rgba(245,158,11,0.3)" strokeDasharray="4 4" />
          <ReferenceLine y={35} stroke="rgba(239,68,68,0.3)" strokeDasharray="4 4" />

          {/* Selected year vertical line */}
          <ReferenceLine
            x={selectedYear}
            stroke="rgba(255,255,255,0.3)"
            strokeDasharray="3 3"
          />

          {/* Selected vegetation proxy area */}
          <Area
            type="monotone"
            dataKey={selectedIndex === 'osavi' ? 'osavi_scaled' : 'ndvi_scaled'}
            stroke="#60a5fa"
            strokeWidth={1}
            fill="url(#ndviGradient)"
            strokeDasharray="3 3"
            dot={false}
            name={selectedIndex === 'score' ? 'NDVI' : selectedIndex.toUpperCase()}
            yAxisId={0}
          />

          {/* Soil Moisture proxy area */}
          <Area
            type="monotone"
            dataKey="soil_moisture_scaled"
            stroke="#22d3ee"
            strokeWidth={1}
            fill="url(#soilMoistureGradient)"
            strokeDasharray="4 4"
            dot={false}
            name="Umidade do Solo"
            yAxisId={0}
          />

          {/* Score area */}
          <Area
            type="monotone"
            dataKey="score"
            stroke="#22c55e"
            strokeWidth={2.5}
            fill="url(#scoreGradient)"
            dot={(props: any) => <CustomDot {...props} selectedYear={selectedYear} />}
            activeDot={{ r: 6, fill: '#22c55e', stroke: '#0a1a0f', strokeWidth: 2 }}
            name="Score"
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Year selector */}
      <div className="mt-2 flex items-center gap-1 justify-center">
        {chartData.map((d) => (
          <button
            key={d.year}
            onClick={() => setYear(d.year)}
            className={`text-xs px-2 py-0.5 rounded transition-all ${
              d.year === selectedYear
                ? 'bg-green-500/20 text-green-400 border border-green-500/40 font-bold'
                : 'text-forest-500 hover:text-forest-300 hover:bg-forest-800/30'
            }`}
          >
            {d.year}
          </button>
        ))}
      </div>
    </div>
  );
}
