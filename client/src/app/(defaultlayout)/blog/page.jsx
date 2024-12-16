import BlogList from "@/components/component/blog.blog-list";
import FeaturedPosts from "@/components/component/blog.featured";

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">English Learning Blog</h1>
      <FeaturedPosts />
      <BlogList />
    </div>
  );
}

