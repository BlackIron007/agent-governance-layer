"use client";

import { useState } from "react";
import { ShieldAlert, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import { AdversarialReport } from "../lib/mockData";

interface GovernanceAttackReportCardProps {
  report: AdversarialReport;
}

export default function GovernanceAttackReportCard({ report }: GovernanceAttackReportCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-outline-variant/15 bg-surface shadow-sm w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 flex justify-between items-center text-left hover:bg-surface-container-low/20 transition-colors"
      >
        <span className="text-xs uppercase tracking-widest text-[#817a67] font-medium flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#715b3e]" />
          Adversarial Governance Lab Telemetry
        </span>
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase font-mono text-[#817a67] font-light">
            Resilience: {report.resilienceScore}/100
          </span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-[#817a67]" /> : <ChevronDown className="w-4 h-4 text-[#817a67]" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-6 border-t border-[#b9b29c]/10 bg-surface-container-low/30 space-y-6 animate-fadeIn">
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-b border-[#b9b29c]/10 pb-6">
            {[
              { label: "Manipulation Risk", value: report.manipulationRisk },
              { label: "Collusion Risk", value: report.collusionRisk },
              { label: "Reward Hacking Risk", value: report.rewardHackingRisk },
              { label: "Policy Gaming Risk", value: report.policyGamingRisk },
              { label: "Constitution Exploit Risk", value: report.constitutionExploitRisk },
              { label: "Lab Resilience Score", value: report.resilienceScore }
            ].map((stat, idx) => (
              <div key={idx} className="bg-surface border border-[#b9b29c]/15 p-4 flex flex-col justify-center items-center text-center">
                <span className="text-[9px] uppercase tracking-wider text-[#817a67] font-light">{stat.label}</span>
                <span className="text-xl font-light tracking-tighter text-[#373223] mt-1">{stat.value}%</span>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-widest text-[#817a67] font-medium flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-[#9e422c]" />
              Vulnerabilities & Loophole Exploits Detected
            </h4>

            {report.vulnerabilities.length > 0 ? (
              <div className="space-y-3">
                {report.vulnerabilities.map((vuln, idx) => (
                  <div key={idx} className="border border-[#9e422c]/10 bg-[#9e422c]/5 p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-[#9e422c]">{vuln.name}</span>
                      <span className="text-[8px] uppercase font-mono px-2 py-0.5 border border-[#9e422c]/20 text-[#9e422c]">
                        SEVERITY: {vuln.severity}
                      </span>
                    </div>
                    <p className="text-xs font-light text-[#6b5d4f] leading-relaxed">
                      <strong>Automated Mitigation:</strong> {vuln.mitigation}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 border border-dashed border-[#b9b29c]/20 bg-surface/50 text-xs font-light text-[#6b5d4f] text-center italic">
                Zero vulnerability exploits detected under current audit parameters.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
