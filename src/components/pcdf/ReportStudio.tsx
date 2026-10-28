import { FileDown, FileText, Pencil, Sparkles, Eye, Bold, Italic, List } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Analysis } from "@/lib/pcdf-store";
import { PanelTitle } from "./AnalysesPanel";
import { RefChip } from "./RefChip";

function renderLine(line: string, analyses: Analysis[], onOpen: (id: string) => void) {
  const parts = line.split(/(\[\[[^\]]+\]\])/g);
  return parts.map((p, i) => {
    const m = p.match(/^\[\[([^|]+)\|([^\]]+)\]\]$/);
    if (m) return <RefChip key={i} analysis={analyses.find((a) => a.id === m[1])} label={m[2]} onOpen={onOpen} />;
    return <span key={i}>{p}</span>;
  });
}

export function ReportStudio({ report, analyses, onChange, onGenerate, onOpen, title }: { report: string; analyses: Analysis[]; onChange: (r: string) => void; onGenerate: () => void; onOpen: (id: string) => void; title: string }) {
  const [edit, setEdit] = useState(false);
  const exp = (fmt: string) => {
    if (!report) return toast.error("Gere ou escreva o relatório antes de exportar.");
    toast.success(`Relatório_${title.replace(/\W+/g, "_")}.${fmt.toLowerCase()} gerado (simulação).`, { description: "Nenhum arquivo foi enviado — protótipo." });
  };
  return (
    <section className="flex min-h-0 flex-col border-l border-border bg-card/40">
      <PanelTitle step={4} title="Estúdio de Relatório" />
      <div className="flex items-center gap-1 border-b border-border px-3 py-1.5">
        {[Bold, Italic, List].map((I, i) => <Button key={i} size="icon" variant="ghost" className="h-7 w-7" disabled={!edit}><I className="h-3.5 w-3.5" /></Button>)}
        <Button size="sm" variant="ghost" className="ml-auto h-7 text-xs" onClick={() => setEdit(!edit)}>{edit ? <><Eye className="h-3.5 w-3.5" />Visualizar</> : <><Pencil className="h-3.5 w-3.5" />Editar</>}</Button>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-4">
        {edit ? (
          <Textarea className="h-full min-h-[400px] font-mono text-xs" value={report} onChange={(e) => onChange(e.target.value)} placeholder="# SÍNTESE DA INVESTIGAÇÃO" />
        ) : report ? (
          <article className="space-y-2 text-[13px] leading-relaxed">
            {report.split("\n").map((l, i) =>
              l.startsWith("# ") ? <h3 key={i} className="border-b border-primary/40 pb-1 text-sm font-bold uppercase tracking-wide text-primary">{l.slice(2)}</h3>
              : l.startsWith("## ") ? <h4 key={i} className="pt-2 text-xs font-bold uppercase tracking-wider">{l.slice(3)}</h4>
              : <p key={i}>{renderLine(l, analyses, onOpen)}</p>,
            )}
          </article>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <FileText className="mb-2 h-8 w-8 text-muted-foreground" />
            <div className="text-sm font-bold uppercase tracking-wider">Síntese da Investigação</div>
            <p className="mt-1 max-w-[220px] text-xs text-muted-foreground">Gere uma minuta a partir das análises e conversas deste notebook.</p>
          </div>
        )}
      </div>
      <div className="space-y-2 border-t border-border p-3">
        <Button className="w-full" onClick={onGenerate}><Sparkles className="h-4 w-4" />Gerar Relatório de Investigação</Button>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" onClick={() => exp("PDF")}><FileDown className="h-3.5 w-3.5" />PDF</Button>
          <Button variant="outline" size="sm" onClick={() => exp("DOCX")}><FileDown className="h-3.5 w-3.5" />DOCX</Button>
        </div>
      </div>
    </section>
  );
}
