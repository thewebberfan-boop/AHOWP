"use client";

import { useMemo, useState } from "react";
import { philosopherProfiles, type PhilosopherComparison } from "./philosopher-data";
import { D3ForceGraph, type ForceGraphLink, type ForceGraphNode } from "./d3-force-graph";

type PhilosopherGraphRelation = PhilosopherComparison["relation"];
type PhilosopherGraphEdge = {
  id: string;
  fromId: string;
  toId: string;
  relation: PhilosopherGraphRelation;
  reciprocal: boolean;
  evidence: Array<{ profileId: string; detail: string }>;
};

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

const philosopherGroup = (order: number) => {
  if (order <= 10) return "前苏格拉底";
  if (order <= 14) return "古典希腊";
  if (order <= 29) return "希腊化—罗马";
  if (order <= 38) return "教父与早期中世纪";
  if (order <= 42) return "伊斯兰与犹太";
  return "经院与政教";
};

export function PhilosopherGraphView({ initialPhilosopherId, onPhilosopher }: { initialPhilosopherId: string; onPhilosopher: (id: string) => void }) {
  const edges = useMemo(() => buildPhilosopherGraphEdges(), []);
  const [focusedId, setFocusedId] = useState<string | null>(initialPhilosopherId);
  const graphNodes = useMemo<ForceGraphNode[]>(() => philosopherProfiles.map((profile) => ({
    id: profile.id,
    order: profile.order,
    label: profile.nameZh,
    subtitle: profile.school,
    group: philosopherGroup(profile.order),
  })), []);
  const graphLinks = useMemo<ForceGraphLink[]>(() => edges.map((edge) => ({
    id: edge.id,
    source: edge.fromId,
    target: edge.toId,
    relation: edge.relation,
    directed: !edge.reciprocal,
    reciprocal: edge.reciprocal,
  })), [edges]);
  const focused = philosopherProfiles.find((profile) => profile.id === focusedId);
  const focusedEdges = focused ? edges.filter((edge) => edge.fromId === focused.id || edge.toId === focused.id) : edges;

  return <article className="school-map-page philosopher-map-page page-wrap">
    <header className="school-map-hero">
      <div><p className="eyebrow">PHILOSOPHER RELATION ATLAS</p><h2>哲学家关系图谱</h2><p>以人物索引顺序为骨架，把 {philosopherProfiles.length} 位哲学家之间的承接、影响、比较、批评与后世重构放在同一张图中。点击节点聚焦，再从下方关系说明进入人物页面。</p></div>
      <aside><div><span>人物节点</span><b>{philosopherProfiles.length}</b></div><div><span>关系边</span><b>{edges.length}</b></div><div><span>关系类型</span><b>{relationTypes.length}</b></div></aside>
    </header>

    <div className="d3-force-comparison" aria-label="两种 D3.js 哲学家图谱方案比较">
      <D3ForceGraph
        variant="typed"
        title="D3.js 多类型节点力导向网络图"
        description="按六个历史阶段形成多中心聚类，优先观察人物在时代群组中的位置与跨组连接。"
        ariaLabel="哲学家多类型节点力导向网络图"
        nodes={graphNodes}
        links={graphLinks}
        relationColors={relationColors}
        focusedId={focusedId}
        onFocus={setFocusedId}
      />
      <D3ForceGraph
        variant="relation"
        title="D3.js 力导向人物关系图"
        description="由人物关系边决定布局，节点大小随连接数量变化，优先观察中心人物与局部关系团簇。"
        ariaLabel="哲学家力导向人物关系图"
        nodes={graphNodes}
        links={graphLinks}
        relationColors={relationColors}
        focusedId={focusedId}
        onFocus={setFocusedId}
      />
    </div>

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
