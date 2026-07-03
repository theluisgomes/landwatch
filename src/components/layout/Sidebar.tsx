import { Map, Bell, BarChart2, Layers, Settings, Sprout, ChevronLeft, ChevronRight } from 'lucide-react';
import { MOCK_PROPERTIES, STATUS_COLORS } from '../../lib/mockData';
import { useStore, openAnalysis, setView } from '../../lib/store';

export function Sidebar() {
  const { sidebarOpen, toggleSidebar, selectedProperty, selectedYear } = useStore();

  const criticalCount = MOCK_PROPERTIES.flatMap(p => p.alerts).filter(a => a.level === 'critical').length;

  return (
    <div
      className={`relative flex-shrink-0 transition-all duration-300 ease-in-out ${
        sidebarOpen ? 'w-64' : 'w-14'
      } h-full flex flex-col glass-light border-r border-forest-700/40`}
    >
      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-6 z-10 w-6 h-6 rounded-full glass border border-forest-600/40 flex items-center justify-center hover:border-green-500/50 transition-all"
      >
        {sidebarOpen ? <ChevronLeft size={12} className="text-forest-300" /> : <ChevronRight size={12} className="text-forest-300" />}
      </button>

      {/* Logo */}
      <div className={`flex items-center gap-3 p-4 border-b border-forest-700/40 ${sidebarOpen ? '' : 'justify-center'}`}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center flex-shrink-0">
          <Sprout size={16} className="text-white" />
        </div>
        {sidebarOpen && (
          <div>
            <div className="font-display font-bold text-white text-sm leading-tight">LandWatch</div>
            <div className="text-xs text-forest-400 font-mono">v1.0 · MVP</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <div className="flex flex-col gap-1 p-2 border-b border-forest-700/40">
        <NavItem Icon={Map} label="Mapa" active collapsed={!sidebarOpen} onClick={() => setView('dashboard')} />
        <NavItem
          Icon={Bell}
          label="Alertas"
          badge={criticalCount > 0 ? String(criticalCount) : undefined}
          collapsed={!sidebarOpen}
          onClick={() => alert("A Central de Alertas consolidada será disponibilizada na Fase 2 do MVP.")}
        />
        <NavItem Icon={BarChart2} label="Relatórios" collapsed={!sidebarOpen} onClick={() => setView('reports')} />
        <NavItem Icon={Layers} label="Camadas" collapsed={!sidebarOpen} onClick={() => alert("O gerenciador customizado de camadas do Google Earth Engine está em desenvolvimento para a próxima fase.")} />
      </div>

      {/* Properties list */}
      {sidebarOpen && (
        <div className="flex-1 overflow-y-auto p-2">
          <div className="text-xs text-forest-400 px-2 py-1.5 font-semibold uppercase tracking-wider">
            Propriedades Monitoradas
          </div>
          <div className="space-y-1">
            {MOCK_PROPERTIES.map((property) => {
              const yearData = property.scores.find(s => s.year === selectedYear) || property.scores[property.scores.length - 1];
              const score = yearData?.score ?? property.current_score;
              const colors = STATUS_COLORS[property.status];
              const isSelected = selectedProperty?.id === property.id;
              const hasAlert = property.alerts.some(a => a.level === 'critical' || a.level === 'warning');

              return (
                <button
                  key={property.id}
                  onClick={() => {
                    openAnalysis(property);
                    setView('dashboard');
                  }}
                  className={`w-full text-left rounded-lg p-2.5 transition-all duration-200 group ${
                    isSelected
                      ? 'bg-green-500/15 border border-green-500/30'
                      : 'hover:bg-forest-800/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: colors.stroke, boxShadow: isSelected ? `0 0 6px ${colors.stroke}` : 'none' }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-forest-100 truncate">{property.name}</span>
                        <span className={`text-xs font-mono font-bold ml-1 ${
                          score >= 70 ? 'text-green-400' : score >= 50 ? 'text-amber-400' : 'text-red-400'
                        }`}>{score}</span>
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-xs text-forest-500">{property.municipality}, {property.state}</span>
                        {hasAlert && (
                          <span className="text-xs text-red-400">●</span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className={`p-4 border-t border-forest-700/40 ${sidebarOpen ? '' : 'flex justify-center'}`}>
        {sidebarOpen ? (
          <div>
            <div className="text-xs text-forest-500 mb-1">Powered by</div>
            <div className="text-xs font-semibold text-forest-300">AlphaEarth Foundations</div>
            <div className="text-xs text-forest-500">Google DeepMind · CC-BY 4.0</div>
          </div>
        ) : (
          <Settings size={16} className="text-forest-500" />
        )}
      </div>
    </div>
  );
}

function NavItem({
  Icon,
  label,
  active = false,
  badge,
  collapsed,
  onClick,
}: {
  Icon: any;
  label: string;
  active?: boolean;
  badge?: string;
  collapsed: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg transition-all duration-200 relative ${
        active
          ? 'bg-green-500/15 text-green-400'
          : 'text-forest-400 hover:text-forest-200 hover:bg-forest-800/50'
      } ${collapsed ? 'justify-center' : ''}`}
    >
      <Icon size={16} className="flex-shrink-0" />
      {!collapsed && <span className="text-xs font-medium">{label}</span>}
      {badge && (
        <span className={`
          ${collapsed ? 'absolute -top-1 -right-1' : 'ml-auto'}
          bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center
        `}>
          {badge}
        </span>
      )}
      {active && !collapsed && (
        <div className="ml-auto w-1 h-4 rounded-full bg-green-400" />
      )}
    </button>
  );
}
