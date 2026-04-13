"use client";

import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import PasswordResetForm from "./password-reset-form";
import { H1 } from "@/components/ui/typography";
import { Logo } from "@/components/common/logo";

export default function PasswordResetPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Logo */}
        <div className="flex justify-start mb-8 p-2 w-full border-b border">
          <Logo />
        </div>

        <div className="w-full max-w-md flex-grow flex flex-col justify-center px-8">
          {/* Title */}
          <H1 className="text-center mb-4">Réinitialisation du mot de passe</H1>
          <p className="text-gray-500 mb-12 text-center">
            Entrez votre email pour recevoir un code de vérification
          </p>

          {/* Form */}
          <PasswordResetForm />

          {/* Back to login */}
          <div className="text-center mt-6">
            <Link
              href="/connexion"
              className="inline-flex items-center gap-2 text-secondary hover:underline text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour à la connexion
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-800 text-sm mt-12 p-4 w-full border-t border-gray-200">
          © {new Date().getFullYear()} Renford
        </p>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:flex lg:flex-1 relative">
        <Image
          src="/auth.png"
          alt="Illustration"
          className="w-full h-full object-cover"
          fill
          priority
        />
      </div>
    </div>
  );
}
