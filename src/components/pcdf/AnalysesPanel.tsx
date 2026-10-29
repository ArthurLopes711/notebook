import { Database, FileText, Landmark, MapPin, Plus, Smartphone, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Analysis } from "@/lib/pcdf-store";

export function AnalysesPanel({
  analyses,
  onNew,
  onBases,
  onQuick,
  onOpen,
}: {
  analyses: Analysis[];
  onNew: () => void;
  onBases: () => void;
  onQuick: (kind: string) => void;
  onOpen: (id: string) => void;
}) {
  return (
    <section className="m-2 mr-1 flex min-h-0 flex-col overflow-hidden rounded-md border border-border bg-card shadow-sm">
      <PanelTitle step={2} title="Análises e Fontes" />
      <div className="grid grid-cols-2 gap-1.5 border-b border-border p-3">
        <Button size="sm" className="col-span-2" onClick={onNew}>
          <Plus className="h-4 w-4" />
          Nova Análise
        </Button>
        <Button size="sm" variant="outline" onClick={onBases}>
          <Database className="h-3.5 w-3.5" />
          Bases PCDF
        </Button>
        <Button size="sm" variant="outline" onClick={() => onQuick("RIF/ARIA")}>
          <Landmark className="h-3.5 w-3.5" />
          RIF (ARIA)
        </Button>
        <Button size="sm" variant="outline" onClick={() => onQuick("Telemática")}>
          <Smartphone className="h-3.5 w-3.5" />
          Telemática
        </Button>
        <Button size="sm" variant="outline" onClick={() => onQuick("Rastreador")}>
          <MapPin className="h-3.5 w-3.5" />
          Rastreador
        </Button>
      </div>
      <div className="px-3 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        Análises & Documentos Ativos neste Notebook ({analyses.length})
      </div>
      <div className="min-h-0 flex-1 space-y-2 overflow-auto p-3 pt-1">
        {analyses.length === 0 && (
          <p className="py-6 text-center text-xs text-muted-foreground">
            Nenhuma análise vinculada ainda. Use "Nova Análise" acima para carregar dados.
          </p>
        )}
        {analyses.map((a) => (
          <div
            key={a.id}
            role="button"
            tabIndex={0}
            onClick={() => onOpen(a.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onOpen(a.id);
              }
            }}
            className="group block cursor-pointer rounded border border-border bg-secondary p-2.5 transition-colors hover:border-primary/60"
          >
            <div className="flex items-start gap-2">
              <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-semibold leading-tight group-hover:text-primary transition-colors">
                  {a.title}
                </div>
                <div className="mt-0.5 truncate text-[11px] text-muted-foreground">
                  {a.source} · {a.date}
                </div>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              {a.status === "Concluído" ? (
                <span className="flex items-center gap-1 text-[11px] font-medium text-success">
                  <CheckCircle2 className="h-3 w-3" />
                  Concluído
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] font-medium text-warning">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Processando
                </span>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="h-6 px-2 text-[11px] text-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen(a.id);
                }}
              >
                Abrir
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function PanelTitle({
  step,
  title,
  extra,
}: {
  step: number;
  title: string;
  extra?: React.ReactNode;
}) {
  return (
    <div className="flex h-11 shrink-0 items-center gap-2 bg-panel-head px-3 text-panel-head-foreground">
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-warning-foreground">
        {step}
      </span>
      <h2 className="text-xs font-bold uppercase tracking-widest">{title}</h2>
      <div className="ml-auto">{extra}</div>
    </div>
  );
}
