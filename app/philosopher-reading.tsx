"use client";

import type { ReactNode } from "react";
import type { PhilosopherProfile } from "./philosopher-data";
import type { PhilosopherReading } from "./philosopher-reading-data";
import { ancientDifferenceProblemMap } from "./problem-map-data";
import { knowledgeNodeById, selfNodeTopics } from "./knowledge-paths";
import { chapters } from "./book-data";

export function PhilosopherReadingPanel({ profile, reading, nodeId, onNodeSelect, onLocate, onChapter, renderText = (text) => text }: {
  profile: PhilosopherProfile;
  reading?: PhilosopherReading;
  nodeId: string;
  onNodeSelect: (id: string) => void;
  onLocate: () => void;
  onChapter?: (id: string) => void;
  renderText?: (text: string) => ReactNode;
}) {
  const node = knowledgeNodeById.get(nodeId);
  if (!node) return null;
  const members = (reading?.nodeIds || [node.id]).map((id) => knowledgeNodeById.get(id)!).filter(Boolean);
  const memberIds = new Set(members.map((item) => item.id));
  const relations = ancientDifferenceProblemMap.edges.filter((edge) =>
    (edge.from === node.id || edge.to === node.id) && memberIds.has(edge.from) && memberIds.has(edge.to));
  const role = node.participants.find((person) => person.philosopherId === profile.id);

  return <section className="philosopher-reading-panel" aria-label="核心问题的同源阅读">
    {reading && <header><h4>{reading.label}</h4></header>}
    <div className="philosopher-reading-layout">
      <nav className="philosopher-reading-steps" aria-label="论证阅读顺序">
        <p>按问题读 · 点击与图谱同步</p>
        {members.map((item, index) => <button type="button" key={item.id} aria-current={node.id === item.id ? "step" : undefined} onClick={() => onNodeSelect(item.id)}>
          <span>{String(index + 1).padStart(2, "0")} · {item.kind}</span>{item.title}
        </button>)}
        <small>编号仅表示本站阅读顺序，不表示相邻条目可以直接推出。</small>
      </nav>
      <article className="philosopher-reading-explanation" aria-live="polite" aria-atomic="true">
        <small>{node.kind} · {selfNodeTopics(node.id).join(" / ")} · {role ? (node.kind === "答案" ? "本人参与的回答" : "本人关联的语境") : "相关问题／比较背景"}</small>
        <h5>{renderText(node.title)}</h5>
        {role && <p className="philosopher-reading-attribution">{profile.nameZh}：{renderText(role.role)}</p>}
        <p>{renderText(node.summary)}</p>
        <div className="philosopher-reading-reason"><b>{node.kind === "答案" ? "限制与待解释之处" : "为什么值得追问"}</b><p>{renderText(node.pressure)}</p></div>
        <div className="philosopher-reading-reason"><b>由此继续追问</b><p>{renderText(node.consequence)}</p></div>
        <details className="philosopher-reading-evidence"><summary>核对关系与来源</summary>
          {relations.length ? relations.map((edge) => <p key={edge.id}><b>{edge.connection} · {edge.relation}</b>：{renderText(edge.label)}</p>) : <p>当前阅读片段没有此节点的直接连线；不据编号补造推导。</p>}
          <p>原书章节：{node.chapterIds.map((id) => {
            const label = chapters.find((chapter) => chapter.id === id)?.title || id;
            return onChapter ? <button type="button" key={id} onClick={() => onChapter(id)}>{label} →</button> : <span key={id}>《{label}》 </span>;
          })}。以下为人物页参考入口，非逐句原典引证。</p>
          <ul>{profile.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label}</a></li>)}</ul>
        </details>
        <button type="button" className="philosopher-reading-locate" onClick={onLocate}>在完整图谱中定位 →</button>
      </article>
    </div>
  </section>;
}
