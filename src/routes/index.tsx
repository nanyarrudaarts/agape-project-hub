import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CircleDot,
  ClipboardCheck,
  Clock3,
  Filter,
  Layers3,
  ListChecks,
  PanelRightOpen,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AGAPE Project Hub | Calendar, Tasks & Implementation" },
      {
        name: "description",
        content:
          "Central de implantação AGAPE para projetos, fases, tasks, responsáveis, prazos, dependências, validações e aprovações.",
      },
      { property: "og:title", content: "AGAPE Project Hub" },
      {
        property: "og:description",
        content:
          "Workspace editorial de project management para coordenar a implementação AGAPE entre Pastor, Amanda e Nany.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type View = "calendar" | "tasks" | "timeline";
type Status = "done" | "progress" | "wait" | "review" | "blocked";
type Category = "website" | "branding" | "audiovisual" | "launch" | "operations";

interface HubTask {
  id: string;
  title: string;
  date: string;
  day: number;
  owner: "Amanda" | "Nany" | "Pastor";
  status: Status;
  category: Category;
  dependency: string;
  validation: string;
  notes: string;
  priority: "Alta" | "Média" | "Checkpoint";
}

const tabs: Array<{ id: View; label: string; icon: typeof CalendarDays }> = [
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "tasks", label: "Tasks", icon: ListChecks },
  { id: "timeline", label: "Timeline", icon: Layers3 },
];

const people = [
  {
    name: "Pastor",
    role: "Direção Pastoral & Visão",
    focus: "Aprovações, decisões estratégicas, visão geral e checkpoints críticos.",
    tone: "approval",
  },
  {
    name: "Amanda",
    role: "Secretariado & Coordenação",
    focus: "Follow-up, prazos, responsáveis, reuniões, bloqueios e decisões registradas.",
    tone: "coordination",
  },
  {
    name: "Nany",
    role: "Implementação / Estratégia / Criativo / Tecnologia",
    focus: "Branding, website, conteúdo, execução, validação técnica e visual.",
    tone: "implementation",
  },
];

const tasks: HubTask[] = [
  {
    id: "plan-21",
    title: "Consolidar planejamento",
    date: "21/09/2026",
    day: 21,
    owner: "Amanda",
    status: "progress",
    category: "branding",
    dependency: "Mapear projetos, fases e decisões já registradas.",
    validation: "Plano operacional aprovado para a semana da homepage.",
    notes: "Separar o que é decisão oficial do que ainda é prazo proposto.",
    priority: "Alta",
  },
  {
    id: "owners-22",
    title: "Responsáveis + decisões",
    date: "22/09/2026",
    day: 22,
    owner: "Amanda",
    status: "progress",
    category: "operations",
    dependency: "Lista de projetos ativos e pessoas responsáveis.",
    validation: "Cada task crítica tem responsável, prazo e próximo passo.",
    notes: "Amanda centraliza follow-up entre Nany e Pastor.",
    priority: "Alta",
  },
  {
    id: "access-23",
    title: "Acessos / contas",
    date: "23/09/2026",
    day: 23,
    owner: "Amanda",
    status: "wait",
    category: "operations",
    dependency: "Confirmação de contas, domínios, e-mails e ferramentas.",
    validation: "Nenhuma etapa técnica crítica depende de acesso pendente.",
    notes: "Registrar bloqueios e proprietário de cada acesso.",
    priority: "Média",
  },
  {
    id: "channels-24",
    title: "Canais oficiais",
    date: "24/09/2026",
    day: 24,
    owner: "Amanda",
    status: "wait",
    category: "branding",
    dependency: "Definição dos canais prioritários da implantação.",
    validation: "Canais digitais documentados para lançamento.",
    notes: "Website, WhatsApp, e-mail, social e comunicação interna.",
    priority: "Média",
  },
  {
    id: "checkpoint-25",
    title: "Checkpoint 01",
    date: "25/09/2026",
    day: 25,
    owner: "Pastor",
    status: "review",
    category: "launch",
    dependency: "Plano, responsáveis e riscos atualizados.",
    validation: "Pastor valida direção e libera próxima fase.",
    notes: "Reunião curta, focada em decisões e bloqueios.",
    priority: "Checkpoint",
  },
  {
    id: "infra-26",
    title: "Infraestrutura digital",
    date: "26/09/2026",
    day: 26,
    owner: "Nany",
    status: "progress",
    category: "website",
    dependency: "Acessos e escopo mínimo definidos.",
    validation: "Ambiente pronto para implementação visual da homepage.",
    notes: "Checar base técnica antes da etapa visual.",
    priority: "Alta",
  },
  {
    id: "prep-home-27",
    title: "Preparação Homepage",
    date: "27/09/2026",
    day: 27,
    owner: "Nany",
    status: "progress",
    category: "website",
    dependency: "Conteúdo, identidade e arquitetura de seções.",
    validation: "Homepage pronta para construção estrutural.",
    notes: "Organizar header, hero, seções, CTAs e footer.",
    priority: "Alta",
  },
  {
    id: "home-structure-28",
    title: "Homepage · estrutura",
    date: "28/09/2026",
    day: 28,
    owner: "Nany",
    status: "progress",
    category: "website",
    dependency: "Wireframe e conteúdo base aprovados.",
    validation: "Estrutura navegável com seções principais no lugar.",
    notes: "Prioridade operacional imediata da semana.",
    priority: "Alta",
  },
  {
    id: "identity-28",
    title: "Identidade · apresentação",
    date: "28/09/2026",
    day: 28,
    owner: "Nany",
    status: "wait",
    category: "branding",
    dependency: "Sistema visual AGAPE consolidado.",
    validation: "Identidade apresentada em formato claro para validação.",
    notes: "Manter profissional, AGAPE, sem aparência religiosa literal.",
    priority: "Média",
  },
  {
    id: "home-visual-29",
    title: "Homepage · visual",
    date: "29/09/2026",
    day: 29,
    owner: "Nany",
    status: "progress",
    category: "website",
    dependency: "Estrutura da homepage implementada.",
    validation: "Visual, imagens, proporções e responsividade refinados.",
    notes: "Checar desktop, tablet e mobile.",
    priority: "Alta",
  },
  {
    id: "home-validation-30",
    title: "Teste + validação",
    date: "30/09/2026",
    day: 30,
    owner: "Pastor",
    status: "review",
    category: "website",
    dependency: "Homepage visualmente finalizada.",
    validation: "Teste completo e aprovação para avançar.",
    notes: "Registrar ajustes finais e decisão de entrega.",
    priority: "Checkpoint",
  },
];

const timeline = [
  {
    date: "21–27/09",
    title: "Preparação",
    text: "Plano, responsáveis, acessos, canais, dependências e primeiro checkpoint.",
  },
  {
    date: "28/09",
    title: "Homepage · estrutura",
    text: "Header, Hero, seções, CTAs, navegação, footer e fluxo principal.",
  },
  {
    date: "29/09",
    title: "Homepage · visual",
    text: "Identidade, tipografia, proporções, imagens, estados e responsividade.",
  },
  {
    date: "30/09",
    title: "Homepage · validação",
    text: "Testes em desktop, tablet e mobile, regressões e aprovação final.",
  },
  {
    date: "05–25/10",
    title: "Ecossistema digital",
    text: "Website, audiovisual, WhatsApp/e-mail, social media e comunicação.",
  },
  {
    date: "19/10–08/11",
    title: "Experiência física",
    text: "Impressos, merch, ministérios, visitantes, ambiente e culto.",
  },
  {
    date: "09–15/11",
    title: "Lançamento",
    text: "Checklist, testes, ensaio, lançamento e validação pós-lançamento.",
  },
];

const statusLabel: Record<Status, string> = {
  done: "Concluído",
  progress: "Implementação",
  wait: "Aguardando",
  review: "Validação",
  blocked: "Bloqueado",
};

const categoryLabel: Record<Category, string> = {
  website: "Website",
  branding: "Branding",
  audiovisual: "Audiovisual",
  launch: "Lançamento",
  operations: "Coordenação",
};

const categoryClass: Record<Category, string> = {
  website: "border-l-primary bg-agape-blue/20 text-primary",
  branding: "border-l-agape-green bg-agape-cream text-agape-green",
  audiovisual: "border-l-agape-amber bg-agape-amber/15 text-agape-charcoal",
  launch: "border-l-agape-lime bg-agape-lime/25 text-agape-charcoal",
  operations: "border-l-agape-charcoal bg-muted text-agape-charcoal",
};

const statusDotClass: Record<Status, string> = {
  done: "bg-agape-green",
  progress: "bg-primary",
  wait: "bg-agape-amber",
  review: "bg-agape-lime",
  blocked: "bg-destructive",
};

const days = [
  { label: "31", muted: true, date: 31 },
  ...Array.from({ length: 30 }, (_, index) => ({ label: String(index + 1), date: index + 1 })),
  { label: "1", muted: true, date: 101 },
  { label: "2", muted: true, date: 102 },
  { label: "3", muted: true, date: 103 },
  { label: "4", muted: true, date: 104 },
];

function Index() {
  const [view, setView] = useState<View>("calendar");
  const [selectedTask, setSelectedTask] = useState<HubTask | null>(tasks[7]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filteredTasks = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return tasks;
    return tasks.filter((task) =>
      [task.title, task.owner, categoryLabel[task.category], statusLabel[task.status]]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [query]);

  const completion = Math.round((tasks.filter((task) => task.status === "done").length / tasks.length) * 100);
  const progress = Math.round((tasks.filter((task) => task.status === "progress").length / tasks.length) * 100);

  const openTask = (task: HubTask) => {
    setSelectedTask(task);
    setIsDrawerOpen(true);
  };

  const openNewTask = () => {
    setSelectedTask(null);
    setIsDrawerOpen(true);
  };

  return (
    <main className="min-h-screen bg-agape-shell px-3 py-3 text-foreground sm:px-5 sm:py-5 lg:px-8 lg:py-7">
      <div className="mx-auto min-h-[calc(100vh-1.5rem)] max-w-[1500px] overflow-hidden rounded-[2rem] border border-border bg-background shadow-hub sm:min-h-[calc(100vh-2.5rem)]">
        <Header view={view} onViewChange={setView} />

        <section className="flex flex-col gap-5 border-b border-border bg-agape-paper px-4 py-5 sm:px-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span>Portal</span>
              <span>›</span>
              <span>AGAPE Project Hub</span>
            </div>
            <h1 className="max-w-3xl text-3xl font-medium leading-tight tracking-normal text-foreground sm:text-4xl">
              Implementation Hub
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Projetos, fases, tasks, responsáveis, prazos, dependências, validação, aprovação e entrega em uma única central.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative min-w-0 sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search..."
                className="h-10 rounded-full border-border bg-card pl-9 shadow-none"
              />
            </div>
            <Button variant="outline" className="rounded-full border-border bg-card">
              <Filter />
              Filtros
            </Button>
            <Button variant="hub" onClick={openNewTask}>
              <PanelRightOpen />
              Nova task
            </Button>
          </div>
        </section>

        <section className="bg-primary px-4 py-4 text-primary-foreground sm:px-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3">
              <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary-foreground/10">
                <Sparkles className="size-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/70">Prioridade · Homepage</p>
                <p className="mt-1 text-sm leading-6 text-primary-foreground/90">
                  28/09 implementação → 29/09 visual + responsividade → 30/09 teste + validação.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-primary-foreground/10 px-4 py-2 text-sm font-semibold">30/09</span>
              <span className="rounded-full bg-agape-lime px-4 py-2 text-sm font-semibold text-agape-charcoal">Checkpoint</span>
            </div>
          </div>
        </section>

        {view === "calendar" && <CalendarView filteredTasks={filteredTasks} onOpenTask={openTask} />}
        {view === "tasks" && <TasksView filteredTasks={filteredTasks} onOpenTask={openTask} />}
        {view === "timeline" && <TimelineView />}
      </div>

      <TaskDrawer
        open={isDrawerOpen}
        task={selectedTask}
        onClose={() => setIsDrawerOpen(false)}
      />
    </main>
  );
}

function Header({ view, onViewChange }: { view: View; onViewChange: (view: View) => void }) {
  return (
    <header className="flex min-h-20 flex-col gap-4 border-b border-border bg-agape-cream px-4 py-4 sm:px-7 lg:flex-row lg:items-center">
      <div className="flex items-center gap-4">
        <div className="grid size-12 place-items-center rounded-2xl bg-primary text-lg font-semibold text-primary-foreground">A</div>
        <div>
          <p className="text-lg font-medium leading-none text-foreground">AGAPE · Implementation</p>
          <p className="mt-1 text-xs text-muted-foreground">Project Calendar & Task Management</p>
        </div>
      </div>
      <nav className="flex flex-1 flex-wrap gap-2 lg:justify-center" aria-label="Workspace views">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              type="button"
              variant={view === tab.id ? "navActive" : "nav"}
              size="sm"
              onClick={() => onViewChange(tab.id)}
              aria-pressed={view === tab.id}
            >
              <Icon />
              {tab.label}
            </Button>
          );
        })}
      </nav>
      <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2">
        <UsersRound className="size-4 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground">Pastor · Amanda · Nany</span>
      </div>
    </header>
  );
}

function CalendarView({ filteredTasks, onOpenTask }: { filteredTasks: HubTask[]; onOpenTask: (task: HubTask) => void }) {
  return (
    <section className="grid gap-5 bg-agape-paper p-4 sm:p-7 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="overflow-hidden rounded-3xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-5">
          <Button variant="softIcon" size="icon" aria-label="Mês anterior">
            <ArrowLeft />
          </Button>
          <div className="text-center">
            <h2 className="text-base font-semibold text-foreground">Setembro 2026</h2>
            <p className="text-xs text-muted-foreground">Visão mensal de implantação</p>
          </div>
          <Button variant="softIcon" size="icon" aria-label="Próximo mês">
            <ArrowRight />
          </Button>
        </div>

        <div className="overflow-x-auto">
          <div className="grid min-w-[760px] grid-cols-7 border-l border-border">
            {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((day) => (
              <div key={day} className="border-b border-r border-border bg-muted/70 px-3 py-3 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {day}
              </div>
            ))}
            {days.map((day, index) => {
              const dayTasks = filteredTasks.filter((task) => task.day === day.date);
              return (
                <div
                  key={`${day.label}-${index}`}
                  className={cn(
                    "min-h-32 border-b border-r border-border bg-card p-2 transition-colors",
                    day.muted && "bg-muted/45 text-muted-foreground",
                    day.date === 21 && "bg-agape-lime/10",
                  )}
                >
                  <div className="mb-2 text-xs font-semibold">{day.label}</div>
                  <div className="space-y-1.5">
                    {dayTasks.map((task) => (
                      <Button
                        key={task.id}
                        variant="task"
                        size="task"
                        onClick={() => onOpenTask(task)}
                        className={cn("w-full justify-start border-l-4", categoryClass[task.category])}
                      >
                        <span className={cn("size-1.5 shrink-0 rounded-full", statusDotClass[task.status])} aria-hidden />
                        <span className="truncate">{task.title}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <aside className="grid gap-4 lg:grid-cols-2 xl:grid-cols-1">
        <Panel title="Prioridade atual">
          <div className="rounded-2xl bg-agape-cream p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">Homepage AGAPE</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">28/09 → 30/09 · implementação, teste e validação.</p>
              </div>
              <Badge variant="outline" className="border-primary text-primary">Alta</Badge>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-border">
              <div className="h-full w-[64%] rounded-full bg-agape-green" />
            </div>
          </div>
        </Panel>

        <Panel title="Tasks desta semana">
          <div className="divide-y divide-border">
            {tasks.slice(0, 5).map((task) => (
              <button
                key={task.id}
                type="button"
                onClick={() => onOpenTask(task)}
                className="flex w-full items-start gap-3 py-3 text-left transition-colors hover:text-primary"
              >
                <span className={cn("mt-1 size-2.5 rounded-full", statusDotClass[task.status])} aria-hidden />
                <span>
                  <span className="block text-sm font-medium text-foreground">{task.title}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{task.date} · {task.owner}</span>
                </span>
              </button>
            ))}
          </div>
        </Panel>

        <Panel title="Status">
          <div className="flex flex-wrap gap-2">
            {Object.entries(statusLabel).map(([status, label]) => (
              <span key={status} className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-2 text-xs text-muted-foreground">
                <span className={cn("size-2 rounded-full", statusDotClass[status as Status])} aria-hidden />
                {label}
              </span>
            ))}
          </div>
        </Panel>
      </aside>
    </section>
  );
}

function TasksView({ filteredTasks, onOpenTask }: { filteredTasks: HubTask[]; onOpenTask: (task: HubTask) => void }) {
  return (
    <section className="grid gap-5 bg-agape-paper p-4 sm:p-7 xl:grid-cols-[310px_minmax(0,1fr)]">
      <aside className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
        {people.map((person) => (
          <Panel key={person.name} title={person.name}>
            <p className="text-sm font-semibold text-foreground">{person.role}</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{person.focus}</p>
          </Panel>
        ))}
      </aside>
      <div className="overflow-hidden rounded-3xl border border-border bg-card">
        <div className="grid grid-cols-[minmax(0,1.3fr)_120px_120px_130px] gap-3 border-b border-border bg-muted/50 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground max-lg:hidden">
          <span>Task</span>
          <span>Responsável</span>
          <span>Prazo</span>
          <span>Status</span>
        </div>
        <div className="divide-y divide-border">
          {filteredTasks.map((task) => (
            <button
              key={task.id}
              type="button"
              onClick={() => onOpenTask(task)}
              className="grid w-full gap-3 px-5 py-4 text-left transition-colors hover:bg-muted/45 lg:grid-cols-[minmax(0,1.3fr)_120px_120px_130px] lg:items-center"
            >
              <span>
                <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <span className={cn("size-2 rounded-full", statusDotClass[task.status])} aria-hidden />
                  {task.title}
                </span>
                <span className="mt-1 block text-xs text-muted-foreground">{categoryLabel[task.category]} · {task.dependency}</span>
              </span>
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground"><UserRound className="size-4" />{task.owner}</span>
              <span className="text-sm text-muted-foreground">{task.date}</span>
              <span className="inline-flex w-fit items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">{statusLabel[task.status]}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineView() {
  return (
    <section className="bg-agape-paper p-4 sm:p-7">
      <div className="mx-auto max-w-5xl rounded-3xl border border-border bg-card p-5 sm:p-7">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-2xl bg-primary text-primary-foreground">
            <Clock3 className="size-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Linha de implantação</h2>
            <p className="text-sm text-muted-foreground">Do planejamento ao lançamento e validação pós-entrega.</p>
          </div>
        </div>
        <div className="space-y-1">
          {timeline.map((item, index) => (
            <div key={item.date} className="grid gap-4 border-b border-border py-4 last:border-b-0 sm:grid-cols-[130px_minmax(0,1fr)]">
              <div className="text-sm font-semibold text-muted-foreground">{item.date}</div>
              <div className="relative pl-6">
                <span className="absolute left-0 top-1.5 size-2.5 rounded-full bg-primary" />
                {index !== timeline.length - 1 && <span className="absolute bottom-[-1.1rem] left-1 top-5 w-px bg-border" />}
                <p className="font-semibold text-foreground">{item.title}</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-border bg-card p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">{title}</h3>
      {children}
    </section>
  );
}

function TaskDrawer({ open, task, onClose }: { open: boolean; task: HubTask | null; onClose: () => void }) {
  const title = task?.title ?? "Nova task";
  return (
    <div className={cn("fixed inset-0 z-40 pointer-events-none", open && "pointer-events-auto")} aria-hidden={!open}>
      <div className={cn("absolute inset-0 bg-agape-charcoal/25 opacity-0 transition-opacity", open && "opacity-100")} onClick={onClose} />
      <aside
        className={cn(
          "absolute inset-y-0 right-0 flex w-full max-w-[460px] translate-x-full flex-col overflow-y-auto bg-background p-5 shadow-drawer transition-transform sm:p-7",
          open && "translate-x-0",
        )}
        aria-label="Task details"
      >
        <div className="flex items-center justify-between gap-3">
          <Button variant="outline" className="rounded-full border-border bg-card" onClick={onClose}>
            Fechar
          </Button>
          <Button variant="softIcon" size="icon" onClick={onClose} aria-label="Fechar painel">
            <X />
          </Button>
        </div>

        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Task Manager</p>
          <h2 className="mt-2 text-3xl font-medium leading-tight text-foreground">{title}</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Registre implementação, dependências, validação, decisões e conclusão.
          </p>
        </div>

        <div className="mt-6 grid gap-4">
          <DrawerField label="Task">
            <Input defaultValue={title} placeholder="Nome da tarefa" className="rounded-xl border-border bg-card" />
          </DrawerField>
          <div className="grid gap-4 sm:grid-cols-2">
            <DrawerField label="Prazo">
              <Input defaultValue={task?.date ?? ""} placeholder="DD/MM/AAAA" className="rounded-xl border-border bg-card" />
            </DrawerField>
            <DrawerField label="Responsável">
              <Input defaultValue={task?.owner ?? ""} placeholder="Amanda, Nany ou Pastor" className="rounded-xl border-border bg-card" />
            </DrawerField>
          </div>
          <DrawerField label="Status">
            <div className="flex flex-wrap gap-2">
              {Object.entries(statusLabel).map(([status, label]) => (
                <Badge
                  key={status}
                  variant="outline"
                  className={cn(
                    "gap-2 rounded-full border-border px-3 py-1.5 text-muted-foreground",
                    task?.status === status && "border-primary text-primary",
                  )}
                >
                  <span className={cn("size-2 rounded-full", statusDotClass[status as Status])} />
                  {label}
                </Badge>
              ))}
            </div>
          </DrawerField>
          <DrawerField label="Dependência">
            <Input defaultValue={task?.dependency ?? ""} placeholder="O que precisa existir antes?" className="rounded-xl border-border bg-card" />
          </DrawerField>
          <DrawerField label="Validação / critério de conclusão">
            <Textarea
              defaultValue={task?.validation ?? ""}
              placeholder="Como vamos saber que esta task realmente está concluída?"
              className="min-h-28 rounded-xl border-border bg-card"
            />
          </DrawerField>
          <DrawerField label="Decisões / notas">
            <Textarea
              defaultValue={task?.notes ?? ""}
              placeholder="Decisões, bloqueios, follow-up e observações."
              className="min-h-28 rounded-xl border-border bg-card"
            />
          </DrawerField>
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button variant="hub" className="flex-1" onClick={onClose}>
            <ClipboardCheck />
            Salvar task
          </Button>
          <Button variant="outline" className="rounded-full border-border bg-card" onClick={onClose}>
            <ShieldCheck />
            Enviar para aprovação
          </Button>
        </div>
      </aside>
    </div>
  );
}

function DrawerField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block rounded-2xl border border-border bg-agape-paper p-4">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
