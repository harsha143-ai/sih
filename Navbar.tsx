import React, { useState } from 'react';
import {
  ShieldAlert,
  Activity,
  Layers,
  Cpu,
  FileSignature,
  CheckCircle2,
  AlertTriangle,
  Zap,
  BarChart3,
  Terminal,
  Calculator,
  Lock,
  BookOpen,
  Menu,
  X,
  Play
} from 'lucide-react';
import { useQuantumSecurity, TabType } from '../../context/QuantumSecurityContext';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, metrics, executeAttackPreset, isProcessing } = useQuantumSecurity();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: TabType; label: string; icon: React.ReactNode; category: string }[] = [
    { id: 'landing', label: 'Overview', icon: <Activity className="w-4 h-4" />, category: 'Core' },
    { id: 'dashboard', label: 'SOC Dashboard', icon: <ShieldAlert className="w-4 h-4" />, category: 'Core' },
    { id: 'architecture', label: 'Architecture', icon: <Layers className="w-4 h-4" />, category: 'Core' },
    { id: 'lab', label: 'Quantum Lab', icon: <Cpu className="w-4 h-4" />, category: 'Quantum' },
    { id: 'signature', label: 'Signature Gen', icon: <FileSignature className="w-4 h-4" />, category: 'Protocol' },
    { id: 'verification', label: 'Verification', icon: <CheckCircle2 className="w-4 h-4" />, category: 'Protocol' },
    { id: 'threats', label: 'Threat Engine', icon: <AlertTriangle className="w-4 h-4" />, category: 'Security' },
    { id: 'simulator', label: 'Attack Simulator', icon: <Zap className="w-4 h-4" />, category: 'Security' },
    { id: 'analytics', label: 'Statistics', icon: <BarChart3 className="w-4 h-4" />, category: 'Security' },
    { id: 'logs', label: 'Audit Logs', icon: <Terminal className="w-4 h-4" />, category: 'Telemetry' },
    { id: 'math', label: 'Math Model', icon: <Calculator className="w-4 h-4" />, category: 'Theory' },
    { id: 'security', label: 'Security Analysis', icon: <Lock className="w-4 h-4" />, category: 'Theory' },
    { id: 'docs', label: 'Documentation', icon: <BookOpen className="w-4 h-4" />, category: 'Theory' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-cyan-900/30 bg-[#070b14]/90 backdrop-blur-xl">
      {/* Top Telemetry Ticker & Disclaimer */}
      <div className="w-full bg-[#0a101f] border-b border-slate-800/80 px-4 py-1 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-3 overflow-x-auto py-0.5 no-scrollbar">
          <span className="flex items-center gap-1.5 text-cyan-400 font-semibold uppercase tracking-wider">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
            EPR Bell Source: Active
          </span>
          <span className="text-slate-600">|</span>
          <span>
            QBER: <strong className={metrics.currentQBER > 0.11 ? 'text-rose-400' : 'text-emerald-400'}>
              {(metrics.currentQBER * 100).toFixed(2)}%
            </strong> (Limit 11.0%)
          </span>
          <span className="text-slate-600">|</span>
          <span>
            Fidelity: <strong className="text-cyan-300">{(metrics.currentFidelity * 100).toFixed(1)}%</strong>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-purple-300">
            Engine: Deterministic Non-AI
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-700/40 text-[10px] uppercase font-semibold tracking-wider">
            Quantum-Inspired Simulation / QDS Security Prototype
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-cyan-500/40 group-hover:border-cyan-400 transition-all shadow-lg shadow-cyan-950/50">
              <Cpu className="w-6 h-6 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#070b14]"></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-wider text-white font-mono">
                  QUANTUM<span className="text-cyan-400">GUARD</span>
                </span>
                <span className="hidden md:inline-block px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-widest bg-cyan-900/40 text-cyan-300 border border-cyan-800/60 rounded">
                  QDS-Teleport
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono hidden sm:block">
                Information-Theoretic Threat Detection Engine
              </p>
            </div>
          </div>

          {/* Desktop Nav Items (Curated Main) */}
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto max-w-2xl px-2 py-1">
            {navItems.slice(0, 9).map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action Button & More Menu */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('simulator')}
              disabled={isProcessing}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold text-rose-200 bg-rose-950/60 hover:bg-rose-900/60 border border-rose-600/40 shadow-lg shadow-rose-950/40 transition-all hover:scale-105 active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>Simulate Attack</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-800/60 text-slate-300 hover:text-white border border-slate-700/60"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Secondary desktop navigation pill bar for remaining modules */}
      <div className="hidden lg:flex items-center justify-between border-t border-slate-800/60 bg-[#060a12]/80 px-8 py-1.5 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-4">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Specialized Modules:</span>
          {navItems.slice(9).map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1 hover:text-cyan-300 transition-colors ${
                  isActive ? 'text-cyan-400 font-bold underline underline-offset-4 decoration-cyan-500' : ''
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-slate-500">Quick Test:</span>
          <button
            onClick={() => executeAttackPreset('INTERCEPT_RESEND')}
            className="hover:text-amber-300 transition-colors flex items-center gap-1"
          >
            <Play className="w-2.5 h-2.5" /> Eve Intercept
          </button>
          <span className="text-slate-700">·</span>
          <button
            onClick={() => executeAttackPreset('FORGERY_ATTEMPT')}
            className="hover:text-rose-300 transition-colors flex items-center gap-1"
          >
            <Play className="w-2.5 h-2.5" /> Forgery
          </button>
          <span className="text-slate-700">·</span>
          <button
            onClick={() => executeAttackPreset('REPLAY_ATTACK')}
            className="hover:text-purple-300 transition-colors flex items-center gap-1"
          >
            <Play className="w-2.5 h-2.5" /> Replay
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-[#070b14]/95 backdrop-blur-2xl px-4 py-4 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-mono text-left transition-all ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
