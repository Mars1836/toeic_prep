"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const handle_async_1 = require("../../../middlewares/handle_async");
const blog_model_1 = require("../../../models/blog.model");
const blogRouter = (0, express_1.Router)();
blogRouter.get("/related/:blogId", (0, handle_async_1.handleAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { blogId } = req.params;
    const limit = Number(req.query.limit) || 4; // Default to 4 related posts
    // First, get the current blog to find its category
    const currentBlog = yield blog_model_1.blogModel.findById(blogId);
    if (!currentBlog) {
        return res.status(404).json({
            success: false,
            message: "Blog not found",
        });
    }
    // Find related blogs:
    // 1. Same category
    // 2. Exclude current blog
    // 3. Only published blogs
    // 4. Sort by date (newest first)
    const relatedBlogs = yield blog_model_1.blogModel
        .find({
        _id: { $ne: blogId }, // Exclude current blog
        category: currentBlog.category,
        isPublished: true,
    })
        .sort({ createdAt: -1 })
        .limit(limit)
        .select({
        title: 1,
        description: 1,
        image: 1,
        category: 1,
        author: 1,
        createdAt: 1,
        view: 1,
    });
    // If we don't have enough related posts in the same category,
    // we can fetch additional posts from other categories
    if (relatedBlogs.length < limit) {
        const remainingCount = limit - relatedBlogs.length;
        const additionalBlogs = yield blog_model_1.blogModel
            .find({
            _id: { $ne: blogId },
            category: { $ne: currentBlog.category },
            isPublished: true,
        })
            .sort({ createdAt: -1 })
            .limit(remainingCount)
            .select({
            title: 1,
            description: 1,
            image: 1,
            category: 1,
            author: 1,
            createdAt: 1,
            view: 1,
        });
        relatedBlogs.push(...additionalBlogs);
    }
    res.status(200).json({
        success: true,
        data: relatedBlogs,
        message: "Related blogs fetched successfully",
    });
})));
// Alternative API with more sophisticated relevance scoring
blogRouter.get("/related-advanced/:blogId", (0, handle_async_1.handleAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { blogId } = req.params;
    const limit = Number(req.query.limit) || 4;
    const currentBlog = yield blog_model_1.blogModel.findById(blogId);
    if (!currentBlog) {
        return res.status(404).json({
            success: false,
            message: "Blog not found",
        });
    }
    // Get all published blogs except current one
    const allBlogs = yield blog_model_1.blogModel
        .find({
        _id: { $ne: blogId },
        isPublished: true,
    })
        .select({
        title: 1,
        description: 1,
        image: 1,
        category: 1,
        author: 1,
        createdAt: 1,
        view: 1,
    });
    // Calculate relevance score for each blog
    const scoredBlogs = allBlogs.map((blog) => {
        let score = 0;
        // Same category: +3 points
        if (blog.category === currentBlog.category) {
            score += 3;
        }
        // Same author: +2 points
        if (blog.author === currentBlog.author) {
            score += 2;
        }
        // Popular posts (more views): +1 point
        if (blog.view > 100) {
            score += 1;
        }
        // Newer posts get a small boost
        const daysSinceCreation = Math.floor((Date.now() - blog.createdAt.getTime()) / (1000 * 60 * 60 * 24));
        if (daysSinceCreation < 30) {
            score += 0.5;
        }
        return Object.assign(Object.assign({}, blog.toObject()), { relevanceScore: score });
    });
    // Sort by relevance score and get top posts
    const relatedBlogs = scoredBlogs
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, limit);
    res.status(200).json({
        success: true,
        data: relatedBlogs,
        message: "Related blogs fetched successfully",
    });
})));
exports.default = blogRouter;
