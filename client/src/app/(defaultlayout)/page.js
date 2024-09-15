import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1">
        <section
          id="toeic-full-exam"
          className="bg-muted py-12 md:py-16 lg:py-20"
        >
          <div className=" px-4 md:px-6">
            <div className="space-y-6 text-center">
              <h2 className="text-3xl md:text-4xl font-bold">
                TOEIC Full Exam Practice
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Test your TOEIC skills with our full-length practice exam,
                covering all sections of the test.
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-background shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>Listening Section</CardTitle>
                    <CardDescription>
                      Practice the listening comprehension portion of the TOEIC
                      exam.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link
                      href="/test"
                      className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      prefetch={false}
                    >
                      Start Listening Practice
                    </Link>
                  </CardContent>
                </Card>
                <Card className="bg-background shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>Reading Section</CardTitle>
                    <CardDescription>
                      Practice the reading comprehension portion of the TOEIC
                      exam.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link
                      href="#"
                      className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      prefetch={false}
                    >
                      Start Reading Practice
                    </Link>
                  </CardContent>
                </Card>
                <Card className="bg-background shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>Full Exam</CardTitle>
                    <CardDescription>
                      Take a full-length TOEIC practice exam to simulate the
                      real test experience.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link
                      href="#"
                      className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      prefetch={false}
                    >
                      Start Full Exam
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
        <section
          id="practice-toeic-part1"
          className="bg-muted py-12 md:py-16 lg:py-20"
        >
          <div className=" px-4 md:px-6">
            <div className="space-y-6 text-center">
              <h2 className="text-3xl md:text-4xl font-bold">
                TOEIC Part 1 Practice
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Test your listening comprehension skills with our TOEIC Part 1
                practice questions.
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-background shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>Photographs</CardTitle>
                    <CardDescription>
                      Practice identifying the correct response based on
                      photographs.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link
                      href="#"
                      className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      prefetch={false}
                    >
                      Start Practice
                    </Link>
                  </CardContent>
                </Card>
                <Card className="bg-background shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>Question-Response</CardTitle>
                    <CardDescription>
                      Practice identifying the correct response to a spoken
                      question.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link
                      href="#"
                      className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      prefetch={false}
                    >
                      Start Practice
                    </Link>
                  </CardContent>
                </Card>
                <Card className="bg-background shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>Statements</CardTitle>
                    <CardDescription>
                      Practice identifying the correct statement based on a
                      spoken conversation.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link
                      href="#"
                      className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      prefetch={false}
                    >
                      Start Practice
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
        <section id="toeic-questions" className="py-12 md:py-16 lg:py-20">
          <div className=" px-4 md:px-6">
            <div className="space-y-6 text-center">
              <h2 className="text-3xl md:text-4xl font-bold">
                TOEIC Practice Questions
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Test your TOEIC skills with our comprehensive collection of
                practice questions, covering all sections of the exam.
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-background shadow-sm hover:shadow-md transition-shadow">
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
                      className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      prefetch={false}
                    >
                      Start Listening
                    </Link>
                  </CardContent>
                </Card>
                <Card className="bg-background shadow-sm hover:shadow-md transition-shadow">
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
                      className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      prefetch={false}
                    >
                      Start Reading
                    </Link>
                  </CardContent>
                </Card>
                <Card className="bg-background shadow-sm hover:shadow-md transition-shadow">
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
                      className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
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
      </main>
    </div>
  );
}
