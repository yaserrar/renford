import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { CurrentUser } from "@/types/utilisateur";
import { TYPE_NOTIFICATION_PREFERENCE } from "@/validations/utilisateur";

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
  return (
    <div className="bg-white rounded-2xl border border-input p-6 space-y-8">
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4 border-b border-input pb-5">
          <div>
            <h3 className="text-2xl font-semibold">Par email</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Préférences de notifications reçues par email.
            </p>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <Switch
              checked={me?.notificationsEmail ?? false}
              disabled
              aria-label="Notifications email"
            />
            <p className="text-base">
              Activer toutes les notifications par email
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {TYPE_NOTIFICATION_PREFERENCE.map((type) => (
            <label
              key={`email-${type}`}
              className="flex items-center gap-3 text-base"
            >
              <Checkbox
                checked={Boolean(me?.typeNotificationsEmail?.includes(type))}
                disabled
                aria-label={`Email ${NOTIFICATION_LABELS[type]}`}
              />
              {NOTIFICATION_LABELS[type]}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4 border-b border-input pb-5">
          <div>
            <h3 className="text-2xl font-semibold">Sur mobile</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Préférences de notifications envoyées sur mobile.
            </p>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <Switch
              checked={me?.notificationsMobile ?? false}
              disabled
              aria-label="Notifications mobile"
            />
            <p className="text-base">
              Activer toutes les notifications sur mobile
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {TYPE_NOTIFICATION_PREFERENCE.map((type) => (
            <label
              key={`mobile-${type}`}
              className="flex items-center gap-3 text-base"
            >
              <Checkbox
                checked={Boolean(me?.typeNotificationsMobile?.includes(type))}
                disabled
                aria-label={`Mobile ${NOTIFICATION_LABELS[type]}`}
              />
              {NOTIFICATION_LABELS[type]}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
