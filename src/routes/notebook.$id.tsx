import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Share2, ShieldCheck } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Logo, PageFrame, SigiloBadge, UserBadge } from "@/components/pcdf/Shell";
import { AnalysesPanel } from "@/components/pcdf/AnalysesPanel";
import { AgentChat } from "@/components/pcdf/AgentChat";
import { ReportStudio } from "@/components/pcdf/ReportStudio";
import { AnalysisDetailDialog, BasesDialog, NewAnalysisDialog, ShareDialog } from "@/components/pcdf/Dialogs";
import { ANALYSIS_TYPES, agentReply, buildReport, uid, useNotebooks, type Analysis } from "@/lib/pcdf-store";

export const Route = createFileRoute("/notebook/$id")({
  head: () => ({
    meta: [
      { title: "Notebook de Investigação — PCDFNotebook | Alfa PCDF" },
      {
        name: "description",
        content:
          "Workspace do caso: análises, agente de IA com citações rastreáveis e estúdio de relatório. Dados fictícios.",
      },
      { property: "og:title", content: "Notebook de Investigação — PCDFNotebook" },
      {
        property: "og:description",
        content: "Workspace integrado por caso da plataforma Alfa PCDF (protótipo).",
      },
      { property: "og:image", content: "/pcdf-logo.png" },
    ],
  }),
  component: Workspace,
});

function Workspace() {
  const { id } = Route.useParams();
  const { list, ready, update } = useNotebooks();
  const nb = list.find((n) => n.id === id);
  const [newOpen, setNewOpen] = useState(false);
  const [preset, setPreset] = useState<string | null>(null);
  const [bases, setBases] = useState(false);
  const [share, setShare] = useState(false);
  const [detail, setDetail] = useState<string | null>(null);
  const [thinking, setThinking] = useState(false);

  const addAnalysis = useCallback(
    (kind: string) => {
      const t = ANALYSIS_TYPES.find((x) => x.kind === kind) ?? {
        kind,
        label: kind,
        desc: "Análise investigativa",
        source: "Consulta PCDF",
      };
      update(id, (n) => {
        const count = n.analyses.filter((a) => a.kind === kind).length + 1;
        const a: Analysis = {
          id: uid(),
          kind,
          title: `${t.label} #${String(count).padStart(2, "0")}`,
          source: t.source,
          date: new Date().toLocaleDateString("pt-BR"),
          owner: "Daniel",
          status: "Concluído",
          summary: `Análise fictícia de ${t.label} processada neste notebook. Entidades extraídas e indexadas para o Agente de IA.`,
          citations: [
            "Entidade: Alvo A (CPF 000.000.000-00)",
            "Registro fictício nº 0001",
            "Período: jan–mar/2026",
          ],
        };
        return { ...n, analyses: [...n.analyses, a] };
      });
      toast.success(`${t.label} concluída e adicionada ao notebook.`);
    },
    [id, update],
  );

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Carregando notebook...
      </div>
    );
  }

  if (!nb) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-3 bg-background">
        <p className="text-sm text-muted-foreground">Notebook não encontrado.</p>
        <Button asChild variant="outline">
          <Link to="/">Voltar para Meus Notebooks</Link>
        </Button>
      </div>
    );
  }

  const ask = (q: string) => {
    update(id, (n) => ({
      ...n,
      chat: [...n.chat, { id: uid(), role: "user", text: q }],
    }));
    setThinking(true);
    setTimeout(() => {
      update(id, (n) => ({
        ...n,
        chat: [...n.chat, agentReply(q, n.analyses)],
      }));
      setThinking(false);
    }, 900);
  };

  return (
    <PageFrame
      sidebar={false}
      header={
        <>
          <Logo />
          <Link
            to="/"
            className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary"
            aria-label="Voltar para a lista de notebooks"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Notebooks</span>
          </Link>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold">
              Notebook de Investigação: {nb.name} ({nb.numero})
            </div>
            <div className="truncate text-[11px] text-muted-foreground">
              {nb.tipo} · Equipe: {nb.equipe.join(", ")}
            </div>
          </div>
          <SigiloBadge sigilo={nb.sigilo} large />
          <span className="hidden items-center gap-1 rounded-sm border border-primary/40 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary xl:flex">
            <ShieldCheck className="h-3 w-3" />
            PCDF NET — Infraestrutura Soberana
          </span>
          <div className="ml-auto flex items-center gap-3">
            <UserBadge />
            <Button size="sm" variant="outline" onClick={() => setShare(true)}>
              <Share2 className="h-4 w-4" />
              Compartilhar
            </Button>
          </div>
        </>
      }
    >
      <div className="grid h-full grid-cols-1 lg:grid-cols-[300px_1fr_380px]">
        <AnalysesPanel
          analyses={nb.analyses}
          onNew={() => {
            setPreset(null);
            setNewOpen(true);
          }}
          onQuick={(k) => {
            setPreset(k);
            setNewOpen(true);
          }}
          onBases={() => setBases(true)}
          onOpen={setDetail}
        />
        <AgentChat
          chat={nb.chat}
          analyses={nb.analyses}
          onAsk={ask}
          onOpen={setDetail}
          thinking={thinking}
        />
        <ReportStudio
          title={nb.name}
          report={nb.report}
          analyses={nb.analyses}
          onChange={(r) => update(id, (n) => ({ ...n, report: r }))}
          onGenerate={() => {
            update(id, (n) => ({ ...n, report: buildReport(n) }));
            toast.success("Minuta do relatório gerada com citações rastreáveis.");
          }}
          onOpen={setDetail}
        />
      </div>
      <NewAnalysisDialog
        open={newOpen}
        onOpenChange={setNewOpen}
        preset={preset}
        onDone={addAnalysis}
      />
      <BasesDialog
        open={bases}
        onOpenChange={setBases}
        onLink={(r) => {
          const cit = `${r.tipo} nº ${r.id}`;
          update(id, (n) => {
            const ex = n.analyses.find((a) => a.kind === "Bases PCDF");
            if (ex) {
              if (ex.citations.includes(cit)) {
                return n;
              }
              return {
                ...n,
                analyses: n.analyses.map((a) =>
                  a === ex ? { ...a, citations: [...a.citations, cit] } : a,
                ),
              };
            }
            return {
              ...n,
              analyses: [
                ...n.analyses,
                {
                  id: "ocor",
                  kind: "Bases PCDF",
                  title: "Ocorrências Policiais (vinculadas)",
                  source: "Consulta Bases PCDF",
                  date: new Date().toLocaleDateString("pt-BR"),
                  owner: "Daniel",
                  status: "Concluído",
                  summary: `Registros vinculados a partir das bases PCDF: ${r.desc}.`,
                  citations: [cit],
                },
              ],
            };
          });
          toast.success(`${r.tipo} nº ${r.id} vinculada ao notebook.`);
        }}
      />
      <ShareDialog
        open={share}
        onOpenChange={setShare}
        equipe={nb.equipe}
        name={nb.name}
      />
      <AnalysisDetailDialog
        analysis={nb.analyses.find((a) => a.id === detail) ?? null}
        onOpenChange={(o) => !o && setDetail(null)}
      />
    </PageFrame>
  );
}
