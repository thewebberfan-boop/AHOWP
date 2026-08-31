import type { SelfSummaryUnit } from "./problem-map-self-data";

// Membership is authored at the argument level, never inferred from a whole era.
export function argument(id: string, period: string, question: string, thesis: string, transition: string, nodes: string): SelfSummaryUnit {
  const nodeIds = [...new Set(nodes.trim().split(/\s+/))];
  return { id, title: question, period, question, thesis, transition, nodeIds, entryNodeId: nodeIds[0] };
}

export function group(id: string, period: string, question: string, thesis: string, transition: string, children: SelfSummaryUnit[], overview?: string, sources?: SelfSummaryUnit["sources"]): SelfSummaryUnit {
  return { id, title: question, period, question, thesis, transition, children, overview, sources };
}
