import assert from "node:assert/strict";
import test from "node:test";
import { ancientDifferenceProblemMap } from "../app/problem-map-data";
import {
  collectSelfSummaryPhaseIds,
  flattenSelfSummaryLevel,
  nextSelfSummaryLevel,
  normalizeSelfCompressionLevel,
  resolveSelfSummaryUnit,
  selfFacetNodeIds,
  selfSummaryEntryNodeId,
} from "../app/problem-map-self-data";

test("expands the selected later branch instead of restarting at the first card", () => {
  const child = resolveSelfSummaryUnit("10", "self-5-formation-recognition");
  assert.equal(child.id, "self-10-formation-dependence");
  const leaf = resolveSelfSummaryUnit("20", "self-10-autonomy-recognition");
  assert.equal(leaf.id, "self-20-autonomy-causality");
  assert.equal(nextSelfSummaryLevel("5"), "10");
  assert.equal(nextSelfSummaryLevel("10"), "20");
  assert.equal(nextSelfSummaryLevel("20"), "all");
  assert.equal(selfSummaryEntryNodeId(leaf), "how-can-freedom-coexist-with-natural-causality");
});

test("cards sharing one maintenance phase still enter different relevant atomic nodes", () => {
  const order = resolveSelfSummaryUnit("20", "self-20-soul-order");
  const survival = resolveSelfSummaryUnit("20", "self-20-soul-survival");
  assert.deepEqual(collectSelfSummaryPhaseIds(order), collectSelfSummaryPhaseIds(survival));
  assert.equal(selfSummaryEntryNodeId(order), "justice-as-ordered-whole");
  assert.equal(selfSummaryEntryNodeId(survival), "can-soul-survive-body");
});

test("every summary has a reachable entry within its own topic and historical coverage", () => {
  const phaseByNode = new Map(ancientDifferenceProblemMap.phases.flatMap((phase) => phase.nodes.map((node) => [node.id, phase.id])));
  for (const level of ["5", "10", "20"] as const) {
    for (const unit of flattenSelfSummaryLevel(level)) {
      const nodeId = selfSummaryEntryNodeId(unit);
      assert.ok(nodeId, unit.id);
      assert.ok(selfFacetNodeIds.some((id) => id === nodeId), unit.id);
      assert.ok(collectSelfSummaryPhaseIds(unit).includes(phaseByNode.get(nodeId) || ""), unit.id);
    }
  }
});

test("moving up or returning from an atomic phase keeps the corresponding historical branch", () => {
  assert.equal(resolveSelfSummaryUnit("5", "self-20-experience-transaction").id, "self-5-lived-temporal-self");
  assert.equal(resolveSelfSummaryUnit("10", "self-20-recognition-social-self").id, "self-10-autonomy-recognition");
  assert.equal(resolveSelfSummaryUnit("20", undefined, "kant-experience-autonomy-judgment").id, "self-20-autonomy-causality");
});

test("retired and invalid stored levels recover without reintroducing the 50-node view", () => {
  assert.equal(normalizeSelfCompressionLevel("50"), "all");
  assert.equal(normalizeSelfCompressionLevel("all"), "all");
  assert.equal(normalizeSelfCompressionLevel("20"), "20");
  assert.equal(normalizeSelfCompressionLevel(null), "5");
  assert.equal(normalizeSelfCompressionLevel("unknown"), "5");
  assert.equal(resolveSelfSummaryUnit("10", "removed-card").id, "self-10-rational-soul");
});
