# 问题图谱：内容模型、实现边界与续作手册

本文是“问题图谱”的独立接手文档。目标是让另一台电脑上的开发者或 AI 在不依赖聊天记录的情况下，能够理解为什么要做这一层、现有页面如何工作、怎样安全扩展下一条谱系，以及哪些内容边界不能被破坏。

如本文与代码冲突，以当前仓库代码、`docs/PROJECT_STATUS.md` 和用户最新指令为准。产品的完整交互规格仍见 `docs/SYSTEM_SPEC.md`；跨电脑环境恢复见 `docs/MULTI_MACHINE_WORKFLOW.md`。

## 1. 为什么需要问题图谱

历史阶段仍是全站的首要骨架，哲学流派和哲学家仍是主要下钻对象。问题图谱不是替代它们，而是增加一个跨人物的逻辑阅读层：

`经验中的异常或差异 → 问题 → 概念区分 → 回答 → 反驳或压力 → 修复 → 新问题`

这个结构表达的是“为什么下一步值得出现”，而不是“下一位哲学家是谁”。哲学家不应成为图谱节点；他们是附着在问题或思想动作上的参与者，角色可以是提出、回答、反驳、修复、转向或后世重构。

这一层要解决三个学习问题：

1. 避免把哲学史记成孤立的人名和观点清单。
2. 把相隔多个章节、却处理同一困难的思想重新连接起来。
3. 同时保留逻辑连续性与历史证据边界，不把本站为了教学建立的推演伪装成师承或直接影响。

## 2. 当前已交付的基线

顶部导航“哲学家”之后已有独立“问题图谱”入口。当前只交付一条完整试验谱系：

- 谱系 ID：`difference-change-knowledge`
- 标题：从差异与变化到可知的形式
- 范围：第一卷，泰勒斯至柏拉图
- 逻辑阶段：5 个
- 思想节点：19 个
- 结束位置：柏拉图的理念与个别物关系问题，并明确指向亚里士多德的形式、质料、实体、潜能与现实

五个阶段及稳定 ID 如下：

| 顺序 | 阶段 ID | 页面标签 | 核心推进 |
| --- | --- | --- | --- |
| 01 | `encounter-difference` | 起点 | 区分多样、变化与对立，不把“不同”当成一个问题 |
| 02 | `generate-difference` | 第一次分叉 | 比较材料变化、比例关系和对立过程三条路线 |
| 03 | `eleatic-pressure` | 逻辑危机 | 用存在、运动和多样的逻辑困难反压经验常识 |
| 04 | `preserve-and-recombine` | 多元论修复 | 让基本构成保持不变，以结合、分离、位置和比例重写变化 |
| 05 | `from-perception-to-knowledge` | 认识论转向 | 从性质与感觉的关系推进到定义、知识对象和理念 |

现有 19 个节点的稳定 ID 是：

```text
difference-as-observation
difference-derived-or-original
order-not-arbitrary-agency
one-source-many-states
opposites-and-process
difference-as-ratio
change-as-order
being-from-nonbeing
stable-being
test-motion-and-plurality
change-as-reconfiguration
roots-love-strife
mixture-nous-separation
atoms-void-arrangement
perception-as-event
appearance-relative-to-perceiver
definition-beyond-instance
stable-object-of-knowledge
forms-and-particulars
```

不要随意改动已经发布的谱系、阶段或节点 ID。它们用于页面锚点、恢复阅读位置、搜索定位和未来可能的跨谱系连接。修改可见标题不要求修改 ID。

## 3. 内容语法

### 3.1 节点类型

`ProblemNodeKind` 当前允许八种思想动作：

| 类型 | 使用条件 |
| --- | --- |
| 观察 | 尚未给出理论，只确定需要解释的经验现象 |
| 问题 | 把含混现象改写成可回答的困难或分叉 |
| 区分 | 拆开此前混在一起的对象、层次或判断 |
| 回答 | 给出正面解释方案，但不暗示它已经充分成立 |
| 反驳 | 揭示既有回答的矛盾、遗漏或不可承受后果 |
| 修复 | 接受部分压力后重写原方案，以保存其解释目标 |
| 转向 | 改变问题中心、对象或方法，例如从自然构成转向知识条件 |
| 开放问题 | 明确保留尚未解决、并能引出下一阶段的解释负担 |

不要用节点类型表示人物身份或时代。一个节点只承担一个主要思想动作；若同一段文字同时出现重大区分、回答和反驳，应拆成多个节点。

### 3.2 连接与证据等级

每个非首节点通过 `relationFromPrevious` 描述“为什么从前一步来到这里”，并必须选择一个 `ProblemConnectionKind`：

| 连接类型 | 含义 | 写作限制 |
| --- | --- | --- |
| 原书线索 | 罗素的章节安排或评价提供叙述线索 | 只说明罗素如何组织，不自动等于现代学界共识 |
| 历史回应 | 有较强史料或研究理由视为对既有困难的回应 | 应能由原书、原始文献或权威研究支持 |
| 同题并列 | 处理相近问题，但不主张直接影响 | 不使用“继承”“导致”等强因果词 |
| 本站推演 | 为降低理解成本建立的逻辑连接 | 明说这是学习重构，不能冒充哲学家本人的论证 |
| 后世重构 | 用较晚概念重新看见较早问题 | 防止概念倒灌，正文要说明回看性质 |

`relationFromPrevious` 是短标签，例如“接受埃利亚约束”“寻找共同尺度”；`connection` 是证据性质。两者不能互相替代。

### 3.3 节点必须回答的四件事

每个 `ProblemNode` 必须具有以下四层内容：

1. `title`：这一步完成了什么思想动作。
2. `summary`：用自然中文说明观点或区分，不写成长篇人物小传。
3. `pressure`：为什么前一步还不够，也就是页面上的“为什么推进到这里”。
4. `consequence`：这一步解决了什么，又制造了什么，也就是“它又打开什么”。

如果 `pressure` 只是重复标题，或 `consequence` 没有产生可继续追问的负担，这个节点通常还没有写好。

### 3.4 参与人物

`participants` 只记录谁在这个思想位置上承担了什么角色：

```ts
{
  name: "巴门尼德",
  philosopherId: "parmenides",
  role: "把自然问题改写为存在条件问题",
}
```

- `name` 是页面可见中文名。
- `philosopherId` 必须对应现有 `philosopherProfiles`；存在时页面可进入人物详情。
- `role` 说明该人物在这个节点做了什么，不能只重复姓名或流派。
- 没有本站人物页时省略 `philosopherId`，界面会明确显示“人物页待补”。当前例子是埃利亚的芝诺。
- 不为让页面更热闹而附加人物；参与关系必须能由节点内容或来源说明。

哲学家在不同节点可以重复出现，因为同一人物可以先提出问题、再给出修复。这里不是人物去重清单。

### 3.5 原书章节与来源

`chapterIds` 必须引用 `app/book-data.ts` 中真实存在的章节 ID。节点可连接多个章节，但这些章节都应对当前思想动作有直接阅读价值。

`ProblemMap.sources` 是整条谱系的研究来源，不要求为每个节点重复列出相同资料。优先顺序是：

1. 罗素原书，作为本站叙述主轴；
2. 原始文献或权威版本；
3. SEP、IEP、大学、学术出版社等现代研究；
4. 本站为教学建立的推演，必须使用对应连接标签明确标示。

外部来源保留可点击 URL 和一句用途说明。不要把罗素的评价、后世解释或有争议的归因写成无条件事实。

## 4. 数据结构与代码位置

核心数据在 `app/problem-map-data.ts`：

```ts
type ProblemMap = {
  id: string;
  title: string;
  english: string;
  period: string;
  thesis: string;
  scopeNote: string;
  phases: ProblemPhase[];
  sources: ProblemMapSource[];
};

type ProblemPhase = {
  id: string;
  order: number;
  label: string;
  title: string;
  question: string;
  transition: string;
  nodes: ProblemNode[];
};

type ProblemNode = {
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
```

相关实现文件：

- `app/problem-map-data.ts`：类型、连接说明、谱系内容和 `problemMaps` 汇总数组。
- `app/problem-map.tsx`：稳定的方向性阅读页面、阶段观察、人物与章节入口。
- `app/page.tsx`：`problems` 模式、会话恢复、搜索、桌面侧栏、手机轨道和返回链。
- `app/globals.css`：问题图谱的纸张视觉、阶段、节点、证据标签和响应式布局。
- `scripts/audit-content.ts`：ID、引用和必填逻辑字段审计。
- `tests/rendered-html.test.mjs`：顶部入口、模式样式和图谱数据完整性测试。
- `offline-reader/index.html`：由 `npm run build:offline` 生成的离线交付文件，不可手工编辑。

## 5. 页面交互与状态模型

问题图谱已经进入全站单页状态模型：

- `Mode` 包含 `"problems"`。
- 当前第一条谱系的阶段保存在 `problemPhaseId`。
- 旧版 `localStorage` 会话缺少该字段时，由 `validProblemPhaseId` 回退到第一阶段。
- `pendingProblemTargetId` 用于搜索结果或恢复操作后的精确节点定位。
- 页面滚动时，`IntersectionObserver` 更新当前阶段；桌面侧栏和手机轨道随之同步。
- 点击顶部“问题图谱”回到当前保存阶段，而不是强制抹掉进度。

从问题节点进入哲学家页时，`InlineEntityOrigin` 保存来源模式、`problemPhaseId`、既有返回链和精确 `scrollY`。从节点进入原书章节时，`ChapterOrigin` 保存同样的问题阶段与滚动坐标。使用特制返回按钮后，必须恢复原谱系位置；不要把返回改成简单的浏览器历史后退。

`localStorage` 只属于当前浏览器，不进入 Git，也不会在两台电脑之间同步。代码与文档可以跨电脑同步，个人阅读位置不能。

## 6. 桌面、手机与视觉原则

问题图谱必须保持可阅读的方向性结构，不使用 D3 力导向图。人物图谱和流派图谱适合探索复杂关系，而问题图谱必须让读者稳定地看见论证压力和下一步。

- 桌面：左侧显示五个逻辑阶段，正文顶部另有置顶阶段导航。
- 手机竖屏（760px 及以下）：隐藏完整侧栏，改用横向滑动、滚动吸附的阶段轨道；正文继续纵向展开。
- 阶段变化和位置恢复不播放动画，延续全站“无动画横划”的交互感。
- 颜色只使用现有纸张、墨色、暗红、深绿和浅绿变量。
- 小字必须可读，减少装饰性留白；长中文和双语标签不得溢出卡片。
- 证据标签与节点类型必须同时可见，不能只靠颜色表达。

## 7. 搜索行为

全站搜索已经索引：谱系中英文标题、阶段标签、阶段标题、阶段问题、阶段过渡、节点类型、节点标题、摘要、逻辑压力、后果、连接标签、参与人物及其角色。

搜索问题图谱结果时，应进入 `problems` 模式、恢复对应阶段，再定位到具体节点。新增字段若承担重要检索含义，需要同步扩展 `app/page.tsx` 的问题图谱搜索文本；不要只让新内容在页面可见却无法搜索。

## 8. 如何新增内容

### 8.1 扩展现有谱系

当前最自然的续写点是 `forms-and-particulars`。建议先增加“亚里士多德如何把形式放回具体实体”的下一阶段，依次检查：

1. 形式与质料是否解决理念与个别物的分离；
2. 实体如何在变化中保持同一；
3. 潜能与现实如何重写“从不存在到存在”的困难；
4. 四因说如何区分材料、结构、动力和目的；
5. 这一修复又怎样打开灵魂、知识、伦理和第一推动者问题。

续写时先读对应原书章节与现代校正资料，再定义阶段压力。不要先列哲学家，再为每个人倒填节点。

### 8.2 新增一条谱系

当前 `problemMaps` 数组的数据层已经允许多条谱系，但页面尚未真正支持谱系切换：`ProblemMapView` 和 `app/page.tsx` 仍直接引用 `ancientDifferenceProblemMap`。因此新增第二条谱系前，必须先补以下产品状态：

1. 在学习会话中增加并校验 `problemMapId`。
2. `ProblemMapView` 改为接收选中的 `ProblemMap`，不再内部写死第一条谱系。
3. 桌面侧栏和手机轨道增加谱系选择层，同时避免把“谱系”和“阶段”混成同一级卡片。
4. 搜索结果保存 `problemMapId + phaseId + nodeId`。
5. `InlineEntityOrigin`、`ChapterOrigin` 和续读首页保存 `problemMapId`。
6. 老会话缺少字段时回退到 `difference-change-knowledge`。
7. 审计与测试覆盖多谱系 ID 唯一性和恢复行为。

在这层状态完成前，不要把第二条谱系的数据偷偷并入第一条谱系，也不要只向 `problemMaps` 追加对象后误以为页面会自动显示。

### 8.3 推荐的全书主干

以下只是工作假设，不是已经确认的栏目。实际扩展应根据阅读反馈调整：

- 世界如何变化又保持可理解：本原、存在、形式、因果、自然法则。
- 体验如何成为知识：感觉、记忆、判断、怀疑、理性、经验与语言。
- 什么是好的生活：德性、快乐、欲望、意志、义务、价值。
- 人为什么共同生活：城邦、法律、权力、自由、财产、历史与制度。
- 神、自然与人的位置：创世、必然、目的、恶、信仰与理性。

这些主干可以分叉和重合。不要为了覆盖“所有哲学家”而强迫每个人进入每条谱系；目标是覆盖重要问题压力，不是完成人名点名。

## 9. 每轮内容工作的推荐顺序

1. 明确本轮要解决的开放问题和预计终点。
2. 阅读罗素对应章节，记录他的叙述顺序和评价。
3. 用权威资料校正争议归因、术语倒灌和直接影响关系。
4. 先写阶段的 `question` 与 `transition`，再写节点。
5. 为每个节点补齐 `pressure` 与 `consequence`。
6. 逐条选择连接证据类型，不默认使用“历史回应”。
7. 最后附着参与人物、原书章节和来源。
8. 检查页面密度、手机溢出、搜索命中和返回链。
9. 运行自动检查并重新生成离线入口。
10. 更新 `docs/PROJECT_STATUS.md`，形成一个聚焦提交；只有用户明确要求时才推送远端。

## 10. 禁止的捷径

- 不把哲学家重新做成节点，也不把页面改成自由漂浮的关系网。
- 不按原书目录或人物年代机械串联；逻辑推进必须写明“为什么”。
- 不把观点相似写成直接影响，不把本站推演写成历史事实。
- 不用后世术语替古人说话而不标“后世重构”。
- 不复制人物页的大段生平或完整观点；问题节点只保留推动链条所需的内容。
- 不为保持每阶段相同数量而拆分或合并节点。
- 不创建空谱系、无来源谱系或只有人物标签而没有逻辑压力的节点。
- 不手工编辑 `offline-reader/index.html`。

## 11. 自动检查与人工验收

完成逻辑或内容变更后运行：

```bash
npm run lint
npm run build
npm run audit:content
npm run build:offline
npm test
git diff --check
```

当前已验证基线是：vinext 构建通过、离线 Vite 构建通过、内容审计 0 错误 0 警告、测试 2/2 通过；ESLint 为 0 错误，并保留 7 条既有原生 `<img>` 警告。内容审计应输出“问题图谱 1：5 个阶段、19 个节点”。

人工阅读至少确认：

- 只看标题、`pressure` 和 `consequence`，是否能说出整条推进链；
- 人物拿掉后，问题链是否仍成立；
- 每条连接的证据标签是否诚实；
- 从节点进入人物或章节后，是否能返回原来的纵向位置；
- 760px 以下是否能靠滑动切换阶段，正文和标签是否溢出；
- 新内容是否能被全站搜索命中。

项目约定禁止在用户未要求时擅自截图或做屏幕 capture；至少必须通过构建。需要视觉检查时优先使用项目内嵌浏览器，并在用户授权范围内进行。

## 12. 另一台电脑的接手清单

上一台电脑完成提交并推送后，在接手电脑：

1. 阅读 `AGENTS.md`、`README.md`、`docs/PROJECT_STATUS.md`、`docs/SYSTEM_SPEC.md`、本文和 `docs/MULTI_MACHINE_WORKFLOW.md`。
2. 运行 `git status --short`；有输出时先确认归属，不覆盖、不清理。
3. 运行 `git log --oneline -5`，确认最新问题图谱提交已经存在。
4. 工作树干净后运行 `git pull --ff-only origin main`。
5. 按 `docs/MULTI_MACHINE_WORKFLOW.md` 在 OneDrive 外重建 `node_modules` 与 `dist` 链接。
6. 运行 `npm run build`、`npm run audit:content` 和 `npm test`，确认基线一致。
7. 若继续第一条谱系，从 `forms-and-particulars` 开始；若要新增第二条谱系，先实现第 8.2 节的谱系选择状态。

Git 会同步代码、知识数据、文档、图片和离线入口；不会同步浏览器 `localStorage`、Codex 聊天、开发服务器进程、本机依赖、Vercel 登录状态或未提交改动。
