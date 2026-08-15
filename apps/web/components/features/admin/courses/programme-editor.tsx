"use client";

import { useState, type FormEvent } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
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
import {
  useCreateCourseModule,
  useCourseModules,
  useDeleteCourseModule,
} from "@/hooks/use-course-modules";
import { useCreateLesson, useDeleteLesson, useLessons } from "@/hooks/use-lessons";

function LessonsPanel({ moduleId }: { moduleId: string }) {
  const { data: lessons, isLoading } = useLessons(moduleId, true);
  const createLesson = useCreateLesson(moduleId);
  const deleteLesson = useDeleteLesson(moduleId);

  function handleAddLesson(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;
    if (!title.trim()) return;

    createLesson.mutate(
      { title, content: (formData.get("content") as string) || undefined },
      {
        onSuccess: () => event.currentTarget?.reset(),
        onError: () => toast.error("Impossible d'ajouter la leçon."),
      },
    );
  }

  function handleDeleteLesson(id: string) {
    deleteLesson.mutate(id, { onError: () => toast.error("Impossible de supprimer cette leçon.") });
  }

  if (isLoading) {
    return <Skeleton className="m-4 h-16" />;
  }

  return (
    <div className="space-y-3 border-t bg-muted/30 p-4">
      {!lessons?.length ? (
        <p className="text-sm text-muted-foreground">Aucune leçon.</p>
      ) : (
        <ul className="space-y-2">
          {lessons.map((lesson) => (
            <li
              key={lesson.id}
              className="flex items-center justify-between rounded-md bg-background px-3 py-2 text-sm shadow-sm"
            >
              <span>{lesson.title}</span>
              <Button variant="ghost" size="icon" onClick={() => handleDeleteLesson(lesson.id)}>
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
              </Button>
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={handleAddLesson} className="flex gap-2">
        <Input name="title" required placeholder="Titre de la leçon" className="flex-1" />
        <Input name="content" placeholder="Contenu (optionnel)" className="flex-1" />
        <Button type="submit" size="sm" disabled={createLesson.isPending}>
          <Plus className="h-4 w-4" />
          Ajouter
        </Button>
      </form>
    </div>
  );
}

export function ProgrammeEditor({ courseId }: { courseId: string }) {
  const { data: modules, isLoading } = useCourseModules(courseId);
  const createModule = useCreateCourseModule(courseId);
  const deleteModule = useDeleteCourseModule(courseId);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  function handleAddModule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;
    if (!title.trim()) return;

    createModule.mutate(title, {
      onSuccess: () => event.currentTarget?.reset(),
      onError: () => toast.error("Impossible d'ajouter le module."),
    });
  }

  function handleDeleteModule() {
    if (!pendingDeleteId) return;
    deleteModule.mutate(pendingDeleteId, {
      onSuccess: () => {
        toast.success("Module supprimé.");
        setPendingDeleteId(null);
      },
      onError: () => toast.error("Impossible de supprimer ce module."),
    });
  }

  if (isLoading) {
    return <Skeleton className="h-32 w-full" />;
  }

  return (
    <div className="space-y-4">
      {!modules?.length && (
        <p className="text-sm text-muted-foreground">Aucun module pour l&apos;instant.</p>
      )}
      <ul className="space-y-3">
        {modules?.map((courseModule, index) => {
          const isExpanded = expandedId === courseModule.id;
          return (
            <li key={courseModule.id} className="overflow-hidden rounded-xl border bg-background">
              <div className="flex items-center justify-between px-4 py-3">
                <span className="font-medium text-foreground">
                  {index + 1}. {courseModule.title}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedId(isExpanded ? null : courseModule.id)}
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                    Leçons
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setPendingDeleteId(courseModule.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
              {isExpanded && <LessonsPanel moduleId={courseModule.id} />}
            </li>
          );
        })}
      </ul>

      <form onSubmit={handleAddModule} className="flex gap-2">
        <Input name="title" required placeholder="Titre du nouveau module" className="flex-1" />
        <Button type="submit" disabled={createModule.isPending}>
          <Plus className="h-4 w-4" />
          Ajouter un module
        </Button>
      </form>

      <AlertDialog
        open={!!pendingDeleteId}
        onOpenChange={(open) => !open && setPendingDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce module ?</AlertDialogTitle>
            <AlertDialogDescription>
              Toutes ses leçons seront supprimées avec lui. Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteModule}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
