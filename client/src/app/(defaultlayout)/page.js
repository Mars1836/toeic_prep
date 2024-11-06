import Link from "next/link";
import { Button } from "@/components/ui/button";
import TestCardList from "@/components/component/test_card";
import ResultCardList from "@/components/component/result_card";
import ToeicBanner from "@/components/component/banner";
import BlogList from "@/components/component/bloglist";
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
        <section
          id="toeic-full-exam"
          className="bg-muted py-0 md:py-2 lg:py-4"
        >
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
            {/* <div className="space-y-6 text-center">
              <h2 className="text-3xl font-bold md:text-4xl">
                TOEIC Part 1 Practice
              </h2>
              <p className="text-muted-foreground mx-auto max-w-2xl">
                Test your listening comprehension skills with our TOEIC Part 1
                practice questions.
              </p> */}
              <div>
                <ResultCardList />
              </div>
            {/* </div> */}
          </div>
        </section>
        <section id="toeic-questions" className="bg-muted py-0 md:py-2 lg:py-4">
          <div className="px-4 md:px-6">
            <div className="space-y-6 text-center">
              <h2 className="text-3xl font-bold md:text-4xl">
                TOEIC Practice Questions
              </h2>
              <p className="text-muted-foreground mx-auto max-w-2xl">
                Test your TOEIC skills with our comprehensive collection of
                practice questions, covering all sections of the exam.
              </p>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="bg-background shadow-sm transition-shadow hover:shadow-md">
                  <CardHeader>
                    <CardTitle>Listening Questions</CardTitle>
                    <CardDescription>
                      Practice your listening comprehension with our TOEIC-style
                      listening questions.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link
                      href="#"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary inline-flex items-center justify-center rounded-md px-6 py-2 text-sm font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
                      prefetch={false}
                    >
                      Start Listening
                    </Link>
                  </CardContent>
                </Card>
                <Card className="bg-background shadow-sm transition-shadow hover:shadow-md">
                  <CardHeader>
                    <CardTitle>Reading Questions</CardTitle>
                    <CardDescription>
                      Enhance your reading skills with our TOEIC-style reading
                      practice questions.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link
                      href="#"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary inline-flex items-center justify-center rounded-md px-6 py-2 text-sm font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
                      prefetch={false}
                    >
                      Start Reading
                    </Link>
                  </CardContent>
                </Card>
                <Card className="bg-background shadow-sm transition-shadow hover:shadow-md">
                  <CardHeader>
                    <CardTitle>Grammar Questions</CardTitle>
                    <CardDescription>
                      Test your English grammar knowledge with our TOEIC-style
                      grammar practice questions.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link
                      href="#"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary inline-flex items-center justify-center rounded-md px-6 py-2 text-sm font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
                      prefetch={false}
                    >
                      Start Grammar
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
        <section id="blog-list" className="bg-muted py-0 md:py-2 lg:py-4">
          <BlogList></BlogList>
        </section>
      </main>
    </div>
  );
}
