import { UserPopup } from "@/components/user-popup"

export default function ExamplePage() {
  const upgradeUser = {
    name: "John Doe",
    email: "john@example.com",
    avatarUrl: "/placeholder.svg?height=32&width=32",
    isUpgraded: true,
    upgradeExpiryDate: "2024-12-31"
  }

  const nonUpgradeUser = {
    name: "Jane Smith",
    email: "jane@example.com",
    avatarUrl: "/placeholder.svg?height=32&width=32",
    isUpgraded: false
  }

  const handleLogout = () => {
    console.log("Logging out...")
  }

  const handleProfileClick = () => {
    console.log("Navigating to profile...")
  }

  return (
    (<div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">User Popup Examples</h1>
      <div className="flex items-center space-x-4">
        <span>Upgraded User:</span>
        <UserPopup
          user={upgradeUser}
          onLogout={handleLogout}
          onProfileClick={handleProfileClick} />
      </div>
      <div className="flex items-center space-x-4">
        <span>Non-Upgraded User:</span>
        <UserPopup
          user={nonUpgradeUser}
          onLogout={handleLogout}
          onProfileClick={handleProfileClick} />
      </div>
    </div>)
  );
}

