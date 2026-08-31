import type { ProblemEdge } from "./problem-map-data";

// Explicit argument membership. A maintenance phase is not a semantic group;
// shared IDs intentionally let a question belong to more than one reading route.
const ids = (value: string) => value.trim().split(/\s+/u);
export const selfReadingNodeIds: Record<string, string[]> = {
  "self-20-soul-order": ids(`
    how-order-soul-and-polis justice-as-ordered-whole
    actions-aim-goods-observation what-is-human-flourishing virtue-as-rational-activity
    constitutions-shape-character-observation can-good-life-be-private polis-practical-wisdom
    polis-autonomy-collapse how-live-uncontrollable-world stoic-virtue-in-order
  `),
  "self-20-soul-survival": ids(`
    justice-as-ordered-whole can-soul-survive-body immortal-rational-soul
  `),
  "self-20-assent-responsibility": ids(`
    stoic-virtue-in-order freedom-withdrawal-or-role role-and-inner-freedom
    can-impression-certify-truth cognitive-impression-and-assent
    fate-and-responsibility assent-as-internal-cause
    who-belongs-moral-community cosmopolis-common-reason
  `),
  "self-20-inner-freedom-meaning": ids(`
    role-and-inner-freedom imperial-vulnerability-observation is-inner-freedom-enough
    one-intellect-soul how-many-from-one emanation-without-loss
    is-sensible-world-evil dependent-image-not-evil reason-or-divine-aid
  `),
  "self-20-divided-will-grace": ids(`
    creator-covenant-salvation-history if-creator-good-whence-evil evil-privation-disordered-will
    can-will-heal-itself grace-heals-divided-will
  `),
  "self-20-providence-contingency": ids(`
    does-providence-cancel-freedom eternal-present-knows-contingently
  `),
  "self-20-individual-intellect": ids(`
    is-rational-soul-individual shared-intellect-individual-imagination
    can-intellectual-perfection-preserve-person
    can-one-separate-intellect-make-this-person-think each-human-soul-has-intellectual-powers
    how-individual-intellect-knows-universals abstraction-makes-universal-knowledge
    what-of-person-after-body subsistent-soul-survives-incomplete
  `),
  "self-20-haecceity-choice": ids(`
    shared-nature-distinct-individuals-observation what-makes-common-nature-this-individual
    common-nature-contracted-by-haecceity does-intellectual-judgment-determine-choice
    will-has-synchronic-alternative-power do-common-predicates-require-common-natures
    individuals-and-universal-mental-signs
  `),
  "self-20-agency-conscience": ids(`
    how-can-thought-judge-state-classics-scripture-experience
    does-expanded-agency-mean-secular-liberation agency-expands-within-religious-patronage
    justification-by-faith-reorders-works how-free-is-will-before-grace
    erasmus-small-cooperation-under-grace luther-bound-will-in-salvation
    why-command-if-will-cannot-save-itself law-reveals-incapacity-grace-creates-will
    does-scripture-conscience-create-solitary-infallibility
  `),
  "self-20-body-cogito": ids(`
    bodily-impact-sensation-memory-observation can-mind-be-explained-without-immaterial-faculty
    sensation-imagination-passions-as-bodily-motion
    what-can-thought-know-when-sense-and-words-mislead sensory-error-dream-observation
    methodic-doubt-suspends-uncertain-beliefs does-any-judgment-survive-hyperbolic-doubt
    cogito-performed-certainty what-is-the-self-known-in-cogito thinking-thing-before-body
    can-finite-thinker-secure-clear-distinct-truth
  `),
  "self-20-mind-body-affect": ids(`
    thinking-thing-before-body is-mind-really-distinct-from-body
    matter-as-extension-mechanical-order thought-extension-real-distinction
    how-can-distinct-mind-and-body-form-one-human mind-body-union-lived-not-mechanically-resolved
    can-two-created-substances-fit-one-intelligible-nature one-substance-god-or-nature
    how-can-finite-things-differ-within-one-substance attributes-and-modes-articulate-one-nature
    if-mind-and-body-do-not-interact-how-correspond mind-body-parallel-expression
    what-can-freedom-mean-in-necessary-nature conatus-and-adequate-understanding-increase-agency
    can-understanding-transform-passions-without-suppressing-them
    active-affects-through-common-causes
  `),
  "self-20-personal-identity-critique": ids(`
    how-do-perception-memory-and-reason-emerge apperception-builds-conscious-continuity
    are-ideas-innate-dispositions-or-experiential-materials sensation-and-reflection-supply-idea-materials
    what-makes-one-person-same-over-time personhood-through-conscious-appropriation
    how-can-accountability-exceed-explicit-memory
    what-causes-involuntary-sensory-ideas ideas-passive-spirits-active-god-orders-sense
    direct-idea-world-with-notions-of-spirit can-spirit-cause-and-self-survive-strict-experience-test
    simple-ideas-copy-impressions-source-test
    what-unifies-person-without-self-impression self-as-bundle-and-succession-of-perceptions
    can-association-explain-one-mind-and-responsibility association-explains-identity-fiction-not-full-unity
    are-liberty-and-causal-necessity-compatible liberty-as-action-according-to-will
    can-caused-actions-ground-responsibility stable-character-links-action-and-attribution
    can-scepticism-guide-life-without-paralysis
  `),
  "self-20-formed-individuality": ids(`
    can-individuality-and-sociality-support-each-other bildung-creative-individuality-within-relations
    can-authentic-feeling-legitimate-political-power
  `),
  "self-20-education-dependence": ids(`
    is-amour-propre-only-corrupting-vanity amour-propre-can-be-inflamed-or-egalitarian
    how-educate-agency-without-premature-dependence negative-education-protects-developmental-agency
    can-social-order-preserve-freedom
  `),
  "self-20-autonomy-causality": ids(`
    can-self-legislation-be-universal-without-one-community autonomy-as-rational-self-legislation
    how-can-freedom-coexist-with-natural-causality two-standpoints-natural-causality-practical-freedom
    can-practical-reason-know-transcendent-freedom
  `),
  "self-20-recognition-social-self": ids(`
    self-consciousness-seeks-recognition-observation why-self-consciousness-needs-mutual-recognition
    mutual-recognition-constitutes-social-selfhood can-domination-secure-recognition
    asymmetric-recognition-undermines-itself market-family-state-dependence-observation
    why-abstract-right-and-private-conscience-insufficient ethical-life-mediates-family-civil-society-state
    does-actual-rational-mean-every-state-is-right actuality-is-critical-standard-not-fact-worship
    can-civil-society-correct-poverty-it-produces institutions-contain-market-without-abolishing-particularity
  `),
  "self-20-desire-suffering": ids(`
    does-intensified-desire-liberate-or-enslave desire-reveals-will-before-rational-purpose
    body-double-aspect-observation can-body-give-access-to-thing-in-itself world-double-aspect-representation-and-will
    striving-satisfaction-boredom-observation is-suffering-accident-or-structure-of-willing pessimism-from-endless-willing
    how-can-subject-loosen-service-to-will aesthetic-contemplation-suspends-personal-striving
    compassion-crosses-principium-individuationis ascetic-negation-reduces-will-to-life
    does-negating-will-repeat-nihilism affirmation-revalues-suffering-without-worshipping-it
    does-will-to-power-mean-political-domination will-to-power-as-overcoming-and-organization-contested
    can-revaluation-avoid-arbitrary-cruelty revaluation-tests-creative-flourishing-with-political-risk
  `),
  "self-20-capacity-liberty": ids(`
    are-all-pleasures-equal-in-value higher-pleasures-and-competent-judges
    does-liberty-serve-welfare-beyond-preference harm-principle-protects-experiments-in-living
    can-majority-opinion-tyrannize-without-law liberty-requires-plural-institutions-and-criticism
  `),
  "self-20-duration-free-act": ids(`
    is-freedom-an-uncaused-instant-choice free-act-expresses-whole-developing-self
  `),
  "self-20-experience-transaction": ids(`
    how-test-meaning-and-truth-in-plural-experience
    are-relations-experienced-or-added-by-thought radical-empiricism-includes-experienced-relations
    how-institutionalize-fallible-plural-inquiry inquiry-transforms-problematic-situation
    is-experience-private-inner-content experience-as-organism-environment-transaction
  `),
};

// These are explicitly editorial comparisons, not new claims of historical influence.
// Labels state the question being carried across; both endpoints remain canonical nodes.
const compare = (from: string, to: string, label: string): ProblemEdge => ({
  id: `self-reading:${from}:${to}`, from, to, relation: "产生问题", connection: "同题并列", label,
});
const reading = (from: string, to: string, label: string): ProblemEdge => ({
  ...compare(from, to, label), connection: "本站推演",
});
export const selfReadingEdges: ProblemEdge[] = [
  compare("justice-as-ordered-whole", "what-is-human-flourishing", "比较理性在正义灵魂与人的良好生活中承担的不同作用"),
  reading("immortal-rational-soul", "is-rational-soul-individual", "比较灵魂存续与个体理智：不朽是否已经说明每个人怎样思考？"),
  compare("assent-as-internal-cause", "can-will-heal-itself", "责任之外再问行动能力：把判断归于自己，是否就能改变坏习惯？"),
  compare("grace-heals-divided-will", "does-providence-cancel-freedom", "从意志能否行善，转问预知与自由是否相容"),
  compare("eternal-present-knows-contingently", "does-intellectual-judgment-determine-choice", "比较自由面临的两种压力：无误预知与理智判断"),
  reading("each-human-soul-has-intellectual-powers", "what-makes-common-nature-this-individual", "个人理智能力之外，再问共同本性为何属于这个个体"),
  compare("will-has-synchronic-alternative-power", "how-free-is-will-before-grace", "对照选择余地与救赎能力；这两个自由问题不可混同"),
  reading("agency-expands-within-religious-patronage", "how-can-thought-judge-state-classics-scripture-experience", "行动空间扩大之后，个人凭什么判断相互冲突的权威？"),
  reading("agency-expands-within-religious-patronage", "does-scripture-conscience-create-solitary-infallibility", "个人能动性也需要检验良心的解释边界"),
  reading("law-reveals-incapacity-grace-creates-will", "can-mind-be-explained-without-immaterial-faculty", "改变解释角度：神学中的意志问题与机械论的心灵说明怎样区分？"),
  reading("sensation-imagination-passions-as-bodily-motion", "what-can-thought-know-when-sense-and-words-mislead", "身体过程的因果解释是否同时给出认识的确定性？"),
  reading("mind-body-parallel-expression", "what-makes-one-person-same-over-time", "从同一时刻的心身关系，转问跨时间的人格同一"),
  compare("apperception-builds-conscious-continuity", "what-makes-one-person-same-over-time", "比较意识连续的说明与人格归责的标准"),
  reading("sensation-and-reflection-supply-idea-materials", "what-makes-one-person-same-over-time", "反省提供心灵活动的材料，但人格同一仍需单独说明"),
  compare("personhood-through-conscious-appropriation", "what-unifies-person-without-self-impression", "比较洛克的意识归属与休谟对自我印象的追问"),
  compare("ideas-passive-spirits-active-god-orders-sense", "can-spirit-cause-and-self-survive-strict-experience-test", "贝克莱诉诸精神解释观念的发生；再对照休谟对精神观念来源的检验"),
  reading("association-explains-identity-fiction-not-full-unity", "can-individuality-and-sociality-support-each-other", "内在统一的难题之外，改从教育和关系考察个体的形成"),
  compare("bildung-creative-individuality-within-relations", "is-amour-propre-only-corrupting-vanity", "同题对读：社会评价既可能培养个体，也可能使人依赖赞许；不表示年代顺承"),
  reading("negative-education-protects-developmental-agency", "can-self-legislation-be-universal-without-one-community", "形成判断能力之后，再问判断原则如何获得普遍约束力"),
  compare("autonomy-as-rational-self-legislation", "why-self-consciousness-needs-mutual-recognition", "比较自由的理性根据与自由需要的相互承认"),
  reading("ethical-life-mediates-family-civil-society-state", "does-intensified-desire-liberate-or-enslave", "制度中的自由之外，考察欲望是否仍会支配行动者"),
  compare("two-standpoints-natural-causality-practical-freedom", "can-body-give-access-to-thing-in-itself", "比较对理论知识边界的不同处理：实践自由与身体意愿并非同一论证"),
  reading("world-double-aspect-representation-and-will", "is-suffering-accident-or-structure-of-willing", "把身体中的意愿解释用于持续欲求与痛苦"),
  reading("pessimism-from-endless-willing", "how-can-subject-loosen-service-to-will", "欲求不断再生痛苦时，主体可能怎样暂时或持续改变？"),
  compare("affirmation-revalues-suffering-without-worshipping-it", "does-will-to-power-mean-political-domination", "肯定生活是否等于支配他人？需保留不同含义与政治风险"),
  compare("revaluation-tests-creative-flourishing-with-political-risk", "are-all-pleasures-equal-in-value", "比较价值评价：自我克服与能力发展并不采用同一尺度"),
  reading("higher-pleasures-and-competent-judges", "is-freedom-an-uncaused-instant-choice", "生活质量的比较之外，转问自由行动与整个个人经历的关系"),
  reading("free-act-expresses-whole-developing-self", "are-relations-experienced-or-added-by-thought", "从持续的个人经验，比较经验是否原本就包含关系"),
];

// Small, reviewed cross-topic interfaces, not automatic classification of an era.
// The primary topic remains self; secondary dimensions refer to these very same IDs.
export const selfCrossTopicNodes: Record<"nature" | "society" | "ultimate" | "method", string[]> = {
  nature: ids(`sensation-imagination-passions-as-bodily-motion thought-extension-real-distinction
    mind-body-parallel-expression what-can-freedom-mean-in-necessary-nature
    how-can-freedom-coexist-with-natural-causality experience-as-organism-environment-transaction`),
  society: ids(`how-order-soul-and-polis can-good-life-be-private who-belongs-moral-community
    what-makes-one-person-same-over-time can-social-order-preserve-freedom
    why-self-consciousness-needs-mutual-recognition mutual-recognition-constitutes-social-selfhood
    ethical-life-mediates-family-civil-society-state harm-principle-protects-experiments-in-living
    how-institutionalize-fallible-plural-inquiry`),
  ultimate: ids(`can-soul-survive-body if-creator-good-whence-evil can-will-heal-itself
    does-providence-cancel-freedom one-substance-god-or-nature can-body-give-access-to-thing-in-itself`),
  method: ids(`methodic-doubt-suspends-uncertain-beliefs cogito-performed-certainty
    simple-ideas-copy-impressions-source-test what-unifies-person-without-self-impression
    inquiry-transforms-problematic-situation`),
};
