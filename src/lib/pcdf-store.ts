import { useEffect, useState, useCallback } from "react";

export type Sigilo = "Público" | "Restrito" | "Reservado" | "Sigiloso";
export type TipoCaso = "Inquérito" | "Operação" | "Procedimento";

export type Analysis = {
  id: string;
  title: string;
  kind: string;
  source: string;
  date: string;
  owner: string;
  status: "Concluído" | "Processando";
  summary: string;
  citations: string[];
};

export type ChatMsg = { id: string; role: "agent" | "user"; text: string; bullets?: { text: string; refs: string[] }[] };

export type Notebook = {
  id: string;
  name: string;
  tipo: TipoCaso;
  numero: string;
  sigilo: Sigilo;
  descricao: string;
  equipe: string[];
  updated: string;
  analyses: Analysis[];
  chat: ChatMsg[];
  report: string;
};

export const USER = "Daniel — 8123.2.4.02.000-7 — Agente de Polícia";

export const uid = () => Math.random().toString(36).slice(2, 9);

const baseAnalyses = (): Analysis[] => [
  { id: "rif01", title: "Análise de RIF #01 (ARIA)", kind: "RIF/ARIA", source: "ARIA — Inteligência Financeira", date: "12/03/2026", owner: "Daniel", status: "Concluído", summary: "Relatório de Inteligência Financeira fictício. Movimentação total de R$ 50.000.000,00 associada ao CPF 000.000.000-00 em 14 contas, com fracionamento de depósitos em espécie.", citations: ["Movimentação total R$ 50.000.000,00", "14 contas vinculadas (Ag. 0000 / C/C 00000-0)", "Depósitos fracionados abaixo de R$ 10 mil"] },
  { id: "tel01", title: "Quebra Telemática #01 (WhatsApp)", kind: "Telemática", source: "Provedor fictício — Ofício 112/2026", date: "15/03/2026", owner: "Daniel", status: "Concluído", summary: "Extração de conversas WhatsApp do terminal do Alvo A. Identificadas 37 mensagens com o termo \"despachante\" e referências a pagamentos.", citations: ["37 mensagens com \"despachante\"", "Contato salvo como \"Desp. Centro\" (61) 90000-0000", "Áudios encaminhados em 02/02/2026"] },
  { id: "cdr01", title: "Quebra Telefônica #01 (CDR/ERB)", kind: "Telefônica", source: "Operadora fictícia — CDR/ERB", date: "18/03/2026", owner: "Agente Souza", status: "Concluído", summary: "Registros de chamadas (CDR) e ERBs. Alvo A conectado a ERB Asa Sul em horários coincidentes com saques registrados no RIF.", citations: ["212 chamadas entre Alvo A e (61) 90000-0000", "ERB Asa Sul — 08h às 11h", "Coincidência com saques de 05/02/2026"] },
  { id: "ocor", title: "Ocorrências Policiais (3 vinculadas)", kind: "Bases PCDF", source: "Consulta Bases PCDF", date: "10/03/2026", owner: "Daniel", status: "Concluído", summary: "Três ocorrências fictícias vinculadas ao CPF 000.000.000-00, incluindo a Ocorrência nº 432/2025/1º DP por indícios de atividade financeira suspeita.", citations: ["Ocorrência nº 432/2025/1º DP", "Ocorrência nº 118/2025/5º DP", "Ocorrência nº 077/2026/DRF"] },
  { id: "oit", title: "Oitiva: Testemunha A (Transcrita)", kind: "Transcrição de Oitivas", source: "PCDF Transcriptor", date: "20/03/2026", owner: "Escrivã Lima", status: "Concluído", summary: "Transcrição da oitiva da Testemunha A, que relata ter visto o Alvo A entregar envelopes a um \"despachante\" em frente a cartório.", citations: ["\"Ele chamava o homem de despachante\" (00:12:41)", "Entregas semanais às sextas-feiras", "Local: Setor Comercial Sul"] },
];

const initialChat = (): ChatMsg[] => [
  {
    id: "m0",
    role: "agent",
    text: "Analisei a base de ocorrências policiais do DF e cruzei com o RIF (ARIA) e a quebra de dados telemáticos deste notebook. Principais achados:",
    bullets: [
      { text: "3 ocorrências policiais vinculadas ao CPF 000.000.000-00, incluindo a Ocorrência nº 432/2025/1º DP.", refs: ["ocor"] },
      { text: "O RIF aponta movimentação total de R$ 50.000.000,00 em 14 contas, com depósitos fracionados.", refs: ["rif01"] },
      { text: "Na quebra do WhatsApp há 37 mensagens com o termo \"despachante\", associadas a pagamentos.", refs: ["tel01", "oit"] },
    ],
  },
];

const seed = (): Notebook[] => [
  { id: "op-una", name: "Op. UNA", tipo: "Operação", numero: "IP 045/2026", sigilo: "Reservado", descricao: "Apuração de lavagem de dinheiro com uso de intermediários (\"despachantes\").", equipe: ["Daniel", "Agente Souza", "Escrivã Lima", "Delegada Ramos"], updated: "Atualizado hoje", analyses: baseAnalyses(), chat: initialChat(), report: "" },
  { id: "ip-112", name: "Furtos Qualificados — Taguatinga", tipo: "Inquérito", numero: "IP 112/2026", sigilo: "Restrito", descricao: "Série de furtos a estabelecimentos comerciais.", equipe: ["Daniel", "Agente Costa"], updated: "Atualizado há 3 dias", analyses: baseAnalyses().slice(2, 4), chat: [{ id: "m0", role: "agent", text: "Notebook pronto. Cruzei as ocorrências e a quebra telefônica disponíveis.", bullets: [{ text: "3 ocorrências relacionadas ao padrão de atuação.", refs: ["ocor"] }] }], report: "" },
  { id: "proc-09", name: "Estelionato Digital — Golpe do Pix", tipo: "Procedimento", numero: "PA 009/2026", sigilo: "Sigiloso", descricao: "Contas laranja utilizadas em golpes via Pix.", equipe: ["Daniel", "Agente Prado", "Delegado Melo"], updated: "Atualizado há 1 semana", analyses: baseAnalyses().slice(0, 2), chat: [{ id: "m0", role: "agent", text: "Analisei o RIF e a telemática deste notebook.", bullets: [{ text: "Movimentação atípica identificada no RIF.", refs: ["rif01"] }] }], report: "" },
];

const KEY = "pcdf-notebooks-v1";

export function useNotebooks() {
  const [list, setList] = useState<Notebook[]>(seed);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setList(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);
  const save = useCallback((fn: (l: Notebook[]) => Notebook[]) => {
    setList((prev) => {
      const next = fn(prev);
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);
  const update = useCallback(
    (id: string, fn: (n: Notebook) => Notebook) => save((l) => l.map((n) => (n.id === id ? { ...fn(n), updated: "Atualizado agora" } : n))),
    [save],
  );
  return { list, ready, save, update };
}

export const ANALYSIS_TYPES = [
  { kind: "RIF/ARIA", label: "RIF / ARIA", desc: "Relatório de Inteligência Financeira", source: "ARIA — Inteligência Financeira" },
  { kind: "Telemática", label: "Telemática", desc: "WhatsApp, e-mail, nuvem", source: "Provedor fictício" },
  { kind: "Telefônica", label: "Telefônica", desc: "CDR / ERB", source: "Operadora fictícia" },
  { kind: "Rastreador", label: "Rastreador", desc: "Geolocalização veicular", source: "Rastreador fictício" },
  { kind: "Transcrição de Oitivas", label: "Transcrição de Oitivas", desc: "Depoimentos e interrogatórios", source: "PCDF Transcriptor" },
  { kind: "Transcritor Geral", label: "Transcritor Geral", desc: "Áudios e vídeos diversos", source: "PCDF Transcriptor" },
  { kind: "Bases PCDF", label: "Consulta Bases PCDF", desc: "Ocorrências e procedimentos", source: "Consulta Bases PCDF" },
];

/** Keyword-based mock agent. Always cites notebook sources; refuses if no source. */
export function agentReply(q: string, analyses: Analysis[]): ChatMsg {
  const t = q.toLowerCase();
  const has = (k: string) => analyses.find((a) => a.kind === k || a.id === k);
  const out: { text: string; refs: string[] }[] = [];
  const add = (kind: string, text: string) => {
    const a = has(kind);
    if (a) out.push({ text, refs: [a.id] });
  };
  if (/cpf|alvo/.test(t)) {
    add("Bases PCDF", "O CPF 000.000.000-00 (Alvo A) aparece em 3 ocorrências policiais, entre elas a nº 432/2025/1º DP.");
    add("RIF/ARIA", "O mesmo CPF é titular ou procurador em 14 contas listadas no RIF.");
  }
  if (/rif|financ|conta|dinheiro|movimenta/.test(t)) add("RIF/ARIA", "O RIF registra movimentação total de R$ 50.000.000,00, com depósitos fracionados abaixo de R$ 10 mil.");
  if (/ocorr|bo\b|procedimento/.test(t)) add("Bases PCDF", "Há 3 ocorrências vinculadas: 432/2025/1º DP, 118/2025/5º DP e 077/2026/DRF.");
  if (/cronolog|linha do tempo|tempo|data/.test(t)) {
    add("Bases PCDF", "Nov/2025 — Registro da Ocorrência nº 432/2025/1º DP.");
    add("Telemática", "02/02/2026 — Áudios encaminhados ao contato \"Desp. Centro\".");
    add("Telefônica", "05/02/2026 — Alvo A conectado à ERB Asa Sul, coincidindo com saques.");
    add("RIF/ARIA", "Fev/2026 — Pico de depósitos fracionados no RIF.");
    add("Transcrição de Oitivas", "20/03/2026 — Testemunha A relata entregas semanais ao \"despachante\".");
  }
  if (/v[ií]nculo|grafo|rela[cç]/.test(t)) {
    add("Telefônica", "Alvo A ↔ (61) 90000-0000: 212 chamadas no período.");
    add("Telemática", "(61) 90000-0000 está salvo como \"Desp. Centro\" no WhatsApp do Alvo A.");
    add("Transcrição de Oitivas", "A Testemunha A identifica o interlocutor como \"despachante\".");
    add("RIF/ARIA", "Contas do Alvo A recebem depósitos de terceiros não identificados.");
  }
  if (/telefon|cdr|erb|liga/.test(t)) add("Telefônica", "A quebra CDR/ERB mostra 212 chamadas entre o Alvo A e (61) 90000-0000, com ERB Asa Sul predominante.");
  if (/whats|mensag|despachante|telem/.test(t)) add("Telemática", "Foram identificadas 37 mensagens com o termo \"despachante\" no WhatsApp do Alvo A.");
  if (/rastre|ve[ií]culo|gps/.test(t)) add("Rastreador", "O rastreador registra paradas recorrentes no Setor Comercial Sul às sextas-feiras.");
  if (/testemunha|oitiva/.test(t)) add("Transcrição de Oitivas", "A Testemunha A relata entregas de envelopes ao \"despachante\" (00:12:41).");

  const uniq = out.filter((b, i) => out.findIndex((x) => x.text === b.text) === i);
  if (!uniq.length) return { id: uid(), role: "agent", text: "Não encontrei essa informação nas análises deste notebook." };
  return { id: uid(), role: "agent", text: "Com base nas fontes deste notebook:", bullets: uniq };
}

export function buildReport(n: Notebook) {
  const ref = (id: string, label: string) => (n.analyses.some((a) => a.id === id) ? `[[${id}|${label}]]` : "");
  return [
    `# SÍNTESE DA INVESTIGAÇÃO — ${n.name} (${n.numero})`,
    `## 1. Objeto`,
    `${n.descricao}`,
    `## 2. Qualificação do alvo`,
    `O Alvo A (CPF 000.000.000-00) é mencionado na Ocorrência Policial nº 432/2025/1º DP em indícios de atividade financeira suspeita. ${ref("ocor", "#Ocorrências Policiais")}`,
    `## 3. Análise financeira`,
    `A análise do RIF (ARIA) aponta movimentação total de R$ 50 milhões, distribuída em 14 contas, com depósitos fracionados. ${ref("rif01", "#Análise RIF #01")}`,
    `## 4. Comunicações`,
    `A quebra telemática identificou 37 mensagens com o termo "despachante" ${ref("tel01", "#Quebra Telemática #01")}, e a quebra telefônica registrou 212 chamadas com o mesmo interlocutor ${ref("cdr01", "#Quebra Telefônica #01")}.`,
    `## 5. Prova testemunhal`,
    `A Testemunha A confirma entregas semanais de envelopes ao "despachante". ${ref("oit", "#Oitiva Testemunha A")}`,
    `## 6. Conclusão preliminar`,
    `Os elementos convergem para a hipótese de uso de intermediário na ocultação de valores, recomendando-se aprofundamento das diligências.`,
  ].join("\n");
}
