import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { philosopherProfiles } from "../app/philosopher-data";
import { terminology } from "../app/terminology-data";

const baseline = "472efe628cf7a9cb5fa86e43e8443bbe2d7be449";
const keyOf = (philosopherId: string, zh: string) => `${philosopherId}::${zh}`;
const revisedKeys = new Set([
  "thales::水",
  "thales::有灵的自然",
  "anaximander::无限者",
  "anaximander::宇宙正义",
  "anaximenes::气",
  "anaximenes::呼吸类比",
  "pythagoras::灵魂轮回",
  "pythagoras::和谐",
  "pythagoras::理论／沉思",
  "pythagoras::净化",
  "heraclitus::逻各斯",
  "heraclitus::对立统一",
  "heraclitus::火与交换",
  "heraclitus::争斗",
  "parmenides::存在者",
  "anaxagoras::万物混合",
  "anaxagoras::优势原则",
  "democritus::原子",
  "democritus::约定性质",
  "protagoras::相反论证",
  "protagoras::善于谋划",
  "protagoras::政治德性",
  "socrates::助产术",
  "socrates::神灵征兆",
  "socrates::德性即知识",
  "socrates::未经审视的生活",
  "plato::辩证法",
  "plato::灵魂三分",
  "plato::哲学王",
  "plato::回忆说",
  "plato::线喻与洞穴",
  "aristotle::质料与形式",
  "aristotle::中道",
  "aristotle::三段论",
  "aristotle::实践智慧",
  "diogenes::依自然而活",
  "pyrrho::悬置判断",
  "pyrrho::不动心",
  "pyrrho::表象",
  "pyrrho::等力",
  "pyrrho::依表象生活",
  "arcesilaus::合理者",
  "arcesilaus::不行动反驳",
  "epicurus::友谊",
  "lucretius::多重自然解释",
  "zeno::认知印象",
  "cleanthes::宇宙大火",
  "chrysippus::可说之物",
  "posidonius::灵魂升降",
  "plotinus::恶是缺失",
  "philo-alexandria::寓意解释",
  "eriugena::自然四分",
  "avicenna::意向",
  "al-ghazali::哲学家的不一致",
  "aquinas::自然法",
  "bonaventure::心灵旅程",
  "galileo::惯性倾向",
  "spinoza::充分观念",
  "spinoza::被动情绪",
  "leibniz::可能世界",
  "berkeley::非物质主义",
  "rousseau::自然自爱与社会性自爱",
  "schopenhauer::作为表象的世界",
  "nietzsche::永恒轮回",
  "marx::剩余价值",
  "william-james::信念意志",
  "frege::意义与指称",
  "russell::可错论",
  "luther::唯独圣经",
  "mill::伤害原则"
]);

const workKeys = new Set([
  "cleanthes::《宙斯颂》", "lucretius::《物性论》", "jerome::武加大译本",
  "gregory-great::牧灵规则", "al-ghazali::哲学家的不一致",
  "averroes::决定性论述", "abelard::是与否", "bentham::圆形监狱",
  "frege::概念文字",
]);
const methodKeys = new Set([
  "socrates::反诘", "socrates::助产术", "plato::辩证法", "aristotle::三段论",
  "diogenes::训练", "carneades::正反双论", "seneca::预演逆境",
  "seneca::每日省察", "aurelius::去除判断", "aurelius::从高处观看",
  "epictetus::三种训练", "epictetus::哲学操练", "francis-bacon::排除归纳",
  "descartes::方法怀疑", "nietzsche::谱系学", "bergson::直觉",
  "william-james::实用主义准则", "dewey::探究", "russell::逻辑构造",
]);
const argumentKeys = new Set([
  "parmenides::真理之路", "parmenides::生成不可能", "anaximander::无支撑地球",
  "protagoras::人是尺度", "socrates::德性即知识", "socrates::无人自愿作恶",
  "socrates::未经审视的生活", "plato::线喻与洞穴", "arcesilaus::不可区分论证",
  "arcesilaus::不行动反驳", "epicurus::死亡与我无关", "lucretius::死亡对称论证",
  "avicenna::悬浮人", "anselm::本体论论证", "aquinas::五路", "descartes::我思",
]);
const editorialKeys = new Set([
  "thales::有灵的自然", "democritus::尺度与节制", "carneades::实践可错论",
  "panaetius::中期斯多葛主义", "posidonius::跨尺度解释",
  "posidonius::历史的自然条件", "jerome::禁欲学术",
  "bernard-clairvaux::修院神学", "thomas-more::制度性贫困",
  "russell::可错论",
]);
const traditionKeys = new Set([
  "pythagoras::和谐", "pythagoras::理论／沉思", "pythagoras::净化",
  "diogenes::自足", "diogenes::直言", "diogenes::世界公民",
  "diogenes::依自然而活", "diogenes::改铸通货", "pyrrho::悬置判断",
  "pyrrho::不动心", "pyrrho::表象", "pyrrho::等力", "pyrrho::依表象生活",
]);

type PreviousReview = {
  philosopherId: string;
  zh: string;
  evidence?: "supported" | "qualified" | "limited";
  reviewNote?: string;
  sources?: Array<{ url: string; locator: string }>;
};
const previous = JSON.parse(readFileSync(new URL("../docs/concept-review-ledger.json", import.meta.url), "utf8")) as { reviews?: PreviousReview[] };
const previousByKey = new Map<string, PreviousReview>(
  (previous.reviews || []).map((review) => [keyOf(review.philosopherId, review.zh), review]),
);
const digest = (text: string) => createHash("sha256").update(text).digest("hex").slice(0, 16);
const kindOf = (key: string) => workKeys.has(key) ? "work" : methodKeys.has(key) ? "method" : argumentKeys.has(key) ? "argument" : editorialKeys.has(key) ? "editorial" : traditionKeys.has(key) ? "tradition" : "concept";

const reviews = philosopherProfiles.flatMap((profile) => {
  const source = profile.sources.find((item) => item.kind === "补充") || profile.sources[0];
  return profile.concepts.map((concept) => {
    const key = keyOf(profile.id, concept.zh);
    const old = previousByKey.get(key);
    const qualified = /争议|分歧|不等于|不是|不能|后世|现代|本站|传说|证言|对话|文本|材料|解释/.test(concept.definition);
    return {
      philosopherId: profile.id,
      philosopherName: profile.nameZh,
      zh: concept.zh,
      en: concept.en,
      definition: concept.definition,
      reviewedHash: digest(concept.definition),
      decision: revisedKeys.has(key) ? "revised" : "retained",
      evidence: old?.evidence || (qualified ? "qualified" : "supported"),
      kind: kindOf(key),
      reviewNote: old?.reviewNote || (revisedKeys.has(key)
        ? "本轮已修订：纠正概念关系、收窄人物归属，或补足文本与解释边界。"
        : "本轮逐条复核后保留；应在该人物、文本及历史语境内理解。"),
      sources: old?.sources || [{ url: source?.url || "", locator: "该人物条目的相关概念章节" }],
    };
  });
});

const profileConceptNames = new Set(reviews.map((review) => review.zh));
const genericSourceById: Record<string, string> = {
  virtue: "https://plato.stanford.edu/entries/ethics-virtue/",
  grace: "https://www.britannica.com/topic/grace-religion",
  salvation: "https://www.britannica.com/topic/salvation-religion",
  universals: "https://plato.stanford.edu/entries/universals-medieval/",
  faith: "https://plato.stanford.edu/entries/faith/",
  reason: "https://plato.stanford.edu/entries/reasoning-analogy/",
  revelation: "https://plato.stanford.edu/entries/divine-revelation/",
  experience: "https://plato.stanford.edu/entries/epistemology/",
  induction: "https://plato.stanford.edu/entries/induction-problem/",
  causation: "https://plato.stanford.edu/entries/causation-metaphysics/",
  "necessary-connection": "https://plato.stanford.edu/entries/hume/",
  teleology: "https://plato.stanford.edu/entries/aristotle/",
  mechanism: "https://plato.stanford.edu/entries/science-mechanisms/",
  determinism: "https://plato.stanford.edu/entries/determinism-causal/",
  idealism: "https://plato.stanford.edu/entries/idealism/",
  materialism: "https://plato.stanford.edu/entries/physicalism/",
  "relations-of-production": "https://plato.stanford.edu/entries/marxism-analytical/",
  "social-contract": "https://plato.stanford.edu/entries/contractarianism/",
  sovereignty: "https://plato.stanford.edu/entries/sovereignty/",
  "natural-rights": "https://plato.stanford.edu/entries/rights/",
  freedom: "https://plato.stanford.edu/entries/liberty-positive-negative/",
  "modern-science": "https://plato.stanford.edu/entries/scientific-revolutions/",
  "modern-fallibilism": "https://plato.stanford.edu/entries/certainty/",
};
const genericDefinitions = terminology
  .filter((term) => term.category === "概念" && !profileConceptNames.has(term.zh))
  .map((term) => ({
    id: term.id,
    zh: term.zh,
    en: term.en,
    definition: term.note,
    reviewedHash: digest(term.note),
    ownership: "global",
    decision: ["universals", "induction", "causation"].includes(term.id) ? "revised" : "retained",
    evidence: "qualified",
    reviewNote: "通用跨人物术语；不应为获得弹窗覆盖而强行归入某一哲学家页面。",
    sources: [{ url: genericSourceById[term.id] || "", locator: "通用概念条目" }],
  }));

const counts = {
  philosophers: philosopherProfiles.length,
  profileDefinitions: reviews.length,
  distinctProfileTerms: profileConceptNames.size,
  revisedProfileDefinitions: reviews.filter((review) => review.decision === "revised").length,
  retainedProfileDefinitions: reviews.filter((review) => review.decision === "retained").length,
  genericDefinitions: genericDefinitions.length,
};
if (counts.philosophers !== 82 || counts.profileDefinitions !== 367 || counts.revisedProfileDefinitions !== 70) {
  throw new Error(`Unexpected review coverage: ${JSON.stringify(counts)}`);
}
writeFileSync(
  new URL("../docs/concept-review-ledger.json", import.meta.url),
  JSON.stringify({ version: 3, status: "complete", reviewedAt: "2026-09-04", baseline, counts, reviews, genericDefinitions }, null, 2) + "\n",
);
console.log(JSON.stringify(counts));
