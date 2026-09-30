import React, { useState } from 'react';
import {
  FileSignature,
  Hash,
  Cpu,
  Key,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Copy,
  RefreshCw,
  Clock,
  Sparkles
} from 'lucide-react';
import { useQuantumSecurity } from '../../context/QuantumSecurityContext';
import { QuantumBadge } from '../common/QuantumBadge';
import { MathFormula } from '../common/MathFormula';

export const SignatureGenPage: React.FC = () => {
  const { currentSignature, generateNewSignature, isProcessing, setActiveTab } = useQuantumSecurity();
  const [messageInput, setMessageInput] = useState<string>(
    'FINANCIAL-TX: Transfer 5,000,000 Q-Credits to Treasury Escrow Vault #714'
  );
  const [qubitCount, setQubitCount] = useState<number>(16);
  const [copiedNonce, setCopiedNonce] = useState(false);

  const presets = [
    'FINANCIAL-TX: Transfer 5,000,000 Q-Credits to Treasury Escrow Vault #714',
    'DEFENSE_DIRECTIVE: Authorize deployment of deep-space quantum communication satellite Q-9',
    'CRITICAL_INFRASTRUCTURE: Emergency shutdown instruction for nuclear reactor coolant pump #2',
    'LEGAL_CONTRACT: Quantum identity attestation for sovereign cryptographic root certificate',
  ];

  const handleGenerate = async () => {
    if (!messageInput.trim()) return;
    await generateNewSignature(messageInput, qubitCount);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNonce(true);
    setTimeout(() => setCopiedNonce(false), 2000);
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileSignature className="w-5 h-5 text-cyan-400" />
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400">
              QDS Signature Generation
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
            Alice Signature Synthesizer & Token Teleportation
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl font-sans">
            Alice cryptographically hashes the document, prepares quantum tokens in conjugate Pauli bases, and teleports them to verifiers using entangled Bell pairs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <QuantumBadge label="SHA-256 Digest" variant="cyan" />
          <QuantumBadge label="Conjugate BB84 Bases" variant="purple" />
          <QuantumBadge label="Quantum Nonce Tracking" variant="emerald" />
        </div>
      </div>

      {/* Input & Parameters Card */}
      <div className="glass-panel-glow p-6 sm:p-8 rounded-2xl border border-cyan-500/20 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold font-mono text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-cyan-400" />
            Document / Transaction to Sign
          </h2>
          <span className="text-xs font-mono text-slate-400">Alice Signing Node (Authenticated)</span>
        </div>

        {/* Text Input */}
        <div>
          <textarea
            rows={3}
            value={messageInput}
            onChange={e => setMessageInput(e.target.value)}
            placeholder="Type message or payload to be signed with quantum digital signatures..."
            className="w-full bg-[#050913] border border-slate-800 rounded-xl p-4 font-mono text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all resize-none"
          />
        </div>

        {/* Quick Presets */}
        <div>
          <span className="text-[11px] font-mono text-slate-400 block mb-2">Preset High-Value Scenarios:</span>
          <div className="flex flex-wrap gap-2">
            {presets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setMessageInput(p)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-mono text-slate-300 hover:text-cyan-300 transition-all text-left"
              >
                {p.slice(0, 40)}...
              </button>
            ))}
          </div>
        </div>

        {/* Parameters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
            <label className="text-xs font-mono text-slate-400 block mb-1">
              Qubits Per Message Bit:
            </label>
            <select
              value={qubitCount}
              onChange={e => setQubitCount(parseInt(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 font-mono text-xs text-white focus:outline-none focus:border-cyan-400"
            >
              <option value={8}>8 Qubits (Fast Demo)</option>
              <option value={16}>16 Qubits (Standard Security)</option>
              <option value={32}>32 Qubits (High Security)</option>
              <option value={64}>64 Qubits (Maximum Resilience)</option>
            </select>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
            <label className="text-xs font-mono text-slate-400 block mb-1">
              Conjugate Basis Encoding:
            </label>
            <div className="p-2 text-xs font-mono text-cyan-300 font-semibold">
              Mutually Unbiased {`{Z, X}`} Bases
            </div>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
            <label className="text-xs font-mono text-slate-400 block mb-1">
              Entanglement Mode:
            </label>
            <div className="p-2 text-xs font-mono text-purple-300 font-semibold">
              Bell State |Φ⁺⟩ Pre-Shared
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div>
          <button
            onClick={handleGenerate}
            disabled={isProcessing}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-mono font-bold text-sm shadow-lg shadow-cyan-950/60 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Teleporting Quantum Tokens via Bell Pairs...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate & Teleport Signature Tokens</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Signature Detail Inspector */}
      {currentSignature && (
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold font-mono text-white">
                  Active QDS Signature Payload ({currentSignature.signatureId})
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Created: {new Date(currentSignature.timestamp).toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('verification')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold transition-all shadow-md shadow-emerald-950"
              >
                <span>Verify Signature with Bob & Charlie</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cryptographic Metadata Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block mb-1">Message Digest (SHA-256)</span>
              <span className="text-cyan-300 break-all text-[11px] font-semibold">
                {currentSignature.messageHash.slice(0, 24)}...
              </span>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block mb-1">Quantum Nonce (Freshness)</span>
              <div className="flex items-center justify-between">
                <span className="text-purple-300 text-[11px] font-semibold">{currentSignature.nonce}</span>
                <button
                  onClick={() => copyToClipboard(currentSignature.nonce)}
                  className="p-1 hover:text-white text-slate-400"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block mb-1">Total Teleported Tokens</span>
              <span className="text-white text-base font-bold">
                {currentSignature.tokens.length} Qubits
              </span>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block mb-1">Theoretical Forgery Bound</span>
              <span className="text-emerald-400 text-base font-bold">
                P &lt; 10⁻⁴ (Unconditionally Bound)
              </span>
            </div>
          </div>

          {/* Granular Token Stream Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
                Quantum Signature Token Stream ({currentSignature.tokens.length} Qubits Teleported)
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                Conjugate Pauli Eigenstates & BSM Feed-Forward
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#050913]">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Token #</th>
                    <th className="py-2.5 px-3">Bit</th>
                    <th className="py-2.5 px-3">Alice Basis</th>
                    <th className="py-2.5 px-3">Prepared State</th>
                    <th className="py-2.5 px-3">Bell Carrier</th>
                    <th className="py-2.5 px-3">BSM Bits (b₁b₂)</th>
                    <th className="py-2.5 px-3">Pauli Correction</th>
                    <th className="py-2.5 px-3">Transit Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300 text-[11px]">
                  {currentSignature.tokens.slice(0, 16).map(token => (
                    <tr key={token.index} className="hover:bg-slate-900/40">
                      <td className="py-2 px-3 text-slate-500">#{token.index}</td>
                      <td className="py-2 px-3">
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-white font-bold">
                          {token.messageBit}
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        <span className={token.aliceBasis === 'Z' ? 'text-cyan-400' : 'text-purple-400'}>
                          {token.aliceBasis}-basis
                        </span>
                      </td>
                      <td className="py-2 px-3 font-semibold text-white">
                        {token.initialState.label}
                      </td>
                      <td className="py-2 px-3 text-slate-400">|Φ⁺⟩</td>
                      <td className="py-2 px-3 font-bold text-cyan-300">
                        ({token.bsmOutcome.b1}, {token.bsmOutcome.b2})
                      </td>
                      <td className="py-2 px-3 font-bold text-emerald-400">
                        σ_{token.bobPauliCorrection}
                      </td>
                      <td className="py-2 px-3">
                        {token.interceptedByEve ? (
                          <span className="text-rose-400 font-bold">⚠️ INTERCEPTED</span>
                        ) : (
                          <span className="text-emerald-400">● Intact</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {currentSignature.tokens.length > 16 && (
              <div className="text-center text-[11px] font-mono text-slate-500 pt-1">
                Showing first 16 tokens of {currentSignature.tokens.length}. All tokens teleported via authenticated quantum channel.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
