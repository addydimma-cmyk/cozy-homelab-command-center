import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Battery, Cpu, Lightbulb, Minus, Plus, Power, Thermometer, Workflow } from "lucide-react";
import { haQuery } from "@/lib/queries";
import { ErrorState, PageHeader, PageSkeleton, Panel, StatusBadge } from "@/components/hl/ui";
import { ConfirmAction } from "@/components/hl/ConfirmAction";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/home-assistant")({
  head: () => ({
    meta: [
      { title: "Home Assistant · Homelab Control Center" },
      { name: "description", content: "Lights, sensors, automations and climate from Home Assistant." },
      { property: "og:title", content: "Home Assistant · Homelab Control Center" },
      { property: "og:description", content: "Lights, sensors, automations and climate from Home Assistant." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(haQuery),
  pendingComponent: PageSkeleton,
  errorComponent: ({ error, reset }) => <ErrorState error={error} onRetry={reset} />,
  component: HomeAssistant,
});

function HomeAssistant() {
  const { data } = useSuspenseQuery(haQuery);
  const [on, setOn] = useState<Record<string, boolean>>(() => Object.fromEntries(data.entities.map((e) => [e.id, e.on])));
  const [targets, setTargets] = useState<Record<string, number>>(() => Object.fromEntries(data.climate.map((c) => [c.id, c.target])));
  const [autos, setAutos] = useState<Record<string, boolean>>(() => Object.fromEntries(data.automations.map((a) => [a.id, a.enabled])));

  return (
    <>
      <PageHeader title="Home Assistant" subtitle={`${data.devices.filter((d) => d.online).length}/${data.devices.length} devices online`} />
      <Panel title="Lights & switches" icon={Lightbulb}>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          {data.entities.map((e) => (
            <ConfirmAction key={e.id} request={{ target: "homeassistant", id: e.id, action: "toggle" }} label={e.name} onDone={() => setOn((s) => ({ ...s, [e.id]: !s[e.id] }))}>
              <button className={cn("rounded-xl border p-4 text-left transition-colors", on[e.id] ? "border-cyan/50 bg-cyan/10" : "bg-background/40 hover:bg-accent")}>
                {e.domain === "light" ? <Lightbulb className={cn("h-5 w-5", on[e.id] ? "text-cyan" : "text-muted-foreground")} /> : <Power className={cn("h-5 w-5", on[e.id] ? "text-cyan" : "text-muted-foreground")} />}
                <div className="mt-3 text-sm font-medium">{e.name}</div>
                <div className="text-xs text-muted-foreground">{e.area} · {on[e.id] ? (e.brightness ? `${e.brightness}%` : "On") : "Off"}</div>
              </button>
            </ConfirmAction>
          ))}
        </div>
      </Panel>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel title="Sensors" icon={Thermometer} className="lg:col-span-2">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {data.sensors.map((s) => (
              <div key={s.id} className="rounded-lg border bg-background/40 p-3">
                <div className="text-xs text-muted-foreground">{s.name}</div>
                <div className={cn("mt-1 font-mono text-xl font-semibold", s.kind === "temperature" && s.value > 28 && "text-warning")}>{s.value}<span className="ml-1 text-sm text-muted-foreground">{s.unit}</span></div>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Climate" icon={Thermometer}>
          <div className="space-y-4">
            {data.climate.map((c) => (
              <div key={c.id} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{c.name}</div>
                  <div className="text-xs text-muted-foreground capitalize">{c.mode} · now {c.current}°C</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="outline" className="h-8 w-8" aria-label="Lower" onClick={() => setTargets((t) => ({ ...t, [c.id]: (t[c.id] ?? c.target) - 0.5 }))}><Minus className="h-3 w-3" /></Button>
                  <span className="w-12 text-center font-mono">{(targets[c.id] ?? c.target).toFixed(1)}°</span>
                  <Button size="icon" variant="outline" className="h-8 w-8" aria-label="Raise" onClick={() => setTargets((t) => ({ ...t, [c.id]: (t[c.id] ?? c.target) + 0.5 }))}><Plus className="h-3 w-3" /></Button>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Panel title="Automations" icon={Workflow}>
          <ul className="divide-y divide-border">
            {data.automations.map((a) => (
              <li key={a.id} className="flex items-center justify-between py-2.5">
                <div><div className="text-sm">{a.name}</div><div className="text-xs text-muted-foreground">Last run {a.lastRun}</div></div>
                <Switch checked={autos[a.id] ?? a.enabled} onCheckedChange={(v) => setAutos((s) => ({ ...s, [a.id]: v }))} aria-label={a.name} />
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Devices" icon={Cpu}>
          <ul className="divide-y divide-border">
            {data.devices.map((d) => (
              <li key={d.id} className="flex items-center justify-between py-2.5">
                <div><div className="text-sm">{d.name}</div><div className="text-xs text-muted-foreground">{d.integration}</div></div>
                <div className="flex items-center gap-3">
                  {d.battery !== undefined && <span className={cn("flex items-center gap-1 font-mono text-xs", d.battery < 20 ? "text-destructive" : "text-muted-foreground")}><Battery className="h-3.5 w-3.5" />{d.battery}%</span>}
                  <StatusBadge status={d.online ? "online" : "offline"} />
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}
