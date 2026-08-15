import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { apiClient, ApiError } from "@/lib/api-client";
import { COURSE_FORMAT_LABELS_FR, type Category, type CourseWithModules } from "@riseskill/shared";
import { ObjectivesSection } from "@/components/features/course-landing/objectives-section";
import { ProgrammeSection } from "@/components/features/course-landing/programme-section";
import { TestimonialsSection } from "@/components/features/course-landing/testimonials-section";
import { FaqSection } from "@/components/features/course-landing/faq-section";

async function getCourse(slug: string): Promise<CourseWithModules | null> {
  try {
    return await apiClient.get<CourseWithModules>(`/courses/by-slug/${slug}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export default async function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = await getCourse(params.slug);
  if (!course) {
    notFound();
  }

  const categories = await apiClient.get<Category[]>("/categories");
  const category = categories.find((c) => c.id === course.categoryId);

  return (
    <div>
      <section className="bg-brand-navy">
        <div className="mx-auto max-w-6xl px-6 py-14">
          {category && (
            <Link
              href={`/courses?category=${category.slug}`}
              className="text-sm font-medium text-brand-green-300 hover:underline"
            >
              {category.icon} {category.name}
            </Link>
          )}
          <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">{course.title}</h1>
          {course.tagline && (
            <p className="mt-2 max-w-2xl text-lg text-brand-navy-200">{course.tagline}</p>
          )}
          <div className="mt-5 flex flex-wrap gap-2">
            {course.offerings.map((offering) => (
              <span
                key={offering.id}
                className="rounded-full bg-white/10 px-3 py-1 text-sm text-white"
              >
                {COURSE_FORMAT_LABELS_FR[offering.format]}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-3">
        <div className="space-y-10 md:col-span-2">
          <div>
            <h2 className="text-xl font-bold text-brand-navy">À propos de la formation</h2>
            <p className="mt-3 text-slate-700">{course.description}</p>
          </div>

          <ObjectivesSection objectives={course.objectives} />

          <ProgrammeSection modules={course.modules} />

          {course.techStack.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-brand-navy">Technologies & outils</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {course.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          <TestimonialsSection testimonials={course.testimonials} />

          <FaqSection faqItems={course.faqItems} />
        </div>

        <aside className="h-fit space-y-5 rounded-xl2 border border-slate-200 p-6 shadow-sm">
          {course.offerings.length > 0 && (
            <div className="space-y-3">
              <span className="text-sm font-medium text-slate-500">Choisissez votre format</span>
              <div className="space-y-2">
                {course.offerings.map((offering) => (
                  <div
                    key={offering.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5"
                  >
                    <div>
                      <p className="text-sm font-semibold text-brand-navy">
                        {COURSE_FORMAT_LABELS_FR[offering.format]}
                      </p>
                      {offering.durationLabel && (
                        <p className="text-xs text-slate-500">{offering.durationLabel}</p>
                      )}
                    </div>
                    {offering.price != null && (
                      <span className="text-sm font-bold text-brand-navy">
                        {offering.price.toLocaleString("fr-FR")} {offering.currency}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {course.level && (
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Niveau</dt>
                <dd className="font-medium text-slate-700">{course.level}</dd>
              </div>
            </dl>
          )}
          <Link href={`/contact?course=${course.slug}`} className="block">
            <Button className="w-full">Demander une inscription</Button>
          </Link>
        </aside>
      </section>
    </div>
  );
}
