import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FileText, Search } from "lucide-react";
import { dockerQuery } from "@/lib/queries";
import { getDockerLogs } from "@/lib/homelab.functions";
import { EmptyState, ErrorState, PageHeader, PageSkeleton, Panel, StatusBadge } from "@/components/hl/ui";
import { PowerActions } from "@/components/hl/PowerActions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import type { DockerContainer } from "@/lib/adapters/types";

export const Route = createFileRoute("/docker")({
  head: () => ({
    meta: [
      { title: "Docker · Homelab Control Center" },
      { name: "description", content: "Container list, status, logs and lifecycle actions." },
      { property: "og:title", content: "Docker · Homelab Control Center" },
      { property: "og:description", content: "Container list, status, logs and lifecycle actions." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(dockerQuery),
  pendingComponent: PageSkeleton,
  errorComponent: ({ error, reset }) => <ErrorState error={error} onRetry={reset} />,
  component: Docker,
});

function Docker() {
  const { data } = useSuspenseQuery(dockerQuery);
  const [q, setQ] = useState("");
  const [logsFor, setLogsFor] = useState<DockerContainer | null>(null);
  const list = data.filter((c) => (c.name + c.image).toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <PageHeader title="Docker" subtitle={`${data.filter((c) => c.status === "running").length} of ${data.length} containers running on docker-host`} />
      <Panel>
        <div className="relative mb-4 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter containers…" className="pl-9" />
        </div>
        {list.length === 0 ? <EmptyState title="No containers found" hint="Try a different filter." /> : (
          <div className="divide-y divide-border">
            {list.map((c) => (
              <div key={c.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2"><span className="font-medium">{c.name}</span><StatusBadge status={c.status} /></div>
                  <div className="truncate font-mono text-xs text-muted-foreground">{c.image} · {c.id} · ports {c.ports}</div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-muted-foreground">{c.cpu}% · {c.memMb} MB · {c.uptime}</span>
                  <Button size="sm" variant="outline" onClick={() => setLogsFor(c)}><FileText className="h-4 w-4" />Logs</Button>
                  <PowerActions target="docker" id={c.id} name={c.name} status={c.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
      <Sheet open={!!logsFor} onOpenChange={(o) => !o && setLogsFor(null)}>
        <SheetContent className="w-full sm:max-w-xl">
          <SheetHeader><SheetTitle>Logs · {logsFor?.name}</SheetTitle></SheetHeader>
          {logsFor && <Logs id={logsFor.id} />}
        </SheetContent>
      </Sheet>
    </>
  );
}

function Logs({ id }: { id: string }) {
  const { data, isLoading, error, refetch } = useQuery({ queryKey: ["logs", id], queryFn: () => getDockerLogs({ data: { id } }) });
  if (isLoading) return <div className="space-y-2 p-4">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-4" />)}</div>;
  if (error) return <div className="p-4"><ErrorState error={error} onRetry={() => refetch()} /></div>;
  if (!data?.length) return <EmptyState title="No log output" />;
  return (
    <pre className="m-4 overflow-auto rounded-lg bg-background p-4 font-mono text-xs leading-relaxed">
      {data.map((l) => <div key={l} className={l.includes("WARN") ? "text-warning" : ""}>{l}</div>)}
    </pre>
  );
}
