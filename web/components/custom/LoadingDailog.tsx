"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface LoadingDialogProps {
  open: boolean;
  title?: string;
  description?: string;
}

export function LoadingDialog({
  open,
  title = "Please wait",
  description = "Processing your request...",
}: LoadingDialogProps) {
  return (
    <Dialog open={open}>
      <DialogContent
        className="
          glass-card-sm
          max-w-sm
          border-white/10
          bg-(--glass-surface)
          backdrop-blur-glass
          shadow-(--glass-shadow)
          [&>button]:hidden
        "
      >
        <div className="flex flex-col items-center gap-5 py-6">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />

            <div
              className="
                relative
                flex h-16 w-16 items-center justify-center
                rounded-full
                border border-primary/20
                bg-primary/10
              "
            >
              <Loader2 className="size-8 animate-spin text-primary" />
            </div>
          </div>

          <div className="space-y-1 text-center">
            <DialogTitle className="text-lg font-semibold">
              {title}
            </DialogTitle>

            <DialogDescription className="text-muted-foreground">
              {description}
            </DialogDescription>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}