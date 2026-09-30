import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  AreaChart,
  Area,
  Legend
} from 'recharts';
import {
  BarChart3,
  Activity,
  Sliders,
  TrendingDown,
  ShieldCheck,
  Calculator,
  Info
} from 'lucide-react';
import { useQuantumSecurity } from '../../context/QuantumSecurityContext';
import { QuantumBadge } from '../common/QuantumBadge';
import { MathFormula } from '../common/MathFormula';
import {
  calculateTheoreticalForgeryProbability,
  calculateEveDetectProbability,
  calculateChiSquared
} from '../../quantum/math';

export const StatisticalAnalyticsPage: React.FC = () => {
  const { currentSignature, lastVerificationResult, metrics } = useQuantumSecurity();
  const [sliderLength, setSliderLength] = useState<number>(32);
  const [sliderTapIntensity, setSliderTapIntensity] = useState<number>(0.75);

  // Chart 1: Token-by-Token Fidelity & Mismatch Profile
  const tokenData = currentSignature
    ? currentSignature.tokens.map(t => ({
        token: `#${t.index}`,
        fidelity: parseFloat((t.tokenFidelity * 100).toFixed(1)),
        bobMatch: t.bobMatch ? 100 : 0,
        charlieMatch: t.charlieMatch ? 100 : 0,
        intercepted: t.interceptedByEve ? 1 : 0,
      }))
    : [];

  // Chart 2: Forgery Probability vs Signature Length L (Log scale simulation)
  const forgeryCurveData = [8, 16, 24, 32, 40, 48, 56, 64].map(len => {
    const prob = calculateTheoreticalForgeryProbability(len, 0.11);
    return {
      length: len,
      logProb: Math.max(-25, Math.log10(prob || 1e-25)),
      probStr: prob < 1e-6 ? prob.toExponential(2) : prob.toFixed(4),
    };
  });

  // Chart 3: Eve Detection Probability vs Intercept Rate
  const eveDetectionData = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0].map(rate => {
    const pDetect = calculateEveDetectProbability(sliderLength, rate);
    return {
      rate: `${(rate * 100).toFixed(0)}%`,
      detectProb: parseFloat((pDetect * 100).toFixed(1)),
    };
  });

  // Pearson Chi-Squared Test
  const outcomes = currentSignature ? currentSignature.tokens.map(t => t.bobOutcome) : [0, 1, 0, 1, 1, 0, 1];
  const chiResult = calculateChiSquared(outcomes);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400">
              Statistical Mechanics & Quantum Probabilities
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
            Information-Theoretic Statistical Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl font-sans">
            Rigorous mathematical bounds: Sample QBER vs the 11% cutoff, token state fidelities, exponential forgery suppression curves, and Pearson χ² non-uniformity detection.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <QuantumBadge label="Holevo Bound χ" variant="cyan" />
          <QuantumBadge label="Pearson χ² Test" variant="purple" />
          <QuantumBadge label="Chernoff Bounds" variant="emerald" />
        </div>
      </div>

      {/* Grid of Statistical Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Token-by-Token Fidelity Overlap */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Token State Overlap Fidelity F = |⟨ψ_in|ρ_out|ψ_in⟩|
            </h3>
            <span className="text-xs font-mono text-cyan-400">
              Mean: {(metrics.currentFidelity * 100).toFixed(1)}%
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={tokenData.slice(0, 24)}>
                <defs>
                  <linearGradient id="fidGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#00f2fe" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="token" stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis stroke="#64748b" domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', fontSize: '11px' }}
                />
                <ReferenceLine y={89} stroke="#a855f7" strokeDasharray="4 4" label={{ value: 'F_min = 89%', fill: '#a855f7', fontSize: 10 }} />
                <Area type="monotone" dataKey="fidelity" stroke="#00f2fe" fillOpacity={1} fill="url(#fidGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <span className="text-[11px] text-slate-400 font-mono block">
            Values dipping below the 89% threshold indicate wave-function disturbance or optical decoherence.
          </span>
        </div>

        {/* Chart 2: Forgery Probability vs Signature Token Length */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-emerald-400" />
              Forgery Probability P_forge ≤ 2^(-L(1-2δ))
            </h3>
            <span className="text-xs font-mono text-emerald-400">
              Log₁₀ Scale
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forgeryCurveData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="length" stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} label={{ value: 'Token Length L', position: 'insideBottom', offset: -5, fill: '#64748b', fontSize: 10 }} />
                <YAxis stroke="#64748b" domain={[-20, 0]} tick={{ fontSize: 10, fill: '#64748b' }} label={{ value: 'log₁₀(P)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', fontSize: '11px' }}
                  formatter={(val: any, name: any, item: any) => [`P ≈ ${item.payload.probStr}`, 'Forgery Bound']}
                />
                <ReferenceLine y={-4} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: '10⁻⁴ Security Threshold', fill: '#f43f5e', fontSize: 10 }} />
                <Line type="monotone" dataKey="logProb" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: '#10b981' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <span className="text-[11px] text-slate-400 font-mono block">
            Information-theoretic security bounds ensure forgery probability decreases exponentially as L increases.
          </span>
        </div>

        {/* Chart 3: Eve Detection Probability vs Intercept Rate */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              Eavesdropper Detection Probability P_detect = 1 - (1 - η/4)^L
            </h3>
            <span className="text-xs font-mono text-purple-400">
              L = {sliderLength} Qubits
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={eveDetectionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="rate" stroke="#64748b" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis stroke="#64748b" domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', fontSize: '11px' }}
                />
                <Line type="monotone" dataKey="detectProb" stroke="#a855f7" strokeWidth={2.5} dot={{ r: 3, fill: '#a855f7' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 flex items-center gap-4">
            <span className="text-xs font-mono text-slate-400">Tune Token Length L:</span>
            <input
              type="range"
              min={8}
              max={64}
              step={8}
              value={sliderLength}
              onChange={e => setSliderLength(parseInt(e.target.value))}
              className="flex-1 accent-purple-400 cursor-pointer"
            />
            <span className="text-xs font-mono text-white font-bold">{sliderLength} Qubits</span>
          </div>
        </div>

        {/* Pearson Chi-Squared Test Box */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-amber-400" />
              Pearson Chi-Squared (χ²) Goodness-of-Fit Hypothesis
            </h3>
            <QuantumBadge
              label={chiResult.isBiased ? 'BIAS DETECTED' : 'UNBIASED DIST'}
              variant={chiResult.isBiased ? 'rose' : 'emerald'}
            />
          </div>

          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            In standard BB84 conjugate state distribution, measuring an unperturbed qubit in a random basis produces a uniform 50/50 split between outcome 0 and outcome 1.
            If Eve biases her measurement or injects an ancilla state, the Pearson χ² test rejects the null hypothesis:
          </p>

          <div className="p-3 rounded-xl bg-[#060a14] border border-amber-900/40 text-center text-xs font-mono text-amber-300">
            <MathFormula math="\chi^2 = \sum_{k \in \{0, 1\}} \frac{(O_k - E_k)^2}{E_k}, \quad \text{df} = 1, \quad p = \exp\left(-\frac{\chi^2}{2}\right)" block />
          </div>

          <div className="grid grid-cols-3 gap-3 font-mono text-xs text-center">
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Sample χ² Value</span>
              <span className="text-white text-base font-bold">{chiResult.chiSq.toFixed(3)}</span>
            </div>
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">p-value</span>
              <span className="text-cyan-300 text-base font-bold">{chiResult.pValue.toFixed(4)}</span>
            </div>
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Null Hypothesis</span>
              <span className={chiResult.isBiased ? 'text-rose-400 text-base font-bold' : 'text-emerald-400 text-base font-bold'}>
                {chiResult.isBiased ? 'REJECTED' : 'ACCEPTED'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
