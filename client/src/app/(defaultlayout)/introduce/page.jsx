import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  BookOpen,
  Brain,
  FileText,
  FlashlightIcon as FlashIcon,
  MessageSquare,
  CheckCircle,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <BookOpen className="h-6 w-6" />
          <span className="ml-2 text-lg font-bold">TOEIC Prep</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            Trang chủ
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            Tính năng
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            Giá cả
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            Liên hệ
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Chào mừng đến với TOEIC Prep
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Nền tảng học TOEIC hiện đại, tiện lợi và hiệu quả, giúp bạn dễ
                  dàng chuẩn bị cho kỳ thi TOEIC một cách toàn diện.
                </p>
              </div>
              <div className="space-x-4">
                <Button>Bắt đầu ngay</Button>
                <Button variant="outline">Tìm hiểu thêm</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Vì sao nên chọn TOEIC Prep?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hiện đại và tiện lợi</CardTitle>
                </CardHeader>
                <CardContent>
                  Mọi tài nguyên học tập đều trong tầm tay bạn, dù ở bất kỳ đâu,
                  trên bất kỳ thiết bị nào.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Cá nhân hóa</CardTitle>
                </CardHeader>
                <CardContent>
                  Lộ trình học và thi được thiết kế phù hợp với năng lực và mục
                  tiêu của từng người học.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Hỗ trợ bởi công nghệ AI</CardTitle>
                </CardHeader>
                <CardContent>
                  Đưa trải nghiệm học tập của bạn lên một tầm cao mới với các
                  tính năng AI mạnh mẽ.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Chúng tôi mang đến cho bạn
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <FileText className="h-6 w-6 mb-2" />
                  <CardTitle>Thi TOEIC như thật</CardTitle>
                </CardHeader>
                <CardContent>
                  Làm bài thi trực tuyến với cấu trúc giống kỳ thi thực tế, giúp
                  bạn làm quen và tự tin trước ngày thi.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <BarChart className="h-6 w-6 mb-2" />
                  <CardTitle>Phân tích kết quả chi tiết</CardTitle>
                </CardHeader>
                <CardContent>
                  Hiển thị điểm số và phân tích sâu hiệu suất từng phần, giúp
                  bạn hiểu rõ điểm mạnh và điểm cần cải thiện.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <FlashIcon className="h-6 w-6 mb-2" />
                  <CardTitle>Flashcard từ vựng thông minh</CardTitle>
                </CardHeader>
                <CardContent>
                  Phương pháp học từ vựng hiệu quả với công cụ tự động điền nội
                  dung từ vựng và v�� dụ minh họa.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Brain className="h-6 w-6 mb-2" />
                  <CardTitle>AI giải thích đáp án</CardTitle>
                </CardHeader>
                <CardContent>
                  Giải đáp thắc mắc chi tiết, giúp bạn hiểu rõ từng câu hỏi và
                  tránh lặp lại sai lầm.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <BarChart className="h-6 w-6 mb-2" />
                  <CardTitle>Thống kê và theo dõi tiến độ</CardTitle>
                </CardHeader>
                <CardContent>
                  Trang tổng quan hiển thị biểu đồ tiến bộ, lịch sử làm bài, và
                  các chỉ số giúp bạn dễ dàng định hướng học tập.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Nâng cấp tài khoản để sở hữu đầy đủ tính năng
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gói Cơ bản</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                      Truy cập không giới hạn bài thi thử
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                      Flashcard từ vựng cơ bản
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                      Phân tích kết quả cơ bản
                    </li>
                  </ul>
                  <Button className="w-full mt-4">Đăng ký miễn phí</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Gói Nâng cao</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                      Tất cả tính năng của Gói Cơ bản
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                      AI giải thích đáp án chi tiết
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                      Lộ trình học tập cá nhân hóa
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                      Flashcard từ vựng nâng cao
                    </li>
                  </ul>
                  <Button className="w-full mt-4">Nâng cấp ngay</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Gói Premium</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                      Tất cả tính năng của Gói Nâng cao
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                      Hỗ trợ 1-1 với giáo viên TOEIC
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                      Phân tích kết quả chuyên sâu với AI
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                      Bài tập độc quyền cập nhật hàng tuần
                    </li>
                  </ul>
                  <Button className="w-full mt-4">Trải nghiệm Premium</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Cam kết của TOEIC Prep
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Chúng tôi tin rằng việc học TOEIC không cần phải phức tạp hay áp
                lực. Với TOEIC Prep, bạn sẽ trải nghiệm một cách học tập dễ
                dàng, thông minh và đầy động lực.
              </p>
              <Button size="lg">Bắt đầu hành trình ngay hôm nay</Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 TOEIC Prep. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Điều khoản dịch vụ
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Chính sách bảo mật
          </Link>
        </nav>
      </footer>
    </div>
  );
}
