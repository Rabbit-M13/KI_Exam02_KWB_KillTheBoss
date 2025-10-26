// scripts/notion-sync-multi.js
// Outputs Markdown to docs/; filename = <Title>_MMDD.md (KST).

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, "..", "docs");

const notionToken = process.env.NOTION_TOKEN;
const pageIds = (process.env.NOTION_PAGE_ID || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

if (!notionToken) {
  console.error("ERROR: NOTION_TOKEN is missing.");
  process.exit(1);
}
if (!pageIds.length) {
  console.error("ERROR: NOTION_PAGE_ID is empty. Provide one or more page IDs separated by commas.");
  process.exit(1);
}

const notion = new Client({ auth: notionToken });
const n2m = new NotionToMarkdown({ notionClient: notion });

async function getPageTitle(pageId) {
  try {
    const page = await notion.pages.retrieve({ page_id: pageId });
    const props = page.properties || {};
    for (const key of Object.keys(props)) {
      const p = props[key];
      if (p?.type === "title" && Array.isArray(p.title) && p.title.length > 0) {
        return p.title.map(t => t.plain_text || "").join("");
      }
    }
  } catch {}
  return "";
}

function toSafeFilename(str, fallback) {
  const name = (str || fallback || "Untitled").replace(/[\\/:*?"<>|]/g, "").trim();
  return name.slice(0, 80) || fallback || "Untitled";
}

function buildDateSuffix() {
  const override = (process.env.DATE_SUFFIX || "").trim();
  if (override && /^\d{4}$/.test(override)) return `_${override}`;
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const mm = String(kst.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(kst.getUTCDate()).padStart(2, "0");
  return `_${mm}${dd}`;
}

async function pageToMarkdown(pageId, title) {
  const mdBlocks = await n2m.pageToMarkdown(pageId);
  const content = n2m.toMarkdownString(mdBlocks).parent || "";
  const heading = `# ${title || "Untitled"}\n\n`;
  return heading + content;
}

async function run() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const suffix = buildDateSuffix();

  for (const pageId of pageIds) {
    const title = await getPageTitle(pageId) || pageId;
    const md = await pageToMarkdown(pageId, title);
    const filename = toSafeFilename(title, pageId) + suffix + ".md";
    const outPath = path.join(OUTPUT_DIR, filename);
    fs.writeFileSync(outPath, md, "utf-8");
    console.log("Wrote:", outPath);
  }
}
run().catch(e => { console.error(e); process.exit(1); });
