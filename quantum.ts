export type Basis = 'Z' | 'X' | 'Y';

export type PauliOp = 'I' | 'X' | 'Y' | 'Z';

export type BellStateName = 'PhiPlus' | 'PhiMinus' | 'PsiPlus' | 'PsiMinus';

export interface Complex {
  re: number;
  im: number;
}

export interface QuantumStateVector {
  alpha: Complex; // coefficient for |0>
  beta: Complex;  // coefficient for |1>
  theta: number;  // polar angle on Bloch sphere [0, pi]
  phi: number;    // azimuthal angle on Bloch sphere [0, 2pi]
  label: string;  // e.g., "|0>", "|1>", "|+>", "|->", "|+i>", "|-i>", "|psi>"
  basis: Basis;
}

export interface BellState {
  name: BellStateName;
  label: string;
  ket: string;
  description: string;
  probabilities: [number, number, number, number]; // |00>, |01>, |10>, |11>
}

export type AttackType = 
  | 'NONE'
  | 'INTERCEPT_RESEND'
  | 'FORGERY_ATTEMPT'
  | 'IMPERSONATION'
  | 'REPLAY_ATTACK'
  | 'CHANNEL_NOISE'
  | 'REPUDIATION';

export interface AttackConfig {
  type: AttackType;
  name: string;
  intensity: number;      // 0.0 to 1.0 (e.g. Eve tap fraction)
  channelNoise: number;    // 0.0 to 0.5 (depolarizing parameter eta)
  eavesdropBasis: 'MATCHED' | 'RANDOM' | 'CONJUGATE';
  description: string;
}

export interface TeleportationStep {
  stepIndex: number;
  title: string;
  description: string;
  stateLabel: string;
  qubit1: string; // Alice message qubit
  qubit2: string; // Alice EPR qubit
  qubit3: string; // Bob/Charlie EPR qubit
  bsmOutcome?: { b1: number; b2: number; bellState: BellStateName };
  pauliCorrection?: PauliOp;
  fidelity: number;
}

export interface SignatureToken {
  index: number;
  messageBit: number;
  aliceBasis: Basis;
  initialState: QuantumStateVector;
  bellStateUsed: BellStateName;
  bsmOutcome: { b1: number; b2: number };
  interceptedByEve: boolean;
  eveMeasurement?: { basis: Basis; outcome: number };
  bobPauliCorrection: PauliOp;
  bobBasis: Basis;
  bobOutcome: number;
  charliePauliCorrection: PauliOp;
  charlieBasis: Basis;
  charlieOutcome: number;
  bobMatch: boolean;
  charlieMatch: boolean;
  tokenFidelity: number;
}

export interface QDSSignature {
  signatureId: string;
  message: string;
  messageHash: string;
  timestamp: number;
  nonce: string;
  qubitLength: number;
  tokens: SignatureToken[];
  alicePublicKeyHint: string[]; // Announced verification bases
}

export interface ThreatEvaluation {
  threatDetected: boolean;
  threatType: AttackType;
  severity: 'NORMAL' | 'LOW' | 'ELEVATED' | 'CRITICAL';
  qber: number;
  averageFidelity: number;
  crossVerifierDiscrepancy: number; // |QBER_Bob - QBER_Charlie|
  replayDetected: boolean;
  forgeryProbability: number;
  triggeredRules: string[];
  verdict: 'LEGITIMATE_VERIFIED' | 'FORGERY_REJECTED' | 'IMPERSONATION_BLOCKED' | 'CHANNEL_COMPROMISED' | 'REPLAY_BLOCKED' | 'REPUDIATION_DETECTED';
  explanation: string;
  recommendedMitigation: string;
}

export interface VerificationResult {
  signatureId: string;
  bobQBER: number;
  charlieQBER: number;
  averageQBER: number;
  bobFidelity: number;
  charlieFidelity: number;
  mismatchCountBob: number;
  mismatchCountCharlie: number;
  crossCheckDiscrepancy: number;
  nonRepudiationPassed: boolean;
  verificationPassed: boolean;
  threatEvaluation: ThreatEvaluation;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: 'KEYGEN' | 'SIGN' | 'TELEPORT' | 'MEASURE' | 'VERIFY' | 'ATTACK_SIM' | 'SECURITY_ALERT';
  messageSummary: string;
  qubitCount: number;
  attackApplied: AttackType;
  qber: number;
  fidelity: number;
  verdict: string;
  severity: 'NORMAL' | 'LOW' | 'ELEVATED' | 'CRITICAL';
  details: string;
}

export interface SecurityMetrics {
  totalSignaturesGenerated: number;
  totalVerifications: number;
  legitimatePassed: number;
  forgeriesBlocked: number;
  replayAttacksBlocked: number;
  channelAnomaliesDetected: number;
  currentQBER: number;
  currentFidelity: number;
  averageSystemHealth: number; // 0 - 100%
}
