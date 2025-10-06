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
exports.getRelatedBlogSrv = exports.deleteBlogSrv = exports.searchBlogSrv = exports.updateBlogSrv = exports.getBlogSrv = exports.increaseViewBlogSrv = exports.getBlogByIdSrv = exports.createBlogSrv = void 0;
const user_model_1 = require("../../models/user.model");
const blog_model_1 = require("../../models/blog.model");
const createBlogSrv = (blog) => __awaiter(void 0, void 0, void 0, function* () {
    const newBlog = yield blog_model_1.blogModel.create(blog);
    return newBlog;
});
exports.createBlogSrv = createBlogSrv;
const getBlogByIdSrv = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blog_model_1.blogModel.findById(id);
    return blog;
});
exports.getBlogByIdSrv = getBlogByIdSrv;
const increaseViewBlogSrv = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blog_model_1.blogModel.findByIdAndUpdate(id, { $inc: { view: 1 } });
    return blog;
});
exports.increaseViewBlogSrv = increaseViewBlogSrv;
const getBlogSrv = (_a, userId_1) => __awaiter(void 0, [_a, userId_1], void 0, function* ({ offset, limit, }, userId) {
    let isGetAll = false;
    let query = {};
    console.log("aaaaaaaaaaaaa:", userId);
    if (userId) {
        const user = yield user_model_1.userModel.findById(userId);
        if ((user === null || user === void 0 ? void 0 : user.role) === "admin") {
            isGetAll = true;
        }
    }
    if (isGetAll) {
        query = {};
    }
    else {
        query = { isPublished: true };
    }
    const blogs = yield blog_model_1.blogModel.find(query).skip(offset).limit(limit).sort({
        createdAt: -1,
    });
    return blogs;
});
exports.getBlogSrv = getBlogSrv;
const updateBlogSrv = (id, blog) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedBlog = yield blog_model_1.blogModel.findByIdAndUpdate(id, blog);
    return updatedBlog;
});
exports.updateBlogSrv = updateBlogSrv;
const searchBlogSrv = (search, userId) => __awaiter(void 0, void 0, void 0, function* () {
    let isGetAll = false;
    if (userId) {
        const user = yield user_model_1.userModel.findById(userId);
        if ((user === null || user === void 0 ? void 0 : user.role) === "admin") {
            isGetAll = true;
        }
    }
    let query = {};
    if (isGetAll) {
        query = {
            $text: { $search: search },
        };
    }
    else {
        query = {
            $text: { $search: search },
            isPublished: true,
        };
    }
    if (!search) {
        delete query.$text;
    }
    const blogs = yield blog_model_1.blogModel.find(query);
    return blogs;
});
exports.searchBlogSrv = searchBlogSrv;
const deleteBlogSrv = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blog_model_1.blogModel.findByIdAndDelete(id);
    return blog;
});
exports.deleteBlogSrv = deleteBlogSrv;
const getRelatedBlogSrv = (id, limit) => __awaiter(void 0, void 0, void 0, function* () {
    const currentBlog = yield blog_model_1.blogModel.findById(id);
    if (!currentBlog) {
        return [];
    }
    limit = Number(limit) || 4;
    const allBlogs = yield blog_model_1.blogModel
        .find({
        _id: { $ne: id },
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
        return Object.assign(Object.assign({}, blog.toObject()), { id: blog._id, relevanceScore: score });
    });
    // Sort by relevance score and get top posts
    const relatedBlogs = scoredBlogs
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, limit);
    return relatedBlogs;
});
exports.getRelatedBlogSrv = getRelatedBlogSrv;
