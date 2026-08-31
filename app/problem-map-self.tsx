"use client";

import { useMemo } from "react";
import type { ProblemNode, ProblemPhase } from "./problem-map-data";
import {
  collectSelfSummaryNodeIds,
  flattenSelfSummaryLevel,
  selfSummaryTree,
  nextSelfSummaryLevel,
  resolveSelfSummaryUnit,
  type SelfSummaryLevel,
  type SelfSummaryUnit,
} from "./problem-map-self-data";
import { ancientDifferenceProblemMap } from "./problem-map-data";
import { buildSelfSummaryConnections, selfNodeTopics } from "./knowledge-paths";

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
  return lines;
}

export function SelfSummaryGraph({
  level,
  allNodes,
  phaseByNodeId,
  selectedUnitId,
  onUnitSelect,
  onDrillDown,
  onAtomicNode,
}: {
  level: SelfSummaryLevel;
  allNodes: ProblemNode[];
  phaseByNodeId: Map<string, ProblemPhase>;
  selectedUnitId: string;
  onUnitSelect: (id: string) => void;
  onDrillDown: (unit: SelfSummaryUnit) => void;
  onAtomicNode: (nodeId: string) => void;
}) {
  const units = useMemo(() => flattenSelfSummaryLevel(level), [level]);
  const phaseIndex = useMemo(() => new Map([...phaseByNodeId.values()].map((phase) => [phase.id, phase])), [phaseByNodeId]);
  const connections = useMemo(() => buildSelfSummaryConnections(units, ancientDifferenceProblemMap.edges), [units]);

  const selectedUnit = resolveSelfSummaryUnit(level, selectedUnitId);
  const nextLevel = nextSelfSummaryLevel(level);
  const expandLabel = nextLevel === "all" ? "进入具体论证节点" : nextLevel === "10" ? "展开对应主线" : "展开对应论证组";
  const measurements = units.map((unit) => {
    const titleLines = splitSummaryTitle(unit.title);
    const overviewLines = unit.overview ? splitSummaryTitle(unit.overview, 28) : [];
    const overviewY = 50 + (titleLines.length - 1) * 22 + 25;
    const lastTextY = overviewLines.length ? overviewY + (overviewLines.length - 1) * 18 : overviewY - 25;
    const height = Math.max(SUMMARY_NODE_HEIGHT, lastTextY + 34);
    return { height, titleLines, overviewLines, overviewY };
  });
  const layouts = measurements.map((measurement, index) => ({
    ...measurement,
    y: SUMMARY_TOP + measurements.slice(0, index).reduce((height, item) => height + item.height + SUMMARY_ROW_GAP, 0),
  }));
  const unitY = (index: number) => layouts[index].y;
  const graphHeight = Math.max(360, unitY(units.length - 1) + layouts[units.length - 1].height + 70);

  const unitMemberNodes = (unit: SelfSummaryUnit) => {
    const ids = new Set(collectSelfSummaryNodeIds(unit));
    return allNodes.filter((node) => ids.has(node.id));
  };

  const selectedMemberNodes = selectedUnit ? unitMemberNodes(selectedUnit) : [];
  const selectedPhaseIds = [...new Set(selectedMemberNodes.map((node) => phaseByNodeId.get(node.id)?.id || ""))];
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
      height: unitY(last) + layouts[last].height + 24 - (unitY(first) - 38),
    };
  });

  return <section className="problem-graph-workspace self-summary-workspace" id="problem-graph">
    <div className="problem-graph-panel">
      <header className="problem-graph-toolbar">
        <div><p className="section-label">CURATED SELF SUMMARY</p><h3>自我 · {level === "5" ? "总览" : level === "10" ? "主线" : "论证组"} · {units.length} 组问题</h3></div>
        <div className="self-summary-actions">
          <p className="problem-graph-fit-note" id="self-summary-navigation-help">单击看解释 · 双击或 Enter 展开 · 空格选中</p>
          <button type="button" onClick={() => onDrillDown(selectedUnit)} aria-label={`${expandLabel}：${selectedUnit.title}`}>{expandLabel} →</button>
        </div>
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
            {connections.filter((link) => level === "5" || link.from === selectedUnit.id || link.to === selectedUnit.id).map((link, linkIndex) => {
              const index = units.findIndex((unit) => unit.id === link.from);
              const nextIndex = units.findIndex((unit) => unit.id === link.to);
              const startY = unitY(index) + layouts[index].height / 2;
              const endY = unitY(nextIndex) + layouts[nextIndex].height / 2;
              const x = SUMMARY_NODE_X + SUMMARY_NODE_WIDTH;
              const bend = x + 55 + (linkIndex % 5) * 24;
              return <path key={`${link.from}-${link.to}`} d={`M ${x} ${startY} C ${bend} ${startY}, ${bend} ${endY}, ${x} ${endY}`} strokeDasharray={link.edges.length ? undefined : "5 4"} markerEnd={link.edges.length ? "url(#self-summary-arrow)" : undefined}><title>{link.edges.map((edge) => `${edge.connection}：${edge.label}`).join("；") + (link.sharedNodeIds.length ? `；共享 ${link.sharedNodeIds.length} 个原子节点` : "")}</title></path>;
            })}
          </g>

          <g className="self-summary-nodes">
            {units.map((unit, index) => {
              const selected = unit.id === selectedUnit?.id;
              const memberCount = unitMemberNodes(unit).length;
              const { height, titleLines, overviewLines, overviewY } = layouts[index];
              return <g className={`self-summary-node${selected ? " selected" : ""}`} id={`self-summary-${unit.id}`} key={unit.id} role="button" tabIndex={0} aria-pressed={selected} aria-describedby="self-summary-navigation-help" aria-label={`总结节点：${unit.title}，覆盖 ${memberCount} 个自我相关原子节点。${expandLabel}`} transform={`translate(${SUMMARY_NODE_X}, ${unitY(index)})`} onClick={() => onUnitSelect(unit.id)} onDoubleClick={() => onDrillDown(unit)} onKeyDown={(event) => {
                if (event.key === "Enter") { event.preventDefault(); if (!event.repeat) onDrillDown(unit); }
                if (event.key === " ") { event.preventDefault(); onUnitSelect(unit.id); }
              }}>
                <rect width={SUMMARY_NODE_WIDTH} height={height} rx="8" />
                <text className="self-summary-meta" x="16" y="21">{String(index + 1).padStart(2, "0")} · {unit.period} · {memberCount} 个原子节点</text>
                <text className="self-summary-title" x="16" y="50">{titleLines.map((line, lineIndex) => <tspan x="16" dy={lineIndex === 0 ? 0 : 22} key={`${unit.id}-${lineIndex}`}>{line}</tspan>)}</text>
                {overviewLines.length > 0 && <text className="self-summary-overview" x="16" y={overviewY}>{overviewLines.map((line, lineIndex) => <tspan x="16" dy={lineIndex === 0 ? 0 : 18} key={`${unit.id}-overview-${lineIndex}`}>{line}</tspan>)}</text>}
                <text className="self-summary-hint" x="16" y={height - 12}>双击展开 · 本站学习重构</text>
                <circle cx={SUMMARY_NODE_WIDTH - 17} cy="17" r="4" />
              </g>;
            })}
          </g>
        </svg>
      </div>

      <footer className="problem-graph-evidence self-summary-evidence">
        <span><i aria-hidden="true" />总结节点</span>
        <span className="connection-folded"><i aria-hidden="true" />箭头可追溯至节点关系；虚线为共享节点。{level !== "5" && "只画当前卡片的连接。"}同题比较不代表直接影响</span>
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
          <p>{nextLevel === "all" ? "进入全部自我节点，并选中本卡对应的原始问题或答案。" : "展开当前卡片，选中并定位到它的第一张子卡；同层其他卡片仍然保留。"}</p>
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
      </div>
    </aside>}
  </section>;
}
