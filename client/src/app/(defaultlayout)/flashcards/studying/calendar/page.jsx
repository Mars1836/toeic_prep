import { ReviewCalendar } from "@/components/ReviewCalendar";
export default function Calendar() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">English Word Review Calendar</h1>
      <ReviewCalendar />
    </main>
  );
}
