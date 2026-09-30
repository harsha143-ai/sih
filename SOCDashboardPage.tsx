import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Activity,
  Radio,
  Zap,
  RotateCcw,
  Cpu,
  Clock,
  ArrowRight,
  AlertTriangle,
  Play,
  Terminal,
  Lock
} from 'lucide-react';
import { useQuantumSecurity } from '../../context/QuantumSecurityContext';
import { MetricCard } from '../common/MetricCard';
import { QuantumBadge } from '../common/QuantumBadge';

export const SOCDashboardPage: React.FC = () => {
  const { metrics, auditLogs, setActiveTab, executeAttackPreset, isProcessing } = useQuantumSecurity();

  const isCritical = metrics.currentQBER > 0.11;
  const isElevated = metrics.currentQBER > 0.05 && metrics.currentQBER <= 0.11;

  const postureStatus = isCritical
    ? { label: 'CRITICAL / ATTACK CONTAINED', color: 'rose', bg: 'bg-rose-950/40 border-rose-500/50' }
    : isElevated
    ? { label: 'ELEVATED / CHANNEL DISTURBANCE', color: 'amber', bg: 'bg-amber-950/40 border-amber-500/50' }
    : { label: 'NOMINAL / OPTICAL COHERENCE', color: 'emerald', bg: 'bg-emerald-950/40 border-emerald-500/50' };

  return (
    <div className="space-y-10">
      {/* Header & Posture Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className="w-5 h-5 text-cyan-400" />
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400">
              Security Operations Center (SOC)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
            QDS Threat Monitoring & Telemetry Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl font-sans">
            Real-time physical layer threat monitoring, quantum channel noise accumulation, Bell entanglement visibility, and automated cryptographic containment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('simulator')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-600/40 text-rose-300 font-mono text-xs font-bold transition-all"
          >
            <Zap className="w-4 h-4 text-rose-400" />
            <span>Launch Attack Simulation</span>
          </button>
        </div>
      </div>

      {/* Main Status Posture Banner */}
      <div className={`p-6 rounded-2xl border ${postureStatus.bg} transition-all flex flex-col md:flex-row items-center justify-between gap-4`}>
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="p-3 rounded-2xl bg-[#060a14] border border-slate-800">
            {isCritical ? (
              <ShieldAlert className="w-8 h-8 text-rose-400 animate-pulse" />
            ) : (
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
            )}
          </div>
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                System Security Posture
              </span>
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold font-mono text-white tracking-tight">
              {postureStatus.label}
            </h2>
            <p className="text-xs text-slate-300 font-sans mt-0.5">
              Deterministic rule engine active • Zero AI/ML heuristics • Cryptographic non-repudiation enforced
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right font-mono">
            <span className="text-[10px] text-slate-500 uppercase block">System Health Score</span>
            <span className="text-2xl font-bold text-cyan-300">
              {metrics.averageSystemHealth.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Metric Gauges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* QBER Gauge */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-3">
          <div className="flex justify-between items-center text-xs font-mono text-slate-400">
            <span>LIVE CHANNEL QBER</span>
            <Radio className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white">
            {(metrics.currentQBER * 100).toFixed(2)}%
          </div>
          <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden flex border border-slate-800">
            <div
              className={`h-full transition-all duration-500 ${
                metrics.currentQBER > 0.11
                  ? 'bg-rose-500'
                  : metrics.currentQBER > 0.05
                  ? 'bg-amber-400'
                  : 'bg-emerald-400'
              }`}
              style={{ width: `${Math.min(100, (metrics.currentQBER / 0.25) * 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>0% Ideal</span>
            <span className="text-rose-400 font-bold">11% Cutoff</span>
            <span>25% MITM</span>
          </div>
        </div>

        {/* State Fidelity Meter */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-3">
          <div className="flex justify-between items-center text-xs font-mono text-slate-400">
            <span>STATE FIDELITY F</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white">
            {(metrics.currentFidelity * 100).toFixed(1)}%
          </div>
          <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden flex border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${Math.min(100, metrics.currentFidelity * 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>0% Noise</span>
            <span className="text-cyan-400">89% Min</span>
            <span className="text-emerald-400 font-bold">100% Pure</span>
          </div>
        </div>

        {/* Attacks Mitigated */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-3">
          <div className="flex justify-between items-center text-xs font-mono text-slate-400">
            <span>ATTACKS MITIGATED</span>
            <Lock className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white">
            {metrics.forgeriesBlocked + metrics.replayAttacksBlocked + metrics.channelAnomaliesDetected}
          </div>
          <div className="text-xs font-mono text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            100% Containment Rate
          </div>
          <div className="text-[10px] font-mono text-slate-500">
            Forgeries: {metrics.forgeriesBlocked} | Replays: {metrics.replayAttacksBlocked}
          </div>
        </div>

        {/* Signatures Processed */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-3">
          <div className="flex justify-between items-center text-xs font-mono text-slate-400">
            <span>VERIFICATION SESSIONS</span>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold font-mono text-white">
            {metrics.totalVerifications}
          </div>
          <div className="text-xs font-mono text-cyan-300">
            {metrics.legitimatePassed} Legitimate Accepted
          </div>
          <div className="text-[10px] font-mono text-slate-500">
            Dual-Verifier Bob & Charlie
          </div>
        </div>
      </div>

      {/* Incident Radar & Live Incident Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Threat Vector Breakdown */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            Deterministic Threat Interventions
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-white font-bold block">Signature Forgery Attempts</span>
                <span className="text-[10px] text-slate-500">Holevo Bound & Basis Nonce</span>
              </div>
              <span className="text-rose-400 font-bold text-sm">{metrics.forgeriesBlocked}</span>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-white font-bold block">Quantum Replay Attacks</span>
                <span className="text-[10px] text-slate-500">State Collapse Nonce Tracking</span>
              </div>
              <span className="text-purple-400 font-bold text-sm">{metrics.replayAttacksBlocked}</span>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-white font-bold block">Channel Manipulations (MITM)</span>
                <span className="text-[10px] text-slate-500">QBER &gt; 11% Cutoff Rule</span>
              </div>
              <span className="text-amber-400 font-bold text-sm">{metrics.channelAnomaliesDetected}</span>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-white font-bold block">Legitimate Signatures Verified</span>
                <span className="text-[10px] text-slate-500">Dual Symmetrization Pass</span>
              </div>
              <span className="text-emerald-400 font-bold text-sm">{metrics.legitimatePassed}</span>
            </div>
          </div>
        </div>

        {/* Live SOC Incident Audit Trail */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              Live SOC Cryptographic Event Stream
            </h3>
            <button
              onClick={() => setActiveTab('logs')}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Full Audit Trail</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {auditLogs.slice(0, 5).map(log => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-[#050913] border border-slate-800/80 font-mono text-xs space-y-1 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-[10px]">{log.timestamp}</span>
                    <QuantumBadge
                      label={log.verdict}
                      variant={log.severity === 'NORMAL' ? 'emerald' : 'rose'}
                      size="xs"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400">
                    QBER: {(log.qber * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="text-white font-semibold text-[11px]">
                  {log.messageSummary}
                </div>
                <p className="text-[10px] text-slate-400 line-clamp-1 font-sans">
                  {log.details}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
