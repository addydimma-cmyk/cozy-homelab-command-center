import { Link, useRouterState } from "@tanstack/react-router";
import { Boxes, Container, Film, Home, LayoutDashboard, Network, Server, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Overview", url: "/", icon: LayoutDashboard },
  { title: "Proxmox", url: "/proxmox", icon: Server },
  { title: "Home Assistant", url: "/home-assistant", icon: Home },
  { title: "Media Center", url: "/media", icon: Film },
  { title: "Docker", url: "/docker", icon: Container },
  { title: "Network", url: "/network", icon: Network },
  { title: "Settings", url: "/settings", icon: Settings },
] as const;

export function AppSidebar() {
  const { state, setOpenMobile } = useSidebar();
  const collapsed = state === "collapsed";
  const path = useRouterState({ select: (r) => r.location.pathname });
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-1 py-2">
          <div className="bg-brand flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"><Boxes className="h-4 w-4 text-primary-foreground" /></div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="text-sm font-semibold">Homelab</div>
              <div className="text-xs text-muted-foreground">Control Center</div>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Modules</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={path === item.url} tooltip={item.title}>
                    <Link to={item.url} onClick={() => setOpenMobile(false)}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {!collapsed && (
          <div className="rounded-lg border border-sidebar-border p-3 text-xs">
            <div className="flex items-center gap-2"><span className="pulse-dot h-2 w-2 rounded-full bg-success" />All systems nominal</div>
            <div className="mt-1 text-muted-foreground">Simulation mode</div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
