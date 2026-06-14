export async function verify(question: string, answer: string, mode: string = "full") {
  const res = await fetch("/api/v1/verify_llm_response", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "",
    },
    body: JSON.stringify({
      question: question.trim() || answer,
      answer: answer,
      mode: mode,
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`API Error: ${res.status} ${res.statusText} — ${errorBody}`);
  }

  return res.json();
}

export async function explainClaim(claimText: string) {
  const res = await fetch("/api/v1/explain", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "",
    },
    body: JSON.stringify({
      claim_text: claimText,
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`API Error: ${res.status} ${res.statusText} — ${errorBody}`);
  }

  return res.json();
}

export async function fetchRecentVerifications() {
  const res = await fetch("/api/v1/recent_verifications", {
    headers: {
      "X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "",
    },
  });

  if (!res.ok) {
    return [];
  }

  return res.json();
}

// ---------------------------------------------------------------------------
// GOVERNANCE DECISION API
// ---------------------------------------------------------------------------

/**
 * GET /api/v1/decisions
 * Returns paginated governance decision summaries for the audit trail.
 */
export async function fetchDecisions(page: number = 1, pageSize: number = 50) {
  const res = await fetch(`/api/v1/decisions?page=${page}&page_size=${pageSize}`, {
    headers: {
      "X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch decisions: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/**
 * GET /api/v1/decisions/{decisionId}
 * Returns the full forensic audit record for a single governance decision.
 * Used to power the /decision/[id] page.
 */
export async function fetchDecision(decisionId: string) {
  const res = await fetch(`/api/v1/decisions/${encodeURIComponent(decisionId)}`, {
    headers: {
      "X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "",
    },
  });

  if (!res.ok) {
    if (res.status === 404) {
      return null;
    }
    throw new Error(`Failed to fetch decision ${decisionId}: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/**
 * GET /api/v1/governance/intelligence
 * Returns the full Governance Intelligence Hub report including:
 * - Governance Health Index
 * - Constitutional drift metrics
 * - Riskiest agent leaderboard
 * - Top constitutional violations
 * - Policy friction index
 * - Policy evolution recommendations
 */
export async function fetchGovernanceIntelligence() {
  const res = await fetch("/api/v1/governance/intelligence", {
    headers: {
      "X-API-Key": process.env.NEXT_PUBLIC_API_KEY || "",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch governance intelligence: ${res.status} ${res.statusText}`);
  }

  return res.json();
}