import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Notebook, Sigilo, TipoCaso } from "@/lib/pcdf-store";
import { uid } from "@/lib/pcdf-store";

export function CreateNotebookDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onCreate: (n: Notebook) => void;
}) {
  const [name, setName] = useState("");
  const [tipo, setTipo] = useState<TipoCaso>("Inquérito");
  const [numero, setNumero] = useState("");
  const [sigilo, setSigilo] = useState<Sigilo>("Reservado");
  const [descricao, setDescricao] = useState("");
  const [equipe, setEquipe] = useState("Daniel");

  useEffect(() => {
    if (open) {
      setName("");
      setTipo("Inquérito");
      setNumero("");
      setSigilo("Reservado");
      setDescricao("");
      setEquipe("Daniel");
    }
  }, [open]);

  const submit = () => {
    if (!name.trim()) return;
    onCreate({
      id: uid(),
      name: name.trim(),
      tipo,
      numero: numero.trim() || "S/N",
      sigilo,
      descricao: descricao.trim() || "Sem descrição.",
      equipe: equipe
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      updated: "Criado agora",
      analyses: [],
      chat: [
        {
          id: "m0",
          role: "agent",
          text: "Notebook criado com isolamento lógico. Adicione análises na coluna à esquerda para que eu possa cruzar as informações — só respondo com base nas fontes deste notebook.",
        },
      ],
      report: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Passo 1 — Criar Notebook do Caso</DialogTitle>
          <DialogDescription>
            Espaço isolado por caso concreto, com nível de sigilo e equipe definidos.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="grid gap-3"
        >
          <div className="grid gap-1.5">
            <Label htmlFor="nb-name">Nome do notebook *</Label>
            <Input
              id="nb-name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex.: Op. Aurora"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Tipo de procedimento</Label>
              <Select value={tipo} onValueChange={(v) => setTipo(v as TipoCaso)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Inquérito", "Operação", "Procedimento"].map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="nb-num">Número</Label>
              <Input
                id="nb-num"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                placeholder="IP 000/2026"
              />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label>Nível de sigilo</Label>
            <Select value={sigilo} onValueChange={(v) => setSigilo(v as Sigilo)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Público", "Restrito", "Reservado", "Sigiloso"].map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="nb-desc">Descrição / Objeto da apuração</Label>
            <Textarea
              id="nb-desc"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
              placeholder="Descreva o foco da investigação..."
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="nb-team">Equipe designada (separada por vírgula)</Label>
            <Input
              id="nb-team"
              value={equipe}
              onChange={(e) => setEquipe(e.target.value)}
              placeholder="Daniel, Agente Silva..."
            />
          </div>
          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              Criar e abrir
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
