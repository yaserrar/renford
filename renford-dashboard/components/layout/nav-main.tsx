"use client";

import { type LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type Props = {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    badge?: number;
  }[];
};

const NavMain = ({ items }: Props) => {
  const activePath = usePathname();

  const isActive = (url: string) =>
    activePath === url || activePath.startsWith(`${url}/`);

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                size="sm"
                className={cn(
                  "flex justify-start px-3 py-7 rounded-2xl",
                  isActive(item.url) &&
                    "bg-gray-100 hover:bg-gray-200 active:bg-gray-300",
                )}
              >
                <Link href={item.url}>
                  {item.icon && (
                    <item.icon
                      className={cn(
                        "text-gray-500 mr-1",
                        isActive(item.url) && "text-gray-900",
                      )}
                      strokeWidth={2}
                    />
                  )}
                  <p
                    className={cn(
                      "text-gray-500 font-normal text-base",
                      isActive(item.url) && "text-gray-900 font-medium",
                    )}
                  >
                    {item.title}
                  </p>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default NavMain;
