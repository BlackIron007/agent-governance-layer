import { useState, useMemo } from "react";
import { CAUSAL_NODES, CAUSAL_EDGES, getCausalTrace, CausalNode, CausalEdge } from "../lib/causalGraphEngine";

export function useCausalGraph(initialNodeId: string | null = "node-soc2-missing") {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(initialNodeId);

  const selectedNode = useMemo(() => {
    if (!selectedNodeId) return null;
    return CAUSAL_NODES.find((n) => n.id === selectedNodeId) || CAUSAL_NODES.find((n) => {
      // Map node-1 to vendor select, node-3 to soc2-missing, etc.
      if (selectedNodeId === "node-1" || selectedNodeId === "node-2") return n.id === "node-vendor-select";
      if (selectedNodeId === "node-3") return n.id === "node-soc2-missing";
      if (selectedNodeId === "node-4") return n.id === "node-ciso-reject";
      if (selectedNodeId === "node-5") return n.id === "node-security-triggered";
      if (selectedNodeId === "node-6") return n.id === "node-risk-spike";
      if (selectedNodeId === "node-7") return n.id === "node-nist-fail";
      if (selectedNodeId === "node-8") return n.id === "node-final-verdict";
      return n.id === selectedNodeId;
    }) || null;
  }, [selectedNodeId]);

  const { upstreams, downstreams } = useMemo(() => {
    if (!selectedNode) return { upstreams: [], downstreams: [] };
    return getCausalTrace(selectedNode.id);
  }, [selectedNode]);

  return {
    selectedNodeId: selectedNode?.id || selectedNodeId,
    selectedNode,
    upstreamIds: upstreams,
    downstreamIds: downstreams,
    nodes: CAUSAL_NODES,
    edges: CAUSAL_EDGES,
    selectNode: setSelectedNodeId
  };
}
