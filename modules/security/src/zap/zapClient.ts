
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });



function unwrap(v?: string) {
  return v?.replace(/^"(.*)"$/, "$1");
}

const ZAP_API = unwrap(process.env.ZAP_API) as string | undefined;
const ZAP_API_KEY = unwrap(process.env.ZAP_API_KEY) as string | undefined;


if (!ZAP_API) {
  throw new Error("Missing ZAP_API environment variable. Check modules/security/.env and dotenv path.");
}

export const zapClient = axios.create({
  baseURL: `${ZAP_API}/JSON`,
  params: {
    apikey: ZAP_API_KEY
  }
});

/**
 * Simple test call to verify connection with ZAP.
 */
export async function testZapConnection() {
  try {
    const response = await zapClient.get("/core/view/version/");
    console.log("Connected to ZAP:", response.data.version);
    return response.data.version;
  } catch (err) {
    console.error("❌ ZAP connection failed:", err);
    throw err;
  }
}
// Temporary test run
testZapConnection();
