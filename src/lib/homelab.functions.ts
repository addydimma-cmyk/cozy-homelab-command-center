import { createServerFn } from "@tanstack/react-start";
import type { ActionRequest, ActionResult } from "./adapters/types";

export const getProxmox = createServerFn({ method: "GET" }).handler(async () => {
  const { proxmoxAdapter } = await import("./adapters");
  return proxmoxAdapter.snapshot();
});

export const getHomeAssistant = createServerFn({ method: "GET" }).handler(async () => {
  const { homeAssistantAdapter } = await import("./adapters");
  return homeAssistantAdapter.snapshot();
});

export const getMedia = createServerFn({ method: "GET" }).handler(async () => {
  const { mediaAdapter } = await import("./adapters");
  return mediaAdapter.snapshot();
});

export const getDocker = createServerFn({ method: "GET" }).handler(async () => {
  const { dockerAdapter } = await import("./adapters");
  return dockerAdapter.list();
});

export const getDockerLogs = createServerFn({ method: "GET" })
  .inputValidator((d: { id: string }) => {
    if (typeof d?.id !== "string" || !/^[a-z0-9]{1,64}$/i.test(d.id)) throw new Error("Invalid id");
    return d;
  })
  .handler(async ({ data }) => {
    const { dockerAdapter } = await import("./adapters");
    return dockerAdapter.logs(data.id);
  });

export const getNetwork = createServerFn({ method: "GET" }).handler(async () => {
  const { networkMock } = await import("./adapters/mock-data");
  await new Promise((r) => setTimeout(r, 300));
  return networkMock;
});

const TARGETS = ["proxmox", "docker", "homeassistant"] as const;
const ACTIONS = ["start", "stop", "restart", "toggle"] as const;

/** Management actions. Dry-run only: validated and logged, never executed. */
export const performAction = createServerFn({ method: "POST" })
  .inputValidator((d: ActionRequest) => {
    if (!TARGETS.includes(d?.target)) throw new Error("Invalid target");
    if (!ACTIONS.includes(d?.action)) throw new Error("Invalid action");
    if (typeof d.id !== "string" || d.id.length > 64) throw new Error("Invalid id");
    return d;
  })
  .handler(async ({ data }): Promise<ActionResult> => {
    await new Promise((r) => setTimeout(r, 600));
    console.log("[dry-run action]", data);
    return { ok: true, dryRun: true, message: `Simulated ${data.action} on ${data.target}/${data.id}` };
  });
