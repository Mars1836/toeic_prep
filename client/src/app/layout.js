import "./globals.css";
import { ToastContainer } from "react-toastify";
import StoreProvider from "./StoreProvider";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
import RootLayout from "@/components/wrapper/root-layout";
export const metadata = {
  title: "Toeic Prep",
  description: "Toeic Prep",
};
function LayoutWrapper({ children }) {
  return (
    <html lang="en">
      <body>
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <title>Trang Web Của Tôi</title>
        </Head>
        <StoreProvider>
          <RootLayout>{children}</RootLayout>
        </StoreProvider>
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
      </body>
    </html>
  );
}

export default LayoutWrapper;
