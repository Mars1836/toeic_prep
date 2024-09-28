import Link from "next/link";
import React, { useEffect } from "react";
import { BookIcon, MenuIcon } from "@/components/component/overview";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/popover";
import { useDispatch, useSelector } from "react-redux";
import { logoutUserState, setUserState } from "@/lib/redux/userSlice";
import useFetch from "@/hooks/useFetch";
import { endpoint } from "@/consts";

function Header() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.data);
  useEffect(() => {}, [user]);
  const { sendRequest: sendLogoutRequest } = useFetch({
    url: endpoint.auth.logout,
    method: "post",
    onSuccess: () => {
      dispatch(logoutUserState());
      window.location.reload();
    },
  });
  function logout() {
    sendLogoutRequest();
  }
  return (
    <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-between fixed left-0 right-0 top-0 z-50">
      <Link href="/" className="flex items-center gap-2" prefetch={false}>
        <BookIcon className="h-6 w-6" />
        <span className="text-lg font-semibold">TOEIC Prep</span>
      </Link>
      <nav className="hidden md:flex items-center gap-6">
        <Link
          href="#"
          className="text-sm font-medium hover:underline"
          prefetch={false}
        >
          About
        </Link>
        <Link
          href="#"
          className="text-sm font-medium hover:underline"
          prefetch={false}
        >
          Resources
        </Link>
        <Link
          href="#"
          className="text-sm font-medium hover:underline"
          prefetch={false}
        >
          Practice Tests
        </Link>
        <Link
          href="#"
          className="text-sm font-medium hover:underline"
          prefetch={false}
        >
          Contact
        </Link>
        <Link
          href="#"
          className="text-sm font-medium hover:underline"
          prefetch={false}
        >
          TOEIC Full Exam
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
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                prefetch={false}
              >
                About
              </Link>
              <Link
                href="#"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                prefetch={false}
              >
                Resources
              </Link>
              <Link
                href="#"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                prefetch={false}
              >
                Practice Tests
              </Link>
              <Link
                href="#"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                prefetch={false}
              >
                Contact
              </Link>
              <Link
                href="#"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                prefetch={false}
              >
                TOEIC Full Exam
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
            <Popover placement="bottom">
              <PopoverTrigger>
                <Avatar className="h-8 w-8 border-2 border-primary">
                  <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </PopoverTrigger>
              <PopoverContent>
                <div className="flex items-center gap-2 p-2 w-52">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-0.5 leading-none">
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {user.email}
                    </div>
                  </div>
                </div>
                <div className="w-full ">
                  <div className="p-2 font-medium hover:bg-gray-200 rounded pl-4 cursor-pointer w-full transition duration-100">
                    <span>Profile</span>
                  </div>
                  <div className="p-2 font-medium hover:bg-gray-200 rounded pl-4 cursor-pointer w-full transition duration-100">
                    <span>Settings</span>
                  </div>
                  <div
                    className="p-2 font-medium hover:bg-gray-200 rounded pl-4 cursor-pointer w-full border-t transition duration-100"
                    onClick={logout}
                  >
                    <span>Logout</span>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </>
      </div>
    </header>
  );
}

export default Header;