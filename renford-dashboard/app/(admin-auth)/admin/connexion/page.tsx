"use client";

import { Logo } from "@/components/common/logo";
import { Button } from "@/components/ui/button";
import ErrorMessage from "@/components/ui/error-message";
import { Input } from "@/components/ui/input";
import { InputPassword } from "@/components/ui/input-password";
import { Label } from "@/components/ui/label";
import { H1 } from "@/components/ui/typography";
import { useLogin } from "@/hooks/auth";
import { loginSchema, LoginSchema } from "@/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

export default function AdminLoginPage() {
  const router = useRouter();
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginSchema> = (data) => {
    login.mutate(data, {
      onSuccess: () => {
        router.push("/admin/accueil");
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary-background">
      <div className="w-full max-w-md bg-white rounded-2xl border border-border p-8 shadow-sm">
        <div className="flex flex-col items-center gap-3 mb-8">
          <Logo />
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">Administration</span>
          </div>
        </div>

        <H1 className="text-center mb-8 text-xl">Connexion administrateur</H1>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@renford.fr"
              {...register("email")}
            />
            <ErrorMessage>{errors.email?.message}</ErrorMessage>
          </div>

          <div>
            <Label htmlFor="password">Mot de passe</Label>
            <InputPassword
              id="password"
              placeholder="••••••••"
              {...register("password")}
            />
            <ErrorMessage>{errors.password?.message}</ErrorMessage>
          </div>

          <Button disabled={login.isPending} className="w-full">
            {login.isPending && <Loader2 className="animate-spin" />}
            Connexion
          </Button>
        </form>
      </div>

      <p className="text-center text-gray-400 text-sm mt-8">
        © {new Date().getFullYear()} Renford
      </p>
    </div>
  );
}
