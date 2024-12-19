"use client";

import {
  Check,
  X,
  Book,
  Brain,
  BarChart,
  Mail,
  Zap,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import instance from "~configs/axios.instance";
import { endpoint } from "~consts";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { expiredDate, formatDate, handleErrorWithToast } from "~helper";
import { Alert, AlertDescription, AlertTitle } from "~components/ui/alert";
import { useSelector } from "react-redux";

const features = [
  { name: "Làm bài thi TOEIC", free: true, pro: true, icon: Book },
  { name: "Chấm điểm và lưu kết quả", free: true, pro: true, icon: Check },
  { name: "Tạo bộ flashcard", free: true, pro: true, icon: Brain },
  { name: "Truy cập flashcards có sẵn", free: true, pro: true, icon: Brain },
  { name: "Truy cập blog", free: true, pro: true, icon: Book },
  { name: "Điền tự động bằng AI", free: false, pro: true, icon: Zap },
  { name: "Lời giải AI cho câu hỏi", free: false, pro: true, icon: Brain },
  { name: "Phân tích chỉ số cá nhân", free: false, pro: true, icon: BarChart },
  { name: "Trắc nghiệm và nhắc nhở", free: false, pro: true, icon: Mail },
];

function FeatureRow({ feature, isPro }) {
  const Icon = feature.icon;
  return (
    <div className={`flex items-center p-2 ${isPro ? "bg-primary/5" : ""}`}>
      <Icon
        className={`mr-2 h-5 w-5 ${isPro ? "text-primary" : "text-gray-400"}`}
      />
      <span className="flex-grow">{feature.name}</span>
      {!isPro &&
        (feature.free ? (
          <Check className="h-5 w-5 text-green-500" />
        ) : (
          <X className="h-5 w-5 text-red-500" />
        ))}
      {isPro && <Check className="h-5 w-5 ml-2 text-green-500" />}
    </div>
  );
}

export default function EnhancedPricingComparisonComponent() {
  const [paymentLoading, setPaymentloading] = useState(false);
  const user = useSelector((state) => state.user.data);
  const router = useRouter();
  async function handleUpgrade() {
    try {
      setPaymentloading(true);
      const { data } = await instance.post(endpoint.payment.createPayment);
      router.push(data.order_url);
      setPaymentloading(false);
    } catch (error) {
      setPaymentloading(false);
      handleErrorWithToast(error);
    }
  }

  return (
    <div className="container mx-auto px-4 py-16 bg-gradient-to-b from-gray-50 to-white">
      <h1 className="text-4xl font-extrabold text-center mb-4">
        Chọn gói dịch vụ phù hợp với bạn
      </h1>
      <p className="text-center text-gray-600 mb-12">
        Nâng cao kỹ năng TOEIC của bạn với các tính năng độc đáo
      </p>
      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {user.upgradeStatus === "UPGRADED" && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-2xl">
                Gói hiện tại của bạn: Nâng cấp
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Thông báo</AlertTitle>
                <AlertDescription>
                  Gói Nâng cấp của bạn sẽ hết hạn vào ngày{" "}
                  {formatDate(user.upgradeExpiredDate)}
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-[#15192c] hover:bg-[#15192c]/90"
                onClick={handleUpgrade}
              >
                {paymentLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  "Gia hạn gói Nâng cấp"
                )}
              </Button>
            </CardFooter>
          </Card>
        )}
        {user.upgradeStatus === "EXPIRED" && (
          <Card className="md:col-span-2 ">
            <CardHeader>
              <CardTitle className="text-2xl">Trạng thái gói dịch vụ</CardTitle>
            </CardHeader>
            <CardContent className="border-red-500 text-red-500">
              <Alert
                variant="destructive"
                className="border-red-500 text-red-500"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Thông báo</AlertTitle>
                <AlertDescription>
                  Gói Nâng cấp của bạn đã hết hạn vào ngày{" "}
                  {expiredDate(user.upgradeExpiredDate)}. Vui lòng gia hạn để
                  tiếp tục sử dụng các tính năng nâng cao.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-[#15192c] hover:bg-[#15192c]/90"
                onClick={handleUpgrade}
              >
                {paymentLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  "Gia hạn gói Nâng cấp"
                )}
              </Button>
            </CardFooter>
          </Card>
        )}

        <Card className="border-gray-200 transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Gói Miễn phí</CardTitle>
            <CardDescription>
              <span className="text-3xl font-bold">0 VNĐ</span>/tháng
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={40} className="h-2 mb-6 bg-slate-200" />
            {features.map((feature, index) => (
              <FeatureRow key={index} feature={feature} isPro={false} />
            ))}
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline">
              {user.upgradeStatus !== "UPGRADED" ? "Đang sử dụng" : "Miễn phí"}
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-primary bg-primary/5 transition-all duration-300 hover:shadow-lg relative overflow-hidden">
          <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
            Khuyến nghị
          </Badge>
          <CardHeader>
            <CardTitle className="text-2xl text-primary">
              Gói Nâng cấp
            </CardTitle>
            <CardDescription>
              <span className="text-3xl font-bold text-primary">5.000 VNĐ</span>
              /tháng
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={100} className="h-2 mb-6" />
            {features.map((feature, index) => (
              <FeatureRow key={index} feature={feature} isPro={true} />
            ))}
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleUpgrade}
            >
              {paymentLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Nâng cấp ngay"
              )}
            </Button>

            {user.upgradeStatus === "EXPIRED" && (
              <Button
                className="w-full"
                variant="outline"
                onClick={handleUpgrade}
              >
                {paymentLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  "Gia hạn thêm"
                )}
              </Button>
            )}
          </CardFooter>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 rounded-full"></div>
        </Card>
      </div>
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Vẫn còn thắc mắc?</h2>
        <p className="text-gray-600 mb-4">
          Liên hệ với chúng tôi để được tư vấn thêm về gói dịch vụ phù hợp nhất
          với bạn.
        </p>
        <Button variant="outline">Liên hệ hỗ trợ</Button>
      </div>
    </div>
  );
}
