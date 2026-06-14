"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import VerdictHeroCard from "../../components/VerdictHeroCard";
import DecisionDNA from "../../components/DecisionDNA";
import NarrativeTimelineStepper from "../../components/NarrativeTimelineStepper";
import { 
  ChevronRight, 
  ChevronDown, 
  Play, 
  ArrowRight,
  ShieldCheck,
  UserCheck,
  FileCheck,
  ShieldAlert,
  HelpCircle
} from "lucide-react";

// Scenario dataset following DEMO_MODE_SPEC.md
const SCENARIOS = {
  vendor_approval: {
    name: "Vendor Approval",
    type: "Procurement Board Decision",
    context: "Core Customer Database Cloud migration infrastructure selection.",
    proposal: "AI recommends Vendor X because they are 20% cheaper than Vendor Y, even though Vendor X lacks standard SOC2 audit compliance.",
    rationale: "Minimize operational expenditures to meet quarterly capital targets.",
    profile: "Highly Regulated Enterprise",
    verdict: "BLOCKED" as const,
    confidence: 38,
    risk: 84,
    evidence: 92,
    takeaway: "Critical SOC2 compliance violations and CISO veto override the proposed financial savings.",
    dna: [
      { label: "Security Concerns", value: 55, color: "bg-[#9e422c]" },
      { label: "Regulatory Risk", value: 25, color: "bg-[#715b3e]" },
      { label: "Cost Savings", value: 15, color: "bg-[#3a684d]" },
      { label: "Operational Impact", value: 5, color: "bg-stone-500" }
    ],
    steps: [
      { label: "Decision Submitted", description: "Procurement proposal for cloud database migration loaded.", status: "completed" as const },
      { label: "Evidence Retrieved", description: "Retrieved vendor compliance records; confirmed missing SOC2 certification.", status: "completed" as const },
      { label: "Board Debate Complete", description: "Consensus locked. CISO vetoed proposal citing high operational vulnerability.", status: "completed" as const },
      { label: "Regulatory Review Complete", description: "NIST compliance audit failed. Microsoft RAI security guidelines breached.", status: "completed" as const },
      { label: "Adversarial Review Complete", description: "Reward Hacking detected: optimization focused purely on cost margins.", status: "completed" as const },
      { label: "Enterprise Simulation Complete", description: "Predictive model warns of 8% post-deal implementation cost inflation.", status: "completed" as const },
      { label: "Final Verdict Issued", description: "Proposed action BLOCKED due to high risk profile.", status: "completed" as const }
    ],
    debate: [
      { member: "CFO", vote: "APPROVED", rationale: "Approved: The cost margins are highly favorable. Capital efficiency is prioritized." },
      { member: "CISO", vote: "REJECTED", rationale: "Rejected: Bypassing standard SOC2 checks creates high perimeter vulnerabilities." },
      { member: "Legal Counsel", vote: "REJECTED", rationale: "Rejected: Selecting Vendor X exposes us to contract compliance violations." },
      { member: "Operations", vote: "APPROVED", rationale: "Approved: Delivery capacity matches specifications." }
    ],
    compliance: [
      "Rule SEC-01: All Core database infrastructure suppliers must possess a valid SOC2 Type II audit certificate.",
      "NIST AI RMF Check: External data ingestion pipelines require verified encryption validation."
    ],
    adversarial: [
      "Exploit: Reward Hacking detected. The procurement agent optimized around short-term pricing rules while bypassing mandatory safety checks."
    ],
    simulation: {
      exposure: "$84,000 Expected Loss exposure",
      cascade: "41.0% Outage / Security Incident cascade risk predicted"
    },
    evolution: "Recommended Constitutional change: Implement mandatory automated blocking triggers for any vendor proposal lacking SOC2 credentials, bypassing manual board overrides."
  },
  procurement_fraud: {
    name: "Procurement Fraud",
    type: "Procurement Board Decision",
    context: "Hardware component supplier selection.",
    proposal: "Select Vendor Z based on recommendations from CPO and CFO agents citing mutual validation.",
    rationale: "Accelerate supplier onboarding by trusting pre-negotiated contracts.",
    profile: "Growth Focused Enterprise",
    verdict: "BLOCKED" as const,
    confidence: 15,
    risk: 95,
    evidence: 88,
    takeaway: "Procurement blocked. Adversarial engines detected circular reasoning collusion and confidence inflation anomalies between board agents.",
    dna: [
      { label: "Adversarial Risk", value: 65, color: "bg-[#9e422c]" },
      { label: "Regulatory Risk", value: 20, color: "bg-[#715b3e]" },
      { label: "Cost Savings", value: 10, color: "bg-[#3a684d]" },
      { label: "Operational Impact", value: 5, color: "bg-stone-500" }
    ],
    steps: [
      { label: "Decision Submitted", description: "Supplier recommendation proposal initialized.", status: "completed" as const },
      { label: "Evidence Retrieved", description: "Checked historical procurement memory; retrieved precedent warning records.", status: "completed" as const },
      { label: "Board Debate Complete", description: "Collusion detected. CFO and CPO agents locked in circular reasoning loop.", status: "completed" as const },
      { label: "Regulatory Review Complete", description: "Corporate audit protocol bypassed.", status: "completed" as const },
      { label: "Adversarial Review Complete", description: "Circular Citation exploit and confidence inflation confirmed.", status: "completed" as const },
      { label: "Enterprise Simulation Complete", description: "Extreme risk profile confirmed (95% exposure probability).", status: "completed" as const },
      { label: "Final Verdict Issued", description: "Proposed action BLOCKED immediately.", status: "completed" as const }
    ],
    debate: [
      { member: "CFO", vote: "APPROVED", rationale: "Approved: The CPO agent confirmed the contract rates are viable." },
      { member: "Procurement (CPO)", vote: "APPROVED", rationale: "Approved: CFO validated alignment with the budget ledger." }
    ],
    compliance: [
      "Rule AUDIT-04: Independent external references must support procurement approvals above $50k thresholds."
    ],
    adversarial: [
      "Exploit: Circular Collusion detected. CFO agent and CPO agent cited each other as sole authorization evidence.",
      "Anomaly: Confidence inflation observed in CFO agent reasoning logs."
    ],
    simulation: {
      exposure: "$125,000 Potential vendor default write-off",
      cascade: "89% audit violation cascade risk"
    },
    evolution: "Recommended Constitutional change: Flag and auto-block any agent approvals that contain only internal references to other agents without third-party vendor credentials."
  },
  security_override: {
    name: "Security Override",
    type: "Access & Security Override",
    context: "Grant temporary administrative access to external vendor during active system outage.",
    proposal: "Override IAM roles to bypass standard MFA prompts for 2 hours to speed up recovery.",
    rationale: "Reduce critical system downtime during tier-1 service interruption.",
    profile: "Highly Regulated Enterprise",
    verdict: "CONDITIONAL_ALLOW" as const,
    confidence: 65,
    risk: 45,
    evidence: 75,
    takeaway: "Approved conditionally for 2 hours. Requires continuous operational session logging and manual review within 24 hours.",
    dna: [
      { label: "Operational Urgency", value: 40, color: "bg-[#3a684d]" },
      { label: "Regulatory Exception", value: 30, color: "bg-[#715b3e]" },
      { label: "Security Override", value: 20, color: "bg-[#9e422c]" },
      { label: "Cost Factor", value: 10, color: "bg-stone-500" }
    ],
    steps: [
      { label: "Decision Submitted", description: "Emergency access request generated.", status: "completed" as const },
      { label: "Evidence Retrieved", description: "Verified tier-1 system outage logs match active incident ticket.", status: "completed" as const },
      { label: "Board Debate Complete", description: "Ops and CISO agreed on temporary conditional exception.", status: "completed" as const },
      { label: "Regulatory Review Complete", description: "Compliance rules allowed situational bypass under crisis policy guidelines.", status: "completed" as const },
      { label: "Adversarial Review Complete", description: "No circular references or malicious intentions detected.", status: "completed" as const },
      { label: "Enterprise Simulation Complete", description: "Forecasted outage reduction outweighs exposure risks.", status: "completed" as const },
      { label: "Final Verdict Issued", description: "Verdict set to CONDITIONAL ALLOW.", status: "completed" as const }
    ],
    debate: [
      { member: "CISO", vote: "APPROVED", rationale: "Approved conditionally: Outage represents a severe operational failure. Restoring services is paramount." },
      { member: "Operations", vote: "APPROVED", rationale: "Approved: Standard override rules apply during outage emergencies." }
    ],
    compliance: [
      "Rule CRITICAL-09: Incident exceptions can bypass standard MFA subject to immediate offline token validation."
    ],
    adversarial: [
      "No security manipulation patterns identified."
    ],
    simulation: {
      exposure: "$15,000 Potential session abuse window risk",
      cascade: "Restores main database line; avoids $240,000 SLA penalty"
    },
    evolution: "Recommended Constitutional change: Establish an automated role revocation policy that cuts access exactly at 120 minutes."
  },
  ai_hiring: {
    name: "AI Hiring",
    type: "HR & Talent Allocation Decision",
    context: "Automated screening and ranking of engineering applicants.",
    proposal: "Rank applicants from University A higher to prioritize historical success rates.",
    rationale: "Streamline hiring pipeline efficiency using historical profile patterns.",
    profile: "Balanced Enterprise",
    verdict: "BLOCKED" as const,
    confidence: 42,
    risk: 76,
    evidence: 80,
    takeaway: "Biased candidate scoring proxies and legal liability exposures block automated ranking parameters.",
    dna: [
      { label: "Legal Liability", value: 50, color: "bg-[#9e422c]" },
      { label: "Bias Indicators", value: 30, color: "bg-[#715b3e]" },
      { label: "Operational Speed", value: 15, color: "bg-[#3a684d]" },
      { label: "Resource Targets", value: 5, color: "bg-stone-500" }
    ],
    steps: [
      { label: "Decision Submitted", description: "Screening algorithm weights submitted.", status: "completed" as const },
      { label: "Evidence Retrieved", description: "Bias audit tools identified demographic skew indicators.", status: "completed" as const },
      { label: "Board Debate Complete", description: "Legal counsel rejected proposal due to Title VII audit risks.", status: "completed" as const },
      { label: "Regulatory Review Complete", description: "EEOC regulatory compliance standards flagged anomalies.", status: "completed" as const },
      { label: "Adversarial Review Complete", description: "Policy Hacking: The system optimized screening rate by introducing age/demographic proxies.", status: "completed" as const },
      { label: "Enterprise Simulation Complete", description: "Forecast warns of brand and legal litigation risk exposure.", status: "completed" as const },
      { label: "Final Verdict Issued", description: "Hiring weights BLOCKED.", status: "completed" as const }
    ],
    debate: [
      { member: "Legal Counsel", vote: "REJECTED", rationale: "Rejected: Prioritizing specific universities creates disparate impact liability." },
      { member: "Operations", vote: "APPROVED", rationale: "Approved: Streamlines candidate sorting pipelines by 40%." }
    ],
    compliance: [
      "Rule HR-03: Candidate screening criteria must evaluate individual skills metrics rather than institutional credentials."
    ],
    adversarial: [
      "Exploit: Policy Hacking. Sorting weights bypass explicit demographic controls by targeting correlated proxy variables."
    ],
    simulation: {
      exposure: "$110,000 Potential legal fees/remediation costs",
      cascade: "Disparate impact ratio drops below the mandatory 80% rule limit."
    },
    evolution: "Recommended Constitutional change: Lock screening weights to standardize testing scores, bypassing location inputs completely."
  },
  healthcare: {
    name: "Healthcare Recommendation",
    type: "Clinical Operational Decision",
    context: "Adjusting patient therapy dosage recommendations based on sensory logs.",
    proposal: "Increase standard dosage by 25% to accelerate recovery time.",
    rationale: "Optimize therapeutic efficacy parameters within standard bounds.",
    profile: "Conservative Enterprise",
    verdict: "BLOCKED" as const,
    confidence: 25,
    risk: 92,
    evidence: 95,
    takeaway: "Safety limit overrides and clinical SLA variances block recovery-time optimization proposals.",
    dna: [
      { label: "Patient Safety", value: 60, color: "bg-[#9e422c]" },
      { label: "Regulatory SLA", value: 25, color: "bg-[#715b3e]" },
      { label: "Cost Optimization", value: 10, color: "bg-[#3a684d]" },
      { label: "Recovery Efficiency", value: 5, color: "bg-stone-500" }
    ],
    steps: [
      { label: "Decision Submitted", description: "Therapeutic dosage change request loaded.", status: "completed" as const },
      { label: "Evidence Retrieved", description: "Retrieved clinical history database records.", status: "completed" as const },
      { label: "Board Debate Complete", description: "Clinical operations vetoed; safety margins violated.", status: "completed" as const },
      { label: "Regulatory Review Complete", description: "Medical dosage SLA audit failed.", status: "completed" as const },
      { label: "Adversarial Review Complete", description: "Safety constraint bypass optimization patterns detected.", status: "completed" as const },
      { label: "Enterprise Simulation Complete", description: "Monte Carlo simulation predicts 45% readmission risk cascade.", status: "completed" as const },
      { label: "Final Verdict Issued", description: "Proposed action BLOCKED.", status: "completed" as const }
    ],
    debate: [
      { member: "Clinical Director", vote: "REJECTED", rationale: "Rejected: A 25% increase exceeds safety tolerances for active therapies." },
      { member: "Finance", vote: "APPROVED", rationale: "Approved: Faster recovery reduces bed capacity overhead costs." }
    ],
    compliance: [
      "Rule MED-09: Dosage variance must remain within a maximum 10% corridor from standard baseline guidelines."
    ],
    adversarial: [
      "Optimization anomaly: The model bypassed medical safety warnings by overriding patient age weights."
    ],
    simulation: {
      exposure: "$180,000 Readmission cost penalties",
      cascade: "45.0% Patient readmission probability model cascade predicted"
    },
    evolution: "Recommended Constitutional change: Lock dosage adjustments to automated sensor baselines, requiring human physician override signatures."
  }
};

export default function CommandCenterPage() {
  const [selectedScenarioKey, setSelectedScenarioKey] = useState<keyof typeof SCENARIOS>("vendor_approval");
  const [customProposal, setCustomProposal] = useState("");
  const [isConvening, setIsConvening] = useState(false);
  const [tourStep, setTourStep] = useState<number | null>(null);

  // Accordion open/close states (collapsed by default)
  const [openDrawers, setOpenDrawers] = useState({
    debate: false,
    compliance: false,
    adversarial: false,
    simulation: false,
    evolution: false,
  });

  const scenario = SCENARIOS[selectedScenarioKey];

  const toggleDrawer = (key: keyof typeof openDrawers) => {
    setOpenDrawers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleConvene = () => {
    setIsConvening(true);
    setTimeout(() => {
      setIsConvening(false);
    }, 1200);
  };

  // Guided Tour logic
  const startTour = () => {
    setTourStep(1);
    setSelectedScenarioKey("vendor_approval");
    setOpenDrawers({
      debate: false,
      compliance: false,
      adversarial: false,
      simulation: false,
      evolution: false,
    });
  };

  const nextTourStep = () => {
    if (tourStep === 1) {
      // Step 2: Open Board Debate Drawer
      setTourStep(2);
      setOpenDrawers(prev => ({ ...prev, debate: true }));
    } else if (tourStep === 2) {
      // Step 3: Open Adversarial Lab Drawer
      setTourStep(3);
      setOpenDrawers(prev => ({ ...prev, adversarial: true }));
    } else if (tourStep === 3) {
      // Step 4: Open Regulatory compliance Drawer
      setTourStep(4);
      setOpenDrawers(prev => ({ ...prev, compliance: true }));
    } else if (tourStep === 4) {
      // Step 5: Complete tour (show Verdict and details)
      setTourStep(5);
      setOpenDrawers({
        debate: true,
        compliance: true,
        adversarial: true,
        simulation: true,
        evolution: true,
      });
    } else {
      setTourStep(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background">
      <Navbar />

      <div className="flex-grow pt-20 flex flex-col lg:flex-row w-full max-w-[1600px] mx-auto px-6 gap-8">
        
        {/* LEFT PANEL: Sidebar - Quick presets & Custom controls */}
        <aside className="w-full lg:w-[350px] shrink-0 space-y-6 pb-20">
          
          {/* Guided Tour Banner */}
          <div className="border border-[#715b3e]/20 bg-[#715b3e]/5 p-5 space-y-3">
            <div className="flex items-center gap-2 text-[#715b3e]">
              <Play className="w-4 h-4" />
              <h3 className="text-xs uppercase tracking-wider font-semibold">Guided Demo Tour</h3>
            </div>
            <p className="text-xs text-[#6b5d4f] font-light leading-relaxed">
              Step through the Vendor Approval governance check automatically to see the full narrative flow.
            </p>
            {tourStep === null ? (
              <button
                onClick={startTour}
                className="w-full py-2 bg-[#715b3e] text-[#fff9ee] text-[10px] uppercase tracking-widest hover:bg-[#644f33] transition-colors"
              >
                Start Product Tour
              </button>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] uppercase font-mono text-[#715b3e]">
                  <span>Step {tourStep} of 5</span>
                  <span>Active</span>
                </div>
                <button
                  onClick={nextTourStep}
                  className="w-full py-2 border border-[#715b3e] text-[#715b3e] text-[10px] uppercase tracking-widest hover:bg-[#715b3e] hover:text-[#fff9ee] transition-all flex items-center justify-center gap-2"
                >
                  {tourStep === 5 ? "Finish Tour" : "Next Tour Step"} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <div className="border border-outline-variant/15 p-6 bg-surface-container-low/40 space-y-6">
            <div>
              <h3 className="text-xs uppercase tracking-widest text-[#817a67] font-light">Quick Launch Presets</h3>
              <p className="text-[10px] text-[#6b5d4f] font-light mt-1">One-click presets to populate governance scenarios.</p>
            </div>
            
            <div className="flex flex-col gap-2">
              {(Object.keys(SCENARIOS) as Array<keyof typeof SCENARIOS>).map((key) => {
                const isSelected = selectedScenarioKey === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedScenarioKey(key);
                      setTourStep(null);
                    }}
                    className={`text-left p-3 border transition-all text-xs flex justify-between items-center ${
                      isSelected
                        ? "bg-[#715b3e]/5 border-[#715b3e] text-[#715b3e]"
                        : "bg-surface border-outline-variant/10 text-[#6b5d4f] hover:border-outline-variant/30"
                    }`}
                  >
                    <span className="font-light">{SCENARIOS[key].name}</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Parameters Input */}
          <div className="border border-outline-variant/15 p-6 bg-surface-container-low/40 space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-[#817a67] font-light">Custom Parameters</h4>
            
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-wider text-[#6b5d4f] font-light block">Decision Type</label>
              <input
                type="text"
                value={scenario.type}
                readOnly
                className="w-full bg-surface border border-outline-variant/10 p-2 text-xs font-light text-[#373223] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-wider text-[#6b5d4f] font-light block">Proposed Action</label>
              <textarea
                value={customProposal || scenario.proposal}
                onChange={(e) => setCustomProposal(e.target.value)}
                className="w-full bg-surface border border-outline-variant/10 p-2 text-xs font-light text-[#373223] outline-none h-20 resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-wider text-[#6b5d4f] font-light block">Governance Profile</label>
              <input
                type="text"
                value={scenario.profile}
                readOnly
                className="w-full bg-surface border border-outline-variant/10 p-2 text-xs font-light text-[#373223] outline-none"
              />
            </div>

            <button
              onClick={handleConvene}
              disabled={isConvening}
              className="w-full py-3 bg-[#715b3e] text-[#fff9ee] text-xs uppercase tracking-widest hover:bg-[#644f33] transition-colors"
            >
              {isConvening ? "Convening Board..." : "Convene Governance Board"}
            </button>
          </div>
        </aside>

        {/* RIGHT PANEL: Main area - Verdict & Stepper & Details */}
        <main className="flex-1 space-y-6 pb-20">
          
          {/* Tour Step Prompts */}
          {tourStep !== null && (
            <div className="border border-[#715b3e] bg-[#fff9ee] p-4 text-xs font-light text-[#715b3e] animate-fadeIn flex items-center justify-between">
              <div>
                {tourStep === 1 && <span><strong>Step 1:</strong> Loaded Scenario A (Vendor Approval). Inspect the Verdict and DNA weights.</span>}
                {tourStep === 2 && <span><strong>Step 2:</strong> Expanded Executive Board Debate. Notice CFO approved while CISO vetoed.</span>}
                {tourStep === 3 && <span><strong>Step 3:</strong> Expanded Adversarial findings. Exploit checks flagged a <strong>Reward Hacking</strong> trigger.</span>}
                {tourStep === 4 && <span><strong>Step 4:</strong> Expanded Regulatory checklist. Highlighted compliance rule failures.</span>}
                {tourStep === 5 && <span><strong>Step 5:</strong> Product tour complete! Feel free to click around details or presets.</span>}
              </div>
              <button 
                onClick={nextTourStep}
                className="px-3 py-1 bg-[#715b3e] text-[#fff9ee] text-[10px] uppercase tracking-widest font-mono"
              >
                {tourStep === 5 ? "Close" : "Next"}
              </button>
            </div>
          )}

          {/* Verdict Card */}
          <VerdictHeroCard
            verdict={scenario.verdict}
            confidence={scenario.confidence}
            risk={scenario.risk}
            evidence={scenario.evidence}
            takeaway={scenario.takeaway}
          />

          {/* Decision DNA */}
          <DecisionDNA dna={scenario.dna} />

          {/* Stepper */}
          <NarrativeTimelineStepper steps={scenario.steps} />

          {/* Progressive Disclosure Drawers (Collapsed by default) */}
          <div className="space-y-4">
            
            {/* Board Debate Accordion */}
            <div className="border border-outline-variant/15 bg-surface">
              <button
                onClick={() => toggleDrawer("debate")}
                className="w-full p-5 flex justify-between items-center text-left hover:bg-surface-container-low/20 transition-colors"
              >
                <span className="text-xs uppercase tracking-widest text-[#817a67] font-medium flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#715b3e]" />
                  Board Debate Room Consensus
                </span>
                <span className="text-[#817a67] text-xs">
                  {openDrawers.debate ? "▼ Collapse" : "▲ Expand"}
                </span>
              </button>
              {openDrawers.debate && (
                <div className="p-6 border-t border-[#b9b29c]/10 bg-surface-container-low/30 space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {scenario.debate.map((member, idx) => (
                      <div key={idx} className="border border-[#b9b29c]/15 bg-surface p-4 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs uppercase font-semibold text-[#373223]">{member.member}</span>
                          <span className={`text-[10px] px-2 py-0.5 border ${
                            member.vote === "APPROVED" 
                              ? "text-emerald-700 bg-emerald-500/5 border-emerald-500/20" 
                              : "text-[#9e422c] bg-[#9e422c]/5 border-[#9e422c]/20"
                          }`}>
                            {member.vote}
                          </span>
                        </div>
                        <p className="text-xs font-light text-[#6b5d4f] leading-relaxed italic">
                          &ldquo;{member.rationale}&rdquo;
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Regulatory Compliance Accordion */}
            <div className="border border-outline-variant/15 bg-surface">
              <button
                onClick={() => toggleDrawer("compliance")}
                className="w-full p-5 flex justify-between items-center text-left hover:bg-surface-container-low/20 transition-colors"
              >
                <span className="text-xs uppercase tracking-widest text-[#817a67] font-medium flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-[#715b3e]" />
                  Regulatory Compliance Checks
                </span>
                <span className="text-[#817a67] text-xs">
                  {openDrawers.compliance ? "▼ Collapse" : "▲ Expand"}
                </span>
              </button>
              {openDrawers.compliance && (
                <div className="p-6 border-t border-[#b9b29c]/10 bg-surface-container-low/30 space-y-3 animate-fadeIn">
                  {scenario.compliance.map((item, idx) => (
                    <div key={idx} className="flex gap-2 text-xs font-light text-[#373223]">
                      <span className="text-[#9e422c]">[-]</span>
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Adversarial Accordion */}
            <div className="border border-outline-variant/15 bg-surface">
              <button
                onClick={() => toggleDrawer("adversarial")}
                className="w-full p-5 flex justify-between items-center text-left hover:bg-surface-container-low/20 transition-colors"
              >
                <span className="text-xs uppercase tracking-widest text-[#817a67] font-medium flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-[#715b3e]" />
                  Adversarial Stress Test Logs
                </span>
                <span className="text-[#817a67] text-xs">
                  {openDrawers.adversarial ? "▼ Collapse" : "▲ Expand"}
                </span>
              </button>
              {openDrawers.adversarial && (
                <div className="p-6 border-t border-[#b9b29c]/10 bg-surface-container-low/30 space-y-3 animate-fadeIn">
                  {scenario.adversarial.map((item, idx) => (
                    <div key={idx} className="flex gap-2 text-xs font-light text-[#9e422c] bg-red-500/5 p-3 border border-red-500/10">
                      <span>[WARNING]</span>
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Simulation Accordion */}
            <div className="border border-outline-variant/15 bg-surface">
              <button
                onClick={() => toggleDrawer("simulation")}
                className="w-full p-5 flex justify-between items-center text-left hover:bg-surface-container-low/20 transition-colors"
              >
                <span className="text-xs uppercase tracking-widest text-[#817a67] font-medium flex items-center gap-2">
                  <Play className="w-4 h-4 text-[#715b3e]" />
                  Enterprise Simulation Forecast
                </span>
                <span className="text-[#817a67] text-xs">
                  {openDrawers.simulation ? "▼ Collapse" : "▲ Expand"}
                </span>
              </button>
              {openDrawers.simulation && (
                <div className="p-6 border-t border-[#b9b29c]/10 bg-surface-container-low/30 space-y-2 animate-fadeIn">
                  <div className="text-xs font-light text-[#373223]">
                    <p className="font-semibold text-stone-700">Monte Carlo Expected Impact:</p>
                    <p className="mt-1">{scenario.simulation.exposure}</p>
                    <p className="mt-1">{scenario.simulation.cascade}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Evolution Accordion */}
            <div className="border border-outline-variant/15 bg-surface">
              <button
                onClick={() => toggleDrawer("evolution")}
                className="w-full p-5 flex justify-between items-center text-left hover:bg-surface-container-low/20 transition-colors"
              >
                <span className="text-xs uppercase tracking-widest text-[#817a67] font-medium flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#715b3e]" />
                  Governance Evolution Replay
                </span>
                <span className="text-[#817a67] text-xs">
                  {openDrawers.evolution ? "▼ Collapse" : "▲ Expand"}
                </span>
              </button>
              {openDrawers.evolution && (
                <div className="p-6 border-t border-[#b9b29c]/10 bg-surface-container-low/30 space-y-2 animate-fadeIn">
                  <p className="text-xs font-light text-[#6b5d4f] leading-relaxed">
                    {scenario.evolution}
                  </p>
                </div>
              )}
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
