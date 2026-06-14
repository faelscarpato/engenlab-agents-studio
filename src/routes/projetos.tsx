import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, Badge } from "@/components/app-shell";
import { FolderKanban, Users, Calendar, Plus, MoreHorizontal } from "lucide-react";

export const Route = createFileRoute("/projetos")({
  head: () => ({ meta: [{ title: "Projetos · EngenLab" }] }),
  component: ProjetosPage,
});

const projects = [
  { name: "Plataforma Core", desc: "Refatoração do monolito para arquitetura modular.", tags: ["typescript", "monorepo"], status: "ativo" as const, members: 6, agents: 4, updated: "há 12min" },
  { name: "Onboarding clientes", desc: "Automação de coleta de documentos e KYC.", tags: ["kyc", "extração"], status: "ativo" as const, members: 3, agents: 5, updated: "há 1h" },
  { name: "Refatoração API", desc: "Migração para tRPC + Zod com testes E2E.", tags: ["trpc", "tests"], status: "ativo" as const, members: 4, agents: 3, updated: "há 3h" },
  { name: "Campanha Q4", desc: "Pipeline de envio segmentado e personalizado.", tags: ["envio", "templates"], status: "pausado" as const, members: 2, agents: 2, updated: "ontem" },
  { name: "Relatórios mensais", desc: "Geração automática de relatórios financeiros.", tags: ["pdf", "resumo"], status: "ativo" as const, members: 3, agents: 3, updated: "ontem" },
  { name: "Doc Portal", desc: "Documentação interna sincronizada com o repositório.", tags: ["docs"], status: "rascunho" as const, members: 1, agents: 1, updated: "3 dias" },
];

function tone(s: "ativo" | "pausado" | "rascunho") {
  return s === "ativo" ? "success" : s === "pausado" ? "warning" : "outline";
}

function ProjetosPage() {
  return (
    <AppShell title="Projetos">
      <PageHeader title="Projetos" description="Contextos persistentes que agrupam agentes, prompts e fluxos por iniciativa.">
        <button className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-90">
          <Plus className="h-4 w-4" /> Novo projeto
        </button>
      </PageHeader>

      <div className="grid gap-3 p-4 md:p-6 sm:grid-cols-2 xl:grid-cols-3">
        {projects.map((p) => (
          <article key={p.name} className="panel flex flex-col p-4 hover:border-primary/40 transition-colors">
            <header className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-secondary border border-border">
                <FolderKanban className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-sm font-semibold">{p.name}</h3>
                  <Badge tone={tone(p.status)}>{p.status}</Badge>
                </div>
                <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{p.desc}</p>
              </div>
              <button className="text-muted-foreground hover:text-foreground" aria-label="Mais">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </header>

            <div className="mt-3 flex flex-wrap gap-1">
              {p.tags.map((t) => <Badge key={t} tone="outline">#{t}</Badge>)}
            </div>

            <footer className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-1.5"><Users className="h-3 w-3" />{p.members} membros</div>
              <div className="flex items-center gap-1.5"><FolderKanban className="h-3 w-3" />{p.agents} agentes</div>
              <div className="flex items-center gap-1.5 justify-end"><Calendar className="h-3 w-3" />{p.updated}</div>
            </footer>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
