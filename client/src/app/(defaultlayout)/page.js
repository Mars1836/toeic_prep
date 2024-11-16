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
export default function Home() {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <main className="flex-1">
        <ToeicBanner></ToeicBanner>
        <section id="toeic-full-exam" className="bg-muted py-0 md:py-2 lg:py-4">
          <div className="px-4 md:px-6">
            {/* <div className="space-y-6 text-center">
              <h2 className="text-3xl font-bold md:text-4xl">
                TOEIC Full Exam Practice
              </h2>
              <p className="text-muted-foreground mx-auto max-w-2xl">
                Test your TOEIC skills with our full-length practice exam,
                covering all sections of the test.
              </p> */}
            <div>
              <TestCardList></TestCardList>
            </div>
            {/* </div> */}
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
