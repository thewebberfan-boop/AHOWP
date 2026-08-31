import { readFileSync } from "node:fs";
import { findPhilosopherProfilesByTarget, philosopherProfiles } from "../app/philosopher-data";
import { findSchoolProfileByTarget, schoolProfiles } from "../app/school-data";
import { chapters } from "../app/book-data";
import { historyResponseLinks, historyStages, stageDetailPanels } from "../app/history-data";
import { terminology } from "../app/terminology-data";
import { geographyByAlias } from "../app/geography-data";
import { problemMaps } from "../app/problem-map-data";
import { problemBoundaryNotes, problemComparisonFans, problemDensityOptions, problemFamilies, problemPhaseHistoryStageIds } from "../app/problem-map-view-data";
import { collectSelfSummaryNodeIds, collectSelfSummaryPhaseIds, flattenSelfSummaryLevel, problemCompressionLevels, problemFacetOptions, selfFacetNodeIds, selfSummaryTree } from "../app/problem-map-self-data";
import { selfCrossTopicNodes } from "../app/self-reading-data";
import { collectSummaryNodeIds, flattenTopicLevel, readingTopicIds, readingTrees, topicNodeIds } from "../app/reading-topics-data";

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
  duplicates(map.edges.map((edge) => `${edge.from}:${edge.to}`)).forEach((id) => error(`问题图谱存在重复端点关系：${id}`));
  duplicates(map.sources.map((source) => source.label)).forEach((label) => error(`问题图谱“${map.title}”存在重复来源标签：${label}`));
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
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
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
  const universitySynthesisChapterIds = new Set(["b2-12", "b2-13"]);
  chapters.filter((chapter) => universitySynthesisChapterIds.has(chapter.id) && !coveredChapters.has(chapter.id)).forEach((chapter) => error(`第二卷大学综合阶段尚未覆盖章节 ${chapter.id} ${chapter.title}`));
  const universitySynthesisPhilosopherIds = new Set(["albert-great", "aquinas"]);
  philosopherProfiles.filter((profile) => universitySynthesisPhilosopherIds.has(profile.id) && !participatingPhilosophers.has(profile.id)).forEach((profile) => error(`第二卷大学综合阶段尚未连接人物 ${profile.nameZh}`));
  const franciscanChapterIds = new Set(["b2-14"]);
  chapters.filter((chapter) => franciscanChapterIds.has(chapter.id) && !coveredChapters.has(chapter.id)).forEach((chapter) => error(`第二卷方济各会阶段尚未覆盖章节 ${chapter.id} ${chapter.title}`));
  const franciscanPhilosopherIds = new Set(["bonaventure", "roger-bacon", "duns-scotus", "ockham"]);
  philosopherProfiles.filter((profile) => franciscanPhilosopherIds.has(profile.id) && !participatingPhilosophers.has(profile.id)).forEach((profile) => error(`第二卷方济各会阶段尚未连接人物 ${profile.nameZh}`));
  const papalEclipseChapterIds = new Set(["b2-15"]);
  chapters.filter((chapter) => papalEclipseChapterIds.has(chapter.id) && !coveredChapters.has(chapter.id)).forEach((chapter) => error(`第二卷教皇制衰落阶段尚未覆盖章节 ${chapter.id} ${chapter.title}`));
  const papalEclipsePhilosopherIds = new Set(["ockham", "marsilius-padua"]);
  philosopherProfiles.filter((profile) => papalEclipsePhilosopherIds.has(profile.id) && !participatingPhilosophers.has(profile.id)).forEach((profile) => error(`第二卷教皇制衰落阶段尚未连接人物 ${profile.nameZh}`));
  const earlyModernChapterIds = new Set(["b3-01", "b3-02", "b3-03", "b3-04", "b3-05"]);
  chapters.filter((chapter) => earlyModernChapterIds.has(chapter.id) && !coveredChapters.has(chapter.id)).forEach((chapter) => error(`第三卷前五章问题谱系尚未覆盖章节 ${chapter.id} ${chapter.title}`));
  const earlyModernPhilosopherIds = new Set(["machiavelli", "erasmus", "thomas-more", "luther"]);
  philosopherProfiles.filter((profile) => earlyModernPhilosopherIds.has(profile.id) && !participatingPhilosophers.has(profile.id)).forEach((profile) => error(`第三卷前五章问题谱系尚未连接人物 ${profile.nameZh}`));
  const riseOfScienceChapterIds = new Set(["b3-06"]);
  chapters.filter((chapter) => riseOfScienceChapterIds.has(chapter.id) && !coveredChapters.has(chapter.id)).forEach((chapter) => error(`第三卷科学兴起阶段尚未覆盖章节 ${chapter.id} ${chapter.title}`));
  const riseOfSciencePhilosopherIds = new Set(["copernicus", "kepler", "galileo", "francis-bacon"]);
  philosopherProfiles.filter((profile) => riseOfSciencePhilosopherIds.has(profile.id) && !participatingPhilosophers.has(profile.id)).forEach((profile) => error(`第三卷科学兴起阶段尚未连接人物 ${profile.nameZh}`));
  const baconChapterIds = new Set(["b3-07"]);
  chapters.filter((chapter) => baconChapterIds.has(chapter.id) && !coveredChapters.has(chapter.id)).forEach((chapter) => error(`第三卷培根阶段尚未覆盖章节 ${chapter.id} ${chapter.title}`));
  const baconPhilosopherIds = new Set(["francis-bacon"]);
  philosopherProfiles.filter((profile) => baconPhilosopherIds.has(profile.id) && !participatingPhilosophers.has(profile.id)).forEach((profile) => error(`第三卷培根阶段尚未连接人物 ${profile.nameZh}`));
  const hobbesChapterIds = new Set(["b3-08"]);
  chapters.filter((chapter) => hobbesChapterIds.has(chapter.id) && !coveredChapters.has(chapter.id)).forEach((chapter) => error(`第三卷霍布斯阶段尚未覆盖章节 ${chapter.id} ${chapter.title}`));
  const hobbesPhilosopherIds = new Set(["hobbes"]);
  philosopherProfiles.filter((profile) => hobbesPhilosopherIds.has(profile.id) && !participatingPhilosophers.has(profile.id)).forEach((profile) => error(`第三卷霍布斯阶段尚未连接人物 ${profile.nameZh}`));
  const descartesChapterIds = new Set(["b3-09"]);
  chapters.filter((chapter) => descartesChapterIds.has(chapter.id) && !coveredChapters.has(chapter.id)).forEach((chapter) => error(`第三卷笛卡尔阶段尚未覆盖章节 ${chapter.id} ${chapter.title}`));
  const descartesPhilosopherIds = new Set(["descartes"]);
  philosopherProfiles.filter((profile) => descartesPhilosopherIds.has(profile.id) && !participatingPhilosophers.has(profile.id)).forEach((profile) => error(`第三卷笛卡尔阶段尚未连接人物 ${profile.nameZh}`));
  const laterRationalistChapterIds = new Set(["b3-10", "b3-11"]);
  chapters.filter((chapter) => laterRationalistChapterIds.has(chapter.id) && !coveredChapters.has(chapter.id)).forEach((chapter) => error(`第三卷后续理性主义阶段尚未覆盖章节 ${chapter.id} ${chapter.title}`));
  const laterRationalistPhilosopherIds = new Set(["spinoza", "leibniz"]);
  philosopherProfiles.filter((profile) => laterRationalistPhilosopherIds.has(profile.id) && !participatingPhilosophers.has(profile.id)).forEach((profile) => error(`第三卷后续理性主义阶段尚未连接人物 ${profile.nameZh}`));
  const lockeChapterIds = new Set(["b3-12", "b3-13", "b3-14", "b3-15"]);
  chapters.filter((chapter) => lockeChapterIds.has(chapter.id) && !coveredChapters.has(chapter.id)).forEach((chapter) => error(`第三卷洛克与自由主义阶段尚未覆盖章节 ${chapter.id} ${chapter.title}`));
  const lockePhilosopherIds = new Set(["locke"]);
  philosopherProfiles.filter((profile) => lockePhilosopherIds.has(profile.id) && !participatingPhilosophers.has(profile.id)).forEach((profile) => error(`第三卷洛克与自由主义阶段尚未连接人物 ${profile.nameZh}`));
  const berkeleyChapterIds = new Set(["b3-16"]);
  chapters.filter((chapter) => berkeleyChapterIds.has(chapter.id) && !coveredChapters.has(chapter.id)).forEach((chapter) => error(`第三卷贝克莱阶段尚未覆盖章节 ${chapter.id} ${chapter.title}`));
  const berkeleyPhilosopherIds = new Set(["berkeley"]);
  philosopherProfiles.filter((profile) => berkeleyPhilosopherIds.has(profile.id) && !participatingPhilosophers.has(profile.id)).forEach((profile) => error(`第三卷贝克莱阶段尚未连接人物 ${profile.nameZh}`));
  const humeChapterIds = new Set(["b3-17"]);
  chapters.filter((chapter) => humeChapterIds.has(chapter.id) && !coveredChapters.has(chapter.id)).forEach((chapter) => error(`第三卷休谟阶段尚未覆盖章节 ${chapter.id} ${chapter.title}`));
  const humePhilosopherIds = new Set(["hume"]);
  philosopherProfiles.filter((profile) => humePhilosopherIds.has(profile.id) && !participatingPhilosophers.has(profile.id)).forEach((profile) => error(`第三卷休谟阶段尚未连接人物 ${profile.nameZh}`));
  const romanticKantChapterIds = new Set(["b3-18", "b3-19", "b3-20"]);
  chapters.filter((chapter) => romanticKantChapterIds.has(chapter.id) && !coveredChapters.has(chapter.id)).forEach((chapter) => error(`第三卷浪漫主义、卢梭与康德阶段尚未覆盖章节 ${chapter.id} ${chapter.title}`));
  const romanticKantPhilosopherIds = new Set(["rousseau", "kant"]);
  philosopherProfiles.filter((profile) => romanticKantPhilosopherIds.has(profile.id) && !participatingPhilosophers.has(profile.id)).forEach((profile) => error(`第三卷浪漫主义、卢梭与康德阶段尚未连接人物 ${profile.nameZh}`));
  const idealismWillChapterIds = new Set(["b3-21", "b3-22", "b3-23", "b3-24", "b3-25"]);
  chapters.filter((chapter) => idealismWillChapterIds.has(chapter.id) && !coveredChapters.has(chapter.id)).forEach((chapter) => error(`第三卷十九世纪思潮至尼采阶段尚未覆盖章节 ${chapter.id} ${chapter.title}`));
  const idealismWillPhilosopherIds = new Set(["hegel", "byron", "schopenhauer", "nietzsche"]);
  philosopherProfiles.filter((profile) => idealismWillPhilosopherIds.has(profile.id) && !participatingPhilosophers.has(profile.id)).forEach((profile) => error(`第三卷十九世纪思潮至尼采阶段尚未连接人物 ${profile.nameZh}`));
  const completionChapterIds = new Set(["b3-26", "b3-27", "b3-28", "b3-29", "b3-30", "b3-31"]);
  chapters.filter((chapter) => completionChapterIds.has(chapter.id) && !coveredChapters.has(chapter.id)).forEach((chapter) => error(`第三卷功利主义至逻辑分析阶段尚未覆盖章节 ${chapter.id} ${chapter.title}`));
  const completionPhilosopherIds = new Set(["bentham", "mill", "marx", "bergson", "william-james", "dewey", "frege", "russell"]);
  philosopherProfiles.filter((profile) => completionPhilosopherIds.has(profile.id) && !participatingPhilosophers.has(profile.id)).forEach((profile) => error(`第三卷功利主义至逻辑分析阶段尚未连接人物 ${profile.nameZh}`));

  duplicates(problemDensityOptions.map((option) => option.id)).forEach((id) => error(`问题图谱存在重复密度档位 ${id}`));
  if (problemDensityOptions.length !== 5) error(`问题图谱密度档位应为 5 档，实际为 ${problemDensityOptions.length} 档`);
  problemDensityOptions.forEach((option) => {
    if (!option.label || !option.english || !option.description) error(`问题图谱密度档位 ${option.id} 缺少完整说明`);
  });
  duplicates(problemFamilies.map((family) => family.id)).forEach((id) => error(`问题图谱存在重复问题家族 ${id}`));
  duplicates(problemFamilies.map((family) => String(family.lane))).forEach((lane) => error(`问题图谱问题家族重复使用导览列 ${lane}`));
  if (problemFamilies.length !== 5) error(`问题图谱导览应有 5 个问题家族，实际为 ${problemFamilies.length} 个`);
  problemFamilies.forEach((family) => {
    if (!family.description || !family.anchorNodeIds.length) error(`问题家族“${family.label}”缺少说明或锚点`);
    duplicates(family.anchorNodeIds).forEach((id) => error(`问题家族“${family.label}”重复引用节点 ${id}`));
    family.anchorNodeIds.filter((id) => !nodeById.has(id)).forEach((id) => error(`问题家族“${family.label}”引用不存在的节点 ${id}`));
  });
  duplicates(problemFacetOptions.map((option) => option.id)).forEach((id) => error(`问题图谱存在重复主题标签 ${id}`));
  if (problemFacetOptions.map((option) => option.id).join(",") !== "method,nature,self,society,ultimate") error("问题图谱主题标签必须按方法、自然、自我、社会、终极排列");
  if (!problemFacetOptions.find((option) => option.id === "self")?.available) error("自我主题试验尚未启用");
  duplicates(problemCompressionLevels.map((option) => option.id)).forEach((id) => error(`自我主题存在重复压缩层级 ${id}`));
  if (problemCompressionLevels.map((option) => option.id).join(",") !== "5,10,20,all") error("自我主题压缩层级必须为 5、10、20、全部");
  duplicates([...selfFacetNodeIds]).forEach((id) => error(`自我主题重复引用原子节点 ${id}`));
  selfFacetNodeIds.filter((id) => !nodeById.has(id)).forEach((id) => error(`自我主题引用不存在的原子节点 ${id}`));
  const summaryLevels = (["5", "10", "20"] as const).map((level) => ({ level, units: flattenSelfSummaryLevel(level) }));
  summaryLevels.forEach(({ level, units }) => {
    if (units.length !== Number(level)) error(`自我主题${level}节点层实际包含 ${units.length} 个总结节点`);
  });
  const allSummaryUnits = summaryLevels.flatMap(({ units }) => units);
  duplicates(allSummaryUnits.map((unit) => unit.id)).forEach((id) => error(`自我主题总结节点 ID 重复 ${id}`));
  const problemPhaseIds = new Set(publishedProblemMap.phases.map((phase) => phase.id));
  allSummaryUnits.forEach((unit) => {
    if (!unit.title || !unit.period || !unit.question || !unit.thesis || !unit.transition) error(`自我总结节点 ${unit.id} 内容不完整`);
    collectSelfSummaryPhaseIds(unit).filter((id) => !problemPhaseIds.has(id)).forEach((id) => error(`自我总结节点 ${unit.id} 引用不存在的问题阶段 ${id}`));
    const members = collectSelfSummaryNodeIds(unit);
    if (!members.length) error(`自我总结节点 ${unit.id} 缺少明确论证归属`);
    members.filter((id) => !nodeById.has(id)).forEach((id) => error(`自我总结节点 ${unit.id} 引用了不存在的原子节点 ${id}`));
    if (unit.entryNodeId && !members.includes(unit.entryNodeId)) error(`自我总结节点 ${unit.id} 的入口不属于本卡的具体论证`);
  });
  const phaseIdBySelfNodeId = new Map(publishedProblemMap.phases.flatMap((phase) => phase.nodes.map((node) => [node.id, phase.id])));
  flattenSelfSummaryLevel("20").forEach((unit) => {
    if (!unit.entryNodeId || !selfFacetNodeIds.some((id) => id === unit.entryNodeId)) error(`自我总结节点 ${unit.id} 缺少有效的原子下钻入口`);
    else if (!collectSelfSummaryPhaseIds(unit).includes(phaseIdBySelfNodeId.get(unit.entryNodeId) || "")) error(`自我总结节点 ${unit.id} 的下钻入口不在本卡覆盖阶段内`);
  });
  selfSummaryTree.filter((unit) => !unit.overview).forEach((unit) => error(`自我五卡总览 ${unit.id} 缺少简明回答`));
  summaryLevels.forEach(({ level, units }) => {
    const covered = new Set(units.flatMap(collectSelfSummaryNodeIds));
    if (covered.size !== selfFacetNodeIds.length || selfFacetNodeIds.some((id) => !covered.has(id))) error(`自我 ${level} 层没有覆盖同一批知识`);
  });
  Object.entries(selfCrossTopicNodes).forEach(([topic, ids]) => {
    ids.filter((id) => !selfFacetNodeIds.includes(id)).forEach((id) => error(`跨主题接口 ${topic} 引用的 ${id} 不在自我论证网络中`));
  });
  const topicSummaryIds: string[] = [];
  readingTopicIds.forEach((topic) => {
    if (!problemFacetOptions.find((option) => option.id === topic)?.available) error(`${topic} 阅读主题未启用`);
    readingTrees[topic].filter((unit) => !unit.overview).forEach((unit) => error(`${unit.id} 缺少总览中的简明回答`));
    (["5", "10", "20"] as const).forEach((level) => {
      const units = flattenTopicLevel(topic, level);
      if (units.length !== Number(level)) error(`${topic} 的 ${level} 层实际有 ${units.length} 组`);
      const covered = new Set(units.flatMap(collectSummaryNodeIds));
      if (covered.size !== topicNodeIds[topic].length || topicNodeIds[topic].some((id) => !covered.has(id))) error(`${topic} 的 ${level} 层丢失了论证归属`);
      units.forEach((unit) => {
        topicSummaryIds.push(unit.id);
        if (!unit.title || !unit.period || !unit.question || !unit.thesis || !unit.transition) error(`${unit.id} 缺少问题、回答或继续追问`);
        const ids = collectSummaryNodeIds(unit);
        if (!ids.length) error(`${unit.id} 没有明确的节点成员`);
        ids.filter((id) => !nodeById.has(id)).forEach((id) => error(`${unit.id} 引用不存在的节点 ${id}`));
        if (level === "20" && (!unit.entryNodeId || !ids.includes(unit.entryNodeId))) error(`${unit.id} 没有属于该论证的下钻入口`);
        for (const source of unit.sources || []) if (!source.label || !/^https:\/\//.test(source.url)) error(`${unit.id} 的补充来源无效`);
      });
    });
  });
  duplicates(topicSummaryIds).forEach((id) => error(`四主题总结 ID 重复 ${id}`));
  const historyStageIds = new Set(historyStages.map((stage) => stage.id));
  publishedProblemMap.phases.forEach((phase) => {
    const stageId = problemPhaseHistoryStageIds[phase.id];
    if (!stageId) error(`问题阶段“${phase.title}”缺少历史背景带映射`);
    else if (!historyStageIds.has(stageId)) error(`问题阶段“${phase.title}”映射到不存在的历史阶段 ${stageId}`);
  });
  Object.entries(problemBoundaryNotes).forEach(([nodeId, notes]) => {
    if (!nodeById.has(nodeId)) error(`解释边界引用不存在的节点 ${nodeId}`);
    if (!notes.length || notes.some((note) => !note.label || !note.note)) error(`节点 ${nodeId} 的解释边界不完整`);
  });
  problemComparisonFans.forEach((fan) => {
    const question = nodeById.get(fan.questionId);
    if (!question) error(`并行答案扇面引用不存在的问题 ${fan.questionId}`);
    else if (question.kind !== "问题") error(`并行答案扇面起点 ${fan.questionId} 不是问题节点`);
    if (fan.answerIds.length < 3) error(`并行答案扇面“${fan.label}”至少需要三个答案`);
    fan.answerIds.forEach((answerId) => {
      const answer = nodeById.get(answerId);
      if (!answer) error(`并行答案扇面“${fan.label}”引用不存在的答案 ${answerId}`);
      else if (answer.kind !== "答案") error(`并行答案扇面成员 ${answerId} 不是答案节点`);
      if (!publishedProblemMap.edges.some((edge) => edge.from === fan.questionId && edge.to === answerId && edge.relation === "回应问题")) error(`并行答案扇面“${fan.label}”缺少 ${fan.questionId} → ${answerId} 的回应关系`);
    });
  });
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
  "app/problem-map-view-data.ts",
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
