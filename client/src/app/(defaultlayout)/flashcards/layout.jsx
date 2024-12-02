"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ListIcon, BookOpenIcon, CompassIcon } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
const navItems = [
  { name: "My List", href: "/flashcards/set", icon: ListIcon },
  { name: "Studying", href: "/flashcards/studying", icon: BookOpenIcon },
  { name: "Explore", href: "/flashcards/explore", icon: CompassIcon },
];

export default function NavigationLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    router.prefetch(`/flashcards/studying`);
    router.prefetch(`/flashcards/set`);
  }, []);
  return (
    <div className="mt-4">
      <div className="bg-background shadow-sm">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-center">
            <div className="hidden sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    pathname === item.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <span className="flex items-center">
                    <item.icon className="mr-2 h-5 w-5" />
                    {item.name}
                  </span>
                  {pathname === item.href && (
                    <motion.div
                      className="bg-primary absolute inset-x-0 bottom-0"
                      style={{
                        height: "2px",
                      }}
                      layoutId="activeTab"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="sm:hidden">
          <div className="flex space-x-2 px-2 pb-3 pt-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-1 flex-col items-center justify-center rounded-md px-3 py-2 text-sm font-medium ${
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground"
                }`}
              >
                <item.icon className="mb-1 h-6 w-6" />
                <span>{item.name}</span>
                {pathname === item.href && (
                  <motion.div
                    className="bg-primary-foreground absolute bottom-0 left-0 right-0 h-0.5"
                    layoutId="mobileActiveTab"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
