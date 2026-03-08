"use client";

import ImageUploadDialog from "@/components/common/image-upload-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  useUpdateProfilRenfordAvatar,
  useUpdateProfilRenfordCouverture,
} from "@/hooks/profil-renford";
import { getUrl } from "@/lib/utils";
import { CurrentUser } from "@/types/utilisateur";
import { ImageUpIcon, MapPin, Pencil } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import ProfilInfosEditDialog from "./profil-infos-edit-dialog";

type ProfilHeroSectionProps = {
  me: CurrentUser | undefined;
};

export default function ProfilHeroSection({ me }: ProfilHeroSectionProps) {
  const profil = me?.profilRenford;
  const fullName = [me?.prenom, me?.nom].filter(Boolean).join(" ") || "-";
  const title = profil?.titreProfil;

  const [coverDialogOpen, setCoverDialogOpen] = useState(false);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [infosDialogOpen, setInfosDialogOpen] = useState(false);

  const updateCouverture = useUpdateProfilRenfordCouverture();
  const updateAvatar = useUpdateProfilRenfordAvatar();

  const handleCouvertureUploaded = (path: string) => {
    updateCouverture.mutate({ imageCouvertureChemin: path });
  };

  const handleAvatarUploaded = (path: string) => {
    updateAvatar.mutate({ avatarChemin: path });
  };

  return (
    <>
      <ImageUploadDialog
        open={coverDialogOpen}
        setOpen={setCoverDialogOpen}
        setImageValue={handleCouvertureUploaded}
        path="profils/couvertures"
        name="couverture-renford"
        aspect={16 / 5}
      />

      <ImageUploadDialog
        open={avatarDialogOpen}
        setOpen={setAvatarDialogOpen}
        setImageValue={handleAvatarUploaded}
        path="profils/avatars"
        aspect={1}
        name="avatar-renford"
      />

      <ProfilInfosEditDialog
        open={infosDialogOpen}
        setOpen={setInfosDialogOpen}
        me={me}
      />

      <div className="bg-white rounded-3xl border border-input overflow-hidden">
        <div className="relative h-72 w-full bg-gray-100 overflow-hidden">
          {profil?.imageCouvertureChemin ? (
            <Image
              src={getUrl(profil.imageCouvertureChemin)}
              alt="Couverture renford"
              className="object-cover w-full"
              height={300}
              width={1300}
              quality={100}
            />
          ) : null}

          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="opacity-70 hover:opacity-100 transition-opacity"
              onClick={() => setCoverDialogOpen(true)}
            >
              <ImageUpIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-6 border-b border-input flex items-center gap-4 justify-between -mt-10">
          <div className="flex items-end gap-4">
            <div className="relative">
              <Avatar className="h-26 w-26 border">
                <AvatarImage
                  src={
                    profil?.avatarChemin
                      ? getUrl(profil.avatarChemin)
                      : undefined
                  }
                  alt={fullName}
                />
                <AvatarFallback></AvatarFallback>
              </Avatar>

              <Button
                type="button"
                variant="outline"
                size="icon"
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity h-8 w-8 [&_svg]:size-3"
                onClick={() => setAvatarDialogOpen(true)}
              >
                <ImageUpIcon />
              </Button>
            </div>

            <div>
              <p className="text-2xl font-semibold">{fullName}</p>
              <p className="text-sm text-muted-foreground">
                {title} ·{" "}
                {profil?.niveauExperience?.replaceAll("_", " ") || "-"}
              </p>
              <p className="text-sm text-muted-foreground flex items-center">
                <MapPin className="inline mb-1 mr-1" size={16} />
                {[profil?.adresse, profil?.codePostal, profil?.ville]
                  .filter(Boolean)
                  .join(" ") || "-"}
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="shrink-0"
            onClick={() => setInfosDialogOpen(true)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}
