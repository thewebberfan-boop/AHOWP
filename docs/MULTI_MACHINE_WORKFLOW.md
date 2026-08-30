# 两台电脑与两个 Codex 的交替工作流程

目标是让仓库本身承载项目记忆，避免依赖某一台电脑的聊天记录、开发目录或 Codex 本地状态。

## 一次性准备

两台电脑使用同一个 GitHub 仓库同步代码：`https://github.com/thewebberfan-boop/AHOWP.git`。常规克隆后，它的远端名是 `origin`。项目还保留 `sites` 远端用于 Codex Sites 托管；日常跨电脑同步不要把两者混淆。用以下命令确认：

```bash
git remote -v
```

新电脑首次运行：

```bash
git clone https://github.com/thewebberfan-boop/AHOWP.git
cd AHOWP
nvm install        # 如果使用 nvm
nvm use
npm ci --prefix "/Users/simon/Library/Application Support/AHOWP-local-runtime" --no-audit --no-fund
ln -sfn "/Users/simon/Library/Application Support/AHOWP-local-runtime/node_modules" node_modules
ln -sfn "/Users/simon/Library/Application Support/AHOWP-local-runtime/dist" dist
npm run dev
```

### 本地运行目录（OneDrive 之外）

为避免 OneDrive 的在线占位文件阻塞 Node.js，依赖和构建产物不放在同步目录中。当前约定的本地运行目录是：

`/Users/simon/Library/Application Support/AHOWP-local-runtime`

项目目录中的 `node_modules` 和 `dist` 是指向该目录的本地链接；它们被 `.gitignore` 忽略，不进入 Git。另一台 Mac 的 Codex 可以按同一固定路径找到它们；如果用户名不同，只需把路径中的 `simon` 换成该 Mac 的用户名。

首次准备或依赖需要重建时，在项目根目录运行：

```bash
runtime_root="/Users/simon/Library/Application Support/AHOWP-local-runtime"
mkdir -p "$runtime_root"
cp package.json package-lock.json "$runtime_root/"
npm ci --prefix "$runtime_root" --no-audit --no-fund
mkdir -p "$runtime_root/dist"
ln -sfn "$runtime_root/node_modules" node_modules
ln -sfn "$runtime_root/dist" dist
```

不要把 `node_modules`、`.next`、`.vinext`、`dist` 或 `.wrangler` 复制回 OneDrive；它们是机器相关的依赖或生成物。

## 每次从另一台电脑接手

先确保上一台电脑已经提交并推送。然后在接手电脑执行：

```bash
git status --short
git pull --ff-only origin main
npm ci --prefix "/Users/simon/Library/Application Support/AHOWP-local-runtime" --no-audit --no-fund
npm run build
```

如果只需阅读而不开发，拉取完成后可以直接双击 `offline-reader/index.html`，无需运行 Node.js。人物图片依赖仓库中的 `public/` 目录，所以应保留完整项目文件夹。

若 `git status --short` 有输出，不要直接 pull，也不要让 Codex 清理；先判断这些改动属于谁。上面的 `npm ci --prefix` 在 `package-lock.json` 没变化时通常可以省略，但在换电脑或依赖提交变化后应执行。若项目链接尚未建立，先按上面的“本地运行目录”步骤完成准备。

打开新 Codex 任务时，可以直接说：

> 请先阅读 AGENTS.md、README.md、docs/PROJECT_STATUS.md 和 docs/SYSTEM_SPEC.md，再检查最近提交和工作树状态，然后继续当前项目。若继续问题图谱，再完整阅读 docs/PROBLEM_MAP_GUIDE.md。不要依赖另一台电脑的聊天记录。

### 继续问题图谱前

问题图谱有独立的内容与实现手册 `docs/PROBLEM_MAP_GUIDE.md`。当前谱系由泰勒斯延伸至罗素；另一台电脑接手后应先确认内容审计仍报告 1 条谱系、49 个内部维护分组、826 个原子节点和 947 条原始连线，并且三卷全部 76 章与现有 82 位人物全部覆盖。`app/problem-map-view-data.ts` 另行保存导览／主干／标准／完整／研究五档说明、问题家族锚点、历史背景带、解释边界和并行答案扇面；这些都不能改写原子节点与稳定 ID。当前终端是“怎样结合逻辑清晰、经验阻力、历史条件、生活体验、自由与公共纠错，而不让任何一种尺度吞并其余？”，后续应从真实阅读反馈校正分叉、汇合和折叠链。新增第二条谱系前，必须先实现 `problemMapId` 选择、会话恢复、搜索定位和返回链，不能只向数据数组追加对象。观察的领域标签只出现在节点详情；新增历史或社会观察时，使用经过审计的历史阶段／回应／事件 ID 建立历史概览入口，并测试返回原节点。

建议接手后的最低验证：

```bash
npm run build
npm run audit:content
npm test
```

浏览器中的上次阅读位置保存在本机 `localStorage`，不会随 Git 同步。另一台电脑会得到相同的网站内容，但不会自动恢复上一台电脑的个人阅读位置。

## 一次工作结束时

1. 运行 `npm run build` 和 `npm run build:offline`。
2. 更新 `docs/PROJECT_STATUS.md`。
3. 查看改动：`git status --short` 和 `git diff --check`。
4. 创建一个只描述本轮功能的提交。
5. 明确确认后再推送到远端。

示例：

```bash
git add <本轮相关文件>
git commit -m "Add second philosopher profile batch"
git push origin main
```

## 避免冲突

- 不要让两台电脑同时修改 `main`。
- 若必须并行，分别使用 `codex/<任务名>` 分支，且避免同时编辑 `app/page.tsx`、`app/globals.css` 或同一数据文件。
- 每次拉取使用 `--ff-only`，让意外分叉立即暴露，不自动生成难以理解的合并提交。
- 不使用强制推送；不要用 `git reset --hard` 处理交接问题。
- 图片和 `visual-archive/figures.json` 必须一起提交，否则另一台电脑会出现缺图或许可信息不一致。

## 哪些内容应进入 Git

应提交：

- `app/` 下的代码与知识数据；
- `public/visual-archive/` 中实际使用的图片；
- `visual-archive/figures.json` 中的来源与许可；
- `scripts/` 中可复用的数据整理工具；
- `offline/` 的离线构建入口和生成后的 `offline-reader/index.html`；
- `AGENTS.md`、`README.md` 和 `docs/` 中的项目记忆；
- `package.json` 与 `package-lock.json`。

不应提交：

- 依赖与构建结果；
- 本机环境变量和凭据；
- Codex 或编辑器的本地状态；
- 临时 PDF、截图、日志和缓存。

## 远端说明

本项目使用两个远端，各司其职：

- `origin`：用户控制的 GitHub 仓库，用于两台电脑之间拉取和推送代码。
- `sites`：Codex Sites 项目远端，用于现有网站托管配置；不作为日常跨电脑同步入口。

不要删除 `sites`，也不要把 GitHub 认证信息写入仓库文件。GitHub 推送权限由每台电脑各自的凭据管理器、GitHub CLI 或个人访问令牌提供。
