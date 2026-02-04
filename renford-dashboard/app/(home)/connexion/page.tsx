"use client";

import Image from "next/image";
import Link from "next/link";
import LoginForm from "./login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex mb-8">
            <Image src="/logo.png" alt="Renford" width={150} height={50} />
          </div>

          {/* Tabs */}
          <div className="flex gap-8 mb-8 border-b border-gray-200">
            <Link
              href="/inscription"
              className="pb-3 text-gray-400 hover:text-gray-600 transition-colors"
            >
              S&apos;inscrire
            </Link>
            <span className="pb-3 text-black font-medium border-b-2 border-black">
              Se connecter
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold mb-8">Se connecter</h1>

          {/* Form */}
          <LoginForm />

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
