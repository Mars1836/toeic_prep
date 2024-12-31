import "./globals.css";
import { Bounce, ToastContainer } from "react-toastify";
import StoreProvider from "./StoreProvider";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
import RootLayout from "@/components/wrapper/root-layout";
import { EndpointProvider } from "~components/wrapper/endpoint-context";
export const metadata = {
  title: "Toeic Journey",
  description: "Toeic Journey",
};
function LayoutWrapper({ children }) {
  return (
    <html lang="en">
      <body>
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <title>Trang Web Của Tôi</title>
        </Head>
        <EndpointProvider>
          <StoreProvider>
            <RootLayout>{children}</RootLayout>
          </StoreProvider>
        </EndpointProvider>
        <ToastContainer
          position="top-right"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover={false}
          theme="light"
          transition={Bounce}
        />
      </body>
    </html>
  );
}

export default LayoutWrapper;
