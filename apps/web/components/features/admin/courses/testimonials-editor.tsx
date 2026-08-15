"use client";

import { type FormEvent } from "react";
import { Plus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  useCourseTestimonials,
  useCreateCourseTestimonial,
  useDeleteCourseTestimonial,
} from "@/hooks/use-course-testimonials";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function TestimonialsEditor({ courseId }: { courseId: string }) {
  const { data: testimonials, isLoading } = useCourseTestimonials(courseId);
  const createTestimonial = useCreateCourseTestimonial(courseId);
  const deleteTestimonial = useDeleteCourseTestimonial(courseId);

  function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const authorName = formData.get("authorName") as string;
    const quote = formData.get("quote") as string;
    if (!authorName || !quote) return;
    const rating = formData.get("rating");

    createTestimonial.mutate(
      {
        authorName,
        quote,
        authorRole: (formData.get("authorRole") as string) || undefined,
        photoUrl: (formData.get("photoUrl") as string) || undefined,
        rating: rating ? Number(rating) : undefined,
      },
      {
        onSuccess: () => event.currentTarget?.reset(),
        onError: () => toast.error("Impossible d'ajouter ce témoignage."),
      },
    );
  }

  function handleDelete(id: string) {
    deleteTestimonial.mutate(id, {
      onError: () => toast.error("Impossible de supprimer ce témoignage."),
    });
  }

  if (isLoading) {
    return <Skeleton className="h-32 w-full" />;
  }

  return (
    <div className="space-y-3">
      {!testimonials?.length && (
        <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
          Aucun témoignage — les avis d&apos;anciens participants sont l&apos;un des leviers de
          conversion les plus efficaces sur une landing page. Ajoutez-en au moins un.
        </p>
      )}

      {!!testimonials?.length && (
        <ul className="space-y-2">
          {testimonials.map((testimonial) => (
            <li
              key={testimonial.id}
              className="flex items-start justify-between gap-3 rounded-md border bg-background px-3 py-2 text-sm"
            >
              <div className="flex items-start gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>{initials(testimonial.authorName)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{testimonial.authorName}</span>
                    {testimonial.authorRole && (
                      <span className="text-xs text-muted-foreground">
                        · {testimonial.authorRole}
                      </span>
                    )}
                    {testimonial.rating && (
                      <span className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-current" />
                        ))}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-muted-foreground">{testimonial.quote}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(testimonial.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAdd} className="space-y-2 rounded-md border border-dashed p-3">
        <div className="flex flex-wrap gap-2">
          <Input name="authorName" placeholder="Nom" className="w-40" required />
          <Input name="authorRole" placeholder="Rôle (ex: Développeur web)" className="w-52" />
          <Input
            name="rating"
            type="number"
            min={1}
            max={5}
            placeholder="Note (1-5)"
            className="w-28"
          />
          <Input name="photoUrl" placeholder="Photo (URL, optionnel)" className="w-52" />
        </div>
        <Textarea name="quote" placeholder="Le témoignage" rows={2} required />
        <Button type="submit" size="sm" disabled={createTestimonial.isPending}>
          <Plus className="h-4 w-4" />
          Ajouter
        </Button>
      </form>
    </div>
  );
}
