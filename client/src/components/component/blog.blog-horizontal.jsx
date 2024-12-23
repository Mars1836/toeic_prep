import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, MessageCircle, ThumbsUp } from "lucide-react";
import { formatDate } from "~helper";
import { useRouter } from "next/navigation";

export default function BlogCardHorizontal({ blog }) {
  const router = useRouter();
  return (
    <Card
      className="overflow-hidden cursor-pointer"
      onClick={() => router.push(`/blog/${blog.id}`)}
    >
      <div className="flex flex-col md:flex-row">
        <div className="relative w-full md:w-1/3">
          <img
            src={blog.image}
            alt={blog.title}
            className="object-cover h-[200px] w-[400px]"
          />
        </div>
        <CardContent className="flex-1 p-4 md:p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-gray-600 uppercase">
              {blog.category}
            </span>
          </div>
          <h3 className="mb-2 text-xl font-bold leading-tight">{blog.title}</h3>
          <p className="mb-4 text-sm text-gray-600 line-clamp-2">
            {blog.description}
          </p>
          <div className="flex items-center justify-between mt-auto">
            <div className="text-sm">
              <p className="font-medium">{blog.author}</p>
              <p className="text-gray-500">{formatDate(blog.createdAt)}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-sm text-gray-500">
                <Eye className="w-4 h-4" />
                {blog.view}
              </span>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
