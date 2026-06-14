"use client";

import Navbar from "../../components/Navbar";

interface DecisionHistoryItem {
  id: string;
  timestamp: string;
  type: string;
  summary: string;
  status: "ALLOWED" | "BLOCKED" | "CONDITIONAL";
}

// Pre-generated 15 highly realistic audit log items for preview (representing part of the last 50 decisions)
const MOCK_HISTORY_LOGS: DecisionHistoryItem[] = [
  { id: "DEC-1495", timestamp: "2026-06-14 16:34", type: "Procurement", summary: "Vendor X database cloud selection.", status: "BLOCKED" },
  { id: "DEC-1494", timestamp: "2026-06-14 15:20", type: "Procurement", summary: "Vendor Z circular collusion test run.", status: "BLOCKED" },
  { id: "DEC-1493", timestamp: "2026-06-14 12:15", type: "Security Override", summary: "Emergency administrative IAM role bypass.", status: "CONDITIONAL" },
  { id: "DEC-1492", timestamp: "2026-06-14 09:40", type: "HR screening", summary: "Automated candidate sorting university ranking.", status: "BLOCKED" },
  { id: "DEC-1491", timestamp: "2026-06-13 18:10", type: "Clinical Ops", summary: "Accelerate recovery recovery-time dosage increase.", status: "BLOCKED" },
  { id: "DEC-1490", timestamp: "2026-06-13 14:05", type: "Procurement", summary: "Select Vendor W for strategic hardware supply.", status: "ALLOWED" },
  { id: "DEC-1489", timestamp: "2026-06-13 11:30", type: "Access Override", summary: "API key scope expansion for staging servers.", status: "ALLOWED" },
  { id: "DEC-1488", timestamp: "2026-06-12 16:22", type: "Financial Audit", summary: "Automated expense ledger reconciliation review.", status: "ALLOWED" },
  { id: "DEC-1487", timestamp: "2026-06-12 13:15", type: "Clinical Ops", summary: "Adjust baseline sensors guidelines for patient B.", status: "CONDITIONAL" },
  { id: "DEC-1486", timestamp: "2026-06-12 10:05", type: "Procurement", summary: "Vendor A hardware replenishment deal validation.", status: "BLOCKED" },
  { id: "DEC-1485", timestamp: "2026-06-11 17:40", type: "HR Screening", summary: "Standard screening filtering filters update.", status: "ALLOWED" },
  { id: "DEC-1484", timestamp: "2026-06-11 15:00", type: "Clinical Ops", summary: "Standard sensory calibration test overrides.", status: "ALLOWED" },
  { id: "DEC-1483", timestamp: "2026-06-11 11:20", type: "Procurement", summary: "Office supplies bulk hardware deal clearance.", status: "ALLOWED" },
  { id: "DEC-1482", timestamp: "2026-06-10 16:55", type: "Access Override", summary: "Read-only access permission grant during system backup.", status: "ALLOWED" },
  { id: "DEC-1481", timestamp: "2026-06-10 12:30", type: "Financial Audit", summary: "Vendor invoicing reconciliation ledger screening.", status: "BLOCKED" }
];

export default function DecisionHistoryPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-background">
      <Navbar />

      <main className="flex-grow pt-28 pb-20 flex flex-col items-center w-full max-w-5xl mx-auto px-6">
        <header className="w-full mb-8">
          <span className="text-[10px] font-normal tracking-[0.05em] uppercase text-[#817a67]">System Audit Trail</span>
          <h1 className="text-4xl font-light tracking-tighter text-[#373223] mt-2">Enterprise Decision History</h1>
          <p className="text-sm text-[#6b5d4f] font-light mt-1">Continuous ledger recording all generative AI decisions processed by Trust Console IQ.</p>
        </header>

        <section className="w-full bg-surface border border-outline-variant/15 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#b9b29c]/20 bg-surface-container-low/40">
                  <th className="px-6 py-4 text-[10px] font-medium tracking-widest text-[#817a67] uppercase">Decision ID</th>
                  <th className="px-6 py-4 text-[10px] font-medium tracking-widest text-[#817a67] uppercase">Timestamp</th>
                  <th className="px-6 py-4 text-[10px] font-medium tracking-widest text-[#817a67] uppercase">Type</th>
                  <th className="px-6 py-4 text-[10px] font-medium tracking-widest text-[#817a67] uppercase">Summary Context</th>
                  <th className="px-6 py-4 text-[10px] font-medium tracking-widest text-[#817a67] uppercase text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#b9b29c]/10 text-xs font-light text-[#373223]">
                {MOCK_HISTORY_LOGS.map((log) => {
                  let statusBadge = "border-emerald-600/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400";
                  if (log.status === "BLOCKED") {
                    statusBadge = "border-red-600/20 bg-red-500/5 text-[#9e422c]";
                  } else if (log.status === "CONDITIONAL") {
                    statusBadge = "border-amber-600/20 bg-amber-500/5 text-amber-700 dark:text-amber-400";
                  }

                  return (
                    <tr key={log.id} className="hover:bg-surface-container-low/20 transition-colors">
                      <td className="px-6 py-4 font-mono font-medium text-[#715b3e]">{log.id}</td>
                      <td className="px-6 py-4 text-stone-500">{log.timestamp}</td>
                      <td className="px-6 py-4 font-medium uppercase text-[10px] tracking-wide">{log.type}</td>
                      <td className="px-6 py-4 truncate max-w-[300px]" title={log.summary}>{log.summary}</td>
                      <td className="px-6 py-4 text-right">
                        <span className={`inline-block px-2.5 py-0.5 border text-[9px] uppercase tracking-widest font-medium ${statusBadge}`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-[#b9b29c]/10 bg-surface-container-low/20 flex justify-between items-center text-[10px] uppercase font-mono text-[#6b5d4f]">
            <span>Showing 15 of 50 Decisions</span>
            <div className="flex gap-4">
              <button disabled className="opacity-40 cursor-not-allowed">Previous</button>
              <button disabled className="opacity-40 cursor-not-allowed">Next</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
