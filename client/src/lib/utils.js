import { clsx } from "clsx";
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
export function handleErrorPromiseToast(
  message1 = "An error occurred",
  message2
) {
  //(mes1 - ưu tiên sau cùng, mes2 - ưu tiên đầu)
  return function render(data) {
    if (message2) {
      return message2;
    }
    const errors = data?.data?.response?.data?.errors;
    if (errors) {
      return `${errors[0].message}`;
    }
    return message1;
  };
}
export function handleSuccessPromiseToast(message1 = "Action successful!") {
  //(ưu tiên đầu)
  return function render(data) {
    return message1;
  };
}
export function handleToastPromise(
  request,
  success = "Action successful!", //mes1
  error = [], //[mes1,mes2]
  pending = "Action in progress..."
) {
  const successfn = handleSuccessPromiseToast(success);
  const errorfn = handleErrorPromiseToast(...error);
  return toast.promise(request, {
    pending: pending,
    success: {
      render: successfn,
      // other options
      icon: "🟢",
    },
    error: {
      render: errorfn,
    },
  });
}
