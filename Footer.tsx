import React from 'react';
import { Cpu, ShieldCheck, Terminal, BookOpen, AlertCircle } from 'lucide-react';
import { useQuantumSecurity } from '../../context/QuantumSecurityContext';

export const Footer: React.FC = () => {
  const { setActiveTab } = useQuantumSecurity();

  return (
    <footer className="border-t border-slate-800/80 bg-[#04070e] text-slate-400 py-10 px-4 sm:px-6 lg:px-8 mt-20 font-mono text-xs">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Col 1 */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <span className="font-extrabold text-white text-sm">
              QUANTUM<span className="text-cyan-400">GUARD</span> // QDS
            </span>
          </div>
          <p className="text-slate-400 font-sans leading-relaxed text-xs">
            Cyber Threat Detection Framework for Teleportation-Based Quantum Digital Signatures. Strictly deterministic, non-AI security engine.
          </p>
          <div className="p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-900/40 text-[11px] text-cyan-300">
            <span className="font-semibold block mb-0.5">Disclaimer Notice:</span>
            Quantum-Inspired Simulation / QDS Security Prototype. Evaluates quantum mathematical models in-browser.
          </div>
        </div>

        {/* Col 2 */}
        <div>
          <h4 className="text-slate-200 font-semibold uppercase tracking-wider mb-3 text-xs flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            Core Framework
          </h4>
          <ul className="space-y-2 text-slate-400">
            <li>
              <button onClick={() => setActiveTab('architecture')} className="hover:text-cyan-300 transition-colors">
                System Architecture
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('lab')} className="hover:text-cyan-300 transition-colors">
                Quantum Simulation Lab
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('signature')} className="hover:text-cyan-300 transition-colors">
                Alice Signature Generator
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('verification')} className="hover:text-cyan-300 transition-colors">
                Bob & Charlie Verification
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3 */}
        <div>
          <h4 className="text-slate-200 font-semibold uppercase tracking-wider mb-3 text-xs flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-purple-400" />
            Adversary & Threat Detection
          </h4>
          <ul className="space-y-2 text-slate-400">
            <li>
              <button onClick={() => setActiveTab('threats')} className="hover:text-purple-300 transition-colors">
                Deterministic Threat Engine
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('simulator')} className="hover:text-purple-300 transition-colors">
                Live Attack Simulator
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('analytics')} className="hover:text-purple-300 transition-colors">
                QBER & Fidelity Statistics
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('logs')} className="hover:text-purple-300 transition-colors">
                Cryptographic Audit Trail
              </button>
            </li>
          </ul>
        </div>

        {/* Col 4 */}
        <div>
          <h4 className="text-slate-200 font-semibold uppercase tracking-wider mb-3 text-xs flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            Theory & Standards
          </h4>
          <ul className="space-y-2 text-slate-400">
            <li>
              <button onClick={() => setActiveTab('math')} className="hover:text-emerald-300 transition-colors">
                Mathematical Formulations
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('security')} className="hover:text-emerald-300 transition-colors">
                Comparative Security Matrix
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('docs')} className="hover:text-emerald-300 transition-colors">
                Quantum Cryptography Glossary
              </button>
            </li>
          </ul>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500">
            <span className="flex items-center gap-1 text-slate-400">
              <AlertCircle className="w-3 h-3 text-amber-400" /> Shor-Resistant Defense
            </span>
            Information-theoretic security against infinite computational power.
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
        <div>
          © 2026 Teleportation QDS Threat Detection Framework. Deterministic Rule-Based Architecture.
        </div>
        <div className="flex items-center gap-4 mt-2 sm:mt-0">
          <span className="text-emerald-400">● 100% Client-Side Engine</span>
          <span>● Non-AI Deterministic Evaluator</span>
          <span>● Bell State |Φ⁺⟩ Entangled</span>
        </div>
      </div>
    </footer>
  );
};
