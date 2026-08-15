"use client";

import { PageHeader } from "@/components/features/admin/page-header";
import { CategoryForm } from "@/components/features/admin/categories/category-form";
import { CategoryList } from "@/components/features/admin/categories/category-list";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminCategories } from "@/hooks/use-categories";

export default function AdminCategoriesPage() {
  const { data, isLoading, isError } = useAdminCategories();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Catégories"
        description="Organisez le catalogue de formations par domaine."
      />
      <CategoryForm />
      {isLoading && <Skeleton className="h-32 w-full" />}
      {isError && <p className="text-sm text-destructive">Impossible de charger les catégories.</p>}
      {data && <CategoryList categories={data} />}
    </div>
  );
}
