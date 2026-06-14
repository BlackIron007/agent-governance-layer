"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, FastForward, CheckCircle2, AlertTriangle, ShieldAlert } from "lucide-react";

export interface ReplayEvent {
  timeOffset: number; // in seconds
  label: string;
  detail: string;
  status: "completed" | "warning" | "error" | "info";
}

interface DecisionReplayPlayerProps {
  onClose: () => void;
  verdict: "APPROVED" | "BLOCKED" | "CONDITIONAL_ALLOW";
  events?: ReplayEvent[];
}

const DEFAULT_EVENTS: ReplayEvent[] = [
  { timeOffset: 0, label: "Decision Submitted", detail: "Procurement proposal ingested into secure memory.", status: "info" },
  { timeOffset: 2, label: "Evidence Retrieved", detail: "Checked supplier vendor databases. Flagged missing SOC2 certificate.", status: "warning" },
  { timeOffset: 4, label: "Executive Board Debate", detail: "CISO vetoes proposal; CFO requests budget allowance overrides.", status: "info" },
  { timeOffset: 6, label: "CISO Issues Veto", detail: "Direct override registered due to critical perimeter security rule breach.", status: "error" },
  { timeOffset: 8, label: "Constitution Conflict Detected", detail: "Security Constitution overrides Financial Constitution constraints.", status: "error" },
  { timeOffset: 10, label: "NIST RMF Failure Detected", detail: "NIST access controls standards evaluation score dropped below 75%.", status: "error" },
  { timeOffset: 12, label: "Enterprise Simulation Predicts Cost Overrun", detail: "Monte Carlo warns of 41% failure cascade probability.", status: "warning" },
  { timeOffset: 14, label: "Final Verdict Issued", detail: "Decision locked to BLOCKED. Cryptographic hash saved to ledger.", status: "error" },
];

export default function DecisionReplayPlayer({ onClose, verdict, events = DEFAULT_EVENTS }: DecisionReplayPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [speed, setSpeed] = useState<1 | 2>(1);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const maxDuration = events[events.length - 1].timeOffset;

  useEffect(() => {
    if (isPlaying) {
      const intervalTime = 100 / speed; // 10 ticks per simulated second
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= maxDuration) {
            setIsPlaying(false);
            return maxDuration;
          }
          return Math.round((prev + 0.1) * 10) / 10;
        });
      }, intervalTime);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speed, maxDuration]);

  const handleRestart = () => {
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const getStatusIcon = (status: ReplayEvent["status"]) => {
    switch (status) {
      case "completed":
      case "info":
        return <CheckCircle2 className="w-4 h-4 text-[#3a684d]" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case "error":
        return <ShieldAlert className="w-4 h-4 text-[#9e422c]" />;
    }
  };

  const getStatusColor = (status: ReplayEvent["status"], isActive: boolean) => {
    if (!isActive) return "text-stone-400 border-stone-200";
    switch (status) {
      case "completed":
      case "info":
        return "text-[#3a684d] border-[#3a684d]/20 bg-[#3a684d]/5";
      case "warning":
        return "text-amber-700 border-amber-600/20 bg-amber-500/5";
      case "error":
        return "text-[#9e422c] border-[#9e422c]/20 bg-[#9e422c]/5";
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[110] flex items-center justify-center animate-overlayFadeIn p-4"
      style={{ background: "rgba(35, 33, 27, 0.8)", backdropFilter: "blur(12px)" }}
    >
      <div 
        className="w-full max-w-2xl bg-[#fffbf2] border border-[#b9b29c]/30 shadow-2xl p-6 md:p-8 relative"
        style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.4)" }}
      >
        {/* Terminal Header */}
        <div className="flex justify-between items-center border-b border-[#b9b29c]/25 pb-4 mb-6">
          <div>
            <span className="text-[9px] font-mono uppercase tracking-widest text-[#817a67] font-semibold">
              // Governance Replay Module
            </span>
            <h2 className="text-2xl font-light tracking-tighter text-[#373223] mt-1">
              Active Lifecycle Simulation
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-stone-500 hover:text-stone-800 text-xs uppercase tracking-wider font-mono border border-stone-300/60 px-3 py-1 bg-stone-50 hover:bg-stone-100 transition-colors"
          >
            Exit Player
          </button>
        </div>

        {/* Playback Controls & Progress Bar */}
        <div className="bg-[#f5eddd] border border-[#b9b29c]/20 p-4 mb-6 flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 bg-[#715b3e] text-[#fff9ee] hover:bg-[#644f33] transition-colors"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={handleRestart}
              className="p-2 border border-[#715b3e]/30 text-[#715b3e] hover:bg-[#715b3e]/5 transition-colors"
              title="Restart"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSpeed((s) => (s === 1 ? 2 : 1))}
              className="px-3 py-2 border border-[#715b3e]/30 text-[#715b3e] text-xs font-mono font-medium hover:bg-[#715b3e]/5 transition-colors flex items-center gap-1"
            >
              <FastForward className="w-3.5 h-3.5" />
              {speed}x
            </button>
          </div>

          <div className="flex-1 w-full sm:w-auto space-y-1.5">
            <div className="flex justify-between text-[10px] font-mono text-[#817a67]">
              <span>T+{currentTime.toFixed(1)}s</span>
              <span>Total duration: {maxDuration}s</span>
            </div>
            <div className="w-full bg-[#e3dac0] h-1.5 relative overflow-hidden">
              <div 
                className="bg-[#715b3e] h-full transition-all duration-100 ease-linear"
                style={{ width: `${(currentTime / maxDuration) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Replay Timeline Feed */}
        <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2">
          {events.map((evt, idx) => {
            const isDiscovered = currentTime >= evt.timeOffset;
            const isCurrent = isDiscovered && (idx === events.length - 1 || currentTime < events[idx + 1].timeOffset);
            
            return (
              <div 
                key={idx}
                className={`border p-3 flex gap-3 transition-all duration-300 ${
                  isCurrent 
                    ? getStatusColor(evt.status, true) + " border-[#715b3e] scale-[1.01] shadow-sm"
                    : isDiscovered
                    ? "bg-stone-50/50 border-stone-200/80 text-stone-700 opacity-80"
                    : "opacity-25"
                }`}
              >
                <div className="shrink-0 pt-0.5">
                  {isDiscovered ? getStatusIcon(evt.status) : <div className="w-4 h-4 rounded-full border border-dashed border-stone-300" />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] font-mono ${isCurrent ? "font-bold text-[#715b3e]" : "text-stone-500"}`}>
                      {evt.label}
                    </span>
                    <span className="text-[9px] font-mono text-stone-400">@{evt.timeOffset}s</span>
                  </div>
                  {isDiscovered && (
                    <p className="text-xs font-light text-[#6b5d4f] mt-1 leading-relaxed">
                      {evt.detail}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Verdict Banner on Finish */}
        {currentTime >= maxDuration && (
          <div className="mt-6 border border-red-600/30 bg-[#9e422c]/5 p-4 text-center animate-fadeIn">
            <span className="text-[9px] uppercase tracking-widest text-[#9e422c] font-bold">
              Simulation Replay Finished
            </span>
            <p className="text-sm font-light text-[#373223] mt-1">
              Final resolved policy outcome evaluated to <span className="font-semibold text-[#9e422c]">{verdict}</span>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
