import { createHash } from 'node:crypto';
import type { Finding, RiskClassification } from '../types/threatora.ts';

// Top impersonated targets in phishing
const NOTABLE_BRANDS = [
  'paypal', 'google', 'microsoft', 'apple', 'amazon',
  'netflix', 'chase', 'wellsfargo', 'bankofamerica',
  'coinbase', 'binance', 'metamask', 'dhl', 'fedex',
  'telegram', 'whatsapp', 'facebook', 'instagram', 'twitter'
];

/**
 * Validates whether an IP address is private, loopback, link-local, or cloud metadata.
 * Mandatory SSRF Protection.
 */
export function isPrivateOrBlockedIP(ip: string): boolean {
  const clean = ip.trim().toLowerCase();

  // IPv6 loopback / unique local / link-local
  if (
    clean === '::1' ||
    clean === '::' ||
    clean.startsWith('fe80:') ||
    clean.startsWith('fc00:') ||
    clean.startsWith('fd00:') ||
    clean.startsWith('::ffff:127.')
  ) {
    return true;
  }

  // IPv4 parse
  const parts = clean.split('.').map(Number);
  if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) {
    return false;
  }

  const [a, b] = parts;

  // 127.0.0.0/8 (Loopback)
  if (a === 127) return true;

  // 10.0.0.0/8 (Private)
  if (a === 10) return true;

  // 172.16.0.0/12 (Private)
  if (a === 172 && b >= 16 && b <= 31) return true;

  // 192.168.0.0/16 (Private)
  if (a === 192 && b === 168) return true;

  // 169.254.0.0/16 (Link-Local & Cloud Metadata, e.g. AWS/GCP 169.254.169.254)
  if (a === 169 && b === 254) return true;

  // 0.0.0.0/8
  if (a === 0) return true;

  // 224.0.0.0/4 (Multicast) or 240.0.0.0/4 (Reserved)
  if (a >= 224) return true;

  return false;
}

/**
 * Validates and normalizes URL or domain string.
 */
export function parseAndNormalizeTarget(input: string): {
  isValid: boolean;
  normalizedUrl: string;
  hostname: string;
  isDomainOnly: boolean;
  protocol: string;
  port?: string;
  pathname: string;
  error?: string;
} {
  const trimmed = input.trim();
  if (!trimmed) {
    return { isValid: false, normalizedUrl: '', hostname: '', isDomainOnly: false, protocol: '', pathname: '', error: 'Target input is empty.' };
  }

  let testUrl = trimmed;
  let isDomainOnly = false;

  // Check if protocol missing
  if (!/^https?:\/\//i.test(testUrl)) {
    isDomainOnly = true;
    testUrl = `https://${testUrl}`;
  }

  try {
    const parsed = new URL(testUrl);
    const hostname = parsed.hostname.toLowerCase();

    // Hostname must contain at least a character or valid IP structure
    if (!hostname || hostname.includes(' ') || hostname.startsWith('.') || hostname.endsWith('.')) {
      return { isValid: false, normalizedUrl: '', hostname: '', isDomainOnly, protocol: '', pathname: '', error: 'Invalid hostname format.' };
    }

    return {
      isValid: true,
      normalizedUrl: parsed.toString(),
      hostname,
      isDomainOnly,
      protocol: parsed.protocol,
      port: parsed.port || (parsed.protocol === 'https:' ? '443' : '80'),
      pathname: parsed.pathname
    };
  } catch {
    return { isValid: false, normalizedUrl: '', hostname: '', isDomainOnly, protocol: '', pathname: '', error: 'Unable to parse target as URL or domain.' };
  }
}

/**
 * Checks for typosquatting, character substitutions (0 -> o, 1 -> l),
 * homoglyphs, or brand imitation.
 */
export function detectBrandImpersonation(hostname: string): {
  isImpersonating: boolean;
  targetBrand?: string;
  technique?: string;
  confidence: 'High' | 'Medium' | 'Low';
} {
  const lower = hostname.toLowerCase();
  const baseDomain = lower.split('.').slice(-2).join('.');
  const sld = lower.split('.').slice(-2, -1)[0] || '';

  // Normalized version replacing common visual leetspeak
  const normalizedSld = sld
    .replace(/0/g, 'o')
    .replace(/1/g, 'l')
    .replace(/5/g, 's')
    .replace(/8/g, 'b')
    .replace(/3/g, 'e')
    .replace(/vv/g, 'w')
    .replace(/rn/g, 'm');

  for (const brand of NOTABLE_BRANDS) {
    // Exact brand match in non-primary official domain (e.g. paypal-login-security.com)
    if (sld !== brand && sld.includes(brand)) {
      return {
        isImpersonating: true,
        targetBrand: brand,
        technique: 'Compound brand token in second-level domain',
        confidence: 'High'
      };
    }

    // Leetspeak / character substitution (e.g. paypa1.com, g00gle.com)
    if (sld !== brand && (normalizedSld === brand || normalizedSld.includes(brand))) {
      return {
        isImpersonating: true,
        targetBrand: brand,
        technique: 'Visual homoglyph / leetspeak character substitution',
        confidence: 'High'
      };
    }

    // Typosquatting by edit distance (e.g., payapl, micorsoft, amzon)
    if (sld !== brand && Math.abs(sld.length - brand.length) <= 1) {
      const dist = levenshteinDistance(sld, brand);
      if (dist === 1) {
        return {
          isImpersonating: true,
          targetBrand: brand,
          technique: 'Single-character typosquatting',
          confidence: 'Medium'
        };
      }
    }
  }

  // Suspicious subdomain targeting (e.g. paypal.com.suspicious-domain.xyz)
  for (const brand of NOTABLE_BRANDS) {
    if (lower.startsWith(`${brand}.`) && !lower.endsWith(`${brand}.com`)) {
      return {
        isImpersonating: true,
        targetBrand: brand,
        technique: 'Deceptive subdomain mimicking official brand domain',
        confidence: 'High'
      };
    }
  }

  return { isImpersonating: false, confidence: 'Low' };
}

/**
 * Classical Levenshtein distance for typosquatting checks.
 */
export function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

/**
 * Calculates Shannon entropy of a domain or string. High entropy indicates random generation (DGA).
 */
export function calculateShannonEntropy(str: string): number {
  if (!str) return 0;
  const len = str.length;
  const freq: Record<string, number> = {};
  for (const c of str) {
    freq[c] = (freq[c] || 0) + 1;
  }
  let entropy = 0;
  for (const c in freq) {
    const p = freq[c] / len;
    entropy -= p * Math.log2(p);
  }
  return Number(entropy.toFixed(3));
}

/**
 * Deterministic canonical SHA-256 commitment hash for Web3 Registry.
 */
export function calculateCanonicalReportHash(payload: {
  target: string;
  category: string;
  summary: string;
  indicators: string[];
  timestamp: string;
}): string {
  // Sort keys deterministically
  const canonicalObject = {
    category: payload.category.trim(),
    indicators: [...payload.indicators].sort(),
    summary: payload.summary.trim(),
    target: payload.target.trim().toLowerCase(),
    timestamp: payload.timestamp
  };
  const jsonStr = JSON.stringify(canonicalObject);
  return '0x' + createHash('sha256').update(jsonStr, 'utf8').digest('hex');
}

/**
 * Master Risk Classification Engine following Threatora specification:
 * - Confirmed Malicious: Supported by authoritative threat intelligence or validated critical indicators
 * - High Risk: Multiple significant indicators suggest substantial security threat
 * - Suspicious: One or more indicators require further investigation
 * - Inconclusive: Insufficient information or unavailable verification sources
 * - No Known Threats: No issues identified by available checks
 */
export function classifyOverallRisk(findings: Finding[], checksUnavailable = false): RiskClassification {
  if (findings.length === 0) {
    return checksUnavailable ? 'Inconclusive' : 'No Known Threats';
  }

  const criticalFindings = findings.filter(f => f.severity === 'Critical');
  const highFindings = findings.filter(f => f.severity === 'High');
  const mediumFindings = findings.filter(f => f.severity === 'Medium');

  // Threat intelligence match or verified direct malicious infrastructure
  const threatFeedMatch = findings.some(
    f => f.category === 'Threat Feed' && (f.severity === 'Critical' || f.severity === 'High')
  );

  if (threatFeedMatch || criticalFindings.length >= 2) {
    return 'Confirmed Malicious';
  }

  if (criticalFindings.length >= 1 || highFindings.length >= 2 || (highFindings.length >= 1 && mediumFindings.length >= 2)) {
    return 'High Risk';
  }

  if (highFindings.length === 1 || mediumFindings.length >= 1) {
    return 'Suspicious';
  }

  return 'No Known Threats';
}
