import { Request, Response } from "express";
import { createBlogSrv, getBlogByIdSrv, getBlogSrv } from "../../services/blog";

namespace BlogCtrl {
  export const createBlog = async (req: Request, res: Response) => {
    const blog = await createBlogSrv(req.body);
    return res.status(200).json(blog);
  };
  export const getBlogById = async (req: Request, res: Response) => {
    const blog = await getBlogByIdSrv(req.params.id);
    return res.status(200).json(blog);
  };
  export const getBlog = async (req: Request, res: Response) => {
    const { offset, limit } = req.query as { offset: string; limit: string };
    const blogs = await getBlogSrv({
      offset: parseInt(offset),
      limit: parseInt(limit),
    });
    return res.status(200).json(blogs);
  };
}
export default BlogCtrl;
