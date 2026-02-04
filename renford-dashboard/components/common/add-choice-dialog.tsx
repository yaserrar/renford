"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FilePlus2, FileSpreadsheet } from "lucide-react";
import { cn } from "@/lib/utils";

type AddChoiceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  addManualLabel: string;
  uploadLabel: string;
  onAddManual: () => void;
  onUpload: () => void;
  isRTL?: boolean;
};

export function AddChoiceDialog({
  open,
  onOpenChange,
  title,
  addManualLabel,
  uploadLabel,
  onAddManual,
  onUpload,
  isRTL = false,
}: AddChoiceDialogProps) {
  const handleManualClick = () => {
    onOpenChange(false);
    onAddManual();
  };

  const handleUploadClick = () => {
    onOpenChange(false);
    onUpload();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className={cn("flex gap-4 py-4")}>
          {/* Add Manually Button */}
          <Button
            variant="outline"
            className={cn(
              "h-16 hover:border-secondary hover:bg-secondary-background"
            )}
            onClick={handleManualClick}
          >
            <div className="flex justify-center items-center bg-secondary rounded-full w-10 h-10 shrink-0">
              <FilePlus2 className="text-white" />
            </div>
            <span className="text-sm font-semibold">{addManualLabel}</span>
          </Button>

          {/* Upload Excel Button */}
          <Button
            variant="outline"
            className={cn(
              "h-16 hover:border-tertiary hover:bg-tertiary-background"
            )}
            onClick={handleUploadClick}
          >
            <div className="flex justify-center items-center bg-tertiary rounded-full w-10 h-10 shrink-0">
              <FileSpreadsheet className="text-white" />
            </div>
            <span className="text-sm font-semibold">{uploadLabel}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
