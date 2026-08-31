"use client";

import { createContext, useContext, useState, type SyntheticEvent } from "react";
import { knowledgeUnitsFor, selfNodeTopics, type KnowledgeContext, type ReadingTarget } from "./knowledge-paths";

export const KnowledgeNavigationContext = createContext<((target: ReadingTarget) => void) | null>(null);
const openSectionsByContext = new Map<string, Set<string>>();

export function KnowledgeConnections({ context }: { context: KnowledgeContext }) {
  const navigate = useContext(KnowledgeNavigationContext);
  const contextKey = `${context.kind}:${context.id}`;
  const [openSections, setOpenSections] = useState(() => openSectionsByContext.get(contextKey) || new Set<string>());
  const rememberSection = (id: string, event: SyntheticEvent<HTMLDetailsElement>) => {
    const open = event.currentTarget.open;
    if (open === openSections.has(id)) return;
    const next = new Set(openSections);
    if (open) next.add(id); else next.delete(id);
    openSectionsByContext.set(contextKey, next);
    setOpenSections(next);
  };
  const units = knowledgeUnitsFor(context);
  if (!units.length) return null;
  const roots = [...new Map(units.map((item) => [item.root.id, item.root])).values()];
  return <section className="knowledge-connections" aria-label="把本页接回自我问题主线">
    <header><div><p className="section-label">ONE QUESTION, MULTIPLE ENTRANCES</p><h4>把这页接回整体 · 自我</h4></div>
      <button type="button" onClick={() => navigate?.({ unitId: roots[0].id, nodeId: units[0].entry.id, level: "5" })}>从五组问题看全貌 →</button>
    </header>
    <p className="knowledge-boundary">先认出问题，再展开本页的具体论证。下方内容与图谱共用同一节点；流派内的参与者不代表全派共识。本轮先贯通“自我”。</p>
    {roots.map((root) => <details key={root.id} open={openSections.has(root.id)} onToggle={(event) => rememberSection(root.id, event)}>
      <summary><b>{root.title}</b><span>{units.filter((item) => item.root.id === root.id).length} 组相关论证</span></summary>
      <p>{root.overview}</p>
      {units.filter((item) => item.root.id === root.id).map(({ unit, nodes, entry }) => <article key={unit.id}>
        <header><h5>{unit.title}</h5><button type="button" onClick={() => navigate?.({ unitId: unit.id, nodeId: entry.id, level: "20" })}>在主线中定位 →</button></header>
        <p className="knowledge-shared-question">{unit.question}</p>
        <details open={openSections.has(unit.id)} onToggle={(event) => rememberSection(unit.id, event)}><summary>展开本页的 {nodes.length} 个论证节点 · 与图谱原文一致</summary>
          <ol>{nodes.map((node) => <li key={node.id} data-knowledge-node={node.id}>
            <small>{node.kind} · {node.participants.map((person) => person.name).join("、")} · {selfNodeTopics(node.id).join(" / ")}</small>
            <button type="button" onClick={() => navigate?.({ unitId: unit.id, nodeId: node.id, level: "all" })}>{node.title} ↗</button>
            <p>{node.summary}</p>
          </li>)}</ol>
        </details>
      </article>)}
    </details>)}
  </section>;
}
