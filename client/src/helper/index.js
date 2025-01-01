import { toast } from "react-toastify";

export function makeid(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
export function handleErrorWithToast(error) {
  const { response } = error;
  if (error.message) {
    return toast.error(error.message);
  }
  if (response?.data) {
    const { errors } = response.data;
    if (!errors) return toast.error("Uops! Something wrong!");
    return toast.error(errors[0].message);
  }

  return toast.error("Uops! Something wrong!");
}
export function filterObject(obj, allowedFields) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => allowedFields.includes(key))
  );
}
export function convertSeconds(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  let result = [];

  if (hours > 0) {
    result.push(`${hours} giờ`);
  }
  if (minutes > 0) {
    result.push(`${minutes} phút`);
  }
  if (remainingSeconds > 0 || result.length === 0) {
    // Hiển thị giây kể cả khi là 0 nếu không có giờ/phút
    result.push(`${remainingSeconds} giây`);
  }

  return result.join(" ");
}
export function formatDate(dateString) {
  try {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0 nên cần +1
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  } catch (error) {
    console.log("dataString is not valid");
  }
}
export function calculateDecay(s, t) {
  // Tính toán giá trị R theo công thức R = R0 * e^(-kt)
  // R0 = 1 vì đây là giá trị ban đầu
  return 1 * Math.exp(-t / s);
}
export function formatTimeAgo(date) {
  try {
    //data: Date
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "vừa xong";

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} giờ trước`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} ngày trước`;

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths} tháng trước`;

    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} năm trước`;
  } catch (error) {
    console.log("date is not valid");
  }
}
export function expiredDate(date) {
  const now = new Date();
  if (!date) return "";
  if (new Date(date) < now) return formatDate(date);
  return "";
}
export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
