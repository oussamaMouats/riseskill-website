import Link from "next/link";
import { CoursesGrid } from "@/components/features/courses-grid";
import { apiClient } from "@/lib/api-client";
import {
  COURSE_FORMAT_LABELS_FR,
  type Category,
  type CourseFormat,
  type CourseWithOfferings,
} from "@riseskill/shared";

interface PaginatedCourses {
  items: CourseWithOfferings[];
  total: number;
  page: number;
  limit: number;
}

interface CoursesPageProps {
  searchParams: { category?: string; format?: string };
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const { category: categorySlug, format } = searchParams;

  const categories = await apiClient.get<Category[]>("/categories");
  const category = categorySlug ? categories.find((c) => c.slug === categorySlug) : undefined;

  const params = new URLSearchParams({ published: "true", limit: "50" });
  if (category) params.set("categoryId", category.id);
  if (format) params.set("format", format);

  const coursesPage = await apiClient.get<PaginatedCourses>(`/courses?${params.toString()}`);
  const formatEntries = Object.entries(COURSE_FORMAT_LABELS_FR) as [CourseFormat, string][];

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-6 py-12">
      <div>
        <h1 className="text-3xl font-bold text-brand-navy">Nos formations</h1>
        <p className="mt-2 text-slate-600">
          Présentiel, en ligne en direct ou à votre rythme — trouvez la formation qui vous convient.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/courses"
          className={`rounded-full px-3 py-1.5 text-sm font-medium ${
            !categorySlug
              ? "bg-brand-navy text-white"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          Toutes les catégories
        </Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/courses?category=${c.slug}${format ? `&format=${format}` : ""}`}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${
              categorySlug === c.slug
                ? "bg-brand-navy text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {c.icon} {c.name}
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href={categorySlug ? `/courses?category=${categorySlug}` : "/courses"}
          className={`rounded-full border px-3 py-1.5 text-sm font-medium ${
            !format
              ? "border-brand-green bg-brand-green-50 text-brand-green-700"
              : "border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          Tous les formats
        </Link>
        {formatEntries.map(([value, label]) => (
          <Link
            key={value}
            href={`/courses?format=${value}${categorySlug ? `&category=${categorySlug}` : ""}`}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium ${
              format === value
                ? "border-brand-green bg-brand-green-50 text-brand-green-700"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      <CoursesGrid courses={coursesPage.items} />
    </div>
  );
}
