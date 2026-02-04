"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import useSession from "@/stores/session-store";
import {
  Bell,
  LogOut,
  User,
  Menu,
  X,
  Home,
  Building2,
  Users as UsersIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button, buttonVariants } from "../ui/button";

export function Header() {
  const router = useRouter();
  const { logout } = useSession();

  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/connexion");
  };

  const navItems = [
    { label: "Accueil", href: "/dashboard", icon: Home },
    {
      label: "Établissements",
      href: "/dashboard/etablissements",
      icon: Building2,
    },
    { label: "Utilisateurs", href: "/dashboard/utilisateurs", icon: UsersIcon },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex h-22 w-full shrink-0 items-center justify-between transition-all duration-300 bg-white px-4",
        isScrolled && "shadow-md",
      )}
    >
      <div className="flex items-center gap-4 container mx-auto w-full justify-between">
        {/* Desktop Layout */}
        <div className="hidden lg:flex gap-6 items-center">
          <Link href="/dashboard" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Logo"
              width={120}
              height={60}
              className="object-contain"
            />
          </Link>
          <nav className="flex gap-6 items-center">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-primary hover:text-primary/80 pb-1 border-b-2 transition-colors border-transparent text-lg",
                  pathname === item.href && "font-semibold border-primary",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Logo */}
        <Link href="/" className="flex lg:hidden items-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={100}
            height={50}
            className="object-contain"
          />
        </Link>

        {/* Desktop Actions */}
        <div className="hidden lg:flex gap-4 items-center">
          <Button
            variant="ghost"
            size="icon"
            className="text-primary hover:text-primary relative"
          >
            <Bell />
            <span className="h-3 w-3 text-[10px] aspect-square bg-quaternary absolute top-2 right-2 rounded-full flex items-center justify-center text-primary">
              2
            </span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center focus:outline-none">
                <Avatar className="h-10 w-10 bg-secondary cursor-pointer hover:opacity-80 transition-opacity">
                  <AvatarFallback className="bg-secondary">
                    <User className="text-white" size={18} />
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profil">
                  <User />
                  Profil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} variant="destructive">
                <LogOut />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Actions */}
        <div className="flex lg:hidden gap-2 items-center">
          <Button
            variant="ghost"
            size="icon"
            className="text-primary hover:text-primary relative"
          >
            <Bell size={20} />
            <span className="h-3 w-3 text-[10px] aspect-square bg-quaternary absolute top-1 right-1 rounded-full flex items-center justify-center text-primary">
              2
            </span>
          </Button>

          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerTrigger asChild>
              <button className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                <Menu className="w-5 h-5" />
              </button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[85vh]">
              <DrawerHeader className="border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <DrawerTitle className="text-2xl font-bold text-primary">
                    Menu
                  </DrawerTitle>
                  <DrawerClose asChild>
                    <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </DrawerClose>
                </div>
                <DrawerDescription className="sr-only">
                  Menu de navigation
                </DrawerDescription>
              </DrawerHeader>

              <div className="flex flex-col p-4 gap-4 overflow-y-auto">
                {/* Navigation Links */}
                <div className="space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setDrawerOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group",
                          isActive
                            ? "bg-primary text-white"
                            : "hover:bg-primary/5 text-gray-700",
                        )}
                      >
                        <Icon
                          className={cn(
                            "w-5 h-5",
                            isActive ? "text-white" : "text-primary",
                          )}
                        />
                        <span
                          className={cn(
                            "text-base font-medium",
                            isActive && "text-white",
                          )}
                        >
                          {item.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>

                {/* Profile Section */}
                <div className="mt-2 pt-4 border-t border-gray-100 space-y-2">
                  <Link
                    href="/dashboard/profil"
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/5 transition-colors text-gray-700"
                  >
                    <User className="w-5 h-5 text-primary" />
                    <span className="text-base font-medium">Profil</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setDrawerOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-destructive/5 transition-colors text-destructive w-full"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="text-base font-medium">Déconnexion</span>
                  </button>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  );
}
