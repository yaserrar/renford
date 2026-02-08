"use client";

import { Logo } from "@/components/common/logo";
import { H1 } from "@/components/ui/typography";
import Image from "next/image";
import Link from "next/link";
import SignupForm from "./signup-form";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Logo */}
        <div className="flex justify-start mb-8 p-2 w-full border-b border">
          <Logo />
        </div>

        <div className="w-full max-w-md flex-grow flex flex-col justify-center px-8">
          {/* Tabs */}
          <div className="flex gap-8 mb-8 border-b border-gray-200">
            <span className="pb-3 text-black font-medium border-b-2 border-black flex-1 text-center">
              S&apos;inscrire
            </span>
            <Link
              href="/connexion"
              className="pb-3 text-gray-400 hover:text-gray-600 transition-colors flex-1 text-center"
            >
              Se connecter
            </Link>
          </div>

          {/* Title */}
          <H1 className="text-center mb-4">S&apos;inscrire</H1>
          <p className="text-gray-500 mb-12 text-center">
            Rejoignez notre communauté
          </p>

          {/* Form */}
          <SignupForm />
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
