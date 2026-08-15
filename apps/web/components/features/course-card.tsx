import Link from "next/link";
import { COURSE_FORMAT_LABELS_FR, type CourseWithOfferings } from "@riseskill/shared";

const FORMAT_BADGE_STYLES: Record<string, string> = {
  IN_PERSON: "bg-brand-navy-50 text-brand-navy-700",
  ONLINE_LIVE: "bg-brand-green-50 text-brand-green-700",
  ONLINE_SELF_PACED: "bg-amber-50 text-amber-700",
};

export function CourseCard({ course }: { course: CourseWithOfferings }) {
  const pricedOfferings = course.offerings.filter((o) => o.price != null);
  const minPrice =
    pricedOfferings.length > 0 ? Math.min(...pricedOfferings.map((o) => o.price as number)) : null;
  const currency = course.offerings[0]?.currency ?? "DZD";

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl2 border border-slate-200 bg-white transition-shadow hover:shadow-lg"
    >
      <div className="flex h-32 items-center justify-center bg-gradient-to-br from-brand-navy to-brand-navy-600">
        <span className="text-4xl">🎓</span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap gap-1.5">
          {course.offerings.map((offering) => (
            <span
              key={offering.id}
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${FORMAT_BADGE_STYLES[offering.format]}`}
            >
              {COURSE_FORMAT_LABELS_FR[offering.format]}
            </span>
          ))}
        </div>
        <h3 className="font-semibold text-brand-navy group-hover:text-brand-green-700">
          {course.title}
        </h3>
        {course.tagline && <p className="text-sm text-slate-600">{course.tagline}</p>}
        <div className="mt-auto flex items-center justify-between pt-2 text-sm">
          <span className="text-slate-500">{course.level ?? " "}</span>
          {minPrice != null && (
            <span className="font-semibold text-brand-navy">
              À partir de {minPrice.toLocaleString("fr-FR")} {currency}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
