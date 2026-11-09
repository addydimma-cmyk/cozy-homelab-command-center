import { useState, type ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { performAction } from "@/lib/homelab.functions";
import type { ActionRequest } from "@/lib/adapters/types";

/** Every management action goes through this confirmation dialog. */
export function ConfirmAction({ request, label, children, onDone }: { request: ActionRequest; label: string; children: ReactNode; onDone?: () => void }) {
  const [open, setOpen] = useState(false);
  const m = useMutation({
    mutationFn: () => performAction({ data: request }),
    onSuccess: (r) => {
      toast.success(r.message, { description: "Dry run — no command was executed." });
      setOpen(false);
      onDone?.();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Action failed"),
  });
  const destructive = request.action === "stop" || request.action === "restart";
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="capitalize">{request.action} {label}?</AlertDialogTitle>
          <AlertDialogDescription>
            {destructive ? "This may interrupt running services. " : ""}Commands are in simulation mode and won't touch real infrastructure yet.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={m.isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={m.isPending}
            onClick={(e) => { e.preventDefault(); m.mutate(); }}
            className={destructive ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : undefined}
          >
            {m.isPending ? "Working…" : `Confirm ${request.action}`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
