export type ProblemDensityId = "guide" | "backbone" | "standard" | "complete" | "research";

export type ProblemDensityOption = {
  id: ProblemDensityId;
  label: string;
  english: string;
  description: string;
};

export const problemDensityOptions: ProblemDensityOption[] = [
  {
    id: "guide",
    label: "导览",
    english: "ORIENTATION",
    description: "按历史时期与五个问题家族只显示关键接口，用来辨认全书问题从哪里出现、怎样换形。",
  },
  {
    id: "backbone",
    label: "主干",
    english: "BACKBONE",
    description: "保留观察、分叉、汇合、跨阶段接口与开放问题；一进一出的过渡步骤折叠为路径。",
  },
  {
    id: "standard",
    label: "标准",
    english: "STANDARD",
    description: "保留全部分支，并把连续的一进一出论证链压成可展开单位；适合日常阅读。",
  },
  {
    id: "complete",
    label: "完整",
    english: "COMPLETE",
    description: "显示全部原子节点和原始关系，不做折叠；适合检查每一步问题与回答。",
  },
  {
    id: "research",
    label: "研究",
    english: "EVIDENCE",
    description: "在完整图上进一步显示关系标签与证据性质；适合来源核对和内容审核。",
  },
];

export type ProblemFamilyId = "world-change" | "knowledge-language" | "self-agency" | "life-law" | "transcendence-authority";

export type ProblemFamily = {
  id: ProblemFamilyId;
  label: string;
  english: string;
  description: string;
  lane: number;
  anchorNodeIds: string[];
};

export const problemFamilies: ProblemFamily[] = [
  {
    id: "world-change",
    label: "世界、变化与因果",
    english: "WORLD · CHANGE · CAUSE",
    description: "追踪多样、运动、实体、原因与自然秩序怎样得到解释。",
    lane: 0,
    anchorNodeIds: [
      "difference-as-observation",
      "identity-through-change",
      "one-source-many-states",
      "motion-and-plurality-possible",
      "atoms-void-arrangement",
      "immanent-form-matter",
      "potentiality-actuality",
      "one-intellect-soul",
      "created-time-and-two-cities",
      "regular-conjunction-not-logical-necessity",
      "created-causes-real-under-first-cause",
      "experience-certifies-theoretical-conclusions",
      "virtu-adapts-to-fortuna",
      "what-can-publicly-correct-text-church-state-nature",
      "copernican-model-reorders-appearances",
      "keplerian-residuals-revise-geometry",
      "acceleration-and-composed-projectile-motion",
      "artifice-and-experiment-make-causes-visible",
      "causes-and-works-connect-light-fruit-and-power",
      "sensation-imagination-passions-as-bodily-motion",
      "mechanism-constrains-but-does-not-deduce-authority",
    ],
  },
  {
    id: "knowledge-language",
    label: "知识、语言与证明",
    english: "KNOWLEDGE · LANGUAGE · PROOF",
    description: "追踪感觉、判断、逻辑、翻译、共相与证据标准怎样取得公共效力。",
    lane: 1,
    anchorNodeIds: [
      "what-does-perception-reveal",
      "common-standard-of-judgment",
      "what-stabilizes-knowledge",
      "stable-object-of-knowledge",
      "logic-translation-curriculum",
      "true-reason-true-authority-agree",
      "translation-commentary-demonstration-network",
      "how-latin-schools-judge-new-authorities",
      "truth-cannot-contradict-truth",
      "natural-preambles-revealed-mysteries",
      "intuitive-cognition-causes-mental-language",
      "parsimony-bounded-by-reason-experience-scripture",
      "ad-fontes-philology-corrects-inheritance",
      "trained-comparison-with-interpretive-restraint",
      "philology-print-survive-under-confessional-discipline",
      "calibration-record-repetition-stabilize-instruments",
      "idealization-controlled-operation-mathematical-law",
      "plural-methods-form-public-correction-network",
      "four-idols-diagnose-inquiry-obstacles",
      "tables-and-exclusion-build-gradual-induction",
      "first-vintage-remains-provisional-not-algorithmic",
      "names-definitions-reasoning-as-reckoning",
      "made-commonwealth-supports-conditional-civil-science",
    ],
  },
  {
    id: "self-agency",
    label: "心灵、自由与人格",
    english: "MIND · FREEDOM · PERSON",
    description: "追踪灵魂、意志、责任、恩典与个体人格怎样在秩序中保持行动能力。",
    lane: 2,
    anchorNodeIds: [
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
    ],
  },
  {
    id: "life-law",
    label: "好生活、法律与共同体",
    english: "LIFE · LAW · COMMUNITY",
    description: "追踪幸福、德性、共同善、政治法律与公共生活如何彼此限制。",
    lane: 3,
    anchorNodeIds: [
      "virtue-as-rational-activity",
      "how-live-uncontrollable-world",
      "cynic-low-dependence",
      "epicurean-natural-therapy",
      "cosmopolis-common-reason",
      "law-orders-body-and-soul",
      "practical-reason-first-principles-natural-law",
      "papal-authority-fallible-and-limited",
      "human-legislator-people-prevailing-part",
      "general-council-represents-faithful-secular-enforcement",
      "plural-authorities-replace-single-center",
      "civic-humanism-links-learning-and-action",
      "effectual-truth-of-political-action",
      "republic-secures-vivere-libero",
      "institutions-channel-conflict-into-liberty",
      "property-law-public-use-distinction",
      "division-of-labor-and-salomons-house",
      "organized-inquiry-needs-governance-boundaries",
      "competition-diffidence-glory-create-war-disposition",
      "state-of-nature-tests-absence-of-common-power",
      "mutual-covenant-authorizes-artificial-person",
    ],
  },
  {
    id: "transcendence-authority",
    label: "超越、经文与权威",
    english: "TRANSCENDENCE · SCRIPTURE · AUTHORITY",
    description: "追踪最高原则、启示、教会、制度与纠错权威怎样形成又相互竞争。",
    lane: 4,
    anchorNodeIds: [
      "one-intellect-soul",
      "logos-layered-exegesis-text",
      "can-salvation-community-survive-empire",
      "papal-monastic-network-order",
      "who-reforms-preserving-church",
      "two-orders-mutual-limitation",
      "negative-theology-action-attributes",
      "corporate-privileges-faculty-jurisdictions",
      "nature-grace-ordered-synthesis",
      "what-orders-world-after-universal-authority-fractures",
      "papal-plenitude-unam-sanctam",
      "pisa-fails-constance-restores-unity",
      "dominion-in-grace-poor-church-secular-remedy",
      "plural-authorities-replace-single-center",
      "humanism-reorders-curriculum-within-mixed-world",
      "erasmus-education-ad-fontes-peaceful-reform",
      "justification-by-faith-reorders-works",
      "word-community-without-private-infallibility",
      "reformation-opens-judgment-not-modern-toleration",
      "scripture-accommodation-natural-demonstration-boundary",
      "galileo-affair-evidence-jurisdiction-coercion",
      "four-idols-diagnose-inquiry-obstacles",
      "division-of-labor-and-salomons-house",
      "sovereign-unifies-law-force-representation",
      "self-preservation-and-protection-bound-obedience",
    ],
  },
];

export const problemPhaseHistoryStageIds: Record<string, string> = {
  "encounter-difference": "origins",
  "generate-difference": "origins",
  "eleatic-pressure": "origins",
  "preserve-and-recombine": "origins",
  "from-perception-to-knowledge": "athens",
  "aristotelian-reconstruction": "athens",
  "flourishing-and-polis": "athens",
  "hellenistic-therapies": "hellenistic",
  "criteria-freedom-cosmopolis": "hellenistic",
  "roman-inwardness-and-one": "roman",
  "revelation-grace-history": "patristic",
  "consolation-rule-pastoral-order": "early-medieval",
  "reason-reform-two-powers": "early-medieval",
  "translation-demonstration-revelation": "early-medieval",
  "schools-universals-dialectic": "scholastic",
  "universities-aristotle-mendicants": "scholastic",
  "aquinas-nature-grace-order": "scholastic",
  "franciscan-illumination-experience": "scholastic",
  "scotus-ockham-individual-signs": "scholastic",
  "territorial-law-papal-eclipse": "scholastic",
  "schism-conciliar-reform-transition": "scholastic",
  "renaissance-texts-cities-human-agency": "renaissance-science",
  "machiavelli-fortune-virtue-republic": "renaissance-science",
  "humanism-reformation-conscience-authority": "renaissance-science",
  "mathematized-nature-models-observation": "renaissance-science",
  "bacon-idols-induction-collaborative-discovery": "renaissance-science",
  "hobbes-motion-language-covenant-sovereignty": "early-modern",
};

export type ProblemBoundaryNote = {
  label: string;
  note: string;
};

export const problemBoundaryNotes: Record<string, ProblemBoundaryNote[]> = {
  "avignon-centralization-and-national-dependence": [{
    label: "制度边界",
    note: "阿维尼翁时期可以同时出现行政集中与地域依赖疑虑，不能简化成教廷已经完全受法国王权控制。",
  }],
  "human-legislator-people-prevailing-part": [{
    label: "概念边界",
    note: "马西略以公民整体或其较有分量部分说明法源，不等于现代普选、个人平权或完整人民主权。",
  }],
  "dominion-in-grace-poor-church-secular-remedy": [{
    label: "因果边界",
    note: "威克里夫的财产与恩典论影响改革语言，但没有证据证明他直接组织或单独造成 1381 年农民起义。",
  }],
  "individuals-and-universal-mental-signs": [{
    label: "解释边界",
    note: "奥卡姆拒绝实在共相有独立论证，不能把唯名论简化成一句‘如无必要勿增实体’。",
  }],
  "humanism-reorders-curriculum-within-mixed-world": [{
    label: "时代边界",
    note: "人文主义改变课程、文本实践和公共表达，但长期与经院训练及基督教改革重叠，不能直接写成一次完成的世俗化。",
  }],
  "political-goods-bound-instrumental-exceptions": [{
    label: "解释边界",
    note: "马基雅维利承认非常手段可能有效，不等于把邪恶本身宣布为善；《君主论》的统治分析还须与《论李维》的共和国自由并读。",
  }],
  "utopia-as-dialogic-countermodel": [{
    label: "文本边界",
    note: "《乌托邦》包含对话框架、反讽与结尾保留，岛上制度不能直接等同莫尔本人的完整政策蓝图。",
  }],
  "reformation-opens-judgment-not-modern-toleration": [{
    label: "概念边界",
    note: "路德诉诸经文、信仰与良心改变了服从结构，但宗教改革也产生宗派纪律和属地强制，不能提前等同现代普遍宗教自由。",
  }],
  "copernican-model-reorders-appearances": [{
    label: "证据边界",
    note: "哥白尼日心体系重组行星次序和视运动，但 1543 年并未凭更简洁或更精确立即击败所有地心与混合模型。",
  }],
  "calibration-record-repetition-stabilize-instruments": [{
    label: "观察边界",
    note: "望远镜不是透明延长的肉眼；新现象要经过校准、记录、重复和他人复看，现象可靠也不等于它唯一证明某个宇宙体系。",
  }],
  "galileo-affair-evidence-jurisdiction-coercion": [{
    label: "历史边界",
    note: "伽利略案包含真实的审查与强制，也交织未完成证据、教会内部差异、解释管辖和教廷政治，不能压成两个同质阵营的单次战争。",
  }],
  "plural-methods-form-public-correction-network": [{
    label: "方法边界",
    note: "科学革命没有一套由三位人物共同执行的万能方法；模型、残差、仪器、实验和数学在不同问题中形成交叉纠错网络。",
  }],
  "four-idols-diagnose-inquiry-obstacles": [{
    label: "文本边界",
    note: "培根在《新工具》中正式区分种族、洞穴、市场和剧场四类偶像；罗素本章另列‘学校偶像’的说法不应作为培根的第五种正式分类。",
  }],
  "first-vintage-remains-provisional-not-algorithmic": [{
    label: "方法边界",
    note: "培根的表格与排除不是现代科学的无假说算法；资料分类、相关性、概念发明、数学和推导仍需判断，历史上也很难把重要科学成果归为严格执行一套培根程序。",
  }],
  "causes-and-works-connect-light-fruit-and-power": [{
    label: "概念边界",
    note: "‘知识就是力量’在培根计划中连接原因知识与产生效果的能力，也以改善人的处境为目标；它不能单独充当任意支配自然或人的正当化口号。",
  }],
  "division-of-labor-and-salomons-house": [{
    label: "制度边界",
    note: "所罗门宫是《新大西岛》的虚构研究机构，展示分工、设施与跨代积累，也保留秘密和发布权；它不是已经实现的中立现代科学院。",
  }],
  "mechanism-constrains-but-does-not-deduce-authority": [{
    label: "推导边界",
    note: "霍布斯的唯物论与机械心理学提供政治行动的因果条件，却不能单独从‘一切是身体运动’推出绝对主权；自然状态、自然律、契约与授权承担独立论证工作。",
  }],
  "competition-diffidence-glory-create-war-disposition": [{
    label: "人性边界",
    note: "霍布斯的战争风险不要求人人天生邪恶；大致平等、有限善意、私人判断和不可信保证足以使自保者进入竞争、不信任与预防性行动。‘战争’也指持续的武力倾向，不是每刻实际交战。",
  }],
  "state-of-nature-tests-absence-of-common-power": [{
    label: "历史边界",
    note: "自然状态首先是缺少公认裁判与执行权的分析条件，不是全体人类共同经历过的可靠史前编年；霍布斯援引美洲居民的文字还带有其时代的殖民偏见。",
  }],
  "sovereign-unifies-law-force-representation": [{
    label: "制度边界",
    note: "霍布斯偏好君主制，但绝对主权可以由个人或会议承载；其核心主张是最终权威不可分割，不是只有世袭君主才可能形成国家。",
  }],
  "self-preservation-and-protection-bound-obedience": [{
    label: "权利边界",
    note: "授权不表示主权者在事实或道德上天然正确。霍布斯保留臣民抵抗直接生命威胁的自由，并使政治义务随保护能力消失而终止；这不是完整的一般革命权。",
  }],
};

export type ProblemComparisonFan = {
  questionId: string;
  label: string;
  note: string;
  answerIds: string[];
};

export const problemComparisonFans: ProblemComparisonFan[] = [
  {
    questionId: "how-live-uncontrollable-world",
    label: "四种竞争性生活方案",
    note: "四条支线回答同一实践压力，但不构成单一师承路线；选择任一答案可继续查看它留下的代价与新问题。",
    answerIds: ["cynic-low-dependence", "skeptical-suspension", "epicurean-natural-therapy", "stoic-virtue-in-order"],
  },
  {
    questionId: "change-as-reconfiguration",
    label: "三种保存不变者的重构",
    note: "四根、混合物与原子论都保存不变构成，却以不同机制解释可见变化。",
    answerIds: ["roots-love-strife", "mixture-nous-separation", "atoms-void-arrangement"],
  },
  {
    questionId: "how-can-rulers-study-political-survival",
    label: "三种政治生存接口",
    note: "实际效果、virtù—fortuna 与自己的武备分别处理知识、行动和制度依赖；三者共同构成分析面，不是互斥学派。",
    answerIds: ["effectual-truth-of-political-action", "virtu-adapts-to-fortuna", "own-arms-before-borrowed-force"],
  },
  {
    questionId: "how-should-christian-society-be-reformed",
    label: "三种共享批评、分歧行动的改革路线",
    note: "伊拉斯谟、莫尔与路德共享部分弊端批评和文本资源，却对统一、法律、自由意志与教会断裂承担不同承诺。",
    answerIds: ["erasmus-education-ad-fontes-peaceful-reform", "more-dialogue-law-comparative-reform", "luther-word-faith-church-reform"],
  },
  {
    questionId: "what-can-publicly-correct-text-church-state-nature",
    label: "三种科学公共纠错接口",
    note: "哥白尼的可重算模型、开普勒的残差修订和伽利略的仪器—实验—数学组合分别改变不同证据环节，不能合并成一句‘观察取代权威’。",
    answerIds: ["copernican-model-reorders-appearances", "keplerian-residuals-revise-geometry", "galilean-instruments-idealization-mathematics"],
  },
  {
    questionId: "how-can-discovery-be-organized-beyond-genius",
    label: "四种有组织发现接口",
    note: "偶像诊断、排除式归纳、实验干预和知识分工分别处理误差、比较、操作与规模；它们共同构成培根纲领，但不合并为自动产生真理的一条规则。",
    answerIds: ["four-idols-diagnose-inquiry-obstacles", "tables-and-exclusion-build-gradual-induction", "artifice-and-experiment-make-causes-visible", "division-of-labor-and-salomons-house"],
  },
  {
    questionId: "can-civil-order-be-reconstructed-as-systematic-artifice",
    label: "四种人工秩序构造接口",
    note: "身体运动、语言定义、自然状态压力测试和授权人工人格分别处理行动者、推理、风险与共同权力；四者是体系层次，不是从机械论一步推出绝对君主。",
    answerIds: ["sensation-imagination-passions-as-bodily-motion", "names-definitions-reasoning-as-reckoning", "competition-diffidence-glory-create-war-disposition", "mutual-covenant-authorizes-artificial-person"],
  },
];
