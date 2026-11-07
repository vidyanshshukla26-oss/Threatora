export type RiskClassification =
  | 'Suspicious'
  | 'High Risk'
  | 'Confirmed Malicious'
  | 'Inconclusive'
  | 'No Known Threats';

export type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';

export type InvestigationType = 'URL' | 'Message' | 'TLS' | 'Website' | 'Correlation';

export interface Finding {
  id: string;
  title: string;
  severity: SeverityLevel;
  explanation: string;
  technicalDetails: string;
  evidenceSource: string;
  whyItMatters: string;
  suggestedAction: string;
  category: 'Domain' | 'URL Structure' | 'Threat Feed' | 'Redirect' | 'TLS' | 'Header' | 'Social Engineering';
}

export interface CheckStatus {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'unavailable' | 'skipped';
  hasFindings: boolean;
  findingsCount: number;
}

export interface EvidenceCoverage {
  totalChecks: number;
  completed: number;
  withFindings: number;
  failedOrUnavailable: number;
  coveragePercentage: number;
}

export interface URLScanResult {
  id: string;
  target: string;
  normalizedUrl: string;
  domain: string;
  timestamp: string;
  riskClassification: RiskClassification;
  summary: string;
  confidence: 'High' | 'Medium' | 'Low';
  evidenceCoverage: EvidenceCoverage;
  checks: CheckStatus[];
  findings: Finding[];
  redirects: {
    hopCount: number;
    chain: { url: string; status: number }[];
    destinationChangedDomain: boolean;
  };
  threatIntel: {
    source: string;
    matched: boolean;
    timestamp: string;
    available: boolean;
    details?: string;
  }[];
  domainInfo: {
    domain: string;
    isIpAddress: boolean;
    hasHomoglyphs: boolean;
    typosquattingTarget?: string;
    entropyScore: number;
    subdomainCount: number;
    tld: string;
    resolvedIps?: string[];
  };
  tlsSummary?: {
    hasHttps: boolean;
    valid: boolean;
    issuer: string;
    validTo: string;
    cipher: string;
  };
  recommendedActions: string[];
  limitations: string[];
  canonicalHash?: string;
}

export interface TLSInspectionResult {
  id: string;
  target: string;
  timestamp: string;
  hasHttps: boolean;
  status: 'Valid' | 'Expired' | 'Invalid' | 'Mismatch' | 'Unable to Verify';
  issuer: {
    commonName: string;
    organization: string;
    country: string;
  };
  subject: {
    commonName: string;
    altNames: string[];
  };
  validity: {
    validFrom: string;
    validTo: string;
    daysRemaining: number;
    isExpired: boolean;
  };
  cryptography: {
    keyAlgorithm: string;
    keySizeBits: number;
    signatureAlgorithm: string;
    cipherSuite: string;
    protocolVersion: string;
  };
  trustChain: {
    level: number;
    subject: string;
    issuer: string;
    trusted: boolean;
  }[];
  transparency: {
    sctCount: number;
    hasEmbeddedSct: boolean;
    status: string;
  };
  caDistrustStatus: {
    isDistrusted: boolean;
    distrustReason?: string;
  };
  findings: Finding[];
  summary: string;
  riskClassification: RiskClassification;
  recommendedActions: string[];
}

export interface ExtractedEntity {
  type: 'url' | 'email' | 'phone' | 'crypto' | 'amount';
  value: string;
  suspicious: boolean;
  note?: string;
}

export interface MessageAnalysisResult {
  id: string;
  inputMessage: string;
  timestamp: string;
  riskClassification: RiskClassification;
  summary: string;
  confidence: 'High' | 'Medium' | 'Low';
  tacticsDetected: {
    urgency: boolean;
    intimidation: boolean;
    financialRequest: boolean;
    otpPasswordHarvesting: boolean;
    fakeKyc: boolean;
    brandImpersonation: boolean;
    unrealisticReward: boolean;
    remoteAccess: boolean;
  };
  extractedEntities: ExtractedEntity[];
  findings: Finding[];
  aiExplanation: string;
  recommendedActions: string[];
  limitations: string[];
}

export interface SecurityHeaderItem {
  name: string;
  present: boolean;
  value?: string;
  severityIfMissing: SeverityLevel;
  recommendation: string;
  description: string;
}

export interface WebsiteSecurityResult {
  id: string;
  target: string;
  timestamp: string;
  riskClassification: RiskClassification;
  summary: string;
  httpsEnforced: boolean;
  headers: SecurityHeaderItem[];
  findings: Finding[];
  serverInfo?: {
    serverHeader?: string;
    poweredBy?: string;
    leaksTechnology: boolean;
  };
  cookies: {
    observedCount: number;
    missingSecure: number;
    missingHttpOnly: number;
    missingSameSite: number;
  };
  recommendedActions: string[];
}

export interface BlockchainThreatReport {
  reportId: string;
  investigationId: string;
  target: string;
  threatCategory: string;
  summary: string;
  indicators: string[];
  hashCommitment: string;
  txHash: string;
  blockNumber: number;
  timestamp: string;
  network: string;
  contractAddress: string;
  reporterAddress: string;
  verified: boolean;
}

export interface ThreatNode {
  id: string;
  name: string;
  type: 'domain' | 'url' | 'ip' | 'incident' | 'brand' | 'actor';
  risk: RiskClassification;
}

export interface ThreatLink {
  source: string;
  target: string;
  label: string;
  strength: 'confirmed' | 'suspected' | 'pattern';
}

export interface ThreatCorrelationData {
  nodes: ThreatNode[];
  links: ThreatLink[];
  relatedIncidents: {
    id: string;
    title: string;
    sharedIndicator: string;
    date: string;
    risk: RiskClassification;
  }[];
}

export interface InvestigationHistoryItem {
  id: string;
  target: string;
  type: InvestigationType;
  risk: RiskClassification;
  date: string;
  status: 'Completed' | 'Processing' | 'Failed';
  summary: string;
  findingsCount: number;
}
