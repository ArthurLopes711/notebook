import { Bot, GitBranch, Clock, Send, User, Landmark, FileText } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Analysis, ChatMsg } from "@/lib/pcdf-store";
import { PanelTitle } from "./AnalysesPanel";
import { RefChip } from "./RefChip";

export function AgentChat({
  chat,
  analyses,
  onAsk,
  onOpen,
  thinking,
}: {
  chat: ChatMsg[];
  analyses: Analysis[];
  onAsk: (q: string) => void;
  onOpen: (id: string) => void;
  thinking: boolean;
}) {
  const [q, setQ] = useState("");
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.length, thinking]);

  const find = (id: string) => analyses.find((a) => a.id === id || a.kind === id);

  const send = (text: string) => {
    if (!text.trim()) return;
    onAsk(text.trim());
    setQ("");
  };

  return (
    <section className="m-2 mx-1 flex min-h-0 flex-col overflow-hidden rounded-md border border-border bg-card shadow-sm">
      <PanelTitle
        step={3}
        title="Agente de IA"
        extra={
          <span className="text-[11px] text-panel-head-foreground/70">
            Central de Conversação e Investigação
          </span>
        }
      />
      <div className="min-h-0 flex-1 space-y-4 overflow-auto p-4">
        {chat.map((m) => (
          <div key={m.id} className="flex gap-3">
            <div
              className={
                m.role === "agent"
                  ? "flex h-7 w-7 shrink-0 items-center justify-center rounded bg-gold text-warning-foreground"
                  : "flex h-7 w-7 shrink-0 items-center justify-center rounded bg-secondary text-foreground"
              }
            >
              {m.role === "agent" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {m.role === "agent" ? "Agente PCDF" : "Daniel"}
              </div>
              <div
                className={
                  m.role === "agent"
                    ? "rounded border border-accent bg-accent/50 p-3 text-sm leading-relaxed"
                    : "rounded bg-secondary p-3 text-sm"
                }
              >
                <p>{m.text}</p>
                {m.bullets && (
                  <ul className="mt-2 space-y-1.5">
                    {m.bullets.map((b, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        <span>
                          {b.text}{" "}
                          {b.refs.map((r) => (
                            <RefChip key={r} analysis={find(r)} onOpen={onOpen} />
                          ))}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        ))}
        {thinking && (
          <div className="flex items-center gap-2 pl-10 text-xs text-muted-foreground animate-pulse">
            <Bot className="h-3.5 w-3.5 text-primary" />
            <span>Agente cruzando fontes do notebook e verificando evidências...</span>
          </div>
        )}
        <div ref={end} />
      </div>
      <div className="border-t border-border p-3">
        <div className="mb-2 flex flex-wrap gap-1.5">
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs"
            onClick={() => send("Gerar linha do tempo (cronologia)")}
          >
            <Clock className="h-3 w-3" />
            Linha do Tempo
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs"
            onClick={() => send("Mapear vínculos (grafo)")}
          >
            <GitBranch className="h-3 w-3" />
            Mapear Vínculos
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs"
            onClick={() => send("Qual a movimentação financeira no RIF?")}
          >
            <Landmark className="h-3 w-3" />
            Movimentação RIF
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs"
            onClick={() => send("Consultar ocorrências vinculadas ao Alvo A")}
          >
            <FileText className="h-3 w-3" />
            Ocorrências
          </Button>
        </div>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            send(q);
          }}
        >
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Pergunte ao agente sobre alvos, quebras, RIF ou testemunhas..."
          />
          <Button type="submit" size="icon" aria-label="Enviar mensagem" disabled={!q.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </section>
  );
}
