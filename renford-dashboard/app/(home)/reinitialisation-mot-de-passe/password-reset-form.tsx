"use client";

import { Button } from "@/components/ui/button";
import ErrorMessage from "@/components/ui/error-message";
import { Input } from "@/components/ui/input";
import { InputPassword } from "@/components/ui/input-password";
import { Label } from "@/components/ui/label";
import { useResetPassword, useSendCode, useValidateCode } from "@/hooks/auth";
import {
  CodeSchema,
  codeSchema,
  EmailSchema,
  emailSchema,
  PasswordResetSchema,
  passwordResetSchema,
} from "@/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const PasswordResetForm = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const router = useRouter();

  const sendCode = useSendCode();
  const validateCode = useValidateCode();
  const resetPassword = useResetPassword();

  const step1Form = useForm<EmailSchema>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const step2Form = useForm<CodeSchema>({
    resolver: zodResolver(codeSchema),
    defaultValues: { email: "", code: "" },
  });

  const step3Form = useForm<PasswordResetSchema>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      email: "",
      code: "",
      password: "",
    },
  });

  const onStep1Submit: SubmitHandler<EmailSchema> = (data) => {
    sendCode.mutate(data, {
      onSuccess: () => {
        step2Form.reset({ email: data.email, code: "" });
        setStep(2);
      },
    });
  };

  const onStep2Submit: SubmitHandler<CodeSchema> = (data) => {
    validateCode.mutate(data, {
      onSuccess: () => {
        step3Form.reset({
          email: data.email,
          code: data.code,
          password: "",
        });
        setStep(3);
      },
    });
  };

  const onStep3Submit: SubmitHandler<PasswordResetSchema> = (data) => {
    resetPassword.mutate(data, {
      onSuccess: () => {
        router.push("/connexion");
      },
    });
  };

  return (
    <div>
      {/* Step 1: Enter Email */}
      {step === 1 && (
        <form
          className="space-y-5"
          onSubmit={step1Form.handleSubmit(onStep1Submit)}
        >
          <div>
            <Label htmlFor="email">Email*</Label>
            <Input
              id="email"
              type="email"
              placeholder="exemple@email.com"
              {...step1Form.register("email")}
            />
            <ErrorMessage>
              {step1Form.formState.errors.email?.message}
            </ErrorMessage>
          </div>

          <Button disabled={sendCode.isPending} className="w-full">
            {sendCode.isPending && <Loader2 className="animate-spin" />}
            Envoyer le code
          </Button>
        </form>
      )}

      {/* Step 2: Enter Code */}
      {step === 2 && (
        <div className="space-y-4">
          <form
            className="space-y-5"
            onSubmit={step2Form.handleSubmit(onStep2Submit)}
          >
            <div>
              <Label htmlFor="code">Code de vérification*</Label>
              <Input
                id="code"
                placeholder="123456"
                type="text"
                maxLength={6}
                {...step2Form.register("code")}
              />
              <ErrorMessage>
                {step2Form.formState.errors.code?.message}
              </ErrorMessage>
            </div>

            <p className="text-sm text-gray-600">
              Un code a été envoyé à{" "}
              <span className="font-medium text-primary">
                {step1Form.watch("email")}
              </span>
            </p>

            <Button disabled={validateCode.isPending} className="w-full">
              {validateCode.isPending && <Loader2 className="animate-spin" />}
              Vérifier le code
            </Button>
          </form>

          <div className="flex items-center justify-center gap-2 py-2">
            <div className="flex-1 border-t border-input"></div>
            <span className="text-sm text-gray-400">ou</span>
            <div className="flex-1 border-t border-input"></div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              const email = step2Form.getValues("email");
              step1Form.reset({ email });
              setStep(1);
            }}
          >
            Renvoyer le code
          </Button>
        </div>
      )}

      {/* Step 3: Reset Password */}
      {step === 3 && (
        <form
          className="space-y-5"
          onSubmit={step3Form.handleSubmit(onStep3Submit)}
        >
          <div>
            <Label htmlFor="password">Nouveau mot de passe*</Label>
            <InputPassword
              id="password"
              placeholder="••••••••"
              {...step3Form.register("password")}
            />
            <ErrorMessage>
              {step3Form.formState.errors.password?.message}
            </ErrorMessage>
          </div>

          <Button disabled={resetPassword.isPending} className="w-full">
            {resetPassword.isPending && <Loader2 className="animate-spin" />}
            Réinitialiser le mot de passe
          </Button>
        </form>
      )}
    </div>
  );
};

export default PasswordResetForm;
