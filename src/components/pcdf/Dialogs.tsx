import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { Copy, Database, Link2, Search, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ANALYSIS_TYPES, type Analysis } from "@/lib/pcdf-store";

type OC = { open: boolean; onOpenChange: (o: boolean) => void };

export function NewAnalysisDialog({
  open,
  onOpenChange,
  preset,
  onDone,
}: OC & { preset?: string | null; onDone: (kind: string) => void }) {
  const [kind, setKind] = useState<string | null>(null);
  const [p, setP] = useState(0);
  const doneRef = useRef(false);

  useEffect(() => {
    if (open) {
      setKind(preset ?? null);
      setP(0);
      doneRef.current = false;
    }
  }, [open, preset]);

  useEffect(() => {
    if (!kind || !open || doneRef.current) return;
    const t = setInterval(() => {
      setP((v) => {
        if (v >= 100) return 100;
        return Math.min(100, v + 12 + Math.random() * 15);
      });
    }, 180);
    return () => clearInterval(t);
  }, [kind, open]);

  useEffect(() => {
    if (p >= 100 && kind && !doneRef.current) {
      doneRef.current = true;
      const k = kind;
      const timer = setTimeout(() => {
        onDone(k);
        onOpenChange(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [p, kind, onDone, onOpenChange]);

  const label =
    p < 30
      ? "Recebendo arquivo (simulado)..."
      : p < 70
        ? "Processando e indexando no notebook..."
        : "Extraindo entidades e citações...";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nova Análise</DialogTitle>
          <DialogDescription>
            Os resultados ficam isolados neste notebook e servem de fonte ao Agente de IA.
          </DialogDescription>
        </DialogHeader>
        {!kind ? (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {ANALYSIS_TYPES.map((t) => (
              <button
                key={t.kind}
                type="button"
                onClick={() => setKind(t.kind)}
                className="rounded border border-border bg-card p-3 text-left transition-colors hover:border-primary hover:bg-card/80"
              >
                <Upload className="mb-2 h-4 w-4 text-primary" />
                <div className="text-sm font-semibold">{t.label}</div>
                <div className="text-[11px] text-muted-foreground">{t.desc}</div>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-3 py-4">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span>{ANALYSIS_TYPES.find((t) => t.kind === kind)?.label}</span>
              <span className="text-xs text-muted-foreground">{Math.floor(p)}%</span>
            </div>
            <Progress value={p} />
            <div className="text-xs text-muted-foreground">{label}</div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

const BASES = [
  { id: "432/2025/1º DP", tipo: "Ocorrência", desc: "Indícios de atividade financeira suspeita — CPF 000.000.000-00" },
  { id: "118/2025/5º DP", tipo: "Ocorrência", desc: "Estelionato — envolvido Alvo A" },
  { id: "077/2026/DRF", tipo: "Ocorrência", desc: "Falsidade documental — cartório SCS" },
  { id: "IP 301/2024", tipo: "Procedimento", desc: "Lavagem de capitais — arquivado" },
  { id: "PA 015/2025", tipo: "Procedimento", desc: "Apuração preliminar — despachantes" },
];

export function BasesDialog({
  open,
  onOpenChange,
  onLink,
}: OC & { onLink: (r: { id: string; tipo: string; desc: string }) => void }) {
  const [q, setQ] = useState("000.000.000-00");
  const res = BASES.filter(
    (b) =>
      `${b.id} ${b.desc} ${b.tipo}`.toLowerCase().includes(q.toLowerCase()) ||
      q.includes("000.000"),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-4 w-4 text-primary" />
            Consultar Bases PCDF
          </DialogTitle>
          <DialogDescription>
            Busca simulada nas bases policiais por CPF, nome, número de ocorrência ou procedimento.
          </DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Buscar por ocorrência, CPF ou termo..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="max-h-80 space-y-2 overflow-auto">
          {res.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Nenhum registro encontrado para a busca.
            </p>
          )}
          {res.map((r) => (
            <div
              key={r.id}
              className="flex items-center gap-3 rounded border border-border bg-card p-2.5"
            >
              <div className="flex-1">
                <div className="text-sm font-semibold">
                  {r.tipo} nº {r.id}
                </div>
                <div className="text-xs text-muted-foreground">{r.desc}</div>
              </div>
              <Button size="sm" variant="outline" onClick={() => onLink(r)}>
                <Link2 className="h-3.5 w-3.5" />
                Vincular ao notebook
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ShareDialog({
  open,
  onOpenChange,
  equipe,
  name,
}: OC & { equipe: string[]; name: string }) {
  const [email, setEmail] = useState("");
  const [perm, setPerm] = useState("Visualizar");
  const link = `https://alfa.pcdf.net/notebook/${name.toLowerCase().replace(/\W+/g, "-")}?t=FICTICIO`;

  const copyLink = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(link);
        toast.success("Link copiado para a área de transferência.");
        return;
      }
    } catch {}
    toast("Link simulado gerado.");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Compartilhar Notebook</DialogTitle>
          <DialogDescription>
            Acesso restrito à equipe do caso, registrado em trilha de auditoria (PCDF NET).
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2">
          <Input
            placeholder="agente.ficticio@pcdf.net"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Select value={perm} onValueChange={setPerm}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Visualizar">Visualizar</SelectItem>
              <SelectItem value="Editar">Editar</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Equipe Atual
          </div>
          <div className="divide-y divide-border rounded border border-border">
            {equipe.map((p, i) => (
              <div key={p} className="flex justify-between px-3 py-2 text-sm">
                <span>{p}</span>
                <span className="text-xs text-muted-foreground">
                  {i === 0 ? "Proprietário" : "Editar"}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <Input readOnly value={link} className="text-xs" />
          <Button variant="outline" size="icon" onClick={copyLink} title="Copiar link">
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <Button
          onClick={() => {
            toast.success(
              `Convite enviado (simulado) para ${email || "agente.ficticio@pcdf.net"} — ${perm}`,
            );
            setEmail("");
            onOpenChange(false);
          }}
        >
          Compartilhar
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export function AnalysisDetailDialog({
  analysis,
  onOpenChange,
}: {
  analysis: Analysis | null;
  onOpenChange: (o: boolean) => void;
}) {
  return (
    <Dialog open={!!analysis} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        {analysis && (
          <>
            <DialogHeader>
              <DialogTitle>{analysis.title}</DialogTitle>
              <DialogDescription>Fonte do notebook — referência rastreável</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                ["Fonte", analysis.source],
                ["Data", analysis.date],
                ["Responsável", analysis.owner],
                ["Status", analysis.status],
              ].map(([k, v]) => (
                <div key={k} className="rounded border border-border bg-card p-2">
                  <div className="text-muted-foreground">{k}</div>
                  <div className="font-semibold">{v}</div>
                </div>
              ))}
            </div>
            <div>
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-primary">
                Resumo
              </div>
              <p className="text-sm leading-relaxed">{analysis.summary}</p>
            </div>
            <div>
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-primary">
                Citações Extraídas
              </div>
              {analysis.citations.length === 0 ? (
                <p className="text-xs text-muted-foreground">Nenhuma citação direta extraída.</p>
              ) : (
                <ul className="space-y-1">
                  {analysis.citations.map((c) => (
                    <li
                      key={c}
                      className="border-l-2 border-primary bg-accent/40 px-2 py-1 text-xs"
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
