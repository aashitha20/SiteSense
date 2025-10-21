import { zapClient } from "./zapClient.js";

export async function getZapReport(scanId: string) {
  try {
    const response = await zapClient.get("/core/view/alerts/");
    const alerts = response.data.alerts.map((a: any) => ({
      id: a.pluginId,
      name: a.alert,
      risk: a.risk,
      description: a.description,
      solution: a.solution,
      reference: a.reference
    }));

    return {
      scanId,
      totalIssues: alerts.length,
      issues: alerts
    };
  } catch (err) {
    console.error("❌ Could not fetch report:", err);
    throw err;
  }
}
