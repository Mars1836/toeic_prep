"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "react-toastify";
import {
  Calendar,
  CreditCard,
  User,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useEndpoint } from "@/components/wrapper/endpoint-context";
import instance from "~configs/axios.instance";

export default function ToeicRegistration() {
  const { endpoint } = useEndpoint();
  const [pendingTests, setPendingTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 4,
    totalPages: 0,
  });

  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      idNumber: "",
    },
    agreeTerms: false,
  });

  const fetchPendingTests = async (page = 1, limit = 4) => {
    try {
      setIsLoading(true);
      const response = await instance.get(
        `${endpoint.toeicTest.getPendingTests}?page=${page}&limit=${limit}`
      );
      await new Promise((resolve) => setTimeout(resolve, 300));
      setPendingTests(response.data.data);
      setPagination(response.data.pagination);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching pending tests:", error);
      setIsLoading(false);
      toast.error("Không thể tải danh sách kỳ thi");
    }
  };

  useEffect(() => {
    fetchPendingTests();
  }, [endpoint]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchPendingTests(newPage, pagination.limit);
    }
  };

  const handlePersonalInfoChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTest) {
      toast.error("Vui lòng chọn kỳ thi");
      return;
    }
    if (!formData.agreeTerms) {
      toast.error("Vui lòng đồng ý với điều khoản và điều kiện");
      return;
    }

    try {
      setIsProcessingPayment(true);
      const response = await instance.post(
        `${endpoint.payment.createPaymentTestRegistration}`,
        {
          examId: selectedTest.id,
          personalInfo: formData.personalInfo,
        }
      );

      if (response.data.return_code === 1) {
        window.location.href = response.data.order_url;
      } else {
        toast.error(
          response.data.return_message || "Có lỗi xảy ra khi tạo đơn thanh toán"
        );
      }
    } catch (error) {
      console.error("Error creating payment:", error);
      toast.error("Không thể tạo đơn thanh toán");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">
            Đăng Ký Thi TOEIC
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <User className="h-5 w-5" />
                <h3 className="text-xl font-semibold">Thông tin cá nhân</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Họ và tên *</Label>
                  <Input
                    id="fullName"
                    value={formData.personalInfo.fullName}
                    onChange={(e) =>
                      handlePersonalInfoChange("fullName", e.target.value)
                    }
                    placeholder="Nhập họ và tên đầy đủ"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.personalInfo.email}
                    onChange={(e) =>
                      handlePersonalInfoChange("email", e.target.value)
                    }
                    placeholder="example@email.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Số điện thoại *</Label>
                  <Input
                    id="phone"
                    value={formData.personalInfo.phone}
                    onChange={(e) =>
                      handlePersonalInfoChange("phone", e.target.value)
                    }
                    placeholder="0123456789"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Ngày sinh *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.personalInfo.dateOfBirth}
                    onChange={(e) =>
                      handlePersonalInfoChange("dateOfBirth", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="idNumber">Số CMND/CCCD *</Label>
                  <Input
                    id="idNumber"
                    value={formData.personalInfo.idNumber}
                    onChange={(e) =>
                      handlePersonalInfoChange("idNumber", e.target.value)
                    }
                    placeholder="Nhập số CMND/CCCD"
                    required
                  />
                </div>
              </div>

              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <h3 className="text-xl font-semibold">Chọn kỳ thi</h3>
                  </div>
                  <div className="text-sm text-gray-600">
                    Trang {pagination.page} / {pagination.totalPages}
                  </div>
                </div>

                <div className="relative">
                  <div
                    className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-300 ${
                      isLoading ? "opacity-50 blur-sm" : "opacity-100 blur-0"
                    }`}
                  >
                    {pendingTests.map((test) => (
                      <Card
                        key={test.id}
                        className={`transition-all ${
                          test.isRegister
                            ? "bg-gray-100 cursor-not-allowed"
                            : selectedTest?.id === test.id
                            ? "border-blue-500 ring-2 ring-blue-500 cursor-pointer"
                            : "hover:border-blue-300 cursor-pointer"
                        }`}
                        onClick={() =>
                          !test.isRegister && setSelectedTest(test)
                        }
                      >
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="font-semibold">
                                {test.testCenter}
                              </div>
                              {test.isRegister && (
                                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                  Đã đăng ký
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600">
                              {formatDate(test.timeStart)}
                            </div>
                            <div className="text-sm text-gray-600">
                              {formatTime(test.timeStart)} -{" "}
                              {formatTime(test.timeEnd)}
                            </div>
                            <div className="font-semibold text-blue-600">
                              {test.price.toLocaleString("vi-VN")} VNĐ
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-center items-center space-x-2 mt-6">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1 || isLoading}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">
                    Trang {pagination.page} / {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={
                      pagination.page === pagination.totalPages || isLoading
                    }
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeTerms}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, agreeTerms: checked }))
                  }
                />
                <Label htmlFor="terms" className="text-sm">
                  Tôi đồng ý với{" "}
                  <a href="#" className="text-blue-600 underline">
                    điều khoản và điều kiện
                  </a>{" "}
                  của kỳ thi TOEIC
                </Label>
              </div>

              {/* Payment Button */}
              <div className="flex justify-end mt-8">
                <Button
                  type="submit"
                  className="w-full md:w-auto"
                  disabled={isProcessingPayment || !selectedTest}
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    "Thanh toán"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
