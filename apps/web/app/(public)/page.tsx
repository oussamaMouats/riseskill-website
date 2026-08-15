import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CoursesGrid } from "@/components/features/courses-grid";
import { apiClient } from "@/lib/api-client";
import type { Category, CourseWithOfferings } from "@riseskill/shared";

interface PaginatedCourses {
  items: CourseWithOfferings[];
  total: number;
  page: number;
  limit: number;
}

export default async function HomePage() {
  const [categories, coursesPage] = await Promise.all([
    apiClient.get<Category[]>("/categories"),
    apiClient.get<PaginatedCourses>("/courses?published=true&limit=3"),
  ]);

  return (
    <div>
      <section className="bg-brand-navy">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center">
          <div className="space-y-6">
            <span className="inline-block rounded-full bg-brand-green/20 px-3 py-1 text-sm font-medium text-brand-green-300">
              Centre de formation — Skikda
            </span>
            <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl">
              Développez vos compétences avec Rise Skill
            </h1>
            <p className="text-lg text-brand-navy-200">
              Formations en présentiel, en ligne en direct ou à votre rythme. Choisissez le format
              qui vous convient et lancez-vous.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/courses">
                <Button>Voir les formations</Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="border-white/30 bg-transparent text-white hover:bg-white/10"
                >
                  Nous contacter
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden justify-self-end md:block">
            <div className="grid w-full max-w-sm gap-3 rounded-xl2 bg-white p-6 shadow-2xl">
              <p className="text-sm font-semibold text-brand-navy">Au programme</p>
              {[
                "Formations pratiques",
                "Formateurs expérimentés",
                "Suivi de progression",
                "Certificat à la clé",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-slate-700">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-green text-xs text-white">
                    ✓
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-brand-navy">Nos catégories</h2>
            <p className="mt-1 text-slate-600">Explorez nos formations par domaine.</p>
          </div>
        </div>
        {categories.length === 0 ? (
          <p className="text-sm text-slate-500">Aucune catégorie pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/courses?category=${category.slug}`}
                className="group rounded-xl2 border border-slate-200 p-5 transition-shadow hover:shadow-lg"
              >
                {category.icon && <span className="text-3xl">{category.icon}</span>}
                <h3 className="mt-3 font-semibold text-brand-navy group-hover:text-brand-green-700">
                  {category.name}
                </h3>
                {category.description && (
                  <p className="mt-1 text-sm text-slate-600">{category.description}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-brand-navy">Formations à la une</h2>
              <p className="mt-1 text-slate-600">Nos formations les plus récentes.</p>
            </div>
            <Link
              href="/courses"
              className="text-sm font-semibold text-brand-green-700 hover:underline"
            >
              Voir tout →
            </Link>
          </div>
          <CoursesGrid courses={coursesPage.items} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 text-center">
        <h2 className="text-2xl font-bold text-brand-navy">Prêt à commencer ?</h2>
        <p className="mx-auto mt-2 max-w-lg text-slate-600">
          Déposez une demande d&apos;inscription — présentiel, en ligne en direct ou à votre rythme,
          notre équipe vous répond rapidement.
        </p>
        <Link href="/contact" className="mt-6 inline-block">
          <Button>Demander une inscription</Button>
        </Link>
      </section>
    </div>
  );
}
