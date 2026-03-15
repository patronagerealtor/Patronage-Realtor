import { useState } from "react";
import { Menu, MapPin, Search, User, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { Link, useLocation } from "wouter";
import { useAuth } from "../../hooks/useAuth";
import { useProfile } from "../../hooks/useProfile";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "../ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "../ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";

import { env } from "../../config/env";
const CONTACT_FORM_URL = env.contactFormUrl || "https://forms.gle/oSqrGhasHGWenKNf8";

function parseDataEntryAllowedEmails(): string[] {
  const raw = env.dataEntryAllowedEmail || "";
  if (!raw.trim()) return [];
  return raw.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };
  const { profile } = useProfile(user?.id);
  const dataEntryAllowed = parseDataEntryAllowedEmails();
  const canAccessDataEntry =
    !!user &&
    dataEntryAllowed.length > 0 &&
    dataEntryAllowed.includes((user.email ?? "").trim().toLowerCase());

  const displayName =
    profile?.full_name?.trim() ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email ||
    "—";
  const displayEmail = profile?.email?.trim() || user?.email || "—";
  const displayPhone = profile?.phone?.trim() || "—";

  const navLinkClass =
    "relative px-3 py-2 text-sm font-medium transition-colors hover:text-primary after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full";

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-[65px]">
      <div className="w-full max-w-full mx-auto px-4 h-full flex items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer shrink-0 -ml-0.5" onClick={scrollToTop}>
          <img
            src="/logo/logo-full.png"
            alt="Patronage Realtor"
            className="h-15 w-auto object-contain"
            fetchPriority="high"
            decoding="async"
          />
        </Link>

        {/* Desktop Navigation — visible at 1180px and up */}
        <div className="hidden [@media(min-width:1180px)]:flex flex-1 justify-center">
          <NavigationMenu>
            <NavigationMenuList className="flex gap-6">
              {/* Properties */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent font-medium">
                  Properties
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[600px] md:grid-cols-2">
                    <li>
                      <Link
                        href="/investment"
                        className="flex flex-col rounded-md bg-secondary p-5 hover:bg-secondary/80 transition-colors"
                        onClick={scrollToTop}
                      >
                        <MapPin className="h-4 w-4 mb-2" />
                        <span className="font-medium">
                          Invest
                        </span>
                        <p className="text-sm text-muted-foreground">
                          Grow your money
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/properties"
                        className="flex flex-col rounded-md bg-secondary p-5 hover:bg-secondary/80 transition-colors"
                        onClick={scrollToTop}
                      >
                        <Search className="h-4 w-4 mb-2" />
                        <span className="font-medium">Explore</span>
                        <p className="text-sm text-muted-foreground">
                          Browse all properties
                        </p>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* ✅ FIXED: Path is now '/webinars' (plural) to match mobile and Route */}

              <NavigationMenuItem>
                <Link href="/calculators" className={navLinkClass} onClick={scrollToTop}>
                  Calculators
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/design-studio" className={navLinkClass} onClick={scrollToTop}>
                  Design Studio
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/webinars" className={navLinkClass} onClick={scrollToTop}>
                  Webinars
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/blogs" className={navLinkClass} onClick={scrollToTop}>
                  Blogs
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/about-us" className={navLinkClass} onClick={scrollToTop}>
                  About Us
                </Link>
              </NavigationMenuItem>
              {canAccessDataEntry && (
                <NavigationMenuItem>
                  <Link href="/data-entry" className={navLinkClass} onClick={scrollToTop}>
                    Data Entry
                  </Link>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right Action — visible at 1180px and up */}
        <div className="hidden [@media(min-width:1180px)]:flex items-center gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2" onClick={scrollToTop}>
                  <User className="h-4 w-4" aria-hidden />
                  Profile
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col gap-1.5">
                    <div>
                      <p className="text-xs text-muted-foreground">Name</p>
                      <p className="text-sm font-medium">{displayName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm font-medium break-all">{displayEmail}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="text-sm font-medium">{displayPhone}</p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-destructive focus:text-destructive"
                  onSelect={() => handleLogout()}
                >
                  <LogOut className="h-4 w-4 mr-2" aria-hidden />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login" onClick={scrollToTop}>
                <Button variant="ghost" className="min-h-9 px-4 py-2">
                  Sign in
                </Button>
              </Link>
              <Link href="/login" onClick={scrollToTop}>
                <Button variant="default" className="min-h-9 px-4 py-2">
                  Sign up
                </Button>
              </Link>
            </>
          )}
          <Button
            asChild
            className="transition-all hover:scale-105 hover:shadow-md"
          >
            <a
              href={CONTACT_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={scrollToTop}
            >
              Contact Us
            </a>
          </Button>
        </div>

        {/* Mobile / tablet menu — hamburger visible below 1180px */}
        <div className="flex [@media(min-width:1180px)]:hidden ml-auto">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" onClick={scrollToTop}>
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <SheetTitle className="mb-6 text-xl font-heading">
                Menu
              </SheetTitle>
              <nav className="flex flex-col gap-4">
                <Link
                  href="/properties"
                  onClick={() => { scrollToTop(); setIsOpen(false); }}
                  className="text-lg font-medium"
                >
                  Properties
                </Link>
                <Link
                  href="/investment"
                  onClick={() => { scrollToTop(); setIsOpen(false); }}
                  className="text-lg font-medium"
                >
                  Invest
                </Link>
                <Link
                  href="/calculators"
                  onClick={() => { scrollToTop(); setIsOpen(false); }}
                  className="text-lg font-medium"
                >
                  Calculators
                </Link>
                <Link
                  href="/design-studio"
                  onClick={() => { scrollToTop(); setIsOpen(false); }}
                  className="text-lg font-medium"
                >
                  Design Studio
                </Link>
                <Link
                  href="/webinars"
                  onClick={() => { scrollToTop(); setIsOpen(false); }}
                  className="text-lg font-medium"
                >
                  Webinars
                </Link>
                <Link
                  href="/blogs"
                  onClick={() => { scrollToTop(); setIsOpen(false); }}
                  className="text-lg font-medium"
                >
                  Blogs
                </Link>
                <Link
                  href="/about-us"
                  onClick={() => { scrollToTop(); setIsOpen(false); }}
                  className="text-lg font-medium"
                >
                  About Us
                </Link>
                {canAccessDataEntry && (
                  <Link
                    href="/data-entry"
                    onClick={() => { scrollToTop(); setIsOpen(false); }}
                    className="text-lg font-medium"
                  >
                    Data Entry
                  </Link>
                )}
                {user ? (
                  <>
                    <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
                      <p className="text-xs text-muted-foreground">Name</p>
                      <p className="text-sm font-medium">{displayName}</p>
                      <p className="text-xs text-muted-foreground mt-2">Email</p>
                      <p className="text-sm font-medium break-all">{displayEmail}</p>
                      <p className="text-xs text-muted-foreground mt-2">Phone</p>
                      <p className="text-sm font-medium">{displayPhone}</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full gap-2"
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4" aria-hidden />
                      Log out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => { scrollToTop(); setIsOpen(false); }}>
                      <Button variant="outline" size="sm" className="w-full">
                        Sign in
                      </Button>
                    </Link>
                    <Link href="/login" onClick={() => { scrollToTop(); setIsOpen(false); }}>
                      <Button variant="default" size="sm" className="w-full">
                        Sign up
                      </Button>
                    </Link>
                  </>
                )}
                <Button asChild className="mt-6 w-full">
                  <a
                    href={CONTACT_FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => { scrollToTop(); setIsOpen(false); }}
                  >
                    Contact Us
                  </a>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}