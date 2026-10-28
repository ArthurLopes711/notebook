import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Logo, PageFrame, UserBadge } from "@/components/pcdf/Shell";
import { NotebookList } from "@/components/pcdf/NotebookList";
import { CreateNotebookDialog } from "@/components/pcdf/CreateNotebookDialog";
import { useNotebooks } from "@/lib/pcdf-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Meus Notebooks — PCDFNotebook | Alfa PCDF" },
      { name: "description", content: "Notebooks de investigação por caso: análises, agente de IA e relatório integrado. Protótipo fictício." },
      { property: "og:title", content: "Meus Notebooks — PCDFNotebook" },
      { property: "og:description", content: "Protótipo do Notebook de Investigação da plataforma Alfa PCDF." },
    ],
  }),
  component: Index,
});

const steps = ["Criar notebook do caso", "Gerar análises internas", "Conversar com o Agente de IA", "Gerar relatório integrado"];

function Index() {
  const { list, save } = useNotebooks();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <PageFrame
      header={<><Logo /><div className="ml-auto flex items-center gap-4"><UserBadge /><Button size="sm" onClick={() => setOpen(true)}><Plus className="h-4 w-4" />Criar Notebook</Button></div></>}
    >
      <div className="p-6">
        <div className="mb-1 text-[11px] uppercase tracking-widest text-primary">Workspace por caso concreto</div>
        <h1 className="text-2xl font-bold">Meus Notebooks</h1>
        <div className="my-5 grid gap-2 sm:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2 rounded border border-border bg-card px-3 py-2 text-xs">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold text-[11px] font-bold text-primary-foreground">{i + 1}</span>
              {s}
            </div>
          ))}
        </div>
        <NotebookList list={list} />
      </div>
      <CreateNotebookDialog
        open={open}
        onOpenChange={setOpen}
        onCreate={(n) => {
          save((l) => [n, ...l]);
          setOpen(false);
          navigate({ to: "/notebook/$id", params: { id: n.id } });
        }}
      />
    </PageFrame>
  );
}
