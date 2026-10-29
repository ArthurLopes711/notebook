import { describe, expect, it } from "vitest";
import { agentReply, buildReport, baseAnalyses, type Notebook } from "@/lib/pcdf-store";

describe("PCDF Store - Mock AI Agent (agentReply)", () => {
  const analyses = baseAnalyses();

  it("cites RIF when asked about financial movements", () => {
    const reply = agentReply("Qual foi a movimentação financeira no RIF?", analyses);
    expect(reply.role).toBe("agent");
    expect(reply.bullets?.length).toBeGreaterThan(0);
    expect(reply.bullets?.[0].refs).toContain("rif01");
  });

  it("cites Bases PCDF when asked about occurrences", () => {
    const reply = agentReply("Quais ocorrências foram encontradas?", analyses);
    expect(reply.role).toBe("agent");
    expect(reply.bullets?.length).toBeGreaterThan(0);
    expect(reply.bullets?.[0].refs).toContain("ocor");
  });

  it("refuses to answer when information is not in the notebook", () => {
    const reply = agentReply("Qual é a capital da Austrália?", analyses);
    expect(reply.role).toBe("agent");
    expect(reply.text).toContain("Não encontrei essa informação nas análises deste notebook.");
  });

  it("builds an investigation report citing available sources", () => {
    const nb: Notebook = {
      id: "test-nb",
      name: "Caso Teste",
      tipo: "Inquérito",
      numero: "IP 999/2026",
      sigilo: "Reservado",
      descricao: "Investigação teste.",
      equipe: ["Daniel"],
      updated: "Hoje",
      analyses,
      chat: [],
      report: "",
    };

    const report = buildReport(nb);
    expect(report).toContain("SÍNTESE DA INVESTIGAÇÃO — Caso Teste (IP 999/2026)");
    expect(report).toContain("[[rif01|#Análise RIF #01]]");
    expect(report).toContain("[[ocor|#Ocorrências Policiais]]");
  });
});

