import { EnrollmentForm } from "@/components/features/enrollment-form";
import { apiClient } from "@/lib/api-client";
import type { Course } from "@riseskill/shared";

interface PaginatedCourses {
  items: Course[];
  total: number;
  page: number;
  limit: number;
}

export default async function ContactPage({ searchParams }: { searchParams: { course?: string } }) {
  const coursesPage = await apiClient.get<PaginatedCourses>("/courses?published=true&limit=100");

  return (
    <div className="mx-auto max-w-lg space-y-6 px-6 py-12">
      <div>
        <h1 className="text-2xl font-bold text-brand-navy">Demande d&apos;inscription</h1>
        <p className="mt-2 text-sm text-slate-600">
          Choisissez une formation et un format, notre équipe vous recontacte pour finaliser
          l&apos;inscription.
        </p>
      </div>
      <EnrollmentForm courses={coursesPage.items} preselectedSlug={searchParams.course} />
    </div>
  );
}
