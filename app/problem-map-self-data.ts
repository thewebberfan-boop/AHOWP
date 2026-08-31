import { selfReadingNodeIds } from "./self-reading-data";

export type ProblemFacetId = "method" | "nature" | "self" | "society" | "ultimate";

export type ProblemFacetOption = {
  id: ProblemFacetId;
  label: string;
  english: string;
  question: string;
  available: boolean;
};

export type ProblemCompressionLevel = "5" | "10" | "20" | "all";
export type SelfSummaryLevel = Exclude<ProblemCompressionLevel, "all">;

export type SelfSummaryUnit = {
  id: string;
  title: string;
  period: string;
  question: string;
  thesis: string;
  transition: string;
  overview?: string;
  entryNodeId?: string;
  phaseIds?: string[];
  nodeIds?: string[];
  sources?: { label: string; url: string }[];
  children?: SelfSummaryUnit[];
};

export const problemFacetOptions: ProblemFacetOption[] = [
  { id: "method", label: "方法", english: "METHOD", question: "我们怎样观察、推理、证明、解释与纠错？", available: true },
  { id: "nature", label: "自然", english: "NATURE", question: "自然怎样构成、变化并形成可解释的秩序？", available: true },
  { id: "self", label: "自我", english: "SELF", question: "心灵、感受、人格与自由怎样成立？", available: true },
  { id: "society", label: "社会", english: "SOCIETY", question: "行为、规范、权力与共同生活怎样组织？", available: true },
  { id: "ultimate", label: "终极", english: "ULTIMATE", question: "存在、目的、最高原则与最终边界是什么？", available: true },
];

export const problemCompressionLevels: { id: ProblemCompressionLevel; label: string; note: string }[] = [
  { id: "5", label: "总览 5", note: "先看五组基本问题与不同回答，不预设它们最终合成一种理论。" },
  { id: "10", label: "主线 10", note: "展开每组问题中的主要分歧，保持与总览的对应。" },
  { id: "20", label: "论证组 20", note: "定位具体问题及参与者，再进入同源的观察、问题和答案。" },
  { id: "all", label: "全部节点", note: "显示所选主题的论证网络；多选取并集，共有节点只显示一次。主题路径是本站选读，不穷尽该领域。" },
];

export const selfFacetNodeIds = [...new Set(Object.values(selfReadingNodeIds).flat())];

export function collectSelfSummaryNodeIds(unit: SelfSummaryUnit): string[] {
  return unit.nodeIds || selfReadingNodeIds[unit.id] || [...new Set((unit.children || []).flatMap(collectSelfSummaryNodeIds))];
}

export const selfSummaryTree: SelfSummaryUnit[] = [
  {
    id: "self-5-soul-agency",
    title: "怎样安排欲望，又能对什么负责？",
    period: "古希腊至罗马",
    overview: "柏拉图谈灵魂的秩序，亚里士多德谈德性与生活，斯多葛派谈判断与责任。",
    question: "身体会衰老，外部遭遇也常不由我决定。那么，什么使我是我，又有什么仍能由我做主？",
    thesis: "柏拉图用灵魂各部分的秩序说明正义，并另行讨论灵魂不朽。亚里士多德把人的良好生活联系到德性的活动、习惯和城邦条件。斯多葛派则强调：外部遭遇未必由我决定，我怎样接受印象并据此行动仍涉及自己的判断。这些论证分别讨论怎样生活、灵魂是否存续和行动怎样归责。",
    transition: "即使把判断看作自己的责任，人仍可能明知不对却照做。下一段追问：为什么意愿与行动会冲突，人能靠自己改好吗？",
    children: [
      {
        id: "self-10-rational-soul",
        title: "理性怎样引导生活，灵魂能否离开身体？",
        period: "古典希腊",
        question: "理性怎样组织欲望和行动？灵魂的不朽是否需要另外的论证？",
        thesis: "柏拉图用灵魂的内部秩序解释正义，亚里士多德从德性的活动与共同生活讨论幸福。柏拉图对灵魂不朽的论证属于另一问题，不能由生活有秩序直接推出。",
        transition: "帝国时代把问题从灵魂实体进一步转向日常判断与责任。",
        children: [
          { id: "self-20-soul-order", entryNodeId: "justice-as-ordered-whole", title: "理性怎样组织欲望和行动？", period: "柏拉图与亚里士多德", question: "欲望、判断和习惯怎样形成良好生活，城邦在其中起什么作用？", thesis: "柏拉图把正义理解为灵魂各部分各尽其职；亚里士多德把幸福联系到合乎德性的活动。两者都把个人生活与城邦联系起来，但没有采用同一套灵魂和幸福理论。", transition: "若灵魂属于可知秩序，还要追问它能否脱离身体。", phaseIds: ["from-perception-to-knowledge", "flourishing-and-polis", "hellenistic-therapies"] },
          { id: "self-20-soul-survival", entryNodeId: "can-soul-survive-body", title: "认识真实是否保证灵魂不朽？", period: "柏拉图及其后继", question: "认识不变对象的能力，是否足以证明灵魂独立延续？", thesis: "柏拉图从回忆、灵魂与可知对象的亲缘等角度论证不朽；这些论证须分别检验，不能把理性能够认识稳定对象当作已经证明灵魂永远存续。", transition: "后继传统把自由的检验转到因果世界中的具体行动。", phaseIds: ["from-perception-to-knowledge"] },
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
          { id: "self-20-assent-responsibility", entryNodeId: "fate-and-responsibility", title: "同意怎样使行动成为我的？", period: "斯多葛主义", question: "外因触发印象时，主体在哪一步承担责任？", thesis: "行动不是无原因事件；主体通过同意把外部刺激转化为自己的判断和行为。", transition: "内在因果保存责任，却未说明意志为何会持续选择错误。", phaseIds: ["hellenistic-therapies", "criteria-freedom-cosmopolis"] },
          { id: "self-20-inner-freedom-meaning", entryNodeId: "is-inner-freedom-enough", title: "内在自由是否足以回答最高意义？", period: "罗马至晚期古代", question: "控制判断、履行角色和接受命运，是否已经给出完整自我？", thesis: "自我越来越以内在转向获得稳定，但也由此向灵魂回归、恶与神圣援助开放。", transition: "基督教思想把自由的困难改写为分裂意志及其医治。", phaseIds: ["roman-inwardness-and-one"] },
        ],
      },
    ],
  },
  {
    id: "self-5-will-person",
    title: "明知该做什么，为什么我仍做不到？",
    period: "教父时期至经院哲学",
    overview: "从意志能否战胜习惯，追问上帝的预知、个人的思考与自由选择。",
    question: "知道应当行善，却摆脱不了坏习惯：这是我不愿意，还是我没有能力？如果上帝已知结局，我还能选择吗？",
    thesis: "奥古斯丁认为，知道善并不足以做到善，人的意志需要上帝的恩典帮助。波爱修斯尝试区分上帝知道我的选择与强迫我选择。中世纪另一组争论追问：若理智是众人共享的，为什么是这个人在思考、为行动负责？阿奎那坚持每个人有自己的理智能力，司各脱强调意志仍有选择余地。",
    transition: "这些解释多在信仰与神学框架内讨论。转到近代，问题还包括：当权威彼此冲突时，我能否从自己的思考与经验出发，确认自己是什么？",
    children: [
      {
        id: "self-10-grace-providence",
        title: "分裂意志、恩典与预知",
        period: "教父时期至早期中世纪",
        question: "意志若被自己的爱和习惯束缚，如何仍受责并重新获得行动能力？",
        thesis: "恶被理解为受造善的败坏，恩典医治而非简单替代意志；永恒预知则被区分为认识自由行动而非外部强迫。",
        transition: "救赎中的人格还必须说明理性能力为何属于每一个具体的人。",
        children: [
          { id: "self-20-divided-will-grace", entryNodeId: "can-will-heal-itself", title: "意志为何分裂，又能否自我医治？", period: "奥古斯丁", question: "知道善为何不能保证选择善？", thesis: "错误不来自独立邪恶实体，而来自爱与意志秩序的偏离；恩典恢复行动能力。", transition: "医治意志仍须与责任和自由选择相容。", phaseIds: ["revelation-grace-history"] },
          { id: "self-20-providence-contingency", entryNodeId: "does-providence-cancel-freedom", title: "无误预知会不会取消自由？", period: "波爱修斯及中世纪", question: "未来行动已被永恒认识时，它还能真正可能不同吗？", thesis: "永恒当下的认识与时间中的强迫被区分，以保存偶然行动及归责。", transition: "问题随后进入理智是否为个体所有的争论。", phaseIds: ["consolation-rule-pastoral-order"] },
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
          { id: "self-20-individual-intellect", entryNodeId: "is-rational-soul-individual", title: "普遍理智如何属于每个具体的人？", period: "阿维森纳、阿威罗伊与阿奎那", question: "超越私人感觉的知识怎样仍由个体承担？", thesis: "共享理智强化知识普遍性，个体灵魂论则坚持每个人拥有自己的理智能力。", transition: "个体理智成立后，还要说明个体本身怎样不可重复。", phaseIds: ["translation-demonstration-revelation", "aquinas-nature-grace-order"] },
          { id: "self-20-haecceity-choice", entryNodeId: "what-makes-common-nature-this-individual", title: "此性与选择怎样构成不可替代者？", period: "司各脱及晚期经院哲学", question: "共同本性如何成为这个个体，理智理由又是否必然决定意志？", thesis: "此性标记不可重复个体，意志的同步可能性则把自由定位为面对理由仍可选择。", transition: "个人能力扩大后，判断权开始进入文本、教会和国家的冲突。", phaseIds: ["scotus-ockham-individual-signs"] },
        ],
      },
    ],
  },
  {
    id: "self-5-modern-subject",
    title: "经历不断变化，为什么我还是同一个我？",
    period: "文艺复兴至经验主义",
    overview: "笛卡尔从思考确认我的存在；洛克追问意识连续；休谟质疑不变的自我。",
    question: "身体、记忆和性格都在变化，今天的我凭什么还是昨天的我？思考的我和身体又是什么关系？",
    thesis: "笛卡尔认为，即使怀疑一切，也不能否认正在思考的我存在；但这留下心灵怎样与身体结合的问题。洛克用意识能否把过去的行动认作自己的，解释人格同一。休谟则指出，向内观察只见不断变化的知觉，找不到独立不变的自我。这些答案分歧很大，不能把它们写成已经解决的统一理论。",
    transition: "向内寻找自我之外，还可以追问：我的愿望和判断是怎样形成的？教育与他人的态度是否也参与了“我”的形成？",
    children: [
      {
        id: "self-10-agency-conscience-cogito",
        title: "个人判断从权威冲突走向身体与我思",
        period: "文艺复兴、宗教改革与笛卡尔",
        question: "当传统权威分裂，个人凭什么判断，又是什么在身体变化中进行思考？",
        thesis: "人文主义和宗教改革提高个人行动与良心的可见度；霍布斯尝试身体化心灵，笛卡尔则以正在思考的主体取得确定性。",
        transition: "把思维确立为独立实体，立即产生它怎样与身体组成一个人的难题。",
        children: [
          { id: "self-20-agency-conscience", entryNodeId: "how-can-thought-judge-state-classics-scripture-experience", title: "能动性与良心如何面对多重权威？", period: "文艺复兴与宗教改革", question: "个人行动和经文良心获得地位后，怎样避免孤立判断自称无误？", thesis: "主体从制度中获得更大判断空间，却仍嵌在宗教、城市、文本和共同解释关系中。", transition: "认识权威的冲突推动思想寻找不依赖争议传统的起点。", phaseIds: ["schism-conciliar-reform-transition", "renaissance-texts-cities-human-agency", "humanism-reformation-conscience-authority"] },
          { id: "self-20-body-cogito", entryNodeId: "can-mind-be-explained-without-immaterial-faculty", title: "身体过程与我思分别怎样解释心灵？", period: "霍布斯与笛卡尔", question: "心灵能否化约为身体运动，或首先确定为思维之物？", thesis: "机械论说明感觉和欲望的因果过程，我思则从第一人称确定性确立主体；两者形成近代自我的基本张力。", transition: "思维与广延的清楚区分把统一的人重新变成问题。", phaseIds: ["hobbes-motion-language-covenant-sovereignty", "descartes-doubt-cogito-mind-body"] },
        ],
      },
      {
        id: "self-10-mind-body-identity",
        title: "心身、情感与人格连续接受因果和经验检验",
        period: "斯宾诺莎至休谟",
        question: "若自我处于完整因果秩序，什么维持心身统一、意识连续和责任？",
        thesis: "斯宾诺莎从同一自然秩序解释心身和情感；洛克以意识归属讨论人格同一；休谟检验我们是否经验到恒常自我。它们分别回答心身关系、归责标准和经验根据的问题，不能当作同一个答案逐步完善。",
        transition: "实体自我被削弱后，个体怎样在教育和承认中形成成为新的问题。",
        children: [
          { id: "self-20-mind-body-affect", entryNodeId: "how-can-distinct-mind-and-body-form-one-human", title: "心身对应与情感理解能否重写自由？", period: "笛卡尔与斯宾诺莎", question: "心身不直接互动或都受原因支配时，自由还剩下什么？", thesis: "笛卡尔坚持心身实在区分，同时承认人经验到二者的联合。斯宾诺莎拒绝两个实体的出发点，以同一自然的不同表达说明心身，并把自由联系到理解原因和增强行动能力。后一个答案改变了前提，不能写成前一个理论的补充。", transition: "因果自我还需要跨时间保持意识和责任。", phaseIds: ["descartes-doubt-cogito-mind-body", "spinoza-one-substance-affects-freedom"] },
          { id: "self-20-personal-identity-critique", entryNodeId: "what-makes-one-person-same-over-time", title: "意识、记忆与知觉束能否维持同一个人？", period: "莱布尼茨、洛克、贝克莱与休谟", question: "身体和心理内容变化时，什么把经验归给同一主体？", thesis: "莱布尼茨讨论知觉如何形成自我意识；洛克区分同一个人、同一身体和同一实体，以意识归属说明人格同一。贝克莱仍主张能动的精神，休谟则找不到恒常自我的印象，并承认知觉的统一仍有难题。意识、记忆与责任之间的关系并未由此得到公认解答。", transition: "自我统一不再只靠内在材料，而要考察关系、教育和社会形成。", phaseIds: ["leibniz-monads-reasons-possible-worlds", "locke-experience-ideas-knowledge-identity", "berkeley-ideas-spirits-immaterialism", "hume-impressions-causation-self-scepticism"] },
        ],
      },
    ],
  },
  {
    id: "self-5-formation-recognition",
    title: "活在他人的规则里，怎样才算自由？",
    period: "卢梭、康德与黑格尔",
    overview: "卢梭关注教育与依赖；康德追问道德原则能否普遍成立；黑格尔关注相互承认。",
    question: "我的愿望受教育、习俗和他人评价影响。照着愿望行动就算自由吗？遵守规则又一定是不自由吗？",
    thesis: "卢梭追问教育怎样培养判断力，而不是让人只求他人赞许。康德把自由联系到自律：依照理性能够要求每个人遵守的原则行动，而非只听从冲动。黑格尔强调，自由还需要他人承认我的地位，并在共同制度中得到保障。重点因此包括怎样形成判断、理由是否站得住，以及彼此如何相待。",
    transition: "但人不总按讲得通的理由行动。欲望、痛苦和过去的经历也会推动我们，下一段用这些经验检验理性与社会规则能解释多少。",
    children: [
      {
        id: "self-10-formation-dependence",
        title: "个体性在教育与社会依赖中形成",
        period: "浪漫主义与卢梭",
        question: "个体怎样通过关系成长，而不被虚荣、命令和社会比较支配？",
        thesis: "个体性不再被理解为先于社会的封闭内核；教育与平等关系可以塑造判断，也可能制造依赖。",
        transition: "形成中的主体还需要一个不依赖特殊共同体的自由标准。",
        children: [
          { id: "self-20-formed-individuality", entryNodeId: "can-individuality-and-sociality-support-each-other", title: "独特个体是否只能在关系中形成？", period: "浪漫主义", question: "创造性个体怎样既非习俗复制，也非孤立任性？", thesis: "教育、文化和关系成为个体能力的形成条件，同时保留对社会同化的批判。", transition: "卢梭把这种形成问题具体化为自爱、教育和依赖。", phaseIds: ["romanticism-reason-nature-individuality"] },
          { id: "self-20-education-dependence", entryNodeId: "how-educate-agency-without-premature-dependence", title: "教育怎样培养自主而不是服从？", period: "卢梭", question: "儿童和公民怎样在不可避免的依赖中形成判断与自制？", thesis: "消极教育延缓虚荣竞争，以安排后的经验培养能力；社会自爱则可能转向平等承认。", transition: "发展性自由仍需说明为何具有普遍规范力量。", phaseIds: ["rousseau-inequality-education-general-will"] },
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
          { id: "self-20-autonomy-causality", entryNodeId: "how-can-freedom-coexist-with-natural-causality", title: "自然因果与实践自由能否同时成立？", period: "康德", question: "同一行动怎样既可被因果说明，又可被主体负责？", thesis: "行动在现象层属于自然因果，在实践立场必须按自我立法归责；自由不是理论对象。", transition: "普遍自律仍没有说明具体自我怎样在社会中确认自身。", phaseIds: ["kant-experience-autonomy-judgment"] },
          { id: "self-20-recognition-social-self", entryNodeId: "why-self-consciousness-needs-mutual-recognition", title: "为什么自我意识需要他者承认？", period: "黑格尔", question: "一个主体为何不能单独确认自己的自由？", thesis: "相互承认构成可持续自我、权利和共同规范；支配因取消对方主体性而自行失败。", transition: "社会自我形成后，身体欲望与非理性动力仍要求解释。", phaseIds: ["hegel-dialectic-recognition-ethical-life-history", "byron-romantic-rebellion-individuality"] },
        ],
      },
    ],
  },
  {
    id: "self-5-lived-temporal-self",
    title: "欲望和过去塑造了我，我还能改变自己吗？",
    period: "十九世纪至实用主义",
    overview: "从怎样面对欲望与痛苦，转向记忆、习惯和环境如何参与人的改变。",
    question: "我常被冲动推着走，又带着无法抹去的过去。改变自己，是压住欲望、重新评价它，还是改变生活方式？",
    thesis: "叔本华认为欲望反复制造痛苦，提出审美、同情与禁欲等不同出路；尼采则追问怎样重估价值、肯定生活。密尔重视个性与能力的发展。柏格森强调过去持续进入现在；詹姆斯与杜威进一步考察经验、行动和环境的关系。它们提供不同解释，不能合并成一句“自我是过程”。",
    transition: "这条阅读线保留一个开放问题：如果我会不断改变，怎样既承认过去塑造了我，又能为接下来的行动负责？",
    children: [
      {
        id: "self-10-desire-suffering",
        title: "欲望、痛苦与自我克服挑战理性主体",
        period: "叔本华、尼采与密尔",
        question: "欲望是理性选择的材料，还是先于理由并持续塑造主体的动力？",
        thesis: "身体意愿揭示非理性驱力，痛苦可被否定、转化或承担；能力发展又使自由与幸福不能只按快感数量衡量。",
        transition: "若自我是发展过程，自由必须在真实持续和经验关系中重新理解。",
        children: [
          { id: "self-20-desire-suffering", entryNodeId: "desire-reveals-will-before-rational-purpose", title: "欲望和痛苦揭示了怎样的主体？", period: "叔本华与尼采", question: "理性目的是否只是更深驱力寻找对象的形式？", thesis: "叔本华从身体意愿和反复欲求解释痛苦，区分审美的暂时解脱、同情与禁欲。尼采质疑以否定生命回应痛苦，尝试重估价值；他的自我克服不能直接等同政治支配，其反平等风险也不能省略。", transition: "主体的价值重估仍要接受任意和残酷风险的检验。", phaseIds: ["schopenhauer-representation-will-suffering-release", "nietzsche-genealogy-nihilism-revaluation"] },
          { id: "self-20-capacity-liberty", entryNodeId: "are-all-pleasures-equal-in-value", title: "幸福是否包含较高能力与个性发展？", period: "密尔", question: "自由和幸福只是满足既有偏好，还是形成新能力的条件？", thesis: "较高能力、判断与生活实验进入幸福尺度，使个体发展不能被压成快感总量。", transition: "发展需要时间，因此自由行动不能只看作瞬间选择。", phaseIds: ["utilitarianism-welfare-liberty-reform"] },
        ],
      },
      {
        id: "self-10-duration-transaction",
        title: "过去和环境怎样参与当下的我？",
        period: "柏格森、詹姆斯与杜威",
        question: "过去如何进入现在，经验关系又怎样构成行动者？",
        thesis: "柏格森从绵延说明一次行动怎样表达整个经历；詹姆斯强调经验本身包含关系；杜威考察有机体与环境的相互作用。三种视角可相互比较，但并不共同证明一种最终的自我理论。",
        transition: "自我主线以开放问题收束：怎样同时保存经验连续、公共纠错、历史条件与有限自由？",
        children: [
          { id: "self-20-duration-free-act", entryNodeId: "is-freedom-an-uncaused-instant-choice", title: "自由行动怎样表达持续形成的整个自我？", period: "柏格森", question: "自由是否必须是脱离原因的瞬间选择？", thesis: "过去在绵延中进入现在，自由行动由不可外拆的整个发展中自我发出。", transition: "个体持续还要放进与世界共享的经验关系。", phaseIds: ["bergson-duration-memory-intuition-creation"] },
          { id: "self-20-experience-transaction", entryNodeId: "are-relations-experienced-or-added-by-thought", title: "经验是私人内容还是环境中的关系过程？", period: "詹姆斯与杜威", question: "主体、对象和关系是否先分开，再由心灵连接？", thesis: "激进经验论把关系纳入经验，杜威再把自我理解为有机体与环境持续调节的行动结构。", transition: "固定实体被放弃，但行动、责任与公共纠错仍需协同。", phaseIds: ["james-pragmatism-truth-belief-pluralism", "dewey-inquiry-education-democracy"] },
        ],
      },
    ],
  },
];

export function flattenSelfSummaryLevel(level: SelfSummaryLevel) {
  if (level === "5") return selfSummaryTree;
  if (level === "10") return selfSummaryTree.flatMap((unit) => unit.children || []);
  return selfSummaryTree.flatMap((unit) => (unit.children || []).flatMap((child) => child.children || []));
}

export function collectSelfSummaryPhaseIds(unit: SelfSummaryUnit): string[] {
  if (unit.phaseIds) return unit.phaseIds;
  return [...new Set((unit.children || []).flatMap(collectSelfSummaryPhaseIds))];
}

export function normalizeSelfCompressionLevel(value: unknown): ProblemCompressionLevel {
  // The retired 50-node view now opens the complete self topic.
  if (value === "50" || value === "all") return "all";
  if (value === "10" || value === "20") return value;
  return "5";
}

export function nextSelfSummaryLevel(level: SelfSummaryLevel): ProblemCompressionLevel {
  return level === "5" ? "10" : level === "10" ? "20" : "all";
}

function containsSummary(unit: SelfSummaryUnit, id: string): boolean {
  return unit.id === id || Boolean(unit.children?.some((child) => containsSummary(child, id)));
}

export function resolveSelfSummaryUnit(level: SelfSummaryLevel, currentUnitId?: string, phaseId?: string, nodeId?: string): SelfSummaryUnit {
  const units = flattenSelfSummaryLevel(level);
  const current = (["5", "10", "20"] as const).flatMap(flattenSelfSummaryLevel).find((unit) => unit.id === currentUnitId);
  // Stay in the same branch when moving either down to children or up to a parent.
  return units.find((unit) => current && (containsSummary(unit, current.id) || containsSummary(current, unit.id)))
    || units.find((unit) => nodeId && collectSelfSummaryNodeIds(unit).includes(nodeId))
    || units.find((unit) => phaseId && collectSelfSummaryPhaseIds(unit).includes(phaseId))
    || units[0];
}

export function selfSummaryEntryNodeId(unit: SelfSummaryUnit): string | undefined {
  return unit.entryNodeId || (unit.children?.[0] ? selfSummaryEntryNodeId(unit.children[0]) : undefined);
}
