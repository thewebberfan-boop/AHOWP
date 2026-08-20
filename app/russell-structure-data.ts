export type RussellPhilosopherNode = {
  id: string;
  nameZh: string;
  nameEn: string;
  figureId?: string;
  chapterIds: string[];
  relation: string;
};

export type RussellSchoolNode = {
  id: string;
  title: string;
  english: string;
  response: string;
  sharedPattern: string;
  chapterIds: string[];
  philosophers: RussellPhilosopherNode[];
};

export type RussellStructureStage = {
  id: string;
  title: string;
  years: string;
  russellRange: string;
  condition: string;
  commonProblems: string[];
  contextChapterIds: string[];
  schools: RussellSchoolNode[];
};

const person = (id: string, nameZh: string, nameEn: string, chapterIds: string[], relation: string, figureId = id): RussellPhilosopherNode => ({
  id, nameZh, nameEn, figureId, chapterIds, relation,
});

export const russellStructureStages: RussellStructureStage[] = [
  {
    id: "greek-origins",
    title: "希腊哲学的形成",
    years: "约前 600—前 450",
    russellRange: "第一卷 · 前苏格拉底哲学（第 I—X 章）",
    condition: "城邦、殖民贸易、字母书写与跨文化接触，使自然解释逐渐从神话叙事中分化出来。",
    commonProblems: ["世界由什么构成？", "变化如何可能？", "理性与感官何者更可靠？"],
    contextChapterIds: ["b1-01"],
    schools: [
      { id: "milesian", title: "米利都自然哲学", english: "Milesian natural philosophy", response: "以一种可理解的自然本原说明多样世界。", sharedPattern: "寻找本原，并用连续的自然过程解释变化。", chapterIds: ["b1-02"], philosophers: [] },
      { id: "pythagorean", title: "毕达哥拉斯传统", english: "Pythagorean tradition", response: "把可见世界背后的秩序理解为数、比例与和谐。", sharedPattern: "数学结构、宗教生活与灵魂观相互支撑。", chapterIds: [], philosophers: [person("pythagoras", "毕达哥拉斯", "Pythagoras", ["b1-03"], "把数学秩序发展为一种生活与宇宙方案。") ] },
      { id: "becoming-being", title: "生成与存在之争", english: "Becoming and being", response: "围绕变化与恒常的冲突，提出不同的本体论方案。", sharedPattern: "用逻辑约束自然解释，再说明经验世界为何显得变化。", chapterIds: [], philosophers: [
        person("heraclitus", "赫拉克利特", "Heraclitus", ["b1-04"], "把对立和流变理解为秩序本身。"),
        person("parmenides", "巴门尼德", "Parmenides", ["b1-05"], "以严格推理否定真正存在的生成和消灭。"),
        person("empedocles", "恩培多克勒", "Empedocles", ["b1-06"], "以不变元素的组合解释可见变化。"),
        person("anaxagoras", "阿那克萨哥拉", "Anaxagoras", ["b1-08"], "以心灵和种子说明秩序与差异。"),
      ] },
      { id: "atomists", title: "原子论", english: "Atomism", response: "以原子在虚空中的运动，同时保留不变存在与经验变化。", sharedPattern: "机械因果、不可分微粒与组合解释。", chapterIds: ["b1-09"], philosophers: [
        person("leucippus", "留基伯", "Leucippus", ["b1-09"], "以原子与虚空回应埃利亚学派对运动的限制。"),
        person("democritus", "德谟克利特", "Democritus", ["b1-09"], "把原子论扩展为自然、认识与伦理的系统。"),
      ] },
      { id: "sophists", title: "智者运动", english: "Sophistic movement", response: "把注意力从宇宙本原转向语言、公共判断和人的处境。", sharedPattern: "论辩、修辞与相对主义的问题意识。", chapterIds: [], philosophers: [person("protagoras", "普罗泰戈拉", "Protagoras", ["b1-10"], "以人的尺度重新界定知识与判断。") ] },
    ],
  },
  {
    id: "classical-athens",
    title: "古典雅典与体系哲学",
    years: "约前 450—前 322",
    russellRange: "第一卷 · 苏格拉底、柏拉图和亚里士多德（第 VII、XI—XXIV 章）",
    condition: "民主政治、战争危机、公共论辩与学园制度，把伦理、知识和政体问题推到哲学中心。",
    commonProblems: ["何为善的生活？", "知识如何区别于意见？", "正义的共同体如何可能？"],
    contextChapterIds: ["b1-07", "b1-12", "b1-24"],
    schools: [
      { id: "socratic", title: "苏格拉底式探问", english: "Socratic inquiry", response: "通过概念审问，把哲学变成对生活与德性的公共检验。", sharedPattern: "反诘、定义与承认无知。", chapterIds: [], philosophers: [person("socrates", "苏格拉底", "Socrates", ["b1-11"], "把自然问题转向应当怎样生活。") ] },
      { id: "platonism", title: "柏拉图哲学", english: "Platonism", response: "以理念、灵魂与理想政体，为知识和价值建立超越意见的尺度。", sharedPattern: "从可见事物上升到形式结构，并以整体秩序解释部分。", chapterIds: [], philosophers: [person("plato", "柏拉图", "Plato", ["b1-13", "b1-14", "b1-15", "b1-16", "b1-17", "b1-18"], "把伦理、政治、知识和宇宙论组织为相互关联的体系。") ] },
      { id: "aristotelian", title: "亚里士多德哲学", english: "Aristotelian philosophy", response: "从具体事物出发，以分类、形式与目的解释自然和人的实践。", sharedPattern: "经验观察、概念分类与系统论证。", chapterIds: [], philosophers: [person("aristotle", "亚里士多德", "Aristotle", ["b1-19", "b1-20", "b1-21", "b1-22", "b1-23"], "把哲学分化为形而上学、伦理、政治、逻辑与物理学。") ] },
    ],
  },
  {
    id: "hellenistic-roman",
    title: "希腊化与罗马世界",
    years: "前 323—公元 270",
    russellRange: "第一卷 · 亚里士多德以后的古代哲学（第 XXV—XXX 章）",
    condition: "城邦自主衰落、帝国扩张与社会不确定性，使哲学越来越承担个人生活指导的功能。",
    commonProblems: ["个人如何获得安定？", "自由如何在不可控世界中成立？", "哲学能否成为生活治疗？"],
    contextChapterIds: ["b1-25", "b1-29"],
    schools: [
      { id: "cynic-sceptic", title: "犬儒主义与怀疑主义", english: "Cynicism and Scepticism", response: "分别通过摆脱社会依赖或悬置判断，减少外部世界对人的支配。", sharedPattern: "把哲学直接转化为心理与生活训练。", chapterIds: ["b1-26"], philosophers: [person("diogenes", "第欧根尼", "Diogenes", ["b1-26"], "以激进简朴反抗社会习俗。"), person("pyrrho", "皮浪", "Pyrrho", ["b1-26"], "以悬置判断追求不受扰动。"), person("arcesilaus", "阿尔克西劳", "Arcesilaus", ["b1-26"], "以反诘认知印象，把学院转向悬置判断。"), person("carneades", "卡尔内阿德", "Carneades", ["b1-26"], "在不可确证的世界中，以可信印象保留审慎行动。") ] },
      { id: "epicurean", title: "伊壁鸠鲁派", english: "Epicureanism", response: "通过理解自然、限制欲望和经营友谊消除恐惧。", sharedPattern: "原子论自然观与节制的快乐伦理。", chapterIds: ["b1-27"], philosophers: [person("epicurus", "伊壁鸠鲁", "Epicurus", ["b1-27"], "把无痛苦与心灵宁静设为生活目标。"), person("lucretius", "卢克莱修", "Lucretius", ["b1-27"], "以诗歌把伊壁鸠鲁自然学转化为解除恐惧的训练。") ] },
      { id: "stoic", title: "斯多葛主义", english: "Stoicism", response: "区分可控制与不可控制之物，以内在同意保持自由。", sharedPattern: "宇宙理性、必然秩序与意志训练。", chapterIds: ["b1-28"], philosophers: [person("zeno", "芝诺", "Zeno of Citium", [], "建立斯多葛传统。"), person("epictetus", "爱比克泰德", "Epictetus", [], "把自由集中于判断和意志。"), person("aurelius", "马可·奥勒留", "Marcus Aurelius", [], "在帝国责任中实践斯多葛训练。") ] },
      { id: "neoplatonism", title: "新柏拉图主义", english: "Neoplatonism", response: "以从‘一’流溢并向‘一’回归的层级解释世界和灵魂。", sharedPattern: "形而上等级、内在上升与神秘合一。", chapterIds: [], philosophers: [person("plotinus", "普罗提诺", "Plotinus", ["b1-30"], "把古希腊哲学转化为影响基督教时代的精神体系。") ] },
    ],
  },
  {
    id: "early-christianity",
    title: "早期基督教与教父时代",
    years: "前 1 世纪—公元 600",
    russellRange: "第二卷 · 教父哲学（第 I—VI 章）",
    condition: "犹太救赎史、罗马帝国和基督教制度化相遇，哲学开始服务于启示、教义与教会秩序。",
    commonProblems: ["信仰与希腊哲学如何相容？", "恶、自由意志与救赎如何解释？", "教会如何承载知识与秩序？"],
    contextChapterIds: ["b2-01", "b2-02", "b2-05"],
    schools: [
      { id: "patristic", title: "教父神学", english: "Patristic theology", response: "吸收柏拉图主义和斯多葛概念，为基督教教义建立哲学语言。", sharedPattern: "经文解释、教义论证与救赎史。", chapterIds: ["b2-03"], philosophers: [person("augustine", "奥古斯丁", "Saint Augustine", ["b2-04"], "把内在经验、意志和历史整合进基督教体系。") ] },
      { id: "monastic-church", title: "修道院与教会传统", english: "Monastic and ecclesiastical tradition", response: "以规则、组织和抄写教育，在帝国解体后保存共同生活与知识。", sharedPattern: "制度纪律、教会权威与典籍传承。", chapterIds: [], philosophers: [person("benedict", "本尼狄克", "Saint Benedict", ["b2-06"], "以修道规则塑造拉丁西欧的共同生活。"), person("gregory", "大格列高利", "Gregory the Great", ["b2-06"], "把教皇权威、牧灵实践与古代遗产连接起来。") ] },
    ],
  },
  {
    id: "medieval-scholasticism",
    title: "中世纪教会与经院哲学",
    years: "约 600—1450",
    russellRange: "第二卷 · 经院哲学（第 VII—XV 章）",
    condition: "教皇、修道院、伊斯兰翻译运动和大学网络共同重建知识制度，亚里士多德著作重新进入拉丁世界。",
    commonProblems: ["理性能把信仰推进到什么程度？", "普遍概念是否真实存在？", "宗教权威与世俗权力如何划界？"],
    contextChapterIds: ["b2-07", "b2-09", "b2-11", "b2-12", "b2-15"],
    schools: [
      { id: "early-scholastic", title: "早期经院与新柏拉图传统", english: "Early scholasticism", response: "在基督教框架内恢复辩证法，并讨论自然、神与创造的关系。", sharedPattern: "权威文本、逻辑区分和神学综合。", chapterIds: [], philosophers: [person("eriugena", "约翰·司各脱", "John Scotus Eriugena", ["b2-08"], "以新柏拉图主义组织自然与神的层级。") ] },
      { id: "islamic-jewish", title: "伊斯兰与犹太哲学", english: "Islamic and Jewish philosophy", response: "翻译并发展希腊哲学，使亚里士多德传统重新进入西欧。", sharedPattern: "注释、医学科学与启示宗教的理性解释。", chapterIds: ["b2-10"], philosophers: [person("avicenna", "阿维森纳", "Avicenna", [], "发展本质与存在的区分。"), person("averroes", "阿威罗伊", "Averroes", [], "以亚里士多德注释影响拉丁经院哲学。"), person("maimonides", "迈蒙尼德", "Maimonides", [], "协调犹太启示与哲学理性。") ] },
      { id: "thomism", title: "托马斯主义", english: "Thomism", response: "以亚里士多德体系综合自然理性与基督教启示。", sharedPattern: "系统区分、目的论自然观与信仰—理性分工。", chapterIds: [], philosophers: [person("aquinas", "托马斯·阿奎那", "Thomas Aquinas", ["b2-13"], "完成经院哲学最有影响力的综合。") ] },
      { id: "franciscan-nominalist", title: "方济各会与唯名论趋向", english: "Franciscan and nominalist currents", response: "强化意志、个体与经验，逐步限制宏大理性综合的范围。", sharedPattern: "意志论、个体性、经验研究与奥卡姆式节省。", chapterIds: ["b2-14"], philosophers: [person("roger-bacon", "罗吉尔·培根", "Roger Bacon", [], "强调观察、语言与实验知识。"), person("duns-scotus", "邓斯·司各脱", "Duns Scotus", [], "突出意志和个体性。"), person("ockham", "奥卡姆", "William of Ockham", [], "以唯名论和简约原则限制实体假设。") ] },
    ],
  },
  {
    id: "renaissance-science",
    title: "文艺复兴、宗教改革与新科学",
    years: "约 1450—1650",
    russellRange: "第三卷 · 从文艺复兴到休谟（第 I—VII 章）",
    condition: "城市商业、印刷、宗教分裂和天文学革命削弱统一权威，使个人判断与可重复方法获得新地位。",
    commonProblems: ["知识能否摆脱经院权威？", "政治是否应按现实力量理解？", "可靠的科学方法是什么？"],
    contextChapterIds: ["b3-01", "b3-02", "b3-05", "b3-06"],
    schools: [
      { id: "political-realism", title: "政治现实主义", english: "Political realism", response: "把政治从理想德性与神学秩序中分离，研究权力如何实际运作。", sharedPattern: "历史案例、力量关系与后果分析。", chapterIds: [], philosophers: [person("machiavelli", "马基雅维利", "Machiavelli", ["b3-03"], "以国家生存和权力效果重写政治问题。") ] },
      { id: "renaissance-humanism", title: "文艺复兴人文主义", english: "Renaissance humanism", response: "回到古典文本，以教育、讽刺和理想社会批判现实制度。", sharedPattern: "语文学、古典复兴与世俗人格。", chapterIds: [], philosophers: [person("erasmus", "伊拉斯谟", "Desiderius Erasmus", ["b3-04"], "以古典教育和讽刺批评教会腐败。"), person("thomas-more", "莫尔", "Thomas More", ["b3-04"], "以乌托邦形式反观欧洲社会。") ] },
      { id: "experimental-method", title: "经验方法与知识改革", english: "Empirical method and reform of knowledge", response: "把知识理解为有组织地排除偏见、积累观察并产生实际能力。", sharedPattern: "归纳、实验协作与方法自觉。", chapterIds: [], philosophers: [person("francis-bacon", "弗朗西斯·培根", "Francis Bacon", ["b3-07"], "为现代经验研究提供纲领性方法。") ] },
    ],
  },
  {
    id: "reason-empiricism",
    title: "理性主义、经验主义与自由主义",
    years: "约 1600—1776",
    russellRange: "第三卷 · 从文艺复兴到休谟（第 VIII—XVII 章）",
    condition: "宗教战争、民族国家、商业社会与数学物理学共同要求新的确定性，也催生个人权利与政治合法性问题。",
    commonProblems: ["知识的确定性来自理性还是经验？", "心灵如何认识外部世界？", "政治权威如何获得正当性？"],
    contextChapterIds: [],
    schools: [
      { id: "political-mechanism", title: "机械论政治哲学", english: "Mechanistic political philosophy", response: "从个体欲望、恐惧和契约推导国家秩序。", sharedPattern: "机械因果、自然状态与契约模型。", chapterIds: [], philosophers: [person("hobbes", "霍布斯", "Thomas Hobbes", ["b3-08"], "把新科学的机械论用于政治秩序。") ] },
      { id: "continental-rationalism", title: "大陆理性主义", english: "Continental rationalism", response: "以清楚原则、演绎体系或充分理由寻求独立于感官偶然性的知识。", sharedPattern: "先天原则、数学方法与系统形而上学。", chapterIds: [], philosophers: [person("descartes", "笛卡尔", "René Descartes", ["b3-09"], "从方法怀疑和自我确定性重建知识。"), person("spinoza", "斯宾诺莎", "Baruch Spinoza", ["b3-10"], "以唯一实体和必然性组织世界。"), person("leibniz", "莱布尼茨", "Gottfried Wilhelm Leibniz", ["b3-11"], "以单子、逻辑和充分理由解释秩序。") ] },
      { id: "liberal-empiricism", title: "英国经验主义与自由主义", english: "British empiricism and liberalism", response: "从经验追踪观念来源，并以个人权利限制政治权威。", sharedPattern: "经验检验、认识限度与渐进政治。", chapterIds: ["b3-12"], philosophers: [person("locke", "洛克", "John Locke", ["b3-13", "b3-14", "b3-15"], "把经验认识论与政治自由主义连接起来。"), person("berkeley", "贝克莱", "George Berkeley", ["b3-16"], "把经验论推进为非物质主义。"), person("hume", "休谟", "David Hume", ["b3-17"], "把因果、自我和归纳还原为经验与习惯问题。") ] },
    ],
  },
  {
    id: "romantic-idealism",
    title: "启蒙之后：浪漫主义与德国哲学",
    years: "约 1750—1900",
    russellRange: "第三卷 · 从卢梭到现代（第 XVIII—XXV 章）",
    condition: "启蒙理性、法国革命、民族国家和工业化引发对抽象理性、现代社会与历史方向的重新评价。",
    commonProblems: ["自由是个人自然状态还是历史成就？", "主体如何参与构成经验？", "理性、意志与历史何者更根本？"],
    contextChapterIds: ["b3-18", "b3-21"],
    schools: [
      { id: "romantic-critique", title: "浪漫主义批判", english: "Romantic critique", response: "以情感、自然、个性和创造反抗抽象理性与社会规训。", sharedPattern: "真实性、想象力与文明批判。", chapterIds: [], philosophers: [person("rousseau", "卢梭", "Jean-Jacques Rousseau", ["b3-19"], "把文明进步与自由丧失之间的矛盾公开化。"), person("byron", "拜伦", "Lord Byron", ["b3-23"], "以反叛个体呈现浪漫主义人格。") ] },
      { id: "critical-idealism", title: "批判哲学与德国观念论", english: "Critical philosophy and German idealism", response: "把主体结构和历史发展纳入对知识与自由的解释。", sharedPattern: "先验条件、整体关系与历史性的理性。", chapterIds: [], philosophers: [person("kant", "康德", "Immanuel Kant", ["b3-20"], "追问经验、科学和道德自由何以可能。"), person("hegel", "黑格尔", "G. W. F. Hegel", ["b3-22"], "把矛盾和历史组织为理性的整体展开。") ] },
      { id: "philosophies-of-will", title: "意志与价值哲学", english: "Philosophies of will and value", response: "质疑理性体系的最高地位，把欲望、意志与价值创造推到中心。", sharedPattern: "非理性动力、生命评价与文化诊断。", chapterIds: [], philosophers: [person("schopenhauer", "叔本华", "Arthur Schopenhauer", ["b3-24"], "以盲目意志解释世界与痛苦。"), person("nietzsche", "尼采", "Friedrich Nietzsche", ["b3-25"], "以谱系和价值重估批判传统道德。") ] },
    ],
  },
  {
    id: "industrial-modern",
    title: "工业社会与现代哲学的分化",
    years: "19 世纪—20 世纪上半叶",
    russellRange: "第三卷 · 从卢梭到现代（第 XXVI—XXXI 章）",
    condition: "工业资本主义、民主教育、社会科学和现代逻辑，使哲学分化为社会批判、行动理论、经验研究与语言分析。",
    commonProblems: ["现代制度应以何种标准评价？", "思想的意义是否取决于实践后果？", "哲学能否通过逻辑分析澄清问题？"],
    contextChapterIds: [],
    schools: [
      { id: "utilitarianism", title: "功利主义", english: "Utilitarianism", response: "以可比较的幸福后果评价法律、制度与行动。", sharedPattern: "结果衡量、改革主义与公共政策。", chapterIds: ["b3-26"], philosophers: [person("bentham", "边沁", "Jeremy Bentham", [], "以最大幸福原则推动制度改革。"), person("mill", "约翰·斯图亚特·密尔", "John Stuart Mill", [], "把自由、个性与较高快乐纳入功利主义。") ] },
      { id: "historical-materialism", title: "历史唯物主义", english: "Historical materialism", response: "从生产关系、阶级冲突和实践解释观念与制度变化。", sharedPattern: "历史结构、社会关系与批判实践。", chapterIds: [], philosophers: [person("marx", "马克思", "Karl Marx", ["b3-27"], "把哲学批判转向资本主义社会结构。") ] },
      { id: "intuitionism", title: "生命与直觉哲学", english: "Philosophy of life and intuition", response: "反对把流动经验完全还原为空间化、可计算的概念。", sharedPattern: "绵延、直觉与创造性演化。", chapterIds: [], philosophers: [person("bergson", "柏格森", "Henri Bergson", ["b3-28"], "以绵延区分生活时间与物理时间。", "bergson") ] },
      { id: "pragmatism", title: "实用主义", english: "Pragmatism", response: "通过观念在经验和行动中的差异检验其意义。", sharedPattern: "后果、探究过程与可修正信念。", chapterIds: [], philosophers: [person("william-james", "威廉·詹姆斯", "William James", ["b3-29"], "把真理理解为在经验中发生作用的关系。"), person("dewey", "约翰·杜威", "John Dewey", ["b3-30"], "把思想理解为解决问题的公共工具。") ] },
      { id: "logical-analysis", title: "逻辑分析哲学", english: "Logical analysis", response: "通过现代逻辑和语言分析拆解传统哲学问题。", sharedPattern: "形式化、命题结构与概念澄清。", chapterIds: ["b3-31"], philosophers: [person("frege", "弗雷格", "Gottlob Frege", [], "为现代逻辑和意义分析奠定基础。"), person("russell", "罗素", "Bertrand Russell", [], "把逻辑分析发展为哲学方法。") ] },
    ],
  },
];

export const russellStructureChapterIds = russellStructureStages.flatMap((stage) => [
  ...stage.contextChapterIds,
  ...stage.schools.flatMap((school) => [
    ...school.chapterIds,
    ...school.philosophers.flatMap((philosopher) => philosopher.chapterIds),
  ]),
]);
