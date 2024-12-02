import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CustomRecommendations({ timeRange }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Đề xuất
          {/* (
          {timeRange === "week"
            ? "Tuần"
            : timeRange === "month"
            ? "Tháng"
            : "Năm"}
          ) */}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          <li>Focus on improving your performance in Part 6 and Part 7.</li>
          <li>Practice more on questions related to Tone and Purpose.</li>
          <li>Work on time management for Part 3 questions.</li>
        </ul>
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Recommended Resources:</h4>
          <ul className="space-y-2">
            <li>
              <Button variant="link" className="p-0">
                TOEIC Official Guide
              </Button>
            </li>
            <li>
              <Button variant="link" className="p-0">
                Grammar for TOEIC
              </Button>
            </li>
            <li>
              <Button variant="link" className="p-0">
                TOEIC Practice Tests
              </Button>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
