import { useState } from "react";
import { Menu, MapPin, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Link, useLocation } from "wouter"; // ✅ Import Link
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "../ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation(); // Optional: to style active state

  const navLinkClass =
    "relative px-3 py-2 text-sm font-medium transition-colors hover:text-primary after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <img
            src="/logo/logo-full.png"
            alt="Patronage Realtor"
            className="h-15 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 justify-center">
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
                        href="/#featured-properties"
                        className="flex flex-col rounded-md bg-secondary p-5 hover:bg-secondary/80 transition-colors"
                      >
                        <MapPin className="h-4 w-4 mb-2" />
                        <span className="font-medium">
                          Featured Properties
                        </span>
                        <p className="text-sm text-muted-foreground">
                          Discover premium listings
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/properties"
                        className="flex flex-col rounded-md bg-secondary p-5 hover:bg-secondary/80 transition-colors"
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
                <Link href="/webinars" className={navLinkClass}>
                  Webinars
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/calculators" className={navLinkClass}>
                  Calculators
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/interiors" className={navLinkClass}>
                  Interiors
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/about-us" className={navLinkClass}>
                  About Us
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right Action */}
        <div className="hidden md:flex items-center">
          <Button className="transition-all hover:scale-105 hover:shadow-md">
            Contact Us
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden ml-auto">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
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
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium"
                >
                  Properties
                </Link>
                <Link
                  href="/webinars"
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium"
                >
                  Webinars
                </Link>
                <Link
                  href="/calculators"
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium"
                >
                  Calculators
                </Link>
                <Link
                  href="/interiors"
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium"
                >
                  Interiors
                </Link>
                <Link
                  href="/about-us"
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium"
                >
                  About Us
                </Link>
                <Button className="mt-6 w-full">Contact Us</Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
