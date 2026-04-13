import { H2 } from "@/components/ui/typography";

export default function MentionsLegalesPage() {
  return (
    <main className="container mx-auto max-w-4xl py-12 space-y-8">
      <header className="space-y-2">
        <H2>Mentions Légales</H2>
      </header>

      <section className="space-y-4 text-sm leading-6 text-muted-foreground">
        <h2 className="text-xl font-semibold text-foreground">Editeur</h2>
        <p>
          Le site internet https://www.renford.fr est édité par Renford, SAS
          immatriculé sous le numéro 93065704400010 à l'adresse 76 rue Voltaire,
          92150 Suresnes.
        </p>
        <p>
          Adresse électronique :{" "}
          <a
            className="text-secondary underline"
            href="mailto:contact@renford.fr"
            target="_blank"
            rel="noopener noreferrer"
          >
            contact@renford.fr
          </a>
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          Directeur de la publication
        </h2>
        <p>
          Madame Seren ASATEKIN, exerçant la fonction de Directrice Générale de
          RENFORD.
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          Prestataire d'hébergement
        </h2>
        <p>
          Le site internet https://www.renford.fr est hébergé par OVHCloud dont
          le siège social est situé :
        </p>
        <p>SAS au capital de 10 174 560 €</p>
        <p>RCS Lille Métropole 424 761 419 00045</p>
        <p>Code APE 2620Z</p>
        <p>N° TVA : FR 22 424 761 419</p>
        <p>Siège social : 2 rue Kellermann - 59100 Roubaix - France</p>
        <p>
          Site internet :{" "}
          <a
            className="text-secondary underline"
            href="https://www.ovhcloud.com/fr/"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://www.ovhcloud.com/fr/
          </a>
        </p>

        <h2 className="text-xl font-semibold text-foreground">
          Index Égalité professionnelle F/H
        </h2>
        <p>Index Égalité professionnelle hommes/femmes 2024 = 100/100 (1/1)</p>
      </section>
    </main>
  );
}
