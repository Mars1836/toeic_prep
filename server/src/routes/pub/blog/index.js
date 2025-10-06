"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const handle_async_1 = require("../../../middlewares/handle_async");
const blog_1 = __importDefault(require("../../../controllers/blog"));
const pubBlogRouter = express_1.default.Router();
pubBlogRouter.get("/", (0, handle_async_1.handleAsync)(blog_1.default.getBlog));
pubBlogRouter.get("/search", (0, handle_async_1.handleAsync)(blog_1.default.searchBlog));
pubBlogRouter.get("/:id", (0, handle_async_1.handleAsync)(blog_1.default.getBlogById));
pubBlogRouter.post("/:id/view", (0, handle_async_1.handleAsync)(blog_1.default.increaseViewBlog));
pubBlogRouter.get("/:id/related", (0, handle_async_1.handleAsync)(blog_1.default.getRelatedBlog));
exports.default = pubBlogRouter;
