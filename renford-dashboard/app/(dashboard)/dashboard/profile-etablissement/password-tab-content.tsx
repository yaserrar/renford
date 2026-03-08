import { Button } from "@/components/ui/button";
import ErrorMessage from "@/components/ui/error-message";
import { InputPassword } from "@/components/ui/input-password";
import { Label } from "@/components/ui/label";
import { useChangePassword } from "@/hooks/utilisateur";
import {
  ChangePasswordSchema,
  changePasswordSchema,
} from "@/validations/utilisateur";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";

type PasswordFormData = ChangePasswordSchema;

export default function PasswordTabContent() {
  const changePassword = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<PasswordFormData> = (data) => {
    changePassword.mutate(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-input p-6">
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label htmlFor="oldPassword">Mot de passe actuel*</Label>
          <InputPassword
            id="oldPassword"
            placeholder="••••••••"
            {...register("oldPassword")}
          />
          <ErrorMessage>{errors.oldPassword?.message}</ErrorMessage>
        </div>

        <div>
          <Label htmlFor="newPassword">Nouveau mot de passe*</Label>
          <InputPassword
            id="newPassword"
            placeholder="••••••••"
            {...register("newPassword")}
          />
          <ErrorMessage>{errors.newPassword?.message}</ErrorMessage>
        </div>

        <div>
          <Label htmlFor="confirmPassword">
            Confirmer le nouveau mot de passe*
          </Label>
          <InputPassword
            id="confirmPassword"
            placeholder="••••••••"
            {...register("confirmPassword")}
          />
          <ErrorMessage>{errors.confirmPassword?.message}</ErrorMessage>
        </div>

        <Button disabled={changePassword.isPending}>
          {changePassword.isPending && <Loader2 className="animate-spin" />}
          Modifier le mot de passe
        </Button>
      </form>
    </div>
  );
}
