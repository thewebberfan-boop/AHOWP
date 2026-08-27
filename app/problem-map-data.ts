export type ProblemNodeKind = "观察" | "问题" | "区分" | "回答" | "反驳" | "修复" | "转向" | "开放问题";
export type ProblemConnectionKind = "原书线索" | "历史回应" | "同题并列" | "本站推演" | "后世重构";

export type ProblemParticipant = {
  name: string;
  philosopherId?: string;
  role: string;
};

export type ProblemNode = {
  id: string;
  kind: ProblemNodeKind;
  relationFromPrevious: string;
  connection: ProblemConnectionKind;
  title: string;
  summary: string;
  pressure: string;
  consequence: string;
  participants: ProblemParticipant[];
  chapterIds: string[];
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
  sources: ProblemMapSource[];
};

export const problemConnectionNotes: Record<ProblemConnectionKind, string> = {
  原书线索: "罗素原书的章节安排或评价提供了这一步的叙述线索。",
  历史回应: "有较强理由把它理解为对既有困难的历史性回应。",
  同题并列: "思想家处理的是相近问题，但不据此主张直接影响。",
  本站推演: "为降低理解成本而建立的逻辑连接，不冒充思想家本人的明确论证。",
  后世重构: "使用后来的概念重新看见早期问题，须防止把术语倒灌给古人。",
};

export const ancientDifferenceProblemMap: ProblemMap = {
  id: "difference-change-knowledge",
  title: "从差异与变化到可知的形式",
  english: "DIFFERENCE → CHANGE → BEING → KNOWLEDGE",
  period: "第一卷试验谱系 · 泰勒斯至柏拉图",
  thesis: "世界为什么显得不同？沿着这一观察，可以依次追问变化的机制、存在的条件、组合如何产生性质，以及感觉能否成为知识。",
  scopeNote: "这不是一条被古代作者共同承认的师承路线。节点是问题与思想动作；人物只标记谁曾在这里提出回答、施加反驳或改变问题。连线分别注明历史回应、同题并列、原书线索或本站学习推演。",
  phases: [
    {
      id: "encounter-difference",
      order: 1,
      label: "起点",
      title: "先分清我们观察到了什么",
      question: "“不同”究竟是多个事物、同一事物的前后变化，还是一组互相依赖的对立？",
      transition: "若不先区分多样、变化与对立，后面的本原、运动和知识问题会被混成一句话。",
      nodes: [
        {
          id: "difference-as-observation",
          kind: "观察",
          relationFromPrevious: "经验起点",
          connection: "本站推演",
          title: "世界同时呈现多样、变化与对立",
          summary: "石头与植物彼此不同；种子与树是同一对象的前后差异；冷与热又像能相互转化的对立状态。这三种经验不必接受同一种解释。",
          pressure: "如果只说“世界不同”，我们还不知道差异是在事物之间、时间之中，还是性质的关系之中。",
          consequence: "问题被拆成“一与多”“存在与生成”“对立与秩序”三条可以分叉又能合流的路线。",
          participants: [],
          chapterIds: ["b1-02", "b1-04", "b1-05"],
        },
        {
          id: "difference-derived-or-original",
          kind: "问题",
          relationFromPrevious: "拆分后追问",
          connection: "本站推演",
          title: "差异是原初存在，还是由某种变化产生？",
          summary: "如果许多事物来自同一本原，就必须解释同一怎样产生差异；如果差异原本就是多个要素，又必须解释这些要素为什么形成一个可经验的世界。",
          pressure: "任何一边都不能只给出材料名称：一元论欠缺变化机制，多元论欠缺组合原则。",
          consequence: "本原问题开始从“万物是什么做的”推进到“差异如何被生成并维持”。",
          participants: [
            { name: "泰勒斯", philosopherId: "thales", role: "以单一本原压缩表面多样" },
            { name: "恩培多克勒", philosopherId: "empedocles", role: "以多个不变根保存差异" },
          ],
          chapterIds: ["b1-02", "b1-06"],
        },
        {
          id: "order-not-arbitrary-agency",
          kind: "区分",
          relationFromPrevious: "解释标准提高",
          connection: "后世重构",
          title: "从任意行动者转向可重复的自然秩序",
          summary: "早期自然哲学并未简单排除神圣，但逐渐要求变化具有可描述、可比较的秩序。神、理智、必然性和自然过程在古人那里也不是互斥选项。",
          pressure: "若同样条件下能观察到相似变化，仅以一次性的神意叙事便不足以解释其规则性。",
          consequence: "下一步不只是问“谁推动”，还要问“通过什么过程、按照什么尺度、为什么反复如此”。",
          participants: [
            { name: "阿那克西曼德", philosopherId: "anaximander", role: "用时间、对立与秩序描述生成" },
            { name: "阿那克西美尼", philosopherId: "anaximenes", role: "提出稀薄与凝聚的过程解释" },
          ],
          chapterIds: ["b1-02"],
        },
      ],
    },
    {
      id: "generate-difference",
      order: 2,
      label: "第一次分叉",
      title: "同一怎样产生多样",
      question: "差异来自材料变化、比例关系，还是对立过程本身？",
      transition: "米利都学派、毕达哥拉斯传统和赫拉克利特给出的不是一条单线答案，而是三种解释方向。",
      nodes: [
        {
          id: "one-source-many-states",
          kind: "回答",
          relationFromPrevious: "材料路线",
          connection: "原书线索",
          title: "许多事物可能是同一本原的不同状态",
          summary: "泰勒斯以水把表面的多样压缩到一个基础来源，但现存证据不足以为他补出完整的转化机制。",
          pressure: "指出共同材料只能解释“可能同源”，还不能解释它为何成为这些具体事物。",
          consequence: "本原需要与生成过程配对，问题交给阿那克西曼德和阿那克西美尼继续推进。",
          participants: [{ name: "泰勒斯", philosopherId: "thales", role: "提出单一本原的象征性起点" }],
          chapterIds: ["b1-02"],
        },
        {
          id: "opposites-and-process",
          kind: "修复",
          relationFromPrevious: "为本原补上过程",
          connection: "同题并列",
          title: "用对立分离、稀薄与凝聚说明生成",
          summary: "阿那克西曼德让对立面从无定者中分离并在时间中恢复平衡；阿那克西美尼则以气的稀薄与凝聚建立更连续的状态转换。",
          pressure: "变化既要允许产生可见差异，又不能完全依赖偶发事件。",
          consequence: "自然解释第一次较清楚地把“基础是什么”和“怎样变化”区分开来。",
          participants: [
            { name: "阿那克西曼德", philosopherId: "anaximander", role: "把生成写成对立与秩序" },
            { name: "阿那克西美尼", philosopherId: "anaximenes", role: "把生成写成程度连续的过程" },
          ],
          chapterIds: ["b1-02"],
        },
        {
          id: "difference-as-ratio",
          kind: "回答",
          relationFromPrevious: "结构路线",
          connection: "同题并列",
          title: "差异也可能来自比例、次序与关系",
          summary: "毕达哥拉斯传统以数、比例与和谐提示：构成材料相近，并不妨碍关系结构产生截然不同的结果。",
          pressure: "只列举材料无法解释音程、形状和秩序为什么具有可理解的差异。",
          consequence: "“它由什么构成”之外，出现了“它以什么形式组织”的问题；这为柏拉图重视数学可知性提供一条来源。",
          participants: [{ name: "毕达哥拉斯", philosopherId: "pythagoras", role: "把数与比例提升为解释原则" }],
          chapterIds: ["b1-03", "b1-13"],
        },
        {
          id: "change-as-order",
          kind: "转向",
          relationFromPrevious: "过程路线",
          connection: "原书线索",
          title: "变化未必破坏同一，也可能维持同一",
          summary: "赫拉克利特把对立与转换放在世界秩序内部。河流之所以仍是这条河，可能正依赖持续的物质更替；变化与恒常不再只是非此即彼。",
          pressure: "若把秩序等同于静止，就无法理解火焰、生命和张力结构如何通过持续活动保持。",
          consequence: "问题从“什么东西在变化”推进到“什么关系能在变化中保持可识别的结构”。",
          participants: [{ name: "赫拉克利特", philosopherId: "heraclitus", role: "以逻各斯和对立连接变化与秩序" }],
          chapterIds: ["b1-04", "b1-13"],
        },
      ],
    },
    {
      id: "eleatic-pressure",
      order: 3,
      label: "逻辑危机",
      title: "变化在逻辑上是否可能",
      question: "如果某物真的变成了它原本不是的东西，新的存在从哪里来？",
      transition: "巴门尼德不再补充一种自然机制，而是检查“生成”这个说法本身是否说得通。",
      nodes: [
        {
          id: "being-from-nonbeing",
          kind: "反驳",
          relationFromPrevious: "追问生成的前提",
          connection: "历史回应",
          title: "存在不能从不存在中产生",
          summary: "谈论和思考似乎必须有所指。若生成意味着存在从不存在中出现，解释便使用了一个不能被思考或言说的起点。",
          pressure: "此前关于生成的理论往往描述了变化过程，却没有先证明“产生”和“消灭”在逻辑上可能。",
          consequence: "感官确信的变化遭遇理性约束：真正存在的东西不能任意生成和消失。",
          participants: [{ name: "巴门尼德", philosopherId: "parmenides", role: "把自然问题改写为存在条件问题" }],
          chapterIds: ["b1-05"],
        },
        {
          id: "stable-being",
          kind: "回答",
          relationFromPrevious: "接受反驳",
          connection: "原书线索",
          title: "真正的存在必须保持同一",
          summary: "在严格解释中，真正存在不生不灭、不分割、不运动；日常经验中的多样和变化因此不能未经检验地充当最终实在。",
          pressure: "若理性只允许不变存在，如何解释我们无法否认的运动、差异与生成经验？",
          consequence: "哲学第一次明确形成“理性所要求的存在”与“感官所呈现的世界”之间的裂缝。",
          participants: [{ name: "巴门尼德", philosopherId: "parmenides", role: "确立存在与意见的张力" }],
          chapterIds: ["b1-05", "b1-15", "b1-18"],
        },
        {
          id: "test-motion-and-plurality",
          kind: "反驳",
          relationFromPrevious: "把压力施加给常识",
          connection: "历史回应",
          title: "承认运动和多个事物，会不会产生矛盾？",
          summary: "埃利亚的芝诺用悖论迫使对手说明连续、分割、多个对象和运动怎样同时成立。这里不把悖论当作文字游戏，而把它看作对概念精度的压力测试。",
          pressure: "仅仅诉诸“我们明明看见运动”不能回答关于无限分割和路径结构的推理困难。",
          consequence: "后来的自然哲学若要保存变化，必须让基本存在保持稳定，并重新解释可见的生成。",
          participants: [{ name: "埃利亚的芝诺", role: "以悖论检验运动与多样" }],
          chapterIds: ["b1-05"],
        },
      ],
    },
    {
      id: "preserve-and-recombine",
      order: 4,
      label: "多元论修复",
      title: "保存存在，重写变化",
      question: "如果基本存在不能生成和消灭，可见世界还能怎样变化？",
      transition: "共同修复原则是：让基本构成保持不变，把生成解释为结合、分离、位置或比例的改变。",
      nodes: [
        {
          id: "change-as-reconfiguration",
          kind: "区分",
          relationFromPrevious: "接受埃利亚约束",
          connection: "历史回应",
          title: "生成不等于从无到有，而是重新配置",
          summary: "“这个事物产生了”可以被重写为“原有构成形成了新的暂时整体”；“它毁灭了”则是这一组合解体。",
          pressure: "必须同时保住巴门尼德关于基本存在的约束和经验世界中的明显变化。",
          consequence: "不变的构成与可变的组织被分开，随后出现三种彼此竞争的版本。",
          participants: [
            { name: "恩培多克勒", philosopherId: "empedocles", role: "四根与爱争" },
            { name: "阿那克萨哥拉", philosopherId: "anaxagoras", role: "混合物与努斯" },
            { name: "留基伯", philosopherId: "leucippus", role: "原子与虚空" },
          ],
          chapterIds: ["b1-06", "b1-08", "b1-09"],
        },
        {
          id: "roots-love-strife",
          kind: "回答",
          relationFromPrevious: "版本一 · 比例与力量",
          connection: "历史回应",
          title: "四根不变，爱与争改变混合比例",
          summary: "火、气、水、土不产生也不消灭；爱使它们结合，争使它们分离。可见事物来自混合比例，而宇宙循环来自两种力量轮流占优。",
          pressure: "多种材料怎样进入和退出一个整体，需要动力原则而不只是成分清单。",
          consequence: "因果与循环在同一理论中共存：爱与争说明作用，循环说明作用的长期节律。",
          participants: [{ name: "恩培多克勒", philosopherId: "empedocles", role: "以根和力量重写生成" }],
          chapterIds: ["b1-06"],
        },
        {
          id: "mixture-nous-separation",
          kind: "回答",
          relationFromPrevious: "版本二 · 混合与分离",
          connection: "历史回应",
          title: "一切成分原已在场，努斯启动分离",
          summary: "所谓产生，是原本混合的成分在旋转和分离中取得优势并显现；努斯启动宇宙运动，但具体世界仍通过自然过程展开。",
          pressure: "若后来出现的性质原先完全不存在，就会重新落入从不存在产生存在的困难。",
          consequence: "“潜藏成分的显现”保存连续性，却留下努斯究竟解释启动、秩序还是目的的问题。",
          participants: [{ name: "阿那克萨哥拉", philosopherId: "anaxagoras", role: "以努斯和分离组织混合物" }],
          chapterIds: ["b1-08", "b1-13"],
        },
        {
          id: "atoms-void-arrangement",
          kind: "回答",
          relationFromPrevious: "版本三 · 形状与排列",
          connection: "历史回应",
          title: "原子不变，位置、形状和排列产生现象差异",
          summary: "留基伯和德谟克利特以不可分原子与虚空保存运动；事物的形成和性质差异由原子的组合、位置与排列解释。",
          pressure: "运动需要空处，性质变化又需要在不改变基本单位的前提下得到解释。",
          consequence: "解释变得更机械，但也打开新问题：颜色、味道和痛苦是在原子中，还是在对象与感觉者的相遇中？",
          participants: [
            { name: "留基伯", philosopherId: "leucippus", role: "建立原子论框架" },
            { name: "德谟克利特", philosopherId: "democritus", role: "扩展自然与知觉解释" },
          ],
          chapterIds: ["b1-09"],
        },
      ],
    },
    {
      id: "from-perception-to-knowledge",
      order: 5,
      label: "认识论转向",
      title: "体验到变化，等于认识真实么",
      question: "如果感觉本身也是身体发生的一种变化，它呈现的是外物、关系，还是感觉者自己的状态？",
      transition: "关于世界构成的理论反过来改变了知识问题：观察者不再站在变化之外。",
      nodes: [
        {
          id: "perception-as-event",
          kind: "转向",
          relationFromPrevious: "从对象转向相遇",
          connection: "本站推演",
          title: "体验是对象与感觉者之间发生的事件",
          summary: "外物作用于身体，身体发生改变，颜色、声音、冷热或痛苦才成为被体验的显现。体验可以真实发生，却仍不足以独自确定外部原因。",
          pressure: "“我确实感到痛”与“我知道痛由什么造成”不是同一个判断。",
          consequence: "需要区分显现的直接性、关于对象的判断，以及对原因的解释。",
          participants: [
            { name: "恩培多克勒", philosopherId: "empedocles", role: "尝试自然化感觉过程" },
            { name: "德谟克利特", philosopherId: "democritus", role: "区分基本构成与感官性质" },
          ],
          chapterIds: ["b1-06", "b1-09", "b1-18"],
        },
        {
          id: "appearance-relative-to-perceiver",
          kind: "回答",
          relationFromPrevious: "把关系性推到主体",
          connection: "同题并列",
          title: "同一事物可以对不同的人显现不同",
          summary: "同一阵风对一人显冷、对另一人不冷。普罗泰戈拉的尺度命题把显现、感觉者处境和判断联系起来，但其确切范围主要通过柏拉图等后世材料传达。",
          pressure: "如果性质只在相遇中显现，以谁的感觉作为共同真理标准？",
          consequence: "知识问题从“外物由什么构成”进一步转向“判断真假的共同尺度在哪里”。",
          participants: [{ name: "普罗泰戈拉", philosopherId: "protagoras", role: "把人的显现置于尺度位置" }],
          chapterIds: ["b1-10", "b1-18"],
        },
        {
          id: "definition-beyond-instance",
          kind: "转向",
          relationFromPrevious: "寻找共同尺度",
          connection: "原书线索",
          title: "列举体验和实例，不等于知道“它是什么”",
          summary: "苏格拉底式问答要求从许多个案返回定义，并检验信念是否相互一致。哲学的中心由自然构成转向德性、知识与生活。",
          pressure: "即使每个人都能报告自己的快乐、痛苦或勇敢行为，我们仍可能不知道快乐、勇敢和善的共同含义。",
          consequence: "稳定知识的候选对象不再只是物质本原，也可能是能统摄多个实例的定义。",
          participants: [{ name: "苏格拉底", philosopherId: "socrates", role: "以反诘追问共同定义" }],
          chapterIds: ["b1-11", "b1-13"],
        },
        {
          id: "stable-object-of-knowledge",
          kind: "修复",
          relationFromPrevious: "给知识稳定对象",
          connection: "后世重构",
          title: "若知识要求稳定对象，可知形式不能等同于流变显现",
          summary: "柏拉图把赫拉克利特式流变、巴门尼德式稳定、毕达哥拉斯式数学秩序和苏格拉底式定义追问重新组织起来：感觉面对变化的个别事物，理性追问使多个实例可被理解的形式。",
          pressure: "若知识只等于当下感觉，记忆、判断、共同标准和关于“是什么”的说明都难以获得位置。",
          consequence: "理念为知识提供稳定对象，但它与具体事物如何关联，又成为新的解释负担。",
          participants: [{ name: "柏拉图", philosopherId: "plato", role: "把存在、知识与形式问题合并" }],
          chapterIds: ["b1-13", "b1-15", "b1-18"],
        },
        {
          id: "forms-and-particulars",
          kind: "开放问题",
          relationFromPrevious: "修复留下的新负担",
          connection: "本站推演",
          title: "稳定形式怎样进入变化的具体世界？",
          summary: "如果理念与个别事物分离，参与、模仿或分有究竟说明了什么？如果形式就在具体事物中，又怎样保持知识需要的普遍性？",
          pressure: "仅仅设置两个层次，会把“变化如何可能”改写成“两个层次如何关联”，而非彻底消除困难。",
          consequence: "这条试验谱系在此通向亚里士多德：形式、质料、实体、潜能与现实将重新解释变化和同一。",
          participants: [
            { name: "柏拉图", philosopherId: "plato", role: "留下理念与个别物关系问题" },
            { name: "亚里士多德", philosopherId: "aristotle", role: "下一阶段的系统修复者" },
          ],
          chapterIds: ["b1-15", "b1-19", "b1-23"],
        },
      ],
    },
  ],
  sources: [
    {
      label: "罗素《西方哲学史》第一卷",
      url: "",
      note: "本站主叙述骨架；对应米利都学派至柏拉图知识论诸章。",
    },
    {
      label: "SEP · Presocratic Philosophy",
      url: "https://plato.stanford.edu/archives/sum2024/entries/presocratics/",
      note: "用于校正米利都学派、多元论与原子论之间的关系，以及前苏格拉底材料的证据边界。",
    },
    {
      label: "SEP · Heraclitus",
      url: "https://plato.stanford.edu/entries/heraclitus/",
      note: "用于避免把赫拉克利特简化成无差别的“万物流变”。",
    },
    {
      label: "SEP · Parmenides",
      url: "https://plato.stanford.edu/entries/parmenides/",
      note: "用于标示严格一元论只是重要解释之一，并保留其宇宙论部分的解释困难。",
    },
    {
      label: "SEP · Protagoras",
      url: "https://plato.stanford.edu/entries/protagoras/",
      note: "用于校正“人是万物的尺度”与感觉、显现之间的关系。",
    },
    {
      label: "SEP · Plato on Knowledge in the Theaetetus",
      url: "https://plato.stanford.edu/archives/spr2026/entries/plato-theaetetus/",
      note: "用于区分柏拉图在对话中检验的立场与可直接归于普罗泰戈拉、赫拉克利特的历史主张。",
    },
  ],
};

export const problemMaps = [ancientDifferenceProblemMap];
