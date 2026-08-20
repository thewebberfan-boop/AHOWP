export type PhilosopherTimelineItem = {
  date: string;
  place: string;
  title: string;
  detail: string;
  certainty: "较可靠" | "传统记载" | "推定";
};

export type PhilosopherInquiry = {
  object: string;
  question: string;
  start: string;
  steps: string[];
  conclusion: string;
};

export type PhilosopherConcept = {
  zh: string;
  en: string;
  definition: string;
};

export type PhilosopherComparison = {
  target: string;
  relation: "直接传承" | "同题比较" | "批评关系" | "后世重构";
  shared: string;
  difference: string;
};

export type PhilosopherSource = {
  label: string;
  kind: "原书" | "补充";
  url: string;
};

export type PhilosopherProfile = {
  id: string;
  order: number;
  nameZh: string;
  nameEn: string;
  greekName: string;
  dates: string;
  active: string;
  places: string[];
  school: string;
  figureId: string;
  chapterIds: string[];
  thesis: string;
  evidenceCaution: string;
  lifeSummary: string;
  timeline: PhilosopherTimelineItem[];
  inquiries: PhilosopherInquiry[];
  concepts: PhilosopherConcept[];
  lineage: {
    inherited: string;
    school: string;
    influenced: string;
    parallel: string;
  };
  comparisons: PhilosopherComparison[];
  russellView: string;
  modernCorrection: string;
  sources: PhilosopherSource[];
};

const russellSource = (chapter: string): PhilosopherSource => ({
  label: `罗素《西方哲学史》${chapter}`,
  kind: "原书",
  url: "https://www.russell-j.com/cool/HWP_1945.pdf",
});

export const philosopherProfiles: PhilosopherProfile[] = [
  {
    id: "thales",
    order: 1,
    nameZh: "泰勒斯",
    nameEn: "Thales of Miletus",
    greekName: "Θαλῆς",
    dates: "约前 625—前 546",
    active: "约前 585 年前后",
    places: ["米利都", "爱奥尼亚", "埃及（传统记载）"],
    school: "米利都学派",
    figureId: "thales",
    chapterIds: ["b1-02"],
    thesis: "用一种自然本原解释多样世界：重要的不只是“水”这个答案，而是世界可以从世界内部得到说明。",
    evidenceCaution: "没有可确认的著作传世。我们主要通过希罗多德、亚里士多德及更晚作者认识他；具体事迹常带有“七贤”式传奇色彩。",
    lifeSummary: "泰勒斯生活在小亚细亚西岸的商业城邦米利都。这里连接爱琴海、吕底亚、埃及和巴比伦知识网络，同时经历贵族、商人和僭主之间的政治变动。古代传统把他列为“希腊七贤”之一，并赋予他天文、几何、工程和政治建议等多重身份。罗素把这种跨文化、商业性的城市环境视为米利都自然研究得以出现的重要条件。与后世留下完整著作的哲学家不同，泰勒斯更像一个由少数命题和大量见证拼成的历史起点。",
    timeline: [
      { date: "约前 625", place: "米利都", title: "出生与成长", detail: "年代由后世编年推定；身处海上贸易与多文明知识交汇的爱奥尼亚。", certainty: "推定" },
      { date: "前 585", place: "吕底亚—米底战场", title: "日食预言传统", detail: "希罗多德说他预告了发生在战争中的日食；现代研究通常怀疑他是否可能精确预报地点和日期。", certainty: "传统记载" },
      { date: "6 世纪前期", place: "米利都／埃及", title: "几何与测量活动", detail: "传说他由埃及引入几何，并用影长测量金字塔、以三角测量估算海上船距；具体归属并不确定。", certainty: "传统记载" },
      { date: "前 546 前后", place: "爱奥尼亚", title: "生命末期", detail: "吕底亚被波斯征服，米利都进入新的政治环境；传统编年常把他的去世置于这一时期。", certainty: "推定" },
    ],
    inquiries: [
      {
        object: "自然本原",
        question: "纷繁事物是否能由一种共同东西说明？",
        start: "生命、营养、种子和湿润之间似乎存在稳定联系；水又能呈现多种状态。",
        steps: ["从多样事物中寻找共同成分", "把生成理解为自然材料的变化", "不再用神祇的临时干预填补每个现象"],
        conclusion: "水被视为万物的本原。即使答案粗糙，这种解释形式已经把宇宙当作一个内在、自行运作的系统。",
      },
      {
        object: "运动与生命",
        question: "无生命的东西为什么能够产生运动？",
        start: "磁石能在没有可见推动者的情况下吸引铁。",
        steps: ["把自发运动与灵魂联系", "由磁石推测自然物具有内在动力", "将神性理解为遍布自然，而非只从外部介入"],
        conclusion: "亚里士多德转述他认为磁石有灵魂、万物充满神。这不是成熟论证，却保存了“自然自身含有运动原则”的直觉。",
      },
    ],
    concepts: [
      { zh: "本原", en: "archē", definition: "事物从何而来、由何构成并凭什么持续的第一原则。“本原”这一术语主要是亚里士多德用来整理早期思想的框架。" },
      { zh: "水", en: "water as primary stuff", definition: "既是可观察的物质，又承担统一解释的角色；重点是用较少的自然假设解释较多现象。" },
      { zh: "有灵的自然", en: "ensouled nature", definition: "自然物的运动不必总由外在人格神推动；动力可能属于事物自身。这个解释仍混合着早期神性语言。" },
    ],
    lineage: {
      inherited: "继承的是爱奥尼亚的航海测量、巴比伦天文周期与埃及实用几何，而不是一套已经成形的哲学体系。",
      school: "后世把泰勒斯、阿那克西曼德和阿那克西美尼归为米利都学派：共享自然本原、宇宙生成和非人格化解释，但未必存在严格的学校组织。",
      influenced: "阿那克西曼德延续“单一本原”的问题，却反对以已知元素作最终基础；阿那克西美尼又返回具体元素，并补上变化机制。",
      parallel: "与赫西俄德同样解释宇宙起源，却由神族谱系转向自然材料；与后来的唯物论都追问物质基础，但不能因此说近代唯物论直接源于泰勒斯。",
    },
    comparisons: [
      { target: "赫西俄德", relation: "同题比较", shared: "都试图给宇宙一个起源秩序。", difference: "赫西俄德以神的出生和冲突叙述起源；泰勒斯把解释压缩为自然材料及其变化。" },
      { target: "阿那克西曼德", relation: "直接传承", shared: "世界需要一个统一的生成原则。", difference: "泰勒斯选择可见的水；阿那克西曼德认为任何已知元素都会偏向自身，故改用无规定的“无限者”。" },
      { target: "毕达哥拉斯", relation: "同题比较", shared: "都寻找多样现象背后的统一秩序。", difference: "泰勒斯从物质与观察出发；毕达哥拉斯传统更重数、比例、灵魂与净化生活。" },
    ],
    russellView: "罗素说泰勒斯更值得作为科学家而非现代意义的哲学家受到尊重。他把“万物由水构成”当作大胆但并非愚蠢的科学假说，也反复提醒可确知材料太少。对罗素而言，真正的历史价值不在答案正确，而在这种粗糙假说能够刺激观察、争论和后续修正。",
    modernCorrection: "现代研究比罗素更谨慎地处理日食预言：前 585 年确有适合的日食，古代也确有预言记载，但泰勒斯掌握何种方法无法确定。“万物是水”同样主要经亚里士多德重构，不能当作泰勒斯留下的完整原文体系。",
    sources: [
      russellSource("第一卷第二章〈米利都学派〉"),
      { label: "Stanford Encyclopedia · Presocratic Philosophy", kind: "补充", url: "https://plato.stanford.edu/entries/presocratics/" },
      { label: "Internet Encyclopedia of Philosophy · Thales", kind: "补充", url: "https://iep.utm.edu/thales/" },
    ],
  },
  {
    id: "anaximander",
    order: 2,
    nameZh: "阿那克西曼德",
    nameEn: "Anaximander",
    greekName: "Ἀναξίμανδρος",
    dates: "约前 610—前 546",
    active: "6 世纪中叶",
    places: ["米利都", "黑海殖民网络", "斯巴达（传统记载）"],
    school: "米利都学派",
    figureId: "anaximander",
    chapterIds: ["b1-02"],
    thesis: "已知元素彼此对立，不能有任何一种无限支配其他元素；万物应从更抽象、无规定的“无限者”生成。",
    evidenceCaution: "据说写过散文著作《论自然》，现仅有一小段可能接近原文的残句。其地图、日晷和殖民活动都来自后世见证，细节不可完全确认。",
    lifeSummary: "阿那克西曼德是米利都公民，传统上被称为泰勒斯的学生或同伴。他处在吕底亚与波斯势力扩张、爱奥尼亚城邦持续殖民和航海的时期。后世称他率领过前往黑海沿岸阿波罗尼亚的殖民行动，制作过已知世界地图，并把圭表带入希腊；这些记载共同显示他的知识与实际定向、时间测量及城邦空间有关。他可能是最早用散文系统书写自然研究的希腊思想家之一，但著作本身几乎全部失传。",
    timeline: [
      { date: "约前 610", place: "米利都", title: "出生", detail: "后世编年据其前 546 年约六十四岁反推；确切年份未知。", certainty: "推定" },
      { date: "6 世纪中叶", place: "黑海沿岸", title: "殖民与地理活动", detail: "传说他领导米利都殖民者建立阿波罗尼亚，并绘制有人居住世界的地图。", certainty: "传统记载" },
      { date: "6 世纪中叶", place: "米利都／斯巴达", title: "天文测量", detail: "据说设置圭表，用影子判断时刻与季节；工具来自更早的巴比伦传统，贡献更可能是引入和应用。", certainty: "传统记载" },
      { date: "约前 546", place: "米利都", title: "《论自然》与生命末期", detail: "据推定曾以散文讨论宇宙、地理和生命起源；只有经辛普里丘转述的一段残句留存。", certainty: "推定" },
    ],
    inquiries: [
      {
        object: "第一原则",
        question: "如果元素相互对立，哪一种能够成为共同本原？",
        start: "水、火、气、土具有互相排斥的性质；若其中一种无限强大，其余早已被消灭。",
        steps: ["接受泰勒斯的单一本原问题", "比较已知元素之间的对立", "排除任何带有确定性质的元素", "把本原提升为无边界、无规定且不衰老的来源"],
        conclusion: "本原是“无限者”：它不是简单的无限空间，而是无法由现成元素限定、又能持续产生世界的根源。",
      },
      {
        object: "宇宙秩序与变化",
        question: "对立元素不断争胜，为什么世界没有崩溃？",
        start: "冷热、干湿等力量会扩张并侵占彼此，但季节和生成毁灭呈现循环。",
        steps: ["无限者内部具有永恒运动", "冷热等对立力量分离", "对立物在时间中轮流占优", "越界者通过反向变化向另一方作出补偿"],
        conclusion: "变化受时间与比例约束；“正义”不是人格神判决，而是自然系统恢复平衡的秩序。",
      },
      {
        object: "地球与生命",
        question: "地球为何不坠落，人类又怎样进入自然史？",
        start: "若地球必须由别物支撑，就会产生新的支撑问题；人类幼年期过长，似乎无法以现状独立起源。",
        steps: ["地球与各方向等距，因此无理由向一边移动", "天体环绕地球形成完整路径", "生命由受太阳作用的湿润环境产生", "早期人类曾寄生于鱼形动物，成熟后才登上陆地"],
        conclusion: "宇宙与生命都通过自然生成解释，而不是一次性的创造事件；具体模型虽错误，解释目标却高度统一。",
      },
    ],
    concepts: [
      { zh: "无限者", en: "apeiron", definition: "没有边界或确定性质、不会衰老耗尽的本原。它既避免某一元素垄断，又为无数生成过程保留来源。" },
      { zh: "对立者", en: "opposites", definition: "热与冷、干与湿等具有作用力的性质；可见世界由它们的分离、侵占与转化构成。" },
      { zh: "宇宙正义", en: "cosmic justice", definition: "对立力量依时间秩序为越界付出补偿。它把政治—伦理词汇转化为非人格化的自然规律。" },
      { zh: "无支撑地球", en: "unsupported earth", definition: "地球因与各方向等距而保持原位，不再需要海、柱或巨兽支撑；这是用对称性终止解释倒退。" },
    ],
    lineage: {
      inherited: "从泰勒斯继承“以一个自然原则解释整个宇宙”的问题，也继承米利都航海、测量与跨文化观察的实践背景。",
      school: "属于米利都自然哲学，但把具体物质假说推进到抽象原则，并第一次留下可辨认的宇宙秩序论证。",
      influenced: "阿那克西美尼保留单一本原，却认为“无限者”缺少变化机制；赫拉克利特继续使用对立与正义语言，但把冲突本身视为秩序。后来的宇宙模型也继承其无外部支撑的解释方向。",
      parallel: "与现代演化论共享“生命有自然生成史”这一问题形式，却没有遗传、选择等机制，不能把他称为现代进化论者。",
    },
    comparisons: [
      { target: "泰勒斯", relation: "直接传承", shared: "用单一本原统一解释生成世界。", difference: "泰勒斯选取水；阿那克西曼德用元素冲突论证，本原必须不等同于任何已知元素。" },
      { target: "阿那克西美尼", relation: "直接传承", shared: "宇宙从一个持续存在的来源演化。", difference: "阿那克西曼德的来源抽象但机制含混；阿那克西美尼以气的凝聚和稀释提供可观察的变化机制。" },
      { target: "赫拉克利特", relation: "同题比较", shared: "都用对立、时间和正义解释世界秩序。", difference: "阿那克西曼德把越界后的补偿视为平衡；赫拉克利特则认为张力和争斗本身就是生成秩序。" },
    ],
    russellView: "罗素明确说阿那克西曼德比泰勒斯“更有趣”。他着重重建了一个排除论证：若水、火等任何已知元素是无限的，它就会征服其他元素，因此本原必须在宇宙冲突中保持中性。罗素也赞赏其无创造论的宇宙演化、动物起源假说、地图和科学好奇心，评价他“原创处都是科学而理性的”。",
    modernCorrection: "“无限者”究竟指空间无限、时间不尽、性质未定还是不可经验，仍有争议。现存残句的边界也不确定。地图、圭表和殖民领导等事迹应写作古代传统，而不应像完整履历一样陈述；但这些传统可靠地反映了后人眼中他兼具宇宙论与测量实践的形象。",
    sources: [
      russellSource("第一卷第二章〈米利都学派〉"),
      { label: "Stanford Encyclopedia · Presocratic Philosophy", kind: "补充", url: "https://plato.stanford.edu/entries/presocratics/" },
      { label: "Internet Encyclopedia of Philosophy · Anaximander", kind: "补充", url: "https://iep.utm.edu/anaximander/" },
    ],
  },
  {
    id: "anaximenes",
    order: 3,
    nameZh: "阿那克西美尼",
    nameEn: "Anaximenes of Miletus",
    greekName: "Ἀναξιμένης",
    dates: "约前 586—前 528",
    active: "6 世纪中叶",
    places: ["米利都", "爱奥尼亚"],
    school: "米利都学派",
    figureId: "anaximenes",
    chapterIds: ["b1-02"],
    thesis: "以气为统一材料，以稀释和凝聚为变化机制：性质差异可以由连续、定量的过程产生。",
    evidenceCaution: "生平几乎空白，年代也来自后世推定。著作没有保存，哲学主要经泰奥弗拉斯托斯传统和晚期摘述重建。",
    lifeSummary: "阿那克西美尼是米利都三人组中最晚的一位，通常被说成阿那克西曼德的同伴或学生。他活动时的爱奥尼亚正承受吕底亚覆灭、波斯统治和城邦紧张；罗素只敢断言他晚于阿那克西曼德，并早于前 494 年波斯镇压爱奥尼亚起义时米利都被毁。关于旅行、政治活动和私人交往，没有足够材料可写。其历史位置主要由理论显示：他既不满足于泰勒斯只有“材料答案”，也不满足于阿那克西曼德过于抽象的来源，而要说明同一种材料怎样连续变成可见世界。",
    timeline: [
      { date: "约前 586", place: "米利都", title: "出生", detail: "传统年代差异较大；较稳妥的说法只是他活跃于前六世纪中叶。", certainty: "推定" },
      { date: "前 550 前后", place: "米利都", title: "与阿那克西曼德的学术关系", detail: "泰奥弗拉斯托斯传统称他是阿那克西曼德的同伴或学生；严格师承无法证实。", certainty: "传统记载" },
      { date: "6 世纪中叶", place: "米利都", title: "自然论写作", detail: "据说用朴素爱奥尼亚散文写作，集中讨论气、物质变化、气象和宇宙形成；文本已失。", certainty: "传统记载" },
      { date: "前 528 前后", place: "米利都", title: "去世", detail: "常见年代来自后世编年；可以确认的相对关系是其活动早于前 494 年米利都毁灭。", certainty: "推定" },
    ],
    inquiries: [
      {
        object: "本原与生命",
        question: "哪种本原既无处不在，又能解释生命和宇宙的统一？",
        start: "气通常不可见、范围难定，却以呼吸维持生命；它比水更普遍，又比“无限者”更可经验。",
        steps: ["选取遍布环境的气作为材料", "以呼吸—灵魂维持身体作类比", "把同一关系扩大到气包围并维持整个宇宙"],
        conclusion: "气既是万物材料，也是世界保持整体的生命性原则；自然与生命仍处于同一解释层。",
      },
      {
        object: "物质变化",
        question: "同一种材料怎样产生火、水、土和石等相反性质？",
        start: "空气受压、吹拂、蒸发和结露会呈现冷热、疏密变化；毛毡制作也展示压缩产生新性质。",
        steps: ["稀释使气变为火", "逐步凝聚使气成为风、云、水", "继续凝聚成为土与石", "用疏密程度把多种物质排入连续序列"],
        conclusion: "可见的性质差异来自稀释和凝聚的数量差异。这是米利都学派第一次较明确地给出变化机制。",
      },
      {
        object: "宇宙与气象",
        question: "天地和常见气象能否使用同一机制解释？",
        start: "若气的疏密过程普遍有效，就不应只解释少数物质。",
        steps: ["凝聚的气形成扁平大地", "大地像叶片一样由气托住", "太阳、月亮和星体由稀薄或燃烧物形成", "云、雨、雹、雪同样按凝聚程度说明"],
        conclusion: "一个低成本机制跨越物质、气象和宇宙领域；模型错误，但解释具有可重复性和统一性。",
      },
    ],
    concepts: [
      { zh: "气", en: "aēr", definition: "无处不在、通常不可见又能成为呼吸的基本材料；兼有可观察性与近似无限的范围。" },
      { zh: "稀释", en: "rarefaction", definition: "气变得更疏、更热并趋向火的过程；把质的变化解释为密度下降。" },
      { zh: "凝聚", en: "condensation", definition: "气依次成为风、云、水、土、石的连续压缩过程；把多种材料排列在同一尺度上。" },
      { zh: "呼吸类比", en: "breath analogy", definition: "人的灵魂作为气维持身体，宇宙之气也包围并维持世界。它连接个体生命经验与整体宇宙论。" },
    ],
    lineage: {
      inherited: "接受泰勒斯的物质一元论和阿那克西曼德的宇宙生成问题；其气同时吸收了“具体元素”与“范围无定”两种要求。",
      school: "作为米利都学派第三人，他最突出的贡献不是换了一个本原名称，而是提供稀释—凝聚这一可复用机制。",
      influenced: "其连续物质转化影响后来的赫拉克利特、阿那克萨哥拉、阿波罗尼亚的第欧根尼及古代医学气论。罗素还说他影响了毕达哥拉斯，并指出原子论者沿用其圆盘形地球。",
      parallel: "与近代以压力、密度解释相变的科学共享“用定量变化说明性质差异”的结构，但他没有实验测量、微观理论或守恒定律。",
    },
    comparisons: [
      { target: "泰勒斯", relation: "直接传承", shared: "以一种可经验材料统一自然。", difference: "泰勒斯主要给出水这一答案；阿那克西美尼进一步说明材料如何沿连续过程发生转化。" },
      { target: "阿那克西曼德", relation: "直接传承", shared: "世界从单一、持续的来源自然演化。", difference: "阿那克西曼德用无规定来源避免元素偏向；阿那克西美尼用气兼顾中性、可见证据和变化机制。" },
      { target: "赫拉克利特", relation: "同题比较", shared: "都把世界看成一种材料的持续转化。", difference: "阿那克西美尼以疏密序列解释物质；赫拉克利特以火、交换、对立张力解释更普遍的过程秩序。" },
    ],
    russellView: "罗素认为阿那克西美尼不如阿那克西曼德有趣，却承认他取得了重要进展：火是稀释的气，气凝聚后依次成为水、土、石，因此物质之间的差异被处理为凝聚程度的数量差异。罗素同时提醒，古代人对他的评价反而高于阿那克西曼德，说明哲学史中的重要性排序本身会变化。",
    modernCorrection: "罗素把理论概括为“差异完全是数量的”，便于理解但略显现代化。更稳妥的说法是：阿那克西美尼首次留下了以疏密过程统一解释质变的清晰见证。吹气冷热的观察是否真是他的论证，以及具体宇宙模型的归属，仍需保留证据等级。",
    sources: [
      russellSource("第一卷第二章〈米利都学派〉"),
      { label: "Stanford Encyclopedia · Presocratic Philosophy", kind: "补充", url: "https://plato.stanford.edu/entries/presocratics/" },
      { label: "Internet Encyclopedia of Philosophy · Anaximenes", kind: "补充", url: "https://iep.utm.edu/anaximenes/" },
    ],
  },
  {
    id: "pythagoras",
    order: 4,
    nameZh: "毕达哥拉斯",
    nameEn: "Pythagoras",
    greekName: "Πυθαγόρας",
    dates: "约前 570—前 490",
    active: "约前 530—前 500",
    places: ["萨摩斯", "克罗顿", "梅塔蓬图姆"],
    school: "毕达哥拉斯传统",
    figureId: "pythagoras",
    chapterIds: ["b1-03"],
    thesis: "哲学不只是解释世界，也是一种净化灵魂的共同生活；数与和谐后来成为这条传统理解宇宙秩序的核心语言。",
    evidenceCaution: "毕达哥拉斯本人没有留下著作，早期见证稀少，完整传记晚出数百年。灵魂轮回与生活规则较可能属于本人；“万物是数”、定理和完整宇宙论多半属于后来的学派。",
    lifeSummary: "毕达哥拉斯出生于爱琴海的萨摩斯岛，约四十岁时迁往南意大利的克罗顿。罗素把迁徙放在僭主波利克拉底统治和萨摩斯—米利都商业竞争中理解；现代研究可以确认迁居克罗顿，却不能确认所有政治动机与埃及旅行。他在那里建立以饮食禁忌、仪式、自律和共同生活为特点的团体，吸引男女追随者，并可能卷入南意大利城邦政治。反毕达哥拉斯运动后来攻击这些团体；传统称他最终逃往梅塔蓬图姆并在那里去世。",
    timeline: [
      { date: "约前 570", place: "萨摩斯", title: "出生", detail: "出生于富裕而航海活跃的岛屿城邦；父亲与早年经历的记载互相冲突。", certainty: "推定" },
      { date: "约前 530", place: "萨摩斯 → 克罗顿", title: "迁往南意大利", detail: "约四十岁移居克罗顿并开始主要活动；罗素认为他厌恶波利克拉底的僭政。", certainty: "较可靠" },
      { date: "前 530—500", place: "克罗顿", title: "建立共同体", detail: "团体以灵魂命运、宗教仪式、饮食纪律和共同生活闻名，并对当地政治产生影响。", certainty: "较可靠" },
      { date: "约前 500—490", place: "克罗顿／梅塔蓬图姆", title: "政治反扑与去世", detail: "南意大利发生反毕达哥拉斯运动；个人逃亡与死亡细节来自较晚传统。", certainty: "传统记载" },
    ],
    inquiries: [
      {
        object: "灵魂与生活方式",
        question: "人的灵魂如何摆脱死亡与反复投生的循环？",
        start: "灵魂并不随身体死亡，而会进入其他人或动物；所有有生命者因此具有亲缘关系。",
        steps: ["承认灵魂不朽与轮回", "把日常饮食、仪式和欲望纳入灵魂后果", "以记忆、自律和群体规则净化生活", "把哲学变成持续操练而非单次知识"],
        conclusion: "好生活的目标是改善灵魂命运。哲学首次鲜明地成为一种可加入、可实践、可传承的生活制度。",
      },
      {
        object: "数、音乐与秩序",
        question: "为什么感性和谐能够由精确关系表达？",
        start: "音乐协和与简单整数比之间存在稳定联系；几何证明又呈现不依赖个别观察的确定性。",
        steps: ["从和弦与比例发现可重复关系", "把数视为结构而非只用于计数", "由局部比例推想宇宙也有和谐秩序", "把数学沉思解释为灵魂净化的最高活动"],
        conclusion: "在毕达哥拉斯传统中，真实秩序更接近数、比例和形式。必须注意：这一完整推导主要属于后世学派，不能全部归给本人。",
      },
      {
        object: "知识与人生等级",
        question: "求知是控制世界的工具，还是一种独立的生活价值？",
        start: "观看竞技者既不交易也不争胜，只为理解发生了什么。",
        steps: ["区分逐利者、竞争者和观看者", "把无利害的观看提升为沉思", "把沉思与数学的确定、和谐相连", "让理论生活获得高于政治行动的地位"],
        conclusion: "罗素据此解释西方传统中“理论高于实践、理性高于感官”的长久倾向，并同时批评它带来的形而上学偏见。",
      },
    ],
    concepts: [
      { zh: "灵魂轮回", en: "metempsychosis", definition: "灵魂在不同生命形态中迁移；生命共同亲缘、饮食禁忌与净化实践由此获得统一理由。" },
      { zh: "毕达哥拉斯式生活", en: "Pythagorean way of life", definition: "由共同体、仪式、饮食、自律和学习构成的生活方案；比任何单条数学命题更可靠地属于早期传统。" },
      { zh: "和谐", en: "harmonia", definition: "不同部分依比例结合形成秩序。音乐中的整数关系使“可听见的美”与“可理解的数”发生连接。" },
      { zh: "理论／沉思", en: "theōria", definition: "以理解而非利益或竞争为目的的观看生活。罗素把它视为数学、哲学和后来神学共同抬高的理想。" },
    ],
    lineage: {
      inherited: "罗素强调俄耳甫斯宗教的净化、轮回和共同体传统；也提到南意大利与爱奥尼亚知识交流。现代研究对具体借用关系更谨慎。",
      school: "“毕达哥拉斯主义”跨越多个世纪。早期宗教生活、五世纪菲洛劳斯的宇宙论、阿尔库塔斯的数学不能无差别地写回创始人。",
      influenced: "菲洛劳斯与阿尔库塔斯把传统发展为数学宇宙论；柏拉图吸收数、形式、灵魂与沉思理想，经他影响新柏拉图主义和基督教哲学。",
      parallel: "与米利都学派同样追求宇宙统一，却把稳定性放在形式关系而非物质本原；与后世宗教修会共享生活纪律，但不存在简单直接的组织继承。",
    },
    comparisons: [
      { target: "米利都学派", relation: "同题比较", shared: "都寻找现象背后的统一秩序。", difference: "米利都从可观察物质与生成机制出发；毕达哥拉斯传统把数、灵魂和净化生活放到中心。" },
      { target: "赫拉克利特", relation: "批评关系", shared: "都认为零散见闻不足以构成智慧。", difference: "赫拉克利特点名批评毕达哥拉斯“多闻而无理解”；他以逻各斯和对立秩序取代知识收藏与宗教权威。" },
      { target: "柏拉图", relation: "直接传承", shared: "数学训练、灵魂不朽和超越感官的秩序。", difference: "柏拉图用理念论、辩证法和政治哲学重组这些资源，不能把成熟柏拉图体系倒推给毕达哥拉斯。" },
    ],
    russellView: "罗素把毕达哥拉斯称为思想史上影响最巨大的人之一：演绎数学、神秘主义与沉思伦理在他身上结合，使数学确定性成为哲学的理想。罗素一方面赞赏纯数学和无利害求知，另一方面认为由此产生了“思想高于感官”的错误形而上学倾向。他的叙述极有结构力量，但把很多后世学派成就集中到个人名下。",
    modernCorrection: "现代研究把“毕达哥拉斯问题”放在首位：较早证据能支持灵魂轮回、仪式专家和严格生活方式，却没有证据证明本人提出勾股定理、建立成熟数学证明体系或完整宣称“万物是数”。页面因此保留罗素的影响史判断，同时把个人、早期共同体和后世学派分层。",
    sources: [
      russellSource("第一卷第三章〈毕达哥拉斯〉"),
      { label: "Stanford Encyclopedia · Pythagoras", kind: "补充", url: "https://plato.stanford.edu/entries/pythagoras/" },
      { label: "Internet Encyclopedia · Presocratics / Pythagoras", kind: "补充", url: "https://iep.utm.edu/presocra/" },
    ],
  },
  {
    id: "heraclitus",
    order: 5,
    nameZh: "赫拉克利特",
    nameEn: "Heraclitus of Ephesus",
    greekName: "Ἡράκλειτος",
    dates: "约前 540—前 480",
    active: "约前 500 年前后",
    places: ["以弗所", "爱奥尼亚"],
    school: "爱奥尼亚哲学／独立思想家",
    figureId: "heraclitus",
    chapterIds: ["b1-04"],
    thesis: "世界的稳定不是排除变化，而是由受逻各斯约束的转化和对立张力维持；有些事物正因为持续更新才能保持同一。",
    evidenceCaution: "生平轶事大多是后人从格言反推的传说。作品只以约百余条残篇保存，语句刻意含混；“万物流变”等著名标签也主要经过柏拉图和后世解释。",
    lifeSummary: "赫拉克利特生活在爱奥尼亚城邦以弗所，约于前 500 年前后活跃。该城位于波斯帝国西缘，拥有古老贵族、公共祭祀和商业网络。罗素只较有把握地说他是以弗所的贵族公民；关于他让出世袭职位、隐居山中和特殊死法的故事都很晚。他的残篇提到城邦放逐赫尔摩多罗斯，并表现出对群众政治、诗人和前辈知识权威的强烈蔑视。作品可能曾作为一部散文书流传，但我们只能通过其他作者的引用重建其排列和论证。",
    timeline: [
      { date: "约前 540", place: "以弗所", title: "出生于贵族家庭", detail: "家世与具体年份来自后世传统；贵族背景与其残篇中的政治语气相符，但不可写成完整履历。", certainty: "推定" },
      { date: "6 世纪末", place: "以弗所", title: "城邦政治冲突", detail: "残篇谴责公民放逐赫尔摩多罗斯，显示他与民主多数及地方政治发生尖锐冲突。", certainty: "较可靠" },
      { date: "约前 500", place: "以弗所", title: "著作与思想活动", detail: "写作涉及宇宙、知识、伦理和政治，以格言、悖论、双关和意象迫使读者主动理解。", certainty: "较可靠" },
      { date: "5 世纪初", place: "以弗所 → 雅典（思想传播）", title: "克拉底鲁传播其思想", detail: "克拉底鲁把极端流变解释带到雅典，影响青年柏拉图；这已是接受史而非赫拉克利特本人生平。", certainty: "传统记载" },
    ],
    inquiries: [
      {
        object: "变化与同一",
        question: "如果组成材料不断替换，一个事物为何仍能保持自身？",
        start: "河流、火焰和生命都持续更换材料，却能维持可识别的结构。",
        steps: ["观察材料的连续流入与流出", "区分低层材料与高层关系结构", "把变化理解为维持结构的必要条件", "以尺度和交换说明过程不会任意失控"],
        conclusion: "同一与变化并非简单互斥：河流之所以仍是那条河，恰因为新水持续流入。赫拉克利特不必被理解为“一切都乱变”。",
      },
      {
        object: "对立与秩序",
        question: "冲突为什么不只破坏秩序，反而能够构成秩序？",
        start: "弓与琴依靠反向拉力保持功能；昼夜、醒睡、冷热也通过互换被理解。",
        steps: ["对立项互相规定意义", "它们在不同时间、对象或角度出现", "张力产生运动、功能与和谐", "没有对立，世界只剩无差别的静止"],
        conclusion: "对立者不是逻辑上同时同义，而是在一个转换系统中相互依赖。“争斗”是结构关系，不只是政治暴力的赞美。",
      },
      {
        object: "知识与逻各斯",
        question: "人怎样从零散经验进入对整体秩序的理解？",
        start: "多数人拥有见闻、诗歌和仪式，却像睡着一样只生活在私人世界。",
        steps: ["感官提供材料但不自动给出理解", "寻找在众多变化中共同有效的说明", "按每一事物的本性区分并连接", "让个人判断服从共同的逻各斯"],
        conclusion: "智慧不是知道很多，而是把经验组织成一个共同、可说明的秩序。其格言写法本身就是让读者完成连接的训练。",
      },
    ],
    concepts: [
      { zh: "逻各斯", en: "logos", definition: "兼有言说、说明、比例和共同秩序之意。它不是赫拉克利特私人意见，而是人可能理解却经常忽略的世界结构。" },
      { zh: "流变", en: "flux", definition: "事物材料与状态持续转化。现代解释强调：变化并非摧毁一切稳定，有些稳定正由规律更新维持。" },
      { zh: "对立统一", en: "unity of opposites", definition: "对立状态在时间、关系和功能系统中互相依存，不等于同一事物在同一方面同时具有矛盾性质。" },
      { zh: "火与交换", en: "fire and exchange", definition: "火既是元素意象，也是转化过程的模型；万物按尺度交换，整体数量和秩序在变化中保持。" },
      { zh: "争斗", en: "strife", definition: "差异力量的张力与轮替，是生成多样性和功能秩序的条件。罗素把它连接到黑格尔辩证法的远源。" },
    ],
    lineage: {
      inherited: "延续米利都学派对自然内部秩序的追问，也继承阿那克西曼德的对立与宇宙正义语言；但他把讨论扩展到知识、伦理和政治。",
      school: "没有证据表明他建立了制度化学派。后来的“赫拉克利特派”主要由接受者构成，克拉底鲁的极端流变也不能自动等同于本人。",
      influenced: "克拉底鲁把其思想带给柏拉图；柏拉图用流变解释感性世界，斯多葛派吸收火、逻各斯和宇宙秩序。黑格尔及现代过程哲学又把他重构为变化与对立的先驱。",
      parallel: "巴门尼德同样追问变化、存在和可靠知识，却从“不可思者不可存在”走向不变存在；两人常被并列为同一问题的极端答案，直接互相影响并无定论。",
    },
    comparisons: [
      { target: "阿那克西曼德", relation: "同题比较", shared: "对立力量和尺度共同形成宇宙秩序。", difference: "阿那克西曼德把越界视为需补偿的不正义；赫拉克利特更激进地说争斗本身就是正义与生成条件。" },
      { target: "巴门尼德", relation: "同题比较", shared: "都不满足于感官表面，要求理性说明变化与存在。", difference: "赫拉克利特在转换关系中寻找稳定；巴门尼德以存在的可思性排除真正的生成和消灭。" },
      { target: "克拉底鲁／柏拉图", relation: "后世重构", shared: "感性事物处于变化之中。", difference: "克拉底鲁把流变推向无法稳定命名；柏拉图再以不变理念补足知识对象，这未必是赫拉克利特本人的结论。" },
      { target: "黑格尔", relation: "后世重构", shared: "对立不是外部事故，而参与构成发展。", difference: "黑格尔建立概念辩证体系与历史逻辑；赫拉克利特留下的是格言式的宇宙、伦理和认识论联系。" },
    ],
    russellView: "罗素把赫拉克利特描述为贵族式、骄傲而带有神秘主义色彩的思想家。他依次突出火、流变、对立融合和宇宙正义，并认为其中含有黑格尔哲学的萌芽。罗素尤其关心变化为什么令人寻求永恒，由此把赫拉克利特放进西方哲学“时间世界与永恒世界”的长期张力中。",
    modernCorrection: "罗素沿用柏拉图以来“普遍流变”的强解释，也倾向把火当作与泰勒斯之水相似的基本物质。现代研究提出更细的读法：河流通过材料更新保持结构；对立项在不同关系和时间中相连，并非违反不矛盾律；火可能更重要地表示受尺度约束的交换过程。",
    sources: [
      russellSource("第一卷第四章〈赫拉克利特〉"),
      { label: "Stanford Encyclopedia · Heraclitus", kind: "补充", url: "https://plato.stanford.edu/entries/heraclitus/" },
      { label: "Internet Encyclopedia of Philosophy · Heraclitus", kind: "补充", url: "https://iep.utm.edu/heraclit/" },
    ],
  },
];

export const philosopherById = Object.fromEntries(philosopherProfiles.map((profile) => [profile.id, profile]));
