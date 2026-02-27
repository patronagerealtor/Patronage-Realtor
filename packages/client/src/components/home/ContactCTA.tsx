import { ArrowRight } from "lucide-react";

const CONTACT_FORM_URL =
  import.meta.env.VITE_CONTACT_FORM_URL ?? "https://forms.gle/oSqrGhasHGWenKNf8";

export function ContactCTA() {
  return (
    <section className="relative w-full overflow-hidden py-24 md:py-32">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/Hero/ContactCTA Image.jpg"
          alt="Luxury Real Estate Background"
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/65 to-black/85" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.7)_100%)]" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-6 text-center">
        <p className="text-xs tracking-[0.35em] uppercase text-white/40 mb-6">
          Private Consultation
        </p>

        <h2 className="text-4xl md:text-6xl font-heading font-bold leading-tight text-white mb-6">
          Discover Your Perfect Address
        </h2>

        <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-14 leading-relaxed">
          Our senior advisors curate exclusive property options tailored to your
          lifestyle and investment goals.
        </p>

        {/* Glass Button */}
        <div className="flex justify-center">
          <a
            href={CONTACT_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="
              group relative inline-flex items-center justify-center
              px-14 h-14
              text-lg font-semibold text-white
              rounded-full
              border border-white/20
              backdrop-blur-md
              bg-white/10
              shadow-[0_8px_30px_rgba(0,0,0,0.4)]
              transition-all duration-300
              hover:bg-white/20
              hover:border-white/40
              hover:shadow-[0_12px_40px_rgba(0,0,0,0.6)]
            "
          >
            <span className="relative z-10 flex items-center">
              Schedule Private Consultation
              <ArrowRight className="ml-3 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>

            {/* subtle inner light */}
            <span className="absolute inset-0 rounded-full bg-gradient-to-t from-white/5 to-white/20 opacity-50 pointer-events-none" />
          </a>
        </div>

        <p className="mt-10 text-sm text-white/40">
          Discreet Assistance · Priority Site Visits · Transparent Advisory
        </p>
      </div>
    </section>
  );
}