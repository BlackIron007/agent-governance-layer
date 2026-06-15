"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { 
  Play, Pause, RotateCcw, X, ArrowRight, Check, HelpCircle, FileText, Activity, ShieldAlert
} from "lucide-react";
import { useGovernanceReplay } from "../hooks/useGovernanceReplay";
import { useGovernanceAnalysis } from "../hooks/useGovernanceAnalysis";
import { 
  DECISION_DATA, 
  AGENT_VOTES, 
  CONSTITUTION_RULES, 
  CAUSAL_LINKS, 
  EVIDENCE_ARTIFACTS 
} from "../lib/mockGovernanceReplay";
import Navbar from "./Navbar";

// Import GRC sub-components
import DeltaImpactPanel from "./governance/DeltaImpactPanel";
import CrossExaminationPanel from "./governance/CrossExaminationPanel";
import ApprovalFixSetPanel from "./governance/ApprovalFixSetPanel";
import GovernancePositionCard from "./governance/GovernancePositionCard";
import WhatChangedCard from "./governance/WhatChangedCard";

// Import Sprint 6 Governance Reasoning Engine sub-components
import CausalGraphPanel from "./governance/CausalGraphPanel";
import CounterfactualReplayPanel from "./governance/CounterfactualReplayPanel";
import ConfidenceChainPanel from "./governance/ConfidenceChainPanel";
import ConfidenceBreakdownCard from "./governance/ConfidenceBreakdownCard";
import VerdictOwnershipPanel from "./governance/VerdictOwnershipPanel";
import { useCausalGraph } from "../hooks/useCausalGraph";

interface GovernanceReplayModalProps {
  onClose?: () => void;
  isStandalone?: boolean;
}

export default function GovernanceReplayModal({ onClose, isStandalone = false }: GovernanceReplayModalProps) {
  const {
    isPlaying,
    timeElapsed,
    speed,
    currentStage,
    activeEvents,
    telemetry,
    activeArtifacts,
    play,
    pause,
    togglePlay,
    seek,
    restart,
    setSpeed
  } = useGovernanceReplay();

  // Selected state identifiers
  const [selectedArtifactId, setSelectedArtifactId] = useState<string | null>("art-soc2-cert");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>("node-3");
  const [activeTab, setActiveTab] = useState<"causal" | "counterfactual" | "confidence" | "ownership" | "crossexam">("causal");

  const { nodes: causalGraphNodes, selectedNode: activeCausalNode, upstreamIds, downstreamIds } = useCausalGraph(selectedNodeId);

  const causalityNodes = [
    {
      id: "node-1",
      label: "Vendor Selection Recommendation",
      time: 1,
      desc: "AI database procurement proposal to migrate main customer databases to Vendor X database nodes.",
      reason: "Capture operational latency reduction and subscription savings.",
      evidence: "Proposal Payload DEC-1495",
      rule: "N/A",
      impact: "+0 GRC Friction",
      changed: "Approval Odds: 95%",
      downstream: "Latency reduction optimization models",
      voteImpact: "N/A",
      status: "success"
    },
    {
      id: "node-2",
      label: "20% Cost Savings Model",
      time: 9,
      desc: "Financial projection validating savings metric thresholds.",
      reason: "Reduces base subscription run-rates by $120,000 annually.",
      evidence: "Cost Analysis sheet #FIN-294",
      rule: "FIN-CONST-1 (Run-rate Target)",
      impact: "+15% Efficiency Index",
      changed: "CFO vote PENDING -> APPROVE",
      downstream: "CFO budget alignment matrices",
      voteImpact: "CFO support logged",
      status: "success"
    },
    {
      id: "node-3",
      label: "SOC2 Certificate Missing",
      time: 7,
      desc: "Supplier failed mandatory security baseline validation checks.",
      reason: "Supplier Trust API queries returned null/expired records.",
      evidence: "SOC2 Audit Attestation Portal",
      rule: "SEC-CONST-1 (SOC2 Compliance)",
      impact: "+35 Risk Exposure Index",
      changed: "CISO vote APPROVE -> REJECT",
      downstream: "CISO Veto override rules, GDPR indemnity audits",
      voteImpact: "CISO veto triggered",
      status: "error"
    },
    {
      id: "node-4",
      label: "CISO Safety Veto",
      time: 19,
      desc: "CISO enforces security perimeter veto protocol.",
      reason: "Expiring database host certificates present operational hazards.",
      evidence: "Security audit ledger SA-441",
      rule: "SEC-CONST-2 (Vulnerability Scan)",
      impact: "+25 GRC Risk Score / Confidence drops",
      changed: "Approval Probability: 68% -> 42%",
      downstream: "Legal override, compliance vetoes",
      voteImpact: "CISO Veto registered",
      status: "error"
    },
    {
      id: "node-5",
      label: "Constitutional Override Event",
      time: 36,
      desc: "Security Constitution rules override financial directives.",
      reason: "Database access override policies enforce safety constraints.",
      evidence: "GRC Policy Engine Scorecard #CON-882",
      rule: "SEC-CONST-1 (SOC2 Ruleset Veto)",
      impact: "Outage Cascade simulation triggers active status",
      changed: "Consensus: Approve -> Reject",
      downstream: "Monte Carlo outage algorithms",
      voteImpact: "Override enforced",
      status: "error"
    },
    {
      id: "node-6",
      label: "Monte Carlo Failure Risk: 41%",
      time: 41,
      desc: "Transaction simulations predict high service disruption levels.",
      reason: "Downstream infrastructure cascade likelihood rises.",
      evidence: "Simulations Run Output #MC-915",
      rule: "GRC-SIM-04 (Service Availability)",
      impact: "+18 Risk Score / Danger Alert",
      changed: "Confidence Score: 64% -> 45%",
      downstream: "NIST RMF validations",
      voteImpact: "Simulated load warnings logged",
      status: "error"
    },
    {
      id: "node-7",
      label: "Regulatory NIST Failure",
      time: 51,
      desc: "Framework match validates compliance baseline errors.",
      reason: "Missing compliance checks violate AC standards.",
      evidence: "Regulatory Mapping Sheet #REG-02",
      rule: "NIST AC-1 controls standard GRC requirement",
      impact: "EU AI Act safety warning active",
      changed: "Approval Probability: 38% -> 12%",
      downstream: "Verdict Synthesizer Ingress",
      voteImpact: "Regulatory block locked",
      status: "error"
    },
    {
      id: "node-8",
      label: "GRC Verdict: BLOCKED",
      time: 60,
      desc: "Immutable ledger record finalized.",
      reason: "Subsystem consensus checks resolve to safety overrides.",
      evidence: "Sealed GRC Verification Ledger",
      rule: "GRC-CORE-VERDICT",
      impact: "Final Status: BLOCKED",
      changed: "Verdict Lock active / ledger hash sealed",
      downstream: "Forensic explanation logs archived",
      voteImpact: "DEC-1495 blocked",
      status: "error"
    }
  ];

  // Auto-set selected node based on playback time
  const currentActiveNode = useMemo(() => {
    const active = causalityNodes.filter((n) => timeElapsed >= n.time);
    return active[active.length - 1] || causalityNodes[0];
  }, [timeElapsed]);

  useEffect(() => {
    if (isPlaying) {
      setSelectedNodeId(currentActiveNode.id);
    }
  }, [currentActiveNode, isPlaying]);

  // Governance Analysis Hook subscription
  const {
    deltaMetrics,
    crossExam,
    rejectionDrivers,
    minimalFixSet,
    counterfactualOutcome
  } = useGovernanceAnalysis(selectedNodeId);

  const activeNodeDetails = useMemo(() => {
    return causalityNodes.find((n) => n.id === selectedNodeId) || currentActiveNode;
  }, [selectedNodeId, currentActiveNode]);

  const selectedArtifact = useMemo(() => {
    return EVIDENCE_ARTIFACTS.find((a) => a.id === selectedArtifactId) || EVIDENCE_ARTIFACTS[2];
  }, [selectedArtifactId]);

  return (
    <div className={`w-full ${isStandalone ? "" : "fixed inset-0 z-[120] flex items-center justify-center p-4 bg-[#23211b]/80 backdrop-blur-md"}`}>
      <div 
        className="w-full max-w-[1580px] bg-[#fff9ee] border border-[#b9b29c]/35 shadow-2xl flex flex-col overflow-hidden h-[95vh] rounded-sm text-[#373223]"
      >
        {/* HEADER */}
        <header className="bg-[#fffbf2] border-b border-[#b9b29c]/25 px-6 py-4 flex flex-col sm:flex-row justify-between items-center shrink-0 gap-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#817a67] font-semibold">
              TRUST CONSOLE IQ // GOVERNANCE FORENSIC INVESTIGATION CORE
            </span>
            <h2 className="text-xl font-light tracking-tighter text-[#373223] mt-0.5">
              Forensic Reconstruction Ledger &mdash; Decision {DECISION_DATA.id}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#fff9ee] px-3 py-1.5 border border-[#b9b29c]/25 text-xs">
              <button 
                onClick={togglePlay}
                className="p-1 text-[#715b3e] hover:text-[#644f33] transition-colors"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button 
                onClick={restart}
                className="p-1 text-[#715b3e] hover:text-[#644f33] transition-colors border-l border-[#b9b29c]/20 pl-2"
                title="Restart"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <span className="text-stone-300">|</span>
              <button
                onClick={() => setSpeed((s) => (s === 1 ? 2 : s === 2 ? 4 : 1))}
                className="text-[10px] font-mono text-[#715b3e] hover:text-[#644f33] font-bold"
              >
                {speed}x
              </button>
            </div>

            <div className="text-xs font-mono text-[#817a67] bg-[#fff9ee] px-3 py-2 border border-[#b9b29c]/20">
              SIMULATED SECOND: <span className="font-bold text-[#715b3e]">T+{timeElapsed}s</span> / 72s
            </div>

            {onClose && (
              <button 
                onClick={onClose}
                className="p-2 border border-[#b9b29c]/30 text-stone-500 hover:text-stone-800 hover:bg-stone-50 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </header>

        {/* SUB-HEADER RANGE SCRUBBER BAR */}
        <div className="bg-[#fffbf2] border-b border-[#b9b29c]/25 px-6 py-3 flex items-center justify-between gap-4 shrink-0 text-xs font-mono text-[#817a67]">
          <span className="font-bold text-[#715b3e]">T+0s</span>
          <input 
            type="range"
            min="0"
            max="72"
            value={timeElapsed}
            onChange={(e) => seek(parseInt(e.target.value, 10))}
            className="flex-grow accent-[#715b3e] h-1.5 bg-[#e3dac0] rounded-lg cursor-pointer"
          />
          <span className="font-bold text-[#715b3e]">T+72s</span>
        </div>

        {/* WORKSPACE */}
        <div className="flex-grow flex flex-col lg:flex-row overflow-hidden w-full">
          
          {/* LEFT PANEL: EVIDENCE LEDGER */}
          <aside className="w-full lg:w-[350px] border-r border-[#b9b29c]/25 bg-[#fffbf2] flex flex-col overflow-y-auto shrink-0 p-5 gap-5">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#817a67] font-bold block border-b border-[#b9b29c]/15 pb-2 mb-3">
                // GOVERNANCE EVIDENCE LEDGER
              </span>

              <div className="space-y-2">
                {activeArtifacts.map((art) => {
                  const isVerified = art.status === "VERIFIED";
                  const isSelected = selectedArtifactId === art.id;
                  return (
                    <div 
                      key={art.id}
                      onClick={() => art.isDiscovered && setSelectedArtifactId(art.id)}
                      className={`p-3 border rounded text-xs font-mono transition-all duration-300 flex items-center justify-between cursor-pointer ${
                        art.isDiscovered 
                          ? isSelected
                            ? "bg-[#fff9ee] border-[#715b3e] ring-1 ring-[#715b3e]"
                            : isVerified 
                              ? "bg-emerald-50/40 border-emerald-500/20 hover:bg-emerald-50/80 text-stone-700" 
                              : "bg-red-50/40 border-red-500/20 hover:bg-red-50/80 text-stone-700"
                          : "opacity-20 border-stone-200 cursor-not-allowed text-stone-400"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {art.isDiscovered ? (
                          isVerified ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <X className="w-3.5 h-3.5 text-[#9e422c]" />
                          )
                        ) : (
                          <div className="w-3.5 h-3.5 border border-dashed border-stone-300 rounded-full" />
                        )}
                        <span className="font-semibold">{art.name}</span>
                      </div>
                      {art.isDiscovered && (
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${
                          isVerified ? "text-emerald-700 border-emerald-500/10" : "text-[#9e422c] border-red-500/10"
                        }`}>{art.status}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Artifact Forensic Inspector */}
            {selectedArtifact && (
              <div className="p-4 border border-[#b9b29c]/25 bg-[#fff9ee] rounded space-y-3 text-xs">
                <div className="flex justify-between font-mono font-bold border-b border-[#b9b29c]/20 pb-2 text-stone-800">
                  <span>Artifact Inspector</span>
                  <span className="text-[#715b3e] uppercase">{selectedArtifact.type}</span>
                </div>
                <div className="space-y-2 font-mono text-[11px] text-[#6b5d4f]">
                  <div><strong className="text-[#373223]">Source:</strong> {selectedArtifact.source}</div>
                  <div><strong className="text-[#373223]">Confidence Score:</strong> {selectedArtifact.confidence}%</div>
                  <div><strong className="text-[#373223]">Ingress Timestamp:</strong> {selectedArtifact.timestamp}</div>
                  <div className="pt-2 border-t border-stone-200 text-[#373223] font-sans leading-relaxed">
                    {selectedArtifact.summary}
                  </div>
                  <div className="text-[10px] text-stone-400 leading-normal pt-1.5">
                    <strong>Affected Rules:</strong> {selectedArtifact.status === "MISSING" ? "SEC-CONST-1" : selectedArtifact.status === "FAILED" ? "SEC-CONST-2" : "FIN-CONST-1"}
                  </div>
                </div>
              </div>
            )}
          </aside>

          {/* CENTER PANEL */}
          <main className="flex-grow overflow-y-auto p-6 flex flex-col gap-6">
            
            {/* 1. Interactive Causality Pathway Flowchart */}
            <CausalGraphPanel 
              selectedNodeId={selectedNodeId} 
              onSelectNode={setSelectedNodeId} 
              timeElapsed={timeElapsed} 
            />

            {/* FORENSIC SUMMARY CARD (Wow Moment) */}
            <div className="bg-[#fffbf2] border-2 border-[#715b3e] rounded p-5 space-y-3 shadow-md font-mono text-xs">
              <div className="flex justify-between items-center border-b border-[#715b3e]/25 pb-2">
                <span className="text-xs font-bold text-[#9e422c] uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  WHY WAS THIS DECISION BLOCKED?
                </span>
                <span className="text-[10px] text-[#817a67]">GRC FORENSIC AUDIT MEMO</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-1 text-[#373223]">
                <div>
                  <span className="text-[9px] text-stone-400 block uppercase">Primary Cause</span>
                  <span className="font-bold text-stone-850">SOC2 Certificate Missing</span>
                </div>
                <div>
                  <span className="text-[9px] text-stone-400 block uppercase">Contribution</span>
                  <span className="font-bold text-[#9e422c] text-sm">47%</span>
                </div>
                <div>
                  <span className="text-[9px] text-stone-400 block uppercase">Approval Impact</span>
                  <span className="font-bold text-[#9e422c] text-sm">-57%</span>
                </div>
                <div>
                  <span className="text-[9px] text-stone-400 block uppercase">Counterfactual Resolution</span>
                  <span className="font-bold text-emerald-800">If corrected, verdict becomes APPROVED</span>
                </div>
              </div>
            </div>

            {/* FORENSIC ANALYSIS WORKSPACE */}
            <div className="bg-[#fffbf2] border border-[#b9b29c]/25 rounded p-5 space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#817a67] font-bold block border-b border-[#b9b29c]/15 pb-2 mb-3">
                // FORENSIC ANALYSIS WORKSPACE
              </span>

              {/* Navigation Tabs */}
              <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-3 items-end">
                {[
                  { id: "causal", label: "Causal Analysis" },
                  { id: "counterfactual", label: "Counterfactual Replay" },
                  { id: "confidence", label: "Confidence Engine" },
                  { id: "ownership", label: "Verdict Ownership" },
                  { id: "crossexam", label: "Cross Examination" }
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-4 transition-all duration-200 text-xs font-mono font-bold uppercase border flex items-center gap-1.5 ${
                        isActive 
                          ? "h-9 bg-[#fff6e0] text-[#715b3e] border-[#715b3e] border-2 shadow-2xs -mb-[1px] rounded-t-xs" 
                          : "h-8 bg-[#fff9ee] text-[#715b3e]/70 border-[#b9b29c]/25 hover:bg-[#fffbf2] rounded-xs"
                      }`}
                    >
                      {isActive && <span className="text-[#715b3e] font-extrabold">&bull;</span>}
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Workspace Content */}
              <div className="space-y-4">
                {activeTab === "causal" && activeCausalNode && (
                  <div className="space-y-4 font-mono text-xs">
                    <div className="bg-[#fff9ee] p-4 border border-[#b9b29c]/20 rounded">
                      <div className="text-[9px] uppercase font-bold text-[#817a67] mb-1">Selected Node</div>
                      <div className="text-sm font-bold text-stone-800">{activeCausalNode.name}</div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3 pt-3 border-t border-[#b9b29c]/15 text-[10.5px]">
                        <div><span className="text-stone-400">TYPE:</span> {activeCausalNode.type}</div>
                        <div><span className="text-stone-400">CONFIDENCE:</span> {activeCausalNode.confidence}%</div>
                        <div><span className="text-stone-400">IMPACT SCORE:</span> {activeCausalNode.impactScore}</div>
                        <div><span className="text-stone-400">VERDICT CONTRIB:</span> {activeCausalNode.verdictContributionPct}%</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border border-[#b9b29c]/20 rounded bg-[#fff9ee]">
                        <span className="text-[9px] font-bold text-stone-500 uppercase block mb-1">Upstream Causes</span>
                        {upstreamIds.length > 0 ? (
                          <ul className="list-disc pl-4 space-y-1">
                            {upstreamIds.map((id) => (
                              <li key={id}>{causalGraphNodes.find(n => n.id === id)?.name || id}</li>
                            ))}
                          </ul>
                        ) : (
                          <div className="text-stone-400 italic">No upstream causes (Ingress Node)</div>
                        )}
                      </div>
                      <div className="p-4 border border-[#b9b29c]/20 rounded bg-[#fff9ee]">
                        <span className="text-[9px] font-bold text-stone-500 uppercase block mb-1">Downstream Consequences</span>
                        {downstreamIds.length > 0 ? (
                          <ul className="list-disc pl-4 space-y-1">
                            {downstreamIds.map((id) => (
                              <li key={id}>{causalGraphNodes.find(n => n.id === id)?.name || id}</li>
                            ))}
                          </ul>
                        ) : (
                          <div className="text-stone-400 italic">No downstream consequences (Verdict Node)</div>
                        )}
                      </div>
                    </div>

                    <div className="p-4 border border-[#b9b29c]/20 rounded bg-[#fff9ee]">
                      <span className="text-[9px] font-bold text-[#715b3e] uppercase block mb-2">Full Causal Chain</span>
                      <div className="flex flex-wrap items-center gap-2">
                        {causalGraphNodes.map((n, idx) => (
                          <React.Fragment key={n.id}>
                            <span className={`px-2 py-1 border rounded-xs text-[10px] ${n.id === activeCausalNode.id ? "bg-[#715b3e] text-[#fff9ee] border-[#715b3e]" : "bg-[#fff9ee] text-[#715b3e] border-[#b9b29c]/25"}`}>
                              {n.name}
                            </span>
                            {idx < causalGraphNodes.length - 1 && <span className="text-stone-300">&rarr;</span>}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "counterfactual" && (
                  <CounterfactualReplayPanel selectedNodeId={selectedNodeId} />
                )}

                {activeTab === "confidence" && (
                  <div className="space-y-4">
                    <ConfidenceChainPanel selectedNodeId={selectedNodeId} />
                    <ConfidenceBreakdownCard selectedNodeId={selectedNodeId} />
                  </div>
                )}

                {activeTab === "ownership" && (
                  <VerdictOwnershipPanel />
                )}

                {activeTab === "crossexam" && (
                  <CrossExaminationPanel data={crossExam} />
                )}
              </div>
            </div>

            {/* Standard Metrics & Timeline Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DeltaImpactPanel metrics={deltaMetrics} />
              <ApprovalFixSetPanel fixes={minimalFixSet} outcome={counterfactualOutcome} />
            </div>

            {/* 8. Board Consensus Timeline */}
            <section className="bg-[#fffbf2] border border-[#b9b29c]/25 p-5 rounded shadow-sm">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#817a67] font-bold block border-b border-[#stone-200] pb-2 mb-3">
                // EXECUTIVE BOARD CONSENSUS TIMELINE (Sequential Deliberation)
              </span>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 pt-1">
                {AGENT_VOTES.map((v) => {
                  const isVoted = timeElapsed >= v.timeOffset;
                  const isApprove = v.vote === "APPROVE";
                  return (
                    <div 
                      key={v.agent}
                      className={`p-3 border rounded flex flex-col justify-between h-[150px] transition-all duration-500 ${
                        isVoted 
                          ? isApprove 
                            ? "bg-emerald-50/40 border-emerald-500/25 text-[#373223]" 
                            : "bg-red-50/40 border-[#9e422c]/25 text-[#373223]"
                          : "opacity-15 bg-[#fff9ee] border-stone-200 text-stone-400"
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-center border-b border-[#b9b29c]/15 pb-1">
                           <span className="text-xs font-bold font-mono tracking-wider">{v.agent}</span>
                           {isVoted && (
                             <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 border rounded ${
                               isApprove ? "text-emerald-700 bg-emerald-100 border-emerald-500/25" : "text-[#9e422c] bg-red-100 border-[#9e422c]/25"
                             }`}>{v.vote}</span>
                           )}
                        </div>

                        {isVoted ? (
                          <div className="mt-2 text-[10px] text-stone-600 leading-snug">
                            <div className="text-[9px] font-mono text-[#715b3e] font-bold uppercase">What Changed:</div>
                            {v.agent === "CFO" && <div>Risk: 32 &rarr; 45 | Odds: 95%</div>}
                            {v.agent === "CISO" && <div className="text-[#9e422c]">Risk: 45 &rarr; 72 | Odds: 68% &rarr; 42%</div>}
                            {v.agent === "Legal" && <div className="text-[#9e422c]">Risk: 72 &rarr; 81 | Consensus Vetoed</div>}
                            {v.agent === "Operations" && <div>Latency Drop: -24% Confirmed</div>}
                            {v.agent === "Procurement" && <div className="text-[#9e422c]">Weight shifted to block</div>}
                          </div>
                        ) : (
                          <div className="space-y-1.5 mt-3">
                            <div className="h-3 w-full bg-stone-200 animate-pulse rounded" />
                            <div className="h-3 w-4/5 bg-stone-200 animate-pulse rounded" />
                          </div>
                        )}
                      </div>

                      {isVoted && (
                        <div className="text-[8px] font-mono text-stone-400 border-t border-[#b9b29c]/15 pt-1.5 flex justify-between">
                          <span>T+{v.timeOffset}s</span>
                          <span>{v.consensusAfter}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 9. Rejection Drivers Summary */}
            <section className="bg-[#fffbf2] border border-[#b9b29c]/25 p-5 rounded shadow-sm">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#817a67] font-bold block border-b border-stone-200 pb-2 mb-3">
                // REJECTION DRIVERS SUMMARY
              </span>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {rejectionDrivers.map((driver, idx) => (
                  <div key={idx} className="bg-[#fff9ee] p-3 border border-[#b9b29c]/20 rounded space-y-1 font-mono text-xs">
                    <span className="text-stone-400 block text-[9px]">DRIVER 0{idx + 1}</span>
                    <strong className="text-stone-800 block truncate">{driver.name}</strong>
                    <div className="flex justify-between items-center text-[10px] pt-1 border-t border-stone-200/50 mt-1">
                      <span className="text-stone-500">Weight: {driver.weight}%</span>
                      <span className="text-[#9e422c] font-bold">{driver.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </main>

          {/* RIGHT PANEL: WHY THIS MATTERS */}
          <aside className="w-full lg:w-[350px] border-l border-[#b9b29c]/25 bg-[#fffbf2] flex flex-col justify-between overflow-y-auto shrink-0 p-5">
            <div className="space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#817a67] font-bold block border-b border-[#b9b29c]/15 pb-2 mb-3">
                // WHY THIS MATTERS
              </span>

              {activeNodeDetails ? (() => {
                const narrativeLookup: Record<string, { business: string; regulatory: string; decision: string }> = {
                  "node-vendor-select": {
                    business: "Targeting 20% database subscription cost savings via optimized procurement recommendations.",
                    regulatory: "Launches default compliance framework validation scans against supplier registers.",
                    decision: "Initiates the automated GRC validation pipeline, logging baseline audit inputs."
                  },
                  "node-soc2-missing": {
                    business: "Halts database migration project to prevent processing on uncertified vendor nodes.",
                    regulatory: "Fails mandatory SOC2 Type II cert assessment standard checklist validation rules.",
                    decision: "Triggers SEC-CONST-1 constitution veto rule, prompting board override signals."
                  },
                  "node-security-triggered": {
                    business: "Supplier fails mandatory security validation checks, exposing core customer record risk.",
                    regulatory: "Constitutional rules block uncertified database host deployments directly.",
                    decision: "Security framework override veto registers block status onto sealed ledger."
                  },
                  "node-ciso-reject": {
                    business: "Halts DB procurement transaction pending application-level encryption waivers.",
                    regulatory: "CISO enforces compliance and risk accountability protocols under ISO-27001 perimeter.",
                    decision: "Board consensus moves to block (approval probability drops to 42%)."
                  },
                  "node-risk-spike": {
                    business: "Monte Carlo simulator forecasts service outage cascade risks rising up to 41%.",
                    regulatory: "Simulated load limits violate NIST safety margins for service availability controls.",
                    decision: "Operational safety indicators override default commercial priority weights."
                  },
                  "node-nist-fail": {
                    business: "Regulatory access control standards failures block standard database ingress permissions.",
                    regulatory: "Fails NIST AC-1 access control compliance checklist standard.",
                    decision: "Regulatory review layer locks verdict validation status as blocked."
                  },
                  "node-final-verdict": {
                    business: "DB procurement transaction blocked; ledger sealed to ensure system alignment.",
                    regulatory: "Cryptographic consensus proof archived; NIST compliance failures logged.",
                    decision: "Automated blocked verdict finalized on the GRC governance ledger."
                  }
                };

                let key = selectedNodeId || "node-soc2-missing";
                if (key === "node-1" || key === "node-2") key = "node-vendor-select";
                if (key === "node-3") key = "node-soc2-missing";
                if (key === "node-4") key = "node-ciso-reject";
                if (key === "node-5") key = "node-security-triggered";
                if (key === "node-6") key = "node-risk-spike";
                if (key === "node-7") key = "node-nist-fail";
                if (key === "node-8") key = "node-final-verdict";

                const activeNarrative = narrativeLookup[key] || narrativeLookup["node-soc2-missing"];

                return (
                  <div className="space-y-4 text-xs font-mono">
                    <div className="bg-[#fff9ee] border border-[#b9b29c]/25 p-3 rounded">
                      <span className="text-[9px] text-[#817a67] uppercase block font-bold">ACTIVE STEP</span>
                      <span className="text-sm text-stone-800 font-bold block mt-1">{activeCausalNode?.name || activeNodeDetails.label}</span>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="border-b border-[#b9b29c]/10 pb-2.5">
                        <strong className="text-[#715b3e] block text-[10px] uppercase font-bold tracking-wider">Business Impact</strong>
                        <p className="text-stone-600 font-sans mt-1 leading-relaxed text-[11px]">{activeNarrative.business}</p>
                      </div>

                      <div className="border-b border-[#b9b29c]/10 pb-2.5">
                        <strong className="text-[#715b3e] block text-[10px] uppercase font-bold tracking-wider">Regulatory Impact</strong>
                        <p className="text-stone-600 font-sans mt-1 leading-relaxed text-[11px]">{activeNarrative.regulatory}</p>
                      </div>

                      <div className="pb-2.5">
                        <strong className="text-[#715b3e] block text-[10px] uppercase font-bold tracking-wider">Decision Impact</strong>
                        <p className="text-stone-600 font-sans mt-1 leading-relaxed text-[11px]">{activeNarrative.decision}</p>
                      </div>
                    </div>
                  </div>
                );
              })() : (
                <p className="text-xs text-stone-400 italic">Select a node from causality flow to audit details...</p>
              )}
            </div>

            {/* Governance Position Lock Indicator */}
            {activeNodeDetails && (
              <div className="mt-6 border-t border-[#b9b29c]/20 pt-4">
                <GovernancePositionCard 
                  position={timeElapsed >= 7 ? "BLOCK" : "ALLOW"} 
                  confidence={crossExam?.confidence ?? 95} 
                />
              </div>
            )}
          </aside>

        </div>

        {/* NO BOTTOM FOOTER */}
      </div>
    </div>
  );
}
