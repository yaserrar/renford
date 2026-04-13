"use client";

import { Button } from "@/components/ui/button";
import { useAdmins } from "@/hooks/admin";
import { useCurrentAdminUser } from "@/hooks/admin-auth";
import type { AdminListItem } from "@/types/admin";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { DataTable } from "@/components/table/data-table";
import { getColumns } from "./columns";
import CreateAdminDialog from "./create-admin-dialog";
import DeleteAdminDialog from "./delete-admin-dialog";
import EditAdminDialog from "./edit-admin-dialog";
import EditPasswordDialog from "./edit-password-dialog";

export default function AdminsPage() {
  const { data: admins = [], isLoading } = useAdmins();
  const { data: currentUser } = useCurrentAdminUser();

  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminListItem | null>(null);
  const [passwordTarget, setPasswordTarget] = useState<AdminListItem | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] = useState<AdminListItem | null>(null);

  const columns = useMemo(
    () =>
      getColumns({
        onEdit: setEditTarget,
        onPassword: setPasswordTarget,
        onDelete: setDeleteTarget,
        currentUserId: currentUser?.id,
      }),
    [currentUser?.id],
  );

  return (
    <main className="min-h-screen bg-secondary-background rounded-2xl m-1 px-4 md:px-8 py-6 md:py-8">
      <div className="mx-auto w-full space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Administrateurs</h1>
          <Button onClick={() => setShowCreate(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Ajouter
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={admins}
          isLoading={isLoading}
          exportFileName="administrateurs"
          hidePadding
        />
      </div>

      <CreateAdminDialog open={showCreate} onOpenChange={setShowCreate} />

      {editTarget && (
        <EditAdminDialog
          open={!!editTarget}
          onOpenChange={(open) => !open && setEditTarget(null)}
          admin={editTarget}
        />
      )}

      {passwordTarget && (
        <EditPasswordDialog
          open={!!passwordTarget}
          onOpenChange={(open) => !open && setPasswordTarget(null)}
          adminId={passwordTarget.id}
          adminName={`${passwordTarget.prenom} ${passwordTarget.nom}`}
        />
      )}

      {deleteTarget && (
        <DeleteAdminDialog
          open={!!deleteTarget}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
          adminId={deleteTarget.id}
          adminName={`${deleteTarget.prenom} ${deleteTarget.nom}`}
        />
      )}
    </main>
  );
}
