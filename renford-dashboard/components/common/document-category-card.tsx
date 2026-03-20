"use client";

import { Download } from "lucide-react";

type DocumentItem = {
  id: string;
  label: string;
  date: string;
};

type DocumentCategoryCardProps = {
  title: string;
  documents: DocumentItem[];
};

export default function DocumentCategoryCard({
  title,
  documents,
}: DocumentCategoryCardProps) {
  const getFileName = (label: string) => {
    const normalized = label
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    return `${normalized || "document"}.pdf`;
  };

  const handleFakeDownload = (docItem: DocumentItem) => {
    const fileName = getFileName(docItem.label);
    const fakePdfContent = [
      "%PDF-1.4",
      "% Simulated file generated from UI",
      "1 0 obj << /Type /Catalog >> endobj",
      "trailer << /Root 1 0 R >>",
      "%%EOF",
    ].join("\n");

    const blob = new Blob([fakePdfContent], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="rounded-3xl border border-border/90 bg-white p-4 md:p-6">
      <h3 className="text-xl font-semibold text-foreground">{title}</h3>

      <div className="mt-4 space-y-3">
        {documents.map((document) => (
          <button
            type="button"
            key={document.id}
            onClick={() => handleFakeDownload(document)}
            className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-2 py-1 text-left"
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
