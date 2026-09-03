// Editorial order is navigation, not a claim of deduction between neighbours.
// All explanatory prose remains in the canonical problem graph.
export type PhilosopherReading = {
  id: string;
  label: string;
  questionId: string;
  nodeIds: string[];
};

export const reading = (id: string, label: string, questionId: string, nodes: string): PhilosopherReading => ({
  id, label, questionId, nodeIds: nodes.trim().split(/\s+/),
});
