export type ContactCardSubmitPayload = {
  name: string;
  email: string;
  phone: string;
};

type ContactCardProps = {
  /** Optional for future prefills from property data; not used in current UI. */
  data?: unknown;
  /** Called when form is submitted with name, email, phone (phone = mobile field value). */
  onSubmit?: (payload: ContactCardSubmitPayload) => void | Promise<void>;
};

const inputClass =
  "w-full rounded-lg border border-border/80 bg-muted/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-colors";

export function ContactCard({ onSubmit }: ContactCardProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    if (onSubmit) onSubmit({ name, email, phone });
  };

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="h-1 bg-primary/90" aria-hidden />
      <div className="p-6">
        <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground">
          Schedule a Private Site Visit
        </h3>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          Experience curated walkthroughs, floor plans & exclusive pricing from our senior sales advisor.
        </p>
        <form
          className="mt-6 space-y-4"
          onSubmit={handleSubmit}
        >
          <div className="space-y-1.5">
            <label htmlFor="contact-name" className="block text-sm font-bold text-foreground">
              Full Name
            </label>
            <input
              id="contact-name"
              type="text"
              name="name"
              placeholder="Full Name"
              autoComplete="name"
              required
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="contact-mobile" className="block text-sm font-bold text-foreground">
              Mobile Number
            </label>
            <input
              id="contact-mobile"
              type="tel"
              name="phone"
              placeholder="Mobile Number"
              autoComplete="tel"
              required
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="contact-email" className="block text-sm font-bold text-foreground">
              Email Address
            </label>
            <input
              id="contact-email"
              type="email"
              name="email"
              placeholder="Email Address"
              autoComplete="email"
              required
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-primary py-3 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:ring-offset-2"
          >
            Schedule Visit
          </button>
        </form>
        <p className="mt-4 text-xs text-muted-foreground text-center space-y-0.5">
          <span className="block">Response within very short time</span>
          <span className="block">100% Confidential</span>
        </p>
        <div className="mt-4 border-t border-border/60" aria-hidden />
      </div>
    </div>
  );
}
