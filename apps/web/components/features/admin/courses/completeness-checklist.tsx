import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChecklistItem {
  label: string;
  done: boolean;
}

export function CompletenessChecklist({ items }: { items: ChecklistItem[] }) {
  const doneCount = items.filter((i) => i.done).length;

  return (
    <div className="rounded-xl2 border bg-background p-4">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">Fiche prête à convertir</p>
        <span className="text-xs text-muted-foreground">
          {doneCount}/{items.length}
        </span>
      </div>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-2 text-sm">
            {item.done ? (
              <Check className="h-3.5 w-3.5 shrink-0 text-brand-green" />
            ) : (
              <Circle className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            )}
            <span className={cn(item.done ? "text-foreground" : "text-muted-foreground")}>
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
