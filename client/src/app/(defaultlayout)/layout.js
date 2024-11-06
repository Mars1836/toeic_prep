"use client";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setUserState } from "../../lib/redux/userSlice";
import Header from "../../components/component/header";
import useFetch from "../../hooks/useFetch";
import { endpoint } from "@/consts";

function DefaultLayout({ children }) {
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
  return (
    <div>
      <Header></Header>
      <div className="min-h-screen py-16"> {children}</div>

      <footer className="bg-primary text-primary-foreground px-4 py-6 md:px-6">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <p className="text-sm">
            &copy; 2024 TOEIC Prep. All rights reserved.
          </p>
          <nav className="mt-4 flex items-center gap-4 md:mt-0">
            <Link href="#" className="text" prefetch={false} />
          </nav>
        </div>
      </footer>
    </div>
  );
}
export default DefaultLayout;
