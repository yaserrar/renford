"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import ErrorMessage from "@/components/ui/error-message";
import { Input } from "@/components/ui/input";
import { InputPassword } from "@/components/ui/input-password";
import { Label } from "@/components/ui/label";
import { useSignup } from "@/hooks/auth";
import { signupSchema, SignupSchema } from "@/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

const SignupForm = () => {
  const router = useRouter();
  const signup = useSignup();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      acceptTerms: false,
    },
  });

  const onSubmit: SubmitHandler<SignupSchema> = (data) => {
    const { acceptTerms, ...payload } = data;
    signup.mutate(payload, {
      onSuccess: () => {
        router.push("/verification-compte");
      },
    });
  };

  return (
    <div>
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label htmlFor="email">Email*</Label>
          <Input
            id="email"
            type="email"
            placeholder="exemple@email.com"
            {...register("email")}
          />
          <ErrorMessage>{errors.email?.message}</ErrorMessage>
        </div>

        <div>
          <Label htmlFor="password">Mot de passe*</Label>
          <InputPassword
            id="password"
            placeholder="••••••••"
            {...register("password")}
          />
          <ErrorMessage>{errors.password?.message}</ErrorMessage>
        </div>

        <div className="flex items-start gap-2">
          <Controller
            name="acceptTerms"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="acceptTerms"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <label
            htmlFor="acceptTerms"
            className="text-sm text-gray-600 leading-tight cursor-pointer"
          >
            En cochant cette case, je déclare avoir lu et accepter les{" "}
            <Link href="/conditions" className="underline">
              Conditions Générales de Vente
            </Link>{" "}
            et la{" "}
            <Link href="/confidentialite" className="underline">
              politique de confidentialité
            </Link>
            .
          </label>
        </div>
        {errors.acceptTerms && (
          <ErrorMessage>{errors.acceptTerms.message}</ErrorMessage>
        )}

        <Button disabled={signup.isPending} className="w-full">
          {signup.isPending && <Loader2 className="animate-spin" />}
          S&apos;inscrire
        </Button>
      </form>

      <Button variant="outline" className="w-full gap-2 mt-4">
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        S&apos;inscrire avec Google
      </Button>
    </div>
  );
};

export default SignupForm;
