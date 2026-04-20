"use client";

import { Copy, ExternalLink, Video } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type VisioDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  renfordNom: string;
  lienVisio: string;
};

export default function VisioDialog({
  open,
  onOpenChange,
  renfordNom,
  lienVisio,
}: VisioDialogProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(lienVisio).then(() => {
      toast.success("Lien copié dans le presse-papiers");
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Visio avec {renfordNom}
          </DialogTitle>
          <DialogDescription>
            Un lien de visioconférence a été généré. Partagez-le avec le Renford
            ou rejoignez directement.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border bg-muted/40 px-3 py-2 text-sm break-all text-foreground">
          {lienVisio}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={handleCopy}>
            <Copy className="mr-2 h-4 w-4" />
            Copier le lien
          </Button>
          <Button
            variant="dark"
            className="flex-1"
            onClick={() =>
              window.open(lienVisio, "_blank", "noopener,noreferrer")
            }
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Rejoindre
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
