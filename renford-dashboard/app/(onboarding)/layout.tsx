import "@/app/globals.css";
import CurrentUserProvider from "@/providers/current-user-provider";
import SessionProvider from "@/providers/session-provider";
import TanstackQueryProvider from "@/providers/tanstack-query-provider";
import { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "sonner";

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
        <Toaster closeButton richColors />
        <TanstackQueryProvider>
          <SessionProvider>
            <CurrentUserProvider>
              <Toaster closeButton richColors />
              <main className="bg-white">{children}</main>
            </CurrentUserProvider>
          </SessionProvider>
        </TanstackQueryProvider>
      </body>
    </html>
  );
}
