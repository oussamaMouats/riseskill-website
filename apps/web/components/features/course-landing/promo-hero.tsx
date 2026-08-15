import type { CourseWithModules } from "@riseskill/shared";
import { Button } from "@/components/ui/button";

export function PromoHero({ course }: { course: CourseWithModules }) {
  const headline = course.promoHeadline || course.title;
  const subheadline = course.promoSubheadline || course.tagline;
  const pricedOfferings = course.offerings.filter((o) => o.price != null);
  const minPrice =
    pricedOfferings.length > 0 ? Math.min(...pricedOfferings.map((o) => o.price as number)) : null;
  const currency = course.offerings[0]?.currency ?? "DZD";

  return (
    <section className="bg-brand-navy">
      <div className="mx-auto max-w-3xl px-6 py-14 text-center">
        <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl">{headline}</h1>
        {subheadline && (
          <p className="mx-auto mt-3 max-w-xl text-lg text-brand-navy-200">{subheadline}</p>
        )}

        {course.heroVideoUrl ? (
          <video
            src={course.heroVideoUrl}
            controls
            className="mx-auto mt-6 aspect-video w-full max-w-xl rounded-xl2 shadow-2xl"
          />
        ) : course.coverImageUrl ? (
          <img
            src={course.coverImageUrl}
            alt={course.title}
            className="mx-auto mt-6 aspect-video w-full max-w-xl rounded-xl2 object-cover shadow-2xl"
          />
        ) : null}

        {course.trustBadges.length > 0 && (
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {course.trustBadges.map((badge) => (
              <span key={badge} className="rounded-full bg-white/10 px-3 py-1 text-sm text-white">
                {badge}
              </span>
            ))}
          </div>
        )}

        {minPrice != null && (
          <p className="mt-6 text-sm text-brand-navy-200">
            À partir de{" "}
            <span className="text-xl font-bold text-white">
              {minPrice.toLocaleString("fr-FR")} {currency}
            </span>
          </p>
        )}

        <a href="#enroll-form" className="mt-4 inline-block">
          <Button size="lg" className="px-10">
            Je m&apos;inscris
          </Button>
        </a>
      </div>
    </section>
  );
}
