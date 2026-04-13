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
