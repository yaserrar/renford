import "@/app/globals.css";
import AdminSidebar from "@/components/layout/admin-sidebar";
import MobileSidebarToggle from "@/components/layout/mobile-sidebar-toggle";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AdminProvider from "@/providers/admin-provider";
import TanstackQueryProvider from "@/providers/tanstack-query-provider";
import { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "sonner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: { default: "Admin | Renford", template: "%s | Admin Renford" },
  description: "Panneau d'administration Renford",
  icons: { icon: "/favicon.png" },
};

type Props = { children: React.ReactNode };

export default function AdminLayout({ children }: Props) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={poppins.className} suppressHydrationWarning>
        <Toaster closeButton richColors />
        <TanstackQueryProvider>
          <AdminProvider>
            <SidebarProvider>
              <AdminSidebar />
              <SidebarInset className="w-[200px]">
                <MobileSidebarToggle />
                <main className="h-full bg-white px-2">{children}</main>
              </SidebarInset>
            </SidebarProvider>
          </AdminProvider>
        </TanstackQueryProvider>
      </body>
    </html>
  );
}
