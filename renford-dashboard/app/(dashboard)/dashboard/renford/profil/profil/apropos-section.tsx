"use client";

import { Button } from "@/components/ui/button";
import { CurrentUser } from "@/types/utilisateur";
import { Pencil } from "lucide-react";
import { useState } from "react";
import AproposEditDialog from "./apropos-edit-dialog";

type AproposSectionProps = {
  me: CurrentUser | undefined;
};

export default function AproposSection({ me }: AproposSectionProps) {
  const profil = me?.profilRenford;
  const [open, setOpen] = useState(false);

  return (
    <>
      <AproposEditDialog open={open} setOpen={setOpen} me={me} />

      <div className="bg-white rounded-3xl border border-input p-6 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-xl font-semibold">À propos</h3>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="shrink-0"
            onClick={() => setOpen(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          {profil?.descriptionProfil || "-"}
        </p>
      </div>
    </>
  );
}
