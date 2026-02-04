"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type SelectionBarProps = {
  selectedCount: number;
  onClear: () => void;
};

export function SelectionBar({ selectedCount, onClear }: SelectionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 shadow-[0px_-9px_34px_-5px_rgba(38,_60,_110,_0.3)] animate-in slide-in-from-bottom-5">
      <div className="bg-primary-background border-t border-gray-200 py-6 px-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-primary">
                {selectedCount}
              </span>
              <span className="text-lg font-semibold text-primary">
                lignes sélectionnées
              </span>
            </div>

            <div className="flex gap-3">
              <Button variant="default">Action sur la sélection</Button>
              <Button variant="outline" onClick={onClear}>
                <X size={16} />
                Effacer la sélection
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
