import { env } from './env';

type BaseEmailTemplateInput = {
  preheader: string;
  title: string;
  intro: string;
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
  const contact = prenomNom.trim() || 'Bonjour';

  const html = renderBaseEmailTemplate({
    preheader: 'Bienvenue sur Renford, votre espace établissement est prêt.',
    title: 'Bienvenue sur Renford 👋',
    intro: `${contact}, votre espace établissement est maintenant actif. Nous sommes ravis de vous accompagner dans la recherche de talents pour ${raisonSociale}.`,
    bulletPoints: [
      'Vérifiez vos informations pour optimiser la qualité des candidatures.',
      'Publiez votre première mission en quelques clics.',
      'Suivez vos échanges et vos prochaines collaborations depuis votre dashboard.',
    ],
    ctaLabel: 'Accéder à mon espace',
    ctaUrl: dashboardUrl,
    closing: "Besoin d'aide ? Notre équipe support est à votre disposition.",
  });

  const text = `${contact},\n\nBienvenue sur Renford. Votre espace établissement est prêt pour ${raisonSociale}.\nAccédez à votre espace : ${dashboardUrl}\n\nL'équipe Renford`;

  return {
    subject: 'Bienvenue sur Renford',
    html,
    text,
  };
};

type WelcomeRenfordInput = {
  prenom: string;
  dashboardUrl: string;
};

export const getWelcomeRenfordEmail = ({ prenom, dashboardUrl }: WelcomeRenfordInput) => {
  const contact = prenom.trim() ? `Bonjour ${prenom.trim()},` : 'Bonjour,';

  const html = renderBaseEmailTemplate({
    preheader: 'Félicitations, votre profil Renford est prêt.',
    title: 'Félicitations et bienvenue chez Renford 🎉',
    intro: `${contact} Votre onboarding est terminé, vous êtes prêt(e) à recevoir des missions et développer votre activité.`,
    bulletPoints: [
      'Mettez à jour vos disponibilités pour recevoir des demandes pertinentes.',
      'Affinez votre profil pour valoriser vos compétences.',
      'Suivez vos opportunités directement depuis votre espace Renford.',
    ],
    ctaLabel: 'Accéder à mon espace Renford',
    ctaUrl: dashboardUrl,
    closing: "À très bientôt sur la plateforme, l'équipe Renford.",
  });

  const text = `${contact}\n\nFélicitations, votre onboarding est terminé.\nAccédez à votre espace : ${dashboardUrl}\n\nL'équipe Renford`;

  return {
    subject: 'Félicitations et bienvenue chez Renford',
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
  const html = renderBaseEmailTemplate({
    preheader: `${title} - code temporaire`,
    title,
    intro,
    bulletPoints: [
      `Votre code : ${code}`,
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
