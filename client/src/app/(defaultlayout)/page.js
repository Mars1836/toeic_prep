"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import TestCardList from "@/components/component/test_card";
import ResultCardList from "@/components/component/result_card";
import ToeicBanner from "@/components/component/banner.home";
import BlogList from "@/components/component/bloglist";
import TOEICServices from "@/components/component/service.home";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.prefetch(`/flashcards/set`);
    router.prefetch(`/upgrade`);
  }, []);
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <main className="flex-1">
        <ToeicBanner></ToeicBanner>
        <section id="toeic-full-exam" className="bg-muted py-0 md:py-2 lg:py-4">
          <div className="px-4 md:px-6">
            <div>
              <TestCardList></TestCardList>
            </div>
          </div>
        </section>
        <section
          id="practice-toeic-part1"
          className="bg-muted py-0 md:py-2 lg:py-4"
        >
          <div className="px-4 md:px-6">
            {}
            <div>
              <ResultCardList />
            </div>
            {}
          </div>
        </section>
        <section className="bg-muted py-0 md:py-2 lg:py-4">
          <TOEICServices></TOEICServices>
        </section>

        <section id="blog-list" className="bg-muted py-0 md:py-2 lg:py-4">
          <BlogList></BlogList>
        </section>
      </main>
    </div>
  );
}
