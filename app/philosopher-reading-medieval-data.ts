import { reading as r } from "./philosopher-reading-unit";

export const medievalPhilosopherReadings = {
  "philo-alexandria": [r("philo-exegesis", "经文怎样进入理性解释？", "how-can-revelation-enter-reason", `
    how-can-revelation-enter-reason logos-layered-exegesis-text can-reason-judge-authority
  `)],
  origen: [r("origen-revelation", "创造、启示与多层释义", "how-can-revelation-enter-reason", `
    does-transcendent-good-act-in-history creator-covenant-salvation-history how-can-revelation-enter-reason logos-layered-exegesis-text
  `)],
  ambrose: [r("ambrose-power", "皇权为何仍受道德责问？", "who-judges-christian-power", `
    who-judges-christian-power emperor-within-church can-autonomy-avoid-supremacy
  `)],
  jerome: [r("jerome-text", "文本校勘与解释权威", "how-can-revelation-enter-reason", `
    how-can-revelation-enter-reason logos-layered-exegesis-text can-reason-judge-authority
  `)],
  augustine: [
    r("augustine-evil", "恶、分裂意志与恩典", "if-creator-good-whence-evil", `
      if-creator-good-whence-evil evil-privation-disordered-will can-will-heal-itself grace-heals-divided-will
    `),
    r("augustine-time", "心灵时间与两种爱的历史", "how-time-history-relate-eternity", `
      how-time-history-relate-eternity created-time-and-two-cities can-salvation-community-survive-empire
    `),
  ],
  boethius: [r("boethius-freedom", "命运、永恒与自由选择", "does-providence-cancel-freedom", `
    what-good-survives-fortune highest-good-not-fortune does-providence-cancel-freedom eternal-present-knows-contingently
  `)],
  benedict: [r("benedict-rule", "共同生活如何持久而不专断？", "how-can-practice-survive-fragile-institutions", `
    how-can-practice-survive-fragile-institutions stability-prayer-work-reading how-can-rule-authority-avoid-domination abbot-bound-by-rule-discernment
  `)],
  "gregory-great": [r("gregory-care", "从因人施教到公共照护", "how-should-office-guide-different-people", `
    how-should-office-guide-different-people pastoral-care-discernment-humility can-spiritual-network-carry-public-order papal-monastic-network-order who-reforms-preserving-church
  `)],
  eriugena: [r("eriugena-theophany", "理性、神显与创造的边界", "how-can-unknowable-god-manifest", `
    can-reason-judge-authority true-reason-true-authority-agree how-can-unknowable-god-manifest fourfold-nature-theophany-return does-theophany-dissolve-creation affirmation-negation-beyond-being
  `)],
  avicenna: [
    r("avicenna-existence", "本质为何不足以保证存在？", "why-possible-existents-exist", `
      why-possible-existents-exist essence-existence-necessary-existent does-necessary-order-leave-divine-choice
    `),
    r("avicenna-self", "自我意识与非物质灵魂", "is-rational-soul-individual", `
      is-rational-soul-individual self-awareness-immaterial-soul can-intellectual-perfection-preserve-person
    `),
  ],
  "al-ghazali": [r("ghazali-causation", "因果规律等于逻辑必然吗？", "are-created-causes-necessary", `
    are-created-causes-necessary regular-conjunction-not-logical-necessity can-philosophy-be-criticized-with-own-tools logic-reused-metaphysics-contested
  `)],
  averroes: [
    r("averroes-demonstration", "自然原因、证明与经文", "how-can-law-and-demonstration-relate", `
      are-created-causes-necessary natural-powers-support-demonstration how-can-law-and-demonstration-relate demonstration-dialectic-rhetoric-audiences who-authorizes-scriptural-interpretation
    `),
    r("averroes-intellect", "共同理智怎样保留个人？", "is-rational-soul-individual", `
      is-rational-soul-individual shared-intellect-individual-imagination can-one-separate-intellect-make-this-person-think
    `),
  ],
  maimonides: [r("maimonides-language", "否定语言与律法生活", "how-can-language-speak-of-simple-god", `
    how-can-language-speak-of-simple-god negative-theology-action-attributes can-esoteric-truth-guide-law-community law-orders-body-and-soul
  `)],
  anselm: [r("anselm-existence", "信仰寻求理解，概念保证存在吗？", "can-concept-of-greatest-show-existence", `
    what-can-reason-add-to-faith faith-seeks-understanding-in-love can-concept-of-greatest-show-existence greatest-cannot-exist-only-in-understanding can-definition-guarantee-instance
  `)],
  roscelin: [r("roscelin-universals", "共同名称需要共同实体吗？", "what-makes-common-term-true-of-many", `
    what-makes-common-term-true-of-many universality-in-name-not-common-entity does-language-analysis-clarify-trinity
  `)],
  abelard: [
    r("abelard-language", "语词、共相与辩证法", "what-makes-common-term-true-of-many", `
      what-makes-common-term-true-of-many universal-term-without-universal-thing does-language-analysis-clarify-trinity distinguish-sound-meaning-reference-doctrine may-dialectic-examine-sacred-doctrine apparent-conflicts-require-context
    `),
    r("abelard-intention", "行为与意图，谁承担罪责？", "are-deeds-or-intentions-morally-primary", `
      are-deeds-or-intentions-morally-primary consent-intention-ground-moral-fault how-can-public-judgment-assess-intention
    `),
  ],
  "bernard-clairvaux": [r("bernard-love", "知识为何应受谦卑与爱约束？", "may-dialectic-examine-sacred-doctrine", `
    may-dialectic-examine-sacred-doctrine knowledge-bounded-by-humility-love who-judges-limits-of-dialectic
  `)],
  "albert-great": [r("albert-science", "理解科学，再划分学科边界", "how-disciplines-differ-by-subject-method", `
    must-new-science-be-understood-before-judged albert-paraphrases-complete-sciences how-disciplines-differ-by-subject-method natural-science-reason-sense-own-method does-distinction-create-two-truths truth-cannot-contradict-truth
  `)],
  aquinas: [
    r("aquinas-reason", "理性、启示与自然原因", "can-reason-and-revelation-divide-labor", `
      can-reason-and-revelation-divide-labor natural-preambles-revealed-mysteries do-secondary-causes-have-real-power created-causes-real-under-first-cause can-reason-prove-temporal-beginning creation-not-same-as-temporal-beginning where-natural-demonstration-reaches-limit
    `),
    r("aquinas-being", "从效果追问第一原因与存在", "what-can-effects-prove-first-cause", `
      what-can-effects-prove-first-cause five-ways-from-effects does-first-cause-yet-count-as-god first-cause-to-divine-attributes how-can-creature-words-name-god analogical-names-neither-same-nor-unrelated is-god-one-being-among-others subsistent-being-creatures-participate
    `),
    r("aquinas-person", "这个人怎样思想与认识？", "can-one-separate-intellect-make-this-person-think", `
      can-one-separate-intellect-make-this-person-think each-human-soul-has-intellectual-powers how-individual-intellect-knows-universals abstraction-makes-universal-knowledge what-of-person-after-body subsistent-soul-survives-incomplete
    `),
    r("aquinas-practice", "自然法、审慎与强制的限度", "how-can-common-good-guide-changing-actions", `
      how-can-common-good-guide-changing-actions practical-reason-first-principles-natural-law why-universal-precepts-not-enough prudence-virtue-apply-principles what-can-human-law-rightly-command law-for-common-good-limited-coercion can-acquired-virtue-reach-final-end grace-perfects-nature-infused-virtues
    `),
  ],
  "roger-bacon": [r("roger-bacon-correction", "论证之后，经验怎样纠错？", "what-certifies-conclusion-beyond-argument", `
    how-can-authority-correct-inherited-error languages-mathematics-optics-correct-authority what-certifies-conclusion-beyond-argument experience-certifies-theoretical-conclusions is-experience-an-autonomous-end experimental-sciences-serve-moral-reform
  `)],
  bonaventure: [r("bonaventure-illumination", "照明完成认知，而非取代理性", "can-created-cognition-ground-certainty", `
    what-purpose-orders-franciscan-learning knowledge-ordered-to-wisdom-and-love can-created-cognition-ground-certainty created-causes-with-divine-illumination does-illumination-replace-reason illumination-completes-not-replaces-cognition can-philosophy-be-final-wisdom
  `)],
  "duns-scotus": [
    r("scotus-being", "概念单义是否抹去神圣差异？", "can-one-concept-signify-god-and-creature", `
      can-one-concept-signify-god-and-creature univocal-being-infinite-finite-modes does-univocity-put-god-in-genus common-concept-without-common-genus
    `),
    r("scotus-individual", "此性与自由选择", "what-makes-common-nature-this-individual", `
      what-makes-common-nature-this-individual common-nature-contracted-by-haecceity does-intellectual-judgment-determine-choice will-has-synchronic-alternative-power
    `),
  ],
  ockham: [
    r("ockham-signs", "个体、心理符号与剃刀", "do-common-predicates-require-common-natures", `
      do-common-predicates-require-common-natures individuals-and-universal-mental-signs how-do-mental-terms-signify-things intuitive-cognition-causes-mental-language is-nominalism-just-the-razor universals-rejected-by-incoherence-not-razor-alone when-is-extra-entity-warranted parsimony-bounded-by-reason-experience-scripture
    `),
    r("ockham-power", "可错权威与相互纠正", "can-pope-err-and-be-corrected", `
      can-pope-err-and-be-corrected papal-authority-fallible-and-limited how-distinct-powers-correct-each-other distinct-powers-occasional-intervention
    `),
  ],
  "marsilius-padua": [r("marsilius-law", "谁立法，谁教导，谁执行？", "who-makes-coercive-law-for-political-community", `
    who-makes-coercive-law-for-political-community human-legislator-people-prevailing-part is-human-legislator-modern-democracy late-medieval-consent-not-universal-suffrage what-remains-of-priestly-authority-without-coercion priesthood-teaches-sacraments-no-independent-coercion who-decides-scripture-heresy-and-church-rule general-council-represents-faithful-secular-enforcement
  `)],
};
