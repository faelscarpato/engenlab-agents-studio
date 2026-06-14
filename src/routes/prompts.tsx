import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, Badge } from "@/components/app-shell";
import { useState } from "react";
import { Play, Save, History, Library, FileCode, Variable, Download } from "lucide-react";

export const Route = createFileRoute("/prompts")({
  head: () => ({ meta: [{ title: "Prompt Workbench · EngenLab" }] }),
  component: WorkbenchPage,
});

const library = [
  { name: "code-review/default", tag: "engenharia", v: "v4" },
  { name: "extract/invoice", tag: "extração", v: "v2" },
  { name: "qa/bdd-cases", tag: "testes", v: "v1" },
  { name: "summarize/meeting", tag: "conteúdo", v: "v3" },
  { name: "mail/transactional", tag: "envio", v: "v2" },
];

const history = [
  { v: "v4", time: "agora", author: "diego", note: "ajuste de tom" },
  { v: "v3", time: "ontem", author: "ana", note: "+ regra de segurança" },
  { v: "v2", time: "3d", author: "diego", note: "schema de saída" },
  { v: "v1", time: "1sem", author: "ana", note: "criação" },
];

const defaultPrompt = `Você é um revisor de código sênior especializado em {{language}}.

Contexto do projeto:
{{project_context}}

Diff a revisar:
\`\`\`
{{diff}}
\`\`\`

Regras:
- Foque em correção, segurança e idempotência.
- Sugira patches em formato unificado.
- Responda em {{output_language}}.
`;

function WorkbenchPage() {
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [vars, setVars] = useState({
    language: "TypeScript",
    project_context: "payments-service (multi-tenant)",
    diff: "// cole seu diff aqui",
    output_language: "português",
  });

  return (
    <AppShell title="Prompt Workbench">
      <PageHeader title="Prompt Workbench" description="Edite, teste e versione prompts com variáveis e preview em tempo real.">
        <button className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-secondary/60 px-3 text-sm font-medium hover:bg-secondary">
          <Download className="h-4 w-4" /> Exportar
        </button>
        <button className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-secondary/60 px-3 text-sm font-medium hover:bg-secondary">
          <Save className="h-4 w-4" /> Salvar
        </button>
        <button className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-90">
          <Play className="h-4 w-4" /> Testar prompt
        </button>
      </PageHeader>

      <div className="grid gap-4 p-4 md:p-6 lg:grid-cols-[220px_minmax(0,1fr)_280px]">
        {/* Library */}
        <aside className="panel">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
            <Library className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-xs font-semibold">Biblioteca</h2>
          </div>
          <ul className="divide-y divide-border">
            {library.map((p, i) => (
              <li key={p.name}>
                <button className={`w-full px-3 py-2 text-left ${i === 0 ? "bg-secondary/50" : "hover:bg-secondary/30"}`}>
                  <div className="flex items-center gap-2">
                    <FileCode className="h-3.5 w-3.5 text-primary" />
                    <span className="truncate font-mono text-[11px]">{p.name}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge tone="outline">{p.tag}</Badge>
                    <span className="text-[10px] text-muted-foreground">{p.v}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Editor + preview (split) */}
        <div className="panel flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <Badge tone="info">code-review/default</Badge>
            <Badge tone="outline">v4</Badge>
            <span className="ml-auto text-[11px] text-muted-foreground">edição local · não salvo</span>
          </div>
          <div className="grid flex-1 min-h-[420px] divide-y divide-border md:grid-cols-2 md:divide-x md:divide-y-0">
            <div className="flex min-h-[260px] flex-col">
              <div className="px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground border-b border-border">Prompt</div>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="flex-1 resize-none bg-background/40 p-3 font-mono text-[12.5px] leading-relaxed outline-none scrollbar-thin"
                spellCheck={false}
              />
            </div>
            <div className="flex min-h-[260px] flex-col">
              <div className="px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground border-b border-border">Preview compilado</div>
              <pre className="flex-1 overflow-auto whitespace-pre-wrap p-3 font-mono text-[12.5px] leading-relaxed text-foreground/90 scrollbar-thin">
                {Object.entries(vars).reduce((acc, [k, v]) => acc.replaceAll(`{{${k}}}`, v), prompt)}
              </pre>
            </div>
          </div>
        </div>

        {/* Variables + history */}
        <aside className="space-y-4">
          <div className="panel">
            <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
              <Variable className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-xs font-semibold">Variáveis</h2>
            </div>
            <div className="space-y-3 p-3">
              {Object.entries(vars).map(([k, v]) => (
                <label key={k} className="block">
                  <div className="mb-1 flex items-center gap-1.5">
                    <span className="font-mono text-[11px] text-primary">{`{{${k}}}`}</span>
                  </div>
                  <input
                    value={v}
                    onChange={(e) => setVars((s) => ({ ...s, [k]: e.target.value }))}
                    className="h-8 w-full rounded-md border border-border bg-secondary/60 px-2 text-xs outline-none focus:border-ring"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
              <History className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-xs font-semibold">Histórico de versões</h2>
            </div>
            <ul className="divide-y divide-border">
              {history.map((h) => (
                <li key={h.v} className="flex items-center gap-2 px-3 py-2 text-xs hover:bg-secondary/30">
                  <Badge tone={h.v === "v4" ? "success" : "outline"}>{h.v}</Badge>
                  <span className="text-muted-foreground truncate">{h.note}</span>
                  <span className="ml-auto text-[10px] text-muted-foreground">{h.author} · {h.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
