import "@/app/globals.css";
import AuthAdminProvider from "@/providers/auth-admin-provide";
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
  title: "Connexion Admin | Renford",
  description: "Connexion administrateur Renford",
  icons: { icon: "/favicon.png" },
};

type Props = { children: React.ReactNode };

export default function AdminAuthLayout({ children }: Props) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={poppins.className} suppressHydrationWarning>
        <Toaster closeButton richColors />
        <AuthAdminProvider>
          <TanstackQueryProvider>
            <main className="bg-white">{children}</main>
          </TanstackQueryProvider>
        </AuthAdminProvider>
      </body>
    </html>
  );
}
