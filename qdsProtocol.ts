import {
  Basis,
  QuantumStateVector,
  QDSSignature,
  SignatureToken,
  AttackConfig,
  VerificationResult
} from '../types/quantum';
import {
  STANDARD_STATES,
  performProjectiveMeasurement,
  sha256,
  calculateQBER
} from './math';
import { executeTeleportationSingleToken } from './teleportation';
import { evaluateThreats } from './threatDetector';

export interface GenerateSignatureParams {
  message: string;
  qubitLengthPerBit?: number; // e.g. 16, 32, 64 tokens per message bit
  attackConfig?: AttackConfig;
  customNonce?: string;
}

/**
 * Generate a Teleportation-based Quantum Digital Signature
 */
export async function generateQDSSignature({
  message,
  qubitLengthPerBit = 16,
  attackConfig,
  customNonce,
}: GenerateSignatureParams): Promise<QDSSignature> {
  const messageHash = await sha256(message);
  // Take first 4 hex chars = 16 bits of hash to represent message digest
  const hashBits = messageHash
    .slice(0, 4)
    .split('')
    .map(c => parseInt(c, 16).toString(2).padStart(4, '0'))
    .join('')
    .split('')
    .map(Number);

  const totalTokens = Math.min(hashBits.length * (qubitLengthPerBit || 16), 64);
  const tokens: SignatureToken[] = [];
  const alicePublicKeyHint: string[] = [];

  const nonce = customNonce || `NONCE-QDS-${Date.now()}-${Math.floor(Math.random() * 100000).toString(16)}`;

  for (let i = 0; i < totalTokens; i++) {
    const bitIndex = i % hashBits.length;
    const msgBit = hashBits[bitIndex];

    // Alice chooses basis for this token: Z or X
    const aliceBasis: Basis = (i + msgBit) % 2 === 0 ? 'Z' : 'X';
    alicePublicKeyHint.push(aliceBasis);

    // Alice prepares state based on msgBit and private secret
    let initialState: QuantumStateVector;
    if (aliceBasis === 'Z') {
      initialState = msgBit === 0 ? STANDARD_STATES['|0>'] : STANDARD_STATES['|1>'];
    } else {
      initialState = msgBit === 0 ? STANDARD_STATES['|+>'] : STANDARD_STATES['|->'];
    }

    // Teleport to Bob
    const bobTeleport = executeTeleportationSingleToken(initialState, attackConfig);
    // Bob receives classical bits and applies Pauli correction
    const bobPauli = bobTeleport.pauliOp;
    // Bob measures in Alice's announced basis
    const bobMeasurement = performProjectiveMeasurement(bobTeleport.reconstructedState, aliceBasis);

    // Teleport to Charlie (verifier 2 for non-repudiation)
    // Check if Alice is attempting a repudiation attack (sending opposite state to Charlie)
    let charlieInputState = initialState;
    if (attackConfig && attackConfig.type === 'REPUDIATION' && Math.random() < attackConfig.intensity) {
      // Malicious Alice sends inverted state to Charlie to disavow signature later
      charlieInputState = aliceBasis === 'Z' 
        ? (msgBit === 0 ? STANDARD_STATES['|1>'] : STANDARD_STATES['|0>'])
        : (msgBit === 0 ? STANDARD_STATES['|->'] : STANDARD_STATES['|+>']);
    }

    const charlieTeleport = executeTeleportationSingleToken(charlieInputState, attackConfig);
    const charliePauli = charlieTeleport.pauliOp;
    const charlieMeasurement = performProjectiveMeasurement(charlieTeleport.reconstructedState, aliceBasis);

    const expectedOutcome = msgBit;
    const bobMatch = bobMeasurement.outcome === expectedOutcome;
    const charlieMatch = charlieMeasurement.outcome === expectedOutcome;

    tokens.push({
      index: i + 1,
      messageBit: msgBit,
      aliceBasis,
      initialState,
      bellStateUsed: 'PhiPlus',
      bsmOutcome: bobTeleport.bsmBits,
      interceptedByEve: bobTeleport.eveIntercepted || charlieTeleport.eveIntercepted,
      eveMeasurement: bobTeleport.eveOutcome !== undefined ? { basis: aliceBasis, outcome: bobTeleport.eveOutcome } : undefined,
      bobPauliCorrection: bobPauli,
      bobBasis: aliceBasis,
      bobOutcome: bobMeasurement.outcome,
      charliePauliCorrection: charliePauli,
      charlieBasis: aliceBasis,
      charlieOutcome: charlieMeasurement.outcome,
      bobMatch,
      charlieMatch,
      tokenFidelity: (bobTeleport.fidelity + charlieTeleport.fidelity) / 2,
    });
  }

  return {
    signatureId: `SIG-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    message,
    messageHash,
    timestamp: Date.now(),
    nonce,
    qubitLength: totalTokens,
    tokens,
    alicePublicKeyHint,
  };
}

/**
 * Verify a Teleportation-based Quantum Digital Signature
 * Uses STRICTLY DETERMINISTIC, NON-AI statistical rules
 */
export function verifyQDSSignature(
  signature: QDSSignature,
  attackConfig?: AttackConfig,
  usedNonces: Set<string> = new Set()
): VerificationResult {
  const total = signature.tokens.length;
  const expectedBits = signature.tokens.map(t => t.messageBit);
  const bobBits = signature.tokens.map(t => t.bobOutcome);
  const charlieBits = signature.tokens.map(t => t.charlieOutcome);

  const bobQBER = calculateQBER(expectedBits, bobBits);
  const charlieQBER = calculateQBER(expectedBits, charlieBits);
  const averageQBER = (bobQBER + charlieQBER) / 2;

  const bobFidelity = signature.tokens.reduce((acc, t) => acc + (t.bobMatch ? 1 : 0), 0) / total;
  const charlieFidelity = signature.tokens.reduce((acc, t) => acc + (t.charlieMatch ? 1 : 0), 0) / total;

  const mismatchCountBob = signature.tokens.filter(t => !t.bobMatch).length;
  const mismatchCountCharlie = signature.tokens.filter(t => !t.charlieMatch).length;

  const crossCheckDiscrepancy = Math.abs(bobQBER - charlieQBER);

  // Deterministic rule evaluation
  const threatEvaluation = evaluateThreats({
    signature,
    bobQBER,
    charlieQBER,
    crossCheckDiscrepancy,
    attackConfig,
    usedNonces,
  });

  const nonRepudiationPassed = crossCheckDiscrepancy <= 0.15;
  const verificationPassed = threatEvaluation.verdict === 'LEGITIMATE_VERIFIED';

  return {
    signatureId: signature.signatureId,
    bobQBER,
    charlieQBER,
    averageQBER,
    bobFidelity,
    charlieFidelity,
    mismatchCountBob,
    mismatchCountCharlie,
    crossCheckDiscrepancy,
    nonRepudiationPassed,
    verificationPassed,
    threatEvaluation,
  };
}
