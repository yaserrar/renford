"use client";

import { Download } from "lucide-react";

type DocumentItem = {
  id: string;
  label: string;
  date: string;
  disabled?: boolean;
  disabledReason?: string;
};

type DocumentCategoryCardProps = {
  title: string;
  documents: DocumentItem[];
  onDownload: (documentId: string) => void;
  isDownloading?: boolean;
};

export default function DocumentCategoryCard({
  title,
  documents,
  onDownload,
  isDownloading,
}: DocumentCategoryCardProps) {
  return (
    <section className="rounded-3xl border border-border/90 bg-white p-4 md:p-6">
      <h3 className="text-xl font-semibold text-foreground">{title}</h3>

      <div className="mt-4 space-y-3">
        {documents.map((document) => (
          <button
            type="button"
            key={document.id}
            onClick={() => onDownload(document.id)}
            disabled={document.disabled || isDownloading}
            title={document.disabledReason}
            className="flex w-full items-center gap-3 rounded-lg px-2 py-1 text-left disabled:cursor-not-allowed disabled:opacity-50"
          >
            <div className="text-foreground">
              <Download className="h-5 w-5" />
            </div>
            <p className="text-base font-normal text-foreground">
              {document.label}
            </p>
            <p className="text-sm text-muted-foreground">{document.date}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
