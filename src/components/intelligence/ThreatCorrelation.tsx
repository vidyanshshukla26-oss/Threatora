import React, { useState, useEffect } from 'react';
import {
  Network,
  Search,
  ShieldAlert,
  AlertTriangle,
  Server,
  Globe,
  Tag,
  Clock,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import type { ThreatCorrelationData, ThreatNode, RiskClassification } from '../../types/threatora.ts';

interface ThreatCorrelationProps {
  onInvestigateTarget: (target: string) => void;
}

export const ThreatCorrelation: React.FC<ThreatCorrelationProps> = ({
  onInvestigateTarget
}) => {
  const [data, setData] = useState<ThreatCorrelationData | null>(null);
  const [selectedNode, setSelectedNode] = useState<ThreatNode | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/threat-intelligence/correlation')
      .then(res => res.json())
      .then(d => {
        setData(d);
        if (d.nodes && d.nodes.length > 0) {
          setSelectedNode(d.nodes[3]); // default select paypa1 node
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getNodeColor = (risk: RiskClassification, type: ThreatNode['type']) => {
    if (type === 'brand') return 'bg-violet-950/80 border-violet-500 text-violet-300';
    if (type === 'ip') return 'bg-indigo-950/80 border-indigo-500 text-indigo-300';
    if (type === 'actor') return 'bg-rose-950/80 border-rose-600 text-rose-300';
    if (risk === 'Confirmed Malicious') return 'bg-rose-950/80 border-rose-500 text-rose-300';
    if (risk === 'High Risk') return 'bg-orange-950/80 border-orange-500 text-orange-300';
    return 'bg-amber-950/80 border-amber-500 text-amber-300';
  };

  const filteredNodes = data?.nodes.filter(n => filterType === 'all' || n.type === filterType) || [];

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-8 text-left">
      {/* Header */}
      <div className="space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Network className="w-6 h-6 text-indigo-400" />
          Intelligent Threat Correlation Network
        </h1>
        <p className="text-sm text-slate-400">
          Discover hidden infrastructure links, shared phishlet kits, and multi-incident campaigns.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {['all', 'domain', 'ip', 'brand', 'actor'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg uppercase tracking-wider transition-all ${
                filterType === t
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-[#0D1220] border border-[#273449] text-slate-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-500">
          Click any node to inspect connected threat evidence
        </span>
      </div>

      {/* Interactive Threat Graph & Inspector Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Graph Canvas Visualizer */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#0D1220] border border-[#273449] min-h-[440px] flex flex-col justify-between relative overflow-hidden shadow-xl">
          {/* Faint cybernetic background grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#27344915_1px,transparent_1px),linear-gradient(to_bottom,#27344915_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          {/* Interactive Nodes Matrix */}
          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-[11px] text-cyan-400">
                ACTIVE CLUSTER: FINPHISH-ALPHA INFRASTRUCTURE MESH
              </span>
              <span className="text-[11px] text-slate-500">
                {filteredNodes.length} Nodes Indexed
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredNodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between group ${
                      getNodeColor(node.risk, node.type)
                    } ${
                      isSelected ? 'ring-2 ring-cyan-400 shadow-lg shadow-cyan-500/20 scale-[1.02]' : 'hover:scale-[1.01]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {node.type === 'domain' && <Globe className="w-4 h-4 shrink-0 text-cyan-400" />}
                      {node.type === 'ip' && <Server className="w-4 h-4 shrink-0 text-indigo-400" />}
                      {node.type === 'brand' && <Tag className="w-4 h-4 shrink-0 text-violet-400" />}
                      {node.type === 'actor' && <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />}
                      <span className="text-xs font-mono font-medium truncate">{node.name}</span>
                    </div>
                    <span className="text-[9px] uppercase font-semibold px-2 py-0.5 rounded bg-black/40 border border-white/10 shrink-0">
                      {node.type}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Relationship links summary */}
            <div className="p-4 rounded-xl bg-[#080B14]/80 border border-[#273449] space-y-2 text-xs">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                Infrastructure Linkages & Shared Indicators
              </span>
              <div className="space-y-1.5 font-mono text-[11px]">
                {data?.links.slice(0, 4).map((l, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-300">
                    <span className="text-cyan-400">{l.source}</span>
                    <span className="text-slate-500 text-[10px]">--[{l.label}]--&gt;</span>
                    <span className="text-violet-400">{l.target}</span>
                    <span className={`ml-auto text-[9px] px-1.5 rounded ${
                      l.strength === 'confirmed' ? 'bg-rose-950 text-rose-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {l.strength}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Selected Node Details Panel */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-[#0D1220] border border-[#273449] space-y-4 shadow-xl">
          {selectedNode ? (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
                  Node Inspector
                </span>
                <h3 className="text-base font-bold text-white break-all">
                  {selectedNode.name}
                </h3>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-[#111827] border border-[#273449] flex justify-between">
                  <span className="text-slate-400">Node Classification:</span>
                  <span className="font-semibold text-white">{selectedNode.type.toUpperCase()}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#111827] border border-[#273449] flex justify-between">
                  <span className="text-slate-400">Attributed Risk:</span>
                  <span className="font-semibold text-rose-400">{selectedNode.risk}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#111827] border border-[#273449] flex justify-between">
                  <span className="text-slate-400">Network Connections:</span>
                  <span className="font-mono text-cyan-300">
                    {data?.links.filter(l => l.source === selectedNode.id || l.target === selectedNode.id).length || 1} Links
                  </span>
                </div>
              </div>

              {selectedNode.type === 'domain' && (
                <button
                  onClick={() => onInvestigateTarget(selectedNode.name)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-xs hover:opacity-95 flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <span>Launch Deep Scan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-8 text-center">
              Select a node in the network to inspect its relationships.
            </p>
          )}
        </div>
      </div>

      {/* Related Incidents Timeline */}
      <div className="p-6 rounded-2xl bg-[#0D1220] border border-[#273449] space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          Related Threat Incidents & Timeline
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data?.relatedIncidents.map((inc) => (
            <div
              key={inc.id}
              className="p-4 rounded-xl bg-[#111827] border border-[#273449] space-y-2 text-xs"
            >
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span className="font-mono">{inc.id}</span>
                <span>{inc.date}</span>
              </div>
              <h4 className="text-sm font-bold text-white">{inc.title}</h4>
              <p className="text-slate-400 font-mono text-[11px]">
                Shared Indicator: <span className="text-cyan-300">{inc.sharedIndicator}</span>
              </p>
              <div className="pt-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-950 text-rose-300 border border-rose-500/30">
                  {inc.risk}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
