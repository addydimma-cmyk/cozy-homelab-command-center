export type Status = "running" | "stopped" | "paused" | "error";
export type ActionVerb = "start" | "stop" | "restart";

export interface Guest {
  id: string;
  vmid: number;
  name: string;
  kind: "vm" | "lxc";
  node: string;
  status: Status;
  cpu: number; // percent
  cores: number;
  memUsed: number; // GB
  memTotal: number;
  disk: number; // GB
  uptime: string;
  os: string;
}

export interface StoragePool {
  name: string;
  type: string;
  used: number; // TB
  total: number;
}

export interface ProxmoxNode {
  name: string;
  status: "online" | "offline";
  cpu: number;
  memUsed: number;
  memTotal: number;
  uptime: string;
}

export interface ProxmoxSnapshot {
  nodes: ProxmoxNode[];
  guests: Guest[];
  storage: StoragePool[];
}

export interface HaEntity {
  id: string;
  name: string;
  area: string;
  domain: "light" | "switch";
  on: boolean;
  brightness?: number;
}
export interface HaSensor {
  id: string;
  name: string;
  value: number;
  unit: string;
  kind: "temperature" | "humidity" | "power" | "air";
}
export interface HaAutomation {
  id: string;
  name: string;
  enabled: boolean;
  lastRun: string;
}
export interface HaClimate {
  id: string;
  name: string;
  current: number;
  target: number;
  mode: "heat" | "cool" | "auto" | "off";
}
export interface HaDevice {
  id: string;
  name: string;
  integration: string;
  online: boolean;
  battery?: number;
}
export interface HomeAssistantSnapshot {
  entities: HaEntity[];
  sensors: HaSensor[];
  automations: HaAutomation[];
  climate: HaClimate[];
  devices: HaDevice[];
}

export interface MediaServer {
  name: "Plex" | "Jellyfin";
  online: boolean;
  version: string;
  libraries: { name: string; items: number }[];
  transcoding: number;
}
export interface MediaStream {
  id: string;
  server: "Plex" | "Jellyfin";
  user: string;
  title: string;
  device: string;
  quality: string;
  progress: number;
  transcode: boolean;
}
export interface MediaRequest {
  id: string;
  title: string;
  type: "movie" | "tv";
  requestedBy: string;
  status: "pending" | "approved" | "available" | "declined";
  date: string;
}
export interface MediaSnapshot {
  servers: MediaServer[];
  streams: MediaStream[];
  requests: MediaRequest[];
  storage: StoragePool[];
}

export interface DockerContainer {
  id: string;
  name: string;
  image: string;
  status: Status;
  cpu: number;
  memMb: number;
  ports: string;
  uptime: string;
  host: string;
}

export interface NetDevice {
  id: string;
  name: string;
  ip: string;
  mac: string;
  type: "router" | "switch" | "ap" | "server" | "client" | "iot";
  online: boolean;
  latency: number | null;
}
export interface NetworkSnapshot {
  devices: NetDevice[];
  wan: { ip: string; isp: string; down: number; up: number; uptime: number; latency: number };
  twingate: { connected: boolean; connector: string; resources: number; lastSeen: string };
  latencyHistory: { t: string; ms: number }[];
}

export interface ActionRequest {
  target: "proxmox" | "docker" | "homeassistant";
  id: string;
  action: ActionVerb | "toggle";
}
export interface ActionResult {
  ok: boolean;
  dryRun: true;
  message: string;
}

/** Contract every integration adapter implements. Real adapters run server-side only. */
export interface ProxmoxAdapter {
  snapshot(): Promise<ProxmoxSnapshot>;
}
export interface HomeAssistantAdapter {
  snapshot(): Promise<HomeAssistantSnapshot>;
}
export interface MediaAdapter {
  snapshot(): Promise<MediaSnapshot>;
}
export interface DockerAdapter {
  list(): Promise<DockerContainer[]>;
  logs(id: string): Promise<string[]>;
}
