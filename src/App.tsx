import { useStore } from './lib/store';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ReportsPage } from './pages/ReportsPage';

export default function App() {
  const { currentView, theme } = useStore();

  return (
    <div className={theme}>
      {currentView === 'reports' && <ReportsPage />}
      {(currentView === 'dashboard' || currentView === 'analysis') && <DashboardPage />}
      {currentView === 'landing' && <LandingPage />}
    </div>
  );
}
