"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import ErrorMessage from "@/components/ui/error-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useInviteRenford } from "@/hooks/parrainage";
import { useCurrentUser } from "@/hooks/utilisateur";
import {
  inviteRenfordSchema,
  InviteRenfordSchema,
} from "@/validations/parrainage";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Check,
  Copy,
  Facebook,
  Link as LinkIcon,
  Loader2,
  Mail,
  MessageCircle,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function InviterRenfordDialog({ open, onOpenChange }: Props) {
  const invite = useInviteRenford();
  const { data: currentUser } = useCurrentUser();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [copied, setCopied] = useState(false);

  const referralLink =
    typeof window !== "undefined" && currentUser
      ? `${window.location.origin}/inscription?parrainId=${currentUser.id}`
      : "";

  const shareText = `Rejoins Renford et bénéficie d'avantages exclusifs ! Inscris-toi via ce lien : ${referralLink}`;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteRenfordSchema>({
    resolver: zodResolver(inviteRenfordSchema),
  });

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      setShowEmailForm(false);
      reset();
    }
    onOpenChange(value);
  };

  const onSubmit: SubmitHandler<InviteRenfordSchema> = (data) => {
    invite.mutate(data, {
      onSuccess: () => {
        reset();
        setShowEmailForm(false);
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="md:max-w-xl p-0 overflow-hidden">
        <DialogTitle className="sr-only">Inviter un Renford</DialogTitle>

        {/* Top section */}
        <div className="bg-secondary-background space-y-6 p-6 py-8 text-center w-full">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-white">
            <Share2 className="size-5 text-secondary-dark" />
          </div>
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Invitez un Renford</h3>
            <p className="text-sm text-muted-foreground">
              Partagez ce lien et gagnez 1 mois gratuit pour chaque inscription.
            </p>
          </div>
        </div>

        {/* Bottom section */}
        <div className="space-y-4 p-6 px-8">
          {!showEmailForm ? (
            <>
              {/* Referral link */}
              <div className="relative flex items-center">
                <LinkIcon className="size-4 shrink-0 text-muted-foreground absolute left-3" />
                <Input
                  className="flex-1 truncate text-left text-sm break-all pl-8 border-0 bg-gray-100"
                  value={
                    referralLink.slice(0, 30) + "..." + referralLink.slice(-10)
                  }
                  readOnly
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleCopy}
                  className="absolute right-2"
                >
                  {copied ? (
                    <Check className="size-4" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </Button>
              </div>

              {/* Separator */}
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs font-medium text-muted-foreground">
                  OU
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>

              {/* Share buttons */}
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-center font-normal gap-3"
                  asChild
                >
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      className="size-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Partager via WhatsApp
                  </a>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-center font-normal gap-3"
                  asChild
                >
                  <a
                    href={`https://www.facebook.com/dialog/send?link=${encodeURIComponent(referralLink)}&app_id=0&redirect_uri=${encodeURIComponent(referralLink)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Facebook className="size-4" />
                    Partager via Messenger
                  </a>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-center font-normal gap-3"
                  onClick={() => setShowEmailForm(true)}
                >
                  <Mail className="size-4" />
                  Partager via e-mail
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Back button */}
              <button
                type="button"
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setShowEmailForm(false);
                  reset();
                }}
              >
                <ArrowLeft className="size-4" />
                Retour
              </button>

              {/* Email form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="prenom">Prénom*</Label>
                    <Input
                      id="prenom"
                      placeholder="Prénom"
                      {...register("prenom")}
                    />
                    <ErrorMessage>{errors.prenom?.message}</ErrorMessage>
                  </div>
                  <div>
                    <Label htmlFor="nom">Nom*</Label>
                    <Input id="nom" placeholder="Nom" {...register("nom")} />
                    <ErrorMessage>{errors.nom?.message}</ErrorMessage>
                  </div>
                </div>

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

                <Button
                  type="submit"
                  className="w-full"
                  disabled={invite.isPending}
                >
                  {invite.isPending && <Loader2 className="animate-spin" />}
                  Envoyer l&apos;invitation
                </Button>
              </form>
            </>
          )}

          {/* Conditions link */}
          <p className="text-center text-xs text-muted-foreground">
            <Link
              href="/dashboard/conditions-parrainage"
              className="underline hover:text-foreground"
            >
              Conditions du programme de parrainage
            </Link>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
