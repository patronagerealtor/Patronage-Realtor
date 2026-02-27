import { useEffect, useState } from "react";
import { LayoutGrid } from "lucide-react";
import type { PropertyDetailData } from "@/types/propertyDetail";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type FloorPlanRequestPayload = {
  name: string;
  email: string;
  whatsapp: string;
};

type FloorPlanSectionProps = {
  data: PropertyDetailData;
  sectionRef: (el: HTMLElement | null) => void;
  /** When provided, "Request a Floor Plan" opens a form and submits here. On success (resolved true), section shows "We'll Get Back to You <Name>". */
  onFloorPlanRequest?: (payload: FloorPlanRequestPayload) => Promise<boolean>;
};

function DetailItem({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  if (!value) return null;

  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold tracking-tight">{value}</p>
    </div>
  );
}

export function FloorPlanSection({
  data,
  sectionRef,
  onFloorPlanRequest,
}: FloorPlanSectionProps) {
  const plans = data.floorPlans ?? [];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submittedName, setSubmittedName] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formValues, setFormValues] = useState({ name: "", email: "", whatsapp: "" });

  // Reset selected index if plans change
  useEffect(() => {
    setSelectedIndex(0);
  }, [plans.length]);

  const handleOpenRequest = () => {
    if (submittedName) return;
    setFormError(null);
    setFormValues({ name: "", email: "", whatsapp: "" });
    setDialogOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const name = formValues.name.trim();
    const email = formValues.email.trim();
    const whatsapp = formValues.whatsapp.trim();
    if (!name || !email || !whatsapp) {
      setFormError("Name, WhatsApp No. and Email are required.");
      return;
    }
    if (!onFloorPlanRequest) {
      setFormError("Floor plan request is not available.");
      return;
    }
    setFormSubmitting(true);
    try {
      const success = await onFloorPlanRequest({ name, email, whatsapp });
      if (success) {
        setSubmittedName(name);
        setDialogOpen(false);
      } else {
        setFormError("Something went wrong. Please try again.");
      }
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setFormSubmitting(false);
    }
  };

  const requestCtaContent = submittedName
    ? `We'll Get Back to You ${submittedName}`
    : "Request a Floor Plan";

  if (!plans.length) {
    return (
      <section
        ref={sectionRef}
        data-section="Floor Plan"
        className="scroll-mt-24"
      >
        <div className="rounded-xl border border-border bg-background p-6 md:p-8">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            Floor Plan
          </h2>

          <div className="relative mt-6 w-full overflow-hidden rounded-lg border border-border min-h-[180px] sm:min-h-[240px] md:min-h-[280px]">
            <img
              src="/Hero/FloorPlan Fallback Image.png"
              alt="Floor plan fallback"
              className="h-full min-h-[180px] w-full object-cover sm:min-h-[240px] md:min-h-[280px]"
            />
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" aria-hidden />
            <div className="absolute inset-0 flex items-center justify-center pt-20">
              <button
                type="button"
                onClick={onFloorPlanRequest ? handleOpenRequest : undefined}
                disabled={!!submittedName}
                className="rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground shadow-lg transition-transform duration-200 hover:scale-105 disabled:cursor-default disabled:opacity-90"
              >
                {requestCtaContent}
              </button>
            </div>
          </div>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Request a Floor Plan</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleFormSubmit} className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="fp-name">Name <span className="text-destructive">*</span></Label>
                <Input
                  id="fp-name"
                  value={formValues.name}
                  onChange={(e) => setFormValues((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Your name"
                  required
                  autoComplete="name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fp-whatsapp">WhatsApp No. <span className="text-destructive">*</span></Label>
                <Input
                  id="fp-whatsapp"
                  type="tel"
                  value={formValues.whatsapp}
                  onChange={(e) => setFormValues((p) => ({ ...p, whatsapp: e.target.value }))}
                  placeholder="e.g. 9876543210"
                  required
                  autoComplete="tel"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fp-email">Email <span className="text-destructive">*</span></Label>
                <Input
                  id="fp-email"
                  type="email"
                  value={formValues.email}
                  onChange={(e) => setFormValues((p) => ({ ...p, email: e.target.value }))}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>
              {formError && (
                <p className="text-sm text-destructive">{formError}</p>
              )}
              <Button type="submit" className="w-full" disabled={formSubmitting}>
                {formSubmitting ? "Sending…" : "Submit"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </section>
    );
  }

  const current = plans[selectedIndex];

  return (
    <section
      ref={sectionRef}
      data-section="Floor Plan"
      className="scroll-mt-24"
    >
      <div className="rounded-xl border border-border bg-background p-6 md:p-8">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">
          Floor Plan
        </h2>

        {/* Tabs */}
        <div className="mt-6 flex flex-wrap gap-2">
          {plans.map((plan, index) => (
            <button
              key={`${plan.bhk}-${index}`}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                selectedIndex === index
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {plan.bhk}
            </button>
          ))}
        </div>

        {/* Image */}
        <div className="mt-6 aspect-[4/3] overflow-hidden rounded-lg border border-border bg-muted flex items-center justify-center">
          {current.image ? (
            <img
              src={current.image}
              alt={current.bhk}
              className="h-full w-full object-contain"
            />
          ) : (
            <LayoutGrid className="h-12 w-12 text-muted-foreground" />
          )}
        </div>

        {/* Info Row */}
        <div className="mt-6 border-t border-border pt-6">
          <div className="grid gap-y-6 gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
            <DetailItem label="BHK Type" value={current.bhk} />
            <DetailItem
              label="Carpet Area"
              value={
                current.carpet
                  ? `${current.carpet} Sq.Ft`
                  : undefined
              }
            />
            <DetailItem label="Base Price" value={current.price} />
          </div>
        </div>

        {onFloorPlanRequest && (
          <div className="mt-6 pt-6 border-t border-border">
            {submittedName ? (
              <p className="text-center font-medium text-primary">
                We'll Get Back to You {submittedName}
              </p>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={handleOpenRequest}
              >
                {requestCtaContent}
              </Button>
            )}
          </div>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Request a Floor Plan</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleFormSubmit} className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="fp-name-2">Name <span className="text-destructive">*</span></Label>
                <Input
                  id="fp-name-2"
                  value={formValues.name}
                  onChange={(e) => setFormValues((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Your name"
                  required
                  autoComplete="name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fp-whatsapp-2">WhatsApp No. <span className="text-destructive">*</span></Label>
                <Input
                  id="fp-whatsapp-2"
                  type="tel"
                  value={formValues.whatsapp}
                  onChange={(e) => setFormValues((p) => ({ ...p, whatsapp: e.target.value }))}
                  placeholder="e.g. 9876543210"
                  required
                  autoComplete="tel"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fp-email-2">Email <span className="text-destructive">*</span></Label>
                <Input
                  id="fp-email-2"
                  type="email"
                  value={formValues.email}
                  onChange={(e) => setFormValues((p) => ({ ...p, email: e.target.value }))}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>
              {formError && (
                <p className="text-sm text-destructive">{formError}</p>
              )}
              <Button type="submit" className="w-full" disabled={formSubmitting}>
                {formSubmitting ? "Sending…" : "Submit"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
