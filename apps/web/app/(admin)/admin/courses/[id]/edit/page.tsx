"use client";

import { PageHeader } from "@/components/features/admin/page-header";
import { CourseComposer } from "@/components/features/admin/courses/course-composer";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminCategories } from "@/hooks/use-categories";
import { useAdminCourse } from "@/hooks/use-courses";

export default function EditCoursePage({ params }: { params: { id: string } }) {
  const { data: course, isLoading: courseLoading, isError } = useAdminCourse(params.id);
  const { data: categories, isLoading: categoriesLoading } = useAdminCategories();

  if (isError) {
    return <p className="text-sm text-destructive">Formation introuvable.</p>;
  }

  return (
    <div>
      <PageHeader
        title={course?.title ?? "Modifier la formation"}
        description="Composez une fiche formation complète et prête à convertir."
      />
      {(courseLoading || categoriesLoading) && <Skeleton className="h-96 w-full max-w-2xl" />}
      {course && categories && <CourseComposer categories={categories} course={course} />}
    </div>
  );
}
