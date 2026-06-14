// GuidedDemoOverlay.tsx — 7-step polished demo overlay for hackathon judges
"use client";

import { useState, useEffect } from "react";
import {
  Play, ArrowRight, X, CheckCircle2, FileText, Users,
  Scale, ShieldAlert, BarChart2, ShieldCheck, Sparkles
} from "lucide-react";

interface DemoStep {
  step: number;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  highlight: string;
  accentColor: string;
}

const DEMO_STEPS: DemoStep[] = [
  {
    step: 1,
    title: "Decision Submitted",
    subtitle: "AI Proposal Ingested",
    description: "A procurement AI recommends selecting Vendor X — 20% cheaper, but without SOC2 compliance. Trust Console IQ intercepts the decision before execution.",
    icon: FileText,
    highlight: "Proposal received and logged. Cryptographic audit hash generated.",
    accentColor: "#715b3e",
  },
  {
    step: 2,
    title: "Board Debate",
    subtitle: "Executive Consensus Engine",
    description: "Five independent board agents — CFO, CISO, Legal, Operations, and Procurement — simultaneously review the proposal and cast votes with supporting evidence.",
    icon: Users,
    highlight: "CFO: APPROVED | CISO: REJECTED | Legal: REJECTED | Board Verdict: BLOCKED",
    accentColor: "#715b3e",
  },
  {
    step: 3,
    title: "Constitutional Review",
    subtitle: "Multi-Framework Alignment Check",
    description: "The proposal is scored against four constitutional frameworks: Security, Compliance, Financial, and Sustainability. Principle conflicts are detected and resolved.",
    icon: Scale,
    highlight: "SECURITY vs FINANCIAL conflict detected. Security veto override enforced.",
    accentColor: "#3a684d",
  },
  {
    step: 4,
    title: "Regulatory Review",
    subtitle: "Compliance Intelligence Layer",
    description: "SOC2, NIST RMF, ISO 42001, and Microsoft Responsible AI standards are evaluated in parallel. Critical violations trigger automatic blocking exceptions.",
    icon: ShieldCheck,
    highlight: "SOC2: FAILED (58%) | NIST RMF: FAILED (74%) | Blocking exception raised.",
    accentColor: "#9e422c",
  },
  {
    step: 5,
    title: "Adversarial Lab",
    subtitle: "Red-Team Stress Testing",
    description: "Attack vectors are simulated: reward hacking, policy gaming, circular collusion, and constitution exploit attempts. The governance layer is stress-tested against manipulation.",
    icon: ShieldAlert,
    highlight: "Reward Hacking exploit detected (Severity: HIGH). Mitigation applied.",
    accentColor: "#9e422c",
  },
  {
    step: 6,
    title: "Enterprise Simulation",
    subtitle: "Monte Carlo Risk Forecasting",
    description: "Multiple future scenarios are simulated across Q1–Q4 projections: Expected Outcome, Best Case, Failure Cascade, and Regulatory Failure scenarios evaluated.",
    icon: BarChart2,
    highlight: "Failure Cascade: 41% probability | Risk exposure: 84 | Value score drops to 12.",
    accentColor: "#715b3e",
  },
  {
    step: 7,
    title: "Final Verdict",
    subtitle: "Governance Decision Locked",
    description: "All engine outputs are synthesized into a final governance verdict. The cryptographic audit record is sealed and stored in the immutable decision ledger.",
    icon: Sparkles,
    highlight: "BLOCKED — Execution blocked. Forensic audit record sealed and locked.",
    accentColor: "#9e422c",
  },
];

interface GuidedDemoOverlayProps {
  onClose: () => void;
}

export default function GuidedDemoOverlay({ onClose }: GuidedDemoOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [autoplay, setAutoplay] = useState(false);

  const step = DEMO_STEPS[currentStep];
  const StepIcon = step.icon;
  const isLast = currentStep === DEMO_STEPS.length - 1;

  const goNext = () => {
    if (animating) return;
    if (isLast) {
      setAutoplay(false);
      onClose();
      // Auto open forensic page on finish
      window.location.href = "/decision/DEC-1495";
      return;
    }
    setAnimating(true);
    setTimeout(() => {
      setCurrentStep((s) => s + 1);
      setAnimating(false);
    }, 220);
  };

  // Autoplay effect
  useEffect(() => {
    let t: NodeJS.Timeout;
    if (autoplay && !animating) {
      t = setTimeout(() => {
        goNext();
      }, 3000); // 3 seconds per step
    }
    return () => clearTimeout(t);
  }, [autoplay, currentStep, animating]);

  const goTo = (idx: number) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrentStep(idx);
      setAnimating(false);
    }, 180);
  };

  // Keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "Enter") goNext();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center animate-overlayFadeIn"
      style={{ background: "rgba(55, 50, 35, 0.72)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-2xl mx-4 bg-[#fffbf2] border border-[#b9b29c]/25 shadow-2xl overflow-hidden"
        style={{ boxShadow: "0 32px 80px rgba(55, 50, 35, 0.28)" }}
      >
        {/* Top accent bar */}
        <div className="h-[3px] w-full" style={{ background: `linear-gradient(90deg, ${step.accentColor}, ${step.accentColor}88)` }} />

        {/* Header row */}
        <div className="flex items-center justify-between px-8 pt-6 pb-2">
          <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.12em] text-[#817a67] font-medium">
            <Play className="w-3 h-3 text-[#715b3e]" />
            <span>Guided Demo Mode</span>
            <span className="mx-1 text-[#b9b29c]">·</span>
            <span className="font-mono text-[#715b3e]">Step {currentStep + 1} of {DEMO_STEPS.length}</span>
          </div>
          <button
            onClick={onClose}
            className="text-[#817a67] hover:text-[#373223] transition-colors"
            aria-label="Close demo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step dots */}
        <div className="flex items-center gap-1.5 px-8 pb-6">
          {DEMO_STEPS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={`transition-all duration-300 rounded-full ${
                idx === currentStep
                  ? "w-6 h-1.5 bg-[#715b3e]"
                  : idx < currentStep
                  ? "w-1.5 h-1.5 bg-[#715b3e]/40"
                  : "w-1.5 h-1.5 bg-[#b9b29c]/40"
              }`}
              aria-label={`Go to step ${idx + 1}`}
            />
          ))}
        </div>

        {/* Main content */}
        <div
          className={`px-8 pb-8 transition-opacity duration-200 ${animating ? "opacity-0" : "opacity-100"}`}
        >
          {/* Icon + title */}
          <div className="flex items-start gap-5 mb-6">
            <div
              className="w-14 h-14 rounded-sm flex items-center justify-center shrink-0"
              style={{ background: `${step.accentColor}10`, border: `1px solid ${step.accentColor}20` }}
            >
              <StepIcon className="w-6 h-6" style={{ color: step.accentColor }} strokeWidth={1.5} />
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-widest font-medium" style={{ color: step.accentColor }}>
                Engine {step.step} — {step.subtitle}
              </span>
              <h2 className="text-2xl font-light tracking-tighter text-[#373223] mt-1">{step.title}</h2>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm font-light leading-relaxed text-[#6b5d4f] mb-6">
            {step.description}
          </p>

          {/* Highlight box */}
          <div
            className="p-4 mb-8"
            style={{ background: `${step.accentColor}06`, border: `1px solid ${step.accentColor}18` }}
          >
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: step.accentColor }} />
              <p className="text-xs font-mono leading-relaxed" style={{ color: step.accentColor }}>
                {step.highlight}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <div className="text-[10px] text-[#817a67] font-light flex items-center gap-2">
              <button
                onClick={() => setAutoplay(!autoplay)}
                className={`px-3 py-1.5 text-[9px] uppercase font-mono tracking-widest border transition-all ${
                  autoplay 
                    ? "bg-[#3a684d] text-[#fff9ee] border-[#3a684d]" 
                    : "bg-[#715b3e]/10 text-[#715b3e] border-[#715b3e]/20 hover:bg-[#715b3e]/20"
                }`}
              >
                {autoplay ? "● Playing Demo..." : "Run Full Governance Demonstration"}
              </button>
              {isLast ? (
                <span className="text-[#3a684d]">✓ Tour complete</span>
              ) : (
                <span>Press <kbd className="font-mono bg-[#f5eddd] border border-[#b9b29c]/20 px-1 py-0.5 text-[9px]">→</kbd></span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="text-[10px] uppercase tracking-widest text-[#817a67] hover:text-[#373223] transition-colors font-light"
              >
                Skip Tour
              </button>
              <button
                onClick={goNext}
                className="flex items-center gap-2 px-6 py-2.5 text-[10px] uppercase tracking-widest font-medium text-[#fff9ee] transition-all hover:opacity-90"
                style={{ background: step.accentColor }}
              >
                {isLast ? "Close Tour" : "Next Step"}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
