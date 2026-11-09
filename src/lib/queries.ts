import { queryOptions } from "@tanstack/react-query";
import { getDocker, getHomeAssistant, getMedia, getNetwork, getProxmox } from "./homelab.functions";

const opts = { staleTime: 15_000 };
export const proxmoxQuery = queryOptions({ queryKey: ["proxmox"], queryFn: () => getProxmox(), ...opts });
export const haQuery = queryOptions({ queryKey: ["ha"], queryFn: () => getHomeAssistant(), ...opts });
export const mediaQuery = queryOptions({ queryKey: ["media"], queryFn: () => getMedia(), ...opts });
export const dockerQuery = queryOptions({ queryKey: ["docker"], queryFn: () => getDocker(), ...opts });
export const networkQuery = queryOptions({ queryKey: ["network"], queryFn: () => getNetwork(), ...opts });
