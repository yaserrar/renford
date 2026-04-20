"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { H2 } from "@/components/ui/typography";
import { useCreateContactMessage } from "@/hooks/contact";
import { useCurrentUser } from "@/hooks/utilisateur";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  contactMessageSchema,
  type ContactMessageSchema,
} from "@/validations/contact";
import { FAQ_RENFORD, FAQ_ETABLISSEMENT } from "./faq-data";

// ─── Page ────────────────────────────────────────────────────

export default function SupportPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: currentUser } = useCurrentUser();
  const mutation = useCreateContactMessage();

  const activeTab = useMemo(() => {
    const tab = searchParams.get("tab");
    return tab === "contact" ? "contact" : "faq";
  }, [searchParams]);

  const onTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "contact") {
      params.set("tab", "contact");
    } else {
      params.delete("tab");
    }
    const nextQuery = params.toString();
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname);
  };

  const faqItems =
    currentUser?.typeUtilisateur === "etablissement"
      ? FAQ_ETABLISSEMENT
      : FAQ_RENFORD;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactMessageSchema>({
    resolver: zodResolver(contactMessageSchema),
  });

  const onSubmit = (data: ContactMessageSchema) => {
    mutation.mutate(data, {
      onSuccess: () => reset(),
    });
  };

  return (
    <main className="mt-8 space-y-6">
      <div className="w-full space-y-4">
        <H2>Support</H2>

        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList>
            <TabsTrigger value="faq" className="px-4">
              FAQ
            </TabsTrigger>
            <TabsTrigger value="contact" className="px-4">
              Contactez-nous
            </TabsTrigger>
          </TabsList>

          <div className="bg-secondary-background m-1 h-full min-h-[520px] rounded-3xl border p-4 md:p-6">
            <TabsContent value="faq">
              <div className="mx-auto w-full max-w-3xl">
                <Accordion
                  type="single"
                  collapsible
                  className="rounded-lg border bg-white"
                >
                  {faqItems.map((item, index) => (
                    <AccordionItem key={index} value={`faq-${index}`}>
                      <AccordionTrigger className="px-4">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="px-4 text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </TabsContent>

            <TabsContent value="contact">
              <div className="mx-auto w-full max-w-3xl space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Contactez-nous :</span>
                  <a
                    href="mailto:contact@renford.fr"
                    className="font-medium text-foreground hover:underline"
                  >
                    contact@renford.fr
                  </a>
                </div>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4 rounded-lg border bg-white p-6"
                >
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={currentUser?.email ?? ""}
                      readOnly
                      className="bg-muted"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sujet">Sujet</Label>
                    <Input
                      id="sujet"
                      placeholder="Objet de votre message"
                      {...register("sujet")}
                    />
                    {errors.sujet && (
                      <p className="text-sm text-destructive">
                        {errors.sujet.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="texte">Message</Label>
                    <Textarea
                      id="texte"
                      placeholder="Décrivez votre demande..."
                      rows={6}
                      {...register("texte")}
                    />
                    {errors.texte && (
                      <p className="text-sm text-destructive">
                        {errors.texte.message}
                      </p>
                    )}
                  </div>

                  <Button type="submit" disabled={mutation.isPending}>
                    {mutation.isPending && <Loader2 className="animate-spin" />}
                    Envoyer
                  </Button>
                </form>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </main>
  );
}
