"use client";

import { Logo } from "@/components/common/logo";
import { Button } from "@/components/ui/button";
import ErrorMessage from "@/components/ui/error-message";
import { Input } from "@/components/ui/input";
import { H1 } from "@/components/ui/typography";
import {
  useResendVerification,
  useVerifyEmail,
} from "@/hooks/account-verification";
import { useCurrentUser } from "@/hooks/utilisateur";
import {
  verifyEmailSchema,
  VerifyEmailSchema,
} from "@/validations/account-verification";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, RefreshCw } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";

export default function VerificationComptePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();
  const verifyEmail = useVerifyEmail();
  const resendCode = useResendVerification();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyEmailSchema>({
    resolver: zodResolver(verifyEmailSchema),
  });

  const onSubmit: SubmitHandler<VerifyEmailSchema> = (data) => {
    verifyEmail.mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["me"] });
        router.push("/onboarding/etape-1");
      },
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side */}
      <div className="flex-1 flex flex-col">
        {/* Logo */}
        <div className="flex justify-start p-2 w-full border-b border">
          <Logo />
        </div>

        <div className="w-full max-w-md flex-grow flex flex-col justify-center px-8 mx-auto">
          {/* Title */}
          <H1 className="text-center mb-4">Vérification du compte</H1>
          <p className="text-gray-500 mb-2 text-center">
            Un code de vérification a été envoyé à
          </p>
          <p className="text-gray-800 font-medium mb-8 text-center">
            {user?.email}
          </p>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Input
                id="code"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                className="text-center text-2xl tracking-[0.5em] font-mono"
                {...register("code")}
              />
              <ErrorMessage>{errors.code?.message}</ErrorMessage>
            </div>

            <Button disabled={verifyEmail.isPending} className="w-full">
              {verifyEmail.isPending && <Loader2 className="animate-spin" />}
              Vérifier
            </Button>
          </form>

          {/* Resend */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 mb-2">
              Vous n&apos;avez pas reçu le code ?
            </p>
            <Button
              variant="outline"
              disabled={resendCode.isPending}
              onClick={() => resendCode.mutate()}
              className="w-full"
            >
              {resendCode.isPending ? (
                <Loader2 className="animate-spin mr-2 w-4 h-4" />
              ) : (
                <RefreshCw className="mr-2 w-4 h-4" />
              )}
              Renvoyer le code
            </Button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-800 text-sm p-4 w-full border-t border-gray-200">
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
