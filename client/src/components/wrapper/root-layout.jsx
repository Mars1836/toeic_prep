"use client";

import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setUserState } from "@/lib/redux/userSlice";
import useFetch from "@/hooks/useFetch";
import { endpoint } from "@/consts";

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
export default RootLayout;
