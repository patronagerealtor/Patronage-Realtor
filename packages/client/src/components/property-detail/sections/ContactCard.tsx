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
  "w-full rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-colors";

export function ContactCard({ onSubmit }: ContactCardProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement)?.value?.trim() ?? "";
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value?.trim() ?? "";
    const phone = (form.elements.namedItem("phone") as HTMLInputElement)?.value?.trim() ?? "";
    if (onSubmit) onSubmit({ name, email, phone });
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h3 className="font-heading text-base font-semibold tracking-tight text-foreground">
        Contact Us
      </h3>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Site visits & pricing.
      </p>
      <form
        className="mt-4 space-y-3"
        onSubmit={handleSubmit}
      >
        <div>
          <label htmlFor="contact-name" className="sr-only">Name</label>
          <input
            id="contact-name"
            type="text"
            name="name"
            placeholder="Name"
            autoComplete="name"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="contact-mobile" className="sr-only">Mobile number</label>
          <input
            id="contact-mobile"
            type="tel"
            name="phone"
            placeholder="Mobile number"
            autoComplete="tel"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="sr-only">Email</label>
          <input
            id="contact-email"
            type="email"
            name="email"
            placeholder="Email"
            autoComplete="email"
            className={inputClass}
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:ring-offset-2"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
