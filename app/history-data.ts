export type RelationKind = "condition" | "response" | "inherit" | "oppose" | "transmit" | "exception";

export type ResponseNode = {
  id: string;
  title: string;
  figures: string;
  region: string;
  answer: string;
  method: string;
  difference: string;
  noteCue?: string;
  chapterIds: string[];
};

export type HistoryResponseLinks = {
  schoolIds: string[];
  philosopherIds: string[];
};

/**
 * History is the entry layer. These links keep the next step attached to the
 * currently selected response, rather than treating every school or person in
 * the same period as interchangeable. IDs point to the canonical detail data.
 */
export const historyResponseLinks: Record<string, HistoryResponseLinks> = {
  milesians: { schoolIds: ["presocratic-traditions"], philosopherIds: ["thales", "anaximander", "anaximenes"] },
  pythagoras: { schoolIds: ["presocratic-traditions"], philosopherIds: ["pythagoras"] },
  "flux-being": { schoolIds: ["presocratic-traditions"], philosopherIds: ["heraclitus", "parmenides"] },
  pluralists: { schoolIds: ["presocratic-traditions"], philosopherIds: ["empedocles", "anaxagoras", "leucippus", "democritus"] },
  sophists: { schoolIds: ["sophists-socratic-turn"], philosopherIds: ["protagoras"] },
  socrates: { schoolIds: ["sophists-socratic-turn"], philosopherIds: ["socrates"] },
  plato: { schoolIds: ["platonism"], philosopherIds: ["plato"] },
  aristotle: { schoolIds: ["aristotelianism"], philosopherIds: ["aristotle"] },
  cynics: { schoolIds: ["cynicism"], philosopherIds: ["diogenes"] },
  sceptics: { schoolIds: ["ancient-skepticism", "platonism"], philosopherIds: ["pyrrho", "arcesilaus", "carneades"] },
  epicureans: { schoolIds: ["epicureanism"], philosopherIds: ["epicurus", "lucretius"] },
  stoics: { schoolIds: ["stoicism"], philosopherIds: ["zeno", "cleanthes", "chrysippus", "panaetius", "posidonius"] },
  "roman-stoics": { schoolIds: ["stoicism"], philosopherIds: ["seneca", "epictetus", "aurelius"] },
  plotinus: { schoolIds: ["platonism"], philosopherIds: ["plotinus"] },
  "paul-john": { schoolIds: ["patristic-christian-tradition"], philosopherIds: [] },
  augustine: { schoolIds: ["patristic-christian-tradition", "medieval-christian-neoplatonism"], philosopherIds: ["augustine"] },
  "monastic-papacy": { schoolIds: ["monastic-pastoral-tradition", "medieval-church-state-thought"], philosopherIds: ["benedict", "gregory-great"] },
  "papal-order": { schoolIds: ["monastic-pastoral-tradition", "medieval-church-state-thought"], philosopherIds: ["gregory-great", "anselm"] },
  "john-scot": { schoolIds: ["medieval-christian-neoplatonism"], philosopherIds: ["eriugena"] },
  islamic: { schoolIds: ["islamic-falsafa-kalam", "medieval-jewish-philosophy"], philosopherIds: ["avicenna", "al-ghazali", "averroes", "maimonides"] },
  aquinas: { schoolIds: ["dominican-aristotelian-synthesis", "aristotelianism"], philosopherIds: ["albert-great", "aquinas"] },
  franciscans: { schoolIds: ["franciscan-scholastic-nominalism"], philosopherIds: ["roger-bacon", "bonaventure", "duns-scotus", "ockham"] },
  "church-state": { schoolIds: ["medieval-church-state-thought"], philosopherIds: ["ockham", "marsilius-padua"] },
  machiavelli: { schoolIds: ["renaissance-political-realism"], philosopherIds: ["machiavelli"] },
  reformation: { schoolIds: ["christian-humanism", "protestant-reformation-thought"], philosopherIds: ["erasmus", "thomas-more", "luther"] },
  "new-science": { schoolIds: ["scientific-revolution-method"], philosopherIds: ["copernicus", "kepler", "galileo", "francis-bacon"] },
  hobbes: { schoolIds: ["mechanistic-political-philosophy"], philosopherIds: ["hobbes"] },
  rationalists: { schoolIds: ["continental-rationalism"], philosopherIds: ["descartes", "spinoza", "leibniz"] },
  locke: { schoolIds: ["british-empiricism-liberalism"], philosopherIds: ["locke"] },
  hume: { schoolIds: ["british-empiricism-liberalism"], philosopherIds: ["berkeley", "hume"] },
  rousseau: { schoolIds: ["romanticism-republican-freedom"], philosopherIds: ["rousseau"] },
  kant: { schoolIds: ["critical-idealism"], philosopherIds: ["kant"] },
  hegel: { schoolIds: ["critical-idealism"], philosopherIds: ["hegel"] },
  romantics: { schoolIds: ["romanticism-republican-freedom", "will-value-philosophy"], philosopherIds: ["byron", "schopenhauer"] },
  nietzsche: { schoolIds: ["will-value-philosophy"], philosopherIds: ["nietzsche"] },
  "utilitarian-marx": { schoolIds: ["utilitarianism", "historical-materialism"], philosopherIds: ["bentham", "mill", "marx"] },
  "life-duration": { schoolIds: ["life-intuition-philosophy"], philosopherIds: ["bergson"] },
  pragmatists: { schoolIds: ["pragmatism"], philosopherIds: ["william-james", "dewey"] },
  analysis: { schoolIds: ["logical-analysis"], philosopherIds: ["frege", "russell"] },
};

export type HistoryStage = {
  id: string;
  years: string;
  title: string;
  subtitle: string;
  transition: string;
  world: string[];
  carrier: string;
  commonQuestion: string;
  chain: Array<{ label: string; text: string; kind: RelationKind }>;
  responses: ResponseNode[];
  legacy: string[];
  review: string;
  coverage: "personal" | "book";
};

export type DetailNode = {
  id: string;
  title: string;
  marker: string;
  detail: string;
};

export type StageDetailPanel = {
  events: DetailNode[];
  problems: DetailNode[];
};

export const historyStages: HistoryStage[] = [
  {
    id: "origins",
    years: "前 600—前 450",
    title: "城邦与自然的发现",
    subtitle: "前苏格拉底哲学",
    transition: "神话秩序 → 可讨论、可推理的自然秩序",
    world: ["爱奥尼亚商业城邦连接多个文明", "政治形态与财富结构快速变化", "数学、天文与航海知识汇集"],
    carrier: "旅行者、商人、贵族学派与早期教师",
    commonQuestion: "纷繁变化的世界背后，是否存在一种可理解的本原和秩序？",
    chain: [
      { label: "历史条件", text: "跨地域知识与城邦竞争", kind: "condition" },
      { label: "共同转向", text: "用自然原因代替神话叙事", kind: "response" },
      { label: "核心分歧", text: "变化是真实，还是感官幻象？", kind: "oppose" },
      { label: "留下的问题", text: "理性与经验何者更可靠", kind: "inherit" },
    ],
    responses: [
      { id: "milesians", title: "寻找物质本原", figures: "泰勒斯、阿那克西曼德、阿那克西美尼", region: "米利都 / 爱奥尼亚", answer: "世界的多样性可以由一种或少数自然本原解释。", method: "观察、类比与自然假说", difference: "保留朴素经验，又第一次追求非神话的统一解释。", noteCue: "Water is the original substance / the world was evolved", chapterIds: ["b1-02"] },
      { id: "pythagoras", title: "以数寻找永恒秩序", figures: "毕达哥拉斯学派", region: "南意大利", answer: "真正秩序属于数、比例与灵魂可进入的永恒结构。", method: "演绎、数学与宗教式沉思", difference: "把理性形式置于感官世界之上，深刻影响柏拉图。", noteCue: "contemplation + mathematics vs empirical + sense", chapterIds: ["b1-03"] },
      { id: "flux-being", title: "变化与存在的对决", figures: "赫拉克利特、巴门尼德", region: "以弗所 / 埃利亚", answer: "一方把冲突与流变视为秩序；另一方认为真正存在不生不灭。", method: "概念推演与反直觉论证", difference: "第一次让理性结论公开挑战感官经验。", noteCue: "flux: perpetual change vs nothing changes", chapterIds: ["b1-04", "b1-05"] },
      { id: "pluralists", title: "保留变化，也保留恒常", figures: "恩培多克勒、阿那克萨哥拉、原子论者", region: "西西里 / 雅典 / 阿布德拉", answer: "基本成分不变，具体事物通过组合、分离或运动而变化。", method: "多元本原与机械因果", difference: "试图调和赫拉克利特与巴门尼德，并为科学解释打开道路。", noteCue: "purpose vs cause / atom and void", chapterIds: ["b1-06", "b1-08", "b1-09"] },
    ],
    legacy: ["本原问题", "理性与感官的冲突", "数学作为真理模型", "目的解释与机械解释的分叉"],
    review: "为什么同样面对自然秩序，爱奥尼亚哲学家走向物质假说，毕达哥拉斯却走向数学与宗教？",
    coverage: "personal",
  },
  {
    id: "athens",
    years: "前 450—前 322",
    title: "雅典与体系的诞生",
    subtitle: "苏格拉底、柏拉图与亚里士多德",
    transition: "解释自然 → 追问知识、德性与共同体",
    world: ["民主政治、法庭与公共辩论兴盛", "战争与城邦危机动摇传统", "教育成为政治竞争的一部分"],
    carrier: "公民、智者、哲学学园与受教育的统治阶层",
    commonQuestion: "什么是善与知识？个人和城邦应当怎样被组织？",
    chain: [
      { label: "公共环境", text: "民主辩论与政治失序", kind: "condition" },
      { label: "哲学转向", text: "自然 → 人与城邦", kind: "response" },
      { label: "体系化", text: "知识、伦理、政治被连接", kind: "inherit" },
      { label: "长程影响", text: "成为西方哲学的基础语法", kind: "transmit" },
    ],
    responses: [
      { id: "sophists", title: "训练现实中的判断与说服", figures: "普罗泰戈拉与智者", region: "雅典公共生活", answer: "人的处境和约定决定许多判断，教育应训练有效论辩。", method: "修辞、比较与反方论证", difference: "接受意见世界的多样性，而不是寻找超越处境的永恒标准。", chapterIds: ["b1-10"] },
      { id: "socrates", title: "从自我审问寻找德性", figures: "苏格拉底", region: "雅典", answer: "未经审问的信念不可靠，德性与对善的认识紧密相关。", method: "问答、反诘与概念澄清", difference: "不提供完整体系，而是迫使对话者暴露矛盾。", noteCue: "seeking knowledge by question and answer", chapterIds: ["b1-11"] },
      { id: "plato", title: "以永恒形式校正现实政治", figures: "柏拉图", region: "学院", answer: "知识指向稳定的理念，正义城邦应由受过哲学教育者治理。", method: "辩证法、数学模型、神话与理想类型", difference: "把政治危机追溯到知识与灵魂秩序的危机。", noteCue: "the philosopher loves the vision of truth", chapterIds: ["b1-13", "b1-14", "b1-15", "b1-16", "b1-17", "b1-18"] },
      { id: "aristotle", title: "从具体事物建立分类体系", figures: "亚里士多德", region: "吕克昂学园", answer: "形式存在于具体事物，知识要解释原因、目的与不同事物的适当功能。", method: "观察、分类、逻辑与目的论", difference: "保留柏拉图的可理解秩序，却把研究重新拉回经验世界。", noteCue: "Plato was mathematical, Aristotle was biological", chapterIds: ["b1-19", "b1-20", "b1-21", "b1-22", "b1-23"] },
    ],
    legacy: ["概念分析与问答", "理念论和政治理想", "逻辑分类体系", "伦理与政治的系统连接"],
    review: "面对雅典的政治失序，为什么苏格拉底选择审问个人，柏拉图设计理想国家，亚里士多德却比较现实制度？",
    coverage: "personal",
  },
  {
    id: "hellenistic",
    years: "前 322—前 30",
    title: "帝国世界与个人伦理",
    subtitle: "亚历山大以后的哲学",
    transition: "参与城邦 → 管理不可控制的生活",
    world: ["城邦独立被马其顿和继业者王国取代", "广大帝国带来秩序，也带来个人政治无力", "希腊、埃及、波斯与东方文化加速接触"],
    carrier: "跨地域学派、宫廷、城市教师与个人修习共同体",
    commonQuestion: "当公共世界不再由个人掌控，怎样获得安全、宁静和自由？",
    chain: [
      { label: "结构变化", text: "城邦公民 → 帝国臣民", kind: "condition" },
      { label: "目标变化", text: "公共善 → 个人免于不幸", kind: "response" },
      { label: "共同手段", text: "重新管理欲望与判断", kind: "inherit" },
      { label: "不同答案", text: "退出、悬置、宁静、顺应", kind: "oppose" },
    ],
    responses: [
      { id: "cynics", title: "退出人为制度", figures: "第欧根尼与犬儒派", region: "希腊化城市", answer: "减少需要、拒绝虚假规范，德性便不再依赖财富和政治。", method: "生活示范、反习俗与公开讽刺", difference: "通过主动贫困把自由变成不被社会控制。", noteCue: "return to nature / external goods are precarious", chapterIds: ["b1-26"] },
      { id: "sceptics", title: "悬置判断", figures: "皮浪、阿尔克西劳、卡尔内阿德", region: "希腊与学院", answer: "既然确定知识难以成立，停止武断便能减少精神扰动。", method: "为相反结论提供同等论证", difference: "不是提供新的世界理论，而是降低承诺。", noteCue: "I think it is so, but I am not sure", chapterIds: ["b1-26"] },
      { id: "epicureans", title: "管理欲望以获得宁静", figures: "伊壁鸠鲁、卢克莱修", region: "雅典花园学派 / 罗马", answer: "快乐是无痛与心灵宁静；理解自然可以解除对神和死亡的恐惧。", method: "原子论、欲望分类与友谊实践", difference: "保留自然科学，但把它服务于可持续的幸福。", noteCue: "tranquility is pleasure / no need to fear god and death", chapterIds: ["b1-27"] },
      { id: "stoics", title: "在必然秩序中获得内在自由", figures: "季蒂昂的芝诺、塞涅卡、爱比克泰德、马可·奥勒留", region: "从希腊化东方到罗马", answer: "外部事件由自然秩序决定，真正的善只在人的意志和判断。", method: "可控区分、自我训练与普遍自然法", difference: "不退出世界，而是把自由安放在无法被夺走的内部。", noteCue: "individual life is good when it is in harmony with Nature", chapterIds: ["b1-28"] },
    ],
    legacy: ["哲学成为生活实践", "世界公民与自然法", "内在自由", "为基督教伦理准备概念资源"],
    review: "四个学派共享怎样的历史处境？它们分别通过减少需要、知识承诺、欲望还是控制范围来获得安定？",
    coverage: "personal",
  },
  {
    id: "roman",
    years: "前 30—300",
    title: "罗马秩序与向内转向",
    subtitle: "帝国、斯多葛主义与新柏拉图主义",
    transition: "外部政治秩序扩大 → 精神价值逐渐内向化",
    world: ["法律、道路和军队维持广阔帝国", "希腊文化被传播却失去政治中心", "三世纪危机加深宗教与来世需求"],
    carrier: "帝国行政、城市精英、宗教团体与哲学教师",
    commonQuestion: "帝国提供外部秩序，却无法提供终极意义；更高的真实在哪里？",
    chain: [
      { label: "帝国贡献", text: "法律、交通与社会凝聚", kind: "condition" },
      { label: "文化张力", text: "罗马组织力 / 希腊思想力", kind: "oppose" },
      { label: "精神转向", text: "可见世界 → 内在灵魂", kind: "response" },
      { label: "后续入口", text: "新柏拉图主义 → 基督教神学", kind: "transmit" },
    ],
    responses: [
      { id: "roman-stoics", title: "把哲学变成日常操练", figures: "塞涅卡、爱比克泰德、马可·奥勒留", region: "罗马帝国", answer: "人在角色与命运中履行理性义务，通过判断训练保持自由。", method: "自省、格言、日课和死亡练习", difference: "希腊学派理论转化为帝国中不同阶层可实践的伦理。", chapterIds: ["b1-28", "b1-29"] },
      { id: "plotinus", title: "从多返回一", figures: "普罗提诺", region: "亚历山大里亚 / 罗马", answer: "感性世界源于更高层的太一、精神与灵魂，最高生活是灵魂返回其根源。", method: "形而上层级、内省与神秘合一", difference: "保留柏拉图的超越世界，弱化政治、数学和经验科学。", noteCue: "look within rather than look without", chapterIds: ["b1-30"] },
    ],
    legacy: ["罗马法与制度记忆", "哲学的精神修习化", "新柏拉图主义", "古典思想进入基督教的桥梁"],
    review: "罗马帝国的外部秩序为什么没有阻止哲学和宗教进一步向内、向来世转移？",
    coverage: "personal",
  },
  {
    id: "patristic",
    years: "300—600",
    title: "基督教重组古典世界",
    subtitle: "教父哲学",
    transition: "城邦与帝国伦理 → 创造、救赎与普世教会",
    world: ["基督教由受迫害宗派转为帝国主导宗教", "西罗马政治结构瓦解", "教会成为跨地域、识字且连续的组织"],
    carrier: "主教、修道院、教会会议与拉丁圣经传统",
    commonQuestion: "如何用希腊哲学表达一个关于创造、罪、救赎和历史终点的宗教？",
    chain: [
      { label: "思想资源", text: "犹太历史伦理 + 希腊神学概念", kind: "inherit" },
      { label: "制度载体", text: "帝国衰落 → 教会连续性", kind: "condition" },
      { label: "核心重组", text: "宇宙论 → 创造与救赎史", kind: "response" },
      { label: "政治后果", text: "灵魂义务可高于国家义务", kind: "exception" },
    ],
    responses: [
      { id: "paul-john", title: "把犹太宗派变成普世宗教", figures: "保罗、约翰与早期教会", region: "东地中海", answer: "救赎不再限于民族律法，基督被放入普遍神学叙事。", method: "经文解释、宣教与概念融合", difference: "削弱民族边界，同时吸收希腊化世界的语言。", noteCue: "Jews to Jews → Gentiles / combine Plato", chapterIds: ["b2-01", "b2-02"] },
      { id: "augustine", title: "把历史与内心纳入神学", figures: "奥古斯丁", region: "北非 / 拉丁教会", answer: "时间属于受造世界，恶是善的缺失，人因自由意志犯罪却需要恩典。", method: "内省、经文解释与柏拉图式形而上学", difference: "把罗马崩溃解释为两座城的历史，而非基督教失败。", noteCue: "Time: after Creation, in human mind / City of God", chapterIds: ["b2-03", "b2-04"] },
      { id: "monastic-papacy", title: "以组织保存知识与秩序", figures: "本尼狄克、大格列高利", region: "意大利与西欧", answer: "在政治断裂中，以修道纪律、主教网络和教皇通信维持共同生活。", method: "规则、行政、教育与传教", difference: "哲学不只作为理论延续，也嵌入新的制度载体。", noteCue: "Roman Law / monastic order / increase of papal power", chapterIds: ["b2-05", "b2-06"] },
    ],
    legacy: ["线性救赎史", "内心与意志哲学", "教会高于地域政治的主张", "修道院知识网络"],
    review: "基督教为什么既反对古典异教世界，又必须借用柏拉图主义和罗马组织来表达自己？",
    coverage: "personal",
  },
  {
    id: "early-medieval",
    years: "600—1100",
    title: "断裂、保存与知识回流",
    subtitle: "黑暗时代、教皇制与伊斯兰世界",
    transition: "统一帝国崩解 → 多个知识保存与传播中心",
    world: ["西欧政治碎片化，教皇与世俗统治者相互依赖", "拜占庭、伊斯兰世界和爱尔兰保存不同古典资源", "修道院和宫廷教育缓慢重建拉丁知识"],
    carrier: "修道院、教皇宫廷、伊斯兰城市与翻译网络",
    commonQuestion: "当文明载体改变时，知识怎样被保存、筛选并重新获得权威？",
    chain: [
      { label: "政治断裂", text: "帝国 → 封建与地方权力", kind: "condition" },
      { label: "多条保存线", text: "修道院 / 拜占庭 / 伊斯兰", kind: "transmit" },
      { label: "组织竞争", text: "教皇 ↔ 皇帝", kind: "oppose" },
      { label: "知识回流", text: "希腊—阿拉伯—拉丁翻译", kind: "transmit" },
    ],
    responses: [
      { id: "papal-order", title: "以教会构造跨地域秩序", figures: "教皇、修道院改革者", region: "拉丁西欧", answer: "宗教权威、教育与仪式可以在世俗分裂中维持共同体。", method: "组织纪律、教会法与改革运动", difference: "知识权威与神职阶层逐渐结为一体。", chapterIds: ["b2-07", "b2-09"] },
      { id: "john-scot", title: "在信仰内部坚持理性", figures: "约翰·司各脱·爱留根纳", region: "爱尔兰 / 法兰克宫廷", answer: "真正理性与真正启示不会冲突；他据此把自然解释为从上帝流出、又返回上帝的整体。", method: "希腊文献翻译、柏拉图主义与辩证推理", difference: "在反智倾向增强的西欧，他仍坚持用推理解释启示，因而成为当时少见的系统思想家。", noteCue: "reason above faith / on the division of Nature", chapterIds: ["b2-08"] },
      { id: "islamic", title: "吸收并扩展多文明知识", figures: "阿维森纳、阿威罗伊、迈蒙尼德", region: "巴格达、波斯、西班牙与开罗", answer: "宗教社会可以吸收希腊哲学、印度数学和波斯文化，并重新解释亚里士多德。", method: "翻译、注释、医学、数学与哲学综合", difference: "不是被动保管，而是古典知识继续发展的主要环境。", noteCue: "India: mathematics / Syria: Greek culture / Arabic to Latin", chapterIds: ["b2-10"] },
    ],
    legacy: ["教皇—皇帝二元结构", "大学与经院辩证法的前提", "亚里士多德重新进入西欧", "跨文明知识传播"],
    review: "为什么同一批希腊知识在西欧、拜占庭和伊斯兰世界经历了不同的保存与发展命运？",
    coverage: "personal",
  },
  {
    id: "scholastic",
    years: "1100—1400",
    title: "经院理性的高峰与裂缝",
    subtitle: "十二、十三世纪",
    transition: "知识回流 → 信仰与理性的系统综合",
    world: ["城市、大学和商业阶层兴起", "十字军与翻译运动扩大知识接触", "教皇权力达到高峰，也面对帝国、异端和民族王权"],
    carrier: "大学、托钵修会、教廷与拉丁翻译体系",
    commonQuestion: "亚里士多德式理性与基督教启示能否组成一个无矛盾的完整世界？",
    chain: [
      { label: "新资源", text: "完整亚里士多德进入拉丁世界", kind: "transmit" },
      { label: "新制度", text: "大学与经院辩论", kind: "condition" },
      { label: "宏大综合", text: "自然理性 + 启示神学", kind: "response" },
      { label: "内部裂缝", text: "意志、个体与经验重新上升", kind: "oppose" },
    ],
    responses: [
      { id: "aquinas", title: "划分并协调理性与启示", figures: "托马斯·阿奎那", region: "巴黎 / 意大利", answer: "理性能证明部分神学前提，启示补充其不能独立达到的真理。", method: "问题、反对意见、回答与逐项反驳", difference: "把亚里士多德自然哲学纳入教会认可的总体体系。", chapterIds: ["b2-12", "b2-13"] },
      { id: "franciscans", title: "强调意志、个体与经验", figures: "罗杰·培根、邓斯·司各脱、奥卡姆的威廉", region: "牛津 / 巴黎", answer: "理性的体系能力有限；个体、意志和经验不能完全被普遍形式吸收。", method: "经验研究、精细概念区分与简约原则", difference: "这些方法最初用于经院论争，后来也成为限制经院综合范围的工具。", chapterIds: ["b2-14"] },
      { id: "church-state", title: "统一世界的政治基础松动", figures: "教皇、皇帝、城市与民族王权", region: "西欧", answer: "精神与世俗权威无法继续由单一等级体系稳定安排。", method: "法律争论、结盟、战争与制度竞争", difference: "哲学综合的瓦解也有明确的政治和社会条件。", noteCue: "continued conflict of empire and papacy", chapterIds: ["b2-11", "b2-12", "b2-15"] },
    ],
    legacy: ["大学论证格式", "自然法传统", "信仰与理性的边界", "个体主义和经验方法的萌芽"],
    review: "经院哲学为什么会在教会权力最强的时期达到高峰，又为何从自身的论证工具中产生裂缝？",
    coverage: "personal",
  },
  {
    id: "renaissance-science",
    years: "1400—1650",
    title: "权威瓦解与科学方法兴起",
    subtitle: "文艺复兴、宗教改革与新科学",
    transition: "统一的中世纪宇宙 → 多中心竞争与可检验的自然",
    world: ["民族国家、印刷术和远洋扩张改变权威结构", "宗教改革打破西欧教会统一", "哥白尼、开普勒和伽利略重建宇宙图景"],
    carrier: "宫廷、城市人文主义者、印刷网络、宗派国家与科学院",
    commonQuestion: "当传统权威不再统一，知识与政治秩序应依据什么建立？",
    chain: [
      { label: "权威分裂", text: "教会统一 → 宗派与国家", kind: "condition" },
      { label: "知识扩张", text: "古典文献 + 新世界 + 新天文学", kind: "transmit" },
      { label: "方法转向", text: "注释权威 → 数学与实验", kind: "response" },
      { label: "现代起点", text: "主体和国家重新奠基", kind: "inherit" },
    ],
    responses: [
      { id: "machiavelli", title: "把政治作为现实力量研究", figures: "马基雅维利", region: "意大利城邦", answer: "政治首先要处理权力、稳定和行动后果，而不是服从完整神学伦理。", method: "历史案例与现实主义比较", difference: "最早鲜明表现政治从统一宗教道德中独立。", chapterIds: ["b3-02", "b3-03"] },
      { id: "reformation", title: "把宗教权威移回个人与经文", figures: "路德及宗教改革者", region: "北欧与德意志", answer: "教会传统不再是唯一中介，个人良心和经文解释获得更大地位。", method: "文本回归、信仰争论与印刷传播", difference: "释放个人判断，也把宗教权威转移给宗派国家。", chapterIds: ["b3-04", "b3-05"] },
      { id: "new-science", title: "以数学和实验重建自然知识", figures: "哥白尼、开普勒、伽利略、培根", region: "欧洲知识网络", answer: "自然应由数量关系、观察和可重复方法解释，而非由目的和传统权威决定。", method: "数学建模、实验与归纳", difference: "改变的不只是结论，而是什么可以算作知识。", chapterIds: ["b3-06", "b3-07"] },
    ],
    legacy: ["世俗国家", "个人解释权", "数学化自然", "现代哲学寻找新基础的任务"],
    review: "文艺复兴、宗教改革和科学革命看似不同，为什么都可以理解为对统一权威结构的拆解？",
    coverage: "personal",
  },
  {
    id: "early-modern",
    years: "1650—1750",
    title: "理性、经验与现代秩序",
    subtitle: "从霍布斯到休谟",
    transition: "失去共同权威 → 从主体、经验和契约重新奠基",
    world: ["宗教战争强化对政治和平的需求", "新科学成为可靠知识的模型", "商业社会与英国革命推动自由主义"],
    carrier: "共和国、王权国家、科学院、沙龙与出版市场",
    commonQuestion: "知识如何获得确定性？相互冲突的个人如何建立稳定政治？",
    chain: [
      { label: "共同危机", text: "权威不再自动可信", kind: "condition" },
      { label: "知识路线", text: "理性主义 ↔ 经验主义", kind: "oppose" },
      { label: "政治路线", text: "绝对主权 ↔ 自由主义", kind: "oppose" },
      { label: "终点危机", text: "休谟把经验主义推向怀疑", kind: "inherit" },
    ],
    responses: [
      { id: "hobbes", title: "从恐惧和契约建立主权", figures: "霍布斯", region: "英格兰", answer: "自然平等导致不安全，个人为和平授权一个不可分割的公共权力。", method: "机械论、思想实验与演绎构造", difference: "以个人为起点，却推出强大的国家。", chapterIds: ["b3-08"] },
      { id: "rationalists", title: "从清楚原则演绎世界", figures: "笛卡尔、斯宾诺莎、莱布尼茨", region: "法国、荷兰、德意志", answer: "理性可以从确定起点建立关于心灵、自然和上帝的系统知识。", method: "怀疑、定义、公理与演绎", difference: "共享数学理想，却对实体、自由和心物关系给出不同体系。", chapterIds: ["b3-09", "b3-10", "b3-11"] },
      { id: "locke", title: "从经验与权利限制权威", figures: "洛克", region: "英格兰", answer: "观念来自经验，政治权力来自保护自然权利的有限委托。", method: "心理发生分析与契约论", difference: "在知识和政治两方面都反对天赋内容与绝对权威。", chapterIds: ["b3-12", "b3-13", "b3-14", "b3-15"] },
      { id: "hume", title: "揭示经验基础的限度", figures: "贝克莱、休谟", region: "不列颠与爱尔兰", answer: "实体、因果和自我都不能按传统方式从经验中得到必然证明。", method: "观念来源追踪与怀疑分析", difference: "经验主义成功拆除旧形而上学，也动摇了科学归纳的理性基础。", chapterIds: ["b3-16", "b3-17"] },
    ],
    legacy: ["现代主体", "社会契约", "自由主义", "理性主义—经验主义框架", "康德问题的起点"],
    review: "为什么同样受新科学影响，笛卡尔从理性确定性出发，洛克从经验出发，霍布斯却把方法用于国家建构？",
    coverage: "personal",
  },
  {
    id: "revolution-idealism",
    years: "1750—1850",
    title: "革命、浪漫主义与历史理性",
    subtitle: "卢梭、康德与德国观念论",
    transition: "普遍理性与个人权利 → 自由、历史和民族共同体",
    world: ["启蒙思想进入美国与法国革命", "浪漫主义反抗机械理性和商业文明", "拿破仑战争与民族国家改变欧洲"],
    carrier: "公共舆论、大学、文学运动、革命国家与民族文化",
    commonQuestion: "自由是个人不受干涉，还是个人通过共同体和历史实现自身？",
    chain: [
      { label: "政治爆发", text: "启蒙原则 → 革命实践", kind: "condition" },
      { label: "情感反动", text: "理性秩序 → 浪漫个性", kind: "oppose" },
      { label: "哲学重建", text: "主体条件 → 历史精神", kind: "response" },
      { label: "新危险", text: "自由可能被整体国家吸收", kind: "exception" },
    ],
    responses: [
      { id: "rousseau", title: "从自然自由到公意", figures: "卢梭", region: "日内瓦 / 法国", answer: "文明制造依赖与不平等，正当共同体必须使服从法律等于服从共同意志。", method: "起源叙事、社会批判与契约构造", difference: "既启发民主自由，也为整体意志留下危险空间。", chapterIds: ["b3-18", "b3-19"] },
      { id: "kant", title: "为经验与自由划定条件", figures: "康德", region: "普鲁士", answer: "主体的先天形式使经验知识可能；自由则属于实践理性的道德要求。", method: "先验分析与二律背反", difference: "不在理性和经验中选边，而是研究二者何以可能。", chapterIds: ["b3-20"] },
      { id: "hegel", title: "把矛盾放入历史整体", figures: "黑格尔", region: "德意志大学", answer: "理性与自由通过历史制度逐步展开，局部只有在整体关系中才被理解。", method: "辩证运动与历史解释", difference: "把康德的主体结构扩展成世界历史的自我发展。", chapterIds: ["b3-21", "b3-22"] },
      { id: "romantics", title: "以个性、意志和激情反抗体系", figures: "拜伦、叔本华", region: "欧洲文学与哲学", answer: "抽象理性无法穷尽生命，个体激情或盲目意志比理性秩序更根本。", method: "艺术形象、内省与意志形而上学", difference: "把哲学重新拉向不可被体系驯服的经验。", chapterIds: ["b3-23", "b3-24"] },
    ],
    legacy: ["现代自由概念的分叉", "先验方法", "历史辩证法", "民族国家与浪漫个人主义"],
    review: "为什么法国革命既能支持个人自由，也能推动卢梭式公意、黑格尔式国家和浪漫主义反理性？",
    coverage: "personal",
  },
  {
    id: "industrial-modern",
    years: "1850—1930",
    title: "工业社会与现代哲学分流",
    subtitle: "从尼采、马克思到逻辑分析",
    transition: "单一宏大体系 → 多种方法解释工业化、科学与现代生活",
    world: ["工业资本主义和大众政治重组阶级关系", "进化论与现代科学改变人的位置", "大学专业化促成哲学方法分流"],
    carrier: "政党、大学、工人运动、科学共同体与大众出版",
    commonQuestion: "在工业、科学和传统价值崩解的世界里，哲学应解释结构、重估价值，还是澄清语言？",
    chain: [
      { label: "共同环境", text: "工业化、世俗化、科学化", kind: "condition" },
      { label: "解释对象", text: "价值 / 阶级 / 经验 / 语言", kind: "response" },
      { label: "方法分流", text: "谱系、历史、实用、分析", kind: "oppose" },
      { label: "现代格局", text: "哲学不再共享单一中心", kind: "inherit" },
    ],
    responses: [
      { id: "nietzsche", title: "追溯并重估价值", figures: "尼采", region: "德语欧洲", answer: "传统道德有自身的历史和权力来源；克服虚无主义，需要重新创造能够肯定生命的价值。", method: "谱系、心理洞察与格言", difference: "不问价值是否符合永恒标准，而问它由何种生命需要产生。", chapterIds: ["b3-25"] },
      { id: "utilitarian-marx", title: "以结果或结构评价社会", figures: "功利主义者、马克思", region: "英国 / 欧洲工人运动", answer: "制度可按总体幸福评价，或按生产关系与阶级支配解释并改变。", method: "后果计算、政治经济学与历史唯物解释", difference: "都把哲学拉向社会改革，却对个人利益和历史结构权重不同。", chapterIds: ["b3-26", "b3-27"] },
      { id: "life-duration", title: "从绵延内部理解生命", figures: "柏格森", region: "法国", answer: "生活时间是过去渗入现在的质性绵延，不能被钟表单位和静态概念完全替代。", method: "经验描述、直觉与过程比较", difference: "把科学测量与生活经验的适用范围分开，重新突出生成、记忆与创造。", chapterIds: ["b3-28"] },
      { id: "pragmatists", title: "以实践后果理解真理", figures: "威廉·詹姆斯、约翰·杜威", region: "美国", answer: "观念的意义和真理应联系其在经验、行动和共同探究中的作用。", method: "经验实验、功能分析与教育实践", difference: "拒绝脱离生活的二元体系，把认识放回持续调整的环境。", chapterIds: ["b3-29", "b3-30"] },
      { id: "analysis", title: "以逻辑分析澄清问题", figures: "弗雷格传统、罗素与分析哲学", region: "英国及欧洲逻辑传统", answer: "许多哲学困难来自语法表面，揭示逻辑形式可以重构或消除问题。", method: "逻辑形式、定义与语言分析", difference: "不再建立历史整体，而把哲学变成精确的澄清活动。", chapterIds: ["b3-31"] },
    ],
    legacy: ["价值谱系", "社会结构批判", "实用主义", "分析哲学", "现代哲学的多中心格局"],
    review: "为什么工业社会没有产生一个统一哲学，而同时产生了尼采、马克思、实用主义和逻辑分析？",
    coverage: "personal",
  },
];

export const stageDetailPanels: Record<string, StageDetailPanel> = {
  origins: {
    events: [
      { id: "ionian-network", marker: "前 8—6 世纪", title: "殖民、贸易与爱奥尼亚知识网络", detail: "希腊人在地中海和黑海沿岸建立殖民城邦。米利都等商业城市同时接触埃及测量、巴比伦天文和多地宗教观念。知识开始脱离单一祭司传统，在旅行者与城邦精英之间比较、修正。" },
      { id: "polis-rise", marker: "前 7—6 世纪", title: "城邦政治与成文法兴起", detail: "贵族、僭主和平民围绕土地、债务和公民资格反复冲突。成文法与公共议事让秩序显得并非只能由神授，也能由人说明和改变；论证由此成为公共生活的一种力量。" },
      { id: "persian-wars", marker: "前 499—449", title: "希波战争与希腊世界重组", detail: "爱奥尼亚起义和希波战争摧毁、迁移了一些早期思想中心，同时提升雅典的军事与文化地位。哲学活动逐渐由小亚细亚向南意大利和雅典转移。" },
    ],
    problems: [
      { id: "arche", marker: "自然", title: "多样世界是否有共同本原？", detail: "跨文明观察带来大量不同解释。早期哲学家尝试用水、无限者、气、数或原子等较少的自然原则说明较多现象，使世界成为可以争论的对象。" },
      { id: "change-being", marker: "存在", title: "变化与恒常如何同时成立？", detail: "经验呈现生成与毁灭，理性却要求同一和不矛盾。赫拉克利特、巴门尼德及后来的多元论者，正是在回应感官变化与理性恒常之间的冲突。" },
      { id: "reason-sense", marker: "知识", title: "感官和推理，何者更可靠？", detail: "数学证明显示推理可以达到不依赖眼前经验的确定性；但自然研究又从观察起步。这个张力后来成为柏拉图主义、经验研究和科学方法长期分化的起点。" },
    ],
  },
  athens: {
    events: [
      { id: "athenian-democracy", marker: "前 508—431", title: "民主、帝国与公共辩论扩张", detail: "克利斯提尼改革后，公民大会、法庭和演说成为雅典政治核心。海上同盟又带来财富与帝国权力。能否说服公众、界定正义，成为真实的政治能力。" },
      { id: "peloponnesian-war", marker: "前 431—404", title: "伯罗奔尼撒战争与政体反复", detail: "长期战争、瘟疫、远征失败以及民主和寡头政变交替，削弱了雅典对自身制度的信心。苏格拉底之死与柏拉图的政治不信任，都处在这一创伤背景中。" },
      { id: "macedonian-rise", marker: "前 387—322", title: "学园建立与马其顿接管希腊", detail: "柏拉图学院和亚里士多德吕克昂把哲学变成持续教学与研究制度；与此同时，马其顿击败希腊城邦，传统公民政治的自主空间迅速缩小。" },
    ],
    problems: [
      { id: "knowledge-opinion", marker: "知识", title: "公共意见之外，是否有可靠知识？", detail: "民主法庭依赖多数判断，智者展示同一案件可以有相反论证。苏格拉底与柏拉图因此追问：若没有稳定定义和真理，政治判断如何避免只剩说服与权势？" },
      { id: "virtue-education", marker: "伦理", title: "德性能够通过教育获得吗？", detail: "新兴政治生活让修辞教师成为职业，但“会成功”是否等于“是善的”并不清楚。苏格拉底把教育从技能训练转成对灵魂、知识和行动一致性的审问。" },
      { id: "best-polis", marker: "政治", title: "失序之后，怎样组织好城邦？", detail: "雅典的战争失败使哲学家不得不比较民主、寡头、君主和混合政体。柏拉图从知识资格设计理想国，亚里士多德则从现实宪制与公民生活寻找可行秩序。" },
    ],
  },
  hellenistic: {
    events: [
      { id: "alexander", marker: "前 334—323", title: "亚历山大征服波斯帝国", detail: "马其顿军队把希腊势力推进到埃及、中亚和印度河流域。征服制造了跨地域的政治与文化空间，也终结了希腊城邦作为最高政治单位的稳定地位。" },
      { id: "successor-kingdoms", marker: "前 323—168", title: "继业者王国与希腊化城市形成", detail: "帝国分裂为托勒密、塞琉古等君主国。亚历山大里亚等城市汇聚希腊、埃及、波斯和犹太传统，学派与图书馆取代城邦公民共同体，成为知识的重要载体。" },
      { id: "roman-expansion", marker: "前 168—30", title: "罗马接管地中海世界", detail: "罗马先后控制马其顿、希腊和埃及。政治中心继续远离传统希腊城邦，哲学则被带入罗马精英教育和更广泛的帝国生活。" },
    ],
    problems: [
      { id: "inner-freedom", marker: "生活", title: "无法控制政治时，个人怎样自由？", detail: "个人从城邦决策者变为大王国的臣民，外部地位更不稳定。犬儒、伊壁鸠鲁和斯多葛学派都把自由重新安放在需要、欲望或判断的管理上。" },
      { id: "cosmopolis", marker: "共同体", title: "跨地域世界需要怎样的共同身份？", detail: "人口迁移和文化混合削弱了单一城邦身份。斯多葛主义用共同理性和自然法构造“世界公民”，其他学派则用友谊小共同体或退出公共规范回应。" },
      { id: "tranquility-certainty", marker: "知识", title: "确定知识是否是安宁的必要条件？", detail: "怀疑派认为减少知识承诺本身能够消除扰动；伊壁鸠鲁派却认为必须理解自然，才能解除神罚和死亡恐惧。两者共享宁静目标，却对知识的作用判断相反。" },
    ],
  },
  roman: {
    events: [
      { id: "augustan-order", marker: "前 27—180", title: "元首制与帝国和平", detail: "奥古斯都以后，军队、税制、道路和行政把广大地区纳入较稳定的秩序。希腊哲学被罗马精英吸收，但哲学家很少再把参与独立城邦当作生活前提。" },
      { id: "citizenship-law", marker: "1—3 世纪", title: "罗马法与公民身份扩张", detail: "城市网络、法律程序和二一二年的公民权敕令扩大了共同制度。不同民族在同一帝国中生活，使普遍法、角色义务和人类共同性的观念更有现实基础。" },
      { id: "third-century-crisis", marker: "235—284", title: "三世纪危机与宗教需求上升", detail: "皇位频繁更替、内战、边境压力、瘟疫和经济混乱削弱帝国安全感。传统公共宗教难以解释个人苦难，神秘宗教和更强的来世救赎需求因而扩张。" },
    ],
    problems: [
      { id: "role-duty", marker: "伦理", title: "庞大制度中的人应怎样履行角色？", detail: "帝国把皇帝、奴隶、士兵和官员置于不同位置。罗马斯多葛主义试图说明：外在角色有别，但每个人都能通过理性判断和恰当行动保有德性。" },
      { id: "fate-freedom", marker: "自由", title: "必然命运中还能有什么自由？", detail: "个人难以影响帝国政治，战争与疾病也不可预测。哲学于是区分事件本身与人的判断，把自由缩小却加固为无法被外力直接夺走的内在能力。" },
      { id: "higher-reality", marker: "形而上学", title: "外部秩序之外，更高真实在哪里？", detail: "帝国制度能提供法律，却不能提供终极意义。普罗提诺把真实组织成太一、精神与灵魂的层级，并要求灵魂由感性多样返回统一根源。" },
    ],
  },
  patristic: {
    events: [
      { id: "constantine", marker: "313—325", title: "君士坦丁改宗与尼西亚会议", detail: "基督教获得合法地位后，教义分歧不再只是宗派内部问题。皇帝召集会议处理基督性质等争论，神学语言与帝国统一第一次被制度性地连接。" },
      { id: "state-religion", marker: "380—395", title: "基督教成为帝国主导宗教", detail: "狄奥多西时期，尼西亚基督教获得国家支持，异教祭祀受到限制。教会吸收行政资源，也必须处理权力、强制与正统边界的问题。" },
      { id: "western-collapse", marker: "410—529", title: "西罗马瓦解与修道制度成长", detail: "罗马遭劫和西部皇权消失，使城市教育与行政网络衰退。主教和修道院逐渐承担救济、识字教育与典籍保存，教会成为少数跨地域连续组织。" },
    ],
    problems: [
      { id: "greek-language", marker: "神学", title: "如何用希腊概念表达启示？", detail: "圣经叙事谈创造与救赎，希腊哲学谈实体、形式和永恒。教父必须借用后者澄清三位一体与基督论，同时避免让基督教被完全改写成柏拉图主义。" },
      { id: "evil-grace", marker: "人性", title: "恶、自由意志与恩典怎样相容？", detail: "基督教既坚持上帝全善全能，又必须解释罪与苦难。奥古斯丁把恶理解为善的缺失，把犯罪归于意志，却又强调堕落者离不开神圣恩典。" },
      { id: "sacred-history", marker: "历史", title: "帝国崩溃意味着宗教失败吗？", detail: "罗马被劫后，异教作者把灾难归咎于基督教。奥古斯丁以“上帝之城”和“世俗之城”区分政治命运与救赎史，使历史获得一个超越帝国兴亡的方向。" },
    ],
  },
  "early-medieval": {
    events: [
      { id: "islamic-expansion", marker: "7—10 世纪", title: "伊斯兰扩张与翻译运动", detail: "阿拉伯帝国连接叙利亚、波斯、埃及与西班牙。巴格达等中心把希腊哲学、印度数学和医学译成阿拉伯语，并在注释、计算与科学实践中继续发展。" },
      { id: "carolingian", marker: "800—843", title: "查理曼帝国与拉丁教育重建", detail: "查理曼加冕象征西部帝国观念复兴。宫廷和修道院推动文字规范、学校与抄本复制，但统一很快瓦解，教育仍主要依附少数宗教机构。" },
      { id: "investiture", marker: "1075—1122", title: "教会改革与叙任权斗争", detail: "改革教皇反对世俗君主任命主教，皇帝则坚持传统控制。冲突把精神权威与世俗权力明确区分，也推动教会法和制度论证发展。" },
    ],
    problems: [
      { id: "preservation-authority", marker: "知识", title: "文明断裂后，谁有权保存和筛选知识？", detail: "不同地区保存了不同古典资源：西欧修道院偏重拉丁宗教文本，拜占庭保留希腊传统，伊斯兰城市则广泛翻译和扩展。保存从来同时意味着选择。" },
      { id: "reason-revelation", marker: "方法", title: "跨语言知识怎样进入信仰体系？", detail: "翻译不只是替换词语，也会改变概念之间的关系。约翰·司各脱·爱留根纳、阿维森纳和阿威罗伊都必须判断：哲学推理与启示似乎冲突时，应当重新解释经文、限制理性的范围，还是区分两种论证层次？" },
      { id: "two-powers", marker: "政治", title: "教皇与皇帝，谁代表普遍秩序？", detail: "西欧没有单一帝国，却同时继承罗马皇权和普世教会理想。主教任命、财产和法律管辖的争执，使政治思想长期围绕两种普遍权威的边界展开。" },
    ],
  },
  scholastic: {
    events: [
      { id: "translations-crusades", marker: "1095—1250", title: "十字军、城市贸易与翻译回流", detail: "军事接触并非知识传播的唯一渠道，但地中海联系扩大，使托莱多、西西里等地的阿拉伯语和希腊语著作进入拉丁世界，完整亚里士多德尤其改变大学课程。" },
      { id: "universities", marker: "12—13 世纪", title: "大学与托钵修会兴起", detail: "巴黎、牛津等大学形成教师、课程与学位制度；方济各会和多明我会进入城市教育。哲学问题被固定成可反驳、可答辩、可积累的专业论证格式。" },
      { id: "papal-decline", marker: "1302—1378", title: "教皇高峰后的政治裂缝", detail: "教皇与法国王权冲突、阿维尼翁时期及教会分裂削弱普世权威。民族王权、城市和新法律实践上升，使经院综合失去原有的统一制度基础。" },
    ],
    problems: [
      { id: "faith-reason", marker: "体系", title: "理性与启示能组成完整世界吗？", detail: "亚里士多德提供自然、逻辑和伦理的系统解释，却包含与基督教不完全相容的前提。阿奎那试图划分自然理性能及之处，以及必须依赖启示的领域。" },
      { id: "universal-individual", marker: "本体论", title: "普遍概念和个体事物谁更根本？", detail: "大学辩论需要精确定义“人性”“种类”等共相的地位。实在论、概念论和唯名论的差异，又影响上帝知识、个体责任和经验对象应如何被理解。" },
      { id: "limits-system", marker: "方法", title: "一个体系应当在哪里停止解释？", detail: "经院方法追求兼容全部权威，但奥卡姆等人强调简约、个体和上帝意志，缩小理性证明范围。体系内部由此产生限制体系自身的工具。" },
    ],
  },
  "renaissance-science": {
    events: [
      { id: "print-fall", marker: "1450—1453", title: "印刷术传播与君士坦丁堡陷落", detail: "活字印刷显著降低文本复制成本，希腊学者和手稿又更多进入意大利。古典材料不再只由大学经院传统解释，人文主义者开始校勘原文和比较版本。" },
      { id: "oceanic-expansion", marker: "1492—1522", title: "远洋航行扩大已知世界", detail: "跨大西洋航行和环球航行暴露了古典地理知识的限度，也带来殖民、财富与暴力。经验事实能够公开修正权威文本，欧洲人的人类与自然观被迫扩展。" },
      { id: "reformation-science", marker: "1517—1633", title: "宗教改革与日心说冲突", detail: "宗教改革打破西欧教会统一；哥白尼、开普勒和伽利略又以数学和观察改变宇宙结构。经文、古代权威与可检验自然知识之间出现多重竞争。" },
    ],
    problems: [
      { id: "political-reality", marker: "政治", title: "政治能否脱离统一神学伦理研究？", detail: "意大利城邦的战争与外交显示，统治者常按权力后果而非传统德性行动。马基雅维利由此把政治稳定、能力和时机当作相对独立的研究对象。" },
      { id: "interpretation-authority", marker: "权威", title: "个人、经文与教会，谁解释真理？", detail: "印刷让经文和论战迅速传播，宗教改革削弱教会作为唯一中介的地位。个人良心上升，却也产生宗派国家、教义冲突和新的强制。" },
      { id: "new-method", marker: "科学", title: "什么方法能让自然知识可信？", detail: "旧体系依赖经典注释和目的因，新天文学则依赖测量、数学预测与仪器观察。争论的核心不只是地球是否运动，而是什么证据足以推翻权威。" },
    ],
  },
  "early-modern": {
    events: [
      { id: "religious-wars", marker: "1618—1648", title: "三十年战争与威斯特伐利亚和约", detail: "宗教、王朝和领土冲突造成中欧巨大破坏。和约强化领土国家秩序，也使政治和平越来越难以依赖全欧洲共享的宗教真理。" },
      { id: "english-revolutions", marker: "1642—1689", title: "英国内战与光荣革命", detail: "王权、议会、宗教和财产权的冲突经历内战、共和国、复辟与权利法案。霍布斯和洛克由同一政治危机出发，却分别强调不可分主权与有限政府。" },
      { id: "newtonian-science", marker: "1660—1687", title: "科学共同体与牛顿综合", detail: "皇家学会等机构推动公开实验和通信，牛顿以数学定律统一地上与天体运动。科学成为哲学家想要模仿、解释或限制的可靠知识模型。" },
    ],
    problems: [
      { id: "certainty-foundation", marker: "认识论", title: "失去共同权威后，确定性从哪里开始？", detail: "笛卡尔从不可怀疑的主体出发，理性主义者追求数学式体系；洛克和休谟则追踪观念的经验来源。现代哲学由此把“认识者”放到知识结构中心。" },
      { id: "sovereignty-rights", marker: "政治", title: "安全、主权与个人权利怎样排序？", detail: "宗教战争显示分裂权威可能导致暴力，英国内战又显示绝对权力本身也危险。社会契约论用个人同意重建国家，却对权力边界给出不同答案。" },
      { id: "causation-induction", marker: "科学", title: "经验为何能支持普遍科学定律？", detail: "科学不断成功，但经验只呈现有限事件。休谟指出，我们看见的是连续发生，而非必然联系；归纳依赖习惯，却无法用不循环的经验论证自身。" },
    ],
  },
  "revolution-idealism": {
    events: [
      { id: "atlantic-revolutions", marker: "1776—1799", title: "美国革命与法国革命", detail: "自然权利、人民主权和公民平等进入制度实践；法国革命同时经历共和、恐怖与政变。自由不再只是理论原则，也暴露出共同意志与政治暴力的紧张。" },
      { id: "napoleonic", marker: "1799—1815", title: "拿破仑战争重绘欧洲", detail: "法国制度和民族动员席卷欧洲，随后又由王朝复辟收束。战争促进民族意识，也让哲学家把国家、法律和历史变化理解为自由展开的现实场所。" },
      { id: "industrial-1848", marker: "1815—1848", title: "工业化、民族主义与革命浪潮", detail: "工厂城市、阶级分化和市场关系改变日常生活，民族独立与宪政运动扩张。浪漫主义反对把人缩减为计算与生产单位，一八四八年革命则集中暴露社会矛盾。" },
    ],
    problems: [
      { id: "freedom-general-will", marker: "政治", title: "个人自由如何进入共同意志？", detail: "革命需要以人民名义行动，却可能压制具体个人。卢梭的公意、康德的自律和黑格尔的制度自由，都试图说明服从共同规则何时不是失去自由。" },
      { id: "subject-world", marker: "认识论", title: "主体是在发现世界，还是构成经验？", detail: "休谟的怀疑使理性主义和经验主义都难以保证科学必然性。康德转而研究经验得以可能的主体条件，并由此开启德国观念论。" },
      { id: "history-freedom", marker: "历史", title: "历史变化是否具有理性方向？", detail: "革命和战争让制度在一代人内剧烈改变。黑格尔把冲突解释为自由意识的发展，浪漫主义者则担心抽象历史整体吞没个性、情感与不可替代的生命。" },
    ],
  },
  "industrial-modern": {
    events: [
      { id: "industrial-capital", marker: "1848—1871", title: "工业资本主义与工人运动成长", detail: "铁路、工厂和城市化扩大生产，也加深劳动分工、周期危机与阶级冲突。工会、社会主义和大众政治兴起，社会结构本身成为哲学解释与改造对象。" },
      { id: "darwin-secular", marker: "1859 以后", title: "进化论与传统世界观动摇", detail: "达尔文以自然选择解释物种形成，人类不再天然处于独立创造的位置。历史发展、生命竞争和宗教权威的衰退，共同迫使哲学重估价值来源。" },
      { id: "mass-war-analysis", marker: "1879—1918", title: "专业大学、逻辑革命与世界大战", detail: "哲学和科学在大学中专业化，现代逻辑改变了分析工具；民族国家和工业技术又在第一次世界大战中显示巨大破坏力。统一进步叙事因此失去可信度。" },
    ],
    problems: [
      { id: "value-after-god", marker: "价值", title: "传统宗教衰退后，价值从哪里来？", detail: "科学解释减少了诉诸神意的空间，社会规范又显出历史性。尼采用谱系追问价值由何种生命与权力关系产生，并把虚无主义视为现代核心危机。" },
      { id: "structure-agency", marker: "社会", title: "人的生活由结构决定到什么程度？", detail: "马克思强调生产关系与阶级，功利主义从行动后果评价制度，实用主义则把观念放回环境中的调整活动。它们都反对孤立主体，却给人的能动性留下不同空间。" },
      { id: "philosophy-task", marker: "方法", title: "哲学应建体系、改社会，还是澄清语言？", detail: "现代知识专业化后，哲学失去单一中心。谱系、政治经济学、实用实验和逻辑分析并存，分歧已不只是答案不同，而是对哲学任务本身的判断不同。" },
    ],
  },
};

export const methodAtlas = [
  { id: "natural", title: "自然假说", rule: "用更少的自然本原解释更多现象", uses: ["米利都学派", "原子论", "新科学"], stages: ["origins", "renaissance-science"] },
  { id: "deduction", title: "演绎与体系", rule: "从少数被认为可靠的起点推出整体结构", uses: ["巴门尼德", "柏拉图", "笛卡尔", "斯宾诺莎"], stages: ["origins", "athens", "early-modern"] },
  { id: "dialectic", title: "问答与辩证", rule: "通过矛盾、反方和概念区分推进认识", uses: ["苏格拉底", "经院哲学", "黑格尔"], stages: ["athens", "scholastic", "revolution-idealism"] },
  { id: "classification", title: "分类与功能", rule: "先区分事物类型，再解释各自原因和适当活动", uses: ["亚里士多德", "经院体系"], stages: ["athens", "scholastic"] },
  { id: "therapy", title: "哲学治疗", rule: "改变欲望与判断，使人能够承受不可控制的世界", uses: ["犬儒派", "伊壁鸠鲁派", "斯多葛派", "怀疑派"], stages: ["hellenistic", "roman"] },
  { id: "interpretation", title: "解释与综合", rule: "把既有经典放入新的宗教或概念体系", uses: ["奥古斯丁", "阿奎那", "伊斯兰哲学"], stages: ["patristic", "early-medieval", "scholastic"] },
  { id: "empirical", title: "经验与实验", rule: "追踪观念来源，并让主张接受观察或实践检验", uses: ["培根", "洛克", "休谟", "实用主义"], stages: ["renaissance-science", "early-modern", "industrial-modern"] },
  { id: "critique", title: "条件分析", rule: "不直接回答对象是什么，而先问认识它何以可能", uses: ["康德", "语言分析"], stages: ["revolution-idealism", "industrial-modern"] },
  { id: "genealogy", title: "历史与谱系", rule: "从生成过程追查观念、制度和价值背后的权力关系", uses: ["黑格尔", "马克思", "尼采"], stages: ["revolution-idealism", "industrial-modern"] },
];

export const longLinks = [
  { from: "毕达哥拉斯的数学—宗教秩序", to: "柏拉图的理念论", label: "改造", weight: 3 },
  { from: "柏拉图与新柏拉图主义", to: "奥古斯丁神学", label: "吸收", weight: 3 },
  { from: "斯多葛自然法与普世人性", to: "基督教伦理与近代自然权利", label: "远程传递", weight: 3 },
  { from: "亚里士多德著作", to: "伊斯兰哲学 → 拉丁经院哲学", label: "跨文明传播", weight: 3 },
  { from: "古代怀疑主义", to: "休谟的经验主义怀疑", label: "问题复活", weight: 2 },
  { from: "苏格拉底的概念追问", to: "现代逻辑与语言分析", label: "方法回声", weight: 2 },
  { from: "柏拉图式整体政治", to: "卢梭、黑格尔与国家哲学", label: "结构回声", weight: 2 },
  { from: "赫拉克利特的变化与冲突", to: "黑格尔、马克思与尼采", label: "高权重例外", weight: 1 },
];
