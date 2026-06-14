import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, Badge } from "@/components/app-shell";
import { Search, Filter, LayoutGrid, List, Star, Plus, Bot, MoreHorizontal, Sparkles } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/agentes")({
  head: () => ({ meta: [{ title: "Agentes · EngenLab" }] }),
  component: AgentesPage,
});

type Agent = {
  name: string;
  slug: string;
  description: string;
  category: string;
  status: "ativo" | "rascunho" | "inativo";
  tags: string[];
  favorite: boolean;
  type: "seed" | "custom";
  runs: number;
};

const agents: Agent[] = [
  { name: "Code Reviewer", slug: "code-reviewer", description: "Revisa pull requests aplicando padrões internos de qualidade e segurança.", category: "Engenharia", status: "ativo", tags: ["typescript", "review"], favorite: true, type: "seed", runs: 412 },
  { name: "PDF Extractor", slug: "extractor-pdf", description: "Extrai dados estruturados de contratos, faturas e relatórios em PDF.", category: "Extração", status: "ativo", tags: ["pdf", "ocr"], favorite: true, type: "seed", runs: 318 },
  { name: "QA Engineer", slug: "qa-engineer", description: "Gera casos de teste e cenários BDD a partir de specs.", category: "Testes", status: "ativo", tags: ["bdd", "playwright"], favorite: false, type: "seed", runs: 254 },
  { name: "Mail Sender", slug: "mail-sender", description: "Compõe e dispara campanhas transacionais com templates dinâmicos.", category: "Envio", status: "rascunho", tags: ["smtp", "templates"], favorite: false, type: "custom", runs: 187 },
  { name: "Summarizer", slug: "summarizer", description: "Resume threads, reuniões e documentos longos em bullets acionáveis.", category: "Conteúdo", status: "ativo", tags: ["resumo"], favorite: false, type: "seed", runs: 162 },
  { name: "SQL Architect", slug: "sql-architect", description: "Projeta queries otimizadas e revisa schemas relacionais.", category: "Engenharia", status: "ativo", tags: ["postgres", "sql"], favorite: true, type: "custom", runs: 144 },
  { name: "Doc Writer", slug: "doc-writer", description: "Gera documentação técnica a partir de código fonte e ADRs.", category: "Conteúdo", status: "inativo", tags: ["markdown"], favorite: false, type: "custom", runs: 92 },
  { name: "Slack Triage", slug: "slack-triage", description: "Classifica mensagens recebidas e roteia para times responsáveis.", category: "Envio", status: "rascunho", tags: ["slack"], favorite: false, type: "custom", runs: 31 },
];

const categories = ["Todos", "Engenharia", "Extração", "Testes", "Envio", "Conteúdo"];

function statusTone(s: Agent["status"]) {
  return s === "ativo" ? "success" : s === "rascunho" ? "warning" : "outline";
}

function AgentesPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [cat, setCat] = useState("Todos");
  const [query, setQuery] = useState("");
  const [onlyFav, setOnlyFav] = useState(false);

  const filtered = agents.filter((a) => {
    if (cat !== "Todos" && a.category !== cat) return false;
    if (onlyFav && !a.favorite) return false;
    if (query && !`${a.name} ${a.description} ${a.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <AppShell title="Agentes">
      <PageHeader title="Catálogo de agentes" description="Crie, edite e organize agentes especializados para o seu workspace.">
        <button className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-secondary/60 px-3 text-sm font-medium hover:bg-secondary">
          <Sparkles className="h-4 w-4" /> Importar seed
        </button>
        <button className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-90">
          <Plus className="h-4 w-4" /> Novo agente
        </button>
      </PageHeader>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3 md:px-6">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome, descrição ou tag..."
            className="h-9 w-full rounded-md border border-border bg-secondary/60 pl-8 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
          />
        </div>
        <div className="flex items-center gap-1 rounded-md border border-border bg-secondary/40 p-0.5">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-2.5 py-1 text-xs font-medium rounded ${cat === c ? "bg-background text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {c}
            </button>
          ))}
        </div>
        <button
          onClick={() => setOnlyFav((v) => !v)}
          className={`inline-flex h-9 items-center gap-1.5 rounded-md border border-border px-3 text-xs font-medium ${onlyFav ? "bg-primary/10 text-primary border-primary/40" : "bg-secondary/40"}`}
        >
          <Star className={`h-3.5 w-3.5 ${onlyFav ? "fill-primary" : ""}`} /> Favoritos
        </button>
        <button className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-secondary/40 px-3 text-xs font-medium">
          <Filter className="h-3.5 w-3.5" /> Filtros
        </button>
        <div className="ml-auto flex items-center gap-1 rounded-md border border-border bg-secondary/40 p-0.5">
          <button onClick={() => setView("grid")} className={`grid h-7 w-7 place-items-center rounded ${view === "grid" ? "bg-background" : ""}`} aria-label="Grade"><LayoutGrid className="h-3.5 w-3.5" /></button>
          <button onClick={() => setView("list")} className={`grid h-7 w-7 place-items-center rounded ${view === "list" ? "bg-background" : ""}`} aria-label="Lista"><List className="h-3.5 w-3.5" /></button>
        </div>
      </div>

      <div className="p-4 md:p-6">
        {filtered.length === 0 ? (
          <EmptyState query={query} />
        ) : view === "grid" ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filtered.map((a) => (
              <article key={a.slug} className="panel group flex flex-col p-4 hover:border-primary/40 transition-colors">
                <header className="flex items-start gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-secondary border border-border">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-sm font-semibold">{a.name}</h3>
                      {a.type === "seed" && <Badge tone="info">seed</Badge>}
                    </div>
                    <p className="font-mono text-[11px] text-muted-foreground truncate">{a.slug}</p>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Favoritar">
                    <Star className={`h-4 w-4 ${a.favorite ? "fill-warning text-warning" : "text-muted-foreground"}`} />
                  </button>
                </header>
                <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">{a.description}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {a.tags.map((t) => (
                    <Badge key={t} tone="outline">#{t}</Badge>
                  ))}
                </div>
                <footer className="mt-4 flex items-center justify-between border-t border-border pt-3">
                  <Badge tone={statusTone(a.status)}>{a.status}</Badge>
                  <span className="text-[11px] tabular-nums text-muted-foreground">{a.runs} execuções</span>
                </footer>
              </article>
            ))}
          </div>
        ) : (
          <div className="panel overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
                  <th className="px-4 py-2 font-medium">Agente</th>
                  <th className="px-4 py-2 font-medium">Categoria</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                  <th className="px-4 py-2 font-medium">Tipo</th>
                  <th className="px-4 py-2 font-medium text-right">Execuções</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((a) => (
                  <tr key={a.slug} className="hover:bg-secondary/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Star className={`h-3.5 w-3.5 ${a.favorite ? "fill-warning text-warning" : "text-muted-foreground/40"}`} />
                        <div>
                          <div className="font-medium">{a.name}</div>
                          <div className="font-mono text-[11px] text-muted-foreground">{a.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><Badge tone="outline">{a.category}</Badge></td>
                    <td className="px-4 py-3"><Badge tone={statusTone(a.status)}>{a.status}</Badge></td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{a.type}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{a.runs}</td>
                    <td className="px-4 py-3 text-right"><MoreHorizontal className="inline h-4 w-4 text-muted-foreground" /></td>
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

function EmptyState({ query }: { query: string }) {
  return (
    <div className="panel grid place-items-center py-16 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-full border border-border bg-secondary/50">
        <Bot className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-sm font-semibold">{query ? "Nenhum agente encontrado" : "Nenhum agente cadastrado"}</h3>
      <p className="mt-1 max-w-sm text-xs text-muted-foreground">
        {query ? "Ajuste os filtros ou tente outra busca." : "Crie seu primeiro agente ou importe a partir de um seed do EngenLab."}
      </p>
      <div className="mt-4 flex gap-2">
        <button className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-secondary/60 px-3 text-xs font-medium">
          <Sparkles className="h-3.5 w-3.5" /> Importar seed
        </button>
        <button className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground">
          <Plus className="h-3.5 w-3.5" /> Novo agente
        </button>
      </div>
    </div>
  );
}
