"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useCurrentUser } from "@/hooks/utilisateur";
import { SecureAvatarImage } from "@/components/common/secure-file";
import useSession from "@/stores/session-store";
import { ChevronRight, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const NavAccount = () => {
  const router = useRouter();
  const { data: me } = useCurrentUser();
  const { logout } = useSession();

  const nomComplet = `${me?.prenom ?? ""} ${me?.nom ?? ""}`.trim();
  const fallbackInitiales = nomComplet
    ? nomComplet
        .split(" ")
        .map((item) => item[0])
        .join("")
        .slice(0, 2)
    : "U";

  const handleLogout = () => {
    logout();
    router.push("/connexion");
  };

  const avatarChemin =
    me?.typeUtilisateur === "etablissement"
      ? me.profilEtablissement?.avatarChemin
      : me?.typeUtilisateur === "renford"
        ? me.profilRenford?.avatarChemin
        : null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="px-3 py-8 border border-input rounded-2xl"
            >
              <Avatar className="h-10 w-10">
                <SecureAvatarImage chemin={avatarChemin} alt={nomComplet} />
                <AvatarFallback className="bg-gray-200 text-gray-600">
                  {fallbackInitiales}
                </AvatarFallback>
              </Avatar>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <p className="truncate font-semibold text-sm text-gray-900">
                  {nomComplet || "Utilisateur"}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  Gérer mon compte
                </p>
              </div>

              <ChevronRight className="ml-auto size-5 text-gray-400" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl"
            side="bottom"
            align="start"
            sideOffset={4}
          >
            <DropdownMenuItem asChild>
              <Link
                href={
                  me?.typeUtilisateur === "etablissement"
                    ? "/dashboard/etablissement/profil"
                    : "/dashboard/renford/profil"
                }
              >
                <User />
                Gérer mon compte
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-500 focus:text-red-500 focus:bg-red-50"
            >
              <LogOut className="text-red-500" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default NavAccount;
