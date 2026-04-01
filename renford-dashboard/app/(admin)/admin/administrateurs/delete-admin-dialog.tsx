"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteAdmin } from "@/hooks/admin";
import { Loader2 } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  adminId: string;
  adminName: string;
};

export default function DeleteAdminDialog({
  open,
  onOpenChange,
  adminId,
  adminName,
}: Props) {
  const deleteMutation = useDeleteAdmin();

  const handleDelete = () => {
    deleteMutation.mutate(adminId, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Supprimer l&apos;administrateur</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer{" "}
            <span className="font-semibold text-foreground">{adminName}</span> ?
            Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending && <Loader2 className="animate-spin" />}
            Supprimer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
