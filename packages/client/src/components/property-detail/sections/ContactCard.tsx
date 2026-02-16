type ContactCardProps = {
  /** Optional for future prefills from property data; not used in current UI. */
  data?: unknown;
};

export function ContactCard(_props: ContactCardProps) {
  return (
    <div className="sticky top-24 rounded-lg border border-border bg-background p-6">
      <h3 className="font-heading text-lg font-semibold">
        Contact Us
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Get in touch for site visits and pricing details.
      </p>
      <form
        className="mt-6 space-y-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <div>
          <label
            htmlFor="contact-name"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            placeholder="Your name"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label
            htmlFor="contact-mobile"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Mobile
          </label>
          <input
            id="contact-mobile"
            type="tel"
            placeholder="Your number"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md border border-primary bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
