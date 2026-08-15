// TODO: gate this layout with requireRole("STUDENT") from lib/auth once wired up.
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="mb-6 text-xl font-semibold">Espace élève</h1>
      {children}
    </div>
  );
}
