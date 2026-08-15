"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteCategory } from "@/hooks/use-categories";
import type { Category } from "@riseskill/shared";

export function CategoryList({ categories }: { categories: Category[] }) {
  const [pendingDelete, setPendingDelete] = useState<Category | null>(null);
  const deleteCategory = useDeleteCategory();

  function handleDelete() {
    if (!pendingDelete) return;
    deleteCategory.mutate(pendingDelete.id, {
      onSuccess: () => {
        toast.success("Catégorie supprimée.");
        setPendingDelete(null);
      },
      onError: () => toast.error("Impossible de supprimer cette catégorie."),
    });
  }

  if (categories.length === 0) {
    return <p className="text-sm text-muted-foreground">Aucune catégorie pour le moment.</p>;
  }

  return (
    <>
      <ul className="divide-y rounded-xl border bg-background">
        {categories.map((category) => (
          <li key={category.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <span className="mr-2">{category.icon}</span>
              <span className="font-medium text-foreground">{category.name}</span>
              <span className="ml-2 text-xs text-muted-foreground">/{category.slug}</span>
              {category.description && (
                <p className="mt-0.5 text-sm text-muted-foreground">{category.description}</p>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={() => setPendingDelete(category)}>
              <Trash2 className="h-4 w-4 text-destructive" />
              <span className="sr-only">Supprimer</span>
            </Button>
          </li>
        ))}
      </ul>

      <AlertDialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer « {pendingDelete?.name} » ?</AlertDialogTitle>
            <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteCategory.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteCategory.isPending ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
