import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    {
      ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
    },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the current learning map shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<main class="app-shell">/);
  assert.match(html, /西方哲学史/);
  assert.match(html, /哲学流派/);
  assert.match(html, /帝国世界与个人伦理/);
  assert.match(html, /哲学家/);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site/);
});

test("keeps the complete philosopher and school graphs in the project", async () => {
  const [page, historyData, structureData, graph, forceGraph, medieval, modern, schoolData, medievalSchools, modernSchools, schoolGraph, spec, status, figuresText] = await Promise.all([
    readFile(new URL("app/page.tsx", projectRoot), "utf8"),
    readFile(new URL("app/history-data.ts", projectRoot), "utf8"),
    readFile(new URL("app/russell-structure-data.ts", projectRoot), "utf8"),
    readFile(new URL("app/philosopher-graph.tsx", projectRoot), "utf8"),
    readFile(new URL("app/d3-force-graph.tsx", projectRoot), "utf8"),
    readFile(new URL("app/philosopher-data-medieval.ts", projectRoot), "utf8"),
    readFile(new URL("app/philosopher-data-modern.ts", projectRoot), "utf8"),
    readFile(new URL("app/school-data.ts", projectRoot), "utf8"),
    readFile(new URL("app/school-data-medieval.ts", projectRoot), "utf8"),
    readFile(new URL("app/school-data-modern.ts", projectRoot), "utf8"),
    readFile(new URL("app/school-graph.tsx", projectRoot), "utf8"),
    readFile(new URL("docs/SYSTEM_SPEC.md", projectRoot), "utf8"),
    readFile(new URL("docs/PROJECT_STATUS.md", projectRoot), "utf8"),
    readFile(new URL("visual-archive/figures.json", projectRoot), "utf8"),
  ]);

  assert.match(page, /PhilosopherGraphView/);
  assert.match(page, /哲学家图谱/);
  assert.match(page, /onClick=\{openPhilosopherGraph\}>哲学家/);
  assert.match(page, /onClick=\{openSchoolGraph\}>哲学流派/);
  const topNav = page.match(/<nav className="mode-tabs"[\s\S]*?<\/nav>/)?.[0] ?? "";
  assert.deepEqual(
    [...topNav.matchAll(/>(历史概览|哲学流派|哲学家|原书索引|方法图谱|关系复习)<\/button>/g)].map((match) => match[1]),
    ["历史概览", "哲学流派", "哲学家", "原书索引", "方法图谱", "关系复习"],
  );
  assert.match(page, /useState<Mode>\("history"\)/);
  assert.doesNotMatch(page, /RussellStructureView/);
  assert.match(page, /05 · 罗素原书中的位置/);
  assert.match(structureData, /russellStructureStageIdsByHistoryStage/);
  assert.match(page, /school-person-rating/);
  assert.match(page, /school-index-rating/);
  assert.match(page, /school\.stars/);
  assert.match(page, /openSchool\(school\.id, true, true\)/);
  assert.match(page, /setPendingSchoolScroll\(preserveScroll \? window\.scrollY : null\)/);
  assert.match(page, /setPendingHistoryScroll\(origin\.scrollY\)/);
  assert.match(page, /openSchoolFromPhilosopher/);
  assert.match(page, /profile-school-links/);
  assert.match(page, /scrollY: window\.scrollY/);
  assert.match(page, /chapterOrigin\.mode === "history"/);
  assert.match(page, /返回历史概览的原位置/);
  assert.match(page, /04 · 从时代回应进入流派与人物/);
  assert.doesNotMatch(page, /aria-label="全部历史阶段"/);
  assert.match(historyData, /export const historyResponseLinks/);
  assert.match(historyData, /"roman-stoics"/);
  assert.match(historyData, /"church-state"/);
  assert.match(page, /function AdaptiveSchoolTitle/);
  assert.match(page, /ResizeObserver/);
  assert.match(graph, /承接前人/);
  assert.match(graph, /影响后继/);
  assert.match(graph, /D3\.js 多类型节点力导向网络图/);
  assert.doesNotMatch(graph, /D3\.js 力导向人物关系图/);
  assert.match(forceGraph, /forceSimulation/);
  assert.match(forceGraph, /zoomIdentity/);
  assert.match(forceGraph, /drag/);
  assert.match(forceGraph, /全部关系/);
  assert.match(forceGraph, /const width = 1000/);
  assert.match(forceGraph, /const height = 440/);
  assert.match(medieval, /托马斯·阿奎那/);
  assert.match(medieval, /帕多瓦的马西略/);
  assert.match(modern, /马基雅维利/);
  assert.match(modern, /柏格森/);
  assert.match(modern, /Bertrand Russell/);
  assert.match(medievalSchools, /教父哲学与拉丁基督教传统/);
  assert.match(medievalSchools, /伊斯兰哲学：法尔萨法与卡拉姆批评/);
  assert.match(medievalSchools, /方济各会经院哲学与唯名论/);
  assert.match(modernSchools, /科学革命与经验方法/);
  assert.match(modernSchools, /逻辑分析哲学/);
  assert.match(schoolData, /findSchoolProfilesByPhilosopher/);
  assert.match(schoolData, /schoolAtlasGroup/);
  assert.match(schoolGraph, /schoolProfiles\.length/);
  assert.match(graph, /findSchoolProfilesByPhilosopher/);
  assert.match(schoolGraph, /D3\.js 多类型节点力导向网络图/);
  assert.doesNotMatch(schoolGraph, /D3\.js 力导向流派关系图/);
  assert.match(spec, /流派星级表示学习辨识度/);
  assert.match(spec, /系统复刻说明/);
  assert.match(status, /82 位人物/);
  assert.match(status, /32 个流派/);

  const { figures } = JSON.parse(figuresText);
  assert.equal(figures.find((figure) => figure.id === "philo-alexandria")?.status, "ready");
  assert.equal(figures.find((figure) => figure.id === "duns-scotus")?.status, "ready");
  assert.equal(figures.find((figure) => figure.id === "galileo")?.status, "ready");
  assert.equal(figures.find((figure) => figure.id === "bergson")?.status, "ready");
});
