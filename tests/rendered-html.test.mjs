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
  assert.match(html, /斯多葛主义/);
  assert.match(html, /哲学家/);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site/);
});

test("keeps the complete philosopher and school graphs in the project", async () => {
  const [page, graph, medieval, medievalSchools, schoolGraph, spec, status] = await Promise.all([
    readFile(new URL("app/page.tsx", projectRoot), "utf8"),
    readFile(new URL("app/philosopher-graph.tsx", projectRoot), "utf8"),
    readFile(new URL("app/philosopher-data-medieval.ts", projectRoot), "utf8"),
    readFile(new URL("app/school-data-medieval.ts", projectRoot), "utf8"),
    readFile(new URL("app/school-graph.tsx", projectRoot), "utf8"),
    readFile(new URL("docs/SYSTEM_SPEC.md", projectRoot), "utf8"),
    readFile(new URL("docs/PROJECT_STATUS.md", projectRoot), "utf8"),
  ]);

  assert.match(page, /PhilosopherGraphView/);
  assert.match(page, /哲学家图谱/);
  assert.match(graph, /承接前人/);
  assert.match(graph, /影响后继/);
  assert.match(graph, /显示全部关系/);
  assert.match(medieval, /托马斯·阿奎那/);
  assert.match(medieval, /帕多瓦的马西略/);
  assert.match(medievalSchools, /教父哲学与拉丁基督教传统/);
  assert.match(medievalSchools, /伊斯兰哲学：法尔萨法与卡拉姆批评/);
  assert.match(medievalSchools, /方济各会经院哲学与唯名论/);
  assert.match(schoolGraph, /schoolProfiles\.length/);
  assert.match(spec, /系统复刻说明/);
  assert.match(status, /53 位人物/);
  assert.match(status, /17 个流派/);
});
