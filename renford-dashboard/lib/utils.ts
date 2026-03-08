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
  value: number | null | undefined,
  suffix = "€"
) => {
  if (value === null || value === undefined) return "-";
  return `${value}${suffix}`;
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
