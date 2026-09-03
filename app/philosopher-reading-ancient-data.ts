import { reading as r } from "./philosopher-reading-unit";

// Keep one memorable tension for fragmentary thinkers; shared school answers
// retain the canonical participant roles rather than becoming private doctrines.
export const ancientPhilosopherReadings = {
  thales: [r("thales-origin", "一种本原怎样解释多样？", "difference-derived-or-original", `
    difference-derived-or-original one-source-many-states being-from-nonbeing
  `)],
  anaximander: [r("anaximander-order", "无定者、对立与秩序", "difference-derived-or-original", `
    difference-derived-or-original order-not-arbitrary-agency opposites-and-process being-from-nonbeing
  `)],
  anaximenes: [r("anaximenes-change", "气怎样连续变化？", "identity-through-change", `
    difference-derived-or-original identity-through-change rarefaction-condensation being-from-nonbeing
  `)],
  pythagoras: [r("pythagoras-ratio", "用数与比例理解秩序", "order-not-arbitrary-agency", `
    order-not-arbitrary-agency difference-as-ratio what-stabilizes-knowledge
  `)],
  heraclitus: [r("heraclitus-order", "变化本身如何有秩序？", "identity-through-change", `
    identity-through-change order-not-arbitrary-agency change-as-order what-stabilizes-knowledge
  `)],
  parmenides: [r("parmenides-being", "存在不变，变化怎么办？", "being-from-nonbeing", `
    being-from-nonbeing stable-being motion-and-plurality-possible change-as-reconfiguration
  `)],
  empedocles: [r("empedocles-roots", "成分不变，组合改变", "change-as-reconfiguration", `
    change-as-reconfiguration roots-love-strife what-does-perception-reveal perception-as-event
  `)],
  anaxagoras: [r("anaxagoras-nous", "混合、分离与努斯的限度", "change-as-reconfiguration", `
    change-as-reconfiguration mixture-nous-separation what-does-nous-explain
  `)],
  leucippus: [r("leucippus-atoms", "原子与虚空怎样容纳变化？", "change-as-reconfiguration", `
    change-as-reconfiguration atoms-void-arrangement what-does-perception-reveal
  `)],
  democritus: [r("democritus-perception", "原子结构与感觉差异", "what-does-perception-reveal", `
    change-as-reconfiguration atoms-void-arrangement what-does-perception-reveal perception-as-event common-standard-of-judgment
  `)],
  protagoras: [r("protagoras-measure", "人的尺度与共同判断", "what-does-perception-reveal", `
    same-thing-different-appearance what-does-perception-reveal appearance-relative-to-perceiver common-standard-of-judgment
  `)],
  socrates: [r("socrates-definition", "从例子追问共同定义", "common-standard-of-judgment", `
    public-disagreement-observation common-standard-of-judgment definition-beyond-instance how-order-soul-and-polis
  `)],
  plato: [
    r("plato-forms", "知识为什么需要理念？", "what-stabilizes-knowledge", `
      what-stabilizes-knowledge stable-object-of-knowledge forms-and-particulars
    `),
    r("plato-justice-soul", "正义、灵魂与城邦", "how-order-soul-and-polis", `
      how-order-soul-and-polis justice-as-ordered-whole can-soul-survive-body immortal-rational-soul
    `),
    r("plato-cosmos", "宇宙中的形式与善", "how-can-cosmos-reflect-good", `
      how-can-cosmos-reflect-good cosmos-shaped-by-form-and-good how-can-causes-be-known
    `),
  ],
  aristotle: [
    r("aristotle-substance", "实体怎样经历变化？", "forms-and-particulars", `
      forms-and-particulars immanent-form-matter change-as-actualization-question potentiality-actuality
    `),
    r("aristotle-explanation", "四因与证明：不同的解释工作", "what-makes-explanation-complete", `
      organized-life-observation what-makes-explanation-complete four-causes-teleology how-can-causes-be-known demonstration-classification
    `),
    r("aristotle-flourishing", "幸福为何需要德性与城邦？", "what-is-human-flourishing", `
      what-is-human-flourishing virtue-as-rational-activity can-good-life-be-private polis-practical-wisdom how-live-uncontrollable-world
    `),
  ],
  diogenes: [r("diogenes-freedom", "减少需要能带来自由吗？", "how-live-uncontrollable-world", `
    how-live-uncontrollable-world cynic-low-dependence freedom-withdrawal-or-role
  `)],
  arcesilaus: [r("arcesilaus-assent", "印象能保证真实吗？", "can-impression-certify-truth", `
    can-impression-certify-truth suspend-self-certifying-assent how-act-without-certainty
  `)],
  carneades: [r("carneades-action", "不确定时怎样行动？", "how-act-without-certainty", `
    how-act-without-certainty probable-tested-guidance who-belongs-moral-community
  `)],
  epicurus: [
    r("epicurus-therapy", "自然知识如何解除恐惧？", "tranquility-needs-knowledge", `
      how-live-uncontrollable-world epicurean-natural-therapy tranquility-needs-knowledge natural-knowledge-removes-fear
    `),
    r("epicurus-friendship", "无天意世界中的友谊与正义", "is-natural-explanation-enough", `
      is-natural-explanation-enough friendship-contract-without-providence is-inner-freedom-enough
    `),
  ],
  lucretius: [r("lucretius-therapy", "用自然解释对抗神罚与死亡恐惧", "tranquility-needs-knowledge", `
    tranquility-needs-knowledge natural-knowledge-removes-fear is-natural-explanation-enough friendship-contract-without-providence
  `)],
  zeno: [
    r("zeno-assent", "德性、印象与同意", "can-impression-certify-truth", `
      how-live-uncontrollable-world stoic-virtue-in-order can-impression-certify-truth cognitive-impression-and-assent fate-and-responsibility
    `),
    r("zeno-cosmopolis", "共同理性与世界城邦", "who-belongs-moral-community", `
      who-belongs-moral-community cosmopolis-common-reason is-inner-freedom-enough
    `),
  ],
  cleanthes: [r("cleanthes-order", "在自然秩序中安放德性", "how-live-uncontrollable-world", `
    how-live-uncontrollable-world stoic-virtue-in-order freedom-withdrawal-or-role
  `)],
  chrysippus: [r("chrysippus-responsibility", "因果决定为何不取消责任？", "fate-and-responsibility", `
    can-impression-certify-truth cognitive-impression-and-assent fate-and-responsibility assent-as-internal-cause is-inner-freedom-enough
  `)],
  panaetius: [r("panaetius-roles", "从角色义务到世界共同体", "freedom-withdrawal-or-role", `
    freedom-withdrawal-or-role role-and-inner-freedom who-belongs-moral-community cosmopolis-common-reason
  `)],
  posidonius: [r("posidonius-community", "共同理性与整体归属", "who-belongs-moral-community", `
    who-belongs-moral-community cosmopolis-common-reason is-inner-freedom-enough
  `)],
  seneca: [r("seneca-freedom", "履行角色，保留内在自由", "freedom-withdrawal-or-role", `
    freedom-withdrawal-or-role role-and-inner-freedom is-inner-freedom-enough
  `)],
  epictetus: [r("epictetus-judgment", "自由在于改变判断", "freedom-withdrawal-or-role", `
    freedom-withdrawal-or-role role-and-inner-freedom who-belongs-moral-community
  `)],
  aurelius: [r("aurelius-duty", "内在判断与公共义务", "freedom-withdrawal-or-role", `
    freedom-withdrawal-or-role role-and-inner-freedom who-belongs-moral-community cosmopolis-common-reason is-inner-freedom-enough
  `)],
  plotinus: [
    r("plotinus-one", "太一怎样产生多样？", "how-many-from-one", `
      is-inner-freedom-enough one-intellect-soul how-many-from-one emanation-without-loss
    `),
    r("plotinus-return", "感性世界与灵魂回归", "is-sensible-world-evil", `
      is-sensible-world-evil dependent-image-not-evil reason-or-divine-aid
    `),
  ],
};
