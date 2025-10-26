// scripts/build-index.js
// Generate docs/index.html listing all Markdown and all HTML (except index.html).

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outDir = path.join(__dirname, "..", "docs");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function listFiles(ext) {
  return fs.readdirSync(outDir)
    .filter(f => f.toLowerCase().endsWith(ext))
    .sort((a,b)=>a.localeCompare(b));
}

const mds = listFiles(".md");
const htmls = listFiles(".html").filter(f => f.toLowerCase() !== "index.html");

const html = `<!doctype html>
<meta charset="utf-8"/>
<title>Notion Sync Index</title>
<style>
body{font-family:system-ui,Segoe UI,Roboto,Apple SD Gothic Neo,AppleGothic,Malgun Gothic,sans-serif;max-width:900px;margin:40px auto;padding:0 16px;line-height:1.6}
h1{margin-top:0}
section{margin:24px 0}
li{margin:6px 0}
code{background:#f6f8fa;padding:2px 6px;border-radius:4px}
</style>
<h1>Notion Sync Index</h1>
<section>
  <h2>Markdown pages</h2>
  ${mds.length ? `<ul>${mds.map(f=>`<li><a href="${f}">${f}</a></li>`).join("")}</ul>` : "<p><em>No Markdown files generated yet.</em></p>"}
</section>
<section>
  <h2>Interactive Notion (redirect)</h2>
  ${htmls.length ? `<ul>${htmls.map(f=>`<li><a href="${f}">${f}</a></li>`).join("")}</ul>` : "<p><em>No redirect pages. Configure <code>NOTION_PUBLIC_URLS</code>.</em></p>"}
</section>`;

fs.writeFileSync(path.join(outDir, "index.html"), html, "utf-8");
console.log("Wrote:", path.join(outDir, "index.html"));
