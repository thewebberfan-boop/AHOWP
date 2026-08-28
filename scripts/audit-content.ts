import { readFileSync } from "node:fs";
import { findPhilosopherProfilesByTarget, philosopherProfiles } from "../app/philosopher-data";
import { findSchoolProfileByTarget, schoolProfiles } from "../app/school-data";
import { chapters } from "../app/book-data";
import { historyResponseLinks, historyStages, stageDetailPanels } from "../app/history-data";
import { terminology } from "../app/terminology-data";
import { geographyByAlias } from "../app/geography-data";
import { problemMaps } from "../app/problem-map-data";

type Rating = 1 | 2 | 3 | 4 | 5;
type Issue = { level: "ERROR" | "WARN"; message: string };

const issues: Issue[] = [];
const error = (message: string) => issues.push({ level: "ERROR", message });
const warn = (message: string) => issues.push({ level: "WARN", message });
const duplicates = (values: string[]) => [...new Set(values.filter((value, index) => values.indexOf(value) !== index))];
const textSize = (value: unknown): number => {
  if (typeof value === "string") return value.length;
  if (Array.isArray(value)) return value.reduce((total, item) => total + textSize(item), 0);
  if (value && typeof value === "object") return Object.values(value).reduce((total, item) => total + textSize(item), 0);
  return 0;
};

const philosopherIds = new Set(philosopherProfiles.map((profile) => profile.id));
const schoolIds = new Set(schoolProfiles.map((school) => school.id));
const chapterIds = new Set(chapters.map((chapter) => chapter.id));
const responseIds = new Set(historyStages.flatMap((stage) => stage.responses.map((response) => response.id)));
const termSurfaces = new Set(terminology.flatMap((term) => [term.zh, ...(term.aliases || [])]));
const personRelations = new Set(["承接前人", "影响后继", "同题比较", "批评关系", "后世重构"]);
const schoolRelations = new Set(["思想来源", "竞争", "分化", "吸收改造", "后世重构"]);

duplicates(philosopherProfiles.map((profile) => profile.id)).forEach((id) => error(`重复人物 ID：${id}`));
duplicates(schoolProfiles.map((school) => school.id)).forEach((id) => error(`重复流派 ID：${id}`));
duplicates(chapters.map((chapter) => chapter.id)).forEach((id) => error(`重复章节 ID：${id}`));
duplicates(terminology.map((term) => term.id)).forEach((id) => error(`重复知识卡 ID：${id}`));
duplicates(problemMaps.map((map) => map.id)).forEach((id) => error(`重复问题图谱 ID：${id}`));

problemMaps.forEach((map) => {
  if (!map.phases.length) error(`问题图谱“${map.title}”没有逻辑阶段`);
  if (!map.sources.length) error(`问题图谱“${map.title}”没有来源说明`);
  duplicates(map.phases.map((phase) => phase.id)).forEach((id) => error(`问题图谱“${map.title}”存在重复阶段 ID：${id}`));
  const nodes = map.phases.flatMap((phase) => phase.nodes);
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  duplicates(nodes.map((node) => node.id)).forEach((id) => error(`问题图谱“${map.title}”存在重复节点 ID：${id}`));
  duplicates(map.edges.map((edge) => edge.id)).forEach((id) => error(`问题图谱“${map.title}”存在重复连线 ID：${id}`));
  map.phases.forEach((phase) => {
    if (!phase.nodes.length) error(`问题阶段“${phase.title}”没有思想节点`);
    phase.nodes.forEach((node) => {
      if (!node.pressure || !node.consequence) error(`问题节点“${node.title}”缺少推进压力或后续问题`);
      if (node.kind === "答案" && !node.answerRole) error(`答案节点“${node.title}”缺少作用标签`);
      if (node.kind !== "答案" && node.answerRole) error(`非答案节点“${node.title}”错误使用答案作用标签`);
      if (node.kind === "观察" && !node.observation) error(`观察节点“${node.title}”缺少观察范围与说明`);
      if (node.kind !== "观察" && node.observation) error(`非观察节点“${node.title}”错误使用观察元数据`);
      node.observation?.historyLinks?.forEach((link) => {
        const stage = historyStages.find((item) => item.id === link.stageId);
        if (!stage) {
          error(`观察节点“${node.title}”引用不存在的历史阶段 ${link.stageId}`);
          return;
        }
        if (link.responseId && !stage.responses.some((response) => response.id === link.responseId)) error(`观察节点“${node.title}”在阶段 ${link.stageId} 引用不存在的回应 ${link.responseId}`);
        if (link.eventId && !stageDetailPanels[link.stageId]?.events.some((event) => event.id === link.eventId)) error(`观察节点“${node.title}”在阶段 ${link.stageId} 引用不存在的历史事件 ${link.eventId}`);
      });
      node.chapterIds.filter((id) => !chapterIds.has(id)).forEach((id) => error(`问题节点“${node.title}”引用不存在的章节 ${id}`));
      node.participants.filter((participant) => participant.philosopherId && !philosopherIds.has(participant.philosopherId)).forEach((participant) => error(`问题节点“${node.title}”引用不存在的人物 ${participant.philosopherId}`));
    });
  });
  map.edges.forEach((edge) => {
    const source = nodeById.get(edge.from);
    const target = nodeById.get(edge.to);
    if (!source) error(`问题连线“${edge.label}”引用不存在的来源节点 ${edge.from}`);
    if (!target) error(`问题连线“${edge.label}”引用不存在的目标节点 ${edge.to}`);
    if (!source || !target) return;
    const expectedRelation = source.kind === "观察" && target.kind === "问题"
      ? "提出问题"
      : source.kind === "问题" && target.kind === "答案"
        ? "回应问题"
        : source.kind === "答案" && target.kind === "问题"
          ? "产生问题"
          : null;
    if (!expectedRelation) error(`问题连线“${edge.label}”违反观察→问题、问题→答案、答案→问题语法：${source.kind}→${target.kind}`);
    else if (edge.relation !== expectedRelation) error(`问题连线“${edge.label}”应标为“${expectedRelation}”，实际为“${edge.relation}”`);
  });
  nodes.forEach((node) => {
    const incoming = map.edges.filter((edge) => edge.to === node.id);
    const outgoing = map.edges.filter((edge) => edge.from === node.id);
    if (node.kind === "观察" && incoming.length) error(`观察节点“${node.title}”不应由其他节点推出`);
    if (node.kind === "答案" && !incoming.length) error(`答案节点“${node.title}”没有对应问题`);
    if (node.kind === "问题" && !incoming.length) error(`问题节点“${node.title}”既不来自观察，也不来自答案`);
    if (node.kind !== "问题" && !outgoing.length) warn(`${node.kind}节点“${node.title}”没有继续连接到问题`);
  });
});

const publishedProblemMap = problemMaps.find((map) => map.id === "difference-change-knowledge");
if (!publishedProblemMap) {
  error("缺少已发布问题谱系 difference-change-knowledge");
} else {
  const nodes = publishedProblemMap.phases.flatMap((phase) => phase.nodes);
  const coveredChapters = new Set(nodes.flatMap((node) => node.chapterIds));
  chapters.filter((chapter) => chapter.book === "ancient" && !coveredChapters.has(chapter.id)).forEach((chapter) => error(`第一卷问题谱系尚未覆盖章节 ${chapter.id} ${chapter.title}`));
  const participatingPhilosophers = new Set(nodes.flatMap((node) => node.participants.map((participant) => participant.philosopherId).filter((id): id is string => Boolean(id))));
  philosopherProfiles.filter((profile) => profile.chapterIds.some((id) => id.startsWith("b1-")) && !participatingPhilosophers.has(profile.id)).forEach((profile) => error(`第一卷问题谱系尚未连接人物 ${profile.nameZh}`));
  const openingChapterIds = new Set(["b2-01", "b2-02", "b2-03", "b2-04"]);
  chapters.filter((chapter) => openingChapterIds.has(chapter.id) && !coveredChapters.has(chapter.id)).forEach((chapter) => error(`第二卷开篇阶段尚未覆盖章节 ${chapter.id} ${chapter.title}`));
  const openingPhilosopherIds = new Set(["philo-alexandria", "origen", "ambrose", "jerome", "augustine"]);
  philosopherProfiles.filter((profile) => openingPhilosopherIds.has(profile.id) && !participatingPhilosophers.has(profile.id)).forEach((profile) => error(`第二卷开篇阶段尚未连接人物 ${profile.nameZh}`));
  const institutionalChapterIds = new Set(["b2-05", "b2-06", "b2-07"]);
  chapters.filter((chapter) => institutionalChapterIds.has(chapter.id) && !coveredChapters.has(chapter.id)).forEach((chapter) => error(`第二卷制度保存阶段尚未覆盖章节 ${chapter.id} ${chapter.title}`));
  const institutionalPhilosopherIds = new Set(["boethius", "benedict", "gregory-great"]);
  philosopherProfiles.filter((profile) => institutionalPhilosopherIds.has(profile.id) && !participatingPhilosophers.has(profile.id)).forEach((profile) => error(`第二卷制度保存阶段尚未连接人物 ${profile.nameZh}`));
  const reasonReformChapterIds = new Set(["b2-08", "b2-09"]);
  chapters.filter((chapter) => reasonReformChapterIds.has(chapter.id) && !coveredChapters.has(chapter.id)).forEach((chapter) => error(`第二卷理性改革阶段尚未覆盖章节 ${chapter.id} ${chapter.title}`));
  const reasonReformPhilosopherIds = new Set(["eriugena"]);
  philosopherProfiles.filter((profile) => reasonReformPhilosopherIds.has(profile.id) && !participatingPhilosophers.has(profile.id)).forEach((profile) => error(`第二卷理性改革阶段尚未连接人物 ${profile.nameZh}`));
  const translationChapterIds = new Set(["b2-10"]);
  chapters.filter((chapter) => translationChapterIds.has(chapter.id) && !coveredChapters.has(chapter.id)).forEach((chapter) => error(`第二卷翻译证明阶段尚未覆盖章节 ${chapter.id} ${chapter.title}`));
  const translationPhilosopherIds = new Set(["avicenna", "al-ghazali", "averroes", "maimonides"]);
  philosopherProfiles.filter((profile) => translationPhilosopherIds.has(profile.id) && !participatingPhilosophers.has(profile.id)).forEach((profile) => error(`第二卷翻译证明阶段尚未连接人物 ${profile.nameZh}`));
  const dialecticChapterIds = new Set(["b2-11"]);
  chapters.filter((chapter) => dialecticChapterIds.has(chapter.id) && !coveredChapters.has(chapter.id)).forEach((chapter) => error(`第二卷学校辩证阶段尚未覆盖章节 ${chapter.id} ${chapter.title}`));
  const dialecticPhilosopherIds = new Set(["anselm", "roscelin", "abelard", "bernard-clairvaux"]);
  philosopherProfiles.filter((profile) => dialecticPhilosopherIds.has(profile.id) && !participatingPhilosophers.has(profile.id)).forEach((profile) => error(`第二卷学校辩证阶段尚未连接人物 ${profile.nameZh}`));
}

philosopherProfiles.forEach((profile) => {
  if (!profile.stars) error(`${profile.nameZh}缺少星级`);
  if (!profile.sources.length) error(`${profile.nameZh}缺少来源`);
  if (!profile.inquiries.length || !profile.concepts.length || !profile.comparisons.length) error(`${profile.nameZh}的推导、概念或关系为空`);
  profile.chapterIds.filter((id) => !chapterIds.has(id)).forEach((id) => error(`${profile.nameZh}引用不存在的章节 ${id}`));
  const term = terminology.find((entry) => entry.entity?.kind === "philosopher" && entry.entity.id === profile.id);
  if (!term) error(`${profile.nameZh}没有自动生成的人物卡`);
  profile.concepts.forEach((concept) => {
    if (!terminology.some((entry) => entry.zh === concept.zh)) error(`${profile.nameZh}的概念“${concept.zh}”未进入知识卡词表`);
  });
  duplicates(profile.comparisons.map((comparison) => `${comparison.relation}:${comparison.target}`)).forEach((key) => error(`${profile.nameZh}存在重复人物关系 ${key}`));
  profile.comparisons.forEach((comparison) => {
    if (!personRelations.has(comparison.relation)) error(`${profile.nameZh}使用未知人物关系 ${comparison.relation}`);
    comparison.target.split(/[／、]/u).map((part) => part.trim()).forEach((part) => {
      if (!findPhilosopherProfilesByTarget(part).length && !termSurfaces.has(part)) error(`${profile.nameZh}的人物关系目标“${part}”既无详情页也无知识卡`);
    });
    findPhilosopherProfilesByTarget(comparison.target).forEach((target) => {
      if (comparison.relation === "承接前人" && target.order >= profile.order) warn(`${profile.nameZh}把不早于自己的${target.nameZh}标为“承接前人”`);
      if (comparison.relation === "影响后继" && target.order <= profile.order) warn(`${profile.nameZh}把不晚于自己的${target.nameZh}标为“影响后继”`);
    });
  });
  profile.places.forEach((placeName) => {
    const hasGeneratedCard = terminology.some((entry) => entry.category === "地名" && entry.zh === placeName);
    if (!geographyByAlias.has(placeName) && !hasGeneratedCard) error(`${profile.nameZh}的地点“${placeName}”没有地图或地点索引卡`);
  });
});

schoolProfiles.forEach((school) => {
  if (!school.stars) error(`${school.nameZh}缺少星级`);
  if (!school.sources.length) error(`${school.nameZh}缺少来源`);
  school.chapterIds.filter((id) => !chapterIds.has(id)).forEach((id) => error(`${school.nameZh}引用不存在的章节 ${id}`));
  school.philosophers.filter((person) => !philosopherIds.has(person.id)).forEach((person) => error(`${school.nameZh}引用不存在的人物 ${person.id}`));
  const term = terminology.find((entry) => entry.entity?.kind === "school" && entry.entity.id === school.id);
  if (!term) error(`${school.nameZh}没有自动生成的流派卡`);
  duplicates(school.relations.map((relation) => `${relation.relation}:${relation.target}`)).forEach((key) => error(`${school.nameZh}存在重复流派关系 ${key}`));
  school.relations.forEach((relation) => {
    if (!schoolRelations.has(relation.relation)) error(`${school.nameZh}使用未知流派关系 ${relation.relation}`);
    if (!findSchoolProfileByTarget(relation.target) && !termSurfaces.has(relation.target)) error(`${school.nameZh}的流派关系目标“${relation.target}”既无详情页也无知识卡`);
  });
});

const surfaceOwners = new Map<string, string>();
terminology.forEach((term) => {
  [term.zh, ...(term.aliases || [])].forEach((surface) => {
    const owner = surfaceOwners.get(surface);
    if (owner && owner !== term.id) error(`知识卡表述“${surface}”同时指向 ${owner} 与 ${term.id}`);
    else surfaceOwners.set(surface, term.id);
  });
});

Object.entries(historyResponseLinks).forEach(([responseId, links]) => {
  if (!responseIds.has(responseId)) error(`历史下钻表包含不存在的回应 ${responseId}`);
  links.schoolIds.filter((id) => !schoolIds.has(id)).forEach((id) => error(`历史回应 ${responseId} 引用不存在的流派 ${id}`));
  links.philosopherIds.filter((id) => !philosopherIds.has(id)).forEach((id) => error(`历史回应 ${responseId} 引用不存在的人物 ${id}`));
});
responseIds.forEach((id) => { if (!historyResponseLinks[id]) warn(`历史回应 ${id} 尚无流派／人物下钻关系`); });

const personMinimum: Record<Rating, number> = { 1: 1200, 2: 1350, 3: 1500, 4: 2300, 5: 2900 };
const schoolMinimum: Record<Rating, number> = { 1: 1150, 2: 1200, 3: 1500, 4: 1850, 5: 2100 };
const culturalNoteMinimum: Record<Rating, number> = { 1: 0, 2: 0, 3: 1, 4: 2, 5: 3 };

philosopherProfiles.forEach((profile) => {
  const size = textSize(profile);
  if (size < personMinimum[profile.stars || 1]) warn(`${profile.stars}星人物“${profile.nameZh}”正文量 ${size}，低于建议值 ${personMinimum[profile.stars || 1]}`);
  const noteCount = profile.culturalNotes?.length || 0;
  const expectedNotes = culturalNoteMinimum[profile.stars || 1];
  if (noteCount < expectedNotes) error(`${profile.stars}星人物“${profile.nameZh}”仅有 ${noteCount} 条生活化入口，低于基线 ${expectedNotes} 条`);
});
schoolProfiles.forEach((school) => {
  const size = textSize(school);
  if (size < schoolMinimum[school.stars || 1]) warn(`${school.stars}星流派“${school.nameZh}”正文量 ${size}，低于建议值 ${schoolMinimum[school.stars || 1]}`);
});

const canonicalFiles = [
  "app/history-data.ts",
  "app/problem-map-data.ts",
  "app/russell-structure-data.ts",
  "app/school-data.ts",
  "app/school-data-medieval.ts",
  "app/school-data-modern.ts",
  "app/philosopher-data.ts",
  "app/philosopher-data-late-ancient.ts",
  "app/philosopher-data-medieval.ts",
  "app/philosopher-data-modern.ts",
  "app/geography-data.ts",
];
canonicalFiles.forEach((file) => {
  const source = readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
  const proseSource = source.replace(/aliases:\s*\[[^\]]*\]/gu, "");
  if (proseSource.includes("罗吉尔·培根")) error(`${file} 仍在正文使用旧译名“罗吉尔·培根”`);
});

const ratings = (items: Array<{ stars?: Rating }>) => Object.fromEntries([1, 2, 3, 4, 5].map((rating) => [rating, items.filter((item) => item.stars === rating).length]));
console.log(`人物 ${philosopherProfiles.length}：${JSON.stringify(ratings(philosopherProfiles))}`);
console.log(`流派 ${schoolProfiles.length}：${JSON.stringify(ratings(schoolProfiles))}`);
console.log(`知识卡 ${terminology.length}：人物 ${terminology.filter((term) => term.category === "人物").length}、流派 ${terminology.filter((term) => term.category === "学派").length}、概念 ${terminology.filter((term) => term.category === "概念").length}、地点 ${terminology.filter((term) => term.category === "地名").length}`);
console.log(`问题图谱 ${problemMaps.length}：${problemMaps.reduce((total, map) => total + map.phases.length, 0)} 个阶段、${problemMaps.reduce((total, map) => total + map.phases.flatMap((phase) => phase.nodes).length, 0)} 个节点、${problemMaps.reduce((total, map) => total + map.edges.length, 0)} 条连线`);
issues.forEach((issue) => console.log(`${issue.level} ${issue.message}`));

const errorCount = issues.filter((issue) => issue.level === "ERROR").length;
const warningCount = issues.length - errorCount;
console.log(`内容审计完成：${errorCount} 个错误，${warningCount} 个提醒。`);
if (errorCount) process.exitCode = 1;
