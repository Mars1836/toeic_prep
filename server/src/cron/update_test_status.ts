import cron from "node-cron";
import AutoUpdateService from "../services/toeic_testing/auto_update";

// Run every minute
cron.schedule("* * * * *", async () => {
  try {
    await AutoUpdateService.updateTestStatuses();
  } catch (error) {
    console.error("Error updating test statuses:", error);
  }
});
