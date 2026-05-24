import { useState, useEffect } from 'react';
import { DashboardLayout, type TabKey } from './components/layout/DashboardLayout';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { MachinePage } from './features/machine/MachinePage';
import { TechniciansPage } from './features/technicians/TechniciansPage';
import { HistoryPage } from './features/history/HistoryPage';
import { ReportsPage } from './features/reports/ReportsPage';
import { SettingsPage } from './features/settings/SettingsPage';
import { LoginPage } from './features/auth/LoginPage';
import { useStore } from './store/useStore';

function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const { fetchData, isAuthenticated } = useStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [fetchData, isAuthenticated]);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'machine':
        return <MachinePage />;
      case 'technicians':
        return <TechniciansPage />;
      case 'history':
        return <HistoryPage />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
}

export default App;
