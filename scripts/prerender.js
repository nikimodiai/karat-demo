// Renders the built SPA in headless Chrome and writes the resulting HTML
// back into dist/index.html, so crawlers get real content instead of an
// empty shell. The original <script type="module" src="/assets/..."> tag
// is preserved so React still hydrates and the page stays interactive.
import puppeteer from "puppeteer";
import http from "http";
import fs from "fs";
import path from "path";

const DIST = path.resolve("dist");
const PORT = 4173;
const MIME = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg", ".svg": "image/svg+xml", ".mp4": "video/mp4",
};

function serveStatic() {
  return http.createServer((req, res) => {
    const reqPath = decodeURIComponent(req.url.split("?")[0]);
    const filePath = path.join(DIST, reqPath === "/" ? "/index.html" : reqPath);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404).end("Not found");
        return;
      }
      const ext = path.extname(filePath);
      res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
      res.end(data);
    });
  });
}

async function main() {
  const server = serveStatic();
  await new Promise((resolve) => server.listen(PORT, resolve));

  let browser;
  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: "networkidle0" });

    // app fetches /pricing.json on mount; give it a moment to render
    await page.waitForSelector("#root *", { timeout: 10000 });
    await new Promise((r) => setTimeout(r, 500));

    const html = await page.content();

    fs.writeFileSync(path.join(DIST, "index.html"), html);
    console.log("[swarnix] prerendered dist/index.html");
  } catch (err) {
    // Prerender is a progressive enhancement for crawlers. If headless Chrome
    // can't launch (e.g. the Vercel build image lacks its shared libraries),
    // skip it and ship the SPA shell — the site still works for real users.
    console.warn(
      "[swarnix] prerender skipped — headless Chrome unavailable; " +
        "shipping the SPA shell instead.\n" +
        `  reason: ${err && err.message ? err.message.split("\n")[0] : err}`
    );
  } finally {
    if (browser) await browser.close().catch(() => {});
    server.close();
  }
}

main();
