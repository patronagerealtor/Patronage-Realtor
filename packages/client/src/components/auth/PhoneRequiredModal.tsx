import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { profileService } from "@/services/profile";

const PURPOSE_OPTIONS = [
  { value: "Real Estate Consultation", label: "Real Estate Consultation" },
  { value: "Interior Consultation", label: "Interior Consultation" },
  { value: "Both / Multiple", label: "Both / Multiple" },
] as const;

type PhoneRequiredModalProps = {
  open: boolean;
  user: User | null;
  onComplete: () => void;
};

const defaultName = (user: User | null) =>
  user?.user_metadata?.full_name ??
  user?.user_metadata?.name ??
  user?.email ??
  "";
const defaultEmail = (user: User | null) => user?.email ?? "";

export function PhoneRequiredModal({
  open,
  user,
  onComplete,
}: PhoneRequiredModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [purposeOfVisit, setPurposeOfVisit] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && user) {
      setName(defaultName(user));
      setEmail(defaultEmail(user));
      setPhone("");
      setPurposeOfVisit([]);
      setError(null);
    }
  }, [open, user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    if (!trimmedPhone) {
      setError("Phone number is required.");
      return;
    }
    if (!user?.id) {
      setError("Not signed in.");
      return;
    }
    setSubmitting(true);
    const result = await profileService.upsertProfile({
      id: user.id,
      email: trimmedEmail || null,
      full_name: trimmedName || null,
      phone: trimmedPhone,
      purpose_of_visit: purposeOfVisit.length ? purposeOfVisit.join(", ") : null,
      avatar_url: user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null,
    });
    setSubmitting(false);
    if (result.success) {
      onComplete();
    } else {
      const msg = result.error ?? "";
      setError(
        /session|expired|invalid.*token|401|400|refresh/i.test(msg)
          ? "Your session expired. Please sign in again."
          : msg
      );
    }
  }

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Complete your profile</DialogTitle>
          <DialogDescription asChild>
            <p className="text-sm text-muted-foreground">
              Add your phone number. Name and email are from your account.
            </p>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="profile-name">Name</Label>
            <Input
              id="profile-name"
              value={name}
              readOnly
              className="bg-muted cursor-not-allowed"
              aria-readonly="true"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-email">Email</Label>
            <Input
              id="profile-email"
              type="email"
              value={email}
              readOnly
              className="bg-muted cursor-not-allowed"
              aria-readonly="true"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-phone">
              Phone number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="profile-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9876543210"
              required
              autoComplete="tel"
              disabled={submitting}
            />
          </div>
          <div className="space-y-2">
            <Label>Purpose of visit (you can select multiple)</Label>
            <div className="flex flex-wrap gap-2">
              {PURPOSE_OPTIONS.map((opt) => {
                const selected = purposeOfVisit.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setPurposeOfVisit((prev) =>
                        prev.includes(opt.value)
                          ? prev.filter((v) => v !== opt.value)
                          : [...prev, opt.value]
                      );
                    }}
                    disabled={submitting}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-full border-2 py-3 px-4 transition-colors",
                      "border-border bg-background hover:bg-muted/60",
                      selected && "border-primary bg-muted/50",
                      submitting && "pointer-events-none opacity-60"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded border-2",
                        selected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-input bg-background"
                      )}
                    >
                      {selected && <Check className="h-3 w-3 stroke-[2.5]" />}
                    </span>
                    <span className="text-sm font-medium">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Saving…" : "Save and continue"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
