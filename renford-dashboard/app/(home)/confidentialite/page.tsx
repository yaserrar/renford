import { H2 } from "@/components/ui/typography";

export default function ConfidentialitePage() {
  return (
    <main className="container mx-auto max-w-4xl py-12 space-y-8">
      <header className="space-y-2">
        <H2>Politique de confidentialité</H2>
        <p className="text-sm text-muted-foreground">
          Dernière mise à jour : 08/03/2026
        </p>
      </header>

      <section className="space-y-4 text-sm leading-6 text-muted-foreground">
        <p>
          Cette politique de confidentialité explique comment Renford collecte,
          utilise et protège les données personnelles des utilisateurs.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          1. Données collectées
        </h2>
        <p>
          Nous collectons les données nécessaires à la création du compte, à
          l’utilisation des fonctionnalités et à l’amélioration du service.
        </p>

        <h2 className="text-xl font-semibold text-foreground">2. Finalités</h2>
        <p>
          Les données sont utilisées pour fournir le service, gérer les comptes,
          assurer la sécurité de la plateforme et communiquer avec les
          utilisateurs.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          3. Conservation
        </h2>
        <p>
          Les données sont conservées pendant la durée nécessaire aux finalités
          décrites, sauf obligation légale contraire.
        </p>

        <h2 className="text-xl font-semibold text-foreground">4. Partage</h2>
        <p>
          Les données ne sont partagées qu’avec les prestataires techniques et
          partenaires nécessaires au fonctionnement du service, dans un cadre
          sécurisé.
        </p>

        <h2 className="text-xl font-semibold text-foreground">5. Vos droits</h2>
        <p>
          Vous pouvez demander l’accès, la rectification ou la suppression de
          vos données, dans les limites prévues par la réglementation
          applicable.
        </p>

        <h2 className="text-xl font-semibold text-foreground">6. Contact</h2>
        <p>
          Pour toute demande relative à la confidentialité, contactez le support
          Renford via les moyens indiqués dans l’application.
        </p>
      </section>
    </main>
  );
}
