import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader, Badge } from "@/components/app-shell";
import { useState } from "react";
import { Sun, Moon, Monitor, Bell, Keyboard, Database, Download, Trash2, Upload } from "lucide-react";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({ meta: [{ title: "Configurações · EngenLab" }] }),
  component: SettingsPage,
});

const shortcuts = [
  { keys: "⌘ K", desc: "Abrir busca global" },
  { keys: "⌘ N", desc: "Novo agente" },
  { keys: "⌘ ⇧ C", desc: "Nova conversa" },
  { keys: "⌘ ⇧ P", desc: "Abrir prompt workbench" },
  { keys: "⌘ /", desc: "Atalhos do teclado" },
  { keys: "⌘ ,", desc: "Configurações" },
];

function SettingsPage() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("dark");
  const [notif, setNotif] = useState({ runs: true, errors: true, weekly: false, mentions: true });

  return (
    <AppShell title="Configurações">
      <PageHeader title="Configurações" description="Preferências da aplicação, atalhos, notificações e dados locais." />

      <div className="grid gap-4 p-4 md:p-6 lg:grid-cols-2">
        {/* Theme */}
        <section className="panel p-4">
          <h2 className="text-sm font-semibold">Aparência</h2>
          <p className="text-xs text-muted-foreground">Escolha o tema da interface.</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { id: "light" as const, label: "Claro", icon: Sun },
              { id: "dark" as const, label: "Escuro", icon: Moon },
              { id: "system" as const, label: "Sistema", icon: Monitor },
            ].map((t) => {
              const I = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`flex flex-col items-center gap-2 rounded-md border p-3 ${theme === t.id ? "border-primary bg-primary/5" : "border-border bg-secondary/40 hover:bg-secondary"}`}
                >
                  <I className="h-5 w-5" />
                  <span className="text-xs font-medium">{t.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Notifications */}
        <section className="panel p-4">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Notificações</h2>
          </div>
          <p className="text-xs text-muted-foreground">Controle o que aparece no centro de notificações.</p>
          <ul className="mt-3 space-y-2">
            {[
              { k: "runs" as const, label: "Execuções concluídas" },
              { k: "errors" as const, label: "Falhas em fluxos" },
              { k: "mentions" as const, label: "Menções em threads" },
              { k: "weekly" as const, label: "Resumo semanal por e-mail" },
            ].map((o) => (
              <li key={o.k} className="flex items-center justify-between rounded-md border border-border bg-secondary/30 px-3 py-2">
                <span className="text-sm">{o.label}</span>
                <button
                  onClick={() => setNotif((s) => ({ ...s, [o.k]: !s[o.k] }))}
                  className={`relative h-5 w-9 rounded-full transition-colors ${notif[o.k] ? "bg-primary" : "bg-secondary border border-border"}`}
                  aria-pressed={notif[o.k]}
                >
                  <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-background transition-transform ${notif[o.k] ? "translate-x-4" : "translate-x-0.5"}`} />
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Shortcuts */}
        <section className="panel p-4">
          <div className="flex items-center gap-2">
            <Keyboard className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Atalhos do teclado</h2>
          </div>
          <ul className="mt-3 divide-y divide-border">
            {shortcuts.map((s) => (
              <li key={s.keys} className="flex items-center justify-between py-2 text-sm">
                <span className="text-muted-foreground">{s.desc}</span>
                <span className="kbd">{s.keys}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Data */}
        <section className="panel p-4">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Dados locais e backup</h2>
          </div>
          <p className="text-xs text-muted-foreground">Threads, prompts e preferências armazenados neste dispositivo.</p>

          <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
            {[
              { l: "Threads", v: "128" },
              { l: "Prompts", v: "42" },
              { l: "Tamanho", v: "8,2 MB" },
            ].map((s) => (
              <div key={s.l} className="rounded-md border border-border bg-secondary/30 p-3">
                <div className="font-mono text-lg font-semibold">{s.v}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </dl>

          <div className="mt-3 flex flex-wrap gap-2">
            <button className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-secondary/60 px-3 text-xs font-medium hover:bg-secondary">
              <Download className="h-3.5 w-3.5" /> Exportar backup
            </button>
            <button className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-secondary/60 px-3 text-xs font-medium hover:bg-secondary">
              <Upload className="h-3.5 w-3.5" /> Importar
            </button>
            <button className="inline-flex h-9 items-center gap-1.5 rounded-md border border-destructive/40 bg-destructive/10 px-3 text-xs font-medium text-destructive hover:bg-destructive/20">
              <Trash2 className="h-3.5 w-3.5" /> Apagar dados locais
            </button>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-md border border-warning/30 bg-warning/10 p-3 text-xs">
            <Badge tone="warning">aviso</Badge>
            <span className="text-warning">Backup automático desativado. Ative na sincronização do workspace.</span>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
