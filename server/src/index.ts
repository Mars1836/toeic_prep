import "dotenv/config";

import app from "./app";
import { connectMongo } from "./connect/mongo";
import { connectRedis } from "./connect/redis";
// import { testSendMail } from "./configs/nodemailer";
connectMongo();
connectRedis();
app.listen(4000, () => {
  console.log("Listening on 4000 :: server is running");
});
