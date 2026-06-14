import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Bot,
  MessageSquare,
  Settings2,
  Wand2,
  FolderKanban,
  Workflow,
  Settings,
  Search,
  Bell,
  Command,
  Plus,
  CircleDot,
} from "lucide-react";
import type { ReactNode } from "react";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/agentes", label: "Agentes", icon: Bot },
  { to: "/chat", label: "Chat", icon: MessageSquare },
  { to: "/prompts", label: "Prompt Workbench", icon: Wand2 },
  { to: "/projetos", label: "Projetos", icon: FolderKanban },
  { to: "/fluxos", label: "Fluxos", icon: Workflow },
  { to: "/ia", label: "Configuração de IA", icon: Settings2 },
  { to: "/configuracoes", label: "Configurações", icon: Settings },
] as const;

export function AppShell({ children, title, actions }: { children: ReactNode; title?: string; actions?: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
        <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground font-mono font-bold">
            EL
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight">EngenLab</span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Agentes</span>
          </div>
        </div>

        <div className="px-3 pt-4 pb-2">
          <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Workspace</span>
        </div>
        <nav className="flex-1 px-2 space-y-0.5 scrollbar-thin overflow-y-auto">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0 opacity-80" />
                <span className="truncate">{item.label}</span>
                {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-2 rounded-md bg-sidebar-accent/50 p-2">
            <CircleDot className="h-3.5 w-3.5 text-primary" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium truncate">api.openai.com</div>
              <div className="text-[10px] text-muted-foreground">Provider conectado</div>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 px-1">
            <div className="grid h-7 w-7 place-items-center rounded-full bg-accent text-accent-foreground font-mono text-xs">
              DA
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium truncate">Diego Andrade</div>
              <div className="text-[10px] text-muted-foreground truncate">engenharia · admin</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur md:px-6">
          <button className="md:hidden grid h-8 w-8 place-items-center rounded-md border border-border" aria-label="Abrir menu">
            <Command className="h-4 w-4" />
          </button>
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <span>EngenLab</span>
            <span className="opacity-40">/</span>
            <span className="text-foreground font-medium">{title ?? "Dashboard"}</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative hidden sm:block">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Buscar agentes, prompts, projetos..."
                className="h-9 w-72 rounded-md border border-border bg-secondary/60 pl-8 pr-14 text-sm outline-none placeholder:text-muted-foreground focus:border-ring"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 kbd">⌘K</span>
            </div>
            <button className="grid h-9 w-9 place-items-center rounded-md border border-border bg-secondary/60 hover:bg-secondary" aria-label="Notificações">
              <Bell className="h-4 w-4" />
            </button>
            {actions ?? (
              <button className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:opacity-90">
                <Plus className="h-4 w-4" /> Novo agente
              </button>
            )}
          </div>
        </header>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({ title, description, children }: { title: string; description?: string; children?: ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 border-b border-border px-4 py-5 md:px-6">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight md:text-2xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {children && <div className="flex shrink-0 items-center gap-2">{children}</div>}
    </div>
  );
}

export function StatusDot({ tone = "success" }: { tone?: "success" | "warning" | "destructive" | "muted" }) {
  const map = {
    success: "bg-success",
    warning: "bg-warning",
    destructive: "bg-destructive",
    muted: "bg-muted-foreground",
  } as const;
  return <span className={`inline-block h-1.5 w-1.5 rounded-full ${map[tone]}`} />;
}

export function Badge({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "success" | "warning" | "destructive" | "info" | "outline";
}) {
  const map = {
    default: "bg-secondary text-secondary-foreground border-border",
    success: "bg-success/15 text-success border-success/30",
    warning: "bg-warning/15 text-warning border-warning/30",
    destructive: "bg-destructive/15 text-destructive border-destructive/30",
    info: "bg-accent text-accent-foreground border-border",
    outline: "bg-transparent text-muted-foreground border-border",
  } as const;
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${map[tone]}`}>
      {children}
    </span>
  );
}
