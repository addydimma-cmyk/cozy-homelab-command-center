import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { AlertTriangle, Inbox, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions}
    </div>
  );
}

export function Panel({ title, icon: Icon, action, className, children }: { title?: string; icon?: LucideIcon; action?: ReactNode; className?: string; children: ReactNode }) {
  return (
    <section className={cn("panel p-4 sm:p-5", className)}>
      {title && (
        <header className="mb-4 flex items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            {Icon && <Icon className="h-4 w-4 text-cyan" />}
            {title}
          </h2>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

const tone = {
  running: "bg-success/15 text-success",
  online: "bg-success/15 text-success",
  available: "bg-success/15 text-success",
  approved: "bg-primary/15 text-primary",
  paused: "bg-warning/15 text-warning",
  pending: "bg-warning/15 text-warning",
  stopped: "bg-muted text-muted-foreground",
  offline: "bg-destructive/15 text-destructive",
  error: "bg-destructive/15 text-destructive",
  declined: "bg-destructive/15 text-destructive",
} as const;

export function StatusBadge({ status }: { status: keyof typeof tone }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium capitalize", tone[status])}>
      <span className={cn("h-1.5 w-1.5 rounded-full bg-current", (status === "running" || status === "online") && "pulse-dot")} />
      {status}
    </span>
  );
}

export function UsageBar({ value, max = 100, label, detail }: { value: number; max?: number; label?: string; detail?: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const color = pct > 85 ? "bg-destructive" : pct > 70 ? "bg-warning" : "bg-brand";
  return (
    <div className="space-y-1.5">
      {(label || detail) && (
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">{label}</span>
          <span className="font-mono">{detail ?? `${pct}%`}</span>
        </div>
      )}
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function StatCard({ label, value, hint, icon: Icon }: { label: string; value: ReactNode; hint?: ReactNode; icon: LucideIcon }) {
  return (
    <div className="panel p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
        <span className="rounded-lg bg-primary/10 p-1.5"><Icon className="h-4 w-4 text-cyan" /></span>
      </div>
      <div className="mt-3 font-mono text-2xl font-semibold">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-9 w-56" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
      </div>
      <Skeleton className="h-72 rounded-xl" />
    </div>
  );
}

export function ErrorState({ error, onRetry }: { error?: unknown; onRetry?: () => void }) {
  return (
    <div className="panel flex flex-col items-center justify-center gap-3 p-10 text-center">
      <AlertTriangle className="h-8 w-8 text-destructive" />
      <div>
        <p className="font-medium">Couldn't reach this service</p>
        <p className="mt-1 text-sm text-muted-foreground">{error instanceof Error ? error.message : "Unknown error"}</p>
      </div>
      {onRetry && <Button variant="outline" size="sm" onClick={onRetry}><RefreshCw className="h-4 w-4" />Retry</Button>}
    </div>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
      <Inbox className="h-7 w-7 text-muted-foreground" />
      <p className="text-sm font-medium">{title}</p>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
