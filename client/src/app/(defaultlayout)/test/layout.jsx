"use client";

import withAuth from "~HOC/withAuth";

export default withAuth(function TestLayout({ children }) {
  return <>{children}</>;
});
