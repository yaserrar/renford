import type { NextFunction, Request, Response } from 'express';
import { TypeEmailTemplate } from '@prisma/client';
import prisma from '../../config/prisma';
import { EMAIL_TEMPLATE_META } from './email-templates.meta';
import { EMAIL_TEMPLATE_DEFAULTS } from './email-templates.defaults';

function buildEffectiveValues(
  defaults: (typeof EMAIL_TEMPLATE_DEFAULTS)[TypeEmailTemplate],
  custom: {
    sujet: string | null;
    titre: string | null;
    intro: string | null;
    corps: string | null;
    closing: string | null;
    ctaLabel: string | null;
  } | null,
) {
  return {
    sujet: custom?.sujet ?? defaults.sujet,
    titre: custom?.titre ?? defaults.titre,
    intro: custom?.intro ?? defaults.intro,
    closing: custom?.closing ?? defaults.closing,
    ctaLabel: custom?.ctaLabel ?? defaults.ctaLabel,
  };
}

// GET /admin/email-templates
export const listEmailTemplates = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const customs = await prisma.emailTemplate.findMany();
    const customByType = Object.fromEntries(customs.map((t) => [t.type, t]));

    const result = (Object.keys(EMAIL_TEMPLATE_META) as TypeEmailTemplate[]).map((type) => {
      const defaults = EMAIL_TEMPLATE_DEFAULTS[type];
      const custom = customByType[type] ?? null;
      return {
        type,
        ...EMAIL_TEMPLATE_META[type],
        customise: !!custom,
        actif: custom?.actif ?? true,
        defaultValues: defaults,
        customValues: custom
          ? {
              sujet: custom.sujet,
              titre: custom.titre,
              intro: custom.intro,
              corps: custom.corps,
              closing: custom.closing,
              ctaLabel: custom.ctaLabel,
            }
          : null,
        effectiveValues: buildEffectiveValues(defaults, custom),
        template: custom ?? null,
      };
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
};

// GET /admin/email-templates/:type
export const getEmailTemplate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type } = req.params as { type: TypeEmailTemplate };
    const meta = EMAIL_TEMPLATE_META[type];
    if (!meta) {
      res.status(404).json({ message: 'Type de template introuvable' });
      return;
    }
    const defaults = EMAIL_TEMPLATE_DEFAULTS[type];
    const template = await prisma.emailTemplate.findUnique({ where: { type } });
    res.json({
      type,
      ...meta,
      defaultValues: defaults,
      customValues: template
        ? {
            sujet: template.sujet,
            titre: template.titre,
            intro: template.intro,
            corps: template.corps,
            closing: template.closing,
            ctaLabel: template.ctaLabel,
          }
        : null,
      effectiveValues: buildEffectiveValues(defaults, template ?? null),
      template,
    });
  } catch (err) {
    next(err);
  }
};

// PUT /admin/email-templates/:type  (upsert)
export const upsertEmailTemplate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type } = req.params as { type: TypeEmailTemplate };
    const data = req.body as {
      sujet?: string | null;
      titre?: string | null;
      intro?: string | null;
      corps?: string | null;
      closing?: string | null;
      ctaLabel?: string | null;
      actif?: boolean;
    };

    const template = await prisma.emailTemplate.upsert({
      where: { type },
      create: { type, ...data },
      update: data,
    });

    res.json(template);
  } catch (err) {
    next(err);
  }
};

// DELETE /admin/email-templates/:type  (réinitialiser aux valeurs par défaut)
export const resetEmailTemplate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type } = req.params as { type: TypeEmailTemplate };
    await prisma.emailTemplate.deleteMany({ where: { type } });
    res.json({ message: 'Template réinitialisé aux valeurs par défaut' });
  } catch (err) {
    next(err);
  }
};
