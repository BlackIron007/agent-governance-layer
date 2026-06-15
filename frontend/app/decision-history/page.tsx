"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import { SkeletonTableRow } from "../../components/SkeletonLoader";
import { fetchDecisions } from "../../lib/api";
import {
  Database, AlertTriangle, ChevronLeft, ChevronRight,
  CheckCircle2, ShieldAlert, AlertCircle, RefreshCw
} from "lucide-react";

interface DecisionHistoryItem {
  decision_id: string;
  timestamp: string;
  decision_type: string;
  summary: string;
  verdict: string;
  execution_confidence: number;
  risk_exposure: number;
}

function VerdictBadge({ verdict }: { verdict: string }) {
  const cfg =
    verdict === "BLOCKED"
      ? { cls: "text-[#9e422c] bg-[#9e422c]/5 border-[#9e422c]/25", icon: ShieldAlert, label: "BLOCKED" }
      : verdict === "APPROVED"
      ? { cls: "text-emerald-700 bg-emerald-500/5 border-emerald-500/25", icon: CheckCircle2, label: "APPROVED" }
      : { cls: "text-amber-700 bg-amber-500/5 border-amber-500/20", icon: AlertCircle, label: "CONDITIONAL" };
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 border text-[9px] uppercase tracking-widest font-medium ${cfg.cls}`}>
      <Icon className="w-3 h-3" strokeWidth={1.5} />
      {cfg.label}
    </span>
  );
}

const PAGE_SIZE = 10;

export default function DecisionHistoryPage() {
  const [items, setItems] = useState<DecisionHistoryItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const loadDecisions = (targetPage: number) => {
    setLoading(true);
    setError(null);
    fetchDecisions(targetPage, PAGE_SIZE)
      .then((data) => {
        setItems(data.items ?? []);
        setTotal(data.total ?? 0);
        setPage(targetPage);
      })
      .catch(() => {
        setError("Could not connect to governance ledger. Showing cached audit trail.");
        // Graceful degradation with mock data
        const MOCK: DecisionHistoryItem[] = [
          { decision_id: "DEC-1495", timestamp: "2026-06-14T16:34:00Z", decision_type: "Procurement",      summary: "Vendor X database cloud selection.",               verdict: "BLOCKED",   execution_confidence: 0.38, risk_exposure: 0.84 },
          { decision_id: "DEC-1494", timestamp: "2026-06-14T15:20:00Z", decision_type: "Procurement",      summary: "Vendor Z circular collusion test run.",            verdict: "BLOCKED",   execution_confidence: 0.22, risk_exposure: 0.91 },
          { decision_id: "DEC-1493", timestamp: "2026-06-14T12:15:00Z", decision_type: "Security Override", summary: "Emergency administrative IAM role bypass.",        verdict: "CONDITIONAL_ALLOW", execution_confidence: 0.64, risk_exposure: 0.52 },
          { decision_id: "DEC-1492", timestamp: "2026-06-14T09:40:00Z", decision_type: "HR Screening",     summary: "Automated candidate sorting university ranking.",   verdict: "BLOCKED",   execution_confidence: 0.29, risk_exposure: 0.77 },
          { decision_id: "DEC-1491", timestamp: "2026-06-14T09:10:00Z", decision_type: "Clinical Ops",     summary: "Accelerate recovery-time dosage increase.",        verdict: "BLOCKED",   execution_confidence: 0.17, risk_exposure: 0.89 },
          { decision_id: "DEC-1490", timestamp: "2026-06-13T14:05:00Z", decision_type: "Procurement",      summary: "Select Vendor W for strategic hardware supply.",   verdict: "APPROVED",  execution_confidence: 0.87, risk_exposure: 0.21 },
          { decision_id: "DEC-1489", timestamp: "2026-06-13T11:30:00Z", decision_type: "Access Override",  summary: "API key scope expansion for staging servers.",     verdict: "APPROVED",  execution_confidence: 0.82, risk_exposure: 0.18 },
          { decision_id: "DEC-1488", timestamp: "2026-06-12T16:22:00Z", decision_type: "Financial Audit",  summary: "Automated expense ledger reconciliation review.",  verdict: "APPROVED",  execution_confidence: 0.91, risk_exposure: 0.12 },
          { decision_id: "DEC-1487", timestamp: "2026-06-12T13:15:00Z", decision_type: "Clinical Ops",     summary: "Adjust baseline sensor guidelines for patient B.", verdict: "CONDITIONAL_ALLOW", execution_confidence: 0.71, risk_exposure: 0.44 },
          { decision_id: "DEC-1486", timestamp: "2026-06-12T10:05:00Z", decision_type: "Procurement",      summary: "Vendor A hardware replenishment deal validation.", verdict: "BLOCKED",   execution_confidence: 0.31, risk_exposure: 0.73 },
        ];
        setItems(MOCK);
        setTotal(50);
      })
      .finally(() => {
        setLoading(false);
        setRetrying(false);
      });
  };

  useEffect(() => { loadDecisions(1); }, []);

  const retry = () => {
    setRetrying(true);
    loadDecisions(page);
  };

  const blockedCount = items.filter(i => i.verdict === "BLOCKED").length;
  const approvedCount = items.filter(i => i.verdict === "APPROVED").length;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background">
      <Navbar />

      <main className="flex-grow pt-28 pb-20 flex flex-col items-center w-full max-w-5xl mx-auto px-4 md:px-6">

        {/* Header */}
        <header className="w-full mb-8 animate-fadeIn">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <span className="text-[10px] font-normal tracking-[0.05em] uppercase text-[#817a67]">System Audit Trail</span>
              <h1 className="text-4xl font-light tracking-tighter text-[#373223] mt-2">Enterprise Decision History</h1>
              <p className="text-sm text-[#6b5d4f] font-light mt-1">
                Click any Decision ID to open the complete forensic audit record.
              </p>
            </div>
            {/* Live counters */}
            {!loading && (
              <div className="flex items-center gap-3 text-[10px] font-mono shrink-0">
                <span className="text-emerald-700 bg-emerald-500/5 border border-emerald-500/20 px-2 py-1">
                  {approvedCount} APPROVED
                </span>
                <span className="text-[#9e422c] bg-[#9e422c]/5 border border-[#9e422c]/20 px-2 py-1">
                  {blockedCount} BLOCKED
                </span>
                <span className="text-[#817a67] border border-[#b9b29c]/20 px-2 py-1">
                  {total} TOTAL
                </span>
              </div>
            )}
          </div>
        </header>

        {/* ── Governance Throughput Summary ── */}
        <section className="w-full bg-[#f5eddd] border border-[#b9b29c]/25 p-5 mb-6 shadow-sm animate-fadeIn">
          <span className="text-[9px] font-mono uppercase tracking-widest text-[#817a67] font-bold block border-b border-[#b9b29c]/10 pb-1.5 mb-3">
            // Governance Throughput Summary
          </span>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-[#fffbf2] border border-[#b9b29c]/15 p-3 text-center">
              <span className="text-2xl font-light font-mono text-stone-800">180</span>
              <span className="block text-[8px] uppercase tracking-wider text-[#817a67] font-medium mt-1">Decisions Governed Today</span>
            </div>
            <div className="bg-[#fffbf2] border border-[#b9b29c]/15 p-3 text-center">
              <span className="text-2xl font-light font-mono text-emerald-700">77%</span>
              <span className="block text-[8px] uppercase tracking-wider text-[#817a67] font-medium mt-1">Approval Rate</span>
            </div>
            <div className="bg-[#fffbf2] border border-[#b9b29c]/15 p-3 text-center">
              <span className="text-2xl font-light font-mono text-stone-800">4.2s</span>
              <span className="block text-[8px] uppercase tracking-wider text-[#817a67] font-medium mt-1">Average Governance Time</span>
            </div>
            <div className="bg-[#fffbf2] border border-[#b9b29c]/15 p-3 text-center">
              <span className="text-2xl font-light font-mono text-[#9e422c]">27</span>
              <span className="block text-[8px] uppercase tracking-wider text-[#817a67] font-medium mt-1">Total Attacks Simulated</span>
            </div>
            <div className="bg-[#fffbf2] border border-[#b9b29c]/15 p-3 text-center">
              <span className="text-2xl font-light font-mono text-amber-700">51</span>
              <span className="block text-[8px] uppercase tracking-wider text-[#817a67] font-medium mt-1">Conflicts Prevented</span>
            </div>
          </div>
        </section>

        {/* Error banner */}
        {error && (
          <div className="w-full border border-amber-500/25 bg-amber-500/5 p-3 mb-4 flex items-center justify-between text-xs text-amber-700 animate-fadeIn">
            <span className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {error}
            </span>
            <button
              onClick={retry}
              className="flex items-center gap-1 text-[9px] uppercase font-mono border border-amber-500/30 px-2 py-1 hover:bg-amber-500/10 transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${retrying ? "animate-spin" : ""}`} />
              Retry
            </button>
          </div>
        )}

        {/* Decision table */}
        <section className="w-full bg-surface border border-outline-variant/15 shadow-sm overflow-hidden animate-slideUp">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-[#b9b29c]/20 bg-surface-container-low/40">
                  <th className="px-5 py-4 text-[10px] font-medium tracking-widest text-[#817a67] uppercase">
                    <span className="flex items-center gap-1.5"><Database className="w-3 h-3" /> Decision ID</span>
                  </th>
                  <th className="px-5 py-4 text-[10px] font-medium tracking-widest text-[#817a67] uppercase">Timestamp</th>
                  <th className="px-5 py-4 text-[10px] font-medium tracking-widest text-[#817a67] uppercase">Type</th>
                  <th className="px-5 py-4 text-[10px] font-medium tracking-widest text-[#817a67] uppercase">Summary Context</th>
                  <th className="px-5 py-4 text-[10px] font-medium tracking-widest text-[#817a67] uppercase text-right">Confidence</th>
                  <th className="px-5 py-4 text-[10px] font-medium tracking-widest text-[#817a67] uppercase text-right">Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#b9b29c]/10 text-xs font-light text-[#373223]">
                {loading ? (
                  [...Array(PAGE_SIZE)].map((_, i) => <SkeletonTableRow key={i} />)
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-[#817a67]">
                      No decisions found in audit ledger.
                    </td>
                  </tr>
                ) : (
                  items.map((item) => {
                    const date = new Date(item.timestamp);
                    const dateStr = date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
                    const timeStr = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
                    const confPct = Math.round(item.execution_confidence * 100);

                    return (
                      <tr key={item.decision_id} className="hover:bg-surface-container-low/20 transition-colors group">
                        <td className="px-5 py-4 font-mono font-medium">
                          <Link
                            href={`/decision/${item.decision_id}`}
                            className="text-[#715b3e] hover:underline group-hover:text-[#644f33]"
                          >
                            {item.decision_id}
                          </Link>
                        </td>
                        <td className="px-5 py-4 text-stone-500 whitespace-nowrap">
                          <span className="block">{dateStr}</span>
                          <span className="text-[10px] text-[#817a67]">{timeStr}</span>
                        </td>
                        <td className="px-5 py-4 font-medium uppercase text-[10px] tracking-wide text-[#373223]">
                          {item.decision_type}
                        </td>
                        <td className="px-5 py-4 text-[#6b5d4f] max-w-[260px] truncate" title={item.summary}>
                          {item.summary}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex flex-col items-end gap-1">
                            <span className="font-mono text-[11px] font-medium text-[#373223]">{confPct}%</span>
                            <div className="w-12 bg-[#f5eddd] h-1 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#715b3e] rounded-full"
                                style={{ width: `${confPct}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <VerdictBadge verdict={item.verdict} />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-[#b9b29c]/10 bg-surface-container-low/20 flex flex-wrap justify-between items-center gap-3 text-[10px] uppercase font-mono text-[#6b5d4f]">
            <span>
              Showing {items.length > 0 ? ((page - 1) * PAGE_SIZE + 1) : 0}–{Math.min(page * PAGE_SIZE, total)} of {total} Decisions
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => loadDecisions(page - 1)}
                disabled={page <= 1 || loading}
                className="flex items-center gap-1 px-3 py-1.5 border border-[#b9b29c]/20 hover:border-[#715b3e]/30 hover:text-[#715b3e] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-3 h-3" /> Prev
              </button>
              <span className="text-[#817a67] px-2">{page} / {totalPages || 1}</span>
              <button
                onClick={() => loadDecisions(page + 1)}
                disabled={page >= totalPages || loading}
                className="flex items-center gap-1 px-3 py-1.5 border border-[#b9b29c]/20 hover:border-[#715b3e]/30 hover:text-[#715b3e] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
