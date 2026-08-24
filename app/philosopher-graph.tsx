"use client";

import { useMemo, useState } from "react";
import { philosopherProfiles, type PhilosopherComparison } from "./philosopher-data";

type PhilosopherGraphRelation = PhilosopherComparison["relation"];
type PhilosopherGraphEdge = {
  id: string;
  fromId: string;
  toId: string;
  relation: PhilosopherGraphRelation;
  reciprocal: boolean;
  evidence: Array<{ profileId: string; detail: string }>;
};

const graphWidth = 1120;
const graphHeight = 760;
const nodeWidth = 148;
const nodeHeight = 76;
const columns = 6;
const relationTypes: PhilosopherGraphRelation[] = ["承接前人", "影响后继", "同题比较", "批评关系", "后世重构"];
const relationDescriptions: Record<PhilosopherGraphRelation, string> = {
  "承接前人": "当前人物从前人处接收问题、概念或生活方案。",
  "影响后继": "当前人物的表达或问题继续进入后来的思想。",
  "同题比较": "两位人物处理相近问题，但不预设谱系关系。",
  "批评关系": "人物之间存在明确的论争、反驳或立场张力。",
  "后世重构": "后来的阅读把前人重新解释为某种思想资源。",
};
const relationColors: Record<PhilosopherGraphRelation, string> = {
  "承接前人": "#a63d31",
  "影响后继": "#314b3d",
  "同题比较": "#77546d",
  "批评关系": "#b4772f",
  "后世重构": "#4e7080",
};
const relationMarkerIds: Record<PhilosopherGraphRelation, string> = {
  "承接前人": "philosopher-map-arrow-inherit",
  "影响后继": "philosopher-map-arrow-influence",
  "同题比较": "philosopher-map-arrow-compare",
  "批评关系": "philosopher-map-arrow-critique",
  "后世重构": "philosopher-map-arrow-reconstruct",
};

const findPhilosopher = (target: string) => philosopherProfiles.find((profile) => profile.nameZh === target || target.startsWith(profile.nameZh) || profile.nameZh.startsWith(target));

const buildPhilosopherGraphEdges = () => {
  const edgeMap = new Map<string, PhilosopherGraphEdge>();
  philosopherProfiles.forEach((profile) => {
    profile.comparisons.forEach((comparison) => {
      const target = findPhilosopher(comparison.target);
      if (!target || target.id === profile.id) return;
      const reciprocal = comparison.relation === "同题比较" || comparison.relation === "批评关系";
      const fromId = comparison.relation === "承接前人" ? target.id : profile.id;
      const toId = comparison.relation === "承接前人" ? profile.id : target.id;
      const keyParts = [fromId, toId].sort();
      const id = `${comparison.relation}:${keyParts[0]}:${keyParts[1]}`;
      const evidence = { profileId: profile.id, detail: `${comparison.shared} ${comparison.difference}` };
      const existing = edgeMap.get(id);
      if (existing) {
        if (!existing.evidence.some((item) => item.profileId === evidence.profileId && item.detail === evidence.detail)) existing.evidence.push(evidence);
        return;
      }
      edgeMap.set(id, { id, fromId, toId, relation: comparison.relation, reciprocal, evidence: [evidence] });
    });
  });
  return [...edgeMap.values()].sort((left, right) => {
    const leftFrom = philosopherProfiles.find((profile) => profile.id === left.fromId)?.order || 0;
    const rightFrom = philosopherProfiles.find((profile) => profile.id === right.fromId)?.order || 0;
    return leftFrom - rightFrom || left.relation.localeCompare(right.relation);
  });
};

const nodePosition = (order: number) => {
  const index = order - 1;
  return { x: 22 + (index % columns) * 181, y: 24 + Math.floor(index / columns) * 145 };
};

const edgePath = (edge: PhilosopherGraphEdge) => {
  const from = philosopherProfiles.find((profile) => profile.id === edge.fromId);
  const to = philosopherProfiles.find((profile) => profile.id === edge.toId);
  if (!from || !to) return "";
  const start = nodePosition(from.order);
  const end = nodePosition(to.order);
  const startX = start.x + nodeWidth;
  const startY = start.y + nodeHeight / 2;
  const endX = end.x;
  const endY = end.y + nodeHeight / 2;
  const controlX = startX + (endX - startX) / 2;
  return `M ${startX} ${startY} C ${controlX} ${startY}, ${controlX} ${endY}, ${endX} ${endY}`;
};

export function PhilosopherGraphView({ initialPhilosopherId, onPhilosopher }: { initialPhilosopherId: string; onPhilosopher: (id: string) => void }) {
  const edges = useMemo(() => buildPhilosopherGraphEdges(), []);
  const [focusedId, setFocusedId] = useState<string | null>(initialPhilosopherId);
  const focused = philosopherProfiles.find((profile) => profile.id === focusedId);
  const focusedEdges = focused ? edges.filter((edge) => edge.fromId === focused.id || edge.toId === focused.id) : edges;
  const connectedIds = new Set(focusedEdges.flatMap((edge) => [edge.fromId, edge.toId]));

  return <article className="school-map-page philosopher-map-page page-wrap">
    <header className="school-map-hero">
      <div><p className="eyebrow">PHILOSOPHER RELATION ATLAS</p><h2>哲学家关系图谱</h2><p>以人物索引顺序为骨架，把 29 位哲学家之间的承接、影响、比较、批评与后世重构放在同一张图中。点击节点聚焦，再从下方关系说明进入人物页面。</p></div>
      <aside><div><span>人物节点</span><b>{philosopherProfiles.length}</b></div><div><span>关系边</span><b>{edges.length}</b></div><div><span>关系类型</span><b>{relationTypes.length}</b></div></aside>
    </header>

    <section className="school-map-panel" aria-label="哲学家关系图">
      <header className="school-map-toolbar">
        <div className="school-map-legend" aria-label="人物关系类型图例">{relationTypes.map((type) => <span key={type} data-relation-type={type}><i aria-hidden="true" />{type}</span>)}</div>
        <button className={!focusedId ? "active" : ""} aria-pressed={!focusedId} onClick={() => setFocusedId(null)}>显示全部关系</button>
      </header>
      <div className="school-map-scroll">
        <div className="school-map-canvas philosopher-map-canvas" style={{ width: graphWidth, height: graphHeight }}>
          <svg className="school-map-lines" viewBox={`0 0 ${graphWidth} ${graphHeight}`} aria-hidden="true">
            <defs>{relationTypes.map((type) => <marker key={type} id={relationMarkerIds[type]} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth"><path d="M 0 0 L 8 4 L 0 8 z" fill={relationColors[type]} /></marker>)}</defs>
            {edges.map((edge) => {
              const active = !focusedId || edge.fromId === focusedId || edge.toId === focusedId;
              return <path key={edge.id} d={edgePath(edge)} className={`philosopher-map-edge ${active ? "active" : "muted"}`} data-relation-type={edge.relation} markerEnd={!edge.reciprocal ? `url(#${relationMarkerIds[edge.relation]})` : undefined} />;
            })}
          </svg>
          {philosopherProfiles.map((profile) => {
            const position = nodePosition(profile.order);
            const active = profile.id === focusedId;
            const connected = !focusedId || connectedIds.has(profile.id);
            return <button key={profile.id} className={`philosopher-map-node${active ? " active" : ""}${connected ? " connected" : " muted"}`} style={{ left: position.x, top: position.y, width: nodeWidth, minHeight: nodeHeight }} aria-pressed={active} aria-label={`聚焦哲学家：${profile.nameZh}`} onClick={() => setFocusedId(profile.id)}><span>{String(profile.order).padStart(2, "0")}</span><b>{profile.nameZh}</b><small>{profile.school}</small></button>;
          })}
        </div>
      </div>
    </section>

    <section className="school-map-detail philosopher-map-detail" aria-live="polite">
      {focused ? <>
        <header><div><p className="section-label">FOCUSED CONNECTIONS</p><h3>{focused.nameZh}</h3><p>{focusedEdges.length} 条人物关系 · {focused.school}</p></div><button onClick={() => onPhilosopher(focused.id)}>进入人物页 <span aria-hidden="true">→</span></button></header>
        <div className="school-map-relation-list">{focusedEdges.map((edge) => { const from = philosopherProfiles.find((profile) => profile.id === edge.fromId)!; const to = philosopherProfiles.find((profile) => profile.id === edge.toId)!; const evidence = edge.evidence.find((item) => item.profileId === focused.id) || edge.evidence[0]; return <article key={edge.id} data-relation-type={edge.relation}><span className="school-relation-badge">{edge.relation}</span><h4>{from.nameZh} <i>{edge.reciprocal ? "↔" : "→"}</i> {to.nameZh}</h4><p>{evidence.detail}</p></article>; })}</div>
      </> : <>
        <header><div><p className="section-label">GLOBAL LEGEND</p><h3>五类人物关系</h3><p>{edges.length} 条关系边；点击任一节点查看具体连接。</p></div></header>
        <div className="school-map-type-grid philosopher-map-type-grid">{relationTypes.map((type) => <article key={type} data-relation-type={type}><span>{String(relationTypes.indexOf(type) + 1).padStart(2, "0")}</span><b>{type}</b><strong>{edges.filter((edge) => edge.relation === type).length}</strong><p>{relationDescriptions[type]}</p></article>)}</div>
      </>}
    </section>
  </article>;
}
