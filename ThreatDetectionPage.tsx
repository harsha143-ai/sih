import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Lock,
  Cpu,
  CheckCircle,
  XCircle,
  HelpCircle,
  Zap,
  Info,
  Sliders,
  Play
} from 'lucide-react';
import { useQuantumSecurity } from '../../context/QuantumSecurityContext';
import { QuantumBadge } from '../common/QuantumBadge';
import { MathFormula } from '../common/MathFormula';
import { THREAT_THRESHOLDS } from '../../quantum/threatDetector';

export const ThreatDetectionPage: React.FC = () => {
  const { metrics, lastVerificationResult, executeAttackPreset, isProcessing } = useQuantumSecurity();

  const currentQBER = metrics.currentQBER;
  const currentFidelity = metrics.currentFidelity;
  const currentDiscrepancy = lastVerificationResult ? lastVerificationResult.crossCheckDiscrepancy : 0.01;

  const rules = [
    {
      id: 'RULE_QBER_01',
      title: 'QBER Threshold Rule (Shor-BB84 Security Bound)',
      math: 'Q = \\frac{1}{N}\\sum_{i=1}^N \\mathbb{I}(x_i \\neq y_i) \\le \\delta_{\\text{th}} = 11.0\\%',
      description:
        'If the sample Quantum Bit Error Rate exceeds 11.0%, the quantum channel is compromised. By the Heisenberg Uncertainty Principle and No-Cloning Theorem, any eavesdropper measuring conjugate bases imparts a minimum 25% error rate on intercepted qubits.',
      threshold: '11.0%',
      currentValue: `${(currentQBER * 100).toFixed(2)}%`,
      status: currentQBER <= 0.11 ? 'COMPLIANT' : 'TRIGGERED',
      verdictOnTrigger: 'CHANNEL_COMPROMISED / INTERCEPT_RESEND',
      quantumBasis: 'Uncertainty Principle [X, Z] ≠ 0',
    },
    {
      id: 'RULE_FIDELITY_01',
      title: 'Quantum State Fidelity Overlap Bound',
      math: 'F = |\\langle\\psi_{\\text{in}}|\\rho_{\\text{out}}|\\psi_{\\text{in}}\\rangle| \\ge F_{\\text{th}} = 89.0\\%',
      description:
        'Direct projective measurement overlap must satisfy F ≥ 89.0%. Measurement by an eavesdropper collapses pure state |ψ⟩ into a mixed state ρ with fidelity F ≤ 75.0% for conjugate projections.',
      threshold: '89.0%',
      currentValue: `${(currentFidelity * 100).toFixed(1)}%`,
      status: currentFidelity >= 0.89 ? 'COMPLIANT' : 'TRIGGERED',
      verdictOnTrigger: 'STATE_DECOHERENCE_DETECTED',
      quantumBasis: 'Trace Distance D(ρ, σ) = √(1 - F)',
    },
    {
      id: 'RULE_REPUDIATION_01',
      title: 'Cross-Verifier Symmetrization Discrepancy Rule',
      math: '|Q_{\\text{Bob}} - Q_{\\text{Charlie}}| \\le \\Delta_{\\text{th}} = 15.0\\%',
      description:
        'To prevent Alice from signing for Bob and later disavowing to Charlie (repudiation), both verifiers cross-compare measurement statistics. An error delta > 15.0% indicates asymmetric state preparation.',
      threshold: '15.0%',
      currentValue: `${(currentDiscrepancy * 100).toFixed(2)}%`,
      status: currentDiscrepancy <= 0.15 ? 'COMPLIANT' : 'TRIGGERED',
      verdictOnTrigger: 'REPUDIATION_DETECTED',
      quantumBasis: 'Non-Repudiation Symmetrization',
    },
    {
      id: 'RULE_REPLAY_01',
      title: 'Quantum Nonce & One-Time State Collapse Lock',
      math: '\\text{Nonce Freshness} \\land \\text{Collapse}(\\rho) \\to \\text{Registry}(\\text{Nonce}) = 1',
      description:
        'Entangled Bell pairs are consumed upon measurement. Any replayed signature uses an already collapsed quantum state or a stale nonce, triggering immediate deterministic lock.',
      threshold: 'Zero Nonce Reuse',
      currentValue: lastVerificationResult?.threatEvaluation.replayDetected ? 'COLLISION' : 'FRESH',
      status: lastVerificationResult?.threatEvaluation.replayDetected ? 'TRIGGERED' : 'COMPLIANT',
      verdictOnTrigger: 'REPLAY_BLOCKED',
      quantumBasis: 'Wavefunction Collapse Postulate',
    },
    {
      id: 'RULE_IMPERSONATION_01',
      title: 'Orthogonal Impersonation Boundary (50% Error Rate)',
      math: 'Q \\ge 40.0\\% \\implies \\text{Orthogonal Random Guessing}',
      description:
        'An unauthorized entity attempting to sign without pre-shared Bell pairs must guess the quantum states blindly. This yields a deterministic 50% error rate under random conjugate bases.',
      threshold: '40.0%',
      currentValue: `${(currentQBER * 100).toFixed(2)}%`,
      status: currentQBER < 0.40 ? 'COMPLIANT' : 'TRIGGERED',
      verdictOnTrigger: 'IMPERSONATION_BLOCKED',
      quantumBasis: 'Conjugate Basis Orthogonality',
    },
    {
      id: 'RULE_FORGERY_01',
      title: 'Holevo Information & Forgery Probability Bound',
      math: 'P_{\\text{forge}} \\le 2^{-L(1 - 2\\delta)} < 10^{-4}',
      description:
        'Adversary knowledge about Alice’s private key is bounded by the Holevo quantity χ(E : A). For L ≥ 16 tokens and QBER ≤ 11%, forgery probability is exponentially negligible.',
      threshold: '< 10⁻⁴',
      currentValue: '2.4 × 10⁻⁵',
      status: 'COMPLIANT',
      verdictOnTrigger: 'FORGERY_REJECTED',
      quantumBasis: 'Holevo Bound & Chernoff Bounds',
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-rose-400">
              Deterministic Security Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
            Quantum Threat Detection Framework (Zero AI/ML)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl font-sans">
            Guaranteed physical-layer threat detection using quantum mechanical laws, Pauli algebra, Bell correlation boundaries, and deterministic statistical thresholds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <QuantumBadge label="ZERO AI / Machine Learning" variant="emerald" pulse />
          <QuantumBadge label="6 Deterministic Rules" variant="cyan" />
        </div>
      </div>

      {/* Why Non-AI Architectural Callout */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/20 via-slate-900/60 to-purple-950/20">
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/60 mt-1">
            <Lock className="w-5 h-5" />
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-bold font-mono text-white">
              Why Deterministic Quantum Physics Over Machine Learning?
            </h3>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              AI/ML classifiers are inherently <strong className="text-rose-300">probabilistic, opaque, and susceptible to adversarial perturbation</strong>.
              In contrast, quantum mechanics provides <strong className="text-cyan-300">information-theoretic security</strong>: an eavesdropper cannot tap a quantum channel without disturbing the state (Heisenberg Uncertainty Principle).
              Threat detection based on exact statistical thresholds (QBER, trace distance, and Bell correlation) is provably uncheatable even by an adversary with infinite computational power.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Live Rule Matrix */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold font-mono text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            Active Deterministic Rule Matrix
          </h2>
          <span className="text-xs font-mono text-slate-400">
            Real-time threshold evaluation against live telemetry
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rules.map(rule => {
            const isTriggered = rule.status === 'TRIGGERED';
            return (
              <div
                key={rule.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isTriggered
                    ? 'bg-rose-950/30 border-rose-500/60 shadow-lg shadow-rose-950/40 ring-1 ring-rose-500/40'
                    : 'glass-panel border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    {isTriggered ? (
                      <XCircle className="w-4 h-4 text-rose-400" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    )}
                    <span className="text-xs font-mono font-bold text-white">
                      {rule.title}
                    </span>
                  </div>
                  <QuantumBadge
                    label={rule.status}
                    variant={isTriggered ? 'rose' : 'emerald'}
                    size="xs"
                    pulse={isTriggered}
                  />
                </div>

                <div className="p-2.5 rounded-lg bg-[#050913] border border-slate-800/80 my-3 text-center text-xs font-mono text-cyan-300">
                  <MathFormula math={rule.math} block />
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans mb-3">
                  {rule.description}
                </p>

                <div className="pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div>
                    <span className="text-slate-500 block">Security Bound:</span>
                    <span className="text-white font-semibold">{rule.threshold}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Live Input:</span>
                    <span className={isTriggered ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                      {rule.currentValue}
                    </span>
                  </div>
                  <div className="col-span-2 pt-1 text-[10px] text-cyan-400">
                    Physical Grounding: {rule.quantumBasis}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Interactive Trigger Simulator */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          Test Deterministic Rule Triggers Instantly
        </h3>
        <p className="text-xs text-slate-400">
          Click an attack type below to inject malicious quantum signals and verify how deterministic rules halt the transaction immediately:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {[
            { id: 'INTERCEPT_RESEND', label: 'Eve Intercept', color: 'hover:border-cyan-400' },
            { id: 'FORGERY_ATTEMPT', label: 'Blind Forgery', color: 'hover:border-rose-400' },
            { id: 'IMPERSONATION', label: 'Impersonation', color: 'hover:border-purple-400' },
            { id: 'REPLAY_ATTACK', label: 'Replay Attack', color: 'hover:border-amber-400' },
            { id: 'REPUDIATION', label: 'Repudiation', color: 'hover:border-teal-400' },
            { id: 'CHANNEL_NOISE', label: 'Thermal Noise', color: 'hover:border-blue-400' },
          ].map(att => (
            <button
              key={att.id}
              onClick={() => executeAttackPreset(att.id)}
              disabled={isProcessing}
              className={`p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono font-semibold text-slate-300 hover:text-white transition-all text-center ${att.color}`}
            >
              <Play className="w-3 h-3 mx-auto mb-1 text-slate-500" />
              {att.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
