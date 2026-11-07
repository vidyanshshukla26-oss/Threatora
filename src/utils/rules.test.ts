import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isPrivateOrBlockedIP,
  parseAndNormalizeTarget,
  detectBrandImpersonation,
  calculateShannonEntropy,
  calculateCanonicalReportHash,
  classifyOverallRisk
} from './rules.ts';
import type { Finding } from '../types/threatora.ts';

test('SSRF Protection: blocks private, loopback, and cloud metadata IPs', () => {
  // Loopback
  assert.equal(isPrivateOrBlockedIP('127.0.0.1'), true);
  assert.equal(isPrivateOrBlockedIP('127.255.0.1'), true);
  assert.equal(isPrivateOrBlockedIP('::1'), true);

  // Private subnets
  assert.equal(isPrivateOrBlockedIP('10.0.0.1'), true);
  assert.equal(isPrivateOrBlockedIP('172.16.0.5'), true);
  assert.equal(isPrivateOrBlockedIP('172.31.255.255'), true);
  assert.equal(isPrivateOrBlockedIP('192.168.1.1'), true);

  // AWS/GCP cloud metadata link-local
  assert.equal(isPrivateOrBlockedIP('169.254.169.254'), true);
  assert.equal(isPrivateOrBlockedIP('0.0.0.0'), true);

  // Legitimate public IPs must pass
  assert.equal(isPrivateOrBlockedIP('8.8.8.8'), false);
  assert.equal(isPrivateOrBlockedIP('1.1.1.1'), false);
  assert.equal(isPrivateOrBlockedIP('142.250.190.46'), false);
});

test('Target parser: normalizes domains and URLs', () => {
  const result1 = parseAndNormalizeTarget('github.com');
  assert.equal(result1.isValid, true);
  assert.equal(result1.hostname, 'github.com');
  assert.equal(result1.isDomainOnly, true);
  assert.equal(result1.normalizedUrl, 'https://github.com/');

  const result2 = parseAndNormalizeTarget('https://secure-login.bank.com/auth?token=123');
  assert.equal(result2.isValid, true);
  assert.equal(result2.hostname, 'secure-login.bank.com');
  assert.equal(result2.pathname, '/auth');

  const result3 = parseAndNormalizeTarget('   ');
  assert.equal(result3.isValid, false);
});

test('Brand Impersonation & Typosquatting detection', () => {
  // Leetspeak homoglyph (paypa1)
  const case1 = detectBrandImpersonation('paypa1-account-verify.com');
  assert.equal(case1.isImpersonating, true);
  assert.equal(case1.targetBrand, 'paypal');

  // Deceptive subdomain
  const case2 = detectBrandImpersonation('paypal.com.phish-login.net');
  assert.equal(case2.isImpersonating, true);
  assert.equal(case2.targetBrand, 'paypal');

  // Compound token
  const case3 = detectBrandImpersonation('secure-microsoft-office365-portal.com');
  assert.equal(case3.isImpersonating, true);
  assert.equal(case3.targetBrand, 'microsoft');

  // Legitimate domain
  const case4 = detectBrandImpersonation('google.com');
  assert.equal(case4.isImpersonating, false);
});

test('Shannon entropy calculation', () => {
  const normalDomainEntropy = calculateShannonEntropy('google.com');
  const dgaDomainEntropy = calculateShannonEntropy('x8zq9vk2b7p0m1wz4y.biz');
  assert.ok(dgaDomainEntropy > normalDomainEntropy);
});

test('Canonical SHA-256 Web3 commitment hash is deterministic', () => {
  const payload = {
    target: 'phishing-site.xyz',
    category: 'Phishing',
    summary: 'Credential harvester targeting banking credentials',
    indicators: ['typosquatting', 'fake_tls', 'urgency_lure'],
    timestamp: '2026-11-07T00:00:00Z'
  };

  const hash1 = calculateCanonicalReportHash(payload);
  const hash2 = calculateCanonicalReportHash({
    ...payload,
    // Reorder indicators array
    indicators: ['urgency_lure', 'typosquatting', 'fake_tls']
  });

  assert.equal(hash1, hash2);
  assert.ok(hash1.startsWith('0x'));
  assert.equal(hash1.length, 66); // '0x' + 64 hex characters
});

test('Risk classification engine follows exact Threatora tiers', () => {
  // Empty findings
  assert.equal(classifyOverallRisk([]), 'No Known Threats');
  assert.equal(classifyOverallRisk([], true), 'Inconclusive');

  // Medium finding -> Suspicious
  const mediumFinding: Finding = {
    id: 'f1',
    title: 'Suspicious URL parameter',
    severity: 'Medium',
    explanation: 'Contains base64 redirect',
    technicalDetails: 'param=aHR0c...',
    evidenceSource: 'URL Parser',
    whyItMatters: 'Can bypass inspection',
    suggestedAction: 'Inspect destination',
    category: 'URL Structure'
  };
  assert.equal(classifyOverallRisk([mediumFinding]), 'Suspicious');

  // High finding + Medium -> High Risk
  const highFinding: Finding = {
    id: 'f2',
    title: 'Homoglyph Brand Impersonation',
    severity: 'High',
    explanation: 'Mimicking financial institution',
    technicalDetails: 'paypa1 substituted',
    evidenceSource: 'Domain Inspector',
    whyItMatters: 'Deceives victims',
    suggestedAction: 'Do not enter credentials',
    category: 'Domain'
  };
  assert.equal(classifyOverallRisk([highFinding, mediumFinding, { ...mediumFinding, id: 'f3' }]), 'High Risk');

  // Authoritative threat feed match -> Confirmed Malicious
  const criticalThreatFeed: Finding = {
    id: 'f4',
    title: 'URLhaus Blacklist Match',
    severity: 'Critical',
    explanation: 'Active malware distributor',
    technicalDetails: 'Malware payload hosted at path',
    evidenceSource: 'URLhaus API Feed',
    whyItMatters: 'Direct malware infection risk',
    suggestedAction: 'Block domain immediately',
    category: 'Threat Feed'
  };
  assert.equal(classifyOverallRisk([criticalThreatFeed]), 'Confirmed Malicious');
});
