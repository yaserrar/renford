import { H2 } from "@/components/ui/typography";

export default function ConditionsParrainagePage() {
  return (
    <main className="mx-auto py-12 space-y-8">
      <header className="space-y-2">
        <H2>Conditions du programme de parrainage</H2>
        <p className="text-sm text-muted-foreground">
          Dernière mise à jour : 08/03/2026
        </p>
      </header>

      <section className="space-y-6 text-sm leading-6 text-muted-foreground bg-secondary-background p-6 rounded-2xl border">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            1. Principe du programme
          </h2>
          <p>
            Le programme de parrainage Renford permet à tout utilisateur inscrit
            et actif (le « Parrain ») d&apos;inviter de nouvelles personnes (les
            « Filleuls ») à rejoindre la plateforme. En cas d&apos;inscription
            validée du filleul, le parrain bénéficie d&apos;une récompense sous
            forme d&apos;un mois d&apos;abonnement gratuit.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            2. Éligibilité
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              Le parrain doit disposer d&apos;un compte Renford actif et en
              règle.
            </li>
            <li>
              Le filleul ne doit pas déjà posséder de compte sur la plateforme
              Renford.
            </li>
            <li>
              Le filleul doit s&apos;inscrire via le lien de parrainage unique
              fourni par le parrain.
            </li>
            <li>
              L&apos;auto-parrainage (se parrainer soi-même avec un autre
              compte) est interdit et entraîne l&apos;annulation de la
              récompense.
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            3. Récompenses
          </h2>
          <p>
            Pour chaque filleul qui finalise son inscription et active son
            compte, le parrain reçoit 1 mois d&apos;abonnement gratuit. La
            récompense est créditée automatiquement une fois que le filleul a
            complété son profil et validé son compte.
          </p>
          <p>
            Il n&apos;y a pas de limite au nombre de filleuls qu&apos;un parrain
            peut inviter. Chaque inscription validée donne droit à une
            récompense supplémentaire.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            4. Conditions de validation
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              Le filleul doit s&apos;inscrire en utilisant le lien de parrainage
              ou l&apos;invitation par email envoyée par le parrain.
            </li>
            <li>
              Le filleul doit vérifier son adresse email et compléter
              l&apos;ensemble des étapes d&apos;onboarding.
            </li>
            <li>
              Le compte du filleul doit passer au statut « actif » pour que la
              récompense soit attribuée.
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            5. Durée et modification du programme
          </h2>
          <p>
            Le programme de parrainage est proposé sans durée limitée. Renford
            se réserve le droit de modifier, suspendre ou mettre fin au
            programme à tout moment, avec un préavis de 30 jours communiqué par
            email ou notification dans l&apos;application.
          </p>
          <p>
            Les récompenses acquises avant toute modification restent valables.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            6. Abus et fraude
          </h2>
          <p>
            Toute tentative de fraude, d&apos;abus ou de contournement des
            règles du programme (création de faux comptes, auto-parrainage,
            spam, etc.) entraînera l&apos;annulation des récompenses concernées
            et pourra conduire à la suspension du compte du parrain.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">7. Contact</h2>
          <p>
            Pour toute question relative au programme de parrainage, vous pouvez
            contacter l&apos;équipe Renford via les canaux de support
            disponibles dans l&apos;application.
          </p>
        </div>
      </section>
    </main>
  );
}
