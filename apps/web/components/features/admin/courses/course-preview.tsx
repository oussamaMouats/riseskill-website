import { COURSE_FORMAT_LABELS_FR, type CourseOffering } from "@riseskill/shared";

interface PreviewValues {
  title?: string;
  tagline?: string;
  level?: string;
  coverImageUrl?: string;
}

function formatPriceRange(offerings: CourseOffering[]) {
  const priced = offerings.filter((o) => o.price != null).map((o) => o.price as number);
  if (priced.length === 0) return null;
  const min = Math.min(...priced);
  const currency = offerings[0]?.currency ?? "DZD";
  return `À partir de ${min.toLocaleString("fr-FR")} ${currency}`;
}

export function CoursePreview({
  values,
  offerings,
}: {
  values: PreviewValues;
  offerings: CourseOffering[];
}) {
  const priceRange = formatPriceRange(offerings);

  return (
    <div className="sticky top-6 space-y-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Aperçu — carte publique
      </p>
      <div className="overflow-hidden rounded-xl2 border bg-background shadow-sm">
        <div
          className="flex h-28 items-center justify-center bg-gradient-to-br from-brand-navy to-brand-navy-600 bg-cover bg-center"
          style={
            values.coverImageUrl ? { backgroundImage: `url(${values.coverImageUrl})` } : undefined
          }
        >
          {!values.coverImageUrl && <span className="text-3xl">🎓</span>}
        </div>
        <div className="space-y-2 p-4">
          <div className="flex flex-wrap gap-1.5">
            {offerings.length === 0 && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                Aucun format encore
              </span>
            )}
            {offerings.map((o) => (
              <span
                key={o.id}
                className="rounded-full bg-brand-navy-50 px-2 py-0.5 text-xs font-medium text-brand-navy-700"
              >
                {COURSE_FORMAT_LABELS_FR[o.format]}
              </span>
            ))}
          </div>
          <h3 className="font-semibold text-brand-navy">
            {values.title || "Titre de la formation"}
          </h3>
          <p className="text-sm text-slate-600">{values.tagline || "L'accroche apparaîtra ici."}</p>
          <div className="flex items-center justify-between pt-1 text-sm">
            <span className="text-slate-500">{values.level || " "}</span>
            <span className="font-semibold text-brand-navy">{priceRange ?? "Prix à définir"}</span>
          </div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Reflet approximatif de la fiche publique — pas pixel-perfect.
      </p>
    </div>
  );
}
