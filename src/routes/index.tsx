import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQueries } from "@tanstack/react-query";
import { Activity, Container, Cpu, HardDrive, MemoryStick, Server, ShieldCheck, Wifi } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { dockerQuery, mediaQuery, networkQuery, proxmoxQuery } from "@/lib/queries";
import { ErrorState, PageHeader, PageSkeleton, Panel, StatCard, StatusBadge, UsageBar } from "@/components/hl/ui";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overview · Homelab Control Center" },
      { name: "description", content: "Infrastructure health, resource usage and service uptime at a glance." },
      { property: "og:title", content: "Overview · Homelab Control Center" },
      { property: "og:description", content: "Infrastructure health, resource usage and service uptime at a glance." },
    ],
  }),
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(proxmoxQuery),
      context.queryClient.ensureQueryData(dockerQuery),
      context.queryClient.ensureQueryData(networkQuery),
    ]),
  pendingComponent: PageSkeleton,
  errorComponent: ({ error, reset }) => <ErrorState error={error} onRetry={reset} />,
  component: Overview,
});

const traffic = Array.from({ length: 24 }, (_, i) => ({
  t: `${String(i).padStart(2, "0")}:00`,
  down: Math.round(120 + Math.sin(i / 3) * 80 + (i > 18 ? 180 : 0)),
  up: Math.round(40 + Math.cos(i / 4) * 25 + (i > 18 ? 30 : 0)),
}));

const services = [
  { name: "Proxmox VE", uptime: 99.99 },
  { name: "Home Assistant", uptime: 99.95 },
  { name: "Plex", uptime: 99.82 },
  { name: "Jellyfin", uptime: 99.9 },
  { name: "Traefik", uptime: 100 },
  { name: "Twingate", uptime: 99.97 },
];

function Overview() {
  const [{ data: px }, { data: docker }, { data: net }] = useSuspenseQueries({ queries: [proxmoxQuery, dockerQuery, networkQuery] });
  const cpu = Math.round(px.nodes.reduce((a, n) => a + n.cpu, 0) / px.nodes.length);
  const memU = px.nodes.reduce((a, n) => a + n.memUsed, 0);
  const memT = px.nodes.reduce((a, n) => a + n.memTotal, 0);
  const stU = px.storage.reduce((a, s) => a + s.used, 0);
  const stT = px.storage.reduce((a, s) => a + s.total, 0);
  const runningGuests = px.guests.filter((g) => g.status === "running");
  const runningCt = docker.filter((c) => c.status === "running").length;
  const issues = docker.filter((c) => c.status === "error").length + net.devices.filter((d) => !d.online).length;
  const health = Math.max(0, 100 - issues * 4);

  return (
    <>
      <PageHeader title="Infrastructure Overview" subtitle="Live snapshot across 2 nodes, 3 hosts and 14 remote resources" />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="panel flex items-center gap-5 p-5 lg:col-span-1">
          <div className="relative h-28 w-28 shrink-0">
            <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" className="stroke-muted" strokeWidth="3" />
              <circle cx="18" cy="18" r="15.9" fill="none" className="stroke-cyan" strokeWidth="3" strokeLinecap="round" strokeDasharray={`${health} 100`} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-2xl font-semibold">{health}</span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Health</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-medium"><ShieldCheck className="h-4 w-4 text-success" />Healthy</div>
            <p className="text-sm text-muted-foreground">{issues} item{issues === 1 ? "" : "s"} need attention</p>
            <Link to="/docker" className="text-sm text-cyan hover:underline">Review issues →</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:col-span-2 lg:grid-cols-4">
          <StatCard label="CPU" value={`${cpu}%`} hint="avg across nodes" icon={Cpu} />
          <StatCard label="Memory" value={`${Math.round((memU / memT) * 100)}%`} hint={`${memU.toFixed(1)} / ${memT} GB`} icon={MemoryStick} />
          <StatCard label="Storage" value={`${Math.round((stU / stT) * 100)}%`} hint={`${stU.toFixed(1)} / ${stT} TB`} icon={HardDrive} />
          <StatCard label="WAN" value={`${net.wan.uptime}%`} hint="internet uptime (30d)" icon={Wifi} />
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel title="Network traffic (24h, Mbps)" icon={Activity} className="lg:col-span-2">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={traffic}>
                <defs>
                  <linearGradient id="gd" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.5} /><stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} /></linearGradient>
                  <linearGradient id="gu" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.4} /><stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="t" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} interval={3} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} width={32} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Area type="monotone" dataKey="down" name="Download" stroke="var(--chart-1)" fill="url(#gd)" strokeWidth={2} />
                <Area type="monotone" dataKey="up" name="Upload" stroke="var(--chart-2)" fill="url(#gu)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Service uptime (30d)" icon={ShieldCheck}>
          <ul className="space-y-3">
            {services.map((s) => (
              <li key={s.name}><UsageBar label={s.name} value={s.uptime} detail={`${s.uptime}%`} positive /></li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Panel title={`Active VMs & LXCs (${runningGuests.length})`} icon={Server} action={<Link to="/proxmox" className="text-xs text-cyan hover:underline">Manage</Link>}>
          <ul className="divide-y divide-border">
            {runningGuests.slice(0, 6).map((g) => (
              <li key={g.id} className="flex items-center justify-between py-2 text-sm">
                <span className="flex items-center gap-2"><span className="rounded bg-muted px-1.5 font-mono text-[10px] uppercase">{g.kind}</span>{g.name}</span>
                <span className="font-mono text-xs text-muted-foreground">{g.cpu}% · {g.memUsed}G</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title={`Containers (${runningCt}/${docker.length} running)`} icon={Container} action={<Link to="/docker" className="text-xs text-cyan hover:underline">Manage</Link>}>
          <ul className="divide-y divide-border">
            {docker.slice(0, 6).map((c) => (
              <li key={c.id} className="flex items-center justify-between py-2 text-sm">
                <span>{c.name}</span>
                <StatusBadge status={c.status} />
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}
