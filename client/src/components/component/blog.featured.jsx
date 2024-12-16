import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

const featuredPosts = [
  {
    id: 1,
    title: "10 Essential Phrasal Verbs for Daily Conversations",
    image: "/images/phrasal-verbs.jpg",
    category: "Vocabulary",
  },
  {
    id: 2,
    title: "Mastering the Art of Small Talk in English",
    image: "/images/small-talk.jpg",
    category: "Speaking",
  },
  {
    id: 3,
    title: "Common English Idioms and Their Origins",
    image: "/images/idioms.jpg",
    category: "Culture & Language",
  },
];

export default function FeaturedPosts() {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold mb-4">Featured Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredPosts.map((post) => (
          <Card key={post.id} className="overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              width={400}
              height={200}
              className="w-full h-48 object-cover"
            />
            <CardHeader>
              <CardTitle className="text-lg">{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {post.category}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
