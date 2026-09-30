import {
  QuantumStateVector,
  PauliOp,
  BellStateName,
  TeleportationStep,
  AttackConfig
} from '../types/quantum';
import {
  STANDARD_STATES,
  BELL_STATES,
  applyPauli,
  calculateFidelity,
  performProjectiveMeasurement,
  applyDepolarizingNoise,
  createStateFromBloch
} from './math';

export interface TeleportationResult {
  inputState: QuantumStateVector;
  bellStateUsed: BellStateName;
  bsmOutcome: { b1: number; b2: number; bellState: BellStateName };
  classicalBitsSent: string; // "00", "01", "10", "11"
  eveIntercepted: boolean;
  eveMeasurement?: { basis: string; outcome: number };
  stateBeforeCorrection: QuantumStateVector;
  pauliCorrection: PauliOp;
  reconstructedState: QuantumStateVector;
  fidelity: number;
  steps: TeleportationStep[];
}

/**
 * Maps Bell measurement bits (b1, b2) to required Pauli correction on Bob's qubit.
 * b1 b2:
 * 0 0 -> |Phi+> -> Bob has I |psi>     -> Correction: I
 * 0 1 -> |Phi-> -> Bob has Z |psi>     -> Correction: Z
 * 1 0 -> |Psi+> -> Bob has X |psi>     -> Correction: X
 * 1 1 -> |Psi-> -> Bob has XZ/Y |psi>  -> Correction: Y (or X then Z)
 */
export function getPauliCorrection(b1: number, b2: number): PauliOp {
  if (b1 === 0 && b2 === 0) return 'I';
  if (b1 === 0 && b2 === 1) return 'Z';
  if (b1 === 1 && b2 === 0) return 'X';
  return 'Y';
}

/**
 * Step-by-step interactive simulation of Quantum Teleportation
 */
export function simulateTeleportationStepByStep(
  inputState: QuantumStateVector = STANDARD_STATES['|+>'],
  attackConfig?: AttackConfig
): TeleportationResult {
  const steps: TeleportationStep[] = [];

  // Step 1: Input State Preparation
  steps.push({
    stepIndex: 1,
    title: 'Input State Preparation',
    description: `Alice prepares arbitrary quantum state |ψ⟩ = α|0⟩ + β|1⟩ to be teleported.`,
    stateLabel: inputState.label,
    qubit1: `|ψ⟩ = (${inputState.alpha.re.toFixed(3)})|0⟩ + (${inputState.beta.re.toFixed(3)})|1⟩`,
    qubit2: '|0⟩',
    qubit3: '|0⟩',
    fidelity: 1.0,
  });

  // Step 2: Entangled Bell State Distribution
  const bellName: BellStateName = 'PhiPlus';
  const bell = BELL_STATES[bellName];
  steps.push({
    stepIndex: 2,
    title: 'EPR Pair Generation & Distribution',
    description: `Entanglement source generates Bell state |Φ⁺⟩₂₃ = (|00⟩+|11⟩)/√2. Qubit 2 to Alice, Qubit 3 to Bob.`,
    stateLabel: bell.label,
    qubit1: inputState.label,
    qubit2: 'EPR Qubit 2 (Alice)',
    qubit3: 'EPR Qubit 3 (Bob)',
    fidelity: 1.0,
  });

  // Step 3: Check for Quantum Channel Attack / Interception on Qubit 3
  let eveIntercepted = false;
  let eveMeasurement: { basis: string; outcome: number } | undefined;
  let stateCarrier = { ...inputState };

  if (attackConfig && attackConfig.type === 'INTERCEPT_RESEND' && Math.random() < attackConfig.intensity) {
    eveIntercepted = true;
    const basis = attackConfig.eavesdropBasis === 'MATCHED' ? inputState.basis : 'X';
    const meas = performProjectiveMeasurement(stateCarrier, basis);
    eveMeasurement = { basis, outcome: meas.outcome };
    stateCarrier = meas.collapsedState;

    steps.push({
      stepIndex: 3,
      title: 'THREAT: Eavesdropper (Eve) Intercept-Resend',
      description: `Eve intercepts quantum channel qubit, measures in ${basis}-basis (Outcome: ${meas.outcome}), causing state collapse.`,
      stateLabel: 'Collapsed |ψ_Eve⟩',
      qubit1: inputState.label,
      qubit2: 'EPR Qubit 2 (Alice)',
      qubit3: `Collapsed: ${stateCarrier.label}`,
      fidelity: calculateFidelity(inputState, stateCarrier),
    });
  }

  // Channel noise (Depolarizing / Phase flip / Bit flip)
  if (attackConfig && attackConfig.channelNoise > 0) {
    const { noisyState, errorOccurred } = applyDepolarizingNoise(stateCarrier, attackConfig.channelNoise);
    if (errorOccurred) {
      stateCarrier = noisyState;
      steps.push({
        stepIndex: 4,
        title: 'Channel Decoherence / Noise Injected',
        description: `Thermal decoherence and channel noise corrupted qubit transit (η = ${attackConfig.channelNoise.toFixed(2)}).`,
        stateLabel: 'Decohered |ψ_noise⟩',
        qubit1: inputState.label,
        qubit2: 'EPR Qubit 2 (Alice)',
        qubit3: `Decohered: ${stateCarrier.label}`,
        fidelity: calculateFidelity(inputState, stateCarrier),
      });
    }
  }

  // Step 4: Alice Bell-State Measurement (BSM)
  // Alice measures joint system (qubits 1 & 2) in Bell basis.
  // In ideal quantum mechanics, each outcome has probability 1/4 (25%).
  const bellRoll = Math.floor(Math.random() * 4);
  let b1 = 0;
  let b2 = 0;
  let bsmBellState: BellStateName = 'PhiPlus';

  switch (bellRoll) {
    case 0:
      b1 = 0; b2 = 0; bsmBellState = 'PhiPlus';
      break;
    case 1:
      b1 = 0; b2 = 1; bsmBellState = 'PhiMinus';
      break;
    case 2:
      b1 = 1; b2 = 0; bsmBellState = 'PsiPlus';
      break;
    case 3:
      b1 = 1; b2 = 1; bsmBellState = 'PsiMinus';
      break;
  }

  steps.push({
    stepIndex: 5,
    title: 'Alice Bell-State Measurement (BSM)',
    description: `Alice performs joint projective measurement on Qubits 1 & 2 in Bell basis. Outcome: |${bsmBellState}⟩ → Bits: (${b1}, ${b2}).`,
    stateLabel: `|${bsmBellState}⟩`,
    qubit1: 'Collapsed (Measured)',
    qubit2: 'Collapsed (Measured)',
    qubit3: `Entangled collapse state`,
    bsmOutcome: { b1, b2, bellState: bsmBellState },
    fidelity: calculateFidelity(inputState, stateCarrier),
  });

  // Step 5: Classical Transmission & Pauli Unitary Correction
  const pauliOp = getPauliCorrection(b1, b2);

  // Bob's uncorrected state is U_bsm |stateCarrier>
  // To simulate Bob's raw state before correction, we invert the correction:
  const stateBeforeCorrection = applyPauli(stateCarrier, pauliOp);
  // Bob then applies pauliOp: U * (U * stateCarrier) -> stateCarrier
  const reconstructedState = applyPauli(stateBeforeCorrection, pauliOp);

  const finalFidelity = calculateFidelity(inputState, reconstructedState);

  steps.push({
    stepIndex: 6,
    title: 'Pauli Unitary Correction Applied',
    description: `Bob receives classical bits (${b1}, ${b2}) and applies Pauli operator σ_${pauliOp}. State reconstruction fidelity: ${(finalFidelity * 100).toFixed(1)}%.`,
    stateLabel: reconstructedState.label,
    qubit1: 'Measured',
    qubit2: 'Measured',
    qubit3: `Reconstructed |ψ_Bob⟩`,
    pauliCorrection: pauliOp,
    fidelity: finalFidelity,
  });

  return {
    inputState,
    bellStateUsed: bellName,
    bsmOutcome: { b1, b2, bellState: bsmBellState },
    classicalBitsSent: `${b1}${b2}`,
    eveIntercepted,
    eveMeasurement,
    stateBeforeCorrection,
    pauliCorrection: pauliOp,
    reconstructedState,
    fidelity: finalFidelity,
    steps,
  };
}

/**
 * Execute fast teleportation of a single quantum token without building verbose steps
 */
export function executeTeleportationSingleToken(
  inputState: QuantumStateVector,
  attackConfig?: AttackConfig
): {
  reconstructedState: QuantumStateVector;
  bsmBits: { b1: number; b2: number };
  pauliOp: PauliOp;
  eveIntercepted: boolean;
  eveOutcome?: number;
  fidelity: number;
} {
  const bellRoll = Math.floor(Math.random() * 4);
  const b1 = bellRoll >= 2 ? 1 : 0;
  const b2 = bellRoll % 2 === 1 ? 1 : 0;
  const pauliOp = getPauliCorrection(b1, b2);

  let state = { ...inputState };
  let eveIntercepted = false;
  let eveOutcome: number | undefined;

  // Eve Intercept-Resend attack
  if (attackConfig && attackConfig.type === 'INTERCEPT_RESEND' && Math.random() < attackConfig.intensity) {
    eveIntercepted = true;
    const basis = attackConfig.eavesdropBasis === 'MATCHED' ? inputState.basis : (Math.random() < 0.5 ? 'Z' : 'X');
    const meas = performProjectiveMeasurement(state, basis);
    eveOutcome = meas.outcome;
    state = meas.collapsedState;
  }

  // Forgery attempt: Attacker replaces with fake state
  if (attackConfig && attackConfig.type === 'FORGERY_ATTEMPT') {
    eveIntercepted = true;
    // Attacker does not know true basis, generates random state
    const randomTheta = Math.random() * Math.PI;
    const randomPhi = Math.random() * 2 * Math.PI;
    state = createStateFromBloch(randomTheta, randomPhi, '|ψ_forged⟩');
  }

  // Impersonation: Attacker transmits random basis eigenstates
  if (attackConfig && attackConfig.type === 'IMPERSONATION') {
    eveIntercepted = true;
    const randomEigenstates = [
      STANDARD_STATES['|0>'],
      STANDARD_STATES['|1>'],
      STANDARD_STATES['|+>'],
      STANDARD_STATES['|->'],
    ];
    state = randomEigenstates[Math.floor(Math.random() * randomEigenstates.length)];
  }

  // Depolarizing / Channel noise
  if (attackConfig && attackConfig.channelNoise > 0) {
    const { noisyState } = applyDepolarizingNoise(state, attackConfig.channelNoise);
    state = noisyState;
  }

  const fidelity = calculateFidelity(inputState, state);

  return {
    reconstructedState: state,
    bsmBits: { b1, b2 },
    pauliOp,
    eveIntercepted,
    eveOutcome,
    fidelity,
  };
}
