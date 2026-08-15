"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/features/admin/page-header";
import { DataTable } from "@/components/features/admin/data-table";
import { courseColumns } from "@/components/features/admin/courses/columns";
import { useAdminCourses } from "@/hooks/use-courses";

export default function AdminCoursesPage() {
  const { data, isLoading, isError } = useAdminCourses();

  return (
    <div>
      <PageHeader
        title="Formations"
        description="Gérez le catalogue de formations du centre."
        action={
          <Link href="/admin/courses/new">
            <Button>
              <Plus className="h-4 w-4" />
              Nouvelle formation
            </Button>
          </Link>
        }
      />

      {isLoading && (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full max-w-sm" />
          <Skeleton className="h-64 w-full" />
        </div>
      )}

      {isError && <p className="text-sm text-destructive">Impossible de charger les formations.</p>}

      {data && (
        <DataTable
          columns={courseColumns}
          data={data.items}
          searchPlaceholder="Rechercher une formation..."
          emptyMessage="Aucune formation pour le moment."
        />
      )}
    </div>
  );
}
