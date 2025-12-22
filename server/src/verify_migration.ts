import "./configs/dotenv"; // Load env
import { connectMongo } from "./connect/mongo";
import { saveLoginRecord, getLoginHistory, detectAnomalousLogin, clearLoginHistory } from "./services/login_history";
import mongoose from "mongoose";

async function verify() {
  console.log("Connecting to MongoDB...");
  await connectMongo();

  const userId = "test_verify_migration_user";
  const device = {
    fingerprint: "test_fingerprint_1",
    ip: "1.2.3.4",
    browser: "TestBrowser",
    os: "TestOS",
    device: "desktop",
    userAgent: "TestAgent"
  };

  console.log("1. Cleaning old history...");
  await clearLoginHistory(userId);

  console.log("2. Saving login record...");
  await saveLoginRecord(userId, device, true);

  // Wait a bit for async save if needed, though it's awaited in my code (except the catch block logger)
  await new Promise(r => setTimeout(r, 100));

  console.log("3. Fetching history...");
  const history = await getLoginHistory(userId);
  console.log("History length:", history.length);
  if (history.length !== 1) console.error("ERROR: History length mismatch");
  if (history[0].fingerprint !== device.fingerprint) console.error("ERROR: Fingerprint mismatch");

  console.log("4. Testing anomaly (should be NORMAL)...");
  // Same device
  const result1 = await detectAnomalousLogin(userId, device);
  console.log("Result 1:", result1.isAnomalous ? "ANOMALOUS" : "NORMAL");
  if (result1.isAnomalous) console.error("ERROR: Should not be anomalous");

  console.log("5. Testing anomaly (should be ANOMALOUS)...");
  // New device, new IP
  const device2 = { ...device, fingerprint: "new_fingerprint", ip: "5.6.7.8" };
  const result2 = await detectAnomalousLogin(userId, device2);
  console.log("Result 2:", result2.isAnomalous ? "ANOMALOUS" : "NORMAL");
  console.log("Reasons:", result2.reasons);
  if (!result2.isAnomalous) console.error("ERROR: Should be anomalous");

  console.log("Cleaning up...");
  await clearLoginHistory(userId);
  await mongoose.disconnect();
  console.log("Done.");
}

verify().catch(console.error);
