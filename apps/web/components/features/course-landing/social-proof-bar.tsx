import type { CourseTestimonial } from "@riseskill/shared";

export function SocialProofBar({
  enrolledCount,
  testimonials,
}: {
  enrolledCount: number | null;
  testimonials: CourseTestimonial[];
}) {
  const rated = testimonials.filter((t) => t.rating != null);
  const averageRating =
    rated.length > 0
      ? rated.reduce((sum, t) => sum + (t.rating as number), 0) / rated.length
      : null;

  if (enrolledCount == null && averageRating == null) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 bg-brand-navy-50 px-6 py-3 text-sm font-medium text-brand-navy-800">
      {enrolledCount != null && (
        <span>👥 {enrolledCount.toLocaleString("fr-FR")} personnes déjà inscrites</span>
      )}
      {averageRating != null && (
        <span>
          ⭐ {averageRating.toFixed(1)}/5 ({rated.length} avis)
        </span>
      )}
    </div>
  );
}
