import { TypeEmailTemplate } from '@prisma/client';
import prisma from '../config/prisma';

/**
 * Replaces {{varName}} tokens in a template string with values from the vars map.
 * Unknown variables are left as-is (safe — no injection risk).
 */
export function applyVars(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? `{{${key}}}`);
}

/**
 * Looks up admin overrides for a given email type and applies dynamic variables.
 * Returns null if no customization exists or if the template is disabled.
 * Each field is null when not overridden — callers should fall back to hardcoded defaults.
 *
 * Usage (future — do not call yet, email-templates.ts is unchanged):
 *
 *   const override = await resolveEmailTemplate('abonnement_activation', {
 *     prenom, plan, quotaMissions: String(quotaMissions), ...
 *   });
 *   const titre = override?.titre ?? '(hardcoded default title)';
 */
export async function resolveEmailTemplate(
  type: TypeEmailTemplate,
  vars: Record<string, string>,
): Promise<{
  sujet: string | null;
  titre: string | null;
  intro: string | null;
  corps: string | null;
  closing: string | null;
  ctaLabel: string | null;
} | null> {
  const tpl = await prisma.emailTemplate.findUnique({ where: { type } });
  if (!tpl || !tpl.actif) return null;

  return {
    sujet: tpl.sujet ? applyVars(tpl.sujet, vars) : null,
    titre: tpl.titre ? applyVars(tpl.titre, vars) : null,
    intro: tpl.intro ? applyVars(tpl.intro, vars) : null,
    corps: tpl.corps ? applyVars(tpl.corps, vars) : null,
    closing: tpl.closing ? applyVars(tpl.closing, vars) : null,
    ctaLabel: tpl.ctaLabel ? applyVars(tpl.ctaLabel, vars) : null,
  };
}
