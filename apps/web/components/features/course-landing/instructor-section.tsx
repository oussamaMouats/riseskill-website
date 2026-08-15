import type { CourseWithModules } from "@riseskill/shared";

export function InstructorSection({ course }: { course: CourseWithModules }) {
  if (!course.instructorName) return null;

  return (
    <div className="rounded-xl2 border border-slate-200 bg-white p-6">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
        Votre formateur
      </span>
      <div className="mt-3 flex items-center gap-4">
        {course.instructorPhotoUrl ? (
          <img
            src={course.instructorPhotoUrl}
            alt={course.instructorName}
            className="h-16 w-16 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand-navy-50 text-lg font-semibold text-brand-navy">
            {course.instructorName
              .split(" ")
              .map((p) => p[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </div>
        )}
        <div>
          <p className="font-semibold text-brand-navy">{course.instructorName}</p>
          {course.instructorTitle && (
            <p className="text-sm text-slate-500">{course.instructorTitle}</p>
          )}
        </div>
      </div>
      {course.instructorBio && (
        <p className="mt-4 text-sm text-slate-700">{course.instructorBio}</p>
      )}
    </div>
  );
}
