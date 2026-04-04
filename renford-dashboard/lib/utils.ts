import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { MEDIA_BASE_URL } from "./env";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getErrorMessage = (error: unknown): string => {
  let message: string;

  if (error instanceof Error) {
    message = error.message;
  } else if (error && typeof error === "object" && "message" in error) {
    message = String(error.message);
  } else if (typeof error === "string") {
    message = error;
  } else {
    message = "Une erreur s'est produite";
  }

  return message;
};
export const generateCode = () =>
  Math.floor(Math.random() * 899999 + 100000).toString();

export const fakePromise = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("There was a problem with the server, please try again.");
    }, 10000);
  });
};

export const slice = (text: string, length: number) => {
  if (text.length < length) return text;
  return text.slice(0, length) + "...";
};

export const getUrl = (path: string | undefined | null) => {
  if (!path) return "";
  return `${MEDIA_BASE_URL}/${path}`;
};

export const numberRegex = /^-?\d*\.?\d*$/;

export const formatAmount = (
  value: number | string | null | undefined,
  suffix = "€"
) => {
  if (value === null || value === undefined) return "-";

  const parsed = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(parsed)) return "-";

  const formatted = new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: Number.isInteger(parsed) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(parsed);

  return `${formatted}${suffix}`;
};

export const formatFrenchDate = (
  value: Date | string | null | undefined,
  fallback = "-",
  year: "2-digit" | "numeric" = "2-digit",
) => {
  if (!value) return fallback;

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year,
  }).format(date);
};

export const formatYear = (
  value: Date | string | null | undefined,
  fallback = "-",
) => {
  if (!value) return fallback;

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;

  return date.getFullYear().toString();
};

export const formatDurationHours = (
  value: number | null | undefined,
  fallback = "-",
) => {
  if (!Number.isFinite(value) || !value || value <= 0) return fallback;

  const hours = value as number;
  return `${hours.toLocaleString("fr-FR", {
    minimumFractionDigits: Number.isInteger(hours) ? 0 : 1,
    maximumFractionDigits: 1,
  })}h`;
};

export const getInitials = (name?: string | null) => {
  if (!name) return "-";
  const parts = name.trim().split(" ").filter(Boolean);
  if (!parts.length) return "-";
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
};
