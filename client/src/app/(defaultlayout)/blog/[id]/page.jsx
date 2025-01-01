"use client";
import instance from "~configs/axios.instance";
import { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";
import DOMPurify from "dompurify";
import "~styles/quill-custom.css";
import { formatDate } from "~helper";
import { CalendarIcon, Eye, TagIcon, UserIcon } from "lucide-react";
import Image from "next/image";
import { BlogCard } from "~components/component/home.blog-list";
import { useEndpoint } from "@/components/wrapper/endpoint-context";
import { Loader2 } from "lucide-react";
function BlogPage({ params }) {
  const { id } = params;
  const { endpoint } = useEndpoint();
  const [blogData, setBlogData] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loadingBlog, setLoadingBlog] = useState(true);
  useEffect(() => {
    async function fetchBlogData() {
      const response = await instance.get(`${endpoint.blog.getBlog}/${id}`);
      const data = await response.data;
      setBlogData(data);
      await instance.post(`${endpoint.blog.viewBlog}/${id}/view`);
      setLoadingBlog(false);
    }
    async function fetchRelatedBlogs() {
      const response = await instance.get(
        `${endpoint.blog.getRelatedBlog}/${id}/related?limit=3`
      );
      const data = await response.data;
      setRelatedBlogs(data);
    }
    fetchBlogData();
    fetchRelatedBlogs();
  }, [id]);
  return loadingBlog ? (
    <div className="flex justify-center items-center w-full mt-10">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      {blogData && (
        <>
          <div className="mb-8 p-4 pt-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {blogData.title}
            </h1>
            <p className=" text-gray-600 mb-4">{blogData.description}</p>
            <div className="relative w-full h-64 md:h-96 mb-4">
              <Image
                src={blogData.image}
                alt={blogData.title}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
            <div className="flex flex-wrap items-center text-sm text-gray-600 gap-4">
              <div className="flex items-center">
                <TagIcon className="w-4 h-4 mr-1" />
                {blogData.category}
              </div>
              <div className="flex items-center">
                <CalendarIcon className="w-4 h-4 mr-1" />
                {formatDate(blogData.createdAt)}
              </div>
              <div className="flex items-center">
                <UserIcon className="w-4 h-4 mr-1" />
                {blogData.author}
              </div>
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                {blogData.view}
              </div>
            </div>
          </div>
          <div
            className="ql-editor blog-content"
            style={{
              fontSize: "1.1rem",
              lineHeight: "1.8",
              color: "#2c3e50",
            }}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(blogData?.content),
            }}
          />
        </>
      )}
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Bài viết liên quan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {relatedBlogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default BlogPage;
