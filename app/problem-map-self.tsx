"use client";

import { useMemo, useState } from "react";
import type { ProblemNode, ProblemPhase } from "./problem-map-data";
import {
  collectSelfSummaryPhaseIds,
  flattenSelfSummaryLevel,
  selfFacetNodeIds,
  selfSummaryTree,
  type ProblemCompressionLevel,
  type SelfSummaryUnit,
} from "./problem-map-self-data";

const SUMMARY_GRAPH_WIDTH = 1280;
const SUMMARY_NODE_WIDTH = 420;
const SUMMARY_NODE_HEIGHT = 108;
const SUMMARY_NODE_X = (SUMMARY_GRAPH_WIDTH - SUMMARY_NODE_WIDTH) / 2;
const SUMMARY_TOP = 62;
const SUMMARY_ROW_GAP = 48;

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
  return lines.slice(0, 2);
}

function nextSummaryLevel(level: "5" | "10" | "20"): ProblemCompressionLevel {
  if (level === "5") return "10";
  if (level === "10") return "20";
  return "50";
}

export function SelfSummaryGraph({
  level,
  allNodes,
  phaseByNodeId,
  onLevelChange,
  onAtomicNode,
}: {
  level: "5" | "10" | "20";
  allNodes: ProblemNode[];
  phaseByNodeId: Map<string, ProblemPhase>;
  onLevelChange: (level: ProblemCompressionLevel) => void;
  onAtomicNode: (nodeId: string) => void;
}) {
  const units = useMemo(() => flattenSelfSummaryLevel(level), [level]);
  const [selectedUnitId, setSelectedUnitId] = useState(units[0]?.id || "");
  const selfNodeIdSet = useMemo(() => new Set<string>(selfFacetNodeIds), []);
  const phaseIndex = useMemo(() => new Map([...phaseByNodeId.values()].map((phase) => [phase.id, phase])), [phaseByNodeId]);

  const selectedUnit = units.find((unit) => unit.id === selectedUnitId) || units[0];
  const unitY = (index: number) => SUMMARY_TOP + index * (SUMMARY_NODE_HEIGHT + SUMMARY_ROW_GAP);
  const graphHeight = Math.max(360, unitY(units.length - 1) + SUMMARY_NODE_HEIGHT + 70);

  const unitMemberNodes = (unit: SelfSummaryUnit) => {
    const phaseIds = new Set(collectSelfSummaryPhaseIds(unit));
    return allNodes.filter((node) => selfNodeIdSet.has(node.id) && phaseIds.has(phaseByNodeId.get(node.id)?.id || ""));
  };

  const selectedMemberNodes = selectedUnit ? unitMemberNodes(selectedUnit) : [];
  const selectedPhaseIds = selectedUnit ? collectSelfSummaryPhaseIds(selectedUnit) : [];
  const selectedPhases = selectedPhaseIds.map((id) => phaseIndex.get(id)).filter((phase): phase is ProblemPhase => Boolean(phase));
  const selectedParticipantNames = [...new Set(selectedMemberNodes.flatMap((node) => node.participants.map((participant) => participant.name)))];
  const selectedChapterIds = [...new Set(selectedMemberNodes.flatMap((node) => node.chapterIds))];
  const groupRanges = selfSummaryTree.map((root) => {
    const memberIds = new Set(level === "5"
      ? [root.id]
      : level === "10"
        ? (root.children || []).map((unit) => unit.id)
        : (root.children || []).flatMap((unit) => (unit.children || []).map((child) => child.id)));
    const indexes = units.map((unit, index) => memberIds.has(unit.id) ? index : -1).filter((index) => index >= 0);
    const first = Math.min(...indexes);
    const last = Math.max(...indexes);
    return {
      root,
      top: unitY(first) - 38,
      height: unitY(last) + SUMMARY_NODE_HEIGHT + 24 - (unitY(first) - 38),
    };
  });

  return <section className="problem-graph-workspace self-summary-workspace" id="problem-graph">
    <div className="problem-graph-panel">
      <header className="problem-graph-toolbar">
        <div><p className="section-label">CURATED SELF SUMMARY</p><h3>自我主线 · {level} 个总结节点</h3></div>
        <p className="problem-graph-fit-note">总结节点为本站学习重构；原子节点与原始关系未被删除。</p>
      </header>

      <div className="problem-graph-scroll" role="region" aria-label={`自我问题的 ${level} 节点总结图`}>
        <svg viewBox={`0 0 ${SUMMARY_GRAPH_WIDTH} ${graphHeight}`} role="img" aria-label={`自我问题历史主线：${units.length} 个总结节点`}>
          <defs>
            <marker id="self-summary-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L7,3 z" fill="context-stroke" />
            </marker>
          </defs>

          <g className="self-summary-groups">
            {groupRanges.map(({ root, top, height }, index) => <g key={root.id}>
              <rect className={index % 2 ? "summary-group-even" : "summary-group-odd"} x="0" y={top} width={SUMMARY_GRAPH_WIDTH} height={height} />
              <text className="summary-group-label" x="48" y={top + 24}>{String(index + 1).padStart(2, "0")} · {root.title}</text>
            </g>)}
          </g>

          <g className="self-summary-edges">
            {units.slice(0, -1).map((unit, index) => {
              const startY = unitY(index) + SUMMARY_NODE_HEIGHT;
              const endY = unitY(index + 1);
              const centerX = SUMMARY_GRAPH_WIDTH / 2;
              return <path key={`${unit.id}-${units[index + 1].id}`} d={`M ${centerX} ${startY} C ${centerX} ${startY + 24}, ${centerX} ${endY - 24}, ${centerX} ${endY}`} markerEnd="url(#self-summary-arrow)"><title>{unit.transition} · 本站学习重构</title></path>;
            })}
          </g>

          <g className="self-summary-nodes">
            {units.map((unit, index) => {
              const selected = unit.id === selectedUnit?.id;
              const memberCount = unitMemberNodes(unit).length;
              const titleLines = splitSummaryTitle(unit.title);
              return <g className={`self-summary-node${selected ? " selected" : ""}`} key={unit.id} role="button" tabIndex={0} aria-label={`总结节点：${unit.title}，覆盖 ${memberCount} 个自我相关原子节点`} transform={`translate(${SUMMARY_NODE_X}, ${unitY(index)})`} onClick={() => setSelectedUnitId(unit.id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelectedUnitId(unit.id); } }}>
                <rect width={SUMMARY_NODE_WIDTH} height={SUMMARY_NODE_HEIGHT} rx="8" />
                <text className="self-summary-meta" x="16" y="21">{String(index + 1).padStart(2, "0")} · {unit.period} · {memberCount} 个原子节点</text>
                <text className="self-summary-title" x="16" y="50">{titleLines.map((line, lineIndex) => <tspan x="16" dy={lineIndex === 0 ? 0 : 22} key={`${unit.id}-${lineIndex}`}>{line}</tspan>)}</text>
                <circle cx={SUMMARY_NODE_WIDTH - 17} cy="17" r="4" />
              </g>;
            })}
          </g>
        </svg>
      </div>

      <footer className="problem-graph-evidence self-summary-evidence">
        <span><i aria-hidden="true" />总结节点</span>
        <span className="connection-folded"><i aria-hidden="true" />连线表示问题换形，不冒充直接影响</span>
      </footer>
    </div>

    {selectedUnit && <aside className="problem-node-detail self-summary-detail" aria-live="polite">
      <header>
        <div><span>总结节点</span><em>本站学习重构</em></div>
        <small>SELF · {level} 节点层 · 覆盖 {selectedMemberNodes.length} 个原子节点</small>
        <h3>{selectedUnit.title}</h3>
        <p>{selectedUnit.thesis}</p>
      </header>

      <div className="problem-node-detail-logic">
        <section><span>这一层在追问什么</span><p>{selectedUnit.question}</p></section>
        <section><span>它怎样转入下一段</span><p>{selectedUnit.transition}</p></section>
      </div>

      <div className="problem-node-detail-links">
        <section className="self-summary-expand">
          <span>逐级展开</span>
          <p>下一层会拆开当前五条主线，但不会改写任何原子节点或原始关系。</p>
          <button type="button" onClick={() => onLevelChange(nextSummaryLevel(level))}>展开到 {nextSummaryLevel(level) === "50" ? "50 个原子地标" : `${nextSummaryLevel(level)} 个总结节点`} →</button>
        </section>
        <section className="self-summary-phases">
          <span>覆盖的历史段落</span>
          <div>{selectedPhases.map((phase) => <article key={phase.id}><small>{String(phase.order).padStart(2, "0")}</small><b>{phase.title}</b></article>)}</div>
        </section>
        <section className="self-summary-members">
          <span>进入原子节点</span>
          <div>{selectedMemberNodes.slice(0, 12).map((node) => <button type="button" key={node.id} onClick={() => onAtomicNode(node.id)}><small>{node.kind}{node.answerRole ? ` · ${node.answerRole}` : ""}</small><b>{node.title}</b><i aria-hidden="true">↗</i></button>)}</div>
          {selectedMemberNodes.length > 12 && <p>另有 {selectedMemberNodes.length - 12} 个节点；展开到“全部”后可逐项查看。</p>}
        </section>
        <section className="self-summary-coverage">
          <span>覆盖范围</span>
          <p>{selectedParticipantNames.length} 位相关参与者 · {selectedChapterIds.length} 个原书章节 · {selectedPhases.length} 个维护阶段</p>
        </section>
      </div>
    </aside>}
  </section>;
}
