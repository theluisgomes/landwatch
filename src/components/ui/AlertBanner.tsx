import { AlertTriangle, CheckCircle, Info, XCircle, X } from 'lucide-react';
import { Alert } from '../../lib/mockData';

interface AlertBannerProps {
  alerts: Alert[];
  onDismiss?: (id: string) => void;
}

const ALERT_CONFIG = {
  critical: {
    icon: XCircle,
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    iconColor: 'text-red-400',
    textColor: 'text-red-200',
    descColor: 'text-red-300/70',
    glow: 'shadow-[0_0_12px_rgba(239,68,68,0.15)]',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    iconColor: 'text-amber-400',
    textColor: 'text-amber-200',
    descColor: 'text-amber-300/70',
    glow: 'shadow-[0_0_12px_rgba(245,158,11,0.15)]',
  },
  info: {
    icon: Info,
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    iconColor: 'text-blue-400',
    textColor: 'text-blue-200',
    descColor: 'text-blue-300/70',
    glow: '',
  },
  ok: {
    icon: CheckCircle,
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    iconColor: 'text-green-400',
    textColor: 'text-green-200',
    descColor: 'text-green-300/70',
    glow: '',
  },
};

export function AlertBanner({ alerts, onDismiss }: AlertBannerProps) {
  if (alerts.length === 0) return null;

  // Sort: critical first, then warning, info, ok
  const sorted = [...alerts].sort((a, b) => {
    const order = { critical: 0, warning: 1, info: 2, ok: 3 };
    return order[a.level] - order[b.level];
  });

  return (
    <div className="space-y-2">
      {sorted.map((alert) => {
        const cfg = ALERT_CONFIG[alert.level];
        const Icon = cfg.icon;

        return (
          <div
            key={alert.id}
            className={`flex items-start gap-3 p-3 rounded-lg border ${cfg.bg} ${cfg.border} ${cfg.glow} transition-all duration-200`}
          >
            <Icon size={15} className={`${cfg.iconColor} flex-shrink-0 mt-0.5 ${alert.level === 'critical' ? 'animate-pulse' : ''}`} />
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-semibold ${cfg.textColor} leading-tight`}>{alert.title}</p>
              <p className={`text-xs ${cfg.descColor} mt-0.5 leading-relaxed`}>{alert.description}</p>
            </div>
            {onDismiss && alert.level !== 'critical' && (
              <button
                onClick={() => onDismiss(alert.id)}
                className="text-forest-500 hover:text-forest-300 transition-colors flex-shrink-0"
              >
                <X size={12} />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
