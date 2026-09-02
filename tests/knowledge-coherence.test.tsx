import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { ancientDifferenceProblemMap as map } from "../app/problem-map-data";
import { collectSelfSummaryNodeIds, flattenSelfSummaryLevel, selfFacetNodeIds, selfSummaryEntryNodeId } from "../app/problem-map-self-data";
import { buildSelfSummaryConnections, knowledgeNodeById, knowledgeUnitsFor, selfNodeTopics } from "../app/knowledge-paths";
import { selfCrossTopicNodes, selfReadingEdges } from "../app/self-reading-data";
import { KnowledgeConnections } from "../app/knowledge-connections";
import { ProblemMapView } from "../app/problem-map";

test("each level covers the same atomic knowledge and each entry belongs to its exact argument", () => {
  for (const level of ["5", "10", "20"] as const) {
    const units = flattenSelfSummaryLevel(level);
    assert.deepEqual(new Set(units.flatMap(collectSelfSummaryNodeIds)), new Set(selfFacetNodeIds));
    for (const unit of units) {
      const members = collectSelfSummaryNodeIds(unit);
      assert.ok(members.includes(selfSummaryEntryNodeId(unit)!), unit.id);
      assert.ok(members.every((id) => knowledgeNodeById.has(id)), unit.id);
    }
  }
});

test("self retains the doubt-cogito argument and forms a traversable network without fabricated influence", () => {
  const ids = new Set(selfFacetNodeIds);
  const chain = ["what-can-thought-know-when-sense-and-words-mislead", "methodic-doubt-suspends-uncertain-beliefs",
    "does-any-judgment-survive-hyperbolic-doubt", "cogito-performed-certainty", "what-is-the-self-known-in-cogito"];
  chain.forEach((id) => assert.ok(ids.has(id), id));
  chain.slice(1).forEach((id, index) => assert.ok(map.edges.some((edge) => edge.from === chain[index] && edge.to === id)));
  const adjacent = new Map(selfFacetNodeIds.map((id) => [id, [] as string[]]));
  map.edges.filter((edge) => ids.has(edge.from) && ids.has(edge.to)).forEach((edge) => {
    adjacent.get(edge.from)!.push(edge.to); adjacent.get(edge.to)!.push(edge.from);
  });
  const seen = new Set([selfFacetNodeIds[0]]);
  const queue = [...seen];
  for (const id of queue) for (const next of adjacent.get(id)!) if (!seen.has(next)) { seen.add(next); queue.push(next); }
  assert.equal(seen.size, ids.size, "Continuity includes explicit comparisons, not a claim of a single historical lineage.");
  assert.ok(selfReadingEdges.every((edge) => ["同题并列", "本站推演"].includes(edge.connection)));
  assert.equal(new Set(map.edges.map((edge) => `${edge.from}:${edge.to}`)).size, map.edges.length);
});

test("every coarse connection has actual edge witnesses or shared stable nodes", () => {
  for (const level of ["5", "10", "20"] as const) {
    const units = flattenSelfSummaryLevel(level);
    const links = buildSelfSummaryConnections(units, map.edges);
    for (const unit of units) assert.ok(links.some((link) => link.from === unit.id || link.to === unit.id), unit.id);
    for (const link of links) {
      const from = new Set(collectSelfSummaryNodeIds(units.find((unit) => unit.id === link.from)!));
      const to = new Set(collectSelfSummaryNodeIds(units.find((unit) => unit.id === link.to)!));
      assert.ok(link.edges.length || link.sharedNodeIds.length);
      link.edges.forEach((edge) => { assert.ok(map.edges.includes(edge)); assert.ok(from.has(edge.from) && to.has(edge.to)); });
      link.sharedNodeIds.forEach((id) => assert.ok(from.has(id) && to.has(id)));
    }
  }
});

test("Locke's person, school and period expose the identical identity argument and its question", () => {
  for (const context of [{ kind: "philosopher", id: "locke" }, { kind: "school", id: "british-empiricism-liberalism" }, { kind: "history", id: "early-modern" }] as const) {
    const nodes = knowledgeUnitsFor(context).flatMap((item) => item.nodes);
    for (const id of ["what-makes-one-person-same-over-time", "personhood-through-conscious-appropriation"]) {
      assert.ok(nodes.includes(knowledgeNodeById.get(id)!), `${context.kind}: ${id}`);
    }
    const html = renderToStaticMarkup(<KnowledgeConnections context={context} />);
    assert.match(html, /class="problem-map-controls knowledge-problem-controls"/);
    assert.match(html, /阅读主题/);
    assert.match(html, /总览 5/);
    assert.match(html, /主线 10/);
    assert.match(html, /论证组 20/);
    assert.match(html, /全部节点/);
    assert.match(html, /class="problem-graph-scroll knowledge-problem-graph"/);
    assert.match(html, /data-knowledge-node="personhood-through-conscious-appropriation"/);
    assert.match(html, /在完整图谱中定位/);
    assert.doesNotMatch(html, /<details/);
  }
  assert.deepEqual(knowledgeUnitsFor({ kind: "philosopher", id: "unknown" }), []);
  for (const ids of Object.values(selfCrossTopicNodes)) for (const id of ids) {
    assert.ok(selfFacetNodeIds.includes(id));
    assert.ok(selfNodeTopics(id).length > 1);
  }
});

test("external entrances open the requested summary or atomic node, with an explicit return", () => {
  const noop = () => {};
  const common = { activePhaseId: "locke-experience-ideas-knowledge-identity", activeNodeId: "what-makes-one-person-same-over-time",
    onPhaseChange: noop, onNodeChange: noop, onPhilosopher: noop, onSchool: noop, onHistory: noop, onChapter: noop, showEnglish: false,
    onBack: noop, originLabel: "哲学家 · 洛克" };
  for (const level of ["5", "20", "all"] as const) {
    const html = renderToStaticMarkup(<ProblemMapView {...common} initialReadingTarget={{ unitId: "self-20-personal-identity-critique", nodeId: common.activeNodeId, level }} />);
    assert.match(html, /返回刚才的阅读位置/);
    assert.match(html, /哲学家 · 洛克/);
    if (level === "all") assert.match(html, /id="problem-node-what-makes-one-person-same-over-time"/);
    else assert.match(html, level === "5" ? /id="self-summary-self-5-modern-subject"/ : /id="self-summary-self-20-personal-identity-critique"/);
  }
});
