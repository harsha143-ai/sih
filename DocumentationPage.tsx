import React, { useState } from 'react';
import {
  BookOpen,
  HelpCircle,
  FileText,
  Search,
  ChevronRight,
  Cpu,
  ShieldCheck,
  Zap,
  Terminal,
  ExternalLink
} from 'lucide-react';
import { QuantumBadge } from '../common/QuantumBadge';
import { MathFormula } from '../common/MathFormula';

export const DocumentationPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const glossaryTerms = [
    {
      term: 'Quantum Digital Signature (QDS)',
      category: 'Cryptographic Protocol',
      definition:
        'A cryptographic scheme providing the quantum counterpart to classical digital signatures. QDS provides information-theoretic security against forgery and repudiation based on fundamental quantum mechanics rather than unproven mathematical computational complexity.',
    },
    {
      term: 'Quantum Teleportation',
      category: 'Quantum Protocol',
      definition:
        'A protocol by which the quantum state of a particle is transmitted from one location to another with the aid of shared entanglement (an EPR Bell pair) and the transmission of two classical bits, without physically transmitting the original particle itself.',
    },
    {
      term: 'Bell State Measurement (BSM)',
      category: 'Measurement',
      definition:
        'A joint quantum-mechanical projective measurement of two qubits that determines which of the four maximally entangled Bell states (|Φ⁺⟩, |Φ⁻⟩, |Ψ⁺⟩, |Ψ⁻⟩) the two qubits are in.',
    },
    {
      term: 'Quantum Bit Error Rate (QBER)',
      category: 'Statistical Metric',
      definition:
        'The fraction of error bits between the sent quantum state and the received/measured quantum state. In standard QDS/QKD, a QBER exceeding 11.0% triggers an immediate protocol abort because an eavesdropper measuring non-commuting bases induces a mandatory 25% error on tapped qubits.',
    },
    {
      term: 'Pauli Unitary Operations (I, X, Y, Z)',
      category: 'Quantum Gates',
      definition:
        'The group of 2x2 complex Hermitian and unitary matrices. In quantum teleportation feed-forward, Bob applies σ_z^{b₁} σ_x^{b₂} to align his entangled half with Alice’s original state.',
    },
    {
      term: 'No-Cloning Theorem',
      category: 'Quantum Physical Law',
      definition:
        'A fundamental theorem of quantum mechanics stating that it is impossible to create an identical copy of an arbitrary unknown quantum state. This is the cornerstone of signature forgery prevention in QDS.',
    },
    {
      term: 'Conjugate (Mutually Unbiased) Bases',
      category: 'Quantum States',
      definition:
        'Two measurement bases (such as the computational Z basis {|0⟩, |1⟩} and the diagonal Hadamard X basis {|+⟩, |−⟩}) where knowing the state in one basis gives zero information about the outcome in the other basis (equal probability 1/2).',
    },
    {
      term: 'Kraus Representation / CPTP Map',
      category: 'Mathematical Formalism',
      definition:
        'A mathematical formulation representing open quantum system interactions with the environment (e.g. depolarizing optical fiber noise, phase damping, and thermal decoherence).',
    },
    {
      term: 'Non-Repudiation Symmetrization',
      category: 'Security Mechanism',
      definition:
        'A multi-party cross-verification process in QDS where Bob and Charlie compare a subset of measurement statistics over an authenticated channel. If Alice attempts to sign differently for Bob than for Charlie, the discrepancy exposes her attempt.',
    },
  ];

  const filteredTerms = glossaryTerms.filter(
    t =>
      t.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400">
              Protocol Manual & Glossary
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
            Documentation & Quantum Cryptography Reference
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl font-sans">
            Comprehensive technical handbook, quantum glossary, step-by-step protocol instructions, and references for the teleportation-based QDS threat detection prototype.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <QuantumBadge label="Standard QDS Specification" variant="cyan" />
          <QuantumBadge label="Educational Reference" variant="purple" />
        </div>
      </div>

      {/* Quick Start Guide */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
        <h2 className="text-base font-bold font-mono text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-cyan-400" />
          Prototype Operational Walkthrough
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <span className="h-5 w-5 rounded-full bg-cyan-950 border border-cyan-700/60 flex items-center justify-center text-[11px]">
                1
              </span>
              <span>Generate Quantum Signature</span>
            </div>
            <p className="text-slate-300 font-sans text-[11px] leading-relaxed">
              Navigate to <strong>Signature Gen</strong>, enter a document payload or choose a preset transaction, and click <em>Generate & Teleport Signature Tokens</em>. Alice prepares quantum tokens and teleports them using entangled Bell pairs.
            </p>
          </div>

          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-bold">
              <span className="h-5 w-5 rounded-full bg-purple-950 border border-purple-700/60 flex items-center justify-center text-[11px]">
                2
              </span>
              <span>Dual-Verifier Verification</span>
            </div>
            <p className="text-slate-300 font-sans text-[11px] leading-relaxed">
              Navigate to <strong>Verification</strong> to observe Bob and Charlie independently apply Pauli unitary corrections, perform projective measurements, and cross-compare measurement statistics to guarantee non-repudiation.
            </p>
          </div>

          <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold">
              <span className="h-5 w-5 rounded-full bg-rose-950 border border-rose-700/60 flex items-center justify-center text-[11px]">
                3
              </span>
              <span>Simulate Cyber Threats</span>
            </div>
            <p className="text-slate-300 font-sans text-[11px] leading-relaxed">
              Open <strong>Attack Simulator</strong> to test Eve Intercept-Resend, Blind Forgery, Impersonation, or Replay attacks. Watch the deterministic rule engine trigger immediate mitigation without AI or ML heuristics.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Quantum Cryptography Glossary */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-base font-bold font-mono text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            Quantum Cryptography & Physics Glossary
          </h2>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search glossary terms..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#050913] border border-slate-800 rounded-lg pl-8 pr-3 py-1 font-mono text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTerms.map((item, idx) => (
            <div
              key={idx}
              className="glass-panel p-5 rounded-xl border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-mono font-bold text-white text-xs">
                  {item.term}
                </h3>
                <QuantumBadge label={item.category} variant="slate" size="xs" />
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {item.definition}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
