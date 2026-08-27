export type ProblemNodeKind = "观察" | "问题" | "答案";
export type ProblemAnswerRole = "提出" | "区分" | "反驳" | "修复" | "转向" | "综合";
export type ProblemRelationKind = "提出问题" | "回应问题" | "产生问题";
export type ProblemConnectionKind = "原书线索" | "历史回应" | "同题并列" | "本站推演" | "后世重构";

export type ProblemParticipant = {
  name: string;
  philosopherId?: string;
  role: string;
};

export type ProblemGraphPosition = {
  row: number;
  lane: number;
};

export type ProblemNode = {
  id: string;
  kind: ProblemNodeKind;
  answerRole?: ProblemAnswerRole;
  title: string;
  summary: string;
  pressure: string;
  consequence: string;
  participants: ProblemParticipant[];
  chapterIds: string[];
  graph: ProblemGraphPosition;
};

export type ProblemEdge = {
  id: string;
  from: string;
  to: string;
  relation: ProblemRelationKind;
  label: string;
  connection: ProblemConnectionKind;
};

export type ProblemPhase = {
  id: string;
  order: number;
  label: string;
  title: string;
  question: string;
  transition: string;
  nodes: ProblemNode[];
};

export type ProblemMapSource = {
  label: string;
  url: string;
  note: string;
};

export type ProblemMap = {
  id: string;
  title: string;
  english: string;
  period: string;
  thesis: string;
  scopeNote: string;
  phases: ProblemPhase[];
  edges: ProblemEdge[];
  sources: ProblemMapSource[];
};

export const problemConnectionNotes: Record<ProblemConnectionKind, string> = {
  原书线索: "罗素原书的章节安排或评价提供了这一步的叙述线索。",
  历史回应: "有较强理由把它理解为对既有困难的历史性回应。",
  同题并列: "思想家处理的是相近问题，但不据此主张直接影响。",
  本站推演: "为降低理解成本而建立的逻辑连接，不冒充思想家本人的明确论证。",
  后世重构: "使用后来的概念重新看见早期问题，须防止把术语倒灌给古人。",
};

export const problemRelationNotes: Record<ProblemRelationKind, string> = {
  提出问题: "观察使一个尚未由既有答案产生的困难变得可追问。",
  回应问题: "答案尝试回应问题；同一问题可以有多个并列答案。",
  产生问题: "答案解决部分困难，同时留下限制、矛盾或新的解释负担。",
};

export const ancientDifferenceProblemMap: ProblemMap = {
  id: "difference-change-knowledge",
  title: "从多样、变化与秩序到可知的形式",
  english: "OBSERVATION → QUESTION → ANSWER → NEW QUESTION",
  period: "第一卷试验谱系 · 泰勒斯至柏拉图",
  thesis: "先区分并存的多样与时间中的变化，再从变化的事件关联、持续和周期模式提出交叉问题，追踪它们怎样获得多个答案并共同制造新的问题。",
  scopeNote: "这不是一条被古代作者共同承认的师承路线。图中只有观察、问题和答案三类节点；人物作为参与者附着其上。连线同时说明逻辑作用与证据性质，不把本站为了学习建立的连接冒充直接影响。",
  phases: [
    {
      id: "encounter-difference",
      order: 1,
      label: "经验起点",
      title: "把并存的多样与时间中的变化拆开",
      question: "多样的来源、变化的过程与同一、持续秩序，分别要求怎样的解释？",
      transition: "入口只保留两个基础观察；事件关联与周期次序是变化的经验模式，不与多样、变化并列成同级入口。",
      nodes: [
        {
          id: "difference-as-observation",
          kind: "观察",
          title: "同一时刻，世界包含彼此不同的事物与性质",
          summary: "石头、植物、火焰和水彼此不同；同一环境中也同时出现冷与热、干与湿、轻与重等性质。这里首先记录并存的多样性，不预设它来自一种还是多种本原。",
          pressure: "仅仅列举差异，不能说明这些差异是否共享来源、怎样组成同一个世界。",
          consequence: "观察提出多样的来源问题，也让“多个事物是否真正可能”成为后续压力。",
          participants: [],
          chapterIds: ["b1-02", "b1-03", "b1-04"],
          graph: { row: 0, lane: 1 },
        },
        {
          id: "change-over-time-observation",
          kind: "观察",
          title: "同一事物会在时间中呈现不同状态",
          summary: "种子长成植物，水受热改变状态，人从清醒进入睡眠。某些变化紧随可辨认的作用或条件发生，另一些则持续、重复或周期出现；两种模式可以重叠，都是时间变化的具体表现。",
          pressure: "若一切性质都改变，凭什么说改变前后仍是同一事物？事件关联还需要说明作用怎样传递，周期变化则需要说明没有单一触发时为何仍能持续并保持次序。",
          consequence: "这一观察同时提出变化中的同一、变化如何启动和持续、次序如何维持，以及运动在概念上是否成立等问题。",
          participants: [],
          chapterIds: ["b1-02", "b1-04", "b1-05", "b1-06", "b1-09"],
          graph: { row: 0, lane: 3 },
        },
        {
          id: "difference-derived-or-original",
          kind: "问题",
          title: "多样来自共同来源，还是原本就有多个要素？",
          summary: "如果许多事物来自同一来源，就要说明统一来源怎样产生差异；如果差异原本就有多个要素，又要说明多个要素为什么形成一个世界。",
          pressure: "给本原命名只能提出候选来源，不能独自解释多样怎样出现并保持。",
          consequence: "问题向一种基础来源、从无定者分出对立、由气连续变形三种米利都答案开放；比例和逻各斯则主要回答秩序问题。",
          participants: [],
          chapterIds: ["b1-02", "b1-03", "b1-04", "b1-06"],
          graph: { row: 1, lane: 0.5 },
        },
        {
          id: "identity-through-change",
          kind: "问题",
          title: "变化通过什么过程发生，又如何保留同一？",
          summary: "变化要求前后状态不同，识别变化又要求把这些状态归给同一对象。问题因此同时追问：改变以什么过程发生，材料、结构、关系或持续活动中又有什么使前后仍可联系。",
          pressure: "若只有触发事件而没有变化机制，就不能说明作用怎样成为结果；若不说明同一性的根据，“某物改变”又可能退化为一个事物消失、另一个出现。",
          consequence: "问题向连续程度变化与以持续过程维持同一两种主要答案开放。",
          participants: [],
          chapterIds: ["b1-02", "b1-04", "b1-05"],
          graph: { row: 1, lane: 2 },
        },
        {
          id: "order-not-arbitrary-agency",
          kind: "问题",
          title: "为什么变化呈现稳定次序，而不是任意发生？",
          summary: "早期自然哲学没有简单排除神圣，却开始把季节、天体和生成消灭理解成世界内部可以说明的次序，而不只诉诸一次性的行动者。",
          pressure: "重复与周期不等于现代意义的“自然规律”；它们首先要求说明次序、尺度和可理解性从何而来。",
          consequence: "问题可以获得时间平衡、连续机制、数与比例、逻各斯与对立秩序等不同答案。",
          participants: [],
          chapterIds: ["b1-02", "b1-03", "b1-04"],
          graph: { row: 1, lane: 3.5 },
        },
      ],
    },
    {
      id: "generate-difference",
      order: 2,
      label: "自然解释",
      title: "用世界内部的来源、过程与秩序回答",
      question: "多样与变化能否由自然自身得到说明？",
      transition: "这些答案回应多个上游问题，彼此不是一条单线演进；同一答案也可能同时说明来源、动力和秩序。",
      nodes: [
        {
          id: "one-source-many-states",
          kind: "答案",
          answerRole: "提出",
          title: "以一种基础来源统一自然的多样",
          summary: "关于泰勒斯的可靠材料极少；亚里士多德把水解释为他的第一原理。可以谨慎地说，这一路线尝试让自然现象由自然内部的一种基础来源得到统一。",
          pressure: "它首先回答“多样是否同源”，但不能据现存材料替泰勒斯补出成熟的状态转换理论。",
          consequence: "一种来源怎样真正形成多种事物，仍成为生成问题。",
          participants: [{ name: "泰勒斯", philosopherId: "thales", role: "以水作为自然统一来源的传统起点" }],
          chapterIds: ["b1-02"],
          graph: { row: 2, lane: 0 },
        },
        {
          id: "opposites-and-process",
          kind: "答案",
          answerRole: "提出",
          title: "对立从无定者中分出，并按时间恢复平衡",
          summary: "阿那克西曼德让热与冷等对立力量从无定者中分出；事物依时间秩序彼此补偿，季节、天体运行和生成消灭因此构成世界内部的循环系统。",
          pressure: "它不只给出来源，还试图说明多样、变化和反复次序怎样属于同一个自然过程。",
          consequence: "分出与复归仍留下生成在逻辑上能否成立的问题。",
          participants: [{ name: "阿那克西曼德", philosopherId: "anaximander", role: "以无定者、对立力量和时间秩序组织自然" }],
          chapterIds: ["b1-02"],
          graph: { row: 2, lane: 1 },
        },
        {
          id: "rarefaction-condensation",
          kind: "答案",
          answerRole: "提出",
          title: "气通过稀薄与凝聚连续变形",
          summary: "阿那克西美尼以气为基础来源，并用稀薄和凝聚说明火、风、云、水、土与石的连续序列；冷热也与这一过程联系。",
          pressure: "它把“来自同一来源”推进为一个可以用程度差异理解的变化机制。",
          consequence: "连续机制说明了怎样变化，却仍要面对生成、同一与存在之间的逻辑压力。",
          participants: [{ name: "阿那克西美尼", philosopherId: "anaximenes", role: "以稀薄和凝聚说明连续变化" }],
          chapterIds: ["b1-02"],
          graph: { row: 2, lane: 2 },
        },
        {
          id: "difference-as-ratio",
          kind: "答案",
          answerRole: "提出",
          title: "数与比例使差异和秩序可以理解",
          summary: "毕达哥拉斯传统从音程与数的关系发展出数学秩序的方向；完整的数学宇宙论主要属于后来的毕达哥拉斯学派，不能无保留地归给毕达哥拉斯本人。",
          pressure: "只列举材料不能解释音程、结构和天体次序为何可以通过比例理解。",
          consequence: "“由什么构成”之外，出现了“按什么关系组织”以及这种结构如何成为知识对象的问题。",
          participants: [{ name: "毕达哥拉斯", philosopherId: "pythagoras", role: "代表数、比例与宇宙秩序的传统起点" }],
          chapterIds: ["b1-03", "b1-13"],
          graph: { row: 2, lane: 3 },
        },
        {
          id: "change-as-order",
          kind: "答案",
          answerRole: "区分",
          title: "对立转换本身构成持续的世界秩序",
          summary: "赫拉克利特把对立状态、持续转换与逻各斯联系起来。河流、火焰和生命显示：某些事物不是排除变化才保持，而是在有次序的变化中持续。",
          pressure: "它同时回应变化中的同一、动力与秩序，但不能被简化成“任何事物在任何方面都不断变化”。",
          consequence: "变化成为秩序的一部分，也使生成、存在和同一能否同时成立更加尖锐。",
          participants: [{ name: "赫拉克利特", philosopherId: "heraclitus", role: "以逻各斯和对立连接变化与秩序" }],
          chapterIds: ["b1-04", "b1-13"],
          graph: { row: 2, lane: 4 },
        },
      ],
    },
    {
      id: "eleatic-pressure",
      order: 3,
      label: "逻辑压力",
      title: "变化在逻辑上是否可能",
      question: "生成、运动与多个事物会不会要求我们谈论不存在？",
      transition: "埃利亚路线不是补充另一种自然机制，而是检查此前答案所使用的“生成”和“运动”是否说得通。",
      nodes: [
        {
          id: "being-from-nonbeing",
          kind: "问题",
          title: "生成是否意味着存在从不存在中出现？",
          summary: "若某物真的成为它原本不是的东西，新的存在从哪里来？谈论和思考一个完全不存在的起点是否可能？",
          pressure: "此前答案描述了变化过程，却没有先说明产生和消灭在逻辑上是否成立。",
          consequence: "问题要求一种不依赖从无到有的存在说明。",
          participants: [],
          chapterIds: ["b1-05"],
          graph: { row: 3, lane: 1 },
        },
        {
          id: "motion-and-plurality-possible",
          kind: "问题",
          title: "运动和多个事物在概念上可能吗？",
          summary: "经验似乎直接给出运动和多个对象，但连续、分割和路径一旦被严格分析，常识是否仍然自洽？",
          pressure: "“我们明明看见运动”不能独自回答无限分割和多个对象如何成立。",
          consequence: "问题同时获得巴门尼德式否定和芝诺式压力测试。",
          participants: [],
          chapterIds: ["b1-05"],
          graph: { row: 3, lane: 3 },
        },
        {
          id: "stable-being",
          kind: "答案",
          answerRole: "提出",
          title: "真正的存在必须保持同一",
          summary: "在严格解释中，真正存在不生不灭、不分割、不运动；日常经验中的多样和变化不能未经检验地充当最终实在。",
          pressure: "它保存了存在的可思与同一，却扩大了理性与经验之间的裂缝。",
          consequence: "若基本存在不变，可见变化必须被重新解释。",
          participants: [{ name: "巴门尼德", philosopherId: "parmenides", role: "把自然问题改写为存在条件问题" }],
          chapterIds: ["b1-05", "b1-15", "b1-18"],
          graph: { row: 4, lane: 1 },
        },
        {
          id: "test-motion-and-plurality",
          kind: "答案",
          answerRole: "反驳",
          title: "以悖论检验运动与多样",
          summary: "埃利亚的芝诺用悖论迫使对手说明连续、分割、多个对象和运动怎样同时成立，而不是把常识当作无需论证的答案。",
          pressure: "悖论没有提供一套完整自然理论，却提高了任何变化理论必须承受的概念精度。",
          consequence: "保存变化的答案必须让基本存在稳定，同时重写可见生成。",
          participants: [{ name: "埃利亚的芝诺", role: "以悖论检验运动与多样" }],
          chapterIds: ["b1-05"],
          graph: { row: 4, lane: 3 },
        },
      ],
    },
    {
      id: "preserve-and-recombine",
      order: 4,
      label: "多元修复",
      title: "保存存在，重写变化",
      question: "如果基本存在不生成也不消灭，可见世界还能怎样变化？",
      transition: "同一个新问题产生三种并列答案：基本构成保持不变，变化转由结合、分离、位置或比例承担。",
      nodes: [
        {
          id: "change-as-reconfiguration",
          kind: "问题",
          title: "不变的构成怎样形成变化的世界？",
          summary: "如果接受基本存在不能从无到有，就要说明原有构成怎样形成新整体，又怎样在整体解体时继续存在。",
          pressure: "它必须同时保住埃利亚的存在约束和经验中无法否认的变化。",
          consequence: "问题向四根与爱争、混合与努斯、原子与虚空三种答案开放。",
          participants: [],
          chapterIds: ["b1-06", "b1-08", "b1-09"],
          graph: { row: 5, lane: 2 },
        },
        {
          id: "roots-love-strife",
          kind: "答案",
          answerRole: "修复",
          title: "四根不变，爱与争改变比例",
          summary: "火、气、水、土不产生也不消灭；爱使它们结合，争使它们分离。可见事物来自混合比例，宇宙循环来自两种力量轮流占优。",
          pressure: "它用多种稳定材料与动力原则共同解释整体形成。",
          consequence: "自然过程也延伸到感觉：外物与身体怎样相遇成为新问题。",
          participants: [{ name: "恩培多克勒", philosopherId: "empedocles", role: "以根和力量重写生成" }],
          chapterIds: ["b1-06"],
          graph: { row: 6, lane: 0.5 },
        },
        {
          id: "mixture-nous-separation",
          kind: "答案",
          answerRole: "修复",
          title: "成分原已在场，努斯启动分离",
          summary: "所谓产生，是原本混合的成分在旋转和分离中取得优势并显现；努斯启动宇宙运动，具体世界仍通过自然过程展开。",
          pressure: "若后来出现的性质原先完全不存在，就会重新落入从不存在产生存在的困难。",
          consequence: "连续性得到保存，却留下努斯究竟解释启动、秩序还是目的的问题。",
          participants: [{ name: "阿那克萨哥拉", philosopherId: "anaxagoras", role: "以努斯和分离组织混合物" }],
          chapterIds: ["b1-08", "b1-13"],
          graph: { row: 6, lane: 2 },
        },
        {
          id: "atoms-void-arrangement",
          kind: "答案",
          answerRole: "修复",
          title: "原子不变，排列产生现象差异",
          summary: "留基伯和德谟克利特以不可分原子与虚空保存运动；事物的形成和性质差异由原子的组合、位置与排列解释。",
          pressure: "运动需要空处，性质变化又要在不改变基本单位的前提下得到解释。",
          consequence: "颜色、味道和痛苦是在原子中，还是发生于对象与感觉者的相遇中？",
          participants: [
            { name: "留基伯", philosopherId: "leucippus", role: "建立原子论框架" },
            { name: "德谟克利特", philosopherId: "democritus", role: "扩展自然与知觉解释" },
          ],
          chapterIds: ["b1-09"],
          graph: { row: 6, lane: 3.5 },
        },
        {
          id: "what-does-nous-explain",
          kind: "问题",
          title: "努斯解释的是启动、秩序还是目的？",
          summary: "阿那克萨哥拉以努斯启动宇宙旋转，却让此后的分离过程主要依照自然机制展开。努斯究竟只是第一推动，还是也解释世界的秩序与目的？",
          pressure: "若努斯只在开端出现，它与其他机械原因有何不同；若它持续安排世界，又需要说明安排的范围和方式。",
          consequence: "这条支线在本谱系暂时开放，并将在目的解释与机械解释的后续谱系中重新出现。",
          participants: [{ name: "阿那克萨哥拉", philosopherId: "anaxagoras", role: "留下努斯的解释范围问题" }],
          chapterIds: ["b1-08", "b1-13"],
          graph: { row: 7, lane: 2 },
        },
      ],
    },
    {
      id: "from-perception-to-knowledge",
      order: 5,
      label: "认识转向",
      title: "体验到变化，等于认识真实么",
      question: "感觉呈现外物、相遇关系还是感觉者状态；共同知识又需要什么尺度？",
      transition: "关于世界构成的答案反过来改变知识问题：观察者不再站在变化之外。",
      nodes: [
        {
          id: "same-thing-different-appearance",
          kind: "观察",
          title: "同一事物对不同的人显现不同",
          summary: "同一阵风对一人显冷，对另一人却不冷。感觉确实发生，但感觉内容并不总能直接成为所有人共享的对象性质。",
          pressure: "差异不能只归给外物，也不能只归给感觉者而不作说明。",
          consequence: "观察与早期感觉理论共同提出“感觉究竟呈现什么”的问题。",
          participants: [],
          chapterIds: ["b1-10", "b1-18"],
          graph: { row: 8, lane: 0 },
        },
        {
          id: "what-does-perception-reveal",
          kind: "问题",
          title: "感觉呈现的是外物、关系还是自身状态？",
          summary: "如果感觉本身也是身体发生的变化，它可以真实发生，却仍可能不足以独自确定外部原因。",
          pressure: "自然哲学已经说明外物与身体都在过程中，观察者不能继续被放在变化之外。",
          consequence: "问题获得自然化的感觉说明和以感觉者为尺度的两种相关答案。",
          participants: [],
          chapterIds: ["b1-06", "b1-09", "b1-10", "b1-18"],
          graph: { row: 9, lane: 2 },
        },
        {
          id: "perception-as-event",
          kind: "答案",
          answerRole: "区分",
          title: "体验是对象与感觉者之间的事件",
          summary: "外物作用于身体，身体发生改变，颜色、声音、冷热或痛苦才成为显现。“我确实感到痛”与“我知道痛由什么造成”不是同一个判断。",
          pressure: "它区分体验发生、对象判断和原因解释。",
          consequence: "感觉的真实性仍不能独自提供共同判断标准。",
          participants: [
            { name: "恩培多克勒", philosopherId: "empedocles", role: "尝试自然化感觉过程" },
            { name: "德谟克利特", philosopherId: "democritus", role: "区分基本构成与感官性质" },
          ],
          chapterIds: ["b1-06", "b1-09", "b1-18"],
          graph: { row: 10, lane: 1.2 },
        },
        {
          id: "appearance-relative-to-perceiver",
          kind: "答案",
          answerRole: "提出",
          title: "显现以感觉者的处境为尺度",
          summary: "普罗泰戈拉的尺度命题把显现、感觉者处境和判断联系起来，但其确切范围主要通过柏拉图等后世材料传达。",
          pressure: "它认真保存每个人当下显现的地位。",
          consequence: "如果不同显现都成立，共同判断真假的尺度在哪里？",
          participants: [{ name: "普罗泰戈拉", philosopherId: "protagoras", role: "把人的显现置于尺度位置" }],
          chapterIds: ["b1-10", "b1-18"],
          graph: { row: 10, lane: 3.4 },
        },
        {
          id: "common-standard-of-judgment",
          kind: "问题",
          title: "不同显现之间有没有共同判断尺度？",
          summary: "如果同一事物可以对不同人呈现不同性质，我们凭什么区分当下显现、关于对象的判断和可以共同辩护的知识？",
          pressure: "感觉事件和尺度答案都说明差异，却没有充分说明公共判断如何可能。",
          consequence: "问题从报告经验转向追问定义、理由与共同对象。",
          participants: [],
          chapterIds: ["b1-10", "b1-11", "b1-18"],
          graph: { row: 11, lane: 2.7 },
        },
        {
          id: "definition-beyond-instance",
          kind: "答案",
          answerRole: "转向",
          title: "从个别实例追问共同定义",
          summary: "苏格拉底式问答要求从许多个案返回定义，并检验信念是否相互一致。列举快乐、痛苦或勇敢行为，不等于知道快乐、勇敢和善是什么。",
          pressure: "它把共同尺度放在可说明、可检验的定义，而不只是感觉报告中。",
          consequence: "定义又要求说明：知识究竟把握怎样稳定的对象？",
          participants: [{ name: "苏格拉底", philosopherId: "socrates", role: "以反诘追问共同定义" }],
          chapterIds: ["b1-11", "b1-13"],
          graph: { row: 12, lane: 2.2 },
        },
        {
          id: "what-stabilizes-knowledge",
          kind: "问题",
          title: "知识需要怎样稳定的共同对象？",
          summary: "流变显现、数学结构、不变存在和共同定义分别提供了知识条件的一部分；这些要求能否由同一种对象统一承担？",
          pressure: "若知识只等于当下感觉，记忆、判断、共同标准和关于“是什么”的说明都难以获得位置。",
          consequence: "柏拉图将多条答案重新组织为关于可知形式的综合方案。",
          participants: [],
          chapterIds: ["b1-13", "b1-15", "b1-18"],
          graph: { row: 13, lane: 2.3 },
        },
        {
          id: "stable-object-of-knowledge",
          kind: "答案",
          answerRole: "综合",
          title: "可知形式为知识提供稳定对象",
          summary: "柏拉图把赫拉克利特式流变、巴门尼德式稳定、毕达哥拉斯式数学秩序和苏格拉底式定义重新组织起来：感觉面对变化的个别事物，理性追问使多个实例可理解的形式。",
          pressure: "它让存在、知识和共同定义在同一方案中获得位置。",
          consequence: "理念与具体事物怎样关联，成为新的解释负担。",
          participants: [{ name: "柏拉图", philosopherId: "plato", role: "把存在、知识与形式问题合并" }],
          chapterIds: ["b1-13", "b1-15", "b1-18"],
          graph: { row: 14, lane: 2.3 },
        },
        {
          id: "forms-and-particulars",
          kind: "问题",
          title: "稳定形式怎样进入变化的具体世界？",
          summary: "如果理念与个别事物分离，参与、模仿或分有究竟说明了什么？如果形式就在具体事物中，又怎样保持知识需要的普遍性？",
          pressure: "设置两个层次会把“变化如何可能”改写成“两个层次如何关联”，并未彻底消除困难。",
          consequence: "问题通向亚里士多德：形式、质料、实体、潜能与现实将重新解释变化和同一。",
          participants: [
            { name: "柏拉图", philosopherId: "plato", role: "留下理念与个别物关系问题" },
            { name: "亚里士多德", philosopherId: "aristotle", role: "下一阶段的系统修复者" },
          ],
          chapterIds: ["b1-15", "b1-19", "b1-23"],
          graph: { row: 15, lane: 2.3 },
        },
      ],
    },
  ],
  edges: [
    { id: "root-01", from: "difference-as-observation", to: "difference-derived-or-original", relation: "提出问题", label: "从并存差异追问来源", connection: "本站推演" },
    { id: "root-02", from: "difference-as-observation", to: "motion-and-plurality-possible", relation: "提出问题", label: "多个对象要求概念说明", connection: "本站推演" },
    { id: "root-03", from: "change-over-time-observation", to: "identity-through-change", relation: "提出问题", label: "前后不同仍被认作同一", connection: "本站推演" },
    { id: "root-05", from: "change-over-time-observation", to: "motion-and-plurality-possible", relation: "提出问题", label: "可见变化要求运动成立", connection: "本站推演" },
    { id: "root-06", from: "change-over-time-observation", to: "order-not-arbitrary-agency", relation: "提出问题", label: "由条件关联与周期重复追问次序", connection: "本站推演" },

    { id: "root-10", from: "difference-derived-or-original", to: "one-source-many-states", relation: "回应问题", label: "以一种来源统一多样", connection: "原书线索" },
    { id: "root-11", from: "difference-derived-or-original", to: "opposites-and-process", relation: "回应问题", label: "以对立分出说明多样", connection: "原书线索" },
    { id: "root-12", from: "difference-derived-or-original", to: "rarefaction-condensation", relation: "回应问题", label: "以程度变化形成多样", connection: "原书线索" },
    { id: "root-15", from: "identity-through-change", to: "rarefaction-condensation", relation: "回应问题", label: "以连续程度保存来源", connection: "同题并列" },
    { id: "root-16", from: "identity-through-change", to: "change-as-order", relation: "回应问题", label: "以持续过程维持同一", connection: "原书线索" },
    { id: "root-20", from: "order-not-arbitrary-agency", to: "opposites-and-process", relation: "回应问题", label: "以时间中的补偿维持次序", connection: "原书线索" },
    { id: "root-22", from: "order-not-arbitrary-agency", to: "difference-as-ratio", relation: "回应问题", label: "以数与比例说明秩序", connection: "同题并列" },
    { id: "root-23", from: "order-not-arbitrary-agency", to: "change-as-order", relation: "回应问题", label: "以逻各斯说明变化秩序", connection: "原书线索" },

    { id: "root-24", from: "one-source-many-states", to: "being-from-nonbeing", relation: "产生问题", label: "一种来源怎样真正生成多样", connection: "历史回应" },
    { id: "root-25", from: "opposites-and-process", to: "being-from-nonbeing", relation: "产生问题", label: "分出与复归是否预设生成", connection: "历史回应" },
    { id: "root-26", from: "rarefaction-condensation", to: "being-from-nonbeing", relation: "产生问题", label: "连续变形是否产生新存在", connection: "历史回应" },
    { id: "root-27", from: "change-as-order", to: "being-from-nonbeing", relation: "产生问题", label: "转换秩序遭遇存在约束", connection: "历史回应" },
    { id: "root-28", from: "being-from-nonbeing", to: "stable-being", relation: "回应问题", label: "拒绝从不存在生成", connection: "原书线索" },
    { id: "root-29", from: "motion-and-plurality-possible", to: "stable-being", relation: "回应问题", label: "把真正存在置于变化之外", connection: "原书线索" },
    { id: "root-30", from: "motion-and-plurality-possible", to: "test-motion-and-plurality", relation: "回应问题", label: "以悖论进行压力测试", connection: "历史回应" },
    { id: "root-31", from: "stable-being", to: "change-as-reconfiguration", relation: "产生问题", label: "不变存在与可见变化冲突", connection: "历史回应" },
    { id: "root-32", from: "test-motion-and-plurality", to: "change-as-reconfiguration", relation: "产生问题", label: "保存变化必须提高精度", connection: "历史回应" },
    { id: "e20", from: "change-as-reconfiguration", to: "roots-love-strife", relation: "回应问题", label: "版本一 · 比例与力量", connection: "历史回应" },
    { id: "e21", from: "change-as-reconfiguration", to: "mixture-nous-separation", relation: "回应问题", label: "版本二 · 混合与分离", connection: "历史回应" },
    { id: "e22", from: "change-as-reconfiguration", to: "atoms-void-arrangement", relation: "回应问题", label: "版本三 · 形状与排列", connection: "历史回应" },
    { id: "e23", from: "same-thing-different-appearance", to: "what-does-perception-reveal", relation: "提出问题", label: "从显现差异追问感觉对象", connection: "原书线索" },
    { id: "e24", from: "roots-love-strife", to: "what-does-perception-reveal", relation: "产生问题", label: "自然过程延伸到感觉", connection: "同题并列" },
    { id: "e25", from: "atoms-void-arrangement", to: "what-does-perception-reveal", relation: "产生问题", label: "原子性质与感官性质分离", connection: "历史回应" },
    { id: "e26", from: "what-does-perception-reveal", to: "perception-as-event", relation: "回应问题", label: "把感觉解释为相遇事件", connection: "同题并列" },
    { id: "e27", from: "what-does-perception-reveal", to: "appearance-relative-to-perceiver", relation: "回应问题", label: "把显现联系到感觉者", connection: "原书线索" },
    { id: "e28", from: "perception-as-event", to: "common-standard-of-judgment", relation: "产生问题", label: "感觉发生不等于原因判断", connection: "本站推演" },
    { id: "e29", from: "appearance-relative-to-perceiver", to: "common-standard-of-judgment", relation: "产生问题", label: "尺度命题留下公共标准", connection: "原书线索" },
    { id: "e30", from: "common-standard-of-judgment", to: "definition-beyond-instance", relation: "回应问题", label: "从实例返回共同定义", connection: "原书线索" },
    { id: "e31", from: "definition-beyond-instance", to: "what-stabilizes-knowledge", relation: "产生问题", label: "定义要求稳定共同对象", connection: "原书线索" },
    { id: "e32", from: "stable-being", to: "what-stabilizes-knowledge", relation: "产生问题", label: "理性把稳定设为知识条件", connection: "后世重构" },
    { id: "e33", from: "difference-as-ratio", to: "what-stabilizes-knowledge", relation: "产生问题", label: "数学结构提供可知模型", connection: "原书线索" },
    { id: "e34", from: "change-as-order", to: "what-stabilizes-knowledge", relation: "产生问题", label: "流变使稳定知识成为困难", connection: "原书线索" },
    { id: "e35", from: "appearance-relative-to-perceiver", to: "what-stabilizes-knowledge", relation: "产生问题", label: "相对显现迫使知识另寻对象", connection: "后世重构" },
    { id: "e36", from: "what-stabilizes-knowledge", to: "stable-object-of-knowledge", relation: "回应问题", label: "以可知形式统一多条要求", connection: "后世重构" },
    { id: "e37", from: "stable-object-of-knowledge", to: "forms-and-particulars", relation: "产生问题", label: "稳定对象留下分有负担", connection: "本站推演" },
    { id: "e38", from: "mixture-nous-separation", to: "what-does-nous-explain", relation: "产生问题", label: "努斯留下解释范围", connection: "原书线索" },
  ],
  sources: [
    { label: "罗素《西方哲学史》第一卷", url: "", note: "本站主叙述骨架；对应米利都学派至柏拉图知识论诸章。" },
    { label: "SEP · Presocratic Philosophy", url: "https://plato.stanford.edu/archives/sum2024/entries/presocratics/", note: "用于校正米利都学派、多元论与原子论之间的关系，以及前苏格拉底材料的证据边界。" },
    { label: "SEP · Heraclitus", url: "https://plato.stanford.edu/entries/heraclitus/", note: "用于避免把赫拉克利特简化成无差别的“万物流变”。" },
    { label: "SEP · Parmenides", url: "https://plato.stanford.edu/entries/parmenides/", note: "用于标示严格一元论只是重要解释之一，并保留其宇宙论部分的解释困难。" },
    { label: "SEP · Protagoras", url: "https://plato.stanford.edu/entries/protagoras/", note: "用于校正“人是万物的尺度”与感觉、显现之间的关系。" },
    { label: "SEP · Plato on Knowledge in the Theaetetus", url: "https://plato.stanford.edu/archives/spr2026/entries/plato-theaetetus/", note: "用于区分柏拉图在对话中检验的立场与可直接归于普罗泰戈拉、赫拉克利特的历史主张。" },
  ],
};

export const problemMaps = [ancientDifferenceProblemMap];
