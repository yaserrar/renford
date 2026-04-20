"use client";

import { useFileUrl } from "@/hooks/use-file-url";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────
 * SecureImage — <img> backed by a presigned URL
 * ────────────────────────────────────────────── */
interface SecureImageProps extends Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "src"
> {
  chemin: string | null | undefined;
}

export function SecureImage({ chemin, alt, ...props }: SecureImageProps) {
  const url = useFileUrl(chemin);
  if (!url) return null;
  return <img src={url} alt={alt ?? ""} {...props} />;
}

/* ──────────────────────────────────────────────
 * SecureAvatar — Avatar + AvatarImage + Fallback
 * ────────────────────────────────────────────── */
interface SecureAvatarProps {
  chemin: string | null | undefined;
  alt?: string;
  fallback: React.ReactNode;
  className?: string;
  imageClassName?: string;
}

export function SecureAvatar({
  chemin,
  alt,
  fallback,
  className,
  imageClassName,
}: SecureAvatarProps) {
  const url = useFileUrl(chemin);
  return (
    <Avatar className={className}>
      <AvatarImage src={url} alt={alt ?? ""} className={imageClassName} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
}

/* ──────────────────────────────────────────────
 * SecureAvatarImage — just the AvatarImage part
 * (when the parent already provides <Avatar>)
 * ────────────────────────────────────────────── */
interface SecureAvatarImageProps {
  chemin: string | null | undefined;
  alt?: string;
  className?: string;
}

export function SecureAvatarImage({
  chemin,
  alt,
  className,
}: SecureAvatarImageProps) {
  const url = useFileUrl(chemin);
  return <AvatarImage src={url} alt={alt ?? ""} className={className} />;
}

/* ──────────────────────────────────────────────
 * SecureLink — <a> that opens the presigned URL
 * ────────────────────────────────────────────── */
interface SecureLinkProps extends Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
> {
  chemin: string | null | undefined;
}

export function SecureLink({
  chemin,
  children,
  target = "_blank",
  rel = "noopener noreferrer",
  ...props
}: SecureLinkProps) {
  const url = useFileUrl(chemin);
  if (!url) return null;
  return (
    <a href={url} target={target} rel={rel} {...props}>
      {children}
    </a>
  );
}
