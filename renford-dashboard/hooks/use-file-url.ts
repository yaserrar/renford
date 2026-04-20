"use client";

import { useQuery } from "@tanstack/react-query";
import useAxios from "./axios";

/**
 * Hook to get a presigned URL for a file stored in MinIO.
 * Returns the presigned URL string (or "" while loading / on error / if no chemin).
 * Cached for 10 minutes (presigned URLs are valid for 15 min).
 */
export function useFileUrl(chemin: string | null | undefined): string {
  const axios = useAxios();

  const { data } = useQuery({
    queryKey: ["file-url", chemin],
    queryFn: async () => {
      const res = await axios.get<{ url: string }>("/upload/presigned-url", {
        params: { chemin },
      });
      return res.data.url;
    },
    enabled: !!chemin,
    staleTime: 60 * 60 * 1000, // 1h
    gcTime: 72 * 60 * 60 * 1000, // 72h
  });

  return data ?? "";
}

/**
 * Hook to resolve multiple presigned URLs at once.
 * Returns a Map<chemin, presignedUrl>.
 */
export function useFileUrls(
  chemins: (string | null | undefined)[],
): Map<string, string> {
  const axios = useAxios();
  const validChemins = chemins.filter((c): c is string => !!c);

  const results = useQuery({
    queryKey: ["file-urls", validChemins.sort().join(",")],
    queryFn: async () => {
      const entries = await Promise.all(
        validChemins.map(async (chemin) => {
          try {
            const res = await axios.get<{ url: string }>(
              "/upload/presigned-url",
              {
                params: { chemin },
              },
            );
            return [chemin, res.data.url] as const;
          } catch {
            return [chemin, ""] as const;
          }
        }),
      );
      return Object.fromEntries(entries) as Record<string, string>;
    },
    enabled: validChemins.length > 0,
    staleTime: 60 * 60 * 1000, // 1h
    gcTime: 72 * 60 * 60 * 1000, // 72h
  });

  const map = new Map<string, string>();
  if (results.data) {
    for (const [k, v] of Object.entries(results.data)) {
      map.set(k, v);
    }
  }
  return map;
}
