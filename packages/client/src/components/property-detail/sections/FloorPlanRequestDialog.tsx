import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { insertContactLead } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const inputClass =
  "w-full rounded-xl border border-border/70 bg-muted/30 px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/80 transition-colors";

type FloorPlanRequestDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId: string;
  propertyTitle: string;
};

export function FloorPlanRequestDialog({
  open,
  onOpenChange,
  propertyId,
  propertyTitle,
}: FloorPlanRequestDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement)?.value?.trim() ?? "";
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value?.trim() ?? "";
    const phone = (form.elements.namedItem("phone") as HTMLInputElement)?.value?.trim() ?? "";
    if (!name || !email || !phone) {
      toast({ title: "Missing fields", description: "Please fill in all fields.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    const result = await insertContactLead({
      name,
      email,
      phone,
      property_id: propertyId,
      property_title: propertyTitle,
      lead_type: "floorplan_request",
    });
    setIsSubmitting(false);
    if (result.success) {
      toast({ title: "Request sent", description: "We'll send you the floor plan shortly." });
      onOpenChange(false);
      form.reset();
    } else {
      toast({ title: "Failed to submit", description: result.error, variant: "destructive" });
    }
  };

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
              Get unit layouts, carpet area breakdown & exclusive availability details.
            </p>
            {propertyTitle && (
              <p className="text-xs font-medium text-muted-foreground pt-0.5">
                For {propertyTitle}
              </p>
            )}
          </DialogHeader>
          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="floorplan-name" className="block text-sm font-bold text-foreground">
                Full Name
              </label>
              <input
                id="floorplan-name"
                type="text"
                name="name"
                placeholder="Full Name"
                autoComplete="name"
                className={inputClass}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="floorplan-phone" className="block text-sm font-bold text-foreground">
                Mobile Number
              </label>
              <input
                id="floorplan-phone"
                type="tel"
                name="phone"
                placeholder="Mobile Number"
                autoComplete="tel"
                className={inputClass}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="floorplan-email" className="block text-sm font-bold text-foreground">
                Email Address
              </label>
              <input
                id="floorplan-email"
                type="email"
                name="email"
                placeholder="Email Address"
                autoComplete="email"
                className={inputClass}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full rounded-xl bg-primary py-3.5 text-sm font-medium text-primary-foreground"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending…" : "Send Me Floor Plans"}
            </Button>
            <p className="text-xs text-muted-foreground text-center space-y-0.5 pt-1">
              <span className="block">Response within minutes</span>
              <span className="block">100% Confidential · No Spam Calls</span>
            </p>
            <div className="border-t border-border/60 pt-4 mt-4" aria-hidden />
            <p className="text-xs text-muted-foreground text-center">
              Prefer direct assistance? Speak to our advisor.
            </p>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
