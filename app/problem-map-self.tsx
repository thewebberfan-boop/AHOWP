"use client";

import { useMemo } from "react";
import type { ProblemNode, ProblemPhase } from "./problem-map-data";
import {
  collectSelfSummaryNodeIds,
  nextSelfSummaryLevel,
  type SelfSummaryLevel,
  type SelfSummaryUnit,
} from "./problem-map-self-data";
import { ancientDifferenceProblemMap } from "./problem-map-data";
import { buildSelfSummaryConnections, selfNodeTopics } from "./knowledge-paths";
import { flattenTopicLevel, readingTrees, resolveTopicUnit, topicForUnit, topicLabel, type ReadingTopicId } from "./reading-topics-data";
import { historyStages } from "./history-data";
import { problemPhaseHistoryStageIds } from "./problem-map-view-data";

const SUMMARY_GRAPH_WIDTH = 1280;
const SUMMARY_SINGLE_NODE_WIDTH = 420;
const SUMMARY_NODE_HEIGHT = 108;
const SUMMARY_SIDE = 48;
const SUMMARY_TIMELINE_WIDTH = 72;
const SUMMARY_LANE_GAP = 24;
const SUMMARY_TOP = 82;
const SUMMARY_ROW_GAP = 48;
const SUMMARY_GROUP_TOP_PADDING = 38;
const SUMMARY_GROUP_BOTTOM_PADDING = 8;
const SUMMARY_LANE_HEADER_TOP = 8;
const SUMMARY_LANE_HEADER_HEIGHT = 32;

function splitSummaryTitle(title: string, limit = 22) {
  const lines: string[] = [];
  let line = "";
  let weight = 0;
  Array.from(title).forEach((character) => {
    const nextWeight = character.charCodeAt(0) <= 0x7f ? 0.55 : 1;
    if (line && weight + nextWeight > limit) {
      lines.push(line);
      line = character;
      weight = nextWeight;
    } else {
      line += character;
      weight += nextWeight;
    }
  });
  if (line) lines.push(line);
  return lines;
}

export function SelfSummaryGraph({
  topicIds = ["self"],
  level,
  allNodes,
  phaseByNodeId,
  selectedUnitId,
  visibleNodeIds,
  onUnitSelect,
  onDrillDown,
  onAtomicNode,
}: {
  topicIds?: ReadingTopicId[];
  level: SelfSummaryLevel;
  allNodes: ProblemNode[];
  phaseByNodeId: Map<string, ProblemPhase>;
  selectedUnitId: string;
  visibleNodeIds?: readonly string[];
  onUnitSelect: (id: string) => void;
  onDrillDown: (unit: SelfSummaryUnit) => void;
  onAtomicNode: (nodeId: string) => void;
}) {
  const visibleNodeIdSet = useMemo(() => visibleNodeIds ? new Set(visibleNodeIds) : null, [visibleNodeIds]);
  const fullUnitsByTopic = useMemo(() => topicIds.map((id) => flattenTopicLevel(id, level)), [topicIds, level]);
  const unitsByTopic = useMemo(() => fullUnitsByTopic.map((topicUnits) => visibleNodeIdSet
    ? topicUnits.filter((unit) => collectSelfSummaryNodeIds(unit).some((id) => visibleNodeIdSet.has(id)))
    : topicUnits), [fullUnitsByTopic, visibleNodeIdSet]);
  const units = useMemo(() => unitsByTopic.flat(), [unitsByTopic]);
  const phaseIndex = useMemo(() => new Map([...phaseByNodeId.values()].map((phase) => [phase.id, phase])), [phaseByNodeId]);
  const connections = useMemo(() => {
    if (!visibleNodeIdSet) return buildSelfSummaryConnections(units, ancientDifferenceProblemMap.edges);
    const scopedUnits = units.map((unit) => ({ ...unit, nodeIds: collectSelfSummaryNodeIds(unit).filter((id) => visibleNodeIdSet.has(id)) }));
    const scopedEdges = ancientDifferenceProblemMap.edges.filter((edge) => visibleNodeIdSet.has(edge.from) && visibleNodeIdSet.has(edge.to));
    return buildSelfSummaryConnections(scopedUnits, scopedEdges);
  }, [units, visibleNodeIdSet]);

  const activeTopic = topicForUnit(selectedUnitId);
  const selectedTopic = activeTopic && topicIds.includes(activeTopic) ? activeTopic : topicIds[0];
  const resolvedUnit = resolveTopicUnit(selectedTopic, level, selectedUnitId);
  const selectedUnit = units.find((unit) => unit.id === resolvedUnit.id) || units.find((unit) => topicForUnit(unit.id) === selectedTopic) || units[0];
  const topicsLabel = topicIds.map(topicLabel).join(" / ");
  const nextLevel = nextSelfSummaryLevel(level);
  const expandLabel = nextLevel === "all" ? "进入具体论证节点" : nextLevel === "10" ? "展开对应主线" : "展开对应论证组";
  const isMultiTopic = topicIds.length > 1;
  const laneAreaLeft = isMultiTopic ? SUMMARY_SIDE + SUMMARY_TIMELINE_WIDTH : 0;
  const laneAreaWidth = isMultiTopic ? SUMMARY_GRAPH_WIDTH - laneAreaLeft - SUMMARY_SIDE : SUMMARY_GRAPH_WIDTH;
  const laneWidth = isMultiTopic ? (laneAreaWidth - SUMMARY_LANE_GAP * (topicIds.length - 1)) / topicIds.length : SUMMARY_SINGLE_NODE_WIDTH;
  const nodeX = (topicIndex: number) => isMultiTopic
    ? laneAreaLeft + topicIndex * (laneWidth + SUMMARY_LANE_GAP)
    : (SUMMARY_GRAPH_WIDTH - SUMMARY_SINGLE_NODE_WIDTH) / 2;
  const measurements = units.map((unit) => {
    const titleLimit = Math.max(12, Math.floor((laneWidth - 32) / 17));
    const overviewLimit = Math.max(16, Math.floor((laneWidth - 32) / 13));
    const titleLines = splitSummaryTitle(unit.title, titleLimit);
    const overviewLines = unit.overview ? splitSummaryTitle(unit.overview, overviewLimit) : [];
    const overviewY = 50 + (titleLines.length - 1) * 22 + 25;
    const lastTextY = overviewLines.length ? overviewY + (overviewLines.length - 1) * 18 : overviewY - 25;
    const height = Math.max(SUMMARY_NODE_HEIGHT, lastTextY + 34);
    return { height, titleLines, overviewLines, overviewY };
  });
  const measurementByUnitId = new Map(units.map((unit, index) => [unit.id, measurements[index]]));
  const rowsPerGroup = level === "5" ? 1 : level === "10" ? 2 : 4;
  const rowKeyByUnitId = new Map<string, string>();
  fullUnitsByTopic.forEach((topicUnits) => topicUnits.forEach((unit, index) => rowKeyByUnitId.set(unit.id, `${Math.floor(index / rowsPerGroup)}:${index % rowsPerGroup}`)));
  const activeRowKeys = [...new Set(units.map((unit) => rowKeyByUnitId.get(unit.id)!))].sort((left, right) => {
    const [leftGroup, leftRow] = left.split(":").map(Number);
    const [rightGroup, rightRow] = right.split(":").map(Number);
    return leftGroup - rightGroup || leftRow - rightRow;
  });
  const rowIndexByKey = new Map(activeRowKeys.map((key, index) => [key, index]));
  const rowCount = activeRowKeys.length;
  const rowHeights = activeRowKeys.map((rowKey) => Math.max(...units.filter((unit) => rowKeyByUnitId.get(unit.id) === rowKey).map((unit) => measurementByUnitId.get(unit.id)!.height)));
  const rowY = (rowIndex: number) => SUMMARY_TOP + rowHeights.slice(0, rowIndex).reduce((height, item) => height + item + SUMMARY_ROW_GAP, 0);
  const layouts = new Map(unitsByTopic.flatMap((topicUnits, topicIndex) => topicUnits.map((unit) => {
    const rowIndex = rowIndexByKey.get(rowKeyByUnitId.get(unit.id)!)!;
    return [unit.id, {
    ...measurementByUnitId.get(unit.id)!,
    x: nodeX(topicIndex),
    y: rowY(rowIndex),
    width: laneWidth,
    rowIndex,
    topicIndex,
  }] as const;
  })));
  const graphHeight = rowCount ? Math.max(360, rowY(rowCount - 1) + rowHeights[rowCount - 1] + 70) : 360;

  const unitMemberNodes = (unit: SelfSummaryUnit) => {
    const ids = new Set(collectSelfSummaryNodeIds(unit));
    return allNodes.filter((node) => ids.has(node.id) && (!visibleNodeIdSet || visibleNodeIdSet.has(node.id)));
  };

  const selectedMemberNodes = selectedUnit ? unitMemberNodes(selectedUnit) : [];
  const selectedPhaseIds = [...new Set(selectedMemberNodes.map((node) => phaseByNodeId.get(node.id)?.id || ""))];
  const selectedPhases = selectedPhaseIds.map((id) => phaseIndex.get(id)).filter((phase): phase is ProblemPhase => Boolean(phase));
  const selectedParticipantNames = [...new Set(selectedMemberNodes.flatMap((node) => node.participants.map((participant) => participant.name)))];
  const selectedChapterIds = [...new Set(selectedMemberNodes.flatMap((node) => node.chapterIds))];
  const activeGroupIndexes = [...new Set(activeRowKeys.map((key) => Number(key.split(":")[0])))];
  const groupRanges = activeGroupIndexes.map((groupIndex) => {
    const groupRows = activeRowKeys.map((key, rowIndex) => ({ key, rowIndex })).filter(({ key }) => Number(key.split(":")[0]) === groupIndex).map(({ rowIndex }) => rowIndex);
    const first = groupRows[0];
    const last = groupRows.at(-1)!;
    const roots = topicIds.map((topicId) => readingTrees[topicId][groupIndex]);
    const groupNodeIds = roots.flatMap(collectSelfSummaryNodeIds).filter((nodeId) => !visibleNodeIdSet || visibleNodeIdSet.has(nodeId));
    const historyStageIds = new Set(groupNodeIds.map((nodeId) => {
      const phase = phaseByNodeId.get(nodeId);
      return phase ? problemPhaseHistoryStageIds[phase.id] : undefined;
    }).filter((id): id is string => Boolean(id)));
    const stages = historyStages.filter((stage) => historyStageIds.has(stage.id));
    const firstStage = stages[0];
    const lastStage = stages.at(-1);
    const historyLabel = !firstStage ? "历史阶段待核对"
      : firstStage.id === lastStage?.id ? `${firstStage.title} · ${firstStage.years}`
        : `${firstStage.title}（${firstStage.years}）→ ${lastStage?.title}（${lastStage?.years}）`;
    const top = rowY(first) - SUMMARY_GROUP_TOP_PADDING;
    return {
      id: roots.map((root) => root.id).join("-"),
      historyLabel,
      stages,
      top,
      height: rowY(last) + rowHeights[last] + SUMMARY_GROUP_BOTTOM_PADDING - top,
    };
  });

  return <section className="problem-graph-workspace self-summary-workspace" id="problem-graph">
    <div className="problem-graph-panel">
      <header className="problem-graph-toolbar">
        <div><p className="section-label">CURATED READING PATHS</p><h3>{topicsLabel} · {level === "5" ? "总览" : level === "10" ? "主线" : "论证组"} · {units.length} 组问题</h3></div>
        <div className="self-summary-actions">
          <p className="problem-graph-fit-note" id="self-summary-navigation-help">单击看解释 · 双击或 Enter 展开 · 空格选中</p>
          <button type="button" onClick={() => onDrillDown(selectedUnit)} aria-label={`${expandLabel}：${selectedUnit.title}`}>{expandLabel} →</button>
        </div>
      </header>

      <div className="problem-graph-scroll" role="region" aria-label={`${topicsLabel}问题的 ${units.length} 节点总结图`}>
        <svg viewBox={`0 0 ${SUMMARY_GRAPH_WIDTH} ${graphHeight}`} role="img" aria-label={`${topicsLabel}问题主线：${units.length} 个总结节点`}>
          <defs>
            <marker id="self-summary-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L7,3 z" fill="context-stroke" />
            </marker>
          </defs>

          <g className="self-summary-groups">
            {groupRanges.map(({ id, historyLabel, stages, top, height }, index) => <g key={id}>
              <rect className={index % 2 ? "summary-group-even" : "summary-group-odd"} x="0" y={top} width={SUMMARY_GRAPH_WIDTH} height={height} />
              <text className="summary-group-label" x="48" y={top + 24}>{String(index + 1).padStart(2, "0")} · {historyLabel}<title>{stages.map((stage) => `${stage.title} · ${stage.years}`).join(" → ")}</title></text>
            </g>)}
          </g>

          {isMultiTopic && <g className="self-summary-lanes" aria-hidden="true">
            <text className="summary-time-label" x={SUMMARY_SIDE} y="29">时间序列</text>
            <path className="summary-time-axis" d={`M ${SUMMARY_SIDE + 18} 42 L ${SUMMARY_SIDE + 18} ${graphHeight - 36}`} markerEnd="url(#self-summary-arrow)" />
            {rowHeights.map((height, rowIndex) => <g key={`time-${rowIndex}`}>
              <circle cx={SUMMARY_SIDE + 18} cy={rowY(rowIndex) + height / 2} r="4" />
              <text className="summary-time-index" x={SUMMARY_SIDE + 18} y={rowY(rowIndex) + height / 2 + 3}>{String(rowIndex + 1).padStart(2, "0")}</text>
            </g>)}
            {topicIds.map((topicId, topicIndex) => <g key={topicId}>
              <rect x={nodeX(topicIndex)} y={SUMMARY_LANE_HEADER_TOP} width={laneWidth} height={SUMMARY_LANE_HEADER_HEIGHT} rx="3" />
              <text className="summary-lane-label" x={nodeX(topicIndex) + laneWidth / 2} y="29">{topicLabel(topicId)}</text>
            </g>)}
          </g>}

          <g className="self-summary-edges">
            {connections.filter((link) => {
              const crossTopic = topicForUnit(link.from) !== topicForUnit(link.to);
              return crossTopic || (level === "5" && topicIds.length === 1) || link.from === selectedUnit.id || link.to === selectedUnit.id;
            }).map((link, linkIndex) => {
              const source = layouts.get(link.from)!;
              const target = layouts.get(link.to)!;
              const crossTopic = source.topicIndex !== target.topicIndex;
              const connected = link.from === selectedUnit.id || link.to === selectedUnit.id;
              const forward = target.x > source.x;
              const startX = crossTopic ? source.x + (forward ? source.width : 0) : source.x + source.width;
              const endX = crossTopic ? target.x + (forward ? 0 : target.width) : target.x + target.width;
              const startY = source.y + source.height / 2;
              const endY = target.y + target.height / 2;
              const bendX = crossTopic ? (startX + endX) / 2 : startX + 55 + (linkIndex % 5) * 24;
              const evidence = link.edges.map((edge) => `${edge.connection}：${edge.label}`).join("；");
              const shared = link.sharedNodeIds.length ? `共享 ${link.sharedNodeIds.length} 个原子节点` : "";
              return <path className={`${crossTopic ? "cross-topic" : "within-topic"}${connected ? " connected" : ""}`} key={`${link.from}-${link.to}`} d={`M ${startX} ${startY} C ${bendX} ${startY}, ${bendX} ${endY}, ${endX} ${endY}`} strokeDasharray={link.edges.length ? undefined : "5 4"} markerEnd={link.edges.length ? "url(#self-summary-arrow)" : undefined}><title>{[crossTopic ? "跨主题" : "", evidence, shared].filter(Boolean).join(" · ")}</title></path>;
            })}
          </g>

          <g className="self-summary-nodes">
            {units.map((unit) => {
              const selected = unit.id === selectedUnit?.id;
              const memberCount = unitMemberNodes(unit).length;
              const { x, y, width, height, titleLines, overviewLines, overviewY } = layouts.get(unit.id)!;
              return <g className={`self-summary-node${selected ? " selected" : ""}`} id={`self-summary-${unit.id}`} key={unit.id} role="button" tabIndex={0} aria-pressed={selected} aria-describedby="self-summary-navigation-help" aria-label={`总结节点：${unit.title}，覆盖 ${memberCount} 个相关原子节点。${expandLabel}`} transform={`translate(${x}, ${y})`} onClick={() => onUnitSelect(unit.id)} onDoubleClick={() => onDrillDown(unit)} onKeyDown={(event) => {
                if (event.key === "Enter") { event.preventDefault(); if (!event.repeat) onDrillDown(unit); }
                if (event.key === " ") { event.preventDefault(); onUnitSelect(unit.id); }
              }}>
                <rect width={width} height={height} rx="8" />
                <text className="self-summary-meta" x="16" y="21">{topicLabel(topicForUnit(unit.id)!)} · {unit.period} · {memberCount} 个节点</text>
                <text className="self-summary-title" x="16" y="50">{titleLines.map((line, lineIndex) => <tspan x="16" dy={lineIndex === 0 ? 0 : 22} key={`${unit.id}-${lineIndex}`}>{line}</tspan>)}</text>
                {overviewLines.length > 0 && <text className="self-summary-overview" x="16" y={overviewY}>{overviewLines.map((line, lineIndex) => <tspan x="16" dy={lineIndex === 0 ? 0 : 18} key={`${unit.id}-overview-${lineIndex}`}>{line}</tspan>)}</text>}
                <text className="self-summary-hint" x="16" y={height - 12}>双击展开 · 本站学习重构</text>
                <circle cx={width - 17} cy="17" r="4" />
              </g>;
            })}
          </g>
        </svg>
      </div>

      <footer className="problem-graph-evidence self-summary-evidence">
        <span><i aria-hidden="true" />总结节点</span>
        <span className="connection-folded"><i aria-hidden="true" />箭头可追溯至节点关系；虚线为共享节点。{isMultiTopic ? "跨主题关系持续显示，同主题关系随当前卡片突出。" : level !== "5" ? "只画当前卡片的连接。" : ""}同题比较不代表直接影响</span>
      </footer>
    </div>

    {selectedUnit && <aside className="problem-node-detail self-summary-detail" aria-live="polite">
      <header>
        <div><span>{visibleNodeIdSet ? "全局争论背景" : "总结节点"}</span><em>本站学习重构</em></div>
        {visibleNodeIdSet && <p className="knowledge-scope-note">下文解释这组问题的全局分歧，不代表本页人物或流派接受全部回答；图中与下方成员仅显示本页相关部分。</p>}
        <small>{topicLabel(selectedTopic)} · 每主题 {level} 组 · 覆盖 {selectedMemberNodes.length} 个原子节点</small>
        <h3>{selectedUnit.title}</h3>
        <p>{selectedUnit.thesis}</p>
      </header>

      <div className="problem-node-detail-logic">
        <section><span>这一层在追问什么</span><p>{selectedUnit.question}</p></section>
        <section><span>继续追问 · 本站阅读建议</span><p>{selectedUnit.transition}</p></section>
      </div>

      <div className="problem-node-detail-links">
        <section className="self-summary-members">
          <span>相接的问题 · 可核对关系依据</span>
          {connections.filter((link) => link.from === selectedUnit.id || link.to === selectedUnit.id).map((link) => {
            const other = units.find((unit) => unit.id === (link.from === selectedUnit.id ? link.to : link.from))!;
            return <details key={`${link.from}-${link.to}`}><summary>{other.title}</summary>
              {link.edges.map((edge) => <p key={edge.id}><b>{edge.connection}</b> · {edge.label}<button type="button" onClick={() => onAtomicNode(edge.from)}>核对起点 →</button><button type="button" onClick={() => onAtomicNode(edge.to)}>核对问题 →</button></p>)}
              {link.sharedNodeIds.map((id) => <button type="button" key={id} onClick={() => onAtomicNode(id)}>共享节点 · {allNodes.find((node) => node.id === id)?.title}</button>)}
              <button type="button" onClick={() => { onUnitSelect(other.id); document.getElementById(`self-summary-${other.id}`)?.scrollIntoView({ block: "center" }); }}>定位到相接卡片 →</button>
            </details>;
          })}
        </section>
        <section className="self-summary-expand">
          <span>逐级展开</span>
          <p>{nextLevel === "all" ? "进入所选主题的全部节点，并选中本卡对应的原始问题或答案。共有节点只显示一次。" : "展开当前卡片，选中并定位到它的第一张子卡；同层其他卡片仍然保留。"}</p>
          <button type="button" onClick={() => onDrillDown(selectedUnit)}>{expandLabel} →</button>
        </section>
        <section className="self-summary-phases">
          <span>覆盖的历史段落</span>
          <div>{selectedPhases.map((phase) => <article key={phase.id}><small>{String(phase.order).padStart(2, "0")}</small><b>{phase.title}</b></article>)}</div>
        </section>
        <section className="self-summary-members">
          <span>进入原子节点</span>
          <div>{selectedMemberNodes.map((node) => <button type="button" key={node.id} onClick={() => onAtomicNode(node.id)}><small>{node.kind} · {selfNodeTopics(node.id).join(" / ")}</small><b>{node.title}</b><i aria-hidden="true">↗</i></button>)}</div>
        </section>
        <section className="self-summary-coverage">
          <span>覆盖范围</span>
          <p>{selectedParticipantNames.length} 位相关参与者 · {selectedChapterIds.length} 个原书章节 · {selectedPhases.length} 个维护阶段</p>
        </section>
        <section className="self-summary-coverage"><span>来源与范围</span><p>总结属于本站学习重构。下钻可核对原始节点、参与者、关系类别和原书章节；不是该领域全部学说的目录。</p>
          {(resolveTopicUnit(selectedTopic, "5", selectedUnit.id).sources || []).map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label} ↗</a>)}
        </section>
      </div>
    </aside>}
  </section>;
}
