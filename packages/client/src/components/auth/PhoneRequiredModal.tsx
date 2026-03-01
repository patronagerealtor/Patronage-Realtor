import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { upsertProfile } from "@/lib/supabase";

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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && user) {
      setName(defaultName(user));
      setEmail(defaultEmail(user));
      setPhone("");
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
    const result = await upsertProfile({
      id: user.id,
      email: trimmedEmail || null,
      full_name: trimmedName || null,
      phone: trimmedPhone,
      avatar_url: user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null,
    });
    setSubmitting(false);
    if (result.success) {
      onComplete();
    } else {
      setError(result.error);
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
          <p className="text-sm text-muted-foreground">
            Add your phone number. Name and email are from your account.
          </p>
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
