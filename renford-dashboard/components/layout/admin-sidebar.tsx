"use client";

import { Home, Shield, Users, Mail, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/common/logo";
import useSession from "@/stores/session-store";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const ADMIN_LINKS = [
  { title: "Accueil", url: "/admin/accueil", icon: Home },
  { title: "Administrateurs", url: "/admin/administrateurs", icon: Shield },
  { title: "Utilisateurs", url: "/admin/utilisateurs", icon: Users },
  { title: "Messages", url: "/admin/messages", icon: Mail },
];

const AdminSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const pathname = usePathname();
  const { logout } = useSession();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="px-6 pt-6 pb-3">
        <Link href="/admin/accueil" className="flex items-center gap-3">
          <Logo />
        </Link>
        <p className="text-xs font-medium text-muted-foreground mt-1 px-1">
          Panneau d&apos;administration
        </p>
      </SidebarHeader>

      <SidebarContent className="px-3 pt-4">
        <nav className="space-y-1">
          {ADMIN_LINKS.map((link) => {
            const isActive = pathname.startsWith(link.url);
            return (
              <Link
                key={link.url}
                href={link.url}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.title}
              </Link>
            );
          })}
        </nav>
      </SidebarContent>

      <SidebarFooter className="px-3 pb-6">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
