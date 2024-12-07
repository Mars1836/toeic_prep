import express, { Request, Response } from "express";
import { handleAsync } from "../../../middlewares/handle_async";
import BlogCtrl from "../../../controllers/blog";
const pubBlogRouter = express.Router();
pubBlogRouter.get("/", handleAsync(BlogCtrl.getBlog));
pubBlogRouter.get("/:id", handleAsync(BlogCtrl.getBlogById));

export default pubBlogRouter;
