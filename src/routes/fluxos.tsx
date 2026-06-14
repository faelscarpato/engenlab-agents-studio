import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, Badge, StatusDot } from "@/components/app-shell";
import { useState } from "react";
import { Play, Plus, ArrowRight, FileInput, Bot, Wand2, FileOutput, Settings, GitBranch } from "lucide-react";

export const Route = createFileRoute("/fluxos")({
  head: () => ({ meta: [{ title: "Fluxos · EngenLab" }] }),
  component: FluxosPage,
});

type NodeKind = "input" | "agent" | "transform" | "output";
type NodeState = "idle" | "running" | "success" | "error";

type FlowNode = {
  id: string;
  kind: NodeKind;
  title: string;
  subtitle: string;
  state: NodeState;
};

const flows = [
  { name: "Onboarding KYC", runs: 142, state: "success" as NodeState, schedule: "a cada 5min" },
  { name: "Envio Q4", runs: 86, state: "running" as NodeState, schedule: "manual" },
  { name: "Resumo diário", runs: 30, state: "idle" as NodeState, schedule: "06:00" },
  { name: "Triage Slack", runs: 412, state: "error" as NodeState, schedule: "webhook" },
];

const pipeline: FlowNode[] = [
  { id: "n1", kind: "input", title: "Webhook KYC", subtitle: "POST /api/kyc/submit", state: "success" },
  { id: "n2", kind: "agent", title: "extractor-pdf", subtitle: "Extrai dados do documento", state: "success" },
  { id: "n3", kind: "transform", title: "normalize-cpf", subtitle: "Sanitiza e valida CPF/CNPJ", state: "running" },
  { id: "n4", kind: "agent", title: "qa-engineer", subtitle: "Verifica completude dos campos", state: "idle" },
  { id: "n5", kind: "output", title: "Webhook CRM", subtitle: "POST crm.internal/leads", state: "idle" },
];

const kindMap = {
  input: { icon: FileInput, label: "Input", color: "text-accent-foreground" },
  agent: { icon: Bot, label: "Agente", color: "text-primary" },
  transform: { icon: Wand2, label: "Transform", color: "text-warning" },
  output: { icon: FileOutput, label: "Output", color: "text-success" },
} as const;

const stateTone = {
  idle: "outline",
  running: "warning",
  success: "success",
  error: "destructive",
} as const;

function FluxosPage() {
  const [selected, setSelected] = useState("Onboarding KYC");

  return (
    <AppShell title="Fluxos">
      <PageHeader title="Fluxos automatizados" description="Orquestre extração, transformação e envio com pipelines visuais.">
        <button className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-secondary/60 px-3 text-sm font-medium hover:bg-secondary">
          <Plus className="h-4 w-4" /> Novo fluxo
        </button>
        <button className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-90">
          <Play className="h-4 w-4" /> Executar
        </button>
      </PageHeader>

      <div className="grid gap-4 p-4 md:p-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* Flow list */}
        <aside className="panel">
          <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
            <h2 className="text-xs font-semibold">Fluxos</h2>
            <Badge tone="outline">{flows.length}</Badge>
          </div>
          <ul className="divide-y divide-border">
            {flows.map((f) => (
              <li key={f.name}>
                <button
                  onClick={() => setSelected(f.name)}
                  className={`w-full px-3 py-2.5 text-left border-l-2 ${selected === f.name ? "border-primary bg-secondary/50" : "border-transparent hover:bg-secondary/30"}`}
                >
                  <div className="flex items-center gap-2">
                    <StatusDot tone={f.state === "success" ? "success" : f.state === "error" ? "destructive" : f.state === "running" ? "warning" : "muted"} />
                    <span className="text-sm font-medium truncate">{f.name}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                    <GitBranch className="h-3 w-3" />
                    <span>{f.schedule}</span>
                    <span className="ml-auto tabular-nums">{f.runs} runs</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Canvas */}
        <div className="panel min-w-0 overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold">{selected}</h2>
              <p className="text-xs text-muted-foreground">Pipeline visual · 5 nós · última execução há 2min</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone="warning"><StatusDot tone="warning" />executando</Badge>
              <button className="grid h-8 w-8 place-items-center rounded-md border border-border hover:bg-secondary" aria-label="Configurações"><Settings className="h-4 w-4" /></button>
            </div>
          </div>

          <div className="relative grid-bg p-6">
            <div className="flex flex-wrap items-stretch gap-3">
              {pipeline.map((n, i) => (
                <div key={n.id} className="flex items-center gap-3">
                  <FlowNodeCard node={n} />
                  {i < pipeline.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                </div>
              ))}
            </div>

            {/* Logs */}
            <div className="mt-6 panel bg-background/60">
              <div className="border-b border-border px-3 py-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Logs de execução
              </div>
              <pre className="overflow-x-auto p-3 font-mono text-[12px] leading-relaxed text-foreground/80 scrollbar-thin">
{`[14:02:11] flow.start            run_id=run_8af2 trigger=webhook
[14:02:11] node.start  n1 input   payload_bytes=2148
[14:02:12] node.ok     n1 input   duration=312ms
[14:02:12] node.start  n2 agent   agent=extractor-pdf
[14:02:14] node.ok     n2 agent   duration=2.1s tokens=1.842
[14:02:14] node.start  n3 transf  fn=normalize-cpf
[14:02:14] node.run    n3 transf  status=running ...`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function FlowNodeCard({ node }: { node: FlowNode }) {
  const meta = kindMap[node.kind];
  const Icon = meta.icon;
  return (
    <div className="panel w-56 shrink-0 p-3">
      <div className="flex items-center gap-2">
        <div className="grid h-8 w-8 place-items-center rounded-md bg-secondary border border-border">
          <Icon className={`h-4 w-4 ${meta.color}`} />
        </div>
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{meta.label}</div>
          <div className="truncate text-sm font-semibold font-mono">{node.title}</div>
        </div>
      </div>
      <p className="mt-2 line-clamp-2 text-[11px] text-muted-foreground">{node.subtitle}</p>
      <div className="mt-2 flex items-center justify-between">
        <Badge tone={stateTone[node.state]}>{node.state}</Badge>
        {node.state === "running" && (
          <span className="inline-flex gap-1">
            <span className="h-1 w-1 animate-pulse rounded-full bg-warning" />
            <span className="h-1 w-1 animate-pulse rounded-full bg-warning [animation-delay:120ms]" />
            <span className="h-1 w-1 animate-pulse rounded-full bg-warning [animation-delay:240ms]" />
          </span>
        )}
      </div>
    </div>
  );
}
