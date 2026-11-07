import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type ScanKind = 'url' | 'message';

interface ScanFinding {
  id: string;
  title: string;
  severity: string;
  explanation: string;
}

interface ScanResult {
  id?: string;
  riskClassification: string;
  summary: string;
  findings: ScanFinding[];
  recommendedActions?: string[];
}

const initialApiUrl = process.env.EXPO_PUBLIC_API_URL ?? '';
const colors = {
  background: '#080B14',
  surface: '#0D1220',
  input: '#111827',
  border: '#273449',
  text: '#F8FAFC',
  muted: '#94A3B8',
  cyan: '#22D3EE',
  violet: '#8B5CF6',
  amber: '#F59E0B',
  red: '#FB7185',
  green: '#34D399',
};

function isScanResult(value: unknown): value is ScanResult {
  if (typeof value !== 'object' || value === null) return false;
  const result = value as Record<string, unknown>;
  return (
    typeof result.riskClassification === 'string' &&
    typeof result.summary === 'string' &&
    Array.isArray(result.findings) &&
    result.findings.every(isScanFinding) &&
    (result.recommendedActions === undefined ||
      (Array.isArray(result.recommendedActions) &&
        result.recommendedActions.every((action) => typeof action === 'string')))
  );
}

function isScanFinding(value: unknown): value is ScanFinding {
  if (typeof value !== 'object' || value === null) return false;
  const finding = value as Record<string, unknown>;
  return (
    typeof finding.title === 'string' &&
    typeof finding.severity === 'string' &&
    typeof finding.explanation === 'string' &&
    (finding.id === undefined || typeof finding.id === 'string')
  );
}

function readError(value: unknown): string | undefined {
  if (typeof value !== 'object' || value === null) return undefined;
  const error = (value as Record<string, unknown>).error;
  return typeof error === 'string' ? error : undefined;
}

export default function App() {
  const [kind, setKind] = useState<ScanKind>('url');
  const [target, setTarget] = useState('');
  const [apiUrl, setApiUrl] = useState(initialApiUrl);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    const cleanTarget = target.trim();
    const baseUrl = apiUrl.trim().replace(/\/+$/, '');
    if (!cleanTarget) {
      setError(kind === 'url' ? 'Enter a URL or domain to scan.' : 'Paste a message to analyze.');
      return;
    }
    if (!baseUrl) {
      setError('Set your deployed API URL or the LAN address of your development server.');
      return;
    }

    let parsedBaseUrl: URL;
    try {
      parsedBaseUrl = new URL(baseUrl);
    } catch {
      setError('Enter a valid API URL, including http:// or https://.');
      return;
    }
    if (parsedBaseUrl.protocol !== 'http:' && parsedBaseUrl.protocol !== 'https:') {
      setError('The API URL must use http:// or https://.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    try {
      const response = await fetch(`${baseUrl}/api/scan/${kind}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(kind === 'url' ? { target: cleanTarget } : { message: cleanTarget }),
      });
      const body: unknown = await response.json();
      if (!response.ok) {
        setError(readError(body) ?? `Request failed (${response.status}).`);
      } else if (!isScanResult(body)) {
        setError('The server returned an unexpected scan result.');
      } else {
        setResult(body);
      }
    } catch {
      setError('Could not reach the API. Check the URL and confirm the server is running.');
    } finally {
      setLoading(false);
    }
  };

  const riskColor = result?.riskClassification === 'No Known Threats'
    ? colors.green
    : result?.riskClassification === 'Suspicious'
      ? colors.amber
      : colors.red;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <View style={styles.brandMark}><Text style={styles.brandMarkText}>T</Text></View>
            <View>
              <Text style={styles.brand}>THREATORA</Text>
              <Text style={styles.tagline}>Mobile threat intelligence</Text>
            </View>
          </View>

          <Text style={styles.heading}>Check before you trust.</Text>
          <Text style={styles.intro}>
            Investigate suspicious links and messages with the Threatora analysis engine.
          </Text>

          <View style={styles.card}>
            <Text style={styles.label}>ANALYSIS TYPE</Text>
            <View style={styles.segment}>
              {(['url', 'message'] as const).map((option) => (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: kind === option }}
                  key={option}
                  onPress={() => {
                    setKind(option);
                    setResult(null);
                    setError('');
                  }}
                  style={[styles.segmentOption, kind === option && styles.segmentSelected]}
                >
                  <Text style={[styles.segmentText, kind === option && styles.segmentTextSelected]}>
                    {option === 'url' ? 'Website / URL' : 'Message'}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={[styles.label, styles.targetLabel]}>
              {kind === 'url' ? 'URL OR DOMAIN' : 'SUSPICIOUS MESSAGE'}
            </Text>
            <TextInput
              accessibilityLabel={kind === 'url' ? 'URL or domain to scan' : 'Message to analyze'}
              multiline={kind === 'message'}
              onChangeText={setTarget}
              placeholder={kind === 'url' ? 'example.com or https://...' : 'Paste a suspicious SMS or email...'}
              placeholderTextColor="#64748B"
              style={[styles.textInput, kind === 'message' && styles.messageInput]}
              textAlignVertical={kind === 'message' ? 'top' : 'center'}
              value={target}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={[styles.label, styles.targetLabel]}>THREATORA API URL</Text>
            <TextInput
              accessibilityLabel="Threatora API URL"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              onChangeText={setApiUrl}
              placeholder="https://your-service.onrender.com"
              placeholderTextColor="#64748B"
              style={styles.textInput}
              value={apiUrl}
            />
            <Text style={styles.helper}>
              Use your Vercel/Render URL, or your computer’s LAN IP when testing in Expo Go.
            </Text>

            <Pressable
              accessibilityRole="button"
              disabled={loading}
              onPress={analyze}
              style={[styles.scanButton, loading && styles.disabledButton]}
            >
              {loading ? (
                <ActivityIndicator color={colors.background} />
              ) : (
                <Text style={styles.scanButtonText}>
                  {kind === 'url' ? 'Scan website' : 'Analyze message'}
                </Text>
              )}
            </Pressable>

            {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
          </View>

          {result ? (
            <View style={styles.card}>
              <Text style={styles.label}>RISK ASSESSMENT</Text>
              <Text style={[styles.risk, { color: riskColor }]}>{result.riskClassification}</Text>
              <Text style={styles.summary}>{result.summary}</Text>
              <Text style={styles.findingCount}>
                {result.findings.length} {result.findings.length === 1 ? 'finding' : 'findings'}
              </Text>
              {result.findings.map((finding, index) => (
                <View key={finding.id || `${finding.title}-${index}`} style={styles.finding}>
                  <Text style={styles.findingTitle}>{finding.title}</Text>
                  <Text style={styles.findingSeverity}>{finding.severity}</Text>
                  <Text style={styles.findingBody}>{finding.explanation}</Text>
                </View>
              ))}
              {result.recommendedActions?.length ? (
                <View style={styles.actions}>
                  <Text style={styles.label}>RECOMMENDED ACTIONS</Text>
                  {result.recommendedActions.map((action, index) => (
                    <Text key={`${index}-${action}`} style={styles.actionText}>• {action}</Text>
                  ))}
                </View>
              ) : null}
            </View>
          ) : null}

          <Text style={styles.footer}>Threatora · Detect deception. Verify trust.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: { padding: 22, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 30, marginTop: 8 },
  brandMark: {
    width: 42, height: 42, borderRadius: 13, backgroundColor: '#18263A',
    borderWidth: 1, borderColor: '#256078', alignItems: 'center', justifyContent: 'center',
  },
  brandMarkText: { color: colors.cyan, fontWeight: '900', fontSize: 22 },
  brand: { color: colors.text, fontSize: 14, fontWeight: '900', letterSpacing: 2 },
  tagline: { color: colors.muted, fontSize: 11, marginTop: 3 },
  heading: { color: colors.text, fontSize: 31, lineHeight: 38, fontWeight: '800', letterSpacing: -0.5 },
  intro: { color: colors.muted, fontSize: 14, lineHeight: 21, marginTop: 8, marginBottom: 22 },
  card: {
    backgroundColor: colors.surface, borderRadius: 20, borderWidth: 1,
    borderColor: colors.border, padding: 18, marginBottom: 16,
  },
  label: { color: '#7C8BA1', fontSize: 10, fontWeight: '800', letterSpacing: 1.4 },
  segment: {
    flexDirection: 'row', padding: 4, marginTop: 10, borderRadius: 12,
    backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border,
  },
  segmentOption: { flex: 1, alignItems: 'center', paddingVertical: 11, borderRadius: 9 },
  segmentSelected: { backgroundColor: '#17243A' },
  segmentText: { color: colors.muted, fontSize: 12, fontWeight: '700' },
  segmentTextSelected: { color: colors.cyan },
  targetLabel: { marginTop: 20, marginBottom: 9 },
  textInput: {
    color: colors.text, backgroundColor: colors.background, borderRadius: 11,
    borderWidth: 1, borderColor: colors.border, paddingHorizontal: 13, paddingVertical: 12,
    fontSize: 13, minHeight: 46,
  },
  messageInput: { minHeight: 120, paddingTop: 13 },
  helper: { color: '#718096', fontSize: 11, lineHeight: 16, marginTop: 7 },
  scanButton: {
    minHeight: 48, borderRadius: 12, backgroundColor: colors.cyan, marginTop: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  disabledButton: { opacity: 0.65 },
  scanButtonText: { color: colors.background, fontSize: 13, fontWeight: '900' },
  error: {
    marginTop: 12, padding: 12, borderRadius: 10, overflow: 'hidden',
    backgroundColor: '#3B1421', color: '#FDA4AF', fontSize: 12, lineHeight: 18,
  },
  risk: { fontSize: 22, fontWeight: '800', marginTop: 9 },
  summary: { color: '#CBD5E1', fontSize: 13, lineHeight: 20, marginTop: 8 },
  findingCount: { color: colors.muted, fontSize: 11, marginTop: 18, marginBottom: 4 },
  finding: {
    paddingVertical: 12, borderTopWidth: 1, borderTopColor: colors.border,
  },
  findingTitle: { color: colors.text, fontSize: 13, fontWeight: '700', paddingRight: 70 },
  findingSeverity: { position: 'absolute', right: 0, top: 12, color: colors.amber, fontSize: 10, fontWeight: '800' },
  findingBody: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 5 },
  actions: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 14, marginTop: 4 },
  actionText: { color: '#CBD5E1', fontSize: 12, lineHeight: 19, marginTop: 7 },
  footer: { color: '#526176', textAlign: 'center', fontSize: 10, marginTop: 12 },
});
