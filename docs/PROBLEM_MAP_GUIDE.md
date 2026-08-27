# 问题图谱：内容模型、实现边界与续作手册

本文说明“问题图谱”为什么存在、怎样用三类节点组织材料，以及另一台电脑如何在不依赖聊天记录的情况下继续扩展。图负责表达节点之间的来路与去向，节点详情区不重复列出邻接节点。

## 1. 目标：把哲学史读成问题网络

历史阶段仍是全站首要骨架，流派和哲学家仍是主要下钻对象。问题图谱提供另一种阅读尺度：

> 人们观察到什么 → 为什么必须提问 → 有哪些并行或竞争答案 → 每个答案又留下什么新问题。

这不是一条单线思想进化史。一个观察可以提出多个问题，一个问题可以得到多个答案，一个答案可以产生多个新问题；同一问题也可能同时承接若干较早答案留下的压力。底层结构因此是有向、多对多的关系图，而不是按人物或阶段排列的卡片列表。

哲学家只是节点的历史参与者；图的节点只有观察、问题与答案。

## 2. 方法来源与本站取舍

这一组织法与几种已有传统相邻：问题史把哲学史组织为问题及回答的延续；柯林武德的“问答逻辑”强调必须以问题理解答案；杜威、波普尔和劳丹分别把探究或知识推进理解为问题、试探性答案、批评及新问题；IBIS 等问题映射方法则证明了问题与回应适合用图数据表达。

本站不照搬其中任何一套体系。尤其要避免把不同年代的问题误写成永恒不变的同一问题，也不把现代会议决策语法直接套在哲学史上。本站只吸收三项共同洞见：

- 用问题而非人物名单组织跨时代比较；
- 用显式有向边保留一对多和多对多关系；
- 用证据等级区分历史回应与编辑性重建。

参考入口：

- [SEP · Wilhelm Windelband](https://plato.stanford.edu/entries/wilhelm-windelband/)
- [SEP · Robin George Collingwood](https://plato.stanford.edu/entries/collingwood/)
- [SEP · John Dewey](https://plato.stanford.edu/entries/dewey/)
- [Karl Popper · Science: Conjectures and Refutations](https://www.marxists.org/reference/subject/philosophy/works/at/popper.htm)
- [Rittel & Webber · Dilemmas in a General Theory of Planning](https://escholarship.org/uc/item/5cj786v8)

## 3. 三类节点

`ProblemNodeKind` 只允许三类。

### 观察

观察是尚未由图内其他答案产生的问题来源，例如经验差异、历史处境、实践冲突或语言现象。它不是“无理论的纯事实”，必须写清看见了什么，以及它为何形成解释压力。

观察只通过“提出问题”指向问题，当前模型不允许其他节点指向观察。

每个观察还必须保存 `observation.domain` 与 `observation.note`。领域目前可用“自然经验、个体体验、社会与制度、历史变化、知识实践”；它只在点击节点后的详情中显示，不进入 SVG 节点，以免把主图变成标签墙。若一项历史事件、制度变化或公共实践确实改变了问题条件，可在 `observation.historyLinks` 中保存阶段、同期回应及可选事件 ID。历史链接是语境入口，不等于该事件单独造成了后续哲学结论。

### 问题

问题是需要回答的困难、张力或解释要求。它可以由一个或多个观察提出，也可以由一个或多个答案产生。开放问题仍使用“问题”类型；是否已有回答由边决定。

写问题时必须区分历史人物确实提出的问题、原书可合理重建的问题，以及本站为比较而归纳的“问题家族”。文字相似不等于两个时代的人在回答完全相同的问题。

### 答案

答案是对问题的具体回应，必须至少有一条来自问题的“回应问题”边。`answerRole` 记录主要回答动作：`提出`、`区分`、`反驳`、`修复`、`转向`或`综合`。这些是元数据，不是新节点类型。

答案通常会产生新问题，但不强制每条支线都在当前图中继续。若史料或当前范围不足，应让问题保持开放，不能为了图形对称而发明联系。

## 4. 三种逻辑关系

| 起点 | 终点 | 关系 | 含义 |
| --- | --- | --- | --- |
| 观察 | 问题 | 提出问题 | 经验或处境为何迫使人提问 |
| 问题 | 答案 | 回应问题 | 方案具体回应哪项解释要求 |
| 答案 | 问题 | 产生问题 | 答案留下什么代价、矛盾或新任务 |

没有“答案 → 答案”捷径。若一个理论批评或修复另一个理论，必须显式写出两者共同面对、或前一答案产生的问题。

每条边还要保存简短的 `label` 和证据性质 `connection`。

## 5. 连接证据等级

`ProblemConnectionKind` 保留五类：

- `原书线索`：罗素正文直接给出或强烈暗示；
- `历史回应`：有充分材料支持后者回应前者；
- `同题并列`：可放在同一问题下比较，但不声称直接影响；
- `本站推演`：为了揭示逻辑压力而作的编辑性重建；
- `后世重构`：主要由后世作者或现代研究者组织出来。

逻辑关系和证据性质是两个维度，界面必须同时保留，不能把所有箭头都误读成真实影响史。

## 6. 当前基线

当前只有一条由整部第一卷继续推进至第二卷前九章的谱系：

- ID：`difference-change-knowledge`
- 标题：从多样与变化到理性、改革与双重权威
- 范围：第一卷全部 30 章，并继续到第二卷第一至九章；泰勒斯至爱留根纳与十一世纪教会改革
- 数据维护分组：13 个
- 节点：128 个，其中观察 20、问题 52、答案 56
- 有向边：162 条
- 人物覆盖：现有第一卷 29 位人物全部至少连接一个节点；第二卷的斐洛、奥利金、安布罗斯、哲罗姆、奥古斯丁、波爱修斯、本尼狄克、大格列高利、爱留根纳全部进入图谱
- 章节覆盖：`b1-01` 至 `b1-30`、`b2-01` 至 `b2-09` 全部至少连接一个节点

十三个分组只服务数据维护与搜索定位，不再作为页面导航或用户必须接受的哲学分类。页面直接展示完整关系图。内容审计会把第一卷章节与人物，以及第二卷前九章和九位参与人物的覆盖作为硬约束；增加人物或章节后若没有进入谱系，审计必须报错。

已发布的稳定节点 ID 均须保留。当前观察层除早期的 `difference-as-observation`、`change-over-time-observation` 与 `same-thing-different-appearance` 外，还新增：

- `conditional-change-observation`：相似条件经常伴随相似变化；
- `recurring-change-observation`：变化持续、往复或周期性重复；
- `persistent-process-observation`：构成更替而过程仍被认作同一；
- `public-disagreement-observation`：公共生活中相互冲突的判断同时争夺有效性，并关联雅典民主、帝国与公共辩论扩张的历史概览。
- `organized-life-observation`：比较生命组织、器官与活动能力，提出完整原因问题；
- `actions-aim-goods-observation`：从局部目标与整段生活的差异提出幸福问题；
- `constitutions-shape-character-observation`：制度培养习惯、角色与善的想象；
- `polis-autonomy-collapse`：城邦仍存在，却不再是个人能够共同掌控的最高世界；
- `imperial-law-observation`：不同民族与角色进入共同法律空间；
- `imperial-vulnerability-observation`：帝国秩序不能取消苦难、死亡与意义危机。
- `scriptural-history-observation`：经文共同体把律法、苦难与盼望保存为有方向的历史，并关联教父时期的“保罗、约翰与早期教会”回应；
- `church-imperial-observation`：基督教成为帝国宗教后，教义、圣礼与政治强制取得共同后果，并关联狄奥多西时期的历史事件。
- `western-institutions-fragment-observation`：西罗马皇权、城市学校和公共行政失去统一连续性，并同时关联西罗马瓦解与早期中世纪教会秩序；
- `routine-shapes-desire-observation`：日常作息和共同关系持续塑造欲望与注意；
- `different-people-need-different-care-observation`：同一措施面对不同处境可能产生不同效果，要求制度拥有差别施教能力。
- `carolingian-learning-revival-observation`：宫廷、修院和学校重新汇集文本、翻译与逻辑训练，使不同权威解释进入可比较的知识实践；
- `office-property-appointment-entanglement-observation`：圣职同时牵涉土地、效忠和灵性职能，使任命不再只是教内事务。

其他重要的稳定节点包括：

- `identity-through-change`
- `change-source-and-continuity`
- `rarefaction-condensation`
- `motion-and-plurality-possible`
- `what-does-perception-reveal`
- `common-standard-of-judgment`
- `what-stabilizes-knowledge`
- `what-does-nous-explain`
- `immanent-form-matter`
- `potentiality-actuality`
- `virtue-as-rational-activity`
- `how-live-uncontrollable-world`
- `can-impression-certify-truth`
- `cosmopolis-common-reason`
- `one-intellect-soul`
- `reason-or-divine-aid`
- `logos-layered-exegesis-text`
- `evil-privation-disordered-will`
- `grace-heals-divided-will`
- `created-time-and-two-cities`
- `can-salvation-community-survive-empire`
- `eternal-present-knows-contingently`
- `logic-translation-curriculum`
- `stability-prayer-work-reading`
- `pastoral-care-discernment-humility`
- `papal-monastic-network-order`
- `who-reforms-preserving-church`
- `true-reason-true-authority-agree`
- `fourfold-nature-theophany-return`
- `two-orders-mutual-limitation`
- `how-new-knowledge-enters-reformed-order`

不要轻易改动已发布的谱系、分组或节点 ID；页面状态、搜索和将来的学习记录会依赖它们。

## 7. 数据与页面结构

主要代码接点：

- `app/problem-map-data.ts`：谱系、分组、节点、边与来源；
- `app/problem-map.tsx`：确定性 SVG 图、节点选择、详情与下钻；
- `app/page.tsx`：全站模式、搜索、返回链与滚动恢复；
- `app/globals.css`：图谱视觉与响应式布局；
- `scripts/audit-content.ts`：节点与边的结构审计。

每个节点保存 `graph: { row, lane }`。这两个值是编辑确定的阅读布局，不表达精确年代或重要性。

第一层把自然经验拆为五个可重叠的观察维度：并存多样、时间中的状态变化、条件与结果的可重复关联、持续／往复／周期模式，以及构成更替时仍被认作同一的过程。拆分是为了让每种经验压力分别连向同一、动力或秩序问题；“因果”和“自然规律”仍属于后续问题与答案，不能预先塞进观察节点。

观察在整张图中反复作为检查点重新进入：爱奥尼亚知识网络关联自然差异，雅典公共生活关联共同判断，生物研究关联组织与功能，政体比较关联好生活，马其顿征服关联个人伦理，罗马法律关联世界城邦，三世纪危机关联内向与超越。历史概览不是被复制进图谱；只有确实改变问题条件的事件或制度才成为观察或历史入口。

十三个维护分组的逻辑范围如下：

1. 并存多样、时间变化、条件关联、周期与过程持续；
2. 米利都、毕达哥拉斯与赫拉克利特的自然内部解释；
3. 巴门尼德和埃利亚压力；
4. 多元论、努斯与原子论的重新配置；
5. 感觉、共同标准、柏拉图知识论、灵魂、政治与宇宙论；
6. 亚里士多德的实体、潜能—现实、四因、逻辑与科学说明；
7. 幸福、德性、实践智慧、城邦与政治脆弱性；
8. 犬儒、怀疑、伊壁鸠鲁和斯多葛的竞争性治疗；
9. 认知印象、悬置、实践依据、责任、友谊契约与世界城邦；
10. 罗马帝国的内向化、普罗提诺的太一—精神—灵魂以及通往第二卷的开放问题。
11. 犹太历史伦理、创造与普世救赎、斐洛—奥利金—哲罗姆的解释工具、安布罗斯的政教边界，以及奥古斯丁的恶、意志、恩典、时间与两座城；终端问题开放给修道与教牧制度。
12. 西罗马制度断裂、波爱修斯的命运—天意—自由与逻辑传输、本尼狄克的稳定规程，以及大格列高利的差别教牧和教皇网络；终端问题开放给教会腐化与改革。
13. 加洛林知识复兴使理性进入权威解释内部，由爱留根纳的自然四分、神显与否定神学检验超越和创造；圣职、土地与政治任命的纠缠则推动教会改革与授职冲突，最终以精神—世俗双重秩序的相互限制，开放跨语言新知识如何进入学校和权威体系的问题。

页面使用一张确定性 SVG 有向图，不是纵向文字列表，也不是自由漂浮的 D3 力导向图：刷新后空间关系保持稳定，分叉和汇合可以直接看见。图按正文可用宽度完整呈现，不使用横向滚动；整个页面只保留纵向阅读。边的说明文字保存在数据中，不直接覆盖在 SVG 连线上。左侧固定区显示当前节点的摘要、压力、后果、参与者、流派和原书章节；观察节点另显示领域说明，以及存在可靠语境时的历史概览入口。来路与去向只由图中有向边表达，左侧不重复邻接节点，也不显示十三个维护分组。

## 8. 状态、搜索与返回

- `mode = "problems"`；
- `problemPhaseId` 暂时保留为兼容旧会话和搜索定位的内部字段，不再驱动可见阶段导航；
- `problemNodeId` 保存当前节点，进入人物、流派、章节或历史概览后仍可精确恢复；
- 从节点进入人物或章节前保存图谱来源和窗口位置；
- 返回后恢复图谱与原来的阅读位置；
- 从历史观察进入历史概览时保存 `problemHistoryOrigin`；历史页显示专用返回条，恢复原节点和纵向位置；
- 搜索覆盖节点正文、答案角色、观察领域与说明、历史链接、参与者，以及边的关系、标签和证据类型。

添加第二条谱系前必须先引入 `problemMapId`，同步改造本地恢复、搜索定位和返回来源，不能只向数组追加对象。

## 9. 扩展步骤与内容边界

1. 先列观察、问题和候选答案，不急着画边。
2. 核对每个问题来自哪些观察或旧答案，不把年代先后自动写成“回应”。
3. 核对每个答案回应什么、解决什么、又留下什么。
4. 添加多对多边，为每条边写标签和证据性质。
5. 把人物作为参与者挂到节点，不把人物变回节点。
6. 添加原书章节与可靠来源，争议性归因必须显式降格。
7. 最后安排 `row` 与 `lane`，优先减少交叉并保留从上到下的方向。
8. 同步搜索、文档、审计和离线包。

不得把后世概括写成当事人原话，不得把本站推演伪装成历史影响，不得为了视觉整齐制造不存在的问题，也不得把图退回单线列表或随机漂移的力导向布局。

## 10. 审计与验收

每轮相关修改至少运行：

```bash
npm run audit:content
npm test
npm run lint
npm run build
npm run build:offline
```

内容审计必须验证 ID 唯一、边端点存在、三种方向与关系匹配、答案具有 `answerRole`、每个观察具有领域元数据且没有入边、历史链接指向存在的阶段／回应／事件、答案至少有问题入边、问题至少由观察或答案提出；第一卷 30 章和现有 29 位第一卷人物，以及第二卷第一至九章和九位参与人物还必须全部被谱系覆盖。当前基线应为 1 条谱系、13 个维护分组、128 个节点、162 条边。

真实浏览器还要检查：三类节点与箭头方向能否一眼分辨；分叉、汇合和长边是否可理解；节点详情是否在左侧同步更新；桌面是否没有横向滚动；人物／章节下钻及返回是否可靠；手机上图与详情是否仍可阅读。

## 11. 跨电脑接手

另一台电脑依次阅读 `AGENTS.md`、`README.md`、`docs/PROJECT_STATUS.md`、`docs/SYSTEM_SPEC.md`、本文和 `docs/MULTI_MACHINE_WORKFLOW.md`，再确认 `git status --short --branch`、最近提交和内容审计基线。Git 不同步浏览器 `localStorage`、开发服务器进程或未提交修改。
