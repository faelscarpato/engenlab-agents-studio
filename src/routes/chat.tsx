import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Badge, StatusDot, PageHeader } from "@/components/app-shell";
import { useState, ChangeEvent, FormEvent } from "react";
import {
  Plus,
  Search,
  Bot,
  Send,
  Paperclip,
  Sparkles,
  Copy,
  RefreshCw,
  Save,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [{ title: "Chat · EngenLab" }],
  }),
  component: ChatPage,
});

type Thread = {
  id: string;
  title: string;
  agent: string;
  time: string;
  active: boolean;
  unread: boolean;
};

type MessageRole = "user" | "assistant";

type Message = {
  role: MessageRole;
  content: string;
  time: string;
  agent?: string;
  code?: string;
};

const threads: Thread[] = [
  {
    id: "t1",
    title: "Revisão do PR #482 · payments-service",
    agent: "code-reviewer",
    time: "agora",
    active: true,
    unread: false,
  },
  {
    id: "t2",
    title: "Extração de contrato CNPJ 12.345",
    agent: "extractor-pdf",
    time: "12min",
    active: false,
    unread: true,
  },
  {
    id: "t3",
    title: "Casos de teste para checkout",
    agent: "qa-engineer",
    time: "1h",
    active: false,
    unread: false,
  },
  {
    id: "t4",
    title: "Schema para multi-tenant",
    agent: "sql-architect",
    time: "3h",
    active: false,
    unread: false,
  },
  {
    id: "t5",
    title: "Resumo da reunião de produto",
    agent: "summarizer",
    time: "ontem",
    active: false,
    unread: false,
  },
  {
    id: "t6",
    title: "Template campanha Q4",
    agent: "mail-sender",
    time: "ontem",
    active: false,
    unread: false,
  },
];

const seedMessages: Message[] = [
  {
    role: "user",
    content:
      "Revise este diff do `payments-service`. Foco em: tratamento de erro, idempotência e logs estruturados.",
    time: "14:02",
  },
  {
    role: "assistant",
    agent: "code-reviewer",
    content:
      "Analisei o diff de `payments-service`. Resumo das observações:\n\n" +
      "- **Idempotência**: a função `processCharge` não está usando a chave `idempotency_key` ao chamar o gateway. Risco de cobrança duplicada em retries.\n" +
      "- **Tratamento de erro**: o `try/catch` em `handleWebhook` captura tudo como genérico — perde-se o stack e o `event_id`.\n" +
      "- **Logs**: faltam campos estruturados (`tenant_id`, `request_id`).\n\n" +
      "Sugestão de patch:",
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
    role: "user",
    content:
      "Aplique a sugestão e gere um teste para o cenário de retry.",
    time: "14:05",
  },
];

function ChatPage() {
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(true);
  const [activeThreadId, setActiveThreadId] = useState<string>("t1");
  const [threadFilter, setThreadFilter] = useState("");

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleThreadFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setThreadFilter(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    // Aqui depois você conecta na API de chat (streaming, etc.)
    setInput("");
    setStreaming(true);
  };

  const filteredThreads = threads.filter((t) => {
    if (!threadFilter.trim()) return true;
    const haystack = `${t.title} ${t.agent}`.toLowerCase();
    return haystack.includes(threadFilter.toLowerCase());
  });

  const activeThread = threads.find((t) => t.id === activeThreadId) ?? threads[0];

  const currentMessages = seedMessages; // depois: buscar pelo threadId

  return (
    <AppShell title="Chat">
      <PageHeader
        title="Chat com agentes"
        description="Centralize conversas com agentes do EngenLab, reaproveite contexto e gere código rapidamente."
      >
        <button className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-90">
          <Plus className="h-4 w-4" />
          Nova conversa
        </button>
      </PageHeader>

      <section className="flex min-h-[calc(100vh-56px-56px)] px-4 py-4 md:px-6 md:py-5 gap-4">
        {/* Sidebar de threads */}
        <aside className="flex w-full max-w-xs flex-col rounded-lg border border-border bg-card md:w-80">
          <div className="flex items-center justify-between border-b border-border px-3 py-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Threads
            </span>
            <button
              type="button"
              className="inline-flex h-7 items-center gap-1.5 rounded-md bg-primary/10 px-2 text-[11px] font-medium text-primary hover:bg-primary/15"
            >
              <Plus className="h-3 w-3" />
              Nova
            </button>
          </div>

          <div className="px-3 py-2 border-b border-border">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={threadFilter}
                onChange={handleThreadFilterChange}
                placeholder="Buscar threads..."
                className="h-8 w-full rounded-md border border-border bg-secondary/60 pl-8 pr-2 text-xs outline-none focus:border-ring"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2 py-2 space-y-2 text-xs">
            <div className="px-1 pb-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Hoje
            </div>
            {filteredThreads.map((t) => {
              const active = t.id === activeThread.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveThreadId(t.id)}
                  className={`w-full rounded-md px-2 py-1.5 text-left transition-colors ${
                    active
                      ? "bg-secondary text-foreground"
                      : "hover:bg-secondary/40 text-muted-foreground"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5">
                      <StatusDot tone={t.unread ? "warning" : "muted"} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <span className="truncate text-[11px] font-medium">
                          {t.title}
                        </span>
                        {t.unread && (
                          <span className="ml-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-medium text-primary">
                            novo
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <span>{t.agent}</span>
                        <span className="opacity-40">·</span>
                        <span>{t.time}</span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Conversa principal */}
        <div className="flex min-w-0 flex-1 flex-col rounded-lg border border-border bg-card">
          {/* Header da conversa */}
          <header className="flex items-center gap-3 border-b border-border px-4 py-3">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-primary/10 text-primary">
              <Bot className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-semibold">
                  {activeThread.title}
                </span>
                <Badge tone="info">{activeThread.agent}</Badge>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <span>gpt-5.1 · streaming</span>
                <span className="opacity-40">·</span>
                <span>contexto: payments-service</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="inline-flex h-7 items-center gap-1.5 rounded-md border border-border bg-secondary/40 px-2 text-[10px] font-medium hover:bg-secondary/60"
              >
                <span>Histórico</span>
                <ChevronDown className="h-3 w-3" />
              </button>
              <button
                type="button"
                className="grid h-7 w-7 place-items-center rounded-md hover:bg-secondary/60"
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </header>

          {/* Mensagens */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 text-sm">
            {currentMessages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-2 ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {m.role === "assistant" && (
                  <div className="mt-0.5">
                    <div className="grid h-7 w-7 place-items-center rounded-md bg-primary/10 text-primary">
                      <Bot className="h-3.5 w-3.5" />
                    </div>
                  </div>
                )}
                <div
                  className={`max-w-[min(640px,80%)] rounded-lg border px-3 py-2 ${
                    m.role === "assistant"
                      ? "border-border bg-muted/40"
                      : "border-primary/40 bg-primary text-primary-foreground"
                  }`}
                >
                  {m.role === "assistant" && (
                    <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <span className="font-medium">
                          {m.agent ?? "agent"}
                        </span>
                        <span className="opacity-40">·</span>
                        <span>{m.time}</span>
                      </span>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap text-sm">
                    {m.content}
                  </div>
                  {m.code && (
                    <pre className="mt-2 overflow-x-auto rounded-md bg-background/80 p-2 text-xs font-mono">
                      {m.code}
                    </pre>
                  )}
                  {m.role === "assistant" && (
                    <div className="mt-2 flex items-center gap-1 text-[10px]">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-md border border-border bg-background/40 px-2 py-0.5 hover:bg-secondary/60"
                      >
                        <Copy className="h-3 w-3" />
                        Copiar
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-md border border-border bg-background/40 px-2 py-0.5 hover:bg-secondary/60"
                      >
                        <RefreshCw className="h-3 w-3" />
                        Regenerar
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded-md border border-border bg-background/40 px-2 py-0.5 hover:bg-secondary/60"
                      >
                        <Save className="h-3 w-3" />
                        Salvar como prompt
                      </button>
                    </div>
                  )}
                  {m.role === "user" && (
                    <div className="mt-1 text-right text-[10px] opacity-80">
                      {m.time}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {streaming && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <StatusDot tone="success" />
                <span>Gerando resposta...</span>
                <button
                  type="button"
                  onClick={() => setStreaming(false)}
                  className="ml-2 rounded border border-border px-1.5 py-0.5 text-[10px] hover:bg-secondary"
                >
                  Parar
                </button>
              </div>
            )}
          </div>

          {/* Composer */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-border px-4 py-3"
          >
            <div className="rounded-md border border-border bg-secondary/40 px-2 py-1.5">
              <textarea
                value={input}
                onChange={handleInputChange}
                rows={2}
                placeholder="Pergunte ao agente, anexe um arquivo ou cole um diff..."
                className="w-full resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground"
              />
              <div className="mt-1 flex items-center gap-1">
                <button
                  type="button"
                  className="grid h-7 w-7 place-items-center rounded-md hover:bg-secondary"
                  aria-label="Anexar"
                >
                  <Paperclip className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  className="grid h-7 w-7 place-items-center rounded-md hover:bg-secondary"
                  aria-label="Sugestões"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                </button>
                <Badge tone="outline">contexto: payments-service</Badge>
                <div className="ml-auto flex items-center gap-2">
                  <span className="hidden text-[10px] text-muted-foreground sm:inline">
                    ⏎ enviar · ⇧⏎ nova linha
                  </span>
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
                  >
                    Enviar
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </AppShell>
  );
}
