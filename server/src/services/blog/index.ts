import { BlogAttr } from "../../models/blog.model";

import { blogModel } from "../../models/blog.model";

export const createBlogSrv = async (blog: BlogAttr) => {
  const newBlog = await blogModel.create(blog);
  return newBlog;
};
export const getBlogByIdSrv = async (id: string) => {
  const blog = await blogModel.findById(id);
  return blog;
};
export const getBlogSrv = async ({
  offset,
  limit,
}: {
  offset: number;
  limit: number;
}) => {
  const blogs = await blogModel.find().skip(offset).limit(limit);
  return blogs;
};
