import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, Badge, StatusDot } from "@/components/app-shell";
import { useState } from "react";
import { Eye, EyeOff, Check, Shield, AlertTriangle, Server, Plug } from "lucide-react";

export const Route = createFileRoute("/ia")({
  head: () => ({ meta: [{ title: "Configuração de IA · EngenLab" }] }),
  component: AIConfigPage,
});

const providers = [
  { id: "openai", name: "OpenAI", desc: "GPT-5, GPT-5.1, embeddings.", models: ["gpt-5.1", "gpt-5", "gpt-5-mini"] },
  { id: "openrouter", name: "OpenRouter", desc: "Acesso unificado a múltiplos modelos.", models: ["anthropic/claude-4.5-sonnet", "google/gemini-3-pro", "meta/llama-4-70b"] },
  { id: "ollama", name: "Ollama (local)", desc: "Execução offline em sua máquina.", models: ["llama4:70b", "qwen3:32b", "mistral-3:7b"] },
] as const;

function AIConfigPage() {
  const [provider, setProvider] = useState<typeof providers[number]["id"]>("openai");
  const [model, setModel] = useState<string>(providers[0].models[0]);
  const [showKey, setShowKey] = useState(false);
  const [validated, setValidated] = useState(true);

  const active = providers.find((p) => p.id === provider)!;

  return (
    <AppShell title="Configuração de IA">
      <PageHeader title="Configuração de IA" description="Defina os provedores, modelos e credenciais usados pelos agentes." />

      <div className="grid gap-6 p-4 md:p-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        {/* Provider selector */}
        <nav className="space-y-2">
          <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground px-1">Provedores</div>
          {providers.map((p) => (
            <button
              key={p.id}
              onClick={() => { setProvider(p.id); setModel(p.models[0]); setValidated(false); }}
              className={`w-full rounded-md border p-3 text-left transition-colors ${provider === p.id ? "border-primary/50 bg-primary/5" : "border-border bg-elevated hover:bg-secondary/30"}`}
            >
              <div className="flex items-center gap-2">
                <Plug className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">{p.name}</span>
                {provider === p.id && <Badge tone="success">ativo</Badge>}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{p.desc}</p>
            </button>
          ))}
        </nav>

        {/* Form */}
        <div className="space-y-4">
          <div className="panel">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <h2 className="text-sm font-semibold">Credenciais do provedor</h2>
                <p className="text-xs text-muted-foreground">As chaves são criptografadas em repouso e nunca expostas ao cliente.</p>
              </div>
              <Badge tone={validated ? "success" : "warning"}>
                {validated ? <><Check className="h-3 w-3" /> validado</> : <><AlertTriangle className="h-3 w-3" /> não validado</>}
              </Badge>
            </div>

            <div className="grid gap-4 p-4 md:grid-cols-2">
              <Field label="Provider">
                <select value={provider} disabled className="h-9 w-full rounded-md border border-border bg-secondary/60 px-3 text-sm outline-none">
                  {providers.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </Field>

              <Field label="Modelo padrão">
                <select value={model} onChange={(e) => setModel(e.target.value)} className="h-9 w-full rounded-md border border-border bg-secondary/60 px-3 text-sm outline-none focus:border-ring">
                  {active.models.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </Field>

              <Field label="API Key" hint="Encontre sua chave no painel do provedor.">
                <div className="relative">
                  <input
                    type={showKey ? "text" : "password"}
                    defaultValue={provider === "ollama" ? "" : "sk-engenlab-************************************"}
                    placeholder={provider === "ollama" ? "Não requer chave" : "sk-..."}
                    disabled={provider === "ollama"}
                    className="h-9 w-full rounded-md border border-border bg-secondary/60 pl-3 pr-10 text-sm font-mono outline-none focus:border-ring disabled:opacity-50"
                  />
                  <button onClick={() => setShowKey((v) => !v)} className="absolute right-1.5 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded hover:bg-secondary" aria-label="Mostrar/ocultar">
                    {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </Field>

              <Field label="Base URL" hint="Opcional. Use para endpoints self-hosted ou proxies.">
                <input
                  defaultValue={
                    provider === "openai" ? "https://api.openai.com/v1"
                    : provider === "openrouter" ? "https://openrouter.ai/api/v1"
                    : "http://127.0.0.1:11434"
                  }
                  className="h-9 w-full rounded-md border border-border bg-secondary/60 px-3 text-sm font-mono outline-none focus:border-ring"
                />
              </Field>

              <Field label="Timeout (s)">
                <input type="number" defaultValue={60} className="h-9 w-full rounded-md border border-border bg-secondary/60 px-3 text-sm outline-none focus:border-ring" />
              </Field>

              <Field label="Temperatura padrão">
                <input type="number" step="0.1" defaultValue={0.2} className="h-9 w-full rounded-md border border-border bg-secondary/60 px-3 text-sm outline-none focus:border-ring" />
              </Field>
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t border-border px-4 py-3">
              <button
                onClick={() => setValidated(true)}
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-secondary/60 px-3 text-sm font-medium hover:bg-secondary"
              >
                <Server className="h-4 w-4" /> Testar conexão
              </button>
              <span className="text-xs text-muted-foreground">
                {validated ? "Última verificação há 2min · latência 184ms" : "Pressione testar para validar."}
              </span>
              <div className="ml-auto flex gap-2">
                <button className="inline-flex h-9 items-center rounded-md border border-border bg-secondary/60 px-3 text-sm font-medium hover:bg-secondary">Cancelar</button>
                <button className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-90">
                  <Check className="h-4 w-4" /> Salvar alterações
                </button>
              </div>
            </div>
          </div>

          <div className="panel p-4">
            <div className="flex items-start gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-md bg-success/15 border border-success/30">
                <Shield className="h-4 w-4 text-success" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold">Política de segurança</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Chaves são armazenadas em vault criptografado, redacted em logs e nunca enviadas ao bundle do cliente.
                  Conexões usam TLS 1.3 e suportam IP allowlist por workspace.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge tone="success"><StatusDot tone="success" /> TLS 1.3</Badge>
                  <Badge tone="success"><StatusDot tone="success" /> Vault</Badge>
                  <Badge tone="outline">SOC2 ready</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-xs font-medium">{label}</div>
      {children}
      {hint && <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>}
    </label>
  );
}
