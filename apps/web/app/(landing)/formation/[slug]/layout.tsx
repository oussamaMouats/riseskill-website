import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header className="border-b border-slate-100 bg-white py-4">
        <div className="mx-auto max-w-3xl px-6">
          <Link href="/" aria-label="Rise Skill">
            <Logo />
          </Link>
        </div>
      </header>
      <main className="pb-16 md:pb-0">{children}</main>
      <footer className="border-t border-slate-100 bg-white py-6 text-center text-xs text-slate-400">
        <p>© Rise Skill — Skikda</p>
      </footer>
    </div>
  );
}
