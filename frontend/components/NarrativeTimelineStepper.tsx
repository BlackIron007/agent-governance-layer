"use client";

import { Check, Loader } from "lucide-react";

interface Step {
  label: string;
  description: string;
  status: "completed" | "current" | "upcoming";
}

interface NarrativeTimelineStepperProps {
  steps: Step[];
}

export default function NarrativeTimelineStepper({ steps }: NarrativeTimelineStepperProps) {
  return (
    <div className="border border-outline-variant/15 p-8 bg-[#fff9ee] shadow-sm w-full">
      <div className="mb-6">
        <h4 className="text-[10px] uppercase tracking-widest text-[#817a67] font-light">Governance Narrative Pathway</h4>
        <p className="text-[11px] text-[#6b5d4f] font-light mt-0.5">Automated sequence of audit verification and multi-agent consensus checks.</p>
      </div>

      <div className="relative pl-6 border-l border-[#b9b29c]/30 space-y-6 ml-2.5">
        {steps.map((step, idx) => {
          let markerBg = "bg-[#fff9ee] border-[#b9b29c]";
          let markerContent = null;
          let textOpacity = "opacity-50";
          let labelWeight = "font-light";

          if (step.status === "completed") {
            markerBg = "bg-[#715b3e] border-[#715b3e]";
            markerContent = <Check className="w-3 h-3 text-[#fff9ee]" />;
            textOpacity = "opacity-100";
            labelWeight = "font-normal";
          } else if (step.status === "current") {
            markerBg = "bg-[#fff9ee] border-[#715b3e] ring-4 ring-[#715b3e]/10";
            markerContent = <Loader className="w-3 h-3 text-[#715b3e] animate-spin" />;
            textOpacity = "opacity-100";
            labelWeight = "font-medium text-[#715b3e]";
          }

          return (
            <div key={idx} className="relative group transition-opacity duration-300">
              {/* Outer timeline indicator */}
              <div
                className={`absolute -left-[35px] top-1.5 w-6.5 h-6.5 rounded-full border flex items-center justify-center transition-all ${markerBg}`}
              >
                {markerContent}
              </div>

              <div className={`${textOpacity} space-y-1`}>
                <h5 className={`text-xs uppercase tracking-wider ${labelWeight}`}>
                  {step.label}
                </h5>
                <p className="text-xs font-light text-[#6b5d4f] leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
