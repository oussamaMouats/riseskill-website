import type { CourseWithOfferings } from "@riseskill/shared";
import { CourseCard } from "./course-card";

export function CoursesGrid({ courses }: { courses: CourseWithOfferings[] }) {
  if (courses.length === 0) {
    return <p className="text-sm text-slate-500">Aucune formation trouvée.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <CourseCard key={course.slug} course={course} />
      ))}
    </div>
  );
}
