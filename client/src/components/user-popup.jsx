import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { User, LogOut, Settings } from "lucide-react";

export function UserPopup({ user, onLogout, onProfileClick }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              {/* <AvatarFallback>{user.name.charAt(0)}</AvatarFallback> */}
            </Avatar>
            <div className="space-y-1">
              <h4
                className={`text-sm font-semibold ${
                  user.isUpgraded ? "text-primary" : ""
                }`}
              >
                {user.name}
              </h4>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              {user.isUpgraded && (
                <>
                  <Badge variant="secondary" className="mt-1">
                    Upgraded Account
                  </Badge>
                  {user.upgradeExpiryDate && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Upgrade expires: {user.upgradeExpiryDate}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <Button
              variant="outline"
              onClick={onProfileClick}
              className="justify-start"
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </Button>
            {user.isUpgraded && (
              <Button
                variant="outline"
                onClick={onProfileClick}
                className="justify-start"
              >
                <Settings className="mr-2 h-4 w-4" />
                Account Settings
              </Button>
            )}
            <Button
              variant="outline"
              onClick={onLogout}
              className="justify-start text-red-500 hover:text-red-500 hover:bg-red-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
