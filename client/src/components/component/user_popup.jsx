import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { User, LogOut, Settings, AlertTriangle } from "lucide-react";
import { expiredDate, formatDate } from "~helper";
import { Alert, AlertDescription, AlertTitle } from "~components/ui/alert";
import { useRouter } from "next/navigation";
import { originUrl } from "~consts";
import { useEndpoint } from "@/components/wrapper/endpoint-context";
export function UserPopup({ user, onProfileClick, handleLogout }) {
  const { endpoint } = useEndpoint();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  function goToUpgrade() {
    router.push("/upgrade");
  }
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8  font-bold text-primary">
            <AvatarImage
              src={endpoint.originUrl + user.avatar}
              alt={user.name}
            />
            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 text-2xl font-bold text-primary">
              <AvatarImage
                src={endpoint.originUrl + user.avatar}
                alt={user.name}
              />
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h4
                className={`text-sm font-semibold text-primary ${
                  user.upgradeStatus === "UPGRADED" ? "text-blue-700" : ""
                }`}
              >
                {user.name}
              </h4>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              {user.upgradeStatus === "UPGRADED" && (
                <>
                  <Badge variant="secondary" className="mt-1">
                    Upgraded Account
                  </Badge>

                  <p className="text-xs text-muted-foreground mt-1">
                    Upgrade expires: {formatDate(user.upgradeExpiredDate)}
                  </p>
                </>
              )}
            </div>
          </div>
          {user.upgradeStatus === "EXPIRED" && (
            <Alert
              variant="destructive"
              className="border-red-500 text-red-500"
            >
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Upgrade Expired</AlertTitle>
              <AlertDescription>
                Your account upgrade has expired
                <Button
                  onClick={goToUpgrade}
                  variant="link"
                  className="text-red-500 px-0 py-0 m-0 h-2 outline-none"
                >
                  Renew now
                </Button>
              </AlertDescription>
            </Alert>
          )}
          <div className="flex flex-col space-y-2">
            <Button
              variant="outline"
              onClick={onProfileClick}
              className="justify-start"
            >
              <User className="mr-2 h-4 w-4" />
              Hồ sơ
            </Button>
            <Button
              variant="outline"
              onClick={onProfileClick}
              className="justify-start"
            >
              <Settings className="mr-2 h-4 w-4" />
              Cài đặt tài khoản
            </Button>

            <Button
              variant="outline"
              onClick={handleLogout}
              className="justify-start text-red-500 hover:text-red-500 hover:bg-red-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
