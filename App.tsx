import React from 'react';
import { QuantumSecurityProvider, useQuantumSecurity } from './context/QuantumSecurityContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { ArchitecturePage } from './components/architecture/ArchitecturePage';
import { QuantumLabPage } from './components/lab/QuantumLabPage';
import { SignatureGenPage } from './components/signature/SignatureGenPage';
import { VerificationPage } from './components/verification/VerificationPage';
import { ThreatDetectionPage } from './components/threats/ThreatDetectionPage';
import { AttackSimulatorPage } from './components/simulator/AttackSimulatorPage';
import { StatisticalAnalyticsPage } from './components/analytics/StatisticalAnalyticsPage';
import { SOCDashboardPage } from './components/dashboard/SOCDashboardPage';
import { EventLogsPage } from './components/logs/EventLogsPage';
import { MathModelPage } from './components/math/MathModelPage';
import { SecurityAnalysisPage } from './components/security/SecurityAnalysisPage';
import { DocumentationPage } from './components/docs/DocumentationPage';

const AppContent: React.FC = () => {
  const { activeTab } = useQuantumSecurity();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage />;
      case 'architecture':
        return <ArchitecturePage />;
      case 'lab':
        return <QuantumLabPage />;
      case 'signature':
        return <SignatureGenPage />;
      case 'verification':
        return <VerificationPage />;
      case 'threats':
        return <ThreatDetectionPage />;
      case 'simulator':
        return <AttackSimulatorPage />;
      case 'analytics':
        return <StatisticalAnalyticsPage />;
      case 'dashboard':
        return <SOCDashboardPage />;
      case 'logs':
        return <EventLogsPage />;
      case 'math':
        return <MathModelPage />;
      case 'security':
        return <SecurityAnalysisPage />;
      case 'docs':
        return <DocumentationPage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {renderActiveTab()}
      </main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <QuantumSecurityProvider>
      <AppContent />
    </QuantumSecurityProvider>
  );
};

export default App;
