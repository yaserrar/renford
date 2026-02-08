import "@/app/globals.css";
import AuthProvider from "@/providers/auth-provider";
import TanstackQueryProvider from "@/providers/tanstack-query-provider";
import { Metadata } from "next";
import { Suspense } from "react";
import { Toaster } from "sonner";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  keywords: ["renford", "sport", "établissement", "freelance", "mission"],
  title: {
    default: "Renford",
    template: "%s | Renford",
  },
  description:
    "Renford - Plateforme de mise en relation établissements sportifs et freelancers",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
};

type Props = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Props) {
  return (
    <html lang="fr">
      <body className={`${poppins.className}`}>
        <TanstackQueryProvider>
          <AuthProvider>
            <Suspense>
              <Toaster closeButton richColors />
              <main className="bg-white">{children}</main>
            </Suspense>
          </AuthProvider>
        </TanstackQueryProvider>
      </body>
    </html>
  );
}
