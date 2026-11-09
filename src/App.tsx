import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { PWAInstallButton } from './components/common/PWAInstallButton';
import { OfflineIndicator } from './components/common/OfflineIndicator';

import { DashboardView } from './components/dashboard/DashboardView';
import { POSView } from './components/pos/POSView';
import { MenuProductionView } from './components/menu/MenuProductionView';
import { RecipesView } from './components/recipes/RecipesView';
import { InventoryView } from './components/inventory/InventoryView';
import { CashShiftsView } from './components/cash/CashShiftsView';
import { ExpensesView } from './components/expenses/ExpensesView';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';

const MainContent: React.FC = () => {
  const { currentView } = useApp();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'inicio':
        return <DashboardView />;
      case 'pos':
        return <POSView />;
      case 'menu':
        return <MenuProductionView />;
      case 'recetas':
        return <RecipesView />;
      case 'inventario':
        return <InventoryView />;
      case 'caja':
        return <CashShiftsView />;
      case 'gastos':
        return <ExpensesView />;
      case 'reportes':
        return <ReportsView />;
      case 'config':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
      {/* PWA Home Screen Install Banner */}
      <PWAInstallButton variant="banner" />

      {/* Top Application Header */}
      <Header />

      {/* Main Container with Sidebar + View content */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Dynamic View Content Area */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-full overflow-x-hidden">
          {renderCurrentView()}
        </main>
      </div>

      {/* Mobile Sticky Bottom Navigation */}
      <MobileNav />

      {/* Offline Status Float Indicator */}
      <OfflineIndicator />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
