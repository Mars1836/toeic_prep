"use client";
import BlogCardHorizontal from "@/components/component/blog.blog-horizontal";
import { useCallback, useEffect, useState } from "react";
import { Input } from "~components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagination } from "./pagination";
import { useEndpoint } from "@/components/wrapper/endpoint-context";

const ITEMS_PER_PAGE = 5;

export default function BlogPage() {
  const { endpoint } = useEndpoint();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [blogPosts, setBlogPosts] = useState([]);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = blogPosts.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(blogPosts.length / ITEMS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const fetchBlogPosts = useCallback(async () => {
    const response = await instance.get(endpoint.blog.searchBlog, {
      params: {
        search: searchTerm,
      },
    });
    setBlogPosts(response.data);
    setCurrentPage(1);
    setSearchTerm("");
  }, [searchTerm]);
  useEffect(() => {
    fetchBlogPosts();
  }, []);
  const handleSearch = () => {
    fetchBlogPosts();
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(); // Tìm kiếm khi nhấn Enter
    }
  };
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">English Learning Blog</h1>
      <div className="flex  gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search English learning topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            onKeyDown={handleKeyDown}
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>
        <Button onClick={handleSearch}>Search</Button>
      </div>
      <div className="mt-8">
        {currentItems.map((blog, index) => (
          <div className="mb-8" key={blog.id}>
            <BlogCardHorizontal blog={blog} />
          </div>
        ))}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
