import { AdminNav } from "@/components/features/admin/admin-nav";
import { Breadcrumbs } from "@/components/features/admin/breadcrumbs";
import { CommandPalette } from "@/components/features/admin/command-palette";
import { MobileNav } from "@/components/features/admin/mobile-nav";
import { UserMenu } from "@/components/features/admin/user-menu";
import { Logo } from "@/components/ui/logo";
import { requireRole } from "@/lib/auth";
import { QueryProvider } from "./query-provider";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole("ADMIN");

  return (
    <QueryProvider>
      <div className="flex min-h-screen bg-muted/30">
        <aside className="hidden w-64 shrink-0 flex-col border-r bg-background lg:flex">
          <div className="flex h-16 items-center border-b px-6">
            <Logo />
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <AdminNav />
          </div>
          <div className="border-t p-3">
            <UserMenu email={session.email} />
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-16 items-center gap-3 border-b bg-background px-4 lg:px-8">
            <MobileNav />
            <CommandPalette />
          </header>
          <main className="flex-1 p-6 lg:p-8">
            <Breadcrumbs />
            {children}
          </main>
        </div>
      </div>
    </QueryProvider>
  );
}
