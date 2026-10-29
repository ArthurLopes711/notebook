import { Link } from "@tanstack/react-router";
import { Bot, BookOpen, FileAudio, Landmark, MessageSquareText, Search, ShieldAlert, UserCircle2 } from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import type { Sigilo } from "@/lib/pcdf-store";
import { USER } from "@/lib/pcdf-store";
import { cn } from "@/lib/utils";

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-gold text-xs font-black text-warning-foreground">
        α
      </div>
      <div className="leading-tight">
        <div className="flex items-center gap-2">
          <span className="text-sm font-extrabold tracking-[0.2em] text-gold">ALFA PCDF</span>
          <img
            src="/pcdf-logo.png"
            alt="Brasão da Polícia Civil do Distrito Federal"
            className="h-7 w-7 shrink-0 object-contain drop-shadow"
          />
        </div>
        <div className="text-[10px] uppercase tracking-widest text-header-foreground/70">
          PCDFNotebook
        </div>
      </div>
    </Link>
  );
}

export function UserBadge() {
  return (
    <div
      className="hidden items-center gap-2 text-xs text-header-foreground/80 md:flex"
      title="Agente autenticado na infraestrutura PCDF NET"
    >
      <UserCircle2 className="h-5 w-5 text-gold" />
      <span>{USER}</span>
    </div>
  );
}

export function Disclaimer() {
  return (
    <div className="flex items-center justify-center gap-2 border-t border-border bg-warning/10 px-4 py-1.5 text-[11px] font-medium text-warning">
      <ShieldAlert className="h-3.5 w-3.5" />
      Protótipo com dados fictícios — não inserir dados reais sensíveis.
    </div>
  );
}

const nav = [
  { label: "Assistente Geral Inteligente PCDF", icon: Bot },
  { label: "Meus Prompts", icon: MessageSquareText },
  { label: "PCDF Transcriptor", icon: FileAudio },
  { label: "ARIA — Inteligência Financeira", icon: Landmark },
  { label: "Meus Notebooks", icon: BookOpen, active: true },
  { label: "Consultar Ocorrências e Procedimentos PCDF", icon: Search },
];

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar p-3 lg:flex">
      <div className="mb-4 flex items-center gap-3 rounded border border-sidebar-border bg-sidebar-accent p-2.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
          DA
        </div>
        <div className="leading-tight">
          <div className="text-sm font-bold">DANIEL</div>
          <div className="text-[10px] text-muted-foreground">Mat.: 8123.2.4.02.000-7</div>
          <div className="text-[10px] font-semibold uppercase text-muted-foreground">Agente de Polícia</div>
        </div>
      </div>
      <div className="mb-3 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        Módulos Alfa PCDF
      </div>
      <nav className="space-y-0.5">
        {nav.map((n) => (
          <div
            key={n.label}
            role="button"
            tabIndex={0}
            onClick={() => {
              if (!n.active) {
                toast.info(`Módulo "${n.label}" integrado à plataforma Alfa PCDF.`);
              }
            }}
            className={cn(
              "flex cursor-pointer items-center gap-2.5 rounded px-2.5 py-2 text-[13px] text-sidebar-foreground transition-colors hover:bg-sidebar-accent",
              n.active && "border-l-2 border-primary bg-sidebar-accent font-semibold text-sidebar-accent-foreground",
            )}
          >
            <n.icon className="h-4 w-4 shrink-0" />
            <span className="leading-tight">{n.label}</span>
          </div>
        ))}
      </nav>
      <div className="mt-auto rounded border border-sidebar-border p-3 text-[11px] text-muted-foreground">
        <div className="font-semibold text-primary">PCDF NET</div>
        Infraestrutura Soberana de Inteligência Policial
      </div>
    </aside>
  );
}

export function SigiloBadge({ sigilo, large }: { sigilo: Sigilo; large?: boolean }) {
  const cls: Record<Sigilo, string> = {
    Público: "border-success/50 bg-success/15 text-success",
    Restrito: "border-info/50 bg-info/15 text-info",
    Reservado: "border-warning/60 bg-warning/15 text-warning",
    Sigiloso: "border-destructive/60 bg-destructive/20 text-destructive",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-sm border font-bold uppercase tracking-wider",
        large ? "px-2 py-1 text-[11px]" : "px-1.5 py-0.5 text-[10px]",
        cls[sigilo],
      )}
    >
      {large ? `Sigilo: ${sigilo}` : sigilo}
    </span>
  );
}

export function PageFrame({
  header,
  children,
  sidebar = true,
}: {
  header: ReactNode;
  children: ReactNode;
  sidebar?: boolean;
}) {
  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="flex h-14 shrink-0 items-center gap-4 border-b border-border bg-header px-4 text-header-foreground">
        {header}
      </header>
      <div className="flex min-h-0 flex-1">
        {sidebar && <Sidebar />}
        <main className="min-h-0 flex-1 overflow-auto">{children}</main>
      </div>
      <Disclaimer />
    </div>
  );
}
