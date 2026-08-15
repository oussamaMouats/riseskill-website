export function ComposerSection({
  step,
  title,
  description,
  locked,
  children,
}: {
  step: number;
  title: string;
  description?: string;
  locked?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl2 border bg-background p-6">
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-navy text-xs font-bold text-white">
          {step}
        </span>
        <div>
          <h2 className="font-semibold text-foreground">{title}</h2>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      </div>
      {locked ? (
        <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
          {locked}
        </p>
      ) : (
        children
      )}
    </section>
  );
}
