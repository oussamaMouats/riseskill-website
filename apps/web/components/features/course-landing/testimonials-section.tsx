import type { CourseTestimonial } from "@riseskill/shared";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function TestimonialsSection({ testimonials }: { testimonials: CourseTestimonial[] }) {
  if (testimonials.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-bold text-brand-navy">
        Ce qu&apos;en disent nos anciens participants
      </h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="rounded-xl2 border border-slate-200 bg-white p-5">
            {testimonial.rating && (
              <div className="mb-2 text-amber-500" aria-label={`${testimonial.rating} sur 5`}>
                {"★".repeat(testimonial.rating)}
                <span className="text-slate-200">{"★".repeat(5 - testimonial.rating)}</span>
              </div>
            )}
            <p className="text-sm text-slate-700">&laquo; {testimonial.quote} &raquo;</p>
            <div className="mt-3 flex items-center gap-3">
              {testimonial.photoUrl ? (
                <img
                  src={testimonial.photoUrl}
                  alt={testimonial.authorName}
                  className="h-9 w-9 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-navy-50 text-xs font-semibold text-brand-navy">
                  {initials(testimonial.authorName)}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-brand-navy">{testimonial.authorName}</p>
                {testimonial.authorRole && (
                  <p className="text-xs text-slate-500">{testimonial.authorRole}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
