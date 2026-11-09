import { createFileRoute } from "@tanstack/react-router";
import { Bell, KeyRound, Plug, Users } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Panel, StatusBadge } from "@/components/hl/ui";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings · Homelab Control Center" },
      { name: "description", content: "API integrations, authentication, users and notifications." },
      { property: "og:title", content: "Settings · Homelab Control Center" },
      { property: "og:description", content: "API integrations, authentication, users and notifications." },
    ],
  }),
  component: Settings,
});

const integrations = [
  { name: "Proxmox VE", env: "PROXMOX_URL · PROXMOX_TOKEN" },
  { name: "Home Assistant", env: "HA_URL · HA_TOKEN" },
  { name: "Plex", env: "PLEX_URL · PLEX_TOKEN" },
  { name: "Jellyfin", env: "JELLYFIN_URL · JELLYFIN_API_KEY" },
  { name: "Jellyseerr", env: "JELLYSEERR_URL · JELLYSEERR_API_KEY" },
  { name: "Docker", env: "DOCKER_HOST" },
];
const users = [
  { name: "Alex Popescu", email: "alex@homelab.local", role: "Owner" },
  { name: "Maria Ionescu", email: "maria@homelab.local", role: "Operator" },
  { name: "Dan", email: "dan@homelab.local", role: "Viewer" },
];

function Settings() {
  const soon = () => toast.info("Available once the backend is connected.");
  return (
    <>
      <PageHeader title="Settings" />
      <Tabs defaultValue="integrations">
        <TabsList className="mb-4 flex-wrap">
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="auth">Authentication</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="integrations">
          <Panel title="API integrations" icon={Plug}>
            <p className="mb-4 text-sm text-muted-foreground">Credentials are stored as server-side secrets and never reach the browser.</p>
            <ul className="divide-y divide-border">
              {integrations.map((i) => (
                <li key={i.name} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div><div className="text-sm font-medium">{i.name}</div><div className="font-mono text-xs text-muted-foreground">{i.env}</div></div>
                  <div className="flex items-center gap-3"><StatusBadge status="pending" /><Button size="sm" variant="outline" onClick={soon}>Configure</Button></div>
                </li>
              ))}
            </ul>
          </Panel>
        </TabsContent>
        <TabsContent value="auth">
          <Panel title="Authentication" icon={KeyRound}>
            <ul className="divide-y divide-border">
              {[["Require sign-in", true], ["Two-factor authentication", true], ["Allow sign-in via Twingate only", false]].map(([l, v]) => (
                <li key={String(l)} className="flex items-center justify-between py-3"><span className="text-sm">{l}</span><Switch defaultChecked={Boolean(v)} /></li>
              ))}
            </ul>
          </Panel>
        </TabsContent>
        <TabsContent value="users">
          <Panel title="User management" icon={Users} action={<Button size="sm" onClick={soon}>Invite user</Button>}>
            <ul className="divide-y divide-border">
              {users.map((u) => (
                <li key={u.email} className="flex items-center justify-between py-3">
                  <div><div className="text-sm font-medium">{u.name}</div><div className="text-xs text-muted-foreground">{u.email}</div></div>
                  <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs text-primary">{u.role}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </TabsContent>
        <TabsContent value="notifications">
          <Panel title="Notifications" icon={Bell}>
            <ul className="divide-y divide-border">
              {[["Service down alerts", true], ["High temperature warnings", true], ["Storage above 85%", true], ["New media requests", false], ["Weekly health report", false]].map(([l, v]) => (
                <li key={String(l)} className="flex items-center justify-between py-3"><span className="text-sm">{l}</span><Switch defaultChecked={Boolean(v)} /></li>
              ))}
            </ul>
          </Panel>
        </TabsContent>
      </Tabs>
    </>
  );
}
