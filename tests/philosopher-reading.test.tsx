import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { philosopherById } from "../app/philosopher-data";
import { philosopherReadings, philosopherReadingNodeIds } from "../app/philosopher-reading-data";
import { KnowledgeConnections } from "../app/knowledge-connections";
import { PhilosopherReadingPanel } from "../app/philosopher-reading";
import { knowledgeNodeById, knowledgePhaseByNodeId, knowledgeUnitsFor } from "../app/knowledge-paths";
import { collectSummaryNodeIds, flattenTopicLevel, nodeReadingTopics, resolveTopicUnit } from "../app/reading-topics-data";
import { SelfSummaryGraph } from "../app/problem-map-self";
import { ancientDifferenceProblemMap } from "../app/problem-map-data";
import { ScopedProblemGraph } from "../app/problem-map";

test("every philosopher has curated readings referencing only canonical, attributable knowledge", () => {
  assert.deepEqual(Object.keys(philosopherReadings).sort(), Object.keys(philosopherById).sort());
  const readingIds = new Set<string>();
  for (const [personId, readings] of Object.entries(philosopherReadings)) {
    assert.ok(readings.length, personId);
    assert.ok(!("inquiries" in philosopherById[personId]), "Legacy argument prose is retired, not just hidden");
    const units = knowledgeUnitsFor({ kind: "philosopher", id: personId });
    const visibleIds = new Set(units.flatMap((unit) => unit.nodes.map((node) => node.id)));
    assert.deepEqual(visibleIds, new Set(philosopherReadingNodeIds(personId)));
    for (const reading of readings) {
      assert.ok(!readingIds.has(reading.id));
      readingIds.add(reading.id);
      assert.equal(knowledgeNodeById.get(reading.questionId)?.kind, "问题");
      assert.ok(reading.nodeIds.includes(reading.questionId));
      assert.equal(reading.nodeIds.length, new Set(reading.nodeIds).size);
      assert.ok(reading.nodeIds.some((id) => {
        const node = knowledgeNodeById.get(id);
        return node?.kind === "答案" && node.participants.some((person) => person.philosopherId === personId);
      }));
      for (const id of reading.nodeIds) {
        const node = knowledgeNodeById.get(id)!;
        assert.ok(node, id);
        assert.ok(units.some((unit) => unit.nodes.includes(node)), "Exact object, not a rewritten copy");
        assert.ok(nodeReadingTopics(id).length, id);
        for (const topic of nodeReadingTopics(id)) for (const level of ["5", "10", "20"] as const) {
          const unit = resolveTopicUnit(topic, level, undefined, id, true);
          assert.ok(collectSummaryNodeIds(unit).includes(id), `${id} can return to ${topic}/${level}`);
        }
        assert.ok(ancientDifferenceProblemMap.edges.some((edge) =>
          (edge.from === id && reading.nodeIds.includes(edge.to)) || (edge.to === id && reading.nodeIds.includes(edge.from))), `${reading.id}: ${id} has a real relation in the reading`);
      }
    }
  }
});

test("all philosopher pages render shared graph controls and exactly one linked reading panel", () => {
  for (const personId of Object.keys(philosopherReadings)) {
    const html = renderToStaticMarkup(<KnowledgeConnections context={{ kind: "philosopher", id: personId }} />);
    assert.match(html, /选择核心问题/);
    assert.match(html, /class="problem-map-controls knowledge-problem-controls"/);
    assert.match(html, /class="problem-graph-scroll knowledge-problem-graph"/);
    assert.equal((html.match(/class="philosopher-reading-panel"/g) || []).length, 1);
    assert.doesNotMatch(html, /inquiry-card/);
    for (const id of philosopherReadingNodeIds(personId)) assert.ok(html.includes(`data-knowledge-node="${id}"`), id);
  }
});

test("each focused reading is connected by actual relations and renders exactly its selected nodes", () => {
  for (const reading of Object.values(philosopherReadings).flat()) {
    const ids = new Set(reading.nodeIds);
    const seen = new Set([reading.questionId]);
    const queue = [...seen];
    for (const id of queue) for (const edge of ancientDifferenceProblemMap.edges) {
      const next = edge.from === id ? edge.to : edge.to === id ? edge.from : undefined;
      if (next && ids.has(next) && !seen.has(next)) { seen.add(next); queue.push(next); }
    }
    assert.deepEqual(seen, ids, `${reading.id}: a directory must not hide disconnected lists`);
    const topics = [...new Set(reading.nodeIds.flatMap(nodeReadingTopics))];
    const html = renderToStaticMarkup(<ScopedProblemGraph nodeIds={reading.nodeIds} topicIds={topics} selectedNodeId={reading.questionId} onNodeSelect={() => {}} ariaLabel={reading.label} />);
    const renderedIds = [...html.matchAll(/data-knowledge-node="([^"]+)"/g)].map((match) => match[1]);
    assert.deepEqual(new Set(renderedIds), ids, reading.id);
    assert.equal(renderedIds.length, ids.size, "Cross-topic nodes appear only once");
  }
});

test("reading details preserve canonical reasoning and evidence without treating order as deduction", () => {
  for (const [personId, readings] of Object.entries(philosopherReadings)) for (const reading of readings) {
    for (const id of reading.nodeIds) {
      const node = knowledgeNodeById.get(id)!;
      const html = renderToStaticMarkup(<PhilosopherReadingPanel profile={philosopherById[personId]} reading={reading} nodeId={id} onNodeSelect={() => {}} onLocate={() => {}} />);
      assert.ok(html.includes(node.summary));
      assert.ok(html.includes(node.pressure));
      assert.ok(html.includes(node.consequence));
      assert.match(html, /aria-current="step"/);
      assert.match(html, /编号仅表示本站阅读顺序/);
      assert.match(html, /非逐句原典引证/);
      assert.match(html, /在完整图谱中定位/);
      const role = node.participants.find((person) => person.philosopherId === personId);
      if (role) {
        assert.match(html, /class="philosopher-reading-attribution"/);
        assert.ok(html.indexOf("philosopher-reading-attribution") < html.indexOf("<details"), "Shared-node attribution must not be hidden in sources");
      }
    }
  }
});

test("a scoped coarse summary is explicitly global context, not the person's own conclusion", () => {
  const units = knowledgeUnitsFor({ kind: "philosopher", id: "locke" }, ["self"]);
  const ids = units.flatMap((unit) => unit.nodes.map((node) => node.id));
  const root = flattenTopicLevel("self", "5").find((unit) => collectSummaryNodeIds(unit).some((id) => ids.includes(id)))!;
  const html = renderToStaticMarkup(<SelfSummaryGraph topicIds={["self"]} level="5" allNodes={[...knowledgeNodeById.values()]} phaseByNodeId={knowledgePhaseByNodeId} selectedUnitId={root.id} visibleNodeIds={ids} onUnitSelect={() => {}} onDrillDown={() => {}} onAtomicNode={() => {}} />);
  assert.match(html, /全局争论背景/);
  assert.match(html, /不代表本页人物或流派接受全部回答/);
});
