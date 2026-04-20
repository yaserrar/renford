"use client";

import { Button } from "@/components/ui/button";
import { FileText, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import useAxios from "@/hooks/axios";

export default function FactureButton({
  paiementId,
  stripePaymentIntentId,
  statut,
  basePath = "/paiement",
}: {
  paiementId: string;
  stripePaymentIntentId: string | null;
  statut: string;
  basePath?: string;
}) {
  const axios = useAxios();

  const mutation = useMutation({
    mutationFn: async () => {
      return (await axios.get(`${basePath}/${paiementId}/facture`)).data as {
        receiptUrl: string;
      };
    },
    onSuccess: (data) => {
      window.open(data.receiptUrl, "_blank");
    },
    onError: (error: any) => {
      const message = getErrorMessage(error?.response?.data?.message);
      toast.error(message);
    },
  });

  if (
    !stripePaymentIntentId ||
    statut === "en_attente" ||
    statut === "echoue"
  ) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-1.5"
      disabled={mutation.isPending}
      onClick={() => mutation.mutate()}
    >
      {mutation.isPending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <FileText className="h-3.5 w-3.5" />
      )}
      Facture
    </Button>
  );
}
