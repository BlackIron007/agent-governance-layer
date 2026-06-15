"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

interface AlternativeOutcomeCardProps {
  label: string;
  actualValue: string | number;
  altValue: string | number;
  valueSuffix?: string;
  isNegativeProgress?: boolean;
}

export default function AlternativeOutcomeCard({
  label,
  actualValue,
  altValue,
  valueSuffix = "",
  isNegativeProgress = false
}: AlternativeOutcomeCardProps) {
  return (
    <div className="bg-[#fff9ee] p-3 border border-[#b9b29c]/20 rounded space-y-1 font-mono text-xs">
      <span className="text-stone-400 block text-[9px] uppercase font-bold">{label}</span>
      <div className="flex items-center justify-between mt-1">
        <span className="text-stone-600">{actualValue}{valueSuffix}</span>
        <ArrowRight className="w-3.5 h-3.5 text-[#715b3e]" />
        <span className={`font-bold ${
          isNegativeProgress ? "text-[#9e422c]" : "text-emerald-700"
        }`}>
          {altValue}{valueSuffix}
        </span>
      </div>
    </div>
  );
}
