"use client";

import { MapPin, Receipt, Clock, RefreshCcwDot, History } from "lucide-react";
import OptionCard from "./option-card";

const OPTIONS = [
  {
    name: "Renford FLEX",
    icon: <History className="size-5" />,
    details: [
      { icon: MapPin, label: "Remplacements urgents" },
      { icon: Receipt, label: "15%/ mission" },
      { icon: Clock, label: "État : [Par défaut]", highlight: true },
    ],
    buttonLabel: "Lancer une mission",
  },
  {
    name: "Renford COACH",
    icon: <RefreshCcwDot className="size-5" />,
    details: [
      { icon: MapPin, label: "Trouver un coach pour l'année" },
      { icon: Receipt, label: "375€ par mise en relation" },
      { icon: Clock, label: "État : [Par défaut]", highlight: true },
    ],
    buttonLabel: "Trouver un coach",
  },
];

export default function OtherOptionsSection() {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-lg font-medium whitespace-nowrap">
          Autres options sans engagement
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {OPTIONS.map((option) => (
          <OptionCard key={option.name} {...option} />
        ))}
      </div>
    </section>
  );
}
