"use client";

import { PageHeader } from "@/components/features/admin/page-header";
import { CourseComposer } from "@/components/features/admin/courses/course-composer";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminCategories } from "@/hooks/use-categories";

export default function NewCoursePage() {
  const { data: categories, isLoading } = useAdminCategories();

  return (
    <div>
      <PageHeader
        title="Nouvelle formation"
        description="Composez une fiche formation complète et prête à convertir."
      />
      {isLoading && <Skeleton className="h-96 w-full max-w-2xl" />}
      {categories && <CourseComposer categories={categories} />}
    </div>
  );
}
