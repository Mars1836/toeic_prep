"use client";
import withAuth from "~HOC/withAuth";

export default withAuth(function ProfileLayout({ children }) {
  return <>{children}</>;
});
