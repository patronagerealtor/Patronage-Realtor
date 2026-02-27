import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useToast } from "../../hooks/use-toast";
import { insertNewsletterSubscriber } from "../../lib/supabase";

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const { toast } = useToast();

  const handleNewsletterSubmit = async () => {
    const email = newsletterEmail.trim();
    if (!email) {
      toast({ title: "Invalid email", description: "Please enter your email.", variant: "destructive" });
      return;
    }
    if (!isValidEmail(email)) {
      toast({ title: "Invalid email", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }
    setNewsletterLoading(true);
    const result = await insertNewsletterSubscriber(email);
    setNewsletterLoading(false);
    if (result.success) {
      toast({ title: "Subscribed", description: "You're on the list. We'll keep you updated." });
      setNewsletterEmail("");
    } else if (result.code === "duplicate") {
      toast({ title: "Already subscribed", description: result.message });
    } else {
      toast({ title: "Subscription failed", description: result.message, variant: "destructive" });
    }
  };

  return (
    <footer className="bg-muted text-foreground border-t border-border pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-heading font-bold text-xl tracking-tight">
              <img
                src="/logo/favicon.png"
                alt="Patronage Realtor"
                className="h-30 w-auto object-contain"
              />
            </div>
            <p className="text-muted-foreground text-sm max-w-xs flex flex-wrap gap-1">
              <a
                href="/properties"
                className="hover:text-foreground transition-colors font-medium"
              >
                Dream it !
              </a>
              <span> </span>
              <a
                href="/properties"
                className="hover:text-foreground transition-colors font-medium"
              >
                Own it !
              </a>
              <span> </span>
              <a
                href="/interiors"
                className="hover:text-foreground transition-colors font-medium"
              >
                Style it !
              </a>
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-heading font-semibold text-lg">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="/properties"
                  className="hover:text-foreground transition-colors"
                >
                  Properties
                </a>
              </li>
              <li>
                <a
                  href="/investment"
                  className="hover:text-foreground transition-colors"
                >
                  Investment
                </a>
              </li>
              <li>
                <a
                  href="/calculators"
                  className="hover:text-foreground transition-colors"
                >
                  Calculators
                </a>
              </li>
 
              <li>
                <a
                  href="/interiors"
                  className="hover:text-foreground transition-colors"
                >
                  Design Studio
                </a>
              </li>
              <li>
                <a
                  href="/webinars"
                  className="hover:text-foreground transition-colors"
                >
                  Webinars
                </a>
              </li>
              <li>
                <a
                  href="/blogs"
                  className="hover:text-foreground transition-colors"
                >
                  Blogs
                </a>
              </li>
              <li>
                <a
                  href="/about-us"
                  className="hover:text-foreground transition-colors"
                >
                  About Us
                </a>
              </li>
              
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-heading font-semibold text-lg">Contact Us</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-0.5 shrink-0" />
                <a
                  href="https://maps.app.goo.gl/RacQu6QHEgJnaXH48"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  09, IT-59 office spaces & food court, Phase 1 Hinjewadi, Pune
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0" />
                <a
                  href="tel:+918888050348"
                  className="hover:text-foreground transition-colors"
                >
                  +91 88880 50348
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0" />
                <a
                  href="mailto:patronagerealtor@gmail.com"
                  className="hover:text-foreground transition-colors"
                >
                  patronagerealtor@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-heading font-semibold text-lg">Stay Updated</h4>
            <p className="text-sm text-muted-foreground">
              Subscribe to get the latest property news.
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-background"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleNewsletterSubmit()}
                disabled={newsletterLoading}
              />
              <Button onClick={handleNewsletterSubmit} disabled={newsletterLoading}>
                {newsletterLoading ? "..." : "Subscribe"}
              </Button>
            </div>
            <div className="flex gap-4 mt-6">
              <a
                href="https://www.facebook.com/patronagerealtor"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/patronage_realtor?igsh=ejZ1YXZ5MGsxdm55&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/patronage-realtor"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>&copy; 2026 Patronage.co. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="/terms" className="hover:text-foreground">
              Terms
            </a>
            <a href="/privacy" className="hover:text-foreground">
              Privacy
            </a>
            <a href="/cookies" className="hover:text-foreground">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
