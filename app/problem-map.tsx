"use client";

import { useEffect, useMemo } from "react";
import { chapters } from "./book-data";
import { historyStages, stageDetailPanels } from "./history-data";
import { philosopherProfiles } from "./philosopher-data";
import { findSchoolProfilesByPhilosopher } from "./school-data";
import {
  ancientDifferenceProblemMap,
  problemConnectionNotes,
  problemRelationNotes,
  type ProblemConnectionKind,
  type ProblemEdge,
  type ProblemHistoryLink,
  type ProblemNode,
  type ProblemNodeKind,
  type ProblemRelationKind,
} from "./problem-map-data";

const GRAPH_WIDTH = 1280;
const NODE_WIDTH = 220;
const NODE_COMPACT_HEIGHT = 82;
const NODE_TITLE_LINE_HEIGHT = 19;
const GRAPH_TOP = 58;
const GRAPH_LEFT = 48;
const ROW_GAP = 132;
const ROOT_QUESTION_ANSWER_GAP = 116;
const LANE_GAP = (GRAPH_WIDTH - GRAPH_LEFT * 2 - NODE_WIDTH) / 4;

const kindEnglish: Record<ProblemNodeKind, string> = {
  观察: "OBSERVATION",
  问题: "QUESTION",
  答案: "ANSWER",
};

const relationEnglish: Record<ProblemRelationKind, string> = {
  提出问题: "RAISES",
  回应问题: "ANSWERS",
  产生问题: "GENERATES",
};

const connectionClass: Record<ProblemConnectionKind, string> = {
  原书线索: "source",
  历史回应: "historical",
  同题并列: "parallel",
  本站推演: "reconstruction",
  后世重构: "retrospective",
};

function graphPoint(node: ProblemNode) {
  return {
    x: GRAPH_LEFT + node.graph.lane * LANE_GAP,
    y: GRAPH_TOP + node.graph.row * ROW_GAP + (node.graph.row >= 2 ? ROOT_QUESTION_ANSWER_GAP : 0),
  };
}

function splitTitle(title: string, limit = 13) {
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
  return lines.slice(0, 3);
}

function nodeHeight(node: ProblemNode) {
  const extraLines = Math.max(0, splitTitle(node.title).length - 2);
  return NODE_COMPACT_HEIGHT + extraLines * NODE_TITLE_LINE_HEIGHT;
}

function edgePath(edge: ProblemEdge, nodesById: Map<string, ProblemNode>) {
  const source = nodesById.get(edge.from);
  const target = nodesById.get(edge.to);
  if (!source || !target) return "";
  const sourcePoint = graphPoint(source);
  const targetPoint = graphPoint(target);
  const startX = sourcePoint.x + NODE_WIDTH / 2;
  const startY = sourcePoint.y + nodeHeight(source);
  const endX = targetPoint.x + NODE_WIDTH / 2;
  const endY = targetPoint.y;
  const bend = Math.max(42, (endY - startY) * 0.48);
  return `M ${startX} ${startY} C ${startX} ${startY + bend}, ${endX} ${endY - bend}, ${endX} ${endY}`;
}

export function ProblemMapView({ activePhaseId, activeNodeId, onPhaseChange, onNodeChange, onPhilosopher, onSchool, onHistory, onChapter, showEnglish }: {
  activePhaseId: string;
  activeNodeId: string;
  onPhaseChange: (id: string) => void;
  onNodeChange: (id: string) => void;
  onPhilosopher: (id: string) => void;
  onSchool: (id: string) => void;
  onHistory: (link: ProblemHistoryLink, nodeId: string) => void;
  onChapter: (id: string) => void;
  showEnglish: boolean;
}) {
  const map = ancientDifferenceProblemMap;
  const allNodes = useMemo(() => map.phases.flatMap((phase) => phase.nodes), [map.phases]);
  const nodesById = useMemo(() => new Map(allNodes.map((node) => [node.id, node])), [allNodes]);
  const phaseByNodeId = useMemo(() => new Map(map.phases.flatMap((phase) => phase.nodes.map((node) => [node.id, phase]))), [map.phases]);
  const selectedNode = nodesById.get(activeNodeId) || allNodes[0];
  const selectedPhase = phaseByNodeId.get(selectedNode.id) || map.phases[0];
  const incomingEdges = map.edges.filter((edge) => edge.to === selectedNode.id);
  const outgoingEdges = map.edges.filter((edge) => edge.from === selectedNode.id);
  const connectedEdgeIds = new Set([...incomingEdges, ...outgoingEdges].map((edge) => edge.id));
  const connectedNodeIds = new Set([selectedNode.id, ...incomingEdges.map((edge) => edge.from), ...outgoingEdges.map((edge) => edge.to)]);
  const relatedParticipants = useMemo(() => {
    const oneHopIds = new Set(map.edges.flatMap((edge) => edge.from === selectedNode.id ? [edge.to] : edge.to === selectedNode.id ? [edge.from] : []));
    let sourceNodes = selectedNode.participants.length > 0
      ? [selectedNode]
      : [...oneHopIds].map((id) => nodesById.get(id)).filter((node): node is ProblemNode => Boolean(node?.participants.length));
    if (!sourceNodes.length) {
      const twoHopIds = new Set(map.edges.flatMap((edge) => oneHopIds.has(edge.from) ? [edge.to] : oneHopIds.has(edge.to) ? [edge.from] : []));
      sourceNodes = [...twoHopIds].map((id) => nodesById.get(id)).filter((node): node is ProblemNode => Boolean(node?.participants.length));
    }
    const unique = new Map<string, ProblemNode["participants"][number]>();
    sourceNodes.flatMap((node) => node.participants).forEach((participant) => {
      const key = participant.philosopherId || participant.name;
      if (!unique.has(key)) unique.set(key, participant);
    });
    return [...unique.values()];
  }, [map.edges, nodesById, selectedNode]);
  const relatedSchools = useMemo(() => {
    const unique = new Map<string, ReturnType<typeof findSchoolProfilesByPhilosopher>[number]>();
    relatedParticipants.forEach((participant) => {
      if (!participant.philosopherId) return;
      findSchoolProfilesByPhilosopher(participant.philosopherId).forEach((school) => unique.set(school.id, school));
    });
    return [...unique.values()].sort((left, right) => left.order - right.order);
  }, [relatedParticipants]);
  const graphHeight = Math.max(...allNodes.map((node) => graphPoint(node).y + nodeHeight(node))) + 70;

  const selectNode = (id: string) => {
    const phase = phaseByNodeId.get(id);
    onNodeChange(id);
    if (phase) onPhaseChange(phase.id);
  };

  useEffect(() => {
    if (selectedPhase.id === activePhaseId) return;
    const phase = map.phases.find((item) => item.id === activePhaseId);
    const target = phase?.nodes.find((node) => node.kind === "问题") || phase?.nodes[0];
    if (!target) return;
    const frame = window.requestAnimationFrame(() => {
      onNodeChange(target.id);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [activePhaseId, map.phases, onNodeChange, selectedPhase.id]);

  return <article className="problem-map-page page-wrap">
    <header className="problem-map-hero">
      <div className="problem-map-mark"><span>?</span><small>PROBLEM<br />GENEALOGY</small></div>
      <div className="problem-map-title">
        <p className="eyebrow">{map.period}</p>
        <h2>{map.title}</h2>
        <p className="problem-map-english">{map.english}</p>
        <blockquote>{map.thesis}</blockquote>
      </div>
      <aside className="problem-map-facts">
        <div><span>当前范围</span><b>泰勒斯 → 十二世纪学校与辩证法</b></div>
        <div><span>节点语法</span><b>观察 · 问题 · 答案</b></div>
        <div><span>图谱节点</span><b>{allNodes.length} 个</b></div>
        <div><span>关系连线</span><b>{map.edges.length} 条</b></div>
      </aside>
    </header>

    <aside className="problem-map-boundary"><span>阅读边界</span><p>{map.scopeNote}</p></aside>

    <section className="problem-graph-intro" aria-label="图谱语法">
      <div className="problem-node-legend">
        {(Object.keys(kindEnglish) as ProblemNodeKind[]).map((kind) => <span className={`kind-${kind}`} key={kind}><i aria-hidden="true" />{kind}<small>{kindEnglish[kind]}</small></span>)}
      </div>
      <div className="problem-relation-legend">
        {(Object.keys(problemRelationNotes) as ProblemRelationKind[]).map((relation) => <span key={relation} title={problemRelationNotes[relation]}><b>{relation}</b><small>{relationEnglish[relation]}</small></span>)}
      </div>
      <p>箭头表示问题如何被提出、回应和再次生成；线条颜色表示连接证据。点击任一节点查看完整内容与下钻入口。</p>
    </section>

    <section className="problem-graph-workspace" id="problem-graph">
      <div className="problem-graph-panel">
        <header className="problem-graph-toolbar">
          <div><p className="section-label">DIRECTED PROBLEM GRAPH</p><h3>观察提出问题，答案又产生问题</h3></div>
          <p className="problem-graph-fit-note">完整宽度呈现 · 页面仅纵向阅读</p>
        </header>

        <div className="problem-graph-scroll" role="region" aria-label="观察、问题与答案的有向关系图">
          <svg viewBox={`0 0 ${GRAPH_WIDTH} ${graphHeight}`} role="img" aria-label={`${map.title}：${allNodes.length} 个节点、${map.edges.length} 条关系`}>
            <defs>
              <marker id="problem-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L7,3 z" fill="context-stroke" />
              </marker>
            </defs>

            <g className="problem-graph-edges">
              {map.edges.map((edge) => {
                const connected = connectedEdgeIds.has(edge.id);
                return <g className={connected ? "connected" : ""} key={edge.id}>
                  <path
                    className={`problem-graph-edge relation-${edge.relation} connection-${connectionClass[edge.connection]}`}
                    d={edgePath(edge, nodesById)}
                    markerEnd="url(#problem-arrow)"
                    aria-hidden="true"
                  />
                </g>;
              })}
            </g>

            <g className="problem-graph-nodes">
              {allNodes.map((node, index) => {
                const point = graphPoint(node);
                const selected = node.id === selectedNode.id;
                const connected = connectedNodeIds.has(node.id);
                const lines = splitTitle(node.title);
                const height = nodeHeight(node);
                return <g
                  className={`problem-graph-node kind-${node.kind}${selected ? " selected" : ""}${connected ? " connected" : ""}`}
                  id={`problem-node-${node.id}`}
                  key={node.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`${node.kind}${node.answerRole ? `，${node.answerRole}型答案` : ""}：${node.title}`}
                  transform={`translate(${point.x}, ${point.y})`}
                  onClick={() => selectNode(node.id)}
                  onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); selectNode(node.id); } }}
                >
                  <rect width={NODE_WIDTH} height={height} rx="7" />
                  <text className="problem-graph-node-meta" x="13" y="18">{String(index + 1).padStart(2, "0")} · {kindEnglish[node.kind]}{node.answerRole ? ` · ${node.answerRole}` : ""}</text>
                  <text className="problem-graph-node-title" x="13" y="41">
                    {lines.map((line, lineIndex) => <tspan x="13" dy={lineIndex === 0 ? 0 : NODE_TITLE_LINE_HEIGHT} key={`${node.id}-${lineIndex}`}>{line}</tspan>)}
                  </text>
                  <circle cx={NODE_WIDTH - 14} cy="14" r="3.5" />
                </g>;
              })}
            </g>
          </svg>
        </div>

        <footer className="problem-graph-evidence">
          {(Object.keys(problemConnectionNotes) as ProblemConnectionKind[]).map((kind) => <span className={`connection-${connectionClass[kind]}`} title={problemConnectionNotes[kind]} key={kind}><i aria-hidden="true" />{kind}</span>)}
        </footer>
      </div>

      <aside className={`problem-node-detail kind-${selectedNode.kind}`} aria-live="polite">
        <header>
          <div><span>{selectedNode.kind}</span>{selectedNode.answerRole && <em>{selectedNode.answerRole}型答案</em>}</div>
          <small>{kindEnglish[selectedNode.kind]} · {incomingEdges.length} 条进入 / {outgoingEdges.length} 条发出</small>
          <h3>{selectedNode.title}</h3>
          <p>{selectedNode.summary}</p>
        </header>

        <div className="problem-node-detail-logic">
          <section><span>为什么进入图谱</span><p>{selectedNode.pressure}</p></section>
          <section><span>它又留下什么</span><p>{selectedNode.consequence}</p></section>
        </div>

        <div className="problem-node-detail-links">
          {selectedNode.observation && <section className="problem-observation-context">
            <span>观察范围</span>
            <div className="problem-observation-domain"><b>{selectedNode.observation.domain}</b><p>{selectedNode.observation.note}</p></div>
            {(selectedNode.observation.historyLinks?.length || 0) > 0 && <div className="problem-history-links"><small>关联历史概览</small>{selectedNode.observation.historyLinks?.map((link) => {
              const stage = historyStages.find((item) => item.id === link.stageId);
              const event = stageDetailPanels[link.stageId]?.events.find((item) => item.id === link.eventId);
              return stage ? <button type="button" key={`${selectedNode.id}-${link.stageId}-${link.eventId || link.responseId || "stage"}`} onClick={() => onHistory(link, selectedNode.id)}><small>{stage.years} · {stage.title}</small><b>{event?.title || link.label}</b><em>{link.note}</em><i aria-hidden="true">↗</i></button> : null;
            })}</div>}
          </section>}
          <section className="problem-participants"><span>对应哲学家</span><div>{relatedParticipants.length > 0 ? relatedParticipants.map((participant) => {
            const profile = participant.philosopherId ? philosopherProfiles.find((item) => item.id === participant.philosopherId) : undefined;
            return participant.philosopherId && profile
              ? <button key={`${selectedNode.id}-${participant.name}`} onClick={() => onPhilosopher(participant.philosopherId!)}><b>{participant.name}</b>{showEnglish && <small>{profile.nameEn}</small>}<em>{participant.role}</em><i aria-hidden="true">↗</i></button>
              : <span className="problem-participant-pending" key={`${selectedNode.id}-${participant.name}`}><b>{participant.name}</b><em>{participant.role}</em><small>人物页待补</small></span>;
          }) : <p>这一节点暂未连接到可核验的人物页面。</p>}</div></section>
          <section className="problem-school-links"><span>对应哲学流派与传统</span><div>{relatedSchools.length > 0 ? relatedSchools.map((school) => <button key={`${selectedNode.id}-${school.id}`} onClick={() => onSchool(school.id)}><b>{school.nameZh}</b>{showEnglish && <small>{school.nameEn}</small>}<em>{school.kind}</em><i aria-hidden="true">↗</i></button>) : <p>现有流派页面中尚无可直接对应的规范分类。</p>}</div></section>
          <section className="problem-chapter-links"><span>回到原书</span><div>{selectedNode.chapterIds.map((id) => {
            const chapter = chapters.find((item) => item.id === id);
            return chapter ? <button key={`${selectedNode.id}-${id}`} onClick={() => onChapter(id)}><small>{chapter.roman}</small><b>{chapter.title}</b></button> : null;
          })}</div></section>
        </div>
      </aside>
    </section>

    <section className="problem-map-sources">
      <header><p className="section-label">SOURCES & RECONSTRUCTION</p><h3>原书骨架、现代校正与本站推演分开保存</h3></header>
      <div>{map.sources.map((source) => source.url
        ? <a href={source.url} target="_blank" rel="noreferrer" key={source.label}><b>{source.label}</b><p>{source.note}</p><span>打开来源 ↗</span></a>
        : <article key={source.label}><b>{source.label}</b><p>{source.note}</p><span>项目内原书</span></article>)}</div>
    </section>
  </article>;
}
