"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { 
  GovernanceEvent, 
  GOVERNANCE_EVENTS, 
  EventStage, 
  EVIDENCE_ARTIFACTS, 
  EvidenceArtifact 
} from "../lib/mockGovernanceReplay";

export function useGovernanceReplay() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [speed, setSpeed] = useState<1 | 2 | 4>(1);

  // Restart sequence helper
  const restart = useCallback(() => {
    setTimeElapsed(0);
    setIsPlaying(true);
  }, []);

  // Tick timer
  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = 1000 / speed;
    const timer = setInterval(() => {
      setTimeElapsed((prev) => {
        if (prev >= 72) {
          return 0; // Loop automatically
        }
        return prev + 1;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, speed]);

  // Derive current stage based on simulated offset
  const currentStage = useMemo<EventStage>(() => {
    if (timeElapsed >= 0 && timeElapsed <= 5) return "ARRIVAL";
    if (timeElapsed >= 6 && timeElapsed <= 14) return "EVIDENCE";
    if (timeElapsed >= 15 && timeElapsed <= 34) return "BOARD";
    if (timeElapsed >= 35 && timeElapsed <= 49) return "CAUSALITY";
    if (timeElapsed >= 50 && timeElapsed <= 54) return "REGULATORY";
    if (timeElapsed >= 55 && timeElapsed <= 62) return "CONVERGENCE";
    return "ROOT_CAUSE";
  }, [timeElapsed]);

  // Filter active events up to current offset
  const activeEvents = useMemo(() => {
    return GOVERNANCE_EVENTS.filter((e) => e.timestamp <= timeElapsed);
  }, [timeElapsed]);

  // Derive current telemetry parameters based on completed/loaded logs
  const telemetry = useMemo(() => {
    let risk = 32;
    let confidence = 91;
    let evidence = 68;

    if (timeElapsed >= 6) {
      evidence = 50;
      confidence = 82;
    }
    if (timeElapsed >= 7) {
      risk = 45;
    }
    if (timeElapsed >= 11) {
      risk = 55;
    }
    if (timeElapsed >= 13) {
      risk = 62;
    }
    if (timeElapsed >= 15) {
      evidence = 75;
      confidence = 64;
    }
    if (timeElapsed >= 19) {
      risk = 72;
    }
    if (timeElapsed >= 22) {
      risk = 81;
    }
    if (timeElapsed >= 28) {
      risk = 88;
    }
    if (timeElapsed >= 35) {
      confidence = 45;
      evidence = 82;
    }
    if (timeElapsed >= 41) {
      risk = 92;
    }
    if (timeElapsed >= 50) {
      risk = 98;
      confidence = 10;
      evidence = 95;
    }

    return { risk, confidence, evidence };
  }, [timeElapsed]);

  // Active verified/failed artifacts loaded by timeElapsed
  const activeArtifacts = useMemo<(EvidenceArtifact & { isDiscovered: boolean })[]>(() => {
    return EVIDENCE_ARTIFACTS.map((art) => {
      // Map string offset time, e.g. "T+7s" -> 7
      const timeSec = parseInt(art.timestamp.replace("T+", "").replace("s", ""), 10);
      return {
        ...art,
        isDiscovered: timeElapsed >= timeSec
      };
    }) as (EvidenceArtifact & { isDiscovered: boolean })[];
  }, [timeElapsed]);

  const seek = useCallback((targetTime: number) => {
    setTimeElapsed(Math.max(0, Math.min(72, targetTime)));
  }, []);

  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);
  const togglePlay = useCallback(() => setIsPlaying((p) => !p), []);

  return {
    isPlaying,
    timeElapsed,
    speed,
    currentStage,
    activeEvents,
    telemetry,
    activeArtifacts,
    play,
    pause,
    togglePlay,
    seek,
    restart,
    setSpeed
  };
}
