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
                  "flex justify-start px-3 py-5 rounded-sm",
                  isActive(item.url) &&
                    "bg-gray-100 hover:bg-gray-200 active:bg-gray-300",
                )}
              >
                <Link href={item.url}>
                  {item.icon && (
                    <item.icon
                      className={cn(
                        "text-gray-500 mr-1",
                        isActive(item.url) && "text-black",
                      )}
                      strokeWidth={2}
                    />
                  )}
                  <p
                    className={cn(
                      "text-gray-500 font-normal text-base",
                      isActive(item.url) && "text-black font-medium",
                    )}
                  >
                    {item.title}
                  </p>
                  {item.badge !== undefined && item.badge > 0 && (
                    <Badge
                      variant="destructive"
                      className="ml-auto h-5 min-w-5 rounded-full px-1.5 text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
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
