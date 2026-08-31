import { collectSelfSummaryNodeIds, normalizeSelfCompressionLevel, problemFacetOptions, selfSummaryTree, type SelfSummaryLevel, type SelfSummaryUnit } from "./problem-map-self-data";
import { methodSummaryTree } from "./method-reading-data";
import { natureSummaryTree } from "./nature-reading-data";
import { societySummaryTree } from "./society-reading-data";
import { ultimateSummaryTree } from "./ultimate-reading-data";

export const readingTopicIds = ["method", "nature", "self", "society", "ultimate"] as const;
export type ReadingTopicId = typeof readingTopicIds[number];
export const readingTrees: Record<ReadingTopicId, SelfSummaryUnit[]> = {
  method: methodSummaryTree, nature: natureSummaryTree, self: selfSummaryTree, society: societySummaryTree, ultimate: ultimateSummaryTree,
};
export const collectSummaryNodeIds = collectSelfSummaryNodeIds;
export const topicLabel = (id: ReadingTopicId) => problemFacetOptions.find((topic) => topic.id === id)!.label;
export const isReadingTopic = (value: unknown): value is ReadingTopicId => readingTopicIds.some((id) => id === value);
export function topicForUnit(unitId?: string): ReadingTopicId | undefined {
  const prefix = unitId?.split("-")[0];
  return isReadingTopic(prefix) ? prefix : undefined;
}
export function flattenTopicLevel(topic: ReadingTopicId, level: SelfSummaryLevel): SelfSummaryUnit[] {
  const roots = readingTrees[topic];
  const branches = roots.flatMap((root) => root.children || []);
  return level === "5" ? roots : level === "10" ? branches : branches.flatMap((branch) => branch.children || []);
}
export const topicNodeIds = Object.fromEntries(readingTopicIds.map((topic) => [topic,
  [...new Set(readingTrees[topic].flatMap(collectSummaryNodeIds))],
])) as Record<ReadingTopicId, string[]>;
const topicNodeSets = Object.fromEntries(readingTopicIds.map((topic) => [topic, new Set(topicNodeIds[topic])])) as Record<ReadingTopicId, Set<string>>;
export const nodeReadingTopics = (nodeId: string) => readingTopicIds.filter((topic) => topicNodeSets[topic].has(nodeId));
export const selectedTopicNodeIds = (topics: ReadingTopicId[]) => new Set(topics.flatMap((topic) => topicNodeIds[topic]));

function contains(unit: SelfSummaryUnit, id: string): boolean {
  return unit.id === id || Boolean(unit.children?.some((child) => contains(child, id)));
}
export function resolveTopicUnit(topic: ReadingTopicId, level: SelfSummaryLevel, currentUnitId?: string, nodeId?: string, returningFromNode = false): SelfSummaryUnit {
  const units = flattenTopicLevel(topic, level);
  const current = (["5", "10", "20"] as const).flatMap((item) => flattenTopicLevel(topic, item)).find((unit) => unit.id === currentUnitId);
  const compatible = current && (!returningFromNode || !nodeId || collectSummaryNodeIds(current).includes(nodeId));
  return units.find((unit) => compatible && (contains(unit, current.id) || contains(current, unit.id)))
    || units.find((unit) => nodeId && collectSummaryNodeIds(unit).includes(nodeId)) || units[0];
}
export const topicPreferenceKey = (topic: ReadingTopicId, kind: "summary" | "compression" | "node") => `ahowp-problem-map-${topic}-${kind}`;
export const ACTIVE_TOPIC_STORAGE_KEY = "ahowp-problem-map-active-topic";
export const readingPreferenceKeys = [ACTIVE_TOPIC_STORAGE_KEY, ...readingTopicIds.flatMap((id) => [topicPreferenceKey(id, "summary"), topicPreferenceKey(id, "compression"), topicPreferenceKey(id, "node")])];
export function restoreTopicView(topic: ReadingTopicId, read: (key: string) => string | null) {
  const level = normalizeSelfCompressionLevel(read(topicPreferenceKey(topic, "compression")));
  const unit = resolveTopicUnit(topic, level === "all" ? "20" : level, read(topicPreferenceKey(topic, "summary")) || undefined);
  const savedNode = read(topicPreferenceKey(topic, "node"));
  const nodeId = savedNode && topicNodeSets[topic].has(savedNode) ? savedNode : collectSummaryNodeIds(unit)[0];
  return { level, unitId: unit.id, nodeId };
}
