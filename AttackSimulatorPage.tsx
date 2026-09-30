import React, { useState } from 'react';
import {
  Zap,
  ShieldAlert,
  Sliders,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Eye,
  Flame,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { useQuantumSecurity } from '../../context/QuantumSecurityContext';
import { AttackType, AttackConfig } from '../../types/quantum';
import { QuantumBadge } from '../common/QuantumBadge';
import { MathFormula } from '../common/MathFormula';

export const AttackSimulatorPage: React.FC = () => {
  const {
    attackConfig,
    setAttackConfig,
    verifyCurrentSignature,
    lastVerificationResult,
    isProcessing,
    setActiveTab
  } = useQuantumSecurity();

  const [selectedAttackType, setSelectedAttackType] = useState<AttackType>(attackConfig.type);
  const [intensity, setIntensity] = useState<number>(attackConfig.intensity || 0.85);
  const [channelNoise, setChannelNoise] = useState<number>(attackConfig.channelNoise || 0.05);
  const [eavesdropBasis, setEavesdropBasis] = useState<'RANDOM' | 'MATCHED' | 'CONJUGATE'>(
    attackConfig.eavesdropBasis || 'RANDOM'
  );

  const attacksList: {
    type: AttackType;
    name: string;
    icon: React.ReactNode;
    severity: string;
    desc: string;
    quantumCollapseEffect: string;
  }[] = [
    {
      type: 'INTERCEPT_RESEND',
      name: 'Eve Intercept-Resend (Man-in-the-Middle)',
      icon: <Eye className="w-5 h-5 text-cyan-400" />,
      severity: 'CRITICAL',
      desc: 'Eve intercepts quantum fiber photons, measures them in a guessed basis, and resends the collapsed state. Measuring conjugate non-commuting bases induces a mandatory 25% error on intercepted qubits.',
      quantumCollapseEffect: 'Irreversible wave-function collapse into non-matching eigenstate. QBER > 11% triggers RULE_QBER_01.',
    },
    {
      type: 'FORGERY_ATTEMPT',
      name: 'Blind Signature Forgery Attempt',
      icon: <Zap className="w-5 h-5 text-rose-400" />,
      severity: 'CRITICAL',
      desc: 'Adversary fabricates quantum tokens without knowledge of Alice’s private basis announcements. Guessing probabilities are bounded by Holevo information.',
      quantumCollapseEffect: 'Adversary error rate reaches 25% to 50%, completely violating the deterministic statistical threshold.',
    },
    {
      type: 'IMPERSONATION',
      name: 'Quantum Identity Impersonation',
      icon: <Flame className="w-5 h-5 text-purple-400" />,
      severity: 'CRITICAL',
      desc: 'An unauthorized entity poses as Alice, generating random quantum tokens without pre-distributed entangled Bell pairs.',
      quantumCollapseEffect: 'Produces a random 50.0% QBER on orthogonal Pauli bases. Deterministic rule RULE_IMPERSONATION_01 halts transaction.',
    },
    {
      type: 'REPLAY_ATTACK',
      name: 'Quantum Replay Attack (Stale Nonce)',
      icon: <RotateCcw className="w-5 h-5 text-amber-400" />,
      severity: 'CRITICAL',
      desc: 'Adversary records previously accepted classical BSM bits and attempts to replay them for unauthorized verification.',
      quantumCollapseEffect: 'Quantum No-Cloning theorem dictates Bell pairs are consumed. Nonce freshness check triggers immediate lock.',
    },
    {
      type: 'REPUDIATION',
      name: 'Alice Signer Repudiation Attack',
      icon: <AlertTriangle className="w-5 h-5 text-teal-400" />,
      severity: 'CRITICAL',
      desc: 'Malicious Alice prepares orthogonal/inverted quantum states for Bob vs Charlie to create a contract dispute and deny her signature.',
      quantumCollapseEffect: 'Cross-verifier discrepancy |Q_Bob - Q_Charlie| exceeds 15%, exposing deliberate asymmetry.',
    },
    {
      type: 'CHANNEL_NOISE',
      name: 'Thermal Decoherence & Optical Fiber Noise',
      icon: <Radio className="w-5 h-5 text-blue-400" />,
      severity: 'ELEVATED',
      desc: 'Severe optical fiber attenuation, polarization dispersion, and thermal fluctuations causing depolarizing noise.',
      quantumCollapseEffect: 'Depolarizing channel ρ → (1-η)ρ + η(I/2) pushes error above calibration tolerance.',
    },
  ];

  const handleApplyAndSimulate = async () => {
    const selected = attacksList.find(a => a.type === selectedAttackType);
    const newConfig: AttackConfig = {
      type: selectedAttackType,
      name: selected ? selected.name : 'Custom Threat Simulation',
      intensity,
      channelNoise,
      eavesdropBasis,
      description: selected ? selected.desc : 'Custom adversary simulation configuration.',
    };

    setAttackConfig(newConfig);
    await verifyCurrentSignature(newConfig);
  };

  const resetToCleanChannel = async () => {
    const cleanConfig: AttackConfig = {
      type: 'NONE',
      name: 'Clean Quantum Channel',
      intensity: 0.0,
      channelNoise: 0.02,
      eavesdropBasis: 'RANDOM',
      description: 'Clean authenticated channel with low baseline fiber decoherence.',
    };
    setSelectedAttackType('NONE');
    setIntensity(0);
    setChannelNoise(0.02);
    setAttackConfig(cleanConfig);
    await verifyCurrentSignature(cleanConfig);
  };

  const result = lastVerificationResult;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-5 h-5 text-rose-400" />
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-rose-400">
              Adversary Attack Suite
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
            Cyber Threat & Quantum Eavesdropping Simulator
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl font-sans">
            Inject active quantum channel manipulation, signature forgery, replay attempts, and signer repudiation to observe immediate deterministic detection.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <QuantumBadge label="6 Attack Vectors" variant="rose" pulse />
          <QuantumBadge label="Real-Time State Collapse" variant="cyan" />
        </div>
      </div>

      {/* Main Interactive Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Attack Selector Grid */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
              1. Select Quantum Attack Vector
            </h2>
            <button
              onClick={resetToCleanChannel}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Clean Channel</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {attacksList.map(att => {
              const isSelected = selectedAttackType === att.type;
              return (
                <div
                  key={att.type}
                  onClick={() => setSelectedAttackType(att.type)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-rose-950/40 border-rose-500 shadow-lg shadow-rose-950/50 ring-1 ring-rose-500/50'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                        {att.icon}
                      </div>
                      <QuantumBadge label={att.severity} variant="rose" size="xs" />
                    </div>
                    <h3 className="font-mono font-bold text-white text-xs mb-1">
                      {att.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-sans line-clamp-3">
                      {att.desc}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-cyan-400">
                    Physics: {att.quantumCollapseEffect.slice(0, 38)}...
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Parameter Sliders & Execute Simulation */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel-glow p-6 rounded-2xl border border-rose-500/30 space-y-6">
            <h2 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              2. Tune Adversary Parameters
            </h2>

            {/* Slider 1: Attack Intensity / Tap Fraction */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Eve Tap Fraction / Intensity:</span>
                <span className="text-rose-400 font-bold">{(intensity * 100).toFixed(0)}% of Photons</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={intensity}
                onChange={e => setIntensity(parseFloat(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 font-mono block">
                Fraction of teleported tokens intercepted and measured by Eve.
              </span>
            </div>

            {/* Slider 2: Channel Decoherence */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Depolarizing Channel Noise η:</span>
                <span className="text-purple-400 font-bold">{(channelNoise * 100).toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={0.5}
                step={0.01}
                value={channelNoise}
                onChange={e => setChannelNoise(parseFloat(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 font-mono block">
                Thermal decoherence in optical fiber (Limit 11.0% QBER).
              </span>
            </div>

            {/* Eavesdropping Basis Mode */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 block">
                Eavesdropper Measurement Basis:
              </label>
              <select
                value={eavesdropBasis}
                onChange={e => setEavesdropBasis(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 font-mono text-xs text-white focus:outline-none focus:border-rose-400"
              >
                <option value="RANDOM">Random Conjugate Bases (Z vs X, 50% mismatch)</option>
                <option value="CONJUGATE">Opposite Conjugate Basis (100% mismatch)</option>
                <option value="MATCHED">Matched Basis (Breidbart Optimal Guess)</option>
              </select>
            </div>

            {/* Execute Button */}
            <div>
              <button
                onClick={handleApplyAndSimulate}
                disabled={isProcessing}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-mono font-bold text-xs sm:text-sm shadow-lg shadow-rose-950/80 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Collapsing Quantum Wavefunction...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Execute Threat Simulation Now</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Detection & Mitigation Output */}
      {result && (
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-xl border ${
                  result.threatEvaluation.threatDetected
                    ? 'bg-rose-950/80 border-rose-600 text-rose-400'
                    : 'bg-emerald-950/80 border-emerald-600 text-emerald-400'
                }`}
              >
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 block">
                  Simulated Attack Response & Verdict
                </span>
                <h3 className="text-lg font-bold font-mono text-white">
                  {result.threatEvaluation.verdict}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <QuantumBadge
                label={`QBER: ${(result.averageQBER * 100).toFixed(1)}%`}
                variant={result.averageQBER > 0.11 ? 'rose' : 'emerald'}
              />
              <QuantumBadge
                label={`Fidelity: ${(result.threatEvaluation.averageFidelity * 100).toFixed(1)}%`}
                variant="cyan"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="bg-[#050913] p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-slate-400 font-mono uppercase text-[10px] block">
                Detection Reasoning:
              </span>
              <p className="text-slate-200 leading-relaxed font-sans">
                {result.threatEvaluation.explanation}
              </p>
            </div>

            <div className="bg-[#050913] p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-slate-400 font-mono uppercase text-[10px] block">
                Deterministic Mitigation Triggered:
              </span>
              <p className="text-cyan-300 leading-relaxed font-sans">
                {result.threatEvaluation.recommendedMitigation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
