import type {
  DockerContainer,
  HomeAssistantSnapshot,
  MediaSnapshot,
  NetworkSnapshot,
  ProxmoxSnapshot,
} from "./types";

export const proxmoxMock: ProxmoxSnapshot = {
  nodes: [
    { name: "pve-01", status: "online", cpu: 34, memUsed: 41.2, memTotal: 64, uptime: "42d 6h" },
    { name: "pve-02", status: "online", cpu: 18, memUsed: 22.8, memTotal: 32, uptime: "42d 6h" },
  ],
  guests: [
    { id: "100", vmid: 100, name: "truenas", kind: "vm", node: "pve-01", status: "running", cpu: 12, cores: 4, memUsed: 14.1, memTotal: 16, disk: 32, uptime: "42d 5h", os: "TrueNAS SCALE" },
    { id: "101", vmid: 101, name: "docker-host", kind: "vm", node: "pve-01", status: "running", cpu: 41, cores: 6, memUsed: 9.6, memTotal: 12, disk: 120, uptime: "18d 2h", os: "Debian 12" },
    { id: "102", vmid: 102, name: "home-assistant", kind: "vm", node: "pve-02", status: "running", cpu: 6, cores: 2, memUsed: 2.9, memTotal: 4, disk: 32, uptime: "42d 5h", os: "HAOS 13.2" },
    { id: "103", vmid: 103, name: "win11-lab", kind: "vm", node: "pve-02", status: "stopped", cpu: 0, cores: 4, memUsed: 0, memTotal: 8, disk: 80, uptime: "—", os: "Windows 11" },
    { id: "200", vmid: 200, name: "plex", kind: "lxc", node: "pve-01", status: "running", cpu: 22, cores: 4, memUsed: 3.1, memTotal: 6, disk: 16, uptime: "12d 8h", os: "Ubuntu 24.04" },
    { id: "201", vmid: 201, name: "jellyfin", kind: "lxc", node: "pve-01", status: "running", cpu: 9, cores: 4, memUsed: 2.2, memTotal: 4, disk: 16, uptime: "12d 8h", os: "Debian 12" },
    { id: "202", vmid: 202, name: "pihole", kind: "lxc", node: "pve-02", status: "running", cpu: 2, cores: 1, memUsed: 0.3, memTotal: 1, disk: 4, uptime: "42d 5h", os: "Debian 12" },
    { id: "203", vmid: 203, name: "twingate-connector", kind: "lxc", node: "pve-02", status: "running", cpu: 1, cores: 1, memUsed: 0.2, memTotal: 0.5, disk: 4, uptime: "30d 1h", os: "Ubuntu 22.04" },
    { id: "204", vmid: 204, name: "dev-sandbox", kind: "lxc", node: "pve-02", status: "paused", cpu: 0, cores: 2, memUsed: 1.1, memTotal: 2, disk: 8, uptime: "—", os: "Alpine 3.20" },
  ],
  storage: [
    { name: "local-lvm", type: "LVM-Thin", used: 0.62, total: 1.8 },
    { name: "tank", type: "ZFS", used: 14.3, total: 24 },
    { name: "backup-nfs", type: "NFS", used: 3.9, total: 8 },
  ],
};

export const homeAssistantMock: HomeAssistantSnapshot = {
  entities: [
    { id: "light.living", name: "Living Room", area: "Living", domain: "light", on: true, brightness: 72 },
    { id: "light.kitchen", name: "Kitchen", area: "Kitchen", domain: "light", on: false, brightness: 100 },
    { id: "light.office", name: "Office Desk", area: "Office", domain: "light", on: true, brightness: 45 },
    { id: "light.bedroom", name: "Bedroom", area: "Bedroom", domain: "light", on: false, brightness: 30 },
    { id: "switch.rack_fan", name: "Rack Fan", area: "Server Closet", domain: "switch", on: true },
    { id: "switch.coffee", name: "Coffee Maker", area: "Kitchen", domain: "switch", on: false },
  ],
  sensors: [
    { id: "s1", name: "Living Room", value: 21.8, unit: "°C", kind: "temperature" },
    { id: "s2", name: "Server Closet", value: 29.4, unit: "°C", kind: "temperature" },
    { id: "s3", name: "Outdoor", value: 8.2, unit: "°C", kind: "temperature" },
    { id: "s4", name: "Bathroom Humidity", value: 64, unit: "%", kind: "humidity" },
    { id: "s5", name: "Rack Power Draw", value: 312, unit: "W", kind: "power" },
    { id: "s6", name: "Office CO₂", value: 680, unit: "ppm", kind: "air" },
  ],
  automations: [
    { id: "a1", name: "Sunset lights", enabled: true, lastRun: "Yesterday 16:48" },
    { id: "a2", name: "Rack overheat alert", enabled: true, lastRun: "3 days ago" },
    { id: "a3", name: "Morning coffee", enabled: true, lastRun: "Today 07:00" },
    { id: "a4", name: "Away mode", enabled: false, lastRun: "2 weeks ago" },
  ],
  climate: [
    { id: "c1", name: "Living Room", current: 21.8, target: 22, mode: "heat" },
    { id: "c2", name: "Bedroom", current: 19.6, target: 19, mode: "auto" },
  ],
  devices: [
    { id: "d1", name: "Zigbee Coordinator", integration: "ZHA", online: true },
    { id: "d2", name: "Front Door Lock", integration: "Z-Wave", online: true, battery: 78 },
    { id: "d3", name: "Hallway Motion", integration: "ZHA", online: true, battery: 12 },
    { id: "d4", name: "Garage Sensor", integration: "ESPHome", online: false },
    { id: "d5", name: "Shelly Plug Rack", integration: "Shelly", online: true },
  ],
};

export const mediaMock: MediaSnapshot = {
  servers: [
    { name: "Plex", online: true, version: "1.41.2", transcoding: 1, libraries: [{ name: "Movies", items: 1842 }, { name: "TV Shows", items: 216 }, { name: "Music", items: 9340 }] },
    { name: "Jellyfin", online: true, version: "10.10.3", transcoding: 0, libraries: [{ name: "Movies", items: 1842 }, { name: "Shows", items: 216 }, { name: "Kids", items: 128 }] },
  ],
  streams: [
    { id: "st1", server: "Plex", user: "alex", title: "Dune: Part Two", device: "Apple TV 4K", quality: "4K HDR", progress: 64, transcode: false },
    { id: "st2", server: "Plex", user: "maria", title: "The Bear · S03E04", device: "iPhone 15", quality: "1080p → 720p", progress: 22, transcode: true },
    { id: "st3", server: "Jellyfin", user: "kids", title: "Bluey · S02E11", device: "Fire TV", quality: "1080p", progress: 81, transcode: false },
  ],
  requests: [
    { id: "r1", title: "Severance", type: "tv", requestedBy: "maria", status: "pending", date: "2h ago" },
    { id: "r2", title: "Oppenheimer", type: "movie", requestedBy: "alex", status: "available", date: "Yesterday" },
    { id: "r3", title: "Shōgun", type: "tv", requestedBy: "dan", status: "approved", date: "2 days ago" },
    { id: "r4", title: "Madame Web", type: "movie", requestedBy: "dan", status: "declined", date: "1 week ago" },
  ],
  storage: [
    { name: "Movies", type: "ZFS dataset", used: 7.8, total: 10 },
    { name: "TV", type: "ZFS dataset", used: 4.6, total: 8 },
    { name: "Music", type: "ZFS dataset", used: 0.4, total: 1 },
  ],
};

export const dockerMock: DockerContainer[] = [
  { id: "a1f3c2", name: "traefik", image: "traefik:v3.1", status: "running", cpu: 0.8, memMb: 64, ports: "80, 443", uptime: "18d", host: "docker-host" },
  { id: "b72e19", name: "portainer", image: "portainer/portainer-ce:2.21", status: "running", cpu: 0.3, memMb: 48, ports: "9443", uptime: "18d", host: "docker-host" },
  { id: "c19a77", name: "jellyseerr", image: "fallenbagel/jellyseerr:2.1", status: "running", cpu: 1.2, memMb: 210, ports: "5055", uptime: "6d", host: "docker-host" },
  { id: "d8812b", name: "sonarr", image: "linuxserver/sonarr:4", status: "running", cpu: 2.4, memMb: 312, ports: "8989", uptime: "6d", host: "docker-host" },
  { id: "e00c41", name: "radarr", image: "linuxserver/radarr:5", status: "running", cpu: 1.9, memMb: 288, ports: "7878", uptime: "6d", host: "docker-host" },
  { id: "f4b9d0", name: "qbittorrent", image: "linuxserver/qbittorrent:4.6", status: "error", cpu: 0, memMb: 0, ports: "8080", uptime: "—", host: "docker-host" },
  { id: "0a7e33", name: "uptime-kuma", image: "louislam/uptime-kuma:1", status: "running", cpu: 0.6, memMb: 120, ports: "3001", uptime: "18d", host: "docker-host" },
  { id: "1bc842", name: "grafana", image: "grafana/grafana:11.3", status: "stopped", cpu: 0, memMb: 0, ports: "3000", uptime: "—", host: "docker-host" },
];

export const networkMock: NetworkSnapshot = {
  devices: [
    { id: "n1", name: "UDM Pro", ip: "10.0.0.1", mac: "74:AC:B9:1A:22:01", type: "router", online: true, latency: 0.4 },
    { id: "n2", name: "USW-24-PoE", ip: "10.0.0.2", mac: "74:AC:B9:1A:22:02", type: "switch", online: true, latency: 0.6 },
    { id: "n3", name: "U6 Pro Living", ip: "10.0.0.10", mac: "74:AC:B9:1A:22:10", type: "ap", online: true, latency: 1.2 },
    { id: "n4", name: "pve-01", ip: "10.0.10.11", mac: "BC:24:11:8F:01:A1", type: "server", online: true, latency: 0.3 },
    { id: "n5", name: "pve-02", ip: "10.0.10.12", mac: "BC:24:11:8F:01:A2", type: "server", online: true, latency: 0.3 },
    { id: "n6", name: "NAS (truenas)", ip: "10.0.10.20", mac: "BC:24:11:3C:44:10", type: "server", online: true, latency: 0.5 },
    { id: "n7", name: "Alex MacBook", ip: "10.0.20.34", mac: "F0:18:98:2D:9B:77", type: "client", online: true, latency: 3.1 },
    { id: "n8", name: "Garage ESP32", ip: "10.0.30.51", mac: "24:6F:28:11:0C:5E", type: "iot", online: false, latency: null },
  ],
  wan: { ip: "86.124.xx.xx", isp: "Digi RCS-RDS", down: 942, up: 488, uptime: 99.97, latency: 7 },
  twingate: { connected: true, connector: "homelab-connector-01", resources: 14, lastSeen: "just now" },
  latencyHistory: Array.from({ length: 24 }, (_, i) => ({
    t: `${String(i).padStart(2, "0")}:00`,
    ms: Math.round((7 + Math.sin(i / 2) * 2 + (i === 14 ? 18 : 0)) * 10) / 10,
  })),
};

export const dockerLogs = (name: string): string[] => [
  `2026-11-09T15:30:01Z [${name}] INFO  Starting service`,
  `2026-11-09T15:30:02Z [${name}] INFO  Loaded configuration from /config`,
  `2026-11-09T15:30:02Z [${name}] INFO  Listening on 0.0.0.0`,
  `2026-11-09T15:34:17Z [${name}] WARN  Slow response from upstream (812ms)`,
  `2026-11-09T15:40:00Z [${name}] INFO  Health check passed`,
];
