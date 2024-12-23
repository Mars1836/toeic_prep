"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Image from "next/image";

const blogPosts = [
  {
    id: 1,
    title: "Effective Strategies for Learning English Vocabulary",
    excerpt:
      "Discover proven methods to expand your English vocabulary quickly and efficiently.",
    category: "Vocabulary",
    image: "/images/vocabulary.jpg",
  },
  {
    id: 2,
    title: "Improving Your English Pronunciation",
    excerpt:
      "Learn techniques to perfect your English accent and sound more like a native speaker.",
    category: "Pronunciation",
    image: "/images/pronunciation.jpg",
  },
  {
    id: 3,
    title: "English Grammar Made Easy: Understanding Tenses",
    excerpt:
      "Simplify complex English tenses with our comprehensive guide and examples.",
    category: "Grammar",
    image: "/images/grammar.jpg",
  },
  {
    id: 4,
    title: "Top 5 English Learning Apps for 2023",
    excerpt:
      "Explore the best mobile applications to supplement your English learning journey.",
    category: "Learning Tools",
    image: "/images/apps.jpg",
  },
  {
    id: 5,
    title: "Mastering English Idioms: Business Edition",
    excerpt:
      "Enhance your professional English with commonly used business idioms and phrases.",
    category: "Business English",
    image: "/images/business-idioms.jpg",
  },
];

export default function BlogList() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPosts = blogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              width={400}
              height={200}
              className="w-full h-48 object-cover"
            />
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{post.excerpt}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {post.category}
                </span>
                <Button variant="outline" size="sm">
                  Read More
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {filteredPosts.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          No blog posts found matching your search.
        </p>
      )}
    </div>
  );
}
