import React, { useState } from 'react';
import {
  Calculator,
  BookOpen,
  Sliders,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';
import { QuantumBadge } from '../common/QuantumBadge';
import { MathFormula } from '../common/MathFormula';
import { calculateTheoreticalForgeryProbability } from '../../quantum/math';

export const MathModelPage: React.FC = () => {
  const [sandboxL, setSandboxL] = useState<number>(32);
  const [sandboxDelta, setSandboxDelta] = useState<number>(0.11);
  const [sandboxNoise, setSandboxNoise] = useState<number>(0.04);

  const sandboxForgeryProb = calculateTheoreticalForgeryProbability(sandboxL, sandboxDelta);
  const sandboxDetectionRate = 1 - Math.pow(1 - 0.25 * 0.85, sandboxL);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calculator className="w-5 h-5 text-indigo-400" />
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-indigo-400">
              Theoretical Foundation
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
            Formal Mathematical Model & Derivations
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl font-sans">
            Rigorous mathematical derivations of teleportation algebra, Pauli correction operators, Kraus channel representations, and information-theoretic security bounds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <QuantumBadge label="Hilbert Space ℋ₂⊗ℋ₂" variant="cyan" />
          <QuantumBadge label="Kraus Noise Operators" variant="purple" />
          <QuantumBadge label="Holevo Information Bound" variant="emerald" />
        </div>
      </div>

      {/* Interactive Formula Sandbox */}
      <div className="glass-panel-glow p-6 sm:p-8 rounded-2xl border border-indigo-500/30 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold font-mono text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Interactive Cryptographic Formula Sandbox
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Dynamically compute exact analytical bounds for signature length and QBER cutoff.
            </p>
          </div>
          <QuantumBadge label="Live Analytical Solver" variant="cyan" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Signature Length L:</span>
              <span className="text-cyan-400 font-bold">{sandboxL} Qubits</span>
            </div>
            <input
              type="range"
              min={8}
              max={64}
              step={4}
              value={sandboxL}
              onChange={e => setSandboxL(parseInt(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">QBER Security Cutoff δ_th:</span>
              <span className="text-purple-400 font-bold">{(sandboxDelta * 100).toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min={0.05}
              max={0.20}
              step={0.01}
              value={sandboxDelta}
              onChange={e => setSandboxDelta(parseFloat(e.target.value))}
              className="w-full accent-purple-400 cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Depolarizing Channel Noise p:</span>
              <span className="text-emerald-400 font-bold">{(sandboxNoise * 100).toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min={0.01}
              max={0.15}
              step={0.01}
              value={sandboxNoise}
              onChange={e => setSandboxNoise(parseFloat(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Calculated Result Output Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#050913] p-4 rounded-xl border border-slate-800 font-mono text-xs">
          <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
            <span className="text-slate-500 uppercase text-[10px] block mb-1">
              Exact Forgery Probability P_forge ≤ 2^(-L(1-2δ))
            </span>
            <span className="text-lg font-bold text-emerald-400">
              {sandboxForgeryProb < 1e-4 ? sandboxForgeryProb.toExponential(3) : sandboxForgeryProb.toFixed(5)}
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">
              Information-theoretically secure against all possible quantum algorithms.
            </span>
          </div>

          <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
            <span className="text-slate-500 uppercase text-[10px] block mb-1">
              Adversary Detection Probability (η = 85%)
            </span>
            <span className="text-lg font-bold text-cyan-300">
              {(sandboxDetectionRate * 100).toFixed(4)}%
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">
              Probability that Eve will trigger an error exceeding 11% QBER.
            </span>
          </div>
        </div>
      </div>

      {/* Formal Derivations Cards */}
      <div className="space-y-6">
        {/* Derivation 1: Quantum Teleportation Algebraic Identity */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold font-mono text-white">
              1. Full Quantum Teleportation Algebraic Derivation
            </h3>
          </div>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            Let the input state be <MathFormula math="|\psi\rangle_1 = \alpha|0\rangle + \beta|1\rangle" />, and let the pre-shared Bell state between Alice (qubit 2) and Bob (qubit 3) be <MathFormula math="|\Phi^+\rangle_{23} = \frac{1}{\sqrt{2}}(|00\rangle + |11\rangle)_{23}" />.
            The joint 3-qubit product state expands as:
          </p>
          <div className="p-4 rounded-xl bg-[#060a14] border border-cyan-900/40 text-center font-mono text-xs text-cyan-300 overflow-x-auto">
            <MathFormula
              math="|\Psi_{123}\rangle = (\alpha|0\rangle + \beta|1\rangle)_1 \otimes \frac{1}{\sqrt{2}}(|00\rangle + |11\rangle)_{23} = \frac{1}{\sqrt{2}}\Big(\alpha|000\rangle + \alpha|011\rangle + \beta|100\rangle + \beta|111\rangle\Big)"
              block
            />
          </div>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            Rewriting the state of qubits 1 and 2 in the orthonormal Bell basis:
          </p>
          <div className="p-4 rounded-xl bg-[#060a14] border border-cyan-900/40 text-center font-mono text-xs text-purple-300 overflow-x-auto">
            <MathFormula
              math="|\Psi_{123}\rangle = \frac{1}{2}\Big( |\Phi^+\rangle_{12}(\alpha|0\rangle + \beta|1\rangle)_3 + |\Phi^-\rangle_{12}(\alpha|0\rangle - \beta|1\rangle)_3 + |\Psi^+\rangle_{12}(\beta|0\rangle + \alpha|1\rangle)_3 + |\Psi^-\rangle_{12}(-\beta|0\rangle + \alpha|1\rangle)_3 \Big)"
              block
            />
          </div>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            When Alice measures in the Bell basis, Bob’s qubit collapses to <MathFormula math="U_k |\psi\rangle" /> with equal probability 1/4.
            Upon receiving (b₁, b₂), Bob applies the unitary Pauli correction <MathFormula math="\sigma = \sigma_z^{b_1}\sigma_x^{b_2}" />, perfectly restoring <MathFormula math="|\psi\rangle" />.
          </p>
        </div>

        {/* Derivation 2: Kraus Noise Operators */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold font-mono text-white">
              2. Open Quantum System Decoherence (Kraus Representation)
            </h3>
          </div>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            Environmental optical fiber decoherence is rigorously modeled as a completely positive trace-preserving (CPTP) map via Kraus operators:
          </p>
          <div className="p-4 rounded-xl bg-[#060a14] border border-purple-900/40 text-center font-mono text-xs text-cyan-300 overflow-x-auto">
            <MathFormula
              math="\mathcal{E}(\rho) = \sum_{k=0}^3 E_k \rho E_k^\dagger, \quad E_0 = \sqrt{1 - p} \, I, \quad E_1 = \sqrt{\frac{p}{3}} \, X, \quad E_2 = \sqrt{\frac{p}{3}} \, Y, \quad E_3 = \sqrt{\frac{p}{3}} \, Z"
              block
            />
          </div>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            The completeness condition $\sum E_k^\dagger E_k = I$ preserves total probability. For depolarizing parameter $p$, the expected quantum bit error rate is $Q = \frac{2}{3}p$.
          </p>
        </div>

        {/* Derivation 3: Holevo Information & Information-Theoretic Security */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold font-mono text-white">
              3. Holevo Information Bound & Forgery Resistance
            </h3>
          </div>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            An adversary Eve attempting to forge Alice&apos;s signature can extract at most the Holevo quantity <MathFormula math="\chi(E : A)" /> from the quantum state ensemble:
          </p>
          <div className="p-4 rounded-xl bg-[#060a14] border border-emerald-900/40 text-center font-mono text-xs text-emerald-300 overflow-x-auto">
            <MathFormula
              math="\chi = S(\rho) - \sum_{i} p_i S(\rho_i) \le S(\rho) \le 1 \text{ bit per qubit}"
              block
            />
          </div>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            Because conjugate bases Z and X are mutually unbiased (<MathFormula math="|\langle 0|+\rangle|^2 = 1/2" />), Eve cannot acquire non-zero information about both bases simultaneously. Any measurement necessarily introduces irreversible error <MathFormula math="\delta_{\text{Eve}} \ge 25\%" />, guaranteeing unconditional detectability.
          </p>
        </div>
      </div>
    </div>
  );
};
