"use client";
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { providerWrapper } from "@/HOC/withProvider";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setUserState } from "@/lib/redux/userSlice";
import Header from "@/components/header";
import useFetch from "@/hooks/useFetch";
import { endpoint } from "@/consts";
import { ToastContainer } from "react-toastify";
import StoreProvider from "./StoreProvider";
import "react-toastify/dist/ReactToastify.css";

function LayoutWrapper({ children }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <RootLayout>{children}</RootLayout>
          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            pauseOnHover
            theme="light"
          />
          <ToastContainer />
        </StoreProvider>
      </body>
    </html>
  );
}
function RootLayout({ children }) {
  const dispatch = useDispatch();
  const { sendRequest, errors } = useFetch({
    url: endpoint.auth.currentUser,
    method: "get",
    onSuccess: (data) => {
      console.log(data);
      dispatch(setUserState(data));
    },
  });
  useEffect(() => {
    sendRequest();
  }, []);
  return <div>{children}</div>;
}
export default LayoutWrapper;
