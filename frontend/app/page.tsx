"use client";

import { FileSearch, Network, Scale, ChevronDown, Lock, Cpu, Shield } from "lucide-react";
import Link from "next/link";
import Navbar from "../components/Navbar";

export default function LandingPage() {
  const faqs = [
    { q: "What is Trust Console IQ?", a: "Trust Console IQ is an enterprise AI governance operating system designed to audit, debate, simulate, and check AI decisions for compliance, risk, and structural vulnerabilities before they go live." },
    { q: "What are the decision evaluations performed?", a: "Every decision traverses multiple independent engines: an Executive Board Debate, a Constitutional scorecard evaluation, an Adversarial attack simulation, a Monte Carlo risk forecast, and a Regulatory review." },
    { q: "Does the system keep audit records?", a: "Yes. An enterprise-grade decision audit trail is persisted showing historical logs under /decision-history, helping organizations track continuous compliance posture." },
    { q: "What is Governance Evolution?", a: "Governance Evolution is our killer feature. It monitors decision patterns and recommends automated modifications to constitutional guidelines to minimize friction and prevent drift." }
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background">
      <Navbar />

      <main className="flex-grow pt-28 pb-20 flex flex-col items-center w-full max-w-5xl mx-auto px-6">
        <div className="w-full max-w-3xl text-center mb-20 animate-fadeIn">
          <h1 className="text-4xl sm:text-5xl font-light tracking-tighter text-on-background mb-6 leading-tight">
            Govern Every <span className="text-[#715b3e] font-normal">AI Decision</span> Before It Impacts Reality.
          </h1>
          <p className="border border-outline-variant/15 bg-surface-container-low p-6 text-base sm:text-lg text-secondary leading-relaxed font-light shadow-sm mb-10">
            Trust Console IQ audits, challenges, simulates, and governs generative AI recommendations before they reach your customers, employees, vendors, regulators, or critical production databases.
          </p>
          <Link
            href="/command-center"
            className="inline-block bg-primary text-on-primary px-10 py-4 text-sm tracking-widest uppercase font-light hover:bg-[#644f33] shadow-md transition-all"
          >
            Convene Decision Command Center &rarr;
          </Link>
        </div>

        <div className="w-full border-t border-outline-variant/10 my-4"></div>

        {/* Dynamic Capability Reveal Flow */}
        <section className="w-full mt-12 mb-20 animate-fadeIn" style={{ animationDelay: "200ms", animationFillMode: "both" }}>
          <h2 className="text-3xl font-light text-center text-on-background mb-4 tracking-tighter">
            How One Decision Gets Governed
          </h2>
          <p className="text-center text-xs text-[#817a67] font-mono uppercase tracking-widest mb-10">
            Hover over nodes to explore active reasoning layers
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 relative">
            {[
              { id: "proposal", label: "Proposal", desc: "AI optimization proposal gets intercepted before executing." },
              { id: "evidence", label: "Evidence Retrieval", desc: "Retrieve verified supplier compliance history." },
              { id: "board", label: "Executive Board Debate", desc: "CISO, CFO, and Legal debate operational trade-offs." },
              { id: "constitution", label: "Constitution Evaluation", desc: "Compare actions against active ESG & safety standards." },
              { id: "adversarial", label: "Adversarial Attack Testing", desc: "Red-team simulations for reward-hacking exploits." },
              { id: "simulation", label: "Enterprise Simulation", desc: "Monte Carlo projected downstream cost estimations." },
              { id: "regulatory", label: "Regulatory Review", desc: "Verify NIST & SOC2 compliance criteria." },
              { id: "verdict", label: "Verdict", desc: "Final immutable ledger record gets sealed." },
            ].map((node, i) => (
              <div 
                key={node.id} 
                className="bg-surface border border-outline-variant/15 p-4 text-center transition-all duration-300 relative group overflow-hidden"
              >
                <div className="text-[10px] font-mono text-[#715b3e] mb-1">Step 0{i + 1}</div>
                <h4 className="text-xs font-semibold text-stone-700 leading-tight">{node.label}</h4>
                
                {/* Reveal on hover */}
                <div className="absolute inset-0 bg-[#fffbf2] p-3 flex items-center justify-center text-[9px] leading-normal text-[#6b5d4f] font-light opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border border-[#715b3e]/30">
                  {node.desc}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="w-full border-t border-outline-variant/10 my-4"></div>

        <section id="privacy" className="w-full mt-16 mb-16 scroll-mt-24 animate-fadeIn" style={{ animationDelay: "300ms", animationFillMode: "both" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-full bg-[#3a684d]/10 flex items-center justify-center text-[#3a684d]">
              <Lock strokeWidth={1.5} className="w-4 h-4" />
            </div>
            <h2 className="text-2xl font-light tracking-tighter text-on-background">Zero-Retention Security</h2>
          </div>
          <div className="bg-surface border border-outline-variant/15 p-8 space-y-4">
            <p className="text-base font-light leading-relaxed text-secondary">
              Veritas and Trust Console IQ operate under a strict zero-retention framework, keeping all session variables securely in memory and purging data immediately after audit.
            </p>
          </div>
        </section>

        <section id="architecture" className="w-full mb-16 scroll-mt-24 animate-fadeIn" style={{ animationDelay: "400ms", animationFillMode: "both" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Shield strokeWidth={1.5} className="w-4 h-4" />
            </div>
            <h2 className="text-2xl font-light tracking-tighter text-on-background">Robust AI Compliance</h2>
          </div>
          <div className="bg-surface border border-outline-variant/15 p-8 space-y-4">
            <p className="text-base font-light leading-relaxed text-secondary">
              Incorporate compliance rules, ESG constraints, security requirements, and financial targets in parallel to check every output's alignment.
            </p>
          </div>
        </section>

        <div className="w-full border-t border-outline-variant/10 my-4"></div>

        <section className="w-full mt-12 mb-20 animate-fadeIn" style={{ animationDelay: "500ms", animationFillMode: "both" }}>
          <h2 className="text-3xl font-light text-center text-on-background mb-10 tracking-tighter">Frequently Asked Questions</h2>
          <div className="flex flex-col gap-3 max-w-3xl mx-auto">
            {faqs.map((faq, i) => (
              <details key={i} className="group border border-outline-variant/20 bg-surface p-6 shadow-sm">
                <summary className="flex justify-between items-center font-medium text-base text-on-surface list-none outline-none cursor-pointer">
                  {faq.q}
                  <span className="text-[#3a684d] group-open:rotate-180 transition-transform duration-300">
                    <ChevronDown strokeWidth={1.5} className="w-4 h-4" />
                  </span>
                </summary>
                <p className="mt-4 text-sm font-light leading-relaxed text-secondary border-t border-outline-variant/10 pt-4">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-[#b9b29c]/15 bg-[#fff9ee] dark:bg-stone-950">
        <div className="flex justify-between items-center px-12 py-8 w-full max-w-[1600px] mx-auto">
          <span className="text-[10px] font-normal tracking-[0.05em] uppercase text-[#817a67] dark:text-[#b9b29c]">© 2026 Trust Console IQ. All Rights Reserved.</span>
        </div>
      </footer>
    </div>
  );
}