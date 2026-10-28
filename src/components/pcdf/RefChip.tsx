import { FileSearch } from "lucide-react";
import type { Analysis } from "@/lib/pcdf-store";

export function chipLabel(a?: Analysis) {
  if (!a) return "#Fonte";
  return "#" + a.title.replace(/\s*\(.*\)\s*$/, "");
}

export function RefChip({ analysis, label, onOpen }: { analysis?: Analysis; label?: string; onOpen: (id: string) => void }) {
  if (!analysis) return null;
  return (
    <button
      type="button"
      onClick={() => onOpen(analysis.id)}
      className="mx-0.5 inline-flex items-center gap-1 rounded-sm border border-primary/40 bg-accent px-1.5 py-0.5 align-middle text-[10.5px] font-semibold text-accent-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
    >
      <FileSearch className="h-3 w-3" />
      {label ?? chipLabel(analysis)}
    </button>
  );
}
