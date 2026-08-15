import { Logo } from "@/components/ui/logo";

export function Footer() {
  return (
    <footer className="bg-brand-navy-900 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 text-sm text-brand-navy-200 sm:flex-row">
        <Logo tone="light" />
        <p>Rise Skill — Skikda</p>
      </div>
    </footer>
  );
}
