import { useState } from "react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Calendar, Clock, User, ArrowRight, PlayCircle, Upload, CheckCircle } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { insertWebinarRegistration, uploadWebinarPaymentProof } from "../lib/supabase";

// Payment: set VITE_WEBINAR_PAYMENT_LINK in .env to your Razorpay/Stripe payment link
const WEBINAR_PAYMENT_LINK = import.meta.env.VITE_WEBINAR_PAYMENT_LINK ?? "";
// Contact form: set VITE_WEBINAR_CONTACT_FORM_URL in .env to override
const WEBINAR_CONTACT_FORM_URL =
  import.meta.env.VITE_WEBINAR_CONTACT_FORM_URL ??
  "https://forms.gle/GiW6eTATkvYso2726";

/* -------------------- Types -------------------- */
type Webinar = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  speaker: string;
  role: string;
  category: "Upcoming" | "Most Recent" | "Past Webinar";
  image: string;
};

/* -------------------- Data -------------------- */
// Add your images to public/webinars/ (e.g. webinar-1.jpg, webinar-2.jpg, webinar-3.jpg)
const WEBINAR_IMAGES = {
  "1": "/webinars/webinar-1.jpg",
  "2": "/webinars/webinar-2.jpg",
  "3": "/webinars/webinar-3.jpg",
} as const;

const WEBINAR: Webinar[] = [
  {
    id: "1",
    title: "Investment Strategies for 2026",
    description:
      "A deep dive into real estate market trends and how to maximize your portfolio value in the coming year.",
    date: "Feb 22, 2026",
    time: "12:00 PM to 2:00 PM EST",
    speaker: "Prathemesh Mamidwar",
    role: "CoFounder & CEO of Patronage Realtor",
    category: "Upcoming",
    image: WEBINAR_IMAGES["1"],
  },
  {
    id: "2",
    title: "First Home Buying: Myths and Reality",
    description:
      "Get to know how the market works and how to buy your first home.",
    date: "Feb 15, 2026",
    time: "12:00 PM to 2:00 PM EST",
    speaker: "Prathemesh Mamidwar",
    role: "CoFounder & CEO of Patronage Realtor",
    category: "Most Recent",
    image: WEBINAR_IMAGES["2"],
  },
  {
    id: "3",
    title: "Manage finance expertly",
    description:
      "Learn how to optimize home loans, taxes, and personal finance",
    date: "Oct 25, 2025",
    time: "12:00 PM EST",
    speaker: "Harshaditya Kabra",
    role: "Tax Specialist",
    category: "Past Webinar",
    image: WEBINAR_IMAGES["3"],
  },
];

/* -------------------- Animations -------------------- */
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

/* -------------------- Card -------------------- */
function WebinarCard({
  webinar,
  onClick,
}: {
  webinar: Webinar;
  onClick: () => void;
}) {
  const isLive = webinar.category === "Upcoming";

  return (
    <motion.div
      variants={itemVariants}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all hover:shadow-xl cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/20 z-10 group-hover:bg-black/10 transition-colors" />

        <img
          src={webinar.image}
          alt={webinar.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute top-4 left-4 z-20">
          <Badge
            className={
              isLive
                ? "bg-red-500 hover:bg-red-600 animate-pulse"
                : webinar.category === "Upcoming"
                  ? "bg-primary hover:bg-primary/90"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }
          >
            {webinar.category}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Calendar className="h-4 w-4" />
          <span>{webinar.date}</span>
          <span className="mx-1">·</span>
          <Clock className="h-4 w-4" />
          <span>{webinar.time}</span>
        </div>

        <h3 className="text-xl font-heading font-semibold mb-2 group-hover:text-primary transition-colors">
          {webinar.title}
        </h3>

        <p className="text-muted-foreground line-clamp-2 mb-6 flex-1">
          {webinar.description}
        </p>

        <div className="mt-auto pt-6 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">{webinar.speaker}</p>
              <p className="text-xs text-muted-foreground">{webinar.role}</p>
            </div>
          </div>

          <Button variant="ghost" size="icon" className="rounded-full">
            {webinar.category === "Most Recent" ? (
              <PlayCircle className="h-5 w-5" />
            ) : (
              <ArrowRight className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

/* -------------------- Page -------------------- */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Webinar() {
  const [selectedWebinar, setSelectedWebinar] = useState<Webinar | null>(null);
  const [registerPopupOpen, setRegisterPopupOpen] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    contact: "",
  });
  const [registerSubmitted, setRegisterSubmitted] = useState(false);
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState<string | null>(null);
  const [proofUploaded, setProofUploaded] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const onRegisterDialogChange = (open: boolean) => {
    if (!open) {
      setRegisterForm({ name: "", email: "", contact: "" });
      setRegisterSubmitted(false);
      setRegistrationId(null);
      setRegisterError(null);
      setPaymentProofFile(null);
      setPaymentProofPreview(null);
      setProofUploaded(false);
      setUploadError(null);
    }
    setRegisterPopupOpen(open);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);
    const name = registerForm.name.trim();
    const email = registerForm.email.trim();
    const contact = registerForm.contact.trim();
    if (!name) {
      setRegisterError("Name is required.");
      return;
    }
    if (!email) {
      setRegisterError("Email is required.");
      return;
    }
    if (!emailRegex.test(email)) {
      setRegisterError("Please enter a valid email address.");
      return;
    }
    if (!contact) {
      setRegisterError("Contact number is required.");
      return;
    }
    setRegisterLoading(true);
    const result = await insertWebinarRegistration({
      name,
      email,
      contact_number: contact,
    });
    setRegisterLoading(false);
    if (result.success) {
      setRegistrationId(result.id);
      setRegisterSubmitted(true);
    } else {
      setRegisterError(result.error || "Registration failed. Please try again or contact us.");
    }
  };

  const handlePaymentProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setPaymentProofFile(file);
      setPaymentProofPreview(URL.createObjectURL(file));
      setUploadError(null);
    }
  };

  const handleUploadProof = async () => {
    if (!registrationId || !paymentProofFile) return;
    setUploadError(null);
    setUploadLoading(true);
    const result = await uploadWebinarPaymentProof(registrationId, paymentProofFile);
    setUploadLoading(false);
    if (result.success) {
      setProofUploaded(true);
    } else {
      setUploadError(result.error);
    }
  };

  const scrollToRegister = () => {
    setSelectedWebinar(null);
    requestAnimationFrame(() => {
      const el = document.getElementById("webinar-register");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="relative w-full py-20 overflow-hidden">
          {/* 🎥 Background Video */}
          <div className="absolute inset-0 z-0">
            <video
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/Hero/webinar-bg.jpg"
            >
              <source src="/Hero/webinar-bg.mp4" type="video/mp4" />
              <img
                src="/Hero/webinar-bg.jpg"
                alt="Webinar background"
                className="h-full w-full object-cover"
              />
            </video>

            <div className="absolute inset-0 bg-background/80 backdrop-blur-[1px]" />
          </div>

          {/* Content */}
          <div className="container relative z-10 mx-auto px-4">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
            >
              <div className="max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                  Expert Insights & <br />
                  <span className="text-primary">Masterclasses</span>
                </h2>
                <p className="text-lg text-muted-foreground">
                  Join industry leaders as we explore the future of design,
                  ownership, and sustainable living.
                </p>
              </div>

              <Button size="lg" className="hidden md:flex rounded-full">
                View All Events
              </Button>
            </motion.div>

            {/* Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {WEBINAR.map((webinar) => (
                <WebinarCard
                  key={webinar.id}
                  webinar={webinar}
                  onClick={() => setSelectedWebinar(webinar)}
                />
              ))}
            </motion.div>

            {/* Webinar detail popup */}
            <Dialog
              open={selectedWebinar !== null}
              onOpenChange={(open) => {
                if (!open) setSelectedWebinar(null);
              }}
            >
              <DialogContent className="max-w-2xl p-0 overflow-hidden">
                {selectedWebinar && (
                  <>
                    <div className="relative h-48 w-full overflow-hidden">
                      <img
                        src={selectedWebinar.image}
                        alt={selectedWebinar.title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                      <div className="absolute top-4 left-4">
                        <Badge
                          className={
                            selectedWebinar.category === "Upcoming"
                              ? "bg-red-500 hover:bg-red-600"
                              : selectedWebinar.category === "Most Recent"
                                ? "bg-primary"
                                : "bg-secondary text-secondary-foreground"
                          }
                        >
                          {selectedWebinar.category}
                        </Badge>
                      </div>
                    </div>
                    <DialogHeader className="px-6 pt-4 pb-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Calendar className="h-4 w-4" />
                        <span>{selectedWebinar.date}</span>
                        <span className="mx-1">·</span>
                        <Clock className="h-4 w-4" />
                        <span>{selectedWebinar.time}</span>
                      </div>
                      <DialogTitle className="text-2xl font-heading">
                        {selectedWebinar.title}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="px-6 pb-6 space-y-4">
                      <p className="text-muted-foreground">
                        {selectedWebinar.description}
                      </p>
                      <div className="flex items-center gap-3 pt-4 border-t border-border">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{selectedWebinar.speaker}</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedWebinar.role}
                          </p>
                        </div>
                      </div>
                      <Button
                        className="w-full mt-4"
                        size="lg"
                        onClick={() => {
                          if (selectedWebinar.category === "Upcoming") {
                            scrollToRegister();
                          }
                        }}
                      >
                        {selectedWebinar.category === "Most Recent"
                          ? "Watch Recording"
                          : selectedWebinar.category === "Upcoming"
                            ? "Register Now"
                            : "View Details"}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </>
                )}
              </DialogContent>
            </Dialog>

            {/* Registration section — scroll target for Register Now */}
            <div
              id="webinar-register"
              className="mt-16 scroll-mt-24 rounded-2xl border border-border bg-card/80 backdrop-blur p-8 md:p-12 text-center"
            >
              <h3 className="text-2xl md:text-3xl font-heading font-bold mb-2">
                Register for upcoming webinars
              </h3>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Get notified and secure your spot for our next sessions.
              </p>
              <Button
                size="lg"
                className="rounded-full"
                onClick={() => setRegisterPopupOpen(true)}
              >
                Register Now
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>

            {/* Register popup — form first, then QR after submit */}
            <Dialog
              open={registerPopupOpen}
              onOpenChange={onRegisterDialogChange}
            >
              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <DialogTitle>Register for Webinar</DialogTitle>
                </DialogHeader>

                {!registerSubmitted ? (
                  <form onSubmit={handleRegisterSubmit} className="space-y-4 py-2">
                    <p className="text-sm text-muted-foreground">
                      Enter your details below. After submitting, you&apos;ll see
                      the QR code and payment option.
                    </p>
                    <div className="space-y-2">
                      <Label htmlFor="webinar-name">
                        Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="webinar-name"
                        required
                        placeholder="Your full name"
                        value={registerForm.name}
                        onChange={(e) =>
                          setRegisterForm((f) => ({ ...f, name: e.target.value }))
                        }
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="webinar-email">
                        Email <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="webinar-email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={registerForm.email}
                        onChange={(e) =>
                          setRegisterForm((f) => ({ ...f, email: e.target.value }))
                        }
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="webinar-contact">
                        Contact number <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="webinar-contact"
                        type="tel"
                        required
                        placeholder="10-digit mobile number"
                        value={registerForm.contact}
                        onChange={(e) =>
                          setRegisterForm((f) => ({ ...f, contact: e.target.value }))
                        }
                        className="w-full"
                      />
                    </div>
                    {registerError && (
                      <p className="text-sm text-destructive">{registerError}</p>
                    )}
                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={registerLoading}
                    >
                      {registerLoading ? "Submitting…" : "Submit & continue"}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-6 py-2">
                    <p className="text-sm text-muted-foreground">
                      Scan the QR code below to complete payment and get the
                      registration link. We&apos;ll send you reminders and join
                      details before the session.
                    </p>
                    <div className="flex flex-col items-center gap-2">
                      <a
                        href="/webinars/my-qr.png"
                        download="webinar-registration-qr.png"
                        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
                      >
                        <img
                          src="/webinars/my-qr.png"
                          alt="Registration QR code"
                          className="h-48 w-48 object-contain rounded-lg border border-border bg-muted/30 hover:opacity-90 transition-opacity"
                        />
                      </a>
                      <a
                        href="/webinars/my-qr.png"
                        download="webinar-registration-qr.png"
                        className="text-sm text-primary hover:underline font-medium"
                      >
                        Download QR code
                      </a>
                    </div>
                    <p className="text-lg text-center">
                      Registration Fee:{" "}
                      <span className="font-bold">
                        <span className="line-through text-red-500 mr-2">₹499</span>
                        <span className="text-green-600">₹99</span>
                      </span>
                    </p>

                    {/* Payment proof upload — required */}
                    <div className="space-y-2">
                      <Label>
                        Payment proof (screenshot) <span className="text-destructive">*</span>
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Upload a screenshot of your payment to complete your regestration.
                      </p>
                      {!proofUploaded ? (
                        <>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Input
                              id="payment-proof"
                              type="file"
                              accept="image/*"
                              capture="environment"
                              onChange={handlePaymentProofChange}
                              className="cursor-pointer file:mr-2 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-primary-foreground"
                            />
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              onClick={handleUploadProof}
                              disabled={!paymentProofFile || uploadLoading}
                            >
                              {uploadLoading ? (
                                "Uploading…"
                              ) : (
                                <>
                                  <Upload className="h-4 w-4 mr-2" />
                                  Upload
                                </>
                              )}
                            </Button>
                          </div>
                          {paymentProofPreview && (
                            <div className="mt-2">
                              <p className="text-xs text-muted-foreground mb-1">Preview:</p>
                              <img
                                src={paymentProofPreview}
                                alt="Payment proof preview"
                                className="h-24 w-auto rounded border border-border object-contain"
                              />
                            </div>
                          )}
                          {uploadError && (
                            <p className="text-sm text-destructive">{uploadError}</p>
                          )}
                        </>
                      ) : (
                        <p className="flex items-center gap-2 text-sm text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          Payment proof uploaded. Your slot is booked!
                        </p>
                      )}
                    </div>

                    {WEBINAR_PAYMENT_LINK ? (
                      <Button
                        className="w-full"
                        size="lg"
                        asChild
                        disabled={!proofUploaded}
                        title={!proofUploaded ? "Upload payment proof first" : undefined}
                      >
                        <a
                          href={WEBINAR_PAYMENT_LINK}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Pay ₹99 & Register
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </a>
                      </Button>
                    ) : null}
                    {!proofUploaded && (
                      <p className="text-xs text-center text-muted-foreground">
                        Upload your payment screenshot above to enable the payment link.
                      </p>
                    )}

                    <p className="text-xs text-center text-muted-foreground">
                      Can&apos;t scan?{" "}
                      <a
                        href={WEBINAR_CONTACT_FORM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-4 hover:text-primary"
                      >
                        Contact us
                      </a>{" "}
                      for the registration link.
                    </p>
                  </div>
                )}
              </DialogContent>
            </Dialog>

            {/* Mobile CTA */}
            <div className="mt-12 flex md:hidden justify-center">
              <Button size="lg" className="w-full rounded-full">
                View All Events
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
