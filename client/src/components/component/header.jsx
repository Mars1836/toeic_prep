import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { useDispatch, useSelector } from "react-redux";
import { logoutUserState } from "@/lib/redux/userSlice";
import useFetch from "@/hooks/useFetch";
import { BookIcon, MenuIcon, Zap } from "lucide-react";
import { useEndpoint } from "@/components/wrapper/endpoint-context";
import { UserPopup } from "./user_popup";
import { useRouter } from "next/navigation";

function Header() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.data);
  const router = useRouter();
  const { endpoint } = useEndpoint();
  const { sendRequest: sendLogoutRequest } = useFetch({
    url: endpoint.auth.logout,
    method: "post",
    onSuccess: () => {
      dispatch(logoutUserState());
      window.location.href = "/";
    },
  });

  function handleLogout() {
    sendLogoutRequest();
  }
  function handleProfileClick() {
    router.push("/profile");
  }
  useEffect(() => {}, []);
  return (
    <header className="header bg-primary text-primary-foreground fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-12 py-4">
      <Link href="/" className="flex items-center gap-2" prefetch={false}>
        <BookIcon className="h-7 w-7" />
        <span className="text-xl font-semibold">Toeic Journey</span>
      </Link>
      <nav className="hidden items-center gap-6 md:flex">
        <Link
          href="/test"
          className="text-sm font-medium hover:underline"
          prefetch={false}
        >
          Đề thi online
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="text-sm font-medium hover:underline"
            >
              Thi TOEIC
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem>
              <Link
                href="/test-registration"
                className="w-full"
                prefetch={false}
              >
                Đăng ký thi
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/exam" className="w-full" prefetch={false}>
                Trang thi
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Link
          href="/flashcards/set"
          className="text-sm font-medium hover:underline"
          prefetch={false}
        >
          Flashcards
        </Link>
        <Link
          href="/blog"
          className="text-sm font-medium hover:underline"
          prefetch={false}
        >
          Blog
        </Link>
        <Link
          href="/transcript-test"
          className="text-sm font-medium hover:underline"
          prefetch={false}
        >
          Nghe chép
        </Link>
        <Link
          href="/upgrade"
          className=" text-sm font-medium group relative inline-flex items-center gap-2 bg-gradient-to-r from-teal-400 via-cyan-500 to-teal-600 text-white px-6 py-2.5 rounded-full shadow-lg hover:shadow-cyan-500/50 hover:scale-105 transition-all duration-300 ease-in-out"
          prefetch={false}
        >
          <Zap className="w-5 h-5 animate-pulse" />
          Nâng cấp tài khoản
        </Link>
      </nav>

      <div className="flex items-center gap-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <MenuIcon className="h-5 w-5 bg-transparent" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="/test"
                className="text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5"
                prefetch={false}
              >
                Đề thi online
              </Link>
              <div className="space-y-2">
                <div className="font-medium text-muted-foreground">
                  Thi TOEIC
                </div>
                <div className="pl-4 space-y-2">
                  <Link
                    href="/test-registration"
                    className="text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5"
                    prefetch={false}
                  >
                    Đăng ký thi
                  </Link>
                  <Link
                    href="/exam"
                    className="text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5"
                    prefetch={false}
                  >
                    Phần thi
                  </Link>
                  <Link
                    href="/exam/result"
                    className="text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5"
                    prefetch={false}
                  >
                    Kết quả thi
                  </Link>
                </div>
              </div>
              <Link
                href="/flashcards/set"
                className="text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5"
                prefetch={false}
              >
                Flashcards
              </Link>
              <Link
                href="/blog"
                className="text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5"
                prefetch={false}
              >
                Blog
              </Link>
              <Link
                href="/transcript-test"
                className="text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5"
                prefetch={false}
              >
                Nghe chép
              </Link>
              <Link
                href="/upgrade"
                className="text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5"
                prefetch={false}
              >
                Nâng cấp tài khoản
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <>
          {!user ? (
            <Button variant="outline" size="sm">
              <Link href={"/account"}>Login</Link>
            </Button>
          ) : (
            <div>
              <UserPopup
                user={user}
                onProfileClick={handleProfileClick}
                handleLogout={handleLogout}
              />
            </div>
          )}
        </>
      </div>
    </header>
  );
}

export default Header;
