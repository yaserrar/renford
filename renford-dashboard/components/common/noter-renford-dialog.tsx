"use client";

import { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type NoterRenfordDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  renfordPrenom: string;
  onSubmit: (data: { note: number; commentaire?: string }) => void;
  isPending?: boolean;
};

export default function NoterRenfordDialog({
  open,
  onOpenChange,
  renfordPrenom,
  onSubmit,
  isPending,
}: NoterRenfordDialogProps) {
  const [note, setNote] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [commentaire, setCommentaire] = useState("");

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      setNote(0);
      setHoveredStar(0);
      setCommentaire("");
    }
    onOpenChange(value);
  };

  const handleSubmit = () => {
    if (note < 1) return;
    onSubmit({
      note,
      commentaire: commentaire.trim() || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            Noter {renfordPrenom}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Star rating */}
          <div className="flex justify-center gap-1">
            {Array.from({ length: 5 }, (_, i) => {
              const starValue = i + 1;
              const isFilled = starValue <= (hoveredStar || note);
              return (
                <button
                  key={i}
                  type="button"
                  className="cursor-pointer p-0.5 transition-transform hover:scale-110"
                  onClick={() => setNote(starValue)}
                  onMouseEnter={() => setHoveredStar(starValue)}
                  onMouseLeave={() => setHoveredStar(0)}
                  aria-label={`${starValue} étoile${starValue > 1 ? "s" : ""}`}
                >
                  <Star
                    size={36}
                    className={cn(
                      "transition-colors",
                      isFilled
                        ? "fill-amber-400 text-amber-400"
                        : "fill-transparent text-amber-400/40",
                    )}
                  />
                </button>
              );
            })}
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="commentaire" className="font-semibold">
              Commentaire
            </Label>
            <Textarea
              id="commentaire"
              placeholder="Quelques mots sur cette prestation...."
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              rows={4}
              maxLength={1000}
              className="resize-y"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-3 pt-1">
            <Button
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
            >
              Annuler
            </Button>
            <Button
              variant="dark"
              onClick={handleSubmit}
              disabled={note < 1 || isPending}
            >
              {isPending && <Loader2 className="animate-spin" />}
              Envoyer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
