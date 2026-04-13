import { H2 } from "@/components/ui/typography";

export default function ConfidentialitePage() {
  return (
    <main className="container mx-auto max-w-4xl py-12 space-y-8">
      <header className="space-y-2">
        <H2>Charte de Confidentialité</H2>
        <p className="text-sm text-muted-foreground">
          Dernière mise à jour : 20 avril 2024
        </p>
      </header>

      <section className="space-y-4 text-sm leading-6 text-muted-foreground">
        <h2 className="text-xl font-semibold text-foreground">
          À quoi sert cette charte ?
        </h2>
        <p>
          Chez Renford, la protection de vos données personnelles est
          primordiale. Cette charte vise à informer les utilisateurs de notre
          plateforme - qu&apos;ils soient demandeurs d&apos;inscription,
          professionnels indépendants du sport, ou établissements sportifs - sur
          les pratiques de Renford concernant le traitement de vos données à
          caractère personnel.
        </p>
        <p>
          Nous nous conformons à la loi « Informatique et Libertés » de 1978,
          ainsi qu&apos;au Règlement Général sur la Protection des Données
          (RGPD) du 27 avril 2016.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          Qu&apos;est-ce qu&apos;une donnée personnelle ?
        </h2>
        <p>
          Une donnée personnelle est toute information permettant
          d&apos;identifier un individu. Cela peut inclure, mais sans s&apos;y
          limiter, votre nom, prénom, adresse email, numéro de téléphone, ainsi
          que toute autre information que vous choisissez de partager avec nous
          via notre plateforme.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          Quelles données collectons-nous ?
        </h2>
        <p>Nous recueillons différentes catégories de données personnelles :</p>
        <p>
          Pour les professionnels indépendants : informations
          d&apos;identification, coordonnées, informations professionnelles, et,
          pour certaines missions, des informations complémentaires spécifiques.
        </p>
        <p>
          Pour les établissements : coordonnées de l&apos;établissement et des
          managers, informations nécessaires à la réalisation de la prestation
          et des informations complémentaires spécifiques.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          Responsable du traitement
        </h2>
        <p>
          Renford est le responsable du traitement de vos données personnelles.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          Utilisation de vos données
        </h2>
        <p>Vos données sont collectées et utilisées sur la base :</p>
        <p>
          Du contrat : Pour l&apos;exécution du contrat d&apos;utilisation de
          nos services.
        </p>
        <p>
          De l&apos;intérêt légitime : Pour répondre à vos demandes et améliorer
          nos services.
        </p>
        <p>
          De l&apos;obligation légale : Lorsque le traitement est nécessaire au
          respect des obligations légales.
        </p>
        <p>
          Du consentement : Concernant la collecte et le stockage de vos données
          via cookies (gestion par Axeptio).
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          Finalités de la collecte
        </h2>
        <p>Les données sont collectées pour :</p>
        <p>
          Créer un fichier d&apos;utilisateurs, faciliter la mise en relation,
          gérer l&apos;accès aux services, élaborer des statistiques,
          personnaliser les interactions, envoyer des newsletters, gérer les
          avis post-missions, et respecter nos obligations légales.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          Destinataires des données
        </h2>
        <p>
          Vos données peuvent être partagées avec notre équipe, des services de
          contrôle, des sous-traitants, et des partenaires pour la réalisation
          des services proposés.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          Durée de conservation
        </h2>
        <p>
          Les données sont conservées pour la durée nécessaire à
          l&apos;accomplissement des finalités mentionnées, conformément aux
          délais légaux.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          Sécurité et hébergement
        </h2>
        <p>
          Nous prenons toutes les mesures nécessaires pour assurer la sécurité
          de vos données. Elles sont stockées sur des serveurs sécurisés,
          principalement en Union européenne.
        </p>

        <h2 className="text-xl font-semibold text-foreground">Vos droits</h2>
        <p>
          Vous disposez de droits d&apos;accès, de rectification, de limitation,
          de portabilité, d&apos;effacement, d&apos;opposition, ainsi que le
          droit de définir des directives post-mortem concernant vos données.
        </p>
        <p>
          Pour exercer vos droits, contactez-nous à{" "}
          <a
            className="text-secondary underline"
            href="mailto:contact@renford.fr"
          >
            contact@renford.fr
          </a>
          .
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          Entrée en vigueur et modifications
        </h2>
        <p>
          Nous nous réservons le droit de la modifier, tout changement étant
          communiqué de manière transparente. Cette charte est en vigueur depuis
          le 20 avril 2024.
        </p>
        <p>
          Pour toute question, contactez-nous à{" "}
          <a
            className="text-secondary underline"
            href="mailto:contact@renford.fr"
          >
            contact@renford.fr
          </a>
          .
        </p>
      </section>
    </main>
  );
}
