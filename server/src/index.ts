import "./configs/dotenv";
import fs from "fs";
import app from "./app";
import { connectMongo } from "./connect/mongo";
import { connectRedis } from "./connect/redis";
import expressListEndpoints from "express-list-endpoints";
import "./cron/update_test_status";
import { createServer } from "http";
import { Server } from "socket.io";

connectMongo();
connectRedis();
// main();
declare global {
  namespace Express {
    interface User {
      id: string;
      // Add other properties as needed
    }
  }
}
function writeApiToFile() {
  const endpoints = expressListEndpoints(app);
  fs.writeFileSync(
    "endpoins.json",
    JSON.stringify(
      endpoints.map((item) => {
        return {
          path: item.path,
          methods: item.methods,
        };
      }),
      null,
      2
    ),
    "utf-8"
  );
}
writeApiToFile();

// Tạo HTTP server
const server = createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // Cho phép tất cả origins (bao gồm ngrok)
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"], // Hỗ trợ cả WebSocket và polling cho ngrok
  allowEIO3: true, // Hỗ trợ Socket.IO v3 clients
});

// Lưu io instance để sử dụng trong services
(global as any).io = io;

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Show routes
server.listen(4000, () => {
  console.log("Listening on 4000 :: server is running with Socket.IO");
});
