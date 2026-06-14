import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, Badge, StatusDot } from "@/components/app-shell";
import {
  Bot,
  MessageSquare,
  Zap,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Plus,
  Workflow,
  Sparkles,
  Server,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard · EngenLab Agentes" },
      { name: "description", content: "Visão operacional dos agentes, fluxos e provedores LLM." },
    ],
  }),
  component: DashboardPage,
});

const kpis = [
  { label: "Agentes ativos", value: "24", delta: "+3", icon: Bot, tone: "primary" as const },
  { label: "Conversas (7d)", value: "1.284", delta: "+12,4%", icon: MessageSquare, tone: "info" as const },
  { label: "Execuções de fluxo", value: "382", delta: "+8,1%", icon: Workflow, tone: "warning" as const },
  { label: "Tokens consumidos", value: "2,4M", delta: "−4,2%", icon: Zap, tone: "muted" as const },
];

const activity = [
  { agent: "extractor-pdf", action: "Execução concluída", project: "Onboarding clientes", time: "há 2min", tone: "success" as const },
  { agent: "qa-engineer", action: "Nova thread iniciada", project: "Refatoração API", time: "há 6min", tone: "info" as const },
  { agent: "mail-sender", action: "Erro de validação", project: "Campanha Q4", time: "há 14min", tone: "destructive" as const },
  { agent: "code-reviewer", action: "Prompt atualizado", project: "Plataforma Core", time: "há 22min", tone: "warning" as const },
  { agent: "summarizer", action: "Execução concluída", project: "Relatórios mensais", time: "há 38min", tone: "success" as const },
];

const topAgents = [
  { name: "code-reviewer", category: "Engenharia", runs: 412, success: 98 },
  { name: "extractor-pdf", category: "Extração", runs: 318, success: 96 },
  { name: "qa-engineer", category: "Testes", runs: 254, success: 92 },
  { name: "mail-sender", category: "Envio", runs: 187, success: 88 },
];

function DashboardPage() {
  return (
    <AppShell title="Dashboard">
      <PageHeader title="Dashboard operacional" description="Visão geral dos agentes, execuções e saúde dos provedores conectados.">
        <button className="hidden sm:inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-secondary/60 px-3 text-sm font-medium hover:bg-secondary">
          <Activity className="h-4 w-4" /> Últimas 24h
        </button>
        <button className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-90">
          <Plus className="h-4 w-4" /> Novo agente
        </button>
      </PageHeader>

      <div className="space-y-6 p-4 md:p-6">
        {/* KPIs */}
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {kpis.map((k) => {
            const Icon = k.icon;
            return (
              <div key={k.label} className="panel p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{k.label}</span>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="mt-3 flex items-end justify-between">
                  <div className="text-2xl font-semibold font-mono tracking-tight">{k.value}</div>
                  <div className={`text-xs font-medium ${k.delta.startsWith("−") ? "text-destructive" : "text-success"}`}>
                    {k.delta}
                  </div>
                </div>
                {/* sparkline */}
                <div className="mt-3 flex h-8 items-end gap-[3px]">
                  {[40, 60, 35, 75, 55, 90, 70, 85, 60, 95, 80, 100].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm bg-primary/30"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Activity */}
          <div className="panel lg:col-span-2">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <h2 className="text-sm font-semibold">Atividade recente</h2>
                <p className="text-xs text-muted-foreground">Eventos do sistema e execuções dos agentes.</p>
              </div>
              <button className="text-xs font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                Ver tudo <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>
            <ul className="divide-y divide-border">
              {activity.map((a, i) => (
                <li key={i} className="flex items-center gap-3 px-4 py-3 text-sm">
                  <StatusDot tone={a.tone} />
                  <span className="font-mono text-xs text-foreground">{a.agent}</span>
                  <span className="text-muted-foreground">{a.action}</span>
                  <span className="ml-auto hidden sm:inline text-xs text-muted-foreground">{a.project}</span>
                  <span className="text-xs text-muted-foreground tabular-nums">{a.time}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick actions + status */}
          <div className="space-y-4">
            <div className="panel p-4">
              <h2 className="text-sm font-semibold">Ações rápidas</h2>
              <p className="text-xs text-muted-foreground">Atalhos frequentes do workspace.</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {[
                  { label: "Novo agente", icon: Bot },
                  { label: "Abrir chat", icon: MessageSquare },
                  { label: "Testar prompt", icon: Sparkles },
                  { label: "Novo fluxo", icon: Workflow },
                ].map((b) => {
                  const I = b.icon;
                  return (
                    <button
                      key={b.label}
                      className="flex flex-col items-start gap-2 rounded-md border border-border bg-secondary/40 p-3 text-left hover:bg-secondary"
                    >
                      <I className="h-4 w-4 text-primary" />
                      <span className="text-xs font-medium">{b.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="panel">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <h2 className="text-sm font-semibold">Status dos provedores</h2>
                <Badge tone="success">Operacional</Badge>
              </div>
              <ul className="divide-y divide-border text-sm">
                {[
                  { name: "OpenAI", endpoint: "api.openai.com", latency: "184ms", tone: "success" as const },
                  { name: "OpenRouter", endpoint: "openrouter.ai/api", latency: "212ms", tone: "success" as const },
                  { name: "Ollama local", endpoint: "127.0.0.1:11434", latency: "—", tone: "muted" as const },
                ].map((p) => (
                  <li key={p.name} className="flex items-center gap-3 px-4 py-3">
                    <Server className="h-4 w-4 text-muted-foreground" />
                    <div className="min-w-0">
                      <div className="text-xs font-medium">{p.name}</div>
                      <div className="text-[10px] font-mono text-muted-foreground truncate">{p.endpoint}</div>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <span className="text-xs tabular-nums text-muted-foreground">{p.latency}</span>
                      <StatusDot tone={p.tone} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Top agents + Usage */}
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="panel lg:col-span-2">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <h2 className="text-sm font-semibold">Top agentes</h2>
                <p className="text-xs text-muted-foreground">Ordenado por execuções nos últimos 7 dias.</p>
              </div>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[10px] uppercase tracking-wider text-muted-foreground">
                    <th className="px-4 py-2 font-medium">Agente</th>
                    <th className="px-4 py-2 font-medium">Categoria</th>
                    <th className="px-4 py-2 font-medium text-right">Execuções</th>
                    <th className="px-4 py-2 font-medium text-right">Sucesso</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {topAgents.map((a) => (
                    <tr key={a.name} className="hover:bg-secondary/30">
                      <td className="px-4 py-3 font-mono text-xs">{a.name}</td>
                      <td className="px-4 py-3"><Badge tone="outline">{a.category}</Badge></td>
                      <td className="px-4 py-3 text-right tabular-nums">{a.runs}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <div className="h-1.5 w-20 rounded-full bg-secondary overflow-hidden">
                            <div className="h-full bg-success" style={{ width: `${a.success}%` }} />
                          </div>
                          <span className="text-xs tabular-nums text-muted-foreground w-8 text-right">{a.success}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="panel p-4">
            <h2 className="text-sm font-semibold">Uso por categoria</h2>
            <p className="text-xs text-muted-foreground">Distribuição de execuções.</p>
            <ul className="mt-4 space-y-3">
              {[
                { label: "Engenharia", value: 38, tone: "bg-primary" },
                { label: "Extração", value: 24, tone: "bg-accent-foreground/60" },
                { label: "Envio", value: 18, tone: "bg-warning" },
                { label: "Testes", value: 12, tone: "bg-success" },
                { label: "Outros", value: 8, tone: "bg-muted-foreground" },
              ].map((c) => (
                <li key={c.label}>
                  <div className="flex items-center justify-between text-xs">
                    <span>{c.label}</span>
                    <span className="tabular-nums text-muted-foreground">{c.value}%</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div className={`h-full ${c.tone}`} style={{ width: `${c.value}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
