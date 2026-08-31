import { ancientDifferenceProblemMap, type ProblemEdge, type ProblemNode } from "./problem-map-data";
import { collectSelfSummaryNodeIds, type SelfSummaryUnit, type ProblemCompressionLevel } from "./problem-map-self-data";
import { flattenTopicLevel, nodeReadingTopics, readingTopicIds, resolveTopicUnit, topicLabel, type ReadingTopicId } from "./reading-topics-data";
import { problemPhaseHistoryStageIds } from "./problem-map-view-data";
import { schoolProfiles } from "./school-data";

export type ReadingTarget = { topicId?: ReadingTopicId; unitId: string; nodeId: string; level: ProblemCompressionLevel };
export type KnowledgeContext = { kind: "philosopher" | "school" | "history"; id: string };
export const knowledgeNodeById = new Map(ancientDifferenceProblemMap.phases.flatMap((phase) => phase.nodes.map((node) => [node.id, node])));
export const knowledgePhaseByNodeId = new Map(ancientDifferenceProblemMap.phases.flatMap((phase) => phase.nodes.map((node) => [node.id, phase])));

export function selfNodeTopics(nodeId: string) {
  return nodeReadingTopics(nodeId).map(topicLabel);
}

export function knowledgeUnitsFor(context: KnowledgeContext, topicIds: readonly ReadingTopicId[] = readingTopicIds) {
  const school = context.kind === "school" ? schoolProfiles.find((item) => item.id === context.id) : undefined;
  const people = context.kind === "school"
    ? new Set(school?.philosophers.map((person) => person.id) || [])
    : new Set([context.id]);
  return topicIds.flatMap((topicId) => flattenTopicLevel(topicId, "20").flatMap((unit) => {
    const nodes = collectSelfSummaryNodeIds(unit).map((id) => knowledgeNodeById.get(id)).filter((node): node is ProblemNode => Boolean(node));
    const attributedNodes = nodes.filter((node) => context.kind === "history"
      ? problemPhaseHistoryStageIds[knowledgePhaseByNodeId.get(node.id)?.id || ""] === context.id
      : node.participants.some((person) => person.philosopherId && people.has(person.philosopherId))
        && (!school || node.chapterIds.some((id) => school.chapterIds.includes(id))));
    const localIds = new Set(attributedNodes.map((node) => node.id));
    // Include the immediate question attached to an attributed answer even when
    // the question is shared and has no philosopher tag of its own.
    const localNodes = nodes.filter((node) => {
      if (localIds.has(node.id)) return true;
      if (node.kind !== "问题") return false;
      return attributedNodes.some((answer) => answer.kind === "答案"
        && knowledgePhaseByNodeId.get(answer.id)?.id === knowledgePhaseByNodeId.get(node.id)?.id
        && ancientDifferenceProblemMap.edges.some((edge) =>
          (edge.from === node.id && edge.to === answer.id) || (edge.from === answer.id && edge.to === node.id)));
    });
    if (!localNodes.length) return [];
    const entry = localNodes.find((node) => node.id === unit.entryNodeId) || localNodes.find((node) => node.kind === "问题") || localNodes[0];
    return [{ topicId, unit, root: resolveTopicUnit(topicId, "5", unit.id), nodes: localNodes, entry }];
  }));
}

export type SummaryConnection = {
  from: string; to: string; edges: ProblemEdge[]; sharedNodeIds: string[];
};
export function buildSelfSummaryConnections(units: SelfSummaryUnit[], edges: ProblemEdge[]): SummaryConnection[] {
  const memberships = new Map(units.map((unit) => [unit.id, new Set(collectSelfSummaryNodeIds(unit))]));
  const connections: SummaryConnection[] = [];
  units.forEach((from, index) => {
    units.forEach((to, nextIndex) => {
      if (index === nextIndex) return;
      const source = memberships.get(from.id)!;
      const target = memberships.get(to.id)!;
      // A shared node is one interface, not two duplicated copies linked to each other.
      const witnesses = edges.filter((edge) => source.has(edge.from) && target.has(edge.to) && !target.has(edge.from) && !source.has(edge.to));
      const sharedNodeIds = index < nextIndex ? [...source].filter((id) => target.has(id)) : [];
      if (witnesses.length || sharedNodeIds.length) connections.push({ from: from.id, to: to.id, edges: witnesses, sharedNodeIds });
    });
  });
  return connections;
}
