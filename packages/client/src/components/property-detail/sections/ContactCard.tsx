type ContactCardProps = {
  /** Optional for future prefills from property data; not used in current UI. */
  data?: unknown;
};

export function ContactCard(_props: ContactCardProps) {
  return (
    <div className="rounded-lg border border-border bg-background p-3 md:p-4">
      <h3 className="font-heading text-sm font-semibold">
        Contact Us
      </h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Site visits & pricing.
      </p>
      <form
        className="mt-3 space-y-2.5"
        onSubmit={(e) => e.preventDefault()}
      >
        <div>
          <label htmlFor="contact-name" className="sr-only">Name</label>
          <input
            id="contact-name"
            type="text"
            placeholder="Name"
            className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label htmlFor="contact-mobile" className="sr-only">Mobile</label>
          <input
            id="contact-mobile"
            type="tel"
            placeholder="Mobile"
            className="w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md border border-primary bg-primary py-2 text-xs font-medium text-primary-foreground hover:opacity-90"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
