"use client";

import {
  Home,
  Shield,
  Users,
  Mail,
  Handshake,
  LogOut,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/common/logo";
import useSession from "@/stores/session-store";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import NavMain from "./nav-main";
import AdminNotificationPopover from "@/components/common/admin-notification-popover";
import { useRouter } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const ADMIN_LINKS = [
  { title: "Accueil", url: "/admin/accueil", icon: Home },
  { title: "Missions", url: "/admin/missions", icon: Handshake },
  { title: "Paiements", url: "/admin/paiements", icon: CreditCard },
  { title: "Administrateurs", url: "/admin/administrateurs", icon: Shield },
  { title: "Utilisateurs", url: "/admin/utilisateurs", icon: Users },
  { title: "Messages", url: "/admin/messages", icon: Mail },
];

const AdminSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const { logout } = useSession();
  const { open, setOpen } = useSidebar();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/connexion");
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="px-6 pt-2" />
      <SidebarContent className="px-1 pt-2 pb-4">
        <button className="cursor-pointer ml-2" onClick={() => setOpen(!open)}>
          <Logo onlyIcon={!open} size={open ? "lg" : "sm"} />
        </button>

        <NavMain items={ADMIN_LINKS} />
      </SidebarContent>

      <SidebarFooter className="px-1 pt-2 pb-4">
        <div className="border-t border-border pt-4">
          <div className="px-1">
            <AdminNotificationPopover />
          </div>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Déconnexion"
              className="flex justify-start px-3 py-5 rounded-sm text-red-500 hover:text-red-600  active:text-red-600 active:bg-red-50 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-1" strokeWidth={2} />
              <p className="font-normal text-base">Déconnexion</p>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
