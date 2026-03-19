"use client";

import {
  Building2,
  CalendarDays,
  CircleHelp,
  FileText,
  Home,
  Handshake,
  Heart,
  Percent,
  Plus,
  ScrollText,
} from "lucide-react";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import NavAccount from "./nav-account";
import NavMain from "./nav-main";
import { useCurrentUser } from "@/hooks/utilisateur";
import { Logo } from "../common/logo";

const RENFORD_MAIN_LINKS = [
  { title: "Accueil", url: "/dashboard/renford/accueil", icon: Home },
  { title: "Missions", url: "#", icon: Handshake },
  { title: "Planning", url: "#", icon: CalendarDays },
  {
    title: "Facture & Paiements",
    url: "#",
    icon: ScrollText,
  },
];

const ETABLISSEMENT_MAIN_LINKS = [
  { title: "Accueil", url: "/dashboard/etablissement/accueil", icon: Home },
  {
    title: "Missions",
    url: "/dashboard/etablissement/missions",
    icon: Handshake,
  },
  {
    title: "Planning",
    url: "#",
    icon: CalendarDays,
  },
  {
    title: "Mes Renfords",
    url: "#",
    icon: Heart,
  },
  {
    title: "Facture & Paiements",
    url: "#",
    icon: ScrollText,
  },
  {
    title: "Gérer les sites",
    url: "#",
    icon: Building2,
  },
];

const RENFORD_FOOTER_LINKS = [
  { title: "Bons plans", url: "#", icon: Percent },
  { title: "Support", url: "#", icon: CircleHelp },
];

const ETABLISSEMENT_FOOTER_LINKS = [
  {
    title: "Bons plans",
    url: "#",
    icon: Percent,
  },
  {
    title: "Support",
    url: "#",
    icon: CircleHelp,
  },
];

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const { data: currentUser } = useCurrentUser();
  const typeUtilisateur = currentUser?.typeUtilisateur;
  const isEtablissement = typeUtilisateur === "etablissement";
  const isRenford = typeUtilisateur === "renford";

  const mainLinks = isEtablissement
    ? ETABLISSEMENT_MAIN_LINKS
    : isRenford
      ? RENFORD_MAIN_LINKS
      : RENFORD_MAIN_LINKS;

  const footerLinks = isEtablissement
    ? ETABLISSEMENT_FOOTER_LINKS
    : isRenford
      ? RENFORD_FOOTER_LINKS
      : RENFORD_FOOTER_LINKS;

  const homeHref = isEtablissement
    ? "/dashboard/etablissement/accueil"
    : "/dashboard/renford/accueil";

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="px-6 pt-6 pb-3">
        <Link href={homeHref} className="flex items-center gap-3">
          <Logo />
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-1 pt-2 pb-4">
        {isEtablissement && (
          <Button
            asChild
            variant="outline-secondary"
            className="mx-2 rounded-sm"
          >
            <Link href="/dashboard/etablissement/missions/nouvelle">
              <Plus className="h-6 w-6" />
              Demande de mission
            </Link>
          </Button>
        )}

        <NavMain items={mainLinks} />
      </SidebarContent>

      <SidebarFooter className="px-4 pb-6 gap-4">
        <div className="border-t border-border pt-4">
          <NavMain items={footerLinks} />
        </div>
        <NavAccount />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
