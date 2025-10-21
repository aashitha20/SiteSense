import { zapClient } from "./zapClient.js";

/**
 * Starts an active scan on a target URL using OWASP ZAP.
 */
export async function startZapScan(targetUrl: string) {
  try {
    // 1. Initiate the scan
    const start = await zapClient.get("/ascan/action/scan/", {
      params: { url: targetUrl }
    });
    const scanId = start.data.scan;
    console.log(`🚀 Scan started on ${targetUrl}, ID: ${scanId}`);

    // 2. Poll for progress
    let progress = 0;
    while (progress < 100) {
      const status = await zapClient.get("/ascan/view/status/", {
        params: { scanId }
      });
      progress = parseInt(status.data.status, 10);
      console.log(`Progress: ${progress}%`);
      await new Promise((r) => setTimeout(r, 3000)); // wait 3 s
    }

    console.log("✅ Scan complete!");
    return scanId;
  } catch (err) {
    console.error("❌ Scan failed:", err);
    throw err;
  }
}
