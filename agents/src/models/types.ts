// ============================================================
// CANZUK Intel Agents — Core Data Model
// ============================================================

export interface SweepRun {
  id: string;
  startedAt: string;
  completedAt: string | null;
  status: 'running' | 'completed' | 'failed';
  searchTermsUsed: string[];
  appsFound: number;
  agentLog: string[];
}

export interface DiscoveredApp {
  id: string;
  sweepId: string;
  appName: string;
  platform: 'apple' | 'google';
  storeUrl: string;
  bundleId: string;
  developer: string;
  ownershipCountry: string;
  hqLocation: string;
  category: string;
  description: string;
  rating: number | null;
  downloadEstimate: string | null;
  releaseDate: string | null;
  lastUpdated: string | null;
  discoveredAt: string;
}

export interface PrivacyPolicyAnalysis {
  id: string;
  appId: string;
  policyUrl: string | null;
  policyText: string | null;
  dataCollected: string[];
  thirdPartySharing: string[];
  retentionPolicy: string | null;
  summary: string;
  analysedAt: string;
}

export interface LegalAssessment {
  id: string;
  appId: string;
  jurisdiction: 'uk' | 'eu';
  icoRegistered: boolean | null;
  gdprCompliant: boolean | null;
  dpiaRequired: boolean | null;
  dataTransferMechanism: string | null;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  findings: string[];
  recommendations: string[];
  assessedAt: string;
}

export interface DisruptionAnalysis {
  id: string;
  appId: string;
  sweepId: string;
  disruptedParties: string[];
  adaptationNeeded: string[];
  keyTechToAdopt: string[];
  threatLevel: 'low' | 'medium' | 'high';
  opportunitySummary: string;
  analysedAt: string;
}

export interface ContactInfo {
  id: string;
  appId: string;
  entityType: 'app_owner' | 'competitor' | 'impacted_party';
  name: string;
  email: string | null;
  phone: string | null;
  website: string | null;
  linkedIn: string | null;
  notes: string | null;
}

export interface StrategicRecommendation {
  id: string;
  sweepId: string;
  appId: string;
  action: 'contact' | 'monitor' | 'adopt_tech' | 'ignore' | 'partner' | 'compete';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  rationale: string;
  suggestedPitch: string | null;
  targetContact: string | null;
  createdAt: string;
}

// Agent execution context
export interface AgentContext {
  sweepId: string;
  dryRun: boolean;
}
