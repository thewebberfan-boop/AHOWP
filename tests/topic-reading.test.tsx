import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { ancientDifferenceProblemMap as map } from "../app/problem-map-data";
import { selfSummaryEntryNodeId } from "../app/problem-map-self-data";
import { collectSummaryNodeIds, flattenTopicLevel, nodeReadingTopics, readingTopicIds, resolveTopicUnit, restoreTopicView, selectedTopicNodeIds, topicNodeIds, topicPreferenceKey } from "../app/reading-topics-data";
import { buildSelfSummaryConnections, knowledgeNodeById, knowledgePhaseByNodeId, knowledgeUnitsFor } from "../app/knowledge-paths";
import { problemPhaseHistoryStageIds } from "../app/problem-map-view-data";
import { schoolProfiles } from "../app/school-data";
import { topicReadingEdges } from "../app/topic-reading-edges";
import { ProblemMapView } from "../app/problem-map";
import { SelfSummaryGraph } from "../app/problem-map-self";

test("all five reading paths retain the same canonical knowledge at every resolution", () => {
  for (const topic of readingTopicIds) for (const level of ["5", "10", "20"] as const) {
    const units = flattenTopicLevel(topic, level);
    assert.equal(units.length, Number(level));
    assert.deepEqual(new Set(units.flatMap(collectSummaryNodeIds)), new Set(topicNodeIds[topic]));
    for (const unit of units) {
      const ids = collectSummaryNodeIds(unit);
      assert.ok(ids.includes(selfSummaryEntryNodeId(unit)!), unit.id);
      assert.ok(ids.every((id) => knowledgeNodeById.has(id)), unit.id);
      assert.ok(ids.some((id) => knowledgeNodeById.get(id)!.kind === "问题"), unit.id);
      assert.ok(ids.some((id) => knowledgeNodeById.get(id)!.kind === "答案"), unit.id);
      if (unit.children) assert.deepEqual(new Set(ids), new Set(unit.children.flatMap(collectSummaryNodeIds)));
    }
  }
});

test("curated networks can be traversed, with explicit editorial evidence rather than invented influence", () => {
  assert.equal(new Set(map.edges.map((edge) => `${edge.from}:${edge.to}`)).size, map.edges.length);
  for (const edge of topicReadingEdges) {
    assert.ok(["同题并列", "本站推演"].includes(edge.connection));
    assert.equal(knowledgeNodeById.get(edge.from)?.kind, "答案");
    assert.equal(knowledgeNodeById.get(edge.to)?.kind, "问题");
  }
  for (const topic of readingTopicIds) {
    const ids = new Set(topicNodeIds[topic]);
    const adjacent = new Map([...ids].map((id) => [id, [] as string[]]));
    for (const edge of map.edges) if (ids.has(edge.from) && ids.has(edge.to)) {
      adjacent.get(edge.from)!.push(edge.to); adjacent.get(edge.to)!.push(edge.from);
    }
    const seen = new Set([topicNodeIds[topic][0]]), queue = [...seen];
    for (const id of queue) for (const next of adjacent.get(id)!) if (!seen.has(next)) { seen.add(next); queue.push(next); }
    assert.equal(seen.size, ids.size, topic);
  }
  assert.ok(map.edges.some((edge) => edge.from === "fallible-individuals-need-bounded-knowledge-and-power" && edge.to === "how-do-consent-and-majority-create-government"));
});

test("cross-topic comparisons reuse stable nodes and coarse connections have actual witnesses", () => {
  const union = selectedTopicNodeIds([...readingTopicIds]);
  assert.ok(union.size < readingTopicIds.reduce((sum, topic) => sum + topicNodeIds[topic].length, 0));
  assert.deepEqual(nodeReadingTopics("experience-as-organism-environment-transaction"), ["nature", "self", "society"]);
  assert.deepEqual(nodeReadingTopics("one-substance-god-or-nature"), ["nature", "self", "ultimate"]);
  for (const level of ["5", "10", "20"] as const) {
    const units = readingTopicIds.flatMap((topic) => flattenTopicLevel(topic, level));
    const links = buildSelfSummaryConnections(units, map.edges);
    for (const unit of units) assert.ok(links.some((link) => link.from === unit.id || link.to === unit.id), unit.id);
    for (const link of links) {
      const from = new Set(collectSummaryNodeIds(units.find((unit) => unit.id === link.from)!));
      const to = new Set(collectSummaryNodeIds(units.find((unit) => unit.id === link.to)!));
      assert.ok(link.edges.length || link.sharedNodeIds.length);
      link.edges.forEach((edge) => assert.ok(map.edges.includes(edge) && from.has(edge.from) && to.has(edge.to)));
      link.sharedNodeIds.forEach((id) => assert.ok(from.has(id) && to.has(id)));
    }
  }
});

test("down/up navigation preserves branches, while a newly selected atom can change the branch", () => {
  for (const topic of readingTopicIds) for (const leaf of flattenTopicLevel(topic, "20")) {
    const parent = resolveTopicUnit(topic, "10", leaf.id);
    const root = resolveTopicUnit(topic, "5", parent.id);
    assert.ok(parent.children?.includes(leaf));
    assert.ok(root.children?.includes(parent));
    assert.equal(resolveTopicUnit(topic, "10", root.id).id, root.children![0].id);
    assert.equal(resolveTopicUnit(topic, "20", parent.id).id, parent.children![0].id);
  }
  // Spinoza's freedom appears in two nature groups: preserve the actual arrival route.
  assert.equal(resolveTopicUnit("nature", "5", "nature-20-causality-freedom", "what-can-freedom-mean-in-necessary-nature", true).id, "nature-5-life");
  // After choosing an unrelated atom, the old summary must not trap the back action.
  assert.equal(resolveTopicUnit("nature", "5", "nature-20-causality-freedom", "stable-being", true).id, "nature-5-change");
});

test("topic preferences are isolated and legacy or malformed values recover safely", () => {
  const saved = new Map([
    [topicPreferenceKey("self", "compression"), "50"],
    [topicPreferenceKey("society", "compression"), "10"],
    [topicPreferenceKey("society", "summary"), "society-20-locke"],
    [topicPreferenceKey("nature", "summary"), "self-20-soul-order"],
    [topicPreferenceKey("ultimate", "compression"), "invalid"],
    [topicPreferenceKey("self", "node"), "cogito-performed-certainty"],
  ]);
  const read = (key: string) => saved.get(key) || null;
  assert.equal(restoreTopicView("self", read).level, "all");
  assert.equal(restoreTopicView("self", read).nodeId, "cogito-performed-certainty");
  assert.equal(restoreTopicView("society", read).unitId, "society-10-covenant-trust");
  assert.equal(restoreTopicView("society", read).level, "10");
  assert.equal(restoreTopicView("nature", read).unitId, "nature-5-change");
  assert.equal(restoreTopicView("nature", read).level, "5");
  assert.equal(restoreTopicView("ultimate", read).level, "5");
});

test("method, nature, society and ultimate expose the same arguments through person, school and period", () => {
  for (const [topic, id] of [["method", "cogito-performed-certainty"], ["nature", "four-causes-teleology"], ["society", "fiduciary-government-and-separated-powers"], ["ultimate", "five-ways-from-effects"]] as const) {
    const node = knowledgeNodeById.get(id)!;
    const people = node.participants.flatMap((person) => person.philosopherId ? [person.philosopherId] : []);
    const school = schoolProfiles.find((item) => item.philosophers.some((person) => people.includes(person.id)) && node.chapterIds.some((chapter) => item.chapterIds.includes(chapter)))!;
    assert.ok(school, id);
    const stage = problemPhaseHistoryStageIds[knowledgePhaseByNodeId.get(id)!.id];
    for (const context of [{ kind: "philosopher", id: people[0] }, { kind: "school", id: school.id }, { kind: "history", id: stage }] as const) {
      const entries = knowledgeUnitsFor(context, [topic]);
      assert.ok(entries.some((entry) => entry.nodes.includes(node)), `${topic}/${context.kind}`);
      assert.ok(entries.every((entry) => entry.topicId === topic));
    }
  }
});

test("rendered launches use the requested topic, and multi-topic summaries keep distinct cards", () => {
  const noop = () => {};
  for (const topic of readingTopicIds) {
    const leaf = flattenTopicLevel(topic, "20")[17];
    const nodeId = selfSummaryEntryNodeId(leaf)!;
    for (const level of ["5", "10", "20", "all"] as const) {
      const html = renderToStaticMarkup(<ProblemMapView activeNodeId={nodeId} activePhaseId={knowledgePhaseByNodeId.get(nodeId)!.id} onNodeChange={noop} onPhaseChange={noop} onPhilosopher={noop} onSchool={noop} onHistory={noop} onChapter={noop} showEnglish={false} onBack={noop} originLabel="刚才的原文" initialReadingTarget={{ topicId: topic, unitId: leaf.id, nodeId, level }} />);
      assert.match(html, /返回刚才的阅读位置/);
      if (level === "all") {
        assert.ok(html.includes(`id="problem-node-${nodeId}"`));
        const historyBands = [...html.matchAll(/<rect class="phase-(?:odd|even)" x="0" y="([^"]+)" width="1280" height="([^"]+)"/g)]
          .map((match) => ({ y: Number(match[1]), height: Number(match[2]) }));
        assert.equal((html.match(/class="phase-label-link" role="button"/g) || []).length, historyBands.length);
        assert.doesNotMatch(html, /<g class="(?:active)?" role="button" tabindex="0" aria-label="进入历史概览/);
        for (let index = 1; index < historyBands.length; index += 1) {
          assert.ok(historyBands[index].y > historyBands[index - 1].y + historyBands[index - 1].height, `${topic} atomic history backgrounds ${index} and ${index + 1} must not overlap`);
        }
      } else assert.ok(html.includes(`id="self-summary-${resolveTopicUnit(topic, level, leaf.id).id}"`));
    }
  }
  const html = renderToStaticMarkup(<SelfSummaryGraph topicIds={["nature", "self", "society"]} level="5" allNodes={[...knowledgeNodeById.values()]} phaseByNodeId={knowledgePhaseByNodeId} selectedUnitId="society-5-security-rights" onUnitSelect={noop} onDrillDown={noop} onAtomicNode={noop} />);
  assert.equal((html.match(/role="button"/g) || []).length, 15);
  assert.equal((html.match(/class="self-summary-node selected"/g) || []).length, 1);
  assert.match(html, /class="self-summary-lanes"/);
  assert.match(html, />时间序列</);
  assert.match(html, /城邦与自然的发现/);
  assert.doesNotMatch(html, /共同时间段|共同时段/);
  assert.match(html, /class="cross-topic/);
  assert.match(html, /虚线为共享节点/);
  assert.match(html, /跨主题关系持续显示/);
  const groupRects = [...html.matchAll(/<rect class="summary-group-(?:odd|even)" x="0" y="([^"]+)" width="1280" height="([^"]+)"/g)]
    .map((match) => ({ y: Number(match[1]), height: Number(match[2]) }));
  assert.equal(groupRects.length, 5);
  for (let index = 1; index < groupRects.length; index += 1) {
    assert.ok(groupRects[index].y > groupRects[index - 1].y + groupRects[index - 1].height, `history backgrounds ${index} and ${index + 1} must not overlap`);
  }
  assert.match(html, /<rect x="[^"]+" y="8" width="[^"]+" height="32" rx="3"/);
  assert.ok(groupRects[0].y > 40, "topic headers must end before the first history background begins");
});
