"use client";

import React, { useMemo } from "react";
import { ArrowDown, HelpCircle, Activity } from "lucide-react";
import { useCausalGraph } from "../../hooks/useCausalGraph";

interface CausalGraphPanelProps {
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
  timeElapsed: number;
}

export default function CausalGraphPanel({ 
  selectedNodeId, 
  onSelectNode,
  timeElapsed 
}: CausalGraphPanelProps) {
  const { nodes, edges, selectedNode, upstreamIds, downstreamIds } = useCausalGraph(selectedNodeId);

  // Map replay time to determine node visibility/active status
  const nodeTimeMap: Record<string, number> = {
    "node-vendor-select": 1,
    "node-soc2-missing": 7,
    "node-security-triggered": 36,
    "node-ciso-reject": 19,
    "node-risk-spike": 41,
    "node-nist-fail": 51,
    "node-final-verdict": 60
  };

  const isNodeActive = (nodeId: string) => {
    return timeElapsed >= (nodeTimeMap[nodeId] ?? 0);
  };

  return (
    <div className="space-y-6">
      {/* GRAPH CONTAINER */}
      <div className="bg-[#fffbf2] border-2 border-[#b9b29c]/25 p-5 rounded-sm shadow-sm">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#817a67] font-bold block border-b border-[#b9b29c]/15 pb-2 mb-4">
          // FORENSIC RECONSTRUCTION CAUSAL GRAPH (Directed Relationship Engine)
        </span>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Directed Graph Visual Area */}
          <div className="flex-grow space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {nodes.map((node, index) => {
              const active = isNodeActive(node.id);
              const isSelected = selectedNode?.id === node.id;
              
              // Highlight rules
              const isUpstream = selectedNode && upstreamIds.includes(node.id);
              const isDownstream = selectedNode && downstreamIds.includes(node.id);
              const isHighlighted = isSelected || isUpstream || isDownstream;
              
              // Dim unrelated nodes only if some node is selected
              const isDimmed = selectedNode && !isHighlighted;

              const edgeToNext = edges.find(e => e.sourceId === node.id);
              const isNextActive = edgeToNext && isNodeActive(edgeToNext.targetId);

              return (
                <div key={node.id} className="flex flex-col items-center">
                  {/* Node representation */}
                  <button
                    onClick={() => active && onSelectNode(node.id)}
                    disabled={!active}
                    className={`w-full max-w-xl p-4 rounded-sm border-2 text-left transition-all duration-300 ${
                      !active 
                        ? "opacity-15 bg-stone-50 border-stone-200 text-stone-400 cursor-not-allowed shadow-none"
                        : isSelected
                          ? "bg-[#fff6e0] border-[#715b3e] ring-2 ring-[#715b3e]/30 scale-[1.03] shadow-md text-[#373223] font-bold"
                          : isUpstream || isDownstream
                            ? "bg-[#fffcf7] border-[#715b3e] text-[#373223] scale-[1.01] shadow-sm"
                            : isDimmed
                              ? "opacity-15 bg-stone-50 border-stone-200 text-stone-400 scale-[0.98] shadow-none"
                              : node.impactScore >= 45
                                ? "bg-red-50 border-red-400 text-stone-800 shadow-sm hover:bg-red-100/60"
                                : node.impactScore >= 35
                                  ? "bg-amber-50/60 border-amber-400 text-stone-800 shadow-sm hover:bg-amber-100/60"
                                  : "bg-emerald-50/40 border-emerald-400 text-stone-800 shadow-sm hover:bg-emerald-100/60"
                    }`}
                  >
                    <div className="flex justify-between items-center text-[9px] font-mono font-bold uppercase tracking-wider">
                      <span className="text-[#817a67]">{node.type}</span>
                      {active && (
                        <div className="flex gap-2">
                          <span className="text-emerald-700 font-bold">Conf: {node.confidence}%</span>
                          <span className="text-stone-400">|</span>
                          <span className="text-[#9e422c] font-bold">Impact: {node.impactScore}</span>
                          <span className="text-stone-400">|</span>
                          <span className="text-[#715b3e] font-extrabold">Contrib: {node.verdictContributionPct}%</span>
                        </div>
                      )}
                    </div>
                    <h4 className="text-xs font-bold mt-1 text-stone-800">{node.name}</h4>
                  </button>

                  {/* Edge depiction */}
                  {edgeToNext && index < nodes.length - 1 && (() => {
                    const isEdgeParticipating = selectedNode && isHighlighted && isNextActive && (
                      (selectedNode.id === edgeToNext.sourceId) || 
                      (selectedNode.id === edgeToNext.targetId) ||
                      (upstreamIds.includes(edgeToNext.sourceId) && upstreamIds.includes(edgeToNext.targetId)) ||
                      (downstreamIds.includes(edgeToNext.sourceId) && downstreamIds.includes(edgeToNext.targetId))
                    );

                    return (
                      <div className="w-full max-w-xl flex flex-col items-center py-2 transition-all duration-300">
                        <div className="flex items-center gap-1">
                          <ArrowDown className={`w-4 h-4 transition-all duration-300 ${
                            isEdgeParticipating 
                              ? "text-[#715b3e] stroke-[3.5px] scale-y-110" 
                              : isNextActive 
                                ? "text-stone-300 stroke-[1.5px] opacity-40" 
                                : "text-stone-200/40 stroke-[1px] opacity-10"
                          }`} />
                        </div>
                        <div className={`text-[10px] font-mono max-w-md w-full text-center bg-[#fffbf2] px-3 py-1.5 border-2 rounded-sm mt-1 text-stone-500 shadow-2xs leading-tight transition-all duration-300 ${
                          isEdgeParticipating
                            ? "border-[#715b3e] ring-2 ring-[#715b3e]/20 bg-[#fffaf0] opacity-100 scale-[1.01]"
                            : isNextActive
                              ? "border-stone-200 opacity-20 scale-[0.98]"
                              : "border-stone-200/40 opacity-10 scale-[0.98]"
                        }`}>
                          <div className="font-bold text-stone-750">{edgeToNext.relationship}</div>
                          <div className="flex justify-center gap-2 mt-0.5 text-[8.5px] text-stone-450">
                            <span className="font-semibold text-stone-550">Impact: {edgeToNext.impactMagnitude}</span>
                            <span>&bull;</span>
                            <span>Confidence: {edgeToNext.confidence}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              );
            })}
          </div>

          {/* Causal Analysis side panel */}
          <div className="w-full lg:w-[320px] bg-[#fff9ee] border-2 border-[#b9b29c]/25 p-4 rounded-sm text-xs shrink-0 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="flex items-center gap-2 border-b border-[#b9b29c]/25 pb-2 mb-3">
                <Activity className="w-4 h-4 text-[#715b3e]" />
                <span className="font-mono font-bold uppercase text-stone-800">Causal Analysis</span>
              </div>

              {selectedNode ? (
                <div className="space-y-4">
                  <div>
                    <span className="text-[9px] uppercase font-mono text-stone-400">Selected Node</span>
                    <h5 className="font-bold text-sm text-[#373223]">{selectedNode.name}</h5>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <strong className="text-stone-700 block text-[10px] font-mono uppercase">Direct Consequences:</strong>
                      <ul className="list-disc pl-4 mt-0.5 space-y-1 text-stone-600 font-sans leading-relaxed">
                        {selectedNode.directConsequences.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <strong className="text-stone-700 block text-[10px] font-mono uppercase">Indirect Consequences:</strong>
                      <ul className="list-disc pl-4 mt-0.5 space-y-1 text-stone-600 font-sans leading-relaxed">
                        {selectedNode.indirectConsequences.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-[#b9b29c]/15">
                      <div className="flex justify-between items-center text-[11px] font-mono text-stone-700">
                        <span>Contribution to final verdict:</span>
                        <span className="font-bold text-[#9e422c] text-sm">{selectedNode.verdictContributionPct}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-stone-400 italic py-10 text-center font-mono">
                  Select an active node to query causal relationships...
                </div>
              )}
            </div>

            {selectedNode && (
              <div className="mt-4 pt-3 border-t border-[#b9b29c]/20 text-[10px] font-mono text-stone-500 leading-normal bg-[#fffbf2] p-2 rounded-xs">
                <div><strong>Upstream Causes:</strong> {upstreamIds.length > 0 ? upstreamIds.map(id => id.replace("node-", "")).join(", ") : "None"}</div>
                <div className="mt-1"><strong>Downstream Effects:</strong> {downstreamIds.length > 0 ? downstreamIds.map(id => id.replace("node-", "")).join(", ") : "None"}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
