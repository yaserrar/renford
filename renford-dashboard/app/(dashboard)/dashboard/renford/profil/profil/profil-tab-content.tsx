import { CurrentUser } from "@/types/utilisateur";
import AproposSection from "./apropos-section";
import CertificationsSection from "./certifications-section";
import DisponibiliteSection from "./disponibilite-section";
import ExperiencesSection from "./experiences-section";
import ExpertisesSection from "./expertises-section";
import PortfolioSection from "./portfolio-section";
import ProfilHeroSection from "./profil-hero-section";
import QualificationSection from "./qualification-section";

type ProfilTabContentProps = {
  me: CurrentUser | undefined;
};

export default function ProfilTabContent({ me }: ProfilTabContentProps) {
  return (
    <div className="space-y-4">
      <ProfilHeroSection me={me} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <DisponibiliteSection me={me} />
          <QualificationSection me={me} />
        </div>

        <div className="space-y-4">
          <ExpertisesSection me={me} />
          <AproposSection me={me} />
          <ExperiencesSection me={me} />
          <CertificationsSection me={me} />
          <PortfolioSection me={me} />
        </div>
      </div>
    </div>
  );
}
