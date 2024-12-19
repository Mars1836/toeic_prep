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
import { endpoint } from "@/consts";
import { BookIcon, MenuIcon } from "lucide-react";
import { UserPopup } from "./user_popup";
import { useRouter } from "next/navigation";
// const upgradeUser = {
//   name: "John Doe",
//   email: "john@example.com",
//   avatarUrl: "/placeholder.svg?height=32&width=32",
//   isUpgraded: true,
//   upgradeExpiryDate: "2024-12-31",
// };

// const nonUpgradeUser = {
//   name: "Jane Smith",
//   email: "jane@example.com",
//   avatarUrl: "/placeholder.svg?height=32&width=32",
//   isUpgraded: false,
// };
// function formatUser(user) {
//   console.log(new Date(user.upgradeExpiredDate));
//   return {
//     ...user,
//     isUpgraded: new Date() < new Date(user.upgradeExpiredDate),
//   };
// }

function Header() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.data);
  const router = useRouter();
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
        {/* <Link
          href="/introduce"
          className="text-sm font-medium hover:underline"
          prefetch={false}
        >
          Giới thiệu
        </Link> */}
        <Link
          href="/test"
          className="text-sm font-medium hover:underline"
          prefetch={false}
        >
          Đề thi online
        </Link>
        <Link
          href="/flashcards/set"
          className="text-sm font-medium hover:underline"
          prefetch={false}
        >
          Flashcards
        </Link>
        <Link
          href="/blogs"
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
          className="text-sm font-medium hover:underline"
          prefetch={false}
        >
          Kích hoạt tài khoản
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
                href="#"
                className="text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5"
                prefetch={false}
              >
                About
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5"
                prefetch={false}
              >
                Đề thi online
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5"
                prefetch={false}
              >
                Flashcards
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5"
                prefetch={false}
              >
                Blog
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground flex items-center gap-4 px-2.5"
                prefetch={false}
              >
                Kích hoạt tài khoản
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
            // <Popover placement="bottom">
            //   <PopoverTrigger>
            //     <Avatar className="border-primary h-8 w-8 border-2">
            //       <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
            //       <AvatarFallback>JD</AvatarFallback>
            //     </Avatar>
            //   </PopoverTrigger>
            //   <PopoverContent>
            //     <div className="flex w-52 items-center gap-2 p-2">
            //       <Avatar className="h-8 w-8">
            //         <AvatarImage src="/placeholder-user.jpg" />
            //         <AvatarFallback>JD</AvatarFallback>
            //       </Avatar>
            //       <div className="grid gap-0.5 leading-none">
            //         <div className="font-semibold">{user.name}</div>
            //         <div className="text-muted-foreground text-sm">
            //           {user.email}
            //         </div>
            //       </div>
            //     </div>
            //     <div className="w-full">
            //       <div className="w-full cursor-pointer rounded p-2 pl-4 font-medium transition duration-100 hover:bg-gray-200">
            //         <span>Profile</span>
            //       </div>
            //       <div className="w-full cursor-pointer rounded p-2 pl-4 font-medium transition duration-100 hover:bg-gray-200">
            //         <span>Settings</span>
            //       </div>
            //       <div
            //         className="w-full cursor-pointer rounded border-t p-2 pl-4 font-medium transition duration-100 hover:bg-gray-200"
            //         onClick={logout}
            //       >
            //         <span>Logout</span>
            //       </div>
            //     </div>
            //   </PopoverContent>
            // </Popover>
          )}
        </>
      </div>
    </header>
  );
}

export default Header;
