"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./configs/dotenv");
const fs_1 = __importDefault(require("fs"));
const app_1 = __importDefault(require("./app"));
const mongo_1 = require("./connect/mongo");
const redis_1 = require("./connect/redis");
const express_list_endpoints_1 = __importDefault(require("express-list-endpoints"));
require("./cron/update_test_status");
const http_1 = require("http");
const socket_io_1 = require("socket.io");
(0, mongo_1.connectMongo)();
(0, redis_1.connectRedis)();
function writeApiToFile() {
    const endpoints = (0, express_list_endpoints_1.default)(app_1.default);
    fs_1.default.writeFileSync("endpoins.json", JSON.stringify(endpoints.map((item) => {
        return {
            path: item.path,
            methods: item.methods,
        };
    }), null, 2), "utf-8");
}
writeApiToFile();
// Tạo HTTP server
const server = (0, http_1.createServer)(app_1.default);
// Setup Socket.IO
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
    },
});
// Lưu io instance để sử dụng trong services
global.io = io;
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
