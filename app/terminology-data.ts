import { philosopherProfiles, type PhilosopherStarRating } from "./philosopher-data";
import { schoolProfiles, type SchoolStarRating } from "./school-data";
import { geographyByAlias } from "./geography-data";

export type TermCategory = "人物" | "地名" | "学派" | "概念" | "著作";

export type TermEntry = {
  id: string;
  zh: string;
  en: string;
  original?: string;
  category: TermCategory;
  alternatives?: string[];
  /** Alternate surface forms that should be recognised in running text. */
  aliases?: string[];
  note: string;
  context?: string;
  distinction?: string;
  related?: string[];
  stars?: PhilosopherStarRating | SchoolStarRating;
  entity?: { kind: "philosopher" | "school"; id: string };
};

const seedTerminology: TermEntry[] = [
  { id: "thales", zh: "泰勒斯", en: "Thales", category: "人物", note: "米利都哲学家；罗素以他作为希腊哲学史的象征性起点。" },
  { id: "anaximander", zh: "阿那克西曼德", en: "Anaximander", category: "人物", note: "以“无限者”说明万物生成，并尝试用自然过程解释宇宙。" },
  { id: "anaximenes", zh: "阿那克西美尼", en: "Anaximenes", category: "人物", note: "以气的稀释和凝聚解释不同物质形态。" },
  { id: "pythagoras", zh: "毕达哥拉斯", en: "Pythagoras", category: "人物", note: "把数学比例、灵魂净化和宗教共同体连接起来。" },
  { id: "heraclitus", zh: "赫拉克利特", en: "Heraclitus", category: "人物", note: "强调变化、冲突和逻各斯；在罗素叙述中是辩证传统的重要远源。" },
  { id: "parmenides", zh: "巴门尼德", en: "Parmenides", category: "人物", note: "以严格推理主张真正存在不生不灭，公开挑战感官经验。" },
  { id: "empedocles", zh: "恩培多克勒", en: "Empedocles", category: "人物", note: "以四种不变元素及爱、争两种力量解释变化。" },
  { id: "anaxagoras", zh: "阿那克萨哥拉", en: "Anaxagoras", category: "人物", note: "以心灵推动宇宙秩序，并把爱奥尼亚自然哲学带入雅典。" },
  { id: "leucippus", zh: "留基伯", en: "Leucippus", category: "人物", note: "通常被视为古代原子论的早期创始者，其生平与著作归属仍不确定。" },
  { id: "democritus", zh: "德谟克利特", en: "Democritus", category: "人物", note: "以原子与虚空解释自然变化，是古代机械因果传统的重要代表。" },
  { id: "protagoras", zh: "普罗泰戈拉", en: "Protagoras", category: "人物", note: "智者代表人物，以“人是万物的尺度”关联知识、处境和论辩。" },
  { id: "socrates", zh: "苏格拉底", en: "Socrates", category: "人物", note: "以问答和反诘检验信念，把哲学中心转向德性与生活。" },
  { id: "plato", zh: "柏拉图", en: "Plato", category: "人物", note: "以理念、灵魂与理想城邦建立跨越知识、伦理和政治的体系。" },
  { id: "aristotle", zh: "亚里士多德", en: "Aristotle", category: "人物", note: "以观察、分类、逻辑和原因分析建立系统哲学。" },
  { id: "diogenes", zh: "第欧根尼", en: "Diogenes", category: "人物", note: "犬儒派象征人物，以公开生活实践拒绝财富、地位和习俗依赖。" },
  { id: "pyrrho", zh: "皮浪", en: "Pyrrho", category: "人物", note: "古代怀疑主义代表，以悬置判断追求心灵安宁。" },
  { id: "arcesilaus", zh: "阿尔克西劳", en: "Arcesilaus", category: "人物", note: "把柏拉图学院转向怀疑主义，反对斯多葛派的确定知识标准。" },
  { id: "carneades", zh: "卡尔内阿德", en: "Carneades", category: "人物", note: "学院怀疑主义者，以相反论证和或然性回应知识与实践问题。" },
  { id: "epicurus", zh: "伊壁鸠鲁", en: "Epicurus", category: "人物", note: "用原子论、欲望分类和友谊实践解除对神与死亡的恐惧。" },
  { id: "lucretius", zh: "卢克莱修", en: "Lucretius", category: "人物", note: "罗马诗人，以《物性论》传播伊壁鸠鲁主义自然观。" },
  { id: "zeno", zh: "季蒂昂的芝诺", en: "Zeno of Citium", category: "人物", alternatives: ["斯多葛芝诺"], aliases: ["斯多葛芝诺"], note: "斯多葛学派创始人；不要与提出运动悖论的埃利亚的芝诺混淆。" },
  { id: "zeno-elea", zh: "埃利亚的芝诺", en: "Zeno of Elea", category: "人物", note: "巴门尼德的追随者，以关于运动与多的悖论捍卫埃利亚学派立场；不要与斯多葛学派创始人季蒂昂的芝诺混淆。" },
  { id: "cleanthes", zh: "克里安西斯", en: "Cleanthes", category: "人物", note: "早期斯多葛学派第二任领袖，以《宙斯颂》和自愿顺应命运的思想著称。" },
  { id: "chrysippus", zh: "克律西波斯", en: "Chrysippus", category: "人物", note: "早期斯多葛主义的系统化者，发展命题逻辑、决定论与情绪判断理论。" },
  { id: "panaetius", zh: "帕奈提奥斯", en: "Panaetius", category: "人物", note: "中期斯多葛主义者，以恰当行动和角色伦理连接希腊学派与罗马公共生活。" },
  { id: "posidonius", zh: "波塞多尼奥斯", en: "Posidonius", category: "人物", note: "中期斯多葛主义综合者，把灵魂论、历史、地理和天文学放进宇宙关联体系。" },
  { id: "seneca", zh: "塞涅卡", en: "Seneca", category: "人物", note: "罗马斯多葛主义者，把哲学写成面对权力、死亡和情绪的日常操练。" },
  { id: "epictetus", zh: "爱比克泰德", en: "Epictetus", category: "人物", note: "强调区分可控制与不可控制之物，把自由安放在判断和意志。" },
  { id: "aurelius", zh: "马可·奥勒留", en: "Marcus Aurelius", category: "人物", note: "罗马皇帝和斯多葛作者，以自省记录角色义务与内在自由。" },
  { id: "plotinus", zh: "普罗提诺", en: "Plotinus", category: "人物", note: "新柏拉图主义核心人物，以太一、精神和灵魂构造流溢层级。" },
  { id: "paul", zh: "保罗", en: "Paul the Apostle", category: "人物", note: "早期基督教宣教者和书信作者，把救赎信息扩展到非犹太人世界。" },
  { id: "john-evangelist", zh: "约翰", en: "John the Evangelist", category: "人物", note: "本网站以此名称指《约翰福音》传统所代表的早期基督教神学形象。" },
  { id: "augustine", zh: "奥古斯丁", en: "Saint Augustine", category: "人物", note: "把柏拉图主义、内省、意志和基督教救赎史结合起来。" },
  { id: "benedict", zh: "本尼狄克", en: "Saint Benedict", category: "人物", note: "其修道规则成为西欧修道共同生活和知识保存的重要制度基础。" },
  { id: "gregory-great", zh: "大格列高利", en: "Gregory the Great", category: "人物", note: "教皇、行政者和传教组织者，体现罗马制度向中世纪教会的转移。" },
  { id: "eriugena", zh: "约翰·司各脱·爱留根纳", en: "John Scottus Eriugena", category: "人物", alternatives: ["约翰·司各脱", "爱留根纳"], aliases: ["约翰·司各脱", "爱留根纳"], note: "九世纪哲学家与译者，强调真正理性与真正启示不会冲突。" },
  { id: "avicenna", zh: "阿维森纳", en: "Avicenna (Ibn Sina)", category: "人物", alternatives: ["伊本·西那"], note: "伊斯兰哲学家和医学家，以存在、必然者和灵魂论重释亚里士多德。" },
  { id: "averroes", zh: "阿威罗伊", en: "Averroes (Ibn Rushd)", category: "人物", alternatives: ["伊本·鲁世德"], note: "安达卢西亚哲学家，其亚里士多德注释深刻影响拉丁经院哲学。" },
  { id: "maimonides", zh: "迈蒙尼德", en: "Maimonides", category: "人物", note: "犹太哲学家，以哲学解释协调摩西传统与亚里士多德思想。" },
  { id: "aquinas", zh: "托马斯·阿奎那", en: "Thomas Aquinas", category: "人物", note: "经院哲学综合者，系统划分自然理性与启示神学的范围。" },
  { id: "roger-bacon", zh: "罗杰·培根", en: "Roger Bacon", category: "人物", alternatives: ["罗吉尔·培根"], aliases: ["罗吉尔·培根"], note: "方济各会学者，强调语言、数学、观察与实验的重要性。" },
  { id: "duns-scotus", zh: "邓斯·司各脱", en: "Duns Scotus", category: "人物", note: "强调个体性、意志和存在概念，是晚期经院哲学的重要转折。" },
  { id: "ockham", zh: "奥卡姆", en: "William of Ockham", category: "人物", note: "以唯名论和简约原则限制经院体系的实体与证明负担。" },
  { id: "machiavelli", zh: "马基雅维利", en: "Machiavelli", category: "人物", note: "把政治权力、稳定与行动后果从完整神学伦理中相对分离。" },
  { id: "erasmus", zh: "伊拉斯谟", en: "Desiderius Erasmus", category: "人物", note: "以原文校勘、教育和讽刺推动北方基督教人文主义改革。" },
  { id: "thomas-more", zh: "莫尔", en: "Thomas More", category: "人物", note: "以《乌托邦》的虚构制度比较批判财产、刑罚与社会秩序。" },
  { id: "luther", zh: "路德", en: "Martin Luther", category: "人物", note: "宗教改革核心人物，强调信仰、经文和个人良心。" },
  { id: "copernicus", zh: "哥白尼", en: "Copernicus", category: "人物", note: "以日心模型重组天文学，动摇传统宇宙秩序。" },
  { id: "kepler", zh: "开普勒", en: "Kepler", category: "人物", note: "以行星椭圆轨道和数学定律推进新天文学。" },
  { id: "galileo", zh: "伽利略", en: "Galileo", category: "人物", note: "结合数学、实验和望远镜观察，改变自然研究的证据标准。" },
  { id: "francis-bacon", zh: "弗朗西斯·培根", en: "Francis Bacon", category: "人物", note: "倡导系统观察、归纳和协作研究；不要与罗杰·培根混淆。" },
  { id: "hobbes", zh: "霍布斯", en: "Thomas Hobbes", category: "人物", note: "从恐惧、契约和机械论出发论证不可分割的主权。" },
  { id: "descartes", zh: "笛卡尔", en: "René Descartes", category: "人物", note: "以方法性怀疑和“我思”重建现代知识的主体起点。" },
  { id: "spinoza", zh: "斯宾诺莎", en: "Baruch Spinoza", category: "人物", note: "以单一实体和必然性体系重新理解自然、上帝与自由。" },
  { id: "leibniz", zh: "莱布尼茨", en: "Gottfried Wilhelm Leibniz", category: "人物", note: "以单子、充足理由和预定和谐构造理性主义体系。" },
  { id: "locke", zh: "洛克", en: "John Locke", category: "人物", note: "经验主义和自由主义的重要奠基者，反对天赋观念与绝对权力。" },
  { id: "berkeley", zh: "贝克莱", en: "George Berkeley", category: "人物", note: "以“存在就是被感知”批评物质实体观念。" },
  { id: "hume", zh: "休谟", en: "David Hume", category: "人物", note: "把经验主义推向怀疑结论，重构因果、自我和归纳问题。" },
  { id: "rousseau", zh: "卢梭", en: "Jean-Jacques Rousseau", category: "人物", note: "以文明批判、社会契约和公意重塑现代自由问题。" },
  { id: "kant", zh: "康德", en: "Immanuel Kant", category: "人物", note: "研究经验何以可能，并区分现象知识与实践自由。" },
  { id: "hegel", zh: "黑格尔", en: "G. W. F. Hegel", category: "人物", note: "以辩证法和历史整体解释理性与自由的制度展开。" },
  { id: "schopenhauer", zh: "叔本华", en: "Arthur Schopenhauer", category: "人物", note: "把世界理解为表象与盲目意志，形成悲观主义体系。" },
  { id: "byron", zh: "拜伦", en: "Lord Byron", category: "人物", note: "浪漫主义诗人；罗素用他呈现反习俗、英雄化个人主义的文化类型。" },
  { id: "nietzsche", zh: "尼采", en: "Friedrich Nietzsche", category: "人物", note: "以谱系和心理分析追问价值来源，并诊断现代虚无主义。" },
  { id: "bentham", zh: "边沁", en: "Jeremy Bentham", category: "人物", note: "以最大幸福原则系统化功利主义，并推动法律与制度改革。" },
  { id: "mill", zh: "约翰·斯图亚特·密尔", en: "John Stuart Mill", category: "人物", alternatives: ["穆勒"], note: "发展功利主义、自由论与代议政治，同时强调个性和思想实验。" },
  { id: "marx", zh: "马克思", en: "Karl Marx", category: "人物", note: "从生产关系、阶级与实践解释历史结构及其改变。" },
  { id: "bergson", zh: "柏格森", en: "Henri Bergson", category: "人物", note: "以绵延、记忆与直觉区分生活时间和空间化测量时间。" },
  { id: "william-james", zh: "威廉·詹姆斯", en: "William James", category: "人物", note: "实用主义代表，以经验与实践后果讨论真理和信念。" },
  { id: "dewey", zh: "约翰·杜威", en: "John Dewey", category: "人物", note: "把认识理解为环境中的探究与调整，并应用于民主教育。" },
  { id: "frege", zh: "弗雷格", en: "Gottlob Frege", category: "人物", note: "现代逻辑奠基者之一，对语言、数学基础和分析哲学影响深远。" },
  { id: "russell", zh: "罗素", en: "Bertrand Russell", category: "人物", note: "本书作者，也是现代逻辑分析哲学的重要代表。" },
  { id: "hesiod", zh: "赫西俄德", en: "Hesiod", original: "Ἡσίοδος", category: "人物", note: "古希腊诗人，以神谱和诸神世代说明宇宙秩序；泰勒斯式自然解释正是在这种诗性谱系背景中显出差异。", context: "约前 700 年前后 · 古风时期希腊", distinction: "本站把他作为哲学诞生的比较对象，尚未建立独立人物页。", related: ["泰勒斯", "前苏格拉底自然哲学诸传统"] },
  { id: "cratylus", zh: "克拉底鲁", en: "Cratylus", original: "Κρατύλος", category: "人物", note: "与赫拉克利特接受史相关的雅典思想人物；柏拉图同名对话借他讨论语言是否天然正确。", context: "约前 5 世纪后期 · 雅典", distinction: "关于其生平与具体主张的材料有限，不能把柏拉图对话人物的每句话都当作历史记录。", related: ["赫拉克利特", "柏拉图"] },
  { id: "cicero", zh: "西塞罗", en: "Cicero", original: "Marcus Tullius Cicero", category: "人物", note: "罗马政治家与哲学作者，以拉丁文转述学院怀疑主义、斯多葛伦理和共和政治问题。", context: "前 106—前 43 · 罗马共和国晚期", distinction: "他不是简单复制某一希腊学派，而是按罗马公共生活重组选材；本站尚未建立独立人物页。", related: ["帕奈提奥斯", "波塞多尼奥斯", "学院怀疑主义"] },
  { id: "darwin", zh: "达尔文", en: "Charles Darwin", category: "人物", note: "以自然选择说明物种在遗传变异和生存繁殖差异中改变，常被拿来与古代演化猜想比较。", context: "1809—1882 · 英国自然史与生物学", distinction: "恩培多克勒关于肢体组合的片段并非自然选择理论；两者并置属于同题比较，不是直接传承。", related: ["恩培多克勒", "近代科学"] },

  { id: "miletus", zh: "米利都", en: "Miletus", category: "地名", note: "小亚细亚爱奥尼亚商业城邦，米利都学派的思想中心。" },
  { id: "ionia", zh: "爱奥尼亚", en: "Ionia", category: "地名", note: "小亚细亚西岸希腊地区，连接爱琴海与近东知识网络。" },
  { id: "athens-place", zh: "雅典", en: "Athens", category: "地名", note: "古典时期民主、修辞、戏剧和哲学学园的主要中心。" },
  { id: "alexandria", zh: "亚历山大里亚", en: "Alexandria", category: "地名", alternatives: ["亚历山大城"], note: "希腊化与罗马时期重要的图书、科学和多宗教思想中心。" },
  { id: "rome", zh: "罗马", en: "Rome", category: "地名", note: "既指城市，也常指共和国或帝国制度；语境需分别判断。" },

  { id: "milesian", zh: "米利都学派", en: "Milesian School", category: "学派", note: "用自然本原而非神话谱系解释世界的早期哲学传统。" },
  { id: "cynicism", zh: "犬儒派", en: "Cynics / Cynicism", category: "学派", note: "以减少需要和反习俗生活追求不受外物支配的自由。" },
  { id: "scepticism", zh: "怀疑派", en: "Sceptics / Scepticism", category: "学派", alternatives: ["怀疑主义"], note: "通过为相反判断提供理由并悬置断言，降低精神扰动。" },
  { id: "epicureanism", zh: "伊壁鸠鲁派", en: "Epicureans / Epicureanism", category: "学派", alternatives: ["伊壁鸠鲁主义"], note: "把快乐理解为无痛与宁静，以自然知识解除恐惧。" },
  { id: "stoicism", zh: "斯多葛主义", en: "Stoicism", category: "学派", alternatives: ["斯多葛派"], note: "强调德性、自然秩序、判断训练和内在自由。" },
  { id: "neoplatonism", zh: "新柏拉图主义", en: "Neoplatonism", category: "学派", note: "以太一、精神和灵魂的层级重新解释柏拉图传统。" },
  { id: "scholasticism", zh: "经院哲学", en: "Scholasticism", category: "学派", aliases: ["中世纪经院哲学"], note: "中世纪大学中以问题、反对、回答和反驳组织知识的专业传统。" },
  { id: "rationalism", zh: "理性主义", en: "Rationalism", category: "学派", note: "以理性原则和演绎体系作为知识的重要基础。" },
  { id: "empiricism", zh: "经验主义", en: "Empiricism", category: "学派", note: "要求观念和知识最终说明其经验来源与证据。" },
  { id: "romanticism", zh: "浪漫主义", en: "Romanticism", category: "学派", note: "强调个性、情感、创造和自然，反抗机械理性与抽象秩序。" },
  { id: "utilitarianism", zh: "功利主义", en: "Utilitarianism", category: "学派", note: "按行动或制度对总体幸福的后果进行伦理评价。" },
  { id: "pragmatism", zh: "实用主义", en: "Pragmatism", category: "学派", note: "通过观念在经验、行动和共同探究中的作用理解意义与真理。" },
  { id: "analytic", zh: "分析哲学", en: "Analytic Philosophy", category: "学派", note: "重视逻辑、语言和概念澄清，反对含混的宏大体系。" },
  { id: "buddhist-philosophy", zh: "佛教哲学", en: "Buddhist philosophy", category: "学派", note: "围绕无常、无我、缘起、苦与解脱形成的多传统思想；不能被压成一个与希腊怀疑主义相同的教义。", context: "古代印度起源 · 亚洲多地区发展", distinction: "皮浪是否直接受印度佛教影响仍有证据争议；本站相关条目只保留比较或有条件的接触可能。", related: ["皮浪", "怀疑派"] },
  { id: "gnosticism", zh: "诺斯替主义", en: "Gnosticism", category: "学派", note: "现代研究用于概括古代晚期若干以启示性知识、宇宙层级和救赎神话为特征的运动。", context: "约 1—4 世纪 · 地中海东部", distinction: "它不是单一、自称统一的教会；普罗提诺批评的是其中若干具体群体及其贬低宇宙的主张。", related: ["普罗提诺", "新柏拉图主义"] },
  { id: "modern-naturalism", zh: "现代自然主义", en: "modern naturalism", category: "学派", note: "主张哲学解释应与自然科学和经验世界连续，不以超自然实体填补因果或认识空缺。", context: "近现代哲学中的宽泛取向", distinction: "它包含多种本体论和方法立场；卢克莱修是历史资源，不等于已经持有现代科学自然主义。", related: ["卢克莱修", "科学革命与经验方法"] },
  { id: "modern-skepticism-empiricism", zh: "近代怀疑与经验主义", en: "early modern skepticism and empiricism", category: "学派", note: "近代哲学重新使用怀疑来检验知识基础，并以经验来源限制概念和断言；笛卡尔、洛克与休谟的目标并不相同。", context: "约 17—18 世纪 · 欧洲", distinction: "它是跨作者的问题链，不是一个自称统一的学派；古代怀疑主义是思想资源而非不间断组织传承。", related: ["古代怀疑主义", "大陆理性主义", "英国经验主义与自由主义"] },
  { id: "modern-atomism-utilitarianism", zh: "近代原子论与功利主义", en: "modern atomism and utilitarianism", category: "学派", note: "近代自然哲学重建微粒解释，伦理与制度理论则重新计算快乐和痛苦；两条路线都曾选择性借用伊壁鸠鲁传统。", context: "17—19 世纪 · 欧洲", distinction: "近代物理原子不同于古代不可分原子，功利主义也不等于伊壁鸠鲁的宁静生活方案；这里标示接受史而非一个统一流派。", related: ["伊壁鸠鲁主义", "科学革命与经验方法", "功利主义"] },
  { id: "christianity-modern-natural-law", zh: "基督教与近代自然法", en: "Christian and early modern natural-law traditions", category: "学派", note: "斯多葛关于共同理性、自然秩序和世界公民的语言，经罗马作者、教父与法学传统进入基督教和近代权利讨论。", context: "罗马帝国至近代欧洲 · 多重接受链", distinction: "后世继承经过创造论、人格伦理和法律制度的深刻改写，不能把近代自然权利直接归给古代斯多葛派。", related: ["斯多葛主义", "自然法", "洛克"] },
  { id: "modern-state-reformation-constitutionalism", zh: "近代国家、宗教改革与宪政", en: "modern state, Reformation, and constitutionalism", category: "学派", note: "中世纪关于教皇、会议、世俗统治与共同体授权的争论，为近代主权、宗教分裂和有限政府提供了一部分问题语言。", context: "14—18 世纪 · 欧洲政教制度转型", distinction: "这不是单一路线：宗教改革、绝对主权和宪政对中世纪资源作出相互冲突的选择。", related: ["中世纪政教权力思想", "宗教改革与新教思想", "机械论政治哲学"] },

  { id: "arche", zh: "本原", en: "archē / first principle", category: "概念", alternatives: ["始基"], note: "早期希腊哲学中万物由之生成或得到统一解释的根本原则。" },
  { id: "logos", zh: "逻各斯", en: "logos", category: "概念", alternatives: ["理则", "道"], note: "可指言说、理由或秩序；在赫拉克利特和基督教语境中含义不同。" },
  { id: "non-being", zh: "非存在", en: "what-is-not / non-being", category: "概念", note: "巴门尼德认为它不能被认识或充当生成来源；原子论则以虚空重新处理“无”的地位。" },
  { id: "four-roots", zh: "四根", en: "four roots", category: "概念", note: "恩培多克勒所说火、气、水、土四种不生不灭的基本成分；后世常称四元素。" },
  { id: "nous", zh: "努斯", en: "Nous / Mind", category: "概念", note: "阿那克萨哥拉体系中不与其他成分混合、具有知识并启动宇宙旋转的原则。" },
  { id: "atom", zh: "原子", en: "atomon / atom", category: "概念", note: "古代原子论中不可切分、不生不灭的基本实体；不能与现代物理学原子直接等同。" },
  { id: "void", zh: "虚空", en: "void", category: "概念", note: "原子之间允许分离和运动的空无间隔，是原子论对埃利亚存在论的关键修正。" },
  { id: "euthymia", zh: "心灵安宁", en: "euthymia / cheerfulness", category: "概念", note: "德谟克利特所重视的稳定愉悦状态，通过衡量、节制与判断训练获得。" },
  { id: "virtue", zh: "德性", en: "virtue / aretē", category: "概念", alternatives: ["美德"], note: "不仅是道德善，也可指一种事物或人的卓越能力。" },
  { id: "man-measure", zh: "人是尺度", en: "man-measure thesis", category: "概念", note: "普罗泰戈拉命题的简写；既可讨论感知相对性，也可能扩展到价值判断和公共论辩。" },
  { id: "elenchus", zh: "反诘", en: "elenchus / refutation", category: "概念", note: "苏格拉底式问答中通过追问一个人的承诺，显露其信念之间矛盾的方法。" },
  { id: "maieutic", zh: "助产术", en: "maieutic method", category: "概念", note: "柏拉图作品用助产比喻描述苏格拉底帮助对话者检验并产生思想；不等于直接传授结论。" },
  { id: "ideas-forms", zh: "理念", en: "Ideas / Forms", category: "概念", alternatives: ["形式", "理型"], note: "柏拉图语境中可知、稳定且作为具体事物标准的存在；英译常用 Forms。" },
  { id: "philosopher-ruler", zh: "哲学王", en: "philosopher-ruler", category: "概念", note: "《理想国》中把关于善的知识与统治责任结合的政治角色，并非现代意义上由学者直接执政。" },
  { id: "matter-form", zh: "质料与形式", en: "matter and form / hylomorphism", category: "概念", note: "亚里士多德用以分析具体实体的成分与组织原则；两者通常不能作为独立物简单拼接。" },
  { id: "potential-actual", zh: "潜能与现实", en: "potentiality and actuality", category: "概念", note: "说明一个能力或可能结构如何在适当条件下实现，也是亚里士多德解释变化的核心区分。" },
  { id: "four-causes", zh: "四因", en: "four causes", category: "概念", note: "质料、形式、动力和目的四种‘为何如此’的回答维度，不只是四个相互竞争的事件原因。" },
  { id: "doctrine-mean", zh: "中道", en: "doctrine of the mean", category: "概念", note: "亚里士多德把许多德性理解为相对于行动者和处境、经实践理性确定的适度，而非算术平均。" },
  { id: "autarkeia", zh: "自足", en: "autarkeia / self-sufficiency", category: "概念", note: "减少对财富、名望和外在条件的依赖；犬儒派把它推进为可见的生活实践。" },
  { id: "parrhesia", zh: "直言", en: "parrhēsia / frank speech", category: "概念", note: "冒着社会代价公开说真话的实践，在犬儒派那里与反习俗生活相互支持。" },
  { id: "epoche", zh: "悬置判断", en: "epochē / suspension of judgment", category: "概念", note: "在理由势均力敌或标准不足时不作断言；古代不同怀疑主义传统对其范围与理由并不完全相同。" },
  { id: "ataraxia", zh: "不动心", en: "ataraxia / tranquility", category: "概念", alternatives: ["心灵宁静"], note: "免于精神扰动的稳定状态；怀疑派与伊壁鸠鲁派都重视它，但达到路径不同。" },
  { id: "kataleptic-impression", zh: "认知印象", en: "kataleptic impression", category: "概念", note: "斯多葛派设想能以自身特征保证真确来源的印象；阿尔克西劳以不可区分的误印象攻击这一标准。" },
  { id: "persuasive-impression", zh: "可信印象", en: "persuasive impression / pithanē phantasia", category: "概念", note: "卡尔内阿德为行动提出的可接受表象，可进一步检查是否稳定且与相关表象协调，但不升级为确定知识。" },
  { id: "aponia", zh: "无痛", en: "aponia / absence of bodily pain", category: "概念", note: "伊壁鸠鲁所谓身体快乐的稳定界限，与心灵的不动心共同构成不受扰动的生活。" },
  { id: "atomic-swerve", zh: "原子偏斜", en: "clinamen / atomic swerve", category: "概念", note: "伊壁鸠鲁传统中原子运动的微小无定时偏离，用来解释碰撞及行动不被严格机械必然性穷尽。" },
  { id: "substance", zh: "实体", en: "substance", category: "概念", note: "能独立存在或作为属性承担者的东西；亚里士多德、笛卡尔和斯宾诺莎定义不同。" },
  { id: "soul", zh: "灵魂", en: "soul / psychē", category: "概念", note: "古希腊可指生命原则，基督教和近代语境则更强调人格与不朽。" },
  { id: "the-one", zh: "太一", en: "the One", category: "概念", alternatives: ["一者"], note: "普罗提诺体系中超越存在与思想、万物由之流出的最高原则。" },
  { id: "natural-law", zh: "自然法", en: "natural law", category: "概念", note: "依据共同理性或人性而成立、并非只由地方成文法创造的规范。" },
  { id: "free-will", zh: "自由意志", en: "free will", category: "概念", note: "人是否能成为行动来源；在奥古斯丁那里与罪、预知和恩典相连。" },
  { id: "grace", zh: "恩典", en: "grace", category: "概念", alternatives: ["恩宠"], note: "来自上帝、使堕落者能够得救或行善的非应得帮助。" },
  { id: "salvation", zh: "救赎", en: "salvation / redemption", category: "概念", note: "从罪、死亡或与上帝分离状态中被拯救；两个英文词侧重点可能不同。" },
  { id: "universals", zh: "共相", en: "universals", category: "概念", alternatives: ["普遍概念"], note: "多个个体共同具有的种类或性质是否真实存在，是经院哲学核心争论。" },
  { id: "faith", zh: "信仰", en: "faith", category: "概念", note: "宗教信赖与接受；并不总等同于缺乏证据的普通相信。" },
  { id: "reason", zh: "理性", en: "reason", category: "概念", note: "推理、原则判断或把握秩序的能力；不同传统对其范围评价不同。" },
  { id: "revelation", zh: "启示", en: "revelation", category: "概念", note: "被认为由上帝主动揭示、不能仅凭自然理性获得的真理。" },
  { id: "experience", zh: "经验", en: "experience", category: "概念", note: "感觉、反省或实践经历的材料；经验主义内部也有不同定义。" },
  { id: "induction", zh: "归纳", en: "induction", category: "概念", note: "从有限观察推广到一般规律；休谟追问这种推广如何获得正当性。" },
  { id: "causation", zh: "因果", en: "causation", category: "概念", alternatives: ["因果性"], note: "事件间是否存在必然联系，而不仅是持续相继发生。" },
  { id: "social-contract", zh: "社会契约", en: "social contract", category: "概念", note: "从个人同意或假想协议说明政治权威如何形成及受何限制。" },
  { id: "sovereignty", zh: "主权", en: "sovereignty", category: "概念", note: "政治共同体中最高且最终的公共决定权。" },
  { id: "natural-rights", zh: "自然权利", en: "natural rights", category: "概念", note: "被认为先于政府、政府应当保护而不能任意取消的个人权利。" },
  { id: "transcendental", zh: "先验", en: "transcendental / a priori", category: "概念", note: "康德语境中 transcendental 研究经验何以可能；a priori 指不依赖具体经验，两者不能简单混同。" },
  { id: "general-will", zh: "公意", en: "general will", category: "概念", note: "卢梭所说面向共同利益的公共意志，不等同于所有私人意见的简单总和。" },
  { id: "dialectic", zh: "辩证法", en: "dialectic", category: "概念", note: "可指问答检验、矛盾推进或历史运动；柏拉图与黑格尔用法差异很大。" },
  { id: "genealogy", zh: "谱系", en: "genealogy", category: "概念", note: "通过价值和制度的生成历史揭示其生命需要与权力来源。" },
  { id: "logical-analysis", zh: "逻辑分析", en: "logical analysis", category: "概念", note: "通过揭示命题的逻辑形式澄清、重构或消除哲学问题。" },
  { id: "freedom", zh: "自由", en: "freedom / liberty", category: "概念", note: "英文两词常可互换，但政治自由、意志自由和内在自由需要按语境区分。" },
  { id: "modern-science", zh: "近代科学", en: "early modern science", category: "概念", note: "16—17 世纪以数学模型、实验、仪器观察和协作研究重组自然知识的多条实践，不是一套单一方法突然取代旧知识。", context: "哥白尼、开普勒、伽利略、培根等人的不同研究路线", distinction: "它既改造也继承古代和中世纪资源；不应只写成反对亚里士多德的一个事件。", related: ["科学革命与经验方法", "亚里士多德"] },
  { id: "modern-fallibilism", zh: "现代可错论", en: "modern fallibilism", category: "概念", note: "认为人的知识主张原则上可能被新证据修正；承认可错不等于任何意见都同样合理。", context: "近现代认识论与科学哲学", distinction: "卡尔内阿德的可信印象可与之比较，但古代学院怀疑主义并未直接提出同一套科学方法论。", related: ["卡尔内阿德", "可信印象", "可错论"] },

  { id: "republic", zh: "《理想国》", en: "Republic", category: "著作", note: "柏拉图讨论正义、教育、灵魂结构和哲学王的核心对话。" },
  { id: "de-rerum-natura", zh: "《物性论》", en: "De rerum natura / On the Nature of Things", category: "著作", note: "卢克莱修以六卷拉丁哲学诗系统呈现伊壁鸠鲁自然学与解除恐惧的生活训练。" },
  { id: "city-of-god", zh: "《上帝之城》", en: "The City of God", category: "著作", note: "奥古斯丁以两座城的区分回应罗马衰落并重构历史意义。" },
  { id: "leviathan", zh: "《利维坦》", en: "Leviathan", category: "著作", note: "霍布斯从自然状态、契约和授权论证强大主权者。" },
];

const unique = (values: Array<string | undefined>) => [...new Set(values.filter((value): value is string => Boolean(value)))];

const seedById = new Map(seedTerminology.map((term) => [term.id, term]));
const philosopherById = new Map(philosopherProfiles.map((profile) => [profile.id, profile]));
const canonicalSeedIds = new Set([...philosopherProfiles.map((profile) => profile.id), ...schoolProfiles.map((school) => school.id)]);

const philosopherTerms: TermEntry[] = philosopherProfiles.map((profile) => {
  const seed = seedById.get(profile.id);
  return {
    id: profile.id,
    zh: profile.nameZh,
    en: profile.nameEn,
    original: profile.greekName || seed?.original,
    category: "人物",
    alternatives: unique([...(seed?.alternatives || []), seed?.zh !== profile.nameZh ? seed?.zh : undefined]),
    aliases: unique([...(profile.aliases || []), ...(seed?.aliases || []), seed?.zh !== profile.nameZh ? seed?.zh : undefined]),
    note: profile.thesis,
    context: `${profile.dates} · ${profile.active} · ${profile.places.slice(0, 2).join("、")}`,
    distinction: profile.evidenceCaution,
    related: profile.concepts.slice(0, 6).map((concept) => concept.zh),
    stars: profile.stars,
    entity: { kind: "philosopher", id: profile.id },
  };
});

const schoolTerms: TermEntry[] = schoolProfiles.map((school) => {
  const seed = seedById.get(school.id);
  return {
    id: school.id,
    zh: school.nameZh,
    en: school.nameEn,
    category: "学派",
    alternatives: unique([...(seed?.alternatives || []), seed?.zh !== school.nameZh ? seed?.zh : undefined]),
    aliases: unique([...(seed?.aliases || []), seed?.zh !== school.nameZh ? seed?.zh : undefined]),
    note: school.thesis,
    context: `${school.period} · ${school.regions.join("、")} · ${school.kind}`,
    distinction: school.classificationNote,
    related: school.philosophers.slice(0, 6).map((person) => philosopherById.get(person.id)?.nameZh || person.id),
    stars: school.stars,
    entity: { kind: "school", id: school.id },
  };
});

const conceptUses = new Map<string, Array<{ profileId: string; profileName: string; en: string; definition: string }>>();
philosopherProfiles.forEach((profile) => {
  profile.concepts.forEach((concept) => {
    const uses = conceptUses.get(concept.zh) || [];
    uses.push({ profileId: profile.id, profileName: profile.nameZh, en: concept.en, definition: concept.definition });
    conceptUses.set(concept.zh, uses);
  });
});

const seedTermNames = new Set(seedTerminology.map((term) => term.zh));
const generatedConceptTerms: TermEntry[] = [...conceptUses]
  .filter(([zh]) => !seedTermNames.has(zh))
  .map(([zh, uses]) => ({
    id: `concept-${uses[0].profileId}-${zh}`,
    zh,
    en: unique(uses.map((use) => use.en)).join(" / "),
    category: "概念",
    note: uses.length === 1 ? uses[0].definition : uses.map((use) => `${use.profileName}：${use.definition}`).join("；"),
    context: `见于${unique(uses.map((use) => use.profileName)).slice(0, 5).join("、")}页面`,
    distinction: uses.length > 1 ? "同一中译在不同人物处承担的论证功能可能不同；卡片分别保留各页面的定义，不能只按字面合并。" : undefined,
    related: unique(uses.map((use) => use.profileName)).slice(0, 6),
  }));

const placeUses = new Map<string, Array<{ profileName: string; dates: string }>>();
philosopherProfiles.forEach((profile) => {
  profile.places.forEach((placeName) => {
    if (geographyByAlias.has(placeName)) return;
    const uses = placeUses.get(placeName) || [];
    uses.push({ profileName: profile.nameZh, dates: profile.dates });
    placeUses.set(placeName, uses);
  });
});
const seedPlaceNames = new Set(seedTerminology.filter((term) => term.category === "地名").map((term) => term.zh));
const generatedPlaceTerms: TermEntry[] = [...placeUses]
  .filter(([placeName]) => !seedPlaceNames.has(placeName))
  .map(([placeName, uses]) => ({
    id: `place-${uses[0].profileName}-${placeName}`,
    zh: placeName,
    en: "",
    category: "地名",
    note: `作为${unique(uses.map((use) => use.profileName)).join("、")}生平或活动路线的一部分进入本站。`,
    context: unique(uses.map((use) => `${use.profileName}（${use.dates}）`)).slice(0, 5).join(" · "),
    distinction: placeName.includes("传统")
      ? "名称中的括注表示地点来自有待核验的传记传统，不能当作确定行程。"
      : "这是由人物资料自动生成的地点索引卡；历史政区与今天的边界未必一致，具体作用应结合人物时间线阅读。",
    related: unique(uses.map((use) => use.profileName)).slice(0, 6),
  }));

const enrichedSeedTerms = seedTerminology
  .filter((term) => !canonicalSeedIds.has(term.id))
  .map((term) => {
    const uses = term.category === "概念" ? conceptUses.get(term.zh) : undefined;
    if (!uses?.length) return term;
    return {
      ...term,
      context: term.context || `见于${unique(uses.map((use) => use.profileName)).slice(0, 5).join("、")}页面`,
      related: unique([...(term.related || []), ...uses.map((use) => use.profileName)]).slice(0, 6),
    };
  });

export const terminology: TermEntry[] = [
  ...enrichedSeedTerms,
  ...philosopherTerms,
  ...schoolTerms,
  ...generatedConceptTerms,
  ...generatedPlaceTerms,
];

export const terminologyByZh = new Map<string, TermEntry>();
terminology.forEach((term) => {
  [term.zh, ...(term.aliases || [])].forEach((alias) => {
    if (alias.length >= 2 && !terminologyByZh.has(alias)) terminologyByZh.set(alias, term);
  });
});

export const terminologyMatchers = [...terminologyByZh.keys()].sort((a, b) => b.length - a.length);
