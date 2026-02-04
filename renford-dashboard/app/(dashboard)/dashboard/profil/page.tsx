"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateProfileSchema,
  UpdateProfileSchema,
  changePasswordSchema,
  ChangePasswordSchema,
} from "@/validations/utilisateur";
import {
  useCurrentUser,
  useUpdateProfile,
  useChangePassword,
} from "@/hooks/utilisateur";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ErrorMessage from "@/components/ui/error-message";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { data: me, isLoading } = useCurrentUser();
  const { mutate: updateProfile, isPending: profilePending } =
    useUpdateProfile();
  const { mutate: changePassword, isPending: passwordPending } =
    useChangePassword();

  const profileForm = useForm<UpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      nom: "",
      prenom: "",
      telephone: "",
    },
  });

  const passwordForm = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
  });

  // Update form when user data loads
  useEffect(() => {
    if (me) {
      profileForm.reset({
        nom: me.nom || "",
        prenom: me.prenom || "",
        telephone: me.telephone || "",
      });
    }
  }, [me, profileForm]);

  const submitProfile = profileForm.handleSubmit((data) => {
    updateProfile(data);
  });

  const submitPassword = passwordForm.handleSubmit((data) => {
    changePassword(data, {
      onSuccess: () =>
        passwordForm.reset({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        }),
    });
  });

  if (isLoading) {
    return (
      <div className="container mx-auto flex items-center justify-center h-64 mt-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="container mx-auto flex flex-col gap-6 mt-12">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="font-medium text-primary-dark">
              Information générale
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submitProfile} className="space-y-4">
              <div>
                <Label>Nom</Label>
                <Input {...profileForm.register("nom")} placeholder="Nom" />
                <ErrorMessage>
                  {profileForm.formState.errors.nom?.message}
                </ErrorMessage>
              </div>
              <div>
                <Label>Prénom</Label>
                <Input
                  {...profileForm.register("prenom")}
                  placeholder="Prénom"
                />
                <ErrorMessage>
                  {profileForm.formState.errors.prenom?.message}
                </ErrorMessage>
              </div>
              <div>
                <Label>Téléphone</Label>
                <Input
                  {...profileForm.register("telephone")}
                  placeholder="Téléphone"
                />
                <ErrorMessage>
                  {profileForm.formState.errors.telephone?.message}
                </ErrorMessage>
              </div>
              <div>
                <Label>Rôle</Label>
                <Input disabled value={me?.role || ""} className="bg-gray-50" />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  disabled
                  value={me?.email || ""}
                  className="bg-gray-50"
                />
              </div>
              <Button
                type="submit"
                disabled={profilePending}
                className="w-full"
              >
                {profilePending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Enregistrement...
                  </>
                ) : (
                  "Enregistrer"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="font-medium text-primary-dark">
              Sécurité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submitPassword} className="space-y-4">
              <div>
                <Label>Mot de passe actuel</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...passwordForm.register("oldPassword")}
                />
                <ErrorMessage>
                  {passwordForm.formState.errors.oldPassword?.message}
                </ErrorMessage>
              </div>
              <div>
                <Label>Nouveau mot de passe</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...passwordForm.register("newPassword")}
                />
                <ErrorMessage>
                  {passwordForm.formState.errors.newPassword?.message}
                </ErrorMessage>
              </div>
              <div>
                <Label>Confirmer le mot de passe</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...passwordForm.register("confirmPassword")}
                />
                <ErrorMessage>
                  {passwordForm.formState.errors.confirmPassword?.message}
                </ErrorMessage>
              </div>
              <ul className="text-xs text-gray-500 list-disc pl-4 space-y-1">
                <li>Minimum 8 caractères</li>
                <li>Au moins une lettre majuscule</li>
                <li>Au moins une lettre minuscule</li>
                <li>Au moins un chiffre</li>
                <li>Au moins un caractère spécial</li>
              </ul>
              <Button
                type="submit"
                disabled={passwordPending}
                className="w-full"
              >
                {passwordPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Enregistrement...
                  </>
                ) : (
                  "Changer le mot de passe"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
