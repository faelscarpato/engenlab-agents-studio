import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, Badge } from "@/components/app-shell";
import {
  Search,
  LayoutGrid,
  List,
  Star,
  Plus,
  Bot,
  MoreHorizontal,
  Sparkles,
} from "lucide-react";
import { useState, ChangeEvent } from "react";

export const Route = createFileRoute("/agentes")({
  head: () => ({
    meta: [{ title: "Agentes · EngenLab" }],
  }),
  component: AgentesPage,
});

type AgentStatus = "ativo" | "rascunho" | "inativo";
type AgentType = "seed" | "custom";

type Agent = {
  name: string;
  slug: string;
  description: string;
  category: string;
  status: AgentStatus;
  tags: string[];
  favorite: boolean;
  type: AgentType;
  runs: number;
};

const agents: Agent[] = [
  {
    name: "Code Reviewer",
    slug: "code-reviewer",
    description:
      "Revisa pull requests aplicando padrões internos de qualidade e segurança.",
    category: "Engenharia",
    status: "ativo",
    tags: ["typescript", "review"],
    favorite: true,
    type: "seed",
    runs: 412,
  },
  {
    name: "PDF Extractor",
    slug: "extractor-pdf",
    description:
      "Extrai dados estruturados de contratos, faturas e relatórios em PDF.",
    category: "Extração",
    status: "ativo",
    tags: ["pdf", "ocr"],
    favorite: true,
    type: "seed",
    runs: 318,
  },
  {
    name: "QA Engineer",
    slug: "qa-engineer",
    description: "Gera casos de teste e cenários BDD a partir de specs.",
    category: "Testes",
    status: "ativo",
    tags: ["bdd", "playwright"],
    favorite: false,
    type: "seed",
    runs: 254,
  },
  {
    name: "Mail Sender",
    slug: "mail-sender",
    description:
      "Compõe e dispara campanhas transacionais com templates dinâmicos.",
    category: "Envio",
    status: "rascunho",
    tags: ["smtp", "templates"],
    favorite: false,
    type: "custom",
    runs: 187,
  },
  {
    name: "Summarizer",
    slug: "summarizer",
    description:
      "Resume threads, reuniões e documentos longos em bullets acionáveis.",
    category: "Conteúdo",
    status: "ativo",
    tags: ["resumo"],
    favorite: false,
    type: "seed",
    runs: 162,
  },
  {
    name: "SQL Architect",
    slug: "sql-architect",
    description: "Projeta queries otimizadas e revisa schemas relacionais.",
    category: "Engenharia",
    status: "ativo",
    tags: ["postgres", "sql"],
    favorite: true,
    type: "custom",
    runs: 144,
  },
  {
    name: "Doc Writer",
    slug: "doc-writer",
    description:
      "Gera documentação técnica a partir de código fonte e ADRs.",
    category: "Conteúdo",
    status: "inativo",
    tags: ["markdown"],
    favorite: false,
    type: "custom",
    runs: 92,
  },
  {
    name: "Slack Triage",
    slug: "slack-triage",
    description:
      "Classifica mensagens recebidas e roteia para times responsáveis.",
    category: "Envio",
    status: "rascunho",
    tags: ["slack"],
    favorite: false,
    type: "custom",
    runs: 31,
  },
];

const categories = ["Todos", "Engenharia", "Extração", "Testes", "Envio", "Conteúdo"] as const;

function statusTone(status: AgentStatus) {
  switch (status) {
    case "ativo":
      return "success" as const;
    case "rascunho":
      return "warning" as const;
    case "inativo":
    default:
      return "outline" as const;
  }
}

function typeLabel(type: AgentType) {
  return type === "seed" ? "Seed oficial" : "Custom";
}

function AgentesPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [category, setCategory] = useState<(typeof categories)[number]>("Todos");
  const [query, setQuery] = useState("");
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const filteredAgents = agents.filter((agent) => {
    if (category !== "Todos" && agent.category !== category) return false;
    if (onlyFavorites && !agent.favorite) return false;

    if (query) {
      const haystack = `${agent.name} ${agent.description} ${agent.tags.join(" ")}`.toLowerCase();
      if (!haystack.includes(query.toLowerCase())) return false;
    }

    return true;
  });

  return (
    <AppShell title="Agentes">
      <PageHeader
        title="Agentes"
        description="Catálogo de agentes prontos e customizados para o seu workspace."
      >
        <button className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-secondary/40 px-3 text-xs font-medium hover:bg-secondary/60">
          <Sparkles className="h-3.5 w-3.5" />
          Importar seed
        </button>
        <button className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-90">
          <Plus className="h-4 w-4" />
          Novo agente
        </button>
      </PageHeader>

      <div className="px-4 py-4 md:px-6 md:py-5 space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          {/* Busca */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={handleSearchChange}
              placeholder="Buscar por nome, descrição ou tag..."
              className="h-9 w-full rounded-md border border-border bg-secondary/60 pl-8 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
            />
          </div>

          {/* Filtros à direita */}
          <div className="flex flex-wrap items-center gap-2 justify-between md:justify-end">
            {/* Categorias */}
            <div className="flex flex-wrap gap-1">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                    category === c
                      ? "bg-background text-foreground border border-border"
                      : "text-muted-foreground hover:text-foreground bg-secondary/40"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Favoritos e view */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setOnlyFavorites((v) => !v)}
                className={`inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-3 text-xs font-medium transition-colors ${
                  onlyFavorites
                    ? "bg-primary/10 text-primary border-primary/40"
                    : "bg-secondary/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                <Star
                  className={`h-3.5 w-3.5 ${
                    onlyFavorites ? "fill-primary text-primary" : ""
                  }`}
                />
                Favoritos
              </button>

              <div className="inline-flex items-center gap-1 rounded-md bg-secondary/40 p-0.5">
                <button
                  type="button"
                  onClick={() => setView("grid")}
                  className={`grid h-7 w-7 place-items-center rounded transition-colors ${
                    view === "grid"
                      ? "bg-background text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-label="Grade"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setView("list")}
                  className={`grid h-7 w-7 place-items-center rounded transition-colors ${
                    view === "list"
                      ? "bg-background text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-label="Lista"
                >
                  <List className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        {filteredAgents.length === 0 ? (
          <EmptyState query={query} />
        ) : view === "grid" ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredAgents.map((agent) => (
              <article
                key={agent.slug}
                className="group flex flex-col rounded-lg border border-border bg-card p-4 hover:border-primary/50 hover:shadow-sm transition-colors"
              >
                <header className="flex items-start gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-sm font-semibold leading-tight">
                        {agent.name}
                      </h3>
                      {agent.favorite && (
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {agent.slug}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="grid h-7 w-7 place-items-center rounded-md hover:bg-secondary/60"
                  >
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </button>
                </header>

                <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                  {agent.description}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Badge tone={statusTone(agent.status)}>
                    {agent.status === "ativo"
                      ? "Ativo"
                      : agent.status === "rascunho"
                      ? "Rascunho"
                      : "Inativo"}
                  </Badge>
                  <Badge tone={agent.type === "seed" ? "info" : "default"}>
                    {typeLabel(agent.type)}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground">
                    {agent.runs} execuções
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {agent.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-secondary/60 px-2 py-0.5 text-[10px] text-muted-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <table className="min-w-full text-sm">
              <thead className="bg-secondary/40 text-xs text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Agente</th>
                  <th className="px-3 py-2 text-left font-medium">Categoria</th>
                  <th className="px-3 py-2 text-left font-medium">Status</th>
                  <th className="px-3 py-2 text-left font-medium">Tipo</th>
                  <th className="px-3 py-2 text-right font-medium">
                    Execuções
                  </th>
                  <th className="px-3 py-2 text-right font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filteredAgents.map((agent) => (
                  <tr
                    key={agent.slug}
                    className="border-t border-border/60 hover:bg-secondary/40"
                  >
                    <td className="px-3 py-2 align-middle">
                      <div className="flex items-center gap-2">
                        <div className="grid h-7 w-7 place-items-center rounded-md bg-primary/10 text-primary">
                          <Bot className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="truncate text-sm font-medium">
                              {agent.name}
                            </span>
                            {agent.favorite && (
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            )}
                          </div>
                          <span className="block truncate text-[11px] text-muted-foreground">
                            {agent.slug}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2 align-middle text-xs">
                      {agent.category}
                    </td>
                    <td className="px-3 py-2 align-middle text-xs">
                      <Badge tone={statusTone(agent.status)}>
                        {agent.status === "ativo"
                          ? "Ativo"
                          : agent.status === "rascunho"
                          ? "Rascunho"
                          : "Inativo"}
                      </Badge>
                    </td>
                    <td className="px-3 py-2 align-middle text-xs">
                      <Badge tone={agent.type === "seed" ? "info" : "default"}>
                        {typeLabel(agent.type)}
                      </Badge>
                    </td>
                    <td className="px-3 py-2 align-middle text-right text-xs text-muted-foreground">
                      {agent.runs}
                    </td>
                    <td className="px-3 py-2 align-middle text-right">
                      <button
                        type="button"
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-secondary/60"
                      >
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
}

type EmptyStateProps = {
  query: string;
};

function EmptyState({ query }: EmptyStateProps) {
  const hasQuery = Boolean(query);

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/40 px-6 py-12 text-center">
      <Bot className="h-10 w-10 text-muted-foreground/60" />
      <h3 className="mt-3 text-sm font-semibold">
        {hasQuery ? "Nenhum agente encontrado" : "Nenhum agente cadastrado"}
      </h3>
      <p className="mt-1 max-w-md text-xs text-muted-foreground">
        {hasQuery
          ? "Ajuste os filtros ou tente outra busca para encontrar seus agentes."
          : "Crie seu primeiro agente ou importe a partir de um seed oficial do EngenLab."}
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <button className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-secondary/40 px-3 text-xs font-medium hover:bg-secondary/60">
          <Sparkles className="h-3.5 w-3.5" />
          Importar seed
        </button>
        <button className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-90">
          <Plus className="h-4 w-4" />
          Novo agente
        </button>
      </div>
    </div>
  );
}
