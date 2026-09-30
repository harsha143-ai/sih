import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  QDSSignature,
  VerificationResult,
  AttackConfig,
  AuditLogEntry,
  SecurityMetrics,
  AttackType
} from '../types/quantum';
import { generateQDSSignature, verifyQDSSignature } from '../quantum/qdsProtocol';

export type TabType =
  | 'landing'
  | 'architecture'
  | 'lab'
  | 'signature'
  | 'verification'
  | 'threats'
  | 'simulator'
  | 'analytics'
  | 'dashboard'
  | 'logs'
  | 'math'
  | 'security'
  | 'docs';

interface QuantumSecurityContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  attackConfig: AttackConfig;
  setAttackConfig: React.Dispatch<React.SetStateAction<AttackConfig>>;
  currentSignature: QDSSignature | null;
  lastVerificationResult: VerificationResult | null;
  auditLogs: AuditLogEntry[];
  metrics: SecurityMetrics;
  isProcessing: boolean;
  generateNewSignature: (message: string, qubitLength?: number) => Promise<QDSSignature>;
  verifyCurrentSignature: (customAttack?: AttackConfig) => Promise<VerificationResult | null>;
  executeAttackPreset: (presetName: string) => Promise<void>;
  clearLogs: () => void;
  loadBenchmarkScenario: (scenario: string) => void;
}

const DEFAULT_ATTACK_CONFIG: AttackConfig = {
  type: 'NONE',
  name: 'No Adversary (Clean Quantum Channel)',
  intensity: 0.0,
  channelNoise: 0.02, // 2% natural baseline fiber decoherence
  eavesdropBasis: 'RANDOM',
  description: 'Clean authenticated quantum channel with low environmental decoherence.',
};

const QuantumSecurityContext = createContext<QuantumSecurityContextType | undefined>(undefined);

export const QuantumSecurityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabType>('landing');
  const [attackConfig, setAttackConfig] = useState<AttackConfig>(DEFAULT_ATTACK_CONFIG);
  const [currentSignature, setCurrentSignature] = useState<QDSSignature | null>(null);
  const [lastVerificationResult, setLastVerificationResult] = useState<VerificationResult | null>(null);
  const [consumedNonces, setConsumedNonces] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Initial audit logs
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    {
      id: 'LOG-INIT-001',
      timestamp: new Date(Date.now() - 1000 * 60 * 12).toLocaleTimeString(),
      action: 'KEYGEN',
      messageSummary: 'Initialized EPR entangled state distribution source (|Φ⁺⟩)',
      qubitCount: 32,
      attackApplied: 'NONE',
      qber: 0.012,
      fidelity: 0.988,
      verdict: 'SOURCE_STABILIZED',
      severity: 'NORMAL',
      details: 'Bell-state generation rate: 10 MHz. Fiber alignment calibrated to < 1.5% intrinsic optical QBER.',
    },
    {
      id: 'LOG-INIT-002',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toLocaleTimeString(),
      action: 'TELEPORT',
      messageSummary: 'Teleportation channel established: Alice ⟷ Bob & Charlie',
      qubitCount: 32,
      attackApplied: 'NONE',
      qber: 0.018,
      fidelity: 0.982,
      verdict: 'CHANNEL_SYNCHRONIZED',
      severity: 'NORMAL',
      details: 'Dual classical feed-forward feed established. Pauli correction matrix calibrated.',
    },
  ]);

  const [metrics, setMetrics] = useState<SecurityMetrics>({
    totalSignaturesGenerated: 1,
    totalVerifications: 0,
    legitimatePassed: 0,
    forgeriesBlocked: 0,
    replayAttacksBlocked: 0,
    channelAnomaliesDetected: 0,
    currentQBER: 0.015,
    currentFidelity: 0.985,
    averageSystemHealth: 99.2,
  });

  // Generate initial demo signature on mount
  useEffect(() => {
    generateNewSignature('FINANCIAL-TX: Transfer 5,000,000 Q-Credits to Treasury Escrow Vault #714', 16);
  }, []);

  const generateNewSignature = async (message: string, qubitLength: number = 16): Promise<QDSSignature> => {
    setIsProcessing(true);
    try {
      const sig = await generateQDSSignature({
        message,
        qubitLengthPerBit: qubitLength,
        attackConfig,
      });

      setCurrentSignature(sig);
      setMetrics(prev => ({
        ...prev,
        totalSignaturesGenerated: prev.totalSignaturesGenerated + 1,
      }));

      // Log generation
      const logEntry: AuditLogEntry = {
        id: `LOG-GEN-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        timestamp: new Date().toLocaleTimeString(),
        action: 'SIGN',
        messageSummary: `Alice signed: "${message.slice(0, 36)}${message.length > 36 ? '...' : ''}"`,
        qubitCount: sig.qubitLength,
        attackApplied: attackConfig.type,
        qber: 0,
        fidelity: 1.0,
        verdict: 'SIGNATURE_ISSUED',
        severity: 'NORMAL',
        details: `Quantum Nonce: ${sig.nonce}. Bell measurement classical broadcast prepared.`,
      };
      setAuditLogs(prev => [logEntry, ...prev]);

      return sig;
    } finally {
      setIsProcessing(false);
    }
  };

  const verifyCurrentSignature = async (customAttack?: AttackConfig): Promise<VerificationResult | null> => {
    if (!currentSignature) return null;
    setIsProcessing(true);

    try {
      const configToUse = customAttack || attackConfig;
      const result = verifyQDSSignature(currentSignature, configToUse, consumedNonces);
      setLastVerificationResult(result);

      // Register nonce if verified or if replay simulation
      if (result.verificationPassed) {
        setConsumedNonces(prev => new Set(prev).add(currentSignature.nonce));
      }

      // Update metrics
      setMetrics(prev => {
        const isLegit = result.verificationPassed;
        const isForgery = result.threatEvaluation.verdict === 'FORGERY_REJECTED' || result.threatEvaluation.verdict === 'IMPERSONATION_BLOCKED';
        const isReplay = result.threatEvaluation.verdict === 'REPLAY_BLOCKED';
        const isChannel = result.threatEvaluation.verdict === 'CHANNEL_COMPROMISED';

        return {
          ...prev,
          totalVerifications: prev.totalVerifications + 1,
          legitimatePassed: prev.legitimatePassed + (isLegit ? 1 : 0),
          forgeriesBlocked: prev.forgeriesBlocked + (isForgery ? 1 : 0),
          replayAttacksBlocked: prev.replayAttacksBlocked + (isReplay ? 1 : 0),
          channelAnomaliesDetected: prev.channelAnomaliesDetected + (isChannel ? 1 : 0),
          currentQBER: result.averageQBER,
          currentFidelity: (result.bobFidelity + result.charlieFidelity) / 2,
          averageSystemHealth: isLegit ? Math.min(100, prev.averageSystemHealth + 0.5) : Math.max(40, prev.averageSystemHealth - 5),
        };
      });

      // Audit log entry
      const logEntry: AuditLogEntry = {
        id: `LOG-VER-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        timestamp: new Date().toLocaleTimeString(),
        action: result.threatEvaluation.threatDetected ? 'SECURITY_ALERT' : 'VERIFY',
        messageSummary: `Verification of ${currentSignature.signatureId} (${result.threatEvaluation.verdict})`,
        qubitCount: currentSignature.qubitLength,
        attackApplied: configToUse.type,
        qber: result.averageQBER,
        fidelity: (result.bobFidelity + result.charlieFidelity) / 2,
        verdict: result.threatEvaluation.verdict,
        severity: result.threatEvaluation.severity,
        details: result.threatEvaluation.explanation,
      };
      setAuditLogs(prev => [logEntry, ...prev]);

      return result;
    } finally {
      setIsProcessing(false);
    }
  };

  const executeAttackPreset = async (presetName: string) => {
    let presetConfig: AttackConfig;

    switch (presetName) {
      case 'INTERCEPT_RESEND':
        presetConfig = {
          type: 'INTERCEPT_RESEND',
          name: 'Eve Intercept-Resend (Man-in-the-Middle)',
          intensity: 0.85,
          channelNoise: 0.05,
          eavesdropBasis: 'RANDOM',
          description: 'Eve intercepts quantum fiber photons, measures in random conjugate bases (Z vs X), causing state collapse.',
        };
        break;
      case 'FORGERY_ATTEMPT':
        presetConfig = {
          type: 'FORGERY_ATTEMPT',
          name: 'Blind Signature Forgery Attempt',
          intensity: 1.0,
          channelNoise: 0.02,
          eavesdropBasis: 'CONJUGATE',
          description: 'Adversary generates fake quantum tokens without private conjugate basis announcement.',
        };
        break;
      case 'IMPERSONATION':
        presetConfig = {
          type: 'IMPERSONATION',
          name: 'Quantum Impersonation (Fake Signer)',
          intensity: 1.0,
          channelNoise: 0.02,
          eavesdropBasis: 'RANDOM',
          description: 'Unauthorized entity transmits arbitrary Pauli states attempting to pose as Alice.',
        };
        break;
      case 'REPLAY_ATTACK':
        presetConfig = {
          type: 'REPLAY_ATTACK',
          name: 'Quantum Replay Attack (Stale Nonce)',
          intensity: 1.0,
          channelNoise: 0.02,
          eavesdropBasis: 'MATCHED',
          description: 'Attacker captures previously accepted signature and replays collapsed quantum tokens.',
        };
        break;
      case 'REPUDIATION':
        presetConfig = {
          type: 'REPUDIATION',
          name: 'Alice Repudiation Attack',
          intensity: 1.0,
          channelNoise: 0.02,
          eavesdropBasis: 'MATCHED',
          description: 'Malicious Alice prepares orthogonal states for Bob vs Charlie to create a contract dispute.',
        };
        break;
      case 'CHANNEL_NOISE':
        presetConfig = {
          type: 'CHANNEL_NOISE',
          name: 'High Thermal Decoherence / Depolarization',
          intensity: 0.0,
          channelNoise: 0.28,
          eavesdropBasis: 'RANDOM',
          description: 'Optical fiber environmental disturbance exceeding the 11% QBER security threshold.',
        };
        break;
      default:
        presetConfig = DEFAULT_ATTACK_CONFIG;
        break;
    }

    setAttackConfig(presetConfig);
    // Auto-verify with new preset attack to demonstrate immediate detection
    await verifyCurrentSignature(presetConfig);
  };

  const clearLogs = () => {
    setAuditLogs([]);
  };

  const loadBenchmarkScenario = (scenario: string) => {
    if (scenario === 'CLEAN') {
      setAttackConfig(DEFAULT_ATTACK_CONFIG);
      generateNewSignature('AUTHENTICATED_COMMAND: Authorization to deploy orbital sensor array #4', 16);
    } else if (scenario === 'FORGERY') {
      executeAttackPreset('FORGERY_ATTEMPT');
    } else if (scenario === 'EAVESDROP') {
      executeAttackPreset('INTERCEPT_RESEND');
    }
  };

  return (
    <QuantumSecurityContext.Provider
      value={{
        activeTab,
        setActiveTab,
        attackConfig,
        setAttackConfig,
        currentSignature,
        lastVerificationResult,
        auditLogs,
        metrics,
        isProcessing,
        generateNewSignature,
        verifyCurrentSignature,
        executeAttackPreset,
        clearLogs,
        loadBenchmarkScenario,
      }}
    >
      {children}
    </QuantumSecurityContext.Provider>
  );
};

export function useQuantumSecurity() {
  const context = useContext(QuantumSecurityContext);
  if (!context) {
    throw new Error('useQuantumSecurity must be used within a QuantumSecurityProvider');
  }
  return context;
}
