"use client";

import { Button } from "@/components/ui/button";
import { useAdmins } from "@/hooks/admin";
import { useCurrentUser } from "@/hooks/utilisateur";
import { formatDate, formatTime } from "@/lib/date";
import type { AdminListItem } from "@/types/admin";
import { KeyRound, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import CreateAdminDialog from "./create-admin-dialog";
import DeleteAdminDialog from "./delete-admin-dialog";
import EditAdminDialog from "./edit-admin-dialog";
import EditPasswordDialog from "./edit-password-dialog";

export default function AdminsPage() {
  const { data: admins = [], isLoading } = useAdmins();
  const { data: currentUser } = useCurrentUser();

  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminListItem | null>(null);
  const [passwordTarget, setPasswordTarget] = useState<AdminListItem | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] = useState<AdminListItem | null>(null);

  return (
    <main className="min-h-screen bg-secondary-background rounded-2xl m-1 px-4 md:px-8 py-6 md:py-8">
      <div className="mx-auto w-full space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Administrateurs</h1>
          <Button onClick={() => setShowCreate(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Ajouter
          </Button>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex h-[300px] items-center justify-center rounded-2xl bg-white">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : admins.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center rounded-2xl bg-white">
            <p className="text-sm text-muted-foreground">
              Aucun administrateur
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border bg-white">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Nom
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground hidden md:table-cell">
                    Date de création
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground hidden lg:table-cell">
                    Dernière connexion
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => {
                  const isSelf = admin.id === currentUser?.id;
                  return (
                    <tr
                      key={admin.id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium">
                          {admin.prenom} {admin.nom}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {admin.email}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">
                        {formatDate(admin.dateCreation)}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell">
                        {admin.derniereConnexion ? (
                          <span>
                            {formatDate(admin.derniereConnexion)}{" "}
                            {formatTime(new Date(admin.derniereConnexion))}
                          </span>
                        ) : (
                          "Jamais"
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditTarget(admin)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setPasswordTarget(admin)}
                          >
                            <KeyRound className="h-4 w-4" />
                          </Button>
                          {!isSelf && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteTarget(admin)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Dialogs */}
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
