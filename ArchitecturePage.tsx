import React, { useState } from 'react';
import {
  Layers,
  Cpu,
  Radio,
  Share2,
  CheckSquare,
  BarChart2,
  ShieldAlert,
  Database,
  Info,
  ArrowDown,
  Terminal,
  Activity,
  Zap
} from 'lucide-react';
import { QuantumBadge } from '../common/QuantumBadge';
import { MathFormula } from '../common/MathFormula';

export const ArchitecturePage: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<number>(1);

  const tiers = [
    {
      id: 1,
      name: 'Tier 1: Quantum State & Key Preparation',
      actor: 'Alice (Signer)',
      role: 'Quantum Nonce & Conjugate State Synthesis',
      icon: <Cpu className="w-5 h-5 text-cyan-400" />,
      color: 'cyan',
      description:
        'Alice prepares sequences of non-orthogonal quantum states in mutually unbiased conjugate bases {Z, X} representing message digest hash bits. True randomness is derived from quantum physical random number generators (QRNG).',
      mathFormula: '|\\psi_j\\rangle \\in \\{|0\\rangle, |1\\rangle, |+\\rangle, |-\\rangle\\}',
      hardware: [
        'Quantum Random Number Generator (QRNG) diode source',
        'Continuous-wave laser (780 nm) + electro-optic phase modulator',
        'Active polarization controller (Pockels cell)',
      ],
      dataPayload: {
        token_count: '16 to 64 qubits per signature',
        bases: ['Z (computational)', 'X (Hadamard conjugate)'],
        state_vectors: 'α|0⟩ + β|1⟩ normalized',
      },
    },
    {
      id: 2,
      name: 'Tier 2: EPR Entanglement Source & Quantum Channels',
      actor: 'Spontaneous Parametric Down-Conversion (SPDC) Source',
      role: 'Maximally Entangled Bell Pair Distribution',
      icon: <Share2 className="w-5 h-5 text-purple-400" />,
      color: 'purple',
      description:
        'A non-linear optical crystal (BBO or periodically poled KTP) pumped by a laser produces polarization-entangled photon pairs |Φ⁺⟩ = (|00⟩+|11⟩)/√2. One photon routes to Alice, the second routes through quantum fiber to the verifier (Bob/Charlie).',
      mathFormula: '|\\Phi^+\\rangle_{23} = \\frac{1}{\\sqrt{2}}(|00\\rangle_{23} + |11\\rangle_{23})',
      hardware: [
        'Ti:Sapphire pulsed laser (405 nm pump beam)',
        'Type-II PPKTP crystal inside Sagnac interferometer',
        'Single-mode polarization-maintaining optical fiber (1550 nm telecom C-band)',
      ],
      dataPayload: {
        entanglement_fidelity: '99.4% initial visibility',
        loss_rate: '0.2 dB/km standard single-mode fiber',
        channel_monitoring: 'Adversary Eve tap detector active',
      },
    },
    {
      id: 3,
      name: 'Tier 3: Quantum Teleportation Core',
      actor: 'Alice Bell State Analyzer',
      role: 'Bell State Measurement (BSM) & Classical Broadcast',
      icon: <Radio className="w-5 h-5 text-sky-400" />,
      color: 'cyan',
      description:
        'Alice performs a joint Bell State Measurement (BSM) between her message qubit 1 and her entangled EPR qubit 2. This projects the 3-qubit joint state into one of four Bell states, transferring the quantum information to Bob’s qubit 3 up to a known Pauli rotation.',
      mathFormula: '|\\Psi_{123}\\rangle = \\frac{1}{2}\\sum_{k=1}^4 |\\Phi_k\\rangle_{12} \\otimes U_k |\\psi\\rangle_3',
      hardware: [
        '50:50 Non-polarizing beam splitter (Hong-Ou-Mandel interference)',
        'Two polarizing beam splitters (PBS) at 45°',
        '4 Superconducting Nanowire Single-Photon Detectors (SNSPDs, >95% efficiency, <15 ps jitter)',
      ],
      dataPayload: {
        bsm_outcomes: ['00: |Φ⁺⟩', '01: |Φ⁻⟩', '10: |Ψ⁺⟩', '11: |Ψ⁻⟩'],
        feed_forward_delay: '< 300 ns classical transmission over optical switch',
      },
    },
    {
      id: 4,
      name: 'Tier 4: Pauli Correction & Projective Measurement',
      actor: 'Bob & Charlie (Verifiers)',
      role: 'Unitary Reconstruction & Basis-Aligned Projection',
      icon: <CheckSquare className="w-5 h-5 text-emerald-400" />,
      color: 'emerald',
      description:
        'Bob and Charlie receive the classical 2-bit BSM outcome. They apply the corresponding Pauli transformation σ = Z^{b₁} X^{b₂} to reconstruct |ψ⟩. Subsequently, upon Alice’s classical basis announcement, they projectively measure the state.',
      mathFormula: 'U = \\sigma_z^{b_1}\\sigma_x^{b_2} \\in \\{I, X, Z, Y\\}, \\quad M_k = |k\\rangle\\langle k|',
      hardware: [
        'Ultra-fast Pockels cells (sub-nanosecond high-voltage switching)',
        'Fiber optical delay loop (stores photon during classical feed-forward)',
        'Single-photon avalanche photodiodes (SPADs) in active quenching mode',
      ],
      dataPayload: {
        pauli_lookup: '00→I (None), 01→Z (Phase-flip), 10→X (Bit-flip), 11→Y (Bit & Phase)',
        measurement_outcomes: 'Recorded bitstrings Y_Bob and Y_Charlie',
      },
    },
    {
      id: 5,
      name: 'Tier 5: Deterministic Statistical Analysis Engine',
      actor: 'Verification Telemetry Processor',
      role: 'Empirical QBER & Non-Repudiation Symmetrization',
      icon: <BarChart2 className="w-5 h-5 text-indigo-400" />,
      color: 'purple',
      description:
        'Calculates sample Quantum Bit Error Rate (QBER), state fidelity F = ⟨ψ|ρ|ψ⟩, Pearson χ² test for non-uniform distribution (detecting Eve’s biased measurements), and cross-verifier difference |Q_Bob - Q_Charlie| to prevent repudiation.',
      mathFormula: 'Q = \\frac{1}{N}\\sum_{i=1}^N \\mathbb{I}(x_i \\neq y_i), \\quad \\Delta = |Q_B - Q_C|',
      hardware: [
        'Deterministic hardware arithmetic logic unit (ALU)',
        'FPGA-based high-speed error correlation accumulator',
        'Cryptographic hash comparator (SHA-256 digest match)',
      ],
      dataPayload: {
        sample_size: 'L = 16 to 64 tokens per block',
        chi_squared: 'Degrees of freedom df=1, p-value evaluation',
      },
    },
    {
      id: 6,
      name: 'Tier 6: Threat Detection & Security Decision Engine',
      actor: 'Zero-AI Deterministic Rule Evaluator',
      role: 'Rule-Based Cryptographic Verdict',
      icon: <ShieldAlert className="w-5 h-5 text-rose-400" />,
      color: 'rose',
      description:
        'Evaluates deterministic threshold rules. Any QBER > 11.0% indicates interception or channel tampering. Cross-verifier error > 15.0% detects Alice’s repudiation attempt. Replay attacks are halted by quantum nonce state collapse tracking.',
      mathFormula: '\\text{Security Verdict} = \\begin{cases} \\text{VERIFIED}, & Q \\le 0.11 \\land \\Delta \\le 0.15 \\\\ \\text{REJECTED}, & \\text{otherwise} \\end{cases}',
      hardware: [
        'Strict deterministic decision engine (Strictly Non-AI / Zero ML)',
        'Hardware Security Module (HSM) rule gatekeeper',
        'Atomic quantum nonce revocation registry',
      ],
      dataPayload: {
        active_rules: ['RULE_QBER_01', 'RULE_FIDELITY_01', 'RULE_REPUDIATION_01', 'RULE_REPLAY_01'],
        verdicts: ['LEGITIMATE_VERIFIED', 'FORGERY_REJECTED', 'CHANNEL_COMPROMISED', 'REPLAY_BLOCKED'],
      },
    },
    {
      id: 7,
      name: 'Tier 7: Cryptographic Event Audit & SOC Telemetry',
      actor: 'Audit & Telemetry Subsystem',
      role: 'Forensic Logging & Event Traceability',
      icon: <Database className="w-5 h-5 text-slate-400" />,
      color: 'slate',
      description:
        'Maintains an immutable cryptographic audit record of all state vectors, Bell states measured, Pauli corrections executed, measured error rates, and security verdicts. Exports structured JSON/CSV telemetry for SOC operations.',
      mathFormula: '\\mathcal{L}_{\\text{audit}} = \\{(t_i, \\text{nonce}_i, \\text{QBER}_i, \\text{verdict}_i)\\}',
      hardware: [
        'Append-only cryptographic audit logger',
        'Syslog / SIEM integration interface',
        'Local persistence layer (IndexedDB / localStorage)',
      ],
      dataPayload: {
        retention: 'Persistent audit sessions',
        telemetry_metrics: 'Real-time QBER, fidelity, anomaly counters',
      },
    },
  ];

  const currentTierData = tiers.find(t => t.id === selectedTier) || tiers[0];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400">
              System Architecture
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
            7-Tier Teleportation QDS Architecture
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl font-sans">
            End-to-end multi-tier pipeline connecting quantum state preparation, Bell-state distribution, teleportation feed-forward, deterministic statistical bounds, and threat containment.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <QuantumBadge label="7 Architectural Tiers" variant="cyan" />
          <QuantumBadge label="Zero-AI Guaranteed" variant="purple" />
        </div>
      </div>

      {/* Interactive Multi-Tier Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Vertical Architecture Flow */}
        <div className="lg:col-span-6 space-y-3">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 block mb-2">
            Click Tier to Inspect Technical Specifications:
          </span>

          {tiers.map((tier, idx) => {
            const isSelected = selectedTier === tier.id;
            return (
              <div key={tier.id}>
                <div
                  onClick={() => setSelectedTier(tier.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#0e182f] border-cyan-400 shadow-lg shadow-cyan-950/60 ring-1 ring-cyan-400/50'
                      : 'bg-[#090e1b] border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                      {tier.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-white">
                          {tier.name}
                        </span>
                        {isSelected && (
                          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-cyan-400">
                        {tier.actor}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-mono text-slate-500">
                    {tier.id === 6 ? 'DETERMINISTIC' : `TIER 0${tier.id}`}
                  </span>
                </div>

                {idx < tiers.length - 1 && (
                  <div className="flex justify-center my-1.5">
                    <div className="h-4 w-0.5 bg-gradient-to-b from-cyan-500/60 to-purple-500/60 relative">
                      <ArrowDown className="w-3 h-3 text-cyan-400/80 -left-1.25 absolute top-1" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: Deep Tier Inspector Panel */}
        <div className="lg:col-span-6 space-y-6">
          <div className="glass-panel-glow p-6 rounded-2xl border border-cyan-500/30 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-700/50">
                  {currentTierData.icon}
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 block">
                    TIER SPECIFICATION 0{currentTierData.id}
                  </span>
                  <h3 className="text-lg font-bold font-mono text-white">
                    {currentTierData.name}
                  </h3>
                </div>
              </div>
              <QuantumBadge label={currentTierData.actor} variant="cyan" />
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                Operational Overview
              </h4>
              <p className="text-sm text-slate-300 font-sans leading-relaxed">
                {currentTierData.description}
              </p>
            </div>

            {/* Mathematical Equation */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                Governing Physical & Cryptographic Equation
              </h4>
              <div className="p-4 rounded-xl bg-[#060a14] border border-cyan-900/40 text-center text-cyan-300 overflow-x-auto">
                <MathFormula math={currentTierData.mathFormula} block />
              </div>
            </div>

            {/* Hardware & Physical Abstraction Layer */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                Physical Implementation & Hardware Layer
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
                {currentTierData.hardware.map((hw, i) => (
                  <li key={i} className="flex items-start gap-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                    <span className="text-cyan-400">▹</span>
                    <span>{hw}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Data & Telemetry Attributes */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-purple-400" />
                Telemetry & Signal Payload Parameters
              </h4>
              <div className="bg-[#060a14] p-3 rounded-xl border border-slate-800 font-mono text-xs space-y-1.5">
                {Object.entries(currentTierData.dataPayload).map(([key, val]) => (
                  <div key={key} className="flex justify-between items-center text-slate-400">
                    <span className="text-slate-500 uppercase text-[10px]">{key.replace(/_/g, ' ')}:</span>
                    <span className="text-white font-semibold">
                      {Array.isArray(val) ? val.join(', ') : String(val)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
