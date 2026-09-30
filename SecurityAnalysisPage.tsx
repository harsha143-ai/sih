import React from 'react';
import {
  Lock,
  ShieldCheck,
  AlertTriangle,
  Check,
  X,
  Cpu,
  Layers,
  FileCheck,
  BookOpen
} from 'lucide-react';
import { QuantumBadge } from '../common/QuantumBadge';
import { MathFormula } from '../common/MathFormula';

export const SecurityAnalysisPage: React.FC = () => {
  const comparisonData = [
    {
      scheme: 'Teleportation QDS (Proposed)',
      foundation: 'Quantum Mechanics & EPR Entanglement',
      shorVulnerable: 'NO (Immune)',
      groverVulnerable: 'NO (Immune)',
      forwardSecrecy: 'Permanent (Information-Theoretic)',
      threatDetection: 'Deterministic Wave-function Collapse',
      nonRepudiation: 'Dual-Verifier Symmetrization Cross-Check',
      status: 'OPTIMAL',
    },
    {
      scheme: 'Classical RSA-2048 / RSA-4096',
      foundation: 'Integer Factorization Hardness',
      shorVulnerable: 'YES (Broken in poly-time)',
      groverVulnerable: 'Negligible (O(√N))',
      forwardSecrecy: 'ZERO (Harvest Now, Decrypt Later)',
      threatDetection: 'NONE (Mathematical crack is silent)',
      nonRepudiation: 'Asymmetric Secret Key Knowledge',
      status: 'DEPRECATED',
    },
    {
      scheme: 'Classical ECDSA (P-256 / secp256k1)',
      foundation: 'Elliptic Curve Discrete Logarithm (ECDLP)',
      shorVulnerable: 'YES (Broken in poly-time)',
      groverVulnerable: 'Negligible',
      forwardSecrecy: 'ZERO (Vulnerable to future quantum computer)',
      threatDetection: 'NONE (Silent offline key derivation)',
      nonRepudiation: 'Discrete Log Private Key',
      status: 'DEPRECATED',
    },
    {
      scheme: 'NIST PQC (ML-DSA / Crystals-Dilithium)',
      foundation: 'Module-Learning With Errors (M-LWE)',
      shorVulnerable: 'NO (Heuristic hardness)',
      groverVulnerable: 'Mildly impacted (Requires larger keys)',
      forwardSecrecy: 'Conditional on lattice hardness proof',
      threatDetection: 'NONE (Computational attack is silent)',
      nonRepudiation: 'Lattice Signature Verification',
      status: 'TRANSITIONAL',
    },
    {
      scheme: 'NIST PQC (SPHINCS+ / Hash-based)',
      foundation: 'Cryptographic Hash Function Preimage',
      shorVulnerable: 'NO (Preimage resistance)',
      groverVulnerable: 'Mitigated by 256-bit hashes',
      forwardSecrecy: 'Conditional on SHA-2/SHA-3 collision proof',
      threatDetection: 'NONE',
      nonRepudiation: 'Few-Time Hash Signatures (Large size)',
      status: 'TRANSITIONAL',
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Lock className="w-5 h-5 text-teal-400" />
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-teal-400">
              Comparative Cryptanalysis
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
            Security Analysis & Quantum Advantage Benchmarking
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl font-sans">
            Rigorous comparison of Teleportation QDS against classical public-key infrastructure and post-quantum computational primitives against computationally unbounded adversaries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <QuantumBadge label="Information-Theoretic Security" variant="emerald" />
          <QuantumBadge label="NIST PQC Comparison" variant="cyan" />
        </div>
      </div>

      {/* Comparative Benchmark Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold font-mono text-white flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-cyan-400" />
            Comprehensive Cryptographic Security Comparison Matrix
          </h2>
          <span className="text-xs font-mono text-slate-400">Evaluated against Shor & Grover Attacks</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-[#050913] text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Cryptographic Scheme</th>
                <th className="py-3 px-4">Mathematical / Physical Basis</th>
                <th className="py-3 px-4">Shor's Algorithm</th>
                <th className="py-3 px-4">Forward Secrecy</th>
                <th className="py-3 px-4">Physical Threat Detection</th>
                <th className="py-3 px-4">Security Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 text-[11px]">
              {comparisonData.map((row, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-slate-900/40 transition-colors ${
                    idx === 0 ? 'bg-cyan-950/20 font-semibold' : ''
                  }`}
                >
                  <td className="py-3 px-4 text-white flex items-center gap-2">
                    {idx === 0 && <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>}
                    <span className={idx === 0 ? 'text-cyan-300 font-bold' : ''}>{row.scheme}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{row.foundation}</td>
                  <td className="py-3 px-4">
                    {row.shorVulnerable.startsWith('YES') ? (
                      <span className="text-rose-400 flex items-center gap-1 font-bold">
                        <X className="w-3.5 h-3.5" /> Broken
                      </span>
                    ) : (
                      <span className="text-emerald-400 flex items-center gap-1 font-bold">
                        <Check className="w-3.5 h-3.5" /> Immune
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">{row.forwardSecrecy}</td>
                  <td className="py-3 px-4 text-slate-300">{row.threatDetection}</td>
                  <td className="py-3 px-4">
                    <QuantumBadge
                      label={row.status}
                      variant={row.status === 'OPTIMAL' ? 'emerald' : row.status === 'TRANSITIONAL' ? 'cyan' : 'rose'}
                      size="xs"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Information-Theoretic Security Proof Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 space-y-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h3 className="font-mono font-bold text-white text-sm">
              1. Quantum No-Cloning Theorem
            </h3>
          </div>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            Wootters, Zurek, and Dieks proved that no unitary operator $U$ can duplicate an unknown arbitrary quantum state:
          </p>
          <div className="p-2.5 bg-[#050913] rounded-lg border border-slate-800 text-center font-mono text-xs text-cyan-300">
            <MathFormula math="U|\psi\rangle|0\rangle \neq |\psi\rangle|\psi\rangle" block />
          </div>
          <p className="text-[11px] text-slate-400 font-sans">
            Because signature tokens exist in non-orthogonal bases, an eavesdropper cannot duplicate tokens to analyze them offline without destroying the original.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-purple-500/20 space-y-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-400" />
            <h3 className="font-mono font-bold text-white text-sm">
              2. Heisenberg Uncertainty Invariance
            </h3>
          </div>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            The Pauli matrices $\sigma_x$ and $\sigma_z$ do not commute:
          </p>
          <div className="p-2.5 bg-[#050913] rounded-lg border border-slate-800 text-center font-mono text-xs text-purple-300">
            <MathFormula math="[\sigma_x, \sigma_z] = -2i\sigma_y \neq 0" block />
          </div>
          <p className="text-[11px] text-slate-400 font-sans">
            Any attempt by an attacker to intercept and measure a qubit in an incorrect basis irrevocably collapses the state vector, permanently perturbing the fidelity.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-emerald-500/20 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-mono font-bold text-white text-sm">
              3. Dual Symmetrization Non-Repudiation
            </h3>
          </div>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            In standard asymmetric cryptography, non-repudiation is mathematical. In QDS, it is enforced by symmetric multi-party quantum distribution:
          </p>
          <div className="p-2.5 bg-[#050913] rounded-lg border border-slate-800 text-center font-mono text-xs text-emerald-300">
            <MathFormula math="|Q_{\text{Bob}} - Q_{\text{Charlie}}| \le \Delta_{\text{th}}" block />
          </div>
          <p className="text-[11px] text-slate-400 font-sans">
            If Alice cheats Bob by sending bogus tokens, Charlie&apos;s cross-comparison immediately detects the discrepancy, preventing selective repudiation.
          </p>
        </div>
      </div>
    </div>
  );
};
