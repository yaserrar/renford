"use client";

import Image from "next/image";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  SlidersHorizontal,
  Star,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { H2 } from "@/components/ui/typography";

type MissionCard = {
  id: string;
  title: string;
  coachName: string;
  coachRole: string;
  coachAvatar: string;
  period: string;
  duration: string;
  amountLabel: string;
  statusLabel: string;
  statusTone:
    | "payment"
    | "search"
    | "candidates"
    | "signature"
    | "active"
    | "replacement"
    | "done";
  rating?: number;
  review?: string;
};

const EN_RECHERCHE_MISSIONS: MissionCard[] = [
  {
    id: "m-1",
    title: "Coach de yoga",
    coachName: "Jessica",
    coachRole: "Coach de yoga",
    coachAvatar: "/planning-people/coach1.jpg",
    period: "Mission du 01/01/25 au 25/40/25",
    duration: "31,5h",
    amountLabel: "30 €",
    statusLabel: "Candidature(s) disponible(s)",
    statusTone: "candidates",
  },
  {
    id: "m-2",
    title: "Coach de yoga",
    coachName: "-",
    coachRole: "Coach de yoga",
    coachAvatar: "/logo-dark.png",
    period: "Mission du 01/01/25 au 25/40/25",
    duration: "31,5h",
    amountLabel: "30 €",
    statusLabel: "En recherche",
    statusTone: "search",
  },
  {
    id: "m-3",
    title: "Coach de yoga",
    coachName: "Jessica",
    coachRole: "Coach de yoga",
    coachAvatar: "/planning-people/coach1.jpg",
    period: "Mission du 01/01/25 au 25/40/25",
    duration: "31,5h",
    amountLabel: "30 €",
    statusLabel: "Attente de signature",
    statusTone: "signature",
  },
];

const CONFIRMEES_MISSIONS: MissionCard[] = [
  {
    id: "c-1",
    title: "Coach Pilates",
    coachName: "Jessica",
    coachRole: "Coach de yoga",
    coachAvatar: "/planning-people/coach1.jpg",
    period: "Mission du 01/01/25 au 25/40/25",
    duration: "31,5h",
    amountLabel: "30 €",
    statusLabel: "Mission en cours",
    statusTone: "active",
  },
  {
    id: "c-2",
    title: "Coach Pilates",
    coachName: "Jessica",
    coachRole: "Coach de yoga",
    coachAvatar: "/planning-people/coach2.jpeg",
    period: "Mission du 01/01/25 au 25/40/25",
    duration: "31,5h",
    amountLabel: "30 €",
    statusLabel: "Remplacement en cours",
    statusTone: "replacement",
  },
  {
    id: "c-3",
    title: "Coach Pilates",
    coachName: "Jessica",
    coachRole: "Coach de yoga",
    coachAvatar: "/planning-people/coach3.jpg",
    period: "Mission du 01/01/25 au 25/40/25",
    duration: "31,5h",
    amountLabel: "30 €",
    statusLabel: "Mission terminee",
    statusTone: "done",
  },
];

const TERMINEES_MISSIONS: MissionCard[] = [
  {
    id: "t-1",
    title: "Coach de yoga",
    coachName: "Jessica",
    coachRole: "Coach de yoga",
    coachAvatar: "/planning-people/coach1.jpg",
    period: "Mission du 01/01 au 25/40",
    duration: "31,5h",
    amountLabel: "30 €",
    statusLabel: "Terminee",
    statusTone: "done",
  },
  {
    id: "t-2",
    title: "Coach de yoga",
    coachName: "Jessica",
    coachRole: "Coach de yoga",
    coachAvatar: "/planning-people/coach1.jpg",
    period: "Mission du 01/01 au 25/40",
    duration: "31,5h",
    amountLabel: "30 €",
    statusLabel: "Terminee",
    statusTone: "done",
    rating: 4,
    review: "Excellente coach, peut etre quelques efforts sur les horaires",
  },
];

const statusToneClasses: Record<MissionCard["statusTone"], string> = {
  payment: "bg-destructive/10 text-destructive",
  search: "bg-primary/30 text-primary-dark",
  candidates: "bg-secondary/10 text-secondary",
  signature: "bg-secondary/20 text-secondary-dark",
  active: "bg-secondary/10 text-secondary",
  replacement: "bg-destructive/10 text-destructive",
  done: "bg-primary/20 text-primary-dark",
};

function MissionStatusBadge({ mission }: { mission: MissionCard }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-medium ${statusToneClasses[mission.statusTone]}`}
    >
      {mission.statusLabel}
    </span>
  );
}

function MissionCardRow({ mission }: { mission: MissionCard }) {
  return (
    <article className="rounded-3xl border border-border bg-white px-4 py-4 md:px-5 md:py-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="relative mt-0.5 h-12 w-12 shrink-0 overflow-hidden rounded-full bg-muted">
            <Image
              src={mission.coachAvatar}
              alt={mission.coachName}
              fill
              className="object-cover"
            />
          </div>

          <div className="min-w-0 space-y-1">
            <p className="text-xl leading-tight font-semibold text-foreground md:text-2xl">
              {mission.title}
            </p>
            <p className="text-sm text-muted-foreground">{mission.coachName}</p>

            <div className="pt-2 text-sm text-foreground">
              <p className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                {mission.period}
              </p>
              <p className="inline-flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-muted-foreground" />
                {mission.duration}
              </p>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-row items-end justify-between gap-3 md:flex-col md:items-end">
          <MissionStatusBadge mission={mission} />

          <div className="space-y-2 text-right">
            <div className="inline-flex items-center gap-2 text-foreground">
              <span className="text-2xl font-semibold">
                {mission.amountLabel}
              </span>
              <span className="text-sm text-muted-foreground">HT</span>
            </div>

            <Button className="h-9 rounded-full bg-foreground px-4 text-sm text-white hover:bg-foreground/90">
              Detail
            </Button>
          </div>
        </div>
      </div>

      {typeof mission.rating === "number" && (
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1 text-primary-dark">
            {[1, 2, 3, 4, 5].map((index) => (
              <Star
                key={index}
                className={`h-4 w-4 ${index <= (mission.rating ?? 0) ? "fill-primary-dark text-primary-dark" : "text-muted"}`}
              />
            ))}
          </div>
          <p>{mission.review}</p>
        </div>
      )}
    </article>
  );
}

function MissionsPanel({
  missions,
  showPagination = false,
}: {
  missions: MissionCard[];
  showPagination?: boolean;
}) {
  return (
    <div className="space-y-4">
      {missions.map((mission) => (
        <MissionCardRow key={mission.id} mission={mission} />
      ))}

      {showPagination && (
        <div className="flex items-center justify-between pt-4">
          <Button variant="outline" className="rounded-full px-5 text-base">
            <ChevronLeft className="h-4 w-4" />
            Precedent
          </Button>

          <div className="inline-flex items-center gap-5 text-base text-foreground">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white border border-border">
              1
            </span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
          </div>

          <Button variant="outline" className="rounded-full px-5 text-base">
            Suivant
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

export default function EtablissementMissionsPage() {
  return (
    <main className="mt-8 space-y-6">
      <div className="w-full space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <H2>Liste des missions</H2>
          <Button variant="outline" className="rounded-full px-5 text-base">
            <SlidersHorizontal className="h-4 w-4" />
            Filtres
          </Button>
        </div>

        <Tabs defaultValue="en-recherche" className="w-full">
          <TabsList>
            <TabsTrigger value="en-recherche" className="px-4">
              En recherche
            </TabsTrigger>
            <TabsTrigger value="confirmees" className="px-4">
              Confirmees
            </TabsTrigger>
            <TabsTrigger value="terminees" className="px-4">
              Terminees
            </TabsTrigger>
          </TabsList>

          <div className="bg-secondary-background rounded-3xl border m-1 p-4 md:p-6 h-full">
            <TabsContent value="en-recherche">
              <MissionsPanel missions={EN_RECHERCHE_MISSIONS} showPagination />
            </TabsContent>

            <TabsContent value="confirmees">
              <MissionsPanel missions={CONFIRMEES_MISSIONS} />
            </TabsContent>

            <TabsContent value="terminees">
              <MissionsPanel missions={TERMINEES_MISSIONS} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </main>
  );
}
