# 两台电脑与两个 Codex 的交替工作流程

目标是让仓库本身承载项目记忆，避免依赖某一台电脑的聊天记录、开发目录或 Codex 本地状态。

## 一次性准备

两台电脑应使用同一个远端仓库。当前仓库的远端名是 `sites`；如果另一台电脑通过常规 `git clone` 获取，远端名通常会是 `origin`。用以下命令确认：

```bash
git remote -v
```

新电脑首次运行：

```bash
git clone <仓库地址>
cd ABHOWP
nvm install        # 如果使用 nvm
nvm use
npm ci
npm run dev
```

不要复制 `node_modules`、`.next`、`.vinext`、`dist` 或 `.wrangler`。它们是机器相关的生成物，另一台电脑应由锁文件重新生成。

## 每次从另一台电脑接手

先确保上一台电脑已经提交并推送。然后在接手电脑执行：

```bash
git status --short
git pull --ff-only <远端名> main
npm ci
npm run build
```

若 `git status --short` 有输出，不要直接 pull，也不要让 Codex 清理；先判断这些改动属于谁。`npm ci` 在 `package-lock.json` 没变化时通常可以省略，但在换电脑或依赖提交变化后应执行。

打开新 Codex 任务时，可以直接说：

> 请先阅读 AGENTS.md、README.md 和 docs/PROJECT_STATUS.md，再检查最近提交和工作树状态，然后继续当前项目。不要依赖另一台电脑的聊天记录。

## 一次工作结束时

1. 运行 `npm run build`。
2. 更新 `docs/PROJECT_STATUS.md`。
3. 查看改动：`git status --short` 和 `git diff --check`。
4. 创建一个只描述本轮功能的提交。
5. 明确确认后再推送到远端。

示例：

```bash
git add <本轮相关文件>
git commit -m "Add second philosopher profile batch"
git push <远端名> main
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
- `AGENTS.md`、`README.md` 和 `docs/` 中的项目记忆；
- `package.json` 与 `package-lock.json`。

不应提交：

- 依赖与构建结果；
- 本机环境变量和凭据；
- Codex 或编辑器的本地状态；
- 临时 PDF、截图、日志和缓存。

## 远端说明

本项目当前配置了 Codex Sites 远端。它是否能在另一台电脑直接认证，取决于两台电脑是否使用同一工作区与凭据。如果不能访问，最稳妥的方式是由用户另建一个自己控制的 GitHub、GitLab 或其他私有仓库，再把它添加为第二远端；不要删除 `sites` 远端，除非已经确认不再需要 Sites 托管。
