import {
  QDSSignature,
  ThreatEvaluation,
  AttackType,
  AttackConfig
} from '../types/quantum';
import { calculateTheoreticalForgeryProbability } from './math';

export interface ThreatEvaluationInput {
  signature: QDSSignature;
  bobQBER: number;
  charlieQBER: number;
  crossCheckDiscrepancy: number;
  attackConfig?: AttackConfig;
  usedNonces: Set<string>;
}

// Strict Thresholds for Deterministic Rule Engine
export const THREAT_THRESHOLDS = {
  QBER_MAX_LEGITIMATE: 0.11,     // 11.0% maximum QBER for legitimate quantum channel
  QBER_CRITICAL_COLLAPSE: 0.25,   // 25.0% threshold indicating active Intercept-Resend
  QBER_IMPERSONATION: 0.40,       // 40.0% threshold indicating blind forgery / impersonation
  FIDELITY_MIN_LEGITIMATE: 0.89,  // Minimum acceptable reconstruction fidelity
  CROSS_CHECK_MAX_DELTA: 0.15,    // 15.0% maximum discrepancy between Bob and Charlie
  FORGERY_SECURITY_EPSILON: 1e-4, // Required upper bound for theoretical forgery probability
};

/**
 * DETERMINISTIC, NON-AI THREAT DETECTION ENGINE
 * 
 * Implements deterministic rules directly based on:
 * - Quantum No-Cloning Theorem
 * - Heisenberg Uncertainty Principle (conjugate bases)
 * - Bell State Correlation bounds
 * - Projective Measurement Statistics
 * - Classical Symmetrization / Cross-verification limits
 */
export function evaluateThreats(input: ThreatEvaluationInput): ThreatEvaluation {
  const { signature, bobQBER, charlieQBER, crossCheckDiscrepancy, attackConfig, usedNonces } = input;
  const avgQBER = (bobQBER + charlieQBER) / 2;
  const avgFidelity = 1 - avgQBER;
  const L = signature.tokens.length;
  const forgeryProbability = calculateTheoreticalForgeryProbability(L, THREAT_THRESHOLDS.QBER_MAX_LEGITIMATE);

  const triggeredRules: string[] = [];
  let threatDetected = false;
  let severity: 'NORMAL' | 'LOW' | 'ELEVATED' | 'CRITICAL' = 'NORMAL';
  let threatType: AttackType = 'NONE';
  let verdict: ThreatEvaluation['verdict'] = 'LEGITIMATE_VERIFIED';
  let explanation = 'All quantum states teleported and verified within normal decoherence bounds. Deterministic security thresholds satisfied.';
  let recommendedMitigation = 'Accept signature. Proceed with authenticated business transaction.';

  // RULE 1: Quantum Nonce Freshness / Replay Attack Check
  // Quantum states cannot be cloned or re-measured once collapsed
  const isReplay = (attackConfig && attackConfig.type === 'REPLAY_ATTACK') || usedNonces.has(signature.nonce);
  if (isReplay) {
    threatDetected = true;
    threatType = 'REPLAY_ATTACK';
    severity = 'CRITICAL';
    verdict = 'REPLAY_BLOCKED';
    triggeredRules.push(
      `RULE_REPLAY_01: Quantum Nonce collision detected for token ID ${signature.nonce}. Bell pair already consumed and collapsed.`
    );
    explanation = 'Detected Replay Attack. The quantum entangled pairs associated with this signature have already undergone irreversible projective collapse. Token freshness invalid.';
    recommendedMitigation = 'Block verification request immediately. Invalidate session token and notify Security Operations Center of replay attempt.';
    return {
      threatDetected,
      threatType,
      severity,
      qber: avgQBER,
      averageFidelity: avgFidelity,
      crossVerifierDiscrepancy: crossCheckDiscrepancy,
      replayDetected: true,
      forgeryProbability,
      triggeredRules,
      verdict,
      explanation,
      recommendedMitigation,
    };
  }

  // RULE 2: Alice Repudiation Attack (Cross-Verifier Symmetrization Discrepancy)
  if (crossCheckDiscrepancy > THREAT_THRESHOLDS.CROSS_CHECK_MAX_DELTA) {
    threatDetected = true;
    threatType = 'REPUDIATION';
    severity = 'CRITICAL';
    verdict = 'REPUDIATION_DETECTED';
    triggeredRules.push(
      `RULE_REPUDIATION_01: Cross-verifier error discrepancy |Q_Bob - Q_Charlie| = ${(crossCheckDiscrepancy * 100).toFixed(1)}% exceeds threshold ${(THREAT_THRESHOLDS.CROSS_CHECK_MAX_DELTA * 100).toFixed(1)}%.`
    );
    explanation = 'Detected Signer Repudiation Attack. Alice prepared asymmetric quantum states for Bob and Charlie to attempt repudiating the contract after verification.';
    recommendedMitigation = 'Reject signature. Invoke multi-party quantum dispute resolution protocol and penalize sender account.';
    return {
      threatDetected,
      threatType,
      severity,
      qber: avgQBER,
      averageFidelity: avgFidelity,
      crossVerifierDiscrepancy: crossCheckDiscrepancy,
      replayDetected: false,
      forgeryProbability,
      triggeredRules,
      verdict,
      explanation,
      recommendedMitigation,
    };
  }

  // RULE 3: Impersonation / Fake Alice Attack Check (QBER near 50%)
  if (avgQBER >= THREAT_THRESHOLDS.QBER_IMPERSONATION || (attackConfig && attackConfig.type === 'IMPERSONATION')) {
    threatDetected = true;
    threatType = 'IMPERSONATION';
    severity = 'CRITICAL';
    verdict = 'IMPERSONATION_BLOCKED';
    triggeredRules.push(
      `RULE_IMPERSONATION_01: Average QBER (${(avgQBER * 100).toFixed(1)}%) approaches the 50.0% random-guess boundary for orthogonal/conjugate Pauli eigenstates.`
    );
    explanation = 'Detected Quantum Impersonation. The sender lacks the legitimate pre-shared entangled Bell pairs, resulting in random measurement outcomes characteristic of an unauthorized identity.';
    recommendedMitigation = 'Reject signature. Terminate communication channel and flag sender public key certificate.';
    return {
      threatDetected,
      threatType,
      severity,
      qber: avgQBER,
      averageFidelity: avgFidelity,
      crossVerifierDiscrepancy: crossCheckDiscrepancy,
      replayDetected: false,
      forgeryProbability,
      triggeredRules,
      verdict,
      explanation,
      recommendedMitigation,
    };
  }

  // RULE 4: Blind Signature Forgery Check
  if ((attackConfig && attackConfig.type === 'FORGERY_ATTEMPT') || (avgQBER > THREAT_THRESHOLDS.QBER_CRITICAL_COLLAPSE && avgQBER < THREAT_THRESHOLDS.QBER_IMPERSONATION)) {
    threatDetected = true;
    threatType = 'FORGERY_ATTEMPT';
    severity = 'CRITICAL';
    verdict = 'FORGERY_REJECTED';
    triggeredRules.push(
      `RULE_FORGERY_01: State mismatch rate (${(avgQBER * 100).toFixed(1)}%) violates information-theoretic boundary. Attacker forged quantum tokens without secret basis announcement.`
    );
    explanation = 'Detected Signature Forgery. Eve attempted to fabricate teleported tokens without knowing the secret conjugate bases, inducing destructive quantum state collapse.';
    recommendedMitigation = 'Drop forged signature package. Trigger cryptographic alert and isolate verifier node.';
    return {
      threatDetected,
      threatType,
      severity,
      qber: avgQBER,
      averageFidelity: avgFidelity,
      crossVerifierDiscrepancy: crossCheckDiscrepancy,
      replayDetected: false,
      forgeryProbability,
      triggeredRules,
      verdict,
      explanation,
      recommendedMitigation,
    };
  }

  // RULE 5: Quantum Channel Manipulation / Intercept-Resend Attack Check
  if (avgQBER > THREAT_THRESHOLDS.QBER_MAX_LEGITIMATE) {
    threatDetected = true;
    threatType = (attackConfig && attackConfig.type === 'CHANNEL_NOISE') ? 'CHANNEL_NOISE' : 'INTERCEPT_RESEND';
    severity = avgQBER > THREAT_THRESHOLDS.QBER_CRITICAL_COLLAPSE ? 'CRITICAL' : 'ELEVATED';
    verdict = 'CHANNEL_COMPROMISED';
    triggeredRules.push(
      `RULE_QBER_01: Measured QBER (${(avgQBER * 100).toFixed(1)}%) exceeds maximum tolerable channel threshold (${(THREAT_THRESHOLDS.QBER_MAX_LEGITIMATE * 100).toFixed(1)}%).`
    );
    if (avgFidelity < THREAT_THRESHOLDS.FIDELITY_MIN_LEGITIMATE) {
      triggeredRules.push(
        `RULE_FIDELITY_01: Reconstructed quantum state fidelity (${(avgFidelity * 100).toFixed(1)}%) fell below minimal security bound (${(THREAT_THRESHOLDS.FIDELITY_MIN_LEGITIMATE * 100).toFixed(1)}%).`
      );
    }
    explanation = threatType === 'INTERCEPT_RESEND'
      ? 'Detected Active Quantum Channel Eavesdropping (Intercept-Resend). Measurement by Eve in an unaligned basis collapsed the superposition, imparting detectable quantum bit errors.'
      : 'Detected Excessive Quantum Channel Noise / Thermal Decoherence. Channel fidelity compromised beyond reliable verification tolerance.';
    recommendedMitigation = 'Abort verification. Request quantum channel recalibration and re-transmission over clean optical path.';
    return {
      threatDetected,
      threatType,
      severity,
      qber: avgQBER,
      averageFidelity: avgFidelity,
      crossVerifierDiscrepancy: crossCheckDiscrepancy,
      replayDetected: false,
      forgeryProbability,
      triggeredRules,
      verdict,
      explanation,
      recommendedMitigation,
    };
  }

  // If low noise present but within threshold
  if (avgQBER > 0.04) {
    severity = 'LOW';
    triggeredRules.push(
      `RULE_MONITOR_01: Minor quantum channel decoherence detected (${(avgQBER * 100).toFixed(1)}% QBER), within safe bounds.`
    );
  } else {
    triggeredRules.push(
      `RULE_PERFECT_CHANNEL: Near-ideal teleportation fidelity observed (${(avgFidelity * 100).toFixed(1)}%).`
    );
  }

  return {
    threatDetected: false,
    threatType: 'NONE',
    severity,
    qber: avgQBER,
    averageFidelity: avgFidelity,
    crossVerifierDiscrepancy: crossCheckDiscrepancy,
    replayDetected: false,
    forgeryProbability,
    triggeredRules,
    verdict: 'LEGITIMATE_VERIFIED',
    explanation,
    recommendedMitigation,
  };
}
