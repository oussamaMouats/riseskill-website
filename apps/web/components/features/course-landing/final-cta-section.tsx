import type { CourseWithModules } from "@riseskill/shared";
import { EnrollmentForm } from "@/components/features/enrollment-form";
import { WhatsAppCta } from "./whatsapp-cta";

export function FinalCtaSection({ course }: { course: CourseWithModules }) {
  return (
    <div id="enroll-form" className="rounded-xl2 border border-slate-200 bg-white p-6 shadow-sm">
      {course.urgencyText && (
        <p className="mb-4 rounded-md bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800">
          ⏳ {course.urgencyText}
        </p>
      )}
      <h2 className="text-xl font-bold text-brand-navy">Réservez votre place</h2>
      <p className="mt-1 text-sm text-slate-600">
        Remplissez le formulaire, notre équipe vous recontacte rapidement.
      </p>
      <div className="mt-4">
        <EnrollmentForm course={course} offerings={course.offerings} compact />
      </div>
      <div className="mt-3">
        <WhatsAppCta courseTitle={course.title} />
      </div>
      {course.guaranteeText && (
        <p className="mt-4 text-center text-xs text-slate-500">✓ {course.guaranteeText}</p>
      )}
    </div>
  );
}
