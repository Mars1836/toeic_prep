"use client";

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setUserState } from "@/lib/redux/userSlice";
import useFetch from "@/hooks/useFetch";
import instance from "~configs/axios.instance";
import { useEndpoint } from "./endpoint-context";
function setUpgradeStatus(upgradeExpiredDate) {
  if (!upgradeExpiredDate) return "FREE";
  return new Date() < new Date(upgradeExpiredDate) ? "UPGRADED" : "EXPIRED";
}
function formatUser(user) {
  return {
    ...user,
    upgradeStatus: setUpgradeStatus(user.upgradeExpiredDate),
    isUpgraded: new Date() < new Date(user.upgradeExpiredDate),
  };
}

function RootLayout({ children }) {
  const { endpoint } = useEndpoint();
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      if (!endpoint) {
        console.log("endpoint not found:  ", endpoint);
        return;
      }
      try {
        const { data } = await instance.get(endpoint.auth.currentUser);
        if (!data) return;
        dispatch(setUserState(formatUser(data)));
      } catch (error) {
        console.log("error: ", error);
        dispatch(setUserState(null));
      }
    };

    fetchData();
  }, []);

  return <div>{children}</div>;
}
export default RootLayout;
