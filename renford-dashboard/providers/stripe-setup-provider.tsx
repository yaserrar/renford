"use client";

import { ReactNode, useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/utilisateur";
import {
  useCreateConnectOnboarding,
  useConnectAccountStatus,
} from "@/hooks/paiement";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreditCard, ExternalLink, Loader2 } from "lucide-react";

const DISMISS_KEY = "renford-stripe-setup-dismissed";

type Props = { children: ReactNode };

const StripeSetupProvider = ({ children }: Props) => {
  const { data: user } = useCurrentUser();
  const [open, setOpen] = useState(false);

  const isRenford = user?.typeUtilisateur === "renford";
  const stripeComplete =
    user?.profilRenford?.stripeConnectOnboardingComplete === true;

  // Only fetch Stripe status for renfords who haven't completed setup
  const statusQuery = useConnectAccountStatus();
  const onboardingMutation = useCreateConnectOnboarding();

  useEffect(() => {
    if (!user || !isRenford || stripeComplete) return;

    // Check if user dismissed today already
    const dismissed = sessionStorage.getItem(DISMISS_KEY);
    if (dismissed) return;

    setOpen(true);
  }, [user, isRenford, stripeComplete]);

  const handleSetupStripe = () => {
    onboardingMutation.mutate({ returnUrl: "dashboard" });
  };

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "true");
    setOpen(false);
  };

  return (
    <>
      {children}
      <Dialog open={open} onOpenChange={(v) => !v && handleDismiss()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
              <CreditCard className="h-6 w-6 text-secondary" />
            </div>
            <DialogTitle className="text-center">
              Configurez votre compte de paiement
            </DialogTitle>
            <DialogDescription className="text-center">
              Pour recevoir vos paiements après vos missions, vous devez
              configurer votre compte Stripe. Vos données bancaires sont gérées
              exclusivement par Stripe — Renford n&apos;y a jamais accès.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-2 sm:flex-col">
            <Button
              onClick={handleSetupStripe}
              disabled={onboardingMutation.isPending}
              className="w-full"
            >
              {onboardingMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Redirection vers Stripe...
                </>
              ) : (
                <>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Configurer maintenant
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={handleDismiss}
              className="w-full text-muted-foreground"
            >
              Plus tard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StripeSetupProvider;
