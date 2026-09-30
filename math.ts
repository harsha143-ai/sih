import { Complex, QuantumStateVector, Basis, PauliOp, BellState, BellStateName } from '../types/quantum';

// Complex number utilities
export const C = {
  make: (re: number, im: number = 0): Complex => ({ re, im }),
  add: (a: Complex, b: Complex): Complex => ({ re: a.re + b.re, im: a.im + b.im }),
  sub: (a: Complex, b: Complex): Complex => ({ re: a.re - b.re, im: a.im - b.im }),
  mul: (a: Complex, b: Complex): Complex => ({
    re: a.re * b.re - a.im * b.im,
    im: a.re * b.im + a.im * b.re,
  }),
  scale: (a: Complex, s: number): Complex => ({ re: a.re * s, im: a.im * s }),
  conj: (a: Complex): Complex => ({ re: a.re, im: -a.im }),
  absSq: (a: Complex): number => a.re * a.re + a.im * a.im,
  abs: (a: Complex): number => Math.sqrt(a.re * a.re + a.im * a.im),
};

const INV_SQRT2 = 1 / Math.SQRT2;

// Standard 6 Pauli eigenstates
export const STANDARD_STATES: Record<string, QuantumStateVector> = {
  '|0>': {
    alpha: C.make(1, 0),
    beta: C.make(0, 0),
    theta: 0,
    phi: 0,
    label: '|0>',
    basis: 'Z',
  },
  '|1>': {
    alpha: C.make(0, 0),
    beta: C.make(1, 0),
    theta: Math.PI,
    phi: 0,
    label: '|1>',
    basis: 'Z',
  },
  '|+>': {
    alpha: C.make(INV_SQRT2, 0),
    beta: C.make(INV_SQRT2, 0),
    theta: Math.PI / 2,
    phi: 0,
    label: '|+>',
    basis: 'X',
  },
  '|->': {
    alpha: C.make(INV_SQRT2, 0),
    beta: C.make(-INV_SQRT2, 0),
    theta: Math.PI / 2,
    phi: Math.PI,
    label: '|->',
    basis: 'X',
  },
  '|+i>': {
    alpha: C.make(INV_SQRT2, 0),
    beta: C.make(0, INV_SQRT2),
    theta: Math.PI / 2,
    phi: Math.PI / 2,
    label: '|+i>',
    basis: 'Y',
  },
  '|-i>': {
    alpha: C.make(INV_SQRT2, 0),
    beta: C.make(0, -INV_SQRT2),
    theta: Math.PI / 2,
    phi: (3 * Math.PI) / 2,
    label: '|-i>',
    basis: 'Y',
  },
};

// Create state from Bloch angles (theta, phi)
export function createStateFromBloch(theta: number, phi: number, label = '|ψ>'): QuantumStateVector {
  const alpha = C.make(Math.cos(theta / 2), 0);
  const beta = C.make(Math.sin(theta / 2) * Math.cos(phi), Math.sin(theta / 2) * Math.sin(phi));
  
  let basis: Basis = 'Z';
  if (Math.abs(theta - Math.PI / 2) < 0.1) {
    if (Math.abs(phi) < 0.1 || Math.abs(phi - 2 * Math.PI) < 0.1 || Math.abs(phi - Math.PI) < 0.1) {
      basis = 'X';
    } else if (Math.abs(phi - Math.PI / 2) < 0.1 || Math.abs(phi - 1.5 * Math.PI) < 0.1) {
      basis = 'Y';
    }
  }

  return { alpha, beta, theta, phi, label, basis };
}

// Four maximally entangled Bell states (EPR pairs)
export const BELL_STATES: Record<BellStateName, BellState> = {
  PhiPlus: {
    name: 'PhiPlus',
    label: '|Φ⁺⟩',
    ket: '(|00⟩ + |11⟩) / √2',
    description: 'Even parity, symmetric Bell state (Standard teleportation carrier)',
    probabilities: [0.5, 0, 0, 0.5],
  },
  PhiMinus: {
    name: 'PhiMinus',
    label: '|Φ⁻⟩',
    ket: '(|00⟩ - |11⟩) / √2',
    description: 'Even parity, phase-flipped Bell state',
    probabilities: [0.5, 0, 0, 0.5],
  },
  PsiPlus: {
    name: 'PsiPlus',
    label: '|Ψ⁺⟩',
    ket: '(|01⟩ + |10⟩) / √2',
    description: 'Odd parity, bit-flipped Bell state',
    probabilities: [0, 0.5, 0.5, 0],
  },
  PsiMinus: {
    name: 'PsiMinus',
    label: '|Ψ⁻⟩',
    ket: '(|01⟩ - |10⟩) / √2',
    description: 'Odd parity, antisymmetric singlet Bell state',
    probabilities: [0, 0.5, 0.5, 0],
  },
};

// Quantum State Overlap & Fidelity: F = |<ψ|φ>|²
export function calculateFidelity(state1: QuantumStateVector, state2: QuantumStateVector): number {
  const term1 = C.mul(C.conj(state1.alpha), state2.alpha);
  const term2 = C.mul(C.conj(state1.beta), state2.beta);
  const innerProduct = C.add(term1, term2);
  const fidelity = C.absSq(innerProduct);
  return Math.min(1.0, Math.max(0.0, fidelity));
}

// Apply Pauli operator to a single qubit state
export function applyPauli(state: QuantumStateVector, op: PauliOp): QuantumStateVector {
  let newAlpha: Complex;
  let newBeta: Complex;

  switch (op) {
    case 'I':
      newAlpha = { ...state.alpha };
      newBeta = { ...state.beta };
      break;
    case 'X': // Bit-flip: |0> <-> |1>
      newAlpha = { ...state.beta };
      newBeta = { ...state.alpha };
      break;
    case 'Z': // Phase-flip: |1> -> -|1>
      newAlpha = { ...state.alpha };
      newBeta = C.scale(state.beta, -1);
      break;
    case 'Y': // Bit and phase flip: iY |0> = |1>, iY |1> = -|0>
      // Y = [[0, -i], [i, 0]]
      newAlpha = C.mul(C.make(0, -1), state.beta);
      newBeta = C.mul(C.make(0, 1), state.alpha);
      break;
  }

  // Derive new Bloch angles
  const prob0 = C.absSq(newAlpha);
  const prob1 = C.absSq(newBeta);
  const norm = Math.sqrt(prob0 + prob1) || 1;
  const normalizedAlpha = C.scale(newAlpha, 1 / norm);
  const normalizedBeta = C.scale(newBeta, 1 / norm);

  const theta = 2 * Math.acos(Math.min(1, Math.max(0, C.abs(normalizedAlpha))));
  let phi = 0;
  if (theta > 1e-5 && theta < Math.PI - 1e-5) {
    const phaseAlpha = Math.atan2(normalizedAlpha.im, normalizedAlpha.re);
    const phaseBeta = Math.atan2(normalizedBeta.im, normalizedBeta.re);
    phi = (phaseBeta - phaseAlpha + 4 * Math.PI) % (2 * Math.PI);
  }

  return {
    alpha: normalizedAlpha,
    beta: normalizedBeta,
    theta,
    phi,
    label: `${op}(${state.label})`,
    basis: state.basis,
  };
}

// Projective Measurement in specified Basis (Z, X, Y)
// Returns measurement outcome (0 or 1), probability of that outcome, and collapsed state
export function performProjectiveMeasurement(
  state: QuantumStateVector,
  basis: Basis,
  randomSeed?: number
): { outcome: number; prob0: number; prob1: number; collapsedState: QuantumStateVector } {
  let prob0: number;

  if (basis === 'Z') {
    prob0 = C.absSq(state.alpha);
  } else if (basis === 'X') {
    // Project onto |+> = (|0> + |1>)/sqrt(2)
    const plusAmp = C.scale(C.add(state.alpha, state.beta), INV_SQRT2);
    prob0 = C.absSq(plusAmp);
  } else {
    // Y basis: Project onto |+i> = (|0> + i|1>)/sqrt(2)
    const iBeta = C.mul(C.make(0, 1), state.beta);
    const plusIAmp = C.scale(C.add(state.alpha, iBeta), INV_SQRT2);
    prob0 = C.absSq(plusIAmp);
  }

  prob0 = Math.min(1.0, Math.max(0.0, prob0));
  const prob1 = 1 - prob0;

  const roll = randomSeed !== undefined ? randomSeed : Math.random();
  const outcome = roll < prob0 ? 0 : 1;

  let collapsedState: QuantumStateVector;
  if (basis === 'Z') {
    collapsedState = outcome === 0 ? STANDARD_STATES['|0>'] : STANDARD_STATES['|1>'];
  } else if (basis === 'X') {
    collapsedState = outcome === 0 ? STANDARD_STATES['|+>'] : STANDARD_STATES['|->'];
  } else {
    collapsedState = outcome === 0 ? STANDARD_STATES['|+i>'] : STANDARD_STATES['|-i>'];
  }

  return { outcome, prob0, prob1, collapsedState };
}

// Depolarizing quantum noise channel model
// rho -> (1 - eta) rho + eta * I/2
export function applyDepolarizingNoise(
  state: QuantumStateVector,
  eta: number
): { noisyState: QuantumStateVector; errorOccurred: boolean } {
  if (eta <= 0) return { noisyState: state, errorOccurred: false };

  const roll = Math.random();
  // With prob 1 - eta, state is unchanged
  if (roll > eta) {
    return { noisyState: state, errorOccurred: false };
  }

  // With prob eta, uniform Pauli error: X, Y, or Z with equal prob (1/3 each)
  const errRoll = Math.random();
  let errOp: PauliOp = 'X';
  if (errRoll < 0.333) errOp = 'X';
  else if (errRoll < 0.666) errOp = 'Y';
  else errOp = 'Z';

  return {
    noisyState: applyPauli(state, errOp),
    errorOccurred: true,
  };
}

// Trace distance between two pure single-qubit states
// D(psi, phi) = sqrt(1 - |<psi|phi>|^2) = sqrt(1 - Fidelity)
export function calculateTraceDistance(state1: QuantumStateVector, state2: QuantumStateVector): number {
  const fid = calculateFidelity(state1, state2);
  return Math.sqrt(Math.max(0, 1 - fid));
}

// Quantum Bit Error Rate (QBER)
export function calculateQBER(sentBits: number[], measuredBits: number[]): number {
  if (sentBits.length === 0 || measuredBits.length === 0) return 0;
  const count = Math.min(sentBits.length, measuredBits.length);
  let mismatches = 0;
  for (let i = 0; i < count; i++) {
    if (sentBits[i] !== measuredBits[i]) {
      mismatches++;
    }
  }
  return mismatches / count;
}

// Forgery Probability Bound for QDS
// P_forge <= 2^(-L * (1 - 2 * delta))
export function calculateTheoreticalForgeryProbability(
  qubitLength: number,
  deltaThreshold = 0.11
): number {
  const exponent = -qubitLength * (1 - 2 * deltaThreshold);
  return Math.pow(2, exponent);
}

// Eavesdropper Detection Probability
// In conjugate basis BB84-type distribution, Eve creates an error with probability 1/4 when tapping with intensity eta
// P_detect = 1 - (1 - 0.25 * eta)^L
export function calculateEveDetectProbability(qubitLength: number, tapIntensity: number): number {
  if (tapIntensity <= 0) return 0;
  const probNoDetectPerQubit = 1 - 0.25 * tapIntensity;
  const probNeverDetect = Math.pow(probNoDetectPerQubit, qubitLength);
  return Math.max(0, Math.min(1.0, 1 - probNeverDetect));
}

// Pearson Chi-Squared Test for uniform distribution vs biased measurement outcomes
export function calculateChiSquared(outcomes: number[]): { chiSq: number; pValue: number; isBiased: boolean } {
  if (outcomes.length < 10) return { chiSq: 0, pValue: 1, isBiased: false };
  const total = outcomes.length;
  const count0 = outcomes.filter(x => x === 0).length;
  const count1 = total - count0;
  const expected = total / 2;

  const chiSq = Math.pow(count0 - expected, 2) / expected + Math.pow(count1 - expected, 2) / expected;
  // Approximation for 1 degree of freedom p-value
  const pValue = Math.exp(-chiSq / 2);
  // Significant bias if p < 0.05
  return { chiSq, pValue, isBiased: pValue < 0.05 };
}

// Simple SHA-256 string representation for browser hash
export async function sha256(message: string): Promise<string> {
  try {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    // Deterministic fallback hash for environments without crypto.subtle
    let hash = 0x811c9dc5;
    for (let i = 0; i < message.length; i++) {
      hash ^= message.charCodeAt(i);
      hash = Math.imul(hash, 0x01000193);
    }
    return Math.abs(hash).toString(16).padStart(64, '0');
  }
}
