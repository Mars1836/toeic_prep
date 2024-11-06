import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, Eye, MessageSquare } from "lucide-react"
import Image from "next/image"


function BlogCard({ post }) {
  return (
    <Card className="h-full flex flex-col bg-white">
      <CardHeader className="p-0">
        <Image
          src={post.imageUrl}
          alt={post.title}
          width={400}
          height={200}
          className="w-full h-48 object-cover"
        />
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <h2 className="text-xl font-bold mb-2">{post.title}</h2>
        <p className="text-muted-foreground mb-4">{post.description}</p>
        {/* <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={post.authorAvatarUrl} alt={post.authorName} />
            <AvatarFallback>{post.authorName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{post.authorName}</span>
        </div> */}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center text-sm text-muted-foreground">
        <div className="flex space-x-4">
          <span className="flex items-center">
            <MessageSquare className="w-4 h-4 mr-1" />
            {post.commentCount}
          </span>
          <span className="flex items-center">
            <Eye className="w-4 h-4 mr-1" />
            {post.viewCount}
          </span>
        </div>
        <span className="flex items-center">
          <CalendarDays className="w-4 h-4 mr-1" />
          {post.publishDate}
        </span>
      </CardFooter>
    </Card>
  )
}

export default function BlogList() {
  const blogPosts = [
    {
      id: 1,
      imageUrl: "/images/blog1.jpg",      title: "Getting Started with React",
      description: "Learn the basics of React and start building your first app.",
      commentCount: 15,
      viewCount: 1020,
      publishDate: "2023-11-01",
      authorName: "Alice Johnson",
      authorAvatarUrl: "/placeholder.svg?height=40&width=40"
    },
    {
      id: 2,
      imageUrl: "/images/blog1.jpg",
      title: "Advanced TypeScript Techniques",
      description: "Dive deep into TypeScript and learn advanced concepts.",
      commentCount: 8,
      viewCount: 750,
      publishDate: "2023-11-05",
      authorName: "Bob Smith",
      authorAvatarUrl: "/placeholder.svg?height=40&width=40"
    },
    {
      id: 3,
      imageUrl: "/images/blog1.jpg",      title: "CSS Grid Mastery",
      description: "Master CSS Grid and create complex layouts with ease.",
      commentCount: 12,
      viewCount: 980,
      publishDate: "2023-11-10",
      authorName: "Charlie Brown",
      authorAvatarUrl: "/placeholder.svg?height=40&width=40"
    },
    {
      id: 4,
      imageUrl: "/images/blog1.jpg",      
      title: "Node.js Best Practices",
      description: "Learn the best practices for building scalable Node.js applications.",
      commentCount: 20,
      viewCount: 1500,
      publishDate: "2023-11-15",
      authorName: "Diana Martinez",
      authorAvatarUrl: "/placeholder.svg?height=40&width=40"
    },
    {
      id: 5,
      imageUrl: "/images/blog1.jpg",      title: "Responsive Web Design Techniques",
      description: "Create websites that look great on any device with these responsive design techniques.",
      commentCount: 18,
      viewCount: 1200,
      publishDate: "2023-11-20",
      authorName: "Ethan Wilson",
      authorAvatarUrl: "/placeholder.svg?height=40&width=40"
    },
    {
      id: 6,
      imageUrl: "/images/blog1.jpg",
        title: "Introduction to GraphQL",
      description: "Get started with GraphQL and learn how it differs from REST APIs.",
      commentCount: 10,
      viewCount: 800,
      publishDate: "2023-11-25",
      authorName: "Fiona Lee",
      authorAvatarUrl: "/placeholder.svg?height=40&width=40"
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Latest Blog Posts</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map(post => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}