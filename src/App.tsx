import React from 'react';
import { ProjectProvider, useProject } from './store/projectStore';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { EchoCopilotDrawer } from './components/layout/EchoCopilotDrawer';

// Views
import { DashboardView } from './components/views/DashboardView';
import { AIStudioView } from './components/views/AIStudioView';
import { OptimizerView } from './components/views/OptimizerView';
import { ValidationLabView } from './components/views/ValidationLabView';
import { DecisionMatrixView } from './components/views/DecisionMatrixView';
import { WhatIfSimulatorView } from './components/views/WhatIfSimulatorView';
import { ComparisonView } from './components/views/ComparisonView';
import { MaterialIntelligenceView } from './components/views/MaterialIntelligenceView';
import { LogisticsCarbonView } from './components/views/LogisticsCarbonView';
import { ComplianceCenterView } from './components/views/ComplianceCenterView';
import { SupplierEngineView } from './components/views/SupplierEngineView';
import { GlobalBenchmarkingView } from './components/views/GlobalBenchmarkingView';
import { ReportsView } from './components/views/ReportsView';
import { SettingsView } from './components/views/SettingsView';

const MainContent: React.FC = () => {
  const { activeNav } = useProject();

  const renderView = () => {
    switch (activeNav) {
      case 'dashboard':
        return <DashboardView />;
      case 'studio':
        return <AIStudioView />;
      case 'optimizer':
        return <OptimizerView />;
      case 'validation':
        return <ValidationLabView />;
      case 'matrix':
        return <DecisionMatrixView />;
      case 'whatif':
        return <WhatIfSimulatorView />;
      case 'comparison':
        return <ComparisonView />;
      case 'materials':
        return <MaterialIntelligenceView />;
      case 'logistics':
        return <LogisticsCarbonView />;
      case 'compliance':
        return <ComplianceCenterView />;
      case 'suppliers':
        return <SupplierEngineView />;
      case 'benchmarks':
        return <GlobalBenchmarkingView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 min-h-[calc(100vh-4rem)]">
      {renderView()}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ProjectProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <MainContent />
          <EchoCopilotDrawer />
        </div>
      </div>
    </ProjectProvider>
  );
};

export default App;
