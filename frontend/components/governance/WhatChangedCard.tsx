"use client";

import React from "react";

interface WhatChangedCardProps {
  label: string;
  from: string | number;
  to: string | number;
  isDanger?: boolean;
}

export default function WhatChangedCard({ label, from, to, isDanger = false }: WhatChangedCardProps) {
  return (
    <div className="bg-[#fffbf2] border border-[#b9b29c]/20 p-3.5 rounded text-center space-y-1.5 font-mono text-xs">
      <span className="block text-[8.5px] text-stone-500 uppercase tracking-tight leading-tight min-h-[22px]">
        {label}
      </span>
      <div className="flex items-center justify-center gap-1.5">
        <span className="text-stone-400 font-light">{from}</span>
        <span className="text-stone-300 font-light">&rarr;</span>
        <span className={`font-bold ${isDanger ? "text-[#9e422c]" : "text-emerald-700"}`}>
          {to}
        </span>
      </div>
    </div>
  );
}
