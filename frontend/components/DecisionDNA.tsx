"use client";

interface DNAPoint {
  label: string;
  value: number;
  color: string;
}

interface DecisionDNAProps {
  dna: DNAPoint[];
}

export default function DecisionDNA({ dna }: DecisionDNAProps) {
  return (
    <div className="border border-outline-variant/15 p-6 bg-surface-container-low/30 shadow-sm w-full">
      <div className="mb-4">
        <h4 className="text-[10px] uppercase tracking-widest text-[#817a67] font-light">Decision DNA Drivers</h4>
        <p className="text-[11px] text-[#6b5d4f] font-light mt-0.5">Factual weights and core vectors influencing the final execution score.</p>
      </div>

      <div className="flex flex-col gap-4">
        {dna.map((point, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between text-xs font-light text-[#373223]">
              <span className="tracking-tight">{point.label}</span>
              <span className="font-mono text-[11px] font-medium text-[#715b3e]">{point.value}%</span>
            </div>
            <div className="w-full bg-[#f5eddd] h-[6px] rounded-full overflow-hidden">
              <div
                className={`${point.color} h-full rounded-full transition-all duration-700 ease-out`}
                style={{ width: `${point.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
