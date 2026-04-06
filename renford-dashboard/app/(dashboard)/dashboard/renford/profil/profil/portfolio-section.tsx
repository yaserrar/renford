"use client";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getUrl } from "@/lib/utils";
import { CurrentUser } from "@/types/utilisateur";
import { Pencil } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import PortfolioEditDialog from "./portfolio-edit-dialog";

type PortfolioSectionProps = {
  me: CurrentUser | undefined;
};

export default function PortfolioSection({ me }: PortfolioSectionProps) {
  const profil = me?.profilRenford;
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <PortfolioEditDialog open={editOpen} setOpen={setEditOpen} me={me} />

      <div className="bg-white rounded-3xl border border-input p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Portfolio & réalisations</h3>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setEditOpen(true)}
          >
            <Pencil />
          </Button>
        </div>

        {(profil?.portfolio ?? []).length ? (
          <div className="px-8">
            <Carousel opts={{ loop: true }}>
              <CarouselContent>
                {(profil?.portfolio ?? []).map((item, index) => (
                  <CarouselItem key={`${item}-${index}`} className="basis-full">
                    <div className="relative w-full max-w-xl mx-auto aspect-[4/3] overflow-hidden rounded-2xl border border-input bg-muted/30">
                      <Image
                        src={getUrl(item)}
                        alt={`Portfolio ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 90vw, 640px"
                        className="object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-0" />
              <CarouselNext className="right-0" />
            </Carousel>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">-</p>
        )}
      </div>
    </>
  );
}
