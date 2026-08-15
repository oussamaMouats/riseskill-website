"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCreateCategory } from "@/hooks/use-categories";

const categoryFormSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  icon: z.string().optional(),
  description: z.string().optional(),
});
type CategoryFormValues = z.infer<typeof categoryFormSchema>;

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function CategoryForm() {
  const createCategory = useCreateCategory();
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: { name: "", icon: "", description: "" },
  });

  function onSubmit(values: CategoryFormValues) {
    createCategory.mutate(
      { ...values, slug: slugify(values.name) },
      {
        onSuccess: () => {
          toast.success("Catégorie créée.");
          form.reset();
        },
        onError: () => toast.error("Impossible de créer la catégorie (slug déjà utilisé ?)."),
      },
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-wrap items-end gap-3 rounded-xl border bg-background p-4"
      >
        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem className="w-20">
              <FormLabel className="text-xs text-muted-foreground">Icône</FormLabel>
              <FormControl>
                <Input placeholder="💻" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel className="text-xs text-muted-foreground">Nom</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel className="text-xs text-muted-foreground">Description</FormLabel>
              <FormControl>
                <Textarea rows={1} className="min-h-9" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={createCategory.isPending}>
          {createCategory.isPending ? "Ajout..." : "Ajouter"}
        </Button>
      </form>
    </Form>
  );
}
