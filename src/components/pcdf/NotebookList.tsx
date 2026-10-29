import { Link } from "@tanstack/react-router";
import { FolderLock, Layers, Users, Trash2, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Notebook } from "@/lib/pcdf-store";
import { SigiloBadge } from "./Shell";

export function NotebookList({
  list,
  onDelete,
  onReset,
}: {
  list: Notebook[];
  onDelete?: (id: string, name: string) => void;
  onReset?: () => void;
}) {
  const [q, setQ] = useState("");
  const [tipo, setTipo] = useState("todos");
  const [sigilo, setSigilo] = useState("todos");

  const filtered = list.filter(
    (n) =>
      (tipo === "todos" || n.tipo === tipo) &&
      (sigilo === "todos" || n.sigilo === sigilo) &&
      `${n.name ?? ""} ${n.numero ?? ""} ${n.descricao ?? ""}`
        .toLowerCase()
        .includes(q.toLowerCase()),
  );

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        <Input
          placeholder="Buscar por nome, número ou descrição..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="max-w-sm"
        />
        <Select value={tipo} onValueChange={setTipo}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os tipos</SelectItem>
            {["Inquérito", "Operação", "Procedimento"].map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sigilo} onValueChange={setSigilo}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os sigilos</SelectItem>
            {["Público", "Restrito", "Reservado", "Sigiloso"].map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {onReset && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="ml-auto text-xs text-muted-foreground hover:text-primary"
            title="Restaurar casos de teste da demonstração"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Restaurar Casos Demo
          </Button>
        )}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-md border border-dashed border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">Nenhum notebook encontrado.</p>
          {list.length === 0 && onReset && (
            <Button variant="outline" size="sm" onClick={onReset} className="mt-3">
              <RotateCcw className="h-3.5 w-3.5" />
              Restaurar Notebooks Iniciais
            </Button>
          )}
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((n) => (
          <Link
            key={n.id}
            to="/notebook/$id"
            params={{ id: n.id }}
            className="group relative rounded-md border border-border bg-card p-4 transition-colors hover:border-primary/60"
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
                <FolderLock className="h-3.5 w-3.5 text-primary" />
                {n.tipo}
              </div>
              <div className="flex items-center gap-2">
                <SigiloBadge sigilo={n.sigilo} />
                {onDelete && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onDelete(n.id, n.name);
                    }}
                    title="Excluir notebook"
                    className="opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
            <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
              {n.name} — {n.numero}
            </h3>
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{n.descricao}</p>
            <div className="mt-3 flex items-center gap-4 border-t border-border pt-2 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Layers className="h-3 w-3" />
                {n.analyses.length} {n.analyses.length === 1 ? "análise" : "análises"}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {n.equipe.length} {n.equipe.length === 1 ? "integrante" : "integrantes"}
              </span>
              <span className="ml-auto text-success font-medium">{n.updated}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
