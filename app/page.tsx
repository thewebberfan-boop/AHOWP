"use client";

import { createContext, useContext, useEffect, useMemo, useState, type SyntheticEvent } from "react";
import { bookLabels, chapters, notes, type BookKey } from "./book-data";
import { figureEntries, figuresForChapter, type FigureEntry } from "./figure-data";
import { geographyByAlias, geographyEntries, geographyMatchers, type GeographyEntry } from "./geography-data";
import { historyStages, longLinks, methodAtlas, stageDetailPanels, type DetailNode, type HistoryStage, type ResponseNode } from "./history-data";
import { philosopherProfiles, type PhilosopherProfile } from "./philosopher-data";
import { russellStructureStages, type RussellStructureStage } from "./russell-structure-data";
import { terminology, terminologyByZh, terminologyMatchers, type TermEntry } from "./terminology-data";

type Mode = "structure" | "philosophers" | "history" | "methods" | "chapters" | "review";
type ChapterOrigin = {
  mode: Exclude<Mode, "chapters">;
  structureStageId: string;
  philosopherId: string;
  stageId: string;
  responseId: string;
  methodId: string;
  reviewIndex: number;
  label: string;
};
type SearchResult =
  | { kind: "stage"; id: string; title: string; meta: string }
  | { kind: "response"; id: string; stageId: string; title: string; meta: string }
  | { kind: "philosopher"; id: string; title: string; meta: string }
  | { kind: "method"; id: string; title: string; meta: string }
  | { kind: "chapter"; id: string; title: string; meta: string }
  | { kind: "place"; id: string; title: string; meta: string }
  | { kind: "term"; id: string; title: string; meta: string };

const bookOrder: BookKey[] = ["ancient", "catholic", "modern"];
const bookNumber: Record<BookKey, string> = { ancient: "第一卷", catholic: "第二卷", modern: "第三卷" };
const relationNames = { condition: "历史条件", response: "回应", inherit: "继承", oppose: "分歧", transmit: "传播", exception: "跨层例外" };
const inlineMatchers = [...new Set([...terminologyMatchers, ...geographyMatchers])].sort((a, b) => b.length - a.length);
const inlinePattern = new RegExp(`(${inlineMatchers.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g");
const PlaceInteractionContext = createContext<((place: GeographyEntry) => void) | null>(null);

type StructureDetailPanel = { events: DetailNode[]; problems: DetailNode[] };

const pickDetailNodes = (panelId: string, group: keyof StructureDetailPanel, ids: string[]) => {
  const nodes = stageDetailPanels[panelId]?.[group] || [];
  return ids.map((id) => nodes.find((node) => node.id === id)).filter((node): node is DetailNode => Boolean(node));
};

const structureDetailPanels: Record<string, StructureDetailPanel> = {
  "greek-origins": stageDetailPanels.origins,
  "classical-athens": stageDetailPanels.athens,
  "hellenistic-roman": {
    events: [
      ...pickDetailNodes("hellenistic", "events", ["alexander", "roman-expansion"]),
      ...pickDetailNodes("roman", "events", ["third-century-crisis"]),
    ],
    problems: [
      ...pickDetailNodes("hellenistic", "problems", ["inner-freedom", "tranquility-certainty"]),
      ...pickDetailNodes("roman", "problems", ["higher-reality"]),
    ],
  },
  "early-christianity": stageDetailPanels.patristic,
  "medieval-scholasticism": {
    events: [
      ...pickDetailNodes("early-medieval", "events", ["islamic-expansion"]),
      ...pickDetailNodes("scholastic", "events", ["universities", "papal-decline"]),
    ],
    problems: [
      ...pickDetailNodes("scholastic", "problems", ["faith-reason", "universal-individual"]),
      ...pickDetailNodes("early-medieval", "problems", ["two-powers"]),
    ],
  },
  "renaissance-science": stageDetailPanels["renaissance-science"],
  "reason-empiricism": stageDetailPanels["early-modern"],
  "romantic-idealism": stageDetailPanels["revolution-idealism"],
  "industrial-modern": stageDetailPanels["industrial-modern"],
};

function loadSet(key: string) {
  try { return new Set<string>(JSON.parse(localStorage.getItem(key) || "[]")); }
  catch { return new Set<string>(); }
}

function loadPreference(key: string, fallback: boolean) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : value === "true";
  } catch {
    return fallback;
  }
}

function saveLocalValue(key: string, value: string) {
  try { localStorage.setItem(key, value); }
  catch { /* Some browsers restrict storage for file:// pages. */ }
}

function includesText(parts: Array<string | undefined>, needle: string) {
  return parts.filter(Boolean).join(" ").toLowerCase().includes(needle);
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("structure");
  const [structureStageId, setStructureStageId] = useState("hellenistic-roman");
  const [philosopherId, setPhilosopherId] = useState("thales");
  const [stageId, setStageId] = useState("hellenistic");
  const [responseId, setResponseId] = useState("epicureans");
  const [methodId, setMethodId] = useState("therapy");
  const [chapterId, setChapterId] = useState("b1-28");
  const [query, setQuery] = useState("");
  const [bookFilter, setBookFilter] = useState<BookKey | "all">("all");
  const [reviewedStages, setReviewedStages] = useState<Set<string>>(new Set());
  const [starredChapters, setStarredChapters] = useState<Set<string>>(new Set());
  const [reviewIndex, setReviewIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [copied, setCopied] = useState(false);
  const [chapterOrigin, setChapterOrigin] = useState<ChapterOrigin | null>(null);
  const [showEnglishTerms, setShowEnglishTerms] = useState(true);
  const [activeTerm, setActiveTerm] = useState<TermEntry | null>(null);
  const [activePlace, setActivePlace] = useState<GeographyEntry | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setReviewedStages(loadSet("ahowp-stage-reviewed"));
      setStarredChapters(loadSet("ahowp-starred"));
      setShowEnglishTerms(loadPreference("ahowp-bilingual-terms", true));
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const selectedStage = historyStages.find((stage) => stage.id === stageId) || historyStages[0];
  const selectedStructureStage = russellStructureStages.find((stage) => stage.id === structureStageId) || russellStructureStages[0];
  const selectedPhilosopher = philosopherProfiles.find((profile) => profile.id === philosopherId) || philosopherProfiles[0];
  const selectedResponse = selectedStage.responses.find((response) => response.id === responseId) || selectedStage.responses[0];
  const selectedMethod = methodAtlas.find((method) => method.id === methodId) || methodAtlas[0];
  const selectedChapter = chapters.find((chapter) => chapter.id === chapterId) || chapters[0];
  const selectedNote = notes[selectedChapter.id];
  const reviewStage = historyStages[reviewIndex % historyStages.length];

  const searchResults = useMemo<SearchResult[]>(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return [];
    const results: SearchResult[] = [];
    historyStages.forEach((stage) => {
      if (includesText([stage.title, stage.subtitle, stage.years, stage.transition, stage.commonQuestion, ...stage.world, ...stage.legacy], needle)) results.push({ kind: "stage", id: stage.id, title: stage.title, meta: `${stage.years} · 历史阶段` });
      stage.responses.forEach((response) => {
        if (includesText([response.title, response.figures, response.region, response.answer, response.method, response.difference, response.noteCue], needle)) results.push({ kind: "response", id: response.id, stageId: stage.id, title: response.title, meta: `${response.figures} · 思想回应` });
      });
    });
    philosopherProfiles.forEach((profile) => {
      if (includesText([
        profile.nameZh, profile.nameEn, profile.greekName, profile.dates, profile.active, profile.school, profile.thesis,
        profile.lifeSummary, profile.russellView, profile.modernCorrection, ...profile.places,
        ...profile.concepts.flatMap((concept) => [concept.zh, concept.en, concept.definition]),
        ...profile.inquiries.flatMap((inquiry) => [inquiry.object, inquiry.question, inquiry.start, inquiry.conclusion, ...inquiry.steps]),
      ], needle)) results.push({ kind: "philosopher", id: profile.id, title: profile.nameZh, meta: `${profile.nameEn} · ${profile.school}` });
    });
    methodAtlas.forEach((method) => {
      if (includesText([method.title, method.rule, ...method.uses], needle)) results.push({ kind: "method", id: method.id, title: method.title, meta: `${method.uses.join("、")} · 通用方法` });
    });
    chapters.forEach((chapter) => {
      const note = notes[chapter.id];
      if (includesText([chapter.title, chapter.english, chapter.part, ...chapter.themes, note?.summary, ...(note?.keyPoints || [])], needle)) results.push({ kind: "chapter", id: chapter.id, title: chapter.title, meta: `${bookNumber[chapter.book]} · 第 ${chapter.roman} 章` });
    });
    terminology.forEach((term) => {
      if (term.category === "地名") return;
      if (includesText([term.zh, term.en, term.note, ...(term.alternatives || [])], needle)) results.push({ kind: "term", id: term.id, title: `${term.zh} · ${term.en}`, meta: `${term.category} · 双语术语` });
    });
    geographyEntries.forEach((place) => {
      if (includesText([place.nameZh, place.nameEn, place.modernLocation, ...place.historicalContexts.flatMap((context) => [context.period, context.ancientOrPeriodName, context.politicalContext, context.note])], needle)) results.push({ kind: "place", id: place.id, title: `${place.nameZh} · ${place.nameEn}`, meta: `${place.modernLocation} · 地点地图` });
    });
    return results.slice(0, 40);
  }, [query]);

  const filteredChapters = useMemo(() => chapters.filter((chapter) => bookFilter === "all" || chapter.book === bookFilter), [bookFilter]);

  const persistSet = (key: string, value: Set<string>, setter: (value: Set<string>) => void) => {
    setter(value);
    saveLocalValue(key, JSON.stringify([...value]));
  };

  const toggleSet = (id: string, current: Set<string>, key: string, setter: (value: Set<string>) => void) => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    persistSet(key, next, setter);
  };

  const openStage = (id: string, preferredResponse?: string) => {
    const stage = historyStages.find((item) => item.id === id) || historyStages[0];
    setStageId(stage.id);
    setResponseId(preferredResponse && stage.responses.some((item) => item.id === preferredResponse) ? preferredResponse : stage.responses[0].id);
    setMode("history");
    setQuery("");
    setCopied(false);
  };

  const openStructureStage = (id: string) => {
    setStructureStageId(id);
    setMode("structure");
    setQuery("");
    setCopied(false);
  };

  const openPhilosopher = (id: string) => {
    setPhilosopherId(id);
    setMode("philosophers");
    setQuery("");
    setCopied(false);
  };

  const openChapter = (id: string) => {
    if (mode !== "chapters") {
      const label = mode === "structure"
        ? `原书结构 · ${selectedStructureStage.title}`
        : mode === "philosophers"
          ? `哲学家 · ${selectedPhilosopher.nameZh}`
        : mode === "history"
        ? `${selectedStage.title} · ${selectedResponse.title}`
        : mode === "methods"
          ? `方法图谱 · ${selectedMethod.title}`
          : `关系复习 · ${reviewStage.title}`;
      setChapterOrigin({ mode, structureStageId, philosopherId, stageId, responseId, methodId, reviewIndex, label });
    }
    setChapterId(id);
    setMode("chapters");
    setQuery("");
    setCopied(false);
  };

  const returnFromChapter = () => {
    if (!chapterOrigin) {
      setMode("structure");
      return;
    }
    setStructureStageId(chapterOrigin.structureStageId);
    setPhilosopherId(chapterOrigin.philosopherId);
    setStageId(chapterOrigin.stageId);
    setResponseId(chapterOrigin.responseId);
    setMethodId(chapterOrigin.methodId);
    setReviewIndex(chapterOrigin.reviewIndex);
    setMode(chapterOrigin.mode);
    setQuery("");
    setCopied(false);
  };

  const openSearchResult = (result: SearchResult) => {
    if (result.kind === "stage") openStage(result.id);
    if (result.kind === "response") openStage(result.stageId, result.id);
    if (result.kind === "philosopher") openPhilosopher(result.id);
    if (result.kind === "method") { setMethodId(result.id); setMode("methods"); setQuery(""); }
    if (result.kind === "chapter") openChapter(result.id);
    if (result.kind === "place") { setActivePlace(geographyEntries.find((place) => place.id === result.id) || null); setQuery(""); }
    if (result.kind === "term") { setActiveTerm(terminology.find((term) => term.id === result.id) || null); setQuery(""); }
  };

  const toggleEnglishTerms = () => {
    const next = !showEnglishTerms;
    setShowEnglishTerms(next);
    saveLocalValue("ahowp-bilingual-terms", String(next));
  };

  const showStructureSidebar = mode === "structure" && !query;
  const showPhilosopherSidebar = mode === "philosophers" && !query;
  const showStageSidebar = mode !== "chapters" && mode !== "structure" && mode !== "philosophers" && !query;

  return (
    <PlaceInteractionContext.Provider value={setActivePlace}>
    <main className="app-shell">
      <aside className="sidebar">
        <div className="identity"><div className="brand-mark" aria-hidden="true">AH</div><div><p className="eyebrow">BERTRAND RUSSELL</p><h1>西方哲学史</h1><p className="subtitle">历史关系学习地图</p></div></div>
        <label className="search-box"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="搜索全站" placeholder="搜索人物、时代、方法或章节…" />{query && <button type="button" aria-label="清空搜索" onClick={() => setQuery("")}>×</button>}</label>

        {mode === "chapters" && !query && <div className="book-filters" aria-label="按卷筛选"><button className={bookFilter === "all" ? "active" : ""} onClick={() => setBookFilter("all")}>全部</button><button className={bookFilter === "ancient" ? "active" : ""} onClick={() => setBookFilter("ancient")}>古代</button><button className={bookFilter === "catholic" ? "active" : ""} onClick={() => setBookFilter("catholic")}>中世纪</button><button className={bookFilter === "modern" ? "active" : ""} onClick={() => setBookFilter("modern")}>近现代</button></div>}

        <div className="sidebar-scroll">
          {query ? <div className="search-results"><div className="results-label"><span>跨层搜索</span><b>{searchResults.length}</b></div>{!searchResults.length && <div className="empty-result">没有匹配内容。试试“自由”“freedom”“帝国”或“Kant”。</div>}{searchResults.map((result) => <button className="search-result" key={`${result.kind}-${result.id}`} onClick={() => openSearchResult(result)}><span>{result.kind === "stage" ? "阶段" : result.kind === "response" ? "回应" : result.kind === "philosopher" ? "哲学家" : result.kind === "method" ? "方法" : result.kind === "term" ? "术语" : result.kind === "place" ? "地点" : "章节"}</span><b>{result.title}</b><small>{result.meta}</small></button>)}</div>
          : showStructureSidebar ? <nav className="structure-nav" aria-label="基于罗素目录重构的历史阶段"><div className="results-label"><span>第一层 · 历史阶段</span><b>{russellStructureStages.length}</b></div><div className="structure-notice">学习重构 · 章节依据罗素原目录</div>{russellStructureStages.map((stage, index) => <button className={stage.id === structureStageId ? "stage-link active" : "stage-link"} key={stage.id} onClick={() => openStructureStage(stage.id)}><span className="stage-index">{String(index + 1).padStart(2, "0")}</span><span><small>{stage.years}</small><b>{stage.title}</b><em>{stage.russellRange}</em></span><i>{stage.schools.length} 流派</i></button>)}</nav>
          : showPhilosopherSidebar ? <nav className="philosopher-nav" aria-label="哲学家索引"><div className="results-label"><span>人物页面 · 第一批</span><b>{philosopherProfiles.length}</b></div><div className="structure-notice">依原书出现顺序 · 证据分层整理</div>{philosopherProfiles.map((profile) => { const figure = figureEntries.find((item) => item.id === profile.figureId); return <button className={profile.id === philosopherId ? "philosopher-link active" : "philosopher-link"} key={profile.id} onClick={() => openPhilosopher(profile.id)}>{figure ? <img src={figure.imagePath} alt="" /> : <span className="philosopher-link-monogram">{profile.nameZh.slice(0, 1)}</span>}<span><small>{String(profile.order).padStart(2, "0")} · {profile.dates}</small><b>{profile.nameZh}</b><em>{profile.nameEn}</em></span><i>{profile.school}</i></button>; })}</nav>
          : showStageSidebar ? <nav className="stage-nav" aria-label="历史概览阶段"><div className="results-label"><span>辅助视图 · 历史概览</span><b>{historyStages.length}</b></div>{historyStages.map((stage, index) => <button className={stage.id === stageId ? "stage-link active" : "stage-link"} key={stage.id} onClick={() => openStage(stage.id)}><span className="stage-index">{String(index + 1).padStart(2, "0")}</span><span><small>{stage.years}</small><b>{stage.title}</b><em>{stage.transition}</em></span><i>{stage.coverage === "personal" ? "笔记" : "原书"}</i></button>)}</nav>
          : <div className="chapter-list" aria-label="全书章节"><div className="results-label"><span>原书目录</span><b>{filteredChapters.length}</b></div>{bookOrder.map((book) => { const items = filteredChapters.filter((chapter) => chapter.book === book); if (!items.length) return null; return <section key={book} className="chapter-group"><p className="group-title">{bookNumber[book]} · {bookLabels[book].title}</p>{items.map((chapter) => { const chapterFigures = figuresForChapter(chapter.title); return <button className={`${chapter.id === selectedChapter.id ? "chapter-link active" : "chapter-link"}${chapterFigures.length ? " has-portrait" : ""}`} key={chapter.id} onClick={() => openChapter(chapter.id)}>{chapterFigures.length > 0 && <span className="chapter-thumbnails" aria-hidden="true">{chapterFigures.slice(0, 2).map((figure) => <img key={figure.id} src={figure.imagePath} alt="" />)}</span>}<span className="chapter-roman">{chapter.roman}</span><span className="chapter-name">{chapter.title}<small>{chapter.english}</small></span><span className="chapter-status">{starredChapters.has(chapter.id) ? "★" : notes[chapter.id] ? "●" : ""}</span></button>; })}</section>; })}</div>}
        </div>
        <div className="sidebar-footer"><span>骨架：罗素目录＋历史</span><span>阶段 → 流派 → 人物 → 章节</span></div>
      </aside>

      <section className="reading-pane">
        <header className="topbar"><nav className="mode-tabs" aria-label="学习视图"><button className={mode === "structure" ? "active" : ""} onClick={() => setMode("structure")}>原书结构</button><button className={mode === "philosophers" ? "active" : ""} onClick={() => setMode("philosophers")}>哲学家</button><button className={mode === "history" ? "active" : ""} onClick={() => setMode("history")}>历史概览</button><button className={mode === "methods" ? "active" : ""} onClick={() => setMode("methods")}>方法图谱</button><button className={mode === "chapters" ? "active" : ""} onClick={() => { setChapterOrigin(null); setMode("chapters"); }}>原书索引</button><button className={mode === "review" ? "active" : ""} onClick={() => setMode("review")}>关系复习</button></nav><div className="topbar-tools"><span className="zoom-path">全书 <i>›</i> {mode === "structure" ? selectedStructureStage.title : mode === "philosophers" ? selectedPhilosopher.nameZh : mode === "history" ? selectedStage.title : mode === "methods" ? selectedMethod.title : mode === "chapters" ? selectedChapter.title : "主动回忆"}</span><button className={showEnglishTerms ? "language-toggle active" : "language-toggle"} onClick={toggleEnglishTerms} aria-pressed={showEnglishTerms}><span>术语</span><b>{showEnglishTerms ? "中英" : "中文"}</b></button></div></header>
        {mode === "structure" && <RussellStructureView key={selectedStructureStage.id} stage={selectedStructureStage} onStage={openStructureStage} onChapter={openChapter} showEnglish={showEnglishTerms} onTerm={setActiveTerm} />}
        {mode === "philosophers" && <PhilosopherView profile={selectedPhilosopher} onPhilosopher={openPhilosopher} onChapter={openChapter} showEnglish={showEnglishTerms} onTerm={setActiveTerm} />}
        {mode === "history" && <HistoryView key={selectedStage.id} stage={selectedStage} response={selectedResponse} onStage={openStage} onResponse={setResponseId} onChapter={openChapter} showEnglish={showEnglishTerms} onTerm={setActiveTerm} />}
        {mode === "methods" && <MethodsView method={selectedMethod} onMethod={setMethodId} onStage={openStage} showEnglish={showEnglishTerms} onTerm={setActiveTerm} />}
        {mode === "chapters" && <ChapterView chapter={selectedChapter} note={selectedNote} starred={starredChapters.has(selectedChapter.id)} onStar={() => toggleSet(selectedChapter.id, starredChapters, "ahowp-starred", setStarredChapters)} copied={copied} onCopy={async () => { await navigator.clipboard?.writeText(`《西方哲学史》PDF 第 ${selectedChapter.pdfPage} 页`); setCopied(true); }} onTheme={(theme) => setQuery(theme)} originLabel={chapterOrigin?.label} onBack={returnFromChapter} showEnglish={showEnglishTerms} onTerm={setActiveTerm} />}
        {mode === "review" && <ReviewView stage={reviewStage} index={reviewIndex} flipped={flipped} reviewed={reviewedStages.has(reviewStage.id)} onFlip={() => setFlipped(!flipped)} onOpen={() => openStage(reviewStage.id)} onNext={() => { const next = new Set(reviewedStages).add(reviewStage.id); persistSet("ahowp-stage-reviewed", next, setReviewedStages); setReviewIndex((value) => (value + 1) % historyStages.length); setFlipped(false); }} showEnglish={showEnglishTerms} onTerm={setActiveTerm} />}
      </section>
      {activeTerm && <TermModal term={activeTerm} onClose={() => setActiveTerm(null)} />}
      {activePlace && <PlaceModal place={activePlace} onClose={() => setActivePlace(null)} />}
    </main>
    </PlaceInteractionContext.Provider>
  );
}

function PhilosopherView({ profile, onPhilosopher, onChapter, showEnglish, onTerm }: { profile: PhilosopherProfile; onPhilosopher: (id: string) => void; onChapter: (id: string) => void; showEnglish: boolean; onTerm: (term: TermEntry) => void }) {
  const figure = figureEntries.find((item) => item.id === profile.figureId);
  const termText = (text: string) => <TermText text={text} showEnglish={showEnglish} onTerm={onTerm} />;

  return <article className="philosopher-page page-wrap">
    <nav className="philosopher-sequence" aria-label="切换哲学家">{philosopherProfiles.map((item) => <button className={item.id === profile.id ? "active" : ""} key={item.id} onClick={() => onPhilosopher(item.id)}><span>{String(item.order).padStart(2, "0")}</span><b>{item.nameZh}</b></button>)}</nav>

    <header className="profile-hero">
      <div className="profile-portrait">{figure ? <a href={figure.sourcePage} target="_blank" rel="noreferrer" title="查看图像来源"><img src={figure.imagePath} alt={`${profile.nameZh}的后世画像或代表性图像`} /></a> : <span>{profile.nameZh.slice(0, 1)}</span>}<small>古代人物图像仅作视觉识别，不是写实肖像</small></div>
      <div className="profile-title"><p className="eyebrow">PHILOSOPHER {String(profile.order).padStart(2, "0")} · {profile.school}</p><h2><TermText text={profile.nameZh} showEnglish={false} onTerm={onTerm} /></h2><p className="profile-name-line"><span>{profile.nameEn}</span><i>{profile.greekName}</i></p><blockquote>{termText(profile.thesis)}</blockquote></div>
      <aside className="profile-facts"><div><span>生卒年</span><b>{profile.dates}</b></div><div><span>主要活动期</span><b>{profile.active}</b></div><div><span>地点</span><b>{termText(profile.places.join(" · "))}</b></div><div><span>流派</span><b>{termText(profile.school)}</b></div></aside>
    </header>

    <aside className="evidence-caution"><span>证据边界</span><p>{termText(profile.evidenceCaution)}</p></aside>
    <nav className="profile-local-nav" aria-label="本页内容"><a href="#profile-life">生平</a><a href="#profile-inquiry">问题与推导</a><a href="#profile-concepts">概念</a><a href="#profile-relations">关系与比较</a><a href="#profile-russell">罗素与校正</a></nav>

    <section className="profile-section life-section" id="profile-life">
      <header><span>01</span><div><p className="section-label">LIFE IN HISTORY</p><h3>生平与历史位置</h3></div></header>
      <div className="life-layout"><p className="profile-prose">{termText(profile.lifeSummary)}</p><div className="profile-timeline">{profile.timeline.map((item) => <article key={`${item.date}-${item.title}`}><div><b>{item.date}</b><span className={`certainty certainty-${item.certainty}`}>{item.certainty}</span></div><div><small>{termText(item.place)}</small><h4>{termText(item.title)}</h4><p>{termText(item.detail)}</p></div></article>)}</div></div>
    </section>

    <section className="profile-section inquiry-section" id="profile-inquiry">
      <header><span>02</span><div><p className="section-label">OBJECT → QUESTION → INFERENCE</p><h3>研究对象与推导路径</h3></div></header>
      <div className="inquiry-list">{profile.inquiries.map((inquiry, inquiryIndex) => <article className="inquiry-card" key={inquiry.object}><header><span>{String(inquiryIndex + 1).padStart(2, "0")}</span><div><small>研究对象 · {termText(inquiry.object)}</small><h4>{termText(inquiry.question)}</h4></div></header><div className="logic-start"><span>逻辑起点</span><p>{termText(inquiry.start)}</p></div><div className="logic-chain">{inquiry.steps.map((step, index) => <div key={step}><span>{index + 1}</span><p>{termText(step)}</p>{index < inquiry.steps.length - 1 && <i aria-hidden="true">→</i>}</div>)}</div><div className="logic-conclusion"><span>推导结果</span><p>{termText(inquiry.conclusion)}</p></div></article>)}</div>
    </section>

    <section className="profile-section concept-section" id="profile-concepts">
      <header><span>03</span><div><p className="section-label">CONCEPT SYSTEM</p><h3>概念不是词表，而是推导节点</h3></div></header>
      <div className="profile-concept-grid">{profile.concepts.map((concept, index) => <article key={concept.zh}><span>{String(index + 1).padStart(2, "0")}</span><h4><TermText text={concept.zh} showEnglish={false} onTerm={onTerm} /></h4>{showEnglish && <small>{concept.en}</small>}<p>{termText(concept.definition)}</p></article>)}</div>
    </section>

    <section className="profile-section relation-profile-section" id="profile-relations">
      <header><span>04</span><div><p className="section-label">LINEAGE & PARALLELS</p><h3>流派、影响与同题比较</h3></div></header>
      <div className="lineage-grid"><article><span>思想来源</span><p>{termText(profile.lineage.inherited)}</p></article><article><span>流派位置</span><p>{termText(profile.lineage.school)}</p></article><article><span>影响去向</span><p>{termText(profile.lineage.influenced)}</p></article><article><span>非影响关系</span><p>{termText(profile.lineage.parallel)}</p></article></div>
      <div className="comparison-board"><div className="comparison-heading"><span>比较对象</span><span>关系性质</span><span>共同问题或结构</span><span>关键差异</span></div>{profile.comparisons.map((comparison) => <article key={`${comparison.target}-${comparison.relation}`}><h4>{termText(comparison.target)}</h4><span className={`relation-badge relation-${comparison.relation}`}>{comparison.relation}</span><p>{termText(comparison.shared)}</p><p>{termText(comparison.difference)}</p></article>)}</div>
    </section>

    <section className="profile-section russell-profile-section" id="profile-russell">
      <header><span>05</span><div><p className="section-label">RUSSELL AS GUIDE, NOT FINAL VERDICT</p><h3>罗素的解释与现代校正</h3></div></header>
      <div className="russell-correction"><article><span>罗素怎样组织这个人物</span><p>{termText(profile.russellView)}</p></article><article><span>需要补充或修正什么</span><p>{termText(profile.modernCorrection)}</p></article></div>
      <div className="profile-sources"><div><p className="section-label">来源与继续阅读</p><small>原书是叙述主轴；补充资料用于年代、证据边界与现代解释。</small></div><div>{profile.sources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.label}><span>{source.kind}</span><b>{source.label}</b><i aria-hidden="true">↗</i></a>)}</div></div>
      <div className="profile-chapters"><div><p className="section-label">回到原书章节</p><small>人物页负责重组；章节页保留罗素原书顺序。</small></div><div>{profile.chapterIds.map((id) => { const chapter = chapters.find((item) => item.id === id); return chapter ? <button key={id} onClick={() => onChapter(id)}><span>{bookNumber[chapter.book]} · {chapter.roman}</span><b>{termText(chapter.title)}</b><i aria-hidden="true">→</i></button> : null; })}</div></div>
    </section>
  </article>;
}

function RussellStructureView({ stage, onStage, onChapter, showEnglish, onTerm }: { stage: RussellStructureStage; onStage: (id: string) => void; onChapter: (id: string) => void; showEnglish: boolean; onTerm: (term: TermEntry) => void }) {
  const [schoolId, setSchoolId] = useState(stage.schools[0]?.id || "");
  const [activeDetail, setActiveDetail] = useState<DetailNode | null>(null);
  const stageIndex = russellStructureStages.findIndex((item) => item.id === stage.id);
  const school = stage.schools.find((item) => item.id === schoolId) || stage.schools[0]!;
  const details = structureDetailPanels[stage.id];
  const termText = (text: string) => <TermText text={text} showEnglish={showEnglish} onTerm={onTerm} />;

  useEffect(() => {
    if (!activeDetail) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setActiveDetail(null); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [activeDetail]);

  const chapterLink = (id: string) => {
    const chapter = chapters.find((item) => item.id === id);
    if (!chapter) return null;
    return <button className="structure-chapter-link" key={id} onClick={() => onChapter(id)}><span>{bookNumber[chapter.book]} · {chapter.roman}</span><b>{termText(chapter.title)}</b><i aria-hidden="true">→</i></button>;
  };

  return <article className="structure-page page-wrap">
    <header className="structure-hero">
      <div className="structure-level"><span>01</span><b>历史阶段</b></div>
      <div><p className="eyebrow">基于罗素目录的学习重构 · RUSSELL-BASED STRUCTURE</p><h2>{termText(stage.title)}</h2><p className="structure-years">{stage.years}</p><p className="structure-condition">{termText(stage.condition)}</p></div>
      <aside><span>原书依据</span><b>{stage.russellRange}</b><small>阶段名称与层级关系为学习重构，不是罗素的原始分期。</small></aside>
    </header>

    <nav className="structure-timeline" aria-label="切换历史阶段">{russellStructureStages.map((item, index) => <button className={item.id === stage.id ? "active" : ""} key={item.id} onClick={() => onStage(item.id)}><span>{String(index + 1).padStart(2, "0")}</span><small>{item.title}</small></button>)}</nav>

    <section className="problem-field">
      <div className="structure-section-heading"><div><p className="section-label">01 · 历史事件与问题</p><h3>先看同一个世界</h3></div><p>左侧先确定改变共同处境的事件，右侧再看这些变化把什么问题推到哲学面前；下一层的流派，是对这个问题场形成的不同回应。</p></div>
      <div className="dual-list-grid structure-context-grid">
        <div className="context-list event-list"><header><span>HISTORY</span><h3>关键历史事件</h3><p>先确定发生了什么</p></header>{details.events.map((item, index) => <button key={item.id} onClick={() => setActiveDetail(item)} aria-haspopup="dialog"><span className="node-number">0{index + 1}</span><span className="node-copy"><small>{item.marker}</small><b><TermText text={item.title} showEnglish={showEnglish} onTerm={onTerm} /></b></span><i aria-hidden="true">＋</i></button>)}</div>
        <div className="context-list problem-list"><header><span>QUESTIONS</span><h3>时代提出的问题</h3><p>再看这些变化迫使人追问什么</p></header>{details.problems.map((item, index) => <button key={item.id} onClick={() => setActiveDetail(item)} aria-haspopup="dialog"><span className="node-number">0{index + 1}</span><span className="node-copy"><small>{item.marker}</small><b><TermText text={item.title} showEnglish={showEnglish} onTerm={onTerm} /></b></span><i aria-hidden="true">＋</i></button>)}</div>
      </div>
      <div className="context-chapters"><p><span>原书中的历史／背景章节</span><small>{stage.contextChapterIds.length ? `${stage.contextChapterIds.length} 章` : "本阶段由相邻章节共同提供背景"}</small></p>{stage.contextChapterIds.length > 0 && <div>{stage.contextChapterIds.map(chapterLink)}</div>}</div>
    </section>

    <section className="schools-layer">
      <div className="structure-section-heading"><div><p className="section-label">02 · 哲学流派</p><h3>哪些回应方式稳定为传统？</h3></div><p>流派不是问题的来源，而是共享前提、方法、概念或生活方案的传承关系。</p></div>
      <nav className="school-tabs" aria-label="本阶段的哲学流派">{stage.schools.map((item, index) => <button role="tab" aria-selected={item.id === school.id} className={item.id === school.id ? "active" : ""} key={item.id} onClick={() => setSchoolId(item.id)}><span>{String(index + 1).padStart(2, "0")}</span><b><TermText text={item.title} showEnglish={false} onTerm={onTerm} /></b>{showEnglish && <small>{item.english}</small>}</button>)}</nav>

      <section className="school-panel" role="tabpanel">
        <header><div><p className="eyebrow">SCHOOL / TRADITION</p><h3><TermText text={school.title} showEnglish={false} onTerm={onTerm} /></h3>{showEnglish && <p>{school.english}</p>}</div><span>{school.philosophers.length} 位人物节点</span></header>
        <div className="school-logic"><div><span>对时代问题的回应</span><p>{termText(school.response)}</p></div><div><span>得以传承的共同方式</span><p>{termText(school.sharedPattern)}</p></div></div>
        {school.chapterIds.length > 0 && <div className="school-source-chapters"><p className="section-label">罗素直接以流派或传统命名的章节</p><div>{school.chapterIds.map(chapterLink)}</div></div>}

        <div className="philosopher-layer"><div className="philosopher-layer-title"><span>03</span><div><p className="section-label">哲学家</p><h4>同一回应方式的具体版本</h4></div></div>{school.philosophers.length > 0 ? <div className="philosopher-grid">{school.philosophers.map((philosopher) => {
          const figure = figureEntries.find((item) => item.id === philosopher.figureId);
          return <article className="philosopher-node" key={philosopher.id}><div className="philosopher-portrait">{figure ? <a href={figure.sourcePage} target="_blank" rel="noreferrer" title="查看图像来源"><img src={figure.imagePath} alt={`${philosopher.nameZh}的历史画像或代表性图像`} /></a> : <span aria-hidden="true">{philosopher.nameZh.slice(0, 1)}</span>}</div><div className="philosopher-copy"><h5><TermText text={philosopher.nameZh} showEnglish={false} onTerm={onTerm} /></h5>{showEnglish && <p className="philosopher-english">{philosopher.nameEn}</p>}<p>{termText(philosopher.relation)}</p></div><div className="philosopher-chapters">{philosopher.chapterIds.length > 0 ? philosopher.chapterIds.map(chapterLink) : <small>人物线索收录在本流派章节中</small>}</div></article>;
        })}</div> : <div className="school-only-note"><span>流派型章节</span><p>罗素在这里以共同传统为叙述单位，没有另设单独的哲学家章节。</p></div>}</div>
      </section>
    </section>

    <footer className="structure-legend"><span><i>01</i>历史事件与时代问题</span><b>→</b><span><i>02</i>流派的共享回应</span><b>→</b><span><i>03</i>哲学家的具体版本</span><b>→</b><span><i>04</i>原书章节与论证</span><em>{stageIndex + 1} / {russellStructureStages.length}</em></footer>
    {activeDetail && <div className="detail-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveDetail(null); }}><section className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="structure-detail-modal-title"><button className="modal-close" aria-label="关闭详情" onClick={() => setActiveDetail(null)}>×</button><p className="eyebrow">{activeDetail.marker}</p><h3 id="structure-detail-modal-title"><TermText text={activeDetail.title} showEnglish={showEnglish} onTerm={onTerm} /></h3><p><TermText text={activeDetail.detail} showEnglish={showEnglish} onTerm={onTerm} /></p><button className="modal-done" onClick={() => setActiveDetail(null)}>读完，回到原书结构</button></section></div>}
  </article>;
}

function HistoryView({ stage, response, onStage, onResponse, onChapter, showEnglish, onTerm }: { stage: HistoryStage; response: ResponseNode; onStage: (id: string) => void; onResponse: (id: string) => void; onChapter: (id: string) => void; showEnglish: boolean; onTerm: (term: TermEntry) => void }) {
  const stageIndex = historyStages.findIndex((item) => item.id === stage.id);
  const linkStart = Math.min(Math.max(0, stageIndex - 1), longLinks.length - 3);
  const details = stageDetailPanels[stage.id];
  const [activeDetail, setActiveDetail] = useState<DetailNode | null>(null);

  useEffect(() => {
    if (!activeDetail) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setActiveDetail(null); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [activeDetail]);

  return <article className="history-page page-wrap">
    <header className="history-hero"><div className="hero-number"><span>{String(stageIndex + 1).padStart(2, "0")}</span><i /></div><div><p className="eyebrow">{stage.years} · {stage.subtitle}</p><h2><TermText text={stage.title} showEnglish={showEnglish} onTerm={onTerm} /></h2><p className="transition"><TermText text={stage.transition} showEnglish={showEnglish} onTerm={onTerm} /></p></div><div className="coverage-tag"><span>{stage.coverage === "personal" ? "个人笔记已覆盖" : "原书框架"}</span><small>{stage.responses.length} 种同期回应</small></div></header>
    <nav className="timeline" aria-label="全部历史阶段">{historyStages.map((item, index) => <button className={item.id === stage.id ? "active" : ""} key={item.id} onClick={() => onStage(item.id)} aria-label={`${item.years} ${item.title}`}><span>{index + 1}</span><small>{item.years}</small></button>)}</nav>
    <section className="world-section">
      <p className="section-label">01 · 先看同一个世界</p>
      <div className="dual-list-grid">
        <div className="context-list event-list"><header><span>HISTORY</span><h3>关键历史事件</h3><p>先确定发生了什么</p></header>{details.events.map((item, index) => <button key={item.id} onClick={() => setActiveDetail(item)} aria-haspopup="dialog"><span className="node-number">0{index + 1}</span><span className="node-copy"><small>{item.marker}</small><b><TermText text={item.title} showEnglish={showEnglish} onTerm={onTerm} /></b></span><i aria-hidden="true">＋</i></button>)}</div>
        <div className="context-list problem-list"><header><span>QUESTIONS</span><h3>时代提出的问题</h3><p>再看这些变化迫使人追问什么</p></header>{details.problems.map((item, index) => <button key={item.id} onClick={() => setActiveDetail(item)} aria-haspopup="dialog"><span className="node-number">0{index + 1}</span><span className="node-copy"><small>{item.marker}</small><b><TermText text={item.title} showEnglish={showEnglish} onTerm={onTerm} /></b></span><i aria-hidden="true">＋</i></button>)}</div>
      </div>
      <aside className="carrier-strip"><b>这个时期，知识主要由谁承载？</b><p><TermText text={stage.carrier} showEnglish={showEnglish} onTerm={onTerm} /></p></aside>
    </section>
    <section className="relation-section"><div className="section-heading"><p className="section-label">02 · 最短关系链</p><h3><TermText text={stage.commonQuestion} showEnglish={showEnglish} onTerm={onTerm} /></h3></div><div className="relation-chain">{stage.chain.map((link, index) => <div className={`relation-node ${link.kind}`} key={`${link.label}-${link.text}`}><span>{relationNames[link.kind]}</span><b><TermText text={link.text} showEnglish={showEnglish} onTerm={onTerm} /></b>{index < stage.chain.length - 1 && <i aria-hidden="true">→</i>}</div>)}</div></section>
    <section className="responses-section"><div className="section-heading compact"><p className="section-label">03 · 同期比较</p><h3>同一个时代，为什么会有不同答案？</h3><p>先比较问题、方法和生活位置；具体论证留到下一层。</p></div><div className="response-tabs" role="tablist">{stage.responses.map((item, index) => <button role="tab" aria-selected={item.id === response.id} className={item.id === response.id ? "active" : ""} key={item.id} onClick={() => onResponse(item.id)}><span>0{index + 1}</span><b><TermText text={item.title} showEnglish={showEnglish} onTerm={onTerm} /></b><small><TermText text={item.figures} showEnglish={showEnglish} onTerm={onTerm} /></small></button>)}</div><div className="response-detail" role="tabpanel"><div className="response-main"><p className="response-place"><TermText text={`${response.region} · ${response.figures}`} showEnglish={showEnglish} onTerm={onTerm} /></p><h4><TermText text={response.answer} showEnglish={showEnglish} onTerm={onTerm} /></h4><div className="method-pill"><span>使用的方法</span><b><TermText text={response.method} showEnglish={showEnglish} onTerm={onTerm} /></b></div></div><div className="response-why"><p className="section-label">差异从哪里来</p><p><TermText text={response.difference} showEnglish={showEnglish} onTerm={onTerm} /></p>{response.noteCue && <blockquote><span>你的原始笔记线索</span>{response.noteCue}</blockquote>}</div><div className="chapter-evidence"><p className="section-label">下钻到原书</p>{response.chapterIds.map((id) => { const chapter = chapters.find((item) => item.id === id); return chapter ? <button key={id} onClick={() => onChapter(id)}><span>{chapter.roman}</span>{chapter.title}<i>→</i></button> : null; })}</div></div></section>
    <section className="outputs-section"><div><p className="section-label">04 · 这个阶段留下了什么</p><div className="legacy-list">{stage.legacy.map((item) => <span key={item}><TermText text={item} showEnglish={showEnglish} onTerm={onTerm} /></span>)}</div></div><div><p className="section-label">少数值得跨层保留的连接</p><div className="long-links">{longLinks.slice(linkStart, linkStart + 3).map((link) => <div key={`${link.from}-${link.to}`}><b><TermText text={link.from} showEnglish={showEnglish} onTerm={onTerm} /></b><span>{link.label} · 权重 {link.weight}</span><b><TermText text={link.to} showEnglish={showEnglish} onTerm={onTerm} /></b></div>)}</div></div></section>
    {activeDetail && <div className="detail-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveDetail(null); }}><section className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-modal-title"><button className="modal-close" aria-label="关闭详情" onClick={() => setActiveDetail(null)}>×</button><p className="eyebrow">{activeDetail.marker}</p><h3 id="detail-modal-title"><TermText text={activeDetail.title} showEnglish={showEnglish} onTerm={onTerm} /></h3><p><TermText text={activeDetail.detail} showEnglish={showEnglish} onTerm={onTerm} /></p><button className="modal-done" onClick={() => setActiveDetail(null)}>读完，回到双列表</button></section></div>}
  </article>;
}

function MethodsView({ method, onMethod, onStage, showEnglish, onTerm }: { method: (typeof methodAtlas)[number]; onMethod: (id: string) => void; onStage: (id: string) => void; showEnglish: boolean; onTerm: (term: TermEntry) => void }) {
  return <article className="methods-page page-wrap"><header className="page-heading"><p className="eyebrow">REUSABLE METHODS</p><h2>先学会反复出现的方法</h2><p>方法是第二种低成本索引：它跨越时代，却比孤立观点更容易复用。点击一种方法，观察它如何在不同问题中变形。</p></header><div className="method-layout"><nav className="method-list" aria-label="哲学方法">{methodAtlas.map((item, index) => <button className={item.id === method.id ? "active" : ""} key={item.id} onClick={() => onMethod(item.id)}><span>{String(index + 1).padStart(2, "0")}</span><b><TermText text={item.title} showEnglish={showEnglish} onTerm={onTerm} /></b><small>{item.uses.length} 个典型应用</small></button>)}</nav><section className="method-detail"><p className="section-label">通用操作</p><h3><TermText text={method.rule} showEnglish={showEnglish} onTerm={onTerm} /></h3><div><p className="section-label">典型应用</p><ul>{method.uses.map((use) => <li key={use}><TermText text={use} showEnglish={showEnglish} onTerm={onTerm} /></li>)}</ul></div><div><p className="section-label">回到历史位置</p><div className="stage-jumps">{method.stages.map((id) => { const targetStage = historyStages.find((item) => item.id === id); return targetStage ? <button key={id} onClick={() => onStage(id)}><small>{targetStage.years}</small><b>{targetStage.title}</b><span>→</span></button> : null; })}</div></div></section></div></article>;
}

function ChapterView({ chapter, note, starred, onStar, copied, onCopy, onTheme, originLabel, onBack, showEnglish, onTerm }: { chapter: (typeof chapters)[number]; note: (typeof notes)[string] | undefined; starred: boolean; onStar: () => void; copied: boolean; onCopy: () => void; onTheme: (theme: string) => void; originLabel?: string; onBack: () => void; showEnglish: boolean; onTerm: (term: TermEntry) => void }) {
  const termText = (text: string) => <TermText text={text} showEnglish={showEnglish} onTerm={onTerm} />;
  const chapterFigures = figuresForChapter(chapter.title);
  return <article className="chapter-page page-wrap">
    <button className="context-back" onClick={onBack}><span>←</span><small>{originLabel ? "返回刚才的阅读位置" : "返回历史地图"}</small><b>{originLabel || "历史阶段总览"}</b></button>
    <div className="chapter-kicker"><span>{bookNumber[chapter.book]} · {chapter.part}</span><button className={starred ? "selected" : ""} onClick={onStar}>{starred ? "★ 已收藏" : "☆ 收藏章节"}</button></div>
    <section className={chapterFigures.length ? "chapter-hero with-portraits" : "chapter-hero"}>
      <header className="chapter-header"><p className="eyebrow">CHAPTER {chapter.roman}</p><h2>{termText(chapter.title)}</h2><p>{chapter.english}</p><div className="theme-row">{chapter.themes.map((theme) => <button key={theme} onClick={() => onTheme(theme)}>#{termText(theme)}</button>)}</div></header>
      {chapterFigures.length > 0 && <aside className={`chapter-portraits count-${Math.min(chapterFigures.length, 2)}`} aria-label="本章人物图像">{chapterFigures.slice(0, 2).map((figure) => <PortraitCard key={figure.id} figure={figure} />)}</aside>}
    </section>
    {note ? <>
      <p className="context-line"><b>历史坐标</b>{termText(note.context)}</p>
      <section className="summary-block"><span>01</span><div><p className="section-label">一句话抓住本章</p><p>{termText(note.summary)}</p></div></section>
      <section className="chapter-content"><div><p className="section-label">核心论点</p>{note.keyPoints.map((point, index) => <div className="point" key={point}><span>0{index + 1}</span><p>{termText(point)}</p></div>)}</div><aside><p className="section-label">思想张力</p><b>{termText(note.axis[0])}</b><i /><b>{termText(note.axis[1])}</b></aside></section>
      <section className="russell-card"><p className="section-label">罗素的判断</p><p>{termText(note.russell)}</p></section>
      <section className="questions-block"><div><p className="section-label">合上书后</p><h3>能回答吗？</h3></div><ol>{note.questions.map((question) => <li key={question}>{termText(question)}</li>)}</ol></section>
    </> : <section className="pending-note"><span>○</span><div><p className="section-label">结构位置已建立</p><h3>这一章还没有精读卡片</h3><p>它仍可从历史阶段、人物和主题进入。后续只在值得下钻时补充观点内部论证，避免把网站变成原书复述。</p></div></section>}
    <footer className="source-bar"><div><span>SOURCE</span><b>原书 PDF 第 {chapter.pdfPage} 页</b></div><button onClick={onCopy}>{copied ? "已复制 ✓" : "复制页码"}</button></footer>
  </article>;
}

function ReviewView({ stage, index, flipped, reviewed, onFlip, onOpen, onNext, showEnglish, onTerm }: { stage: HistoryStage; index: number; flipped: boolean; reviewed: boolean; onFlip: () => void; onOpen: () => void; onNext: () => void; showEnglish: boolean; onTerm: (term: TermEntry) => void }) {
  return <article className="review-page page-wrap"><header className="page-heading"><p className="eyebrow">RELATIONAL RECALL</p><h2>先回忆关系，不先背结论</h2><p>问题要求你从历史条件推出思想差异。翻面后得到的是一条压缩关系，而不是标准答案。</p></header><button className={flipped ? "flashcard flipped" : "flashcard"} onClick={onFlip}><div className="card-meta"><span>{stage.years} · {stage.title}</span><span>{index + 1} / {historyStages.length}</span></div>{!flipped ? <div className="card-face"><span>RELATION QUESTION</span><h3><TermText text={stage.review} showEnglish={showEnglish} onTerm={onTerm} /></h3><p>先口述一遍，再点击翻面</p></div> : <div className="card-face"><span>RELATION CUE</span><p className="answer"><TermText text={stage.transition} showEnglish={showEnglish} onTerm={onTerm} /></p><p><TermText text={stage.responses.map((response) => response.figures).join(" / ")} showEnglish={showEnglish} onTerm={onTerm} /></p></div>}</button><div className="review-controls"><button onClick={onOpen}>回到阶段地图</button><button className="primary" onClick={onNext}>{reviewed ? "再复习一次，下一张" : "记住了，下一张"} →</button></div></article>;
}

function TermText({ text, showEnglish, onTerm }: { text: string; showEnglish: boolean; onTerm: (term: TermEntry) => void }) {
  const onPlace = useContext(PlaceInteractionContext);
  return <>{text.split(inlinePattern).map((part, index) => {
    const place = geographyByAlias.get(part);
    if (place && onPlace) {
      const openPlace = (event: SyntheticEvent) => { event.preventDefault(); event.stopPropagation(); onPlace(place); };
      return <span className="place-token" role="button" tabIndex={0} key={`place-${place.id}-${index}`} onClick={openPlace} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") openPlace(event); }} aria-label={`查看地点：${place.nameZh}，${place.nameEn}`}><span>{part}</span>{showEnglish && <small>{place.nameEn}</small>}<i aria-hidden="true">⌖</i></span>;
    }
    const term = terminologyByZh.get(part);
    if (!term) return <span key={`${part}-${index}`}>{part}</span>;
    const open = (event: SyntheticEvent) => { event.preventDefault(); event.stopPropagation(); onTerm(term); };
    return <span className="term-token" role="button" tabIndex={0} key={`${term.id}-${index}`} onClick={open} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") open(event); }} aria-label={`查看术语：${term.zh}，${term.en}`}><span>{term.zh}</span>{showEnglish && <small>{term.en}</small>}</span>;
  })}</>;
}

function PortraitCard({ figure }: { figure: FigureEntry }) {
  return <a className="portrait-card" href={figure.sourcePage} target="_blank" rel="noreferrer" title="打开图像来源与授权信息"><img src={figure.imagePath} alt={`${figure.zh}（${figure.en}）的历史画像或代表性图像`} /><span><b>{figure.zh}</b><small>{figure.en}</small></span><em>{figure.artist} · {figure.license}</em>{figure.representationCaution && <i>历史形象，仅作视觉识别</i>}</a>;
}

function TermModal({ term, onClose }: { term: TermEntry; onClose: () => void }) {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return <div className="term-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="term-modal" role="dialog" aria-modal="true" aria-labelledby="term-modal-title"><button className="modal-close" aria-label="关闭术语卡" onClick={onClose}>×</button><p className="eyebrow">{term.category} · BILINGUAL TERM</p><h2 id="term-modal-title">{term.zh}</h2><p className="term-english">{term.en}</p>{term.alternatives?.length && <div className="term-alternatives"><span>其他常见译法</span><p>{term.alternatives.join(" / ")}</p></div>}<div className="term-note"><span>在本网站中的识别线索</span><p>{term.note}</p></div><button className="modal-done" onClick={onClose}>理解了，返回阅读</button></section></div>;
}

function osmEmbedUrl(place: GeographyEntry) {
  const longitudeSpan = 360 / (2 ** place.zoom);
  const latitudeSpan = longitudeSpan * .62;
  const bbox = [place.longitude - longitudeSpan, place.latitude - latitudeSpan, place.longitude + longitudeSpan, place.latitude + latitudeSpan].join(",");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${place.latitude}%2C${place.longitude}`;
}

function PlaceModal({ place, onClose }: { place: GeographyEntry; onClose: () => void }) {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  const kindLabel = place.kind === "city" ? "城市" : place.kind === "region" ? "区域" : "历史帝国";

  return <div className="place-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="place-modal" role="dialog" aria-modal="true" aria-labelledby="place-modal-title"><button className="modal-close" aria-label="关闭地点卡" onClick={onClose}>×</button><header><div><p className="eyebrow">{kindLabel} · PLACE & MAP</p><h2 id="place-modal-title">{place.nameZh}</h2><p>{place.nameEn}</p></div><span className="map-coordinate">{place.latitude.toFixed(3)}°, {place.longitude.toFixed(3)}°</span></header><div className="place-modal-grid"><div className="map-frame"><iframe src={osmEmbedUrl(place)} title={`${place.nameZh}现代地图`} loading="lazy" /><a href={place.modernMapUrl} target="_blank" rel="noreferrer">在现代地图中打开 ↗</a></div><div className="place-context"><div className="modern-location"><span>今天的位置</span><b>{place.modernLocation}</b></div><p className="section-label">书中时代的历史语境</p>{place.historicalContexts.map((context) => <article key={`${context.period}-${context.ancientOrPeriodName}`}><span>{context.period}</span><h3>{context.ancientOrPeriodName}</h3><b>{context.politicalContext}</b><p>{context.note}</p><small>地图尺度：{context.mapScope}</small></article>)}<a className="historical-map-link" href={place.historicalGazetteerUrl} target="_blank" rel="noreferrer">查看古代地名资料与历史地图 ↗</a></div></div><button className="modal-done" onClick={onClose}>返回阅读</button></section></div>;
}
