export type ProblemFacetId = "method" | "nature" | "self" | "society" | "ultimate";

export type ProblemFacetOption = {
  id: ProblemFacetId;
  label: string;
  english: string;
  question: string;
  available: boolean;
};

export type ProblemCompressionLevel = "5" | "10" | "20" | "50" | "all";

export type SelfSummaryUnit = {
  id: string;
  title: string;
  period: string;
  question: string;
  thesis: string;
  transition: string;
  phaseIds?: string[];
  children?: SelfSummaryUnit[];
};

export const problemFacetOptions: ProblemFacetOption[] = [
  { id: "method", label: "方法", english: "METHOD", question: "我们怎样观察、推理、证明与表达？", available: false },
  { id: "nature", label: "自然", english: "NATURE", question: "自然怎样构成、变化并形成可解释的秩序？", available: false },
  { id: "self", label: "自我", english: "SELF", question: "心灵、感受、人格与自由怎样成立？", available: true },
  { id: "society", label: "社会", english: "SOCIETY", question: "行为、规范、权力与共同生活怎样组织？", available: false },
  { id: "ultimate", label: "终极", english: "ULTIMATE", question: "存在、目的、最高原则与最终边界是什么？", available: false },
];

export const problemCompressionLevels: { id: ProblemCompressionLevel; label: string; note: string }[] = [
  { id: "5", label: "5", note: "五个主矛盾：只辨认自我问题怎样换形。" },
  { id: "10", label: "10", note: "十个主要转折：展开每个主矛盾的历史分化。" },
  { id: "20", label: "20", note: "二十个关键接口：保留主要分叉、回应与跨期连接。" },
  { id: "50", label: "50", note: "五十个原子地标：进入具体问题与答案，但仍隐藏过渡细节。" },
  { id: "all", label: "全部", note: "显示全部自我相关原子节点及其可追溯关系。" },
];

// “自我”首轮标签：既包括主线节点，也包括与方法、自然、社会和终极直接相接的接口节点。
// 标签表示相关性，不表示节点只能属于自我；后续主题可以复用同一稳定节点 ID。
export const selfFacetNodeIds = [
  "justice-as-ordered-whole",
  "can-soul-survive-body",
  "immortal-rational-soul",
  "cognitive-impression-and-assent",
  "fate-and-responsibility",
  "assent-as-internal-cause",
  "is-inner-freedom-enough",
  "dependent-image-not-evil",
  "reason-or-divine-aid",
  "if-creator-good-whence-evil",
  "evil-privation-disordered-will",
  "can-will-heal-itself",
  "grace-heals-divided-will",
  "does-providence-cancel-freedom",
  "eternal-present-knows-contingently",
  "is-rational-soul-individual",
  "shared-intellect-individual-imagination",
  "can-intellectual-perfection-preserve-person",
  "can-one-separate-intellect-make-this-person-think",
  "each-human-soul-has-intellectual-powers",
  "how-individual-intellect-knows-universals",
  "what-makes-common-nature-this-individual",
  "common-nature-contracted-by-haecceity",
  "does-intellectual-judgment-determine-choice",
  "will-has-synchronic-alternative-power",
  "do-common-predicates-require-common-natures",
  "how-can-thought-judge-state-classics-scripture-experience",
  "does-expanded-agency-mean-secular-liberation",
  "agency-expands-within-religious-patronage",
  "justification-by-faith-reorders-works",
  "how-free-is-will-before-grace",
  "erasmus-small-cooperation-under-grace",
  "luther-bound-will-in-salvation",
  "why-command-if-will-cannot-save-itself",
  "law-reveals-incapacity-grace-creates-will",
  "does-scripture-conscience-create-solitary-infallibility",
  "can-mind-be-explained-without-immaterial-faculty",
  "sensation-imagination-passions-as-bodily-motion",
  "self-preservation-and-protection-bound-obedience",
  "what-can-thought-know-when-sense-and-words-mislead",
  "what-is-the-self-known-in-cogito",
  "thinking-thing-before-body",
  "can-finite-thinker-secure-clear-distinct-truth",
  "is-mind-really-distinct-from-body",
  "matter-as-extension-mechanical-order",
  "thought-extension-real-distinction",
  "how-can-distinct-mind-and-body-form-one-human",
  "mind-body-union-lived-not-mechanically-resolved",
  "can-two-created-substances-fit-one-intelligible-nature",
  "one-substance-god-or-nature",
  "if-mind-and-body-do-not-interact-how-correspond",
  "mind-body-parallel-expression",
  "what-can-freedom-mean-in-necessary-nature",
  "conatus-and-adequate-understanding-increase-agency",
  "can-understanding-transform-passions-without-suppressing-them",
  "how-do-perception-memory-and-reason-emerge",
  "apperception-builds-conscious-continuity",
  "are-ideas-innate-dispositions-or-experiential-materials",
  "what-makes-one-person-same-over-time",
  "personhood-through-conscious-appropriation",
  "how-can-accountability-exceed-explicit-memory",
  "what-causes-involuntary-sensory-ideas",
  "ideas-passive-spirits-active-god-orders-sense",
  "direct-idea-world-with-notions-of-spirit",
  "can-spirit-cause-and-self-survive-strict-experience-test",
  "simple-ideas-copy-impressions-source-test",
  "what-unifies-person-without-self-impression",
  "self-as-bundle-and-succession-of-perceptions",
  "can-association-explain-one-mind-and-responsibility",
  "association-explains-identity-fiction-not-full-unity",
  "are-liberty-and-causal-necessity-compatible",
  "liberty-as-action-according-to-will",
  "can-caused-actions-ground-responsibility",
  "can-scepticism-guide-life-without-paralysis",
  "can-individuality-and-sociality-support-each-other",
  "bildung-creative-individuality-within-relations",
  "can-authentic-feeling-legitimate-political-power",
  "is-amour-propre-only-corrupting-vanity",
  "amour-propre-can-be-inflamed-or-egalitarian",
  "how-educate-agency-without-premature-dependence",
  "negative-education-protects-developmental-agency",
  "can-social-order-preserve-freedom",
  "can-self-legislation-be-universal-without-one-community",
  "autonomy-as-rational-self-legislation",
  "how-can-freedom-coexist-with-natural-causality",
  "two-standpoints-natural-causality-practical-freedom",
  "can-practical-reason-know-transcendent-freedom",
  "why-self-consciousness-needs-mutual-recognition",
  "mutual-recognition-constitutes-social-selfhood",
  "can-domination-secure-recognition",
  "asymmetric-recognition-undermines-itself",
  "why-abstract-right-and-private-conscience-insufficient",
  "does-intensified-desire-liberate-or-enslave",
  "desire-reveals-will-before-rational-purpose",
  "can-body-give-access-to-thing-in-itself",
  "does-negating-will-repeat-nihilism",
  "affirmation-revalues-suffering-without-worshipping-it",
  "does-will-to-power-mean-political-domination",
  "will-to-power-as-overcoming-and-organization-contested",
  "can-revaluation-avoid-arbitrary-cruelty",
  "are-all-pleasures-equal-in-value",
  "higher-pleasures-and-competent-judges",
  "does-liberty-serve-welfare-beyond-preference",
  "is-freedom-an-uncaused-instant-choice",
  "free-act-expresses-whole-developing-self",
  "how-test-meaning-and-truth-in-plural-experience",
  "are-relations-experienced-or-added-by-thought",
  "radical-empiricism-includes-experienced-relations",
  "is-experience-private-inner-content",
  "experience-as-organism-environment-transaction",
] as const;

export const selfLandmark50NodeIds = [
  "can-soul-survive-body",
  "fate-and-responsibility",
  "assent-as-internal-cause",
  "reason-or-divine-aid",
  "evil-privation-disordered-will",
  "grace-heals-divided-will",
  "eternal-present-knows-contingently",
  "shared-intellect-individual-imagination",
  "each-human-soul-has-intellectual-powers",
  "common-nature-contracted-by-haecceity",
  "will-has-synchronic-alternative-power",
  "how-can-thought-judge-state-classics-scripture-experience",
  "agency-expands-within-religious-patronage",
  "how-free-is-will-before-grace",
  "law-reveals-incapacity-grace-creates-will",
  "sensation-imagination-passions-as-bodily-motion",
  "self-preservation-and-protection-bound-obedience",
  "thinking-thing-before-body",
  "thought-extension-real-distinction",
  "mind-body-union-lived-not-mechanically-resolved",
  "can-two-created-substances-fit-one-intelligible-nature",
  "mind-body-parallel-expression",
  "conatus-and-adequate-understanding-increase-agency",
  "apperception-builds-conscious-continuity",
  "personhood-through-conscious-appropriation",
  "ideas-passive-spirits-active-god-orders-sense",
  "can-spirit-cause-and-self-survive-strict-experience-test",
  "self-as-bundle-and-succession-of-perceptions",
  "association-explains-identity-fiction-not-full-unity",
  "liberty-as-action-according-to-will",
  "bildung-creative-individuality-within-relations",
  "amour-propre-can-be-inflamed-or-egalitarian",
  "negative-education-protects-developmental-agency",
  "autonomy-as-rational-self-legislation",
  "two-standpoints-natural-causality-practical-freedom",
  "mutual-recognition-constitutes-social-selfhood",
  "asymmetric-recognition-undermines-itself",
  "desire-reveals-will-before-rational-purpose",
  "affirmation-revalues-suffering-without-worshipping-it",
  "will-to-power-as-overcoming-and-organization-contested",
  "higher-pleasures-and-competent-judges",
  "free-act-expresses-whole-developing-self",
  "radical-empiricism-includes-experienced-relations",
  "experience-as-organism-environment-transaction",
  "what-is-the-self-known-in-cogito",
  "how-can-distinct-mind-and-body-form-one-human",
  "what-makes-one-person-same-over-time",
  "what-unifies-person-without-self-impression",
  "how-can-freedom-coexist-with-natural-causality",
  "why-self-consciousness-needs-mutual-recognition",
] as const;

export const selfSummaryTree: SelfSummaryUnit[] = [
  {
    id: "self-5-soul-agency",
    title: "灵魂从认识主体变成可负责的行动者",
    period: "古希腊至罗马",
    question: "自我只是身体中的生命活动，还是能够认识真实、控制判断并承担责任的主体？",
    thesis: "柏拉图把灵魂连接到不变真实，斯多葛派再把自由收缩到主体对印象的同意；自我由‘能否离身存在’转向‘行动怎样成为自己的’。",
    transition: "当外在城邦秩序不再可靠，内在判断仍不足以回答恶、分裂意志与最高意义。",
    children: [
      {
        id: "self-10-rational-soul",
        title: "理性灵魂、正义与不朽",
        period: "古典希腊",
        question: "把握不变形式的主体能否独立于身体，并以内部秩序构成正义？",
        thesis: "灵魂被组织为认识与行动的统一承担者，但其不朽、与身体的关系及内部部分如何统一仍有争议。",
        transition: "帝国时代把问题从灵魂实体进一步转向日常判断与责任。",
        children: [
          { id: "self-20-soul-order", title: "灵魂以何种秩序成为同一个人？", period: "柏拉图", question: "灵魂的不同能力怎样形成可认识、可行动的整体？", thesis: "正义被理解为灵魂各部分形成秩序，而理性活动把自我连接到稳定真实。", transition: "若灵魂属于可知秩序，还要追问它能否脱离身体。", phaseIds: ["from-perception-to-knowledge"] },
          { id: "self-20-soul-survival", title: "认识真实是否保证灵魂不朽？", period: "柏拉图及其后继", question: "认识不变对象的能力，是否足以证明灵魂独立延续？", thesis: "哲学净化把自我提升为不完全受身体支配的主体，却没有自动解决个人连续性。", transition: "后继传统把自由的检验转到因果世界中的具体行动。", phaseIds: ["from-perception-to-knowledge"] },
        ],
      },
      {
        id: "self-10-assent-inwardness",
        title: "命运中的同意与内在自由",
        period: "希腊化至罗马",
        question: "外部事件受因果和命运支配时，行动如何仍能归属于主体？",
        thesis: "斯多葛派区分印象与同意，把自由安置在判断；罗马与晚期古代又追问这种内在自由是否足以支撑最高意义。",
        transition: "意志的内部秩序很快被放进创造、恶与救赎的神学框架。",
        children: [
          { id: "self-20-assent-responsibility", title: "同意怎样使行动成为我的？", period: "斯多葛主义", question: "外因触发印象时，主体在哪一步承担责任？", thesis: "行动不是无原因事件；主体通过同意把外部刺激转化为自己的判断和行为。", transition: "内在因果保存责任，却未说明意志为何会持续选择错误。", phaseIds: ["criteria-freedom-cosmopolis"] },
          { id: "self-20-inner-freedom-meaning", title: "内在自由是否足以回答最高意义？", period: "罗马至晚期古代", question: "控制判断、履行角色和接受命运，是否已经给出完整自我？", thesis: "自我越来越以内在转向获得稳定，但也由此向灵魂回归、恶与神圣援助开放。", transition: "基督教思想把自由的困难改写为分裂意志及其医治。", phaseIds: ["roman-inwardness-and-one"] },
        ],
      },
    ],
  },
  {
    id: "self-5-will-person",
    title: "意志、恩典与个体人格进入自我核心",
    period: "教父时期至经院哲学",
    question: "若人会明知善而不能行善，个体意志、责任、恩典和人格怎样同时成立？",
    thesis: "奥古斯丁把恶定位为意志秩序的败坏；中世纪关于预知、共同理智、个体灵魂、此性和选择能力的争论，逐步把‘这个人’变成不可回避的问题。",
    transition: "当文本、教会和国家权威分化，个人判断与良心获得更高可见度，也承担更重的证明负担。",
    children: [
      {
        id: "self-10-grace-providence",
        title: "分裂意志、恩典与预知",
        period: "教父时期至早期中世纪",
        question: "意志若被自己的爱和习惯束缚，如何仍受责并重新获得行动能力？",
        thesis: "恶被理解为受造善的败坏，恩典医治而非简单替代意志；永恒预知则被区分为认识自由行动而非外部强迫。",
        transition: "救赎中的人格还必须说明理性能力为何属于每一个具体的人。",
        children: [
          { id: "self-20-divided-will-grace", title: "意志为何分裂，又能否自我医治？", period: "奥古斯丁", question: "知道善为何不能保证选择善？", thesis: "错误不来自独立邪恶实体，而来自爱与意志秩序的偏离；恩典恢复行动能力。", transition: "医治意志仍须与责任和自由选择相容。", phaseIds: ["revelation-grace-history"] },
          { id: "self-20-providence-contingency", title: "无误预知会不会取消自由？", period: "波爱修斯及中世纪", question: "未来行动已被永恒认识时，它还能真正可能不同吗？", thesis: "永恒当下的认识与时间中的强迫被区分，以保存偶然行动及归责。", transition: "问题随后进入理智是否为个体所有的争论。", phaseIds: ["consolation-rule-pastoral-order"] },
        ],
      },
      {
        id: "self-10-individual-intellect-will",
        title: "共同理性怎样成为这个人的思想与选择？",
        period: "伊斯兰哲学与拉丁经院哲学",
        question: "普遍理性若超越身体，为什么仍是这个具体的人在认识和选择？",
        thesis: "共同理智论、个体灵魂、此性和意志同步选择能力，分别尝试保存知识普遍性与个人不可替代性。",
        transition: "个体化不仅成为形而上问题，也转化为个人判断能否面对多重权威。",
        children: [
          { id: "self-20-individual-intellect", title: "普遍理智如何属于每个具体的人？", period: "阿维森纳、阿威罗伊与阿奎那", question: "超越私人感觉的知识怎样仍由个体承担？", thesis: "共享理智强化知识普遍性，个体灵魂论则坚持每个人拥有自己的理智能力。", transition: "个体理智成立后，还要说明个体本身怎样不可重复。", phaseIds: ["translation-demonstration-revelation", "aquinas-nature-grace-order"] },
          { id: "self-20-haecceity-choice", title: "此性与选择怎样构成不可替代者？", period: "司各脱及晚期经院哲学", question: "共同本性如何成为这个个体，理智理由又是否必然决定意志？", thesis: "此性标记不可重复个体，意志的同步可能性则把自由定位为面对理由仍可选择。", transition: "个人能力扩大后，判断权开始进入文本、教会和国家的冲突。", phaseIds: ["scotus-ockham-individual-signs"] },
        ],
      },
    ],
  },
  {
    id: "self-5-modern-subject",
    title: "自我成为知识起点，也陷入心身与同一难题",
    period: "文艺复兴至经验主义",
    question: "个人判断能否从身体、权威和经验中取得确定起点，并保持为同一个行动者？",
    thesis: "良心与能动性上升后，霍布斯把心灵身体化，笛卡尔从我思奠基，斯宾诺莎重写因果自由；洛克、贝克莱与休谟又以经验来源检验实体自我和人格连续。",
    transition: "主体既不能只是孤立实体，也不能仅靠记忆和联想完成统一，问题开始转向形成、教育与社会关系。",
    children: [
      {
        id: "self-10-agency-conscience-cogito",
        title: "个人判断从权威冲突走向身体与我思",
        period: "文艺复兴、宗教改革与笛卡尔",
        question: "当传统权威分裂，个人凭什么判断，又是什么在身体变化中进行思考？",
        thesis: "人文主义和宗教改革提高个人行动与良心的可见度；霍布斯尝试身体化心灵，笛卡尔则以正在思考的主体取得确定性。",
        transition: "把思维确立为独立实体，立即产生它怎样与身体组成一个人的难题。",
        children: [
          { id: "self-20-agency-conscience", title: "能动性与良心如何面对多重权威？", period: "文艺复兴与宗教改革", question: "个人行动和经文良心获得地位后，怎样避免孤立判断自称无误？", thesis: "主体从制度中获得更大判断空间，却仍嵌在宗教、城市、文本和共同解释关系中。", transition: "认识权威的冲突推动思想寻找不依赖争议传统的起点。", phaseIds: ["schism-conciliar-reform-transition", "renaissance-texts-cities-human-agency", "humanism-reformation-conscience-authority"] },
          { id: "self-20-body-cogito", title: "身体过程与我思分别怎样解释心灵？", period: "霍布斯与笛卡尔", question: "心灵能否化约为身体运动，或首先确定为思维之物？", thesis: "机械论说明感觉和欲望的因果过程，我思则从第一人称确定性确立主体；两者形成近代自我的基本张力。", transition: "思维与广延的清楚区分把统一的人重新变成问题。", phaseIds: ["hobbes-motion-language-covenant-sovereignty", "descartes-doubt-cogito-mind-body"] },
        ],
      },
      {
        id: "self-10-mind-body-identity",
        title: "心身、情感与人格连续接受因果和经验检验",
        period: "斯宾诺莎至休谟",
        question: "若自我处于完整因果秩序，什么维持心身统一、意识连续和责任？",
        thesis: "平行论、充足理解、统觉、意识归属和知觉束依次把自我从简单实体改写为因果能力、连续活动或关系结构。",
        transition: "实体自我被削弱后，个体怎样在教育和承认中形成成为新的问题。",
        children: [
          { id: "self-20-mind-body-affect", title: "心身对应与情感理解能否重写自由？", period: "笛卡尔与斯宾诺莎", question: "心身不直接互动或都受原因支配时，自由还剩下什么？", thesis: "心身被理解为同一秩序的不同表达，自由则转为由较充分理解组织情感与行动。", transition: "因果自我还需要跨时间保持意识和责任。", phaseIds: ["descartes-doubt-cogito-mind-body", "spinoza-one-substance-affects-freedom"] },
          { id: "self-20-personal-identity-critique", title: "意识、记忆与知觉束能否维持同一个人？", period: "莱布尼茨、洛克、贝克莱与休谟", question: "身体和心理内容变化时，什么把经验归给同一主体？", thesis: "统觉和意识归属保存连续性；经验审查随后把实体自我压缩为知觉序列，并暴露责任超过记忆的困难。", transition: "自我统一不再只靠内在材料，而要考察关系、教育和社会形成。", phaseIds: ["leibniz-monads-reasons-possible-worlds", "locke-experience-ideas-knowledge-identity", "berkeley-ideas-spirits-immaterialism", "hume-impressions-causation-self-scepticism"] },
        ],
      },
    ],
  },
  {
    id: "self-5-formation-recognition",
    title: "自由自我被重新放进教育、因果与承认关系",
    period: "卢梭、康德与黑格尔",
    question: "自我怎样在社会中形成而不被社会吞没，又怎样在自然因果中承担普遍责任？",
    thesis: "浪漫主义和卢梭揭示个体由关系与教育塑造；康德以自律保存实践自由，黑格尔则把独立主体推进到相互承认和制度中。",
    transition: "理性自律与社会承认仍可能忽略身体欲望、痛苦、时间经验和历史形成。",
    children: [
      {
        id: "self-10-formation-dependence",
        title: "个体性在教育与社会依赖中形成",
        period: "浪漫主义与卢梭",
        question: "个体怎样通过关系成长，而不被虚荣、命令和社会比较支配？",
        thesis: "个体性不再被理解为先于社会的封闭内核；教育与平等关系可以塑造判断，也可能制造依赖。",
        transition: "形成中的主体还需要一个不依赖特殊共同体的自由标准。",
        children: [
          { id: "self-20-formed-individuality", title: "独特个体是否只能在关系中形成？", period: "浪漫主义", question: "创造性个体怎样既非习俗复制，也非孤立任性？", thesis: "教育、文化和关系成为个体能力的形成条件，同时保留对社会同化的批判。", transition: "卢梭把这种形成问题具体化为自爱、教育和依赖。", phaseIds: ["romanticism-reason-nature-individuality"] },
          { id: "self-20-education-dependence", title: "教育怎样培养自主而不是服从？", period: "卢梭", question: "儿童和公民怎样在不可避免的依赖中形成判断与自制？", thesis: "消极教育延缓虚荣竞争，以安排后的经验培养能力；社会自爱则可能转向平等承认。", transition: "发展性自由仍需说明为何具有普遍规范力量。", phaseIds: ["rousseau-inequality-education-general-will"] },
        ],
      },
      {
        id: "self-10-autonomy-recognition",
        title: "自律自由转向相互承认",
        period: "康德与黑格尔",
        question: "主体能否在自然因果中自我立法，又为何必须获得其他主体承认？",
        thesis: "康德用现象与实践立场区分保存归责；黑格尔指出孤立自我不能独自完成自由，承认必须进入权利和共同规范。",
        transition: "形式自律和制度承认之后，欲望与生活时间重新检验主体是否过于抽象。",
        children: [
          { id: "self-20-autonomy-causality", title: "自然因果与实践自由能否同时成立？", period: "康德", question: "同一行动怎样既可被因果说明，又可被主体负责？", thesis: "行动在现象层属于自然因果，在实践立场必须按自我立法归责；自由不是理论对象。", transition: "普遍自律仍没有说明具体自我怎样在社会中确认自身。", phaseIds: ["kant-experience-autonomy-judgment"] },
          { id: "self-20-recognition-social-self", title: "为什么自我意识需要他者承认？", period: "黑格尔", question: "一个主体为何不能单独确认自己的自由？", thesis: "相互承认构成可持续自我、权利和共同规范；支配因取消对方主体性而自行失败。", transition: "社会自我形成后，身体欲望与非理性动力仍要求解释。", phaseIds: ["hegel-dialectic-recognition-ethical-life-history", "byron-romantic-rebellion-individuality"] },
        ],
      },
    ],
  },
  {
    id: "self-5-lived-temporal-self",
    title: "欲望、痛苦与时间把自我改写为发展过程",
    period: "十九世纪至实用主义",
    question: "自我是否是固定实体，还是由身体欲望、记忆、环境关系和持续行动形成的过程？",
    thesis: "叔本华和尼采从欲望、痛苦与自我克服挑战理性主体；柏格森、詹姆斯和杜威进一步把自由、经验和人格放进不可切割的时间与环境交易。",
    transition: "终点不再寻找一次完成的自我定义，而追问多种纠错尺度怎样共同支持有限行动者。",
    children: [
      {
        id: "self-10-desire-suffering",
        title: "欲望、痛苦与自我克服挑战理性主体",
        period: "叔本华、尼采与密尔",
        question: "欲望是理性选择的材料，还是先于理由并持续塑造主体的动力？",
        thesis: "身体意愿揭示非理性驱力，痛苦可被否定、转化或承担；能力发展又使自由与幸福不能只按快感数量衡量。",
        transition: "若自我是发展过程，自由必须在真实持续和经验关系中重新理解。",
        children: [
          { id: "self-20-desire-suffering", title: "欲望和痛苦揭示了怎样的主体？", period: "叔本华与尼采", question: "理性目的是否只是更深驱力寻找对象的形式？", thesis: "自我被理解为欲望组织和克服阻力的过程；回应痛苦既不能神圣化它，也不能简单退出生命。", transition: "主体的价值重估仍要接受任意和残酷风险的检验。", phaseIds: ["schopenhauer-representation-will-suffering-release", "nietzsche-genealogy-nihilism-revaluation"] },
          { id: "self-20-capacity-liberty", title: "幸福是否包含较高能力与个性发展？", period: "密尔", question: "自由和幸福只是满足既有偏好，还是形成新能力的条件？", thesis: "较高能力、判断与生活实验进入幸福尺度，使个体发展不能被压成快感总量。", transition: "发展需要时间，因此自由行动不能只看作瞬间选择。", phaseIds: ["utilitarianism-welfare-liberty-reform"] },
        ],
      },
      {
        id: "self-10-duration-transaction",
        title: "持续经验与环境交易取代封闭实体自我",
        period: "柏格森、詹姆斯与杜威",
        question: "过去如何进入现在，经验关系又怎样构成行动者？",
        thesis: "自由行动表达持续形成的整个自我；经验包含关系和过渡，并最终被理解为有机体与环境的交易，而非封闭心灵中的材料。",
        transition: "自我主线以开放问题收束：怎样同时保存经验连续、公共纠错、历史条件与有限自由？",
        children: [
          { id: "self-20-duration-free-act", title: "自由行动怎样表达持续形成的整个自我？", period: "柏格森", question: "自由是否必须是脱离原因的瞬间选择？", thesis: "过去在绵延中进入现在，自由行动由不可外拆的整个发展中自我发出。", transition: "个体持续还要放进与世界共享的经验关系。", phaseIds: ["bergson-duration-memory-intuition-creation"] },
          { id: "self-20-experience-transaction", title: "经验是私人内容还是环境中的关系过程？", period: "詹姆斯与杜威", question: "主体、对象和关系是否先分开，再由心灵连接？", thesis: "激进经验论把关系纳入经验，杜威再把自我理解为有机体与环境持续调节的行动结构。", transition: "固定实体被放弃，但行动、责任与公共纠错仍需协同。", phaseIds: ["james-pragmatism-truth-belief-pluralism", "dewey-inquiry-education-democracy"] },
        ],
      },
    ],
  },
];

export function flattenSelfSummaryLevel(level: "5" | "10" | "20") {
  if (level === "5") return selfSummaryTree;
  if (level === "10") return selfSummaryTree.flatMap((unit) => unit.children || []);
  return selfSummaryTree.flatMap((unit) => (unit.children || []).flatMap((child) => child.children || []));
}

export function collectSelfSummaryPhaseIds(unit: SelfSummaryUnit): string[] {
  if (unit.phaseIds) return unit.phaseIds;
  return [...new Set((unit.children || []).flatMap(collectSelfSummaryPhaseIds))];
}
