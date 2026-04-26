"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useUpdateNotificationSettings } from "@/hooks/utilisateur";
import { Switch } from "@/components/ui/switch";
import { CurrentUser } from "@/types/utilisateur";
import { cn } from "@/lib/utils";
import {
  TYPE_NOTIFICATION_PREFERENCE,
  updateNotificationSettingsSchema,
  UpdateNotificationSettingsSchema,
} from "@/validations/utilisateur";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Label } from "@/components/ui/label";

type NotificationsTabContentProps = {
  me: CurrentUser | undefined;
};

const NOTIFICATION_LABELS: Record<
  (typeof TYPE_NOTIFICATION_PREFERENCE)[number],
  string
> = {
  marketing: "Marketing",
  annonces_mises_ajours: "Annonces et mises à jour",
  support: "Support",
  missions: "Missions",
};

export default function NotificationsTabContent({
  me,
}: NotificationsTabContentProps) {
  const { mutate, isPending } = useUpdateNotificationSettings();

  const { control, handleSubmit, reset, setValue } =
    useForm<UpdateNotificationSettingsSchema>({
      resolver: zodResolver(updateNotificationSettingsSchema),
      defaultValues: {
        notificationsEmail: me?.notificationsEmail ?? false,
        typeNotificationsEmail: me?.typeNotificationsEmail ?? [],
        notificationsMobile: me?.notificationsMobile ?? false,
        typeNotificationsMobile: me?.typeNotificationsMobile ?? [],
      },
    });

  useEffect(() => {
    reset({
      notificationsEmail: me?.notificationsEmail ?? false,
      typeNotificationsEmail: me?.typeNotificationsEmail ?? [],
      notificationsMobile: me?.notificationsMobile ?? false,
      typeNotificationsMobile: me?.typeNotificationsMobile ?? [],
    });
  }, [me, reset]);

  const notificationsEmail = useWatch({ control, name: "notificationsEmail" });
  const notificationsMobile = useWatch({
    control,
    name: "notificationsMobile",
  });
  const typeNotificationsEmail =
    useWatch({ control, name: "typeNotificationsEmail" }) ?? [];
  const typeNotificationsMobile =
    useWatch({ control, name: "typeNotificationsMobile" }) ?? [];

  const togglePreference = (
    channel: "email" | "mobile",
    pref: (typeof TYPE_NOTIFICATION_PREFERENCE)[number],
  ) => {
    const fieldName =
      channel === "email"
        ? "typeNotificationsEmail"
        : "typeNotificationsMobile";
    const current =
      channel === "email" ? typeNotificationsEmail : typeNotificationsMobile;

    const next = current.includes(pref)
      ? current.filter((item) => item !== pref)
      : [...current, pref];

    setValue(fieldName, next, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const onSubmit = (data: UpdateNotificationSettingsSchema) => {
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-white rounded-2xl border border-input p-6 space-y-8">
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-2">
            <div>
              <h3 className="text-2xl font-semibold">Par email</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Préférences de notifications reçues par email.
              </p>
            </div>
            <div className="space-y-6 md:col-span-2">
              <div className="flex items-center gap-3 pt-1">
                <Controller
                  name="notificationsEmail"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="notificationsEmail"
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        const enabled = checked === true;
                        field.onChange(enabled);
                        if (!enabled) {
                          setValue("typeNotificationsEmail", [], {
                            shouldDirty: true,
                            shouldTouch: true,
                            shouldValidate: true,
                          });
                        }
                      }}
                      aria-label="Notifications email"
                      disabled={isPending}
                    />
                  )}
                />
                <Label htmlFor="notificationsEmail" className="text-base mb-0">
                  Activer toutes les notifications par email
                </Label>
              </div>

              <div className="space-y-4">
                {TYPE_NOTIFICATION_PREFERENCE.map((type) => (
                  <label
                    key={`email-${type}`}
                    className={cn(
                      "flex items-center gap-3 text-base",
                      !notificationsEmail && "text-muted-foreground",
                    )}
                  >
                    <Checkbox
                      checked={typeNotificationsEmail.includes(type)}
                      onCheckedChange={() => togglePreference("email", type)}
                      disabled={isPending || !notificationsEmail}
                      aria-label={`Email ${NOTIFICATION_LABELS[type]}`}
                    />
                    {NOTIFICATION_LABELS[type]}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-2">
            <div>
              <h3 className="text-2xl font-semibold">Sur mobile</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Préférences de notifications envoyées sur mobile.
              </p>
            </div>
            <div className="space-y-6 md:col-span-2">
              <div className="flex items-center gap-3 pt-1">
                <Controller
                  name="notificationsMobile"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="notificationsMobile"
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        const enabled = checked === true;
                        field.onChange(enabled);
                        if (!enabled) {
                          setValue("typeNotificationsMobile", [], {
                            shouldDirty: true,
                            shouldTouch: true,
                            shouldValidate: true,
                          });
                        }
                      }}
                      aria-label="Notifications mobile"
                      disabled={isPending}
                    />
                  )}
                />
                <Label htmlFor="notificationsMobile" className="text-base mb-0">
                  Activer toutes les notifications sur mobile
                </Label>
              </div>

              <div className="space-y-4">
                {TYPE_NOTIFICATION_PREFERENCE.map((type) => (
                  <label
                    key={`mobile-${type}`}
                    className={cn(
                      "flex items-center gap-3 text-base",
                      !notificationsMobile && "text-muted-foreground",
                    )}
                  >
                    <Checkbox
                      checked={typeNotificationsMobile.includes(type)}
                      onCheckedChange={() => togglePreference("mobile", type)}
                      disabled={isPending || !notificationsMobile}
                      aria-label={`Mobile ${NOTIFICATION_LABELS[type]}`}
                    />
                    {NOTIFICATION_LABELS[type]}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="animate-spin" />}
            Enregistrer
          </Button>
        </div>
      </div>
    </form>
  );
}
