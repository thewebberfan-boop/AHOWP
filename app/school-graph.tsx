"use client";

import { useMemo, useState } from "react";
import { D3ForceGraph, type ForceGraphLink, type ForceGraphNode } from "./d3-force-graph";
import {
  buildSchoolGraphEdges,
  findSchoolProfileByTarget,
  schoolAtlasGroup,
  schoolProfiles,
  schoolRelationMeta,
  sortSchoolRelations,
  type SchoolRelationType,
} from "./school-data";

const relationTypes = Object.keys(schoolRelationMeta) as SchoolRelationType[];

const relationColors: Record<SchoolRelationType, string> = {
  "思想来源": "#a63d31",
  "竞争": "#77546d",
  "分化": "#b4772f",
  "吸收改造": "#314b3d",
  "后世重构": "#4e7080",
};

export function SchoolGraphView({ initialSchoolId, onSchool }: { initialSchoolId: string; onSchool: (id: string) => void }) {
  const edges = useMemo(() => buildSchoolGraphEdges(), []);
  const [focusedId, setFocusedId] = useState<string | null>(initialSchoolId);
  const graphNodes = useMemo<ForceGraphNode[]>(() => schoolProfiles.map((school) => ({
    id: school.id,
    order: school.order,
    label: school.nameZh,
    subtitle: school.kind,
    group: schoolAtlasGroup(school.order),
  })), []);
  const graphLinks = useMemo<ForceGraphLink[]>(() => edges.map((edge) => ({
    id: edge.id,
    source: edge.fromId,
    target: edge.toId,
    relation: edge.relation,
    directed: edge.direction === "directed",
    reciprocal: edge.direction === "reciprocal",
  })), [edges]);
  const focusedSchool = schoolProfiles.find((school) => school.id === focusedId);
  const focusedEdges = focusedSchool
    ? edges.filter((edge) => edge.fromId === focusedSchool.id || edge.toId === focusedSchool.id)
    : edges;
  const externalRelations = focusedSchool
    ? sortSchoolRelations(focusedSchool.relations).filter((relation) => !findSchoolProfileByTarget(relation.target))
    : [];
  const allExternalRelations = schoolProfiles.flatMap((school) =>
    school.relations.filter((relation) => !findSchoolProfileByTarget(relation.target))
  );

  const relationCount = (type: SchoolRelationType) =>
    edges.filter((edge) => edge.relation === type).length
    + allExternalRelations.filter((relation) => relation.relation === type).length;

  return <article className="school-map-page page-wrap">
    <header className="school-map-hero">
      <div><p className="eyebrow">SCHOOL RELATION ATLAS</p><h2>流派关系图谱</h2><p>以左侧索引为时间骨架，把 {schoolProfiles.length} 种古代至现代传统之间的来源、竞争、分化与后世转译放在同一张图中。点击节点可聚焦关系，再进入完整流派页。</p></div>
      <aside><div><span>核心节点</span><b>{schoolProfiles.length}</b></div><div><span>内部关系</span><b>{edges.length}</b></div><div><span>外部延伸</span><b>{allExternalRelations.length}</b></div></aside>
    </header>

    <div className="d3-force-shell" aria-label="D3.js 流派关系图谱">
      <D3ForceGraph
        variant="typed"
        title="D3.js 多类型节点力导向网络图"
        description="按五类历史传统形成多中心聚类，优先观察流派的类型归属、跨文化连接与阶段迁移。"
        ariaLabel="哲学流派多类型节点力导向网络图"
        nodes={graphNodes}
        links={graphLinks}
        relationColors={relationColors}
        focusedId={focusedId}
        onFocus={setFocusedId}
      />
    </div>

    <section className="school-map-detail" aria-live="polite">
      {focusedSchool ? <>
        <header><div><p className="section-label">FOCUSED CONNECTIONS</p><h3>{focusedSchool.nameZh}</h3><p>{focusedEdges.length} 条内部关系{externalRelations.length ? ` · ${externalRelations.length} 条外部延伸` : ""}</p></div><button onClick={() => onSchool(focusedSchool.id)}>进入流派页 <span aria-hidden="true">→</span></button></header>
        <div className="school-map-relation-list">
          {focusedEdges.map((edge) => {
            const from = schoolProfiles.find((school) => school.id === edge.fromId)!;
            const to = schoolProfiles.find((school) => school.id === edge.toId)!;
            const evidence = edge.evidence.find((item) => item.profileId === focusedSchool.id) || edge.evidence[0];
            return <article key={edge.id} data-relation-type={edge.relation}><span className="school-relation-badge">{edge.relation}</span><h4>{from.nameZh} <i>{edge.direction === "reciprocal" ? "↔" : "→"}</i> {to.nameZh}</h4><p>{evidence.detail}</p></article>;
          })}
          {externalRelations.map((relation) => <article key={`${relation.relation}-${relation.target}`} data-relation-type={relation.relation}><span className="school-relation-badge">{relation.relation}</span><h4>{focusedSchool.nameZh} <i>→</i> {relation.target}</h4><p>{relation.detail}</p></article>)}
        </div>
      </> : <>
        <header><div><p className="section-label">GLOBAL LEGEND</p><h3>五类关系的整体密度</h3><p>{edges.length + allExternalRelations.length} 条去重关系；点击任一节点查看具体说明。</p></div></header>
        <div className="school-map-type-grid">{relationTypes.map((type) => <article key={type} data-relation-type={type}><span>{String(schoolRelationMeta[type].order).padStart(2, "0")}</span><b>{type}</b><strong>{relationCount(type)}</strong><p>{schoolRelationMeta[type].description}</p></article>)}</div>
      </>}
    </section>
  </article>;
}
