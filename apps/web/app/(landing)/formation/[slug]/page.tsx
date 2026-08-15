import { notFound } from "next/navigation";
import { apiClient, ApiError } from "@/lib/api-client";
import type { CourseWithModules } from "@riseskill/shared";
import { PromoHero } from "@/components/features/course-landing/promo-hero";
import { SocialProofBar } from "@/components/features/course-landing/social-proof-bar";
import { ObjectivesSection } from "@/components/features/course-landing/objectives-section";
import { ProgrammeSection } from "@/components/features/course-landing/programme-section";
import { InstructorSection } from "@/components/features/course-landing/instructor-section";
import { TestimonialsSection } from "@/components/features/course-landing/testimonials-section";
import { FaqSection } from "@/components/features/course-landing/faq-section";
import { FinalCtaSection } from "@/components/features/course-landing/final-cta-section";
import { StickyMobileCtaBar } from "@/components/features/course-landing/sticky-mobile-cta-bar";

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

export default async function FormationLandingPage({ params }: { params: { slug: string } }) {
  const course = await getCourse(params.slug);
  if (!course || !course.published) {
    notFound();
  }

  return (
    <div>
      <PromoHero course={course} />
      <SocialProofBar enrolledCount={course.enrolledCount} testimonials={course.testimonials} />

      <div className="mx-auto max-w-3xl space-y-10 px-6 py-12">
        <div>
          <h2 className="text-xl font-bold text-brand-navy">À propos de la formation</h2>
          <p className="mt-3 text-slate-700">{course.description}</p>
        </div>

        <ObjectivesSection objectives={course.objectives} />
        <ProgrammeSection modules={course.modules} />
        <InstructorSection course={course} />
        <TestimonialsSection testimonials={course.testimonials} />
        <FaqSection faqItems={course.faqItems} />
        <FinalCtaSection course={course} />
      </div>

      <StickyMobileCtaBar course={course} />
    </div>
  );
}
