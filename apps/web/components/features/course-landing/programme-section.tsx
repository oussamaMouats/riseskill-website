import type { CourseModule } from "@riseskill/shared";

export function ProgrammeSection({ modules }: { modules: CourseModule[] }) {
  if (modules.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-bold text-brand-navy">Programme</h2>
      <ol className="mt-4 space-y-4 border-l-2 border-brand-green-200 pl-6">
        {modules.map((courseModule, index) => (
          <li key={courseModule.id} className="relative">
            <span className="absolute -left-[calc(1.5rem+9px)] flex h-6 w-6 items-center justify-center rounded-full bg-brand-green text-xs font-bold text-white">
              {index + 1}
            </span>
            <h3 className="font-semibold text-brand-navy">{courseModule.title}</h3>
            {courseModule.description && (
              <p className="text-sm text-slate-600">{courseModule.description}</p>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
