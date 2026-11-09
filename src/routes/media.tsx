import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Film, HardDrive, Inbox, PlayCircle } from "lucide-react";
import { mediaQuery } from "@/lib/queries";
import { EmptyState, ErrorState, PageHeader, PageSkeleton, Panel, StatusBadge, UsageBar } from "@/components/hl/ui";

export const Route = createFileRoute("/media")({
  head: () => ({
    meta: [
      { title: "Media Center · Homelab Control Center" },
      { name: "description", content: "Plex and Jellyfin status, active streams and Jellyseerr requests." },
      { property: "og:title", content: "Media Center · Homelab Control Center" },
      { property: "og:description", content: "Plex and Jellyfin status, active streams and Jellyseerr requests." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(mediaQuery),
  pendingComponent: PageSkeleton,
  errorComponent: ({ error, reset }) => <ErrorState error={error} onRetry={reset} />,
  component: Media,
});

function Media() {
  const { data } = useSuspenseQuery(mediaQuery);
  return (
    <>
      <PageHeader title="Media Center" subtitle={`${data.streams.length} active streams`} />
      <div className="grid gap-4 md:grid-cols-2">
        {data.servers.map((s) => (
          <Panel key={s.name} title={`${s.name} · v${s.version}`} icon={Film} action={<StatusBadge status={s.online ? "online" : "offline"} />}>
            <div className="grid grid-cols-3 gap-3">
              {s.libraries.map((l) => (
                <div key={l.name} className="rounded-lg border bg-background/40 p-3">
                  <div className="text-xs text-muted-foreground">{l.name}</div>
                  <div className="font-mono text-lg font-semibold">{l.items.toLocaleString("en-US")}</div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{s.transcoding} active transcode{s.transcoding === 1 ? "" : "s"}</p>
          </Panel>
        ))}
      </div>

      <Panel className="mt-4" title="Active streams" icon={PlayCircle}>
        {data.streams.length === 0 ? <EmptyState title="Nobody is watching" /> : (
          <div className="grid gap-3 md:grid-cols-3">
            {data.streams.map((s) => (
              <div key={s.id} className="rounded-lg border bg-background/40 p-4">
                <div className="flex justify-between text-xs text-muted-foreground"><span>{s.server} · {s.user}</span><span>{s.transcode ? "Transcode" : "Direct play"}</span></div>
                <div className="mt-1 font-medium">{s.title}</div>
                <div className="mb-3 text-xs text-muted-foreground">{s.device} · {s.quality}</div>
                <UsageBar value={s.progress} positive />
              </div>
            ))}
          </div>
        )}
      </Panel>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel title="Jellyseerr requests" icon={Inbox} className="lg:col-span-2">
          <ul className="divide-y divide-border">
            {data.requests.map((r) => (
              <li key={r.id} className="flex items-center justify-between py-2.5">
                <div><div className="text-sm">{r.title}</div><div className="text-xs text-muted-foreground">{r.type === "tv" ? "Series" : "Movie"} · {r.requestedBy} · {r.date}</div></div>
                <StatusBadge status={r.status} />
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Media storage" icon={HardDrive}>
          <div className="space-y-4">
            {data.storage.map((s) => <UsageBar key={s.name} label={s.name} value={s.used} max={s.total} detail={`${s.used} / ${s.total} TB`} />)}
          </div>
        </Panel>
      </div>
    </>
  );
}
