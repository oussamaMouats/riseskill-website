export function ObjectivesSection({ objectives }: { objectives: string[] }) {
  if (objectives.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-bold text-brand-navy">Ce que vous allez apprendre</h2>
      <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {objectives.map((objective) => (
          <li key={objective} className="flex items-start gap-2 text-sm text-slate-700">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-green text-xs text-white">
              ✓
            </span>
            {objective}
          </li>
        ))}
      </ul>
    </div>
  );
}
