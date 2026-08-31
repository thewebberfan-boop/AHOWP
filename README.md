# 《西方哲学史》交互学习笔记

这是一个围绕伯特兰·罗素《西方哲学史》建立的中文交互学习网站。它不按“逐章复述”组织内容，而把知识压缩成可下钻的关系结构：

> 历史阶段 → 时代问题 → 哲学流派 → 哲学家 → 概念与论证 → 原书章节

另设“问题图谱”作为跨人物的逻辑阅读层：节点只有观察、问题和答案，哲学家只作为参与者附着其上；有向边显式保存一对多和多对多的提出、回应与再生关系。当前谱系以 826 个节点和 947 条关系覆盖泰勒斯至罗素，完整纳入三卷 76 章与现有 82 位人物。最后六章由功利主义的共同后果与自由修正进入马克思的生产关系批判，再经柏格森的绵延、詹姆斯和杜威的实用探究，抵达弗雷格—罗素的现代逻辑与分析方法；终端保留逻辑、经验、历史、生活体验和公共纠错如何协作的开放问题。观察领域只在节点详情中解释；历史事件或社会变化确实改变问题条件时，可由观察节点进入历史概览并返回原阅读位置。

问题图谱保留全部原子节点与稳定 ID，同时提供“导览／主干／标准／完整／研究”五档全图阅读密度。另以“自我”开始试验主题多分辨率阅读：5个核心问题、10个主要转折、20个关键接口、全部相关节点，共四层。单击总结卡查看解释，双击或按 Enter 按 5→10→20→全部逐级展开，并选中、定位到当前卡片对应的子卡或原子节点；触屏也可使用展开按钮。五卡总览用具体问题与简明回答比较组织内容，总结节点明确标记为本站学习重构。后续主题按“方法—自然—自我—社会—终极”扩展并支持多选。

中文负责解释，中英双语主要用于人名、地名和哲学概念。网站支持本地运行、离线阅读和 Vercel 部署。

## 新电脑首次运行

需要 Node.js `>=22.13.0`；项目当前推荐版本为 `.nvmrc` 中的 `24.19.0`。

```bash
git clone <仓库地址>
cd AHOWP
npm ci
npm run dev
```

浏览器打开 [http://localhost:3000](http://localhost:3000)。

若电脑安装了 nvm，可先运行：

```bash
nvm install
nvm use
```

## 部署到 Vercel

仓库已包含 Vercel 配置（`vercel.json`、`vite.vercel.config.ts`）和 Nitro 构建依赖。将 GitHub 仓库导入 Vercel 后，Vercel 会读取配置并使用：

```text
安装命令：npm ci
构建命令：npm run build:vercel
```

Nitro 会生成 Vercel 的标准 `.vercel/output` 部署包。完成一次导入后，Vercel Git 集成会在生产分支推送时自动部署，并为 Pull Request 创建预览部署。也可以用 Vercel CLI 执行 `vercel --prod`。

## 直接打开离线阅读版

如果只想阅读，不想启动本地服务器，可以直接双击：

```text
offline-reader/index.html
```

浏览器会以 `file://` 地址打开。这个 HTML 已经内嵌网站程序和样式，但人物图片仍从同一项目的 `public/` 文件夹读取，因此不要单独移动 `index.html`；复制或同步时应保留整个项目文件夹。

离线版中的正文、搜索、弹窗、复习和本地人物图片不需要网络。OpenStreetMap 地图、图像来源及外部资料链接仍需联网。

网站内容更新后，用下面的命令重新生成离线入口，并将生成结果一起提交：

```bash
npm run build:offline
```

## 常用检查

```bash
npm run build
npm run build:offline
npm run lint
npm run audit:content
```

`package-lock.json` 是依赖版本的唯一锁定文件；请使用 `npm ci` 在新电脑恢复依赖，不要提交 `node_modules`、`.next`、`.vinext`、`dist` 或 `.wrangler`。

## 两台电脑交替工作

项目使用 [GitHub 仓库](https://github.com/thewebberfan-boop/AHOWP) 在两台电脑之间同步。开始工作前先确认本机没有未保存改动，再从 `origin` 拉取；完成一个完整功能后，构建、更新进度文件、提交并推送。不要让两台电脑同时修改同一分支。

详细步骤见 [docs/MULTI_MACHINE_WORKFLOW.md](docs/MULTI_MACHINE_WORKFLOW.md)。Codex 在任何一台电脑接手时应先阅读 [AGENTS.md](AGENTS.md) 和 [docs/PROJECT_STATUS.md](docs/PROJECT_STATUS.md)。

若需要完整复刻现有产品而不依赖聊天记录，请再阅读 [docs/SYSTEM_SPEC.md](docs/SYSTEM_SPEC.md)。它记录首页双入口与本机续读状态、当前所有页面模式、顶部导航默认进入人物／流派图谱、Section 01—06、搜索、星级、返回链、滚动位置恢复、离线构建和视觉响应式约束。继续扩展问题图谱前必须阅读 [docs/PROBLEM_MAP_GUIDE.md](docs/PROBLEM_MAP_GUIDE.md)，其中记录内容语法、证据等级、稳定 ID、状态模型、多谱系前置改造和逐步验收清单。

## 主要文件

- `app/page.tsx`：页面模式、导航和主要交互组件。
- `app/globals.css`：全站视觉系统与响应式布局。
- `app/book-data.ts`：罗素原书三卷、各章与已有章节笔记。
- `app/russell-structure-data.ts`：基于罗素目录重构的“阶段—流派—人物—章节”关系。
- `app/school-data.ts`：流派页类型、8 个古代流派／传统页、星级，以及全站流派汇总入口。
- `app/school-data-medieval.ts`：第二卷 9 个教父、修道、伊斯兰、犹太与经院传统页。
- `app/school-data-modern.ts`：第三卷 15 个现代问题传统、知识网络与方法转型页；明确标注不属于严格学派的分类边界。
- `app/history-data.ts`：历史概览、事件、时代问题和关系复习数据。
- `app/problem-map-data.ts`：问题谱系、思想动作、逻辑连接、参与人物和原书章节关系。
- `app/problem-map-view-data.ts`：五档阅读密度、问题家族锚点、历史背景带、解释边界与并行答案扇面配置；不改写原子节点。
- `app/problem-map.tsx`：完整宽度的确定性有向问题图谱；节点详情固定在左侧，不使用阶段索引或自由漂浮的力导向布局。
- `app/problem-map-modern-data.ts`：第三卷问题图谱汇总、早期近代阶段和来源；当前整体覆盖第三卷全部三十一章。
- `app/problem-map-enlightenment-data.ts`：第三卷第十至十六章的理性主义、自由主义、洛克和贝克莱问题节点、关系与来源。
- `app/problem-map-hume-data.ts`：第三卷第十七章休谟的经验来源、因果与归纳、自我、自由、奇迹证据和缓和怀疑问题节点、关系与来源。
- `app/problem-map-romantic-kant-data.ts`：第三卷第十八至二十章的浪漫主义、卢梭与康德问题节点、汇合关系、解释边界和来源。
- `app/problem-map-idealism-will-data.ts`：第三卷第二十一至二十五章的十九世纪思潮、黑格尔、拜伦、叔本华与尼采问题节点、关系与来源。
- `app/problem-map-completion-data.ts`：第三卷第二十六至三十一章的功利主义、马克思、柏格森、詹姆斯、杜威与逻辑分析问题节点、关系与来源。
- `app/philosopher-data.ts`：哲学家资料页的数据结构与内容。
- `app/philosopher-data-medieval.ts`：第二卷 24 位人物的结构化资料、关系、星级和来源。
- `app/philosopher-data-modern.ts`：第三卷 29 位人物的结构化资料、关系、星级和来源。
- `app/d3-force-graph.tsx`：可复用的 D3.js 力导向图、拖拽、缩放、复位与节点聚焦。
- `app/philosopher-graph.tsx`、`app/school-graph.tsx`：各自的关系数据适配、历史分组图谱和详情下钻。
- `app/terminology-data.ts`：由人物、流派、概念和活动地点主数据汇总的知识卡与行内识别。
- `app/geography-data.ts`：地点、历史语境和地图数据。
- `docs/CONTENT_STYLE_GUIDE.md`：自然汉语、规范译名、星级篇幅、关系证据和知识卡的全站内容规范。
- `docs/PROBLEM_MAP_GUIDE.md`：问题图谱的内容模型、首条谱系基线、代码接点、续写方式、多谱系改造和跨电脑接手清单。
- `scripts/audit-content.ts`：内容覆盖、关系方向、卡片生成、名称冲突和篇幅分层的自动审计。
- `visual-archive/figures.json`：人物图像来源、许可和证据说明。
- `public/visual-archive/figures/`：网站使用的本地人物图像。
- `offline/`：离线阅读版的构建入口与配置。
- `offline-reader/index.html`：可直接双击的生成版阅读入口。

## 内容原则

- 罗素原书是叙述主轴，但罗素的评价必须与一般史实、现代研究和学习性重构分开。
- 不把“观点相似”写成“直接影响”；人物传承关系须区分影响后继与承接前人，并与同题比较、批评关系、后世重构分开。
- 哲学家页面优先呈现“研究对象 → 逻辑起点 → 推导步骤 → 概念 → 结论”，避免写成连续小传。
- 古代和中世纪人物的年代、轶事和肖像常不可靠，页面必须保留证据等级与图像说明；当前 82 位人物中 81 位已有许可与来源记录，罗瑟林仍明确保留图像缺口。
- 每次增加内容时优先保证信息密度、信息质量和结构复用，而不是机械追求统一字数。
