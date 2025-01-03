"use client";
import Link from "next/link";

import Header from "../../components/component/header";

function DefaultLayout({ children }) {
  return (
    <div className="max-h-screen">
      <Header></Header>
      <div className="min-h-screen py-16"> {children}</div>

      <footer className="bg-primary text-primary-foreground px-4 py-6 md:px-6">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <p className="text-sm">
            &copy; 2024 Toeic Journey. All rights reserved.
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
