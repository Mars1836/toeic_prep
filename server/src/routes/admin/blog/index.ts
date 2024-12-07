import express, { Request, Response } from "express";
import { handleAsync } from "../../../middlewares/handle_async";
import BlogCtrl from "../../../controllers/blog";
const adminBlogRouter = express.Router();
adminBlogRouter.post("/", handleAsync(BlogCtrl.createBlog));

export default adminBlogRouter;
