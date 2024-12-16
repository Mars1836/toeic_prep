"use client";

import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setUserState } from "@/lib/redux/userSlice";
import useFetch from "@/hooks/useFetch";
import { endpoint } from "@/consts";
import instance from "~configs/axios.instance";
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
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await instance.get(endpoint.auth.currentUser);
        if (!data) return;
        dispatch(setUserState(formatUser(data)));
      } catch (error) {
        dispatch(setUserState(null));
      }
    };

    fetchData();
  }, []);
  return <div>{children}</div>;
}
export default RootLayout;
