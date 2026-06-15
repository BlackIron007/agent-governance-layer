"use client";

import React from "react";

export default function VerdictOwnershipPanel() {
  const contributions = [
    { name: "SOC2 Certificate Missing", pct: 47, desc: "Violates SEC-CONST-1 rule baseline, triggering default veto block." },
    { name: "CISO Veto Override", pct: 23, desc: "Manual and automated security override policy restriction enforced." },
    { name: "Regulatory Compliance Failure", pct: 18, desc: "NIST AC-1 Access Control standard violation logged." },
    { name: "Simulation Failure Forecasts", pct: 12, desc: "Monte Carlo transaction cascade outage prediction exceeds threshold." }
  ];

  return (
    <section className="bg-[#fffbf2] border border-[#b9b29c]/25 p-5 rounded shadow-sm space-y-4">
      <span className="text-[10px] font-mono uppercase tracking-widest text-[#817a67] font-bold block border-b border-[#b9b29c]/15 pb-2 mb-3">
        // VERDICT OWNERSHIP (Subsystem Contribution Index)
      </span>

      <div className="space-y-3 font-mono text-xs">
        {contributions.map((c, i) => (
          <div key={i} className="flex flex-col md:flex-row md:items-center justify-between border-b border-stone-100 pb-2 last:border-0 last:pb-0">
            <div className="flex-grow flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-stone-700 min-w-[220px]">{c.name}</span>
                <span className="text-[10px] text-stone-400 font-sans hidden md:inline">&mdash; {c.desc}</span>
              </div>
              {/* Visual Contribution Bar */}
              <div className="w-full max-w-md bg-[#e3dac0]/40 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div className="bg-[#9e422c] h-full rounded-full transition-all duration-500" style={{ width: `${c.pct}%` }} />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-1 md:mt-0">
              <span className="text-stone-300">........................</span>
              <span className="font-bold text-[#9e422c] bg-red-50 px-2 py-0.5 border border-red-500/10 rounded">{c.pct}%</span>
            </div>
          </div>
        ))}
        <div className="border-t border-[#b9b29c]/25 pt-2.5 flex justify-between font-bold text-[#373223] text-[12px]">
          <span>TOTAL COMPILATION CONTRIBUTION</span>
          <span className="text-[#715b3e]">100%</span>
        </div>
      </div>
    </section>
  );
}
