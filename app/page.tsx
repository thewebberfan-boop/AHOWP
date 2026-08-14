"use client";

import { useEffect, useMemo, useState } from "react";
import { bookLabels, chapters, guidingAxes, notes, type BookKey } from "./book-data";

type Mode = "notes" | "map" | "review";

const bookOrder: BookKey[] = ["ancient", "catholic", "modern"];
const bookNumber: Record<BookKey, string> = { ancient: "第一卷", catholic: "第二卷", modern: "第三卷" };

function loadSet(key: string) {
  try { return new Set<string>(JSON.parse(localStorage.getItem(key) || "[]")); }
  catch { return new Set<string>(); }
}

export default function Home() {
  const [mode, setMode] = useState<Mode>("notes");
  const [query, setQuery] = useState("");
  const [bookFilter, setBookFilter] = useState<BookKey | "all">("all");
  const [selectedId, setSelectedId] = useState("b3-09");
  const [reviewed, setReviewed] = useState<Set<string>>(new Set());
  const [starred, setStarred] = useState<Set<string>>(new Set());
  const [reviewIndex, setReviewIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setReviewed(loadSet("ahowp-reviewed"));
    setStarred(loadSet("ahowp-starred"));
  }, []);

  const persist = (key: string, value: Set<string>, setter: (value: Set<string>) => void) => {
    setter(value);
    localStorage.setItem(key, JSON.stringify([...value]));
  };

  const toggleInSet = (id: string, current: Set<string>, key: string, setter: (value: Set<string>) => void) => {
    const next = new Set(current);
    next.has(id) ? next.delete(id) : next.add(id);
    persist(key, next, setter);
  };

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return chapters.filter((chapter) => {
      if (bookFilter !== "all" && chapter.book !== bookFilter) return false;
      if (!needle) return true;
      const note = notes[chapter.id];
      const haystack = [chapter.title, chapter.english, chapter.part, ...chapter.themes, note?.summary, ...(note?.keyPoints || [])]
        .filter(Boolean).join(" ").toLowerCase();
      return haystack.includes(needle);
    });
  }, [bookFilter, query]);

  const selected = chapters.find((chapter) => chapter.id === selectedId) || chapters[0];
  const note = notes[selected.id];
  const reviewChapters = chapters.filter((chapter) => notes[chapter.id]);
  const reviewChapter = reviewChapters[reviewIndex % reviewChapters.length];
  const reviewNote = notes[reviewChapter.id];
  const allThemes = useMemo(() => {
    const counts = new Map<string, number>();
    chapters.forEach((chapter) => chapter.themes.forEach((theme) => counts.set(theme, (counts.get(theme) || 0) + 1)));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 16);
  }, []);

  const openChapter = (id: string) => {
    setSelectedId(id);
    setMode("notes");
    setCopied(false);
    if (window.innerWidth < 780) window.scrollTo({ top: 390, behavior: "smooth" });
  };

  const nextCard = () => {
    setReviewIndex((value) => (value + 1) % reviewChapters.length);
    setFlipped(false);
  };

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="identity">
          <div className="brand-mark" aria-hidden="true">AH</div>
          <div>
            <p className="eyebrow">BERTRAND RUSSELL</p>
            <h1>西方哲学史</h1>
            <p className="subtitle">交互式学习笔记</p>
          </div>
        </div>

        <label className="search-box">
          <span aria-hidden="true">⌕</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="搜索笔记" placeholder="搜索人物、概念或章节…" />
          {query && <button aria-label="清空搜索" onClick={() => setQuery("")}>×</button>}
        </label>

        <div className="book-filters" aria-label="按卷筛选">
          <button className={bookFilter === "all" ? "active" : ""} onClick={() => setBookFilter("all")}>全部</button>
          <button className={bookFilter === "ancient" ? "active" : ""} onClick={() => setBookFilter("ancient")}>古代</button>
          <button className={bookFilter === "catholic" ? "active" : ""} onClick={() => setBookFilter("catholic")}>中世纪</button>
          <button className={bookFilter === "modern" ? "active" : ""} onClick={() => setBookFilter("modern")}>近现代</button>
        </div>

        <div className="chapter-scroll" aria-label="全书章节">
          <div className="results-label"><span>{query ? "搜索结果" : "全书目录"}</span><b>{filtered.length}</b></div>
          {filtered.length === 0 && <div className="empty-result">没有匹配内容。试试“自由”“因果”或“知识”。</div>}
          {bookOrder.map((book) => {
            const items = filtered.filter((chapter) => chapter.book === book);
            if (!items.length) return null;
            return (
              <section className="chapter-group" key={book}>
                <p className="group-title">{bookNumber[book]} · {bookLabels[book].title}</p>
                {items.map((chapter) => (
                  <button className={selected.id === chapter.id ? "chapter-link active" : "chapter-link"} key={chapter.id} onClick={() => openChapter(chapter.id)}>
                    <span className="chapter-roman">{chapter.roman}</span>
                    <span className="chapter-name">{chapter.title}<small>{chapter.english}</small></span>
                    <span className="chapter-status">{starred.has(chapter.id) ? "★" : notes[chapter.id] ? "●" : ""}</span>
                  </button>
                ))}
              </section>
            );
          })}
        </div>
        <div className="sidebar-legend"><span><i className="dot done" /> 已有精读笔记</span><span>★ 收藏</span></div>
      </aside>

      <section className="reading-pane">
        <header className="topbar">
          <nav className="mode-tabs" aria-label="学习视图">
            <button className={mode === "notes" ? "active" : ""} onClick={() => setMode("notes")}>阅读笔记</button>
            <button className={mode === "map" ? "active" : ""} onClick={() => setMode("map")}>全书地图</button>
            <button className={mode === "review" ? "active" : ""} onClick={() => setMode("review")}>卡片复习</button>
          </nav>
          <span className="progress"><i style={{ "--value": `${Math.max(4, reviewed.size / chapters.length * 100)}%` } as React.CSSProperties} /> 已复习 {reviewed.size} / {chapters.length} 章</span>
        </header>

        {mode === "notes" && (
          <article className="note-page">
            <div className="note-kicker">
              <span>{bookNumber[selected.book]} · {selected.part}</span>
              <div className="note-actions">
                <button className={starred.has(selected.id) ? "selected" : ""} onClick={() => toggleInSet(selected.id, starred, "ahowp-starred", setStarred)}>{starred.has(selected.id) ? "★ 已收藏" : "☆ 收藏"}</button>
                <button className={reviewed.has(selected.id) ? "selected" : ""} onClick={() => toggleInSet(selected.id, reviewed, "ahowp-reviewed", setReviewed)}>{reviewed.has(selected.id) ? "✓ 已复习" : "标记复习"}</button>
              </div>
            </div>
            <header className="note-header">
              <p className="eyebrow">CHAPTER {selected.roman}</p>
              <h2>{selected.title}</h2>
              <p className="english-title">{selected.english}</p>
              <div className="theme-row">{selected.themes.map((theme) => <button key={theme} onClick={() => setQuery(theme)}>#{theme}</button>)}</div>
            </header>

            {note ? (
              <>
                <p className="context-line"><b>历史坐标</b>{note.context}</p>
                <section className="summary-block">
                  <span className="section-number">01</span>
                  <div><p className="section-label">一句话抓住本章</p><p className="summary-text">{note.summary}</p></div>
                </section>
                <section className="content-grid">
                  <div className="key-points">
                    <p className="section-label">核心论点</p>
                    {note.keyPoints.map((point, index) => <div className="point" key={point}><span>0{index + 1}</span><p>{point}</p></div>)}
                  </div>
                  <aside className="axis-card">
                    <p className="section-label">思想张力</p>
                    <div className="axis-labels"><b>{note.axis[0]}</b><b>{note.axis[1]}</b></div>
                    <div className="axis-line"><i /></div>
                    <p>不要急着选择一端；先看这位哲学家如何重新定义两端的关系。</p>
                  </aside>
                </section>
                <section className="russell-card"><p className="section-label">罗素的判断</p><p>{note.russell}</p></section>
                <section className="questions-block">
                  <div><p className="section-label">合上书后，能回答吗？</p><h3>复习问题</h3></div>
                  <ol>{note.questions.map((question) => <li key={question}>{question}</li>)}</ol>
                </section>
              </>
            ) : (
              <section className="pending-note">
                <span className="section-number">○</span>
                <div>
                  <p className="section-label">等待接入旧笔记</p>
                  <h3>本章位置已经建立</h3>
                  <p>目录、主题与原书页码已经可检索。把旧笔记放入项目文件夹后，这里会整理成“历史坐标—核心论点—罗素判断—复习问题”的统一结构。</p>
                </div>
              </section>
            )}

            <footer className="source-bar">
              <div><span>SOURCE</span><b>原书 PDF 第 {selected.pdfPage} 页</b></div>
              <button onClick={async () => { await navigator.clipboard?.writeText(`《西方哲学史》PDF 第 ${selected.pdfPage} 页`); setCopied(true); }}>{copied ? "已复制 ✓" : "复制页码"}</button>
            </footer>
          </article>
        )}

        {mode === "map" && (
          <article className="map-page">
            <header className="map-heading"><p className="eyebrow">THE WHOLE ARGUMENT</p><h2>先看森林，再看树木</h2><p>罗素并不只按年代排列哲学家。他追踪思想与社会制度如何彼此塑造，以及人类如何在几组长期张力之间摆动。</p></header>
            <div className="era-map">
              {bookOrder.map((book, index) => {
                const count = chapters.filter((chapter) => chapter.book === book).length;
                const ready = chapters.filter((chapter) => chapter.book === book && notes[chapter.id]).length;
                return <button key={book} onClick={() => { setBookFilter(book); setMode("notes"); }}><span>0{index + 1}</span><p>{bookLabels[book].years}</p><h3>{bookLabels[book].title}</h3><small>{count} 章 · {ready} 章精读</small></button>;
              })}
            </div>
            <section className="axes-section">
              <div className="section-intro"><p className="section-label">四条检索主线</p><h3>同一问题，不同时代的回答</h3></div>
              <div className="axes-list">{guidingAxes.map((axis, index) => <div className="axis-row" key={axis.left}><span>0{index + 1}</span><b>{axis.left}</b><i /><b>{axis.right}</b><p>{axis.note}</p></div>)}</div>
            </section>
            <section className="theme-index"><p className="section-label">主题索引</p><div>{allThemes.map(([theme, count]) => <button key={theme} onClick={() => { setQuery(theme); setBookFilter("all"); setMode("notes"); }}>{theme}<sup>{count}</sup></button>)}</div></section>
          </article>
        )}

        {mode === "review" && (
          <article className="review-page">
            <header><p className="eyebrow">ACTIVE RECALL</p><h2>别重读，先回忆</h2><p>尝试回答后再翻面。记得住的不是看过的内容，而是主动从记忆中提取过的内容。</p></header>
            <button className={flipped ? "flashcard flipped" : "flashcard"} onClick={() => setFlipped(!flipped)}>
              <div className="card-meta"><span>{bookNumber[reviewChapter.book]} · {reviewChapter.title}</span><span>{reviewIndex + 1} / {reviewChapters.length}</span></div>
              {!flipped ? <div className="card-face"><span>QUESTION</span><h3>{reviewNote.questions[0]}</h3><p>点击卡片查看提示</p></div> : <div className="card-face"><span>RECALL NOTE</span><p className="answer">{reviewNote.summary}</p><p>思想张力：{reviewNote.axis[0]} ←→ {reviewNote.axis[1]}</p></div>}
            </button>
            <div className="review-controls">
              <button onClick={() => { setSelectedId(reviewChapter.id); setMode("notes"); }}>返回本章笔记</button>
              <button className="primary" onClick={() => { const next = new Set(reviewed).add(reviewChapter.id); persist("ahowp-reviewed", next, setReviewed); nextCard(); }}>记住了，下一张 →</button>
            </div>
          </article>
        )}
      </section>
    </main>
  );
}
