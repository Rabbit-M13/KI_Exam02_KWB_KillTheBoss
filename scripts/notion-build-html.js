// scripts/notion-build-html.js
// Build redirect pages with friendly names (NOTION_PUBLIC_URLS + optional NOTION_PUBLIC_NAMES).
// MARKER: REDIRECT-BUILD v2

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outDir = path.join(__dirname, "..", "docs");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const urls = (process.env.NOTION_PUBLIC_URLS || "")
  .split(",").map(s => s.trim()).filter(Boolean);

// optional friendly names, comma-separated, same order as urls
const customNames = (process.env.NOTION_PUBLIC_NAMES || "")
  .split(",").map(s => s.trim()).filter(Boolean);

function slugify(s) {
  return (s || "")
    .toLowerCase()
    .normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80) || "";
}

function slugFromUrl(u) {
  try {
    const { pathname } = new URL(u);
    const seg = pathname.split("/").filter(Boolean).pop() || "";
    const cleaned = seg.replace(/-?[0-9a-f]{32}$/i, "");
    return slugify(cleaned);
  } catch {
    return "";
  }
}

function redirectHtml(title, url) {
  return `<!doctype html>
<!-- REDIRECT-BUILD v2 -->
<html lang="en"><meta charset="utf-8"/>
<title>${title}</title>
<meta http-equiv="refresh" content="0;url=${url}">
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<style>
  body{font-family:system-ui,Segoe UI,Roboto,Apple SD Gothic Neo,Malgun Gothic,sans-serif;max-width:800px;margin:3rem auto;padding:0 16px;line-height:1.6}
  .box{background:#f6f8fa;padding:16px;border-radius:8px}
</style>
<h1>Opening Notion…</h1>
<div class="box">
  <p>잠시 후 원본 Notion 페이지로 이동합니다.</p>
  <p><a href="${url}" rel="noopener noreferrer">👉 직접 열기</a></p>
</div>
</html>`;
}

if (!urls.length) {
  console.log("Skip HTML build: NOTION_PUBLIC_URLS is empty.");
  process.exit(0);
}

const used = new Set();
urls.forEach((url, i) => {
  let base = customNames[i] ? slugify(customNames[i]) : slugFromUrl(url);
  if (!base) base = `page-${i+1}`;
  let name = base, k = 2;
  while (used.has(name)) name = `${base}-${k++}`;
  used.add(name);

  const filename = `${name}.html`;
  const file = path.join(outDir, filename);
  fs.writeFileSync(file, redirectHtml(`Open ${name}`, url), "utf-8");
  console.log("[build:html] wrote:", filename, "->", url);
});
