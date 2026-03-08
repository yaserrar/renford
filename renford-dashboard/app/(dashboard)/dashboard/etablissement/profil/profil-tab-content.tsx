import { CurrentUser } from "@/types/utilisateur";
import ProfilHeroSection from "./profil-hero-section";
import { Label } from "@/components/ui/label";

type ProfilTabContentProps = {
  me: CurrentUser | undefined;
};

export default function ProfilTabContent({ me }: ProfilTabContentProps) {
  const profil = me?.profilEtablissement;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-3xl border border-input overflow-hidden">
        <ProfilHeroSection me={me} />

        <div className="p-6 space-y-4">
          <div className="pb-4 border-b border-input grid grid-cols-1 md:grid-cols-3 gap-4">
            <Label>Type d&apos;établissement</Label>
            <p className="text-base font-medium mt-1 md:col-span-2">
              {profil?.typeEtablissement?.replaceAll("_", " ") || "-"}
            </p>
          </div>

          <div className="pb-4 border-b border-input grid grid-cols-1 md:grid-cols-3 gap-4">
            <Label>Raison sociale</Label>
            <p className="text-base font-medium mt-1 md:col-span-2">
              {profil?.raisonSociale || "-"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Label>À propos</Label>
            <p className="text-base font-medium mt-1 md:col-span-2 whitespace-pre-wrap">
              {profil?.aPropos || "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
