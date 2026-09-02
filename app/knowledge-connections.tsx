"use client";

import { createContext, useContext, useState } from "react";
import { knowledgeNodeById, knowledgePhaseByNodeId, knowledgeUnitsFor, selfNodeTopics, type KnowledgeContext, type ReadingTarget } from "./knowledge-paths";
import { ProblemGraphControls } from "./problem-graph-controls";
import { ScopedProblemGraph } from "./problem-map";
import { SelfSummaryGraph } from "./problem-map-self";
import { collectSelfSummaryNodeIds, nextSelfSummaryLevel, selfSummaryEntryNodeId, type ProblemCompressionLevel, type SelfSummaryLevel, type SelfSummaryUnit } from "./problem-map-self-data";
import { flattenTopicLevel, resolveTopicUnit, topicForUnit, topicLabel, type ReadingTopicId } from "./reading-topics-data";

export const KnowledgeNavigationContext = createContext<((target: ReadingTarget) => void) | null>(null);
const selectedTopicsByContext = new Map<string, ReadingTopicId[]>();
const selectedNodeByContextTopics = new Map<string, string>();
const selectedSummaryByContext = new Map<string, string>();
const compressionByContext = new Map<string, ProblemCompressionLevel>();

export function KnowledgeConnections({ context }: { context: KnowledgeContext }) {
  const navigate = useContext(KnowledgeNavigationContext);
  const contextKey = `${context.kind}:${context.id}`;
  const allUnits = knowledgeUnitsFor(context);
  const availableTopics = [...new Set(allUnits.map((item) => item.topicId))];
  const defaultTopic = availableTopics.includes("self") ? "self" : availableTopics[0];
  const [selectedTopicIds, setSelectedTopicIds] = useState<ReadingTopicId[]>(() => (selectedTopicsByContext.get(contextKey) || (defaultTopic ? [defaultTopic] : [])).filter((topic) => availableTopics.includes(topic)));
  const activeTopics = selectedTopicIds.length ? selectedTopicIds.filter((topic) => availableTopics.includes(topic)) : availableTopics;
  const activeUnits = allUnits.filter((item) => activeTopics.includes(item.topicId));
  const relatedNodes = [...new Map(activeUnits.flatMap((item) => item.nodes).map((node) => [node.id, node])).values()];
  const relatedNodeIds = relatedNodes.map((node) => node.id);
  const topicStateKey = `${contextKey}:${activeTopics.join(",") || "all"}`;
  const [compressionLevel, setCompressionLevel] = useState<ProblemCompressionLevel>(() => compressionByContext.get(contextKey) || "all");
  const [selectedNodeId, setSelectedNodeId] = useState(() => selectedNodeByContextTopics.get(topicStateKey) || activeUnits[0]?.entry.id || "");
  const [selectedSummaryUnitId, setSelectedSummaryUnitId] = useState(() => selectedSummaryByContext.get(contextKey) || activeUnits[0]?.unit.id || "");
  if (!activeUnits.length || !defaultTopic) return null;

  const activeNode = relatedNodes.find((node) => node.id === selectedNodeId) || activeUnits[0].entry;
  const activeUnit = activeUnits.find((item) => item.nodes.some((node) => node.id === activeNode.id)) || activeUnits[0];
  const summaryLevel = compressionLevel === "all" ? null : compressionLevel;
  const parentLevel: SelfSummaryLevel | null = compressionLevel === "all" ? "20" : compressionLevel === "20" ? "10" : compressionLevel === "10" ? "5" : null;

  const visibleUnits = (topic: ReadingTopicId, level: SelfSummaryLevel) => flattenTopicLevel(topic, level).filter((unit) => collectSelfSummaryNodeIds(unit).some((id) => relatedNodeIds.includes(id)));
  const resolveVisibleUnit = (topic: ReadingTopicId, level: SelfSummaryLevel, currentUnitId?: string, nodeId?: string, returningFromNode = false) => {
    const units = visibleUnits(topic, level);
    const resolved = resolveTopicUnit(topic, level, currentUnitId, nodeId, returningFromNode);
    return units.find((unit) => unit.id === resolved.id) || units.find((unit) => nodeId && collectSelfSummaryNodeIds(unit).includes(nodeId)) || units[0];
  };
  const selectNode = (id: string) => {
    if (!relatedNodes.some((node) => node.id === id)) return;
    selectedNodeByContextTopics.set(topicStateKey, id);
    setSelectedNodeId(id);
  };
  const selectSummaryUnit = (id: string) => {
    selectedSummaryByContext.set(contextKey, id);
    setSelectedSummaryUnitId(id);
  };
  const applyTopicSelection = (next: ReadingTopicId[]) => {
    const normalized = next.filter((topic) => availableTopics.includes(topic));
    selectedTopicsByContext.set(contextKey, normalized);
    setSelectedTopicIds(normalized);
    const nextTopics = normalized.length ? normalized : availableTopics;
    const nextUnits = allUnits.filter((item) => nextTopics.includes(item.topicId));
    const nextNodes = [...new Map(nextUnits.flatMap((item) => item.nodes).map((node) => [node.id, node])).values()];
    const nextNode = nextNodes.find((node) => node.id === activeNode.id) || nextUnits[0]?.entry;
    const storedTopic = topicForUnit(selectedSummaryUnitId);
    const nextTopic = storedTopic && nextTopics.includes(storedTopic) ? storedTopic : nextTopics[0];
    const nextSummary = nextTopic && summaryLevel ? resolveTopicUnit(nextTopic, summaryLevel, selectedSummaryUnitId, nextNode?.id, compressionLevel === "all") : nextUnits[0]?.unit;
    if (nextNode) setSelectedNodeId(nextNode.id);
    if (nextSummary) selectSummaryUnit(nextSummary.id);
  };
  const toggleTopic = (topic: ReadingTopicId) => {
    const next = selectedTopicIds.length === 0 ? [topic] : selectedTopicIds.includes(topic) ? selectedTopicIds.filter((id) => id !== topic) : [...selectedTopicIds, topic];
    applyTopicSelection(next);
  };
  const changeCompression = (nextLevel: ProblemCompressionLevel, fromUnit?: SelfSummaryUnit) => {
    compressionByContext.set(contextKey, nextLevel);
    setCompressionLevel(nextLevel);
    const sourceUnitId = fromUnit?.id || selectedSummaryUnitId;
    const storedTopic = topicForUnit(sourceUnitId);
    const sourceTopic = storedTopic && activeTopics.includes(storedTopic) ? storedTopic : activeTopics.find((topic) => visibleUnits(topic, nextLevel === "all" ? "20" : nextLevel).length) || activeTopics[0];
    if (!sourceTopic) return;
    if (nextLevel === "all") {
      const source20 = resolveVisibleUnit(sourceTopic, "20", sourceUnitId, activeNode.id, compressionLevel === "all");
      const sourceNodeIds = source20 ? collectSelfSummaryNodeIds(source20) : [];
      const entryNodeId = source20 && selfSummaryEntryNodeId(source20);
      const nextNodeId = entryNodeId && relatedNodeIds.includes(entryNodeId) ? entryNodeId : sourceNodeIds.find((id) => relatedNodeIds.includes(id)) || activeNode.id;
      selectNode(nextNodeId);
      return;
    }
    const nextUnit = resolveVisibleUnit(sourceTopic, nextLevel, sourceUnitId, activeNode.id, compressionLevel === "all");
    if (nextUnit) selectSummaryUnit(nextUnit.id);
  };
  const drillDown = (unit: SelfSummaryUnit) => changeCompression(nextSelfSummaryLevel(summaryLevel || "20"), unit);
  const openAtomicNode = (nodeId: string) => {
    if (!relatedNodeIds.includes(nodeId)) return;
    compressionByContext.set(contextKey, "all");
    setCompressionLevel("all");
    selectNode(nodeId);
  };
  const topicsLabel = activeTopics.map(topicLabel).join(" / ");

  return <section className="knowledge-connections" aria-label={`把本页接回${topicsLabel}问题主线`}>
    <header><div><p className="section-label">ONE QUESTION, MULTIPLE ENTRANCES</p><h4>把这页接回整体 · {topicsLabel}</h4></div>
      <button type="button" onClick={() => navigate?.({ topicId: topicForUnit(selectedSummaryUnitId) || activeTopics[0], unitId: selectedSummaryUnitId || activeUnit.unit.id, nodeId: activeNode.id, level: compressionLevel })}>在完整问题图谱中继续 →</button>
    </header>
    <p className="knowledge-boundary">这里与完整问题图谱共用控制条、节点、箭头和历史分区，只把范围收缩为本页有据关联的内容。主题可多选，5／10／20／全部节点可逐级切换；流派中的参与者观点不代表全派共识。</p>

    <ProblemGraphControls selectedTopicIds={selectedTopicIds} availableTopicIds={availableTopics} compressionLevel={compressionLevel} onToggleTopic={toggleTopic} onClearTopics={() => applyTopicSelection([])} onCompressionChange={changeCompression} onCompressionBack={() => { if (parentLevel) changeCompression(parentLevel); }} compressionBackDisabled={!parentLevel} compressionBackLabel={parentLevel ? `返回${parentLevel === "20" ? "论证组 20" : parentLevel === "10" ? "主线 10" : "总览 5"}` : "已在最上层"} fullLabel="全部相关" topicCountForLabel={activeTopics.length} className="knowledge-problem-controls" />

    <div className="knowledge-graph-panel">
      {summaryLevel ? <SelfSummaryGraph topicIds={activeTopics} level={summaryLevel} allNodes={[...knowledgeNodeById.values()]} phaseByNodeId={knowledgePhaseByNodeId} selectedUnitId={selectedSummaryUnitId} visibleNodeIds={relatedNodeIds} onUnitSelect={selectSummaryUnit} onDrillDown={drillDown} onAtomicNode={openAtomicNode} /> : <>
        <ScopedProblemGraph nodeIds={relatedNodeIds} topicIds={activeTopics} selectedNodeId={activeNode.id} onNodeSelect={selectNode} ariaLabel={`${topicsLabel}主题与本页相关的问题图谱`} />
        <aside className={`knowledge-graph-detail kind-${activeNode.kind}`} aria-live="polite">
          <div><small>{activeNode.kind}{activeNode.answerRole ? ` · ${activeNode.answerRole}型答案` : ""} · {selfNodeTopics(activeNode.id).join(" / ")}</small><h5>{activeNode.title}</h5><p>{activeNode.summary}</p></div>
          <div className="knowledge-graph-actions">
            <small>{activeNode.participants.map((person) => person.name).join("、") || "共享问题节点"}</small>
            <button type="button" onClick={() => navigate?.({ topicId: topicForUnit(activeUnit.unit.id) || activeTopics[0], unitId: activeUnit.unit.id, nodeId: activeNode.id, level: "all" })}>在完整图谱中定位 →</button>
          </div>
        </aside>
      </>}
    </div>
  </section>;
}
