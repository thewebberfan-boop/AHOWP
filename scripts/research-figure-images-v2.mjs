import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const termSource = await readFile(path.join(projectRoot, "app/terminology-data.ts"), "utf8");
const people = [...termSource.matchAll(/\{ id: "([^"]+)", zh: "([^"]+)", en: "([^"]+)", category: "人物"/g)]
  .map(([, id, zh, en]) => ({ id, zh, en }));
const pageOverrides = {
  anaximenes: "Anaximenes of Miletus",
  zeno: "Zeno of Citium",
  seneca: "Seneca the Younger",
  augustine: "Augustine of Hippo",
  benedict: "Benedict of Nursia",
  eriugena: "John Scotus Eriugena",
  aurelius: "Marcus Aurelius",
};
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const stripHtml = (value = "") => value.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").trim();

async function fetchWithRetry(url, options = {}, attempts = 5) {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    const response = await fetch(url, options);
    if (response.status !== 429 && response.status < 500) return response;
    if (attempt === attempts) return response;
    await delay(attempt * 700);
  }
}

async function mapLimit(items, limit, mapper) {
  const results = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await mapper(items[index]);
      await delay(450);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

const imageDir = path.join(projectRoot, "public/visual-archive/figures");
const archiveDir = path.join(projectRoot, "visual-archive");
await mkdir(imageDir, { recursive: true });
await mkdir(archiveDir, { recursive: true });
let existingById = new Map();
try {
  const existing = JSON.parse(await readFile(path.join(archiveDir, "figures.json"), "utf8"));
  existingById = new Map((existing.figures || []).map((record) => [record.id, record]));
} catch {
  existingById = new Map();
}

const records = await mapLimit(people, 1, async (person) => {
  const existing = existingById.get(person.id);
  if (existing?.status === "ready" && existing.image?.localPath && existsSync(path.join(projectRoot, "public", existing.image.localPath.replace(/^\//, "")))) return existing;
  const pageTitle = pageOverrides[person.id] || person.en.replace(/\s*\(.+?\)\s*/g, " ").replace(/^Saint /, "").trim();
  const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle.replaceAll(" ", "_"))}`;
  const summaryResponse = await fetchWithRetry(summaryUrl, { headers: { "User-Agent": "AHOWP-study-archive/1.0 (educational local project)" } });
  if (!summaryResponse.ok) return { id: person.id, zh: person.zh, en: person.en, status: "needs_manual_image", pageTitle, representationCaution: "尚未自动找到可靠的公共图像。" };
  const summary = await summaryResponse.json();
  const sourceImage = summary.originalimage?.source || summary.thumbnail?.source || null;
  const base = {
    id: person.id,
    zh: person.zh,
    en: person.en,
    wikipediaTitle: summary.title,
    wikipediaUrl: summary.content_urls?.desktop?.page || null,
    wikidataId: summary.wikibase_item || null,
    wikidataUrl: summary.wikibase_item ? `https://www.wikidata.org/wiki/${summary.wikibase_item}` : null,
    description: summary.description || null,
    status: sourceImage ? "ready" : "needs_manual_image",
    representationCaution: "古代与中世纪人物的雕像、手稿插图或后世画像通常不是写实肖像，应作为视觉识别符号使用。",
    image: null,
  };
  if (!sourceImage) return base;

  const commonsFile = decodeURIComponent(new URL(sourceImage).pathname.split("/").at(-1)).replaceAll("_", " ");
  const commonsUrl = new URL("https://commons.wikimedia.org/w/api.php");
  commonsUrl.search = new URLSearchParams({ action: "query", titles: `File:${commonsFile}`, prop: "imageinfo", iiprop: "url|extmetadata|mime", iiurlwidth: "900", format: "json", origin: "*" });
  const commonsResponse = await fetchWithRetry(commonsUrl, { headers: { "User-Agent": "AHOWP-study-archive/1.0 (educational local project)" } });
  if (!commonsResponse.ok) return { ...base, status: "image_metadata_failed" };
  const commonsData = await commonsResponse.json();
  const page = Object.values(commonsData.query?.pages || {})[0];
  const info = page?.imageinfo?.[0];
  if (!info?.thumburl && !info?.url) return { ...base, status: "image_metadata_failed" };

  const assetUrl = info.thumburl || info.url;
  const mime = info.thumbmime || info.mime || "image/jpeg";
  const extension = mime.includes("png") ? "png" : mime.includes("webp") ? "webp" : "jpg";
  const filename = `${person.id}.${extension}`;
  const localPath = path.join(imageDir, filename);
  if (!existsSync(localPath)) {
    const assetResponse = await fetchWithRetry(assetUrl, { headers: { "User-Agent": "AHOWP-study-archive/1.0 (educational local project)" } });
    if (assetResponse.ok) await writeFile(localPath, Buffer.from(await assetResponse.arrayBuffer()));
  }
  const metadata = info.extmetadata || {};
  return {
    ...base,
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
  policy: "Representative images resolved from encyclopedia records to Wikimedia Commons; every downloaded image retains its source and license metadata.",
  count: records.length,
  ready: records.filter((record) => record.status === "ready" && record.image).length,
  needsReview: records.filter((record) => record.status !== "ready" || !record.image).length,
  figures: records,
};
await writeFile(path.join(archiveDir, "figures.json"), `${JSON.stringify(payload, null, 2)}\n`);
process.stdout.write(JSON.stringify({ count: payload.count, ready: payload.ready, needsReview: payload.needsReview, unresolved: records.filter((record) => record.status !== "ready" || !record.image).map((record) => ({ id: record.id, en: record.en, status: record.status })) }, null, 2));
