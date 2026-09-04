import { chapters, guidingAxes, notes } from "../app/book-data";
import { figureEntries } from "../app/figure-data";
import { geographyEntries } from "../app/geography-data";
import { historyStages, longLinks, methodAtlas, stageDetailPanels } from "../app/history-data";
import { philosopherProfiles } from "../app/philosopher-data";
import { philosopherReadings } from "../app/philosopher-reading-data";
import { ancientDifferenceProblemMap } from "../app/problem-map-data";
import { problemBoundaryNotes, problemComparisonFans, problemFamilies } from "../app/problem-map-view-data";
import { readingTrees } from "../app/reading-topics-data";
import { russellStructureStages } from "../app/russell-structure-data";
import { schoolProfiles } from "../app/school-data";
import { terminology, terminologyByZh, terminologyMatchers } from "../app/terminology-data";

const userVisibleData = {
  philosophers: philosopherProfiles,
  schools: schoolProfiles,
  history: { historyStages, stageDetailPanels, longLinks, methodAtlas },
  book: { chapters, notes, guidingAxes },
  geography: geographyEntries,
  figures: figureEntries,
  problemMap: ancientDifferenceProblemMap,
  problemViews: { readingTrees, problemBoundaryNotes, problemComparisonFans, problemFamilies },
  philosopherReadings,
  russellStructureStages,
};

function collectStrings(value: unknown, strings: string[] = []): string[] {
  if (typeof value === "string") strings.push(value);
  else if (Array.isArray(value)) value.forEach((item) => collectStrings(item, strings));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => collectStrings(item, strings));
  return strings;
}

const strings = collectStrings(userVisibleData);
const corpus = strings.join("\n");
const matchedSurfaces = terminologyMatchers.filter((surface) => corpus.includes(surface));
const matchedTerms = new Set(matchedSurfaces.map((surface) => terminologyByZh.get(surface)!.id));
const conceptSenses = terminology.flatMap((term) => term.senses || []);
const liveConcepts = philosopherProfiles.flatMap((profile) => profile.concepts.map((concept) => `${profile.id}::${concept.zh}`));
const senseIds = new Set(conceptSenses.map((sense) => sense.id));
const requiredSurfaces: Record<string, string> = {
  "物自身": "现象与物自身",
  "自在之物": "现象与物自身",
  "第一性质": "第一与第二性质",
  "第二性质": "第一与第二性质",
  "定言令式": "绝对命令",
  "先验综合判断": "综合先天判断",
  "存在论论证": "本体论论证",
  "先定和谐": "预定和谐",
  "唯物史观": "历史唯物主义",
  "摹状词": "摹状词理论",
  "目的论": "目的论",
  "机械论": "机械论",
  "决定论": "决定论",
  "唯心主义": "观念论",
  "唯物主义": "唯物主义",
  "必然联系": "必然联系",
  "生产关系": "生产关系",
};

const errors: string[] = [];
terminologyByZh.forEach((term, surface) => {
  if (surface.length < 2) errors.push(`unsafe single-character inline matcher: ${surface}`);
  if (!term.note.trim()) errors.push(`missing popup explanation: ${surface}`);
});
liveConcepts.forEach((id) => { if (!senseIds.has(id)) errors.push(`missing contextual sense: ${id}`); });
Object.entries(requiredSurfaces).forEach(([surface, expected]) => {
  const term = terminologyByZh.get(surface);
  if (!term) errors.push(`missing required surface: ${surface}`);
  else if (term.zh !== expected) errors.push(`wrong canonical term for ${surface}: ${term.zh}, expected ${expected}`);
});

const result = {
  strings: strings.length,
  characters: corpus.length,
  knowledgeCards: terminology.length,
  inlineSurfaces: terminologyMatchers.length,
  surfacesFoundInCorpus: matchedSurfaces.length,
  cardsReachedFromCorpus: matchedTerms.size,
  contextualSenses: conceptSenses.length,
  intentionallyExcludedSingleCharacterConcepts: philosopherProfiles.flatMap((profile) => profile.concepts.map((concept) => concept.zh)).filter((zh) => zh.length < 2),
  errors: errors.length,
};
console.log(JSON.stringify(result, null, 2));
if (errors.length) {
  errors.forEach((error) => console.error(`ERROR ${error}`));
  process.exitCode = 1;
}
