"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Inbox, LayoutDashboard, Plus, Search, Tags } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useAdminCourses } from "@/hooks/use-courses";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { data: coursesPage } = useAdminCourses();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  function go(href: string) {
    router.push(href);
    setOpen(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex w-full max-w-sm items-center gap-2 rounded-md border bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted"
      >
        <Search className="h-4 w-4" />
        Rechercher...
        <kbd className="ml-auto hidden rounded border bg-background px-1.5 py-0.5 font-mono text-xs sm:inline">
          ⌘K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="Rechercher une page ou une formation..." />
          <CommandList>
            <CommandEmpty>Aucun résultat.</CommandEmpty>
            <CommandGroup heading="Navigation">
              <CommandItem onSelect={() => go("/admin")}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Tableau de bord
              </CommandItem>
              <CommandItem onSelect={() => go("/admin/courses")}>
                <BookOpen className="mr-2 h-4 w-4" />
                Formations
              </CommandItem>
              <CommandItem onSelect={() => go("/admin/courses/new")}>
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle formation
              </CommandItem>
              <CommandItem onSelect={() => go("/admin/categories")}>
                <Tags className="mr-2 h-4 w-4" />
                Catégories
              </CommandItem>
              <CommandItem onSelect={() => go("/admin/enrollment-requests")}>
                <Inbox className="mr-2 h-4 w-4" />
                Demandes d&apos;inscription
              </CommandItem>
            </CommandGroup>
            {!!coursesPage?.items.length && (
              <CommandGroup heading="Formations">
                {coursesPage.items.map((course) => (
                  <CommandItem
                    key={course.id}
                    onSelect={() => go(`/admin/courses/${course.id}/edit`)}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    {course.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
