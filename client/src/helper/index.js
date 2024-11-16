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
  if (response?.data) {
    const { errors } = response.data;
    return toast.error(errors[0].message);
  }
  if (error.message) {
    return toast.error(error.message);
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
