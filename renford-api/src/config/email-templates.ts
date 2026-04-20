import { env } from './env';

type BaseEmailTemplateInput = {
  preheader: string;
  title: string;
  intro: string;
  customHtml?: string;
  bulletPoints?: string[];
  ctaLabel?: string;
  ctaUrl?: string;
  closing?: string;
};

const getBrandBaseUrl = () => {
  const domain = env.PLATFORM_URL.trim();
  return domain.startsWith('http://') || domain.startsWith('https://')
    ? domain.replace(/\/$/, '')
    : `https://${domain}`;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const renderBaseEmailTemplate = ({
  preheader,
  title,
  intro,
  customHtml,
  bulletPoints,
  ctaLabel,
  ctaUrl,
  closing,
}: BaseEmailTemplateInput) => {
  const brandBaseUrl = getBrandBaseUrl();
  const logoUrl = `${brandBaseUrl}/logo.png`;

  const listHtml = bulletPoints?.length
    ? `<ul style="margin: 18px 0 0; padding: 0 0 0 20px; color: #334155;">${bulletPoints
        .map((item) => `<li style="margin: 0 0 10px; line-height: 1.5;">${escapeHtml(item)}</li>`)
        .join('')}</ul>`
    : '';

  const ctaHtml =
    ctaLabel && ctaUrl
      ? `<a href="${ctaUrl}" style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:600;margin-top:22px;">${escapeHtml(
          ctaLabel,
        )}</a>`
      : '';

  const closingHtml = closing
    ? `<p style="margin: 22px 0 0; color: #334155; line-height: 1.6;">${escapeHtml(closing)}</p>`
    : '';

  return `
    <!doctype html>
    <html lang="fr">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${escapeHtml(title)}</title>
      </head>
      <body style="margin:0;padding:0;background:#f8fafc;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;color:#0f172a;">
        <span style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</span>
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8fafc;padding:24px 12px;">
          <tr>
            <td align="center">
              <table role="presentation" width="620" cellspacing="0" cellpadding="0" style="max-width:620px;width:100%;background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;">
                <tr>
                  <td style="padding:28px 28px 16px;background:linear-gradient(180deg,#f8fafc 0%,#ffffff 100%);border-bottom:1px solid #f1f5f9;">
                    <img src="${logoUrl}" alt="Renford" style="height:38px;width:auto;display:block;" />
                  </td>
                </tr>
                <tr>
                  <td style="padding:24px 28px 30px;">
                    <h1 style="margin:0 0 14px;font-size:24px;line-height:1.25;color:#0f172a;">${escapeHtml(title)}</h1>
                    <p style="margin:0;color:#334155;line-height:1.7;">${escapeHtml(intro)}</p>
                    ${customHtml ?? ''}
                    ${listHtml}
                    ${ctaHtml}
                    ${closingHtml}
                  </td>
                </tr>
                <tr>
                  <td style="padding:18px 28px;border-top:1px solid #f1f5f9;background:#f8fafc;color:#64748b;font-size:12px;line-height:1.6;">
                    © ${new Date().getFullYear()} Renford · Tous droits réservés<br />
                    Vous recevez cet email dans le cadre de votre activité sur Renford.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};

type FavoriInvitationInput = {
  nomFavori?: string;
  invitationUrl: string;
};

export const getFavoriInvitationEmail = ({ nomFavori, invitationUrl }: FavoriInvitationInput) => {
  const recipient = nomFavori?.trim() ? `Bonjour ${nomFavori.trim()},` : 'Bonjour,';

  const html = renderBaseEmailTemplate({
    preheader: 'Vous avez été invité(e) à rejoindre Renford.',
    title: 'Invitation à rejoindre Renford',
    intro: `${recipient} Un établissement partenaire vous invite à créer votre profil Renford pour accéder à des missions adaptées à vos expertises.`,
    bulletPoints: [
      'Créez votre compte en quelques minutes.',
      'Complétez votre profil pour recevoir les meilleures opportunités.',
      'Commencez à collaborer rapidement avec des établissements partenaires.',
    ],
    ctaLabel: 'Rejoindre Renford',
    ctaUrl: invitationUrl,
    closing: "À très vite, l'équipe Renford.",
  });

  const text = `${recipient}\n\nVous avez été invité(e) à rejoindre Renford.\nCréez votre compte ici : ${invitationUrl}\n\nÀ très vite,\nL'équipe Renford`;

  return {
    subject: 'Invitation à rejoindre Renford',
    html,
    text,
  };
};

type WelcomeEtablissementInput = {
  prenomNom: string;
  raisonSociale: string;
  dashboardUrl: string;
};

export const getWelcomeEtablissementEmail = ({
  prenomNom,
  raisonSociale,
  dashboardUrl,
}: WelcomeEtablissementInput) => {
  const firstName = prenomNom.trim() || '<Prénom>';
  const html = renderBaseEmailTemplate({
    preheader: 'Bienvenue sur Renford - Commencez votre parcours dès maintenant !',
    title: 'Bienvenue sur Renford - Commencez votre parcours dès maintenant !',
    intro: `Bonjour ${firstName},\nNous sommes ravis de vous accueillir au sein de Renford, votre nouvel allié dans la recherche de talents exceptionnels pour des missions à la demande.`,
    customHtml: `<p style="margin:14px 0 0;color:#334155;line-height:1.7;">Pour tirer le meilleur parti de notre plateforme :</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;"><strong>1. Mettez à jour votre profil</strong> - Assurez-vous que vos informations sont à jour pour attirer les meilleurs Renfords ;</p>
      <p style="margin:8px 0 0;color:#334155;line-height:1.7;"><strong>2. Planifiez votre prochaine mission</strong> - Envoyez-nous votre première demande de mission ;</p>
      <p style="margin:8px 0 0;color:#334155;line-height:1.7;"><strong>3. Suivez renford_officiel sur Instagram</strong> pour vous tenir au courant des dernières actualités sportives.</p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">Votre réussite est notre priorité. Pour toute question ou besoin d'assistance, n'hésitez pas à contacter notre support dédié.</p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">Prêt à débuter ? Connectez-vous et lancez votre première mission <a href="${dashboardUrl}">ici</a>.</p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">Au plaisir de contribuer au succès de ${escapeHtml(raisonSociale || '<Raison sociale>')}</p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">À très bientôt sur la plateforme,<br/><em>L'équipe Renford</em></p>`,
  });

  const text = `Bonjour ${firstName},

Nous sommes ravis de vous accueillir au sein de Renford, votre nouvel allié dans la recherche de talents exceptionnels pour des missions à la demande.

Pour tirer le meilleur parti de notre plateforme :
1. Mettez à jour votre profil - Assurez-vous que vos informations sont à jour pour attirer les meilleurs Renfords ;
2. Planifiez votre prochaine mission - Envoyez-nous votre première demande de mission ;
3. Suivez renford_officiel sur Instagram pour vous tenir au courant des dernières actualités sportives.

Votre réussite est notre priorité. Pour toute question ou besoin d'assistance, n'hésitez pas à contacter notre support dédié.
Prêt à débuter ? Connectez-vous et lancez votre première mission ici : ${dashboardUrl}

Au plaisir de contribuer au succès de ${raisonSociale || '<Raison sociale>'}
À très bientôt sur la plateforme,
L'équipe Renford`;

  return {
    subject: 'Bienvenue sur Renford - Commencez votre parcours dès maintenant !',
    html,
    text,
  };
};

type WelcomeRenfordInput = {
  prenom: string;
  dashboardUrl: string;
};

export const getWelcomeRenfordEmail = ({ prenom, dashboardUrl }: WelcomeRenfordInput) => {
  const firstName = prenom.trim() || '<Prénom>';
  const html = renderBaseEmailTemplate({
    preheader: 'Bienvenue dans la communauté Renford !',
    title: 'Bienvenue dans la communauté Renford !',
    intro: `Bonjour ${firstName},\nFélicitations et bienvenue chez Renford ! Tu fais désormais partie d'une communauté dynamique qui révolutionne la façon de se connecter dans le sport.`,
    customHtml: `<p style="margin:14px 0 0;color:#334155;line-height:1.7;">Voici trois étapes pour démarrer ton expérience :</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;"><strong>1. Renseigne tes disponibilités</strong> pour recevoir tes premières demandes de missions ;</p>
      <p style="margin:8px 0 0;color:#334155;line-height:1.7;"><strong>2. Personnalise ton profil</strong> pour mettre en avant tes compétences uniques ;</p>
      <p style="margin:8px 0 0;color:#334155;line-height:1.7;"><strong>3. Rejoins une communauté soudée</strong> en suivant notre compte Instagram <strong>renford_officiel</strong>.</p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">Prêt à de nouvelles aventures entrepreneuriales avec <strong>Renford</strong> ? Connecte-toi <a href="${dashboardUrl}">ici</a>.</p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">À très bientôt sur la plateforme,<br/><em>L'équipe Renford</em></p>`,
  });

  const text = `Bonjour ${firstName},

Félicitations et bienvenue chez Renford ! Tu fais désormais partie d'une communauté dynamique qui révolutionne la façon de se connecter dans le sport.

Voici trois étapes pour démarrer ton expérience :
1. Renseigne tes disponibilités pour recevoir tes premières demandes de missions ;
2. Personnalise ton profil pour mettre en avant tes compétences uniques ;
3. Rejoins une communauté soudée en suivant notre compte Instagram renford_officiel.

Prêt à de nouvelles aventures entrepreneuriales avec Renford ? Connecte-toi ici : ${dashboardUrl}

À très bientôt sur la plateforme,
L'équipe Renford`;

  return {
    subject: 'Bienvenue dans la communauté Renford !',
    html,
    text,
  };
};

type CodeEmailInput = {
  title: string;
  intro: string;
  code: string;
  subject: string;
};

const getCodeEmailTemplate = ({ title, intro, code, subject }: CodeEmailInput) => {
  const codeHtml = `
    <div style="margin:20px 0 0;padding:18px 16px;border-radius:14px;background:#f8fafc;border:1px dashed #94a3b8;text-align:center;">
      <div style="font-size:12px;line-height:1.2;color:#475569;font-weight:600;text-transform:uppercase;letter-spacing:1.2px;margin-bottom:8px;">Votre code</div>
      <div style="font-size:42px;line-height:1;font-weight:800;letter-spacing:8px;color:#0f172a;">${escapeHtml(code)}</div>
    </div>
  `;

  const html = renderBaseEmailTemplate({
    preheader: `${title} - code temporaire`,
    title,
    intro,
    customHtml: codeHtml,
    bulletPoints: [
      'Ce code expire dans 15 minutes.',
      "Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.",
    ],
  });

  const text = `${title}\n\n${intro}\nCode : ${code}\nCe code expire dans 15 minutes.`;

  return {
    subject,
    html,
    text,
  };
};

export const getSignupVerificationCodeEmail = (code: string) =>
  getCodeEmailTemplate({
    title: 'Vérification de votre compte',
    intro: 'Bienvenue sur Renford. Utilisez ce code pour vérifier votre adresse email :',
    code,
    subject: 'RENFORD: Vérification de votre compte',
  });

export const getResetPasswordCodeEmail = (code: string) =>
  getCodeEmailTemplate({
    title: 'Réinitialisation de mot de passe',
    intro: 'Utilisez ce code pour définir un nouveau mot de passe :',
    code,
    subject: 'RENFORD: Réinitialisation de mot de passe',
  });

export const getNewVerificationCodeEmail = (code: string) =>
  getCodeEmailTemplate({
    title: 'Nouveau code de vérification',
    intro: 'Voici votre nouveau code de vérification :',
    code,
    subject: 'RENFORD: Nouveau code de vérification',
  });

type MissionDemandeConfirmeeFlexEmailInput = {
  prenomEtablissement?: string;
  posteDemande: string;
  plageMission: string;
};

export const getMissionDemandeConfirmeeFlexEmail = ({
  prenomEtablissement,
  posteDemande,
  plageMission,
}: MissionDemandeConfirmeeFlexEmailInput) => {
  const firstName = prenomEtablissement?.trim() || '<Prénom Etablissement>';

  const html = renderBaseEmailTemplate({
    preheader: 'Confirmation de votre demande de mission FLEX',
    title: 'Confirmation de votre demande de mission FLEX',
    intro: `Bonjour ${firstName},\nNous vous remercions pour votre demande de mission et pour la confiance que vous accordez à Renford.`,
    customHtml: `<p style="margin:14px 0 0;color:#334155;line-height:1.7;">Récapitulatif de votre demande :</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;"><strong>Poste(s) demandé(s)</strong> : ${escapeHtml(posteDemande)}</p>
      <p style="margin:8px 0 0;color:#334155;line-height:1.7;"><strong>Plage de la mission</strong> : ${escapeHtml(plageMission)}</p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">🕒 Votre demande est en cours de traitement et nous faisons le nécessaire pour vous proposer le profil le plus adapté. Vous serez informé très prochainement des avancées concernant la sélection des Renfords.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">💬 <strong>Une question ?</strong> Notre équipe est à votre disposition pour vous accompagner et répondre à vos interrogations.</p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">Merci encore pour votre confiance, et à très bientôt !<br/>L'équipe Renford</p>`,
  });

  const text = `Bonjour ${firstName},

Nous vous remercions pour votre demande de mission et pour la confiance que vous accordez à Renford.

Récapitulatif de votre demande :
Poste(s) demandé(s) : ${posteDemande}
Plage de la mission : ${plageMission}

Votre demande est en cours de traitement et nous faisons le nécessaire pour vous proposer le profil le plus adapté. Vous serez informé très prochainement des avancées concernant la sélection des Renfords.

Une question ? Notre équipe est à votre disposition pour vous accompagner et répondre à vos interrogations.

Merci encore pour votre confiance, et à très bientôt !
L'équipe Renford`;

  return {
    subject: 'Confirmation de votre demande de mission FLEX',
    html,
    text,
  };
};

type MissionDemandeConfirmeeCoachEmailInput = {
  prenomEtablissement?: string;
  posteDemande: string;
  plageMission: string;
  tarifSouhaite: string;
};

export const getMissionDemandeConfirmeeCoachEmail = ({
  prenomEtablissement,
  posteDemande,
  plageMission,
  tarifSouhaite,
}: MissionDemandeConfirmeeCoachEmailInput) => {
  const firstName = prenomEtablissement?.trim() || '<Prénom Etablissement>';

  const html = renderBaseEmailTemplate({
    preheader: 'Confirmation de votre demande de mission COACH',
    title: 'Confirmation de votre demande de mission COACH',
    intro: `Bonjour ${firstName},\nNous vous remercions pour votre demande de mission et pour la confiance que vous accordez à Renford.`,
    customHtml: `<p style="margin:14px 0 0;color:#334155;line-height:1.7;">Récapitulatif de votre demande :</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;"><strong>- Poste(s) demandé(s)</strong> : ${escapeHtml(posteDemande)}</p>
      <p style="margin:8px 0 0;color:#334155;line-height:1.7;"><strong>- Plage de la mission</strong> : ${escapeHtml(plageMission)}</p>
      <p style="margin:8px 0 0;color:#334155;line-height:1.7;"><strong>- Tarification</strong> : ${escapeHtml(tarifSouhaite)}</p>
      <p style="margin:8px 0 0;color:#334155;line-height:1.7;"><strong>- Coût du service Renford COACH</strong> (prix unique) : 375 € HT.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">💡 Ce que cela inclut : La recherche du profil idéal et qualifié, la vérification des informations administratives ainsi que la mise en place d’un contrat de prestation de services.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">🚀 Prochaine étape : Nous vous recontacterons dans les plus brefs délais avec une première sélection de profils correspondant à vos critères.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">💬 Des questions ? Notre équipe est disponible pour vous accompagner : vous pouvez nous répondre directement à cet e-mail ou nous contacter via contact@renford.fr.</p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">Merci encore pour votre confiance, on revient vers vous très vite !<br/>L'équipe Renford</p>`,
  });

  const text = `Bonjour ${firstName},

Nous vous remercions pour votre demande de mission et pour la confiance que vous accordez à Renford.

Récapitulatif de votre demande :
- Poste(s) demandé(s) : ${posteDemande}
- Plage de la mission : ${plageMission}
- Tarification : ${tarifSouhaite}
- Coût du service Renford COACH (prix unique) : 375 € HT.

Ce que cela inclut : La recherche du profil idéal et qualifié, la vérification des informations administratives ainsi que la mise en place d’un contrat de prestation de services.
Prochaine étape : Nous vous recontacterons dans les plus brefs délais avec une première sélection de profils correspondant à vos critères.
Des questions ? Notre équipe est disponible pour vous accompagner : vous pouvez nous répondre directement à cet e-mail ou nous contacter via contact@renford.fr.

Merci encore pour votre confiance, on revient vers vous très vite !
L'équipe Renford`;

  return {
    subject: 'Confirmation de votre demande de mission COACH',
    html,
    text,
  };
};

type IncompleteRenfordProfileReminderInput = {
  prenom: string;
  dashboardUrl: string;
};

export const getIncompleteRenfordProfileReminderEmail = ({
  prenom,
  dashboardUrl,
}: IncompleteRenfordProfileReminderInput) => {
  const firstName = prenom.trim() || '<Prénom>';

  const html = renderBaseEmailTemplate({
    preheader: 'Finalise ton profil pour recevoir des missions !',
    title: 'Finalise ton profil pour recevoir des missions !',
    intro: `Bonjour ${firstName},\nMerci de t’être inscrit(e) sur Renford ! 🎉`,
    customHtml: `<p style="margin:14px 0 0;color:#334155;line-height:1.7;">Nous avons remarqué que certaines informations de ton profil ne sont pas encore complètes.</p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">👉 <strong>Pourquoi compléter ton profil ?</strong></p>
      <p style="margin:8px 0 0;color:#334155;line-height:1.7;">Plus tu renseignes ton expérience, tes compétences et tes préférences, plus tu seras <strong>mis(e) en relation avec des missions</strong> qui te correspondent parfaitement. Cela t’aide non seulement à trouver des opportunités plus rapidement, mais aussi à te <strong>démarquer auprès des établissements sportifs</strong> qui cherchent des passionnés comme toi !</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">Ça ne prend que quelques minutes pour faire toute la différence dans ta recherche de missions.</p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;"><strong>Clique ici pour compléter ton profil :</strong> <a href="${dashboardUrl}">renford.fr</a>.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">Si tu as des questions ou si tu as besoin d’aide, notre équipe est là pour t’accompagner à chaque étape.</p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">À très vite !<br/><em>L'équipe Renford</em></p>`,
  });

  const text = `Bonjour ${firstName},

Merci de t’être inscrit(e) sur Renford !
Nous avons remarqué que certaines informations de ton profil ne sont pas encore complètes.

Pourquoi compléter ton profil ?
Plus tu renseignes ton expérience, tes compétences et tes préférences, plus tu seras mis(e) en relation avec des missions qui te correspondent parfaitement. Cela t’aide non seulement à trouver des opportunités plus rapidement, mais aussi à te démarquer auprès des établissements sportifs qui cherchent des passionnés comme toi.

Ça ne prend que quelques minutes pour faire toute la différence dans ta recherche de missions.
Clique ici pour compléter ton profil : ${dashboardUrl}

Si tu as des questions ou si tu as besoin d’aide, notre équipe est là pour t’accompagner à chaque étape.

À très vite !
L'équipe Renford`;

  return {
    subject: 'Finalise ton profil pour recevoir des missions',
    html,
    text,
  };
};

type RenfordTrouveFlexEmailInput = {
  prenomEtablissement?: string;
  prenomRenford: string;
  profilRenfordResume: string;
  espaceCompteUrl: string;
  paiementUrl: string;
};

export const getRenfordTrouveFlexEmail = ({
  prenomEtablissement,
  prenomRenford,
  profilRenfordResume,
  espaceCompteUrl,
  paiementUrl,
}: RenfordTrouveFlexEmailInput) => {
  const firstName = prenomEtablissement?.trim() || '<Prenom>';

  const html = renderBaseEmailTemplate({
    preheader: 'Profil trouvé - Votre mission Renford FLEX',
    title: '✅ Profil trouvé - Votre mission Renford FLEX',
    intro: `Bonjour ${firstName},\nBonne nouvelle : nous avons trouvé le bon profil pour votre mission Renford FLEX !`,
    customHtml: `<p style="margin:14px 0 0;color:#334155;line-height:1.7;">👉 ${escapeHtml(prenomRenford)} a accepté d’intervenir. ${escapeHtml(profilRenfordResume)}</p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">📲 Consultez les détails de la mission et le profil du coach :</p>
      <p style="margin:8px 0 0;color:#334155;line-height:1.7;">👉 <a href="${espaceCompteUrl}">Accéder à mon espace</a>.</p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">Vous y trouverez l’ensemble des informations utiles dans l’onglet “Mes Missions”.</p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">💳 <strong>Prochaine étape : validation de la mission</strong></p>
      <p style="margin:8px 0 0;color:#334155;line-height:1.7;">Pour confirmer et permettre la génération automatique du contrat et de la facture :</p>
      <p style="margin:8px 0 0;color:#334155;line-height:1.7;">- soit vous validez directement la mission depuis votre espace,</p>
      <p style="margin:4px 0 0;color:#334155;line-height:1.7;">- soit vous répondez simplement à ce mail,</p>
      <p style="margin:4px 0 0;color:#334155;line-height:1.7;">- soit vous procédez au paiement via ce lien sécurisé : 👉 <a href="${paiementUrl}">Lien de paiement</a></p>
      <p style="margin:8px 0 0;color:#334155;line-height:1.7;">(Le paiement déclenchera l’envoi de la facture + le contrat à signer électroniquement)</p>
      <p style="margin:8px 0 0;color:#334155;line-height:1.7;">Note : Le Renford ne sera rémunéré qu’à la fin de la mission, après votre validation via un court questionnaire de satisfaction.</p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">Nous restons bien sûr disponibles si vous avez la moindre question.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">Sportivement,<br/>L'équipe Renford</p>`,
  });

  const text = `Bonjour ${firstName},

Bonne nouvelle : nous avons trouvé le bon profil pour votre mission Renford FLEX !
👉 ${prenomRenford} a accepté d’intervenir. ${profilRenfordResume}

Consultez les détails de la mission et le profil du coach : ${espaceCompteUrl}
Vous y trouverez l’ensemble des informations utiles dans l’onglet "Mes Missions".

Prochaine étape : validation de la mission
Pour confirmer et permettre la génération automatique du contrat et de la facture :
- soit vous validez directement la mission depuis votre espace,
- soit vous répondez simplement à ce mail,
- soit vous procédez au paiement via ce lien sécurisé : ${paiementUrl}
(Le paiement déclenchera l’envoi de la facture + le contrat à signer électroniquement)

Note : Le Renford ne sera rémunéré qu’à la fin de la mission, après votre validation via un court questionnaire de satisfaction.
Nous restons bien sûr disponibles si vous avez la moindre question.

Sportivement,
L'équipe Renford`;

  return {
    subject: '✅ Profil trouvé - Votre mission Renford FLEX',
    html,
    text,
  };
};

type RenfordTrouveCoachEmailInput = {
  prenomEtablissement?: string;
  typeMission: string;
  nombreProfilsProposes: number;
  profilsSummary: string[];
  espaceRenfordUrl: string;
  lienPaiementUrl: string;
};

export const getRenfordTrouveCoachEmail = ({
  prenomEtablissement,
  typeMission,
  nombreProfilsProposes,
  profilsSummary,
  espaceRenfordUrl,
  lienPaiementUrl,
}: RenfordTrouveCoachEmailInput) => {
  const firstName = prenomEtablissement?.trim() || '<Prénom Etablissement>';
  const profilsHtml = profilsSummary
    .map(
      (profil) =>
        `<li style="margin:0 0 8px;color:#334155;line-height:1.7;">${escapeHtml(profil)}</li>`,
    )
    .join('');

  const html = renderBaseEmailTemplate({
    preheader: 'Renford - Votre sélection personnalisée pour votre besoin',
    title: 'Renford - Votre sélection personnalisée pour votre besoin',
    intro: `Bonjour ${firstName},`,
    customHtml: `<p style="margin:14px 0 0;color:#334155;line-height:1.7;">🎉 Suite à votre besoin en ${escapeHtml(typeMission)}, nous avons le plaisir de vous proposer ${escapeHtml(String(nombreProfilsProposes))} profils motivés et disponibles :</p>
      <ul style="margin:10px 0 0;padding:0 0 0 20px;">${profilsHtml}</ul>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">👉 Vous pouvez consulter leurs profils complets directement depuis votre <a href="${espaceRenfordUrl}">espace Renford</a>.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">👉 Afin d’accéder à leurs coordonnées et programmer une visio de présentation, nous vous invitons à procéder au règlement via ce lien : <a href="${lienPaiementUrl}">Procéder au paiement</a>.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">Une fois le paiement confirmé, nous organiserons la rencontre avec les coachs sélectionnés et pourrons affiner ensemble le cadrage de la mission.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">Petite question pratique : le centre dispose-t-il de matériel (soft ball, élastiques, haltères, etc.) ? Cette information est souvent utile aux intervenants pour adapter leurs séances.</p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">Sportivement,<br/>L'équipe Renford</p>`,
  });

  const text = `Bonjour ${firstName},

Suite à votre besoin en ${typeMission}, nous avons le plaisir de vous proposer ${nombreProfilsProposes} profils motivés et disponibles :
${profilsSummary.map((profil) => `- ${profil}`).join('\n')}

Vous pouvez consulter leurs profils complets directement depuis votre espace Renford : ${espaceRenfordUrl}
Afin d’accéder à leurs coordonnées et programmer une visio de présentation, nous vous invitons à procéder au règlement via ce lien : ${lienPaiementUrl}

Une fois le paiement confirmé, nous organiserons la rencontre avec les coachs sélectionnés et pourrons affiner ensemble le cadrage de la mission.
Petite question pratique : le centre dispose-t-il de matériel (soft ball, élastiques, haltères, etc.) ? Cette information est souvent utile aux intervenants pour adapter leurs séances.

Sportivement,
L'équipe Renford`;

  return {
    subject: 'Renford - Votre sélection personnalisée pour votre besoin',
    html,
    text,
  };
};

type NewMissionRenfordEmailInput = {
  prenomRenford?: string;
  typeMission: string;
  lieu: string;
  publicMission?: string;
  dateMission: string;
  heureMission: string;
  remuneration: string;
  missionUrl: string;
};

export const getNewMissionRenfordEmail = ({
  prenomRenford,
  typeMission,
  lieu,
  publicMission,
  dateMission,
  heureMission,
  remuneration,
  missionUrl,
}: NewMissionRenfordEmailInput) => {
  const firstName = prenomRenford?.trim() || '<Prénom>';
  const publicLine = publicMission
    ? `<p style="margin:8px 0 0;color:#334155;line-height:1.7;">• Public : ${escapeHtml(publicMission)}</p>`
    : '';

  const html = renderBaseEmailTemplate({
    preheader: `Nouvelle mission disponible – ${typeMission}`,
    title: `Nouvelle mission disponible – ${typeMission}`,
    intro: `Bonjour ${firstName},\nBonne nouvelle 🎉 Une mission qui correspond parfaitement à ton profil vient d’être publiée sur Renford.`,
    customHtml: `<p style="margin:14px 0 0;color:#334155;line-height:1.7;">Voici les détails :</p>
      <p style="margin:8px 0 0;color:#334155;line-height:1.7;">• Mission : ${escapeHtml(typeMission)}</p>
      <p style="margin:8px 0 0;color:#334155;line-height:1.7;">• Lieu : ${escapeHtml(lieu)}</p>
      ${publicLine}
      <p style="margin:8px 0 0;color:#334155;line-height:1.7;">• Date : ${escapeHtml(dateMission)}</p>
      <p style="margin:8px 0 0;color:#334155;line-height:1.7;">• Heure : ${escapeHtml(heureMission)}</p>
      <p style="margin:8px 0 0;color:#334155;line-height:1.7;">• Rémunération : ${escapeHtml(remuneration)}</p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">Si cette mission t’intéresse et que tu es disponible :</p>
      <p style="margin:8px 0 0;color:#334155;line-height:1.7;">➡️ Connecte-toi à ton espace pour consulter la demande de mission : <a href="${missionUrl}">Voir la mission</a></p>
      <p style="margin:8px 0 0;color:#334155;line-height:1.7;">➡️ Nous t’avons également envoyé un SMS : tu peux y répondre directement par “Oui” ou “Non” ;</p>
      <p style="margin:8px 0 0;color:#334155;line-height:1.7;">Besoin de plus d’infos ? Tu peux nous joindre au 06 64 39 25 28 (numéro non surtaxé).</p>
      <p style="margin:8px 0 0;color:#334155;line-height:1.7;">⏳ Une réponse rapide serait idéale afin que nous puissions confirmer la mission — premier à répondre, premier servi.</p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">On a hâte de te voir briller sur cette nouvelle opportunité !</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">Bien à toi,<br/>L'équipe Renford</p>`,
  });

  const text = `Bonjour ${firstName},

Bonne nouvelle 🎉
Une mission qui correspond parfaitement à ton profil vient d’être publiée sur Renford.

Voici les détails :
- Mission : ${typeMission}
- Lieu : ${lieu}
${publicMission ? `- Public : ${publicMission}\n` : ''}- Date : ${dateMission}
- Heure : ${heureMission}
- Rémunération : ${remuneration}

Si cette mission t’intéresse et que tu es disponible :
➡️ Connecte-toi à ton espace : ${missionUrl}
➡️ Nous t’avons également envoyé un SMS : tu peux y répondre directement par “Oui” ou “Non” ;

Besoin de plus d’infos ? Tu peux nous joindre au 06 64 39 25 28 (numéro non surtaxé).
⏳ Une réponse rapide serait idéale afin que nous puissions confirmer la mission — premier à répondre, premier servi.

On a hâte de te voir briller sur cette nouvelle opportunité !
Bien à toi,
L'équipe Renford`;

  return {
    subject: `Nouvelle mission disponible – ${typeMission}`,
    html,
    text,
  };
};

type ConfirmationMissionRenfordEmailInput = {
  prenomRenford?: string;
  typeMission: string;
  confirmationUrl: string;
  includeCoachInSubject: boolean;
};

export const getConfirmationMissionRenfordEmail = ({
  prenomRenford,
  typeMission,
  confirmationUrl,
  includeCoachInSubject,
}: ConfirmationMissionRenfordEmailInput) => {
  const firstName = prenomRenford?.trim() || '<Prénom Renford>';
  const subject = includeCoachInSubject
    ? 'Confirmation de ta prochaine mission avec Renford Coach ✅'
    : 'Confirmation de ta prochaine mission avec Renford ✅';

  const html = renderBaseEmailTemplate({
    preheader: subject,
    title: subject,
    intro: `Hello ${firstName},\nMerci encore pour nos échanges ! Bonne nouvelle, l'établissement a sélectionné ton profil pour la mission ${typeMission}.`,
    customHtml: `<p style="margin:14px 0 0;color:#334155;line-height:1.7;"><strong>Pour valider définitivement ta participation, il te suffit de cliquer <a href="${confirmationUrl}">ici</a>.</strong></p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">Une fois la mission acceptée, <strong>tes coordonnées seront communiquées à l'établissement afin que vous puissiez vous organiser</strong> ensemble.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">📞 Un imprévu, une question ? Tu peux nous joindre directement au 06 64 39 26 28.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">Tu peux aussi retrouver tous les détails dans ton espace personnel sur Renford.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">Merci pour ta confiance 🙏</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">Hâte de te voir intervenir sur cette mission avec ton professionnalisme et ta bonne humeur 💪</p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">Bien à toi,<br/>L'équipe Renford</p>`,
  });

  const text = `Hello ${firstName},

Merci encore pour nos échanges ! Bonne nouvelle, l'établissement a sélectionné ton profil pour la mission ${typeMission}.
Pour valider définitivement ta participation, il te suffit de cliquer ici : ${confirmationUrl}

Une fois la mission acceptée, tes coordonnées seront communiquées à l'établissement afin que vous puissiez vous organiser ensemble.
📞 Un imprévu, une question ? Tu peux nous joindre directement au 06 64 39 26 28.
Tu peux aussi retrouver tous les détails dans ton espace personnel sur Renford.

Merci pour ta confiance 🙏
Hâte de te voir intervenir sur cette mission avec ton professionnalisme et ta bonne humeur 💪

Bien à toi,
L'équipe Renford`;

  return {
    subject,
    html,
    text,
  };
};

type VisioInvitationRenfordInput = {
  prenom: string;
  missionDescription: string;
  etablissementNom: string;
  lienVisio: string;
  missionUrl: string;
};

export const getVisioInvitationRenfordEmail = ({
  prenom,
  missionDescription,
  etablissementNom,
  lienVisio,
  missionUrl,
}: VisioInvitationRenfordInput) => {
  const firstName = prenom.trim() || 'Renford';

  const html = renderBaseEmailTemplate({
    preheader: 'Un établissement vous invite à une visioconférence avant la mission.',
    title: 'Invitation à une visioconférence',
    intro: `Bonjour ${firstName},\nL'établissement ${escapeHtml(etablissementNom)} souhaite vous rencontrer en visioconférence avant le début de votre mission.`,
    customHtml: `<p style="margin:14px 0 0;color:#334155;line-height:1.7;"><strong>Mission :</strong> ${escapeHtml(missionDescription)}</p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">Rejoignez l'appel en cliquant sur le bouton ci-dessous. Aucune installation n'est nécessaire, la visioconférence s'ouvre directement dans votre navigateur.</p>`,
    ctaLabel: 'Rejoindre la visio',
    ctaUrl: lienVisio,
    closing: `Vous pouvez également retrouver ce lien sur la page de la mission dans votre espace Renford.`,
  });

  const text = `Bonjour ${firstName},\n\nL'établissement ${etablissementNom} vous invite à une visioconférence pour la mission : ${missionDescription}.\n\nRejoignez la visio ici : ${lienVisio}\n\nVous pouvez aussi accéder à la mission ici : ${missionUrl}\n\nÀ bientôt,\nL'équipe Renford`;

  return {
    subject: 'Renford – Invitation à une visioconférence',
    html,
    text,
  };
};

type SignatureConfirmationInput = {
  prenom: string;
  nomSignataire: string;
  roleSignataire: string;
  missionDescription: string;
  dateSignature: string;
  lienCgu: string;
};

export const getSignatureConfirmationEmail = ({
  prenom,
  nomSignataire,
  roleSignataire,
  missionDescription,
  dateSignature,
  lienCgu,
}: SignatureConfirmationInput) => {
  const firstName = prenom.trim() || '<Prénom>';
  const subject = 'Confirmation de signature – Mission Renford';

  const html = renderBaseEmailTemplate({
    preheader: 'Votre signature a bien été enregistrée.',
    title: 'Signature confirmée',
    intro: `Bonjour ${firstName},`,
    customHtml: `
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">Votre signature électronique a bien été enregistrée pour la mission suivante :</p>
      <table role="presentation" cellspacing="0" cellpadding="0" style="margin:16px 0;width:100%;">
        <tr><td style="padding:6px 0;color:#64748b;width:140px;">Mission</td><td style="padding:6px 0;color:#0f172a;font-weight:600;">${escapeHtml(missionDescription)}</td></tr>
        <tr><td style="padding:6px 0;color:#64748b;">Signataire</td><td style="padding:6px 0;color:#0f172a;">${escapeHtml(nomSignataire)} (${escapeHtml(roleSignataire)})</td></tr>
        <tr><td style="padding:6px 0;color:#64748b;">Date</td><td style="padding:6px 0;color:#0f172a;">${escapeHtml(dateSignature)}</td></tr>
      </table>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">En signant, vous avez accepté les <a href="${lienCgu}" style="color:#2563eb;text-decoration:underline;">Conditions Générales d'Utilisation</a> en vigueur.</p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">Vous pouvez retrouver tous les détails de cette mission dans votre espace personnel.</p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">Cordialement,<br/><em>L'équipe Renford</em></p>`,
  });

  const text = `Bonjour ${firstName},

Votre signature électronique a bien été enregistrée pour la mission suivante :

Mission : ${missionDescription}
Signataire : ${nomSignataire} (${roleSignataire})
Date : ${dateSignature}

En signant, vous avez accepté les Conditions Générales d'Utilisation en vigueur : ${lienCgu}

Vous pouvez retrouver tous les détails de cette mission dans votre espace personnel.

Cordialement,
L'équipe Renford`;

  return {
    subject,
    html,
    text,
  };
};

// ============================================================================
// Compte supprimé – Renfords
// ============================================================================

export const getAccountDeletedEmail = () => {
  const html = renderBaseEmailTemplate({
    preheader: 'Votre compte Renford a été supprimé.',
    title: 'À bientôt, peut-être ? 💫',
    intro: 'Bonjour,',
    customHtml: `<p style="margin:14px 0 0;color:#334155;line-height:1.7;">Nous avons bien pris en compte la suppression de votre compte, et vos données ont été supprimées conformément à notre politique de confidentialité.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">On voulait simplement vous remercier d'avoir fait un bout de chemin avec nous.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">Chaque utilisateur compte pour nous, et votre présence a fait partie de notre aventure.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">Si jamais l'envie vous reprend, vous serez toujours le/la bienvenu(e) chez nous.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">Et si vous souhaitez partager ce qui vous a poussé à partir, nous serions ravis d'écouter votre retour — cela nous aide à nous améliorer.</p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">🌿 Prenez soin de vous,</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;"><em>L'équipe Renford</em></p>`,
  });

  const text = `Bonjour,

Nous avons bien pris en compte la suppression de votre compte, et vos données ont été supprimées conformément à notre politique de confidentialité.
On voulait simplement vous remercier d'avoir fait un bout de chemin avec nous.
Chaque utilisateur compte pour nous, et votre présence a fait partie de notre aventure.
Si jamais l'envie vous reprend, vous serez toujours le/la bienvenu(e) chez nous.
Et si vous souhaitez partager ce qui vous a poussé à partir, nous serions ravis d'écouter votre retour — cela nous aide à nous améliorer.

Prenez soin de vous,
L'équipe Renford`;

  return {
    subject: 'À bientôt, peut-être ? 💫',
    html,
    text,
  };
};

// ============================================================================
// Fin de mission Renford – COACH
// ============================================================================

type FinMissionRenfordCoachInput = {
  prenomRenford: string;
  raisonSociale: string;
  espaceUrl: string;
};

export const getFinMissionRenfordCoachEmail = ({
  prenomRenford,
  raisonSociale,
  espaceUrl,
}: FinMissionRenfordCoachInput) => {
  const firstName = prenomRenford.trim() || '<Prénom Renford>';

  const html = renderBaseEmailTemplate({
    preheader: 'Merci pour ta mission Renford Coach !',
    title: 'Merci !',
    intro: `Bonjour ${firstName},`,
    customHtml: `<p style="margin:14px 0 0;color:#334155;line-height:1.7;"><strong>Merci encore pour ta motivation et pour ta disponibilité dans le cadre de la mission Renford Coach avec ${escapeHtml(raisonSociale)} !</strong></p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">✅ La mise en relation est désormais finalisée. Tu pourras retrouver dans ton <a href="${espaceUrl}">espace Renford</a> le contrat de mise en relation. Dans le cadre de cette mission longue durée, toute la partie administrative (contrat, facturation, organisation) se fera désormais directement avec l'établissement.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">Et si tu as 2 minutes, on serait ravis d'avoir ton retour :</p>
      <p style="margin:8px 0 0;color:#334155;line-height:1.7;"><strong>👉 Partage ton ressenti via ce court formulaire</strong> : <a href="https://tally.so/r/mBRMGN">Formulaire Mission</a></p>
      <p style="margin:8px 0 0;color:#334155;line-height:1.7;"><strong>👉 Laisse-nous un avis sur notre fiche Google</strong></p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">Merci encore pour ton sérieux et ton implication et très belle collaboration à venir avec ${escapeHtml(raisonSociale)} !</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">À très bientôt pour de nouvelles missions,<br/><em>L'équipe Renford</em></p>`,
  });

  const text = `Bonjour ${firstName},

Merci encore pour ta motivation et pour ta disponibilité dans le cadre de la mission Renford Coach avec ${raisonSociale} !
La mise en relation est désormais finalisée. Tu pourras retrouver dans ton espace Renford le contrat de mise en relation.

Et si tu as 2 minutes, on serait ravis d'avoir ton retour :
👉 Partage ton ressenti via ce court formulaire : https://tally.so/r/mBRMGN
👉 Laisse-nous un avis sur notre fiche Google

Merci encore pour ton sérieux et ton implication !
À très bientôt pour de nouvelles missions,
L'équipe Renford`;

  return {
    subject: 'Merci !',
    html,
    text,
  };
};

// ============================================================================
// Fin de mission Renford – FLEX
// ============================================================================

type FinMissionRenfordFlexInput = {
  prenomRenford: string;
  raisonSociale: string;
  espaceUrl: string;
};

export const getFinMissionRenfordFlexEmail = ({
  prenomRenford,
  raisonSociale,
  espaceUrl,
}: FinMissionRenfordFlexInput) => {
  const firstName = prenomRenford.trim() || '<Prénom Renford>';

  const html = renderBaseEmailTemplate({
    preheader: 'Merci pour ta mission Renford FLEX !',
    title: 'Merci !',
    intro: `Bonjour ${firstName},`,
    customHtml: `<p style="margin:14px 0 0;color:#334155;line-height:1.7;"><strong>Un grand merci pour ton implication et ton professionnalisme lors de ta mission FLEX avec ${escapeHtml(raisonSociale)} 🙌</strong></p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">Tu peux retrouver ta facture et ton attestation de mission directement dans ton <a href="${espaceUrl}">espace Renford</a>.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">💸 Le virement sera effectué sur ton compte dans les prochaines heures (jour ouvré). N'hésite pas à nous prévenir si tu ne vois rien apparaître d'ici là.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">💬 On aimerait beaucoup avoir ton retour :</p>
      <p style="margin:8px 0 0;color:#334155;line-height:1.7;"><strong>👉 Partage ton ressenti via ce court formulaire</strong> : <a href="https://tally.so/r/mBRMGN">Formulaire Mission</a></p>
      <p style="margin:8px 0 0;color:#334155;line-height:1.7;">👉 <strong>Laisse-nous un avis sur notre Fiche Google</strong></p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">Ton avis nous aide à faire évoluer Renford et à garantir la meilleure expérience possible pour tous.</p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">Merci encore pour ta confiance et ta bonne énergie !</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">À très bientôt pour de nouvelles missions,<br/><em>L'équipe Renford</em></p>`,
  });

  const text = `Bonjour ${firstName},

Un grand merci pour ton implication et ton professionnalisme lors de ta mission FLEX avec ${raisonSociale} 🙌
Tu peux retrouver ta facture et ton attestation de mission directement dans ton espace Renford : ${espaceUrl}

💸 Le virement sera effectué sur ton compte dans les prochaines heures (jour ouvré).

👉 Partage ton ressenti via ce court formulaire : https://tally.so/r/mBRMGN
👉 Laisse-nous un avis sur notre Fiche Google

Merci encore pour ta confiance et ta bonne énergie !
À très bientôt pour de nouvelles missions,
L'équipe Renford`;

  return {
    subject: 'Merci !',
    html,
    text,
  };
};

// ============================================================================
// Fin de mission Etablissement – FLEX
// ============================================================================

type FinMissionEtablissementFlexInput = {
  prenomEtablissement: string;
  prenomRenford: string;
  espaceUrl: string;
};

export const getFinMissionEtablissementFlexEmail = ({
  prenomEtablissement,
  prenomRenford,
  espaceUrl,
}: FinMissionEtablissementFlexInput) => {
  const firstName = prenomEtablissement.trim() || '<Prénom Etablissement>';

  const html = renderBaseEmailTemplate({
    preheader: 'Mission Renford FLEX terminée',
    title: 'Mission terminée ✅',
    intro: `Bonjour ${firstName},`,
    customHtml: `<p style="margin:14px 0 0;color:#334155;line-height:1.7;"><strong>La mission Renford FLEX avec ${escapeHtml(prenomRenford)} est maintenant terminée ✅</strong></p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">Vous trouverez la <strong>facture</strong> liée à cette intervention sur votre <a href="${espaceUrl}">espace Renford</a>, à tout moment.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">📝 Vous pouvez également <strong>noter la mission et le coach ${escapeHtml(prenomRenford)} directement depuis votre espace.</strong> Votre retour nous est précieux pour continuer à garantir la qualité des missions !</p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;"><strong>Besoin d'un nouveau coach ?</strong></p>
      <p style="margin:8px 0 0;color:#334155;line-height:1.7;">👉 Faites votre demande en 2 minutes ici :</p>`,
    ctaLabel: 'Envoyer ma prochaine demande',
    ctaUrl: espaceUrl,
    closing: `On reste bien entendu disponibles si besoin, et on espère vous retrouver très vite sur Renford !\nBien à vous,\nL'équipe Renford`,
  });

  const text = `Bonjour ${firstName},

La mission Renford FLEX avec ${prenomRenford} est maintenant terminée ✅
Vous trouverez la facture liée à cette intervention sur votre espace Renford : ${espaceUrl}

📝 Vous pouvez également noter la mission et le coach ${prenomRenford} directement depuis votre espace.

Besoin d'un nouveau coach ?
👉 ${espaceUrl}

On reste bien entendu disponibles si besoin, et on espère vous retrouver très vite sur Renford !
Bien à vous,
L'équipe Renford`;

  return {
    subject: 'Mission terminée ✅',
    html,
    text,
  };
};

// ============================================================================
// Fin de mission Etablissement – COACH
// ============================================================================

type FinMissionEtablissementCoachInput = {
  prenomEtablissement: string;
  prenomRenford: string;
  espaceUrl: string;
};

export const getFinMissionEtablissementCoachEmail = ({
  prenomEtablissement,
  prenomRenford,
  espaceUrl,
}: FinMissionEtablissementCoachInput) => {
  const firstName = prenomEtablissement.trim() || '<Prénom Etablissement>';

  const html = renderBaseEmailTemplate({
    preheader: 'Mission Renford COACH terminée',
    title: 'Mission terminée ✅',
    intro: `Bonjour ${firstName},`,
    customHtml: `<p style="margin:14px 0 0;color:#334155;line-height:1.7;">Merci beaucoup pour la mission Coach avec ${escapeHtml(prenomRenford)}. La mise en relation est désormais finalisée ! 🙌</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">📎 Vous retrouverez les documents liés (contrat, facture) à tout moment depuis votre <a href="${espaceUrl}">espace Renford</a>.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">Les coordonnées de ${escapeHtml(prenomRenford)} restent disponibles dans votre espace utilisateur pour faciliter votre organisation.</p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">Merci encore pour votre confiance, et très belle collaboration à venir !</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">Bien cordialement,<br/><em>L'équipe Renford</em></p>`,
  });

  const text = `Bonjour ${firstName},

Merci beaucoup pour la mission Coach avec ${prenomRenford}. La mise en relation est désormais finalisée !
Vous retrouverez les documents liés (contrat, facture) à tout moment depuis votre espace Renford : ${espaceUrl}

Les coordonnées de ${prenomRenford} restent disponibles dans votre espace utilisateur.
Merci encore pour votre confiance, et très belle collaboration à venir !

Bien cordialement,
L'équipe Renford`;

  return {
    subject: 'Mission terminée ✅',
    html,
    text,
  };
};

// ============================================================================
// Rappel Mission J-1 – Etablissement
// ============================================================================

type RappelMissionJ1EtablissementInput = {
  prenomEtablissement: string;
  prenomRenford: string;
  modeMission: string;
  espaceUrl: string;
};

export const getRappelMissionJ1EtablissementEmail = ({
  prenomEtablissement,
  prenomRenford,
  modeMission,
  espaceUrl,
}: RappelMissionJ1EtablissementInput) => {
  const firstName = prenomEtablissement.trim() || '<Prénom Etablissement>';
  const modeLabel = modeMission === 'coach' ? 'COACH' : 'FLEX';
  const subject = `C'est demain ! - Renford ${modeLabel} ✨`;

  const html = renderBaseEmailTemplate({
    preheader: subject,
    title: subject,
    intro: `Bonjour ${firstName},`,
    customHtml: `<p style="margin:14px 0 0;color:#334155;line-height:1.7;">Petit rappel amical 🤗. <strong>Votre mission Renford ${modeLabel} avec ${escapeHtml(prenomRenford)} a lieu demain !</strong></p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">Merci de vérifier que tout est en place pour accueillir votre Renford dans les meilleures conditions.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">Pour rappel, les coordonnées sont disponibles à tout moment depuis votre <a href="${espaceUrl}">espace membre</a>.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">Si vous avez la moindre question de dernière minute, notre équipe reste joignable par mail ou sur notre ligne dédiée : 06 25 92 27 70.</p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">Un grand merci pour votre confiance, et très <strong>belle collaboration à venir !</strong> 🌟</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;"><em>L'équipe Renford</em></p>`,
  });

  const text = `Bonjour ${firstName},

Petit rappel amical 🤗. Votre mission Renford ${modeLabel} avec ${prenomRenford} a lieu demain !
Merci de vérifier que tout est en place pour accueillir votre Renford dans les meilleures conditions.
Les coordonnées sont disponibles depuis votre espace membre : ${espaceUrl}

Si vous avez la moindre question, notre équipe reste joignable au 06 25 92 27 70.
Un grand merci pour votre confiance !
L'équipe Renford`;

  return { subject, html, text };
};

// ============================================================================
// Rappel Mission J-1 – Renford
// ============================================================================

type RappelMissionJ1RenfordInput = {
  prenomRenford: string;
  raisonSociale: string;
  modeMission: string;
  espaceUrl: string;
};

export const getRappelMissionJ1RenfordEmail = ({
  prenomRenford,
  raisonSociale,
  modeMission,
  espaceUrl,
}: RappelMissionJ1RenfordInput) => {
  const firstName = prenomRenford.trim() || '<Prénom Renford>';
  const modeLabel = modeMission === 'coach' ? 'COACH' : 'FLEX';
  const subject = `Ta mission Renford ${modeLabel} commence demain ✨`;

  const html = renderBaseEmailTemplate({
    preheader: subject,
    title: subject,
    intro: `Bonjour ${firstName},`,
    customHtml: `<p style="margin:14px 0 0;color:#334155;line-height:1.7;">Petit rappel amical 🤗 <strong>Ta mission Renford ${modeLabel} chez ${escapeHtml(raisonSociale)} a lieu demain !</strong></p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">Pense à vérifier que tout est prêt de ton côté pour que la séance se déroule dans les meilleures conditions.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">Les coordonnées de l'établissement sont disponibles à tout moment depuis ton <a href="${espaceUrl}">espace Renford</a>.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">Si tu as la moindre question ou un imprévu de dernière minute, notre équipe reste joignable par mail ou au 06 25 92 27 70.</p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;"><strong>Merci encore pour ton professionnalisme et ta fiabilité</strong> 💪</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">On te souhaite une très <strong>belle mission demain</strong> !</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">À bientôt,<br/><em>L'équipe Renford</em></p>`,
  });

  const text = `Bonjour ${firstName},

Petit rappel amical 🤗 Ta mission Renford ${modeLabel} chez ${raisonSociale} a lieu demain !
Pense à vérifier que tout est prêt de ton côté.
Les coordonnées de l'établissement sont disponibles depuis ton espace Renford : ${espaceUrl}

Si tu as la moindre question, notre équipe reste joignable au 06 25 92 27 70.
Merci encore pour ton professionnalisme et ta fiabilité 💪
On te souhaite une très belle mission demain !

À bientôt,
L'équipe Renford`;

  return { subject, html, text };
};

// ============================================================================
// Rappel Mission -72h – Renford
// ============================================================================

type RappelMission72hRenfordInput = {
  prenomRenford: string;
  typeMission: string;
  raisonSociale: string;
  adresse: string;
  plageMission: string;
  creneaux: string;
  espaceUrl: string;
};

export const getRappelMission72hRenfordEmail = ({
  prenomRenford,
  typeMission,
  raisonSociale,
  adresse,
  plageMission,
  creneaux,
  espaceUrl,
}: RappelMission72hRenfordInput) => {
  const firstName = prenomRenford.trim() || '<Prénom Renford>';
  const subject = '🕦 Rappel – Mission dans moins de 72h';

  const html = renderBaseEmailTemplate({
    preheader: subject,
    title: subject,
    intro: `Bonjour ${firstName},`,
    customHtml: `<p style="margin:14px 0 0;color:#334155;line-height:1.7;">Petit rappel amical : tu interviens dans moins de 72h pour la mission ${escapeHtml(typeMission)} chez ${escapeHtml(raisonSociale)} !</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">📍 Lieu : ${escapeHtml(adresse)}</p>
      <p style="margin:8px 0 0;color:#334155;line-height:1.7;">📆 Date : ${escapeHtml(plageMission)}</p>
      <p style="margin:8px 0 0;color:#334155;line-height:1.7;">🕒 Heure : ${escapeHtml(creneaux)}</p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">Tout est déjà confirmé, c'est juste pour ne pas l'oublier 😉 Tu peux également retrouver toutes les informations liées à la mission via ton <a href="${espaceUrl}">espace Renford</a>.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">Bonne séance à toi !<br/>L'équipe Renford</p>`,
  });

  const text = `Bonjour ${firstName},

Petit rappel amical : tu interviens dans moins de 72h pour la mission ${typeMission} chez ${raisonSociale} !
📍 Lieu : ${adresse}
📆 Date : ${plageMission}
🕒 Heure : ${creneaux}

Tout est déjà confirmé, c'est juste pour ne pas l'oublier 😉
Ton espace Renford : ${espaceUrl}

Bonne séance à toi !
L'équipe Renford`;

  return { subject, html, text };
};

// ============================================================================
// Rappel Mission -72h – Etablissement
// ============================================================================

type RappelMission72hEtablissementInput = {
  prenomEtablissement: string;
  prenomRenford: string;
  modeMission: string;
  typeMission: string;
  plageMission: string;
  creneaux: string;
  espaceUrl: string;
};

export const getRappelMission72hEtablissementEmail = ({
  prenomEtablissement,
  prenomRenford,
  modeMission,
  typeMission,
  plageMission,
  creneaux,
  espaceUrl,
}: RappelMission72hEtablissementInput) => {
  const firstName = prenomEtablissement.trim() || '<Prénom Etablissement>';
  const modeLabel = modeMission === 'coach' ? 'COACH' : 'FLEX';
  const subject = `Rappel – Votre Renford ${modeLabel} arrive dans moins de 72h`;

  const html = renderBaseEmailTemplate({
    preheader: subject,
    title: subject,
    intro: `Bonjour ${firstName},`,
    customHtml: `<p style="margin:14px 0 0;color:#334155;line-height:1.7;">Petit rappel : une prestation Renford ${modeLabel} est prévue dans moins de 72h avec ${escapeHtml(prenomRenford)} pour la mission ${escapeHtml(typeMission)}.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">📆 Date : ${escapeHtml(plageMission)}</p>
      <p style="margin:8px 0 0;color:#334155;line-height:1.7;">🕒 Heure : ${escapeHtml(creneaux)}</p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">Tout est déjà validé de votre côté, il s'agit simplement d'un rappel.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">👉 Vous pouvez vous connecter à votre <a href="${espaceUrl}">espace Renford</a> pour retrouver l'ensemble des informations.</p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">Bien cordialement,<br/>L'équipe Renford</p>`,
  });

  const text = `Bonjour ${firstName},

Petit rappel : une prestation Renford ${modeLabel} est prévue dans moins de 72h avec ${prenomRenford}.
📆 Date : ${plageMission}
🕒 Heure : ${creneaux}

Tout est déjà confirmé — c'est simplement un rappel.
👉 Votre espace Renford : ${espaceUrl}

Bien cordialement,
L'équipe Renford`;

  return { subject, html, text };
};

// ============================================================================
// Mission annulée – Renford
// ============================================================================

type MissionAnnuleeRenfordInput = {
  prenomRenford: string;
  typeMission: string;
  raisonSociale: string;
};

export const getMissionAnnuleeRenfordEmail = ({
  prenomRenford,
  typeMission,
  raisonSociale,
}: MissionAnnuleeRenfordInput) => {
  const firstName = prenomRenford.trim() || '<Prénom>';

  const html = renderBaseEmailTemplate({
    preheader: 'Mise à jour concernant votre mission Renford',
    title: 'Mise à jour de ta mission',
    intro: `Hello ${firstName},`,
    customHtml: `<p style="margin:14px 0 0;color:#334155;line-height:1.7;">Nous avons une petite mise à jour à te partager : pour la mission ${escapeHtml(typeMission)} prévue chez ${escapeHtml(raisonSociale)}, l'établissement a finalement trouvé une solution et n'aura pas besoin de renford cette fois-là.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">Merci beaucoup pour ta réactivité et ton implication, c'est toujours apprécié ! 🙏</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">Ce n'est que partie remise : nous continuons à recevoir de nouvelles demandes et nous reviendrons vers toi dès qu'une opportunité se présentera.</p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">À bientôt et merci pour ta compréhension,<br/>L'équipe Renford</p>`,
  });

  const text = `Hello ${firstName},

Nous avons une petite mise à jour à te partager : pour la mission ${typeMission} prévue chez ${raisonSociale}, l'établissement a finalement trouvé une solution et n'aura pas besoin de renford cette fois-là.
Merci beaucoup pour ta réactivité et ton implication, c'est toujours apprécié ! 🙏
Ce n'est que partie remise : nous continuons à recevoir de nouvelles demandes et nous reviendrons vers toi dès qu'une opportunité se présentera.

À bientôt et merci pour ta compréhension,
L'équipe Renford`;

  return {
    subject: 'Mise à jour concernant votre mission Renford',
    html,
    text,
  };
};

// ============================================================================
// Profil non retenu – Renford COACH
// ============================================================================

type ProfilNonRetenuRenfordInput = {
  prenomRenford: string;
  typeMission: string;
  villeRaisonSociale: string;
};

export const getProfilNonRetenuRenfordEmail = ({
  prenomRenford,
  typeMission,
  villeRaisonSociale,
}: ProfilNonRetenuRenfordInput) => {
  const firstName = prenomRenford.trim() || '<Prénom>';

  const html = renderBaseEmailTemplate({
    preheader: `Retour sur votre candidature à la mission ${typeMission}`,
    title: `Retour sur votre candidature – Renford`,
    intro: `Bonjour ${firstName},`,
    customHtml: `<p style="margin:14px 0 0;color:#334155;line-height:1.7;">Merci encore pour votre réactivité et votre intérêt pour la mission ${escapeHtml(typeMission)} proposée à ${escapeHtml(villeRaisonSociale)}.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">Après échanges avec l'établissement, votre profil n'a malheureusement pas été retenu cette fois-ci.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">Nous tenons toutefois à vous remercier sincèrement pour votre implication et votre professionnalisme 🙏</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">Votre sérieux et votre motivation sont très appréciés par l'équipe Renford 💪</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">De nouvelles opportunités arrivent régulièrement sur la plateforme : nous ne manquerons pas de revenir vers vous dès qu'une mission correspondant à votre profil se présentera.</p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">Encore merci pour votre confiance et à très vite sur Renford !</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">Bien sportivement,<br/>L'équipe Renford</p>`,
  });

  const text = `Bonjour ${firstName},

Merci encore pour votre réactivité et votre intérêt pour la mission ${typeMission} proposée à ${villeRaisonSociale}.
Après échanges avec l'établissement, votre profil n'a malheureusement pas été retenu cette fois-ci.
Nous tenons toutefois à vous remercier sincèrement pour votre implication et votre professionnalisme 🙏
Votre sérieux et votre motivation sont très appréciés par l'équipe Renford 💪
De nouvelles opportunités arrivent régulièrement sur la plateforme.

Encore merci pour votre confiance et à très vite sur Renford !
Bien sportivement,
L'équipe Renford`;

  return {
    subject: `Retour sur votre candidature – ${typeMission}`,
    html,
    text,
  };
};

// ============================================================================
// Profil suspect – 1er mail
// ============================================================================

type ProfilSuspectInput = {
  espaceUrl: string;
};

export const getProfilSuspectEmail = ({ espaceUrl }: ProfilSuspectInput) => {
  const html = renderBaseEmailTemplate({
    preheader: 'Certaines informations de votre profil nécessitent une vérification.',
    title: 'Vérification de votre profil Renford',
    intro: 'Bonjour,',
    customHtml: `<p style="margin:14px 0 0;color:#334155;line-height:1.7;">Nous avons remarqué que certaines informations sur votre compte Renford semblent manquantes ou nécessitent une vérification.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">Afin de garantir un espace sécurisé et fiable pour l'ensemble de notre communauté, nous vous invitons à compléter votre profil dans un délai de 5 jours.</p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">🎯 <strong>Ce que cela implique :</strong></p>
      <p style="margin:8px 0 0;color:#334155;line-height:1.7;">Il peut s'agir de votre photo, de vos diplômes, de votre statut administratif, ou d'autres éléments importants pour valider votre compte en tant qu'intervenant sportif.</p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">💡 <strong>Pourquoi c'est important ?</strong></p>
      <p style="margin:8px 0 0;color:#334155;line-height:1.7;">Un profil complet et conforme vous permet d'accéder pleinement aux opportunités proposées sur Renford, tout en renforçant la confiance des établissements partenaires.</p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">🕐 Passé ce délai, si le profil reste incomplet ou pose question, nous pourrons être amenés à suspendre temporairement votre accès, conformément à nos CGU.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">Bien entendu, nous restons à votre écoute si vous avez des questions ou besoin d'aide pour la mise à jour.</p>`,
    ctaLabel: 'Compléter mon profil',
    ctaUrl: espaceUrl,
    closing:
      "Merci pour votre compréhension et au plaisir de vous retrouver bientôt actif·ve sur Renford !\nL'équipe Renford",
  });

  const text = `Bonjour,

Nous avons remarqué que certaines informations sur votre compte Renford semblent manquantes ou nécessitent une vérification.
Afin de garantir un espace sécurisé et fiable pour l'ensemble de notre communauté, nous vous invitons à compléter votre profil dans un délai de 5 jours.

Passé ce délai, si le profil reste incomplet ou pose question, nous pourrons être amenés à suspendre temporairement votre accès, conformément à nos CGU.

Compléter mon profil : ${espaceUrl}

Merci pour votre compréhension,
L'équipe Renford`;

  return {
    subject: 'Vérification de votre profil Renford',
    html,
    text,
  };
};

// ============================================================================
// Profil suspect – 2ème mail (suppression imminente)
// ============================================================================

export const getProfilSuspect2Email = ({ espaceUrl }: ProfilSuspectInput) => {
  const html = renderBaseEmailTemplate({
    preheader: 'Votre compte Renford va être supprimé dans 48h.',
    title: '⛔ Suppression de votre compte dans 48h',
    intro: 'Bonjour,',
    customHtml: `<p style="margin:14px 0 0;color:#334155;line-height:1.7;">Suite à notre précédent message resté sans action de votre part, nous vous informons que votre compte Renford va être supprimé dans un délai de 48h.</p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">⛔ <strong>Pourquoi ?</strong></p>
      <p style="margin:8px 0 0;color:#334155;line-height:1.7;">Malgré notre relance, votre profil demeure incomplet ou non conforme aux critères de validation définis dans nos Conditions Générales d'Utilisation.</p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">💡 <strong>Pour rappel, un compte validé permet de :</strong></p>
      <ul style="margin:10px 0 0;padding:0 0 0 20px;color:#334155;">
        <li style="margin:0 0 8px;line-height:1.7;">Recevoir des opportunités de mission sportives,</li>
        <li style="margin:0 0 8px;line-height:1.7;">Être visible par nos établissements partenaires,</li>
        <li style="margin:0 0 8px;line-height:1.7;">Bénéficier d'un accompagnement administratif fiable et sécurisé.</li>
      </ul>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">Si vous souhaitez régulariser votre situation avant suppression, il est encore temps : il vous suffit de compléter votre profil dès maintenant.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">👉 En cas de doute ou besoin d'aide, notre équipe reste disponible pour vous accompagner.</p>`,
    ctaLabel: 'Compléter mon profil',
    ctaUrl: espaceUrl,
    closing: "Merci pour votre compréhension,\nL'équipe Renford",
  });

  const text = `Bonjour,

Suite à notre précédent message resté sans action de votre part, nous vous informons que votre compte Renford va être supprimé dans un délai de 48h.
Malgré notre relance, votre profil demeure incomplet ou non conforme aux critères de validation définis dans nos CGU.

Si vous souhaitez régulariser votre situation avant suppression, il est encore temps : ${espaceUrl}

Merci pour votre compréhension,
L'équipe Renford`;

  return {
    subject: '⛔ Suppression de votre compte dans 48h',
    html,
    text,
  };
};

// ============================================================================
// Contrat à signer – Etablissement (Coach & Flex)
// ============================================================================

type ContratASignerEtablissementInput = {
  prenomEtablissement: string;
  prenomRenford: string;
  modeMission: string;
  espaceUrl: string;
};

export const getContratASignerEtablissementEmail = ({
  prenomEtablissement,
  prenomRenford,
  modeMission,
  espaceUrl,
}: ContratASignerEtablissementInput) => {
  const firstName = prenomEtablissement.trim() || '<Prénom Etablissement>';
  const modeLabel = modeMission === 'coach' ? 'COACH' : 'FLEX';

  const html = renderBaseEmailTemplate({
    preheader: `Contrat de prestation à signer – Mission ${modeLabel}`,
    title: `📝 Contrat à signer`,
    intro: `Bonjour ${firstName},`,
    customHtml: `<p style="margin:14px 0 0;color:#334155;line-height:1.7;">Le contrat de prestation de service pour votre mission Renford ${modeLabel} avec ${escapeHtml(prenomRenford)} est prêt à être signé !</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">👉 Connectez-vous à votre <a href="${espaceUrl}">espace Renford</a> pour consulter et signer le contrat.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">La signature des deux parties est nécessaire pour que la mission puisse démarrer.</p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">Bien cordialement,<br/>L'équipe Renford</p>`,
  });

  const text = `Bonjour ${firstName},

Le contrat de prestation de service pour votre mission Renford ${modeLabel} avec ${prenomRenford} est prêt à être signé !
👉 Connectez-vous à votre espace Renford pour consulter et signer le contrat : ${espaceUrl}

La signature des deux parties est nécessaire pour que la mission puisse démarrer.

Bien cordialement,
L'équipe Renford`;

  return {
    subject: `📝 Contrat à signer – Mission ${modeLabel}`,
    html,
    text,
  };
};

// ============================================================================
// Contrat à signer – Renford (Coach & Flex)
// ============================================================================

type ContratASignerRenfordInput = {
  prenomRenford: string;
  raisonSociale: string;
  modeMission: string;
  espaceUrl: string;
};

export const getContratASignerRenfordEmail = ({
  prenomRenford,
  raisonSociale,
  modeMission,
  espaceUrl,
}: ContratASignerRenfordInput) => {
  const firstName = prenomRenford.trim() || '<Prénom Renford>';
  const modeLabel = modeMission === 'coach' ? 'COACH' : 'FLEX';

  const html = renderBaseEmailTemplate({
    preheader: `Contrat de prestation à signer – Mission ${modeLabel}`,
    title: `📝 Contrat à signer`,
    intro: `Bonjour ${firstName},`,
    customHtml: `<p style="margin:14px 0 0;color:#334155;line-height:1.7;">Le contrat de prestation de service pour ta mission Renford ${modeLabel} avec ${escapeHtml(raisonSociale)} est prêt à être signé !</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">👉 Connecte-toi à ton <a href="${espaceUrl}">espace Renford</a> pour consulter et signer le contrat.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">La signature des deux parties est nécessaire pour que la mission puisse démarrer.</p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">À très vite,<br/>L'équipe Renford</p>`,
  });

  const text = `Bonjour ${firstName},

Le contrat de prestation de service pour ta mission Renford ${modeLabel} avec ${raisonSociale} est prêt à être signé !
👉 Connecte-toi à ton espace Renford pour consulter et signer le contrat : ${espaceUrl}

La signature des deux parties est nécessaire pour que la mission puisse démarrer.

À très vite,
L'équipe Renford`;

  return {
    subject: `📝 Contrat à signer – Mission ${modeLabel}`,
    html,
    text,
  };
};

// ============================================================================
// Contrat signé par les deux parties – Etablissement COACH
// ============================================================================

type ContratSigneEtablissementCoachInput = {
  prenomEtablissement: string;
  prenomRenford: string;
  espaceUrl: string;
};

export const getContratSigneEtablissementCoachEmail = ({
  prenomEtablissement,
  prenomRenford,
  espaceUrl,
}: ContratSigneEtablissementCoachInput) => {
  const firstName = prenomEtablissement.trim() || '<Prénom Etablissement>';

  const html = renderBaseEmailTemplate({
    preheader: 'Contrat signé – Mission COACH prête à démarrer',
    title: "✅ Contrat signé – C'est parti !",
    intro: `Bonjour ${firstName},`,
    customHtml: `<p style="margin:14px 0 0;color:#334155;line-height:1.7;">Le contrat de mise en relation pour la mission Renford COACH avec ${escapeHtml(prenomRenford)} a été signé par les deux parties !</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">✅ La mission peut désormais officiellement démarrer. Les coordonnées de ${escapeHtml(prenomRenford)} sont disponibles dans votre <a href="${espaceUrl}">espace Renford</a>.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">Vous pouvez également télécharger le contrat signé à tout moment depuis votre espace.</p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">Nous vous souhaitons une excellente collaboration !</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">Bien cordialement,<br/>L'équipe Renford</p>`,
  });

  const text = `Bonjour ${firstName},

Le contrat de mise en relation pour la mission Renford COACH avec ${prenomRenford} a été signé par les deux parties !
La mission peut désormais officiellement démarrer.
Les coordonnées de ${prenomRenford} sont disponibles dans votre espace Renford : ${espaceUrl}

Nous vous souhaitons une excellente collaboration !
Bien cordialement,
L'équipe Renford`;

  return {
    subject: '✅ Contrat signé – Mission COACH prête à démarrer',
    html,
    text,
  };
};

// ============================================================================
// Contrat signé par les deux parties – Etablissement FLEX
// ============================================================================

type ContratSigneEtablissementFlexInput = {
  prenomEtablissement: string;
  prenomRenford: string;
  espaceUrl: string;
};

export const getContratSigneEtablissementFlexEmail = ({
  prenomEtablissement,
  prenomRenford,
  espaceUrl,
}: ContratSigneEtablissementFlexInput) => {
  const firstName = prenomEtablissement.trim() || '<Prénom Etablissement>';

  const html = renderBaseEmailTemplate({
    preheader: 'Contrat signé et paiement confirmé – Mission FLEX',
    title: '✅ Contrat signé & paiement OK',
    intro: `Bonjour ${firstName},`,
    customHtml: `<p style="margin:14px 0 0;color:#334155;line-height:1.7;">Le contrat de prestation de service pour la mission Renford FLEX avec ${escapeHtml(prenomRenford)} a été signé par les deux parties et le paiement a été confirmé !</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">✅ La mission peut désormais officiellement démarrer.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">Vous pouvez retrouver les détails et télécharger le contrat signé depuis votre <a href="${espaceUrl}">espace Renford</a>.</p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">Nous vous souhaitons une excellente mission !</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">Bien cordialement,<br/>L'équipe Renford</p>`,
  });

  const text = `Bonjour ${firstName},

Le contrat de prestation de service pour la mission Renford FLEX avec ${prenomRenford} a été signé par les deux parties et le paiement a été confirmé !
La mission peut désormais officiellement démarrer.

Vous pouvez retrouver les détails depuis votre espace Renford : ${espaceUrl}

Nous vous souhaitons une excellente mission !
Bien cordialement,
L'équipe Renford`;

  return {
    subject: '✅ Contrat signé & paiement confirmé – Mission FLEX',
    html,
    text,
  };
};

// ============================================================================
// Coach – Profil accepté (Etablissement)
// ============================================================================

type ProfilAccepteEtablissementCoachInput = {
  prenomEtablissement: string;
  prenomRenford: string;
  espaceUrl: string;
};

export const getProfilAccepteEtablissementCoachEmail = ({
  prenomEtablissement,
  prenomRenford,
  espaceUrl,
}: ProfilAccepteEtablissementCoachInput) => {
  const firstName = prenomEtablissement.trim() || '<Prénom Etablissement>';

  const html = renderBaseEmailTemplate({
    preheader: 'Profil accepté – Mission Coach',
    title: '👍 Profil accepté !',
    intro: `Bonjour ${firstName},`,
    customHtml: `<p style="margin:14px 0 0;color:#334155;line-height:1.7;">Vous avez accepté le profil de ${escapeHtml(prenomRenford)} pour votre mission Renford COACH. C'est une super nouvelle ! 🎉</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">La prochaine étape est de programmer un échange avec ${escapeHtml(prenomRenford)} pour valider la collaboration.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">👉 Rendez-vous dans votre <a href="${espaceUrl}">espace Renford</a> pour programmer l'échange.</p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">Bien cordialement,<br/>L'équipe Renford</p>`,
  });

  const text = `Bonjour ${firstName},

Vous avez accepté le profil de ${prenomRenford} pour votre mission Renford COACH. C'est une super nouvelle ! 🎉
La prochaine étape est de programmer un échange avec ${prenomRenford} pour valider la collaboration.

👉 Rendez-vous dans votre espace Renford : ${espaceUrl}

Bien cordialement,
L'équipe Renford`;

  return {
    subject: '👍 Profil accepté – Mission Renford COACH',
    html,
    text,
  };
};

// ============================================================================
// Coach – Programmer échange (Etablissement)
// ============================================================================

type ProgrammerEchangeEtablissementInput = {
  prenomEtablissement: string;
  prenomRenford: string;
  espaceUrl: string;
};

export const getProgrammerEchangeEtablissementEmail = ({
  prenomEtablissement,
  prenomRenford,
  espaceUrl,
}: ProgrammerEchangeEtablissementInput) => {
  const firstName = prenomEtablissement.trim() || '<Prénom Etablissement>';

  const html = renderBaseEmailTemplate({
    preheader: `Programmer un échange visio avec ${prenomRenford}`,
    title: '📅 Programmez votre échange',
    intro: `Bonjour ${firstName},`,
    customHtml: `<p style="margin:14px 0 0;color:#334155;line-height:1.7;">Vous pouvez maintenant programmer un échange visio avec ${escapeHtml(prenomRenford)} pour votre mission Renford COACH.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">Cet échange permettra de valider les derniers détails avant le démarrage de la mission.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">👉 Rendez-vous dans votre <a href="${espaceUrl}">espace Renford</a> pour choisir un créneau qui vous convient.</p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">Bien cordialement,<br/>L'équipe Renford</p>`,
  });

  const text = `Bonjour ${firstName},

Vous pouvez maintenant programmer un échange visio avec ${prenomRenford} pour votre mission Renford COACH.
Cet échange permettra de valider les derniers détails avant le démarrage de la mission.

👉 Votre espace Renford : ${espaceUrl}

Bien cordialement,
L'équipe Renford`;

  return {
    subject: `📅 Programmez votre échange avec ${prenomRenford}`,
    html,
    text,
  };
};

// ============================================================================
// Coach – Profils tous refusés (Etablissement)
// ============================================================================

type ProfilsTousRefusesEtablissementInput = {
  prenomEtablissement: string;
  espaceUrl: string;
};

export const getProfilsTousRefusesEtablissementEmail = ({
  prenomEtablissement,
  espaceUrl,
}: ProfilsTousRefusesEtablissementInput) => {
  const firstName = prenomEtablissement.trim() || '<Prénom Etablissement>';

  const html = renderBaseEmailTemplate({
    preheader: 'Tous les profils ont été refusés – Recherche en cours',
    title: '🔍 Nous cherchons un nouveau profil',
    intro: `Bonjour ${firstName},`,
    customHtml: `<p style="margin:14px 0 0;color:#334155;line-height:1.7;">Vous avez refusé l'ensemble des profils proposés pour votre mission Renford COACH.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">Notre équipe relance activement la recherche pour trouver le profil qui correspondra le mieux à vos besoins.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">Nous reviendrons vers vous dès qu'un nouveau profil sera disponible.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">En attendant, vous pouvez suivre l'avancement depuis votre <a href="${espaceUrl}">espace Renford</a>.</p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">Bien cordialement,<br/>L'équipe Renford</p>`,
  });

  const text = `Bonjour ${firstName},

Vous avez refusé l'ensemble des profils proposés pour votre mission Renford COACH.
Notre équipe relance activement la recherche pour trouver le profil qui correspondra le mieux à vos besoins.
Nous reviendrons vers vous dès qu'un nouveau profil sera disponible.

Votre espace Renford : ${espaceUrl}

Bien cordialement,
L'équipe Renford`;

  return {
    subject: "🔍 Recherche d'un nouveau profil en cours",
    html,
    text,
  };
};

// ============================================================================
// Après visio (Coach) – Etablissement
// ============================================================================

type ApresVisioEtablissementInput = {
  prenomEtablissement: string;
  prenomRenford: string;
  espaceUrl: string;
};

export const getApresVisioEtablissementEmail = ({
  prenomEtablissement,
  prenomRenford,
  espaceUrl,
}: ApresVisioEtablissementInput) => {
  const firstName = prenomEtablissement.trim() || '<Prénom Etablissement>';

  const html = renderBaseEmailTemplate({
    preheader: `Comment s'est passé l'échange avec ${prenomRenford} ?`,
    title: '💬 Alors, cet échange ?',
    intro: `Bonjour ${firstName},`,
    customHtml: `<p style="margin:14px 0 0;color:#334155;line-height:1.7;">On espère que l'échange avec ${escapeHtml(prenomRenford)} s'est bien passé !</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">👉 Vous pouvez donner votre retour et valider ou non le profil directement depuis votre <a href="${espaceUrl}">espace Renford</a>.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">Si c'est un match : la prochaine étape sera la signature du contrat ! 🎉</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">Si le profil ne convient pas : pas de souci, nous relançons la recherche immédiatement.</p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">N'hésitez pas si vous avez des questions.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">Bien cordialement,<br/>L'équipe Renford</p>`,
  });

  const text = `Bonjour ${firstName},

On espère que l'échange avec ${prenomRenford} s'est bien passé !
Vous pouvez donner votre retour et valider ou non le profil directement depuis votre espace Renford : ${espaceUrl}

Si c'est un match : la prochaine étape sera la signature du contrat !
Si le profil ne convient pas : pas de souci, nous relançons la recherche immédiatement.

Bien cordialement,
L'équipe Renford`;

  return {
    subject: `💬 Échange avec ${prenomRenford} – Votre retour`,
    html,
    text,
  };
};

// ============================================================================
// Après visio (Coach) – Renford
// ============================================================================

type ApresVisioRenfordInput = {
  prenomRenford: string;
  raisonSociale: string;
  espaceUrl: string;
};

export const getApresVisioRenfordEmail = ({
  prenomRenford,
  raisonSociale,
  espaceUrl,
}: ApresVisioRenfordInput) => {
  const firstName = prenomRenford.trim() || '<Prénom Renford>';

  const html = renderBaseEmailTemplate({
    preheader: `Comment s'est passé l'échange avec ${raisonSociale} ?`,
    title: '💬 Alors, cet échange ?',
    intro: `Bonjour ${firstName},`,
    customHtml: `<p style="margin:14px 0 0;color:#334155;line-height:1.7;">On espère que l'échange avec ${escapeHtml(raisonSociale)} s'est bien passé !</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">👉 Tu peux confirmer ta disponibilité et ta motivation pour cette mission directement depuis ton <a href="${espaceUrl}">espace Renford</a>.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">Nous attendons le retour de l'établissement et nous te tiendrons informé(e) dès que possible !</p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">Merci pour ton engagement,<br/>L'équipe Renford</p>`,
  });

  const text = `Bonjour ${firstName},

On espère que l'échange avec ${raisonSociale} s'est bien passé !
Tu peux confirmer ta disponibilité et ta motivation pour cette mission depuis ton espace Renford : ${espaceUrl}

Nous attendons le retour de l'établissement et nous te tiendrons informé(e) dès que possible !

Merci pour ton engagement,
L'équipe Renford`;

  return {
    subject: `💬 Échange avec ${raisonSociale} – Ton retour`,
    html,
    text,
  };
};

// ============================================================================
// Après confirmation – Renford Coach (coordonnées)
// ============================================================================

type ApresConfirmationRenfordCoachInput = {
  prenomRenford: string;
  raisonSociale: string;
  contactEtablissement: string;
  telephoneEtablissement: string;
  adresseEtablissement: string;
  espaceUrl: string;
};

export const getApresConfirmationRenfordCoachEmail = ({
  prenomRenford,
  raisonSociale,
  contactEtablissement,
  telephoneEtablissement,
  adresseEtablissement,
  espaceUrl,
}: ApresConfirmationRenfordCoachInput) => {
  const firstName = prenomRenford.trim() || '<Prénom Renford>';
  const subject = `🚀 Ta mission chez ${raisonSociale} est confirmée !`;

  const html = renderBaseEmailTemplate({
    preheader: subject,
    title: subject,
    intro: `Bonjour ${firstName},`,
    customHtml: `<p style="margin:14px 0 0;color:#334155;line-height:1.7;">Super nouvelle ! Ta mission Renford COACH chez ${escapeHtml(raisonSociale)} est officiellement confirmée 🎉</p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">📋 <strong>Coordonnées de l'établissement :</strong></p>
      <p style="margin:8px 0 0;color:#334155;line-height:1.7;">👤 Contact : ${escapeHtml(contactEtablissement)}</p>
      <p style="margin:4px 0 0;color:#334155;line-height:1.7;">📞 Téléphone : ${escapeHtml(telephoneEtablissement)}</p>
      <p style="margin:4px 0 0;color:#334155;line-height:1.7;">📍 Adresse : ${escapeHtml(adresseEtablissement)}</p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">Tu retrouveras toutes ces informations ainsi que le contrat à signer dans ton <a href="${espaceUrl}">espace Renford</a>.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">On te souhaite une belle collaboration !</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">À très vite,<br/>L'équipe Renford</p>`,
  });

  const text = `Bonjour ${firstName},

Super nouvelle ! Ta mission Renford COACH chez ${raisonSociale} est officiellement confirmée 🎉

Coordonnées de l'établissement :
👤 Contact : ${contactEtablissement}
📞 Téléphone : ${telephoneEtablissement}
📍 Adresse : ${adresseEtablissement}

Tu retrouveras toutes ces informations dans ton espace Renford : ${espaceUrl}

On te souhaite une belle collaboration !
À très vite,
L'équipe Renford`;

  return { subject, html, text };
};

// ============================================================================
// Refus Renford Coach (le renford decline la mission)
// ============================================================================

type RefusRenfordCoachInput = {
  prenomRenford: string;
  typeMission: string;
  raisonSociale: string;
};

export const getRefusRenfordCoachEmail = ({
  prenomRenford,
  typeMission,
  raisonSociale,
}: RefusRenfordCoachInput) => {
  const firstName = prenomRenford.trim() || '<Prénom>';

  const html = renderBaseEmailTemplate({
    preheader: 'On comprend, à bientôt !',
    title: 'On comprend, à bientôt !',
    intro: `Bonjour ${firstName},`,
    customHtml: `<p style="margin:14px 0 0;color:#334155;line-height:1.7;">Nous avons bien pris en compte que tu ne souhaites pas poursuivre pour la mission ${escapeHtml(typeMission)} chez ${escapeHtml(raisonSociale)}.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">Pas de souci du tout, on comprend ! Chaque situation est différente et c'est important de se sentir aligné·e.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">Ton profil reste actif sur la plateforme et nous te proposerons de nouvelles missions dès qu'elles seront disponibles.</p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">À très bientôt,<br/>L'équipe Renford</p>`,
  });

  const text = `Bonjour ${firstName},

Nous avons bien pris en compte que tu ne souhaites pas poursuivre pour la mission ${typeMission} chez ${raisonSociale}.
Pas de souci du tout, on comprend ! Chaque situation est différente et c'est important de se sentir aligné·e.
Ton profil reste actif sur la plateforme et nous te proposerons de nouvelles missions dès qu'elles seront disponibles.

À très bientôt,
L'équipe Renford`;

  return {
    subject: 'On comprend, à bientôt !',
    html,
    text,
  };
};

// ============================================================================
// Profil annulé – Etablissement (remplacement annulé)
// ============================================================================

type ProfilAnnuleEtablissementInput = {
  prenomEtablissement: string;
  prenomRenford: string;
  espaceUrl: string;
};

export const getProfilAnnuleEtablissementEmail = ({
  prenomEtablissement,
  prenomRenford,
  espaceUrl,
}: ProfilAnnuleEtablissementInput) => {
  const firstName = prenomEtablissement.trim() || '<Prénom Etablissement>';

  const html = renderBaseEmailTemplate({
    preheader: "Le profil proposé n'est plus disponible",
    title: 'Mise à jour de votre mission',
    intro: `Bonjour ${firstName},`,
    customHtml: `<p style="margin:14px 0 0;color:#334155;line-height:1.7;">Nous vous informons que ${escapeHtml(prenomRenford)}, initialement proposé(e) pour votre mission, n'est malheureusement plus disponible.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">Notre équipe est déjà en train de rechercher un nouveau profil adapté à vos besoins.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">Nous reviendrons vers vous dès qu'un nouveau profil sera disponible.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">Vous pouvez suivre l'avancement depuis votre <a href="${espaceUrl}">espace Renford</a>.</p>
      <p style="margin:14px 0 0;color:#334155;line-height:1.7;">Merci pour votre patience et votre compréhension.</p>
      <p style="margin:10px 0 0;color:#334155;line-height:1.7;">Bien cordialement,<br/>L'équipe Renford</p>`,
  });

  const text = `Bonjour ${firstName},

Nous vous informons que ${prenomRenford}, initialement proposé(e) pour votre mission, n'est malheureusement plus disponible.
Notre équipe est déjà en train de rechercher un nouveau profil adapté à vos besoins.

Vous pouvez suivre l'avancement depuis votre espace Renford : ${espaceUrl}

Merci pour votre patience et votre compréhension.
Bien cordialement,
L'équipe Renford`;

  return {
    subject: 'Mise à jour de votre mission – Profil indisponible',
    html,
    text,
  };
};
