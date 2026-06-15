"use client";

import React from "react";
import { ShieldAlert, ShieldCheck } from "lucide-react";

interface GovernancePositionCardProps {
  position: "BLOCK" | "ALLOW" | "CONDITIONAL";
  confidence: number;
}

export default function GovernancePositionCard({ position, confidence }: GovernancePositionCardProps) {
  const isBlock = position === "BLOCK";
  return (
    <div className={`p-4 border rounded flex items-center justify-between font-sans ${
      isBlock ? "bg-red-50 border-red-500/20 text-[#9e422c]" : "bg-emerald-50 border-emerald-500/20 text-emerald-700"
    }`}>
      <div className="flex items-center gap-2.5">
        {isBlock ? (
          <ShieldAlert className="w-5 h-5 text-[#9e422c] shrink-0" />
        ) : (
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
        )}
        <div>
          <span className="text-[9px] font-mono uppercase text-stone-400 block font-semibold">
            System Position
          </span>
          <span className="text-sm font-bold block leading-none mt-0.5">
            {position}
          </span>
        </div>
      </div>
      <div className="text-right">
        <span className="text-[9px] font-mono uppercase text-stone-400 block font-semibold">
          Confidence
        </span>
        <span className="text-xs font-mono font-bold block mt-0.5">
          {confidence}%
        </span>
      </div>
    </div>
  );
}
