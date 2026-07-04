import { Recommendation } from '../../lib/mockData';

interface RecoveryRecommendationsProps {
  recommendations: Recommendation[];
}

const CATEGORY_ICONS: Record<string, string> = {
  recuperação: '🌱',
  manejo: '🔧',
  irrigação: '💧',
  reflorestamento: '🌳',
  rotação: '🔄',
};

const PRIORITY_CONFIG = {
  high: { label: 'Urgente', color: 'text-red-400', badge: 'bg-red-400/10 border-red-400/30 text-red-400' },
  medium: { label: 'Importante', color: 'text-amber-400', badge: 'bg-amber-400/10 border-amber-400/30 text-amber-400' },
  low: { label: 'Oportunidade', color: 'text-blue-400', badge: 'bg-blue-400/10 border-blue-400/30 text-blue-400' },
};

export function RecoveryRecommendations({ recommendations }: RecoveryRecommendationsProps) {
  if (recommendations.length === 0) {
    return (
      <div className="text-center py-6">
        <div className="text-3xl mb-2">✅</div>
        <p className="text-sm text-forest-400">Nenhuma recomendação crítica</p>
        <p className="text-xs text-forest-500">Propriedade em boas condições</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {recommendations.map((rec, idx) => {
        const priority = PRIORITY_CONFIG[rec.priority];
        const icon = CATEGORY_ICONS[rec.category] || '📋';

        return (
          <div
            key={rec.id}
            className="rounded-lg border border-forest-700/50 bg-forest-900/50 p-3 hover:border-forest-600/50 transition-all duration-200"
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            <div className="flex items-start gap-3">
              <div className="text-xl mt-0.5 flex-shrink-0">{icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-semibold text-forest-100">{rec.title}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full border font-medium flex-shrink-0 ${priority.badge}`}>
                    {priority.label}
                  </span>
                </div>
                <p className="text-xs text-forest-400 leading-relaxed mb-2">
                  {rec.description}
                </p>
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-forest-500">Impacto estimado:</span>
                  <span className="text-green-400 font-medium">{rec.estimated_impact}</span>
                </div>
                {rec.traits && (
                  <div className="mt-2 pt-1.5 border-t border-forest-800/60 grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10px]">
                    {rec.traits.scientificName && (
                      <div className="col-span-2 text-forest-300">
                        <span className="text-forest-500 font-semibold">Espécie:</span> <span className="italic">{rec.traits.scientificName}</span>
                      </div>
                    )}
                    {rec.traits.rootDepth && (
                      <div className="text-forest-400">
                        <span className="text-forest-500 font-semibold">Raízes:</span> {rec.traits.rootDepth}
                      </div>
                    )}
                    {rec.traits.waterNeeds && (
                      <div className="text-forest-400">
                        <span className="text-forest-500 font-semibold">Demanda Hídrica:</span> {rec.traits.waterNeeds === 'low' ? 'Baixa' : rec.traits.waterNeeds === 'medium' ? 'Média' : 'Alta'}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
