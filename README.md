# Alfa PCDF — PCDFNotebook

<p align="center">
  <img src="public/pcdf-logo.png" alt="Brasão da Polícia Civil do Distrito Federal" width="120" />
</p>

<p align="center">
  <strong>Plataforma Soberana de Inteligência e Investigação Policial</strong><br />
  <em>Polícia Civil do Distrito Federal (PCDF)</em>
</p>

---

## 📌 Visão Geral

O **PCDFNotebook** é um workspace integrado de investigação policial desenvolvido como parte do ecossistema **Alfa PCDF**. A plataforma centraliza fontes de dados investigativas (RIFs do sistema ARIA, quebras telemáticas e telefônicas, consultas a bases de ocorrências e transcrições de oitivas) em um ambiente isolado por caso concreto.

O sistema conta com um **Agente de Inteligência Artificial com rastreabilidade estrita**: todas as respostas citam diretamente as análises presentes no notebook, e o agente recusa responder a qualquer informação não fundamentada nas fontes do caso.

---

## 🛡️ Principais Funcionalidades

### 1. Gestão de Notebooks por Caso Concreto
- **Isolamento Lógico:** Cada inquérito, operação ou procedimento possui seu próprio repositório de análises, conversas e equipe designada.
- **Classificação de Sigilo:** Suporte a 4 níveis de sigilo conforme a legislação vigente:
  - `Público`
  - `Restrito`
  - `Reservado`
  - `Sigiloso`
- **Filtros e Busca:** Filtragem instantânea por texto, tipo de procedimento e nível de confidencialidade.
- **Restauração de Casos Demonstrativos:** Opção com um clique para restaurar dados de simulação.

### 2. Painel de Análises & Fontes Investigativas
- **RIF / ARIA:** Relatórios de Inteligência Financeira com apontamento de contas, fracionamentos e movimentações atípicas.
- **Telemática:** Extração de mensagens e áudios de aplicativos de comunicação.
- **Telefônica (CDR / ERB):** Registros de chamadas e estações rádio-base com correlação temporal e geográfica.
- **Consulta a Bases PCDF:** Vinculação direta de ocorrências e procedimentos policiais.
- **Transcrição de Oitivas:** Integração conceitual com o *PCDF Transcriptor* para interrogatórios e testemunhos.

### 3. Agente de IA com Rastreabilidade (Traceability)
- **Citação Obrigatória:** Cada fato levantado pelo agente é acompanhado de um chip interativo que referencia a análise de origem.
- **Detecção de Vínculos e Linha do Tempo:** Botões de atalho para gerar cronologias e mapeamento de vínculos (grafo).
- **Recusa Ativa:** O agente não alucina nem responde sobre informações externas ausentes nas fontes do notebook.

### 4. Estúdio de Relatório Integrado
- **Geração de Minuta com Citações:** Síntese automática da investigação estruturada em tópicos (Objeto, Qualificação do Alvo, Análise Financeira, Comunicações, Prova Testemunhal e Conclusão).
- **Chips Interativos:** Citações no texto permitem abrir os detalhes da fonte correspondente com um clique.
- **Edição & Ferramentas de Formatação:** Suporte a Markdown com atalhos de negrito, itálico e listas.
- **Exportação:** Exportação da minuta com referências completas.

---

## 🏛️ Identidade Visual e Brasão Oficial PCDF

O sistema conta com a identidade visual da Polícia Civil do Distrito Federal:
- **Aba do Navegador (Favicon):** Brasão oficial com fundo transparente de alta resolução configurado como favicon, shortcut icon e apple-touch-icon (`/pcdf-logo.png` e `/favicon.ico`).
- **Barra Superior (Cabeçalho):** O brasão da PCDF está posicionado à direita da marcação institucional **"ALFA PCDF"** em todas as telas da aplicação.
- **Paleta de Cores Soberana:** Tons escuros de alta segurança contrastados com o dourado institucional (`--gradient-gold`).

---

## 🏗️ Arquitetura Técnica

- **Framework:** [TanStack Start](https://tanstack.com/start) com [TanStack Router](https://tanstack.com/router)
- **Linguagem:** TypeScript (Strict Mode)
- **Estilização:** Tailwind CSS v4 + OKLCH Design Tokens + Lucide Icons
- **Gerenciamento de Estado:** Armazenamento reativo via `localStorage` com suporte seguro a SSR e fallback para dados semente (`seed`)
- **Sem Dependência de Backend:** Protótipo front-end autônomo, atendendo ao requisito de isolamento e rastreabilidade total.

---

## 📁 Estrutura do Projeto

```text
├── public/
│   ├── favicon.ico              # Favicon do brasão PCDF
│   ├── pcdf-logo.png            # Brasão PCDF em alta resolução (fundo transparente)
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── pcdf/
│   │   │   ├── AgentChat.tsx             # Central de conversação com o Agente de IA
│   │   │   ├── AnalysesPanel.tsx         # Listagem e gatilhos de análises/fontes
│   │   │   ├── CreateNotebookDialog.tsx  # Modal de criação de novo notebook
│   │   │   ├── Dialogs.tsx               # Modais de nova análise, bases PCDF, partilha e detalhes
│   │   │   ├── NotebookList.tsx          # Grid de notebooks com filtros e busca
│   │   │   ├── RefChip.tsx               # Chip interativo de citação e rastreabilidade
│   │   │   ├── ReportStudio.tsx          # Estúdio de edição e exportação de relatório
│   │   │   └── Shell.tsx                 # Layout principal, barra superior (logo) e sidebar
│   │   └── ui/                           # Componentes do design system (Radix + Tailwind)
│   ├── lib/
│   │   ├── pcdf-store.ts        # Gerenciamento de notebooks, análises e agente mock
│   │   └── utils.ts             # Funções utilitárias (cn, classnames)
│   ├── routes/
│   │   ├── __root.tsx           # Shell raiz, metatags, fontes e favicon
│   │   ├── index.tsx            # Página inicial ("Meus Notebooks")
│   │   └── notebook.$id.tsx     # Workspace do notebook por caso
│   ├── test/
│   │   ├── app-routing.test.tsx # Teste de roteamento da aplicação
│   │   └── pcdf-store.test.ts   # Teste do agente de IA e rastreabilidade
│   └── styles.css               # Tema escuro, design tokens OKLCH e gradientes dourados
└── AGENTS.md                    # Regras de arquitetura e sincronização com Lovable
```

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) versão 18 ou superior
- [npm](https://www.npmjs.com/) ou [bun](https://bun.sh/)

### Passo a Passo

1. **Instalar as dependências:**
   ```bash
   npm install
   ```

2. **Iniciar o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Acessar no navegador:**
   Abra `http://localhost:3000` (ou a porta indicada no terminal).

4. **Executar os testes:**
   ```bash
   npm test
   ```

---

## 🔒 Segurança e Dados Fictícios

> [!NOTE]
> Este projeto é um protótipo de demonstração de interface e fluxos investigativos.
> Todos os nomes, CPFs, contas bancárias, números de inquérito e dados telefônicos apresentados são **estritamente fictícios** para fins ilustrativos.
