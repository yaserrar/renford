"use client";

import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import PasswordResetForm from "./password-reset-form";

export default function PasswordResetPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex mb-8">
            <Image src="/logo.png" alt="Renford" width={150} height={50} />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold mb-2">
            Réinitialisation du mot de passe
          </h1>
          <p className="text-gray-500 mb-8">
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

          {/* Footer */}
          <p className="text-center text-gray-400 text-sm mt-12">
            © {new Date().getFullYear()} Renford
          </p>
        </div>
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
