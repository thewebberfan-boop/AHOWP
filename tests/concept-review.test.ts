import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";

import reviewLedger from "../docs/concept-review-ledger.json" with { type: "json" };
import { philosopherProfiles } from "../app/philosopher-data";
import { terminology, terminologyByZh, terminologyMatchers } from "../app/terminology-data";

const digest = (text: string) => createHash("sha256").update(text).digest("hex").slice(0, 16);

test("concept review ledger covers every live philosopher definition", () => {
  const live = philosopherProfiles.flatMap((profile) => profile.concepts.map((concept) => ({
    key: `${profile.id}::${concept.zh}`,
    definition: concept.definition,
  })));
  const reviews = new Map(reviewLedger.reviews.map((review) => [`${review.philosopherId}::${review.zh}`, review]));

  assert.equal(philosopherProfiles.length, 82);
  assert.equal(live.length, 367);
  assert.equal(reviews.size, live.length);
  live.forEach(({ key, definition }) => {
    const review = reviews.get(key);
    assert.ok(review, `missing review for ${key}`);
    assert.equal(review.definition, definition, `stale reviewed text for ${key}`);
    assert.equal(review.reviewedHash, digest(definition), `stale reviewed hash for ${key}`);
    assert.ok(review.sources.some((source) => source.url.startsWith("https://")), `missing source for ${key}`);
  });
  assert.equal(reviewLedger.reviews.filter((review) => review.decision === "revised").length, 70);
});

test("generic terms remain separate from philosopher-specific senses", () => {
  const profileNames = new Set(philosopherProfiles.flatMap((profile) => profile.concepts.map((concept) => concept.zh)));
  assert.equal(reviewLedger.genericDefinitions.length, 23);
  reviewLedger.genericDefinitions.forEach((term) => {
    assert.equal(term.ownership, "global");
    assert.ok(!profileNames.has(term.zh), `${term.zh} should not be recorded as generic if a profile owns that label`);
    assert.ok(term.sources.some((source) => source.url.startsWith("https://")), `missing generic source for ${term.zh}`);
  });

  assert.equal(terminologyByZh.get("谱系")?.zh, "谱系学");
  assert.equal(terminologyByZh.get("因果性")?.zh, "因果");
  assert.equal(terminologyByZh.get("自爱与虚荣")?.zh, "自然自爱与社会性自爱");
});

test("every philosopher definition is available as a contextual terminology sense", () => {
  const senses = new Map(terminology.flatMap((term) => (term.senses || []).map((sense) => [sense.id, sense])));
  const live = philosopherProfiles.flatMap((profile) => profile.concepts.map((concept) => ({
    id: `${profile.id}::${concept.zh}`,
    definition: concept.definition,
  })));

  assert.equal(senses.size, 367);
  live.forEach(({ id, definition }) => {
    assert.equal(senses.get(id)?.definition, definition, `missing or stale terminology sense for ${id}`);
  });
});

test("safe alternate translations resolve while ambiguous short forms stay unlinked", () => {
  const expected = new Map([
    ["始基", "本原"], ["理型", "理念"], ["心灵宁静", "心灵宁静"], ["恩宠", "恩典"],
    ["物自身", "现象与物自身"], ["自在之物", "现象与物自身"], ["第一性质", "第一与第二性质"],
    ["定言令式", "绝对命令"], ["存在论论证", "本体论论证"], ["先定和谐", "预定和谐"],
    ["唯物史观", "历史唯物主义"], ["摹状词", "摹状词理论"], ["唯心主义", "观念论"],
  ]);
  expected.forEach((canonical, alias) => assert.equal(terminologyByZh.get(alias)?.zh, canonical, `${alias} alias mismatch`));
  ["道", "形式", "水", "气", "爱", "争"].forEach((ambiguous) => assert.ok(!terminologyMatchers.includes(ambiguous), `${ambiguous} should not be globally highlighted`));
  terminologyByZh.forEach((term, surface) => {
    assert.ok(surface.length >= 2, `unsafe short matcher: ${surface}`);
    assert.ok(term.note.trim(), `missing popup explanation for ${surface}`);
  });
});
