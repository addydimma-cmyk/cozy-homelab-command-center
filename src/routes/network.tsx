import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Activity, Globe, Router, ShieldCheck } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { networkQuery } from "@/lib/queries";
import { ErrorState, PageHeader, PageSkeleton, Panel, StatCard, StatusBadge } from "@/components/hl/ui";

export const Route = createFileRoute("/network")({
  head: () => ({
    meta: [
      { title: "Network · Homelab Control Center" },
      { name: "description", content: "Network devices, connectivity, Twingate and internet uptime." },
      { property: "og:title", content: "Network · Homelab Control Center" },
      { property: "og:description", content: "Network devices, connectivity, Twingate and internet uptime." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(networkQuery),
  pendingComponent: PageSkeleton,
  errorComponent: ({ error, reset }) => <ErrorState error={error} onRetry={reset} />,
  component: NetworkPage,
});

function NetworkPage() {
  const { data } = useSuspenseQuery(networkQuery);
  const { wan, twingate } = data;
  return (
    <>
      <PageHeader title="Network" subtitle={`${wan.isp} · WAN ${wan.ip}`} />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Download" value={`${wan.down}`} hint="Mbps" icon={Globe} />
        <StatCard label="Upload" value={`${wan.up}`} hint="Mbps" icon={Globe} />
        <StatCard label="Latency" value={`${wan.latency} ms`} hint="to 1.1.1.1" icon={Activity} />
        <StatCard label="Internet uptime" value={`${wan.uptime}%`} hint="last 30 days" icon={ShieldCheck} />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel title="Connectivity (24h latency)" icon={Activity} className="lg:col-span-2">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.latencyHistory}>
                <XAxis dataKey="t" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} interval={3} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} width={28} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Line type="monotone" dataKey="ms" stroke="var(--chart-2)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Twingate" icon={ShieldCheck} action={<StatusBadge status={twingate.connected ? "online" : "offline"} />}>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Connector</dt><dd className="font-mono text-xs">{twingate.connector}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Resources</dt><dd className="font-mono">{twingate.resources}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Last heartbeat</dt><dd>{twingate.lastSeen}</dd></div>
          </dl>
        </Panel>
      </div>
      <Panel className="mt-4" title="Devices" icon={Router}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr><th className="pb-2 font-medium">Device</th><th className="pb-2 font-medium">IP</th><th className="pb-2 font-medium">MAC</th><th className="pb-2 font-medium">Latency</th><th className="pb-2 font-medium">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.devices.map((d) => (
                <tr key={d.id}>
                  <td className="py-2.5">{d.name}<span className="ml-2 text-xs capitalize text-muted-foreground">{d.type}</span></td>
                  <td className="font-mono text-xs">{d.ip}</td>
                  <td className="font-mono text-xs text-muted-foreground">{d.mac}</td>
                  <td className="font-mono text-xs">{d.latency !== null ? `${d.latency} ms` : "—"}</td>
                  <td><StatusBadge status={d.online ? "online" : "offline"} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
