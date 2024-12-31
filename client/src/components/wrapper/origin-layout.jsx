"use client";

import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useEndpoint } from "./endpoint-context";
import { db, ref, get } from "~lib/firebase";
import { setUrl } from "~lib/redux/apiSlice";

function OriginLayout({ children }) {
  const dispatch = useDispatch();
  const { endpointInstance } = useEndpoint();
  console.log(endpointInstance);

  return <>{children}</>;
}
export default OriginLayout;
