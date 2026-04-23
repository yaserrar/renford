type BuildSmsEquivalentInput = {
  subject: string;
  text?: string;
  html?: string;
  maxLength?: number;
};

const DEFAULT_SMS_MAX_LENGTH = 320;

const collapseWhitespace = (value: string) => value.replace(/\s+/g, ' ').trim();

const stripHtml = (html: string) =>
  collapseWhitespace(
    html
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>'),
  );

export const normalizePhoneNumber = (rawValue?: string | null): string | null => {
  if (!rawValue) {
    return null;
  }

  const compact = rawValue.replace(/[\s().-]+/g, '');

  if (!compact) {
    return null;
  }

  if (compact.startsWith('00')) {
    return `+${compact.slice(2)}`;
  }

  if (compact.startsWith('+')) {
    return compact;
  }

  const digitsOnly = compact.replace(/\D/g, '');
  if (!digitsOnly) {
    return null;
  }

  return `+${digitsOnly}`;
};

const truncateForSms = (value: string, maxLength: number) => {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, Math.max(0, maxLength - 3)).trimEnd()}...`;
};

export const buildSmsEquivalentMessage = ({
  subject,
  text,
  html,
  maxLength = DEFAULT_SMS_MAX_LENGTH,
}: BuildSmsEquivalentInput): string => {
  const normalizedSubject = collapseWhitespace(subject);
  const bodyText = text ? collapseWhitespace(text) : html ? stripHtml(html) : '';

  const composed = bodyText ? `${normalizedSubject} - ${bodyText}` : normalizedSubject;

  return truncateForSms(composed || 'Notification Renford', maxLength);
};
