import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, Eye, MessageSquare, TagIcon, User } from "lucide-react";
import Image from "next/image";
import { endpoint } from "~consts";
import instance from "~configs/axios.instance";
import { useEffect, useState } from "react";
import { formatDate } from "~helper";
import { useRouter } from "next/navigation";

export function BlogCard({ blog }) {
  const router = useRouter();
  return (
    <Card
      className="h-full flex flex-col bg-white cursor-pointer overflow-hidden"
      onClick={() => {
        router.push(`/blog/${blog.id}`);
      }}
    >
      <CardHeader className="p-0">
        <Image
          src={blog.image}
          alt={blog.title}
          width={400}
          height={200}
          className="w-full h-48 object-cover"
        />
      </CardHeader>
      <CardContent className="p-4 pb-0 flex-grow">
        <h2 className="text-xl font-bold mb-2 line-clamp-2">{blog.title}</h2>
        <p className="text-muted-foreground mb-4 line-clamp-2">
          {blog.description}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center flex-wrap text-sm text-muted-foreground">
        <div className="flex space-x-4">
          <span className="flex items-center mb-2">
            <User className="w-4 h-4 mr-1" />
            {blog.author}
          </span>
          <span className="flex items-center mb-2">
            <TagIcon className="w-4 h-4 mr-1" />
            {blog.category}
          </span>
          <span className="flex items-center mb-2">
            <Eye className="w-4 h-4 mr-1" />
            {blog.view}
          </span>
        </div>
        <span className="flex items-center mb-2">
          <CalendarDays className="w-4 h-4 mr-1" />
          {formatDate(blog.createdAt)}
        </span>
      </CardFooter>
    </Card>
  );
}

export default function BlogList() {
  const [blogPosts, setBlogPosts] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const { data } = await instance.get(endpoint.blog.getBlog, {
        params: {
          offset: 0,
          limit: 6,
        },
      });
      if (data) {
        setBlogPosts(data);
      }
    }

    fetchData();
  }, []);
  return (
    <div className="container mx-auto px-0 py-0">
      <h1 className="text-3xl font-bold mb-8 text-center">Bài viết mới</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  );
}
