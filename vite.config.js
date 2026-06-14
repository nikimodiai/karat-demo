import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import XLSX from "xlsx";
import fs from "fs";
import path from "path";

// Reads the Excel and writes public/pricing.json so the app can fetch it at runtime.
// Re-runs on every dev-server start and every build.
function excelToPricingJson() {
  const SRC = path.resolve("public/Swarnix subscription features.xlsx");
  const DEST = path.resolve("public/pricing.json");

  function convert() {
    const wb = XLSX.readFile(SRC);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });

    // rows[0] = ["Per Month", "Trial", "Starter", "Professional", "Enterprise"]
    const plans = rows[0].slice(1); // plan names
    const features = [];
    let price = null, offerPrice = null;

    for (let r = 1; r < rows.length; r++) {
      const label = rows[r][0];
      const values = rows[r].slice(1);
      if (label === "Price") { price = values; continue; }
      if (label === "Offer Price (for limited time)") { offerPrice = values; continue; }
      features.push({ label, values });
    }

    const data = {
      plans: plans.map((name, i) => ({
        name,
        price: price ? price[i] : "",
        offerPrice: offerPrice ? offerPrice[i] : "",
      })),
      features,
    };

    fs.writeFileSync(DEST, JSON.stringify(data, null, 2));
    console.log("[swarnix] pricing.json updated from Excel");
  }

  return {
    name: "excel-to-pricing-json",
    buildStart() { convert(); },
    configureServer(server) {
      convert();
      fs.watchFile(SRC, () => { convert(); server.ws.send({ type: "full-reload" }); });
    },
  };
}

export default defineConfig({
  plugins: [react(), excelToPricingJson()],
});
