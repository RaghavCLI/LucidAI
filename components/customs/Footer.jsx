import React from "react";
import { CreditCard, LogOut } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { UserDetailContext } from "@/context/UserDetailContext";

function Footer() {
  const router = useRouter();
  const { logout } = useContext(UserDetailContext);

  const onOptionClick = (path) => {
    router.push(path);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="w-full px-2 pb-2 pl-4 bg-black">
      <Separator className="mb-2 bg-sidebar-auto-border/50" />
      {/* Action Items Section */}
      <div className=" rounded-lg p-2 flex flex-col gap-2">
        <button onClick={() => onOptionClick("/pricing")}>
          <div className="w-full flex items-center gap-2 justify-start text-sidebar-auto-foreground hover:bg-sidebar-auto-border/50 rounded-md px-2 py-1 text-sm font-medium transition-colors variant-ghost cursor-pointer size-sm">
            <CreditCard className="w-4 h-4" />
            Subscription
          </div>
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 justify-start text-sidebar-auto-foreground hover:bg-sidebar-auto-border/50 rounded-md px-2 py-1 text-sm font-medium transition-colors variant-ghost cursor-pointer size-sm"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
      {/* ...collapse button goes below this section... */}
    </div>
  );
}

export default Footer;
