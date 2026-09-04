"use client";

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode, type SyntheticEvent } from "react";
import { bookLabels, chapters, notes, type BookKey } from "./book-data";
import { figureEntries, figuresForChapter, type FigureEntry } from "./figure-data";
import { geographyByAlias, geographyEntries, geographyMatchers, type GeographyEntry } from "./geography-data";
import { historyResponseLinks, historyStages, longLinks, methodAtlas, stageDetailPanels, type DetailNode, type HistoryStage, type ResponseNode } from "./history-data";
import { formatLanguageLabel } from "./language-label";
import { findPhilosopherProfilesByTarget, philosopherProfiles, type PhilosopherProfile } from "./philosopher-data";
import { russellStructureStageIdsByHistoryStage, russellStructureStages } from "./russell-structure-data";
import { PhilosopherGraphView } from "./philosopher-graph";
import { SchoolGraphView } from "./school-graph";
import { ProblemMapView } from "./problem-map";
import { KnowledgeConnections, KnowledgeNavigationContext } from "./knowledge-connections";
import { knowledgeNodeById, knowledgePhaseByNodeId, type ReadingTarget } from "./knowledge-paths";
import { philosopherReadingNodeIds } from "./philosopher-reading-data";
import { readingPreferenceKeys } from "./reading-topics-data";
import { ancientDifferenceProblemMap, type ProblemHistoryLink } from "./problem-map-data";
import { findSchoolProfilesByPhilosopher, schoolProfiles, schoolRelationMeta, sortSchoolRelations, type SchoolProfile } from "./school-data";
import { terminology, terminologyByZh, terminologyMatchers, type TermEntry } from "./terminology-data";

type Mode = "schools" | "philosophers" | "problems" | "history" | "methods" | "chapters" | "review";
type ProblemViewOrigin = {
  problemPreferences?: Record<string, string | null>;
  problemGraphScroll?: { top: number; left: number };
};
type ChapterOrigin = ProblemViewOrigin & {
  mode: Exclude<Mode, "chapters">;
  schoolId: string;
  philosopherId: string;
  stageId: string;
  responseId: string;
  methodId: string;
  problemPhaseId: string;
  problemNodeId?: string;
  reviewIndex: number;
  label: string;
  scrollY: number;
};
type HistoryOrigin = { stageId: string; responseId: string; scrollY: number; label: string };
type SchoolOrigin =
  | ({ source: "history" } & HistoryOrigin)
  | { source: "philosopher"; philosopherId: string; scrollY: number; label: string };
type PhilosopherOrigin =
  | ({ source: "school"; schoolId: string } & Pick<HistoryOrigin, "scrollY" | "label">)
  | ({ source: "history" } & HistoryOrigin);
type ProblemHistoryOrigin = ProblemViewOrigin & {
  problemPhaseId: string;
  problemNodeId: string;
  scrollY: number;
  label: string;
};
type InlineEntityOrigin = ProblemViewOrigin & {
  target: "school" | "philosopher" | "problem";
  problemHistoryOrigin?: ProblemHistoryOrigin | null;
  mode: Mode;
  schoolId: string;
  showSchoolGraph: boolean;
  philosopherId: string;
  showPhilosopherGraph: boolean;
  stageId: string;
  responseId: string;
  methodId: string;
  problemPhaseId: string;
  problemNodeId: string;
  chapterId: string;
  reviewIndex: number;
  chapterOrigin: ChapterOrigin | null;
  schoolOrigin: SchoolOrigin | null;
  philosopherOrigin: PhilosopherOrigin | null;
  previousInlineEntityOrigin: InlineEntityOrigin | null;
  label: string;
  scrollY: number;
};
type LearningSession = {
  version: 1;
  mode: Mode;
  schoolId: string;
  showSchoolGraph: boolean;
  philosopherId: string;
  showPhilosopherGraph: boolean;
  stageId: string;
  responseId: string;
  methodId: string;
  problemPhaseId: string;
  problemNodeId: string;
  chapterId: string;
  reviewIndex: number;
  chapterOrigin: ChapterOrigin | null;
  schoolOrigin: SchoolOrigin | null;
  philosopherOrigin: PhilosopherOrigin | null;
  inlineEntityOrigin: InlineEntityOrigin | null;
  problemHistoryOrigin: ProblemHistoryOrigin | null;
  scrollY: number;
  savedAt: number;
};
type SearchResult =
  | { kind: "stage"; id: string; title: string; meta: string }
  | { kind: "response"; id: string; stageId: string; title: string; meta: string }
  | { kind: "school"; id: string; title: string; meta: string }
  | { kind: "philosopher"; id: string; title: string; meta: string }
  | { kind: "method"; id: string; title: string; meta: string }
  | { kind: "problem"; id: string; title: string; meta: string }
  | { kind: "chapter"; id: string; title: string; meta: string }
  | { kind: "place"; id: string; title: string; meta: string }
  | { kind: "term"; id: string; title: string; meta: string };
type MobileRailItem = {
  key: string;
  badge: string;
  marker: string;
  title: string;
  detail: string;
  imagePath?: string;
  rating?: string;
  onSelect: () => void;
};

const bookOrder: BookKey[] = ["ancient", "catholic", "modern"];
const bookNumber: Record<BookKey, string> = { ancient: "第一卷", catholic: "第二卷", modern: "第三卷" };
const relationNames = { condition: "历史条件", response: "回应", inherit: "继承", oppose: "分歧", transmit: "传播", exception: "跨层例外" };
const philosopherRelationSymbols = { "影响后继": "→", "承接前人": "←", "同题比较": "↔", "批评关系": "×", "后世重构": "⋯" } as const;
const philosopherSectionLinks = [
  { id: "profile-life", label: "生平" },
  { id: "profile-concepts", label: "概念" },
  { id: "profile-inquiry", label: "思想路径" },
  { id: "profile-relations", label: "关系与比较" },
  { id: "profile-cultural", label: "故事与名言" },
  { id: "profile-russell", label: "罗素与校正" },
] as const;
const inlineMatchers = [...new Set([...terminologyMatchers, ...geographyMatchers])].sort((a, b) => b.length - a.length);
const inlinePattern = new RegExp(`(${inlineMatchers.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g");
const PlaceInteractionContext = createContext<((place: GeographyEntry) => void) | null>(null);
const EntityNavigationContext = createContext<((entity: NonNullable<TermEntry["entity"]>) => void) | null>(null);
const learningSessionKey = "ahowp-learning-session-v1";
const learningModes: Mode[] = ["schools", "philosophers", "problems", "history", "methods", "chapters", "review"];
const defaultProblemPhaseId = ancientDifferenceProblemMap.phases[0].id;
const problemMapNodes = ancientDifferenceProblemMap.phases.flatMap((phase) => phase.nodes);
const defaultProblemNodeId = problemMapNodes[0].id;
const problemPreferenceKeys = ["ahowp-problem-map-facets", "ahowp-problem-map-density", ...readingPreferenceKeys];

function captureProblemPreferences() {
  try { return Object.fromEntries(problemPreferenceKeys.map((key) => [key, localStorage.getItem(key)])); }
  catch { return undefined; }
}

function captureProblemViewOrigin(): ProblemViewOrigin {
  const graph = document.querySelector(".problem-graph-scroll");
  return {
    problemPreferences: captureProblemPreferences(),
    problemGraphScroll: { top: graph?.scrollTop || 0, left: graph?.scrollLeft || 0 },
  };
}

function restoreProblemPreferences(preferences?: Record<string, string | null>) {
  if (!preferences) return;
  try {
    for (const key of problemPreferenceKeys) {
      if (preferences[key] == null) localStorage.removeItem(key);
      else localStorage.setItem(key, preferences[key]);
    }
  } catch { /* The in-memory navigation remains usable when storage is blocked. */ }
}

function validProblemPhaseId(value: unknown) {
  return typeof value === "string" && ancientDifferenceProblemMap.phases.some((phase) => phase.id === value) ? value : defaultProblemPhaseId;
}

function validProblemNodeId(value: unknown) {
  return typeof value === "string" && problemMapNodes.some((node) => node.id === value) ? value : defaultProblemNodeId;
}

function normalizeInlineOrigin(origin: InlineEntityOrigin | null | undefined): InlineEntityOrigin | null {
  if (!origin) return null;
  return {
    ...origin,
    problemPhaseId: validProblemPhaseId(origin.problemPhaseId),
    problemNodeId: validProblemNodeId(origin.problemNodeId),
    previousInlineEntityOrigin: normalizeInlineOrigin(origin.previousInlineEntityOrigin),
  };
}

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

function loadLearningSession(): LearningSession | null {
  try {
    const value = JSON.parse(localStorage.getItem(learningSessionKey) || "null") as Partial<LearningSession> | null;
    if (!value || value.version !== 1 || !value.mode || !learningModes.includes(value.mode)) return null;
    if (typeof value.schoolId !== "string" || typeof value.philosopherId !== "string" || typeof value.stageId !== "string" || typeof value.responseId !== "string" || typeof value.methodId !== "string" || typeof value.chapterId !== "string") return null;
    return {
      version: 1,
      mode: value.mode,
      schoolId: value.schoolId,
      showSchoolGraph: value.showSchoolGraph !== false,
      philosopherId: value.philosopherId,
      showPhilosopherGraph: value.showPhilosopherGraph !== false,
      stageId: value.stageId,
      responseId: value.responseId,
      methodId: value.methodId,
      problemPhaseId: validProblemPhaseId(value.problemPhaseId),
      problemNodeId: validProblemNodeId(value.problemNodeId),
      chapterId: value.chapterId,
      reviewIndex: typeof value.reviewIndex === "number" ? value.reviewIndex : 0,
      chapterOrigin: value.chapterOrigin ? { ...value.chapterOrigin, problemPhaseId: validProblemPhaseId(value.chapterOrigin.problemPhaseId) } : null,
      schoolOrigin: value.schoolOrigin || null,
      philosopherOrigin: value.philosopherOrigin || null,
      inlineEntityOrigin: normalizeInlineOrigin(value.inlineEntityOrigin),
      problemHistoryOrigin: value.problemHistoryOrigin ? {
        ...value.problemHistoryOrigin,
        problemPhaseId: validProblemPhaseId(value.problemHistoryOrigin.problemPhaseId),
        problemNodeId: validProblemNodeId(value.problemHistoryOrigin.problemNodeId),
      } : null,
      scrollY: typeof value.scrollY === "number" ? Math.max(0, value.scrollY) : 0,
      savedAt: typeof value.savedAt === "number" ? value.savedAt : Date.now(),
    };
  } catch {
    return null;
  }
}

function scrollWithoutAnimation(top: number) {
  const root = document.documentElement;
  const previousBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  window.scrollTo({ top, behavior: "auto" });
  root.style.scrollBehavior = previousBehavior;
}

function scrollElementWithoutAnimation(id: string) {
  const root = document.documentElement;
  const previousBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  document.getElementById(id)?.scrollIntoView({ behavior: "auto", block: "start" });
  root.style.scrollBehavior = previousBehavior;
}

function includesText(parts: Array<string | undefined>, needle: string) {
  return parts.filter(Boolean).join(" ").toLowerCase().includes(needle);
}

export default function Home() {
  const [showLanding, setShowLanding] = useState(true);
  const [sessionStorageReady, setSessionStorageReady] = useState(false);
  const [lastSession, setLastSession] = useState<LearningSession | null>(null);
  const [pendingResumeScroll, setPendingResumeScroll] = useState<number | null>(null);
  const [mode, setMode] = useState<Mode>("history");
  const [schoolId, setSchoolId] = useState("stoicism");
  const [showSchoolGraph, setShowSchoolGraph] = useState(true);
  const [philosopherId, setPhilosopherId] = useState("thales");
  const [stageId, setStageId] = useState("hellenistic");
  const [responseId, setResponseId] = useState("epicureans");
  const [methodId, setMethodId] = useState("therapy");
  const [problemPhaseId, setProblemPhaseId] = useState(defaultProblemPhaseId);
  const [problemNodeId, setProblemNodeId] = useState(defaultProblemNodeId);
  const [chapterId, setChapterId] = useState("b1-28");
  const [query, setQuery] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [bookFilter, setBookFilter] = useState<BookKey | "all">("all");
  const [reviewedStages, setReviewedStages] = useState<Set<string>>(new Set());
  const [starredChapters, setStarredChapters] = useState<Set<string>>(new Set());
  const [reviewIndex, setReviewIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [copied, setCopied] = useState(false);
  const [chapterOrigin, setChapterOrigin] = useState<ChapterOrigin | null>(null);
  const [schoolOrigin, setSchoolOrigin] = useState<SchoolOrigin | null>(null);
  const [philosopherOrigin, setPhilosopherOrigin] = useState<PhilosopherOrigin | null>(null);
  const [inlineEntityOrigin, setInlineEntityOrigin] = useState<InlineEntityOrigin | null>(null);
  const [readingTarget, setReadingTarget] = useState<ReadingTarget | null>(null);
  const consumeReadingTarget = useCallback(() => setReadingTarget(null), []);
  const [pendingGraphScroll, setPendingGraphScroll] = useState<{ top: number; left: number } | null>(null);
  useEffect(() => {
    if (!pendingGraphScroll) return;
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        document.querySelector(".problem-graph-scroll")?.scrollTo(pendingGraphScroll);
        setPendingGraphScroll(null);
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [pendingGraphScroll]);
  const [problemHistoryOrigin, setProblemHistoryOrigin] = useState<ProblemHistoryOrigin | null>(null);
  const [pendingHistoryScroll, setPendingHistoryScroll] = useState<number | null>(null);
  const [pendingSchoolScroll, setPendingSchoolScroll] = useState<number | null>(null);
  const [pendingPhilosopherScroll, setPendingPhilosopherScroll] = useState<number | null>(null);
  const [pendingChapterScroll, setPendingChapterScroll] = useState<number | null>(null);
  const [pendingProblemTargetId, setPendingProblemTargetId] = useState<string | null>(null);
  const [pendingModeScroll, setPendingModeScroll] = useState<number | null>(null);
  const [showPhilosopherGraph, setShowPhilosopherGraph] = useState(true);
  const [showEnglishTerms, setShowEnglishTerms] = useState(true);
  const [activeTerm, setActiveTerm] = useState<TermEntry | null>(null);
  const [activePlace, setActivePlace] = useState<GeographyEntry | null>(null);
  const sidebarScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setReviewedStages(loadSet("ahowp-stage-reviewed"));
      setStarredChapters(loadSet("ahowp-starred"));
      setShowEnglishTerms(loadPreference("ahowp-bilingual-terms", true));
      setLastSession(loadLearningSession());
      setSessionStorageReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (showLanding || pendingResumeScroll === null) return;
    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        scrollWithoutAnimation(pendingResumeScroll);
        setPendingResumeScroll(null);
      });
    });
    return () => {
      window.cancelAnimationFrame(firstFrame);
      if (secondFrame) window.cancelAnimationFrame(secondFrame);
    };
  }, [showLanding, mode, stageId, responseId, schoolId, philosopherId, problemPhaseId, problemNodeId, chapterId, showSchoolGraph, showPhilosopherGraph, pendingResumeScroll]);

  useEffect(() => {
    if (mode !== "history" || pendingHistoryScroll === null) return;
    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        scrollWithoutAnimation(pendingHistoryScroll);
        setPendingHistoryScroll(null);
      });
    });
    return () => {
      window.cancelAnimationFrame(firstFrame);
      if (secondFrame) window.cancelAnimationFrame(secondFrame);
    };
  }, [mode, stageId, responseId, pendingHistoryScroll]);

  useEffect(() => {
    if (mode !== "schools" || pendingSchoolScroll === null) return;
    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        scrollWithoutAnimation(pendingSchoolScroll);
        setPendingSchoolScroll(null);
      });
    });
    return () => {
      window.cancelAnimationFrame(firstFrame);
      if (secondFrame) window.cancelAnimationFrame(secondFrame);
    };
  }, [mode, schoolId, pendingSchoolScroll]);

  useEffect(() => {
    if (mode !== "philosophers" || pendingPhilosopherScroll === null) return;
    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        scrollWithoutAnimation(pendingPhilosopherScroll);
        setPendingPhilosopherScroll(null);
      });
    });
    return () => {
      window.cancelAnimationFrame(firstFrame);
      if (secondFrame) window.cancelAnimationFrame(secondFrame);
    };
  }, [mode, philosopherId, pendingPhilosopherScroll]);

  useEffect(() => {
    if (mode !== "chapters" || pendingChapterScroll === null) return;
    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        scrollWithoutAnimation(pendingChapterScroll);
        setPendingChapterScroll(null);
      });
    });
    return () => {
      window.cancelAnimationFrame(firstFrame);
      if (secondFrame) window.cancelAnimationFrame(secondFrame);
    };
  }, [mode, chapterId, pendingChapterScroll]);

  useEffect(() => {
    if ((mode !== "methods" && mode !== "review" && mode !== "problems") || pendingModeScroll === null) return;
    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        scrollWithoutAnimation(pendingModeScroll);
        setPendingModeScroll(null);
      });
    });
    return () => {
      window.cancelAnimationFrame(firstFrame);
      if (secondFrame) window.cancelAnimationFrame(secondFrame);
    };
  }, [mode, methodId, problemPhaseId, problemNodeId, reviewIndex, pendingModeScroll]);

  useEffect(() => {
    if (mode !== "problems" || !pendingProblemTargetId) return;
    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        scrollElementWithoutAnimation(pendingProblemTargetId);
        setPendingProblemTargetId(null);
      });
    });
    return () => {
      window.cancelAnimationFrame(firstFrame);
      if (secondFrame) window.cancelAnimationFrame(secondFrame);
    };
  }, [mode, pendingProblemTargetId]);

  const selectedStage = historyStages.find((stage) => stage.id === stageId) || historyStages[0];
  const selectedSchool = schoolProfiles.find((school) => school.id === schoolId) || schoolProfiles[0];
  const selectedPhilosopher = philosopherProfiles.find((profile) => profile.id === philosopherId) || philosopherProfiles[0];
  const selectedResponse = selectedStage.responses.find((response) => response.id === responseId) || selectedStage.responses[0];
  const selectedMethod = methodAtlas.find((method) => method.id === methodId) || methodAtlas[0];
  const selectedChapter = chapters.find((chapter) => chapter.id === chapterId) || chapters[0];
  const selectedNote = notes[selectedChapter.id];
  const reviewStage = historyStages[reviewIndex % historyStages.length];

  const sessionState = useMemo(() => ({
    mode,
    schoolId,
    showSchoolGraph,
    philosopherId,
    showPhilosopherGraph,
    stageId,
    responseId,
    methodId,
    problemPhaseId,
    problemNodeId,
    chapterId,
    reviewIndex,
    chapterOrigin,
    schoolOrigin,
    philosopherOrigin,
    inlineEntityOrigin,
    problemHistoryOrigin,
  }), [mode, schoolId, showSchoolGraph, philosopherId, showPhilosopherGraph, stageId, responseId, methodId, problemPhaseId, problemNodeId, chapterId, reviewIndex, chapterOrigin, schoolOrigin, philosopherOrigin, inlineEntityOrigin, problemHistoryOrigin]);

  const makeLearningSession = useCallback((scrollY: number): LearningSession => ({
    version: 1,
    ...sessionState,
    scrollY: Math.max(0, scrollY),
    savedAt: Date.now(),
  }), [sessionState]);

  useEffect(() => {
    if (!sessionStorageReady || showLanding || pendingResumeScroll !== null || pendingHistoryScroll !== null || pendingSchoolScroll !== null || pendingPhilosopherScroll !== null || pendingChapterScroll !== null || pendingProblemTargetId !== null || pendingModeScroll !== null) return;
    let timer = 0;
    const persist = () => {
      const next = makeLearningSession(window.scrollY);
      saveLocalValue(learningSessionKey, JSON.stringify(next));
    };
    const schedulePersist = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(persist, 180);
    };
    persist();
    window.addEventListener("scroll", schedulePersist, { passive: true });
    window.addEventListener("pagehide", persist);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", schedulePersist);
      window.removeEventListener("pagehide", persist);
    };
  }, [sessionStorageReady, showLanding, pendingResumeScroll, pendingHistoryScroll, pendingSchoolScroll, pendingPhilosopherScroll, pendingChapterScroll, pendingProblemTargetId, pendingModeScroll, makeLearningSession]);

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
    schoolProfiles.forEach((school) => {
      if (includesText([
        school.nameZh, school.nameEn, school.kind, school.period, school.thesis, school.classificationNote, `${school.stars || 1}星`, `${school.stars || 1}★`,
        school.context.overview, ...school.regions,
        ...school.context.factors.flatMap((factor) => [factor.title, factor.detail]),
        school.architecture.commonProblem, school.architecture.sharedPremise, school.architecture.method, school.architecture.answer,
        ...school.architecture.tensions.flatMap((tension) => [tension.title, tension.detail]),
        ...school.philosophers.flatMap((person) => [person.role, person.contribution, person.interaction]),
        ...school.relations.flatMap((relation) => [relation.target, relation.relation, relation.detail]),
      ], needle)) results.push({ kind: "school", id: school.id, title: school.nameZh, meta: `${school.stars || 1}星 · ${school.nameEn} · ${school.kind}` });
    });
    philosopherProfiles.forEach((profile) => {
      if (includesText([
        profile.nameZh, profile.nameEn, profile.greekName, profile.dates, profile.active, profile.school, profile.thesis, `${profile.stars || 1}星`, `${profile.stars || 1}★`,
        profile.lifeSummary, profile.russellView, profile.modernCorrection, ...profile.places,
        ...(profile.culturalNotes || []).flatMap((note) => [note.kind, note.title, note.text, note.caveat || ""]),
        ...profile.concepts.flatMap((concept) => [concept.zh, concept.en, concept.definition]),
        ...philosopherReadingNodeIds(profile.id).flatMap((id) => {
          const node = knowledgeNodeById.get(id);
          return node ? [node.title, node.summary, node.pressure, node.consequence] : [];
        }),
      ], needle)) results.push({ kind: "philosopher", id: profile.id, title: profile.nameZh, meta: `${profile.stars || 1}星 · ${profile.nameEn} · ${profile.school}` });
    });
    methodAtlas.forEach((method) => {
      if (includesText([method.title, method.rule, ...method.uses], needle)) results.push({ kind: "method", id: method.id, title: method.title, meta: `${method.uses.join("、")} · 通用方法` });
    });
    ancientDifferenceProblemMap.phases.forEach((phase) => {
      if (includesText([
        ancientDifferenceProblemMap.title, ancientDifferenceProblemMap.english, phase.label, phase.title, phase.question, phase.transition,
        ...phase.nodes.flatMap((node) => [
          node.kind, node.answerRole || "", node.title, node.summary, node.pressure, node.consequence,
          node.observation?.domain, node.observation?.note,
          ...(node.observation?.historyLinks || []).flatMap((link) => [link.label, link.note]),
          ...node.participants.flatMap((participant) => [participant.name, participant.role]),
        ]),
        ...ancientDifferenceProblemMap.edges.filter((edge) => phase.nodes.some((node) => node.id === edge.from || node.id === edge.to)).flatMap((edge) => [edge.relation, edge.label, edge.connection]),
      ], needle)) results.push({ kind: "problem", id: phase.id, title: phase.title, meta: `${phase.label} · 问题图谱` });
    });
    chapters.forEach((chapter) => {
      const note = notes[chapter.id];
      if (includesText([chapter.title, chapter.english, chapter.part, ...chapter.themes, note?.summary, ...(note?.keyPoints || [])], needle)) results.push({ kind: "chapter", id: chapter.id, title: chapter.title, meta: `${bookNumber[chapter.book]} · 第 ${chapter.roman} 章` });
    });
    terminology.forEach((term) => {
      if (term.entity) return;
      if (includesText([term.zh, term.en, term.note, term.context, term.distinction, ...(term.alternatives || []), ...(term.aliases || []), ...(term.related || [])], needle)) results.push({ kind: "term", id: term.id, title: term.en ? `${term.zh} · ${term.en}` : term.zh, meta: term.category === "地名" ? "地点索引卡" : `${term.category} · 双语术语` });
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
    setPendingHistoryScroll(null);
    setQuery("");
    setCopied(false);
  };

  const openSchool = (id: string, preserveScroll = false, preserveOrigin = false) => {
    if (!preserveOrigin) setSchoolOrigin(null);
    setPendingSchoolScroll(preserveScroll ? window.scrollY : null);
    setSchoolId(id);
    setShowSchoolGraph(false);
    setMode("schools");
    setQuery("");
    setCopied(false);
    scrollWithoutAnimation(0);
  };

  const openSchoolGraph = () => {
    setSchoolOrigin(null);
    setShowSchoolGraph(true);
    setMode("schools");
    setQuery("");
    setCopied(false);
    scrollWithoutAnimation(0);
  };

  const openPhilosopher = (id: string, preserveOrigin = false, preserveScroll = false) => {
    if (!preserveOrigin) setPhilosopherOrigin(null);
    setShowPhilosopherGraph(false);
    setPendingPhilosopherScroll(preserveScroll ? window.scrollY : null);
    setPhilosopherId(id);
    setMode("philosophers");
    setQuery("");
    setCopied(false);
    scrollWithoutAnimation(0);
  };

  const openPhilosopherGraph = () => {
    setPhilosopherOrigin(null);
    setPendingPhilosopherScroll(null);
    setShowPhilosopherGraph(true);
    setMode("philosophers");
    setQuery("");
    setCopied(false);
    scrollWithoutAnimation(0);
  };

  const openProblemMap = () => {
    setProblemPhaseId(defaultProblemPhaseId);
    setProblemNodeId(defaultProblemNodeId);
    setProblemHistoryOrigin(null);
    setMode("problems");
    setQuery("");
    setCopied(false);
    scrollWithoutAnimation(0);
  };

  const openProblemPhase = (id: string) => {
    const phase = ancientDifferenceProblemMap.phases.find((item) => item.id === id) || ancientDifferenceProblemMap.phases[0];
    const targetNode = phase.nodes.find((node) => node.kind === "问题") || phase.nodes[0];
    setProblemPhaseId(phase.id);
    setProblemNodeId(targetNode.id);
    setProblemHistoryOrigin(null);
    setMode("problems");
    setPendingProblemTargetId("problem-graph");
    setQuery("");
    setCopied(false);
  };

  const observeProblemPhase = useCallback((id: string) => {
    setProblemPhaseId((current) => current === id ? current : id);
  }, []);

  const observeProblemNode = useCallback((id: string) => {
    setProblemNodeId((current) => current === id ? current : validProblemNodeId(id));
  }, []);

  const openHistoryFromProblem = (link: ProblemHistoryLink, nodeId: string) => {
    const stage = historyStages.find((item) => item.id === link.stageId) || historyStages[0];
    const response = link.responseId && stage.responses.some((item) => item.id === link.responseId)
      ? link.responseId
      : stage.responses[0].id;
    const node = problemMapNodes.find((item) => item.id === nodeId) || problemMapNodes[0];
    const phase = ancientDifferenceProblemMap.phases.find((item) => item.nodes.some((candidate) => candidate.id === node.id)) || ancientDifferenceProblemMap.phases[0];
    setProblemNodeId(node.id);
    setProblemPhaseId(phase.id);
    setProblemHistoryOrigin({ ...captureProblemViewOrigin(), problemPhaseId: phase.id, problemNodeId: node.id, scrollY: window.scrollY, label: `问题图谱 · ${node.title}` });
    setStageId(stage.id);
    setResponseId(response);
    setPendingHistoryScroll(null);
    setMode("history");
    setQuery("");
    setCopied(false);
    scrollWithoutAnimation(0);
  };

  const returnFromProblemHistory = () => {
    if (!problemHistoryOrigin) return;
    restoreProblemPreferences(problemHistoryOrigin.problemPreferences);
    setPendingGraphScroll(problemHistoryOrigin.problemGraphScroll || null);
    setProblemPhaseId(problemHistoryOrigin.problemPhaseId);
    setProblemNodeId(problemHistoryOrigin.problemNodeId);
    setPendingModeScroll(problemHistoryOrigin.scrollY);
    setMode("problems");
    setProblemHistoryOrigin(null);
    setQuery("");
    setCopied(false);
  };

  const openHistoryOverview = () => {
    setProblemHistoryOrigin(null);
    setPendingHistoryScroll(null);
    setMode("history");
    setQuery("");
    setCopied(false);
    scrollWithoutAnimation(0);
  };

  const openPhilosopherFromSchool = (id: string, sectionLabel: string) => {
    setPhilosopherOrigin({ source: "school", schoolId: selectedSchool.id, scrollY: window.scrollY, label: `${selectedSchool.nameZh} · ${sectionLabel}` });
    openPhilosopher(id, true);
  };

  const historyOrigin = (sectionLabel: string): HistoryOrigin => ({
    stageId: selectedStage.id,
    responseId: selectedResponse.id,
    scrollY: window.scrollY,
    label: `${selectedStage.title} · ${selectedResponse.title} · ${sectionLabel}`,
  });

  const openSchoolFromHistory = (id: string) => {
    setSchoolOrigin({ source: "history", ...historyOrigin("相关流派") });
    openSchool(id, false, true);
  };

  const openSchoolFromPhilosopher = (id: string) => {
    setSchoolOrigin({ source: "philosopher", philosopherId: selectedPhilosopher.id, scrollY: window.scrollY, label: `${selectedPhilosopher.nameZh} · 所属流派` });
    openSchool(id, false, true);
  };

  const openPhilosopherFromHistory = (id: string) => {
    setPhilosopherOrigin({ source: "history", ...historyOrigin("关键哲学家") });
    openPhilosopher(id, true);
  };

  const returnToHistory = (origin: HistoryOrigin) => {
    setStageId(origin.stageId);
    setResponseId(origin.responseId);
    setPendingHistoryScroll(origin.scrollY);
    setMode("history");
    setQuery("");
    setCopied(false);
  };

  const returnFromSchool = () => {
    if (!schoolOrigin) return;
    if (schoolOrigin.source === "history") returnToHistory(schoolOrigin);
    else {
      setPhilosopherId(schoolOrigin.philosopherId);
      setShowPhilosopherGraph(false);
      setPendingPhilosopherScroll(schoolOrigin.scrollY);
      setMode("philosophers");
      setQuery("");
      setCopied(false);
    }
    setSchoolOrigin(null);
  };

  const returnFromPhilosopher = () => {
    if (!philosopherOrigin) return;
    if (philosopherOrigin.source === "school") {
      setSchoolId(philosopherOrigin.schoolId);
      setShowSchoolGraph(false);
      setPendingSchoolScroll(philosopherOrigin.scrollY);
      setMode("schools");
      setQuery("");
      setCopied(false);
    } else {
      returnToHistory(philosopherOrigin);
    }
    setPhilosopherOrigin(null);
  };

  const openInlineEntity = (entity: NonNullable<TermEntry["entity"]> | { kind: "problem"; id: string; target: ReadingTarget }) => {
    if (entity.kind === "school" && mode === "schools" && !showSchoolGraph && schoolId === entity.id) return;
    if (entity.kind === "philosopher" && mode === "philosophers" && !showPhilosopherGraph && philosopherId === entity.id) return;
    const sourceLabel = mode === "history"
      ? `${selectedStage.title} · ${selectedResponse.title}`
      : mode === "schools"
        ? `哲学流派 · ${showSchoolGraph ? "流派图谱" : selectedSchool.nameZh}`
        : mode === "philosophers"
          ? `哲学家 · ${showPhilosopherGraph ? "哲学家图谱" : selectedPhilosopher.nameZh}`
          : mode === "problems"
            ? `问题图谱 · ${ancientDifferenceProblemMap.phases.find((phase) => phase.id === problemPhaseId)?.title || ancientDifferenceProblemMap.title}`
          : mode === "chapters"
            ? `原书索引 · ${selectedChapter.title}`
            : mode === "methods"
              ? `方法图谱 · ${selectedMethod.title}`
              : `关系复习 · ${reviewStage.title}`;
    setInlineEntityOrigin({
      target: entity.kind,
      ...(mode === "problems" ? captureProblemViewOrigin() : {}),
      problemHistoryOrigin,
      mode,
      schoolId,
      showSchoolGraph,
      philosopherId,
      showPhilosopherGraph,
      stageId,
      responseId,
      methodId,
      problemPhaseId,
      problemNodeId,
      chapterId,
      reviewIndex,
      chapterOrigin,
      schoolOrigin,
      philosopherOrigin,
      previousInlineEntityOrigin: inlineEntityOrigin,
      label: entity.kind === "problem" ? sourceLabel : `${sourceLabel} · 正文提及的${entity.kind === "school" ? "流派" : "哲学家"}`,
      scrollY: window.scrollY,
    });
    if (entity.kind === "problem") {
      setReadingTarget(entity.target);
      setProblemNodeId(entity.target.nodeId);
      setProblemPhaseId(knowledgePhaseByNodeId.get(entity.target.nodeId)?.id || defaultProblemPhaseId);
      setMode("problems");
      setQuery("");
      setCopied(false);
    } else if (entity.kind === "school") openSchool(entity.id, false, true);
    else openPhilosopher(entity.id, true);
  };

  const returnFromInlineEntity = () => {
    if (!inlineEntityOrigin) return;
    const origin = inlineEntityOrigin;
    if (origin.mode === "problems") {
      restoreProblemPreferences(origin.problemPreferences);
      setPendingGraphScroll(origin.problemGraphScroll || null);
    }
    setSchoolId(origin.schoolId);
    setShowSchoolGraph(origin.showSchoolGraph);
    setPhilosopherId(origin.philosopherId);
    setShowPhilosopherGraph(origin.showPhilosopherGraph);
    setStageId(origin.stageId);
    setResponseId(origin.responseId);
    setMethodId(origin.methodId);
    setProblemPhaseId(origin.problemPhaseId);
    setProblemNodeId(origin.problemNodeId);
    setChapterId(origin.chapterId);
    setReviewIndex(origin.reviewIndex);
    setChapterOrigin(origin.chapterOrigin);
    setSchoolOrigin(origin.schoolOrigin);
    setPhilosopherOrigin(origin.philosopherOrigin);
    setProblemHistoryOrigin(origin.problemHistoryOrigin || null);
    setMode(origin.mode);
    if (origin.mode === "history") setPendingHistoryScroll(origin.scrollY);
    if (origin.mode === "schools") setPendingSchoolScroll(origin.scrollY);
    if (origin.mode === "philosophers") setPendingPhilosopherScroll(origin.scrollY);
    if (origin.mode === "chapters") setPendingChapterScroll(origin.scrollY);
    if (origin.mode === "methods" || origin.mode === "review" || origin.mode === "problems") setPendingModeScroll(origin.scrollY);
    setInlineEntityOrigin(origin.previousInlineEntityOrigin);
    setQuery("");
    setCopied(false);
  };

  const openChapter = (id: string) => {
    if (mode !== "chapters") {
      const label = mode === "schools"
          ? `哲学流派 · ${selectedSchool.nameZh}`
        : mode === "philosophers"
          ? `哲学家 · ${selectedPhilosopher.nameZh}`
        : mode === "history"
        ? `${selectedStage.title} · ${selectedResponse.title}`
        : mode === "problems"
          ? `问题图谱 · ${ancientDifferenceProblemMap.phases.find((phase) => phase.id === problemPhaseId)?.title || ancientDifferenceProblemMap.title}`
        : mode === "methods"
          ? `方法图谱 · ${selectedMethod.title}`
          : `关系复习 · ${reviewStage.title}`;
      setChapterOrigin({ ...(mode === "problems" ? captureProblemViewOrigin() : {}), mode, schoolId, philosopherId, stageId, responseId, methodId, problemPhaseId, problemNodeId, reviewIndex, label, scrollY: window.scrollY });
    }
    setChapterId(id);
    setMode("chapters");
    setQuery("");
    setCopied(false);
    scrollWithoutAnimation(0);
  };

  const returnFromChapter = () => {
    if (!chapterOrigin) {
      setMode("history");
      return;
    }
    setSchoolId(chapterOrigin.schoolId);
    setPhilosopherId(chapterOrigin.philosopherId);
    setStageId(chapterOrigin.stageId);
    setResponseId(chapterOrigin.responseId);
    setMethodId(chapterOrigin.methodId);
    setProblemPhaseId(chapterOrigin.problemPhaseId);
    if (chapterOrigin.problemNodeId) setProblemNodeId(validProblemNodeId(chapterOrigin.problemNodeId));
    if (chapterOrigin.mode === "problems") {
      restoreProblemPreferences(chapterOrigin.problemPreferences);
      setPendingGraphScroll(chapterOrigin.problemGraphScroll || null);
    }
    setReviewIndex(chapterOrigin.reviewIndex);
    setMode(chapterOrigin.mode);
    if (chapterOrigin.mode === "history") setPendingHistoryScroll(chapterOrigin.scrollY);
    if (chapterOrigin.mode === "schools") setPendingSchoolScroll(chapterOrigin.scrollY);
    if (chapterOrigin.mode === "philosophers") setPendingPhilosopherScroll(chapterOrigin.scrollY);
    if (chapterOrigin.mode === "methods" || chapterOrigin.mode === "review" || chapterOrigin.mode === "problems") setPendingModeScroll(chapterOrigin.scrollY);
    setQuery("");
    setCopied(false);
  };

  const openSearchResult = (result: SearchResult) => {
    setInlineEntityOrigin(null);
    if (result.kind === "stage") openStage(result.id);
    if (result.kind === "response") openStage(result.stageId, result.id);
    if (result.kind === "school") openSchool(result.id);
    if (result.kind === "philosopher") openPhilosopher(result.id);
    if (result.kind === "method") { setMethodId(result.id); setMode("methods"); setQuery(""); }
    if (result.kind === "problem") openProblemPhase(result.id);
    if (result.kind === "chapter") openChapter(result.id);
    if (result.kind === "place") { setActivePlace(geographyEntries.find((place) => place.id === result.id) || null); setQuery(""); }
    if (result.kind === "term") { setActiveTerm(terminology.find((term) => term.id === result.id) || null); setQuery(""); }
    setMobileSearchOpen(false);
  };

  const toggleEnglishTerms = () => {
    const next = !showEnglishTerms;
    setShowEnglishTerms(next);
    saveLocalValue("ahowp-bilingual-terms", String(next));
  };

  const enterFirstHistoryStage = () => {
    const firstStage = historyStages[0];
    setStageId(firstStage.id);
    setResponseId(firstStage.responses[0].id);
    setMode("history");
    setChapterOrigin(null);
    setSchoolOrigin(null);
    setPhilosopherOrigin(null);
    setInlineEntityOrigin(null);
    setProblemHistoryOrigin(null);
    setQuery("");
    setCopied(false);
    setShowLanding(false);
    scrollWithoutAnimation(0);
  };

  const resumeLearning = () => {
    if (!lastSession) return;
    const resumedStage = historyStages.find((item) => item.id === lastSession.stageId) || historyStages[0];
    const resumedSchool = schoolProfiles.find((item) => item.id === lastSession.schoolId) || schoolProfiles[0];
    const resumedPhilosopher = philosopherProfiles.find((item) => item.id === lastSession.philosopherId) || philosopherProfiles[0];
    const resumedMethod = methodAtlas.find((item) => item.id === lastSession.methodId) || methodAtlas[0];
    const resumedChapter = chapters.find((item) => item.id === lastSession.chapterId) || chapters[0];
    setMode(lastSession.mode);
    setSchoolId(resumedSchool.id);
    setShowSchoolGraph(lastSession.showSchoolGraph);
    setPhilosopherId(resumedPhilosopher.id);
    setShowPhilosopherGraph(lastSession.showPhilosopherGraph);
    setStageId(resumedStage.id);
    setResponseId(resumedStage.responses.some((item) => item.id === lastSession.responseId) ? lastSession.responseId : resumedStage.responses[0].id);
    setMethodId(resumedMethod.id);
    setProblemPhaseId(ancientDifferenceProblemMap.phases.some((phase) => phase.id === lastSession.problemPhaseId) ? lastSession.problemPhaseId : ancientDifferenceProblemMap.phases[0].id);
    setProblemNodeId(validProblemNodeId(lastSession.problemNodeId));
    setChapterId(resumedChapter.id);
    setReviewIndex(lastSession.reviewIndex % historyStages.length);
    setChapterOrigin(lastSession.chapterOrigin);
    setSchoolOrigin(lastSession.schoolOrigin);
    setPhilosopherOrigin(lastSession.philosopherOrigin);
    setInlineEntityOrigin(lastSession.inlineEntityOrigin);
    setProblemHistoryOrigin(lastSession.problemHistoryOrigin);
    setPendingHistoryScroll(null);
    setPendingSchoolScroll(null);
    setPendingPhilosopherScroll(null);
    setPendingChapterScroll(null);
    setPendingProblemTargetId(null);
    setPendingModeScroll(null);
    setPendingResumeScroll(lastSession.scrollY);
    setQuery("");
    setCopied(false);
    setShowLanding(false);
  };

  const openLanding = () => {
    const next = makeLearningSession(window.scrollY);
    saveLocalValue(learningSessionKey, JSON.stringify(next));
    setLastSession(next);
    setShowLanding(true);
    scrollWithoutAnimation(0);
  };

  const showSchoolSidebar = mode === "schools" && !query;
  const showPhilosopherSidebar = mode === "philosophers" && !query;
  const showProblemSidebar = mode === "problems" && !query;
  const showStageSidebar = mode !== "chapters" && mode !== "schools" && mode !== "philosophers" && mode !== "problems" && !query;
  const isMobileMainMode = mode === "history" || mode === "schools" || mode === "philosophers" || mode === "problems";
  const showMobileSearch = mobileSearchOpen || (!!query && isMobileMainMode);
  const sidebarFocusKey = query
    ? null
    : mode === "history"
      ? `stage:${stageId}`
      : mode === "schools"
        ? showSchoolGraph ? "school-graph" : `school:${schoolId}`
        : mode === "philosophers"
          ? showPhilosopherGraph ? "philosopher-graph" : `philosopher:${philosopherId}`
          : mode === "problems"
            ? null
          : null;
  const schoolInlineOrigin = inlineEntityOrigin?.target === "school" ? inlineEntityOrigin : null;
  const philosopherInlineOrigin = inlineEntityOrigin?.target === "philosopher" ? inlineEntityOrigin : null;
  const mobileRailItems: MobileRailItem[] = mode === "history"
    ? historyStages.map((stage, index) => ({
      key: `stage:${stage.id}`,
      badge: String(index + 1).padStart(2, "0"),
      marker: `阶段 ${String(index + 1).padStart(2, "0")} · ${stage.years}`,
      title: stage.title,
      detail: stage.transition,
      onSelect: () => openStage(stage.id),
    }))
    : mode === "schools"
      ? [
        { key: "school-graph", badge: "◇", marker: "关系入口", title: "流派图谱", detail: "按关系密度合并 · 明确分类边界", onSelect: openSchoolGraph },
        ...schoolProfiles.map((school) => ({
          key: `school:${school.id}`,
          badge: String(school.order).padStart(2, "0"),
          marker: `流派 ${String(school.order).padStart(2, "0")} · ${school.kind}`,
          title: school.nameZh,
          detail: `${school.nameEn} · ${"★".repeat(school.stars || 1)}`,
          onSelect: () => openSchool(school.id, true, true),
        })),
      ]
      : mode === "philosophers"
        ? [
          { key: "philosopher-graph", badge: "◇", marker: "关系入口", title: "哲学家图谱", detail: "按人物索引整理 · 查看承接与影响", onSelect: openPhilosopherGraph },
          ...philosopherProfiles.map((profile) => ({
            key: `philosopher:${profile.id}`,
            badge: String(profile.order).padStart(2, "0"),
            marker: `人物 ${String(profile.order).padStart(2, "0")} · ${profile.dates}`,
            title: profile.nameZh,
            detail: `${profile.nameEn} · ${"★".repeat(profile.stars || 1)}`,
            imagePath: figureEntries.find((figure) => figure.id === profile.figureId)?.imagePath,
            rating: `${profile.stars || 1}星`,
            onSelect: () => openPhilosopher(profile.id, true, true),
          })),
        ]
        : mode === "problems"
          ? []
        : [];

  useLayoutEffect(() => {
    if (showLanding || !sidebarFocusKey) return;
    const frame = window.requestAnimationFrame(() => {
      const container = sidebarScrollRef.current;
      const item = container?.querySelector<HTMLElement>(`[data-sidebar-focus="${sidebarFocusKey}"]`);
      if (!container || !item) return;
      const containerRect = container.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();
      const nextTop = container.scrollTop + itemRect.top - containerRect.top - (container.clientHeight - itemRect.height) / 2;
      container.scrollTo({ top: Math.max(0, nextTop), behavior: "auto" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [showLanding, sidebarFocusKey]);

  if (showLanding) {
    return <LandingPage session={lastSession} storageReady={sessionStorageReady} onBegin={enterFirstHistoryStage} onResume={resumeLearning} />;
  }

  return (
    <KnowledgeNavigationContext.Provider value={(target) => openInlineEntity({ kind: "problem", id: target.nodeId, target })}>
    <EntityNavigationContext.Provider value={openInlineEntity}>
    <PlaceInteractionContext.Provider value={setActivePlace}>
    <main className={`app-shell app-mode-${mode}${showMobileSearch ? " mobile-search-open" : ""}`}>
      <aside className="sidebar">
        <button className="identity identity-button" type="button" onClick={openLanding} aria-label="回到学习入口"><div className="brand-mark" aria-hidden="true">AH</div><div><p className="eyebrow">BERTRAND RUSSELL</p><h1>西方哲学史</h1><p className="subtitle">历史关系学习地图 · 返回首页</p></div></button>
        <label className="search-box"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="搜索全站" placeholder="搜索流派、人物、时代或章节…" />{query && <button type="button" aria-label="清空搜索" onClick={() => setQuery("")}>×</button>}</label>

        {mode === "chapters" && !query && <div className="book-filters" aria-label="按卷筛选"><button className={bookFilter === "all" ? "active" : ""} onClick={() => setBookFilter("all")}>全部</button><button className={bookFilter === "ancient" ? "active" : ""} onClick={() => setBookFilter("ancient")}>古代</button><button className={bookFilter === "catholic" ? "active" : ""} onClick={() => setBookFilter("catholic")}>中世纪</button><button className={bookFilter === "modern" ? "active" : ""} onClick={() => setBookFilter("modern")}>近现代</button></div>}

        <div className="sidebar-scroll" ref={sidebarScrollRef}>
          {query ? <div className="search-results"><div className="results-label"><span>跨层搜索</span><b>{searchResults.length}</b></div>{!searchResults.length && <div className="empty-result">没有匹配内容。试试“自由”“变化”“帝国”或“Kant”。</div>}{searchResults.map((result) => <button className="search-result" key={`${result.kind}-${result.id}`} onClick={() => openSearchResult(result)}><span>{result.kind === "stage" ? "阶段" : result.kind === "response" ? "回应" : result.kind === "school" ? "流派" : result.kind === "philosopher" ? "哲学家" : result.kind === "method" ? "方法" : result.kind === "problem" ? "问题" : result.kind === "term" ? "术语" : result.kind === "place" ? "地点" : "章节"}</span><b>{result.title}</b><small>{result.meta}</small></button>)}</div>
          : showSchoolSidebar ? <nav className="school-index" aria-label="哲学流派与传统索引"><div className="results-label"><span>第二层 · 流派与传统</span><b>{schoolProfiles.length}</b></div><button className={showSchoolGraph ? "school-map-index-link active" : "school-map-index-link"} data-sidebar-focus="school-graph" onClick={openSchoolGraph}><span>◇</span><b>流派图谱</b><small>按关系密度合并 · 明确分类边界</small></button>{schoolProfiles.map((school) => { const stars = school.stars || 1; return <button className={!showSchoolGraph && school.id === schoolId ? "school-index-link active" : "school-index-link"} data-sidebar-focus={`school:${school.id}`} key={school.id} onClick={() => openSchool(school.id, true, true)} aria-label={`${school.nameZh}，${stars}星`}><span>{String(school.order).padStart(2, "0")}<small className="school-index-rating" aria-label={`${stars}星`} title={`${stars}星`}>{"★".repeat(stars)}</small></span><b>{school.nameZh}</b><em>{school.nameEn}</em><i>{school.kind}</i></button>; })}</nav>
          : showPhilosopherSidebar ? <nav className="philosopher-nav" aria-label="哲学家索引"><div className="results-label"><span>人物页面 · 已收录</span><b>{philosopherProfiles.length}</b></div><button className={showPhilosopherGraph ? "school-map-index-link active" : "school-map-index-link"} data-sidebar-focus="philosopher-graph" onClick={openPhilosopherGraph}><span aria-hidden="true">↔</span><b>哲学家图谱</b><small>按人物索引整理 · 查看承接与影响</small></button><div className="structure-notice">依原书出现顺序 · 证据分层整理</div>{philosopherProfiles.map((profile) => { const figure = figureEntries.find((item) => item.id === profile.figureId); const stars = profile.stars || 1; return <button className={!showPhilosopherGraph && profile.id === philosopherId ? "philosopher-link active" : "philosopher-link"} data-sidebar-focus={`philosopher:${profile.id}`} key={profile.id} onClick={() => openPhilosopher(profile.id, true, true)}><span className="philosopher-link-visual">{figure ? <img src={figure.imagePath} alt="" /> : <span className="philosopher-link-monogram">{profile.nameZh.slice(0, 1)}</span>}<span className="philosopher-link-rating" aria-label={`${stars}星`} title={`${stars}星`}>{"★".repeat(stars)}</span></span><span><small>{String(profile.order).padStart(2, "0")} · {profile.dates}</small><b>{profile.nameZh}</b><em>{profile.nameEn}</em></span><i>{profile.school}</i></button>; })}</nav>
          : showProblemSidebar ? <section className="problem-detail-sidebar" aria-label="当前图谱节点详情"><div className="results-label"><span>问题图谱 · 节点详情</span><b>观察 / 问题 / 答案</b></div><div id="problem-detail-sidebar-host" /></section>
          : showStageSidebar ? <nav className="stage-nav" aria-label="历史概览阶段"><div className="results-label"><span>主线 · 历史概览</span><b>{historyStages.length}</b></div>{historyStages.map((stage, index) => <button className={stage.id === stageId ? "stage-link active" : "stage-link"} data-sidebar-focus={`stage:${stage.id}`} key={stage.id} onClick={() => openStage(stage.id)}><span className="stage-index">{String(index + 1).padStart(2, "0")}</span><span><small>{stage.years}</small><b>{stage.title}</b><em>{stage.transition}</em></span><i>{stage.coverage === "personal" ? "笔记" : "原书"}</i></button>)}</nav>
          : <div className="chapter-list" aria-label="全书章节"><div className="results-label"><span>原书目录</span><b>{filteredChapters.length}</b></div>{bookOrder.map((book) => { const items = filteredChapters.filter((chapter) => chapter.book === book); if (!items.length) return null; return <section key={book} className="chapter-group"><p className="group-title">{bookNumber[book]} · {bookLabels[book].title}</p>{items.map((chapter) => { const chapterFigures = figuresForChapter(chapter.title); return <button className={`${chapter.id === selectedChapter.id ? "chapter-link active" : "chapter-link"}${chapterFigures.length ? " has-portrait" : ""}`} key={chapter.id} onClick={() => openChapter(chapter.id)}>{chapterFigures.length > 0 && <span className="chapter-thumbnails" aria-hidden="true">{chapterFigures.slice(0, 2).map((figure) => <img key={figure.id} src={figure.imagePath} alt="" />)}</span>}<span className="chapter-roman">{chapter.roman}</span><span className="chapter-name">{chapter.title}<small>{chapter.english}</small></span><span className="chapter-status">{starredChapters.has(chapter.id) ? "★" : notes[chapter.id] ? "●" : ""}</span></button>; })}</section>; })}</div>}
        </div>
        <div className="sidebar-footer"><span>骨架：罗素目录＋历史</span><span>阶段 → 流派 → 人物 → 章节</span></div>
      </aside>

      <section className="reading-pane">
        <header className="topbar"><nav className="mode-tabs" aria-label="学习视图"><button className={mode === "history" ? "active" : ""} onClick={openHistoryOverview}>历史概览</button><button className={mode === "schools" ? "active" : ""} onClick={openSchoolGraph}>哲学流派</button><button className={mode === "philosophers" ? "active" : ""} onClick={openPhilosopherGraph}>哲学家</button><button className={mode === "problems" ? "active" : ""} onClick={openProblemMap}>问题图谱</button><button className={mode === "chapters" ? "active" : ""} onClick={() => { setChapterOrigin(null); setMode("chapters"); }}>原书索引</button><button className={mode === "methods" ? "active" : ""} onClick={() => setMode("methods")}>方法图谱</button><button className={mode === "review" ? "active" : ""} onClick={() => setMode("review")}>关系复习</button></nav><div className="topbar-tools"><span className="zoom-path">全书 <i>›</i> {mode === "schools" ? showSchoolGraph ? "流派图谱" : selectedSchool.nameZh : mode === "philosophers" ? showPhilosopherGraph ? "哲学家图谱" : selectedPhilosopher.nameZh : mode === "problems" ? "观察—问题—答案" : mode === "history" ? selectedStage.title : mode === "methods" ? selectedMethod.title : mode === "chapters" ? selectedChapter.title : "主动回忆"}</span><button className="mobile-search-toggle" type="button" onClick={() => { if (showMobileSearch) { setQuery(""); setMobileSearchOpen(false); } else setMobileSearchOpen(true); }} aria-label="搜索全站" aria-expanded={showMobileSearch}>⌕</button><button className={showEnglishTerms ? "language-toggle active" : "language-toggle"} onClick={toggleEnglishTerms} aria-pressed={showEnglishTerms}><span>术语</span><b>{showEnglishTerms ? "中英" : "中文"}</b></button></div></header>
        {showMobileSearch ? <MobileSearchPanel query={query} results={searchResults} onQueryChange={setQuery} onResult={openSearchResult} onClose={() => { setQuery(""); setMobileSearchOpen(false); }} /> : mobileRailItems.length > 0 && <MobileObjectRail label={mode === "history" ? "历史阶段" : mode === "schools" ? "哲学流派" : "哲学家"} activeKey={sidebarFocusKey || mobileRailItems[0].key} items={mobileRailItems} />}
        {mode === "schools" && (showSchoolGraph ? <SchoolGraphView initialSchoolId={selectedSchool.id} onSchool={openSchool} /> : <SchoolView profile={selectedSchool} onSchool={(id) => openSchool(id, false, true)} onPhilosopher={openPhilosopherFromSchool} onChapter={openChapter} originLabel={schoolInlineOrigin?.label || schoolOrigin?.label} onBack={schoolInlineOrigin ? returnFromInlineEntity : schoolOrigin ? returnFromSchool : undefined} showEnglish={showEnglishTerms} onTerm={setActiveTerm} />)}
        {mode === "philosophers" && (showPhilosopherGraph ? <PhilosopherGraphView initialPhilosopherId={selectedPhilosopher.id} onPhilosopher={openPhilosopher} /> : <PhilosopherView profile={selectedPhilosopher} onSchool={openSchoolFromPhilosopher} onChapter={openChapter} originLabel={philosopherInlineOrigin?.label || philosopherOrigin?.label} onBack={philosopherInlineOrigin ? returnFromInlineEntity : philosopherOrigin ? returnFromPhilosopher : undefined} showEnglish={showEnglishTerms} onTerm={setActiveTerm} />)}
        {mode === "problems" && <ProblemMapView initialReadingTarget={readingTarget} onReadingTargetConsumed={consumeReadingTarget} originLabel={inlineEntityOrigin?.target === "problem" ? inlineEntityOrigin.label : undefined} onBack={inlineEntityOrigin?.target === "problem" ? returnFromInlineEntity : undefined} activePhaseId={problemPhaseId} activeNodeId={problemNodeId} onPhaseChange={observeProblemPhase} onNodeChange={observeProblemNode} onPhilosopher={(id) => openInlineEntity({ kind: "philosopher", id })} onSchool={(id) => openInlineEntity({ kind: "school", id })} onHistory={openHistoryFromProblem} onChapter={openChapter} showEnglish={showEnglishTerms} renderText={(text) => <TermText text={text} showEnglish={showEnglishTerms} onTerm={setActiveTerm} />} />}
        {mode === "history" && <HistoryView key={selectedStage.id} stage={selectedStage} response={selectedResponse} onResponse={setResponseId} onSchool={openSchoolFromHistory} onPhilosopher={openPhilosopherFromHistory} onChapter={openChapter} originLabel={problemHistoryOrigin?.label} onBack={problemHistoryOrigin ? returnFromProblemHistory : undefined} showEnglish={showEnglishTerms} onTerm={setActiveTerm} />}
        {mode === "methods" && <MethodsView method={selectedMethod} onMethod={setMethodId} onStage={openStage} showEnglish={showEnglishTerms} onTerm={setActiveTerm} />}
        {mode === "chapters" && <ChapterView chapter={selectedChapter} note={selectedNote} starred={starredChapters.has(selectedChapter.id)} onStar={() => toggleSet(selectedChapter.id, starredChapters, "ahowp-starred", setStarredChapters)} copied={copied} onCopy={async () => { await navigator.clipboard?.writeText(`《西方哲学史》PDF 第 ${selectedChapter.pdfPage} 页`); setCopied(true); }} onTheme={(theme) => setQuery(theme)} originLabel={chapterOrigin?.label} onBack={returnFromChapter} showEnglish={showEnglishTerms} onTerm={setActiveTerm} />}
        {mode === "review" && <ReviewView stage={reviewStage} index={reviewIndex} flipped={flipped} reviewed={reviewedStages.has(reviewStage.id)} onFlip={() => setFlipped(!flipped)} onOpen={() => openStage(reviewStage.id)} onNext={() => { const next = new Set(reviewedStages).add(reviewStage.id); persistSet("ahowp-stage-reviewed", next, setReviewedStages); setReviewIndex((value) => (value + 1) % historyStages.length); setFlipped(false); }} showEnglish={showEnglishTerms} onTerm={setActiveTerm} />}
      </section>
      {activeTerm && <TermModal term={activeTerm} onClose={() => setActiveTerm(null)} />}
      {activePlace && <PlaceModal place={activePlace} onClose={() => setActivePlace(null)} />}
    </main>
    </PlaceInteractionContext.Provider>
    </EntityNavigationContext.Provider>
    </KnowledgeNavigationContext.Provider>
  );
}

function MobileObjectRail({ label, activeKey, items }: { label: string; activeKey: string; items: MobileRailItem[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const settleTimerRef = useRef<number | null>(null);

  const centerItem = useCallback((key: string) => {
    const rail = railRef.current;
    const item = rail?.querySelector<HTMLElement>(`[data-mobile-rail-focus="${key}"]`);
    if (!rail || !item) return;
    rail.scrollTo({ left: Math.max(0, item.offsetLeft - (rail.clientWidth - item.clientWidth) / 2), behavior: "auto" });
  }, []);

  useLayoutEffect(() => {
    const frame = window.requestAnimationFrame(() => centerItem(activeKey));
    const rail = railRef.current;
    const observer = rail ? new ResizeObserver(() => centerItem(activeKey)) : null;
    if (rail) observer?.observe(rail);
    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [activeKey, centerItem]);

  useEffect(() => () => {
    if (settleTimerRef.current !== null) window.clearTimeout(settleTimerRef.current);
  }, []);

  const selectNearest = () => {
    const rail = railRef.current;
    if (!rail) return;
    const center = rail.scrollLeft + rail.clientWidth / 2;
    const nearest = [...rail.querySelectorAll<HTMLElement>("[data-mobile-rail-focus]")].reduce<HTMLElement | null>((closest, item) => {
      if (!closest) return item;
      const distance = Math.abs(item.offsetLeft + item.clientWidth / 2 - center);
      const closestDistance = Math.abs(closest.offsetLeft + closest.clientWidth / 2 - center);
      return distance < closestDistance ? item : closest;
    }, null);
    const key = nearest?.dataset.mobileRailFocus;
    const next = items.find((item) => item.key === key);
    if (next && next.key !== activeKey) next.onSelect();
  };

  const onScroll = () => {
    if (settleTimerRef.current !== null) window.clearTimeout(settleTimerRef.current);
    settleTimerRef.current = window.setTimeout(selectNearest, 120);
  };

  const moveByKeyboard = (index: number, direction: -1 | 1) => {
    const next = items[index + direction];
    if (!next) return;
    next.onSelect();
    window.requestAnimationFrame(() => railRef.current?.querySelector<HTMLElement>(`[data-mobile-rail-focus="${next.key}"]`)?.focus());
  };

  return <section className="mobile-object-rail" aria-label={`${label}滑动索引`}>
    <header><span>{label}</span><small>左右滑动切换</small></header>
    <div className="mobile-object-rail-track" ref={railRef} onScroll={onScroll}>
      {items.map((item, index) => <button className={item.key === activeKey ? "active" : ""} data-mobile-rail-focus={item.key} key={item.key} onClick={item.onSelect} onKeyDown={(event) => {
        if (event.key === "ArrowLeft") { event.preventDefault(); moveByKeyboard(index, -1); }
        if (event.key === "ArrowRight") { event.preventDefault(); moveByKeyboard(index, 1); }
      }} aria-label={`${item.title}；${item.detail}`}>
        {item.imagePath ? <img src={item.imagePath} alt="" /> : <span className="mobile-rail-marker" aria-hidden="true">{item.badge}</span>}
        <span className="mobile-rail-copy"><small>{item.marker}</small><b>{item.title}</b><em>{item.detail}</em></span>
        {item.rating && <i aria-hidden="true">{item.rating}</i>}
      </button>)}
    </div>
  </section>;
}

function MobileSearchPanel({ query, results, onQueryChange, onResult, onClose }: { query: string; results: SearchResult[]; onQueryChange: (value: string) => void; onResult: (result: SearchResult) => void; onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return <section className="mobile-search-panel" aria-label="全站搜索">
    <label><span aria-hidden="true">⌕</span><input ref={inputRef} value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="搜索流派、人物、时代或章节…" /></label>
    <button type="button" onClick={onClose}>取消</button>
    {query && <div className="mobile-search-results"><div><span>跨层搜索</span><b>{results.length}</b></div>{!results.length && <p>没有匹配内容。试试“自由”“变化”“5星”或“Kant”。</p>}{results.map((result) => <button key={`${result.kind}-${result.id}`} onClick={() => onResult(result)}><span>{result.kind === "stage" ? "阶段" : result.kind === "response" ? "回应" : result.kind === "school" ? "流派" : result.kind === "philosopher" ? "哲学家" : result.kind === "method" ? "方法" : result.kind === "problem" ? "问题" : result.kind === "term" ? "术语" : result.kind === "place" ? "地点" : "章节"}</span><b>{result.title}</b><small>{result.meta}</small></button>)}</div>}
  </section>;
}

function LandingPage({ session, storageReady, onBegin, onResume }: { session: LearningSession | null; storageReady: boolean; onBegin: () => void; onResume: () => void }) {
  const firstStage = historyStages[0];
  const savedStage = session ? historyStages.find((item) => item.id === session.stageId) : null;
  const savedSchool = session ? schoolProfiles.find((item) => item.id === session.schoolId) : null;
  const savedPhilosopher = session ? philosopherProfiles.find((item) => item.id === session.philosopherId) : null;
  const savedMethod = session ? methodAtlas.find((item) => item.id === session.methodId) : null;
  const savedProblemPhase = session ? ancientDifferenceProblemMap.phases.find((item) => item.id === session.problemPhaseId) : null;
  const savedChapter = session ? chapters.find((item) => item.id === session.chapterId) : null;
  const savedReviewStage = session ? historyStages[session.reviewIndex % historyStages.length] : null;
  const savedLocation = session
    ? session.mode === "history" ? `历史概览 · ${savedStage?.title || "历史阶段"}`
      : session.mode === "schools" ? `哲学流派 · ${session.showSchoolGraph ? "流派图谱" : savedSchool?.nameZh || "流派页面"}`
      : session.mode === "philosophers" ? `哲学家 · ${session.showPhilosopherGraph ? "哲学家图谱" : savedPhilosopher?.nameZh || "人物页面"}`
      : session.mode === "problems" ? `问题图谱 · ${savedProblemPhase?.title || ancientDifferenceProblemMap.title}`
      : session.mode === "methods" ? `方法图谱 · ${savedMethod?.title || "方法页面"}`
      : session.mode === "chapters" ? `原书索引 · ${savedChapter?.title || "章节页面"}`
      : `关系复习 · ${savedReviewStage?.title || "主动回忆"}`
    : "";
  const returnLabel = session
    ? session.mode === "chapters" ? session.chapterOrigin?.label
      : session.mode === "schools" ? session.schoolOrigin?.label
      : session.mode === "philosophers" ? session.philosopherOrigin?.label
      : undefined
    : undefined;
  const savedTime = session ? new Intl.DateTimeFormat("zh-CN", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(session.savedAt)) : "";

  return <main className="landing-page">
    <header className="landing-masthead">
      <div className="landing-brand"><span aria-hidden="true">AH</span><div><p>BERTRAND RUSSELL</p><b>西方哲学史 · 交互学习笔记</b></div></div>
      <p className="landing-edition">HISTORY-FIRST EDITION <span>·</span> 本地阅读进度</p>
    </header>

    <section className="landing-stage">
      <div className="landing-intro">
        <p className="eyebrow">A HISTORY OF WESTERN PHILOSOPHY</p>
        <h1>从历史进入哲学，<br />沿思想关系继续前行。</h1>
        <p className="landing-lead">不把哲学家当作孤立的人名来记忆。先看时代提出了什么问题，再进入流派、人物、概念与罗素原书中的位置。</p>
        <div className="landing-route" aria-label="网站学习路径"><span>历史阶段</span><i>→</i><span>时代问题</span><i>→</i><span>哲学流派</span><i>→</i><span>哲学家</span><i>→</i><span>概念与论证</span><i>→</i><span>原书章节</span></div>
      </div>

      <div className="landing-entry-panel">
        <p className="landing-entry-label">选择进入方式</p>
        <button className="landing-entry landing-entry-primary" type="button" onClick={onBegin}>
          <span className="landing-entry-index">01</span>
          <span><small>从主线起点进入</small><b>开始历史之旅</b><em>{firstStage.years} · {firstStage.title}</em></span>
          <i aria-hidden="true">→</i>
        </button>
        <button className="landing-entry landing-entry-resume" type="button" onClick={onResume} disabled={!storageReady || !session}>
          <span className="landing-entry-index">02</span>
          <span><small>{!storageReady ? "正在读取本机记录" : session ? `上次保存于 ${savedTime}` : "这台设备还没有学习记录"}</small><b>继续上次学习</b><em>{session ? savedLocation : "首次进入后，这里会记住页面与阅读位置"}</em>{returnLabel && <strong>可返回至：{returnLabel}</strong>}</span>
          <i aria-hidden="true">↗</i>
        </button>
        <p className="landing-storage-note"><span aria-hidden="true">◇</span> 页面、滚动位置与访问链保存在当前浏览器；首页不会覆盖它们。</p>
      </div>
    </section>

    <section className="landing-atlas" aria-label="本站内容规模">
      <div><span>01</span><p>历史阶段</p><b>{historyStages.length}</b><small>以时代变化建立主骨架</small></div>
      <div><span>02</span><p>哲学流派</p><b>{schoolProfiles.length}</b><small>比较共同问题与内部张力</small></div>
      <div><span>03</span><p>哲学家</p><b>{philosopherProfiles.length}</b><small>下钻概念、推导与影响关系</small></div>
      <div><span>04</span><p>原书章节</p><b>{chapters.length}</b><small>随时接回罗素的叙述顺序</small></div>
    </section>

    <footer className="landing-footer"><span>骨架：罗素目录＋历史</span><span>阅读不是直线 · 返回始终保留来路</span></footer>
  </main>;
}

function AdaptiveSchoolTitle({ label, children }: { label: string; children: ReactNode }) {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const title = titleRef.current;
    if (!title) return;
    let lastWidth = -1;

    const fitTitle = () => {
      const width = Math.floor(title.getBoundingClientRect().width);
      const isWideLayout = window.matchMedia("(min-width: 1051px)").matches;
      if (!isWideLayout) {
        title.style.removeProperty("--school-title-size");
        lastWidth = width;
        return;
      }
      if (width === lastWidth) return;
      lastWidth = width;
      title.style.setProperty("--school-title-size", "48px");
      const naturalWidth = title.scrollWidth;
      const fittedSize = Math.max(20, Math.min(48, Math.floor((48 * width) / naturalWidth)));
      title.style.setProperty("--school-title-size", `${fittedSize}px`);
    };

    const observer = new ResizeObserver(fitTitle);
    observer.observe(title);
    fitTitle();
    return () => observer.disconnect();
  }, [label]);

  return <h2 ref={titleRef}>{children}</h2>;
}

function SchoolView({ profile, onSchool, onPhilosopher, onChapter, originLabel, onBack, showEnglish, onTerm }: { profile: SchoolProfile; onSchool: (id: string) => void; onPhilosopher: (id: string, sectionLabel: string) => void; onChapter: (id: string) => void; originLabel?: string; onBack?: () => void; showEnglish: boolean; onTerm: (term: TermEntry) => void }) {
  const termText = (text: string) => <TermText text={text} showEnglish={showEnglish} onTerm={onTerm} />;
  const profileById = (id: string) => philosopherProfiles.find((item) => item.id === id);
  const schoolByName = (name: string) => schoolProfiles.find((item) => item.nameZh === name || name.startsWith(item.nameZh) || item.nameZh.startsWith(name));

  return <article className="school-page page-wrap">
    {onBack && <button className="context-back" onClick={onBack}><span>←</span><small>返回刚才的阅读位置</small><b>{originLabel}</b></button>}
    <header className="school-hero">
      <div className="school-hero-index"><span>{String(profile.order).padStart(2, "0")}</span><small>PHILOSOPHICAL TRADITION</small></div>
      <div className="school-hero-title"><p className="eyebrow">{profile.kind}</p><AdaptiveSchoolTitle label={profile.nameZh}><TermText text={profile.nameZh} showEnglish={false} onTerm={onTerm} interactive={false} /></AdaptiveSchoolTitle>{showEnglish && <p className="school-english">{profile.nameEn}</p>}<blockquote>{termText(profile.thesis)}</blockquote></div>
      <aside className="school-facts"><div><span>类型</span><b>{profile.kind}</b></div><div><span>时间</span><b>{profile.period}</b></div><div><span>空间</span><b>{termText(profile.regions.join(" · "))}</b></div><div><span>本站人物</span><b>{profile.philosophers.length} 位相关人物</b></div></aside>
    </header>

    <aside className="school-boundary"><span>分类边界</span><p>{termText(profile.classificationNote)}</p></aside>
    <nav className="school-local-nav" aria-label="本页内容"><a href="#school-context">时代</a><a href="#school-architecture">共同结构</a><a href="#school-philosophers">哲学家</a><a href="#school-development">发展关系</a><a href="#school-influence">影响</a><a href="#school-russell">罗素与来源</a></nav>

    <section className="school-section" id="school-context">
      <header><span>01</span><div><p className="section-label">TIME, PLACE & PRESSURE</p><h3>时间、时代与形成压力</h3></div></header>
      <p className="school-context-overview">{termText(profile.context.overview)}</p>
      <div className="school-factor-grid">{profile.context.factors.map((factor, index) => <article key={factor.title}><span>{String(index + 1).padStart(2, "0")}</span><h4>{termText(factor.title)}</h4><p>{termText(factor.detail)}</p></article>)}</div>
    </section>

    <section className="school-section" id="school-architecture">
      <header><span>02</span><div><p className="section-label">PROBLEM → PREMISE → METHOD → ANSWER</p><h3>共同问题与可重复回答结构</h3></div></header>
      <KnowledgeConnections key={profile.id} context={{ kind: "school", id: profile.id }} renderText={termText} />
      <div className="school-logic-chain"><article><span>共同问题</span><p>{termText(profile.architecture.commonProblem)}</p></article><i aria-hidden="true">→</i><article><span>共享前提</span><p>{termText(profile.architecture.sharedPremise)}</p></article><i aria-hidden="true">→</i><article><span>反复使用的方法</span><p>{termText(profile.architecture.method)}</p></article><i aria-hidden="true">→</i><article><span>代表性回答</span><p>{termText(profile.architecture.answer)}</p></article></div>
      <div className="school-tension-board"><div className="school-subheading"><span>内部张力</span><p>同属一个传统，不等于没有分歧；这些张力正是发展发生的位置。</p></div><div>{profile.architecture.tensions.map((tension) => <article key={tension.title}><h4>{termText(tension.title)}</h4><p>{termText(tension.detail)}</p></article>)}</div></div>
    </section>

    <section className="school-section" id="school-philosophers">
      <header><span>03</span><div><p className="section-label">PEOPLE AS FUNCTIONS IN A TRADITION</p><h3>主要哲学家及其互动</h3></div></header>
      <div className="school-philosopher-grid">{profile.philosophers.map((person) => { const philosopher = profileById(person.id); const figure = philosopher ? figureEntries.find((item) => item.id === philosopher.figureId) : undefined; if (!philosopher) return null; const stars = philosopher.stars || 1; return <button key={person.id} onClick={() => onPhilosopher(person.id, "主要哲学家")} aria-label={`打开哲学家页面：${philosopher.nameZh}，${stars}星`}><span className="school-person-portrait">{figure ? <img src={figure.imagePath} alt="" /> : <i>{philosopher.nameZh.slice(0, 1)}</i>}<span className="school-person-rating" aria-label={`${stars}星`} title={`${stars}星`}>{"★".repeat(stars)}</span></span><span className="school-person-copy"><small>{person.role}</small><b>{philosopher.nameZh}<em>{philosopher.nameEn}</em></b><p>{termText(person.contribution)}</p><span className="school-person-interaction">互动 · {termText(person.interaction)}</span></span><i className="school-person-open" aria-hidden="true">→</i></button>; })}</div>
      <p className="school-person-note">人物卡只说明其在传统中的功能；点击进入“哲学家”页查看生平、概念与核心思想路径，并可由页首箭头返回这里。</p>
    </section>

    <section className="school-section" id="school-development">
      <header><span>04</span><div><p className="section-label">DEVELOPMENT & RELATIONS</p><h3>时间发展、内部变化与流派关系</h3></div></header>
      <div className="school-development-layout">
        <div className="school-development-timeline"><header className="school-subpanel-heading"><span>时间发展</span><small>同一传统在不同时期怎样改变重心</small></header>{profile.development.map((phase, index) => <article key={`${phase.period}-${phase.title}`}><div><span>{String(index + 1).padStart(2, "0")}</span><b>{phase.period}</b></div><div><h4>{termText(phase.title)}</h4><p>{termText(phase.detail)}</p></div></article>)}</div>
        <div className="school-relations">
          <header className="school-subpanel-heading"><span>流派关系</span><small>思想来源 → 竞争 → 分化 → 吸收改造 → 后世重构</small></header>
          {sortSchoolRelations(profile.relations).map((relation) => {
            const linkedSchool = schoolByName(relation.target);
            const relationMeta = schoolRelationMeta[relation.relation];
            const relationAttributes = {
              "data-relation-type": relation.relation,
              "data-relation-direction": relationMeta.direction,
              "data-relation-temporal": relationMeta.temporal,
              "data-relation-mechanism": relationMeta.mechanism,
              "data-relation-order": relationMeta.order,
              "data-target-school-order": linkedSchool?.order,
              title: relationMeta.description,
            };
            const content = <><div className="school-relation-meta"><span className={`school-relation-badge relation-${relation.relation}`}>{relation.relation}</span></div><div><h4>{termText(relation.target)}</h4><p>{termText(relation.detail)}</p></div>{linkedSchool && <i aria-hidden="true">→</i>}</>;
            return linkedSchool ? <button key={`${relation.target}-${relation.relation}`} onClick={() => onSchool(linkedSchool.id)} {...relationAttributes}>{content}</button> : <article key={`${relation.target}-${relation.relation}`} {...relationAttributes}>{content}</article>;
          })}
        </div>
      </div>
    </section>

    <section className="school-section" id="school-influence">
      <header><span>05</span><div><p className="section-label">WHY THIS TRADITION MATTERS</p><h3>影响、意义与可复用遗产</h3></div></header>
      <div className="school-influence-grid">{profile.influence.map((item, index) => <article key={item.field}><span>{String(index + 1).padStart(2, "0")}</span><h4>{termText(item.field)}</h4><p>{termText(item.detail)}</p></article>)}</div>
    </section>

    <section className="school-section" id="school-russell">
      <header><span>06</span><div><p className="section-label">RUSSELL AS GUIDE, NOT FINAL VERDICT</p><h3>罗素的组织方式、现代校正与出处</h3></div></header>
      <div className="russell-correction"><article><span>罗素怎样组织这一传统</span><p>{termText(profile.russellView)}</p></article><article><span>需要补充或修正什么</span><p>{termText(profile.modernCorrection)}</p></article></div>
      <div className="profile-sources"><div><p className="section-label">来源与继续阅读</p><small>原书提供叙述主轴；现代研究用于分类边界、证据等级与内部差异。</small></div><div>{profile.sources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.label}><span>{source.kind}</span><b>{source.label}</b><i aria-hidden="true">↗</i></a>)}</div></div>
      <div className="profile-chapters"><div><p className="section-label">回到原书章节</p><small>流派页负责跨章压缩；章节页保留罗素的原始展开次序。</small></div><div>{profile.chapterIds.map((id) => { const chapter = chapters.find((item) => item.id === id); return chapter ? <button key={id} onClick={() => onChapter(id)}><span>{bookNumber[chapter.book]} · {chapter.roman}</span><b>{termText(chapter.title)}</b><i aria-hidden="true">→</i></button> : null; })}</div></div>
    </section>
  </article>;
}

function PhilosopherView({ profile, onSchool, onChapter, originLabel, onBack, showEnglish, onTerm }: { profile: PhilosopherProfile; onSchool: (id: string) => void; onChapter: (id: string) => void; originLabel?: string; onBack?: () => void; showEnglish: boolean; onTerm: (term: TermEntry) => void }) {
  const figure = figureEntries.find((item) => item.id === profile.figureId);
  const termText = (text: string) => <TermText text={text} showEnglish={showEnglish} onTerm={onTerm} />;
  const [activeSectionId, setActiveSectionId] = useState<string>(philosopherSectionLinks[0].id);
  const linkedSchools = findSchoolProfilesByPhilosopher(profile.id);

  useEffect(() => {
    let animationFrame = 0;
    const updateActiveSection = () => {
      animationFrame = 0;
      const navBottom = document.querySelector<HTMLElement>(".profile-local-nav")?.getBoundingClientRect().bottom || 0;
      const readingLine = navBottom + 18;
      const current = philosopherSectionLinks.reduce((activeId, section) => {
        const element = document.getElementById(section.id);
        return element && element.getBoundingClientRect().top <= readingLine ? section.id : activeId;
      }, philosopherSectionLinks[0].id);
      setActiveSectionId(current);
    };
    const scheduleUpdate = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(updateActiveSection);
    };
    updateActiveSection();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, [profile.id]);
  const lineageEndpoint = (relation: "承接前人" | "影响后继") => {
    const targets = profile.comparisons.filter((item) => item.relation === relation).map((item) => item.target);
    const schoolStem = (label: string) => label.replace(/(诸传统|主义|学派|传统|派)$/u, "");
    const isSchoolTarget = (target: string) => [...philosopherProfiles.map((item) => item.school), ...schoolProfiles.map((item) => item.nameZh)].some((school) => schoolStem(school) === schoolStem(target));
    const schools = [...new Set(targets.flatMap((target) => findPhilosopherProfilesByTarget(target).map((linkedProfile) => linkedProfile.school)))];
    if (targets.length === 0) return relation === "承接前人"
      ? { figures: "多重思想来源", schools: "跨传统来源" }
      : { figures: "多路径后世影响", schools: "跨时代接受" };
    return { figures: targets.join(" 和 "), schools: schools.length > 0 ? schools.join(" 和 ") : targets.every(isSchoolTarget) ? "思想传统" : "尚未归入本站流派" };
  };
  const incomingEndpoint = lineageEndpoint("承接前人");
  const outgoingEndpoint = lineageEndpoint("影响后继");

  return <article className="philosopher-page page-wrap">
    <header className="profile-hero">
      <div className="profile-portrait">{figure ? <a href={figure.sourcePage} target="_blank" rel="noreferrer" title="查看图像来源"><img src={figure.imagePath} alt={`${profile.nameZh}的后世画像或代表性图像`} /></a> : <span>{profile.nameZh.slice(0, 1)}</span>}<small>{profile.order <= 53 ? "古代与中世纪图像仅作视觉识别，并非写实肖像" : "人物图像用于视觉识别；点击查看来源与许可"}</small></div>
      <div className="profile-title"><p className="eyebrow">PHILOSOPHER {String(profile.order).padStart(2, "0")} · {profile.school}</p><h2><TermText text={profile.nameZh} showEnglish={false} onTerm={onTerm} interactive={false} /></h2><p className="profile-name-line"><span>{profile.nameEn}</span><i>{profile.greekName}</i></p><blockquote>{termText(profile.thesis)}</blockquote></div>
      <aside className="profile-facts"><div><span>生卒年</span><b>{profile.dates}</b></div><div><span>主要活动期</span><b>{profile.active}</b></div><div><span>地点</span><b>{termText(profile.places.join(" · "))}</b></div><div><span>流派</span><b>{termText(profile.school)}</b></div></aside>
    </header>

    <aside className="evidence-caution"><span>证据边界</span><p>{termText(profile.evidenceCaution)}</p></aside>
    <nav className={onBack ? "profile-local-nav has-return" : "profile-local-nav"} aria-label="本页内容">
      {onBack && <button className="profile-local-back" onClick={onBack} aria-label={`返回${originLabel || "此前页面"}`} title={`返回${originLabel || "此前页面"}`}><span aria-hidden="true">←</span></button>}
      {philosopherSectionLinks.map((section) => <a className={activeSectionId === section.id ? "active" : ""} href={`#${section.id}`} key={section.id} aria-current={activeSectionId === section.id ? "location" : undefined} onClick={() => setActiveSectionId(section.id)}>{section.label}</a>)}
    </nav>

    <section className="profile-section life-section" id="profile-life">
      <header><span>01</span><div><p className="section-label">LIFE IN HISTORY</p><h3>生平与历史位置</h3></div></header>
      <div className="life-layout"><div className="profile-timeline"><article className="profile-overview"><div className="timeline-meta"><b>整体定位</b><span className="certainty">历史语境</span></div><div><h4>{profile.nameZh}处在什么位置？</h4><p>{termText(profile.lifeSummary)}</p></div></article>{profile.timeline.map((item) => <article key={`${item.date}-${item.title}`}><div className="timeline-meta"><b>{item.date}</b><div className="timeline-place">{termText(item.place)}</div><span className={`certainty certainty-${item.certainty}`}>{item.certainty}</span></div><div><h4>{termText(item.title)}</h4><p>{termText(item.detail)}</p></div></article>)}</div></div>
    </section>

    <section className="profile-section concept-section" id="profile-concepts">
      <header><span>02</span><div><p className="section-label">CONCEPT SYSTEM</p><h3>先识别概念，再理解关系</h3></div></header>
      <div className="profile-concept-grid">{profile.concepts.map((concept, index) => {
        const label = formatLanguageLabel(concept.en);
        const knownTerm = terminologyByZh.get(concept.zh);
        const senseId = `${profile.id}::${concept.zh}`;
        const conceptTerm: TermEntry = knownTerm ? {
          ...knownTerm,
          en: label.english,
          original: knownTerm.original || label.original,
          generalNote: knownTerm.note !== concept.definition ? knownTerm.note : undefined,
          note: concept.definition,
          activeSenseId: senseId,
        } : { id: `${profile.id}-${index}`, zh: concept.zh, en: label.english, original: label.original, category: "概念", note: concept.definition, activeSenseId: senseId };
        const openConcept = (event: SyntheticEvent) => { event.preventDefault(); event.stopPropagation(); onTerm(conceptTerm); };
        return <article key={concept.zh}><span>{String(index + 1).padStart(2, "0")}</span><h4><span className="term-token" role="button" tabIndex={0} onClick={openConcept} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") openConcept(event); }} aria-label={`查看术语：${conceptTerm.zh}，${conceptTerm.en}`}><span>{concept.zh}</span></span></h4>{showEnglish && label.english && <small>{label.english}</small>}<p>{termText(concept.definition)}</p></article>;
      })}</div>
    </section>

    <section className="profile-section inquiry-section" id="profile-inquiry">
      <header><span>03</span><div><p className="section-label">QUESTIONS & RELATIONS</p><h3>核心问题与思想路径</h3></div></header>
      <KnowledgeConnections key={profile.id} context={{ kind: "philosopher", id: profile.id }} renderText={termText} onChapter={onChapter} />
    </section>

    <section className="profile-section relation-profile-section" id="profile-relations">
      <header><span>04</span><div><p className="section-label">POSITION & DIFFERENCE MATRIX</p><h3>关系定位与差异矩阵</h3></div></header>
      <div className="lineage-direction">
        <article className="lineage-direction-side lineage-incoming"><span><i aria-hidden="true">←</i>思想来源</span><h4>{termText(incomingEndpoint.figures)}</h4><b>{termText(incomingEndpoint.schools)}</b><p>{termText(profile.lineage.inherited)}</p></article>
        <article className="lineage-current"><span>当前人物与流派位置</span><h4>{profile.nameZh}</h4><b>{termText(profile.school)}</b><p>{termText(profile.lineage.school)}</p></article>
        <article className="lineage-direction-side lineage-outgoing"><span>影响去向<i aria-hidden="true">→</i></span><h4>{termText(outgoingEndpoint.figures)}</h4><b>{termText(outgoingEndpoint.schools)}</b><p>{termText(profile.lineage.influenced)}</p></article>
      </div>
      <nav className="profile-school-links" aria-label={`${profile.nameZh}关联的哲学流派`}>
        <div><p className="section-label">本站关联流派</p><p>从人物的具体论证回到共享问题、方法与内部张力。</p></div>
        <div>{linkedSchools.map((school) => <button key={school.id} onClick={() => onSchool(school.id)}><span>{String(school.order).padStart(2, "0")}</span><b>{termText(school.nameZh)}</b><small>{school.kind} · {"★".repeat(school.stars || 1)}</small>{showEnglish && <em>{school.nameEn}</em>}<i aria-hidden="true">→</i></button>)}</div>
      </nav>
      <article className="lineage-parallel"><span>非直接影响与平行关系</span><p>{termText(profile.lineage.parallel)}</p></article>
      <div className="comparison-matrix-wrap">
        <table className="comparison-matrix">
          <colgroup><col className="comparison-target-column" /><col className="comparison-relation-column" /><col className="comparison-shared-column" /><col className="comparison-difference-column" /></colgroup>
          <thead><tr><th>比较对象</th><th>关系</th><th>共同问题或结构</th><th>关键差异</th></tr></thead>
          <tbody>{profile.comparisons.map((comparison) => <tr key={`${comparison.target}-${comparison.relation}`}><td data-label="比较对象"><h4>{termText(comparison.target)}</h4></td><td data-label="关系"><span className="relation-badge" data-relation={comparison.relation}><i aria-hidden="true">{philosopherRelationSymbols[comparison.relation]}</i>{comparison.relation}</span></td><td data-label="共同问题或结构">{termText(comparison.shared)}</td><td data-label="关键差异">{termText(comparison.difference)}</td></tr>)}</tbody>
        </table>
      </div>
    </section>

    <section className="profile-section cultural-section" id="profile-cultural">
      <header><span>05</span><div><p className="section-label">STORIES, SAYINGS & EVERYDAY MEMORY</p><h3>故事、轶事与生活化入口</h3></div></header>
      <div className="cultural-note-grid">{profile.culturalNotes?.length ? profile.culturalNotes.map((note) => <article className="cultural-note" key={`${note.kind}-${note.title}`}><span>{note.kind}</span><h4>{note.title}</h4><p>{termText(note.text)}</p>{note.caveat && <small>{note.caveat}</small>}</article>) : <article className="cultural-note cultural-note-empty"><span>当前人物</span><h4>无</h4><p>没有足够可靠、且具有公共辨识度的故事、轶事或名言。</p></article>}</div>
    </section>

    <section className="profile-section russell-profile-section" id="profile-russell">
      <header><span>06</span><div><p className="section-label">RUSSELL AS GUIDE, NOT FINAL VERDICT</p><h3>罗素的解释与现代校正</h3></div></header>
      <div className="russell-correction"><article><span>罗素怎样组织这个人物</span><p>{termText(profile.russellView)}</p></article><article><span>需要补充或修正什么</span><p>{termText(profile.modernCorrection)}</p></article></div>
      <div className="profile-sources"><div><p className="section-label">来源与继续阅读</p><small>原书是叙述主轴；补充资料用于年代、证据边界与现代解释。</small></div><div>{profile.sources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.label}><span>{source.kind}</span><b>{source.label}</b><i aria-hidden="true">↗</i></a>)}</div></div>
      <div className="profile-chapters"><div><p className="section-label">回到原书章节</p><small>人物页负责重组；章节页保留罗素原书顺序。</small></div><div>{profile.chapterIds.map((id) => { const chapter = chapters.find((item) => item.id === id); return chapter ? <button key={id} onClick={() => onChapter(id)}><span>{bookNumber[chapter.book]} · {chapter.roman}</span><b>{termText(chapter.title)}</b><i aria-hidden="true">→</i></button> : null; })}</div></div>
    </section>
  </article>;
}

function HistoryView({ stage, response, onResponse, onSchool, onPhilosopher, onChapter, originLabel, onBack, showEnglish, onTerm }: { stage: HistoryStage; response: ResponseNode; onResponse: (id: string) => void; onSchool: (id: string) => void; onPhilosopher: (id: string) => void; onChapter: (id: string) => void; originLabel?: string; onBack?: () => void; showEnglish: boolean; onTerm: (term: TermEntry) => void }) {
  const stageIndex = historyStages.findIndex((item) => item.id === stage.id);
  const linkStart = Math.min(Math.max(0, stageIndex - 1), longLinks.length - 3);
  const details = stageDetailPanels[stage.id];
  const russellFrames = (russellStructureStageIdsByHistoryStage[stage.id] || []).flatMap((id) => {
    const frame = russellStructureStages.find((item) => item.id === id);
    return frame ? [frame] : [];
  });
  const responseLinks = historyResponseLinks[response.id] || { schoolIds: [], philosopherIds: [] };
  const linkedSchools = responseLinks.schoolIds.map((id) => schoolProfiles.find((item) => item.id === id)).filter((item): item is SchoolProfile => Boolean(item));
  const linkedPhilosophers = responseLinks.philosopherIds.map((id) => philosopherProfiles.find((item) => item.id === id)).filter((item): item is PhilosopherProfile => Boolean(item));
  const hasDetailLinks = linkedSchools.length > 0 || linkedPhilosophers.length > 0;
  const relatedSources = [...linkedSchools.flatMap((school) => school.sources), ...linkedPhilosophers.flatMap((philosopher) => philosopher.sources)].filter((source, index, sources) => sources.findIndex((candidate) => candidate.url === source.url) === index);
  const [activeDetail, setActiveDetail] = useState<DetailNode | null>(null);

  useEffect(() => {
    if (!activeDetail) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setActiveDetail(null); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [activeDetail]);

  return <article className="history-page page-wrap">
    {onBack && <button className="context-back" onClick={onBack}><span>←</span><small>返回问题图谱中的节点</small><b>{originLabel || "刚才的图谱节点"}</b></button>}
    <header className="history-hero"><div className="hero-number"><span>{String(stageIndex + 1).padStart(2, "0")}</span><i /></div><div><p className="eyebrow">{stage.years} · {stage.subtitle}</p><h2><TermText text={stage.title} showEnglish={showEnglish} onTerm={onTerm} interactive={false} /></h2><p className="transition"><TermText text={stage.transition} showEnglish={showEnglish} onTerm={onTerm} /></p></div><div className="coverage-tag"><span>{stage.coverage === "personal" ? "个人笔记已覆盖" : "原书框架"}</span><small>{stage.responses.length} 种同期回应</small></div></header>
    <section className="world-section">
      <p className="section-label">01 · 先看同一个世界</p>
      <div className="dual-list-grid">
        <div className="context-list event-list"><header><span>HISTORY</span><h3>关键历史事件</h3><p>先确定发生了什么</p></header>{details.events.map((item, index) => <button key={item.id} onClick={() => setActiveDetail(item)} aria-haspopup="dialog"><span className="node-number">0{index + 1}</span><span className="node-copy"><small>{item.marker}</small><b><TermText text={item.title} showEnglish={showEnglish} onTerm={onTerm} /></b></span><i aria-hidden="true">＋</i></button>)}</div>
        <div className="context-list problem-list"><header><span>QUESTIONS</span><h3>时代提出的问题</h3><p>再看这些变化迫使人追问什么</p></header>{details.problems.map((item, index) => <button key={item.id} onClick={() => setActiveDetail(item)} aria-haspopup="dialog"><span className="node-number">0{index + 1}</span><span className="node-copy"><small>{item.marker}</small><b><TermText text={item.title} showEnglish={showEnglish} onTerm={onTerm} /></b></span><i aria-hidden="true">＋</i></button>)}</div>
      </div>
      <aside className="carrier-strip"><b>这个时期，知识主要由谁承载？</b><p><TermText text={stage.carrier} showEnglish={showEnglish} onTerm={onTerm} /></p></aside>
    </section>
    <KnowledgeConnections key={stage.id} context={{ kind: "history", id: stage.id }} renderText={(text) => <TermText text={text} showEnglish={showEnglish} onTerm={onTerm} />} />
    <section className="relation-section"><div className="section-heading"><p className="section-label">02 · 最短关系链</p><h3><TermText text={stage.commonQuestion} showEnglish={showEnglish} onTerm={onTerm} /></h3></div><div className="relation-chain">{stage.chain.map((link, index) => <div className={`relation-node ${link.kind}`} key={`${link.label}-${link.text}`}><span>{relationNames[link.kind]}</span><b><TermText text={link.text} showEnglish={showEnglish} onTerm={onTerm} /></b>{index < stage.chain.length - 1 && <i aria-hidden="true">→</i>}</div>)}</div></section>
    <section className="responses-section"><div className="section-heading compact"><p className="section-label">03 · 同期比较</p><h3>同一个时代，为什么会有不同答案？</h3><p>先比较问题、方法和生活位置；具体论证留到下一层。</p></div><div className="response-tabs" role="tablist">{stage.responses.map((item, index) => <button role="tab" aria-selected={item.id === response.id} className={item.id === response.id ? "active" : ""} key={item.id} onClick={() => onResponse(item.id)}><span>0{index + 1}</span><b><TermText text={item.title} showEnglish={showEnglish} onTerm={onTerm} /></b><small><TermText text={item.figures} showEnglish={showEnglish} onTerm={onTerm} /></small></button>)}</div><div className="response-detail" role="tabpanel"><div className="response-main"><p className="response-place"><TermText text={`${response.region} · ${response.figures}`} showEnglish={showEnglish} onTerm={onTerm} /></p><h4><TermText text={response.answer} showEnglish={showEnglish} onTerm={onTerm} /></h4><div className="method-pill"><span>使用的方法</span><b><TermText text={response.method} showEnglish={showEnglish} onTerm={onTerm} /></b></div></div><div className="response-why"><p className="section-label">差异从哪里来</p><p><TermText text={response.difference} showEnglish={showEnglish} onTerm={onTerm} /></p>{response.noteCue && <blockquote><span>你的原始笔记线索</span>{response.noteCue}</blockquote>}</div><div className="chapter-evidence"><p className="section-label">下钻到原书</p>{response.chapterIds.map((id) => { const chapter = chapters.find((item) => item.id === id); return chapter ? <button key={id} onClick={() => onChapter(id)}><span>{chapter.roman}</span>{chapter.title}<i>→</i></button> : null; })}</div></div></section>
    <section className="history-explore-section"><header><div><p className="section-label">04 · 从时代回应进入流派与人物</p><h3>继续追踪“<TermText text={response.title} showEnglish={showEnglish} onTerm={onTerm} />”</h3></div><p>流派页展开共享问题、方法与内部变化；人物页进入概念、推导和具体差异。返回键会带你回到这里。</p></header>{hasDetailLinks ? <div className="history-explore-grid"><div className="history-school-links"><p className="section-label">相关哲学流派</p>{linkedSchools.map((school) => { const stars = school.stars || 1; return <button key={school.id} onClick={() => onSchool(school.id)}><span>{String(school.order).padStart(2, "0")}</span><div><small>{school.kind} · {"★".repeat(stars)}</small><b><TermText text={school.nameZh} showEnglish={false} onTerm={onTerm} /></b>{showEnglish && <em>{school.nameEn}</em>}</div><i aria-hidden="true">→</i></button>; })}</div><div className="history-philosopher-links"><p className="section-label">关键哲学家</p><div>{linkedPhilosophers.map((philosopher) => { const figure = figureEntries.find((item) => item.id === philosopher.figureId); const stars = philosopher.stars || 1; return <button key={philosopher.id} onClick={() => onPhilosopher(philosopher.id)}><span className="history-philosopher-portrait">{figure ? <img src={figure.imagePath} alt="" /> : philosopher.nameZh.slice(0, 1)}</span><span><small>{String(philosopher.order).padStart(2, "0")} · {"★".repeat(stars)}</small><b>{philosopher.nameZh}</b>{showEnglish && <em>{philosopher.nameEn}</em>}</span><i aria-hidden="true">→</i></button>; })}</div></div></div> : <aside className="history-link-scope"><b>当前详情页尚未覆盖这一回应</b><p>历史脉络与原书章节已经可读；第三卷流派和人物资料建立后，这里会按同一数据结构开放下钻。</p></aside>}</section>
    <section className="russell-bridge-section"><header><div><p className="section-label">05 · 罗素原书中的位置</p><h3>这一时期在原书中如何组织？</h3></div><p>历史概览使用 11 个学习阶段；罗素的目录可重组为 9 个较宽的叙述框架。这里保留两者的差异，并把对应章节直接接回原书。</p></header><div className="russell-frame-list">{russellFrames.map((frame) => <article key={frame.id}><header><div><small>{frame.years}</small><h4>{frame.title}</h4></div><p>{frame.russellRange}</p></header><aside><span>原书的组织线索</span><p><TermText text={frame.condition} showEnglish={showEnglish} onTerm={onTerm} /></p></aside><div className="russell-chapter-groups">{frame.contextChapterIds.length > 0 && <section><header><span>历史与背景</span><small>{frame.contextChapterIds.length} 章</small></header><div>{frame.contextChapterIds.map((id) => { const chapter = chapters.find((item) => item.id === id); return chapter ? <button key={id} onClick={() => onChapter(id)}><span>{bookNumber[chapter.book]} · {chapter.roman}</span><b>{chapter.title}</b><i aria-hidden="true">→</i></button> : null; })}</div></section>}{frame.schools.map((school) => { const chapterIds = [...new Set([...school.chapterIds, ...school.philosophers.flatMap((philosopher) => philosopher.chapterIds)])]; if (!chapterIds.length) return null; return <section key={school.id}><header><span>{school.title}</span><small>{chapterIds.length} 章</small></header><div>{chapterIds.map((id) => { const chapter = chapters.find((item) => item.id === id); return chapter ? <button key={id} onClick={() => onChapter(id)}><span>{bookNumber[chapter.book]} · {chapter.roman}</span><b>{chapter.title}</b><i aria-hidden="true">→</i></button> : null; })}</div></section>; })}</div><footer>阶段名称和层级关系是本站依据罗素目录进行的学习重构，并非罗素亲自给出的九阶段分期。</footer></article>)}</div></section>
    {relatedSources.length > 0 && <section className="history-sources-section"><header><div><p className="section-label">06 · 来源与继续阅读</p><h3>与当前时代回应关联的外部来源</h3></div><p>由本页连接的哲学家与流派资料汇总；同一链接只保留一次。原书章节仍以上方入口为准。</p></header><div className="profile-sources"><div><p className="section-label">去重后的引用</p><small>人物与流派详情页保留各自的完整语境与说明。</small></div><div>{relatedSources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}><span>{source.kind}</span><b>{source.label}</b><i aria-hidden="true">↗</i></a>)}</div></div></section>}
    <section className="outputs-section"><div><p className="section-label">07 · 这个阶段留下了什么</p><div className="legacy-list">{stage.legacy.map((item) => <span key={item}><TermText text={item} showEnglish={showEnglish} onTerm={onTerm} /></span>)}</div></div><div><p className="section-label">少数值得跨层保留的连接</p><div className="long-links">{longLinks.slice(linkStart, linkStart + 3).map((link) => <div key={`${link.from}-${link.to}`}><b><TermText text={link.from} showEnglish={showEnglish} onTerm={onTerm} /></b><span>{link.label} · 权重 {link.weight}</span><b><TermText text={link.to} showEnglish={showEnglish} onTerm={onTerm} /></b></div>)}</div></div></section>
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
      <header className="chapter-header"><p className="eyebrow">CHAPTER {chapter.roman}</p><h2><TermText text={chapter.title} showEnglish={showEnglish} onTerm={onTerm} interactive={false} /></h2><p>{chapter.english}</p><div className="theme-row">{chapter.themes.map((theme) => <button key={theme} onClick={() => onTheme(theme)}>#{termText(theme)}</button>)}</div></header>
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

function TermText({ text, showEnglish, onTerm, interactive = true }: { text: string; showEnglish: boolean; onTerm: (term: TermEntry) => void; interactive?: boolean }) {
  const onPlace = useContext(PlaceInteractionContext);
  const onEntity = useContext(EntityNavigationContext);
  const parts = text.split(inlinePattern);
  return <>{parts.map((part, index) => {
    const place = geographyByAlias.get(part);
    if (place && (!interactive || !onPlace)) {
      return <span className="term-static" key={`place-${place.id}-${index}`}><span>{part}</span>{showEnglish && <small>{place.nameEn}</small>}</span>;
    }
    if (place && onPlace) {
      const openPlace = (event: SyntheticEvent) => { event.preventDefault(); event.stopPropagation(); onPlace(place); };
      return <span className="place-token" key={`place-${place.id}-${index}`} role="button" tabIndex={0} onClick={openPlace} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") openPlace(event); }} aria-label={`查看地点：${place.nameZh}，${place.nameEn}`}><span>{part}</span>{showEnglish && <small>{place.nameEn}</small>}<i aria-hidden="true">⌖</i></span>;
    }
    const term = terminologyByZh.get(part);
    if (!term) return part ? <span key={`${part}-${index}`}>{part}</span> : null;
    const label = formatLanguageLabel(term.en);
    if (!interactive) {
      return <span className="term-static" key={`${term.id}-${index}`}><span>{part}</span>{showEnglish && label.english && <small>{label.english}</small>}</span>;
    }
    if (term.entity && onEntity) {
      const openEntity = (event: SyntheticEvent) => { event.preventDefault(); event.stopPropagation(); onEntity(term.entity!); };
      const entityLabel = term.entity.kind === "philosopher" ? "哲学家页面" : "哲学流派页面";
      return <span className="term-token entity-token" key={`${term.id}-${index}`} role="button" tabIndex={0} onClick={openEntity} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") openEntity(event); }} aria-label={`打开${entityLabel}：${term.zh}，${label.english}`}><span>{part}</span>{showEnglish && label.english && <small>{label.english}</small>}<i aria-hidden="true">↗</i></span>;
    }
    const open = (event: SyntheticEvent) => { event.preventDefault(); event.stopPropagation(); onTerm(term); };
    return <span className="term-token" key={`${term.id}-${index}`} role="button" tabIndex={0} onClick={open} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") open(event); }} aria-label={`查看术语：${term.zh}，${label.english}`}><span>{part}</span>{showEnglish && label.english && <small>{label.english}</small>}</span>;
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

  const label = formatLanguageLabel(term.en);
  const original = term.original || label.original;
  const noteLabel = term.category === "概念" ? term.activeSenseId ? "当前人物义项" : "通用说明" : term.category === "人物" || term.category === "学派" ? "核心定位" : "在本网站中的含义";
  const contextualSenses = term.senses?.filter((sense) => sense.id !== term.activeSenseId) || [];
  return <div className="term-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="term-modal" role="dialog" aria-modal="true" aria-labelledby="term-modal-title"><button className="modal-close" aria-label="关闭术语卡" onClick={onClose}>×</button><p className="eyebrow">{term.category} · KNOWLEDGE CARD {term.stars ? `· ${"★".repeat(term.stars)}` : ""}</p><h2 id="term-modal-title">{term.zh}</h2>{label.english && <p className="term-english">{label.english}</p>}{term.context && <div className="term-context"><span>历史坐标</span><p>{term.context}</p></div>}{original && <div className="term-original"><span>原文／原名</span><p>{original}</p></div>}{term.alternatives?.length && <div className="term-alternatives"><span>其他常见译法</span><p>{term.alternatives.join(" / ")}</p></div>}<div className="term-note"><span>{noteLabel}</span><p>{term.note}</p></div>{term.generalNote && <div className="term-general-note"><span>通用说明</span><p>{term.generalNote}</p></div>}{contextualSenses.length > 0 && <div className="term-senses"><span>{term.activeSenseId ? "其他人物义项" : "人物语境义项"}</span><div>{contextualSenses.map((sense) => <article key={sense.id}><header><b>{sense.ownerName}</b><small>{formatLanguageLabel(sense.en).english}</small></header><p>{sense.definition}</p></article>)}</div></div>}{term.distinction && <div className="term-distinction"><span>阅读边界</span><p>{term.distinction}</p></div>}{term.related?.length && <div className="term-related"><span>{term.category === "人物" ? "核心概念" : term.category === "学派" ? "代表人物" : "相关页面"}</span><p>{term.related.join(" · ")}</p></div>}<button className="modal-done" onClick={onClose}>理解了，返回阅读</button></section></div>;
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
