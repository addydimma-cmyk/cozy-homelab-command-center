/**
 * Integration adapters. Server-only: imported from homelab.functions.ts handlers.
 * Each adapter currently returns mock data. To go live, implement the same interface
 * using fetch() against the service API with credentials read from process.env
 * (e.g. PROXMOX_URL / PROXMOX_TOKEN, HA_URL / HA_TOKEN, PLEX_TOKEN, JELLYFIN_API_KEY, DOCKER_HOST).
 */
import type { DockerAdapter, HomeAssistantAdapter, MediaAdapter, ProxmoxAdapter } from "./types";
import { dockerLogs, dockerMock, homeAssistantMock, mediaMock, proxmoxMock } from "./mock-data";

const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));

export const proxmoxAdapter: ProxmoxAdapter = {
  async snapshot() {
    await delay();
    return proxmoxMock;
  },
};

export const homeAssistantAdapter: HomeAssistantAdapter = {
  async snapshot() {
    await delay();
    return homeAssistantMock;
  },
};

/** Combines Plex, Jellyfin and Jellyseerr. */
export const mediaAdapter: MediaAdapter = {
  async snapshot() {
    await delay();
    return mediaMock;
  },
};

export const dockerAdapter: DockerAdapter = {
  async list() {
    await delay();
    return dockerMock;
  },
  async logs(id) {
    await delay(200);
    const c = dockerMock.find((x) => x.id === id);
    return c ? dockerLogs(c.name) : [];
  },
};
