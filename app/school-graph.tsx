"use client";

import { useMemo, useState } from "react";
import {
  buildSchoolGraphEdges,
  findSchoolProfileByTarget,
  schoolProfiles,
  schoolRelationMeta,
  sortSchoolRelations,
  type SchoolGraphEdge,
  type SchoolRelationType,
} from "./school-data";

const graphWidth = 1080;
const graphHeight = 520;
const nodeWidth = 118;
const nodeHeight = 86;
const relationTypes = Object.keys(schoolRelationMeta) as SchoolRelationType[];

const relationColors: Record<SchoolRelationType, string> = {
  "思想来源": "#a63d31",
  "竞争": "#77546d",
  "分化": "#b4772f",
  "吸收改造": "#314b3d",
  "后世重构": "#4e7080",
};

const relationMarkerIds: Record<SchoolRelationType, string> = {
  "思想来源": "school-map-arrow-source",
  "竞争": "school-map-arrow-competition",
  "分化": "school-map-arrow-branch",
  "吸收改造": "school-map-arrow-adapt",
  "后世重构": "school-map-arrow-reconstruct",
};

const nodePosition = (order: number) => ({
  x: 25 + (order - 1) * 133,
  y: order % 2 === 1 ? 88 : 346,
});

const edgePath = (edge: SchoolGraphEdge) => {
  const from = schoolProfiles.find((school) => school.id === edge.fromId);
  const to = schoolProfiles.find((school) => school.id === edge.toId);
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

export function SchoolGraphView({ initialSchoolId, onSchool }: { initialSchoolId: string; onSchool: (id: string) => void }) {
  const edges = useMemo(() => buildSchoolGraphEdges(), []);
  const [focusedId, setFocusedId] = useState<string | null>(initialSchoolId);
  const focusedSchool = schoolProfiles.find((school) => school.id === focusedId);
  const focusedEdges = focusedSchool
    ? edges.filter((edge) => edge.fromId === focusedSchool.id || edge.toId === focusedSchool.id)
    : edges;
  const connectedIds = new Set(focusedEdges.flatMap((edge) => [edge.fromId, edge.toId]));
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
      <div><p className="eyebrow">SCHOOL RELATION ATLAS</p><h2>流派关系图谱</h2><p>以左侧索引为时间骨架，把八种古代传统之间的来源、竞争、分化与后世转译放在同一张图中。点击节点可聚焦关系，再进入完整流派页。</p></div>
      <aside><div><span>核心节点</span><b>{schoolProfiles.length}</b></div><div><span>内部关系</span><b>{edges.length}</b></div><div><span>外部延伸</span><b>{allExternalRelations.length}</b></div></aside>
    </header>

    <section className="school-map-panel" aria-label="哲学流派关系图">
      <header className="school-map-toolbar">
        <div className="school-map-legend" aria-label="关系类型图例">{relationTypes.map((type) => <span key={type} data-relation-type={type}><i aria-hidden="true" />{type}</span>)}</div>
        <button className={!focusedId ? "active" : ""} aria-pressed={!focusedId} onClick={() => setFocusedId(null)}>显示全部关系</button>
      </header>
      <div className="school-map-scroll">
        <div className="school-map-canvas" style={{ width: graphWidth, height: graphHeight }}>
          <svg className="school-map-lines" viewBox={`0 0 ${graphWidth} ${graphHeight}`} aria-hidden="true">
            <defs>{relationTypes.map((type) => <marker key={type} id={relationMarkerIds[type]} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth"><path d="M 0 0 L 8 4 L 0 8 z" fill={relationColors[type]} /></marker>)}</defs>
            {edges.map((edge) => {
              const isFocused = !focusedId || edge.fromId === focusedId || edge.toId === focusedId;
              return <path
                key={edge.id}
                d={edgePath(edge)}
                className={isFocused ? "school-map-edge active" : "school-map-edge muted"}
                data-relation-type={edge.relation}
                markerEnd={edge.direction === "directed" ? `url(#${relationMarkerIds[edge.relation]})` : undefined}
              />;
            })}
          </svg>
          {schoolProfiles.map((school) => {
            const position = nodePosition(school.order);
            const active = school.id === focusedId;
            const connected = !focusedId || connectedIds.has(school.id);
            return <button
              key={school.id}
              className={`school-map-node${active ? " active" : ""}${connected ? " connected" : " muted"}`}
              style={{ left: position.x, top: position.y, width: nodeWidth, minHeight: nodeHeight }}
              aria-pressed={active}
              aria-label={`聚焦流派：${school.nameZh}`}
              onClick={() => setFocusedId(school.id)}
            ><span>{String(school.order).padStart(2, "0")}</span><b>{school.nameZh}</b><small>{school.period}</small></button>;
          })}
        </div>
      </div>
    </section>

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
