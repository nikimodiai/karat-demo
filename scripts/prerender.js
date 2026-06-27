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

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: "networkidle0" });

  // app fetches /pricing.json on mount; give it a moment to render
  await page.waitForSelector("#root *", { timeout: 10000 });
  await new Promise((r) => setTimeout(r, 500));

  const html = await page.content();

  await browser.close();
  server.close();

  fs.writeFileSync(path.join(DIST, "index.html"), html);
  console.log("[swarnix] prerendered dist/index.html");
}

main();
