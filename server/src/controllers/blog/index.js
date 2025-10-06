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
const blog_1 = require("../../services/blog");
var BlogCtrl;
(function (BlogCtrl) {
    BlogCtrl.createBlog = (req, res) => __awaiter(this, void 0, void 0, function* () {
        const blog = yield (0, blog_1.createBlogSrv)(req.body);
        return res.status(200).json(blog);
    });
    BlogCtrl.getBlogById = (req, res) => __awaiter(this, void 0, void 0, function* () {
        const blog = yield (0, blog_1.getBlogByIdSrv)(req.params.id);
        return res.status(200).json(blog);
    });
    BlogCtrl.getBlog = (req, res) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        const { offset, limit } = req.query;
        // @ts-ignore
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const blogs = yield (0, blog_1.getBlogSrv)({
            offset: parseInt(offset),
            limit: parseInt(limit),
        }, userId);
        return res.status(200).json(blogs);
    });
    BlogCtrl.increaseViewBlog = (req, res) => __awaiter(this, void 0, void 0, function* () {
        const blog = yield (0, blog_1.increaseViewBlogSrv)(req.params.id);
        return res.status(200).json(blog);
    });
    BlogCtrl.updateBlog = (req, res) => __awaiter(this, void 0, void 0, function* () {
        const blog = yield (0, blog_1.updateBlogSrv)(req.params.id, req.body);
        return res.status(200).json(blog);
    });
    BlogCtrl.searchBlog = (req, res) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        const { search } = req.query;
        // @ts-ignore
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        // @ts-ignore
        const blogs = yield (0, blog_1.searchBlogSrv)(search, userId);
        return res.status(200).json(blogs);
    });
    BlogCtrl.deleteBlog = (req, res) => __awaiter(this, void 0, void 0, function* () {
        const blog = yield (0, blog_1.deleteBlogSrv)(req.params.id);
        return res.status(200).json(blog);
    });
    BlogCtrl.getRelatedBlog = (req, res) => __awaiter(this, void 0, void 0, function* () {
        const id = req.params.id;
        const { limit } = req.query;
        const blogs = yield (0, blog_1.getRelatedBlogSrv)(id, Number(limit));
        return res.status(200).json(blogs);
    });
})(BlogCtrl || (BlogCtrl = {}));
exports.default = BlogCtrl;
