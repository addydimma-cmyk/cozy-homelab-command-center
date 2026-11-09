import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Database, Server } from "lucide-react";
import { proxmoxQuery } from "@/lib/queries";
import { EmptyState, ErrorState, PageHeader, PageSkeleton, Panel, StatusBadge, UsageBar } from "@/components/hl/ui";
import { PowerActions } from "@/components/hl/PowerActions";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/proxmox")({
  head: () => ({
    meta: [
      { title: "Proxmox · Homelab Control Center" },
      { name: "description", content: "Manage Proxmox virtual machines, LXC containers and storage." },
      { property: "og:title", content: "Proxmox · Homelab Control Center" },
      { property: "og:description", content: "Manage Proxmox virtual machines, LXC containers and storage." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(proxmoxQuery),
  pendingComponent: PageSkeleton,
  errorComponent: ({ error, reset }) => <ErrorState error={error} onRetry={reset} />,
  component: Proxmox,
});

function Proxmox() {
  const { data } = useSuspenseQuery(proxmoxQuery);
  const [kind, setKind] = useState<"all" | "vm" | "lxc">("all");
  const guests = data.guests.filter((g) => kind === "all" || g.kind === kind);
  return (
    <>
      <PageHeader title="Proxmox VE" subtitle={`Cluster “homelab” · ${data.nodes.length} nodes · ${data.guests.length} guests`} />
      <div className="grid gap-4 md:grid-cols-2">
        {data.nodes.map((n) => (
          <Panel key={n.name} title={n.name} icon={Server} action={<StatusBadge status={n.status} />}>
            <div className="space-y-3">
              <UsageBar label="CPU" value={n.cpu} />
              <UsageBar label="Memory" value={n.memUsed} max={n.memTotal} detail={`${n.memUsed} / ${n.memTotal} GB`} />
              <p className="text-xs text-muted-foreground">Uptime {n.uptime}</p>
            </div>
          </Panel>
        ))}
      </div>

      <Panel className="mt-4" title="Guests" action={
        <Tabs value={kind} onValueChange={(v) => setKind(v as typeof kind)}>
          <TabsList><TabsTrigger value="all">All</TabsTrigger><TabsTrigger value="vm">VMs</TabsTrigger><TabsTrigger value="lxc">LXC</TabsTrigger></TabsList>
        </Tabs>
      }>
        {guests.length === 0 ? <EmptyState title="No guests" hint="Nothing matches this filter." /> : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {guests.map((g) => (
              <div key={g.id} className="rounded-lg border bg-background/40 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 font-medium"><span className="font-mono text-xs text-muted-foreground">{g.vmid}</span>{g.name}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{g.kind.toUpperCase()} · {g.node} · {g.os}</div>
                  </div>
                  <StatusBadge status={g.status} />
                </div>
                <div className="mt-3 space-y-2">
                  <UsageBar label={`CPU (${g.cores} cores)`} value={g.cpu} />
                  <UsageBar label="Memory" value={g.memUsed} max={g.memTotal} detail={`${g.memUsed} / ${g.memTotal} GB`} />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Disk {g.disk} GB · Up {g.uptime}</span>
                  <PowerActions target="proxmox" id={g.id} name={g.name} status={g.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>

      <Panel className="mt-4" title="Storage" icon={Database}>
        <div className="grid gap-4 sm:grid-cols-3">
          {data.storage.map((s) => (
            <UsageBar key={s.name} label={`${s.name} · ${s.type}`} value={s.used} max={s.total} detail={`${s.used} / ${s.total} TB`} />
          ))}
        </div>
      </Panel>
    </>
  );
}
