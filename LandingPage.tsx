import React, { useState } from 'react';
import {
  ShieldCheck,
  Zap,
  Activity,
  ArrowRight,
  Lock,
  Cpu,
  RefreshCw,
  Sliders,
  CheckCircle,
  FileSignature,
  Layers,
  Terminal,
  Calculator,
  Compass,
  Radio,
  EyeOff
} from 'lucide-react';
import { useQuantumSecurity, TabType } from '../../context/QuantumSecurityContext';
import { MetricCard } from '../common/MetricCard';
import { QuantumBadge } from '../common/QuantumBadge';
import { MathFormula } from '../common/MathFormula';

export const LandingPage: React.FC = () => {
  const { setActiveTab, metrics, executeAttackPreset, isProcessing } = useQuantumSecurity();
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);

  const workflowSteps = [
    {
      step: '01',
      title: 'Quantum State Preparation',
      subtitle: 'Alice prepares non-orthogonal conjugate states',
      desc: 'Alice encodes secret signature bits into non-commuting Pauli eigenstates (|0⟩, |1⟩ in Z-basis, |+⟩, |−⟩ in X-basis). By the Heisenberg Uncertainty Principle, measuring in the incorrect basis irrevocably collapses the state.',
      math: '|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle',
      actionTab: 'signature' as TabType,
    },
    {
      step: '02',
      title: 'Bell-State Entanglement',
      subtitle: 'EPR pair distribution to Alice and Verifiers',
      desc: 'An entangled photon pair source distributes maximally entangled Bell pairs |Φ⁺⟩ = (|00⟩+|11⟩)/√2 between Alice and the verifiers (Bob and Charlie).',
      math: '|\\Phi^+\\rangle = \\frac{1}{\\sqrt{2}}(|00\\rangle + |11\\rangle)',
      actionTab: 'lab' as TabType,
    },
    {
      step: '03',
      title: 'Quantum Teleportation',
      subtitle: 'Alice performs Bell State Measurement (BSM)',
      desc: 'Alice performs a joint projective Bell measurement on the message qubit and her half of the EPR pair, projecting them into one of 4 Bell states and transmitting 2 classical bits (b₁, b₂).',
      math: '|\\Psi_{123}\\rangle \\xrightarrow{\\text{BSM}} |\\Phi_i\\rangle_{12} \\otimes U_i|\\psi\\rangle_3',
      actionTab: 'lab' as TabType,
    },
    {
      step: '04',
      title: 'Pauli Correction Operations',
      subtitle: 'Bob & Charlie apply unitary corrections',
      desc: 'Upon receiving classical bits (b₁, b₂), the verifier applies Pauli operator U = Z^{b₁} X^{b₂} ∈ {I, X, Z, Y} to recover the exact original quantum state.',
      math: 'U = \\sigma_z^{b_1} \\sigma_x^{b_2}',
      actionTab: 'verification' as TabType,
    },
    {
      step: '05',
      title: 'Projective Measurement',
      subtitle: 'Measurement in Alice’s announced basis',
      desc: 'Alice announces the verification bases. Bob and Charlie project their reconstructed qubits onto the designated basis (Z or X) and record classical outcome bits.',
      math: 'M_k = |k\\rangle\\langle k|, \\quad P(k) = \\text{Tr}(M_k \\rho)',
      actionTab: 'verification' as TabType,
    },
    {
      step: '06',
      title: 'Statistical Analysis',
      subtitle: 'Deterministic Quantum Bit Error Rate (QBER)',
      desc: 'The system computes empirical error rates Q = (1/N) ∑ I(y_i ≠ x_i), trace distances, state fidelity F = ⟨ψ|ρ|ψ⟩, and Pearson χ² test for non-uniform eavesdropper bias.',
      math: 'Q = \\frac{\\sum_{i=1}^N \\mathbb{I}(x_i \\neq y_i)}{N}',
      actionTab: 'analytics' as TabType,
    },
    {
      step: '07',
      title: 'Forgery Probability Bound',
      subtitle: 'Exponential information-theoretic security',
      desc: 'Adversary guessing probability is strictly bounded by Holevo quantity and state non-orthogonality. Overall forgery probability scales as 2^{-L(1-2δ)}.',
      math: 'P_{\\text{forge}} \\le 2^{-L(1 - 2\\delta_{\\text{th}})}',
      actionTab: 'math' as TabType,
    },
    {
      step: '08',
      title: 'Threshold-Based Verification',
      subtitle: 'Strict QBER upper-bound testing (δ_th = 11%)',
      desc: 'Verification requires QBER ≤ 11.0% (BB84/Shor security threshold) and cross-verifier symmetrization discrepancy |Q_Bob − Q_Charlie| ≤ 15.0%.',
      math: 'Q \\le \\delta_{\\text{th}} \\quad \\land \\quad |Q_B - Q_C| \\le \\Delta_{\\text{th}}',
      actionTab: 'verification' as TabType,
    },
    {
      step: '09',
      title: 'Threat Detection Engine',
      subtitle: 'ZERO AI/ML: Deterministic rule evaluation',
      desc: 'Detects Signature Forgery, Impersonation (QBER ≈ 50%), Replay Attacks (quantum nonce reuse), Eavesdropping (Intercept-Resend), and Alice Repudiation.',
      math: '\\text{Decision} = f_{\\text{rules}}(Q, F, \\Delta, \\text{Nonce})',
      actionTab: 'threats' as TabType,
    },
    {
      step: '10',
      title: 'Security Decision & Event Logging',
      subtitle: 'Cryptographic audit trail with immutable telemetry',
      desc: 'The deterministic verdict (LEGITIMATE_VERIFIED or ATTACK_BLOCKED) is logged with exact Pauli corrections, measurement outcomes, and forensic traces.',
      math: '\\text{AuditLog} \\leftarrow \\{t, \\text{ID}, \\text{Verdict}, Q, F\\}',
      actionTab: 'logs' as TabType,
    },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl glass-panel-glow p-6 sm:p-10 lg:p-12 border border-cyan-500/20">
        {/* Subtle background glow circles */}
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-cyan-600/15 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-purple-600/15 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* Top Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <QuantumBadge label="Teleportation QDS Protocol" variant="cyan" />
            <QuantumBadge label="Deterministic Threat Engine" variant="purple" />
            <QuantumBadge label="ZERO AI / Machine Learning" variant="emerald" pulse />
            <QuantumBadge label="Information-Theoretic Security" variant="slate" />
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white font-mono tracking-tight leading-tight">
            Quantum-Inspired Cyber Threat Detection for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400">
              Teleportation-Based QDS
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto font-sans leading-relaxed">
            The impending arrival of fault-tolerant quantum computing dismantles classical asymmetric cryptography (RSA, ECC) via Shor&apos;s algorithm.
            This framework models <strong className="text-cyan-300">Teleportation-Based Quantum Digital Signatures (QDS)</strong> and deploys a
            deterministic, non-AI cyber threat detection engine utilizing Pauli operators, Bell states, projective measurements, and statistical quantum boundaries.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setActiveTab('signature')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono font-semibold text-sm shadow-lg shadow-cyan-900/50 hover:shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <FileSignature className="w-4 h-4" />
              <span>Generate QDS Signature</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-rose-300 border border-rose-500/40 font-mono font-semibold text-sm shadow-lg shadow-rose-950/40 hover:border-rose-400 transition-all transform hover:-translate-y-0.5"
            >
              <Zap className="w-4 h-4 text-rose-400" />
              <span>Simulate Cyber Attacks</span>
            </button>

            <button
              onClick={() => setActiveTab('lab')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900/70 hover:bg-slate-800/90 text-cyan-300 border border-cyan-800/60 font-mono text-sm hover:border-cyan-500 transition-all"
            >
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Explore Quantum Lab</span>
            </button>
          </div>

          {/* Disclaimer Callout Box */}
          <div className="mt-8 text-left p-4 rounded-xl bg-[#0b1324]/80 border border-cyan-500/30 text-xs font-mono text-slate-300 flex items-start gap-3">
            <div className="p-2 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/50 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-cyan-300 block mb-1">
                SYSTEM CLASSIFICATION: Quantum-Inspired Simulation / QDS Security Prototype
              </span>
              This system mathematically executes quantum state evolution, Bell-state entanglement, Bell State Measurements (BSM), and Pauli unitary correction in-browser.
              Threat detection is performed exclusively using <strong className="text-white">quantum laws (No-Cloning Theorem, Uncertainty Principle) and deterministic statistical thresholds</strong>, with absolutely zero neural networks or heuristic AI classifiers.
            </div>
          </div>
        </div>
      </section>

      {/* Real-time Telemetry Snapshot */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-mono font-semibold uppercase tracking-wider text-slate-300">
              Live System Telemetry & Quantum Parameters
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('dashboard')}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>View SOC Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Channel QBER"
            value={`${(metrics.currentQBER * 100).toFixed(2)}%`}
            subtitle="Security cutoff: 11.0% (BB84 limit)"
            delta={metrics.currentQBER > 0.11 ? 'VIOLATION' : 'NOMINAL'}
            deltaType={metrics.currentQBER > 0.11 ? 'negative' : 'positive'}
            glowColor={metrics.currentQBER > 0.11 ? 'rose' : 'cyan'}
            icon={<Radio className="w-4 h-4" />}
          />
          <MetricCard
            title="State Fidelity"
            value={`${(metrics.currentFidelity * 100).toFixed(1)}%`}
            subtitle="⟨ψ_in | ρ_out | ψ_in⟩ overlap"
            delta={metrics.currentFidelity >= 0.89 ? 'COHERENT' : 'DEGRADED'}
            deltaType={metrics.currentFidelity >= 0.89 ? 'positive' : 'negative'}
            glowColor="emerald"
            icon={<Cpu className="w-4 h-4" />}
          />
          <MetricCard
            title="Total Verifications"
            value={metrics.totalVerifications}
            subtitle={`${metrics.legitimatePassed} Verified / ${metrics.forgeriesBlocked + metrics.replayAttacksBlocked + metrics.channelAnomaliesDetected} Blocked`}
            delta={`Pass ${(metrics.totalVerifications ? (metrics.legitimatePassed / metrics.totalVerifications * 100).toFixed(0) : 100)}%`}
            deltaType="neutral"
            glowColor="purple"
            icon={<ShieldCheck className="w-4 h-4" />}
          />
          <MetricCard
            title="Attacks Mitigated"
            value={metrics.forgeriesBlocked + metrics.replayAttacksBlocked + metrics.channelAnomaliesDetected}
            subtitle="Deterministic rule interventions"
            delta="100% BLOCKED"
            deltaType="positive"
            glowColor="amber"
            icon={<Lock className="w-4 h-4" />}
          />
        </div>
      </section>

      {/* Interactive Workflow Pipeline (Primary Requirement) */}
      <section className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400">
              Interactive Protocol Architecture
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-mono text-white">
            Complete Teleportation-Based QDS Threat Detection Pipeline
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Click any step to inspect its mathematical physics, operational mechanics, and security thresholds.
          </p>
        </div>

        {/* Stepper Buttons Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-1.5 p-2 bg-[#060a13] rounded-xl border border-slate-800/80 mb-6 overflow-x-auto">
          {workflowSteps.map((step, idx) => {
            const isCurrent = activeWorkflowStep === idx;
            return (
              <button
                key={step.step}
                onClick={() => setActiveWorkflowStep(idx)}
                className={`p-2 rounded-lg text-left transition-all ${
                  isCurrent
                    ? 'bg-cyan-500/20 border border-cyan-400/60 text-cyan-300 shadow-md shadow-cyan-950'
                    : 'hover:bg-slate-800/50 text-slate-400 hover:text-white border border-transparent'
                }`}
              >
                <span className="text-[10px] font-mono block opacity-60">STEP {step.step}</span>
                <span className="text-xs font-mono font-semibold line-clamp-1">{step.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Step Detailed Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#0a1020]/90 rounded-xl p-6 border border-cyan-500/20">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-cyan-950 border border-cyan-700/50 text-cyan-300 font-mono text-xs font-bold">
                PHASE {workflowSteps[activeWorkflowStep].step}
              </span>
              <h3 className="text-lg font-bold text-white font-mono">
                {workflowSteps[activeWorkflowStep].title}
              </h3>
            </div>
            <p className="text-xs text-cyan-400 font-mono">
              {workflowSteps[activeWorkflowStep].subtitle}
            </p>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              {workflowSteps[activeWorkflowStep].desc}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveTab(workflowSteps[activeWorkflowStep].actionTab)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono transition-all"
              >
                <span>Open in {workflowSteps[activeWorkflowStep].title}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col justify-center items-center bg-[#060b16] p-4 rounded-xl border border-slate-800 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Mathematical Representation
            </span>
            <div className="text-center p-3 rounded-lg bg-slate-900/80 border border-cyan-900/40 w-full overflow-x-auto text-cyan-300 text-sm">
              <MathFormula math={workflowSteps[activeWorkflowStep].math} block />
            </div>
            <span className="text-[11px] text-slate-500 text-center font-mono">
              Formulated under Hilbert space ℋ₂ ⊗ ℋ₂
            </span>
          </div>
        </div>
      </section>

      {/* Classical RSA/ECC Collapse vs Teleportation QDS */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel rounded-xl p-6 border border-rose-500/20 bg-gradient-to-br from-rose-950/10 to-transparent">
          <div className="flex items-center gap-2 mb-3">
            <EyeOff className="w-5 h-5 text-rose-400" />
            <h3 className="text-base font-bold text-white font-mono">
              The Post-Quantum Vulnerability
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            Classical public-key signatures (RSA-2048, ECDSA P-256) rely on computational hardness assumptions (Integer Factorization and Discrete Logarithms).
            Shor&apos;s algorithm running on a quantum computer solves both in polynomial time:
          </p>
          <div className="p-3 rounded-lg bg-slate-900/80 border border-rose-900/40 text-center text-xs text-rose-300 font-mono mb-4">
            <MathFormula math="\mathcal{O}\left((\log N)^2 (\log \log N) (\log \log \log N)\right)" block />
          </div>
          <ul className="text-xs text-slate-400 space-y-2 list-disc pl-4 font-sans">
            <li>Vulnerable to retroactive decryption (&quot;Harvest Now, Decrypt Later&quot;).</li>
            <li>Computational security is temporary and deteriorates as hardware scales.</li>
            <li>Zero detection mechanism if private key is mathematically derived offline.</li>
          </ul>
        </div>

        <div className="glass-panel rounded-xl p-6 border border-cyan-500/20 bg-gradient-to-br from-cyan-950/10 to-transparent">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white font-mono">
              The Teleportation QDS Advantage
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            Teleportation-Based Quantum Digital Signatures guarantee <strong className="text-cyan-300">information-theoretic security</strong> bounded by physical laws of quantum mechanics:
          </p>
          <div className="p-3 rounded-lg bg-slate-900/80 border border-cyan-900/40 text-center text-xs text-cyan-300 font-mono mb-4">
            <MathFormula math="P_{\text{forge}} \le \exp\left(-2L(\delta_{\text{Bob}} - \delta_{\text{Eve}})^2\right)" block />
          </div>
          <ul className="text-xs text-slate-400 space-y-2 list-disc pl-4 font-sans">
            <li><strong className="text-slate-200">No-Cloning Theorem:</strong> An adversary cannot duplicate unknown quantum signature tokens.</li>
            <li><strong className="text-slate-200">Deterministic Detection:</strong> Interception in non-commuting bases collapses state, imparting a minimum 25% QBER.</li>
            <li><strong className="text-slate-200">Dual-Verifier Non-Repudiation:</strong> Cross-check prevents Alice from disavowing.</li>
          </ul>
        </div>
      </section>

      {/* Interactive Quick Launch Cards */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold font-mono text-white">
            Framework Navigation & Interactive Suites
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              tab: 'lab' as TabType,
              title: 'Quantum Simulation Lab',
              icon: <Cpu className="w-5 h-5 text-cyan-400" />,
              desc: 'Interactive 3D Bloch sphere, 4 Bell states, and step-by-step teleportation circuit simulator.',
            },
            {
              tab: 'signature' as TabType,
              title: 'QDS Signature Generation',
              icon: <FileSignature className="w-5 h-5 text-purple-400" />,
              desc: 'Alice signs arbitrary messages, generates SHA-256 digests, and teleports quantum signature tokens.',
            },
            {
              tab: 'verification' as TabType,
              title: 'Signature Verification',
              icon: <CheckCircle className="w-5 h-5 text-emerald-400" />,
              desc: 'Dual verifiers (Bob and Charlie) apply Pauli corrections, measure projective states, and cross-verify.',
            },
            {
              tab: 'threats' as TabType,
              title: 'Deterministic Threat Engine',
              icon: <ShieldCheck className="w-5 h-5 text-rose-400" />,
              desc: 'Rule matrix enforcing QBER cutoff, fidelity bounds, and quantum nonce replay validation.',
            },
            {
              tab: 'simulator' as TabType,
              title: 'Adversary Attack Simulator',
              icon: <Zap className="w-5 h-5 text-amber-400" />,
              desc: 'Inject Intercept-Resend, Forgery, Impersonation, Replay, and Repudiation attacks in real time.',
            },
            {
              tab: 'analytics' as TabType,
              title: 'Statistical Quantum Analytics',
              icon: <Activity className="w-5 h-5 text-sky-400" />,
              desc: 'Interactive Recharts curves for QBER distribution, trace distance, and Pearson χ² hypothesis testing.',
            },
            {
              tab: 'math' as TabType,
              title: 'Mathematical Formulations',
              icon: <Calculator className="w-5 h-5 text-indigo-400" />,
              desc: 'Density matrices, Kraus noise operators, Holevo information bounds, and KaTeX derivations.',
            },
            {
              tab: 'security' as TabType,
              title: 'Comparative Security Matrix',
              icon: <Lock className="w-5 h-5 text-teal-400" />,
              desc: 'Benchmarking Teleportation QDS vs RSA, ECC, Post-Quantum Cryptography (ML-DSA), and QKD.',
            },
            {
              tab: 'logs' as TabType,
              title: 'Cryptographic Audit Trail',
              icon: <Terminal className="w-5 h-5 text-slate-400" />,
              desc: 'Inspect granular state collapse logs, filter threat events, and export audit data as JSON or CSV.',
            },
          ].map(card => (
            <div
              key={card.tab}
              onClick={() => setActiveTab(card.tab)}
              className="glass-panel p-5 rounded-xl border border-slate-800 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-950/30 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 group-hover:border-cyan-500/40 transition-colors">
                    {card.icon}
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="font-mono font-bold text-white text-sm mb-1 group-hover:text-cyan-300 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  {card.desc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-cyan-400">
                <span>Launch Suite</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
