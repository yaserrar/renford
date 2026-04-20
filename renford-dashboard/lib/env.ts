export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL as string;
export const MEDIA_BASE_URL = process.env.NEXT_PUBLIC_MEDIA_URL as string;
export const GOOGLE_MAPS_API_KEY = process.env
  .NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;
export const STRIPE_PUBLISHABLE_KEY = process.env
  .NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string;

const parsedCommissionPercent = Number(
  process.env.NEXT_PUBLIC_PLATFORM_COMMISSION_PERCENT ?? 15,
);

export const PLATFORM_COMMISSION_PERCENT = Number.isFinite(
  parsedCommissionPercent,
)
  ? parsedCommissionPercent
  : 15;

export const COACH_FEE_HT = Number(process.env.NEXT_PUBLIC_COACH_FEE_HT ?? 375);
