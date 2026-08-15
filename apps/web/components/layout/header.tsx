import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/">
          <Logo />
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-brand-navy-700">
          <Link href="/courses" className="hover:text-brand-green-600">
            Formations
          </Link>
          <Link href="/contact" className="hover:text-brand-green-600">
            Contact
          </Link>
          <Link href="/login" className="hover:text-brand-green-600">
            Connexion
          </Link>
          <Link
            href="/courses"
            className="rounded-full bg-brand-green px-4 py-2 text-white transition-colors hover:bg-brand-green-600"
          >
            S&apos;inscrire
          </Link>
        </nav>
      </div>
    </header>
  );
}
