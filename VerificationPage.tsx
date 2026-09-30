import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  Zap,
  Users,
  Check,
  X,
  FileText,
  Sliders
} from 'lucide-react';
import { useQuantumSecurity } from '../../context/QuantumSecurityContext';
import { QuantumBadge } from '../common/QuantumBadge';
import { MathFormula } from '../common/MathFormula';

export const VerificationPage: React.FC = () => {
  const {
    currentSignature,
    lastVerificationResult,
    verifyCurrentSignature,
    isProcessing,
    setActiveTab,
    executeAttackPreset
  } = useQuantumSecurity();

  const [activeVerifierTab, setActiveVerifierTab] = useState<'both' | 'bob' | 'charlie'>('both');

  const handleVerify = async () => {
    await verifyCurrentSignature();
  };

  if (!currentSignature) {
    return (
      <div className="glass-panel p-12 rounded-2xl text-center space-y-4">
        <FileText className="w-12 h-12 text-slate-500 mx-auto" />
        <h2 className="text-xl font-bold font-mono text-white">No Active Signature Generated</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Please generate a Teleportation QDS signature first before running the dual-verifier protocol.
        </p>
        <button
          onClick={() => setActiveTab('signature')}
          className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-mono text-xs font-bold transition-all inline-flex items-center gap-2"
        >
          <span>Go to Signature Generation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const result = lastVerificationResult;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400">
              Signature Verification Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
            Dual-Verifier Quantum Teleportation Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl font-sans">
            Independent projective measurements by Bob and Charlie with classical Pauli correction and non-repudiation symmetrization cross-check.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <QuantumBadge label="Dual Verifier (Bob + Charlie)" variant="cyan" />
          <QuantumBadge label="Non-Repudiation Guaranteed" variant="purple" />
        </div>
      </div>

      {/* Verification Action Bar */}
      <div className="glass-panel-glow p-6 rounded-2xl border border-cyan-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <span className="text-xs font-mono text-slate-400">Verifying Active Signature:</span>
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="text-base font-bold font-mono text-white">
              {currentSignature.signatureId}
            </span>
            <span className="text-xs font-mono text-cyan-400">
              ({currentSignature.tokens.length} Teleported Tokens)
            </span>
          </div>
          <div className="text-xs text-slate-300 font-sans italic line-clamp-1">
            &quot;{currentSignature.message}&quot;
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleVerify}
            disabled={isProcessing}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-mono font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950 transition-all disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Performing Projective Measurements...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Execute Quantum Verification</span>
              </>
            )}
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-950/70 hover:bg-rose-900/60 text-rose-300 border border-rose-600/40 font-mono text-xs font-bold transition-all"
          >
            <Zap className="w-4 h-4 text-rose-400" />
            <span>Simulate Adversary Attack</span>
          </button>
        </div>
      </div>

      {/* Verification Verdict Banner */}
      {result && (
        <div
          className={`p-6 rounded-2xl border transition-all ${
            result.verificationPassed
              ? 'bg-emerald-950/40 border-emerald-500/50 shadow-lg shadow-emerald-950/40'
              : 'bg-rose-950/40 border-rose-500/50 shadow-lg shadow-rose-950/40'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-xl border ${
                  result.verificationPassed
                    ? 'bg-emerald-950 border-emerald-700/60 text-emerald-400'
                    : 'bg-rose-950 border-rose-700/60 text-rose-400'
                }`}
              >
                {result.verificationPassed ? (
                  <ShieldCheck className="w-6 h-6" />
                ) : (
                  <ShieldAlert className="w-6 h-6" />
                )}
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                  Deterministic Rule Decision Engine
                </span>
                <h3 className="text-lg sm:text-xl font-bold font-mono text-white">
                  VERDICT: {result.threatEvaluation.verdict}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <QuantumBadge
                label={`Severity: ${result.threatEvaluation.severity}`}
                variant={result.verificationPassed ? 'emerald' : 'rose'}
                pulse={!result.verificationPassed}
              />
              <QuantumBadge
                label={result.nonRepudiationPassed ? 'Non-Repudiation: VALID' : 'Non-Repudiation: FAILED'}
                variant={result.nonRepudiationPassed ? 'emerald' : 'rose'}
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
            <div>
              <span className="font-mono text-slate-400 uppercase text-[10px] block mb-1">
                Security Analysis:
              </span>
              <p className="text-slate-200 leading-relaxed">
                {result.threatEvaluation.explanation}
              </p>
            </div>
            <div>
              <span className="font-mono text-slate-400 uppercase text-[10px] block mb-1">
                Recommended SOC Action:
              </span>
              <p className="text-slate-200 leading-relaxed">
                {result.threatEvaluation.recommendedMitigation}
              </p>
            </div>
          </div>

          {/* Triggered Rules List */}
          {result.threatEvaluation.triggeredRules.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-800/80">
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1.5">
                Deterministic Threshold Rules Triggered:
              </span>
              <div className="space-y-1">
                {result.threatEvaluation.triggeredRules.map((rule, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 font-mono text-[11px] text-cyan-300 flex items-start gap-2"
                  >
                    <span className="text-cyan-500 font-bold">▹</span>
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Dual Verifier Side-by-Side Statistics */}
      {result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bob Verifier Card */}
          <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <h3 className="font-mono font-bold text-white text-sm">Verifier Bob (Node B)</h3>
              </div>
              <QuantumBadge label="Primary Verifier" variant="cyan" />
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Measured QBER (Q_Bob):</span>
                <span className={`font-bold ${result.bobQBER > 0.11 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {(result.bobQBER * 100).toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Reconstruction Fidelity:</span>
                <span className="text-white font-bold">{(result.bobFidelity * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Bit Mismatches:</span>
                <span className="text-slate-300">{result.mismatchCountBob} / {currentSignature.tokens.length}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Threshold Check (Q ≤ 11%):</span>
                <span className={result.bobQBER <= 0.11 ? 'text-emerald-400' : 'text-rose-400'}>
                  {result.bobQBER <= 0.11 ? 'PASSED' : 'EXCEEDED'}
                </span>
              </div>
            </div>
          </div>

          {/* Charlie Verifier Card */}
          <div className="glass-panel p-6 rounded-2xl border border-purple-500/30 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                <h3 className="font-mono font-bold text-white text-sm">Verifier Charlie (Node C)</h3>
              </div>
              <QuantumBadge label="Non-Repudiation Verifier" variant="purple" />
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Measured QBER (Q_Charlie):</span>
                <span className={`font-bold ${result.charlieQBER > 0.11 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {(result.charlieQBER * 100).toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Reconstruction Fidelity:</span>
                <span className="text-white font-bold">{(result.charlieFidelity * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Bit Mismatches:</span>
                <span className="text-slate-300">{result.mismatchCountCharlie} / {currentSignature.tokens.length}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Threshold Check (Q ≤ 11%):</span>
                <span className={result.charlieQBER <= 0.11 ? 'text-emerald-400' : 'text-rose-400'}>
                  {result.charlieQBER <= 0.11 ? 'PASSED' : 'EXCEEDED'}
                </span>
              </div>
            </div>
          </div>

          {/* Symmetrization & Cross-Check */}
          <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="font-mono font-bold text-white text-sm">Cross-Symmetrization</h3>
              </div>
              <QuantumBadge label="|Q_B - Q_C| ≤ 15%" variant="emerald" />
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Discrepancy Δ = |Q_B - Q_C|:</span>
                <span className={`font-bold ${result.crossCheckDiscrepancy > 0.15 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {(result.crossCheckDiscrepancy * 100).toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Alice Repudiation Check:</span>
                <span className={result.nonRepudiationPassed ? 'text-emerald-400' : 'text-rose-400'}>
                  {result.nonRepudiationPassed ? 'NO REPUDIATION' : 'REPUDIATION SUSPECT'}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Combined Channel QBER:</span>
                <span className="text-white font-bold">{(result.averageQBER * 100).toFixed(2)}%</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Protocol Security Verdict:</span>
                <span className={result.verificationPassed ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {result.verificationPassed ? 'AUTHENTIC' : 'UNAUTHENTIC'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side Token Inspection Table */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
            Token-by-Token Projective Measurement Comparison
          </h3>
          <span className="text-xs font-mono text-slate-400">
            Comparing Alice vs Bob vs Charlie
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#050913]">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Expected Bit</th>
                <th className="py-2.5 px-3">Basis</th>
                <th className="py-2.5 px-3">Bob Pauli</th>
                <th className="py-2.5 px-3">Bob Measured</th>
                <th className="py-2.5 px-3">Bob Match</th>
                <th className="py-2.5 px-3">Charlie Pauli</th>
                <th className="py-2.5 px-3">Charlie Measured</th>
                <th className="py-2.5 px-3">Charlie Match</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 text-[11px]">
              {currentSignature.tokens.slice(0, 16).map(token => (
                <tr key={token.index} className="hover:bg-slate-900/40">
                  <td className="py-2 px-3 text-slate-500">#{token.index}</td>
                  <td className="py-2 px-3 font-bold text-white">{token.messageBit}</td>
                  <td className="py-2 px-3 text-cyan-400">{token.aliceBasis}</td>
                  <td className="py-2 px-3 text-slate-400">σ_{token.bobPauliCorrection}</td>
                  <td className="py-2 px-3 font-semibold">{token.bobOutcome}</td>
                  <td className="py-2 px-3">
                    {token.bobMatch ? (
                      <span className="text-emerald-400 flex items-center gap-1 font-bold">
                        <Check className="w-3.5 h-3.5" /> OK
                      </span>
                    ) : (
                      <span className="text-rose-400 flex items-center gap-1 font-bold">
                        <X className="w-3.5 h-3.5" /> ERROR
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-slate-400">σ_{token.charliePauliCorrection}</td>
                  <td className="py-2 px-3 font-semibold">{token.charlieOutcome}</td>
                  <td className="py-2 px-3">
                    {token.charlieMatch ? (
                      <span className="text-emerald-400 flex items-center gap-1 font-bold">
                        <Check className="w-3.5 h-3.5" /> OK
                      </span>
                    ) : (
                      <span className="text-rose-400 flex items-center gap-1 font-bold">
                        <X className="w-3.5 h-3.5" /> ERROR
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
