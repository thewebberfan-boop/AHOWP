"use client";

import { useEffect, useRef } from "react";
import { chapters } from "./book-data";
import { philosopherProfiles } from "./philosopher-data";
import { ancientDifferenceProblemMap, problemConnectionNotes, type ProblemConnectionKind, type ProblemNodeKind } from "./problem-map-data";

const kindEnglish: Record<ProblemNodeKind, string> = {
  观察: "OBSERVATION",
  问题: "QUESTION",
  区分: "DISTINCTION",
  回答: "PROPOSAL",
  反驳: "OBJECTION",
  修复: "REPAIR",
  转向: "SHIFT",
  开放问题: "OPEN PROBLEM",
};

const connectionClass: Record<ProblemConnectionKind, string> = {
  原书线索: "source",
  历史回应: "historical",
  同题并列: "parallel",
  本站推演: "reconstruction",
  后世重构: "retrospective",
};

function scrollToProblemPhase(id: string) {
  const root = document.documentElement;
  const previousBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  document.getElementById(`problem-${id}`)?.scrollIntoView({ behavior: "auto", block: "start" });
  root.style.scrollBehavior = previousBehavior;
}

export function ProblemMapView({ activePhaseId, onPhaseChange, onPhilosopher, onChapter, showEnglish }: {
  activePhaseId: string;
  onPhaseChange: (id: string) => void;
  onPhilosopher: (id: string) => void;
  onChapter: (id: string) => void;
  showEnglish: boolean;
}) {
  const map = ancientDifferenceProblemMap;
  const phaseRefs = useRef(new Map<string, HTMLElement>());

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((left, right) => Math.abs(left.boundingClientRect.top) - Math.abs(right.boundingClientRect.top))[0];
      const id = visible?.target.getAttribute("data-problem-phase");
      if (id) onPhaseChange(id);
    }, { rootMargin: "-24% 0px -62% 0px", threshold: [0, 0.1, 0.4] });
    phaseRefs.current.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [onPhaseChange]);

  const nodeCount = map.phases.reduce((sum, phase) => sum + phase.nodes.length, 0);
  const participantCount = new Set(map.phases.flatMap((phase) => phase.nodes.flatMap((node) => node.participants.map((participant) => participant.name)))).size;
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
        <div><span>当前范围</span><b>泰勒斯 → 柏拉图</b></div>
        <div><span>逻辑阶段</span><b>{map.phases.length} 段</b></div>
        <div><span>思想节点</span><b>{nodeCount} 个</b></div>
        <div><span>参与人物</span><b>{participantCount} 位</b></div>
      </aside>
    </header>

    <aside className="problem-map-boundary"><span>阅读边界</span><p>{map.scopeNote}</p></aside>

    <nav className="problem-map-local-nav" aria-label="问题图谱阶段">
      {map.phases.map((phase) => <a className={phase.id === activePhaseId ? "active" : ""} href={`#problem-${phase.id}`} key={phase.id} onClick={(event) => { event.preventDefault(); onPhaseChange(phase.id); scrollToProblemPhase(phase.id); }}><span>{String(phase.order).padStart(2, "0")}</span>{phase.label}</a>)}
    </nav>

    <section className="problem-map-key" aria-label="连线证据说明">
      <header><p className="section-label">HOW TO READ THE LINKS</p><h3>先看“为什么到下一步”，再看谁在这里思考</h3></header>
      <div>{(Object.keys(problemConnectionNotes) as ProblemConnectionKind[]).map((kind) => <article className={`connection-${connectionClass[kind]}`} key={kind}><span>{kind}</span><p>{problemConnectionNotes[kind]}</p></article>)}</div>
    </section>

    <div className="problem-phase-list">
      {map.phases.map((phase) => <section
        className={phase.id === activePhaseId ? "problem-phase active" : "problem-phase"}
        id={`problem-${phase.id}`}
        data-problem-phase={phase.id}
        key={phase.id}
        ref={(element) => { if (element) phaseRefs.current.set(phase.id, element); else phaseRefs.current.delete(phase.id); }}
      >
        <header className="problem-phase-heading">
          <span>{String(phase.order).padStart(2, "0")}</span>
          <div><p>{phase.label}</p><h3>{phase.title}</h3><blockquote>{phase.question}</blockquote></div>
          <aside>{phase.transition}</aside>
        </header>

        <div className="problem-node-list">
          {phase.nodes.map((node, index) => <div className="problem-node-step" key={node.id}>
            {index > 0 && <div className={`problem-edge connection-${connectionClass[node.connection]}`} aria-label={`逻辑连接：${node.relationFromPrevious}；${node.connection}`}><span>{node.relationFromPrevious}</span><i aria-hidden="true">↓</i><small>{node.connection}</small></div>}
            <article className={`problem-node kind-${node.kind === "开放问题" ? "open" : node.kind}`} id={`problem-node-${node.id}`}>
              <header>
                <span className="problem-node-index">{String(phase.order).padStart(2, "0")}.{String(index + 1).padStart(2, "0")}</span>
                <div><small>{kindEnglish[node.kind]}</small><b>{node.kind}</b></div>
                <em className={`connection-${connectionClass[node.connection]}`} title={problemConnectionNotes[node.connection]}>{node.connection}</em>
              </header>
              <div className="problem-node-body">
                <div className="problem-node-main"><h4>{node.title}</h4><p>{node.summary}</p></div>
                <div className="problem-node-logic">
                  <section><span>为什么推进到这里</span><p>{node.pressure}</p></section>
                  <i aria-hidden="true">→</i>
                  <section><span>它又打开什么</span><p>{node.consequence}</p></section>
                </div>
              </div>
              <footer>
                <div className="problem-participants"><span>在这里思考的人</span><div>{node.participants.length > 0 ? node.participants.map((participant) => {
                  const profile = participant.philosopherId ? philosopherProfiles.find((item) => item.id === participant.philosopherId) : undefined;
                  return participant.philosopherId && profile
                    ? <button key={`${node.id}-${participant.name}`} onClick={() => onPhilosopher(participant.philosopherId!)}><b>{participant.name}</b>{showEnglish && <small>{profile.nameEn}</small>}<em>{participant.role}</em><i aria-hidden="true">↗</i></button>
                    : <span className="problem-participant-pending" key={`${node.id}-${participant.name}`}><b>{participant.name}</b><em>{participant.role}</em><small>人物页待补</small></span>;
                }) : <p>这一节点是本站为组织阅读而建立的共同起点，不归属于单一哲学家。</p>}</div></div>
                <div className="problem-chapter-links"><span>回到原书</span><div>{node.chapterIds.map((id) => { const chapter = chapters.find((item) => item.id === id); return chapter ? <button key={`${node.id}-${id}`} onClick={() => onChapter(id)}><small>{chapter.roman}</small><b>{chapter.title}</b></button> : null; })}</div></div>
              </footer>
            </article>
          </div>)}
        </div>
      </section>)}
    </div>

    <section className="problem-map-sources">
      <header><p className="section-label">SOURCES & RECONSTRUCTION</p><h3>原书骨架、现代校正与本站推演分开保存</h3></header>
      <div>{map.sources.map((source) => source.url
        ? <a href={source.url} target="_blank" rel="noreferrer" key={source.label}><b>{source.label}</b><p>{source.note}</p><span>打开来源 ↗</span></a>
        : <article key={source.label}><b>{source.label}</b><p>{source.note}</p><span>项目内原书</span></article>)}</div>
    </section>
  </article>;
}
