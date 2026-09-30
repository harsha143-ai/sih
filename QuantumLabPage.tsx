import React, { useState, useEffect, useRef } from 'react';
import {
  Cpu,
  RotateCw,
  Play,
  ArrowRight,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Eye,
  Info
} from 'lucide-react';
import { QuantumBadge } from '../common/QuantumBadge';
import { MathFormula } from '../common/MathFormula';
import {
  STANDARD_STATES,
  BELL_STATES,
  createStateFromBloch,
  calculateFidelity,
  applyPauli
} from '../../quantum/math';
import {
  simulateTeleportationStepByStep,
  TeleportationResult,
  getPauliCorrection
} from '../../quantum/teleportation';
import { QuantumStateVector, BellStateName, PauliOp } from '../../types/quantum';

export const QuantumLabPage: React.FC = () => {
  // Bloch sphere state
  const [theta, setTheta] = useState<number>(Math.PI / 2);
  const [phi, setPhi] = useState<number>(0);
  const [activeStateLabel, setActiveStateLabel] = useState<string>('|+>');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Bell state explorer
  const [selectedBellState, setSelectedBellState] = useState<BellStateName>('PhiPlus');

  // Teleportation circuit simulator
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [teleportResult, setTeleportResult] = useState<TeleportationResult>(() =>
    simulateTeleportationStepByStep(STANDARD_STATES['|+>'])
  );

  // Update quantum state from angles
  const currentState = createStateFromBloch(theta, phi, activeStateLabel);

  const selectPresetState = (label: string) => {
    setActiveStateLabel(label);
    const s = STANDARD_STATES[label];
    if (s) {
      setTheta(s.theta);
      setPhi(s.phi);
    }
  };

  // Render 3D Bloch Sphere onto Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width * 0.38;

    ctx.clearRect(0, 0, width, height);

    // Draw background glow
    const grad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, radius * 1.2);
    grad.addColorStop(0, 'rgba(14, 165, 233, 0.08)');
    grad.addColorStop(1, 'rgba(7, 11, 20, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Outer circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Equatorial ellipse (X-Y plane)
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radius, radius * 0.3, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Axes
    // Z Axis (vertical)
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - radius - 15);
    ctx.lineTo(centerX, centerY + radius + 15);
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
    ctx.stroke();

    // X Axis (diagonal forward)
    ctx.beginPath();
    ctx.moveTo(centerX - radius * 0.7, centerY + radius * 0.25);
    ctx.lineTo(centerX + radius * 0.7, centerY - radius * 0.25);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.stroke();

    // Axis Labels
    ctx.fillStyle = '#a855f7';
    ctx.font = '11px monospace';
    ctx.fillText('|0⟩ (+Z)', centerX + 8, centerY - radius - 4);
    ctx.fillText('|1⟩ (-Z)', centerX + 8, centerY + radius + 14);

    ctx.fillStyle = '#38bdf8';
    ctx.fillText('|+⟩ (+X)', centerX + radius * 0.7 + 5, centerY - radius * 0.25);
    ctx.fillText('|−⟩ (-X)', centerX - radius * 0.7 - 45, centerY + radius * 0.25 + 10);

    // Calculate 3D Cartesian coordinates from Bloch angles (theta, phi)
    // x = r * sin(theta) * cos(phi)
    // y = r * sin(theta) * sin(phi)
    // z = r * cos(theta)
    const sinT = Math.sin(theta);
    const cosT = Math.cos(theta);
    const sinP = Math.sin(phi);
    const cosP = Math.cos(phi);

    // Project onto 2D isometric view
    // Screen X = centerX + radius * (x * cos(30°) - y * sin(30°))
    // Screen Y = centerY - radius * z + radius * 0.3 * (x * sin(30°) + y * cos(30°))
    const projX = centerX + radius * (sinT * cosP * 0.86 - sinT * sinP * 0.4);
    const projY = centerY - radius * cosT + radius * 0.25 * (sinT * cosP * 0.5 + sinT * sinP * 0.86);

    // Vector line from origin to point
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(projX, projY);
    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Vector projection onto XY plane
    const planeProjX = centerX + radius * (sinT * cosP * 0.86 - sinT * sinP * 0.4);
    const planeProjY = centerY + radius * 0.25 * (sinT * cosP * 0.5 + sinT * sinP * 0.86);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(planeProjX, planeProjY);
    ctx.setLineDash([2, 3]);
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.4)';
    ctx.stroke();
    ctx.lineTo(projX, projY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Vector Head (Glowing bead)
    ctx.beginPath();
    ctx.arc(projX, projY, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#00f2fe';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // State Ket Label
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px monospace';
    ctx.fillText(`|ψ⟩`, projX + 10, projY - 6);
  }, [theta, phi]);

  // Teleportation rerun
  const runNewTeleportation = (stateToTeleport?: QuantumStateVector) => {
    const s = stateToTeleport || currentState;
    const res = simulateTeleportationStepByStep(s);
    setTeleportResult(res);
    setCurrentStep(res.steps.length - 1);
  };

  const bell = BELL_STATES[selectedBellState];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400">
              Interactive Quantum Laboratory
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
            State Preparation & Teleportation Circuit Lab
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl font-sans">
            Visually manipulate single-qubit states on the Bloch sphere, inspect all 4 maximally entangled Bell states, and trace step-by-step quantum state evolution through Bell State Measurement (BSM) and Pauli feed-forward correction.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <QuantumBadge label="Bloch Sphere 3D" variant="cyan" />
          <QuantumBadge label="Bell Basis ℋ₂⊗ℋ₂" variant="purple" />
          <QuantumBadge label="Pauli Unitary I,X,Z,Y" variant="emerald" />
        </div>
      </div>

      {/* Part 1: Interactive Bloch Sphere Canvas & Pauli Eigenstates */}
      <section className="glass-panel-glow p-6 sm:p-8 rounded-2xl border border-cyan-500/20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Canvas View */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center p-4 bg-[#050913] rounded-2xl border border-slate-800 relative">
            <div className="absolute top-3 left-4 text-xs font-mono text-cyan-400 font-semibold flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              Bloch Sphere Real-Time Projection
            </div>
            <canvas
              ref={canvasRef}
              width={340}
              height={340}
              className="max-w-full drop-shadow-[0_0_20px_rgba(56,189,248,0.2)]"
            />
            <div className="mt-2 text-[11px] font-mono text-slate-400 text-center">
              Coordinates: θ = {(theta * (180 / Math.PI)).toFixed(1)}°, φ = {(phi * (180 / Math.PI)).toFixed(1)}°
            </div>
          </div>

          {/* Controls & State Math */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-2">
                Standard Pauli Eigenstates (Conjugate Bases)
              </span>
              <div className="grid grid-cols-3 gap-2">
                {Object.keys(STANDARD_STATES).map(key => {
                  const isSelected = activeStateLabel === key;
                  return (
                    <button
                      key={key}
                      onClick={() => selectPresetState(key)}
                      className={`p-2.5 rounded-xl font-mono text-xs font-semibold transition-all border ${
                        isSelected
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-md shadow-cyan-950 ring-1 ring-cyan-400/50'
                          : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      <span className="text-sm block">{key}</span>
                      <span className="text-[10px] text-slate-500 font-normal">
                        {STANDARD_STATES[key].basis}-basis
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-4 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              <div>
                <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                  <span>Polar Angle θ (Z-axis elevation):</span>
                  <span className="text-cyan-400 font-bold">{(theta * (180 / Math.PI)).toFixed(1)}°</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={Math.PI}
                  step={0.02}
                  value={theta}
                  onChange={e => {
                    setTheta(parseFloat(e.target.value));
                    setActiveStateLabel('|ψ⟩');
                  }}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                  <span>Azimuthal Angle φ (X-Y plane rotation):</span>
                  <span className="text-purple-400 font-bold">{(phi * (180 / Math.PI)).toFixed(1)}°</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={2 * Math.PI}
                  step={0.04}
                  value={phi}
                  onChange={e => {
                    setPhi(parseFloat(e.target.value));
                    setActiveStateLabel('|ψ⟩');
                  }}
                  className="w-full accent-purple-400 cursor-pointer"
                />
              </div>
            </div>

            {/* State Vector Breakdown */}
            <div className="p-4 rounded-xl bg-[#060a14] border border-cyan-900/40 text-xs font-mono space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>State Representation:</span>
                <span className="text-white font-bold">
                  |ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Probability P(|0⟩):</span>
                <span className="text-cyan-300 font-semibold">
                  {(Math.cos(theta / 2) ** 2 * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Probability P(|1⟩):</span>
                <span className="text-purple-300 font-semibold">
                  {(Math.sin(theta / 2) ** 2 * 100).toFixed(1)}%
                </span>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => runNewTeleportation(currentState)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono text-xs font-bold transition-all shadow-lg shadow-cyan-950"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Teleport This State via EPR Pair</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Part 2: Bell States Explorer (Entanglement Source) */}
      <section className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              <h2 className="text-lg font-bold font-mono text-white">
                Maximally Entangled Bell State Basis (EPR Pairs)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              The four orthogonal maximally entangled states forming an orthonormal basis of ℋ₂ ⊗ ℋ₂.
            </p>
          </div>
          <QuantumBadge label="Bell-CHSH S = 2√2" variant="purple" />
        </div>

        {/* 4 Bell State Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(Object.keys(BELL_STATES) as BellStateName[]).map(key => {
            const b = BELL_STATES[key];
            const isSelected = selectedBellState === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedBellState(key)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-purple-950/40 border-purple-400 shadow-md shadow-purple-950 text-white ring-1 ring-purple-400/50'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <span className="text-base font-mono font-bold block mb-1">{b.label}</span>
                <span className="text-xs font-mono text-cyan-400 block mb-2">{b.ket}</span>
                <span className="text-[10px] text-slate-500 font-sans line-clamp-2">{b.description}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Bell State Deep Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#060a14] p-5 rounded-xl border border-purple-900/30">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase text-slate-400 block">Density Matrix ρ = |{bell.label}⟩⟨{bell.label}|</span>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-center font-mono text-xs text-purple-300">
              <MathFormula
                math={
                  bell.name === 'PhiPlus'
                    ? '\\frac{1}{2}\\begin{pmatrix} 1 & 0 & 0 & 1 \\\\ 0 & 0 & 0 & 0 \\\\ 0 & 0 & 0 & 0 \\\\ 1 & 0 & 0 & 1 \\end{pmatrix}'
                    : bell.name === 'PhiMinus'
                    ? '\\frac{1}{2}\\begin{pmatrix} 1 & 0 & 0 & -1 \\\\ 0 & 0 & 0 & 0 \\\\ 0 & 0 & 0 & 0 \\\\ -1 & 0 & 0 & 1 \\end{pmatrix}'
                    : bell.name === 'PsiPlus'
                    ? '\\frac{1}{2}\\begin{pmatrix} 0 & 0 & 0 & 0 \\\\ 0 & 1 & 1 & 0 \\\\ 0 & 1 & 1 & 0 \\\\ 0 & 0 & 0 & 0 \\end{pmatrix}'
                    : '\\frac{1}{2}\\begin{pmatrix} 0 & 0 & 0 & 0 \\\\ 0 & 1 & -1 & 0 \\\\ 0 & -1 & 1 & 0 \\\\ 0 & 0 & 0 & 0 \\end{pmatrix}'
                }
                block
              />
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono uppercase text-slate-400 block">Entanglement Measures</span>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Concurrence C(ρ):</span>
                <span className="text-emerald-400 font-bold">1.000 (Maximal)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">von Neumann Entropy S(ρ_A):</span>
                <span className="text-cyan-400 font-bold">1.000 bit</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">CHSH Correlation S:</span>
                <span className="text-purple-300 font-bold">2√2 ≈ 2.828 &gt; 2.0</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono uppercase text-slate-400 block">Teleportation Feed-Forward Mapping</span>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono space-y-1.5 text-slate-300">
              <div className="text-slate-500 text-[11px] mb-1">Classical bits (b₁, b₂) received by Bob:</div>
              <div className="flex justify-between">
                <span className="text-cyan-300">b₁b₂ = 00:</span>
                <span>Unitary σ_I (No correction)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cyan-300">b₁b₂ = 01:</span>
                <span>Unitary σ_z (Phase-flip)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cyan-300">b₁b₂ = 10:</span>
                <span>Unitary σ_x (Bit-flip)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cyan-300">b₁b₂ = 11:</span>
                <span>Unitary σ_y (Bit & Phase)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Part 3: Step-by-Step Teleportation Circuit Visualizer */}
      <section className="glass-panel-glow p-6 sm:p-8 rounded-2xl border border-cyan-500/30 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold font-mono text-white">
                Step-by-Step Quantum Teleportation Circuit
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Trace how quantum information transfers from Alice&apos;s qubit to Bob&apos;s qubit through entanglement and classical feed-forward.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => runNewTeleportation()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/70 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-700/50 text-xs font-mono transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Simulate Again</span>
            </button>
          </div>
        </div>

        {/* Step Progression Bar */}
        <div className="flex items-center justify-between overflow-x-auto gap-2 py-2">
          {teleportResult.steps.map((st, idx) => {
            const isCurrent = currentStep === idx;
            return (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`flex-1 min-w-[120px] p-2.5 rounded-xl border text-center font-mono text-xs transition-all ${
                  isCurrent
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-950'
                    : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-[10px] block opacity-60">PHASE {st.stepIndex}</span>
                <span className="font-semibold line-clamp-1">{st.title}</span>
              </button>
            );
          })}
        </div>

        {/* Current Step Detailed Card */}
        {teleportResult.steps[currentStep] && (
          <div className="bg-[#050a16] p-6 rounded-2xl border border-cyan-500/20 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-700/40 text-xs font-mono font-bold">
                  STEP 0{teleportResult.steps[currentStep].stepIndex}
                </span>
                <h3 className="text-base font-bold font-mono text-white">
                  {teleportResult.steps[currentStep].title}
                </h3>
              </div>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Fidelity: {(teleportResult.steps[currentStep].fidelity * 100).toFixed(1)}%
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
              {teleportResult.steps[currentStep].description}
            </p>

            {/* Qubit State Visualization in 3 lines */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-[10px] uppercase text-slate-500 block mb-1">Qubit 1 (Alice Input)</span>
                <span className="text-cyan-300 font-semibold">{teleportResult.steps[currentStep].qubit1}</span>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-[10px] uppercase text-slate-500 block mb-1">Qubit 2 (Alice EPR Half)</span>
                <span className="text-purple-300 font-semibold">{teleportResult.steps[currentStep].qubit2}</span>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-[10px] uppercase text-slate-500 block mb-1">Qubit 3 (Bob Teleport Target)</span>
                <span className="text-emerald-300 font-semibold">{teleportResult.steps[currentStep].qubit3}</span>
              </div>
            </div>

            {/* BSM & Pauli Correction specifics if present */}
            {teleportResult.steps[currentStep].bsmOutcome && (
              <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/40 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300">
                  BSM Collapse Outcome: <strong className="text-cyan-300">|{teleportResult.steps[currentStep].bsmOutcome.bellState}⟩</strong>
                </span>
                <span className="text-purple-300">
                  Classical Bits (b₁, b₂): <strong>{teleportResult.classicalBitsSent}</strong>
                </span>
              </div>
            )}

            {teleportResult.steps[currentStep].pauliCorrection && (
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300">
                  Unitary Pauli Operator Applied: <strong className="text-emerald-400">σ_{teleportResult.pauliCorrection}</strong>
                </span>
                <span className="text-emerald-300">
                  Final Reconstruction Fidelity: <strong>{(teleportResult.fidelity * 100).toFixed(1)}%</strong>
                </span>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};
