import { cp, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(projectRoot, "public");
const clientDir = path.join(projectRoot, "dist", "client");

await cp(publicDir, clientDir, { recursive: true, force: true });

const figureDir = path.join(publicDir, "visual-archive", "figures");
const figureFiles = await readdir(figureDir);
console.log(`[copy-public-assets] copied public assets and ${figureFiles.length} figure files to ${clientDir}`);
