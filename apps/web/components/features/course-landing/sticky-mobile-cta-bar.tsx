import type { CourseWithModules } from "@riseskill/shared";
import { Button } from "@/components/ui/button";
import { WhatsAppCta } from "./whatsapp-cta";

export function StickyMobileCtaBar({ course }: { course: CourseWithModules }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-slate-200 bg-white p-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] md:hidden">
      <WhatsAppCta
        courseTitle={course.title}
        className="flex flex-1 items-center justify-center gap-1.5 rounded-full border-2 border-brand-green px-3 py-2.5 text-sm font-semibold text-brand-green-700"
      />
      <a href="#enroll-form" className="flex-1">
        <Button className="w-full">S&apos;inscrire</Button>
      </a>
    </div>
  );
}
