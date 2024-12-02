import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InfoIcon } from "lucide-react";

const StatusExplanationModal = () => (
  <Dialog>
    <DialogTrigger asChild>
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-10"
      >
        <InfoIcon className="w-4 h-4 mr-1" /> Status Info
      </Button>
    </DialogTrigger>
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle>Status Explanation</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 w-2xl">
        <div>
          <h3 className="font-semibold text-lg">
            Mức độ ghi nhớ (Decay Score)
          </h3>
          <p className="mb-2 text-lg">
            Biểu thị khả năng ghi nhớ tại thời điểm hiện tại:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
              0.7-1.0: Vùng nhớ ổn định: Bạn vẫn ghi nhớ tốt từ vựng này.
            </li>
            <li>
              <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
              0.5-0.7: Vùng quên vừa: Bắt đầu quên, nhưng thông tin vẫn có thể
              phục hồi dễ dàng.
            </li>
            <li>
              <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"></span>
              0-0.5: Vùng quên sâu: Đã quên nhiều, phải ôn tập ngay để tránh mất
              hoàn toàn kiến thức.
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-lg  ">
            Mức độ ghi nhớ (Retention Score)
          </h3>
          <p className="mb-2 text-lg">
            Biểu thị khả năng ghi nhớ tại thời điểm hiện tại:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
              4 - : Ghi nhớ tốt, quên khá chậm.
            </li>
            <li>
              <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
              3-4: Ghi nhớ tốt, quên khá chậm.
            </li>
            <li>
              <span className="inline-block w-3 h-3 rounded-full bg-orange-500 mr-2"></span>
              2-3: Ghi nhớ trung bình, quên chậm hơn.
            </li>
            <li>
              <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"></span>
              1 - 2: Ghi nhớ kém, thông tin bị lãng quên nhanh chóng.
            </li>
          </ul>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

export default StatusExplanationModal;
