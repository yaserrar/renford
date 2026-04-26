"use client";

import { DataTable } from "@/components/table/data-table";
import { useAdminEmailTemplates } from "@/hooks/email-templates";
import { emailTemplatesColumns } from "./columns";

export default function AdminEmailsPage() {
  const { data = [], isLoading } = useAdminEmailTemplates();

  return (
    <main className="min-h-screen bg-secondary-background rounded-2xl m-1 px-4 md:px-8 py-6 md:py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Templates d&apos;emails</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Personnalisez les textes des emails envoyés par la plateforme.
          Utilisez{" "}
          <code className="bg-muted px-1 rounded text-xs font-mono">
            {"{{nomVariable}}"}
          </code>{" "}
          pour insérer des données dynamiques.
        </p>
      </div>
      <DataTable
        columns={emailTemplatesColumns}
        data={data}
        isLoading={isLoading}
        hidePadding
        title="Tous les templates"
        description="Les templates marqués Défaut utilisent les textes codés dans le système."
        exportFileName="email-templates"
      />
    </main>
  );
}
