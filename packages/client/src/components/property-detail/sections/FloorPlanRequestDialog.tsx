import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

type FloorPlanRequestDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId: string;
  propertyTitle: string;
};

export function FloorPlanRequestDialog({
  open,
  onOpenChange,
  propertyTitle,
}: FloorPlanRequestDialogProps) {
  const redirect =
    typeof window !== "undefined"
      ? encodeURIComponent(window.location.pathname + window.location.search + window.location.hash)
      : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-xl border border-border bg-card shadow-lg sm:max-w-md overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-primary/90 to-primary/70" aria-hidden />
        <div className="p-6 pt-5">
          <DialogHeader className="space-y-1">
            <DialogTitle className="font-heading text-lg font-semibold tracking-tight text-foreground">
              Request Detailed Floor Plans
            </DialogTitle>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Sign in to get unit layouts, carpet area breakdown & exclusive availability details.
            </p>
            {propertyTitle && (
              <p className="text-xs font-medium text-muted-foreground pt-0.5">
                For {propertyTitle}
              </p>
            )}
          </DialogHeader>
          <div className="mt-6 space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              Sign in with Google to request your floor plan.
            </p>
            <Button asChild className="w-full rounded-xl py-3.5 text-sm font-medium">
              <Link href={redirect ? `/login?redirect=${redirect}` : "/login"}>
                Sign in to get your Floor Plan
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
