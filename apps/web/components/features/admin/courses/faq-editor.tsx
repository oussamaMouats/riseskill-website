"use client";

import { type FormEvent } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  useCourseFaq,
  useCreateCourseFaqItem,
  useDeleteCourseFaqItem,
} from "@/hooks/use-course-faq";

export function FaqEditor({ courseId }: { courseId: string }) {
  const { data: faqItems, isLoading } = useCourseFaq(courseId);
  const createFaqItem = useCreateCourseFaqItem(courseId);
  const deleteFaqItem = useDeleteCourseFaqItem(courseId);

  function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const question = formData.get("question") as string;
    const answer = formData.get("answer") as string;
    if (!question || !answer) return;

    createFaqItem.mutate(
      { question, answer },
      {
        onSuccess: () => event.currentTarget?.reset(),
        onError: () => toast.error("Impossible d'ajouter cette question."),
      },
    );
  }

  function handleDelete(id: string) {
    deleteFaqItem.mutate(id, {
      onError: () => toast.error("Impossible de supprimer cette question."),
    });
  }

  if (isLoading) {
    return <Skeleton className="h-32 w-full" />;
  }

  return (
    <div className="space-y-3">
      {!faqItems?.length && (
        <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
          Aucune question — une bonne FAQ lève les objections avant qu&apos;elles ne fassent fuir un
          visiteur venu d&apos;une publicité.
        </p>
      )}

      {!!faqItems?.length && (
        <Accordion type="multiple" className="rounded-md border bg-background px-3">
          {faqItems.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <div className="flex items-center gap-2">
                <AccordionTrigger className="flex-1">{item.question}</AccordionTrigger>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      <form onSubmit={handleAdd} className="space-y-2 rounded-md border border-dashed p-3">
        <Input name="question" placeholder="Question" required />
        <Textarea name="answer" placeholder="Réponse" rows={2} required />
        <Button type="submit" size="sm" disabled={createFaqItem.isPending}>
          <Plus className="h-4 w-4" />
          Ajouter
        </Button>
      </form>
    </div>
  );
}
