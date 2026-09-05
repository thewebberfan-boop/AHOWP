import assert from "node:assert/strict";
import test from "node:test";
import { philosopherProfiles } from "../app/philosopher-data";
import { buildPhilosopherGraphEdges } from "../app/philosopher-graph";
import { problemMaps } from "../app/problem-map-data";

test("problem-map sources are clickable and claim references resolve to precise locators", () => {
  for (const map of problemMaps) {
    const sourceLabels = new Set(map.sources.map((source) => source.label));
    for (const source of map.sources) {
      assert.doesNotThrow(() => new URL(source.url), source.label);
      assert.ok(source.note.trim(), source.label);
    }
    for (const node of map.phases.flatMap((phase) => phase.nodes)) for (const reference of node.sourceRefs || []) {
      assert.ok(sourceLabels.has(reference.sourceLabel), `${node.id}: ${reference.sourceLabel}`);
      assert.ok(reference.locator.trim(), node.id);
    }
    for (const edge of map.edges) for (const reference of edge.sourceRefs || []) {
      assert.ok(sourceLabels.has(reference.sourceLabel), `${edge.id}: ${reference.sourceLabel}`);
      assert.ok(reference.locator.trim(), edge.id);
    }
  }
});

test("criticism is directional and retrospective comparison is not mislabeled as direct criticism", () => {
  const orderById = new Map(philosopherProfiles.map((profile) => [profile.id, profile.order]));
  const criticismEdges = buildPhilosopherGraphEdges().filter((edge) => edge.relation === "批评关系");
  assert.ok(criticismEdges.length > 0);
  criticismEdges.forEach((edge) => {
    assert.equal(edge.reciprocal, false, edge.id);
    assert.ok((orderById.get(edge.fromId) || 0) >= (orderById.get(edge.toId) || 0), edge.id);
  });
  const frege = philosopherProfiles.find((profile) => profile.id === "frege")!;
  assert.equal(frege.comparisons.find((comparison) => comparison.target === "黑格尔")?.relation, "后世重构");
});
