import { useEffect, useRef, useState } from 'react';
import { PropertyData } from '../../lib/mockData';
import { useStore } from '../../lib/store';

interface ProductivityScoreProps {
  property: PropertyData;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_CONFIG = {
  sm: { svgSize: 80, radius: 30, strokeWidth: 5, fontSize: '1rem', labelSize: '0.6rem' },
  md: { svgSize: 120, radius: 46, strokeWidth: 7, fontSize: '1.5rem', labelSize: '0.7rem' },
  lg: { svgSize: 160, radius: 62, strokeWidth: 9, fontSize: '2rem', labelSize: '0.8rem' },
};

function getScoreColor(score: number) {
  if (score >= 70) return { stroke: '#22c55e', glow: 'rgba(34,197,94,0.4)', label: 'Produtivo', bg: 'rgba(34,197,94,0.1)' };
  if (score >= 50) return { stroke: '#f59e0b', glow: 'rgba(245,158,11,0.4)', label: 'Em queda', bg: 'rgba(245,158,11,0.1)' };
  if (score >= 35) return { stroke: '#60a5fa', glow: 'rgba(96,165,250,0.4)', label: 'Recuperando', bg: 'rgba(96,165,250,0.1)' };
  return { stroke: '#ef4444', glow: 'rgba(239,68,68,0.4)', label: 'Degradado', bg: 'rgba(239,68,68,0.1)' };
}

export function ProductivityScore({ property, size = 'md' }: ProductivityScoreProps) {
  const { selectedYear } = useStore();
  const [displayScore, setDisplayScore] = useState(0);
  const [animated, setAnimated] = useState(false);
  const cfg = SIZE_CONFIG[size];

  const yearData = property.scores.find(s => s.year === selectedYear) || property.scores[property.scores.length - 1];
  const score = yearData?.score ?? property.current_score;
  const colors = getScoreColor(score);

  const circumference = 2 * Math.PI * cfg.radius;
  // Arc: 270 degrees (from -135deg to +135deg)
  const arcLength = circumference * 0.75;
  const offset = arcLength - (score / 100) * arcLength;

  const center = cfg.svgSize / 2;

  // Animate score number
  useEffect(() => {
    setDisplayScore(0);
    setAnimated(false);
    const duration = 1200;
    const steps = 60;
    const increment = score / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), score);
      setDisplayScore(current);
      if (step >= steps) {
        clearInterval(timer);
        setAnimated(true);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score, selectedYear]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: cfg.svgSize, height: cfg.svgSize }}>
        <svg
          width={cfg.svgSize}
          height={cfg.svgSize}
          viewBox={`0 0 ${cfg.svgSize} ${cfg.svgSize}`}
        >
          {/* Drop shadow filter */}
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Background track */}
          <circle
            cx={center}
            cy={center}
            r={cfg.radius}
            fill="none"
            stroke="rgba(27,67,50,0.8)"
            strokeWidth={cfg.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={0}
            transform={`rotate(135 ${center} ${center})`}
          />

          {/* Score arc */}
          <circle
            cx={center}
            cy={center}
            r={cfg.radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={cfg.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={offset}
            transform={`rotate(135 ${center} ${center})`}
            filter="url(#glow)"
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />

          {/* Center score */}
          <text
            x={center}
            y={center - 4}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontFamily="Space Grotesk, sans-serif"
            fontWeight="700"
            fontSize={cfg.fontSize}
          >
            {displayScore}
          </text>

          {/* /100 */}
          <text
            x={center}
            y={center + parseInt(cfg.fontSize) * 0.9 + 2}
            textAnchor="middle"
            fill="rgba(180,220,200,0.6)"
            fontFamily="Inter, sans-serif"
            fontWeight="400"
            fontSize={cfg.labelSize}
          >
            / 100
          </text>
        </svg>
      </div>

      {/* Status badge */}
      <span
        className="px-3 py-0.5 rounded-full text-xs font-semibold"
        style={{ background: colors.bg, color: colors.stroke, border: `1px solid ${colors.stroke}40` }}
      >
        {colors.label}
      </span>
    </div>
  );
}
