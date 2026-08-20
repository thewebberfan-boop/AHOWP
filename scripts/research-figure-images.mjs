import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const termSource = await readFile(path.join(projectRoot, "app/terminology-data.ts"), "utf8");
const people = [...termSource.matchAll(/\{ id: "([^"]+)", zh: "([^"]+)", en: "([^"]+)", category: "人物"/g)]
  .map(([, id, zh, en]) => ({ id, zh, en }));

const entityOverrides = {
  zeno: "Q183420",
  eriugena: "Q193117",
  "roger-bacon": "Q188444",
  "duns-scotus": "Q190089",
  gregory: "Q254",
  benedict: "Q131214",
  aurelius: "Q1430",
  "william-james": "Q156103",
};

const stripHtml = (value = "") => value.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").trim();
const normalized = (value = "") => value.toLowerCase().replace(/^saint\s+/, "").replace(/\s*\(.+?\)\s*/g, " ").replace(/[^a-z0-9]+/g, " ").trim();
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithRetry(url, options = {}, attempts = 6) {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    const response = await fetch(url, options);
    if (response.status !== 429 && response.status < 500) return response;
    if (attempt === attempts) return response;
    const retryAfter = Number(response.headers.get("retry-after"));
    await delay(Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : attempt * 1200);
  }
}

async function searchEntity(person) {
  if (entityOverrides[person.id]) return entityOverrides[person.id];
  const query = person.en.replace(/\s*\(.+?\)\s*/g, " ").trim();
  const url = new URL("https://www.wikidata.org/w/api.php");
  url.search = new URLSearchParams({ action: "wbsearchentities", search: query, language: "en", uselang: "en", type: "item", limit: "8", format: "json", origin: "*" });
  const response = await fetchWithRetry(url, { headers: { "User-Agent": "AHOWP-study-archive/1.0 (educational local project)" } });
  if (!response.ok) throw new Error(`Wikidata search failed: ${response.status}`);
  const data = await response.json();
  const target = normalized(query);
  const ranked = (data.search || []).map((item) => {
    const label = normalized(item.label);
    const aliases = (item.aliases || []).map(normalized);
    const description = (item.description || "").toLowerCase();
    let score = label === target ? 100 : aliases.includes(target) ? 90 : label.includes(target) || target.includes(label) ? 55 : 0;
    if (/philosopher|theologian|scientist|mathematician|writer|poet|emperor|pope|reformer/.test(description)) score += 20;
    if (/football|athlete|actor|musician|fictional/.test(description)) score -= 100;
    return { ...item, score };
  }).sort((a, b) => b.score - a.score);
  return ranked[0]?.id || null;
}

async function mapLimit(items, limit, mapper) {
  const results = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await mapper(items[index], index);
      await delay(60);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

const identified = await mapLimit(people, 1, async (person) => ({ ...person, qid: await searchEntity(person) }));
const qids = identified.map((person) => person.qid).filter(Boolean);
const entityData = { entities: {} };
for (let offset = 0; offset < qids.length; offset += 40) {
  const entityUrl = new URL("https://www.wikidata.org/w/api.php");
  entityUrl.search = new URLSearchParams({ action: "wbgetentities", ids: qids.slice(offset, offset + 40).join("|"), props: "claims|labels|descriptions", languages: "en|zh", format: "json", origin: "*" });
  const entityResponse = await fetchWithRetry(entityUrl, { headers: { "User-Agent": "AHOWP-study-archive/1.0 (educational local project)" } });
  if (!entityResponse.ok) throw new Error(`Wikidata entity request failed: ${entityResponse.status}`);
  const batch = await entityResponse.json();
  Object.assign(entityData.entities, batch.entities || {});
  await delay(600);
}

const imageDir = path.join(projectRoot, "public/visual-archive/figures");
const archiveDir = path.join(projectRoot, "visual-archive");
await mkdir(imageDir, { recursive: true });
await mkdir(archiveDir, { recursive: true });

const records = await mapLimit(identified, 4, async (person) => {
  const entity = person.qid ? entityData.entities?.[person.qid] : null;
  const commonsFile = entity?.claims?.P18?.[0]?.mainsnak?.datavalue?.value || null;
  const record = {
    id: person.id,
    zh: person.zh,
    en: person.en,
    wikidataId: person.qid,
    wikidataUrl: person.qid ? `https://www.wikidata.org/wiki/${person.qid}` : null,
    wikidataLabel: entity?.labels?.en?.value || null,
    wikidataDescription: entity?.descriptions?.en?.value || null,
    status: commonsFile ? "ready" : "needs_manual_image",
    representationCaution: "历史人物的雕像、手稿插图或后世画像通常不是写实肖像，应作为视觉识别符号使用。",
    image: null,
  };
  if (!commonsFile) return record;

  const commonsUrl = new URL("https://commons.wikimedia.org/w/api.php");
  commonsUrl.search = new URLSearchParams({ action: "query", titles: `File:${commonsFile}`, prop: "imageinfo", iiprop: "url|extmetadata|mime", iiurlwidth: "900", format: "json", origin: "*" });
  const response = await fetchWithRetry(commonsUrl, { headers: { "User-Agent": "AHOWP-study-archive/1.0 (educational local project)" } });
  if (!response.ok) return { ...record, status: "image_metadata_failed" };
  const data = await response.json();
  const page = Object.values(data.query?.pages || {})[0];
  const info = page?.imageinfo?.[0];
  if (!info?.thumburl && !info?.url) return { ...record, status: "image_metadata_failed" };
  const assetUrl = info.thumburl || info.url;
  const mime = info.thumbmime || info.mime || "image/jpeg";
  const extension = mime.includes("png") ? "png" : mime.includes("webp") ? "webp" : "jpg";
  const filename = `${person.id}.${extension}`;
  const localPath = path.join(imageDir, filename);
  if (!existsSync(localPath)) {
    const assetResponse = await fetch(assetUrl, { headers: { "User-Agent": "AHOWP-study-archive/1.0 (educational local project)" } });
    if (assetResponse.ok) await writeFile(localPath, Buffer.from(await assetResponse.arrayBuffer()));
  }
  const metadata = info.extmetadata || {};
  return {
    ...record,
    image: {
      localPath: `/visual-archive/figures/${filename}`,
      commonsFile,
      commonsPage: info.descriptionurl || `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(commonsFile.replaceAll(" ", "_"))}`,
      originalUrl: info.url,
      thumbnailUrl: assetUrl,
      mime,
      license: stripHtml(metadata.LicenseShortName?.value || metadata.UsageTerms?.value || "Check source page"),
      licenseUrl: metadata.LicenseUrl?.value || null,
      artist: stripHtml(metadata.Artist?.value || metadata.Credit?.value || "Unknown / see source page"),
      credit: stripHtml(metadata.Credit?.value || ""),
    },
  };
});

const payload = {
  generatedAt: new Date().toISOString(),
  policy: "Wikidata P18 representative images resolved through Wikimedia Commons; every record retains source and license metadata.",
  count: records.length,
  ready: records.filter((record) => record.status === "ready" && record.image).length,
  needsReview: records.filter((record) => record.status !== "ready" || !record.image).length,
  figures: records,
};
await writeFile(path.join(archiveDir, "figures.json"), `${JSON.stringify(payload, null, 2)}\n`);
process.stdout.write(JSON.stringify({ count: payload.count, ready: payload.ready, needsReview: payload.needsReview, unresolved: records.filter((record) => record.status !== "ready" || !record.image).map((record) => ({ id: record.id, en: record.en, qid: record.wikidataId, status: record.status })) }, null, 2));
