import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Badge, StatusDot } from "@/components/app-shell";
import { useState } from "react";
import {
  Plus, Search, Bot, Send, Paperclip, Sparkles, Copy, RefreshCw, Save,
  ChevronDown, MoreHorizontal,
} from "lucide-react";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "Chat · EngenLab" }] }),
  component: ChatPage,
});

const threads = [
  { id: "t1", title: "Revisão do PR #482 · payments-service", agent: "code-reviewer", time: "agora", active: true, unread: false },
  { id: "t2", title: "Extração de contrato CNPJ 12.345", agent: "extractor-pdf", time: "12min", active: false, unread: true },
  { id: "t3", title: "Casos de teste para checkout", agent: "qa-engineer", time: "1h", active: false, unread: false },
  { id: "t4", title: "Schema para multi-tenant", agent: "sql-architect", time: "3h", active: false, unread: false },
  { id: "t5", title: "Resumo da reunião de produto", agent: "summarizer", time: "ontem", active: false, unread: false },
  { id: "t6", title: "Template campanha Q4", agent: "mail-sender", time: "ontem", active: false, unread: false },
];

const messages = [
  {
    role: "user" as const,
    content: "Revise este diff do `payments-service`. Foco em: tratamento de erro, idempotência e logs estruturados.",
    time: "14:02",
  },
  {
    role: "assistant" as const,
    agent: "code-reviewer",
    content:
      "Analisei o diff de `payments-service`. Resumo das observações:\n\n- **Idempotência**: a função `processCharge` não está usando a chave `idempotency_key` ao chamar o gateway. Risco de cobrança duplicada em retries.\n- **Tratamento de erro**: o `try/catch` em `handleWebhook` captura tudo como genérico — perde-se o stack e o `event_id`.\n- **Logs**: faltam campos estruturados (`tenant_id`, `request_id`).\n\nSugestão de patch:",
    code: `// src/payments/processCharge.ts
const result = await gateway.charge({
  amount,
  currency,
  idempotencyKey: ctx.idempotencyKey,
})
logger.info("charge.completed", {
  tenant_id: ctx.tenantId,
  request_id: ctx.requestId,
  charge_id: result.id,
})`,
    time: "14:02",
  },
  {
    role: "user" as const,
    content: "Aplique a sugestão e gere um teste para o cenário de retry.",
    time: "14:05",
  },
];

function ChatPage() {
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(true);

  return (
    <AppShell title="Chat">
      <div className="grid h-[calc(100vh-3.5rem)] grid-cols-1 md:grid-cols-[280px_minmax(0,1fr)]">
        {/* Threads sidebar */}
        <aside className="hidden md:flex flex-col border-r border-border bg-elevated/40">
          <div className="flex h-12 items-center gap-2 border-b border-border px-3">
            <button className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:opacity-90">
              <Plus className="h-3.5 w-3.5" /> Nova conversa
            </button>
          </div>
          <div className="px-3 py-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input placeholder="Buscar threads..." className="h-8 w-full rounded-md border border-border bg-secondary/60 pl-8 pr-2 text-xs outline-none focus:border-ring" />
            </div>
          </div>
          <div className="px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Hoje</div>
          <ul className="flex-1 overflow-y-auto scrollbar-thin">
            {threads.map((t) => (
              <li key={t.id}>
                <button className={`group w-full px-3 py-2 text-left border-l-2 ${t.active ? "border-primary bg-secondary/50" : "border-transparent hover:bg-secondary/30"}`}>
                  <div className="flex items-center gap-2">
                    <span className="truncate text-xs font-medium">{t.title}</span>
                    {t.unread && <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                    <Bot className="h-3 w-3" />
                    <span className="font-mono truncate">{t.agent}</span>
                    <span className="ml-auto">{t.time}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Conversation */}
        <section className="flex min-w-0 flex-col">
          <header className="flex h-12 items-center gap-3 border-b border-border px-4">
            <button className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary/40 px-2.5 py-1 text-xs font-medium hover:bg-secondary">
              <Bot className="h-3.5 w-3.5 text-primary" />
              <span className="font-mono">code-reviewer</span>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
              <StatusDot tone="success" /> gpt-5.1 · streaming
            </div>
            <div className="ml-auto flex items-center gap-1">
              <button className="grid h-8 w-8 place-items-center rounded-md hover:bg-secondary" aria-label="Mais"><MoreHorizontal className="h-4 w-4" /></button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto scrollbar-thin">
            <div className="mx-auto max-w-3xl space-y-6 px-4 py-6">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
                  {m.role === "assistant" && (
                    <div className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-border bg-secondary"><Bot className="h-4 w-4 text-primary" /></div>
                  )}
                  <div className={`min-w-0 max-w-[80%] ${m.role === "user" ? "" : "flex-1"}`}>
                    {m.role === "assistant" && (
                      <div className="mb-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span className="font-mono font-medium text-foreground">{m.agent}</span>
                        <span>· {m.time}</span>
                      </div>
                    )}
                    <div className={`rounded-lg px-3.5 py-2.5 text-sm leading-relaxed ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-elevated border border-border"}`}>
                      <p className="whitespace-pre-wrap">{m.content}</p>
                      {m.code && (
                        <pre className="mt-3 overflow-x-auto rounded-md border border-border bg-background p-3 font-mono text-[12px] text-foreground/90">
                          <code>{m.code}</code>
                        </pre>
                      )}
                    </div>
                    {m.role === "assistant" && (
                      <div className="mt-1.5 flex items-center gap-1 text-muted-foreground">
                        <button className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] hover:bg-secondary hover:text-foreground"><Copy className="h-3 w-3" />Copiar</button>
                        <button className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] hover:bg-secondary hover:text-foreground"><RefreshCw className="h-3 w-3" />Regenerar</button>
                        <button className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] hover:bg-secondary hover:text-foreground"><Save className="h-3 w-3" />Salvar como prompt</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {streaming && (
                <div className="flex gap-3">
                  <div className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-border bg-secondary"><Bot className="h-4 w-4 text-primary" /></div>
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-elevated px-3.5 py-2.5 text-sm text-muted-foreground">
                    <span className="inline-flex gap-1">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary [animation-delay:120ms]" />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary [animation-delay:240ms]" />
                    </span>
                    Gerando resposta...
                    <button onClick={() => setStreaming(false)} className="ml-2 rounded border border-border px-1.5 py-0.5 text-[10px] hover:bg-secondary">Parar</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Composer */}
          <div className="border-t border-border bg-elevated/40 p-3">
            <div className="mx-auto max-w-3xl">
              <div className="panel p-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  rows={2}
                  placeholder="Pergunte ao agente, anexe um arquivo ou cole um diff..."
                  className="w-full resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground"
                />
                <div className="mt-1 flex items-center gap-1">
                  <button className="grid h-7 w-7 place-items-center rounded-md hover:bg-secondary" aria-label="Anexar"><Paperclip className="h-3.5 w-3.5" /></button>
                  <button className="grid h-7 w-7 place-items-center rounded-md hover:bg-secondary" aria-label="Sugestões"><Sparkles className="h-3.5 w-3.5" /></button>
                  <Badge tone="outline">contexto: payments-service</Badge>
                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground hidden sm:inline">⏎ enviar · ⇧⏎ nova linha</span>
                    <button className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50" disabled={!input.trim()}>
                      Enviar <Send className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
