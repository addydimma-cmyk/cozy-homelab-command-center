import { Play, RotateCw, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmAction } from "./ConfirmAction";
import type { ActionRequest, Status } from "@/lib/adapters/types";

export function PowerActions({ target, id, name, status }: { target: ActionRequest["target"]; id: string; name: string; status: Status }) {
  const running = status === "running";
  return (
    <div className="flex gap-1">
      {!running && (
        <ConfirmAction request={{ target, id, action: "start" }} label={name}>
          <Button size="icon" variant="ghost" className="h-8 w-8 text-success" aria-label={`Start ${name}`}><Play className="h-4 w-4" /></Button>
        </ConfirmAction>
      )}
      {running && (
        <ConfirmAction request={{ target, id, action: "stop" }} label={name}>
          <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" aria-label={`Stop ${name}`}><Square className="h-4 w-4" /></Button>
        </ConfirmAction>
      )}
      <ConfirmAction request={{ target, id, action: "restart" }} label={name}>
        <Button size="icon" variant="ghost" className="h-8 w-8 text-cyan" aria-label={`Restart ${name}`}><RotateCw className="h-4 w-4" /></Button>
      </ConfirmAction>
    </div>
  );
}
