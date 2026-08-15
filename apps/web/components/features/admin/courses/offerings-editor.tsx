"use client";

import { useState, type FormEvent } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { COURSE_FORMAT_LABELS_FR, type CourseFormat } from "@riseskill/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCourseOfferings,
  useCreateCourseOffering,
  useDeleteCourseOffering,
} from "@/hooks/use-course-offerings";

const allFormats = Object.keys(COURSE_FORMAT_LABELS_FR) as CourseFormat[];

export function OfferingsEditor({ courseId }: { courseId: string }) {
  const { data: offerings, isLoading } = useCourseOfferings(courseId);
  const createOffering = useCreateCourseOffering(courseId);
  const deleteOffering = useDeleteCourseOffering(courseId);
  const [newFormat, setNewFormat] = useState<CourseFormat | "">("");

  const usedFormats = new Set(offerings?.map((o) => o.format));
  const availableFormats = allFormats.filter((f) => !usedFormats.has(f));

  function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newFormat) return;
    const formData = new FormData(event.currentTarget);
    const price = formData.get("price");

    createOffering.mutate(
      {
        format: newFormat,
        price: price ? Number(price) : undefined,
        durationLabel: (formData.get("durationLabel") as string) || undefined,
      },
      {
        onSuccess: () => {
          event.currentTarget?.reset();
          setNewFormat("");
        },
        onError: () => toast.error("Impossible d'ajouter cette offre."),
      },
    );
  }

  function handleDelete(id: string) {
    deleteOffering.mutate(id, {
      onError: () => toast.error("Impossible de supprimer cette offre."),
    });
  }

  if (isLoading) {
    return <Skeleton className="h-32 w-full" />;
  }

  return (
    <div className="space-y-3">
      {!offerings?.length && (
        <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
          Aucune offre pour l&apos;instant — une formation sans prix ne peut pas être vendue.
          Ajoutez au moins un format ci-dessous.
        </p>
      )}

      {!!offerings?.length && (
        <ul className="space-y-2">
          {offerings.map((offering) => (
            <li
              key={offering.id}
              className="flex items-center justify-between rounded-md border bg-background px-3 py-2 text-sm"
            >
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  {COURSE_FORMAT_LABELS_FR[offering.format]}
                </span>
                <span className="font-medium text-foreground">
                  {offering.price != null
                    ? `${offering.price.toLocaleString("fr-FR")} ${offering.currency}`
                    : "Prix non défini"}
                </span>
                {offering.durationLabel && (
                  <span className="text-muted-foreground">· {offering.durationLabel}</span>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(offering.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      {availableFormats.length > 0 && (
        <form
          onSubmit={handleAdd}
          className="flex flex-wrap items-end gap-2 rounded-md border border-dashed p-3"
        >
          <div className="w-44">
            <Select
              value={newFormat}
              onValueChange={(value) => setNewFormat(value as CourseFormat)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent>
                {availableFormats.map((format) => (
                  <SelectItem key={format} value={format}>
                    {COURSE_FORMAT_LABELS_FR[format]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Input name="price" type="number" min={0} placeholder="Prix (DZD)" className="w-32" />
          <Input name="durationLabel" placeholder="Durée (ex: 4 mois)" className="w-40" />
          <Button type="submit" size="sm" disabled={!newFormat || createOffering.isPending}>
            <Plus className="h-4 w-4" />
            Ajouter
          </Button>
        </form>
      )}
    </div>
  );
}
